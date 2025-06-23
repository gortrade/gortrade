"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, Github, BookOpen, Twitter } from "lucide-react"
import { cn } from "@/lib/utils"

export function Footer() {
  const [copied, setCopied] = useState(false)
  const contractAddress = "3PJ82eVhQ47HVPfozWtwSVoi42kK3NMzHXBGVoHbpump"

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const links = [
    {
      label: "X",
      href: "https://x.com/GorTradeSol",
      icon: Twitter,
      external: true,
    },
    {
      label: "Docs",
      href: "https://gortrade.gitbook.io/gortrade/",
      icon: BookOpen,
      external: true,
    },
    {
      label: "GitHub",
      href: "https://github.com/gortrade/gortrade",
      icon: Github,
      external: true,
    },
  ]

  return (
    <footer className="bg-gor-surface/30 backdrop-blur-xl border-t border-gor-surface/30 px-8 py-6">
      <div className="flex items-center justify-between">
        {/* Left - Logo & Copyright */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-gor-accent to-gor-teal rounded-xl flex items-center justify-center shadow-lg shadow-gor-accent/20">
              <span className="text-gor-bg font-bold">G</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-gor-accent to-gor-teal bg-clip-text text-transparent">
              GorTrade
            </span>
          </div>
          <div className="text-sm text-gor-muted">© 2024 GorTrade. Built for Gorbagana Chain.</div>
        </div>

        {/* Center - Contract Address */}
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gor-muted">CA:</span>
          <Button
            variant="ghost"
            onClick={copyToClipboard}
            className={cn(
              "font-mono text-sm transition-all duration-200 hover:bg-gor-accent/10 hover:text-gor-accent rounded-lg px-3 py-1",
              copied && "text-gor-accent bg-gor-accent/10",
            )}
          >
            <span className="mr-2">{`${contractAddress.slice(0, 8)}...${contractAddress.slice(-8)}`}</span>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
          {copied && <span className="text-xs text-gor-accent animate-fade-in">Copied!</span>}
        </div>

        {/* Right - Links */}
        <div className="flex items-center space-x-4">
          {links.map((link) => (
            <Button
              key={link.label}
              variant="ghost"
              size="sm"
              asChild
              className="text-gor-muted hover:text-gor-accent transition-colors rounded-lg"
            >
              <a
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="flex items-center space-x-2"
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </a>
            </Button>
          ))}
        </div>
      </div>
    </footer>
  )
}
