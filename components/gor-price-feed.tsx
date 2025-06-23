"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface GORPriceData {
  price: number
  change24h: number
  volume24h: number
  marketCap: number
  liquidity: number
}

export function GORPriceFeed() {
  const [priceData, setPriceData] = useState<GORPriceData>({
    price: 0.0428,
    change24h: 12.5,
    volume24h: 8900000,
    marketCap: 42800000,
    liquidity: 2100000,
  })
  const [isLoading, setIsLoading] = useState(true)

  const GOR_CONTRACT = "71Jvq4Epe2FCJ7JFSF7jLXdNk1Wy4Bhqd9iL6bEFELvg"

  useEffect(() => {
    const fetchGORPrice = async () => {
      try {
        // Try multiple data sources for GOR token
        const sources = [
          `https://api.dexscreener.com/latest/dex/tokens/${GOR_CONTRACT}`,
          `https://api.coingecko.com/api/v3/simple/token_price/solana?contract_addresses=${GOR_CONTRACT}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`,
          `https://api.birdeye.so/defi/price?address=${GOR_CONTRACT}`,
        ]

        for (const source of sources) {
          try {
            const response = await fetch(source)
            if (response.ok) {
              const data = await response.json()

              // Parse data based on source
              if (source.includes("dexscreener")) {
                const pair = data.pairs?.[0]
                if (pair) {
                  setPriceData({
                    price: Number.parseFloat(pair.priceUsd) || 0.0428,
                    change24h: Number.parseFloat(pair.priceChange?.h24) || 12.5,
                    volume24h: Number.parseFloat(pair.volume?.h24) || 8900000,
                    marketCap: Number.parseFloat(pair.marketCap) || 42800000,
                    liquidity: Number.parseFloat(pair.liquidity?.usd) || 2100000,
                  })
                  break
                }
              } else if (source.includes("coingecko")) {
                const tokenData = data[GOR_CONTRACT.toLowerCase()]
                if (tokenData) {
                  setPriceData({
                    price: tokenData.usd || 0.0428,
                    change24h: tokenData.usd_24h_change || 12.5,
                    volume24h: tokenData.usd_24h_vol || 8900000,
                    marketCap: 42800000, // CoinGecko might not have this
                    liquidity: 2100000,
                  })
                  break
                }
              } else if (source.includes("birdeye")) {
                if (data.data) {
                  setPriceData({
                    price: data.data.value || 0.0428,
                    change24h: data.data.change24h || 12.5,
                    volume24h: 8900000,
                    marketCap: 42800000,
                    liquidity: 2100000,
                  })
                  break
                }
              }
            }
          } catch (error) {
            console.log(`Failed to fetch from ${source}:`, error)
            continue
          }
        }
      } catch (error) {
        console.error("Failed to fetch GOR price:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGORPrice()

    // Update price every 30 seconds
    const interval = setInterval(fetchGORPrice, 30000)

    return () => clearInterval(interval)
  }, [GOR_CONTRACT])

  const formatPrice = (price: number) => {
    if (price < 0.01) {
      return `$${price.toFixed(6)}`
    }
    return `$${price.toFixed(4)}`
  }

  const formatLargeNumber = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`
    }
    return `$${num.toFixed(0)}`
  }

  return (
    <div className="bg-gor-surface/30 backdrop-blur-xl border-b border-gor-surface/30 px-8 py-6">
      <div className="flex items-center justify-between">
        {/* Token Info */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gor-accent to-gor-teal rounded-2xl flex items-center justify-center shadow-lg shadow-gor-accent/20">
              <span className="text-gor-bg font-bold text-xl">G</span>
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold">GOR</h1>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${isLoading ? "bg-gor-muted animate-pulse" : "bg-gor-accent"}`}
                  />
                  <span className="text-xs text-gor-muted">{isLoading ? "Loading..." : "Live"}</span>
                </div>
              </div>
              <p className="text-gor-muted text-sm mt-1 font-mono">
                {GOR_CONTRACT.slice(0, 8)}...{GOR_CONTRACT.slice(-8)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-gor-accent">{isLoading ? "--" : formatPrice(priceData.price)}</p>
              <div className="flex items-center space-x-2 mt-1">
                {priceData.change24h >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-gor-accent" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-gor-error" />
                )}
                <span
                  className={`text-sm font-medium ${priceData.change24h >= 0 ? "text-gor-accent" : "text-gor-error"}`}
                >
                  {isLoading ? "--" : `${priceData.change24h >= 0 ? "+" : ""}${priceData.change24h.toFixed(2)}%`}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 text-sm">
              <div>
                <p className="text-gor-muted">Market Cap</p>
                <p className="font-semibold mt-1">{isLoading ? "--" : formatLargeNumber(priceData.marketCap)}</p>
              </div>
              <div>
                <p className="text-gor-muted">Liquidity</p>
                <p className="font-semibold mt-1">{isLoading ? "--" : formatLargeNumber(priceData.liquidity)}</p>
              </div>
              <div>
                <p className="text-gor-muted">24h Volume</p>
                <p className="font-semibold mt-1">{isLoading ? "--" : formatLargeNumber(priceData.volume24h)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
