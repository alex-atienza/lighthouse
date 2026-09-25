import { Link } from 'react-router-dom'
import { Card, PageHeader, Screen, Pill } from '../../components/ui'
import { Icon, type IconName } from '../../components/icons'
import { StatusPill } from './shared'
import { useRules, useSignals } from '../../store/hooks'
import { relTime } from '../../lib/format'
import type { Rule } from '../../data/types'

const channels: Array<{ key: Rule['route']; label: string; icon: IconName; hint: string }> = [
  { key: 'slack', label: 'Slack', icon: 'hash', hint: 'Real-time team channels' },
  { key: 'email', label: 'Email', icon: 'mail', hint: 'Leadership digests' },
  { key: 'jira', label: 'Jira', icon: 'external', hint: 'Tracked work items' },
]

export function SignalsRouting() {
  const rules = useRules()
  const routed = useSignals({ status: 'routed' })

  return (
    <Screen>
      <PageHeader kicker="Signals" title="Routing" subtitle="Where signals go when a rule fires — and what's been routed lately." />

      <div className="grid gap-4 md:grid-cols-3">
        {channels.map((ch) => {
          const chRules = rules.filter((r) => r.route === ch.key)
          return (
            <Card key={ch.key} className="p-5">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-paper-sunken text-ink-soft">
                  <Icon name={ch.icon} size={18} />
                </span>
                <div>
                  <div className="font-medium text-ink">{ch.label}</div>
                  <div className="text-xs text-ink-mute">{ch.hint}</div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {chRules.length === 0 && <div className="text-sm text-ink-faint">No rules route here.</div>}
                {chRules.map((r) => (
                  <div key={r.id} className="rounded-lg border border-line bg-paper p-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm text-ink">{r.routeTarget}</span>
                      <span className={r.enabled ? 'text-sentiment-pos' : 'text-ink-faint'}>
                        <Icon name={r.enabled ? 'circle-check' : 'x'} size={14} />
                      </span>
                    </div>
                    <div className="mt-0.5 truncate text-xs text-ink-mute">{r.name}</div>
                  </div>
                ))}
              </div>
            </Card>
          )
        })}
      </div>

      <h2 className="mb-3 mt-8 font-display text-heading text-ink">Recently routed</h2>
      {routed.length === 0 ? (
        <div className="text-sm text-ink-mute">Nothing routed yet — route a signal from the feed.</div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {routed.map((s) => (
            <Link key={s.id} to={`/signals/${s.id}`} className="card flex items-center gap-3 p-3.5 transition-shadow hover:shadow-raised">
              <Icon name="arrow-up-right" size={16} className="text-rust" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-ink">{s.title}</div>
                <div className="text-xs text-ink-mute">→ {s.routedTo}</div>
              </div>
              <StatusPill status={s.status} />
              <span className="text-xs text-ink-mute">{relTime(s.detectedISO)}</span>
            </Link>
          ))}
        </div>
      )}
    </Screen>
  )
}
