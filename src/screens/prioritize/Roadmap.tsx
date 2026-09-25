import { PageHeader, Screen } from '../../components/ui'
import { OppCard } from './shared'
import { useOpportunities } from '../../store/hooks'
import { fmtUSD } from '../../lib/format'

// chronological order of the quarters present in the seed
const QUARTER_ORDER = ["Q2 '26", "Q3 '26", "Q4 '26", "Q1 '27"]

export function Roadmap() {
  const opps = useOpportunities()
  const quarters = QUARTER_ORDER.filter((q) => opps.some((o) => o.quarter === q))

  return (
    <Screen>
      <PageHeader kicker="Prioritize & Plan" title="Roadmap" subtitle="Where the prioritized work lands across the next few quarters." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quarters.map((q) => {
          const items = opps.filter((o) => o.quarter === q)
          return (
            <div key={q} className="flex flex-col">
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="font-display text-heading text-ink">{q}</span>
                <span className="text-xs text-ink-mute">{fmtUSD(items.reduce((s, o) => s + o.arrReach, 0))}</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {items.map((o) => (
                  <OppCard key={o.id} o={o} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Screen>
  )
}
