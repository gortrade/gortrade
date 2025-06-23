"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Crown,
  Medal,
  Award,
  Target,
  Zap,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  Users,
  DollarSign,
  Percent,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useGlobalWallet } from "@/hooks/use-global-wallet"

interface LeaderboardEntry {
  rank: number
  wallet: string
  username?: string
  pfp?: string
  totalPnL: number
  winRate: number
  totalVolume: number
  tradesCount: number
  tokensDiversity: number
  avgTradeSize: number
  bestTrade: number
  worstTrade: number
  streak: number
  gorHoldings: number
  title?: string
  isVerified?: boolean
  change24h?: number
}

interface LeaderboardStats {
  totalTraders: number
  totalVolume: number
  avgWinRate: number
  topPnL: number
}

export default function LeaderboardPage() {
  const { connected, publicKey } = useGlobalWallet()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [stats, setStats] = useState<LeaderboardStats>({
    totalTraders: 0,
    totalVolume: 0,
    avgWinRate: 0,
    topPnL: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [timeframe, setTimeframe] = useState("7d")
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  // Mock leaderboard data
  const mockLeaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      wallet: "7x9K2mP3qR7tN8vW5bC4dE6fG1hJ0iL3mN5oP8qR2sT4u",
      username: "TrashSniper",
      totalPnL: 342.5,
      winRate: 88.2,
      totalVolume: 12300,
      tradesCount: 156,
      tokensDiversity: 23,
      avgTradeSize: 78.8,
      bestTrade: 89.4,
      worstTrade: -12.3,
      streak: 12,
      gorHoldings: 15420,
      title: "Diamond Hands",
      isVerified: true,
      change24h: 15.2,
    },
    {
      rank: 2,
      wallet: "9mK2xR4tN5vW8zA1bC4dE7fG0hI3jK6lM9nO2pQ5rT8s",
      username: "DegenLord",
      totalPnL: 287.3,
      winRate: 73.4,
      totalVolume: 9100,
      tradesCount: 203,
      tokensDiversity: 18,
      avgTradeSize: 44.8,
      bestTrade: 67.2,
      worstTrade: -23.1,
      streak: 8,
      gorHoldings: 8750,
      title: "Volume King",
      isVerified: true,
      change24h: 8.7,
    },
    {
      rank: 3,
      wallet: "2qR4tN8vW5xY1zA4bC5dE9fG2hI6jK8lM0nO3pQ7rT9s",
      username: "Paperbag",
      totalPnL: 240.1,
      winRate: 65.8,
      totalVolume: 6800,
      tradesCount: 89,
      tokensDiversity: 31,
      avgTradeSize: 76.4,
      bestTrade: 124.5,
      worstTrade: -8.9,
      streak: 5,
      gorHoldings: 12340,
      title: "Token Hunter",
      isVerified: false,
      change24h: -2.3,
    },
    {
      rank: 4,
      wallet: "5nM8pQ7rT0sU3vW6xY9zA2bC5dE8fG1hI4jK7lM0nO4p",
      username: "MoonFarmer",
      totalPnL: 198.7,
      winRate: 71.2,
      totalVolume: 5400,
      tradesCount: 134,
      tokensDiversity: 15,
      avgTradeSize: 40.3,
      bestTrade: 45.8,
      worstTrade: -18.4,
      streak: 3,
      gorHoldings: 6780,
      title: "Steady Eddie",
      isVerified: false,
      change24h: 12.1,
    },
    {
      rank: 5,
      wallet: "8pQ7rT9sU2vW5xY8zA1bC4dE7fG0hI3jK6lM9nO2pQ6r",
      username: "ChadTrader",
      totalPnL: 156.9,
      winRate: 82.1,
      totalVolume: 4200,
      tradesCount: 67,
      tokensDiversity: 12,
      avgTradeSize: 62.7,
      bestTrade: 78.3,
      worstTrade: -5.2,
      streak: 15,
      gorHoldings: 9870,
      title: "Precision Sniper",
      isVerified: true,
      change24h: 22.4,
    },
    {
      rank: 6,
      wallet: "4rT9sU2vW8xY1zA4bC5dE9fG2hI6jK8lM0nO5pQ3rT6s",
      username: "GigaChad",
      totalPnL: 134.2,
      winRate: 59.3,
      totalVolume: 7800,
      tradesCount: 245,
      tokensDiversity: 28,
      avgTradeSize: 31.8,
      bestTrade: 156.7,
      worstTrade: -34.5,
      streak: 2,
      gorHoldings: 3450,
      title: "High Roller",
      isVerified: false,
      change24h: -5.8,
    },
    {
      rank: 7,
      wallet: "6sU2vW5xY8zA1bC4dE7fG0hI3jK6lM9nO2pQ5rT8sU1v",
      username: "ApeStrong",
      totalPnL: 112.8,
      winRate: 67.9,
      totalVolume: 3600,
      tradesCount: 98,
      tokensDiversity: 19,
      avgTradeSize: 36.7,
      bestTrade: 42.1,
      worstTrade: -15.6,
      streak: 7,
      gorHoldings: 5670,
      title: "Consistent",
      isVerified: false,
      change24h: 6.3,
    },
    {
      rank: 8,
      wallet: "1vW5xY8zA2bC5dE8fG1hI4jK7lM0nO3pQ6rT9sU2vW6x",
      username: "DegenerateApe",
      totalPnL: 89.4,
      winRate: 54.7,
      totalVolume: 8900,
      tradesCount: 312,
      tokensDiversity: 45,
      avgTradeSize: 28.5,
      bestTrade: 89.2,
      worstTrade: -67.8,
      streak: 1,
      gorHoldings: 2340,
      title: "Chaos Trader",
      isVerified: false,
      change24h: -12.7,
    },
  ]

  useEffect(() => {
    fetchLeaderboard()
  }, [activeTab, timeframe])

  const fetchLeaderboard = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Filter based on active tab
      let filteredData = mockLeaderboard
      if (activeTab === "spot") {
        filteredData = mockLeaderboard.filter((entry) => entry.tokensDiversity > 20)
      } else if (activeTab === "perps") {
        filteredData = mockLeaderboard.filter((entry) => entry.avgTradeSize > 50)
      }

      setLeaderboard(filteredData)

      // Calculate stats
      const totalTraders = filteredData.length
      const totalVolume = filteredData.reduce((sum, entry) => sum + entry.totalVolume, 0)
      const avgWinRate = filteredData.reduce((sum, entry) => sum + entry.winRate, 0) / totalTraders
      const topPnL = Math.max(...filteredData.map((entry) => entry.totalPnL))

      setStats({
        totalTraders,
        totalVolume,
        avgWinRate,
        topPnL,
      })
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-gor-muted">#{rank}</span>
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      const colors = {
        1: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black",
        2: "bg-gradient-to-r from-gray-400 to-gray-500 text-black",
        3: "bg-gradient-to-r from-amber-600 to-amber-700 text-black",
      }
      return colors[rank as keyof typeof colors]
    }
    return "bg-gor-surface/50 text-gor-muted"
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

  const formatNumber = (num: number, decimals = 2) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(decimals)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(decimals)}K`
    }
    return num.toFixed(decimals)
  }

  const formatPnL = (pnl: number) => {
    const sign = pnl >= 0 ? "+" : ""
    return `${sign}${formatNumber(pnl)} GOR`
  }

  return (
    <div className="min-h-screen bg-gor-bg">
      {/* Header */}
      <div className="bg-gor-surface/30 backdrop-blur-xl border-b border-gor-surface/30 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gor-accent to-gor-teal bg-clip-text text-transparent">
                Leaderboard
              </h1>
              <p className="text-gor-muted mt-2">Top performing traders on Gorbagana Chain</p>
            </div>
            <div className="flex items-center space-x-3">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-32 bg-gor-bg/50 border-gor-surface/50">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gor-surface border-gor-surface/50">
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={fetchLeaderboard}
                disabled={isLoading}
                className="bg-gor-accent hover:bg-gor-teal text-gor-bg font-medium"
              >
                <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
                {isLoading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gor-surface/50 backdrop-blur-xl border border-gor-surface/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gor-muted text-sm">Total Traders</p>
                    <p className="text-2xl font-bold text-gor-accent">{formatNumber(stats.totalTraders, 0)}</p>
                  </div>
                  <div className="w-12 h-12 bg-gor-accent/20 rounded-2xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-gor-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gor-surface/50 backdrop-blur-xl border border-gor-surface/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gor-muted text-sm">Total Volume</p>
                    <p className="text-2xl font-bold text-gor-accent">{formatNumber(stats.totalVolume)} GOR</p>
                  </div>
                  <div className="w-12 h-12 bg-gor-accent/20 rounded-2xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-gor-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gor-surface/50 backdrop-blur-xl border border-gor-surface/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gor-muted text-sm">Avg Win Rate</p>
                    <p className="text-2xl font-bold text-gor-accent">{formatNumber(stats.avgWinRate, 1)}%</p>
                  </div>
                  <div className="w-12 h-12 bg-gor-accent/20 rounded-2xl flex items-center justify-center">
                    <Percent className="w-6 h-6 text-gor-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gor-surface/50 backdrop-blur-xl border border-gor-surface/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gor-muted text-sm">Top PnL</p>
                    <p className="text-2xl font-bold text-gor-accent">{formatPnL(stats.topPnL)}</p>
                  </div>
                  <div className="w-12 h-12 bg-gor-accent/20 rounded-2xl flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-gor-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-gor-surface/50 rounded-xl p-1">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-gor-accent data-[state=active]:text-gor-bg rounded-lg"
            >
              <Trophy className="w-4 h-4 mr-2" />
              All Trading
            </TabsTrigger>
            <TabsTrigger
              value="spot"
              className="data-[state=active]:bg-gor-accent data-[state=active]:text-gor-bg rounded-lg"
            >
              <Target className="w-4 h-4 mr-2" />
              Spot Trading
            </TabsTrigger>
            <TabsTrigger
              value="perps"
              className="data-[state=active]:bg-gor-accent data-[state=active]:text-gor-bg rounded-lg"
            >
              <Zap className="w-4 h-4 mr-2" />
              Perpetuals
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-8">
            {isLoading ? (
              <Card className="bg-gor-surface/50 backdrop-blur-xl border border-gor-surface/30">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    {[...Array(8)].map((_, i) => (
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
                    <span>Trading Leaderboard</span>
                    <Badge variant="outline" className="border-gor-accent text-gor-accent">
                      {timeframe.toUpperCase()}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gor-surface/30">
                          <TableHead>Rank</TableHead>
                          <TableHead>Trader</TableHead>
                          <TableHead className="text-right">PnL (GOR)</TableHead>
                          <TableHead className="text-right">Win Rate</TableHead>
                          <TableHead className="text-right">Volume</TableHead>
                          <TableHead className="text-right">Trades</TableHead>
                          <TableHead className="text-right">Tokens</TableHead>
                          <TableHead className="text-right">24h Change</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leaderboard.map((entry) => (
                          <TableRow
                            key={entry.wallet}
                            className={cn(
                              "border-gor-surface/30 hover:bg-gor-surface/20 transition-colors",
                              entry.rank <= 3 && "bg-gor-surface/10",
                            )}
                          >
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div
                                  className={cn(
                                    "w-10 h-10 rounded-2xl flex items-center justify-center",
                                    getRankBadge(entry.rank),
                                  )}
                                >
                                  {getRankIcon(entry.rank)}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-gor-accent to-gor-teal rounded-xl flex items-center justify-center">
                                  <span className="text-gor-bg font-bold text-sm">
                                    {entry.username?.charAt(0) || "?"}
                                  </span>
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <p className="font-medium">{entry.username || "Anonymous"}</p>
                                    {entry.isVerified && (
                                      <Badge className="bg-gor-accent/20 text-gor-accent border-gor-accent/30 text-xs">
                                        ✓
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <p className="text-gor-muted text-xs font-mono">
                                      {entry.wallet.slice(0, 6)}...{entry.wallet.slice(-6)}
                                    </p>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyAddress(entry.wallet)}
                                      className="h-4 w-4 p-0"
                                    >
                                      {copiedAddress === entry.wallet ? (
                                        <Check className="w-3 h-3 text-gor-accent" />
                                      ) : (
                                        <Copy className="w-3 h-3 text-gor-muted" />
                                      )}
                                    </Button>
                                  </div>
                                  {entry.title && (
                                    <Badge variant="outline" className="border-gor-surface/50 text-xs mt-1">
                                      {entry.title}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div
                                className={cn(
                                  "font-mono font-bold",
                                  entry.totalPnL >= 0 ? "text-gor-accent" : "text-gor-error",
                                )}
                              >
                                {formatPnL(entry.totalPnL)}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <span className="font-mono">{entry.winRate.toFixed(1)}%</span>
                                <div
                                  className={cn(
                                    "w-2 h-2 rounded-full",
                                    entry.winRate >= 70
                                      ? "bg-gor-accent"
                                      : entry.winRate >= 50
                                        ? "bg-yellow-500"
                                        : "bg-gor-error",
                                  )}
                                />
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {formatNumber(entry.totalVolume)} GOR
                            </TableCell>
                            <TableCell className="text-right font-mono">{entry.tradesCount}</TableCell>
                            <TableCell className="text-right font-mono">{entry.tokensDiversity}</TableCell>
                            <TableCell className="text-right">
                              {entry.change24h !== undefined && (
                                <div
                                  className={cn(
                                    "flex items-center justify-end space-x-1",
                                    entry.change24h >= 0 ? "text-gor-accent" : "text-gor-error",
                                  )}
                                >
                                  {entry.change24h >= 0 ? (
                                    <TrendingUp className="w-3 h-3" />
                                  ) : (
                                    <TrendingDown className="w-3 h-3" />
                                  )}
                                  <span className="font-medium">
                                    {entry.change24h >= 0 ? "+" : ""}
                                    {entry.change24h.toFixed(1)}%
                                  </span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-gor-surface/50 hover:border-gor-accent/50"
                                >
                                  <BarChart3 className="w-3 h-3 mr-1" />
                                  Stats
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
        </Tabs>

        {/* Your Position (if connected) */}
        {connected && publicKey && (
          <Card className="bg-gor-surface/50 backdrop-blur-xl border border-gor-accent/30 shadow-lg shadow-gor-accent/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-gor-accent" />
                <span>Your Position</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-gor-muted text-sm">Current Rank</p>
                  <p className="text-2xl font-bold text-gor-accent">#42</p>
                </div>
                <div className="text-center">
                  <p className="text-gor-muted text-sm">Your PnL</p>
                  <p className="text-2xl font-bold text-gor-accent">+23.4 GOR</p>
                </div>
                <div className="text-center">
                  <p className="text-gor-muted text-sm">Win Rate</p>
                  <p className="text-2xl font-bold">62.3%</p>
                </div>
                <div className="text-center">
                  <p className="text-gor-muted text-sm">Volume</p>
                  <p className="text-2xl font-bold">1.2K GOR</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
