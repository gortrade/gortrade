"use client"

const mockTrades = [
  { time: "14:32:15", price: 142.85, amount: 5.2, side: "buy" },
  { time: "14:32:12", price: 142.8, amount: 12.8, side: "sell" },
  { time: "14:32:08", price: 142.9, amount: 3.1, side: "buy" },
  { time: "14:32:05", price: 142.75, amount: 8.7, side: "sell" },
  { time: "14:32:01", price: 142.95, amount: 15.3, side: "buy" },
  { time: "14:31:58", price: 142.7, amount: 6.9, side: "sell" },
  { time: "14:31:55", price: 142.85, amount: 11.2, side: "buy" },
  { time: "14:31:52", price: 142.65, amount: 4.8, side: "sell" },
]

export function RecentTrades() {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Trades</h3>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-4 text-xs text-gor-muted mb-3 px-2">
          <span>Time</span>
          <span>Price (USDC)</span>
          <span>Amount (SOL)</span>
          <span>Side</span>
        </div>

        <div className="space-y-1 max-h-32 overflow-y-auto">
          {mockTrades.map((trade, i) => (
            <div key={i} className="grid grid-cols-4 text-sm hover:bg-gor-surface/50 p-2 rounded">
              <span className="text-gor-muted font-mono">{trade.time}</span>
              <span className={`font-mono ${trade.side === "buy" ? "text-gor-accent" : "text-gor-error"}`}>
                {trade.price.toFixed(2)}
              </span>
              <span className="font-mono">{trade.amount.toFixed(1)}</span>
              <span className={`capitalize ${trade.side === "buy" ? "text-gor-accent" : "text-gor-error"}`}>
                {trade.side}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
