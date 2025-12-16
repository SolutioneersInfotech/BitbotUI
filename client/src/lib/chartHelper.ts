export function getMacdState(
  macd: number,
  signal: number,
  hist: number
) {
  const direction = macd >= 0 ? "Bullish" : "Bearish";

  let momentum = "Weak";
  const absHist = Math.abs(hist);

  if (absHist > 0.5) momentum = "Strong";
  else if (absHist > 0.2) momentum = "Moderate";

  let condition = "Neutral";

  if (macd > signal && hist > 0) condition = "Bullish Momentum";
  else if (macd < signal && hist < 0) condition = "Bearish Momentum";
  else if (hist > 0 && macd < signal) condition = "Bullish Convergence";
  else if (hist < 0 && macd > signal) condition = "Bearish Convergence";

  return {
    direction,
    momentum,
    condition,
  };
};

export function getRsiState(rsi: number) {
  if (rsi >= 70) {
    return { label: "Overbought", color: "#ef4444" }; // red
  }
  if (rsi <= 30) {
    return { label: "Oversold", color: "#22c55e" }; // green
  }
  return null; // gray
}

function findRsiSwings(
  rsi: number[],
  timestamps: number[],
  lookback = 3 // 👈 less strict
) {
  const highs = [];
  const lows = [];

  for (let i = lookback; i < rsi.length - lookback; i++) {
    let isHigh = true;
    let isLow = true;

    for (let j = 1; j <= lookback; j++) {
      if (rsi[i] <= rsi[i - j] || rsi[i] <= rsi[i + j]) {
        isHigh = false;
      }
      if (rsi[i] >= rsi[i - j] || rsi[i] >= rsi[i + j]) {
        isLow = false;
      }
    }

    if (isHigh) {
      highs.push({ time: timestamps[i], value: rsi[i], index: i });
    }

    if (isLow) {
      lows.push({ time: timestamps[i], value: rsi[i], index: i });
    }
  }

  return { highs, lows };
}


export function detectRsiDivergence({
  rsi,
  timestamps,
  closes,
}: {
  rsi: number[];
  timestamps: number[];
  closes: number[];
}) {
  const { highs, lows } = findRsiSwings(rsi, timestamps);

  // Need at least 2 swings
  if (highs.length >= 2) {
    const [prev, curr] = highs.slice(-2);

    if (
      closes[curr.index] > closes[prev.index] && // higher high in price
      curr.value < prev.value // lower high in RSI
    ) {
      return {
        type: "bearish" as const,
        from: prev,
        to: curr,
      };
    }
  }

  if (lows.length >= 2) {
    const [prev, curr] = lows.slice(-2);

    if (
      closes[curr.index] < closes[prev.index] && // lower low in price
      curr.value > prev.value // higher low in RSI
    ) {
      return {
        type: "bullish" as const,
        from: prev,
        to: curr,
      };
    }
  }

  return null;
}
