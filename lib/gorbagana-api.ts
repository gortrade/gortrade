import { Connection } from "@solana/web3.js"

export interface GorbaganaToken {
  name: string
  symbol: string
  address: string
  logo?: string
  price?: number
  change24h?: number
  volume24h?: number
  marketCap?: number
  liquidity?: number
  age?: string
  isNew?: boolean
  isTrending?: boolean
  holders?: number
  decimals?: number
  supply?: number
}

export class GorbaganaAPI {
  private connection: Connection

  constructor(rpcUrl?: string) {
    // Use Gorbagana Chain RPC or fallback to Solana devnet
    const endpoint = rpcUrl || process.env.NEXT_PUBLIC_GORBAGANA_RPC || "https://api.devnet.solana.com"
    this.connection = new Connection(endpoint, "confirmed")
  }

  /**
   * Fetch all tokens from Gorbagana Chain
   */
  async getAllTokens(): Promise<GorbaganaToken[]> {
    try {
      // In a real implementation, this would:
      // 1. Query the Gorbagana Chain for all token mints
      // 2. Fetch metadata for each token
      // 3. Get price data from DEX pools
      // 4. Calculate trending/new status

      // For now, return mock data that simulates real Gorbagana tokens
      return this.getMockTokens()
    } catch (error) {
      console.error("Failed to fetch tokens from Gorbagana Chain:", error)
      return this.getMockTokens()
    }
  }

  /**
   * Fetch new tokens (created in last 24h)
   */
  async getNewTokens(): Promise<GorbaganaToken[]> {
    const allTokens = await this.getAllTokens()
    return allTokens.filter((token) => token.isNew)
  }

  /**
   * Fetch trending tokens (high volume/price change)
   */
  async getTrendingTokens(): Promise<GorbaganaToken[]> {
    const allTokens = await this.getAllTokens()
    return allTokens.filter((token) => token.isTrending)
  }

  /**
   * Search tokens by name, symbol, or address
   */
  async searchTokens(query: string): Promise<GorbaganaToken[]> {
    const allTokens = await this.getAllTokens()
    const searchTerm = query.toLowerCase()

    return allTokens.filter(
      (token) =>
        token.name.toLowerCase().includes(searchTerm) ||
        token.symbol.toLowerCase().includes(searchTerm) ||
        token.address.toLowerCase().includes(searchTerm),
    )
  }

  /**
   * Get token by address
   */
  async getTokenByAddress(address: string): Promise<GorbaganaToken | null> {
    try {
      const allTokens = await this.getAllTokens()
      return allTokens.find((token) => token.address === address) || null
    } catch (error) {
      console.error("Failed to fetch token:", error)
      return null
    }
  }

  /**
   * Mock tokens for development/fallback
   */
  private getMockTokens(): GorbaganaToken[] {
    return [
      {
        name: "GorTrade Token",
        symbol: "GOR",
        address: "71Jvq4Epe2FCJ7JFSF7jLXdNk1Wy4Bhqd9iL6bEFELvg",
        price: 0.0428,
        change24h: 12.5,
        volume24h: 8900000,
        marketCap: 42800000,
        liquidity: 2100000,
        age: "2h",
        isNew: false,
        isTrending: true,
        holders: 1247,
        decimals: 9,
        supply: 1000000000,
      },
      {
        name: "Gorbagana Coin",
        symbol: "GORB",
        address: "9xK2mP3qR7tN8vW5bC4dE6fG1hJ0iL3mN5oP8qR2sT4u",
        price: 0.0156,
        change24h: 45.2,
        volume24h: 1200000,
        marketCap: 15600000,
        liquidity: 890000,
        age: "4h",
        isNew: true,
        isTrending: true,
        holders: 892,
        decimals: 6,
        supply: 500000000,
      },
      {
        name: "Trash Panda",
        symbol: "TRASH",
        address: "3pQ7rT9sU2vW8xY1zA4bC5dE9fG2hI6jK8lM0nO5pQ3r",
        price: 0.0089,
        change24h: -8.3,
        volume24h: 450000,
        marketCap: 8900000,
        liquidity: 340000,
        age: "1d",
        isNew: false,
        isTrending: false,
        holders: 567,
        decimals: 9,
        supply: 1000000000,
      },
      {
        name: "Degen Ape",
        symbol: "DAPE",
        address: "6sU2vW5xY8zA1bC4dE7fG0hI3jK6lM9nO2pQ5rT8sU1v",
        price: 0.0234,
        change24h: 23.7,
        volume24h: 2300000,
        marketCap: 23400000,
        liquidity: 1200000,
        age: "6h",
        isNew: true,
        isTrending: true,
        holders: 1034,
        decimals: 9,
        supply: 1000000000,
      },
      {
        name: "Moon Rocket",
        symbol: "MOON",
        address: "1vW5xY8zA2bC5dE8fG1hI4jK7lM0nO3pQ6rT9sU2vW6x",
        price: 0.0067,
        change24h: -15.4,
        volume24h: 780000,
        marketCap: 6700000,
        liquidity: 290000,
        age: "3d",
        isNew: false,
        isTrending: false,
        holders: 423,
        decimals: 6,
        supply: 1000000000,
      },
      {
        name: "Solana Killer",
        symbol: "SKILL",
        address: "8zA2bC5dE9fG2hI5jK8lM1nO4pQ7rT0sU3vW6xY9zA3b",
        price: 0.0345,
        change24h: 67.8,
        volume24h: 5600000,
        marketCap: 34500000,
        liquidity: 1800000,
        age: "8h",
        isNew: true,
        isTrending: true,
        holders: 1567,
        decimals: 9,
        supply: 1000000000,
      },
    ]
  }
}

// Export singleton instance
export const gorbaganaAPI = new GorbaganaAPI()
