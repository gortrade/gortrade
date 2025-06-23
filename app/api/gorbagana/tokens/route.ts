import { NextResponse } from "next/server"
import { gorbaganaAPI } from "@/lib/gorbagana-api"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get("filter") // 'new', 'trending', or null for all
    const search = searchParams.get("search")

    let tokens

    if (search) {
      tokens = await gorbaganaAPI.searchTokens(search)
    } else if (filter === "new") {
      tokens = await gorbaganaAPI.getNewTokens()
    } else if (filter === "trending") {
      tokens = await gorbaganaAPI.getTrendingTokens()
    } else {
      tokens = await gorbaganaAPI.getAllTokens()
    }

    return NextResponse.json({
      success: true,
      data: tokens,
      count: tokens.length,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch tokens",
      },
      { status: 500 },
    )
  }
}
