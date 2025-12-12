import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function cleanSymbol(input: string): string {
  if (!input) return "";

  // 1. Convert to uppercase for consistency
  let symbol = input.toUpperCase();

  // 2. Remove separators like "-" or "/"
  symbol = symbol.replace(/[-/]/g, "");

  // 3. Normalize common base currencies (USD, USDT, USDC)
  const bases = ["USD", "USDT", "USDC"];

  for (const base of bases) {
    if (symbol.endsWith(base)) {
      const asset = symbol.slice(0, -base.length);
      return asset + base;
    }
  }

  // 4. If it doesn't match known patterns, return cleaned string
  return symbol;
}

export function normalizeToUSDT(input: string): string {
  if (!input) return "";

  // Step 1: Uppercase everything
  let symbol = input.toUpperCase();

  // Step 2: Remove separators like "-" or "/"
  symbol = symbol.replace(/[-/]/g, "");

  // Step 3: Known quote currencies (we will replace with USDT)
  const knownQuotes = ["USDT", "USD", "USDC", "UST"];

  for (const quote of knownQuotes) {
    if (symbol.endsWith(quote)) {
      const base = symbol.slice(0, -quote.length);
      return base + "USDT";
    }
  }

  // Step 4: If no quote detected, assume input is just base
  return symbol + "USDT";
}
