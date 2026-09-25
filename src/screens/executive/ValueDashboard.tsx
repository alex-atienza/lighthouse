import { useNavigate } from 'react-router-dom'
import { Card, PageHeader, Screen, StatTile } from '../../components/ui'
import { Icon, type IconName } from '../../components/icons'
import { BarList, Figure } from '../../components/charts'
import { CountUp } from '../../components/motion'
import { useRoi } from '../../store/hooks'
import { fmtNum, fmtUSD } from '../../lib/format'

export function ValueDashboard() {
  const navigate = useNavigate()
  const roi = useRoi()

  const links: { title: string; to: string; icon: IconName; stat: string }[] = [
    { title: 'Churn prevented', to: '/executive/value/churn', icon: 'circle-check', stat: fmtUSD(roi.churnPreventedArr) },
    { title: 'Expansion & upsell', to: '/executive/value/expansion', icon: 'trending-up', stat: fmtUSD(roi.expansionInfluencedArr) },
    { title: 'Efficiency & adoption', to: '/executive/value/efficiency', icon: 'zap', stat: `${fmtNum(roi.efficiencyHoursSaved)} hrs` },
    { title: 'Business case', to: '/executive/value/business-case', icon: 'target', stat: `${roi.paybackMonths} mo payback` },
  ]

  return (
    <Screen>
      <PageHeader kicker="Executive · Value & ROI" title="Value dashboard" subtitle="What the Voice of the Customer engine is worth — in revenue protected, influenced, and saved." />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Return on Lighthouse" value={<CountUp end={roi.roiMultiple} format={(n) => `${n.toFixed(1)}×`} />} deltaKind="up-good" icon="trending-up" hint="annual return ÷ cost" />
        <StatTile label="Payback" value={<CountUp end={roi.paybackMonths} format={(n) => `${n.toFixed(1)} mo`} />} deltaKind="down-good" icon="clock" />
        <StatTile label="Annual return" value={<CountUp end={roi.annualReturn} format={fmtUSD} />} deltaKind="up-good" icon="target" />
        <StatTile label="Annual investment" value={<CountUp end={roi.investmentAnnual} format={fmtUSD} />} icon="calendar" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Figure title="Value delivered by category" subtitle="Annualized, attributable to feedback-driven action">
          <BarList
            items={[
              { label: 'Churn prevented', value: roi.churnPreventedArr, display: fmtUSD(roi.churnPreventedArr), to: '/executive/value/churn' },
              { label: 'Expansion influenced', value: roi.expansionInfluencedArr, display: fmtUSD(roi.expansionInfluencedArr), to: '/executive/value/expansion' },
              { label: 'Efficiency saved', value: roi.efficiencyCostSaved, display: fmtUSD(roi.efficiencyCostSaved), to: '/executive/value/efficiency' },
            ]}
          />
        </Figure>

        <div className="grid grid-cols-2 gap-3">
          {links.map((l) => (
            <button
              key={l.to}
              onClick={() => navigate(l.to)}
              className="card flex flex-col justify-between gap-6 p-5 text-left transition-shadow hover:shadow-raised"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rust-wash text-rust">
                <Icon name={l.icon} size={18} />
              </span>
              <div>
                <div className="font-display text-heading text-ink">{l.stat}</div>
                <div className="mt-0.5 flex items-center gap-1 text-sm text-ink-mute">
                  {l.title} <Icon name="arrow-right" size={13} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Screen>
  )
}
