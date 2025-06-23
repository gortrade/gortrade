"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Settings } from "lucide-react"

const tabs = [
  { id: "trades", label: "Trades", count: null },
  { id: "positions", label: "Positions", count: null },
  { id: "orders", label: "Orders", count: 0 },
  { id: "holders", label: "Holders", count: 129 },
  { id: "top-traders", label: "Top Traders", count: null },
  { id: "dev-tokens", label: "Dev Tokens", count: 1 },
]

export function BottomTabs() {
  const [activeTab, setActiveTab] = useState("trades")

  return (
    <div className="h-12 bg-gor-surface border-t border-gor-surface/50 flex items-center justify-between px-6">
      {/* Left - Tabs */}
      <div className="flex items-center space-x-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
              activeTab === tab.id ? "text-gor-accent" : "text-gor-muted hover:text-gor-text"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <Badge variant="outline" className="border-gor-surface text-gor-muted text-xs h-5">
                {tab.count}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Right - Actions */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="text-gor-accent hover:text-gor-teal">
          <Zap className="w-4 h-4 mr-2" />
          Instant Trade
        </Button>

        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gor-muted">Trades Panel</span>
          <span className="text-gor-muted">DEV</span>
          <span className="text-gor-muted">YOU</span>
        </div>

        <Button variant="ghost" size="icon" className="text-gor-muted hover:text-gor-text">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
