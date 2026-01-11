import { AlertTriangle, CheckCircle2 } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type MarketBias = "bullish" | "bearish" | "neutral" | "range";

export type SummaryPillTone =
  | "neutral"
  | "positive"
  | "negative"
  | "warn"
  | "info";

export type SummaryPill = { label: string; tone?: SummaryPillTone };

export interface MarketAnalysisSummaryData {
  biasLabel: string;
  confidencePct: number;
  bullishFactors: string[];
  riskFactors: string[];
  statePills?: SummaryPill[];
  takeaway?: string;
}

interface MarketAnalysisSummaryCardProps {
  data: MarketAnalysisSummaryData;
  showFallbackBadge?: boolean;
}

const toneClasses: Record<SummaryPillTone, string> = {
  neutral: "border-slate-500/40 bg-slate-500/10 text-slate-200",
  positive: "border-emerald-500/40 bg-emerald-500/15 text-emerald-200",
  negative: "border-rose-500/40 bg-rose-500/15 text-rose-200",
  warn: "border-amber-500/40 bg-amber-500/15 text-amber-200",
  info: "border-sky-500/40 bg-sky-500/15 text-sky-200",
};

const getBiasTone = (label: string): SummaryPillTone => {
  const normalized = label.toLowerCase();
  if (normalized.includes("bull")) return "positive";
  if (normalized.includes("bear")) return "negative";
  if (normalized.includes("range")) return "info";
  return "neutral";
};

const clampConfidence = (value: number) =>
  Math.min(100, Math.max(0, Math.round(value)));

interface PillProps {
  label: string;
  tone?: SummaryPillTone;
}

function Pill({ label, tone = "neutral" }: PillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${toneClasses[tone]}`}
    >
      {label}
    </span>
  );
}

interface FactorListProps {
  title: string;
  items: string[];
  iconType: "bullish" | "risk";
}

function FactorList({ title, items, iconType }: FactorListProps) {
  const Icon = iconType === "bullish" ? CheckCircle2 : AlertTriangle;
  const iconClass =
    iconType === "bullish" ? "text-emerald-400" : "text-rose-400";

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {title}
      </h4>
      {items.length > 0 ? (
        <ul className="space-y-2 text-sm text-gray-300">
          {items.map((item, index) => (
            <li key={`${title}-${index}`} className="flex min-w-0 gap-2">
              <Icon
                className={`mt-0.5 h-4 w-4 flex-shrink-0 ${iconClass}`}
                aria-hidden="true"
              />
              <span className="break-words text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-gray-500">No signals.</p>
      )}
    </div>
  );
}

export function MarketAnalysisSummaryCard({
  data,
  showFallbackBadge = false,
}: MarketAnalysisSummaryCardProps) {
  const confidence = clampConfidence(data.confidencePct);
  const statePills = data.statePills?.filter((pill) => Boolean(pill?.label)) ?? [];

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold text-white">
            Market Analysis Summary
          </h3>
          {showFallbackBadge && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-[10px] uppercase tracking-wide text-amber-200/80 border border-amber-400/30 rounded-full px-2 py-0.5">
                    Fallback summary
                  </span>
                </TooltipTrigger>
                <TooltipContent className="bg-trading-card border border-gray-700 text-gray-200 text-xs">
                  Using fallback analysis while live summary loads.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Pill label={data.biasLabel} tone={getBiasTone(data.biasLabel)} />
          <Pill label={`${confidence}%`} tone="neutral" />
        </div>
      </div>

      {statePills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {statePills.slice(0, 3).map((pill, index) => (
            <Pill
              key={`${pill.label}-${index}`}
              label={pill.label}
              tone={pill.tone ?? "neutral"}
            />
          ))}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 md:grid md:grid-cols-2">
        <FactorList
          title="Bullish"
          items={data.bullishFactors ?? []}
          iconType="bullish"
        />
        <FactorList
          title="Risk"
          items={data.riskFactors ?? []}
          iconType="risk"
        />
      </div>

      {data.takeaway && (
        <div className="border-t border-gray-700/60 pt-3 text-xs text-gray-400">
          {data.takeaway}
        </div>
      )}
    </div>
  );
}
