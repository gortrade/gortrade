"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Plus,
  Save,
  Trash2,
  Copy,
  Edit3,
  TrendingDown,
  TrendingUp,
  Target,
  Zap,
  Clock,
  Settings,
  CheckCircle,
  Wallet,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useGlobalWallet } from "@/hooks/use-global-wallet"
import { WalletConnectPrompt } from "@/components/wallet-connect-prompt"

interface TradingStrategy {
  id: string
  name: string
  triggerType: "price_drop" | "volume_spike" | "time_entry" | "momentum" | "range_bounce"
  buyAmount: number
  buyAmountType: "fixed" | "percentage"
  takeProfitPercent: number
  stopLossPercent: number
  cooldownMinutes: number
  isActive: boolean
  createdAt: number
  lastUsed?: number
  timesUsed: number
  description?: string
}

const defaultStrategies: Omit<TradingStrategy, "id" | "createdAt" | "timesUsed">[] = [
  {
    name: "Buy the Dip",
    triggerType: "price_drop",
    buyAmount: 10,
    buyAmountType: "percentage",
    takeProfitPercent: 15,
    stopLossPercent: 8,
    cooldownMinutes: 60,
    isActive: false,
    description: "Automatically buy when price drops by a certain percentage",
  },
  {
    name: "Scalp Every Pump",
    triggerType: "volume_spike",
    buyAmount: 5,
    buyAmountType: "percentage",
    takeProfitPercent: 5,
    stopLossPercent: 3,
    cooldownMinutes: 15,
    isActive: false,
    description: "Quick trades on volume spikes for small profits",
  },
  {
    name: "Range Bounce",
    triggerType: "range_bounce",
    buyAmount: 15,
    buyAmountType: "percentage",
    takeProfitPercent: 12,
    stopLossPercent: 6,
    cooldownMinutes: 120,
    isActive: false,
    description: "Trade within established price ranges",
  },
  {
    name: "Volatility Chase",
    triggerType: "momentum",
    buyAmount: 8,
    buyAmountType: "percentage",
    takeProfitPercent: 20,
    stopLossPercent: 10,
    cooldownMinutes: 30,
    isActive: false,
    description: "Follow strong momentum moves",
  },
  {
    name: "Momentum Rider",
    triggerType: "momentum",
    buyAmount: 12,
    buyAmountType: "percentage",
    takeProfitPercent: 25,
    stopLossPercent: 12,
    cooldownMinutes: 45,
    isActive: false,
    description: "Ride trending moves for larger gains",
  },
]

export default function StrategiesPage() {
  const { connected, publicKey } = useGlobalWallet()
  const [strategies, setStrategies] = useState<TradingStrategy[]>([])
  const [editingStrategy, setEditingStrategy] = useState<TradingStrategy | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [activeTab, setActiveTab] = useState("my-strategies")

  // Load strategies from localStorage on mount
  useEffect(() => {
    if (connected && publicKey) {
      loadStrategies()
    }
  }, [connected, publicKey])

  const getStorageKey = () => {
    if (!publicKey) return null
    const pubKeyString = typeof publicKey === "string" ? publicKey : publicKey.toString()
    return `gortrade_strategies_${pubKeyString}`
  }

  const loadStrategies = () => {
    const storageKey = getStorageKey()
    if (!storageKey) return

    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsedStrategies = JSON.parse(saved)
        setStrategies(parsedStrategies)
      }
    } catch (error) {
      console.error("Failed to load strategies:", error)
    }
  }

  const saveStrategies = (newStrategies: TradingStrategy[]) => {
    const storageKey = getStorageKey()
    if (!storageKey) return

    try {
      localStorage.setItem(storageKey, JSON.stringify(newStrategies))
      setStrategies(newStrategies)
    } catch (error) {
      console.error("Failed to save strategies:", error)
    }
  }

  const createStrategy = (template?: Omit<TradingStrategy, "id" | "createdAt" | "timesUsed">) => {
    const newStrategy: TradingStrategy = {
      id: Date.now().toString(),
      name: template?.name || "New Strategy",
      triggerType: template?.triggerType || "price_drop",
      buyAmount: template?.buyAmount || 10,
      buyAmountType: template?.buyAmountType || "percentage",
      takeProfitPercent: template?.takeProfitPercent || 15,
      stopLossPercent: template?.stopLossPercent || 8,
      cooldownMinutes: template?.cooldownMinutes || 60,
      isActive: false,
      createdAt: Date.now(),
      timesUsed: 0,
      description: template?.description || "",
    }

    const updatedStrategies = [...strategies, newStrategy]
    saveStrategies(updatedStrategies)
    setEditingStrategy(newStrategy)
    setIsCreating(false)
  }

  const updateStrategy = (updatedStrategy: TradingStrategy) => {
    const updatedStrategies = strategies.map((s) => (s.id === updatedStrategy.id ? updatedStrategy : s))
    saveStrategies(updatedStrategies)
    setEditingStrategy(null)
  }

  const deleteStrategy = (strategyId: string) => {
    const updatedStrategies = strategies.filter((s) => s.id !== strategyId)
    saveStrategies(updatedStrategies)
    if (editingStrategy?.id === strategyId) {
      setEditingStrategy(null)
    }
  }

  const toggleStrategyActive = (strategyId: string) => {
    const updatedStrategies = strategies.map((s) => (s.id === strategyId ? { ...s, isActive: !s.isActive } : s))
    saveStrategies(updatedStrategies)
  }

  const duplicateStrategy = (strategy: TradingStrategy) => {
    const duplicated: TradingStrategy = {
      ...strategy,
      id: Date.now().toString(),
      name: `${strategy.name} (Copy)`,
      isActive: false,
      createdAt: Date.now(),
      timesUsed: 0,
    }

    const updatedStrategies = [...strategies, duplicated]
    saveStrategies(updatedStrategies)
  }

  const getTriggerTypeLabel = (type: string) => {
    const labels = {
      price_drop: "Price Drop %",
      volume_spike: "Volume Spike",
      time_entry: "Time Entry",
      momentum: "Momentum",
      range_bounce: "Range Bounce",
    }
    return labels[type as keyof typeof labels] || type
  }

  const getTriggerTypeIcon = (type: string) => {
    const icons = {
      price_drop: TrendingDown,
      volume_spike: Zap,
      time_entry: Clock,
      momentum: TrendingUp,
      range_bounce: Target,
    }
    const Icon = icons[type as keyof typeof icons] || Target
    return <Icon className="w-4 h-4" />
  }

  if (!connected) {
    return (
      <WalletConnectPrompt
        title="Connect Your Wallet"
        description="Connect your wallet to create and manage your trading strategies"
        icon={<Brain className="w-10 h-10 text-gor-muted" />}
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gor-accent to-gor-teal bg-clip-text text-transparent flex items-center space-x-3">
                <Brain className="w-10 h-10 text-gor-accent" />
                <span>Trading Strategies</span>
              </h1>
              <p className="text-gor-muted mt-2">
                Configure repeatable trading patterns. Saved strategies will be available during Spot trades.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setIsCreating(true)}
                className="bg-gor-accent hover:bg-gor-teal text-gor-bg font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Strategy
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gor-surface/50 backdrop-blur-xl border border-gor-surface/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gor-muted text-sm">Total Strategies</p>
                    <p className="text-2xl font-bold text-gor-accent">{strategies.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-gor-accent/20 rounded-2xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-gor-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gor-surface/50 backdrop-blur-xl border border-gor-surface/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gor-muted text-sm">Active Strategies</p>
                    <p className="text-2xl font-bold text-gor-accent">{strategies.filter((s) => s.isActive).length}</p>
                  </div>
                  <div className="w-12 h-12 bg-gor-accent/20 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-gor-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gor-surface/50 backdrop-blur-xl border border-gor-surface/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gor-muted text-sm">Times Used</p>
                    <p className="text-2xl font-bold text-gor-accent">
                      {strategies.reduce((sum, s) => sum + s.timesUsed, 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gor-accent/20 rounded-2xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-gor-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gor-surface/50 backdrop-blur-xl border border-gor-surface/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gor-muted text-sm">Wallet</p>
                    <p className="text-sm font-mono text-gor-accent">
                      {typeof publicKey === "string"
                        ? `${publicKey.slice(0, 6)}...${publicKey.slice(-6)}`
                        : `${publicKey?.toString().slice(0, 6)}...${publicKey?.toString().slice(-6)}`}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gor-accent/20 rounded-2xl flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-gor-accent" />
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
              value="my-strategies"
              className="data-[state=active]:bg-gor-accent data-[state=active]:text-gor-bg rounded-lg"
            >
              <Settings className="w-4 h-4 mr-2" />
              My Strategies ({strategies.length})
            </TabsTrigger>
            <TabsTrigger
              value="templates"
              className="data-[state=active]:bg-gor-accent data-[state=active]:text-gor-bg rounded-lg"
            >
              <Brain className="w-4 h-4 mr-2" />
              Templates ({defaultStrategies.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-strategies">
            {strategies.length === 0 ? (
              <Card className="bg-gor-surface/50 backdrop-blur-xl border border-gor-surface/30">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-gor-surface/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Brain className="w-10 h-10 text-gor-muted" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Strategies Yet</h3>
                  <p className="text-gor-muted mb-6">Create your first trading strategy or start with a template</p>
                  <div className="flex items-center justify-center space-x-4">
                    <Button onClick={() => setIsCreating(true)} className="bg-gor-accent hover:bg-gor-teal text-gor-bg">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Strategy
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("templates")}
                      className="border-gor-surface/50 hover:border-gor-accent/50"
                    >
                      Browse Templates
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {strategies.map((strategy) => (
                  <StrategyCard
                    key={strategy.id}
                    strategy={strategy}
                    onEdit={setEditingStrategy}
                    onDelete={deleteStrategy}
                    onToggleActive={toggleStrategyActive}
                    onDuplicate={duplicateStrategy}
                    getTriggerTypeLabel={getTriggerTypeLabel}
                    getTriggerTypeIcon={getTriggerTypeIcon}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {defaultStrategies.map((template, index) => (
                <TemplateCard
                  key={index}
                  template={template}
                  onUse={createStrategy}
                  getTriggerTypeLabel={getTriggerTypeLabel}
                  getTriggerTypeIcon={getTriggerTypeIcon}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Strategy Editor Modal */}
        {(editingStrategy || isCreating) && (
          <StrategyEditor
            strategy={editingStrategy}
            onSave={editingStrategy ? updateStrategy : createStrategy}
            onCancel={() => {
              setEditingStrategy(null)
              setIsCreating(false)
            }}
            getTriggerTypeLabel={getTriggerTypeLabel}
            getTriggerTypeIcon={getTriggerTypeIcon}
          />
        )}
      </div>
    </div>
  )
}

// Strategy Card Component
function StrategyCard({
  strategy,
  onEdit,
  onDelete,
  onToggleActive,
  onDuplicate,
  getTriggerTypeLabel,
  getTriggerTypeIcon,
}: {
  strategy: TradingStrategy
  onEdit: (strategy: TradingStrategy) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string) => void
  onDuplicate: (strategy: TradingStrategy) => void
  getTriggerTypeLabel: (type: string) => string
  getTriggerTypeIcon: (type: string) => React.ReactNode
}) {
  return (
    <Card
      className={cn(
        "bg-gor-surface/50 backdrop-blur-xl border transition-all duration-300 hover:scale-[1.02] group",
        strategy.isActive ? "border-gor-accent/50 shadow-lg shadow-gor-accent/10" : "border-gor-surface/30",
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gor-accent/20 rounded-xl flex items-center justify-center">
              {getTriggerTypeIcon(strategy.triggerType)}
            </div>
            <div>
              <CardTitle className="text-lg">{strategy.name}</CardTitle>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs mt-1",
                  strategy.isActive ? "border-gor-accent text-gor-accent" : "border-gor-surface/50",
                )}
              >
                {getTriggerTypeLabel(strategy.triggerType)}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch checked={strategy.isActive} onCheckedChange={() => onToggleActive(strategy.id)} />
            {strategy.isActive && <CheckCircle className="w-4 h-4 text-gor-accent" />}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {strategy.description && <p className="text-gor-muted text-sm">{strategy.description}</p>}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gor-muted">Buy Amount</p>
            <p className="font-semibold">
              {strategy.buyAmount}
              {strategy.buyAmountType === "percentage" ? "%" : " GOR"}
            </p>
          </div>
          <div>
            <p className="text-gor-muted">Take Profit</p>
            <p className="font-semibold text-gor-accent">+{strategy.takeProfitPercent}%</p>
          </div>
          <div>
            <p className="text-gor-muted">Stop Loss</p>
            <p className="font-semibold text-gor-error">-{strategy.stopLossPercent}%</p>
          </div>
          <div>
            <p className="text-gor-muted">Cooldown</p>
            <p className="font-semibold">{strategy.cooldownMinutes}m</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gor-muted">
          <span>Used {strategy.timesUsed} times</span>
          <span>{new Date(strategy.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(strategy)}
            className="flex-1 border-gor-surface/50 hover:border-gor-accent/50"
          >
            <Edit3 className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDuplicate(strategy)}
            className="border-gor-surface/50 hover:border-gor-accent/50"
          >
            <Copy className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(strategy.id)}
            className="border-gor-error/50 hover:border-gor-error text-gor-error hover:text-gor-error"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Template Card Component
function TemplateCard({
  template,
  onUse,
  getTriggerTypeLabel,
  getTriggerTypeIcon,
}: {
  template: Omit<TradingStrategy, "id" | "createdAt" | "timesUsed">
  onUse: (template: Omit<TradingStrategy, "id" | "createdAt" | "timesUsed">) => void
  getTriggerTypeLabel: (type: string) => string
  getTriggerTypeIcon: (type: string) => React.ReactNode
}) {
  return (
    <Card className="bg-gor-surface/50 backdrop-blur-xl border border-gor-surface/30 hover:border-gor-accent/30 transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gor-accent/20 rounded-xl flex items-center justify-center">
            {getTriggerTypeIcon(template.triggerType)}
          </div>
          <div>
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <Badge variant="outline" className="text-xs mt-1 border-gor-surface/50">
              {getTriggerTypeLabel(template.triggerType)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gor-muted text-sm">{template.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gor-muted">Buy Amount</p>
            <p className="font-semibold">
              {template.buyAmount}
              {template.buyAmountType === "percentage" ? "%" : " GOR"}
            </p>
          </div>
          <div>
            <p className="text-gor-muted">Take Profit</p>
            <p className="font-semibold text-gor-accent">+{template.takeProfitPercent}%</p>
          </div>
          <div>
            <p className="text-gor-muted">Stop Loss</p>
            <p className="font-semibold text-gor-error">-{template.stopLossPercent}%</p>
          </div>
          <div>
            <p className="text-gor-muted">Cooldown</p>
            <p className="font-semibold">{template.cooldownMinutes}m</p>
          </div>
        </div>

        <Button
          onClick={() => onUse(template)}
          className="w-full bg-gor-accent hover:bg-gor-teal text-gor-bg font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Use Template
        </Button>
      </CardContent>
    </Card>
  )
}

// Strategy Editor Component
function StrategyEditor({
  strategy,
  onSave,
  onCancel,
  getTriggerTypeLabel,
  getTriggerTypeIcon,
}: {
  strategy: TradingStrategy | null
  onSave: (strategy: TradingStrategy) => void
  onCancel: () => void
  getTriggerTypeLabel: (type: string) => string
  getTriggerTypeIcon: (type: string) => React.ReactNode
}) {
  const [formData, setFormData] = useState<TradingStrategy>(
    strategy || {
      id: "",
      name: "New Strategy",
      triggerType: "price_drop",
      buyAmount: 10,
      buyAmountType: "percentage",
      takeProfitPercent: 15,
      stopLossPercent: 8,
      cooldownMinutes: 60,
      isActive: false,
      createdAt: Date.now(),
      timesUsed: 0,
      description: "",
    },
  )

  const handleSave = () => {
    if (!strategy) {
      // Creating new strategy
      const newStrategy: TradingStrategy = {
        ...formData,
        id: Date.now().toString(),
        createdAt: Date.now(),
        timesUsed: 0,
      }
      onSave(newStrategy)
    } else {
      // Updating existing strategy
      onSave(formData)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-gor-surface/95 backdrop-blur-xl border border-gor-surface/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gor-accent/20 rounded-xl flex items-center justify-center">
              {getTriggerTypeIcon(formData.triggerType)}
            </div>
            <span>{strategy ? "Edit Strategy" : "Create Strategy"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Strategy Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-gor-bg/50 border-gor-surface/50 focus:border-gor-accent/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-gor-bg/50 border-gor-surface/50 focus:border-gor-accent/50"
              placeholder="Describe your strategy..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="triggerType">Trigger Type</Label>
            <Select
              value={formData.triggerType}
              onValueChange={(value: any) => setFormData({ ...formData, triggerType: value })}
            >
              <SelectTrigger className="bg-gor-bg/50 border-gor-surface/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gor-surface border-gor-surface/50">
                <SelectItem value="price_drop">Price Drop %</SelectItem>
                <SelectItem value="volume_spike">Volume Spike</SelectItem>
                <SelectItem value="time_entry">Time Entry</SelectItem>
                <SelectItem value="momentum">Momentum</SelectItem>
                <SelectItem value="range_bounce">Range Bounce</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buyAmount">Buy Amount</Label>
              <Input
                id="buyAmount"
                type="number"
                value={formData.buyAmount}
                onChange={(e) => setFormData({ ...formData, buyAmount: Number.parseFloat(e.target.value) || 0 })}
                className="bg-gor-bg/50 border-gor-surface/50 focus:border-gor-accent/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buyAmountType">Amount Type</Label>
              <Select
                value={formData.buyAmountType}
                onValueChange={(value: any) => setFormData({ ...formData, buyAmountType: value })}
              >
                <SelectTrigger className="bg-gor-bg/50 border-gor-surface/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gor-surface border-gor-surface/50">
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount (GOR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="takeProfit">Take Profit (%)</Label>
              <Input
                id="takeProfit"
                type="number"
                value={formData.takeProfitPercent}
                onChange={(e) =>
                  setFormData({ ...formData, takeProfitPercent: Number.parseFloat(e.target.value) || 0 })
                }
                className="bg-gor-bg/50 border-gor-surface/50 focus:border-gor-accent/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stopLoss">Stop Loss (%)</Label>
              <Input
                id="stopLoss"
                type="number"
                value={formData.stopLossPercent}
                onChange={(e) => setFormData({ ...formData, stopLossPercent: Number.parseFloat(e.target.value) || 0 })}
                className="bg-gor-bg/50 border-gor-surface/50 focus:border-gor-accent/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cooldown">Cooldown Between Trades (minutes)</Label>
            <Input
              id="cooldown"
              type="number"
              value={formData.cooldownMinutes}
              onChange={(e) => setFormData({ ...formData, cooldownMinutes: Number.parseInt(e.target.value) || 0 })}
              className="bg-gor-bg/50 border-gor-surface/50 focus:border-gor-accent/50"
            />
          </div>

          <div className="flex items-center space-x-3">
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <Label>Activate strategy immediately</Label>
          </div>

          <div className="flex items-center space-x-4 pt-4">
            <Button onClick={handleSave} className="flex-1 bg-gor-accent hover:bg-gor-teal text-gor-bg font-medium">
              <Save className="w-4 h-4 mr-2" />
              {strategy ? "Update Strategy" : "Create Strategy"}
            </Button>
            <Button variant="outline" onClick={onCancel} className="border-gor-surface/50">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
