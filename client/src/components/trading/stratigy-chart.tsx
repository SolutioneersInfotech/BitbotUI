import React, { useEffect, useRef, useState } from "react";
import {
    createChart,
    ColorType,
    LineStyle,
    CandlestickSeries,
    LineSeries,
    type UTCTimestamp,
} from "lightweight-charts";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ---- types (unchanged) ----
interface Candle {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
}

interface Signal {
    type: "BUY" | "SELL" | "NEUTRAL";
    time: string;
    price: number;
    reason: string;
}

interface ApiResponse {
    candles: Candle[];
    smaShort?: Array<number | null>;
    smaLong?: Array<number | null>;
    signals?: Signal[];
}

const toSec = (ms: number): UTCTimestamp => Math.floor(ms / 1000) as UTCTimestamp;

const Chart: React.FC<{ strategy: string | null; symbol: string }> = ({ strategy, symbol }) => {
    const priceChartRef = useRef<HTMLDivElement>(null);
    const rsiChartRef = useRef<HTMLDivElement>(null);

    // timeframe selection
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

    useEffect(() => {
        if (!priceChartRef.current || !symbol) return;

        priceChartRef.current.innerHTML = "";
        if (rsiChartRef.current) rsiChartRef.current.innerHTML = "";

        const priceHeight = strategy === "rsi" ? 400 : 600;

        // create chart
        const priceChart = createChart(priceChartRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: "#0f172a" },
                textColor: "#fff",
            },
            width: priceChartRef.current.clientWidth,
            height: priceHeight,
            timeScale: { timeVisible: true },
        });

        const candleSeries = priceChart.addSeries(CandlestickSeries);
        const token = localStorage.getItem("token");

        const interval = intervalMap[timeframe];

        const url = strategy
            ? `https://predator-production.up.railway.app/api/strategy/${symbol}/${strategy}?interval=${interval}&limit=500`
            : `https://predator-production.up.railway.app/api/strategy/candles/${symbol}?interval=${interval}&limit=500`;

        let cancelled = false;
        setLoading(true);

        fetch(url, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data: ApiResponse) => {
                if (cancelled) return;

                // candles
                candleSeries.setData(
                    data.candles.map((c) => ({
                        time: toSec(c.time),
                        open: c.open,
                        high: c.high,
                        low: c.low,
                        close: c.close,
                    }))
                );

                // SMA lines
                if (data.smaShort && data.smaLong) {
                    const configs = [
                        { values: data.smaShort, color: "blue" },
                        { values: data.smaLong, color: "red" },
                    ];

                    configs.forEach((cfg) => {
                        const series = priceChart.addSeries(LineSeries, {
                            color: cfg.color,
                            lineWidth: 2,
                        });

                        let last = null;
                        const smData = data.candles
                            .map((c, idx) => {
                                let v = cfg.values![idx];
                                if (v == null || isNaN(v)) {
                                    if (last == null) return null;
                                    v = last;
                                } else last = v;

                                return { time: toSec(c.time), value: v as number };
                            })
                            .filter(Boolean) as any[];

                        series.setData(smData);
                    });
                }

                // BUY/SELL markers
                if (data.signals?.length) {
                    data.signals.forEach((s) => {
                        candleSeries.createPriceLine({
                            price: s.price,
                            color: s.type === "BUY" ? "green" : s.type === "SELL" ? "red" : "gray",
                            lineStyle: LineStyle.Dashed,
                            lineWidth: 1,
                            title: `${s.type} (${s.reason})`,
                            axisLabelVisible: true,
                        });
                    });
                }
            })
            .catch((err) => {
                console.error("Chart fetch error:", err);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        // RSI chart
        let rsiChart: any = null;

        if (strategy === "rsi" && rsiChartRef.current) {
            rsiChart = createChart(rsiChartRef.current, {
                layout: {
                    background: { type: ColorType.Solid, color: "#0f172a" },
                    textColor: "#fff",
                },
                width: rsiChartRef.current.clientWidth,
                height: 200,
            });

            const rsiSeries = rsiChart.addSeries(LineSeries, {
                color: "yellow",
                lineWidth: 2,
            });

            fetch(
                `https://predator-production.up.railway.app/api/strategy/${symbol}/rsi?interval=${interval}&limit=500`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
                .then((res) => res.json())
                .then((data) => {
                    if (!data?.rsiSignals) return;

                    rsiSeries.setData(
                        data.rsiSignals
                            .filter((r: any) => Number.isFinite(r.rsi))
                            .map((r: any) => ({
                                time: toSec(r.time),
                                value: r.rsi,
                            }))
                    );
                })
                .catch((err) => console.error("RSI fetch error:", err));
        }

        // Resize handling
        const resize = () => {
            priceChart.applyOptions({ width: priceChartRef.current!.clientWidth });
            if (rsiChart) rsiChart.applyOptions({ width: rsiChartRef.current!.clientWidth });
        };
        window.addEventListener("resize", resize);

        return () => {
            cancelled = true;
            window.removeEventListener("resize", resize);
            priceChart.remove();
            if (rsiChart) rsiChart.remove();
        };
    }, [symbol, strategy, timeframe]);

    if (!symbol)
        return (
            <div className="text-gray-500 flex items-center justify-center h-[600px]">
                Please select a commodity
            </div>
        );

    return (
        <Card className="bg-trading-card border-gray-700">
            <CardHeader>
                <div className="flex items-center justify-between w-full">
                    <CardTitle className="text-xl font-semibold text-white">
                        Price Chart — {symbol}
                    </CardTitle>

                    <div className="flex space-x-2">
                        {["1h", "4h", "1d", "1w"].map((tf) => (
                            <Button
                                key={tf}
                                size="sm"
                                onClick={() => setTimeframe(tf)}
                                className={
                                    timeframe === tf
                                        ? "bg-trading-success text-white"
                                        : "bg-trading-dark text-gray-400 border border-gray-600"
                                }
                            >
                                {tf.toUpperCase()}
                            </Button>
                        ))}
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="relative">
                    {/* chart area - fixed height to avoid jumping */}
                    <div
                        ref={priceChartRef}
                        style={{ width: "100%", height: strategy === "rsi" ? "400px" : "600px" }}
                    />

                    {/* Spinner overlay while loading */}
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded">
                            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-600 border-t-emerald-500"></div>
                        </div>
                    )}
                </div>

                {/* RSI below if strategy === "rsi" */}
                {strategy === "rsi" && (
                    <div ref={rsiChartRef} style={{ width: "100%", height: "200px", marginTop: 12 }} />
                )}
            </CardContent>
        </Card>
    );
};

export default Chart;
