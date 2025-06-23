"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings } from "lucide-react"

export function TradingSidebar() {
  const [orderType, setOrderType] = useState("Market")
  const [amount, setAmount] = useState("0.0")

  const presetAmounts = ["0.01", "0.1", "1", "10"]

  return (
    <div className="h-full flex flex-col">
      {/* Trading Controls */}
      <div className="p-4 border-b border-gor-surface/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">36K</h3>
          <Button variant="ghost" size="icon" className="text-gor-muted hover:text-gor-text">
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Buy/Sell Toggle */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Button className="bg-gor-accent hover:bg-gor-teal text-gor-bg font-medium">Buy</Button>
          <Button variant="outline" className="border-gor-surface text-gor-muted hover:text-gor-text">
            Sell
          </Button>
        </div>

        {/* Order Type Tabs */}
        <Tabs value={orderType} onValueChange={setOrderType} className="mb-4">
          <TabsList className="grid w-full grid-cols-3 bg-gor-bg h-8">
            <TabsTrigger
              value="Market"
              className="text-xs data-[state=active]:bg-gor-accent data-[state=active]:text-gor-bg"
            >
              Market
            </TabsTrigger>
            <TabsTrigger
              value="Limit"
              className="text-xs data-[state=active]:bg-gor-accent data-[state=active]:text-gor-bg"
            >
              Limit
            </TabsTrigger>
            <TabsTrigger
              value="Adv"
              className="text-xs data-[state=active]:bg-gor-accent data-[state=active]:text-gor-bg"
            >
              Adv.
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Amount Input */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gor-muted">AMOUNT</span>
              <span className="text-xs text-gor-muted">0.0</span>
            </div>
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gor-bg border-gor-surface text-center font-mono"
              placeholder="0.0"
            />
          </div>

          {/* Preset Amount Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {presetAmounts.map((preset) => (
              <Button
                key={preset}
                variant="outline"
                size="sm"
                onClick={() => setAmount(preset)}
                className="border-gor-surface text-gor-muted hover:text-gor-text hover:border-gor-accent text-xs h-8"
              >
                {preset}
              </Button>
            ))}
          </div>

          {/* Slippage & Settings */}
          <div className="flex items-center justify-between text-xs text-gor-muted">
            <span>% 20%</span>
            <span>📊 0.001 ⚠️</span>
            <span>⚠️ 0.001</span>
            <span>⚙️ Off</span>
          </div>
        </div>

        {/* Advanced Trading Strategy */}
        <div className="mt-4 p-3 bg-gor-bg rounded-lg">
          <div className="text-sm font-medium mb-2">Advanced Trading Strategy</div>
        </div>

        {/* Buy Button */}
        <Button className="w-full mt-4 bg-gor-accent hover:bg-gor-teal text-gor-bg font-medium h-12">Buy GORT</Button>
      </div>

      {/* Position Info */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xs text-gor-muted mb-1">Bought</div>
            <div className="text-sm font-mono text-gor-accent">$410.8</div>
          </div>
          <div>
            <div className="text-xs text-gor-muted mb-1">Sold</div>
            <div className="text-sm font-mono text-gor-error">$52.1</div>
          </div>
          <div>
            <div className="text-xs text-gor-muted mb-1">Holding</div>
            <div className="text-sm font-mono">$1.49K</div>
          </div>
          <div>
            <div className="text-xs text-gor-muted mb-1">Pnl</div>
            <div className="text-sm font-mono text-gor-accent">+$113K (+275%)</div>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" className="border-gor-surface text-gor-muted hover:text-gor-text">
            PRESET 1
          </Button>
          <Button variant="outline" size="sm" className="border-gor-surface text-gor-muted hover:text-gor-text">
            PRESET 2
          </Button>
          <Button variant="outline" size="sm" className="border-gor-surface text-gor-muted hover:text-gor-text">
            PRESET 3
          </Button>
        </div>

        {/* Token Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Token Info</span>
            <Button variant="ghost" size="sm" className="text-gor-muted hover:text-gor-text h-6 px-2">
              ⚙️
            </Button>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gor-muted">🔥 24.45%</span>
              <span className="text-gor-accent">✅ 0%</span>
              <span className="text-gor-accent">⬆️ 0.18%</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gor-muted">
              <span>Top 10 H.</span>
              <span>Dev H.</span>
              <span>Snipers H.</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gor-accent">📊 3.17%</span>
              <span className="text-gor-error">🔥 10.3%</span>
              <span className="text-gor-accent">⬆️ 100%</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gor-muted">
              <span>Insiders</span>
              <span>Bundlers</span>
              <span>LP Burned</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
