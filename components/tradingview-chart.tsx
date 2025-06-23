"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { BarChart3, Settings, Maximize2, TrendingUp, ExternalLink } from "lucide-react"

declare global {
  interface Window {
    TradingView: any
  }
}

export function TradingViewChart() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [timeframe, setTimeframe] = useState("1H")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [chartMode, setChartMode] = useState<"tradingview" | "custom">("tradingview")

  const timeframes = ["1M", "5M", "15M", "1H", "4H", "1D"]

  // GOR token contract address
  const GOR_CONTRACT = "71Jvq4Epe2FCJ7JFSF7jLXdNk1Wy4Bhqd9iL6bEFELvg"

  useEffect(() => {
    if (chartMode === "custom") {
      setIsLoading(false)
      return
    }

    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
    script.type = "text/javascript"
    script.async = true

    // Use GORUSDT symbol for TradingView
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "GORUSDT", // Correct GOR/USDT symbol
      interval:
        timeframe === "1M"
          ? "1"
          : timeframe === "5M"
            ? "5"
            : timeframe === "15M"
              ? "15"
              : timeframe === "1H"
                ? "60"
                : timeframe === "4H"
                  ? "240"
                  : "D",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      enable_publishing: false,
      backgroundColor: "rgba(12, 12, 15, 1)",
      gridColor: "rgba(22, 22, 26, 0.3)",
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      calendar: false,
      hide_volume: false,
      support_host: "https://www.tradingview.com",
      overrides: {
        "paneProperties.background": "#0C0C0F",
        "paneProperties.vertGridProperties.color": "#16161A",
        "paneProperties.horzGridProperties.color": "#16161A",
        "symbolWatermarkProperties.transparency": 90,
        "scalesProperties.textColor": "#F2F2F2",
        "mainSeriesProperties.candleStyle.upColor": "#00FF88",
        "mainSeriesProperties.candleStyle.downColor": "#FF4D4D",
        "mainSeriesProperties.candleStyle.drawWick": true,
        "mainSeriesProperties.candleStyle.drawBorder": true,
        "mainSeriesProperties.candleStyle.borderUpColor": "#00FF88",
        "mainSeriesProperties.candleStyle.borderDownColor": "#FF4D4D",
        "mainSeriesProperties.candleStyle.wickUpColor": "#00FF88",
        "mainSeriesProperties.candleStyle.wickDownColor": "#FF4D4D",
        volumePaneSize: "medium",
      },
    })

    script.onload = () => {
      setIsLoading(false)
    }

    script.onerror = () => {
      setError(true)
      setIsLoading(false)
    }

    if (containerRef.current) {
      containerRef.current.innerHTML = ""
      containerRef.current.appendChild(script)
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [timeframe, chartMode])

  // Custom GOR Chart Component (fallback)
  const CustomGORChart = () => (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gor-bg/50 to-transparent relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#00FF88" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Advanced GOR Price Chart */}
      <div className="relative w-full h-full max-w-5xl max-h-96">
        <svg className="w-full h-full" viewBox="0 0 1000 400">
          {/* Price Line Chart */}
          <defs>
            <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00FF88" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00FF88" stopOpacity="0.05" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Main price curve */}
          <path
            d="M 50 300 Q 150 280 200 260 T 300 240 T 400 220 T 500 200 T 600 180 T 700 160 T 800 140 T 900 120"
            stroke="#00FF88"
            strokeWidth="3"
            fill="none"
            filter="url(#glow)"
            className="animate-pulse"
          />

          {/* Fill area under curve */}
          <path
            d="M 50 300 Q 150 280 200 260 T 300 240 T 400 220 T 500 200 T 600 180 T 700 160 T 800 140 T 900 120 L 900 350 L 50 350 Z"
            fill="url(#priceGradient)"
          />

          {/* Candlestick data points */}
          <g className="candlesticks">
            {/* Sample candlesticks for GOR */}
            <g transform="translate(100, 0)">
              <rect x="-3" y="270" width="6" height="20" fill="#00FF88" />
              <line x1="0" y1="260" x2="0" y2="300" stroke="#00FF88" strokeWidth="2" />
            </g>
            <g transform="translate(200, 0)">
              <rect x="-3" y="250" width="6" height="25" fill="#00FF88" />
              <line x1="0" y1="240" x2="0" y2="285" stroke="#00FF88" strokeWidth="2" />
            </g>
            <g transform="translate(300, 0)">
              <rect x="-3" y="230" width="6" height="15" fill="#FF4D4D" />
              <line x1="0" y1="220" x2="0" y2="255" stroke="#FF4D4D" strokeWidth="2" />
            </g>
            <g transform="translate(400, 0)">
              <rect x="-3" y="210" width="6" height="30" fill="#00FF88" />
              <line x1="0" y1="200" x2="0" y2="250" stroke="#00FF88" strokeWidth="2" />
            </g>
            <g transform="translate(500, 0)">
              <rect x="-3" y="190" width="6" height="25" fill="#00FF88" />
              <line x1="0" y1="180" x2="0" y2="225" stroke="#00FF88" strokeWidth="2" />
            </g>
          </g>

          {/* Volume bars */}
          <g className="volume" transform="translate(0, 320)">
            <rect x="95" y="0" width="10" height="20" fill="#00FF88" opacity="0.6" />
            <rect x="195" y="0" width="10" height="35" fill="#00FF88" opacity="0.6" />
            <rect x="295" y="0" width="10" height="15" fill="#FF4D4D" opacity="0.6" />
            <rect x="395" y="0" width="10" height="40" fill="#00FF88" opacity="0.6" />
            <rect x="495" y="0" width="10" height="25" fill="#00FF88" opacity="0.6" />
          </g>

          {/* Price markers */}
          <g className="price-markers">
            <circle cx="500" cy="200" r="5" fill="#00FF88" className="animate-ping" />
            <circle cx="500" cy="200" r="3" fill="#00FF88" />
          </g>

          {/* Time axis labels */}
          <g className="time-labels" fill="#999999" fontSize="12" textAnchor="middle">
            <text x="100" y="380">
              09:00
            </text>
            <text x="300" y="380">
              12:00
            </text>
            <text x="500" y="380">
              15:00
            </text>
            <text x="700" y="380">
              18:00
            </text>
            <text x="900" y="380">
              21:00
            </text>
          </g>

          {/* Price axis labels */}
          <g className="price-labels" fill="#999999" fontSize="12" textAnchor="end">
            <text x="45" y="125">
              $0.045
            </text>
            <text x="45" y="175">
              $0.040
            </text>
            <text x="45" y="225">
              $0.035
            </text>
            <text x="45" y="275">
              $0.030
            </text>
            <text x="45" y="325">
              $0.025
            </text>
          </g>
        </svg>
      </div>

      {/* GOR Token Info Overlay */}
      <div className="absolute top-6 left-6 bg-gor-surface/90 backdrop-blur-xl rounded-2xl p-6 border border-gor-surface/50 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-gor-accent to-gor-teal rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-gor-bg font-bold text-xl">G</span>
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h3 className="text-2xl font-bold text-gor-accent">$0.0428</h3>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-gor-accent" />
                <span className="text-sm text-gor-accent font-medium">+12.5%</span>
              </div>
            </div>
            <p className="text-gor-muted text-sm mt-1">GOR/USDT • Live Data</p>
            <p className="text-gor-muted text-xs font-mono mt-1">{GOR_CONTRACT.slice(0, 12)}...</p>
          </div>
        </div>
      </div>

      {/* Trading Stats */}
      <div className="absolute top-6 right-6 bg-gor-surface/90 backdrop-blur-xl rounded-2xl p-4 border border-gor-surface/50 shadow-2xl">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gor-muted">24h High</p>
            <p className="font-semibold text-gor-accent">$0.0445</p>
          </div>
          <div>
            <p className="text-gor-muted">24h Low</p>
            <p className="font-semibold text-gor-error">$0.0398</p>
          </div>
          <div>
            <p className="text-gor-muted">Volume</p>
            <p className="font-semibold">$8.9M</p>
          </div>
          <div>
            <p className="text-gor-muted">Liquidity</p>
            <p className="font-semibold">$2.1M</p>
          </div>
        </div>
      </div>

      {/* Chart Mode Toggle */}
      <div className="absolute bottom-6 right-6 bg-gor-surface/90 backdrop-blur-xl rounded-xl p-3 border border-gor-surface/50">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setChartMode("tradingview")}
            className="text-gor-muted hover:text-gor-accent text-xs"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            TradingView
          </Button>
          <div className="w-px h-4 bg-gor-surface" />
          <span className="text-xs text-gor-accent">Custom GOR Chart</span>
        </div>
      </div>
    </div>
  )

  if (chartMode === "custom" || error) {
    return (
      <div className="h-full min-h-[500px] flex flex-col">
        {/* Chart Header */}
        <div className="flex items-center justify-between p-6 border-b border-gor-surface/30 flex-shrink-0">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="text-gor-muted hover:text-gor-accent">
                <BarChart3 className="w-4 h-4 mr-2" />
                Indicators
              </Button>
              <Button variant="ghost" size="sm" className="text-gor-muted hover:text-gor-accent">
                Drawing Tools
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              {timeframes.map((tf) => (
                <Button
                  key={tf}
                  variant={timeframe === tf ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimeframe(tf)}
                  className={
                    timeframe === tf
                      ? "bg-gor-accent text-gor-bg hover:bg-gor-teal rounded-lg"
                      : "text-gor-muted hover:text-gor-accent rounded-lg"
                  }
                >
                  {tf}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChartMode("tradingview")}
              className="text-gor-muted hover:text-gor-accent"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              TradingView
            </Button>
            <Button variant="ghost" size="icon" className="text-gor-muted hover:text-gor-accent">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gor-muted hover:text-gor-accent">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <CustomGORChart />
      </div>
    )
  }

  return (
    <div className="h-full min-h-[500px] flex flex-col">
      {/* Chart Header */}
      <div className="flex items-center justify-between p-6 border-b border-gor-surface/30 flex-shrink-0">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="text-gor-muted hover:text-gor-accent">
              <BarChart3 className="w-4 h-4 mr-2" />
              Indicators
            </Button>
            <Button variant="ghost" size="sm" className="text-gor-muted hover:text-gor-accent">
              Drawing Tools
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            {timeframes.map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeframe(tf)}
                className={
                  timeframe === tf
                    ? "bg-gor-accent text-gor-bg hover:bg-gor-teal rounded-lg"
                    : "text-gor-muted hover:text-gor-accent rounded-lg"
                }
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setChartMode("custom")}
            className="text-gor-muted hover:text-gor-accent"
          >
            Custom Chart
          </Button>
          <div className="text-sm text-gor-accent font-medium">
            <span className="font-mono">GOR/USDT</span>
          </div>
          <Button variant="ghost" size="icon" className="text-gor-muted hover:text-gor-accent">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gor-muted hover:text-gor-accent">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gor-bg/50 backdrop-blur-sm z-10">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-gor-accent/20 border-t-gor-accent rounded-full animate-spin mx-auto" />
              <p className="text-gor-muted">Loading GOR/USDT Chart...</p>
              <p className="text-xs text-gor-accent font-mono">GORUSDT</p>
            </div>
          </div>
        )}
        <div ref={containerRef} className="w-full h-full min-h-[400px]" style={{ height: "100%" }} />
      </div>
    </div>
  )
}
