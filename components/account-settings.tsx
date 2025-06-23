"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Settings, Info, Zap, Shield, Clock, Save, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { useGlobalWallet } from "@/hooks/use-global-wallet"
import { useToast } from "@/hooks/use-toast"

interface UserSettings {
  // Quick Buy Settings
  selectedPreset: "S1" | "S2" | "S3"
  slippage: number
  smartMevProtection: boolean
  transactionSpeed: "default" | "auto"

  // Preset configurations
  presets: {
    S1: { slippage: number; mevProtection: boolean; speed: "default" | "auto" }
    S2: { slippage: number; mevProtection: boolean; speed: "default" | "auto" }
    S3: { slippage: number; mevProtection: boolean; speed: "default" | "auto" }
  }
}

const defaultSettings: UserSettings = {
  selectedPreset: "S1",
  slippage: 15.0,
  smartMevProtection: true,
  transactionSpeed: "default",
  presets: {
    S1: { slippage: 15.0, mevProtection: true, speed: "default" },
    S2: { slippage: 25.0, mevProtection: false, speed: "auto" },
    S3: { slippage: 10.0, mevProtection: true, speed: "auto" },
  },
}

export function AccountSettings() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Use global wallet state
  const { connected, publicKey, walletType } = useGlobalWallet()
  const { toast } = useToast()

  // Get storage key for current wallet
  const getStorageKey = () => {
    if (!publicKey) return null
    return `gortrade_settings_${publicKey}`
  }

  // Load settings from localStorage
  const loadSettings = () => {
    const storageKey = getStorageKey()
    if (!storageKey) return

    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsedSettings = JSON.parse(saved)
        setSettings({ ...defaultSettings, ...parsedSettings })
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
    }
  }

  // Save settings to localStorage
  const saveSettings = () => {
    const storageKey = getStorageKey()
    if (!storageKey) return

    try {
      localStorage.setItem(storageKey, JSON.stringify(settings))
      setHasUnsavedChanges(false)

      // Show success toast
      toast({
        title: "Settings Saved",
        description: `Settings saved to ${settings.selectedPreset} ✅`,
        duration: 2000,
      })

      // Close drawer after short delay
      setTimeout(() => {
        setIsOpen(false)
      }, 1000)
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast({
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  // Load settings when wallet connects or component mounts
  useEffect(() => {
    if (connected && publicKey) {
      loadSettings()
    }
  }, [connected, publicKey])

  // Update settings and mark as changed
  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }))
    setHasUnsavedChanges(true)
  }

  // Load preset configuration
  const loadPreset = (preset: "S1" | "S2" | "S3") => {
    const presetConfig = settings.presets[preset]
    updateSettings({
      selectedPreset: preset,
      slippage: presetConfig.slippage,
      smartMevProtection: presetConfig.mevProtection,
      transactionSpeed: presetConfig.speed,
    })
  }

  // Save current settings as preset
  const saveAsPreset = (preset: "S1" | "S2" | "S3") => {
    const newPresets = {
      ...settings.presets,
      [preset]: {
        slippage: settings.slippage,
        mevProtection: settings.smartMevProtection,
        speed: settings.transactionSpeed,
      },
    }
    updateSettings({ presets: newPresets, selectedPreset: preset })
  }

  // Reset to defaults
  const resetToDefaults = () => {
    setSettings(defaultSettings)
    setHasUnsavedChanges(true)
  }

  if (!connected) {
    return null
  }

  const walletIcon = walletType === "phantom" ? "👻" : walletType === "backpack" ? "🎒" : "🔗"
  const walletName = walletType === "phantom" ? "Phantom" : walletType === "backpack" ? "Backpack" : "Unknown"

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gor-accent hover:text-white hover:bg-gor-accent/10 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[480px] bg-gor-bg border-l border-gor-surface/30 text-gor-text overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold text-gor-accent flex items-center space-x-2">
              <Settings className="w-6 h-6" />
              <span>Account Settings</span>
            </SheetTitle>
            {hasUnsavedChanges && (
              <Badge variant="outline" className="border-gor-accent text-gor-accent">
                Unsaved
              </Badge>
            )}
          </div>
          <SheetDescription className="text-gor-muted">
            Configure your trading preferences and automation settings
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8">
          <Tabs defaultValue="quick-buy" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-gor-surface/50 rounded-xl p-1">
              <TabsTrigger
                value="quick-buy"
                className="data-[state=active]:bg-gor-accent data-[state=active]:text-gor-bg rounded-lg"
              >
                Quick Buy
              </TabsTrigger>
              <TabsTrigger
                value="general"
                className="data-[state=active]:bg-gor-accent data-[state=active]:text-gor-bg rounded-lg"
              >
                General
              </TabsTrigger>
            </TabsList>

            <TabsContent value="quick-buy" className="space-y-6">
              {/* Trading Presets */}
              <Card className="bg-gor-surface/50 border-gor-surface/30">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-gor-accent" />
                    <span>Trading Presets</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {(["S1", "S2", "S3"] as const).map((preset) => (
                      <Button
                        key={preset}
                        variant={settings.selectedPreset === preset ? "default" : "outline"}
                        onClick={() => loadPreset(preset)}
                        className={cn(
                          "h-12 font-medium transition-all duration-200",
                          settings.selectedPreset === preset
                            ? "bg-[#00FF88] text-black hover:bg-[#1DF5C3] shadow-lg ring-2 ring-[#00FF88]/30"
                            : "border-gor-surface/50 hover:border-gor-accent/50 hover:text-gor-accent hover:bg-gor-accent/5",
                        )}
                      >
                        <span className="flex items-center space-x-2">
                          <span>{preset}</span>
                          {settings.selectedPreset === preset && (
                            <span className="w-2 h-2 bg-gor-bg rounded-full"></span>
                          )}
                        </span>
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gor-muted">
                    <Info className="w-4 h-4" />
                    <span>Select a preset to load saved trading preferences</span>
                  </div>
                </CardContent>
              </Card>

              {/* Slippage Settings */}
              <Card className="bg-gor-surface/50 border-gor-surface/30">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Slippage Tolerance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="slippage" className="text-gor-muted">
                      Maximum Slippage (%)
                    </Label>
                    <div className="relative">
                      <Input
                        id="slippage"
                        type="number"
                        value={settings.slippage}
                        onChange={(e) => updateSettings({ slippage: Number.parseFloat(e.target.value) || 0 })}
                        placeholder="15.0"
                        className="bg-gor-bg/50 border-gor-surface/50 focus:border-gor-accent/50 pr-8"
                        step="0.1"
                        min="0"
                        max="100"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gor-muted text-sm">
                        %
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[5, 10, 15, 25].map((value) => (
                      <Button
                        key={value}
                        variant="outline"
                        size="sm"
                        onClick={() => updateSettings({ slippage: value })}
                        className="border-gor-surface/50 hover:border-gor-accent/50 hover:text-gor-accent"
                      >
                        {value}%
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-start space-x-2 p-3 bg-gor-bg/30 rounded-lg">
                    <Info className="w-4 h-4 text-gor-accent mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gor-muted">
                      How much less tokens you're willing to receive due to price volatility during execution
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Smart MEV Protection */}
              <Card className="bg-gor-surface/50 border-gor-surface/30">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-gor-accent" />
                    <span>Smart MEV Protection</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base">Protection Mode</Label>
                      <p className="text-sm text-gor-muted">
                        {settings.smartMevProtection ? "Secure (Recommended)" : "Fast"}
                      </p>
                    </div>
                    <Switch
                      checked={settings.smartMevProtection}
                      onCheckedChange={(checked) => updateSettings({ smartMevProtection: checked })}
                    />
                  </div>
                  <div className="flex items-start space-x-2 p-3 bg-gor-bg/30 rounded-lg">
                    <Shield className="w-4 h-4 text-gor-accent mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gor-muted">
                      Protects against MEV attacks and sandwich bots. May slightly increase transaction time.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Transaction Speed */}
              <Card className="bg-gor-surface/50 border-gor-surface/30">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gor-accent" />
                    <span>Transaction Speed</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={settings.transactionSpeed}
                    onValueChange={(value: "default" | "auto") => updateSettings({ transactionSpeed: value })}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gor-bg/30 transition-colors">
                      <RadioGroupItem value="default" id="speed-default" />
                      <Label htmlFor="speed-default" className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-medium">Default</p>
                          <p className="text-sm text-gor-muted">Standard Solana network fees</p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gor-bg/30 transition-colors">
                      <RadioGroupItem value="auto" id="speed-auto" />
                      <Label htmlFor="speed-auto" className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-medium">Auto</p>
                          <p className="text-sm text-gor-muted">Dynamic fees based on network congestion</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Save Preset Actions */}
              <Card className="bg-gor-surface/50 border-gor-surface/30">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Save Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {(["S1", "S2", "S3"] as const).map((preset) => (
                      <Button
                        key={preset}
                        variant="outline"
                        onClick={() => saveAsPreset(preset)}
                        className="border-gor-surface/50 hover:border-gor-accent/50 hover:text-gor-accent"
                      >
                        Save as {preset}
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gor-muted">
                    <Save className="w-4 h-4" />
                    <span>Save current settings to a preset slot</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="general" className="space-y-6">
              {/* Wallet Info */}
              <Card className="bg-gor-surface/50 border-gor-surface/30">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Wallet Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-gor-muted">Connected Wallet</Label>
                      <div className="flex items-center space-x-2 bg-gor-bg/50 p-2 rounded-lg mt-1">
                        <span className="text-lg">{walletIcon}</span>
                        <span className="font-mono text-sm">
                          {publicKey ? `${publicKey.slice(0, 8)}...${publicKey.slice(-8)}` : "Not connected"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gor-muted">Wallet Type</Label>
                      <p className="text-sm mt-1">{walletName} Wallet</p>
                    </div>
                    <div>
                      <Label className="text-gor-muted">Network</Label>
                      <p className="text-sm mt-1">Gorbagana Chain (Solana Fork)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reset Settings */}
              <Card className="bg-gor-surface/50 border-gor-surface/30">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-gor-error">Reset Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gor-muted">
                    Reset all settings to default values. This action cannot be undone.
                  </p>
                  <Button
                    variant="outline"
                    onClick={resetToDefaults}
                    className="border-gor-error/50 text-gor-error hover:bg-gor-error/10 hover:border-gor-error"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset to Defaults
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Save/Cancel Actions */}
        <div className="sticky bottom-0 bg-gor-bg border-t border-gor-surface/30 pt-4 mt-8">
          <div className="flex space-x-3">
            <Button
              onClick={saveSettings}
              disabled={!hasUnsavedChanges}
              className="flex-1 bg-gor-accent hover:bg-gor-teal text-gor-bg font-medium disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-gor-surface/50 hover:border-gor-accent/50"
            >
              Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
