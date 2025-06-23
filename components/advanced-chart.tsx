"use client"

import { useState } from "react"
import { TradingViewChart } from "@/components/tradingview-chart"
import { LightweightChart } from "@/components/lightweight-chart"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Settings, Maximize2 } from "lucide-react"

export function AdvancedChart() {
  const [chartType, setChartType] = useState<"tradingview" | "lightweight" | "simple">("tradingview")
  const [timeframe, setTimeframe] = useState("1H")

  const timeframes = ["1M", "5M", "15M", "1H", "4H", "1D"]

  // Simple fallback chart component
  const SimpleChart = () => (
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
            onClick={() => setChartType("tradingview")}
            className="text-gor-muted hover:text-gor-accent"
          >
            Try TradingView
          </Button>
          <Button variant="ghost" size="icon" className="text-gor-muted hover:text-gor-accent">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gor-muted hover:text-gor-accent">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Simple Chart Visualization */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gor-bg/50 to-transparent relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00FF88" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Mock Chart Line */}
        <div className="relative w-full h-full max-w-4xl max-h-80">
          <svg className="w-full h-full" viewBox="0 0 800 300">
            <path
              d="M 50 250 Q 150 200 250 180 T 450 160 T 650 140 T 750 120"
              stroke="#00FF88"
              strokeWidth="3"
              fill="none"
              className="drop-shadow-lg"
            />
            <path
              d="M 50 250 Q 150 200 250 180 T 450 160 T 650 140 T 750 120 L 750 300 L 50 300 Z"
              fill="url(#gradient)"
              opacity="0.2"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00FF88" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#00FF88" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Price Points */}
            <circle cx="150" cy="200" r="4" fill="#00FF88" className="animate-pulse" />
            <circle cx="350" cy="170" r="4" fill="#00FF88" className="animate-pulse" />
            <circle cx="550" cy="150" r="4" fill="#00FF88" className="animate-pulse" />
            <circle cx="750" cy="120" r="4" fill="#00FF88" className="animate-pulse" />
          </svg>
        </div>

        {/* Chart Info Overlay */}
        <div className="absolute top-6 left-6 bg-gor-surface/80 backdrop-blur-xl rounded-xl p-4 border border-gor-surface/30">
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-2xl font-bold text-gor-accent">$0.0428</p>
              <div className="flex items-center space-x-2 mt-1">
                <TrendingUp className="w-4 h-4 text-gor-accent" />
                <span className="text-sm text-gor-accent font-medium">+12.5%</span>
              </div>
            </div>
            <div className="text-sm text-gor-muted">
              <p>24h High: $0.0445</p>
              <p>24h Low: $0.0398</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (chartType === "tradingview") {
    return <TradingViewChart />
  }

  if (chartType === "lightweight") {
    return <LightweightChart />
  }

  return <SimpleChart />
}
