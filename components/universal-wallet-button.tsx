"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Wallet, ChevronDown } from "lucide-react"
import { useGlobalWallet } from "@/hooks/use-global-wallet"

export function UniversalWalletButton() {
  const { connected, publicKey, connect, disconnect, connecting, error } = useGlobalWallet()
  const [isOpen, setIsOpen] = useState(false)

  const handleConnect = async (walletType: "phantom" | "backpack") => {
    setIsOpen(false)
    await connect(walletType)
  }

  const handleDisconnect = async () => {
    setIsOpen(false)
    await disconnect()
  }

  // If connected, show wallet info
  if (connected && publicKey) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-gor-surface/50 border-gor-accent/30 hover:border-gor-accent/50 text-gor-text px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Wallet className="h-4 w-4" />
            <span className="font-mono text-sm">
              {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-48">
          <DropdownMenuItem onClick={handleDisconnect} className="cursor-pointer text-red-500">
            <span>Disconnect Wallet</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Show connect options
  return (
    <div className="flex flex-col items-center space-y-2">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            disabled={connecting}
            className="bg-gor-accent hover:bg-gor-accent/90 text-black font-medium px-6 py-2 rounded-lg flex items-center space-x-2"
          >
            <Wallet className="h-4 w-4" />
            <span>{connecting ? "Connecting..." : "Connect Wallet"}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-48">
          <DropdownMenuItem
            onClick={() => handleConnect("phantom")}
            className="flex items-center space-x-3 p-3 cursor-pointer"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <div>
              <p className="font-medium">Phantom</p>
              <p className="text-xs text-gor-muted">Connect using Phantom</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleConnect("backpack")}
            className="flex items-center space-x-3 p-3 cursor-pointer"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <div>
              <p className="font-medium">Backpack</p>
              <p className="text-xs text-gor-muted">Connect using Backpack</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {error && <p className="text-red-500 text-sm text-center max-w-xs">{error}</p>}
    </div>
  )
}
