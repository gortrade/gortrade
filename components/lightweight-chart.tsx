"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { BarChart3, Settings, Maximize2 } from "lucide-react"

export function LightweightChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [timeframe, setTimeframe] = useState("1H")
  const [isLoading, setIsLoading] = useState(true)

  const timeframes = ["1M", "5M", "15M", "1H", "4H", "1D"]

  // Mock price data for demonstration
  const mockData = [
    { time: "2024-01-01", open: 0.042, high: 0.0435, low: 0.0415, close: 0.0428 },
    { time: "2024-01-02", open: 0.0428, high: 0.0445, low: 0.0422, close: 0.0441 },
    { time: "2024-01-03", open: 0.0441, high: 0.0458, low: 0.0438, close: 0.0452 },
    { time: "2024-01-04", open: 0.0452, high: 0.0465, low: 0.0448, close: 0.0461 },
    { time: "2024-01-05", open: 0.0461, high: 0.0478, low: 0.0455, close: 0.0472 },
  ]

  useEffect(() => {
    const loadLightweightCharts = async () => {
      try {
        // Dynamically import lightweight-charts
        const { createChart } = await import("lightweight-charts")

        if (chartContainerRef.current) {
          const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 400,
            layout: {
              background: { color: "#0C0C0F" },
              textColor: "#F2F2F2",
            },
            grid: {
              vertLines: { color: "#16161A" },
              horzLines: { color: "#16161A" },
            },
            crosshair: {
              mode: 1,
            },
            rightPriceScale: {
              borderColor: "#16161A",
            },
            timeScale: {
              borderColor: "#16161A",
            },
          })

          const candlestickSeries = chart.addCandlestickSeries({
            upColor: "#00FF88",
            downColor: "#FF4D4D",
            borderDownColor: "#FF4D4D",
            borderUpColor: "#00FF88",
            wickDownColor: "#FF4D4D",
            wickUpColor: "#00FF88",
          })

          candlestickSeries.setData(mockData)

          // Handle resize
          const handleResize = () => {
            if (chartContainerRef.current) {
              chart.applyOptions({
                width: chartContainerRef.current.clientWidth,
              })
            }
          }

          window.addEventListener("resize", handleResize)
          setIsLoading(false)

          return () => {
            window.removeEventListener("resize", handleResize)
            chart.remove()
          }
        }
      } catch (error) {
        console.error("Failed to load lightweight charts:", error)
        setIsLoading(false)
      }
    }

    loadLightweightCharts()
  }, [timeframe])

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
              <p className="text-gor-muted">Loading Chart...</p>
            </div>
          </div>
        )}
        <div ref={chartContainerRef} className="w-full h-full min-h-[400px]" />
      </div>
    </div>
  )
}
