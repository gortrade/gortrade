"use client"

const mockOrderBook = {
  asks: [
    { price: 143.25, amount: 12.5, total: 1791.25 },
    { price: 143.2, amount: 8.3, total: 1188.56 },
    { price: 143.15, amount: 15.7, total: 2247.46 },
    { price: 143.1, amount: 22.1, total: 3162.51 },
    { price: 143.05, amount: 18.9, total: 2703.65 },
  ],
  bids: [
    { price: 142.95, amount: 16.2, total: 2315.79 },
    { price: 142.9, amount: 11.8, total: 1686.22 },
    { price: 142.85, amount: 25.3, total: 3614.11 },
    { price: 142.8, amount: 19.7, total: 2813.16 },
    { price: 142.75, amount: 14.1, total: 2012.78 },
  ],
}

export function OrderBook() {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">Order Book</h3>

      <div className="space-y-4">
        {/* Asks */}
        <div>
          <div className="grid grid-cols-3 text-xs text-gor-muted mb-2">
            <span>Price (USDC)</span>
            <span className="text-right">Amount (SOL)</span>
            <span className="text-right">Total</span>
          </div>
          <div className="space-y-1">
            {mockOrderBook.asks.reverse().map((ask, i) => (
              <div key={i} className="grid grid-cols-3 text-sm hover:bg-gor-error/10 p-1 rounded cursor-pointer">
                <span className="text-gor-error font-mono">{ask.price.toFixed(2)}</span>
                <span className="text-right font-mono">{ask.amount.toFixed(1)}</span>
                <span className="text-right text-gor-muted font-mono">{ask.total.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Spread */}
        <div className="text-center py-2 border-y border-gor-surface/50">
          <span className="text-xs text-gor-muted">Spread: </span>
          <span className="text-xs text-gor-accent font-mono">$0.30 (0.21%)</span>
        </div>

        {/* Bids */}
        <div>
          <div className="space-y-1">
            {mockOrderBook.bids.map((bid, i) => (
              <div key={i} className="grid grid-cols-3 text-sm hover:bg-gor-accent/10 p-1 rounded cursor-pointer">
                <span className="text-gor-accent font-mono">{bid.price.toFixed(2)}</span>
                <span className="text-right font-mono">{bid.amount.toFixed(1)}</span>
                <span className="text-right text-gor-muted font-mono">{bid.total.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
