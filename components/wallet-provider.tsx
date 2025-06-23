"use client"

import type React from "react"
import { useMemo } from "react"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { clusterApiUrl } from "@solana/web3.js"

// Import default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css")

export function WalletContextProvider({ children }: { children: React.ReactNode }) {
  // Gorbagana Chain RPC endpoint
  const endpoint = useMemo(() => {
    // Replace with actual Gorbagana Chain RPC when available
    // For now using mainnet-beta as fallback
    return process.env.NEXT_PUBLIC_GORBAGANA_RPC || clusterApiUrl(WalletAdapterNetwork.Mainnet)
  }, [])

  const wallets = useMemo(
    () => [
      // Backpack wallet will be auto-detected if installed
      // We don't need to explicitly import it since it's browser-based
    ],
    [],
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
