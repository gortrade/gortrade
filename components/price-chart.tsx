"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, MoreHorizontal } from "lucide-react"

export function PriceChart() {
  const [timeframe, setTimeframe] = useState("1H")

  const timeframes = ["1M", "5M", "15M", "1H", "4H", "1D", "1W"]

  return (
    <div className="h-full flex flex-col">
      {/* Chart Header */}
      <div className="flex items-center justify-between p-6 border-b border-gor-surface/50">
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-2xl font-bold text-gor-accent">$142.85</h2>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gor-muted">SOL/USDC</span>
              <Badge className="bg-gor-accent/20 text-gor-accent border-gor-accent/30">
                <TrendingUp className="w-3 h-3 mr-1" />
                +5.24%
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {timeframes.map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeframe(tf)}
              className={
                timeframe === tf ? "bg-gor-accent text-gor-bg hover:bg-gor-teal" : "text-gor-muted hover:text-gor-text"
              }
            >
              {tf}
            </Button>
          ))}
          <Button variant="ghost" size="icon" className="text-gor-muted">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gor-bg to-gor-surface/20">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gor-accent/20 rounded-full flex items-center justify-center mx-auto">
            <TrendingUp className="w-8 h-8 text-gor-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">TradingView Chart Integration</h3>
            <p className="text-gor-muted text-sm">Advanced charting with technical indicators</p>
            <p className="text-gor-muted text-xs mt-1">Real-time data from Gorbagana Chain DEX</p>
          </div>
        </div>
      </div>
    </div>
  )
}
