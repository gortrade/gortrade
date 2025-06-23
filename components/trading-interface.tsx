"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

export function TradingInterface() {
  const [orderType, setOrderType] = useState("market")
  const [amount, setAmount] = useState("")
  const [price, setPrice] = useState("")

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Trade</h3>
        <Badge variant="outline" className="border-gor-accent text-gor-accent">
          SOL/USDC
        </Badge>
      </div>

      <Tabs defaultValue="spot" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-gor-bg">
          <TabsTrigger value="spot" className="data-[state=active]:bg-gor-accent data-[state=active]:text-gor-bg">
            Spot
          </TabsTrigger>
          <TabsTrigger value="perps" className="data-[state=active]:bg-gor-accent data-[state=active]:text-gor-bg">
            Perpetuals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="spot" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label className="text-gor-muted">Order Type</Label>
              <Select value={orderType} onValueChange={setOrderType}>
                <SelectTrigger className="bg-gor-bg border-gor-surface">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gor-surface border-gor-surface">
                  <SelectItem value="market">Market</SelectItem>
                  <SelectItem value="limit">Limit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {orderType === "limit" && (
              <div>
                <Label className="text-gor-muted">Price (USDC)</Label>
                <Input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="bg-gor-bg border-gor-surface"
                />
              </div>
            )}

            <div>
              <Label className="text-gor-muted">Amount (SOL)</Label>
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="bg-gor-bg border-gor-surface"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button className="bg-gor-accent hover:bg-gor-teal text-gor-bg font-medium">
                <TrendingUp className="w-4 h-4 mr-2" />
                Buy SOL
              </Button>
              <Button variant="destructive" className="bg-gor-error hover:bg-gor-error/80">
                <TrendingDown className="w-4 h-4 mr-2" />
                Sell SOL
              </Button>
            </div>

            <div className="text-xs text-gor-muted space-y-1">
              <div className="flex justify-between">
                <span>Available Balance:</span>
                <span>1,234.56 USDC</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Fee:</span>
                <span>~0.25%</span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="perps" className="space-y-4">
          <div className="text-center py-8 text-gor-muted">
            <p>Perpetuals trading coming soon...</p>
            <p className="text-sm mt-2">Long/short positions with leverage</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
