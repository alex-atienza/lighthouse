import { useNavigate } from 'react-router-dom'
import { Button, Screen } from '../../components/ui'
import { Icon } from '../../components/icons'
import { useExecutiveMetrics, useOpportunities, useRoi, useThemes } from '../../store/hooks'
import { fmtUSD } from '../../lib/format'

function Figure({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-title leading-none text-ink">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wide text-ink-mute">{label}</div>
    </div>
  )
}

export function BoardNarrative() {
  const navigate = useNavigate()
  const m = useExecutiveMetrics()
  const roi = useRoi()
  const themes = useThemes({ sort: 'impact' })
  const opps = useOpportunities().slice(0, 3)
  const topNeg = themes.filter((t) => t.sentiment === 'negative').slice(0, 3)

  return (
    <Screen width="max-w-3xl">
      <div className="text-xs font-semibold uppercase tracking-wider text-rust mb-2">Executive · Board narrative</div>
      <h1 className="font-display text-display leading-tight text-ink">The customer, in one page</h1>
      <p className="mt-3 text-[17px] leading-relaxed text-ink-soft">
        August 2026. Sentiment is broadly stable, with {m.posPct}% of feedback positive against {m.negPct}% negative.
        The risks are concentrated and legible — and the work already underway maps directly to them.
      </p>

      <div className="my-8 grid grid-cols-2 gap-6 border-y border-line py-6 sm:grid-cols-4">
        <Figure value={`${m.npsProxy}`} label="NPS proxy" />
        <Figure value={fmtUSD(m.arrAtRisk)} label="ARR at risk" />
        <Figure value={fmtUSD(roi.churnPreventedArr)} label="Churn prevented" />
        <Figure value={`${roi.roiMultiple}×`} label="Return on Lighthouse" />
      </div>

      <h2 className="font-display text-heading text-ink">What's driving risk</h2>
      <p className="mt-2 leading-relaxed text-ink-soft">
        Three themes account for most of the exposure: <strong className="text-ink">{topNeg[0]?.title.toLowerCase()}</strong>,{' '}
        <strong className="text-ink">{topNeg[1]?.title.toLowerCase()}</strong>, and{' '}
        <strong className="text-ink">{topNeg[2]?.title.toLowerCase()}</strong>. Together they touch{' '}
        {fmtUSD(topNeg.reduce((s, t) => s + t.arrImpact, 0))} of ARR across {m.atRiskAccounts.length} at-risk accounts,
        led by the enterprise segment where renewal timing amplifies the stakes.
      </p>

      <h2 className="mt-7 font-display text-heading text-ink">What we're doing about it</h2>
      <div className="mt-3 flex flex-col gap-2.5">
        {opps.map((o, i) => (
          <div key={o.id} className="flex items-start gap-3 rounded-lg border border-line bg-paper-raised p-4">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rust-wash text-xs font-semibold text-rust">
              {i + 1}
            </span>
            <div className="flex-1">
              <div className="font-medium text-ink">{o.title}</div>
              <div className="text-sm text-ink-mute">
                {fmtUSD(o.arrReach)} reach · {o.reachAccounts} accounts · {o.status} · {o.quarter}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-7 leading-relaxed text-ink-soft">
        Net: the feedback engine is paying for itself several times over — {fmtUSD(roi.annualReturn)} in protected and
        influenced revenue against {fmtUSD(roi.investmentAnnual)} of investment, with payback inside{' '}
        {roi.paybackMonths} months.
      </p>

      <div className="mt-8 flex items-center gap-3">
        <Button variant="primary" icon="file-text" onClick={() => navigate('/reports')}>
          Export as report
        </Button>
        <Button variant="secondary" icon="compass" onClick={() => navigate('/executive/value')}>
          See the ROI detail
        </Button>
      </div>
    </Screen>
  )
}
