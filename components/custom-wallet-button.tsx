"use client"

import { Button } from "@/components/ui/button"
import { Wallet, LogOut, Copy, Check, ExternalLink } from "lucide-react"
import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { useCustomWallet } from "@/components/custom-wallet-provider"

export function CustomWalletButton() {
  const { connected, connecting, publicKey, connect, disconnect } = useCustomWallet()
  const [copied, setCopied] = useState(false)

  // Convert publicKey to string if it's an object
  const publicKeyString = publicKey ? (typeof publicKey === "string" ? publicKey : publicKey.toString()) : null

  const copyAddress = useCallback(async () => {
    if (publicKeyString) {
      try {
        await navigator.clipboard.writeText(publicKeyString)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error("Failed to copy address:", err)
      }
    }
  }, [publicKeyString])

  const isBackpackInstalled = typeof window !== "undefined" && window.backpack?.isBackpack

  if (connected && publicKeyString) {
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
          <span className="mr-2">{`${publicKeyString.slice(0, 4)}...${publicKeyString.slice(-4)}`}</span>
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

  if (!isBackpackInstalled) {
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
