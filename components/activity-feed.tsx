"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, TrendingUp, TrendingDown } from "lucide-react"

const tabs = [
  { id: "trades", label: "Recent Trades" },
  { id: "positions", label: "Your Positions" },
  { id: "orders", label: "Open Orders" },
]

const mockTrades = [
  { time: "14:32:15", type: "buy", amount: "5.2 SOL", price: "$0.0428", user: "7x9K...mP2q" },
  { time: "14:32:12", type: "sell", amount: "12.8 SOL", price: "$0.0425", user: "9mK2...xR4t" },
  { time: "14:32:08", type: "buy", amount: "3.1 SOL", price: "$0.0430", user: "2qR4...8nM5" },
  { time: "14:32:05", type: "sell", amount: "8.7 SOL", price: "$0.0422", user: "5nM8...3pQ7" },
  { time: "14:31:58", type: "buy", amount: "2.3 SOL", price: "$0.0435", user: "8pQ7...4rT9" },
  { time: "14:31:55", type: "sell", amount: "15.1 SOL", price: "$0.0420", user: "4rT9...6sU2" },
  { time: "14:31:52", type: "buy", amount: "7.8 SOL", price: "$0.0433", user: "6sU2...1vW5" },
  { time: "14:31:49", type: "sell", amount: "4.5 SOL", price: "$0.0418", user: "1vW5...9xY8" },
]

export function ActivityFeed() {
  const [activeTab, setActiveTab] = useState("trades")

  return (
    <div className="min-h-[300px] max-h-[400px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gor-surface/30 flex-shrink-0">
        <div className="flex items-center space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-sm font-medium transition-colors ${
                activeTab === tab.id ? "text-gor-accent" : "text-gor-muted hover:text-gor-text"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Button variant="ghost" size="sm" className="text-gor-muted hover:text-gor-accent">
          <Activity className="w-4 h-4 mr-2" />
          Live Feed
        </Button>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {activeTab === "trades" && (
            <div className="space-y-3">
              {mockTrades.map((trade, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-gor-surface/30 rounded-xl hover:bg-gor-surface/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-2 h-2 rounded-full ${trade.type === "buy" ? "bg-gor-accent" : "bg-gor-error"}`}
                    />
                    <span className="text-sm text-gor-muted font-mono">{trade.time}</span>
                    <Badge variant={trade.type === "buy" ? "default" : "destructive"} className="rounded-lg">
                      {trade.type === "buy" ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {trade.type.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-6 text-sm">
                    <span className="font-mono">{trade.amount}</span>
                    <span className="font-mono text-gor-accent">{trade.price}</span>
                    <span className="text-gor-muted font-mono">{trade.user}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "positions" && (
            <div className="text-center py-12 text-gor-muted">
              <p>Connect wallet to view your positions</p>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="text-center py-12 text-gor-muted">
              <p>No open orders</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
