"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Bell, Settings } from "lucide-react"

export function TopBar() {
  return (
    <div className="h-16 bg-gor-surface/50 border-b border-gor-surface/50 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold">Trading Terminal</h1>
        <Badge variant="outline" className="border-gor-accent text-gor-accent">
          LIVE
        </Badge>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="text-gor-muted hover:text-gor-text">
          <Bell className="w-4 h-4" />
        </Button>

        <Button variant="ghost" size="icon" className="text-gor-muted hover:text-gor-text">
          <Settings className="w-4 h-4" />
        </Button>

        <Button className="bg-gor-accent hover:bg-gor-teal text-gor-bg font-medium">
          <Wallet className="w-4 h-4 mr-2" />
          Connect Backpack
        </Button>
      </div>
    </div>
  )
}
