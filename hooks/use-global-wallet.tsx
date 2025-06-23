"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { Connection, clusterApiUrl } from "@solana/web3.js"

type WalletType = "phantom" | "backpack"

interface WalletContextType {
  connected: boolean
  connecting: boolean
  publicKey: string | null
  walletType: WalletType | null
  connect: (walletType: WalletType) => Promise<void>
  disconnect: () => Promise<void>
  connection: Connection
  error: string | null
}

const WalletContext = createContext<WalletContextType | null>(null)

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean
      connect: () => Promise<{ publicKey: { toString: () => string } }>
      disconnect: () => Promise<void>
      signTransaction: (transaction: any) => Promise<any>
      signAllTransactions: (transactions: any[]) => Promise<any[]>
      publicKey?: { toString: () => string }
      isConnected?: boolean
    }
    backpack?: {
      isBackpack: boolean
      connect: () => Promise<{ publicKey: string | { toString: () => string } }>
      disconnect: () => Promise<void>
      signTransaction: (transaction: any) => Promise<any>
      signAllTransactions: (transactions: any[]) => Promise<any[]>
      publicKey?: { toString: () => string } | string
      isConnected?: boolean
    }
  }
}

export function GlobalWalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [walletType, setWalletType] = useState<WalletType | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Create connection to Gorbagana Chain or Solana mainnet
  const connection = new Connection(process.env.NEXT_PUBLIC_GORBAGANA_RPC || clusterApiUrl("mainnet-beta"), "confirmed")

  const getWalletAdapter = useCallback((type: WalletType) => {
    if (type === "phantom") {
      return {
        name: "Phantom",
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
      }
    } else {
      return {
        name: "Backpack",
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
      }
    }
  }, [])

  const connect = useCallback(
    async (type: WalletType) => {
      const adapter = getWalletAdapter(type)

      if (!adapter.isInstalled) {
        const urls = {
          phantom: "https://phantom.app",
          backpack: "https://backpack.app",
        }
        window.open(urls[type], "_blank")
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
          setWalletType(type)
          localStorage.setItem("walletConnected", "true")
          localStorage.setItem("walletPublicKey", pubKey)
          localStorage.setItem("walletType", type)
          return
        }

        // Trigger actual wallet connection
        console.log(`Connecting to ${adapter.name}...`)
        const pubKey = await adapter.connect()
        console.log(`Connected successfully:`, pubKey)

        setPublicKey(pubKey)
        setConnected(true)
        setWalletType(type)
        localStorage.setItem("walletConnected", "true")
        localStorage.setItem("walletPublicKey", pubKey)
        localStorage.setItem("walletType", type)

        // Trigger storage event for other components
        window.dispatchEvent(new Event("storage"))
      } catch (error: any) {
        console.error(`Failed to connect to ${adapter.name}:`, error)
        setError(error.message || `Failed to connect to ${adapter.name}`)

        // Clear any stale connection state
        setPublicKey(null)
        setConnected(false)
        setWalletType(null)
        localStorage.removeItem("walletConnected")
        localStorage.removeItem("walletPublicKey")
        localStorage.removeItem("walletType")
      } finally {
        setConnecting(false)
      }
    },
    [getWalletAdapter],
  )

  const disconnect = useCallback(async () => {
    if (!walletType) return

    try {
      const adapter = getWalletAdapter(walletType)
      await adapter.disconnect()
    } catch (error) {
      console.error(`Failed to disconnect from wallet:`, error)
    } finally {
      setPublicKey(null)
      setConnected(false)
      setWalletType(null)
      setError(null)
      localStorage.removeItem("walletConnected")
      localStorage.removeItem("walletPublicKey")
      localStorage.removeItem("walletType")

      // Trigger storage event for other components
      window.dispatchEvent(new Event("storage"))
    }
  }, [walletType, getWalletAdapter])

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = () => {
      if (typeof window !== "undefined") {
        const wasConnected = localStorage.getItem("walletConnected")
        const storedPublicKey = localStorage.getItem("walletPublicKey")
        const storedWalletType = localStorage.getItem("walletType") as WalletType

        if (wasConnected && storedPublicKey && storedWalletType) {
          const adapter = getWalletAdapter(storedWalletType)

          if (adapter.isInstalled && adapter.isConnected() && adapter.getPublicKey()) {
            setConnected(true)
            setPublicKey(storedPublicKey)
            setWalletType(storedWalletType)
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
  }, [getWalletAdapter])

  // Listen for storage changes from other tabs/components
  useEffect(() => {
    const handleStorageChange = () => {
      const wasConnected = localStorage.getItem("walletConnected")
      const storedPublicKey = localStorage.getItem("walletPublicKey")
      const storedWalletType = localStorage.getItem("walletType") as WalletType

      if (wasConnected && storedPublicKey && storedWalletType) {
        setConnected(true)
        setPublicKey(storedPublicKey)
        setWalletType(storedWalletType)
      } else {
        setConnected(false)
        setPublicKey(null)
        setWalletType(null)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const value: WalletContextType = {
    connected,
    connecting,
    publicKey,
    walletType,
    connect,
    disconnect,
    connection,
    error,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useGlobalWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useGlobalWallet must be used within a GlobalWalletProvider")
  }
  return context
}
