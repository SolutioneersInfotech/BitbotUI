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


// import React, { useEffect, useRef } from "react";
// import {
//     createChart,
//     ColorType,
//     LineStyle,
//     CandlestickSeries,
//     LineSeries,
//     type UTCTimestamp,
// } from "lightweight-charts";

// interface Candle {
//     time: number;
//     open: number;
//     high: number;
//     low: number;
//     close: number;
// }

// interface Signal {
//     type: "BUY" | "SELL";
//     time: number;
//     price: number;
//     reason: string;
//     suggestedSL?: number;
//     suggestedTP?: number;
// }

// interface ApiResponse {
//     candles: Candle[];
//     smaShort?: Array<number | null>;
//     smaLong?: Array<number | null>;
//     signals?: Signal[];
// }

// const toSec = (ms: number): UTCTimestamp => Math.floor(ms / 1000) as UTCTimestamp;

// const Chart: React.FC<{ strategy: string | null; symbol: string }> = ({
//     strategy,
//     symbol,
// }) => {
//     const chartContainerRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         if (!chartContainerRef.current || !symbol) return;

//         // ✅ cleanup container
//         chartContainerRef.current.innerHTML = "";

//         const chart = createChart(chartContainerRef.current, {
//             layout: {
//                 background: { type: ColorType.Solid, color: "#0f172a" },
//                 textColor: "#fff",
//             },
//             width: chartContainerRef.current.clientWidth,
//             height: 600,
//             timeScale: { timeVisible: true, secondsVisible: true },
//         });

//         const candleSeries = chart.addSeries(CandlestickSeries);

//         const url = strategy
//             ? `https://predator-production.up.railway.app/api/strategy/${symbol}/${strategy}?interval=1d&limit=500`
//             : `https://predator-production.up.railway.app/api/strategy/candles/${symbol}?interval=1d&limit=500`;

//         console.log("Fetching chart data from:", url);

//         let cancelled = false;

//         fetch(url)
//             .then((res) => res.json())
//             .then((data: ApiResponse) => {
//                 if (cancelled) return;

//                 // ✅ Candles load
//                 candleSeries.setData(
//                     data.candles.map((c) => ({
//                         time: toSec(c.time),
//                         open: c.open,
//                         high: c.high,
//                         low: c.low,
//                         close: c.close,
//                     }))
//                 );

//                 // ✅ Agar strategy null hai → sirf candles dikhana
//                 if (!strategy) return;

//                 // ✅ SMA lines
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
//                                 if (v === null || isNaN(v as number)) {
//                                     if (lastValue === null) return null;
//                                     v = lastValue;
//                                 } else {
//                                     lastValue = v;
//                                 }
//                                 return { time: toSec(c.time), value: v as number };
//                             })
//                             .filter(Boolean) as { time: UTCTimestamp; value: number }[];

//                         series.setData(lineData);
//                     });
//                 }

//                 // ✅ Signals
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
//                 }
//             })
//             .catch((err) => console.error("Chart fetch error:", err));

//         const handleResize = () => {
//             chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
//         };
//         window.addEventListener("resize", handleResize);

//         return () => {
//             cancelled = true;
//             window.removeEventListener("resize", handleResize);
//             chart.remove();
//         };
//     }, [symbol, strategy]);

//     if (!symbol) {
//         return (
//             <div className="text-gray-500 flex items-center justify-center h-[600px]">
//                 Please select a commodity
//             </div>
//         );
//     }

//     return <div ref={chartContainerRef} style={{ width: "100%", height: "600px" }} />;
// };

// export default Chart;

// import React, { useEffect, useRef } from "react";
// import {
//     createChart,
//     ColorType,
//     LineStyle,
//     CandlestickSeries,
//     LineSeries,
//     type UTCTimestamp,
// } from "lightweight-charts";

// interface Candle {
//     time: number;
//     open: number;
//     high: number;
//     low: number;
//     close: number;
// }

// interface Signal {
//     type: "BUY" | "SELL";
//     time: number;
//     price: number;
//     reason: string;
//     suggestedSL?: number;
//     suggestedTP?: number;
// }

// interface ApiResponse {
//     candles: Candle[];
//     smaShort?: Array<number | null>;
//     smaLong?: Array<number | null>;
//     signals?: Signal[];
// }

// interface RSIResponse {
//     time: string;
//     rsi: number;
//     signal: string;
// }

// const toSec = (ms: number): UTCTimestamp => Math.floor(ms / 1000) as UTCTimestamp;

// const Chart: React.FC<{ strategy: string | null; symbol: string }> = ({ strategy, symbol }) => {
//     const priceChartRef = useRef<HTMLDivElement>(null);
//     const rsiChartRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         if (!priceChartRef.current || !symbol) return;

//         priceChartRef.current.innerHTML = "";
//         if (rsiChartRef.current) rsiChartRef.current.innerHTML = "";

//         // 📈 Price Chart
//         const priceChart = createChart(priceChartRef.current, {
//             layout: {
//                 background: { type: ColorType.Solid, color: "#0f172a" },
//                 textColor: "#fff",
//             },
//             width: priceChartRef.current.clientWidth,
//             height: 400,
//             timeScale: { timeVisible: true, secondsVisible: true },
//         });
//         const candleSeries = priceChart.addSeries(CandlestickSeries);

//         const url = strategy
//             ? `https://predator-production.up.railway.app/api/strategy/${symbol}/${strategy}?interval=1d&limit=500`
//             : `https://predator-production.up.railway.app/api/strategy/candles/${symbol}?interval=1d&limit=500`;

//         let cancelled = false;

//         fetch(url)
//             .then((res) => res.json())
//             .then((data: ApiResponse) => {
//                 if (cancelled) return;

//                 candleSeries.setData(
//                     data.candles.map((c) => ({
//                         time: toSec(c.time),
//                         open: c.open,
//                         high: c.high,
//                         low: c.low,
//                         close: c.close,
//                     }))
//                 );

//                 if (!strategy) return;

//                 // SMA Lines
//                 if (data.smaShort && data.smaLong) {
//                     const smaConfig = [
//                         { values: data.smaShort, color: "blue" },
//                         { values: data.smaLong, color: "red" },
//                     ];

//                     smaConfig.forEach((cfg) => {
//                         const series = priceChart.addSeries(LineSeries, {
//                             color: cfg.color,
//                             lineWidth: 2,
//                         });

//                         let lastValue: number | null = null;
//                         const lineData = data.candles
//                             .map((c, i) => {
//                                 let v = cfg.values![i];
//                                 if (v === null || isNaN(v as number)) {
//                                     if (lastValue === null) return null;
//                                     v = lastValue;
//                                 } else {
//                                     lastValue = v;
//                                 }
//                                 return { time: toSec(c.time), value: v as number };
//                             })
//                             .filter(Boolean) as { time: UTCTimestamp; value: number }[];

//                         series.setData(lineData);
//                     });
//                 }

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
//                 }
//             })
//             .catch((err) => console.error("Chart fetch error:", err));

//         // 📉 RSI chart only if RSI strategy selected
//         if (strategy === "rsi" && rsiChartRef.current) {
//             const rsiChart = createChart(rsiChartRef.current, {
//                 layout: {
//                     background: { type: ColorType.Solid, color: "#0f172a" },
//                     textColor: "#fff",
//                 },
//                 width: rsiChartRef.current.clientWidth,
//                 height: 200,
//                 timeScale: { timeVisible: true, secondsVisible: true },
//             });
//             const rsiSeries = rsiChart.addSeries(LineSeries, {
//                 color: "yellow",
//                 lineWidth: 2,
//             });

//             fetch(`https://predator-production.up.railway.app/api/strategy/${symbol}/rsi?interval=1d`)
//                 .then((res) => res.json())
//                 .then((rsiData) => {
//                     if (!Array.isArray(rsiData)) {
//                         console.error("RSI API returned error:", rsiData);
//                         return;
//                     }

//                     const lineData = rsiData.map((r: RSIResponse) => ({
//                         time: toSec(new Date(r.time).getTime()),
//                         value: r.rsi,
//                     }));
//                     rsiSeries.setData(lineData);

//                     // Add 30 / 70 lines
//                     [30, 70].forEach((lvl) => {
//                         rsiSeries.createPriceLine({
//                             price: lvl,
//                             color: lvl === 70 ? "red" : "green",
//                             lineStyle: LineStyle.Dashed,
//                             lineWidth: 1,
//                         });
//                     });
//                 })
//                 .catch((err) => console.error("RSI fetch error:", err));
//         }

//         const handleResize = () => {
//             priceChart.applyOptions({ width: priceChartRef.current!.clientWidth });
//             if (rsiChartRef.current)
//                 (rsiChartRef.current as any).applyOptions?.({ width: rsiChartRef.current.clientWidth });
//         };
//         window.addEventListener("resize", handleResize);

//         return () => {
//             cancelled = true;
//             window.removeEventListener("resize", handleResize);
//             priceChart.remove();
//         };
//     }, [symbol, strategy]);

//     if (!symbol) {
//         return (
//             <div className="text-gray-500 flex items-center justify-center h-[600px]">
//                 Please select a commodity
//             </div>
//         );
//     }

//     return (
//         <div style={{ width: "100%" }}>
//             <div ref={priceChartRef} style={{ width: "100%", height: "400px" }} />
//             {strategy === "rsi" && <div ref={rsiChartRef} style={{ width: "100%", height: "200px" }} />}
//         </div>
//     );
// };

// export default Chart;


// import React, { useEffect, useRef } from "react";
// import {
//     createChart,
//     ColorType,
//     LineStyle,
//     CandlestickSeries,
//     LineSeries,
//     type UTCTimestamp,
// } from "lightweight-charts";

// interface Candle {
//     time: number;
//     open: number;
//     high: number;
//     low: number;
//     close: number;
// }

// interface Signal {
//     type: "BUY" | "SELL" | "NEUTRAL";
//     time: string;
//     price: number;
//     reason: string;
// }

// interface ApiResponse {
//     candles: Candle[];
//     smaShort?: Array<number | null>;
//     smaLong?: Array<number | null>;
//     signals?: Signal[];
// }

// const toSec = (ms: number): UTCTimestamp => Math.floor(ms / 1000) as UTCTimestamp;

// const Chart: React.FC<{ strategy: string | null; symbol: string }> = ({ strategy, symbol }) => {
//     const priceChartRef = useRef<HTMLDivElement>(null);
//     const rsiChartRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         if (!priceChartRef.current || !symbol) return;
//         priceChartRef.current.innerHTML = "";
//         if (rsiChartRef.current) rsiChartRef.current.innerHTML = "";

//         // 🟢 Decide heights based on strategy
//         const priceHeight = strategy === "rsi" ? 400 : 600;

//         // ---------- Price Chart ----------
//         const priceChart = createChart(priceChartRef.current, {
//             layout: {
//                 background: { type: ColorType.Solid, color: "#0f172a" },
//                 textColor: "#fff",
//             },
//             width: priceChartRef.current.clientWidth,
//             height: priceHeight,
//             timeScale: { timeVisible: true, secondsVisible: true },
//         });

//         const candleSeries = priceChart.addSeries(CandlestickSeries);

//         const url = strategy
//             ? `https://predator-production.up.railway.app/api/strategy/${symbol}/${strategy}?interval=1d&limit=500`
//             : `https://predator-production.up.railway.app/api/strategy/candles/${symbol}?interval=1d&limit=500`;

//         let cancelled = false;

//         fetch(url)
//             .then((res) => res.json())
//             .then((data: ApiResponse) => {
//                 if (cancelled) return;

//                 candleSeries.setData(
//                     data.candles.map((c) => ({
//                         time: toSec(c.time),
//                         open: c.open,
//                         high: c.high,
//                         low: c.low,
//                         close: c.close,
//                     }))
//                 );

//                 if (data.smaShort && data.smaLong) {
//                     const smaConfig = [
//                         { values: data.smaShort, color: "blue" },
//                         { values: data.smaLong, color: "red" },
//                     ];

//                     smaConfig.forEach((cfg) => {
//                         const series = priceChart.addSeries(LineSeries, {
//                             color: cfg.color,
//                             lineWidth: 2,
//                         });

//                         let lastValue: number | null = null;
//                         const lineData = data.candles
//                             .map((c, i) => {
//                                 let v = cfg.values![i];
//                                 if (v === null || isNaN(v as number)) {
//                                     if (lastValue === null) return null;
//                                     v = lastValue;
//                                 } else {
//                                     lastValue = v;
//                                 }
//                                 return { time: toSec(c.time), value: v as number };
//                             })
//                             .filter(Boolean) as { time: UTCTimestamp; value: number }[];

//                         series.setData(lineData);
//                     });
//                 }

//                 if (data.signals && data.signals.length > 0) {
//                     data.signals.forEach((s) => {
//                         candleSeries.createPriceLine({
//                             price: s.price,
//                             color: s.type === "BUY" ? "green" : s.type === "SELL" ? "red" : "gray",
//                             lineStyle: LineStyle.Dashed,
//                             lineWidth: 1,
//                             axisLabelVisible: true,
//                             title: `${s.type} @${s.price}\n${s.reason}`,
//                         });
//                     });
//                 }
//             })
//             .catch((err) => console.error("Chart fetch error:", err));

//         // ---------- RSI chart only when strategy === "rsi" ----------
//         if (strategy === "rsi" && rsiChartRef.current) {
//             const rsiChart = createChart(rsiChartRef.current, {
//                 layout: {
//                     background: { type: ColorType.Solid, color: "#0f172a" },
//                     textColor: "#fff",
//                 },
//                 width: rsiChartRef.current.clientWidth,
//                 height: 200,
//                 timeScale: { timeVisible: true, secondsVisible: true },
//             });

//             const rsiSeries = rsiChart.addSeries(LineSeries, {
//                 color: "yellow",
//                 lineWidth: 2,
//             });

//             fetch(`https://predator-production.up.railway.app/api/strategy/${symbol}/rsi?interval=1d&limit=500`)
//                 .then((res) => res.json())
//                 .then((data) => {
//                     if (!data?.rsiSignals || !Array.isArray(data.rsiSignals)) return;

//                     const lineData = data.rsiSignals
//                         .filter((r: any) => Number.isFinite(r.rsi))
//                         .map((r: any) => ({
//                             time: toSec(r.time),
//                             value: r.rsi,
//                         }));

//                     rsiSeries.setData(lineData);

//                     [40, 60].forEach((lvl) => {
//                         rsiSeries.createPriceLine({
//                             price: lvl,
//                             color: lvl === 60 ? "red" : "green",
//                             lineStyle: LineStyle.Dashed,
//                             lineWidth: 1,
//                         });
//                     });
//                 })
//                 .catch((err) => console.error("RSI fetch error:", err));
//         }

//         const handleResize = () => {
//             priceChart.applyOptions({ width: priceChartRef.current!.clientWidth });
//         };
//         window.addEventListener("resize", handleResize);

//         return () => {
//             cancelled = true;
//             window.removeEventListener("resize", handleResize);
//             priceChart.remove();
//         };
//     }, [symbol, strategy]);

//     if (!symbol) {
//         return (
//             <div className="text-gray-500 flex items-center justify-center h-[600px]">
//                 Please select a commodity
//             </div>
//         );
//     }

//     return (
//         <div style={{ width: "100%" }}>
//             <div ref={priceChartRef} style={{ width: "100%", height: strategy === "rsi" ? "400px" : "600px" }} />
//             {strategy === "rsi" && <div ref={rsiChartRef} style={{ width: "100%", height: "200px" }} />}
//         </div>
//     );
// };

// export default Chart;


// import React, { useEffect, useRef } from "react";
// import {
//     createChart,
//     ColorType,
//     LineStyle,
//     CandlestickSeries,
//     LineSeries,
//     type UTCTimestamp,
// } from "lightweight-charts";

// interface Candle {
//     time: number;
//     open: number;
//     high: number;
//     low: number;
//     close: number;
// }

// interface Signal {
//     type: "BUY" | "SELL" | "NEUTRAL";
//     time: string;
//     price: number;
//     reason: string;
// }

// interface ApiResponse {
//     candles: Candle[];
//     smaShort?: Array<number | null>;
//     smaLong?: Array<number | null>;
//     signals?: Signal[];
// }

// const toSec = (ms: number): UTCTimestamp => Math.floor(ms / 1000) as UTCTimestamp;

// const Chart: React.FC<{ strategy: string | null; symbol: string }> = ({ strategy, symbol }) => {
//     const priceChartRef = useRef<HTMLDivElement>(null);
//     const rsiChartRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         if (!priceChartRef.current || !symbol) return;
//         priceChartRef.current.innerHTML = "";
//         if (rsiChartRef.current) rsiChartRef.current.innerHTML = "";

//         const priceHeight = strategy === "rsi" ? 400 : 600;

//         // ---------- Price Chart ----------
//         const priceChart = createChart(priceChartRef.current, {
//             layout: {
//                 background: { type: ColorType.Solid, color: "#0f172a" },
//                 textColor: "#fff",
//             },
//             width: priceChartRef.current.clientWidth,
//             height: priceHeight,
//             timeScale: { timeVisible: true, secondsVisible: true },
//         });

//         const candleSeries = priceChart.addSeries(CandlestickSeries);

//         const url = strategy
//             ? `https://predator-production.up.railway.app/api/strategy/${symbol}/${strategy}?interval=1d&limit=500`
//             : `https://predator-production.up.railway.app/api/strategy/candles/${symbol}?interval=1d&limit=500`;

//         let cancelled = false;

//         fetch(url)
//             .then((res) => res.json())
//             .then((data: ApiResponse) => {
//                 if (cancelled) return;

//                 // 🟢 Candles
//                 candleSeries.setData(
//                     data.candles.map((c) => ({
//                         time: toSec(c.time),
//                         open: c.open,
//                         high: c.high,
//                         low: c.low,
//                         close: c.close,
//                     }))
//                 );

//                 // 🟢 SMA Lines
//                 if (data.smaShort && data.smaLong) {
//                     const smaConfig = [
//                         { values: data.smaShort, color: "blue" },
//                         { values: data.smaLong, color: "red" },
//                     ];

//                     smaConfig.forEach((cfg) => {
//                         const series = priceChart.addSeries(LineSeries, {
//                             color: cfg.color,
//                             lineWidth: 2,
//                         });

//                         let lastValue: number | null = null;
//                         const lineData = data.candles
//                             .map((c, i) => {
//                                 let v = cfg.values![i];
//                                 if (v === null || isNaN(v as number)) {
//                                     if (lastValue === null) return null;
//                                     v = lastValue;
//                                 } else {
//                                     lastValue = v;
//                                 }
//                                 return { time: toSec(c.time), value: v as number };
//                             })
//                             .filter(Boolean) as { time: UTCTimestamp; value: number }[];

//                         series.setData(lineData);
//                     });
//                 }

//                 // 🟢 BUY/SELL Lines (price lines)
//                 if (data.signals && data.signals.length > 0) {
//                     data.signals.forEach((s) => {
//                         candleSeries.createPriceLine({
//                             price: s.price,
//                             color: s.type === "BUY" ? "green" : s.type === "SELL" ? "red" : "gray",
//                             lineStyle: LineStyle.Dashed,
//                             lineWidth: 1,
//                             axisLabelVisible: true,
//                             title: `${s.type} (${s.reason})`,
//                         });
//                     });
//                 }
//             })
//             .catch((err) => console.error("Chart fetch error:", err));

//         // ---------- RSI chart only when strategy === "rsi" ----------
//         if (strategy === "rsi" && rsiChartRef.current) {
//             const rsiChart = createChart(rsiChartRef.current, {
//                 layout: {
//                     background: { type: ColorType.Solid, color: "#0f172a" },
//                     textColor: "#fff",
//                 },
//                 width: rsiChartRef.current.clientWidth,
//                 height: 200,
//                 timeScale: { timeVisible: true, secondsVisible: true },
//             });

//             const rsiSeries = rsiChart.addSeries(LineSeries, {
//                 color: "yellow",
//                 lineWidth: 2,
//             });

//             fetch(`https://predator-production.up.railway.app/api/strategy/${symbol}/rsi?interval=1d&limit=500`)
//                 .then((res) => res.json())
//                 .then((data) => {
//                     if (!data?.rsiSignals || !Array.isArray(data.rsiSignals)) return;

//                     const lineData = data.rsiSignals
//                         .filter((r: any) => Number.isFinite(r.rsi))
//                         .map((r: any) => ({
//                             time: toSec(r.time),
//                             value: r.rsi,
//                         }));

//                     rsiSeries.setData(lineData);

//                     // RSI levels
//                     [40, 60].forEach((lvl) => {
//                         rsiSeries.createPriceLine({
//                             price: lvl,
//                             color: lvl === 60 ? "red" : "green",
//                             lineStyle: LineStyle.Dashed,
//                             lineWidth: 1,
//                         });
//                     });
//                 })
//                 .catch((err) => console.error("RSI fetch error:", err));
//         }

//         const handleResize = () => {
//             priceChart.applyOptions({ width: priceChartRef.current!.clientWidth });
//         };
//         window.addEventListener("resize", handleResize);

//         return () => {
//             cancelled = true;
//             window.removeEventListener("resize", handleResize);
//             priceChart.remove();
//         };
//     }, [symbol, strategy]);

//     if (!symbol) {
//         return (
//             <div className="text-gray-500 flex items-center justify-center h-[600px]">
//                 Please select a commodity
//             </div>
//         );
//     }

//     return (
//         <div style={{ width: "100%" }}>
//             <div ref={priceChartRef} style={{ width: "100%", height: strategy === "rsi" ? "400px" : "600px" }} />
//             {strategy === "rsi" && <div ref={rsiChartRef} style={{ width: "100%", height: "200px" }} />}
//         </div>
//     );
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

    useEffect(() => {
        if (!priceChartRef.current || !symbol) return;
        priceChartRef.current.innerHTML = "";
        if (rsiChartRef.current) rsiChartRef.current.innerHTML = "";

        const priceHeight = strategy === "rsi" ? 400 : 600;

        // ---------- PRICE CHART ----------
        const priceChart = createChart(priceChartRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: "#0f172a" },
                textColor: "#fff",
            },
            width: priceChartRef.current.clientWidth,
            height: priceHeight,
            timeScale: { timeVisible: true, secondsVisible: true },
        });

        const candleSeries = priceChart.addSeries(CandlestickSeries);
        const token = localStorage.getItem("token"); // token stored after login


        const url = strategy
            ? `https://predator-production.up.railway.app/api/strategy/${symbol}/${strategy}?interval=1d&limit=500`
            : `https://predator-production.up.railway.app/api/strategy/candles/${symbol}?interval=1d&limit=500`;

        let cancelled = false;

        fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, // ✅ send token here
            },
        })
            .then((res) => res.json())
            .then((data: ApiResponse) => {
                if (cancelled) return;

                // 🟢 Candles
                candleSeries.setData(
                    data.candles.map((c) => ({
                        time: toSec(c.time),
                        open: c.open,
                        high: c.high,
                        low: c.low,
                        close: c.close,
                    }))
                );

                // 🟢 SMA Lines
                if (data.smaShort && data.smaLong) {
                    const smaConfig = [
                        { values: data.smaShort, color: "blue" },
                        { values: data.smaLong, color: "red" },
                    ];

                    smaConfig.forEach((cfg) => {
                        const series = priceChart.addSeries(LineSeries, {
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

                // 🟢 BUY/SELL Lines from strategy signals
                if (data.signals && data.signals.length > 0) {
                    data.signals.forEach((s) => {
                        candleSeries.createPriceLine({
                            price: s.price,
                            color: s.type === "BUY" ? "green" : s.type === "SELL" ? "red" : "gray",
                            lineStyle: LineStyle.Dashed,
                            lineWidth: 1,
                            axisLabelVisible: true,
                            title: `${s.type} (${s.reason})`,
                        });
                    });
                }
            })
            .catch((err) => console.error("Chart fetch error:", err));

        // ---------- RSI CHART ----------
        let rsiChart: ReturnType<typeof createChart> | null = null;

        if (strategy === "rsi" && rsiChartRef.current) {
            rsiChart = createChart(rsiChartRef.current, {
                layout: {
                    background: { type: ColorType.Solid, color: "#0f172a" },
                    textColor: "#fff",
                },
                width: rsiChartRef.current.clientWidth,
                height: 200,
                timeScale: { timeVisible: true, secondsVisible: true },
            });

            const rsiSeries = rsiChart.addSeries(LineSeries, {
                color: "yellow",
                lineWidth: 2,
            });

            //     fetch(`https://predator-production.up.railway.app/api/strategy/${symbol}/rsi?interval=1d&limit=500`)
            //         .then((res) => res.json())
            //         .then((data) => {
            //             if (!data?.rsiSignals || !Array.isArray(data.rsiSignals)) return;

            //             const lineData = data.rsiSignals
            //                 .filter((r: any) => Number.isFinite(r.rsi))
            //                 .map((r: any) => ({
            //                     time: toSec(r.time),
            //                     value: r.rsi,
            //                 }));

            //             rsiSeries.setData(lineData);

            //             // RSI levels
            //             [40, 60].forEach((lvl) => {
            //                 rsiSeries.createPriceLine({
            //                     price: lvl,
            //                     color: lvl === 60 ? "red" : "green",
            //                     lineStyle: LineStyle.Dashed,
            //                     lineWidth: 1,
            //                 });
            //             });

            //             // 🟢 RSI BUY/SELL signals on price chart
            //             data.rsiSignals.forEach((r: any) => {
            //                 if (r.signal === "BUY" || r.signal === "SELL") {
            //                     candleSeries.createPriceLine({
            //                         price: r.close ?? r.price,
            //                         color: r.signal === "BUY" ? "green" : "red",
            //                         lineStyle: LineStyle.Dashed,
            //                         lineWidth: 1,
            //                         axisLabelVisible: true,
            //                         title: `${r.signal} (RSI)`,
            //                     });
            //                 }
            //             });
            //         })
            //         .catch((err) => console.error("RSI fetch error:", err));

            fetch(`https://predator-production.up.railway.app/api/strategy/${symbol}/rsi?interval=1d&limit=500`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // ✅ send token here
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log("📈 RSI API data:", data);

                    if (!data?.rsiSignals || !Array.isArray(data.rsiSignals)) return;

                    // 🟢 RSI line chart data
                    const lineData = data.rsiSignals
                        .filter((r: any) => Number.isFinite(r.rsi))
                        .map((r: any) => ({
                            time: toSec(r.time),
                            value: r.rsi,
                        }));
                    rsiSeries.setData(lineData);

                    // RSI threshold lines
                    [40, 60].forEach((lvl) => {
                        rsiSeries.createPriceLine({
                            price: lvl,
                            color: lvl === 60 ? "red" : "green",
                            lineStyle: LineStyle.Dashed,
                            lineWidth: 1,
                        });
                    });

                    // 🟢 Overlay BUY/SELL signals from RSI onto candle chart
                    if (data.candles && data.rsiSignals) {
                        const candleMap = new Map(
                            data.candles.map((c: any) => [Math.floor(c.time / 1000), c.close])
                        );

                        data.rsiSignals.forEach((r: any) => {
                            if (r.signal === "BUY" || r.signal === "SELL") {
                                const closePrice = candleMap.get(Math.floor(r.time / 1000));
                                if (typeof closePrice !== "number" || isNaN(closePrice)) return;

                                candleSeries.createPriceLine({
                                    price: closePrice,
                                    color: r.signal === "BUY" ? "green" : "red",
                                    lineStyle: LineStyle.Dashed,
                                    lineWidth: 1,
                                    axisLabelVisible: true,
                                    title: `${r.signal} (RSI ${r.rsi.toFixed(1)})`,
                                });
                            }
                        });
                    }
                })
                .catch((err) => console.error("RSI fetch error:", err));

        }


        // ---------- SYNC TIME SCALES ----------
        if (rsiChart) {
            priceChart.timeScale().subscribeVisibleTimeRangeChange(() => {
                const range = priceChart.timeScale().getVisibleRange();
                if (range) rsiChart!.timeScale().setVisibleRange(range);
            });
            rsiChart.timeScale().subscribeVisibleTimeRangeChange(() => {
                const range = rsiChart!.timeScale().getVisibleRange();
                if (range) priceChart.timeScale().setVisibleRange(range);
            });
        }

        // ---------- Resize ----------
        const handleResize = () => {
            priceChart.applyOptions({ width: priceChartRef.current!.clientWidth });
            if (rsiChart) rsiChart.applyOptions({ width: rsiChartRef.current!.clientWidth });
        };
        window.addEventListener("resize", handleResize);

        return () => {
            cancelled = true;
            window.removeEventListener("resize", handleResize);
            priceChart.remove();
            if (rsiChart) rsiChart.remove();
        };
    }, [symbol, strategy]);

    if (!symbol) {
        return (
            <div className="text-gray-500 flex items-center justify-center h-[600px]">
                Please select a commodity
            </div>
        );
    }

    return (
        <div style={{ width: "100%" }}>
            <div ref={priceChartRef} style={{ width: "100%", height: strategy === "rsi" ? "400px" : "600px" }} />
            {strategy === "rsi" && <div ref={rsiChartRef} style={{ width: "100%", height: "200px" }} />}
        </div>
    );
};

export default Chart;


