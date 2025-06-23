"use client"

import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { useGlobalWallet } from "@/hooks/use-global-wallet"

export function ConnectionStatus() {
  const { connection, connected } = useGlobalWallet()
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await connection.getVersion()
        setIsConnected(true)
      } catch (error) {
        setIsConnected(false)
      }
    }

    checkConnection()
    const interval = setInterval(checkConnection, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [connection])

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-3">
        <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-gor-accent animate-pulse" : "bg-gor-error"}`} />
        {isConnected ? (
          <div>
            <p className="text-sm font-medium">Gorbagana Chain</p>
            <p className="text-xs text-gor-muted">Connected</p>
          </div>
        ) : (
          <div>
            <p className="text-sm font-medium text-gor-error">Network</p>
            <p className="text-xs text-gor-muted">Disconnected</p>
          </div>
        )}
      </div>
      {connected && (
        <Badge variant="outline" className="border-gor-accent text-gor-accent">
          Wallet Connected
        </Badge>
      )}
    </div>
  )
}
