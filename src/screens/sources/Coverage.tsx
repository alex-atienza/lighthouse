import { Card, PageHeader, Screen, StatTile, Meter } from '../../components/ui'
import { Icon } from '../../components/icons'
import { channelLabel } from './shared'
import { useSources } from '../../store/hooks'
import { fmtNum } from '../../lib/format'

export function Coverage() {
  const sources = [...useSources()].sort((a, b) => a.coverage - b.coverage)
  const gaps = sources.filter((s) => s.coverage < 0.75)
  const avg = Math.round((sources.reduce((s, x) => s + x.coverage, 0) / sources.length) * 100)

  return (
    <Screen>
      <PageHeader
        kicker="Sources & Ingestion"
        title="Coverage"
        subtitle="How much of each channel's feedback Lighthouse is actually capturing — and where the blind spots are."
      />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatTile label="Avg coverage" value={`${avg}%`} icon="eye" />
        <StatTile label="Channels" value={sources.length} icon="plug" />
        <StatTile label="Coverage gaps" value={gaps.length} deltaKind="up-bad" icon="alert-triangle" hint="below 75%" />
      </div>

      {gaps.length > 0 && (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-sentiment-neg/25 bg-sentiment-neg-tint/50 p-4">
          <Icon name="alert-triangle" size={18} className="mt-0.5 shrink-0 text-sentiment-neg" />
          <div className="text-sm text-ink-soft">
            <span className="font-medium text-ink">Blind spots: </span>
            {gaps.map((g) => `${g.name} (${Math.round(g.coverage * 100)}%)`).join(', ')}. Connecting or fixing these would widen what Lighthouse can hear.
          </div>
        </div>
      )}

      <Card className="p-5">
        <div className="mb-4 text-sm font-semibold text-ink">Coverage by channel</div>
        <div className="flex flex-col gap-4">
          {sources.map((s) => (
            <div key={s.id} className="flex items-center gap-4">
              <span className="text-lg">{s.icon}</span>
              <div className="w-40 shrink-0">
                <div className="text-sm text-ink">{s.name}</div>
                <div className="text-xs text-ink-mute">{channelLabel[s.type]}</div>
              </div>
              <div className="flex-1">
                <Meter value={s.coverage * 100} tone={s.coverage < 0.75 ? 'bg-sentiment-neg' : 'bg-rust'} />
              </div>
              <div className="w-24 text-right text-sm text-ink-mute">
                <span className="font-medium text-ink">{Math.round(s.coverage * 100)}%</span> · {fmtNum(s.itemCount)}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </Screen>
  )
}
