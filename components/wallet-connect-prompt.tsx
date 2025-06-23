"use client"

import { Wallet } from "lucide-react"
import { UniversalWalletButton } from "@/components/universal-wallet-button"

interface WalletConnectPromptProps {
  title?: string
  description?: string
  className?: string
}

export function WalletConnectPrompt({
  title = "Connect Your Wallet",
  description = "Connect your wallet to access this feature",
  className = "",
}: WalletConnectPromptProps) {
  return (
    <div className={`text-center py-12 space-y-4 ${className}`}>
      <Wallet className="w-16 h-16 mx-auto text-gor-muted opacity-50" />
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gor-muted mb-6">{description}</p>
        <UniversalWalletButton />
      </div>
    </div>
  )
}
