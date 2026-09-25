import { useNavigate } from 'react-router-dom'
import { PageHeader, Screen, StatTile } from '../../components/ui'
import { Icon } from '../../components/icons'
import { BarList, Figure } from '../../components/charts'
import { useRoi } from '../../store/hooks'
import { fmtNum, fmtUSD } from '../../lib/format'

export function Efficiency() {
  const navigate = useNavigate()
  const roi = useRoi()
  const h = roi.efficiencyHoursSaved
  const breakdown = [
    { label: 'Feedback triage & tagging', frac: 0.4 },
    { label: 'Report & digest generation', frac: 0.25 },
    { label: 'Research prep', frac: 0.2 },
    { label: 'Exec review prep', frac: 0.15 },
  ]

  return (
    <Screen>
      <button onClick={() => navigate('/executive/value')} className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-mute hover:text-rust">
        <Icon name="chevron-right" size={14} className="rotate-180" /> Value & ROI
      </button>
      <PageHeader kicker="Executive · Value & ROI" title="Efficiency & adoption" subtitle="Time and cost saved by automating synthesis — and how much more of the org now acts on feedback." />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatTile label="Hours saved" value={fmtNum(h)} deltaKind="up-good" icon="clock" hint="per year" />
        <StatTile label="Cost saved" value={fmtUSD(roi.efficiencyCostSaved)} deltaKind="up-good" icon="target" />
        <StatTile label="Adoption lift" value={`+${roi.adoptionLiftPct}%`} deltaKind="up-good" icon="trending-up" hint="teams acting on VoC" />
      </div>

      <Figure title="Where the hours are saved" subtitle="Estimated annual hours by activity">
        <BarList items={breakdown.map((b) => ({ label: b.label, value: Math.round(h * b.frac), display: `${fmtNum(Math.round(h * b.frac))} hrs` }))} />
      </Figure>

      <p className="mt-4 text-xs text-ink-mute">
        Attribution model: manual synthesis hours displaced by automated categorization, summarization, and reporting. A seeded assumption in this prototype.
      </p>
    </Screen>
  )
}
