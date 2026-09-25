import { useNavigate } from 'react-router-dom'
import { PageHeader, Screen } from '../../components/ui'
import { useOpportunities } from '../../store/hooks'
import { fmtUSD } from '../../lib/format'

export function ImpactEffort() {
  const opps = useOpportunities()
  const navigate = useNavigate()
  const maxArr = Math.max(...opps.map((o) => o.arrReach), 1)
  const size = (arr: number) => 24 + Math.sqrt(arr / maxArr) * 44

  const quadrants = [
    { label: 'Quick wins', style: 'left-3 top-3' },
    { label: 'Big bets', style: 'right-3 top-3' },
    { label: 'Fill-ins', style: 'left-3 bottom-3' },
    { label: 'Time sinks', style: 'right-3 bottom-3' },
  ]

  return (
    <Screen>
      <PageHeader
        kicker="Prioritize & Plan"
        title="Impact – Effort matrix"
        subtitle="Every opportunity plotted by impact against effort; bubble size is ARR reach. Top-left is where to move first."
      />
      <div className="flex gap-4">
        {/* y label */}
        <div className="flex items-center">
          <span className="rotate-180 text-xs font-medium uppercase tracking-wide text-ink-mute [writing-mode:vertical-rl]">Impact →</span>
        </div>
        <div className="flex-1">
          <div className="relative w-full rounded-xl border border-line bg-paper-raised" style={{ height: 520 }}>
            {/* quadrant lines */}
            <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-line" />
            <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-line" />
            {quadrants.map((q) => (
              <span key={q.label} className={`absolute ${q.style} text-[11px] font-medium uppercase tracking-wide text-ink-faint`}>
                {q.label}
              </span>
            ))}
            {/* bubbles */}
            {opps.map((o) => {
              const d = size(o.arrReach)
              return (
                <button
                  key={o.id}
                  onClick={() => navigate(`/prioritize/${o.id}`)}
                  title={`${o.title} — impact ${o.impact}, effort ${o.effort}, ${fmtUSD(o.arrReach)}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/70 bg-rust/80 shadow-card transition-transform hover:scale-110 hover:bg-rust"
                  style={{ left: `${6 + o.effort * 0.88}%`, top: `${6 + (100 - o.impact) * 0.88}%`, width: d, height: d }}
                />
              )
            })}
          </div>
          {/* x label */}
          <div className="mt-2 text-center text-xs font-medium uppercase tracking-wide text-ink-mute">Effort →</div>
        </div>
      </div>
    </Screen>
  )
}
