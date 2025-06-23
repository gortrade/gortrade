"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Zap, Wallet } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGlobalWallet } from "@/hooks/use-global-wallet"
import { UniversalWalletButton } from "@/components/universal-wallet-button"

export function TradingPanel() {
  const [amount, setAmount] = useState("")
  const [orderType, setOrderType] = useState("market")
  const { connected, publicKey } = useGlobalWallet()

  const quickAmounts = [0.1, 0.5, 1.0, 5.0]

  const [sellToken, setSellToken] = useState("")
  const [sellAmount, setSellAmount] = useState("")
  const [sellOrderType, setSellOrderType] = useState("market")
  const [sellPrice, setSellPrice] = useState("")

  // Helper functions for sell functionality
  const getTokenBalance = (token: string): string => {
    const balances = {
      GOR: "15420.5",
      SOL: "2.45",
      GORB: "8750.25",
      TRASH: "123456.78",
    }
    return balances[token as keyof typeof balances] || "0"
  }

  const getTokenPrice = (token: string): number => {
    const prices = {
      GOR: 0.0428,
      SOL: 142.85,
      GORB: 0.0156,
      TRASH: 0.0089,
    }
    return prices[token as keyof typeof prices] || 0
  }

  const calculatePercentageAmount = (token: string, percentage: number): string => {
    const balance = Number.parseFloat(getTokenBalance(token))
    const amount = (balance * percentage) / 100
    return amount.toFixed(token === "SOL" ? 4 : 2)
  }

  return (
    <div className="h-full min-h-[500px] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gor-surface/30 flex-shrink-0">
        <h2 className="text-xl font-semibold">Trade GOR</h2>
        <p className="text-gor-muted text-sm mt-1">Instant DEX execution</p>
      </div>

      {/* Trading Form - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {!connected ? (
            <div className="text-center py-12 space-y-4">
              <Wallet className="w-16 h-16 mx-auto text-gor-muted opacity-50" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
                <p className="text-gor-muted mb-6">Connect your wallet to start trading on Gorbagana Chain</p>
                <UniversalWalletButton />
              </div>
            </div>
          ) : (
            <>
              {/* Buy/Sell Toggle */}
              <Tabs defaultValue="buy" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 bg-gor-bg/50 rounded-xl p-1">
                  <TabsTrigger
                    value="buy"
                    className="data-[state=active]:bg-gor-accent data-[state=active]:text-gor-bg rounded-lg font-medium"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Buy
                  </TabsTrigger>
                  <TabsTrigger
                    value="sell"
                    className="data-[state=active]:bg-gor-error data-[state=active]:text-white rounded-lg font-medium"
                  >
                    <TrendingDown className="w-4 h-4 mr-2" />
                    Sell
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="buy" className="space-y-6">
                  {/* Order Type */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gor-muted">Order Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={orderType === "market" ? "default" : "outline"}
                        onClick={() => setOrderType("market")}
                        className={
                          orderType === "market"
                            ? "bg-gor-accent text-gor-bg hover:bg-gor-teal"
                            : "border-gor-surface/50 hover:border-gor-accent/50"
                        }
                      >
                        Market
                      </Button>
                      <Button
                        variant={orderType === "limit" ? "default" : "outline"}
                        onClick={() => setOrderType("limit")}
                        className={
                          orderType === "limit"
                            ? "bg-gor-accent text-gor-bg hover:bg-gor-teal"
                            : "border-gor-surface/50 hover:border-gor-accent/50"
                        }
                      >
                        Limit
                      </Button>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gor-muted">Amount (SOL)</label>
                    <Input
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.0"
                      className="bg-gor-bg/50 border-gor-surface/50 focus:border-gor-accent/50 rounded-xl text-lg font-mono text-center"
                    />
                    <div className="grid grid-cols-4 gap-2">
                      {quickAmounts.map((amt) => (
                        <Button
                          key={amt}
                          variant="outline"
                          size="sm"
                          onClick={() => setAmount(amt.toString())}
                          className="border-gor-surface/50 hover:border-gor-accent/50 hover:text-gor-accent rounded-lg"
                        >
                          {amt}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Trade Button */}
                  <Button
                    disabled={!amount || Number.parseFloat(amount) <= 0}
                    className="w-full bg-gradient-to-r from-gor-accent to-gor-teal hover:from-gor-teal hover:to-gor-accent text-gor-bg font-semibold py-4 rounded-xl shadow-lg shadow-gor-accent/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Buy GOR
                  </Button>

                  {/* Trade Info */}
                  <div className="space-y-3 p-4 bg-gor-bg/30 rounded-xl">
                    <div className="flex justify-between text-sm">
                      <span className="text-gor-muted">Est. Price Impact</span>
                      <span className="text-gor-accent">~0.12%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gor-muted">Network Fee</span>
                      <span>~0.0001 SOL</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gor-muted">Route</span>
                      <span className="text-gor-accent">Jupiter</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="sell" className="space-y-6">
                  {/* Token Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gor-muted">Select Token to Sell</label>
                    <Select value={sellToken} onValueChange={setSellToken}>
                      <SelectTrigger className="bg-gor-bg/50 border-gor-surface/50 focus:border-gor-accent/50 rounded-xl">
                        <SelectValue placeholder="Choose token to sell" />
                      </SelectTrigger>
                      <SelectContent className="bg-gor-surface border-gor-surface/50">
                        <SelectItem value="GOR">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-gradient-to-br from-gor-accent to-gor-teal rounded-lg flex items-center justify-center">
                              <span className="text-gor-bg font-bold text-xs">G</span>
                            </div>
                            <div>
                              <span className="font-medium">GOR</span>
                              <span className="text-gor-muted text-sm ml-2">Balance: 15,420.5</span>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="SOL">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-xs">S</span>
                            </div>
                            <div>
                              <span className="font-medium">SOL</span>
                              <span className="text-gor-muted text-sm ml-2">Balance: 2.45</span>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="GORB">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-xs">G</span>
                            </div>
                            <div>
                              <span className="font-medium">GORB</span>
                              <span className="text-gor-muted text-sm ml-2">Balance: 8,750.25</span>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="TRASH">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-xs">T</span>
                            </div>
                            <div>
                              <span className="font-medium">TRASH</span>
                              <span className="text-gor-muted text-sm ml-2">Balance: 123,456.78</span>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {sellToken && (
                    <>
                      {/* Order Type */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gor-muted">Order Type</label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant={sellOrderType === "market" ? "default" : "outline"}
                            onClick={() => setSellOrderType("market")}
                            className={
                              sellOrderType === "market"
                                ? "bg-gor-error text-white hover:bg-gor-error/80"
                                : "border-gor-surface/50 hover:border-gor-error/50"
                            }
                          >
                            Market
                          </Button>
                          <Button
                            variant={sellOrderType === "limit" ? "default" : "outline"}
                            onClick={() => setSellOrderType("limit")}
                            className={
                              sellOrderType === "limit"
                                ? "bg-gor-error text-white hover:bg-gor-error/80"
                                : "border-gor-surface/50 hover:border-gor-error/50"
                            }
                          >
                            Limit
                          </Button>
                        </div>
                      </div>

                      {/* Limit Price (only for limit orders) */}
                      {sellOrderType === "limit" && (
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gor-muted">Limit Price (USDC)</label>
                          <Input
                            value={sellPrice}
                            onChange={(e) => setSellPrice(e.target.value)}
                            placeholder="0.0000"
                            className="bg-gor-bg/50 border-gor-surface/50 focus:border-gor-error/50 rounded-xl text-lg font-mono text-center"
                          />
                        </div>
                      )}

                      {/* Amount */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium text-gor-muted">Amount ({sellToken})</label>
                          <span className="text-xs text-gor-muted">
                            Available: {getTokenBalance(sellToken)} {sellToken}
                          </span>
                        </div>
                        <Input
                          value={sellAmount}
                          onChange={(e) => setSellAmount(e.target.value)}
                          placeholder="0.0"
                          className="bg-gor-bg/50 border-gor-surface/50 focus:border-gor-error/50 rounded-xl text-lg font-mono text-center"
                        />
                        <div className="grid grid-cols-4 gap-2">
                          {[25, 50, 75, 100].map((percentage) => (
                            <Button
                              key={percentage}
                              variant="outline"
                              size="sm"
                              onClick={() => setSellAmount(calculatePercentageAmount(sellToken, percentage))}
                              className="border-gor-surface/50 hover:border-gor-error/50 hover:text-gor-error rounded-lg"
                            >
                              {percentage}%
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Sell Button */}
                      <Button
                        disabled={
                          !sellAmount ||
                          Number.parseFloat(sellAmount) <= 0 ||
                          Number.parseFloat(sellAmount) > Number.parseFloat(getTokenBalance(sellToken))
                        }
                        className="w-full bg-gradient-to-r from-gor-error to-red-600 hover:from-red-600 hover:to-gor-error text-white font-semibold py-4 rounded-xl shadow-lg shadow-gor-error/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <TrendingDown className="w-5 h-5 mr-2" />
                        Sell {sellToken}
                      </Button>

                      {/* Trade Info */}
                      <div className="space-y-3 p-4 bg-gor-bg/30 rounded-xl">
                        <div className="flex justify-between text-sm">
                          <span className="text-gor-muted">Est. Receive</span>
                          <span className="text-gor-accent">
                            {sellAmount && !isNaN(Number.parseFloat(sellAmount))
                              ? `~${(Number.parseFloat(sellAmount) * getTokenPrice(sellToken)).toFixed(4)} USDC`
                              : "-- USDC"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gor-muted">Est. Price Impact</span>
                          <span className="text-gor-error">~0.15%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gor-muted">Network Fee</span>
                          <span>~0.0001 SOL</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gor-muted">Route</span>
                          <span className="text-gor-accent">Jupiter</span>
                        </div>
                      </div>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>

      {/* Portfolio Summary - Fixed at bottom */}
      {connected && (
        <div className="p-6 border-t border-gor-surface/30 bg-gor-bg/20 flex-shrink-0">
          <h3 className="font-medium mb-4">Portfolio</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gor-muted">Balance</p>
              <p className="font-semibold">-- SOL</p>
            </div>
            <div>
              <p className="text-gor-muted">GOR Holdings</p>
              <p className="font-semibold text-gor-accent">-- GOR</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
