import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useMemo, useRef } from "react";
import type { NewsItem } from "@/sources/analysis-source";
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
  newsItems: NewsItem[];
  warning?: string;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasMore: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
};

export function NewsPanel({
  newsItems,
  warning,
  isLoading,
  isFetchingNextPage,
  hasMore,
  onRefresh,
  onLoadMore,
}: NewsPanelProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const canObserve = useMemo(
    () => hasMore && !isLoading && !isFetchingNextPage,
    [hasMore, isLoading, isFetchingNextPage]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const container = containerRef.current;
    if (!sentinel || !container || !canObserve) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      {
        root: container,
        threshold: 0.2,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [canObserve, onLoadMore]);

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
        {warning && (
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
            {warning}
          </div>
        )}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={`news-skeleton-${index}`} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={containerRef}
            className="max-h-[420px] space-y-3 overflow-y-auto pr-2"
          >
            {newsItems.map((item) => (
              <a
                key={`${item.title}-${item.publishedAt}`}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-lg border border-gray-800/70 bg-slate-950/40 p-3 transition hover:border-trading-info/70 hover:bg-slate-950/70"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-white">
                    {item.title}
                  </p>
                  <Badge className={sentimentStyles[item.sentiment]}>
                    {item.sentiment}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-gray-400">{item.source}</p>
                <p className="mt-2 text-xs text-gray-300">{item.summary}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-300">
                  <Badge className={impactStyles[item.impact]}>
                    {item.impact} impact
                  </Badge>
                  <span className="text-trading-info">Open story →</span>
                </div>
              </a>
            ))}
            <div ref={sentinelRef} />
            {isFetchingNextPage && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-full" />
              </div>
            )}
          </div>
        )}
        {!isLoading && newsItems.length === 0 && (
          <p className="text-sm text-gray-400">No news available.</p>
        )}
        {!isLoading && !hasMore && newsItems.length > 0 && (
          <p className="text-xs text-gray-500">You are all caught up.</p>
        )}
      </CardContent>
    </Card>
  );
}
