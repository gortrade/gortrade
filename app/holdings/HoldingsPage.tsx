"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  TrendingUp,
  TrendingDown,
  Settings,
  BarChart3,
  DollarSign,
  X,
  Search,
  Wallet,
  RefreshCw,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { PublicKey } from "@solana/web3.js"

interface Holding {
  symbol: string
  name: string
  address: string
  balance: number
  decimals: number
  usdValue: number
  price: number
  change24h: number
  isVerified: boolean
}

export default function HoldingsPage() {
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [hideSmallBalances, setHideSmallBalances] = useState(false)
  const [totalValue, setTotalValue] = useState(0)
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  const { connected, publicKey } = useWallet()
  const { connection } = useConnection()

  // Fetch user's token holdings
  const fetchHoldings = async () => {
    if (!connected || !publicKey) {
      setHoldings([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      console.log("🔍 Fetching token holdings...")

      // Get user's token accounts
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      })

      const holdingsData: Holding[] = []

      // Known token mappings
      const knownTokens: Record<string, { symbol: string; name: string; price: number }> = {
        So11111111111111111111111111111111111111112: { symbol: "WSOL", name: "Wrapped SOL", price: 42.5 },
        EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: { symbol: "USDC", name: "USD Coin", price: 1.0 },
        Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: { symbol: "USDT", name: "Tether USD", price: 1.0 },
        DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263: { symbol: "BONK", name: "Bonk", price: 0.0000123 },
        EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm: { symbol: "WIF", name: "dogwifhat", price: 1.85 },
        "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr": { symbol: "POPCAT", name: "Popcat", price: 0.75 },
      }

      for (const account of tokenAccounts.value) {
        try {
          const parsedInfo = account.account.data.parsed.info
          const mintAddress = parsedInfo.mint
          const tokenAmount = parsedInfo.tokenAmount

          // Skip if no balance
          if (Number.parseFloat(tokenAmount.amount) === 0) continue

          const balance = Number.parseFloat(tokenAmount.uiAmountString || "0")
          const decimals = tokenAmount.decimals

          const knownToken = knownTokens[mintAddress]
          const price = knownToken?.price || Math.random() * 5 + 0.001
          const usdValue = balance * price
          const change24h = (Math.random() - 0.5) * 20 // -10% to +10%

          holdingsData.push({
            symbol: knownToken?.symbol || `TOKEN${holdingsData.length + 1}`,
            name: knownToken?.name || `Unknown Token ${holdingsData.length + 1}`,
            address: mintAddress,
            balance,
            decimals,
            usdValue,
            price,
            change24h,
            isVerified: !!knownToken,
          })
        } catch (err) {
          console.warn("Error processing token account:", err)
          continue
        }
      }

      // Sort by USD value (highest first)
      holdingsData.sort((a, b) => b.usdValue - a.usdValue)

      setHoldings(holdingsData)
      setTotalValue(holdingsData.reduce((sum, holding) => sum + holding.usdValue, 0))
      console.log(`✅ Found ${holdingsData.length} token holdings`)
    } catch (error) {
      console.error("❌ Error fetching holdings:", error)
      setHoldings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHoldings()
  }, [connected, publicKey])

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
      return `$${(num / 1000000).toFixed(2)}M`
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`
    } else {
      return `$${num.toFixed(2)}`
    }
  }

  const formatBalance = (balance: number, decimals: number) => {
    if (balance >= 1000000) {
      return `${(balance / 1000000).toFixed(2)}M`
    } else if (balance >= 1000) {
      return `${(balance / 1000).toFixed(2)}K`
    } else if (balance < 0.01) {
      return balance.toExponential(2)
    } else {
      return balance.toFixed(decimals > 6 ? 6 : decimals)
    }
  }

  const filteredHoldings = holdings.filter((holding) => {
    const matchesSearch =
      holding.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holding.name.toLowerCase().includes(searchTerm.toLowerCase())
    const meetsMinBalance = !hideSmallBalances || holding.usdValue >= 1
    return matchesSearch && meetsMinBalance
  })

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white flex flex-col">
      {/* Top Navigation */}
      <nav className="border-b border-gray-800 bg-[#0b0b0f]">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <img src="/gor-web-logo.png" alt="GorTrade Logo" className="w-10 h-10 rounded-lg" />
            <div className="text-xl font-bold text-white">GORTRADE</div>
            <Badge variant="outline" className="border-[#6b7c5a]/50 text-[#8a9b78] bg-[#6b7c5a]/10">
              HOLDINGS
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
          <div className="grid grid-cols-[auto_1fr] lg:grid-cols-[240px_1fr] min-h-[calc(100vh-73px)] max-w-full">
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
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#5a9ca1]/10 transition-colors cursor-pointer group">
                  <Search className="w-5 h-5 text-gray-400 group-hover:text-[#5a9ca1] flex-shrink-0" />
                  <a
                    href="/discover"
                    className="hidden lg:block text-sm text-gray-300 group-hover:text-[#5a9ca1] truncate"
                  >
                    Discover
                  </a>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#6b7c5a]/20 cursor-pointer group">
                  <DollarSign className="w-5 h-5 text-[#8a9b78] flex-shrink-0" />
                  <span className="hidden lg:block text-sm text-[#8a9b78] truncate">Holdings</span>
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

            {/* Main Holdings Area */}
            <div className="flex flex-col min-w-0 p-6">
              {/* Header */}
              <div className="mb-6 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-[#8a9b78] flex items-center gap-3">
                      <Wallet className="w-8 h-8" />
                      Portfolio Holdings
                    </h1>
                    <p className="text-gray-400 mt-2">
                      {connected
                        ? `Total Portfolio Value: ${formatNumber(totalValue)} • ${holdings.length} tokens`
                        : "Connect your wallet to view your token holdings"}
                    </p>
                  </div>
                  <Button
                    onClick={fetchHoldings}
                    disabled={loading || !connected}
                    className="bg-[#4a7c7e] hover:bg-[#5a9ca1] text-white"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    {loading ? "Loading..." : "Refresh"}
                  </Button>
                </div>

                {/* Search and Filters */}
                {connected && (
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <Input
                        placeholder="Search your tokens..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-gray-800/50 border-gray-700 focus:border-[#4a7c7e] text-white placeholder-gray-500"
                      />
                    </div>
                    <Button
                      onClick={() => setHideSmallBalances(!hideSmallBalances)}
                      variant="outline"
                      className={
                        hideSmallBalances
                          ? "bg-[#4a7c7e] border-[#4a7c7e] text-white"
                          : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                      }
                    >
                      {hideSmallBalances ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                      {hideSmallBalances ? "Show All" : "Hide Small"}
                    </Button>
                  </div>
                )}

                {/* Portfolio Summary */}
                {connected && holdings.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-gray-900/30 border-gray-800">
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-green-400">{formatNumber(totalValue)}</div>
                        <div className="text-sm text-gray-400">Total Value</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-900/30 border-gray-800">
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-blue-400">{holdings.length}</div>
                        <div className="text-sm text-gray-400">Total Tokens</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-900/30 border-gray-800">
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-purple-400">
                          {holdings.filter((h) => h.isVerified).length}
                        </div>
                        <div className="text-sm text-gray-400">Verified Tokens</div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              {/* Connection Prompt */}
              {!connected && (
                <div className="mb-6 p-6 bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-lg flex-shrink-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Connect to View Holdings</h3>
                      <p className="text-green-400 text-sm">See all your token balances and portfolio value</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    Connect your wallet to view your complete token portfolio, including balances, values, and
                    performance.
                  </p>
                </div>
              )}

              {/* Holdings List */}
              <div className="flex-1 min-h-0">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a7c7e] mx-auto mb-4"></div>
                      <p className="text-gray-400">Loading your holdings...</p>
                    </div>
                  </div>
                ) : filteredHoldings.length === 0 && connected ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <Wallet className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg mb-2">No tokens found</p>
                      <p className="text-gray-500 text-sm">
                        {searchTerm ? "Try adjusting your search" : "Your wallet appears to be empty"}
                      </p>
                    </div>
                  </div>
                ) : connected ? (
                  <div className="space-y-3 pb-6">
                    {filteredHoldings.map((holding) => (
                      <Card
                        key={holding.address}
                        className="bg-gray-900/50 border-gray-800 hover:border-[#4a7c7e]/50 transition-all duration-200"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-[#4a7c7e] to-[#6b7c5a] rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {holding.symbol.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-white">{holding.symbol}</h3>
                                  {holding.isVerified && (
                                    <Badge
                                      variant="outline"
                                      className="border-green-500/30 text-green-400 bg-green-500/5 text-xs"
                                    >
                                      ✓
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-400">{holding.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Button
                                    onClick={() => copyToClipboard(holding.address)}
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
                                  >
                                    <Copy className="w-3 h-3 mr-1" />
                                    {copiedAddress === holding.address ? "Copied!" : formatAddress(holding.address)}
                                  </Button>
                                  <Button
                                    onClick={() => window.open(`https://solscan.io/token/${holding.address}`, "_blank")}
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold text-white">{formatNumber(holding.usdValue)}</div>
                              <div className="text-sm text-gray-400">
                                {formatBalance(holding.balance, holding.decimals)} {holding.symbol}
                              </div>
                              <div className={`text-sm ${holding.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                                {holding.change24h >= 0 ? (
                                  <TrendingUp className="w-3 h-3 inline mr-1" />
                                ) : (
                                  <TrendingDown className="w-3 h-3 inline mr-1" />
                                )}
                                {holding.change24h >= 0 ? "+" : ""}
                                {holding.change24h.toFixed(2)}%
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="md:hidden p-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#8a9b78] flex items-center gap-2 mb-2">
              <Wallet className="w-6 h-6" />
              Holdings
            </h1>
            <p className="text-gray-400 text-sm">
              {connected ? `${formatNumber(totalValue)} • ${holdings.length} tokens` : "Connect to view holdings"}
            </p>
          </div>

          {!connected && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Connect Wallet</h3>
              <p className="text-gray-300 text-sm">Connect to view your token portfolio</p>
            </div>
          )}

          {connected && (
            <div className="space-y-4 mb-6">
              <Input
                placeholder="Search tokens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800/50 border-gray-700 focus:border-[#4a7c7e] text-white placeholder-gray-500"
              />
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a7c7e] mx-auto mb-4"></div>
                <p className="text-gray-400">Loading holdings...</p>
              </div>
            </div>
          ) : connected ? (
            <div className="space-y-4">
              {filteredHoldings.map((holding) => (
                <Card key={holding.address} className="bg-gray-900/50 border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#4a7c7e] to-[#6b7c5a] rounded-full flex items-center justify-center text-white font-bold">
                          {holding.symbol.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-white">{holding.symbol}</h3>
                            {holding.isVerified && (
                              <Badge
                                variant="outline"
                                className="border-green-500/30 text-green-400 bg-green-500/5 text-xs"
                              >
                                ✓
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">{holding.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-white">{formatNumber(holding.usdValue)}</div>
                        <div className="text-xs text-gray-400">{formatBalance(holding.balance, holding.decimals)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}
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
