"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  Star,
  Filter,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Token {
  name: string
  symbol: string
  address: string
  logo?: string
  price?: number
  change24h?: number
  volume24h?: number
  marketCap?: number
  liquidity?: number
  age?: string
  isNew?: boolean
  isTrending?: boolean
  holders?: number
}

// Mock tokens from Gorbagana Chain for demonstration
const mockTokens: Token[] = [
  {
    name: "GorTrade Token",
    symbol: "GOR",
    address: "71Jvq4Epe2FCJ7JFSF7jLXdNk1Wy4Bhqd9iL6bEFELvg",
    price: 0.0428,
    change24h: 12.5,
    volume24h: 8900000,
    marketCap: 42800000,
    liquidity: 2100000,
    age: "2h",
    isNew: false,
    isTrending: true,
    holders: 1247,
  },
  {
    name: "Gorbagana Coin",
    symbol: "GORB",
    address: "9xK2mP3qR7tN8vW5bC4dE6fG1hJ0iL3mN5oP8qR2sT4u",
    price: 0.0156,
    change24h: 45.2,
    volume24h: 1200000,
    marketCap: 15600000,
    liquidity: 890000,
    age: "4h",
    isNew: true,
    isTrending: true,
    holders: 892,
  },
  {
    name: "Trash Panda",
    symbol: "TRASH",
    address: "3pQ7rT9sU2vW8xY1zA4bC5dE9fG2hI6jK8lM0nO5pQ3r",
    price: 0.0089,
    change24h: -8.3,
    volume24h: 450000,
    marketCap: 8900000,
    liquidity: 340000,
    age: "1d",
    isNew: false,
    isTrending: false,
    holders: 567,
  },
  {
    name: "Degen Ape",
    symbol: "DAPE",
    address: "6sU2vW5xY8zA1bC4dE7fG0hI3jK6lM9nO2pQ5rT8sU1v",
    price: 0.0234,
    change24h: 23.7,
    volume24h: 2300000,
    marketCap: 23400000,
    liquidity: 1200000,
    age: "6h",
    isNew: true,
    isTrending: true,
    holders: 1034,
  },
  {
    name: "Moon Rocket",
    symbol: "MOON",
    address: "1vW5xY8zA2bC5dE8fG1hI4jK7lM0nO3pQ6rT9sU2vW6x",
    price: 0.0067,
    change24h: -15.4,
    volume24h: 780000,
    marketCap: 6700000,
    liquidity: 290000,
    age: "3d",
    isNew: false,
    isTrending: false,
    holders: 423,
  },
  {
    name: "Solana Killer",
    symbol: "SKILL",
    address: "8zA2bC5dE9fG2hI5jK8lM1nO4pQ7rT0sU3vW6xY9zA3b",
    price: 0.0345,
    change24h: 67.8,
    volume24h: 5600000,
    marketCap: 34500000,
    liquidity: 1800000,
    age: "8h",
    isNew: true,
    isTrending: true,
    holders: 1567,
  },
]

export default function DiscoverPage() {
  const [tokens, setTokens] = useState<Token[]>(mockTokens)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  // Filter tokens based on search and tab
  const filteredTokens = tokens.filter((token) => {
    const matchesSearch =
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.address.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab =
      activeTab === "all" || (activeTab === "new" && token.isNew) || (activeTab === "trending" && token.isTrending)

    return matchesSearch && matchesTab
  })

  // Simulate fetching tokens from Gorbagana Chain
  const refreshTokens = async () => {
    setIsLoading(true)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In real implementation, this would fetch from Gorbagana Chain RPC
    // const response = await fetch('/api/gorbagana/tokens')
    // const newTokens = await response.json()

    setIsLoading(false)
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

  const formatPrice = (price: number) => {
    if (price < 0.01) {
      return `$${price.toFixed(6)}`
    }
    return `$${price.toFixed(4)}`
  }

  const formatLargeNumber = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`
    }
    return `$${num.toFixed(0)}`
  }

  return (
    <div className="min-h-screen bg-gor-bg">
      {/* Header */}
      <div className="bg-gor-surface/30 backdrop-blur-xl border-b border-gor-surface/30 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gor-accent to-gor-teal bg-clip-text text-transparent">
                Gorscope
              </h1>
              <p className="text-gor-muted mt-2">Discover new tokens on Gorbagana Chain • Live from DEX</p>
            </div>
            <Button
              onClick={refreshTokens}
              disabled={isLoading}
              className="bg-gor-accent hover:bg-gor-teal text-gor-bg font-medium rounded-xl"
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
              {isLoading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gor-muted" />
              <Input
                placeholder="Search tokens, symbols, or addresses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-gor-bg/50 border-gor-surface/50 focus:border-gor-accent/50 rounded-xl"
              />
            </div>
            <Button variant="outline" className="border-gor-surface/50 hover:border-gor-accent/50 rounded-xl">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
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
              All Tokens ({tokens.length})
            </TabsTrigger>
            <TabsTrigger
              value="new"
              className="data-[state=active]:bg-gor-accent data-[state=active]:text-gor-bg rounded-lg"
            >
              <Clock className="w-4 h-4 mr-2" />
              New ({tokens.filter((t) => t.isNew).length})
            </TabsTrigger>
            <TabsTrigger
              value="trending"
              className="data-[state=active]:bg-gor-accent data-[state=active]:text-gor-bg rounded-lg"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending ({tokens.filter((t) => t.isTrending).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="bg-gor-surface/50 border-gor-surface/30 rounded-2xl animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-6 bg-gor-surface rounded mb-4" />
                      <div className="h-4 bg-gor-surface rounded mb-2" />
                      <div className="h-4 bg-gor-surface rounded w-2/3 mb-4" />
                      <div className="h-10 bg-gor-surface rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTokens.map((token) => (
                  <Card
                    key={token.address}
                    className="bg-gor-surface/50 backdrop-blur-xl border border-gor-accent/20 rounded-2xl shadow-lg hover:shadow-gor-accent/10 transition-all duration-300 hover:scale-[1.02] group"
                  >
                    <CardContent className="p-6">
                      {/* Token Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-gor-accent to-gor-teal rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-gor-bg font-bold text-lg">{token.symbol.charAt(0)}</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gor-text group-hover:text-gor-accent transition-colors">
                              {token.name}
                            </h3>
                            <p className="text-gor-muted text-sm">{token.symbol}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {token.isNew && (
                            <Badge className="bg-gor-accent/20 text-gor-accent border-gor-accent/30 text-xs">NEW</Badge>
                          )}
                          {token.isTrending && (
                            <Badge className="bg-gor-teal/20 text-gor-teal border-gor-teal/30 text-xs">🔥 HOT</Badge>
                          )}
                        </div>
                      </div>

                      {/* Price Info */}
                      {token.price && (
                        <div className="mb-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl font-bold text-gor-accent">{formatPrice(token.price)}</span>
                            {token.change24h && (
                              <div
                                className={cn(
                                  "flex items-center space-x-1 px-2 py-1 rounded-lg text-sm font-medium",
                                  token.change24h >= 0
                                    ? "bg-gor-accent/20 text-gor-accent"
                                    : "bg-gor-error/20 text-gor-error",
                                )}
                              >
                                {token.change24h >= 0 ? (
                                  <TrendingUp className="w-3 h-3" />
                                ) : (
                                  <TrendingDown className="w-3 h-3" />
                                )}
                                <span>{Math.abs(token.change24h).toFixed(1)}%</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Token Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        {token.volume24h && (
                          <div>
                            <p className="text-gor-muted">Volume 24h</p>
                            <p className="font-semibold">{formatLargeNumber(token.volume24h)}</p>
                          </div>
                        )}
                        {token.liquidity && (
                          <div>
                            <p className="text-gor-muted">Liquidity</p>
                            <p className="font-semibold">{formatLargeNumber(token.liquidity)}</p>
                          </div>
                        )}
                        {token.holders && (
                          <div>
                            <p className="text-gor-muted">Holders</p>
                            <p className="font-semibold">{token.holders.toLocaleString()}</p>
                          </div>
                        )}
                        {token.age && (
                          <div>
                            <p className="text-gor-muted">Age</p>
                            <p className="font-semibold">{token.age}</p>
                          </div>
                        )}
                      </div>

                      {/* Contract Address */}
                      <div className="mb-4">
                        <p className="text-gor-muted text-xs mb-2">Contract Address</p>
                        <div className="flex items-center space-x-2 bg-gor-bg/50 rounded-lg p-2">
                          <span className="font-mono text-xs text-gor-muted flex-1">
                            {token.address.slice(0, 8)}...{token.address.slice(-8)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyAddress(token.address)}
                            className="h-6 w-6 p-0 hover:bg-gor-accent/20"
                          >
                            {copiedAddress === token.address ? (
                              <Check className="w-3 h-3 text-gor-accent" />
                            ) : (
                              <Copy className="w-3 h-3 text-gor-muted" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="flex-1 bg-gor-accent hover:bg-gor-teal text-gor-bg font-medium rounded-xl transition-all duration-200 hover:scale-105 shadow-lg shadow-gor-accent/20">
                              <Zap className="w-4 h-4 mr-2" />
                              Trade
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gor-surface/95 backdrop-blur-xl border border-gor-accent/20 text-gor-text max-w-md">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-bold flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gor-accent/20 rounded-xl flex items-center justify-center">
                                  <span className="text-lg">⛓️</span>
                                </div>
                                <span>Coming Soon</span>
                              </DialogTitle>
                              <DialogDescription className="text-gor-muted mt-2">
                                This token is currently available on the Gorbagana devnet only.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              <p className="text-sm text-gor-text">
                                We're actively connecting trading routes to testnet pools. Spot and Perps support for
                                this asset will be enabled shortly.
                              </p>
                              <div className="bg-gor-bg/50 rounded-xl p-4 border border-gor-surface/30">
                                <div className="flex items-center space-x-3 mb-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-gor-accent to-gor-teal rounded-xl flex items-center justify-center">
                                    <span className="text-gor-bg font-bold text-sm">{token.symbol.charAt(0)}</span>
                                  </div>
                                  <div>
                                    <p className="font-medium">{token.name}</p>
                                    <p className="text-gor-muted text-sm">{token.symbol}</p>
                                  </div>
                                </div>
                                <div className="text-xs text-gor-muted space-y-1">
                                  <div className="flex justify-between">
                                    <span>Contract:</span>
                                    <span className="font-mono">
                                      {token.address.slice(0, 8)}...{token.address.slice(-8)}
                                    </span>
                                  </div>
                                  {token.price && (
                                    <div className="flex justify-between">
                                      <span>Current Price:</span>
                                      <span className="text-gor-accent">{formatPrice(token.price)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <DialogTrigger asChild>
                              <Button className="w-full mt-6 bg-gor-accent hover:bg-gor-teal text-gor-bg font-medium rounded-xl transition-all duration-200">
                                Got it
                              </Button>
                            </DialogTrigger>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-gor-surface/50 hover:border-gor-accent/50 hover:bg-gor-accent/10 rounded-xl"
                        >
                          <Star className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-gor-surface/50 hover:border-gor-accent/50 hover:bg-gor-accent/10 rounded-xl"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredTokens.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gor-surface/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-gor-muted" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No tokens found</h3>
                <p className="text-gor-muted mb-6">
                  {searchQuery ? `No tokens match "${searchQuery}"` : "No tokens available in this category"}
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setActiveTab("all")
                  }}
                  className="bg-gor-accent hover:bg-gor-teal text-gor-bg"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
