// // Chart.tsx
// // Chart.tsx
// import React, { useEffect, useRef } from "react";
// import { createChart, ColorType, LineStyle, IChartApi, CandlestickSeries, } from "lightweight-charts";

// interface Candle {
//     time: string;   // timestamp in ms
//     open: number;
//     high: number;
//     low: number;
//     close: number;
//     volume: number;
// }

// interface Signal {
//     type: "BUY" | "SELL";
//     time: number;
//     price: number;
//     reason: string;
//     suggestedSL?: number;
//     suggestedTP?: number;
//     rr?: number;
// }

// interface ApiResponse {
//     meta: any;
//     candles: Candle[];
//     smaShort: Array<number | null>;
//     smaLong: Array<number | null>;
//     signals: Signal[];
// }

// /** ✅ Helper: Convert ms → sec (for TradingView chart) */
// const toSec = (ms: number) => Math.floor(ms / 1000);

// /** ✅ Helper: Add horizontal line for SL/TP */
// function addHorizontalLine(chart: IChartApi, candles: Candle[], value: number, color: string, title: string) {
//     const line = chart.addSeries({
//         color,
//         lineStyle: LineStyle.Dashed,
//         lineWidth: 2,
//     });

//     line.setData(
//         candles.map((c) => ({
//             time: toSec(c.time),
//             value,
//         }))
//     );

//     return line;
// }

// const Chart: React.FC = () => {
//     const chartContainerRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         if (!chartContainerRef.current) return;

//         const chart = createChart(chartContainerRef.current, {
//             layout: {
//                 background: { type: ColorType.Solid, color: "#ffffff" },
//                 textColor: "#000",
//             },
//             width: chartContainerRef.current.clientWidth,
//             height: 600,
//         });

//         const candleSeries = chart.addSeries(CandlestickSeries);

//         // Fetch API data
//         fetch("http://localhost:3000/api/strategy/BTCUSDT/ma-crossover?interval=1d&limit=300")
//             .then((res) => res.json())
//             .then((data: ApiResponse) => {
//                 // ✅ Candles
//                 candleSeries.setData(
//                     data.candles.map((c) => ({
//                         time: c.time,
//                         open: c.open,
//                         high: c.high,
//                         low: c.low,
//                         close: c.close,
//                     }))
//                 );

//                 // ✅ SMA Short (50) & Long (200)
//                 const smaConfig = [
//                     { values: data.smaShort, color: "blue" },
//                     { values: data.smaLong, color: "red" },
//                 ];

//                 smaConfig.forEach((cfg) => {
//                     const series = chart.addLineSeries({ color: cfg.color, lineWidth: 2 });
//                     series.setData(
//                         data.candles.map((c, i) => ({
//                             time: toSec(c.time),
//                             value: cfg.values[i] ?? null,
//                         }))
//                     );
//                 });

//                 // ✅ Signals (BUY/SELL markers)
//                 candleSeries.setMarkers(
//                     data.signals.map((s) => ({
//                         time: toSec(s.time),
//                         position: s.type === "BUY" ? "belowBar" : "aboveBar",
//                         color: s.type === "BUY" ? "green" : "red",
//                         shape: s.type === "BUY" ? "arrowUp" : "arrowDown",
//                         text: `${s.type} @${s.price}\n${s.reason}`,
//                     }))
//                 );

//                 // ✅ Suggested SL & TP lines
//                 if (data.signals.length > 0) {
//                     const lastSignal = data.signals[data.signals.length - 1];

//                     if (lastSignal.suggestedSL) {
//                         addHorizontalLine(chart, data.candles, lastSignal.suggestedSL, "red", "Stop Loss");
//                     }

//                     if (lastSignal.suggestedTP) {
//                         addHorizontalLine(chart, data.candles, lastSignal.suggestedTP, "green", "Take Profit");
//                     }
//                 }
//             });

//         // ✅ Resize chart on window resize
//         const handleResize = () => {
//             chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
//         };
//         window.addEventListener("resize", handleResize);

//         return () => {
//             window.removeEventListener("resize", handleResize);
//             chart.remove();
//         };
//     }, []);

//     return <div ref={chartContainerRef} style={{ width: "100%", height: "600px" }} />;
// };

// export default Chart;


// // Chart.tsx
// import React, { useEffect, useRef } from "react";
// import { createChart, ColorType, LineStyle, IChartApi, CandlestickSeries, LineSeries } from "lightweight-charts";
// // import { createChart, ColorType, LineStyle } from "lightweight-charts";
// import { useCommodity } from "@/context/Commoditycontext"; // ✅ import context hook
// import { Line } from "recharts";

// interface Candle {
//     time: string;   // timestamp in ms
//     open: number;
//     high: number;
//     low: number;
//     close: number;
//     volume: number;
// }

// interface Signal {
//     type: "BUY" | "SELL";
//     time: number;
//     price: number;
//     reason: string;
//     suggestedSL?: number;
//     suggestedTP?: number;
//     rr?: number;
// }

// interface ApiResponse {
//     meta: any;
//     candles: Candle[];
//     smaShort: Array<number | null>;
//     smaLong: Array<number | null>;
//     signals: Signal[];
// }

// /** ✅ Helper: Convert ms → sec (for TradingView chart) */
// const toSec = (ms: number) => Math.floor(ms / 1000);

// /** ✅ Helper: Add horizontal line for SL/TP */
// function addHorizontalLine(chart: IChartApi, candles: Candle[], value: number, color: string, title: string) {
//     const line = chart.addSeries(LineSeries, {
//         color,
//         lineStyle: LineStyle.Dashed,
//         lineWidth: 2,
//     });

//     line.setData(
//         candles.map((c) => ({
//             time: c.time,
//             value,
//         }))
//     );

//     return line;
// }

// const Chart: React.FC = () => {
//     const chartContainerRef = useRef<HTMLDivElement>(null);
//     const { selectedCommodity } = useCommodity(); // ✅ get selected commodity from context

//     useEffect(() => {
//         if (!chartContainerRef.current || !selectedCommodity) return;

//         const chart = createChart(chartContainerRef.current, {
//             layout: {
//                 background: { type: ColorType.Solid, color: "#ffffff" },
//                 textColor: "#000",
//             },
//             width: chartContainerRef.current.clientWidth,
//             height: 600,
//         });

//         const candleSeries = chart.addSeries(CandlestickSeries);
//         // const candleSeries = chart.addCandlestickSeries();
//         // ✅ Dynamic API call using selectedCommodity
//         fetch(`http://localhost:3000/api/strategy/${selectedCommodity}/ma-crossover?interval=1d&limit=300`)
//             .then((res) => res.json())
//             .then((data: ApiResponse) => {
//                 // ✅ Candles
//                 candleSeries.setData(
//                     data.candles.map((c) => ({
//                         time: c.time,
//                         open: c.open,
//                         high: c.high,
//                         low: c.low,
//                         close: c.close,
//                     }))
//                 );
//                 console.log("Fetched data for", selectedCommodity, data, candleSeries);
//                 console.log("Candles:", data.candles.map((c) => ({
//                     time: convertTime(c.time),
//                     open: c.open,
//                     high: c.high,
//                     low: c.low,
//                     close: c.close,
//                 }))); // first 5 candles

//                 // --- COMMENTED CODE: keep as is ---
//                 // const smaConfig = [
//                 //     { values: data.smaShort, color: "blue" },
//                 //     { values: data.smaLong, color: "red" },
//                 // ];
//                 // smaConfig.forEach((cfg) => {
//                 //     const series = chart.addSeries(LineSeries, { color: cfg.color, lineWidth: 2 });
//                 //     series.setData(
//                 //         data.candles.map((c, i) => ({
//                 //             time: c.time,
//                 //             value: cfg.values[i] ?? null,
//                 //         }))
//                 //     );
//                 // });

//                 const smaConfig = [
//                     { values: data.smaShort, color: "blue" },
//                     { values: data.smaLong, color: "red" },
//                 ];

//                 smaConfig.forEach((cfg) => {
//                     // ✅ Line series add karna (line ke liye ye method sahi hai)
//                     const series = chart.addSeries(LineSeries, { color: cfg.color, lineWidth: 2 });

//                     // ✅ Null/undefined filter karo aur time ko seconds me convert karo
//                     const lineData = data.candles.map((c, i) => {
//                         const v = cfg.values[i];
//                         if (v === null || v === undefined || isNaN(v)) return null; // skip invalid
//                         return {
//                             time: Math.floor(Number(c.time) / 1000), // ✅ convert ms string → sec number
//                             value: v, // ✅ must be number
//                         };
//                     }).filter(Boolean) as { time: number; value: number }[];

//                     series.setData(lineData);
//                 });

//                 // candleSeries.setMarkers(
//                 //     data.signals.map((s) => ({
//                 //         time: toSec(s.time),
//                 //         position: s.type === "BUY" ? "belowBar" : "aboveBar",
//                 //         color: s.type === "BUY" ? "green" : "red",
//                 //         shape: s.type === "BUY" ? "arrowUp" : "arrowDown",
//                 //         text: `${s.type} @${s.price}\n${s.reason}`,
//                 //     }))
//                 // );

//                 data.signals.forEach((s) => {
//                     candleSeries.createPriceLine({
//                         price: s.price,
//                         color: s.type === "BUY" ? "green" : "red",
//                         lineStyle: LineStyle.Dashed,
//                         lineWidth: 1,
//                         axisLabelVisible: true,
//                         title: `${s.type} @${s.price}\n${s.reason}`,
//                     });
//                 });



//                 // ✅ Suggested SL & TP lines
//                 if (data.signals.length > 0) {
//                     const lastSignal = data.signals[data.signals.length - 1];

//                     if (lastSignal.suggestedSL) {
//                         addHorizontalLine(chart, data.candles, lastSignal.suggestedSL, "red", "Stop Loss");
//                     }

//                     if (lastSignal.suggestedTP) {
//                         addHorizontalLine(chart, data.candles, lastSignal.suggestedTP, "green", "Take Profit");
//                     }
//                 }
//             });

//         // ✅ Resize chart on window resize
//         const handleResize = () => {
//             chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
//         };
//         window.addEventListener("resize", handleResize);

//         return () => {
//             window.removeEventListener("resize", handleResize);
//             chart.remove();
//         };
//     }, [selectedCommodity]); // ✅ re-render chart when commodity changes

//     if (!selectedCommodity) {
//         return (
//             <div className="text-gray-500 flex items-center justify-center h-[600px]">
//                 Please select a commodity from Dashboard
//             </div>
//         );
//     }

//     return <div ref={chartContainerRef} style={{ width: "100%", height: "600px" }} />;
// };

// export default Chart;



// function convertTime(time: string): any {
//     throw new Error("Function not implemented.");
// }

// new  hai code time updated wala 

// import React, { useEffect, useRef } from "react";
// import { createChart, ColorType, LineStyle, IChartApi, CandlestickSeries, LineSeries, type UTCTimestamp } from "lightweight-charts";
// import { useCommodity } from "@/context/Commoditycontext";

// interface Candle {
//     time: number;   // timestamp in ms
//     open: number;
//     high: number;
//     low: number;
//     close: number;
//     volume: number;
// }

// interface Signal {
//     type: "BUY" | "SELL";
//     time: number;
//     price: number;
//     reason: string;
//     suggestedSL?: number;
//     suggestedTP?: number;
//     rr?: number;
// }

// interface ApiResponse {
//     meta: any;
//     candles: Candle[];
//     smaShort: Array<number | null>;
//     smaLong: Array<number | null>;
//     signals: Signal[];
// }

// // const toSec = (ms: number) => Math.floor(ms / 1000);
// const toSec = (ms: number): UTCTimestamp => Math.floor(ms / 1000) as UTCTimestamp;

// /** ✅ Horizontal line helper */
// function addHorizontalLine(chart: IChartApi, candles: Candle[], value: number, color: string, title: string) {
//     const line = chart.addSeries(LineSeries, {
//         color,
//         lineStyle: LineStyle.Dashed,
//         lineWidth: 2,
//     });

//     line.setData(
//         candles.map((c) => ({
//             time: toSec(Number(c.time)),
//             value,
//         }))
//     );

//     return line;
// }

// const Chart: React.FC = () => {
//     const chartContainerRef = useRef<HTMLDivElement>(null);
//     const { selectedCommodity } = useCommodity();

//     useEffect(() => {
//         if (!chartContainerRef.current || !selectedCommodity) return;

//         const chart = createChart(chartContainerRef.current, {
//             layout: {
//                 background: { type: ColorType.Solid, color: "#ffffff" },
//                 textColor: "#000",
//             },
//             width: chartContainerRef.current.clientWidth,
//             height: 600,
//             timeScale: {
//                 timeVisible: true,
//                 secondsVisible: true,
//             },
//         });

//         // ✅ Custom X-axis format
//         chart.applyOptions({
//             localization: {
//                 timeFormatter: (timestamp: number) => {
//                     const date = new Date(timestamp * 1000);
//                     const day = String(date.getDate()).padStart(2, "0");
//                     const month = String(date.getMonth() + 1).padStart(2, "0");
//                     const year = date.getFullYear();
//                     const hours = String(date.getHours()).padStart(2, "0");
//                     const minutes = String(date.getMinutes()).padStart(2, "0");
//                     return `${day}-${month}-${year} ${hours}:${minutes}`;
//                 },
//             },
//         });

//         const candleSeries = chart.addSeries(CandlestickSeries);

//         // ✅ Fetch API
//         fetch(`http://localhost:3000/api/strategy/${selectedCommodity}/ma-crossover?interval=1d&limit=500`)
//             .then((res) => res.json())
//             .then((data: ApiResponse) => {
//                 // ✅ Candles
//                 candleSeries.setData(
//                     data.candles.map((c) => ({
//                         time: toSec(Number(c.time)),
//                         open: c.open,
//                         high: c.high,
//                         low: c.low,
//                         close: c.close,
//                     }))
//                 );

//                 // ✅ SMA
//                 const smaConfig = [
//                     { values: data.smaShort, color: "blue" },
//                     { values: data.smaLong, color: "red" },
//                 ];

//                 smaConfig.forEach((cfg) => {
//                     const series = chart.addSeries(LineSeries, { color: cfg.color, lineWidth: 2 });
//                     // const lineData = data.candles.map((c, i) => {
//                     //     const v = cfg.values[i];
//                     //     if (v === null || v === undefined || isNaN(v)) return null;
//                     //     return {
//                     //         time: toSec(Number(c.time)),
//                     //         value: v,
//                     //     };
//                     //     // }).filter(Boolean) as { time: number; value: number }[];
//                     // }).filter(Boolean) as { time: UTCTimestamp; value: number }[];
//                     let lastValue: number | null = null;

//                     const lineData = data.candles
//                         .map((c, i) => {
//                             let v = cfg.values[i];

//                             if (v === null || v === undefined || isNaN(v)) {
//                                 if (lastValue === null) {
//                                     return null; // ❌ skip first nulls
//                                 }
//                                 v = lastValue; // ✅ बाद में fill karo
//                             } else {
//                                 lastValue = v;
//                             }

//                             return {
//                                 time: toSec(Number(c.time)),
//                                 value: v as number, // ✅ force number
//                             };
//                         })
//                         .filter(Boolean) as { time: UTCTimestamp; value: number }[];

//                     series.setData(lineData);
//                 });

// //                 // ✅ BUY/SELL Markers (arrows)
// //                 // candleSeries.setMarkers(
// //                 //     data.signals.map((s) => ({
// //                 //         time: toSec(s.time),
// //                 //         position: s.type === "BUY" ? "belowBar" : "aboveBar",
// //                 //         color: s.type === "BUY" ? "green" : "red",
// //                 //         shape: s.type === "BUY" ? "arrowUp" : "arrowDown",
// //                 //         text: `${s.type} @${s.price}\n${s.reason}`,
// //                 //     }))
// //                 // );
// //                 data.signals.forEach((s) => {
// //                     candleSeries.createPriceLine({

// //                         price: s.price,
// //                         color: s.type === "BUY" ? "green" : "red",
// //                         lineStyle: LineStyle.Dashed,
// //                         lineWidth: 1,
// //                         axisLabelVisible: true,
// //                         title: `${s.type} @${s.price}\n${s.reason}`,
// //                     });
// //                 });





// //                 // ✅ Suggested SL/TP
// //                 if (data.signals.length > 0) {
// //                     const lastSignal = data.signals[data.signals.length - 1];
// //                     if (lastSignal.suggestedSL) {
// //                         addHorizontalLine(chart, data.candles, lastSignal.suggestedSL, "red", "Stop Loss");
// //                     }
// //                     if (lastSignal.suggestedTP) {
// //                         addHorizontalLine(chart, data.candles, lastSignal.suggestedTP, "green", "Take Profit");
// //                     }
// //                 }
// //             });

// //         const handleResize = () => {
// //             chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
// //         };
// //         window.addEventListener("resize", handleResize);

// //         return () => {
// //             window.removeEventListener("resize", handleResize);
// //             chart.remove();
// //         };
// //     }, [selectedCommodity]);

// //     if (!selectedCommodity) {
// //         return (
// //             <div className="text-gray-500 flex items-center justify-center h-[600px]">
// //                 Please select a commodity from Dashboard
// //             </div>
// //         );
// //     }

// //     return <div ref={chartContainerRef} style={{ width: "100%", height: "600px" }} />;
// // };

// // export default Chart;

// import React, { useEffect, useRef } from "react";
// import {
//     createChart,
//     ColorType,
//     LineStyle,
//     CandlestickSeries,
//     LineSeries,
//     IChartApi,
//     type UTCTimestamp,
// } from "lightweight-charts";

// interface Candle {
//     time: number; // timestamp in ms
//     open: number;
//     high: number;
//     low: number;
//     close: number;
//     volume: number;
// }

// interface Signal {
//     type: "BUY" | "SELL";
//     time: number;
//     price: number;
//     reason: string;
//     suggestedSL?: number;
//     suggestedTP?: number;
//     rr?: number;
// }

// interface ApiResponse {
//     meta?: any;
//     candles: Candle[];
//     smaShort?: Array<number | null>;
//     smaLong?: Array<number | null>;
//     signals?: Signal[];
// }

// const toSec = (ms: number): UTCTimestamp => Math.floor(ms / 1000) as UTCTimestamp;

// function addHorizontalLine(
//     chart: IChartApi,
//     candles: Candle[],
//     value: number,
//     color: string,
//     title: string
// ) {
//     const line = chart.addSeries(LineSeries, {
//         color,
//         lineStyle: LineStyle.Dashed,
//         lineWidth: 2,
//     });

//     line.setData(
//         candles.map((c) => ({
//             time: toSec(Number(c.time)),
//             value,
//         }))
//     );

//     return line;
// }

// const Chart: React.FC<{ strategy: string | null; symbol: string }> = ({
//     strategy,
//     symbol,
// }) => {
//     const chartContainerRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         if (!chartContainerRef.current || !symbol) return;

//         const chart = createChart(chartContainerRef.current, {
//             layout: {
//                 background: { type: ColorType.Solid, color: "#ffffff" },
//                 textColor: "#000",
//             },
//             width: chartContainerRef.current.clientWidth,
//             height: 600,
//             timeScale: { timeVisible: true, secondsVisible: true },
//         });

//         chart.applyOptions({
//             localization: {
//                 timeFormatter: (timestamp: number) => {
//                     const date = new Date(timestamp * 1000);
//                     const day = String(date.getDate()).padStart(2, "0");
//                     const month = String(date.getMonth() + 1).padStart(2, "0");
//                     const year = date.getFullYear();
//                     const hours = String(date.getHours()).padStart(2, "0");
//                     const minutes = String(date.getMinutes()).padStart(2, "0");
//                     return `${day}-${month}-${year} ${hours}:${minutes}`;
//                 },
//             },
//         });

//         const candleSeries = chart.addSeries(CandlestickSeries);

//         // ✅ API url decide karo
//         const url = strategy
//             ? `http://localhost:3000/api/strategy/${symbol}/${strategy}?interval=1d&limit=500`
//             : `http://localhost:3000/api/strategy/candles/${symbol}?interval=1d&limit=500`;

//         fetch(url)
//             .then((res) => res.json())
//             .then((data: ApiResponse) => {
//                 // ✅ Candles set
//                 candleSeries.setData(
//                     data.candles.map((c) => ({
//                         time: toSec(Number(c.time)),
//                         open: c.open,
//                         high: c.high,
//                         low: c.low,
//                         close: c.close,
//                     }))
//                 );

//                 // ✅ agar strategy null hai → bas candle hi dikhao
//                 if (!strategy) return;

//                 // ✅ SMA lines agar hain to draw karo
//                 if (data.smaShort && data.smaLong) {
//                     const smaConfig = [
//                         { values: data.smaShort, color: "blue" },
//                         { values: data.smaLong, color: "red" },
//                     ];

//                     smaConfig.forEach((cfg) => {
//                         const series = chart.addSeries(LineSeries, {
//                             color: cfg.color,
//                             lineWidth: 2,
//                         });

//                         let lastValue: number | null = null;
//                         const lineData = data.candles
//                             .map((c, i) => {
//                                 let v = cfg.values![i];
//                                 if (v === null || v === undefined || isNaN(v)) {
//                                     if (lastValue === null) return null;
//                                     v = lastValue;
//                                 } else {
//                                     lastValue = v;
//                                 }
//                                 return { time: toSec(Number(c.time)), value: v as number };
//                             })
//                             .filter(Boolean) as { time: UTCTimestamp; value: number }[];

//                         series.setData(lineData);
//                     });
//                 }

//                 // ✅ BUY / SELL signals draw karo
//                 if (data.signals && data.signals.length > 0) {
//                     data.signals.forEach((s) => {
//                         candleSeries.createPriceLine({
//                             price: s.price,
//                             color: s.type === "BUY" ? "green" : "red",
//                             lineStyle: LineStyle.Dashed,
//                             lineWidth: 1,
//                             axisLabelVisible: true,
//                             title: `${s.type} @${s.price}\n${s.reason}`,
//                         });
//                     });

//                     // ✅ SL / TP lines
//                     const lastSignal = data.signals[data.signals.length - 1];
//                     if (lastSignal.suggestedSL) {
//                         addHorizontalLine(chart, data.candles, lastSignal.suggestedSL, "red", "Stop Loss");
//                     }
//                     if (lastSignal.suggestedTP) {
//                         addHorizontalLine(chart, data.candles, lastSignal.suggestedTP, "green", "Take Profit");
//                     }
//                 }
//             });

//         const handleResize = () => {
//             chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
//         };
//         window.addEventListener("resize", handleResize);

//         return () => {
//             window.removeEventListener("resize", handleResize);
//             chart.remove();
//         };
//     }, [symbol, strategy]);

//     if (!symbol) {
//         return (
//             <div className="text-gray-500 flex items-center justify-center h-[600px]">
//                 Please select a commodity from Dashboard
//             </div>
//         );
//     }

//     return <div ref={chartContainerRef} style={{ width: "100%", height: "600px" }} />;
// };

// export default Chart;


import React, { useEffect, useRef } from "react";
import {
    createChart,
    ColorType,
    LineStyle,
    CandlestickSeries,
    LineSeries,
    type UTCTimestamp,
} from "lightweight-charts";

interface Candle {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
}

interface Signal {
    type: "BUY" | "SELL";
    time: number;
    price: number;
    reason: string;
    suggestedSL?: number;
    suggestedTP?: number;
}

interface ApiResponse {
    candles: Candle[];
    smaShort?: Array<number | null>;
    smaLong?: Array<number | null>;
    signals?: Signal[];
}

const toSec = (ms: number): UTCTimestamp => Math.floor(ms / 1000) as UTCTimestamp;

const Chart: React.FC<{ strategy: string | null; symbol: string }> = ({
    strategy,
    symbol,
}) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartContainerRef.current || !symbol) return;

        // ✅ cleanup container
        chartContainerRef.current.innerHTML = "";

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: "#0f172a" },
                textColor: "#fff",
            },
            width: chartContainerRef.current.clientWidth,
            height: 600,
            timeScale: { timeVisible: true, secondsVisible: true },
        });

        const candleSeries = chart.addSeries(CandlestickSeries);

        const url = strategy
            ? `http://localhost:3000/api/strategy/${symbol}/${strategy}?interval=1d&limit=500`
            : `http://localhost:3000/api/strategy/candles/${symbol}?interval=1d&limit=500`;

        console.log("Fetching chart data from:", url);

        let cancelled = false;

        fetch(url)
            .then((res) => res.json())
            .then((data: ApiResponse) => {
                if (cancelled) return;

                // ✅ Candles load
                candleSeries.setData(
                    data.candles.map((c) => ({
                        time: toSec(c.time),
                        open: c.open,
                        high: c.high,
                        low: c.low,
                        close: c.close,
                    }))
                );

                // ✅ Agar strategy null hai → sirf candles dikhana
                if (!strategy) return;

                // ✅ SMA lines
                if (data.smaShort && data.smaLong) {
                    const smaConfig = [
                        { values: data.smaShort, color: "blue" },
                        { values: data.smaLong, color: "red" },
                    ];

                    smaConfig.forEach((cfg) => {
                        const series = chart.addSeries(LineSeries, {
                            color: cfg.color,
                            lineWidth: 2,
                        });

                        let lastValue: number | null = null;
                        const lineData = data.candles
                            .map((c, i) => {
                                let v = cfg.values![i];
                                if (v === null || isNaN(v as number)) {
                                    if (lastValue === null) return null;
                                    v = lastValue;
                                } else {
                                    lastValue = v;
                                }
                                return { time: toSec(c.time), value: v as number };
                            })
                            .filter(Boolean) as { time: UTCTimestamp; value: number }[];

                        series.setData(lineData);
                    });
                }

                // ✅ Signals
                if (data.signals && data.signals.length > 0) {
                    data.signals.forEach((s) => {
                        candleSeries.createPriceLine({
                            price: s.price,
                            color: s.type === "BUY" ? "green" : "red",
                            lineStyle: LineStyle.Dashed,
                            lineWidth: 1,
                            axisLabelVisible: true,
                            title: `${s.type} @${s.price}\n${s.reason}`,
                        });
                    });
                }
            })
            .catch((err) => console.error("Chart fetch error:", err));

        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
        };
        window.addEventListener("resize", handleResize);

        return () => {
            cancelled = true;
            window.removeEventListener("resize", handleResize);
            chart.remove();
        };
    }, [symbol, strategy]);

    if (!symbol) {
        return (
            <div className="text-gray-500 flex items-center justify-center h-[600px]">
                Please select a commodity
            </div>
        );
    }

    return <div ref={chartContainerRef} style={{ width: "100%", height: "600px" }} />;
};

export default Chart;







// import React, { useEffect, useRef } from "react";
// import { createChart, ColorType, LineStyle } from "lightweight-charts";
// import { useCommodity } from "@/context/Commoditycontext"; // ✅ import context hook

// interface Candle {
//     time: string;   // timestamp in ms (string from backend)
//     open: number;
//     high: number;
//     low: number;
//     close: number;
//     volume: number;
// }

// interface Signal {
//     type: "BUY" | "SELL";
//     time: number;
//     price: number;
//     reason: string;
//     suggestedSL?: number;
//     suggestedTP?: number;
//     rr?: number;
// }

// interface ApiResponse {
//     meta: any;
//     candles: Candle[];
//     smaShort: Array<number | null>;
//     smaLong: Array<number | null>;
//     signals: Signal[];
// }

// /** ✅ Helper: Convert ms → sec */
// const toSec = (ms: number) => Math.floor(ms / 1000);

// /** ✅ Helper: Add horizontal line for SL/TP */
// function addHorizontalLine(chart: any, candles: Candle[], value: number, color: string, title: string) {
//     const line = chart.addLineSeries({
//         color,
//         lineStyle: LineStyle.Dashed,
//         lineWidth: 2,
//     });

//     line.setData(
//         candles.map((c) => ({
//             time: toSec(Number(c.time)),
//             value,
//         }))
//     );

//     return line;
// }

// const Chart: React.FC = () => {
//     const chartContainerRef = useRef<HTMLDivElement>(null);
//     const { selectedCommodity } = useCommodity(); // ✅ get selected commodity from context

//     useEffect(() => {
//         if (!chartContainerRef.current || !selectedCommodity) return;

//         const chart: any = createChart(chartContainerRef.current, {
//             layout: {
//                 background: { type: ColorType.Solid, color: "#ffffff" },
//                 textColor: "#000",
//             },
//             width: chartContainerRef.current.clientWidth,
//             height: 600,
//         });
//         console.log("chart");

//         // ✅ Candlestick Series
//         const candleSeries = chart.addCandlestickSeries();

//         // ✅ Fetch Data
//         fetch(`http://localhost:3000/api/strategy/${selectedCommodity}/ma-crossover?interval=1d&limit=300`)
//             .then((res) => res.json())
//             .then((data: ApiResponse) => {
//                 // ✅ Candles
//                 candleSeries.setData(
//                     data.candles.map((c) => ({
//                         time: toSec(Number(c.time)),
//                         open: c.open,
//                         high: c.high,
//                         low: c.low,
//                         close: c.close,
//                     }))
//                 );

//                 // ✅ SMA Short & Long
//                 const smaConfig = [
//                     { values: data.smaShort, color: "blue" },
//                     { values: data.smaLong, color: "red" },
//                 ];

//                 smaConfig.forEach((cfg) => {
//                     const series = chart.addLineSeries({ color: cfg.color, lineWidth: 2 });
//                     const lineData = data.candles.map((c, i) => {
//                         const v = cfg.values[i];
//                         if (v === undefined || v === null || isNaN(v)) return null;
//                         return {
//                             time: toSec(Number(c.time)),
//                             value: v,
//                         };
//                     }).filter(Boolean) as { time: number; value: number }[];

//                     series.setData(lineData);
//                 });

//                 // ✅ BUY/SELL markers
//                 candleSeries.setMarkers(
//                     data.signals.map((s) => ({
//                         time: toSec(s.time),
//                         position: s.type === "BUY" ? "belowBar" : "aboveBar",
//                         color: s.type === "BUY" ? "green" : "red",
//                         shape: s.type === "BUY" ? "arrowUp" : "arrowDown",
//                         text: `${s.type} @${s.price}\n${s.reason || ""}`,
//                     }))
//                 );

//                 // ✅ SL/TP lines
//                 if (data.signals.length > 0) {
//                     const lastSignal = data.signals[data.signals.length - 1];

//                     if (lastSignal.suggestedSL) {
//                         addHorizontalLine(chart, data.candles, lastSignal.suggestedSL, "red", "Stop Loss");
//                     }

//                     if (lastSignal.suggestedTP) {
//                         addHorizontalLine(chart, data.candles, lastSignal.suggestedTP, "green", "Take Profit");
//                     }
//                 }
//             });

//         // ✅ Handle Resize
//         const handleResize = () => {
//             chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
//         };
//         window.addEventListener("resize", handleResize);

//         return () => {
//             window.removeEventListener("resize", handleResize);
//             chart.remove();
//         };
//     }, [selectedCommodity]);

//     if (!selectedCommodity) {
//         return (
//             <div className="text-gray-500 flex items-center justify-center h-[600px]">
//                 Please select a commodity from Dashboard
//             </div>
//         );
//     }

//     return <div ref={chartContainerRef} style={{ width: "100%", height: "600px" }} />;
// };

// export default Chart;
