"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { TrendingUp, TrendingDown, Settings, BarChart3, Zap, DollarSign, X, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"

export default function GorTradeClean() {
  const [tradeSize, setTradeSize] = useState("")
  const [leverage, setLeverage] = useState([10])
  const [selectedSide, setSelectedSide] = useState<"long" | "short">("long")
  const [selectedToken, setSelectedToken] = useState("GOR")
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false)
  const [balance, setBalance] = useState<number | null>(null)
  const [isGorbaganaChain, setIsGorbaganaChain] = useState(false)
  const [networkName, setNetworkName] = useState("")

  // Improved wallet state management with better error handling
  const { connected, publicKey, wallet, connecting, disconnecting } = useWallet()
  const { connection } = useConnection()

  // More robust wallet readiness check
  const isWalletReady = wallet?.readyState === "Installed" || wallet?.readyState === "Loadable"

  const [openPositions, setOpenPositions] = useState<
    Array<{
      id: string
      token: string
      side: "long" | "short"
      size: string
      leverage: number
      entryPrice: string
      currentPrice: string
      pnl: number
      pnlPercent: number
      timestamp: Date
    }>
  >([])

  // Available tokens in the trading interface
  const availableTokens = ["GOR", "BONK", "WIF", "MEOW", "POPCAT"]

  const [tradingMode, setTradingMode] = useState<"spot" | "perps">("perps")
  const [orderType, setOrderType] = useState<"market" | "limit">("market")
  const [limitPrice, setLimitPrice] = useState("")
  const [recentTrades, setRecentTrades] = useState([
    { price: 0.042, amount: 150.5, side: "buy", time: "14:32:15", isGorbagana: true },
    { price: 0.0419, amount: 89.2, side: "sell", time: "14:32:10", isGorbagana: true },
    { price: 0.0421, amount: 234.8, side: "buy", time: "14:32:05", isGorbagana: false },
    { price: 0.0418, amount: 67.3, side: "sell", time: "14:31:58", isGorbagana: true },
    { price: 0.042, amount: 445.7, side: "buy", time: "14:31:45", isGorbagana: true },
  ])

  // Enhanced network detection with better error handling
  useEffect(() => {
    const checkNetwork = async () => {
      // Only proceed if wallet is properly connected and ready
      if (!connected || !wallet || !isWalletReady) {
        setIsGorbaganaChain(false)
        setNetworkName("")
        return
      }

      try {
        // Add a small delay to ensure wallet is fully initialized
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Check if connected wallet is Backpack (by name, since adapter might not be available)
        const isBackpack = wallet.adapter.name === "Backpack" || wallet.adapter.name.toLowerCase().includes("backpack")

        if (isBackpack && connection) {
          // Get the RPC endpoint from the connection
          const rpcEndpoint = connection.rpcEndpoint

          console.log("Current RPC endpoint:", rpcEndpoint)

          // Enhanced detection for Gorbagana Chain
          const isGorbagana =
            rpcEndpoint.includes("gorbagana") ||
            rpcEndpoint.includes("testnet") ||
            // Backpack often uses custom RPC endpoints for Gorbagana
            (!rpcEndpoint.includes("devnet.solana.com") &&
              !rpcEndpoint.includes("mainnet-beta.solana.com") &&
              !rpcEndpoint.includes("api.devnet.solana.com") &&
              !rpcEndpoint.includes("api.mainnet-beta.solana.com"))

          if (isGorbagana) {
            setIsGorbaganaChain(true)
            setNetworkName("Gorbagana Chain")
            console.log("✅ Connected to Gorbagana Chain via Backpack")
          } else {
            setIsGorbaganaChain(false)
            setNetworkName("")
            console.log("❌ Not on Gorbagana Chain, endpoint:", rpcEndpoint)
          }
        } else {
          // For non-Backpack wallets, don't show Gorbagana status
          setIsGorbaganaChain(false)
          setNetworkName("")
        }
      } catch (error) {
        console.warn("Error checking network (non-critical):", error)
        setIsGorbaganaChain(false)
        setNetworkName("")
      }
    }

    // Add debouncing to prevent excessive calls
    const timeoutId = setTimeout(checkNetwork, 500)
    return () => clearTimeout(timeoutId)
  }, [connected, wallet, connection, isWalletReady])

  // Enhanced balance fetching with better error handling
  useEffect(() => {
    const fetchBalance = async () => {
      if (connected && publicKey && connection && isWalletReady) {
        try {
          // Add timeout to prevent hanging requests
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Balance fetch timeout")), 10000),
          )

          const balancePromise = connection.getBalance(publicKey)
          const balance = (await Promise.race([balancePromise, timeoutPromise])) as number

          setBalance(balance / LAMPORTS_PER_SOL)

          if (isGorbaganaChain) {
            console.log("✅ Fetched balance from Gorbagana Chain:", balance / LAMPORTS_PER_SOL, "SOL")
          }
        } catch (error) {
          console.warn("Error fetching balance (non-critical):", error)
          setBalance(null)
        }
      } else {
        setBalance(null)
      }
    }

    // Debounce balance fetching
    const timeoutId = setTimeout(fetchBalance, 1000)
    return () => clearTimeout(timeoutId)
  }, [connected, publicKey, connection, isGorbaganaChain, isWalletReady])

  // Read token from URL parameter and set selected token
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tokenParam = urlParams.get("token")

    if (tokenParam) {
      // Check if the token from Gorscope matches any available trading tokens
      if (availableTokens.includes(tokenParam)) {
        setSelectedToken(tokenParam)
      } else {
        // Map Gorscope token names to available trading tokens
        const tokenMapping: Record<string, string> = {
          IQBANANA: "GOR",
          WIFAI: "WIF",
          PEPEAI: "MEOW",
          BONKDOGE: "BONK",
          GORDUMP: "GOR",
          MOONCAT: "MEOW",
          REKTAI: "GOR",
          RUGPULL: "GOR",
          SCAMCOIN: "GOR",
          HONEYPOT: "GOR",
        }

        const mappedToken = tokenMapping[tokenParam] || "GOR"
        setSelectedToken(mappedToken)
      }

      // Clean up URL parameter after processing
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  // Token prices mapping
  const tokenPrices: Record<string, string> = {
    GOR: "$0.0420",
    BONK: "$0.0069",
    WIF: "$0.1337",
    MEOW: "$0.0888",
    POPCAT: "$0.2169",
  }

  const contractAddress = "3PJ82eVhQ47HVPfozWtwSVoi42kK3NMzHXBGVoHbpump"

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress)
      setShowCopiedTooltip(true)
      setTimeout(() => setShowCopiedTooltip(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  const handlePlaceOrder = async () => {
    if (!tradeSize || Number.parseFloat(tradeSize) <= 0) return

    // Log transaction attempt for Gorbagana Chain
    if (isGorbaganaChain) {
      console.log("🚀 Simulating trade on Gorbagana Chain:", {
        token: selectedToken,
        side: selectedSide,
        size: tradeSize,
        leverage: leverage[0],
        network: "Gorbagana Chain",
      })
    }

    const entryPrice = Number.parseFloat(tokenPrices[selectedToken].replace("$", ""))
    const currentPrice = entryPrice + (Math.random() - 0.5) * 0.01 // Simulate price movement
    const sizeValue = Number.parseFloat(tradeSize)
    const leverageValue = leverage[0]

    // Calculate PnL (simplified simulation)
    const priceChange = currentPrice - entryPrice
    const pnlValue =
      selectedSide === "long"
        ? (priceChange / entryPrice) * sizeValue * leverageValue
        : -(priceChange / entryPrice) * sizeValue * leverageValue

    const pnlPercent = (pnlValue / (sizeValue * leverageValue)) * 100

    const newPosition = {
      id: Date.now().toString(),
      token: selectedToken,
      side: selectedSide,
      size: tradeSize,
      leverage: leverageValue,
      entryPrice: tokenPrices[selectedToken],
      currentPrice: `$${currentPrice.toFixed(4)}`,
      pnl: pnlValue,
      pnlPercent: pnlPercent,
      timestamp: new Date(),
    }

    setOpenPositions((prev) => [...prev, newPosition])
    setTradeSize("") // Clear trade size after order
  }

  const handleSpotOrder = async () => {
    if (!tradeSize || Number.parseFloat(tradeSize) <= 0) return

    // Log spot trade attempt for Gorbagana Chain
    if (isGorbaganaChain) {
      console.log("🔄 Simulating spot trade on Gorbagana Chain:", {
        token: selectedToken,
        side: selectedSide,
        type: orderType,
        size: tradeSize,
        price: orderType === "limit" ? limitPrice : "market",
        network: "Gorbagana Chain",
      })
    }

    // Simulate spot trade execution
    const executionPrice =
      orderType === "limit"
        ? Number.parseFloat(limitPrice)
        : Number.parseFloat(tokenPrices[selectedToken].replace("$", ""))

    const newTrade = {
      price: executionPrice,
      amount: Number.parseFloat(tradeSize),
      side: selectedSide,
      time: new Date().toLocaleTimeString(),
      isGorbagana: isGorbaganaChain,
    }

    setRecentTrades((prev) => [newTrade, ...prev.slice(0, 9)]) // Keep last 10 trades
    setTradeSize("") // Clear trade size after order
    setLimitPrice("") // Clear limit price
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
              PERPS
            </Badge>
            {/* Gorbagana Chain Status Badge */}
            {isGorbaganaChain && (
              <Badge
                variant="outline"
                className="border-green-500/50 text-green-400 bg-green-500/10 text-xs animate-pulse"
              >
                🌐 Connected to {networkName}
              </Badge>
            )}
          </div>

          {/* Custom styled wallet button with error boundary */}
          <div className="wallet-adapter-button-trigger">
            <WalletMultiButton
              className="!bg-[#4a7c7e] hover:!bg-[#5a9ca1] !text-white !border-0 !rounded-md !px-4 !py-2 !font-medium !transition-colors"
              disabled={connecting || disconnecting}
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1">
        {/* Add responsive wrapper */}
        <div className="hidden md:block">
          {/* Desktop 3-column grid layout goes here */}
          <div className="grid grid-cols-[auto_1fr_320px] lg:grid-cols-[240px_1fr_320px] h-[calc(100vh-73px)] max-w-full overflow-hidden">
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
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#6b7c5a]/20 cursor-pointer group">
                  <BarChart3 className="w-5 h-5 text-[#8a9b78] flex-shrink-0" />
                  <span className="hidden lg:block text-sm text-[#8a9b78] truncate">Trade</span>
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
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#5a9ca1]/10 transition-colors cursor-pointer group">
                  <DollarSign className="w-5 h-5 text-gray-400 group-hover:text-[#5a9ca1] flex-shrink-0" />
                  <a
                    href="/holdings"
                    className="hidden lg:block text-sm text-gray-300 group-hover:text-[#5a9ca1] truncate"
                  >
                    Holdings
                  </a>
                </div>

                {/* X (Twitter) Link */}
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

            {/* Center Chart Area */}
            <div className="flex flex-col min-w-0 p-4">
              <Card className="flex-1 bg-gray-900/50 border-gray-800 min-h-0">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 min-w-0">
                      <CardTitle className="text-xl font-bold text-[#8a9b78] truncate">{selectedToken}-PERP</CardTitle>
                      <Badge className="bg-teal-500/20 text-[#8a9b78] border-teal-500/30 flex-shrink-0">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +12.34%
                      </Badge>
                      {/* Network indicator in chart header */}
                      {isGorbaganaChain && (
                        <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/5 text-xs">
                          Gorbagana
                        </Badge>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl font-bold text-[#8a9b78]">{tokenPrices[selectedToken]}</div>
                      <div className="text-sm text-gray-400">24h Vol: $2.1M {isGorbaganaChain && "• Gorbagana"}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 min-h-0">
                  <div className="h-full bg-[#0b0b0f] rounded-lg border border-gray-800 p-4 flex items-center justify-center relative overflow-hidden">
                    {/* Animated Candlestick Chart */}
                    <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
                      {/* Grid lines */}
                      <defs>
                        <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#1f2937" strokeWidth="0.5" opacity="0.3" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />

                      {/* Price line background */}
                      <path
                        d="M50,200 Q150,180 250,160 T450,140 T650,120 T750,100"
                        fill="none"
                        stroke="url(#priceGradient)"
                        strokeWidth="2"
                        opacity="0.6"
                      >
                        <animate
                          attributeName="d"
                          values="M50,200 Q150,180 250,160 T450,140 T650,120 T750,100;
                                M50,220 Q150,200 250,180 T450,160 T650,140 T750,120;
                                M50,200 Q150,180 250,160 T450,140 T650,120 T750,100"
                          dur="4s"
                          repeatCount="indefinite"
                        />
                      </path>

                      {/* Candlesticks */}
                      {[...Array(15)].map((_, i) => {
                        const x = 80 + i * 45
                        const baseHeight = 180 + Math.sin(i * 0.5) * 40
                        const candleHeight = 20 + Math.random() * 30
                        const isGreen = Math.random() > 0.4

                        return (
                          <g key={i}>
                            {/* Wick */}
                            <line
                              x1={x}
                              y1={baseHeight - candleHeight - 10}
                              x2={x}
                              y2={baseHeight + 10}
                              stroke={isGreen ? "#10b981" : "#ef4444"}
                              strokeWidth="1"
                              opacity="0.8"
                            >
                              <animate
                                attributeName="y1"
                                values={`${baseHeight - candleHeight - 10};${baseHeight - candleHeight - 15};${baseHeight - candleHeight - 10}`}
                                dur="3s"
                                repeatCount="indefinite"
                                begin={`${i * 0.2}s`}
                              />
                            </line>

                            {/* Candle body */}
                            <rect
                              x={x - 8}
                              y={baseHeight - candleHeight}
                              width="16"
                              height={candleHeight}
                              fill={isGreen ? "#10b981" : "#ef4444"}
                              opacity="0.9"
                              rx="2"
                            >
                              <animate
                                attributeName="height"
                                values={`${candleHeight};${candleHeight + 5};${candleHeight}`}
                                dur="3s"
                                repeatCount="indefinite"
                                begin={`${i * 0.2}s`}
                              />
                              <animate
                                attributeName="y"
                                values={`${baseHeight - candleHeight};${baseHeight - candleHeight - 5};${baseHeight - candleHeight}`}
                                dur="3s"
                                repeatCount="indefinite"
                                begin={`${i * 0.2}s`}
                              />
                            </rect>
                          </g>
                        )
                      })}

                      {/* Volume bars at bottom */}
                      {[...Array(15)].map((_, i) => {
                        const x = 80 + i * 45
                        const volumeHeight = 10 + Math.random() * 25

                        return (
                          <rect
                            key={`vol-${i}`}
                            x={x - 6}
                            y={350 - volumeHeight}
                            width="12"
                            height={volumeHeight}
                            fill="#6366f1"
                            opacity="0.4"
                            rx="1"
                          >
                            <animate
                              attributeName="height"
                              values={`${volumeHeight};${volumeHeight + 8};${volumeHeight}`}
                              dur="2s"
                              repeatCount="indefinite"
                              begin={`${i * 0.3}s`}
                            />
                            <animate
                              attributeName="y"
                              values={`${350 - volumeHeight};${350 - volumeHeight - 8};${350 - volumeHeight}`}
                              dur="2s"
                              repeatCount="indefinite"
                              begin={`${i * 0.3}s`}
                            />
                          </rect>
                        )
                      })}

                      {/* Moving average line */}
                      <path
                        d="M50,160 Q200,150 400,140 T750,130"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="1.5"
                        opacity="0.7"
                        strokeDasharray="5,5"
                      >
                        <animate attributeName="stroke-dashoffset" values="0;10;0" dur="2s" repeatCount="indefinite" />
                      </path>

                      {/* Price gradients */}
                      <defs>
                        <linearGradient id="priceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="50%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>

                      {/* Floating price indicator */}
                      <circle cx="750" cy="100" r="4" fill="#10b981" opacity="0.9">
                        <animate attributeName="cy" values="100;95;105;100" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.9;1;0.9" dur="1s" repeatCount="indefinite" />
                      </circle>

                      {/* Live data pulse effect */}
                      <circle cx="750" cy="100" r="4" fill="none" stroke="#10b981" strokeWidth="2" opacity="0">
                        <animate attributeName="r" values="4;12;4" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0;0.8;0" dur="2s" repeatCount="indefinite" />
                      </circle>
                    </svg>

                    {/* Chart overlay info */}
                    <div className="absolute top-4 left-4 text-xs text-gray-400 space-y-1">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full animate-pulse ${isGorbaganaChain ? "bg-green-500" : "bg-blue-500"}`}
                        ></div>
                        <span>Live {isGorbaganaChain ? "• Gorbagana" : ""}</span>
                      </div>
                      <div>1H • {isGorbaganaChain ? "Gorbagana" : "Testnet"}</div>
                    </div>

                    {/* Price levels on right */}
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 space-y-4">
                      <div className="text-green-400">$425.12</div>
                      <div className="text-white">$420.69</div>
                      <div className="text-red-400">$415.33</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Footer moved inside center column */}
              <div className="mt-4">
                <Card className="bg-gray-900/30 border-gray-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-[#8a9b78]">
                      Open Positions {isGorbaganaChain && "• Gorbagana Chain"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {openPositions.length === 0 ? (
                      <div className="text-center text-gray-500 text-sm py-4">
                        No open positions
                        <div className="text-xs mt-1">
                          {isGorbaganaChain ? "Ready to trade on Gorbagana Chain" : "Ready to trade"}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {openPositions.map((position) => (
                          <div key={position.id} className="p-3 bg-gray-800/30 rounded-lg border border-gray-800">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center space-x-2">
                                <Badge
                                  className={`${
                                    position.side === "long"
                                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                                      : "bg-red-500/20 text-red-400 border-red-500/30"
                                  }`}
                                >
                                  {position.side.toUpperCase()}
                                </Badge>
                                <span className="text-white font-medium">{position.token}-PERP</span>
                                <span className="text-gray-400 text-sm">{position.leverage}x</span>
                                {isGorbaganaChain && (
                                  <Badge
                                    variant="outline"
                                    className="border-green-500/30 text-green-400 bg-green-500/5 text-xs"
                                  >
                                    G
                                  </Badge>
                                )}
                              </div>
                              <div
                                className={`text-sm font-medium ${
                                  position.pnl >= 0 ? "text-green-400" : "text-red-400"
                                }`}
                              >
                                {position.pnl >= 0 ? "+" : ""}${position.pnl.toFixed(2)}
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-xs text-gray-400">
                              <div>
                                <div>Size</div>
                                <div className="text-white">{position.size} SOL</div>
                              </div>
                              <div>
                                <div>Entry</div>
                                <div className="text-white">{position.entryPrice}</div>
                              </div>
                              <div>
                                <div>Current</div>
                                <div className="text-white">{position.currentPrice}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Trading Panel */}
            <div className="border-l border-gray-800 bg-[#0b0b0f] p-4 space-y-4 min-w-0 max-w-[320px] overflow-y-auto">
              {/* Trading Mode Toggle */}
              <div className="mb-4">
                <div className="flex items-center justify-center p-1 bg-gray-800/50 rounded-lg">
                  <button
                    onClick={() => setTradingMode("spot")}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                      tradingMode === "spot" ? "bg-[#4a7c7e] text-white shadow-lg" : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    🍌 Spot
                  </button>
                  <button
                    onClick={() => setTradingMode("perps")}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                      tradingMode === "perps"
                        ? "bg-[#4a7c7e] text-white shadow-lg"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    ⚡ Perps
                  </button>
                </div>
              </div>

              {/* Token Selector Dropdown */}
              <div className="mb-4">
                <Label className="text-sm font-medium text-[#8a9b78] mb-2 block">Select Token</Label>
                <Select value={selectedToken} onValueChange={setSelectedToken}>
                  <SelectTrigger className="w-full bg-gray-800/50 border-gray-700 focus:border-[#4a7c7e] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="GOR" className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20">
                      🦍 GOR
                    </SelectItem>
                    <SelectItem value="BONK" className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20">
                      🐕 BONK
                    </SelectItem>
                    <SelectItem value="WIF" className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20">
                      📶 WIF
                    </SelectItem>
                    <SelectItem value="MEOW" className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20">
                      🐱 MEOW
                    </SelectItem>
                    <SelectItem value="POPCAT" className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20">
                      🐈 POPCAT
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Conditional Rendering: Spot vs Perps */}
              {tradingMode === "spot" ? (
                /* SPOT MODE */
                <>
                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg text-[#8a9b78] flex items-center gap-2">
                        🍌 Spot Trade {selectedToken}
                        {isGorbaganaChain && (
                          <Badge
                            variant="outline"
                            className="border-green-500/30 text-green-400 bg-green-500/5 text-xs"
                          >
                            Gorbagana
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Order Type Toggle */}
                      <Tabs value={orderType} onValueChange={(value) => setOrderType(value as "market" | "limit")}>
                        <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
                          <TabsTrigger
                            value="market"
                            className="data-[state=active]:bg-[#4a7c7e]/20 data-[state=active]:text-[#4a7c7e] data-[state=active]:border-[#4a7c7e]/50"
                          >
                            Market
                          </TabsTrigger>
                          <TabsTrigger
                            value="limit"
                            className="data-[state=active]:bg-[#4a7c7e]/20 data-[state=active]:text-[#4a7c7e] data-[state=active]:border-[#4a7c7e]/50"
                          >
                            Limit
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>

                      {/* Buy/Sell Toggle */}
                      <Tabs value={selectedSide} onValueChange={(value) => setSelectedSide(value as "long" | "short")}>
                        <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
                          <TabsTrigger
                            value="long"
                            className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 data-[state=active]:border-green-500/50"
                          >
                            🚀 Buy
                          </TabsTrigger>
                          <TabsTrigger
                            value="short"
                            className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 data-[state=state=active]:border-red-500/50"
                          >
                            🗑️ Sell
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>

                      {/* Limit Price Input (only for limit orders) */}
                      {orderType === "limit" && (
                        <div className="space-y-2">
                          <Label htmlFor="limitPrice" className="text-sm font-medium text-gray-300">
                            Limit Price (USD) {isGorbaganaChain && "• Gorbagana"}
                          </Label>
                          <Input
                            id="limitPrice"
                            type="number"
                            placeholder="0.0420"
                            value={limitPrice}
                            onChange={(e) => setLimitPrice(e.target.value)}
                            className="bg-gray-800/50 border-gray-700 focus:border-[#4a7c7e] text-white placeholder-gray-500"
                          />
                        </div>
                      )}

                      {/* Trade Size Input */}
                      <div className="space-y-2">
                        <Label htmlFor="tradeSize" className="text-sm font-medium text-gray-300">
                          Amount ({selectedSide === "long" ? "SOL" : selectedToken}){" "}
                          {isGorbaganaChain && "• Gorbagana Chain"}
                        </Label>
                        <Input
                          id="tradeSize"
                          type="number"
                          placeholder="0.00"
                          value={tradeSize}
                          onChange={(e) => setTradeSize(e.target.value)}
                          className="bg-gray-800/50 border-gray-700 focus:border-[#4a7c7e] text-white placeholder-gray-500"
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                          <span className="truncate">
                            Available: {balance !== null ? balance.toFixed(3) : "0.000"} SOL
                            {isGorbaganaChain && " (Gorbagana)"}
                          </span>
                          <span className="text-[#8a9b78] flex-shrink-0">
                            ${balance !== null ? (balance * 42).toFixed(2) : "0.00"}
                          </span>
                        </div>
                      </div>

                      {/* Quick Size Buttons */}
                      <div className="grid grid-cols-4 gap-2">
                        {["25%", "50%", "75%", "MAX"].map((amount) => (
                          <Button
                            key={amount}
                            variant="outline"
                            size="sm"
                            className="bg-gray-800/80 border-gray-700 hover:border-[#4a7c7e] hover:bg-[#4a7c7e]/20 text-gray-200 hover:text-[#4a7c7e]"
                            onClick={() => {
                              if (balance !== null) {
                                const percentage = amount === "MAX" ? 100 : Number.parseInt(amount)
                                const maxAmount = balance
                                setTradeSize(((maxAmount * percentage) / 100).toFixed(3))
                              }
                            }}
                          >
                            {amount}
                          </Button>
                        ))}
                      </div>

                      {/* Trade Summary */}
                      <div className="space-y-2 p-3 bg-gray-800/30 rounded-lg border border-gray-800">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">
                            {orderType === "market" ? "Market Price" : "Limit Price"}
                          </span>
                          <span className="text-white">
                            {orderType === "market" ? tokenPrices[selectedToken] : limitPrice ? `$${limitPrice}` : "—"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">{selectedSide === "long" ? "Spending" : "Selling"}</span>
                          <span className="text-white truncate">
                            {tradeSize || "0.00"} {selectedSide === "long" ? "SOL" : selectedToken}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">
                            {selectedSide === "long" ? "Est. Receive" : "Est. Receive"}
                          </span>
                          <span className="text-white">
                            {selectedSide === "long"
                              ? `${tradeSize ? (Number.parseFloat(tradeSize) / Number.parseFloat(tokenPrices[selectedToken].replace("$", ""))).toFixed(3) : "0.000"} ${selectedToken}`
                              : `${tradeSize ? (Number.parseFloat(tradeSize) * Number.parseFloat(tokenPrices[selectedToken].replace("$", ""))).toFixed(3) : "0.000"} SOL`}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Est. Fee</span>
                          <span className="text-white">0.001 SOL</span>
                        </div>
                        {isGorbaganaChain && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Network</span>
                            <span className="text-green-400">Gorbagana Chain</span>
                          </div>
                        )}
                      </div>

                      {/* Place Order Button */}
                      <Button
                        className={`w-full py-3 font-semibold transition-all duration-200 transform hover:scale-105 ${
                          selectedSide === "long"
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        }`}
                        disabled={!tradeSize || (orderType === "limit" && !limitPrice)}
                        onClick={handleSpotOrder}
                      >
                        {selectedSide === "long" ? "🚀" : "🗑️"} {selectedSide === "long" ? "Buy" : "Sell"}{" "}
                        {selectedToken}
                        {isGorbaganaChain && " (Gorbagana)"}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* DEX Swap Info */}
                  <Card className="bg-gray-900/30 border-gray-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-[#8a9b78] flex items-center gap-2">
                        🔄 Swap Details {isGorbaganaChain && "• Gorbagana"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Slippage Tolerance</span>
                        <span className="text-white">0.5%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Price Impact</span>
                        <span className="text-green-400">~0.12%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Min. Received</span>
                        <span className="text-white">
                          {selectedSide === "long"
                            ? `${tradeSize ? ((Number.parseFloat(tradeSize) / Number.parseFloat(tokenPrices[selectedToken].replace("$", ""))) * 0.995).toFixed(3) : "0.000"} ${selectedToken}`
                            : `${tradeSize ? (Number.parseFloat(tradeSize) * Number.parseFloat(tokenPrices[selectedToken].replace("$", "")) * 0.995).toFixed(3) : "0.000"} SOL`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Route</span>
                        <span className="text-blue-400">
                          {selectedSide === "long" ? `SOL → ${selectedToken}` : `${selectedToken} → SOL`}
                        </span>
                      </div>
                      {isGorbaganaChain && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">DEX</span>
                          <span className="text-green-400">GorSwap 🍌</span>
                        </div>
                      )}
                      <div className="pt-2 border-t border-gray-700">
                        <div className="text-xs text-gray-500 text-center">
                          🔄 Powered by {isGorbaganaChain ? "GorSwap AMM" : "Jupiter Aggregator"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Trades */}
                  <Card className="bg-gray-900/30 border-gray-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-[#8a9b78] flex items-center gap-2">
                        🔄 Recent Trades {isGorbaganaChain && "• Gorbagana"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {recentTrades.map((trade, index) => (
                          <div key={index} className="flex justify-between items-center text-xs">
                            <span className={`${trade.side === "buy" ? "text-green-400" : "text-red-400"}`}>
                              {trade.side === "buy" ? "🚀" : "🗑️"} ${trade.price.toFixed(4)}
                            </span>
                            <span className="text-gray-300">{trade.amount.toFixed(1)}</span>
                            <div className="flex items-center gap-1">
                              <span className="text-gray-500">{trade.time}</span>
                              {trade.isGorbagana && <span className="text-green-400 text-xs">🌐</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                /* PERPS MODE (existing code) */
                <>
                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg text-[#8a9b78] flex items-center gap-2">
                        Trade {selectedToken}-PERP
                        {isGorbaganaChain && (
                          <Badge
                            variant="outline"
                            className="border-green-500/30 text-green-400 bg-green-500/5 text-xs"
                          >
                            Gorbagana
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Long/Short Toggle */}
                      <Tabs value={selectedSide} onValueChange={(value) => setSelectedSide(value as "long" | "short")}>
                        <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
                          <TabsTrigger
                            value="long"
                            className="data-[state=active]:bg-[#4a7c7e]/20 data-[state=active]:text-[#4a7c7e] data-[state=active]:border-[#4a7c7e]/50"
                          >
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Long
                          </TabsTrigger>
                          <TabsTrigger
                            value="short"
                            className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 data-[state=active]:border-red-500/50"
                          >
                            <TrendingDown className="w-4 h-4 mr-2" />
                            Short
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>

                      {/* Trade Size Input */}
                      <div className="space-y-2">
                        <Label htmlFor="tradeSize" className="text-sm font-medium text-gray-300">
                          Size (SOL) {isGorbaganaChain && "• Gorbagana Chain"}
                        </Label>
                        <Input
                          id="tradeSize"
                          type="number"
                          placeholder="0.00"
                          value={tradeSize}
                          onChange={(e) => setTradeSize(e.target.value)}
                          className="bg-gray-800/50 border-gray-700 focus:border-[#4a7c7e] text-white placeholder-gray-500"
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                          <span className="truncate">
                            Available: {balance !== null ? balance.toFixed(3) : "0.000"} SOL
                            {isGorbaganaChain && " (Gorbagana)"}
                          </span>
                          <span className="text-[#8a9b78] flex-shrink-0">
                            ${balance !== null ? (balance * 42).toFixed(2) : "0.00"}
                          </span>
                        </div>
                      </div>

                      {/* Leverage Slider */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm font-medium text-gray-300">Leverage</Label>
                          <Badge variant="outline" className="border-[#6b7c5a]/50 text-[#8a9b78] bg-[#6b7c5a]/10">
                            {leverage[0]}x
                          </Badge>
                        </div>
                        <Slider
                          value={leverage}
                          onValueChange={setLeverage}
                          max={20}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>1x</span>
                          <span>20x</span>
                        </div>
                      </div>

                      {/* Quick Size Buttons */}
                      <div className="grid grid-cols-4 gap-2">
                        {["25%", "50%", "75%", "MAX"].map((amount) => (
                          <Button
                            key={amount}
                            variant="outline"
                            size="sm"
                            className="bg-gray-800/80 border-gray-700 hover:border-[#4a7c7e] hover:bg-[#4a7c7e]/20 text-gray-200 hover:text-[#4a7c7e]"
                            onClick={() => {
                              if (balance !== null) {
                                const percentage = amount === "MAX" ? 100 : Number.parseInt(amount)
                                const maxAmount = balance
                                setTradeSize(((maxAmount * percentage) / 100).toFixed(3))
                              }
                            }}
                          >
                            {amount}
                          </Button>
                        ))}
                      </div>

                      {/* Trade Summary */}
                      <div className="space-y-2 p-3 bg-gray-800/30 rounded-lg border border-gray-800">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Entry Price</span>
                          <span className="text-white">{tokenPrices[selectedToken]}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Position Size</span>
                          <span className="text-white truncate">{tradeSize || "0.00"} SOL</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Est. Fee</span>
                          <span className="text-white">0.001 SOL</span>
                        </div>
                        {isGorbaganaChain && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Network</span>
                            <span className="text-green-400">Gorbagana Chain</span>
                          </div>
                        )}
                      </div>

                      {/* Place Order Button */}
                      <Button
                        className={`w-full py-3 font-semibold transition-all duration-200 ${
                          selectedSide === "long"
                            ? "bg-[#4a7c7e] hover:bg-[#5a9ca1] text-white"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        }`}
                        disabled={!tradeSize}
                        onClick={handlePlaceOrder}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        {selectedSide === "long" ? "Long" : "Short"} {selectedToken} {leverage[0]}x
                        {isGorbaganaChain && " (Gorbagana)"}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Market Stats */}
                  <Card className="bg-gray-900/30 border-gray-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-[#8a9b78]">
                        Market Stats {isGorbaganaChain && "• Gorbagana"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">24h High</span>
                        <span className="text-[#8a9b78]">$425.12</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">24h Low</span>
                        <span className="text-red-400">$415.33</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Open Interest</span>
                        <span className="text-white">$12.4M</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Funding Rate</span>
                        <span className="text-purple-400">0.0123%</span>
                      </div>
                      {isGorbaganaChain && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Network</span>
                          <span className="text-green-400">Gorbagana Chain</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="md:hidden">
          <div className="p-4">
            {/* Mobile X (Twitter) Link - Sticky at top */}
            <div className="fixed top-20 right-4 z-50">
              <a
                href="https://x.com/GorTradeSol"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-full hover:bg-[#5a9ca1]/20 hover:border-[#5a9ca1]/50 transition-all duration-200 hover:shadow-lg hover:shadow-[#5a9ca1]/20"
              >
                <X className="w-5 h-5 text-gray-300 hover:text-[#5a9ca1]" strokeWidth={2.5} />
              </a>
            </div>

            <Card className="bg-gray-900/50 border-gray-800 mb-4">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-[#8a9b78]">Trade {selectedToken}-PERP</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-teal-500/20 text-[#8a9b78] border-teal-500/30">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +12.34%
                    </Badge>
                    {isGorbaganaChain && (
                      <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/5 text-xs">
                        Gorbagana
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-[#0b0b0f] rounded-lg border border-gray-800 p-4 flex items-center justify-center relative overflow-hidden">
                  {/* Animated Candlestick Chart for Mobile */}
                  <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
                    {/* Grid lines */}
                    <defs>
                      <pattern id="grid-mobile" width="40" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#1f2937" strokeWidth="0.5" opacity="0.3" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-mobile)" />

                    {/* Price line background */}
                    <path
                      d="M50,200 Q150,180 250,160 T450,140 T650,120 T750,100"
                      fill="none"
                      stroke="url(#priceGradient-mobile)"
                      strokeWidth="2"
                      opacity="0.6"
                    >
                      <animate
                        attributeName="d"
                        values="M50,200 Q150,180 250,160 T450,140 T650,120 T750,100;
              M50,220 Q150,200 250,180 T450,160 T650,140 T750,120;
              M50,200 Q150,180 250,160 T450,140 T650,120 T750,100"
                        dur="4s"
                        repeatCount="indefinite"
                      />
                    </path>

                    {/* Candlesticks */}
                    {[...Array(12)].map((_, i) => {
                      const x = 80 + i * 55
                      const baseHeight = 180 + Math.sin(i * 0.5) * 40
                      const candleHeight = 20 + Math.random() * 30
                      const isGreen = Math.random() > 0.4

                      return (
                        <g key={i}>
                          {/* Wick */}
                          <line
                            x1={x}
                            y1={baseHeight - candleHeight - 10}
                            x2={x}
                            y2={baseHeight + 10}
                            stroke={isGreen ? "#10b981" : "#ef4444"}
                            strokeWidth="1"
                            opacity="0.8"
                          >
                            <animate
                              attributeName="y1"
                              values={`${baseHeight - candleHeight - 10};${baseHeight - candleHeight - 15};${baseHeight - candleHeight - 10}`}
                              dur="3s"
                              repeatCount="indefinite"
                              begin={`${i * 0.2}s`}
                            />
                          </line>

                          {/* Candle body */}
                          <rect
                            x={x - 8}
                            y={baseHeight - candleHeight}
                            width="16"
                            height={candleHeight}
                            fill={isGreen ? "#10b981" : "#ef4444"}
                            opacity="0.9"
                            rx="2"
                          >
                            <animate
                              attributeName="height"
                              values={`${candleHeight};${candleHeight + 5};${candleHeight}`}
                              dur="3s"
                              repeatCount="indefinite"
                              begin={`${i * 0.2}s`}
                            />
                            <animate
                              attributeName="y"
                              values={`${baseHeight - candleHeight};${baseHeight - candleHeight - 5};${baseHeight - candleHeight}`}
                              dur="3s"
                              repeatCount="indefinite"
                              begin={`${i * 0.2}s`}
                            />
                          </rect>
                        </g>
                      )
                    })}

                    {/* Volume bars at bottom */}
                    {[...Array(12)].map((_, i) => {
                      const x = 80 + i * 55
                      const volumeHeight = 10 + Math.random() * 25

                      return (
                        <rect
                          key={`vol-mobile-${i}`}
                          x={x - 6}
                          y={350 - volumeHeight}
                          width="12"
                          height={volumeHeight}
                          fill="#6366f1"
                          opacity="0.4"
                          rx="1"
                        >
                          <animate
                            attributeName="height"
                            values={`${volumeHeight};${volumeHeight + 8};${volumeHeight}`}
                            dur="2s"
                            repeatCount="indefinite"
                            begin={`${i * 0.3}s`}
                          />
                          <animate
                            attributeName="y"
                            values={`${350 - volumeHeight};${350 - volumeHeight - 8};${350 - volumeHeight}`}
                            dur="2s"
                            repeatCount="indefinite"
                            begin={`${i * 0.3}s`}
                          />
                        </rect>
                      )
                    })}

                    {/* Moving average line */}
                    <path
                      d="M50,160 Q200,150 400,140 T750,130"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="1.5"
                      opacity="0.7"
                      strokeDasharray="5,5"
                    >
                      <animate attributeName="stroke-dashoffset" values="0;10;0" dur="2s" repeatCount="indefinite" />
                    </path>

                    {/* Price gradients */}
                    <defs>
                      <linearGradient id="priceGradient-mobile" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="50%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>

                    {/* Floating price indicator */}
                    <circle cx="750" cy="100" r="4" fill="#10b981" opacity="0.9">
                      <animate attributeName="cy" values="100;95;105;100" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.9;1;0.9" dur="1s" repeatCount="indefinite" />
                    </circle>

                    {/* Live data pulse effect */}
                    <circle cx="750" cy="100" r="4" fill="none" stroke="#10b981" strokeWidth="2" opacity="0">
                      <animate attributeName="r" values="4;12;4" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0;0.8;0" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </svg>

                  {/* Chart overlay info */}
                  <div className="absolute top-4 left-4 text-xs text-gray-400 space-y-1">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full animate-pulse ${isGorbaganaChain ? "bg-green-500" : "bg-blue-500"}`}
                      ></div>
                      <span>Live {isGorbaganaChain ? "• Gorbagana" : ""}</span>
                    </div>
                    <div>1H • {isGorbaganaChain ? "Gorbagana" : "Testnet"}</div>
                  </div>

                  {/* Price levels on right */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 space-y-4">
                    <div className="text-green-400">$425.12</div>
                    <div className="text-white">$420.69</div>
                    <div className="text-red-400">$415.33</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mobile trading panel - same content as desktop but full width */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-[#8a9b78] flex items-center gap-2">
                  Trade {selectedToken}-PERP
                  {isGorbaganaChain && (
                    <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/5 text-xs">
                      Gorbagana
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Long/Short Toggle */}
                <Tabs value={selectedSide} onValueChange={(value) => setSelectedSide(value as "long" | "short")}>
                  <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
                    <TabsTrigger
                      value="long"
                      className="data-[state=active]:bg-[#4a7c7e]/20 data-[state=active]:text-[#4a7c7e] data-[state=active]:border-[#4a7c7e]/50"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Long
                    </TabsTrigger>
                    <TabsTrigger
                      value="short"
                      className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 data-[state=active]:border-red-500/50"
                    >
                      <TrendingDown className="w-4 h-4 mr-2" />
                      Short
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Trade Size Input */}
                <div className="space-y-2">
                  <Label htmlFor="tradeSize" className="text-sm font-medium text-gray-300">
                    Size (SOL) {isGorbaganaChain && "• Gorbagana Chain"}
                  </Label>
                  <Input
                    id="tradeSize"
                    type="number"
                    placeholder="0.00"
                    value={tradeSize}
                    onChange={(e) => setTradeSize(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 focus:border-[#4a7c7e] text-white placeholder-gray-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span className="truncate">
                      Available: {balance !== null ? balance.toFixed(3) : "0.000"} SOL
                      {isGorbaganaChain && " (Gorbagana)"}
                    </span>
                    <span className="text-[#8a9b78] flex-shrink-0">
                      ${balance !== null ? (balance * 42).toFixed(2) : "0.00"}
                    </span>
                  </div>
                </div>

                {/* Leverage Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium text-gray-300">Leverage</Label>
                    <Badge variant="outline" className="border-[#6b7c5a]/50 text-[#8a9b78] bg-[#6b7c5a]/10">
                      {leverage[0]}x
                    </Badge>
                  </div>
                  <Slider value={leverage} onValueChange={setLeverage} max={20} min={1} step={1} className="w-full" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1x</span>
                    <span>20x</span>
                  </div>
                </div>

                {/* Quick Size Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {["25%", "50%", "75%", "MAX"].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      className="bg-gray-800/80 border-gray-700 hover:border-[#4a7c7e] hover:bg-[#4a7c7e]/20 text-gray-200 hover:text-[#4a7c7e]"
                      onClick={() => {
                        if (balance !== null) {
                          const percentage = amount === "MAX" ? 100 : Number.parseInt(amount)
                          const maxAmount = balance
                          setTradeSize(((maxAmount * percentage) / 100).toFixed(3))
                        }
                      }}
                    >
                      {amount}
                    </Button>
                  ))}
                </div>

                {/* Trade Summary */}
                <div className="space-y-2 p-3 bg-gray-800/30 rounded-lg border border-gray-800">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Entry Price</span>
                    <span className="text-white">{tokenPrices[selectedToken]}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Position Size</span>
                    <span className="text-white truncate">{tradeSize || "0.00"} SOL</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Est. Fee</span>
                    <span className="text-white">0.001 SOL</span>
                  </div>
                  {isGorbaganaChain && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Network</span>
                      <span className="text-green-400">Gorbagana Chain</span>
                    </div>
                  )}
                </div>

                {/* Place Order Button */}
                <Button
                  className={`w-full py-3 font-semibold transition-all duration-200 ${
                    selectedSide === "long"
                      ? "bg-[#4a7c7e] hover:bg-[#5a9ca1] text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                  disabled={!tradeSize}
                  onClick={handlePlaceOrder}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {selectedSide === "long" ? "Long" : "Short"} {selectedToken} {leverage[0]}x
                  {isGorbaganaChain && " (Gorbagana)"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-[#0b0b0f] p-4">
        <div className="text-center">
          <span className="text-xs text-gray-500">CA: </span>
          <button
            onClick={copyToClipboard}
            className="text-xs text-gray-500 hover:text-gray-400 cursor-pointer relative"
          >
            {contractAddress}
            {showCopiedTooltip && (
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded">
                Copied!
              </span>
            )}
          </button>
        </div>
      </footer>

      <style jsx global>{`
      .wallet-adapter-button-trigger {
        --wallet-adapter-button-bg: #4a7c7e;
        --wallet-adapter-button-bg-hover: #5a9ca1;
        --wallet-adapter-button-text: white;
        --wallet-adapter-button-border: none;
      }
      
      .wallet-adapter-modal-wrapper {
        --wallet-adapter-modal-bg: #1f2937;
        --wallet-adapter-modal-border: #374151;
        --wallet-adapter-modal-text: white;
      }
      
      .wallet-adapter-modal-list {
        background: #1f2937;
      }
      
      .wallet-adapter-modal-list-more {
        background: #1f2937;
        border-top: 1px solid #374151;
      }
      
      .wallet-adapter-modal-list-more button {
        color: #9ca3af;
      }
      
      .wallet-adapter-modal-list-more button:hover {
        color: #5a9ca1;
      }
      
      .wallet-adapter-modal-button-close {
        color: #9ca3af;
      }
      
      .wallet-adapter-modal-button-close:hover {
        color: white;
      }
      
      .wallet-adapter-modal-title {
        color: white;
      }
      
      .wallet-adapter-modal-list li button {
        background: #374151;
        border: 1px solid #4b5563;
        color: white;
      }
      
      .wallet-adapter-modal-list li button:hover {
        background: #4b5563;
        border-color: #5a9ca1;
      }
      
      .wallet-adapter-modal-list li button:not([disabled]):hover {
        background: #4b5563;
      }
    `}</style>
    </div>
  )
}
