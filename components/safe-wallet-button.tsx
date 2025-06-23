"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Wallet, LogOut, Copy, Check, ExternalLink, ChevronDown } from "lucide-react"
import { useState, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"

type WalletType = "phantom" | "backpack"

interface WalletAdapter {
  name: string
  icon: string
  isInstalled: boolean
  connect: () => Promise<string>
  disconnect: () => Promise<void>
  getPublicKey: () => string | null
  isConnected: () => boolean
}

export function SafeWalletButton() {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connectedWallet, setConnectedWallet] = useState<WalletType | null>(null)

  // Wallet adapters
  const getWalletAdapters = useCallback((): Record<WalletType, WalletAdapter> => {
    return {
      phantom: {
        name: "Phantom",
        icon: "👻",
        isInstalled: typeof window !== "undefined" && window.solana?.isPhantom,
        connect: async () => {
          if (!window.solana?.isPhantom) throw new Error("Phantom not installed")
          const response = await window.solana.connect()
          return response.publicKey.toString()
        },
        disconnect: async () => {
          if (window.solana?.disconnect) {
            await window.solana.disconnect()
          }
        },
        getPublicKey: () => {
          return window.solana?.publicKey?.toString() || null
        },
        isConnected: () => {
          return window.solana?.isConnected || false
        },
      },
      backpack: {
        name: "Backpack",
        icon: "🎒",
        isInstalled: typeof window !== "undefined" && window.backpack?.isBackpack,
        connect: async () => {
          if (!window.backpack?.isBackpack) throw new Error("Backpack not installed")
          const response = await window.backpack.connect()
          return typeof response.publicKey === "string" ? response.publicKey : response.publicKey.toString()
        },
        disconnect: async () => {
          if (window.backpack?.disconnect) {
            await window.backpack.disconnect()
          }
        },
        getPublicKey: () => {
          if (!window.backpack?.publicKey) return null
          return typeof window.backpack.publicKey === "string"
            ? window.backpack.publicKey
            : window.backpack.publicKey.toString()
        },
        isConnected: () => {
          return window.backpack?.isConnected || false
        },
      },
    }
  }, [])

  const connectWallet = useCallback(
    async (walletType: WalletType) => {
      const adapters = getWalletAdapters()
      const adapter = adapters[walletType]

      if (!adapter.isInstalled) {
        const urls = {
          phantom: "https://phantom.app",
          backpack: "https://backpack.app",
        }
        window.open(urls[walletType], "_blank")
        return
      }

      try {
        setConnecting(true)
        setError(null)

        // Check if already connected
        if (adapter.isConnected() && adapter.getPublicKey()) {
          const pubKey = adapter.getPublicKey()!
          setPublicKey(pubKey)
          setConnected(true)
          setConnectedWallet(walletType)
          localStorage.setItem("walletConnected", "true")
          localStorage.setItem("walletPublicKey", pubKey)
          localStorage.setItem("walletType", walletType)
          return
        }

        // Attempt new connection
        const pubKey = await adapter.connect()
        setPublicKey(pubKey)
        setConnected(true)
        setConnectedWallet(walletType)
        localStorage.setItem("walletConnected", "true")
        localStorage.setItem("walletPublicKey", pubKey)
        localStorage.setItem("walletType", walletType)
      } catch (error: any) {
        console.error(`Failed to connect to ${adapter.name}:`, error)
        setError(error.message || `Failed to connect to ${adapter.name}`)

        // Clear any stale connection state
        setPublicKey(null)
        setConnected(false)
        setConnectedWallet(null)
        localStorage.removeItem("walletConnected")
        localStorage.removeItem("walletPublicKey")
        localStorage.removeItem("walletType")
      } finally {
        setConnecting(false)
      }
    },
    [getWalletAdapters],
  )

  const disconnect = useCallback(async () => {
    if (!connectedWallet) return

    try {
      const adapters = getWalletAdapters()
      const adapter = adapters[connectedWallet]
      await adapter.disconnect()
    } catch (error) {
      console.error(`Failed to disconnect from wallet:`, error)
    } finally {
      setPublicKey(null)
      setConnected(false)
      setConnectedWallet(null)
      setError(null)
      localStorage.removeItem("walletConnected")
      localStorage.removeItem("walletPublicKey")
      localStorage.removeItem("walletType")
    }
  }, [connectedWallet, getWalletAdapters])

  const copyAddress = useCallback(async () => {
    if (publicKey) {
      try {
        await navigator.clipboard.writeText(publicKey)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error("Failed to copy address:", err)
      }
    }
  }, [publicKey])

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = () => {
      if (typeof window !== "undefined") {
        const wasConnected = localStorage.getItem("walletConnected")
        const storedPublicKey = localStorage.getItem("walletPublicKey")
        const storedWalletType = localStorage.getItem("walletType") as WalletType

        if (wasConnected && storedPublicKey && storedWalletType) {
          const adapters = getWalletAdapters()
          const adapter = adapters[storedWalletType]

          if (adapter.isInstalled && adapter.isConnected() && adapter.getPublicKey()) {
            setConnected(true)
            setPublicKey(storedPublicKey)
            setConnectedWallet(storedWalletType)
          } else {
            // Clear stale data if wallet is not actually connected
            localStorage.removeItem("walletConnected")
            localStorage.removeItem("walletPublicKey")
            localStorage.removeItem("walletType")
          }
        }
      }
    }

    const timer = setTimeout(checkConnection, 100)
    return () => clearTimeout(timer)
  }, [getWalletAdapters])

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  if (connected && publicKey && connectedWallet) {
    const adapters = getWalletAdapters()
    const currentWallet = adapters[connectedWallet]

    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          onClick={copyAddress}
          className={cn(
            "font-mono text-sm transition-all duration-200 hover:bg-gor-accent/10 hover:text-gor-accent rounded-lg px-3 py-2 flex items-center",
            copied && "text-gor-accent bg-gor-accent/10",
          )}
        >
          <span className="mr-2 text-lg">{currentWallet.icon}</span>
          <span className="mr-2">{`${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`}</span>
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={disconnect}
          className="text-gor-muted hover:text-gor-error transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  const adapters = getWalletAdapters()
  const hasAnyWallet = Object.values(adapters).some((adapter) => adapter.isInstalled)

  if (!hasAnyWallet) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-gradient-to-r from-gor-accent to-gor-teal hover:from-gor-teal hover:to-gor-accent text-gor-bg font-medium px-6 rounded-xl shadow-lg shadow-gor-accent/20 transition-all duration-200">
            <Wallet className="w-4 h-4 mr-2" />
            Install Wallet
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-gor-surface border-gor-surface/50">
          <DropdownMenuItem
            onClick={() => window.open("https://phantom.app", "_blank")}
            className="flex items-center space-x-3 hover:bg-gor-accent/10 hover:text-gor-accent cursor-pointer"
          >
            <span className="text-lg">👻</span>
            <div className="flex-1">
              <div className="font-medium">Phantom</div>
              <div className="text-xs text-gor-muted">Popular Solana wallet</div>
            </div>
            <ExternalLink className="w-4 h-4" />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => window.open("https://backpack.app", "_blank")}
            className="flex items-center space-x-3 hover:bg-gor-accent/10 hover:text-gor-accent cursor-pointer"
          >
            <span className="text-lg">🎒</span>
            <div className="flex-1">
              <div className="font-medium">Backpack</div>
              <div className="text-xs text-gor-muted">Multi-chain wallet</div>
            </div>
            <ExternalLink className="w-4 h-4" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="flex flex-col items-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            disabled={connecting}
            className="bg-gradient-to-r from-gor-accent to-gor-teal hover:from-gor-teal hover:to-gor-accent text-gor-bg font-medium px-6 rounded-xl shadow-lg shadow-gor-accent/20 transition-all duration-200"
          >
            <Wallet className="w-4 h-4 mr-2" />
            {connecting ? "Connecting..." : "Connect Wallet"}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-gor-surface border-gor-surface/50">
          {Object.entries(adapters).map(([key, adapter]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => connectWallet(key as WalletType)}
              disabled={connecting}
              className="flex items-center space-x-3 hover:bg-gor-accent/10 hover:text-gor-accent cursor-pointer disabled:opacity-50"
            >
              <span className="text-lg">{adapter.icon}</span>
              <div className="flex-1">
                <div className="font-medium">{adapter.name}</div>
                <div className="text-xs text-gor-muted">
                  {adapter.isInstalled ? "Ready to connect" : "Not installed"}
                </div>
              </div>
              {!adapter.isInstalled && <ExternalLink className="w-4 h-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {error && <p className="text-gor-error text-xs mt-1 max-w-48 text-right">{error}</p>}
    </div>
  )
}
