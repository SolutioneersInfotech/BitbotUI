import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
  CrosshairMode,
  type UTCTimestamp,
} from "lightweight-charts";

import { Card, CardContent } from "@/components/ui/card";
import { TimeframeSelector } from "./TimeframeSelector";
import { IndicatorToggleBar } from "./IndicatorToggleBar";
import { fetchIndicatorSeries } from "@/hooks/useIndicatorSeries";
import { INDICATOR_CONFIG } from "@/types/chart-types";
import {
  detectRsiDivergence,
  getMacdState,
  getRsiState,
} from "@/lib/chartHelper";
import { BASE_API_URL } from "@/config";

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

function getAdxStrengthLabel(adx: number) {
  if (adx < 20) return "Weak / No Trend";
  if (adx < 25) return "Emerging";
  if (adx < 40) return "Strong";
  if (adx < 60) return "Very Strong";
  return "Extreme";
}

function getAtrVolatilityLabel(atr: number, close: number) {
  const atrPct = (atr / close) * 100;

  if (atrPct < 0.5) return "Very Low";
  if (atrPct < 1.0) return "Low";
  if (atrPct < 2.0) return "Moderate";
  if (atrPct < 3.5) return "High";
  return "Extreme";
}

const toSec = (ms: number): UTCTimestamp =>
  Math.floor(ms / 1000) as UTCTimestamp;

const Chart: React.FC<{
  strategy: string | null;
  symbol: string;
  showIndicators?: boolean;
  timeframe?: string;
  onTimeframeChange?: (tf: string) => void;
}> = ({ symbol, showIndicators = false, timeframe, onTimeframeChange }) => {
  const priceChartRef = useRef<HTMLDivElement>(null);
  const rsiChartRef = useRef<HTMLDivElement>(null);
  const macdChartRef = useRef<HTMLDivElement>(null);
  const adxChartRef = useRef<HTMLDivElement>(null);
  const atrChartRef = useRef<HTMLDivElement>(null);
  const priceTooltipRef = useRef<HTMLDivElement | null>(null);
  const rsiTooltipRef = useRef<HTMLDivElement>(null);
  const macdTooltipRef = useRef<HTMLDivElement | null>(null);
  const adxTooltipRef = useRef<HTMLDivElement | null>(null);
  const atrTooltipRef = useRef<HTMLDivElement | null>(null);
  const candleCloseByTimeRef = useRef<Map<number, number>>(new Map());
  const [internalTimeframe, setInternalTimeframe] = useState("1d");
  const [loading, setLoading] = useState(false);

  const selectedTimeframe = timeframe ?? internalTimeframe;

  const intervalMap: Record<string, string> = {
    "1m": "1m",
    "5m": "5m",
    "15m": "15m",
    "1h": "1h",
    "4h": "4h",
    "1d": "1d",
    "1w": "1w",
  };

  const [indicatorToggles, setIndicatorToggles] = useState({
    rsi: false,
    macd: false,
    sma: false,
    ema: false,
    bbands: false,
    adx: false,
    atr: false,
  });

  const overlaySeriesRef = useRef<{
    sma?: any;
    emaFast?: any;
    emaSlow?: any;
    bbUpper?: any;
    bbMiddle?: any;
    bbLower?: any;
  }>({});

  // Auto-disable heavy indicators on 1m
  useEffect(() => {
    if (selectedTimeframe === "1m") {
      setIndicatorToggles((t) => ({ ...t, bbands: false }));
    }
  }, [selectedTimeframe]);

  // ----------------------------------------------------------
  // MAIN EFFECT
  // ----------------------------------------------------------
  useEffect(() => {
    if (!priceChartRef.current || !symbol) return;

    priceChartRef.current.innerHTML = "";
    rsiChartRef.current && (rsiChartRef.current.innerHTML = "");
    macdChartRef.current && (macdChartRef.current.innerHTML = "");
    adxChartRef.current && (adxChartRef.current.innerHTML = "");
    atrChartRef.current && (atrChartRef.current.innerHTML = "");

    let cancelled = false;

    let rsiChart: any = null;
    let macdChart: any = null;
    let adxChart: any = null;
    let atrChart: any = null;

    const priceChart = createChart(priceChartRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#0f172a" },
        textColor: "#fff",
      },
      width: priceChartRef.current.clientWidth,
      height: 600,
      timeScale: { timeVisible: true },
      // ✅ REQUIRED — otherwise seriesPrices is undefined
      crosshair: {
        mode: CrosshairMode.Normal,
      },

      // ✅ REQUIRED — v5 bug without this
      rightPriceScale: {
        visible: true,
      },
    });

    const candleSeries = priceChart.addSeries(CandlestickSeries, {
      upColor: "#16a34a",
      downColor: "#dc2626",
      borderVisible: false,
      wickUpColor: "#16a34a",
      wickDownColor: "#dc2626",
    });

    const resizeObserver = new ResizeObserver(() => {
      priceChart.applyOptions({
        width: priceChartRef.current!.clientWidth,
      });
      rsiChart?.applyOptions({ width: rsiChartRef.current!.clientWidth });
      macdChart?.applyOptions({ width: macdChartRef.current!.clientWidth });
      adxChart?.applyOptions({ width: adxChartRef.current!.clientWidth });
      atrChart?.applyOptions({ width: atrChartRef.current!.clientWidth });
    });

    resizeObserver.observe(priceChartRef.current);

    async function load() {
      try {
        setLoading(true);

        const interval = intervalMap[selectedTimeframe];
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${BASE_API_URL}/strategy/candles/${symbol}?interval=${interval}&limit=500`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch candles");
        }

        const data = await res.json();
        if (cancelled) return;

        const candles: Candle[] = data.candles ?? [];

        candleSeries.setData(
          candles.map((c) => ({
            time: toSec(c.time),
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
          }))
        );

        candleCloseByTimeRef.current.clear();

        candles.forEach((c) => {
          candleCloseByTimeRef.current.set(toSec(c.time), c.close);
        });

        const enabled = Object.keys(indicatorToggles).filter(
          (k) => indicatorToggles[k as keyof typeof indicatorToggles]
        );

        const cfg = INDICATOR_CONFIG[selectedTimeframe];
        const indicators = await fetchIndicatorSeries(
          symbol,
          interval,
          enabled,
          {
            rsiPeriod: cfg.rsiPeriod,
            emaFast: cfg.emaFast,
            emaSlow: cfg.emaSlow,
            macdFast: cfg.macdFast,
            macdSlow: cfg.macdSlow,
            macdSignal: cfg.macdSignal,
            adxPeriod: cfg.adxPeriod,
            atrPeriod: cfg.atrPeriod,
          }
        );

        const timestamps = indicators.timestamps;

        // ================= SMA =================
        if (indicatorToggles.sma && indicators.sma) {
          const smaSeries = priceChart.addSeries(LineSeries, {
            color: "#4caf50",
            lineWidth: 2,
          });

          smaSeries.setData(
            indicators.sma
              .map((v: number | null, i: number) =>
                v == null ? null : { time: toSec(timestamps[i]), value: v }
              )
              .filter(Boolean)
          );

          overlaySeriesRef.current.sma = smaSeries;
        }

        // ================= EMA (FAST + SLOW) =================
        if (indicatorToggles.ema && indicators.emaFast && indicators.emaSlow) {
          const emaFastSeries = priceChart.addSeries(LineSeries, {
            color: "#ff9800", // fast EMA
            lineWidth: 2,
          });

          const emaSlowSeries = priceChart.addSeries(LineSeries, {
            color: "#03a9f4", // slow EMA
            lineWidth: 2,
          });

          emaFastSeries.setData(
            indicators.emaFast
              .map((v: number | null, i: number) =>
                v == null ? null : { time: toSec(timestamps[i]), value: v }
              )
              .filter(Boolean)
          );

          emaSlowSeries.setData(
            indicators.emaSlow
              .map((v: number | null, i: number) =>
                v == null ? null : { time: toSec(timestamps[i]), value: v }
              )
              .filter(Boolean)
          );

          overlaySeriesRef.current.emaFast = emaFastSeries;
          overlaySeriesRef.current.emaSlow = emaSlowSeries;
        }

        // ================= BOLLINGER BANDS =================
        if (indicatorToggles.bbands && indicators.bb) {
          const upperBand = priceChart.addSeries(LineSeries, {
            color: "#90caf9",
            lineWidth: 1,
          });

          const middleBand = priceChart.addSeries(LineSeries, {
            color: "#42a5f5",
            lineWidth: 1,
          });

          const lowerBand = priceChart.addSeries(LineSeries, {
            color: "#90caf9",
            lineWidth: 1,
          });

          upperBand.setData(
            indicators.bb
              .map((b: any, i: number) =>
                b?.upper == null
                  ? null
                  : { time: toSec(timestamps[i]), value: b.upper }
              )
              .filter(Boolean)
          );

          middleBand.setData(
            indicators.bb
              .map((b: any, i: number) =>
                b?.middle == null
                  ? null
                  : { time: toSec(timestamps[i]), value: b.middle }
              )
              .filter(Boolean)
          );

          lowerBand.setData(
            indicators.bb
              .map((b: any, i: number) =>
                b?.lower == null
                  ? null
                  : { time: toSec(timestamps[i]), value: b.lower }
              )
              .filter(Boolean)
          );

          overlaySeriesRef.current.bbUpper = upperBand;
          overlaySeriesRef.current.bbMiddle = middleBand;
          overlaySeriesRef.current.bbLower = lowerBand;
        }

        // ---------------- RSI ----------------
        let rsiSeries: any = null;
        if (indicatorToggles.rsi && indicators.rsi) {
          rsiChart = createChart(rsiChartRef.current!, {
            height: 160,
            layout: {
              background: { color: "#0f172a" },
              textColor: "#fff",
            },
            rightPriceScale: {
              borderColor: "#334155",
            },
            timeScale: {
              rightBarStaysOnScroll: true,
              rightOffset: 4,
            },
          });

          rsiSeries = rsiChart.addSeries(LineSeries, {
            color: "#f50057",
            lineWidth: 2,
          });

          rsiSeries.setData(
            indicators.rsi
              .map((v: number | null, i: number) =>
                v == null ? null : { time: toSec(timestamps[i]), value: v }
              )
              .filter(Boolean)
          );
          const rsiPoints = indicators.rsi
            .map((v, i) =>
              v == null
                ? null
                : {
                    value: v,
                    time: toSec(timestamps[i]),
                    close: candles[i]?.close,
                  }
            )
            .filter(Boolean) as {
            value: number;
            time: number;
            close: number;
          }[];

          const closeValues = candles.map((c) => c.close);

          const divergence = detectRsiDivergence({
            rsi: rsiPoints.map((p) => p.value),
            timestamps: rsiPoints.map((p) => p.time),
            closes: rsiPoints.map((p) => p.close),
          });

          console.log("divergence", divergence);

          if (divergence) {
            const divergenceSeries = rsiChart.addSeries(LineSeries, {
              color: divergence.type === "bullish" ? "#22c55e" : "#ef4444",
              lineWidth: 2,
              lineStyle: 2, // dashed
            });

            divergenceSeries.setData([
              {
                time: divergence.from.time,
                value: divergence.from.value,
              },
              {
                time: divergence.to.time,
                value: divergence.to.value,
              },
            ]);

            // ✅ Price line MUST be on the SERIES
            rsiSeries.createPriceLine({
              price: divergence.to.value,
              color: divergence.type === "bullish" ? "#22c55e" : "#ef4444",
              lineWidth: 1,
              lineStyle: 2,
              axisLabelVisible: true,
              title:
                divergence.type === "bullish" ? "Bullish Div" : "Bearish Div",
            });
          }

          // 🔹 RSI reference lines (30 / 70)
          rsiChart
            .addSeries(LineSeries, {
              color: "rgba(255,255,255,0.25)",
              lineWidth: 1,
            })
            .setData(timestamps.map((t) => ({ time: toSec(t), value: 70 })));

          rsiChart
            .addSeries(LineSeries, {
              color: "rgba(255,255,255,0.25)",
              lineWidth: 1,
            })
            .setData(timestamps.map((t) => ({ time: toSec(t), value: 30 })));
        }

        // ---------------- MACD ----------------
        if (indicatorToggles.macd && indicators.macd) {
          macdChart = createChart(macdChartRef.current!, {
            height: 180,
            layout: { background: { color: "#0f172a" }, textColor: "#fff" },
            rightPriceScale: { visible: true },
          });

          const macdLine = macdChart.addSeries(LineSeries, {
            color: "#26a69a",
            lineWidth: 2,
          });

          const signalLine = macdChart.addSeries(LineSeries, {
            color: "#ef5350",
            lineWidth: 2,
          });

          const histSeries = macdChart.addSeries(HistogramSeries, {
            base: 0,
          });

          macdLine.setData(
            indicators.macd.macd
              .map((v: number, i: number) =>
                v == null ? null : { time: toSec(timestamps[i]), value: v }
              )
              .filter(Boolean)
          );

          signalLine.setData(
            indicators.macd.signal
              .map((v: number, i: number) =>
                v == null ? null : { time: toSec(timestamps[i]), value: v }
              )
              .filter(Boolean)
          );

          histSeries.setData(
            indicators.macd.hist
              .map((v: number, i: number) =>
                v == null
                  ? null
                  : {
                      time: toSec(timestamps[i]),
                      value: v,
                      color: v >= 0 ? "#16a34a" : "#dc2626",
                    }
              )
              .filter(Boolean)
          );

          // ---------------- MACD TOOLTIP ----------------
          macdChart.subscribeCrosshairMove((param) => {
            const tooltip = macdTooltipRef.current;
            if (!tooltip || !param.point || !param.time) {
              tooltip.style.display = "none";
              return;
            }

            const prices = (param as any).seriesData as Map<any, any>;
            if (!prices) return;

            const macdVal = prices.get(macdLine)?.value;
            const signalVal = prices.get(signalLine)?.value;
            const histVal = prices.get(histSeries)?.value;

            if (macdVal == null || signalVal == null || histVal == null) {
              tooltip.style.display = "none";
              return;
            }

            const macdState = getMacdState(macdVal, signalVal, histVal);

            tooltip.innerHTML = `
  <div class="font-semibold mb-2 text-white">
    MACD (${cfg.macdFast}, ${cfg.macdSlow}, ${cfg.macdSignal})
  </div>

  <div style="color:#26a69a">
    MACD: ${macdVal.toFixed(2)}
  </div>

  <div style="color:#ef5350">
    Signal: ${signalVal.toFixed(2)}
  </div>

  <div style="color:${histVal >= 0 ? "#16a34a" : "#dc2626"}">
    Histogram: ${histVal.toFixed(2)}
  </div>

  <div class="text-gray-400 text-[10px] mt-2">
    Direction:
    <span class="text-white ml-1">${macdState.direction}</span>
  </div>

  <div class="text-gray-400 text-[10px]">
    Momentum:
    <span class="text-white ml-1">${macdState.momentum}</span>
  </div>

  <div class="text-gray-400 text-[10px]">
    State:
    <span class="text-white ml-1">${macdState.condition}</span>
  </div>
`;

            tooltip.style.display = "block";
            tooltip.style.left = `${param.point.x + 12}px`;
            tooltip.style.top = `${param.point.y + 12}px`;
          });
        }

        // ---------------- ADX ----------------
        let adxSeries: any = null;

        if (indicatorToggles.adx && indicators.adx) {
          adxChart = createChart(adxChartRef.current!, {
            height: 140,
            layout: { background: { color: "#0f172a" }, textColor: "#fff" },
            rightPriceScale: { visible: true },
            timeScale: { visible: true,rightOffset: 4 },

            crosshair: {
              mode: CrosshairMode.Normal,
            },
          });

          adxSeries = adxChart.addSeries(LineSeries, {
            color: "#ffeb3b",
            lineWidth: 2,
          });

          adxSeries.setData(
            indicators.adx
              .map((v: number, i: number) =>
                v == null ? null : { time: toSec(timestamps[i]), value: v }
              )
              .filter(Boolean)
          );
        }

        // ---------------- ATR ----------------
        let atrSeries: any = null;

        if (indicatorToggles.atr && indicators.atr) {
          atrChart = createChart(atrChartRef.current!, {
            height: 140,
            layout: { background: { color: "#0f172a" }, textColor: "#fff" },
            rightPriceScale: { visible: true },
            timeScale: { visible: true,rightOffset: 1 },
            crosshair: {
              mode: CrosshairMode.Normal,
            },
          });

          atrSeries = atrChart.addSeries(LineSeries, {
            color: "#03a9f4",
            lineWidth: 2,
          });

          atrSeries.setData(
            indicators.atr
              .map((v: number, i: number) =>
                v == null ? null : { time: toSec(timestamps[i]), value: v }
              )
              .filter(Boolean)
          );
        }

        priceChart.subscribeCrosshairMove((param) => {
          const tooltip = priceTooltipRef.current;
          if (!tooltip || !param.time) {
            tooltip.style.display = "none";
            return;
          }

          // ✅ correct property for v4+
          const prices = (param as any).seriesData as Map<any, any>;
          if (!prices || prices.size === 0) {
            tooltip.style.display = "none";
            return;
          }

          const lines: string[] = [];
          const { sma, emaFast, emaSlow, bbUpper, bbMiddle, bbLower } =
            overlaySeriesRef.current;

          if (sma && prices.get(sma))
            lines.push(`SMA: ${prices.get(sma).value.toFixed(2)}`);

          if (emaFast && prices.get(emaFast))
            lines.push(
              `EMA ${cfg.emaFast}: ${prices.get(emaFast).value.toFixed(2)}`
            );

          if (emaSlow && prices.get(emaSlow))
            lines.push(
              `EMA ${cfg.emaSlow}: ${prices.get(emaSlow).value.toFixed(2)}`
            );

          if (bbUpper && prices.get(bbUpper))
            lines.push(`BB Upper: ${prices.get(bbUpper).value.toFixed(2)}`);

          if (bbMiddle && prices.get(bbMiddle))
            lines.push(`BB Mid: ${prices.get(bbMiddle).value.toFixed(2)}`);

          if (bbLower && prices.get(bbLower))
            lines.push(`BB Lower: ${prices.get(bbLower).value.toFixed(2)}`);

          if (!lines.length) {
            tooltip.style.display = "none";
            return;
          }

          tooltip.innerHTML = lines.join("<br/>");
          tooltip.style.display = "block";
          tooltip.style.left = `${param.point!.x + 12}px`;
          tooltip.style.top = `${param.point!.y + 12}px`;
        });

        if (rsiChart) {
          rsiChart.subscribeCrosshairMove((param) => {
            const tooltip = rsiTooltipRef.current;
            if (!tooltip || !param.time || !param.point) {
              tooltip.style.display = "none";
              return;
            }

            const prices = (param as any).seriesData as Map<any, any>;
            const rsiPoint = prices?.get(rsiSeries);

            if (!rsiPoint) {
              tooltip.style.display = "none";
              return;
            }

            const rsiValue = rsiPoint.value;
            const rsiState = getRsiState(rsiValue);

            tooltip.innerHTML = `
  <div class="font-semibold text-pink-400 mb-1">
    RSI (${cfg.rsiPeriod})
  </div>

  <div>
    Value:
    <span class="text-white ml-1">${rsiValue.toFixed(2)}</span>
    ${
      rsiState
        ? `<span class="ml-2" style="color:${rsiState.color}">
             (${rsiState.label})
           </span>`
        : ""
    }
  </div>
`;

            tooltip.style.display = "block";
            tooltip.style.left = `${param.point.x + 10}px`;
            tooltip.style.top = `${param.point.y + 10}px`;
          });
        }

        if (adxChart) {
          adxChart.subscribeCrosshairMove((param) => {
            const tooltip = adxTooltipRef.current;
            if (!tooltip || !param.point || !param.time) {
              tooltip.style.display = "none";
              return;
            }

            const prices = (param as any).seriesData as Map<any, any>;
            const adxPoint = prices?.get(adxSeries);

            if (!adxPoint) {
              tooltip.style.display = "none";
              return;
            }

            tooltip.innerHTML = `
        <div class="font-semibold text-yellow-300 mb-1">
            ADX (${cfg.adxPeriod})
        </div>
        <div>Value: ${adxPoint.value.toFixed(2)}</div>
        <div class="text-gray-400 text-[10px] mt-1">
      Trend Strength:
      <span class="text-white ml-1">${getAdxStrengthLabel(
        adxPoint.value
      )}</span>
    </div>
    `;

            tooltip.style.display = "block";
            tooltip.style.left = `${param.point.x + 10}px`;
            tooltip.style.top = `${param.point.y + 10}px`;
          });
        }

        if (atrChart) {
          atrChart.subscribeCrosshairMove((param) => {
            const tooltip = atrTooltipRef.current;
            if (!tooltip || !param.point || !param.time) {
              tooltip.style.display = "none";
              return;
            }

            const prices = (param as any).seriesData as Map<any, any>;
            if (!prices) {
              tooltip.style.display = "none";
              return;
            }
            const atrPoint = prices.get(atrSeries);
            if (!atrPoint) {
              tooltip.style.display = "none";
              return;
            }

            // 🔑 GET CLOSE PRICE BY TIME
            const time = param.time as number;
            const closePrice = candleCloseByTimeRef.current.get(time);

            if (!closePrice) {
              tooltip.style.display = "none";
              return;
            }

            const atrValue = atrPoint.value;
            const atrPct = ((atrValue / closePrice) * 100).toFixed(2);
            const volatilityLabel = getAtrVolatilityLabel(atrValue, closePrice);

            tooltip.innerHTML = `
    <div class="font-semibold text-sky-400 mb-1">
      ATR (${cfg.atrPeriod})
    </div>

    <div>
      Value: <span class="text-white">${atrValue.toFixed(2)}</span>
    </div>

    <div class="text-gray-400 text-[10px] mt-1">
      Volatility:
      <span class="text-white ml-1">${volatilityLabel}</span>
      <span class="ml-1">(${atrPct}%)</span>
    </div>
  `;

            tooltip.style.display = "block";
            tooltip.style.left = `${param.point.x + 10}px`;
            tooltip.style.top = `${param.point.y + 10}px`;
          });
        }
      } catch (err) {
        console.error("Chart error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
      resizeObserver.disconnect();
      priceChart.remove();
      rsiChart?.remove();
      macdChart?.remove();
      adxChart?.remove();
      atrChart?.remove();
    };
  }, [symbol, selectedTimeframe, indicatorToggles]);

  const handleTimeframeChange = (nextTimeframe: string) => {
    if (timeframe) {
      onTimeframeChange?.(nextTimeframe);
    } else {
      setInternalTimeframe(nextTimeframe);
    }
  };

  return (
    <Card className="bg-trading-card border-gray-700">
      <div className="flex items-center justify-between border-b border-gray-700 px-4 py-3">
        <h2 className="text-lg font-semibold text-white">
          Price Chart — {symbol}
        </h2>

        <div className="flex items-center space-x-4">
          <TimeframeSelector
            timeframe={selectedTimeframe}
            setTimeframe={handleTimeframeChange}
          />
          {showIndicators && (
            <IndicatorToggleBar
              toggles={indicatorToggles}
              setToggles={setIndicatorToggles}
              timeframe={selectedTimeframe}
            />
          )}
        </div>
      </div>

      <CardContent>
        <div className="relative">
          <div ref={priceChartRef} style={{ width: "100%", height: "600px" }} />
          {/* Hover Tooltip */}
          <div
            ref={priceTooltipRef}
            className="pointer-events-none absolute hidden bg-black/80 text-xs text-gray-200 rounded-md p-3 border border-gray-700 shadow-lg z-50"
          />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="animate-spin h-10 w-10 rounded-full border-4 border-gray-600 border-t-emerald-500" />
            </div>
          )}
        </div>

        {indicatorToggles.rsi && (
          <div className="relative mt-3">
            <div ref={rsiChartRef} className="h-[160px]" />
            <div
              ref={rsiTooltipRef}
              className="pointer-events-none absolute hidden bg-black/80 text-xs text-gray-200 rounded-md px-3 py-2 border border-gray-700 shadow-lg z-50"
            />
          </div>
        )}

        {indicatorToggles.macd && (
          <div className="relative mt-3">
            <div ref={macdChartRef} className="h-[180px]" />

            <div
              ref={macdTooltipRef}
              className="pointer-events-none absolute hidden bg-black/80
                       text-xs text-gray-200 rounded-md p-2
                       border border-gray-700 shadow-lg z-50"
            />
          </div>
        )}

        {indicatorToggles.adx && (
          <div className="relative mt-3">
            <div ref={adxChartRef} className="h-[140px]" />
            <div
              ref={adxTooltipRef}
              className="pointer-events-none absolute hidden
                 bg-black/80 text-xs text-gray-200
                 rounded-md px-3 py-2
                 border border-gray-700 shadow-lg z-50"
            />
          </div>
        )}

        {indicatorToggles.atr && (
          <div className="relative mt-3">
            <div ref={atrChartRef} className="h-[140px]" />
            <div
              ref={atrTooltipRef}
              className="pointer-events-none absolute hidden
                 bg-black/80 text-xs text-gray-200
                 rounded-md px-3 py-2
                 border border-gray-700 shadow-lg z-50"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Chart;
