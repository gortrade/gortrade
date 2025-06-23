import { TokenHeader } from "@/components/token-header"
import { TradingChart } from "@/components/trading-chart"
import { TradingPanel } from "@/components/trading-panel"
import { ActivityFeed } from "@/components/activity-feed"

export default function TradePage() {
  return (
    <div className="flex flex-col">
      {/* Token Header */}
      <TokenHeader />

      {/* Main Content */}
      <div className="flex gap-6 p-6 min-h-[600px]">
        {/* Chart Area */}
        <div className="flex-1 bg-gor-surface/50 backdrop-blur-xl rounded-2xl border border-gor-surface/30 overflow-hidden">
          <TradingChart />
        </div>

        {/* Trading Panel */}
        <div className="w-96 bg-gor-surface/50 backdrop-blur-xl rounded-2xl border border-gor-surface/30">
          <TradingPanel />
        </div>
      </div>

      {/* Bottom Activity */}
      <div className="bg-gor-surface/30 backdrop-blur-xl border-t border-gor-surface/30">
        <ActivityFeed />
      </div>
    </div>
  )
}
