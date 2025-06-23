"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { UniversalWalletButton } from "@/components/universal-wallet-button"
import { AccountSettings } from "@/components/account-settings"

const navigation = [
  { name: "Trade", href: "/" },
  { name: "Discover", href: "/discover" },
  { name: "Portfolio", href: "/holdings" },
  { name: "Strategies", href: "/strategies" },
  { name: "Leaderboard", href: "/leaderboard" },
]

export function TopNavigation() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="h-16 bg-gor-surface/80 backdrop-blur-xl border-b border-gor-surface/30 flex items-center justify-between px-8">
      {/* Logo & Navigation */}
      <div className="flex items-center space-x-12">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-gor-surface/50 flex items-center justify-center">
            <Image
              src="/images/gor-logo.png"
              alt="GorTrade Logo"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-2xl font-bold text-white">GorTrade</span>
        </Link>

        <nav className="flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-all duration-200 hover:text-gor-accent relative",
                pathname === item.href ? "text-gor-accent" : "text-gor-text/70",
              )}
            >
              {item.name}
              {pathname === item.href && (
                <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-gradient-to-r from-gor-accent to-gor-teal rounded-full" />
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gor-muted" />
          <Input
            placeholder="Search tokens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-80 pl-12 bg-gor-bg/50 border-gor-surface/50 focus:border-gor-accent/50 rounded-xl"
          />
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="text-gor-muted hover:text-gor-accent transition-colors">
            <Bell className="w-5 h-5" />
          </Button>

          <AccountSettings />

          <UniversalWalletButton />
        </div>
      </div>
    </header>
  )
}
