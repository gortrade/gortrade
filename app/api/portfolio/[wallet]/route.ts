import { NextResponse } from "next/server"
import { portfolioService } from "@/lib/portfolio-service"

export async function GET(request: Request, { params }: { params: { wallet: string } }) {
  try {
    const walletAddress = params.wallet

    if (!walletAddress) {
      return NextResponse.json(
        {
          success: false,
          error: "Wallet address is required",
        },
        { status: 400 },
      )
    }

    // Fetch token accounts
    const tokenAccounts = await portfolioService.getTokenAccounts(walletAddress)

    // Fetch SOL balance
    const solBalance = await portfolioService.getSOLBalance(walletAddress)

    // Fetch metadata for each token
    const holdings = await Promise.all(
      tokenAccounts.map(async (account) => {
        const metadata = await portfolioService.getTokenMetadata(account.mint)
        const valueUSD = (metadata.price || 0) * account.uiAmount
        const valueGOR = portfolioService.calculateGORValue(valueUSD)

        return {
          mint: account.mint,
          name: metadata.name,
          symbol: metadata.symbol,
          amount: account.uiAmount,
          decimals: account.decimals,
          price: metadata.price,
          valueUSD,
          valueGOR,
          change24h: metadata.change24h,
          logo: metadata.logo,
        }
      }),
    )

    // Add SOL if balance > 0
    if (solBalance > 0) {
      const solMetadata = await portfolioService.getTokenMetadata("So11111111111111111111111111111111111111112")
      const solValueUSD = (solMetadata.price || 0) * solBalance
      const solValueGOR = portfolioService.calculateGORValue(solValueUSD)

      holdings.unshift({
        mint: "So11111111111111111111111111111111111111112",
        name: "Solana",
        symbol: "SOL",
        amount: solBalance,
        decimals: 9,
        price: solMetadata.price,
        valueUSD: solValueUSD,
        valueGOR: solValueGOR,
        change24h: solMetadata.change24h,
      })
    }

    // Calculate portfolio stats
    const totalValueUSD = holdings.reduce((sum, token) => sum + (token.valueUSD || 0), 0)
    const totalValueGOR = holdings.reduce((sum, token) => sum + (token.valueGOR || 0), 0)

    const weightedChange = holdings.reduce((sum, token) => {
      const weight = (token.valueUSD || 0) / totalValueUSD
      return sum + (token.change24h || 0) * weight
    }, 0)

    return NextResponse.json({
      success: true,
      data: {
        holdings,
        stats: {
          totalValueUSD,
          totalValueGOR,
          change24h: weightedChange,
          change24hUSD: totalValueUSD * (weightedChange / 100),
          tokenCount: holdings.length,
        },
      },
    })
  } catch (error) {
    console.error("Portfolio API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch portfolio data",
      },
      { status: 500 },
    )
  }
}
