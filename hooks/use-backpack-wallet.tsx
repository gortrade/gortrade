"use client"

import { useCallback, useEffect, useState } from "react"

declare global {
  interface Window {
    backpack?: {
      isBackpack: boolean
      connect: () => Promise<{ publicKey: string }>
      disconnect: () => Promise<void>
      signTransaction: (transaction: any) => Promise<any>
      signAllTransactions: (transactions: any[]) => Promise<any[]>
      publicKey?: { toString: () => string }
      isConnected?: boolean
    }
  }
}

export function useBackpackWallet() {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [publicKey, setPublicKey] = useState<string | null>(null)

  const isInstalled = typeof window !== "undefined" && window.backpack?.isBackpack

  const connect = useCallback(async () => {
    if (!isInstalled) {
      window.open("https://backpack.app", "_blank")
      return
    }

    try {
      setConnecting(true)
      const response = await window.backpack!.connect()
      setPublicKey(response.publicKey)
      setConnected(true)
    } catch (error) {
      console.error("Failed to connect to Backpack:", error)
    } finally {
      setConnecting(false)
    }
  }, [isInstalled])

  const disconnect = useCallback(async () => {
    if (!isInstalled) return

    try {
      await window.backpack!.disconnect()
      setPublicKey(null)
      setConnected(false)
    } catch (error) {
      console.error("Failed to disconnect from Backpack:", error)
    }
  }, [isInstalled])

  useEffect(() => {
    if (isInstalled && window.backpack?.isConnected && window.backpack?.publicKey) {
      setConnected(true)
      setPublicKey(window.backpack.publicKey.toString())
    }
  }, [isInstalled])

  return {
    connected,
    connecting,
    publicKey,
    connect,
    disconnect,
    isInstalled,
  }
}
