"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut, Copy, Check, ExternalLink } from "lucide-react"
import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"

export function WalletButton() {
  const { publicKey, wallet, disconnect, connecting, connected } = useWallet()
  const { setVisible } = useWalletModal()
  const [copied, setCopied] = useState(false)

  const handleConnect = useCallback(() => {
    // Check if Backpack is available
    if (typeof window !== "undefined" && !window.backpack) {
      // Redirect to Backpack installation if not available
      window.open("https://backpack.app", "_blank")
      return
    }
    setVisible(true)
  }, [setVisible])

  const handleDisconnect = useCallback(() => {
    disconnect()
  }, [disconnect])

  const copyAddress = useCallback(async () => {
    if (publicKey) {
      try {
        await navigator.clipboard.writeText(publicKey.toBase58())
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error("Failed to copy address:", err)
      }
    }
  }, [publicKey])

  // Check if Backpack is installed
  const isBackpackInstalled = typeof window !== "undefined" && window.backpack

  if (connected && publicKey) {
    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          onClick={copyAddress}
          className={cn(
            "font-mono text-sm transition-all duration-200 hover:bg-gor-accent/10 hover:text-gor-accent rounded-lg px-3 py-2",
            copied && "text-gor-accent bg-gor-accent/10",
          )}
        >
          <span className="mr-2">{`${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`}</span>
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDisconnect}
          className="text-gor-muted hover:text-gor-error transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  if (!isBackpackInstalled) {
    return (
      <Button
        onClick={handleConnect}
        className="bg-gradient-to-r from-gor-accent to-gor-teal hover:from-gor-teal hover:to-gor-accent text-gor-bg font-medium px-6 rounded-xl shadow-lg shadow-gor-accent/20 transition-all duration-200"
      >
        <Wallet className="w-4 h-4 mr-2" />
        Install Backpack
        <ExternalLink className="w-3 h-3 ml-2" />
      </Button>
    )
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={connecting}
      className="bg-gradient-to-r from-gor-accent to-gor-teal hover:from-gor-teal hover:to-gor-agar text-gor-bg font-medium px-6 rounded-xl shadow-lg shadow-gor-accent/20 transition-all duration-200"
    >
      <Wallet className="w-4 h-4 mr-2" />
      {connecting ? "Connecting..." : "Connect Backpack"}
    </Button>
  )
}
