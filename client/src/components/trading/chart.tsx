// import { useEffect, useRef } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// export function TradingChart() {
//   const chartRef = useRef<HTMLCanvasElement>(null);
//   const chartInstance = useRef<any>(null);

//   useEffect(() => {
//     const initChart = async () => {
//       // Dynamically import Chart.js to avoid SSR issues
//       const { Chart, registerables } = await import('chart.js');
//       Chart.register(...registerables);

//       if (chartRef.current) {
//         const ctx = chartRef.current.getContext('2d');
//         if (ctx) {
//           // Destroy existing chart if it exists
//           if (chartInstance.current) {
//             chartInstance.current.destroy();
//           }

//           // Create new chart with sample data
//           chartInstance.current = new Chart(ctx, {
//             type: 'line',
//             data: {
//               labels: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
//               datasets: [{
//                 label: 'Price',
//                 data: [1940, 1942, 1945, 1943, 1948, 1945, 1947, 1945],
//                 borderColor: 'hsl(var(--trading-success))',
//                 backgroundColor: 'hsla(var(--trading-success), 0.1)',
//                 borderWidth: 2,
//                 fill: true,
//                 tension: 0.4
//               }]
//             },
//             options: {
//               responsive: true,
//               maintainAspectRatio: false,
//               plugins: {
//                 legend: {
//                   display: false
//                 }
//               },
//               scales: {
//                 y: {
//                   ticks: {
//                     color: '#94A3B8'
//                   },
//                   grid: {
//                     color: '#374151'
//                   }
//                 },
//                 x: {
//                   ticks: {
//                     color: '#94A3B8'
//                   },
//                   grid: {
//                     color: '#374151'
//                   }
//                 }
//               }
//             }
//           });
//         }
//       }
//     };

//     initChart();

//     return () => {
//       if (chartInstance.current) {
//         chartInstance.current.destroy();
//       }
//     };
//   }, []);

//   return (
//     <Card className="bg-trading-card border-gray-700">
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <CardTitle className="text-xl font-semibold text-white">
//             Price Chart - Gold (XAU/USD)
//           </CardTitle>
//           <div className="flex space-x-2">
//             <Button size="sm" className="bg-trading-success text-white" data-testid="button-timeframe-1h">1H</Button>
//             <Button size="sm" variant="outline" className="bg-trading-dark text-gray-400 border-gray-600" data-testid="button-timeframe-4h">4H</Button>
//             <Button size="sm" variant="outline" className="bg-trading-dark text-gray-400 border-gray-600" data-testid="button-timeframe-1d">1D</Button>
//             <Button size="sm" variant="outline" className="bg-trading-dark text-gray-400 border-gray-600" data-testid="button-timeframe-1w">1W</Button>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="chart-container">
//           <canvas ref={chartRef} data-testid="chart-canvas"></canvas>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }


import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TradingChartProps {
  commodity: string | null; // ✅ selected commodity from sidebar
}

export function TradingChart({ commodity }: TradingChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    const initChart = async () => {
      const { Chart, registerables } = await import("chart.js");
      Chart.register(...registerables);

      if (chartRef.current) {
        const ctx = chartRef.current.getContext("2d");
        if (ctx) {
          if (chartInstance.current) {
            chartInstance.current.destroy();
          }

          // ✅ Fake sample data per commodity (replace with API fetch later)
          const sampleData: Record<string, number[]> = {
            "XAU/USD": [1940, 1942, 1945, 1943, 1948, 1945, 1947, 1945],
            "XAG/USD": [24, 24.2, 24.5, 24.3, 24.8, 24.5, 24.7, 24.6],
            WTI: [72, 73, 71, 74, 75, 74, 73, 72],
            NG: [2.6, 2.7, 2.8, 2.65, 2.75, 2.7, 2.8, 2.9],
          };

          const chartData =
            commodity && sampleData[commodity]
              ? sampleData[commodity]
              : sampleData["XAU/USD"]; // default Gold

          chartInstance.current = new Chart(ctx, {
            type: "line",
            data: {
              labels: [
                "09:00",
                "10:00",
                "11:00",
                "12:00",
                "13:00",
                "14:00",
                "15:00",
                "16:00",
              ],
              datasets: [
                {
                  label: "Price",
                  data: chartData,
                  borderColor: "hsl(var(--trading-success))",
                  backgroundColor: "hsla(var(--trading-success), 0.1)",
                  borderWidth: 2,
                  fill: true,
                  tension: 0.4,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  ticks: {
                    color: "#94A3B8",
                  },
                  grid: {
                    color: "#374151",
                  },
                },
                x: {
                  ticks: {
                    color: "#94A3B8",
                  },
                  grid: {
                    color: "#374151",
                  },
                },
              },
            },
          });
        }
      }
    };

    initChart();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [commodity]); // ✅ re-render when commodity changes

  return (
    <Card className="bg-trading-card border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-white">
            Price Chart - {commodity || "XAU/USD"}
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              size="sm"
              className="bg-trading-success text-white"
              data-testid="button-timeframe-1h"
            >
              1H
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-trading-dark text-gray-400 border-gray-600"
              data-testid="button-timeframe-4h"
            >
              4H
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-trading-dark text-gray-400 border-gray-600"
              data-testid="button-timeframe-1d"
            >
              1D
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-trading-dark text-gray-400 border-gray-600"
              data-testid="button-timeframe-1w"
            >
              1W
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="chart-container h-[400px]">
          <canvas ref={chartRef} data-testid="chart-canvas"></canvas>
        </div>
      </CardContent>
    </Card>
  );
}
