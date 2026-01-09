import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { SymbolNewsResponse } from "@/sources/analysis-source";
import { RefreshCw } from "lucide-react";

const sentimentStyles = {
  positive: "bg-emerald-500/20 text-emerald-200",
  negative: "bg-rose-500/20 text-rose-200",
  neutral: "bg-slate-500/20 text-slate-200",
};

const impactStyles = {
  high: "bg-orange-500/20 text-orange-200",
  medium: "bg-amber-500/20 text-amber-200",
  low: "bg-slate-500/20 text-slate-200",
};

type NewsPanelProps = {
  news?: SymbolNewsResponse;
  isLoading: boolean;
  onRefresh: () => void;
};

export function NewsPanel({ news, isLoading, onRefresh }: NewsPanelProps) {
  return (
    <Card className="bg-trading-card border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-white">
          Market News
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          className="text-gray-400 hover:text-white"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {news?.warning && (
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
            {news.warning}
          </div>
        )}
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div key={`news-skeleton-${index}`} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))
          : (news?.items ?? []).slice(0, 8).map((item) => (
              <div
                key={`${item.title}-${item.publishedAt}`}
                className="rounded-lg border border-gray-800/70 bg-slate-950/40 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-white">
                    {item.title}
                  </p>
                  <Badge className={sentimentStyles[item.sentiment]}>
                    {item.sentiment}
                  </Badge>
                </div>
                <p className="text-xs text-gray-400 mt-1">{item.source}</p>
                <p className="text-xs text-gray-300 mt-2">{item.summary}</p>
                <div className="flex items-center justify-between mt-3">
                  <Badge className={impactStyles[item.impact]}>
                    {item.impact} impact
                  </Badge>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-trading-info hover:underline"
                  >
                    Read more
                  </a>
                </div>
              </div>
            ))}
        {!isLoading && (news?.items?.length ?? 0) === 0 && (
          <p className="text-sm text-gray-400">No news available.</p>
        )}
      </CardContent>
    </Card>
  );
}
