"use client"

import type React from "react"
import { useMemo } from "react"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { clusterApiUrl } from "@solana/web3.js"

// Import default styles
require("@solana/wallet-adapter-react-ui/styles.css")

export function WalletContextProvider({ children }: { children: React.ReactNode }) {
  // Gorbagana Chain RPC endpoint
  const endpoint = useMemo(() => {
    return process.env.NEXT_PUBLIC_GORBAGANA_RPC || clusterApiUrl(WalletAdapterNetwork.Mainnet)
  }, [])

  // Empty wallets array - wallets will be auto-detected
  const wallets = useMemo(() => [], [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
