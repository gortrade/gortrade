"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, BarChart3, DollarSign, X, Search, Sparkles } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

interface Token {
  symbol: string
  name: string
  address: string
  price: number
  change24h: number
  volume24h: number
  marketCap: number
  liquidity: number
  holders: number
  createdAt: Date
  isVerified: boolean
  description?: string
}

export default function Discover() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"volume" | "marketCap" | "change24h" | "createdAt">("volume")
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  const { connected } = useWallet()

  // Mock token data - in a real app, this would come from an API
  const generateMockTokens = () => {
    const tokenNames = [
      { symbol: "IQBANANA", name: "IQ Banana", desc: "The smartest fruit on Solana" },
      { symbol: "WIFAI", name: "WiFi AI", desc: "Decentralized internet powered by AI" },
      { symbol: "PEPEAI", name: "Pepe AI", desc: "Meme-powered artificial intelligence" },
      { symbol: "BONKDOGE", name: "Bonk Doge", desc: "The ultimate dog coin fusion" },
      { symbol: "GORDUMP", name: "Gor Dump", desc: "When apes dump, we pump" },
      { symbol: "MOONCAT", name: "Moon Cat", desc: "Feline lunar exploration token" },
      { symbol: "REKTAI", name: "Rekt AI", desc: "AI that predicts your losses" },
      { symbol: "RUGPULL", name: "Rug Pull", desc: "Ironically safe token" },
      { symbol: "SCAMCOIN", name: "Scam Coin", desc: "Definitely not a scam" },
      { symbol: "HONEYPOT", name: "Honey Pot", desc: "Sweet rewards for holders" },
    ]

    return tokenNames.map((token, index) => {
      const basePrice = Math.random() * 0.1 + 0.001
      const change = (Math.random() - 0.5) * 200 // -100% to +100%
      const volume = Math.random() * 1000000 + 10000
      const marketCap = volume * (Math.random() * 10 + 1)

      return {
        symbol: token.symbol,
        name: token.name,
        address: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}pump`,
        price: basePrice,
        change24h: change,
        volume24h: volume,
        marketCap: marketCap,
        liquidity: volume * 0.3,
        holders: Math.floor(Math.random() * 5000) + 100,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Last 7 days
        isVerified: Math.random() > 0.7,
        description: token.desc,
      }
    })
  }

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setTokens(generateMockTokens())
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const copyToClipboard = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address)
      setCopiedAddress(address)
      setTimeout(() => setCopiedAddress(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`
    } else {
      return `$${num.toFixed(2)}`
    }
  }

  const formatPrice = (price: number) => {
    if (price < 0.001) {
      return `$${price.toExponential(2)}`
    }
    return `$${price.toFixed(6)}`
  }

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const days = Math.floor(diffInHours / 24)
      return `${days}d ago`
    }
  }

  const filteredTokens = tokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedTokens = [...filteredTokens].sort((a, b) => {
    switch (sortBy) {
      case "volume":
        return b.volume24h - a.volume24h
      case "marketCap":
        return b.marketCap - a.marketCap
      case "change24h":
        return b.change24h - a.change24h
      case "createdAt":
        return b.createdAt.getTime() - a.createdAt.getTime()
      default:
        return 0
    }
  })

  const navigateToTrade = (tokenSymbol: string) => {
    window.location.href = `/?token=${tokenSymbol}`
  }

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white flex flex-col">
      {/* Top Navigation */}
      <nav className="border-b border-gray-800 bg-[#0b0b0f]">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <img src="/gor-web-logo.png" alt="GorTrade Logo" className="w-10 h-10 rounded-lg" />
            <div className="text-xl font-bold text-white">GORTRADE</div>
            <Badge variant="outline" className="border-[#6b7c5a]/50 text-[#8a9b78] bg-[#6b7c5a]/10">
              DISCOVER
            </Badge>
          </div>

          <div className="wallet-adapter-button-trigger">
            <WalletMultiButton className="!bg-[#4a7c7e] hover:!bg-[#5a9ca1] !text-white !border-0 !rounded-md !px-4 !py-2 !font-medium !transition-colors" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1">
        <div className="hidden md:block">
          <div className="grid grid-cols-[auto_1fr] lg:grid-cols-[240px_1fr] h-[calc(100vh-73px)] max-w-full overflow-hidden">
            {/* Left Sidebar */}
            <div className="border-r border-gray-800 bg-[#0b0b0f] min-w-0">
              <div className="p-4 space-y-1">
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#5a9ca1]/10 transition-colors cursor-pointer group">
                  <Settings className="w-5 h-5 text-gray-400 group-hover:text-[#5a9ca1] flex-shrink-0" />
                  <a
                    href="/settings"
                    className="hidden lg:block text-sm text-gray-300 group-hover:text-[#5a9ca1] truncate"
                  >
                    Settings
                  </a>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#5a9ca1]/10 transition-colors cursor-pointer group">
                  <BarChart3 className="w-5 h-5 text-gray-400 group-hover:text-[#5a9ca1] flex-shrink-0" />
                  <a href="/" className="hidden lg:block text-sm text-gray-300 group-hover:text-[#5a9ca1] truncate">
                    Trade
                  </a>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#6b7c5a]/20 cursor-pointer group">
                  <Search className="w-5 h-5 text-[#8a9b78] flex-shrink-0" />
                  <span className="hidden lg:block text-sm text-[#8a9b78] truncate">Discover</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#5a9ca1]/10 transition-colors cursor-pointer group">
                  <DollarSign className="w-5 h-5 text-gray-400 group-hover:text-[#5a9ca1] flex-shrink-0" />
                  <a
                    href="/holdings"
                    className="hidden lg:block text-sm text-gray-300 group-hover:text-[#5a9ca1] truncate"
                  >
                    Holdings
                  </a>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#5a9ca1]/10 transition-all duration-200 cursor-pointer group hover:shadow-lg hover:shadow-[#5a9ca1]/20">
                  <X
                    className="w-5 h-5 text-gray-400 group-hover:text-[#5a9ca1] flex-shrink-0 font-bold"
                    strokeWidth={2.5}
                  />
                  <a
                    href="https://x.com/GorTradeSol"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden lg:block text-sm text-gray-300 group-hover:text-[#5a9ca1] truncate"
                  >
                    Follow @GorTradeSol
                  </a>
                </div>
              </div>
            </div>

            {/* Main Discovery Area */}
            <div className="flex flex-col min-w-0 p-6 overflow-hidden">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-[#8a9b78] flex items-center gap-3">
                      <Sparkles className="w-8 h-8" />
                      Token Discovery
                    </h1>
                    <p className="text-gray-400 mt-2">
                      {connected
                        ? "Discovering newly created tokens on Solana"
                        : "Connect your wallet to discover new tokens"}
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setLoading(true)
                      setTimeout(() => {
                        setTokens(generateMockTokens())
                        setLoading(false)
                      }, 1000)
                    }}
                    disabled={loading}
                    className="bg-[#4a7c7e] hover:bg-[#5a9ca1] text-white border-0 rounded-md px-4 py-2 font-medium transition-colors"
                  >
                    {loading ? "Refreshing..." : "Refresh"}
                  </Button>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search tokens..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#4a7c7e]"
                    />
                  </div>
                  <div className="flex gap-2">
                    {(["volume", "marketCap", "change24h", "createdAt"] as const).map((sort) => (
                      <Button
                        key={sort}
                        onClick={() => setSortBy(sort)}
                        variant={sortBy === sort ? "default" : "outline"}
                        className={
                          sortBy === sort
                            ? "bg-[#4a7c7e] hover:bg-[#5a9ca1] text-white border-0"
                            : "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border-gray-700"
                        }
                      >
                        {sort === "volume" && "Volume"}
                        {sort === "marketCap" && "Market Cap"}
                        {sort === "change24h" && "Trending"}
                        {sort === "createdAt" && "Name"}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Token List */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a7c7e] mx-auto mb-4"></div>
                      <p className="text-gray-400">Discovering tokens...</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {sortedTokens.map((token) => (
                      <div
                        key={token.address}
                        className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#4a7c7e] to-[#6b7c5a] rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {token.symbol.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-white">{token.symbol}</h3>
                                {token.isVerified && (
                                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Verified</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-400">{token.name}</p>
                              {token.description && <p className="text-xs text-gray-500 mt-1">{token.description}</p>}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-white">{formatPrice(token.price)}</div>
                            <div className={`text-sm ${token.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                              {token.change24h >= 0 ? "+" : ""}
                              {token.change24h.toFixed(2)}%
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div>
                            <p className="text-gray-400">Volume 24h</p>
                            <p className="text-white font-medium">{formatNumber(token.volume24h)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Market Cap</p>
                            <p className="text-white font-medium">{formatNumber(token.marketCap)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Holders</p>
                            <p className="text-white font-medium">{token.holders.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Created</p>
                            <p className="text-white font-medium">{getTimeAgo(token.createdAt)}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => copyToClipboard(token.address)}
                              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 rounded text-sm transition-colors"
                            >
                              {copiedAddress === token.address ? "Copied!" : formatAddress(token.address)}
                            </button>
                            <a
                              href={`https://solscan.io/token/${token.address}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 rounded text-sm transition-colors"
                            >
                              View
                            </a>
                          </div>
                          <Button
                            onClick={() => navigateToTrade(token.symbol)}
                            className="bg-[#4a7c7e] hover:bg-[#5a9ca1] text-white border-0 rounded-md px-4 py-1 text-sm font-medium transition-colors"
                          >
                            Trade
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden p-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#8a9b78] flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6" />
              Token Discovery
            </h1>
            <p className="text-gray-400 text-sm mb-4">
              {connected ? "Discovering newly created tokens on Solana" : "Connect your wallet to discover new tokens"}
            </p>

            {/* Mobile Search and Filters */}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#4a7c7e]"
              />
              <div className="flex gap-2 overflow-x-auto pb-2">
                {(["volume", "marketCap", "change24h", "createdAt"] as const).map((sort) => (
                  <Button
                    key={sort}
                    onClick={() => setSortBy(sort)}
                    variant={sortBy === sort ? "default" : "outline"}
                    className={
                      sortBy === sort
                        ? "bg-[#4a7c7e] hover:bg-[#5a9ca1] text-white border-0 whitespace-nowrap"
                        : "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border-gray-700 whitespace-nowrap"
                    }
                  >
                    {sort === "volume" && "Volume"}
                    {sort === "marketCap" && "Market Cap"}
                    {sort === "change24h" && "Trending"}
                    {sort === "createdAt" && "Name"}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Token List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a7c7e] mx-auto mb-4"></div>
                  <p className="text-gray-400">Discovering tokens...</p>
                </div>
              </div>
            ) : (
              sortedTokens.map((token) => (
                <div key={token.address} className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#4a7c7e] to-[#6b7c5a] rounded-full flex items-center justify-center text-white font-bold">
                        {token.symbol.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-white text-sm">{token.symbol}</h3>
                          {token.isVerified && (
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">Verified</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">{token.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-white">{formatPrice(token.price)}</div>
                      <div className={`text-xs ${token.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {token.change24h >= 0 ? "+" : ""}
                        {token.change24h.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                    <div>
                      <p className="text-gray-400">Volume 24h</p>
                      <p className="text-white font-medium">{formatNumber(token.volume24h)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Market Cap</p>
                      <p className="text-white font-medium">{formatNumber(token.marketCap)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => copyToClipboard(token.address)}
                      className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 rounded text-xs transition-colors"
                    >
                      {copiedAddress === token.address ? "Copied!" : formatAddress(token.address)}
                    </button>
                    <Button
                      onClick={() => navigateToTrade(token.symbol)}
                      className="bg-[#4a7c7e] hover:bg-[#5a9ca1] text-white border-0 rounded-md px-3 py-1 text-xs font-medium transition-colors"
                    >
                      Trade
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
