import { NextResponse } from "next/server"
import { leaderboardService } from "@/lib/leaderboard-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = (searchParams.get("timeframe") as "24h" | "7d" | "30d" | "all") || "7d"
    const category = (searchParams.get("category") as "all" | "spot" | "perps") || "all"
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const filters = { timeframe, category, limit }

    const [leaderboard, stats] = await Promise.all([
      leaderboardService.getLeaderboard(filters),
      leaderboardService.getLeaderboardStats(filters),
    ])

    return NextResponse.json({
      success: true,
      data: {
        leaderboard: leaderboard.slice(0, limit),
        stats,
        filters,
      },
    })
  } catch (error) {
    console.error("Leaderboard API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch leaderboard data",
      },
      { status: 500 },
    )
  }
}
