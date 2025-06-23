import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { TopNavigation } from "@/components/top-navigation"
import { Footer } from "@/components/footer-advanced"
import { GlobalWalletProvider } from "@/hooks/use-global-wallet"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GorTrade",
  description: "Professional DEX Trading Terminal for Gorbagana Chain",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gor-bg text-gor-text antialiased`}>
        <GlobalWalletProvider>
          <div className="min-h-screen flex flex-col">
            <TopNavigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </GlobalWalletProvider>
      </body>
    </html>
  )
}
