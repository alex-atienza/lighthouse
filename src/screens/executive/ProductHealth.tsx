import { PageHeader, Screen } from '../../components/ui'
import { Figure, SentimentSplitBar, useHealthColor, LegendSwatches, useChartColors } from '../../components/charts'
import { useExecutiveMetrics } from '../../store/hooks'
import { fmtNum } from '../../lib/format'

export function ProductHealth() {
  const m = useExecutiveMetrics()
  const areas = m.productHealth // already sorted worst-first
  const healthColor = useHealthColor()
  const cc = useChartColors()

  return (
    <Screen>
      <PageHeader
        kicker="Executive · Command Center"
        title="Product health map"
        subtitle="A health score per product area, derived from the sentiment of everything customers said about it. Worst first."
      />
      <div className="mb-5">
        <LegendSwatches
          items={[
            { label: 'Critical (<50)', color: cc.neg },
            { label: 'Watch (50–67)', color: cc.watch },
            { label: 'Healthy (68+)', color: cc.pos },
          ]}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((a) => (
          <Figure key={a.area} title={a.area} subtitle={`${fmtNum(a.total)} mentions`}>
            <div className="mb-3 flex items-end gap-2">
              <span className="font-display text-title leading-none" style={{ color: healthColor(a.score) }}>
                {a.score}
              </span>
              <span className="mb-1 text-xs text-ink-mute">/ 100 health</span>
            </div>
            <SentimentSplitBar pos={a.pos} neu={a.total - a.pos - a.neg} neg={a.neg} />
          </Figure>
        ))}
      </div>
    </Screen>
  )
}
