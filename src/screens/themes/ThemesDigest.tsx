import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, Screen } from '../../components/ui'
import { TrendBadge } from '../../components/ui'
import { Icon } from '../../components/icons'
import { useThemes } from '../../store/hooks'
import { fmtUSD } from '../../lib/format'
import type { Theme } from '../../data/types'

function DigestRow({ theme, note }: { theme: Theme; note: string }) {
  return (
    <Link to={`/themes/${theme.id}`} className="flex items-start gap-3 rounded-lg px-3 py-2.5 -mx-3 transition-colors hover:bg-paper-sunken">
      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rust" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-ink">{theme.title}</span>
          <TrendBadge pct={theme.volumeTrendPct} />
        </div>
        <div className="text-sm text-ink-mute">{note}</div>
      </div>
      <span className="text-xs text-ink-mute whitespace-nowrap">{theme.volume} mentions</span>
    </Link>
  )
}

export function ThemesDigest() {
  const navigate = useNavigate()
  const byTrend = useThemes({ sort: 'trend' })
  const movers = byTrend.slice(0, 4)
  const emerging = useThemes({ trend: 'emerging', sort: 'trend' })
  const attention = useThemes({ sentiment: 'negative', sort: 'impact' }).slice(0, 4)

  return (
    <Screen width="max-w-3xl">
      <div className="text-xs font-semibold uppercase tracking-wider text-rust mb-2">Themes · Weekly digest</div>
      <h1 className="font-display text-title text-ink">This week in customer feedback</h1>
      <p className="mt-2 text-ink-soft">
        The themes that moved, emerged, and need attention — synthesized from the last seven days across every channel.
      </p>

      <Card className="mt-6 p-6">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
          <Icon name="trending-up" size={16} className="text-rust" /> Biggest movers
        </div>
        <div className="flex flex-col">
          {movers.map((t) => (
            <DigestRow key={t.id} theme={t} note={`Volume ${t.volumeTrendPct > 0 ? 'up' : 'down'} ${Math.abs(t.volumeTrendPct)}% — ${fmtUSD(t.arrImpact)} ARR touched.`} />
          ))}
        </div>
      </Card>

      {emerging.length > 0 && (
        <Card className="mt-4 p-6">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
            <Icon name="sparkles" size={16} className="text-rust" /> Emerging themes
          </div>
          <div className="flex flex-col">
            {emerging.map((t) => (
              <DigestRow key={t.id} theme={t} note={`Newly forming — ${t.summary}`} />
            ))}
          </div>
        </Card>
      )}

      <Card className="mt-4 p-6">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
          <Icon name="alert-triangle" size={16} className="text-sentiment-neg" /> Needs attention
        </div>
        <div className="flex flex-col">
          {attention.map((t) => (
            <DigestRow key={t.id} theme={t} note={`Negative sentiment, impact ${t.impact}. ${t.accountIds.length} accounts affected.`} />
          ))}
        </div>
      </Card>

      <div className="mt-6 flex items-center justify-center gap-3">
        <Button variant="primary" icon="sparkles" onClick={() => navigate('/ask')}>
          Ask about this week
        </Button>
        <Button variant="secondary" icon="file-text" onClick={() => navigate('/reports')}>
          Build a report
        </Button>
      </div>
    </Screen>
  )
}
