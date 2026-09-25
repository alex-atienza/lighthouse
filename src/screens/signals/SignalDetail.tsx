import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Card, EmptyState, Screen, cx } from '../../components/ui'
import { Avatar, Pill, SeverityBadge } from '../../components/ui'
import { SegmentPill } from '../../components/domain'
import { Icon } from '../../components/icons'
import { StatusPill, typeMeta } from './shared'
import { findAccount, findTheme, useActions, useDb } from '../../store/hooks'
import { useFx } from '../../components/fx'
import { fmtUSD, relTime } from '../../lib/format'

export function SignalDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const db = useDb()
  const { setSignalStatus } = useActions()
  const fx = useFx()
  const signal = db.signals.find((s) => s.id === id)
  const [routeOpen, setRouteOpen] = useState(false)

  if (!signal) {
    return (
      <Screen>
        <EmptyState icon="activity" title="Signal not found" action={<Button onClick={() => navigate('/signals')}>Back to feed</Button>} />
      </Screen>
    )
  }

  const meta = typeMeta[signal.type]
  const theme = findTheme(db, signal.themeId)
  const account = findAccount(db, signal.accountId)
  const rule = db.rules.find((r) => r.id === signal.ruleId)

  const routes = ['CS — Dana Ito', '#voc-alerts (Slack)', 'Product signals', 'cs-leadership@newrelic.com']

  return (
    <Screen width="max-w-4xl">
      <button onClick={() => navigate('/signals')} className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-mute hover:text-rust">
        <Icon name="chevron-right" size={14} className="rotate-180" />
        Signals
      </button>

      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-paper-sunken text-ink-soft">
          <Icon name={meta.icon} size={22} />
        </span>
        <div className="flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-mute">{meta.label}</span>
            <SeverityBadge value={signal.severity} />
            <StatusPill status={signal.status} />
            <span className="text-xs text-ink-mute">detected {relTime(signal.detectedISO)}</span>
          </div>
          <h1 className="font-display text-title leading-tight text-ink">{signal.title}</h1>
          <p className="mt-2 text-ink-soft">{signal.detail}</p>
        </div>
      </div>

      {/* actions */}
      <div className="relative mt-5 flex flex-wrap items-center gap-2 border-y border-line py-4">
        <Button variant={signal.status === 'acknowledged' ? 'primary' : 'secondary'} icon="check" onClick={() => { setSignalStatus(signal.id, 'acknowledged'); fx.toast('Signal acknowledged', { icon: 'check' }) }}>
          Acknowledge
        </Button>
        <div className="relative">
          <Button variant="secondary" icon="arrow-up-right" onClick={() => setRouteOpen((v) => !v)}>
            Route to…
          </Button>
          {routeOpen && (
            <div className="absolute z-20 mt-1 w-60 overflow-hidden rounded-lg border border-line bg-paper-raised shadow-pop">
              {routes.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setSignalStatus(signal.id, 'routed', r)
                    setRouteOpen(false)
                    fx.toast(`Routed to ${r}`, { icon: 'arrow-up-right', tone: 'success' })
                  }}
                  className="block w-full px-3 py-2 text-left text-sm text-ink-soft hover:bg-paper-sunken"
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
        <Button variant="secondary" icon="users" onClick={() => navigate('/research/find')}>
          Open research
        </Button>
        <Button variant="secondary" icon="target" onClick={() => navigate('/prioritize')}>
          Add to plan
        </Button>
        <Button variant="secondary" icon="circle-check" className="ml-auto" onClick={() => { setSignalStatus(signal.id, 'resolved'); fx.toast('Signal resolved', { icon: 'circle-check', tone: 'success' }) }}>
          Resolve
        </Button>
      </div>

      {signal.routedTo && (
        <div className="mt-3 flex items-center gap-2 text-sm text-ink-soft">
          <Icon name="arrow-up-right" size={15} className="text-rust" /> Routed to <span className="font-medium">{signal.routedTo}</span>
        </div>
      )}

      {/* linked context */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {theme && (
          <Card className="p-5">
            <div className="mb-1.5 text-xs font-medium uppercase tracking-wide text-ink-mute">Linked theme</div>
            <Link to={`/themes/${theme.id}`} className="font-display text-[17px] text-ink hover:text-rust">
              {theme.title}
            </Link>
            <div className="mt-2 flex items-center gap-2 text-xs text-ink-mute">
              <Pill tone={theme.sentiment === 'negative' ? 'negative' : theme.sentiment === 'positive' ? 'positive' : 'neutral'}>
                {theme.category}
              </Pill>
              {theme.volume} mentions · {fmtUSD(theme.arrImpact)} ARR
            </div>
          </Card>
        )}
        {account && (
          <Card className="p-5">
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-mute">Account</div>
            <div className="flex items-center gap-3">
              <Avatar initials={account.logoInitials} size={36} />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-ink">{account.name}</div>
                <div className="flex items-center gap-1.5 text-xs text-ink-mute">
                  <SegmentPill segment={account.segment} /> {fmtUSD(account.arr)} · renews {relTime(account.renewalISO).replace(' ago', '')}
                </div>
              </div>
              <div className={cx('text-lg font-semibold', account.health < 50 ? 'text-sentiment-neg' : account.health < 70 ? 'text-[#8A6414]' : 'text-sentiment-pos')}>
                {account.health}
              </div>
            </div>
          </Card>
        )}
      </div>

      {rule && (
        <div className="mt-4 flex items-center gap-3 rounded-lg border border-line bg-paper-sunken/50 p-4">
          <Icon name="sliders" size={18} className="text-ink-mute" />
          <div className="flex-1 text-sm">
            <span className="text-ink-mute">Triggered by rule</span>{' '}
            <Link to="/signals/rules" className="font-medium text-ink hover:text-rust">
              {rule.name}
            </Link>
            <div className="font-mono text-xs text-ink-mute">{rule.condition}</div>
          </div>
        </div>
      )}
    </Screen>
  )
}
