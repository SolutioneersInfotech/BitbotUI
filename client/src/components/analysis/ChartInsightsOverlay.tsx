import { Badge } from "@/components/ui/badge";

export function ChartInsightsOverlay({ insights }: { insights: string[] }) {
  if (!insights.length) return null;

  return (
    <div className="absolute bottom-4 right-4 w-64 rounded-xl bg-slate-900/90 border border-slate-700 p-4 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
          Insights
        </p>
        <Badge className="bg-slate-700/40 text-gray-200">Live</Badge>
      </div>
      <ul className="space-y-2 text-xs text-gray-200">
        {insights.slice(0, 5).map((insight) => (
          <li key={insight} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>{insight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
