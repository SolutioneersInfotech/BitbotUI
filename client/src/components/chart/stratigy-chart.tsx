import React, { useEffect, useRef, useState } from "react";
import {
    createChart,
    ColorType,
    CandlestickSeries,
    LineSeries,
    HistogramSeries,
    type UTCTimestamp,
} from "lightweight-charts";

import { Card, CardContent } from "@/components/ui/card";
import { TimeframeSelector } from "./TimeframeSelector";
import { IndicatorToggleBar } from "./IndicatorToggleBar";
import { fetchIndicatorSeries } from "@/hooks/useIndicatorSeries";

interface Candle {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
}

const toSec = (ms: number): UTCTimestamp => Math.floor(ms / 1000) as UTCTimestamp;

const Chart: React.FC<{ strategy: string | null; symbol: string }> = ({ strategy, symbol }) => {
    const priceChartRef = useRef<HTMLDivElement>(null);
    const rsiChartRef = useRef<HTMLDivElement>(null);
    const macdChartRef = useRef<HTMLDivElement>(null);

    const [timeframe, setTimeframe] = useState("1d");
    const [loading, setLoading] = useState(false);

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
        rsi: true,
        macd: true,
        sma50: true,
        ema20: true,
        bbands: false,
    });

    // -------------------------------------------------------------------
    // Load indicator data into state (optional use, for debugging/UI)
    // -------------------------------------------------------------------
    const [indicatorSeriesData, setIndicatorSeriesData] = useState<any>(null);

    useEffect(() => {
        async function loadIndicators() {
            if (!symbol) return;

            try {
                const data = await fetchIndicatorSeries(symbol, timeframe, [
                    "sma",
                    "ema",
                    "bb",
                    "macd",
                    "rsi",
                ]);
                setIndicatorSeriesData(data);
            } catch (error) {
                console.error("Indicator fetch error:", error);
            }
        }

        loadIndicators();
    }, [symbol, timeframe]);

    // -------------------------------------------------------------------
    // Main chart rendering effect
    // -------------------------------------------------------------------
    useEffect(() => {
        if (!priceChartRef.current || !symbol) return;

        // Clear containers
        priceChartRef.current.innerHTML = "";
        if (rsiChartRef.current) rsiChartRef.current.innerHTML = "";
        if (macdChartRef.current) macdChartRef.current.innerHTML = "";

        let cancelled = false;

        // Refs for rsi & macd charts for cleanup & resize
        let rsiChart: any = null;
        let macdChart: any = null;

        // ----------------------------------------------------------
        // 1. CREATE PRICE CHART
        // ----------------------------------------------------------
        const priceChart = createChart(priceChartRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: "#0f172a" },
                textColor: "#fff",
            },
            width: priceChartRef.current.clientWidth,
            height: 600,
            timeScale: { timeVisible: true },
        });

        const candleSeries = priceChart.addSeries(CandlestickSeries, {
            upColor: "#16a34a",
            downColor: "#dc2626",
            borderVisible: false,
            wickUpColor: "#16a34a",
            wickDownColor: "#dc2626",
        });

        // ------ ResizeObserver for responsiveness ------
        const resizeObserver = new ResizeObserver(() => {
            try {
                if (priceChartRef.current) {
                    priceChart.applyOptions({ width: priceChartRef.current.clientWidth });
                }
                if (rsiChartRef.current && rsiChart) {
                    rsiChart.applyOptions({ width: rsiChartRef.current.clientWidth });
                }
                if (macdChartRef.current && macdChart) {
                    macdChart.applyOptions({ width: macdChartRef.current.clientWidth });
                }
            } catch {}
        });

        resizeObserver.observe(priceChartRef.current);

        if (rsiChartRef.current) resizeObserver.observe(rsiChartRef.current);
        if (macdChartRef.current) resizeObserver.observe(macdChartRef.current);

        // ----------------------------------------------------------
        // LOAD DATA FUNCTION
        // ----------------------------------------------------------

        async function load() {
            try {
                setLoading(true);

                const interval = intervalMap[timeframe];
                const token = localStorage.getItem("token");

                // 1) Fetch candles
                const res = await fetch(
                    `https://predator-production.up.railway.app/api/strategy/candles/${symbol}?interval=${interval}&limit=500`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

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

                // 2) Fetch indicators (use THIS immediately, not indicatorSeriesData)
                const enabled = Object.keys(indicatorToggles).filter((k) => indicatorToggles[k]);
                const indicators = await fetchIndicatorSeries(symbol, interval, enabled as any);
                if (cancelled) return;

                const timestamps = indicators.timestamps ?? [];

                // ----------------------------------------------------------
                // 3. OVERLAYS (SMA, EMA, BB)
                // ----------------------------------------------------------

                if (indicatorToggles.sma50 && indicators.sma) {
                    const smaSeries = priceChart.addSeries(LineSeries, {
                        color: "#4caf50",
                        lineWidth: 2,
                    });

                    smaSeries.setData(
                        indicators.sma
                            .map((v: any, i: number) =>
                                v == null ? null : { time: toSec(timestamps[i]), value: v }
                            )
                            .filter(Boolean)
                    );
                }

                if (indicatorToggles.ema20 && indicators.ema) {
                    const emaSeries = priceChart.addSeries(LineSeries, {
                        color: "#ff9800",
                        lineWidth: 2,
                    });

                    emaSeries.setData(
                        indicators.ema
                            .map((v: any, i: number) =>
                                v == null ? null : { time: toSec(timestamps[i]), value: v }
                            )
                            .filter(Boolean)
                    );
                }

                if (indicatorToggles.bbands && indicators.bb) {
                    const upper = priceChart.addSeries(LineSeries, {
                        color: "#90caf9",
                        lineWidth: 1,
                    });
                    const middle = priceChart.addSeries(LineSeries, {
                        color: "#42a5f5",
                        lineWidth: 1,
                    });
                    const lower = priceChart.addSeries(LineSeries, {
                        color: "#90caf9",
                        lineWidth: 1,
                    });

                    upper.setData(
                        indicators.bb
                            .map((b: any, i: number) =>
                                b?.upper == null ? null : { time: toSec(timestamps[i]), value: b.upper }
                            )
                            .filter(Boolean)
                    );

                    middle.setData(
                        indicators.bb
                            .map((b: any, i: number) =>
                                b?.middle == null ? null : { time: toSec(timestamps[i]), value: b.middle }
                            )
                            .filter(Boolean)
                    );

                    lower.setData(
                        indicators.bb
                            .map((b: any, i: number) =>
                                b?.lower == null ? null : { time: toSec(timestamps[i]), value: b.lower }
                            )
                            .filter(Boolean)
                    );
                }

                // ----------------------------------------------------------
                // 4. RSI PANEL
                // ----------------------------------------------------------
                if (indicatorToggles.rsi && indicators.rsi && rsiChartRef.current) {
                    rsiChart = createChart(rsiChartRef.current, {
                        layout: {
                            background: { type: ColorType.Solid, color: "#0f172a" },
                            textColor: "#fff",
                        },
                        width: rsiChartRef.current.clientWidth,
                        height: 160,
                    });

                    const rsiSeries = rsiChart.addSeries(LineSeries, {
                        color: "#f50057",
                        lineWidth: 2,
                    });

                    rsiSeries.setData(
                        indicators.rsi
                            .map((v: any, i: number) =>
                                v == null ? null : { time: toSec(timestamps[i]), value: v }
                            )
                            .filter(Boolean)
                    );
                }

                // ----------------------------------------------------------
                // 5. MACD PANEL
                // ----------------------------------------------------------
                if (indicatorToggles.macd && indicators.macd && macdChartRef.current) {
                    macdChart = createChart(macdChartRef.current, {
                        layout: {
                            background: { type: ColorType.Solid, color: "#0f172a" },
                            textColor: "#fff",
                        },
                        width: macdChartRef.current.clientWidth,
                        height: 180,
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
                            .map((v: any, i: number) =>
                                v == null ? null : { time: toSec(timestamps[i]), value: v }
                            )
                            .filter(Boolean)
                    );

                    signalLine.setData(
                        indicators.macd.signal
                            .map((v: any, i: number) =>
                                v == null ? null : { time: toSec(timestamps[i]), value: v }
                            )
                            .filter(Boolean)
                    );

                    histSeries.setData(
                        indicators.macd.hist
                            .map((v: any, i: number) =>
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
                }
            } catch (err) {
                console.error("Chart error:", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();

        // Cleanup
        return () => {
            cancelled = true;
            try {
                resizeObserver.disconnect();
            } catch {}

            try { priceChart.remove(); } catch {}
            try { rsiChart?.remove(); } catch {}
            try { macdChart?.remove(); } catch {}
        };
    }, [symbol, timeframe, indicatorToggles]);

    return (
        <Card className="bg-trading-card border-gray-700">
            <div className="flex items-center justify-between border-b border-gray-700 px-4 py-3">
                <h2 className="text-lg font-semibold text-white">
                    Price Chart — {symbol}
                </h2>

                <div className="flex items-center space-x-4">
                    <TimeframeSelector timeframe={timeframe} setTimeframe={setTimeframe} />
                    <IndicatorToggleBar
                        toggles={indicatorToggles}
                        setToggles={setIndicatorToggles}
                    />
                </div>
            </div>

            <CardContent>
                <div className="relative">
                    <div
                        ref={priceChartRef}
                        style={{ width: "100%", height: "600px" }}
                    />

                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded">
                            <div className="animate-spin h-10 w-10 rounded-full border-4 border-gray-600 border-t-emerald-500" />
                        </div>
                    )}
                </div>

                {indicatorToggles.rsi && (
                    <div
                        ref={rsiChartRef}
                        style={{ width: "100%", height: "160px", marginTop: 12 }}
                    />
                )}

                {indicatorToggles.macd && (
                    <div
                        ref={macdChartRef}
                        style={{ width: "100%", height: "180px", marginTop: 12 }}
                    />
                )}
            </CardContent>
        </Card>
    );
};

export default Chart;
