"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { Connection, clusterApiUrl } from "@solana/web3.js"

interface WalletContextType {
  connected: boolean
  connecting: boolean
  publicKey: string | null
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  connection: Connection
}

const WalletContext = createContext<WalletContextType | null>(null)

declare global {
  interface Window {
    backpack?: {
      isBackpack: boolean
      connect: () => Promise<{ publicKey: string }>
      disconnect: () => Promise<void>
      signTransaction: (transaction: any) => Promise<any>
      signAllTransactions: (transactions: any[]) => Promise<any[]>
      publicKey?: { toString: () => string } | string
      isConnected?: boolean
    }
  }
}

export function CustomWalletProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [publicKey, setPublicKey] = useState<string | null>(null)

  // Create connection to Gorbagana Chain or Solana mainnet
  const connection = new Connection(process.env.NEXT_PUBLIC_GORBAGANA_RPC || clusterApiUrl("mainnet-beta"), "confirmed")

  const connect = useCallback(async () => {
    if (typeof window === "undefined" || !window.backpack) {
      window.open("https://backpack.app", "_blank")
      return
    }

    try {
      setConnecting(true)

      // Check if already connected first
      if (window.backpack.isConnected && window.backpack.publicKey) {
        const pubKeyString =
          typeof window.backpack.publicKey === "string"
            ? window.backpack.publicKey
            : window.backpack.publicKey.toString()

        setPublicKey(pubKeyString)
        setConnected(true)
        localStorage.setItem("walletConnected", "true")
        localStorage.setItem("walletPublicKey", pubKeyString)
        return
      }

      // Attempt connection with retry logic
      let retries = 3
      while (retries > 0) {
        try {
          const response = await window.backpack.connect()

          // Ensure publicKey is a string
          const pubKeyString =
            typeof response.publicKey === "string" ? response.publicKey : response.publicKey.toString()

          setPublicKey(pubKeyString)
          setConnected(true)
          localStorage.setItem("walletConnected", "true")
          localStorage.setItem("walletPublicKey", pubKeyString)
          break
        } catch (error: any) {
          retries--
          if (error.message?.includes("Plugin Closed") && retries > 0) {
            // Wait a bit before retrying
            await new Promise((resolve) => setTimeout(resolve, 500))
            continue
          }
          throw error
        }
      }
    } catch (error: any) {
      console.error("Failed to connect to Backpack:", error)

      // Clear any stale state
      setPublicKey(null)
      setConnected(false)
      localStorage.removeItem("walletConnected")
      localStorage.removeItem("walletPublicKey")

      // Show user-friendly error message
      if (error.message?.includes("Plugin Closed")) {
        alert("Backpack wallet connection was interrupted. Please try again or refresh the page.")
      }
    } finally {
      setConnecting(false)
    }
  }, [])

  const disconnect = useCallback(async () => {
    try {
      if (window.backpack) {
        await window.backpack.disconnect()
      }
      setPublicKey(null)
      setConnected(false)
      localStorage.removeItem("walletConnected")
      localStorage.removeItem("walletPublicKey")
    } catch (error) {
      console.error("Failed to disconnect from Backpack:", error)
      // Force disconnect even if there's an error
      setPublicKey(null)
      setConnected(false)
      localStorage.removeItem("walletConnected")
      localStorage.removeItem("walletPublicKey")
    }
  }, [])

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.backpack) {
        try {
          // Check localStorage first
          const wasConnected = localStorage.getItem("walletConnected")
          const storedPublicKey = localStorage.getItem("walletPublicKey")

          if (wasConnected && storedPublicKey) {
            // Verify the connection is still valid
            if (window.backpack.isConnected && window.backpack.publicKey) {
              const currentPubKey =
                typeof window.backpack.publicKey === "string"
                  ? window.backpack.publicKey
                  : window.backpack.publicKey.toString()

              if (currentPubKey === storedPublicKey) {
                setConnected(true)
                setPublicKey(storedPublicKey)
                return
              }
            }
          }

          // Clear stale data if verification failed
          localStorage.removeItem("walletConnected")
          localStorage.removeItem("walletPublicKey")
        } catch (error) {
          console.error("Error checking wallet connection:", error)
          // Clear stale data on error
          localStorage.removeItem("walletConnected")
          localStorage.removeItem("walletPublicKey")
        }
      }
    }

    // Add a small delay to ensure Backpack is fully initialized
    const timer = setTimeout(checkConnection, 200)
    return () => clearTimeout(timer)
  }, [])

  const value: WalletContextType = {
    connected,
    connecting,
    publicKey,
    connect,
    disconnect,
    connection,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useCustomWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useCustomWallet must be used within a CustomWalletProvider")
  }
  return context
}
