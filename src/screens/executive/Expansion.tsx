import { useNavigate } from 'react-router-dom'
import { PageHeader, Screen, StatTile, Pill } from '../../components/ui'
import { Icon } from '../../components/icons'
import { BarList, Figure } from '../../components/charts'
import { useOpportunities, useRoi } from '../../store/hooks'
import { fmtUSD } from '../../lib/format'

export function Expansion() {
  const navigate = useNavigate()
  const roi = useRoi()
  const drivers = [...useOpportunities()].sort((a, b) => b.arrReach - a.arrReach).slice(0, 6)

  return (
    <Screen>
      <button onClick={() => navigate('/executive/value')} className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-mute hover:text-rust">
        <Icon name="chevron-right" size={14} className="rotate-180" /> Value & ROI
      </button>
      <PageHeader kicker="Executive · Value & ROI" title="Expansion & upsell" subtitle="Growth influenced by acting on positive signals and feature demand surfaced in feedback." />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatTile label="Expansion influenced" value={fmtUSD(roi.expansionInfluencedArr)} deltaKind="up-good" icon="trending-up" />
        <StatTile label="Linked opportunities" value={drivers.length} icon="target" />
        <StatTile label="Avg reach" value={fmtUSD(Math.round(drivers.reduce((s, d) => s + d.arrReach, 0) / drivers.length))} icon="users" />
      </div>

      <Figure title="Expansion drivers" subtitle="Opportunities with the largest revenue reach">
        <BarList items={drivers.map((d) => ({ label: d.title, value: d.arrReach, display: fmtUSD(d.arrReach), to: `/prioritize/${d.id}` }))} />
      </Figure>

      <p className="mt-4 text-xs text-ink-mute">
        Attribution model: incremental ARR on accounts where a feature demand or positive theme influenced an upsell motion. A seeded assumption in this prototype.
      </p>
    </Screen>
  )
}
