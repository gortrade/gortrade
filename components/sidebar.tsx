"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { TrendingUp, Search, Wallet, Target, Trophy, User, Settings, ChevronLeft, ChevronRight } from "lucide-react"

const navigation = [
  { name: "Trade", href: "/", icon: TrendingUp },
  { name: "Discover", href: "/discover", icon: Search },
  { name: "Holdings", href: "/holdings", icon: Wallet },
  { name: "Strategies", href: "/strategies", icon: Target },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Avatars", href: "/avatars", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "bg-gor-surface border-r border-gor-surface/50 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-gor-surface/50">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gor-accent rounded-lg flex items-center justify-center">
                <span className="text-gor-bg font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-bold text-gor-accent">GorTrade</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 hover:bg-gor-surface/50 rounded-md transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-gor-accent/20 text-gor-accent border border-gor-accent/30"
                    : "text-gor-muted hover:text-gor-text hover:bg-gor-surface/50",
                  collapsed && "justify-center",
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="font-medium">{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gor-surface/50">
          <div className={cn("flex items-center space-x-3", collapsed && "justify-center")}>
            <div className="w-8 h-8 bg-gor-accent/20 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-gor-accent rounded-full animate-pulse" />
            </div>
            {!collapsed && (
              <div>
                <p className="text-sm font-medium">Gorbagana Chain</p>
                <p className="text-xs text-gor-muted">Connected</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
