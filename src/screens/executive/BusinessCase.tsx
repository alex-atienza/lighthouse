import { useNavigate } from 'react-router-dom'
import { Button, Card, PageHeader, Screen, StatTile } from '../../components/ui'
import { Icon } from '../../components/icons'
import { BarList, Figure } from '../../components/charts'
import { useRoi } from '../../store/hooks'
import { fmtUSD } from '../../lib/format'

export function BusinessCase() {
  const navigate = useNavigate()
  const roi = useRoi()
  const net = roi.annualReturn - roi.investmentAnnual

  return (
    <Screen width="max-w-4xl">
      <button onClick={() => navigate('/executive/value')} className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-mute hover:text-rust">
        <Icon name="chevron-right" size={14} className="rotate-180" /> Value & ROI
      </button>
      <PageHeader kicker="Executive · Value & ROI" title="The business case" subtitle="What Lighthouse costs, what it returns, and how fast it pays back." />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Return" value={`${roi.roiMultiple}×`} deltaKind="up-good" icon="trending-up" />
        <StatTile label="Payback" value={`${roi.paybackMonths} mo`} deltaKind="down-good" icon="clock" />
        <StatTile label="Net annual value" value={fmtUSD(net)} deltaKind="up-good" icon="target" />
        <StatTile label="Investment" value={fmtUSD(roi.investmentAnnual)} icon="calendar" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Figure title="Annual return, by source" subtitle={`Total ${fmtUSD(roi.annualReturn)}`}>
          <BarList
            items={[
              { label: 'Churn prevented', value: roi.churnPreventedArr, display: fmtUSD(roi.churnPreventedArr) },
              { label: 'Expansion influenced', value: roi.expansionInfluencedArr, display: fmtUSD(roi.expansionInfluencedArr) },
              { label: 'Efficiency saved', value: roi.efficiencyCostSaved, display: fmtUSD(roi.efficiencyCostSaved) },
            ]}
          />
        </Figure>

        <Card className="flex flex-col justify-center p-6">
          <div className="text-sm font-semibold text-ink">Investment vs. return</div>
          <div className="mt-4 space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-ink-mute">Investment</span>
                <span className="font-medium text-ink">{fmtUSD(roi.investmentAnnual)}</span>
              </div>
              <div className="h-6 rounded bg-paper-sunken">
                <div className="h-full rounded bg-ink-mute" style={{ width: `${(roi.investmentAnnual / roi.annualReturn) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-ink-mute">Annual return</span>
                <span className="font-medium text-ink">{fmtUSD(roi.annualReturn)}</span>
              </div>
              <div className="h-6 rounded bg-paper-sunken">
                <div className="h-full rounded bg-rust" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
          <div className="mt-5 rounded-lg bg-sentiment-pos-tint p-3 text-center text-sm text-sentiment-pos">
            Pays for itself in <strong>{roi.paybackMonths} months</strong> — a {roi.roiMultiple}× annual return.
          </div>
        </Card>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Button variant="primary" icon="file-text" onClick={() => navigate('/reports/builder')}>
          Add to a report
        </Button>
        <Button variant="secondary" icon="compass" onClick={() => navigate('/executive')}>
          Back to command center
        </Button>
      </div>
      <p className="mt-4 text-xs text-ink-mute">All figures are seeded assumptions for this prototype.</p>
    </Screen>
  )
}
