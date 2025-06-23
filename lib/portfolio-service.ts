import { Connection, PublicKey } from "@solana/web3.js"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"

export interface TokenAccount {
  mint: string
  amount: number
  decimals: number
  uiAmount: number
}

export interface TokenMetadata {
  name: string
  symbol: string
  logo?: string
  price?: number
  change24h?: number
}

export class PortfolioService {
  private connection: Connection

  constructor(rpcUrl?: string) {
    const endpoint = rpcUrl || process.env.NEXT_PUBLIC_GORBAGANA_RPC || "https://api.devnet.solana.com"
    this.connection = new Connection(endpoint, "confirmed")
  }

  /**
   * Fetch all token accounts for a wallet
   */
  async getTokenAccounts(walletAddress: string): Promise<TokenAccount[]> {
    try {
      const publicKey = new PublicKey(walletAddress)

      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID,
      })

      return tokenAccounts.value
        .map((account) => {
          const parsedInfo = account.account.data.parsed.info
          return {
            mint: parsedInfo.mint,
            amount: Number.parseInt(parsedInfo.tokenAmount.amount),
            decimals: parsedInfo.tokenAmount.decimals,
            uiAmount: parsedInfo.tokenAmount.uiAmount || 0,
          }
        })
        .filter((token) => token.uiAmount > 0) // Only include tokens with balance
    } catch (error) {
      console.error("Failed to fetch token accounts:", error)
      return []
    }
  }

  /**
   * Get SOL balance for a wallet
   */
  async getSOLBalance(walletAddress: string): Promise<number> {
    try {
      const publicKey = new PublicKey(walletAddress)
      const balance = await this.connection.getBalance(publicKey)
      return balance / 1e9 // Convert lamports to SOL
    } catch (error) {
      console.error("Failed to fetch SOL balance:", error)
      return 0
    }
  }

  /**
   * Fetch token metadata from various sources
   */
  async getTokenMetadata(mintAddress: string): Promise<TokenMetadata> {
    try {
      // Try multiple sources for token metadata
      const sources = [
        `https://api.dexscreener.com/latest/dex/tokens/${mintAddress}`,
        `https://api.coingecko.com/api/v3/simple/token_price/solana?contract_addresses=${mintAddress}&vs_currencies=usd&include_24hr_change=true`,
      ]

      for (const source of sources) {
        try {
          const response = await fetch(source)
          if (response.ok) {
            const data = await response.json()

            if (source.includes("dexscreener")) {
              const pair = data.pairs?.[0]
              if (pair) {
                return {
                  name: pair.baseToken?.name || "Unknown Token",
                  symbol: pair.baseToken?.symbol || "UNKNOWN",
                  price: Number.parseFloat(pair.priceUsd) || 0,
                  change24h: Number.parseFloat(pair.priceChange?.h24) || 0,
                }
              }
            } else if (source.includes("coingecko")) {
              const tokenData = data[mintAddress.toLowerCase()]
              if (tokenData) {
                return {
                  name: "Unknown Token", // CoinGecko doesn't provide name in this endpoint
                  symbol: "UNKNOWN",
                  price: tokenData.usd || 0,
                  change24h: tokenData.usd_24h_change || 0,
                }
              }
            }
          }
        } catch (error) {
          console.log(`Failed to fetch from ${source}:`, error)
          continue
        }
      }

      // Fallback to known tokens
      return this.getKnownTokenMetadata(mintAddress)
    } catch (error) {
      console.error("Failed to fetch token metadata:", error)
      return this.getKnownTokenMetadata(mintAddress)
    }
  }

  /**
   * Get metadata for known tokens
   */
  private getKnownTokenMetadata(mintAddress: string): TokenMetadata {
    const knownTokens: Record<string, TokenMetadata> = {
      "71Jvq4Epe2FCJ7JFSF7jLXdNk1Wy4Bhqd9iL6bEFELvg": {
        name: "GorTrade Token",
        symbol: "GOR",
        price: 0.0428,
        change24h: 12.5,
      },
      "9xK2mP3qR7tN8vW5bC4dE6fG1hJ0iL3mN5oP8qR2sT4u": {
        name: "Gorbagana Coin",
        symbol: "GORB",
        price: 0.0156,
        change24h: 45.2,
      },
      So11111111111111111111111111111111111111112: {
        name: "Wrapped SOL",
        symbol: "SOL",
        price: 142.85,
        change24h: 5.2,
      },
      // Add more known tokens as needed
    }

    return (
      knownTokens[mintAddress] || {
        name: "Unknown Token",
        symbol: "UNKNOWN",
        price: 0,
        change24h: 0,
      }
    )
  }

  /**
   * Calculate portfolio value in GOR tokens
   */
  calculateGORValue(usdValue: number, gorPrice = 0.0428): number {
    return usdValue / gorPrice
  }
}

// Export singleton instance
export const portfolioService = new PortfolioService()
