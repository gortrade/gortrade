import { Connection } from "@solana/web3.js"

export interface TraderStats {
  wallet: string
  username?: string
  totalPnL: number
  winRate: number
  totalVolume: number
  tradesCount: number
  tokensDiversity: number
  avgTradeSize: number
  bestTrade: number
  worstTrade: number
  streak: number
  gorHoldings: number
  title?: string
  isVerified?: boolean
  change24h?: number
}

export interface LeaderboardFilters {
  timeframe: "24h" | "7d" | "30d" | "all"
  category: "all" | "spot" | "perps"
  limit?: number
}

export class LeaderboardService {
  private connection: Connection

  constructor(rpcUrl?: string) {
    const endpoint = rpcUrl || process.env.NEXT_PUBLIC_GORBAGANA_RPC || "https://api.devnet.solana.com"
    this.connection = new Connection(endpoint, "confirmed")
  }

  /**
   * Fetch leaderboard data with filters
   */
  async getLeaderboard(filters: LeaderboardFilters): Promise<TraderStats[]> {
    try {
      // In a real implementation, this would:
      // 1. Query trading history from Gorbagana Chain
      // 2. Calculate PnL for each wallet
      // 3. Aggregate trading statistics
      // 4. Apply filters and sorting
      // 5. Return ranked results

      // For now, return mock data
      return this.getMockLeaderboard(filters)
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error)
      return this.getMockLeaderboard(filters)
    }
  }

  /**
   * Get trader position by wallet address
   */
  async getTraderPosition(walletAddress: string): Promise<TraderStats | null> {
    try {
      const leaderboard = await this.getLeaderboard({ timeframe: "7d", category: "all" })
      return leaderboard.find((trader) => trader.wallet === walletAddress) || null
    } catch (error) {
      console.error("Failed to fetch trader position:", error)
      return null
    }
  }

  /**
   * Calculate leaderboard statistics
   */
  async getLeaderboardStats(filters: LeaderboardFilters) {
    try {
      const leaderboard = await this.getLeaderboard(filters)

      const totalTraders = leaderboard.length
      const totalVolume = leaderboard.reduce((sum, trader) => sum + trader.totalVolume, 0)
      const avgWinRate = leaderboard.reduce((sum, trader) => sum + trader.winRate, 0) / totalTraders
      const topPnL = Math.max(...leaderboard.map((trader) => trader.totalPnL))

      return {
        totalTraders,
        totalVolume,
        avgWinRate,
        topPnL,
      }
    } catch (error) {
      console.error("Failed to calculate leaderboard stats:", error)
      return {
        totalTraders: 0,
        totalVolume: 0,
        avgWinRate: 0,
        topPnL: 0,
      }
    }
  }

  /**
   * Mock leaderboard data for development
   */
  private getMockLeaderboard(filters: LeaderboardFilters): TraderStats[] {
    const mockData: TraderStats[] = [
      {
        wallet: "7x9K2mP3qR7tN8vW5bC4dE6fG1hJ0iL3mN5oP8qR2sT4u",
        username: "TrashSniper",
        totalPnL: 342.5,
        winRate: 88.2,
        totalVolume: 12300,
        tradesCount: 156,
        tokensDiversity: 23,
        avgTradeSize: 78.8,
        bestTrade: 89.4,
        worstTrade: -12.3,
        streak: 12,
        gorHoldings: 15420,
        title: "Diamond Hands",
        isVerified: true,
        change24h: 15.2,
      },
      {
        wallet: "9mK2xR4tN5vW8zA1bC4dE7fG0hI3jK6lM9nO2pQ5rT8s",
        username: "DegenLord",
        totalPnL: 287.3,
        winRate: 73.4,
        totalVolume: 9100,
        tradesCount: 203,
        tokensDiversity: 18,
        avgTradeSize: 44.8,
        bestTrade: 67.2,
        worstTrade: -23.1,
        streak: 8,
        gorHoldings: 8750,
        title: "Volume King",
        isVerified: true,
        change24h: 8.7,
      },
      // Add more mock data...
    ]

    // Apply filters
    let filteredData = mockData

    if (filters.category === "spot") {
      filteredData = filteredData.filter((trader) => trader.tokensDiversity > 20)
    } else if (filters.category === "perps") {
      filteredData = filteredData.filter((trader) => trader.avgTradeSize > 50)
    }

    // Apply timeframe adjustments (mock)
    if (filters.timeframe === "24h") {
      filteredData = filteredData.map((trader) => ({
        ...trader,
        totalPnL: trader.totalPnL * 0.1, // Simulate 24h data
        totalVolume: trader.totalVolume * 0.1,
      }))
    }

    // Sort by PnL descending
    filteredData.sort((a, b) => b.totalPnL - a.totalPnL)

    // Add ranks
    return filteredData.map((trader, index) => ({
      ...trader,
      rank: index + 1,
    }))
  }
}

// Export singleton instance
export const leaderboardService = new LeaderboardService()
