📌 Technical Analysis Chart – To-Do List
✅ Core Charting (Completed / In Progress)

 Candlestick price chart (Lightweight Charts)

 Timeframe switching (1m → 1W)

 Crosshair sync & tooltips

 Responsive resizing

 Price overlay indicators (SMA, EMA, Bollinger Bands)

 Clean indicator toggle system

📊 Indicator Panels

 RSI chart with 30 / 70 reference lines

 MACD chart (MACD, Signal, Histogram)

 ADX chart

 ATR chart

 Independent tooltips per indicator chart

🧠 Indicator Intelligence (Advanced Logic)

 RSI state detection (Overbought / Oversold / Neutral)

 MACD state analysis

Direction (Bullish / Bearish)

Momentum (Weak / Moderate / Strong)

Condition (Momentum / Convergence)

 ADX trend strength classification

 ATR volatility classification (percentage-based)

📐 RSI Divergence System

 RSI swing high / low detection

 Bullish & Bearish divergence detection

 Divergence line rendering on RSI chart

 Divergence labels on RSI axis

 Multiple RSI divergence stacking (latest prioritized, older faded) ✅

 Prevent label overlap using vertical offsets

 Limit visible divergences to reduce noise

🎨 Visual & UX Improvements

 Improve divergence label positioning (avoid clipping at edges)

 Add configurable padding for RSI price lines

 Fade divergences based on age

 Optional icons or markers for divergence points

 Smooth animation on indicator toggle on/off

🔗 Cross-Indicator Correlation (Upcoming)

 Confirm RSI divergence with MACD state

 Suppress divergence if ADX trend is very strong

 Sync RSI divergence confidence with ADX

Show high-confidence divergence only when ADX < 20

Mark divergence as “Low Reliability” when ADX ≥ 20

Optionally fade divergence line when ADX ≥ 25

 Highlight “High-confidence signals” only

 Add combined signal badge (RSI + MACD + ADX)

📈 Price Chart Enhancements

 Draw divergence lines on price chart (optional)

 Highlight divergence candles

 Add price target / invalidation levels

 Support future indicators (VWAP, Supertrend, Ichimoku)

⚙️ Configuration & Scalability

 Indicator sensitivity config per timeframe

 Divergence lookback tuning

 Max divergences per timeframe

 Persist user indicator preferences

 Export chart snapshot

🧪 Stability & Performance

 Clean up unused series on toggle off

 Memory leak checks (chart destroy lifecycle)

 Debounce crosshair events if needed

 Large dataset performance testing

🚀 Final Polishing

 Mobile optimizations

 Dark/light theme toggle

 Accessibility improvements

 Production hardening
