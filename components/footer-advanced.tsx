"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, Github, BookOpen, Twitter, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { ConnectionStatus } from "@/components/connection-status"

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
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = contractAddress
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
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
    <footer className="bg-gor-surface/30 backdrop-blur-xl border-t border-gor-surface/30">
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Left - Logo & Connection Status */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl overflow-hidden bg-gor-surface/50 flex items-center justify-center">
                <Image
                  src="/images/gor-logo.png"
                  alt="GorTrade Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-lg font-bold text-white">GorTrade</span>
            </div>
            <ConnectionStatus />
          </div>

          {/* Center - Contract Address */}
          <div className="flex items-center space-x-3 bg-gor-bg/30 rounded-xl px-4 py-2 border border-gor-surface/30">
            <span className="text-sm text-gor-muted">Contract Address:</span>
            <Button
              variant="ghost"
              onClick={copyToClipboard}
              className={cn(
                "font-mono text-sm transition-all duration-200 hover:bg-gor-accent/10 hover:text-gor-accent rounded-lg px-3 py-1 h-auto",
                copied && "text-gor-accent bg-gor-accent/10",
              )}
            >
              <span className="mr-2">{`${contractAddress.slice(0, 12)}...${contractAddress.slice(-12)}`}</span>
              {copied ? <Check className="w-4 h-4 text-gor-accent" /> : <Copy className="w-4 h-4" />}
            </Button>
            {copied && (
              <div className="text-xs text-gor-accent animate-fade-in bg-gor-accent/10 px-2 py-1 rounded-md">
                Copied!
              </div>
            )}
          </div>

          {/* Right - Links */}
          <div className="flex items-center space-x-1">
            {links.map((link) => (
              <Button
                key={link.label}
                variant="ghost"
                size="sm"
                asChild
                className="text-gor-muted hover:text-gor-accent hover:bg-gor-accent/10 transition-all duration-200 rounded-lg"
              >
                <a
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="flex items-center space-x-2"
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {link.external && <ExternalLink className="w-3 h-3 opacity-50" />}
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="px-8 py-3 border-t border-gor-surface/20 bg-gor-bg/20">
        <div className="flex items-center justify-between text-xs text-gor-muted">
          <div className="flex items-center space-x-4">
            <span>Powered by Jupiter Aggregator</span>
            <span>•</span>
            <span>Gorbagana Chain RPC</span>
            <span>•</span>
            <span>Backpack Wallet</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Version 1.0.0</span>
            <span>•</span>
            <span>Status: Live</span>
            <div className="w-2 h-2 bg-gor-accent rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </footer>
  )
}
