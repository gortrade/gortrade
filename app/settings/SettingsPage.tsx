"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { SettingsIcon, BarChart3, DollarSign, X, Search, Shield, Globe, Zap, Save, RotateCcw } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [hideSmallBalances, setHideSmallBalances] = useState(false)
  const [slippageTolerance, setSlippageTolerance] = useState("0.5")
  const [rpcEndpoint, setRpcEndpoint] = useState("")
  const [maxGasPrice, setMaxGasPrice] = useState("0.01")

  const { connected } = useWallet()

  const handleSaveSettings = () => {
    // In a real app, this would save to localStorage or backend
    console.log("Settings saved:", {
      notifications,
      darkMode,
      autoRefresh,
      hideSmallBalances,
      slippageTolerance,
      rpcEndpoint,
      maxGasPrice,
    })
    alert("Settings saved successfully!")
  }

  const handleResetSettings = () => {
    setNotifications(true)
    setDarkMode(true)
    setAutoRefresh(true)
    setHideSmallBalances(false)
    setSlippageTolerance("0.5")
    setRpcEndpoint("")
    setMaxGasPrice("0.01")
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
              SETTINGS
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
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#6b7c5a]/20 cursor-pointer group">
                  <SettingsIcon className="w-5 h-5 text-[#8a9b78] flex-shrink-0" />
                  <span className="hidden lg:block text-sm text-[#8a9b78] truncate">Settings</span>
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

            {/* Main Settings Area */}
            <div className="flex flex-col min-w-0 p-6">
              {/* Header */}
              <div className="mb-6 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-[#8a9b78] flex items-center gap-3">
                      <SettingsIcon className="w-8 h-8" />
                      Settings
                    </h1>
                    <p className="text-gray-400 mt-2">Customize your GorTrade experience</p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleResetSettings}
                      variant="outline"
                      className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                    <Button onClick={handleSaveSettings} className="bg-[#4a7c7e] hover:bg-[#5a9ca1] text-white">
                      <Save className="w-4 h-4 mr-2" />
                      Save Settings
                    </Button>
                  </div>
                </div>
              </div>

              {/* Settings Sections */}
              <div className="space-y-6 pb-6">
                {/* General Settings */}
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-[#8a9b78] flex items-center gap-2">
                      <SettingsIcon className="w-5 h-5" />
                      General
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Enable Notifications</Label>
                        <p className="text-sm text-gray-400">Get alerts for price changes and trades</p>
                      </div>
                      <Switch checked={notifications} onCheckedChange={setNotifications} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Dark Mode</Label>
                        <p className="text-sm text-gray-400">Use dark theme (recommended)</p>
                      </div>
                      <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Auto Refresh</Label>
                        <p className="text-sm text-gray-400">Automatically refresh prices and data</p>
                      </div>
                      <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
                    </div>
                  </CardContent>
                </Card>

                {/* Trading Settings */}
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-[#8a9b78] flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Trading
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-white">Slippage Tolerance (%)</Label>
                      <Input
                        type="number"
                        value={slippageTolerance}
                        onChange={(e) => setSlippageTolerance(e.target.value)}
                        className="mt-2 bg-gray-800 border-gray-700 text-white"
                        placeholder="0.5"
                      />
                      <p className="text-sm text-gray-400 mt-1">Maximum price slippage for trades</p>
                    </div>
                    <div>
                      <Label className="text-white">Max Gas Price (SOL)</Label>
                      <Input
                        type="number"
                        value={maxGasPrice}
                        onChange={(e) => setMaxGasPrice(e.target.value)}
                        className="mt-2 bg-gray-800 border-gray-700 text-white"
                        placeholder="0.01"
                      />
                      <p className="text-sm text-gray-400 mt-1">Maximum gas price for transactions</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Portfolio Settings */}
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-[#8a9b78] flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Portfolio
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Hide Small Balances</Label>
                        <p className="text-sm text-gray-400">Hide tokens worth less than $1</p>
                      </div>
                      <Switch checked={hideSmallBalances} onCheckedChange={setHideSmallBalances} />
                    </div>
                  </CardContent>
                </Card>

                {/* Network Settings */}
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-[#8a9b78] flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Network
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-white">Custom RPC Endpoint</Label>
                      <Input
                        type="url"
                        value={rpcEndpoint}
                        onChange={(e) => setRpcEndpoint(e.target.value)}
                        className="mt-2 bg-gray-800 border-gray-700 text-white"
                        placeholder="https://api.mainnet-beta.solana.com"
                      />
                      <p className="text-sm text-gray-400 mt-1">Leave empty to use default RPC</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Security Settings */}
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-[#8a9b78] flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-400 mb-2">
                        <Shield className="w-4 h-4" />
                        <span className="font-medium">Security Notice</span>
                      </div>
                      <p className="text-sm text-yellow-300">
                        Always verify transaction details before signing. Never share your private keys or seed phrase.
                      </p>
                    </div>
                    {connected && (
                      <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                        <div className="flex items-center gap-2 text-green-400 mb-2">
                          <Shield className="w-4 h-4" />
                          <span className="font-medium">Wallet Connected</span>
                        </div>
                        <p className="text-sm text-green-300">Your wallet is securely connected to GorTrade.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="md:hidden p-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#8a9b78] flex items-center gap-2 mb-2">
              <SettingsIcon className="w-6 h-6" />
              Settings
            </h1>
            <p className="text-gray-400 text-sm">Customize your GorTrade experience</p>
          </div>

          <div className="space-y-4">
            {/* Mobile Settings Cards */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-[#8a9b78] text-lg">General</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white text-sm">Notifications</Label>
                    <p className="text-xs text-gray-400">Price alerts</p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white text-sm">Dark Mode</Label>
                    <p className="text-xs text-gray-400">Dark theme</p>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-[#8a9b78] text-lg">Trading</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white text-sm">Slippage (%)</Label>
                  <Input
                    type="number"
                    value={slippageTolerance}
                    onChange={(e) => setSlippageTolerance(e.target.value)}
                    className="mt-2 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                onClick={handleResetSettings}
                variant="outline"
                className="flex-1 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
              >
                Reset
              </Button>
              <Button onClick={handleSaveSettings} className="flex-1 bg-[#4a7c7e] hover:bg-[#5a9ca1] text-white">
                Save
              </Button>
            </div>
          </div>
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
