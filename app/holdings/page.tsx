"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Eye,
  EyeOff,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useGlobalWallet } from "@/hooks/use-global-wallet"
import { WalletConnectPrompt } from "@/components/wallet-connect-prompt"

interface TokenHolding {
  mint: string
  name: string
  symbol: string
  amount: number
  decimals: number
  price?: number
  valueUSD?: number
  valueGOR?: number
  change24h?: number
  logo?: string
}

interface PortfolioStats {
  totalValueUSD: number
  totalValueGOR: number
  change24h: number
  change24hUSD: number
  topGainer?: TokenHolding
  topLoser?: TokenHolding
}

export default function HoldingsPage() {
  const { connected, publicKey, connection } = useGlobalWallet()
  const [holdings, setHoldings] = useState<TokenHolding[]>([])
  const [portfolioStats, setPortfolioStats] = useState<PortfolioStats>({
    totalValueUSD: 0,
    totalValueGOR: 0,
    change24h: 0,
    change24hUSD: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [hideBalances, setHideBalances] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("tokens")

  // Mock holdings data for demonstration
  const mockHoldings: TokenHolding[] = [
    {
      mint: "71Jvq4Epe2FCJ7JFSF7jLXdNk1Wy4Bhqd9iL6bEFELvg",
      name: "GorTrade Token",
      symbol: "GOR",
      amount: 15420.5,
      decimals: 9,
      price: 0.0428,
      valueUSD: 659.99,
      valueGOR: 15420.5,
      change24h: 12.5,
    },
    {
      mint: "9xK2mP3qR7tN8vW5bC4dE6fG1hJ0iL3mN5oP8qR2sT4u",
      name: "Gorbagana Coin",
      symbol: "GORB",
      amount: 8750.25,
      decimals: 6,
      price: 0.0156,
      valueUSD: 136.5,
      valueGOR: 3189.72,
      change24h: 45.2,
    },
    {
      mint: "3pQ7rT9sU2vW8xY1zA4bC5dE9fG2hI6jK8lM0nO5pQ3r",
      name: "Trash Panda",
      symbol: "TRASH",
      amount: 123456.789,
      decimals: 9,
      price: 0.0089,
      valueUSD: 1098.77,
      valueGOR: 25671.45,
      change24h: -8.3,
    },
    {
      mint: "6sU2vW5xY8zA1bC4dE7fG0hI3jK6lM9nO2pQ5rT8sU1v",
      name: "Degen Ape",
      symbol: "DAPE",
      amount: 2500.0,
      decimals: 9,
      price: 0.0234,
      valueUSD: 58.5,
      valueGOR: 1366.82,
      change24h: 23.7,
    },
    {
      mint: "So11111111111111111111111111111111111111112",
      name: "Wrapped SOL",
      symbol: "SOL",
      amount: 2.45,
      decimals: 9,
      price: 142.85,
      valueUSD: 349.98,
      valueGOR: 8177.57,
      change24h: 5.2,
    },
  ]

  useEffect(() => {
    if (connected && publicKey) {
      fetchHoldings()
    } else {
      // Show mock data for demonstration
      setHoldings(mockHoldings)
      calculatePortfolioStats(mockHoldings)
    }
  }, [connected, publicKey])

  const fetchHoldings = async () => {
    if (!connected || !publicKey) return

    setIsLoading(true)
    try {
      // In a real implementation, this would:
      // 1. Get all token accounts for the wallet
      // 2. Fetch token metadata for each mint
      // 3. Get current prices from DEX/Jupiter
      // 4. Calculate values and changes

      // For now, simulate API call and use mock data
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock implementation - in reality would call:
      // const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      //   programId: TOKEN_PROGRAM_ID
      // })

      setHoldings(mockHoldings)
      calculatePortfolioStats(mockHoldings)
    } catch (error) {
      console.error("Failed to fetch holdings:", error)
      // Fallback to mock data
      setHoldings(mockHoldings)
      calculatePortfolioStats(mockHoldings)
    } finally {
      setIsLoading(false)
    }
  }

  const calculatePortfolioStats = (holdings: TokenHolding[]) => {
    const totalValueUSD = holdings.reduce((sum, token) => sum + (token.valueUSD || 0), 0)
    const totalValueGOR = holdings.reduce((sum, token) => sum + (token.valueGOR || 0), 0)

    // Calculate weighted average 24h change
    const weightedChange = holdings.reduce((sum, token) => {
      const weight = (token.valueUSD || 0) / totalValueUSD
      return sum + (token.change24h || 0) * weight
    }, 0)

    const change24hUSD = totalValueUSD * (weightedChange / 100)

    // Find top gainer and loser
    const topGainer = holdings.reduce((max, token) => ((token.change24h || 0) > (max.change24h || 0) ? token : max))
    const topLoser = holdings.reduce((min, token) => ((token.change24h || 0) < (min.change24h || 0) ? token : min))

    setPortfolioStats({
      totalValueUSD,
      totalValueGOR,
      change24h: weightedChange,
      change24hUSD,
      topGainer,
      topLoser,
    })
  }

  const formatNumber = (num: number, decimals = 2) => {
    if (hideBalances) return "••••••"
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  }

  const formatCurrency = (num: number) => {
    if (hideBalances) return "$••••••"
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`
    }
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`
    }
    return `$${num.toFixed(2)}`
  }

  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address)
      setCopiedAddress(address)
      setTimeout(() => setCopiedAddress(null), 2000)
    } catch (err) {
      console.error("Failed to copy address:", err)
    }
  }

  if (!connected) {
    return (
      <WalletConnectPrompt
        title="Connect Your Wallet"
        description="Connect your wallet to view your portfolio on Gorbagana Chain"
        icon={<Wallet className="w-10 h-10 text-gor-muted" />}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gor-bg">
      {/* Header */}
      <div className="bg-gor-surface/30 backdrop-blur-xl border-b border-gor-surface/30 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gor-accent to-gor-teal bg-clip-text text-transparent">
                Portfolio
              </h1>
              <p className="text-gor-muted mt-2">Your holdings on Gorbagana Chain</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setHideBalances(!hideBalances)}
                className="border-gor-surface/50 hover:border-gor-accent/50"
              >
                {hideBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button
                onClick={fetchHoldings}
                disabled={isLoading}
                className="bg-gor-accent hover:bg-gor-teal text-gor-bg font-medium"
              >
                <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
                {isLoading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>

          {/* Portfolio Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gor-surface/50 backdrop-blur-xl border border-gor-surface/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gor-muted text-sm">Total Value</p>
                    <p className="text-2xl font-bold text-gor-accent">{formatCurrency(portfolioStats.totalValueUSD)}</p>
                    <p className="text-gor-muted text-sm mt-1">{formatNumber(portfolioStats.totalValueGOR)} GOR</p>
                  </div>
                  <div className="w-12 h-12 bg-gor-accent/20 rounded-2xl flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-gor-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gor-surface/50 backdrop-blur-xl border border-gor-surface/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gor-muted text-sm">24h Change</p>
                    <div className="flex items-center space-x-2">
                      <p
                        className={cn(
                          "text-2xl font-bold",
                          portfolioStats.change24h >= 0 ? "text-gor-accent" : "text-gor-error",
                        )}
                      >
                        {portfolioStats.change24h >= 0 ? "+" : ""}
                        {formatNumber(portfolioStats.change24h, 1)}%
                      </p>
                      {portfolioStats.change24h >= 0 ? (
                        <ArrowUpRight className="w-5 h-5 text-gor-accent" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5 text-gor-error" />
                      )}
                    </div>
                    <p className="text-gor-muted text-sm mt-1">
                      {portfolioStats.change24hUSD >= 0 ? "+" : ""}
                      {formatCurrency(Math.abs(portfolioStats.change24hUSD))}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center",
                      portfolioStats.change24h >= 0 ? "bg-gor-accent/20" : "bg-gor-error/20",
                    )}
                  >
                    <TrendingUp
                      className={cn("w-6 h-6", portfolioStats.change24h >= 0 ? "text-gor-accent" : "text-gor-error")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gor-surface/50 backdrop-blur-xl border border-gor-surface/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gor-muted text-sm">Top Gainer</p>
                    <p className="text-lg font-bold">{portfolioStats.topGainer?.symbol || "N/A"}</p>
                    <p className="text-gor-accent text-sm mt-1">
                      +{formatNumber(portfolioStats.topGainer?.change24h || 0, 1)}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gor-accent/20 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-gor-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gor-surface/50 backdrop-blur-xl border border-gor-surface/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gor-muted text-sm">Top Loser</p>
                    <p className="text-lg font-bold">{portfolioStats.topLoser?.symbol || "N/A"}</p>
                    <p className="text-gor-error text-sm mt-1">
                      {formatNumber(portfolioStats.topLoser?.change24h || 0, 1)}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gor-error/20 rounded-2xl flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-gor-error" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gor-surface/50 rounded-xl p-1 mb-8">
            <TabsTrigger
              value="tokens"
              className="data-[state=active]:bg-gor-accent data-[state=active]:text-gor-bg rounded-lg"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Tokens ({holdings.length})
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-gor-accent data-[state=active]:text-gor-bg rounded-lg"
            >
              <PieChart className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-gor-accent data-[state=active]:text-gor-bg rounded-lg"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tokens">
            {isLoading ? (
              <Card className="bg-gor-surface/50 backdrop-blur-xl border border-gor-surface/30">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 animate-pulse">
                        <div className="w-12 h-12 bg-gor-surface rounded-2xl" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gor-surface rounded w-1/4" />
                          <div className="h-3 bg-gor-surface rounded w-1/6" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gor-surface rounded w-20" />
                          <div className="h-3 bg-gor-surface rounded w-16" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gor-surface/50 backdrop-blur-xl border border-gor-surface/30">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Token Holdings</span>
                    <Badge variant="outline" className="border-gor-accent text-gor-accent">
                      {holdings.length} tokens
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gor-surface/30">
                          <TableHead>Token</TableHead>
                          <TableHead>Symbol</TableHead>
                          <TableHead className="text-right">Amount Held</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Value (USD)</TableHead>
                          <TableHead className="text-right">Value (GOR)</TableHead>
                          <TableHead className="text-right">24h Change</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {holdings.map((token) => (
                          <TableRow key={token.mint} className="border-gor-surface/30 hover:bg-gor-surface/20">
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-gor-accent to-gor-teal rounded-xl flex items-center justify-center">
                                  <span className="text-gor-bg font-bold text-sm">{token.symbol.charAt(0)}</span>
                                </div>
                                <div>
                                  <p className="font-medium">{token.name}</p>
                                  <div className="flex items-center space-x-2">
                                    <p className="text-gor-muted text-xs font-mono">
                                      {token.mint.slice(0, 8)}...{token.mint.slice(-8)}
                                    </p>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyAddress(token.mint)}
                                      className="h-4 w-4 p-0"
                                    >
                                      {copiedAddress === token.mint ? (
                                        <Check className="w-3 h-3 text-gor-accent" />
                                      ) : (
                                        <Copy className="w-3 h-3 text-gor-muted" />
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-gor-surface/50">
                                {token.symbol}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {formatNumber(token.amount, token.decimals > 6 ? 2 : token.decimals)}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {token.price ? `$${token.price.toFixed(6)}` : "N/A"}
                            </TableCell>
                            <TableCell className="text-right font-mono font-medium">
                              {formatCurrency(token.valueUSD || 0)}
                            </TableCell>
                            <TableCell className="text-right font-mono text-gor-accent">
                              {formatNumber(token.valueGOR || 0)} GOR
                            </TableCell>
                            <TableCell className="text-right">
                              {token.change24h !== undefined && (
                                <div
                                  className={cn(
                                    "flex items-center justify-end space-x-1",
                                    token.change24h >= 0 ? "text-gor-accent" : "text-gor-error",
                                  )}
                                >
                                  {token.change24h >= 0 ? (
                                    <TrendingUp className="w-3 h-3" />
                                  ) : (
                                    <TrendingDown className="w-3 h-3" />
                                  )}
                                  <span className="font-medium">
                                    {token.change24h >= 0 ? "+" : ""}
                                    {formatNumber(token.change24h, 1)}%
                                  </span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button asChild size="sm" className="bg-gor-accent hover:bg-gor-teal text-gor-bg">
                                  <Link href={`/trade/${token.mint}`}>Trade</Link>
                                </Button>
                                <Button variant="outline" size="sm" className="border-gor-surface/50">
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="bg-gor-surface/50 backdrop-blur-xl border border-gor-surface/30">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gor-surface/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <PieChart className="w-10 h-10 text-gor-muted" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Portfolio Analytics</h3>
                <p className="text-gor-muted">Advanced portfolio analytics and allocation charts coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-gor-surface/50 backdrop-blur-xl border border-gor-surface/30">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gor-surface/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-10 h-10 text-gor-muted" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Transaction History</h3>
                <p className="text-gor-muted">Portfolio performance history and transaction tracking coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
