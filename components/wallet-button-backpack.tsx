"use client"

import { Button } from "@/components/ui/button"
import { Wallet, LogOut, Copy, Check, ExternalLink } from "lucide-react"
import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { useBackpackWallet } from "@/hooks/use-backpack-wallet"

export function BackpackWalletButton() {
  const { connected, connecting, publicKey, connect, disconnect, isInstalled } = useBackpackWallet()
  const [copied, setCopied] = useState(false)

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

  if (!isInstalled) {
    return (
      <Button
        onClick={connect}
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
      onClick={connect}
      disabled={connecting}
      className="bg-gradient-to-r from-gor-accent to-gor-teal hover:from-gor-teal hover:to-gor-accent text-gor-bg font-medium px-6 rounded-xl shadow-lg shadow-gor-accent/20 transition-all duration-200"
    >
      <Wallet className="w-4 h-4 mr-2" />
      {connecting ? "Connecting..." : "Connect Backpack"}
    </Button>
  )
}
