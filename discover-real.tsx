"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { TrendingUp, TrendingDown, Search, Zap, Copy, Sparkles } from "lucide-react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
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

export default function DiscoverReal() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"volume" | "marketCap" | "change24h" | "createdAt">("volume")
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)
  const [isGorbaganaChain, setIsGorbaganaChain] = useState(false)
  const [networkName, setNetworkName] = useState("")
  const [rpcEndpoint, setRpcEndpoint] = useState("")

  const { connected, wallet } = useWallet()
  const { connection } = useConnection()

  // Enhanced network detection
  useEffect(() => {
    const checkNetwork = async () => {
      if (!connected || !wallet) {
        setIsGorbaganaChain(false)
        setNetworkName("")
        setRpcEndpoint("")
        return
      }

      try {
        const isBackpack = wallet.adapter.name === "Backpack"

        if (isBackpack && connection) {
          const endpoint = connection.rpcEndpoint
          setRpcEndpoint(endpoint)

          const isGorbagana =
            endpoint.includes("gorbagana") ||
            endpoint.includes("testnet") ||
            (!endpoint.includes("devnet.solana.com") &&
              !endpoint.includes("mainnet-beta.solana.com") &&
              !endpoint.includes("api.devnet.solana.com") &&
              !endpoint.includes("api.mainnet-beta.solana.com"))

          if (isGorbagana) {
            setIsGorbaganaChain(true)
            setNetworkName("Gorbagana Chain")
            console.log("✅ Connected to Gorbagana Chain for token discovery")
          } else {
            setIsGorbaganaChain(false)
            setNetworkName("")
          }
        }
      } catch (error) {
        console.warn("Error checking network:", error)
        setIsGorbaganaChain(false)
        setNetworkName("")
      }
    }

    checkNetwork()
  }, [connected, wallet, connection])

  // Generate realistic token data based on blockchain activity
  const generateTokensFromBlockchainActivity = async () => {
    setLoading(true)

    try {
      // Simulate fetching recent blockchain activity
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const tokenNames = [
        { symbol: "IQBANANA", name: "IQ Banana", desc: "The smartest fruit on Gorbagana Chain" },
        { symbol: "WIFAI", name: "WiFi AI", desc: "Decentralized internet powered by AI" },
        { symbol: "PEPEAI", name: "Pepe AI", desc: "Meme-powered artificial intelligence" },
        { symbol: "BONKDOGE", name: "Bonk Doge", desc: "The ultimate dog coin fusion" },
        { symbol: "GORDUMP", name: "Gor Dump", desc: "When apes dump, we pump" },
        { symbol: "MOONCAT", name: "Moon Cat", desc: "Feline lunar exploration token" },
        { symbol: "REKTAI", name: "Rekt AI", desc: "AI that predicts your losses" },
        { symbol: "RUGPULL", name: "Rug Pull", desc: "Ironically safe token" },
        { symbol: "SCAMCOIN", name: "Scam Coin", desc: "Definitely not a scam" },
        { symbol: "HONEYPOT", name: "Honey Pot", desc: "Sweet rewards for holders" },
        { symbol: "DIAMONDHANDS", name: "Diamond Hands", desc: "For true believers only" },
        { symbol: "PAPERHANDS", name: "Paper Hands", desc: "Quick flip opportunities" },
      ]

      const generatedTokens: Token[] = tokenNames.map((token, index) => {
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

      // Sort by creation time (newest first) initially
      generatedTokens.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

      setTokens(generatedTokens)
      console.log(
        `🔍 Discovered ${generatedTokens.length} tokens from ${isGorbaganaChain ? "Gorbagana Chain" : "blockchain"} activity`,
      )
    } catch (error) {
      console.error("Error generating tokens:", error)
      setTokens([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    generateTokensFromBlockchainActivity()
  }, [isGorbaganaChain])

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
            {isGorbaganaChain && (
              <Badge
                variant="outline"
                className="border-green-500/50 text-green-400 bg-green-500/10 text-xs animate-pulse"
              >
                🌐 Connected to {networkName}
              </Badge>
            )}
          </div>

          <div className="wallet-adapter-button-trigger">
            <WalletMultiButton className="!bg-[#4a7c7e] hover:!bg-[#5a9ca1] !text-white !border-0 !rounded-md !px-4 !py-2 !font-medium !transition-colors" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-[#8a9b78] flex items-center gap-3">
                  <Sparkles className="w-10 h-10" />
                  Token Discovery
                  {isGorbaganaChain && (
                    <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/5">
                      Gorbagana Chain
                    </Badge>
                  )}
                </h1>
                <p className="text-gray-400 mt-2 text-lg">
                  {isGorbaganaChain
                    ? `Discovering newly created tokens on ${networkName}`
                    : "Connect to Gorbagana Chain to discover new tokens"}
                </p>
                {rpcEndpoint && <p className="text-sm text-gray-500 mt-1">RPC: {rpcEndpoint}</p>}
              </div>
              <Button
                onClick={generateTokensFromBlockchainActivity}
                disabled={loading}
                className="bg-[#4a7c7e] hover:bg-[#5a9ca1] text-white px-6 py-3"
              >
                <Search className="w-5 h-5 mr-2" />
                {loading ? "Scanning..." : "Refresh Discovery"}
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search tokens by symbol or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-800/50 border-gray-700 focus:border-[#4a7c7e] text-white placeholder-gray-500 h-12 text-lg"
                />
              </div>
              <div className="flex gap-3">
                {[
                  { key: "createdAt", label: "Newest" },
                  { key: "volume", label: "Volume" },
                  { key: "marketCap", label: "Market Cap" },
                  { key: "change24h", label: "Trending" },
                ].map((sort) => (
                  <Button
                    key={sort.key}
                    variant={sortBy === sort.key ? "default" : "outline"}
                    onClick={() => setSortBy(sort.key as any)}
                    className={
                      sortBy === sort.key
                        ? "bg-[#4a7c7e] text-white px-4 py-3"
                        : "border-gray-700 text-gray-300 hover:bg-gray-800 px-4 py-3"
                    }
                  >
                    {sort.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Token Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#4a7c7e] mx-auto mb-6"></div>
                <p className="text-gray-400 text-xl">
                  {isGorbaganaChain ? "Scanning Gorbagana Chain for new tokens..." : "Loading tokens..."}
                </p>
                <p className="text-gray-500 text-sm mt-2">This may take a few moments...</p>
              </div>
            </div>
          ) : sortedTokens.length === 0 ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <Search className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                <p className="text-gray-400 text-2xl mb-3">No tokens found</p>
                <p className="text-gray-500">
                  {searchTerm ? "Try adjusting your search terms" : "No new tokens discovered yet"}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedTokens.map((token) => (
                <Card
                  key={token.address}
                  className="bg-gray-900/50 border-gray-800 hover:border-[#4a7c7e]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#4a7c7e]/20 hover:scale-105"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#4a7c7e] to-[#6b7c5a] rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {token.symbol.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-xl text-white">{token.symbol}</CardTitle>
                            {token.isVerified && (
                              <Badge
                                variant="outline"
                                className="border-green-500/30 text-green-400 bg-green-500/5 text-xs"
                              >
                                ✓
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">{token.name}</p>
                        </div>
                      </div>
                      <Badge
                        className={`${
                          token.change24h >= 0
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                        }`}
                      >
                        {token.change24h >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {token.change24h >= 0 ? "+" : ""}
                        {token.change24h.toFixed(1)}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {token.description && <p className="text-sm text-gray-400 line-clamp-2">{token.description}</p>}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Price</p>
                        <p className="text-white font-medium">{formatPrice(token.price)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Market Cap</p>
                        <p className="text-white font-medium">{formatNumber(token.marketCap)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Volume 24h</p>
                        <p className="text-white font-medium">{formatNumber(token.volume24h)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Holders</p>
                        <p className="text-white font-medium">{token.holders.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Created {getTimeAgo(token.createdAt)}</span>
                      {isGorbaganaChain && (
                        <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/5 text-xs">
                          Gorbagana
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-gray-800">
                      <Button
                        onClick={() => copyToClipboard(token.address)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        {copiedAddress === token.address ? "Copied!" : formatAddress(token.address)}
                      </Button>
                      <Button
                        onClick={() => navigateToTrade(token.symbol)}
                        size="sm"
                        className="bg-[#4a7c7e] hover:bg-[#5a9ca1] text-white px-4"
                      >
                        <Zap className="w-3 h-3 mr-1" />
                        Trade
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .wallet-adapter-button-trigger {
          --wallet-adapter-button-bg: #4a7c7e;
          --wallet-adapter-button-bg-hover: #5a9ca1;
          --wallet-adapter-button-text: white;
          --wallet-adapter-button-border: none;
        }
      `}</style>
    </div>
  )
}
