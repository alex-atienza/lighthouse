import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, EmptyState, PageHeader, Screen, SeverityBadge, cx } from '../../components/ui'
import { StatusPill, typeMeta } from './shared'
import { Icon } from '../../components/icons'
import { findAccount, findTheme, useActions, useDb, useSignals } from '../../store/hooks'
import { fmtUSD } from '../../lib/format'

export function SignalsAct() {
  const navigate = useNavigate()
  const db = useDb()
  const { setSignalStatus } = useActions()
  const actionable = useSignals({}).filter((s) => s.status === 'new' || s.status === 'acknowledged')
  const [selId, setSelId] = useState<string | undefined>(actionable[0]?.id)
  const sel = db.signals.find((s) => s.id === selId) ?? actionable[0]

  return (
    <Screen>
      <PageHeader
        kicker="Signals"
        title="Act"
        subtitle="Triage what needs a human. Turn a signal into an outcome — a plan item, a research call, or a routed hand-off."
      />

      {actionable.length === 0 && !sel ? (
        <EmptyState icon="circle-check" title="Queue is clear" body="No signals waiting on action right now." />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,340px)_1fr]">
          {/* queue */}
          <div className="flex flex-col gap-2">
            <div className="text-xs font-medium uppercase tracking-wide text-ink-mute">Needs action · {actionable.length}</div>
            {actionable.map((s) => {
              const meta = typeMeta[s.type]
              return (
                <button
                  key={s.id}
                  onClick={() => setSelId(s.id)}
                  className={cx(
                    'flex items-start gap-2.5 rounded-lg border p-3 text-left transition-colors',
                    sel?.id === s.id ? 'border-rust/50 bg-rust-wash/40' : 'border-line bg-paper-raised hover:bg-paper-sunken',
                  )}
                >
                  <Icon name={meta.icon} size={15} className="mt-0.5 text-ink-mute" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-ink">{s.title}</div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <SeverityBadge value={s.severity} />
                      <StatusPill status={s.status} />
                    </div>
                  </div>
                </button>
              )
            })}
            {actionable.length === 0 && <div className="rounded-lg border border-line p-4 text-sm text-ink-mute">Queue is clear 🎉</div>}
          </div>

          {/* action panel */}
          {sel && (
            <Card className="p-6">
              <div className="mb-1.5 flex items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-wide text-ink-mute">{typeMeta[sel.type].label}</span>
                <SeverityBadge value={sel.severity} />
                <StatusPill status={sel.status} />
              </div>
              <h2 className="font-display text-heading text-ink">{sel.title}</h2>
              <p className="mt-1.5 text-sm text-ink-soft">{sel.detail}</p>

              <div className="mt-5 text-xs font-medium uppercase tracking-wide text-ink-mute">Choose an action</div>
              <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
                <ActionCard icon="target" title="Add to plan" body="Create or link a product opportunity." onClick={() => navigate('/prioritize')} />
                <ActionCard icon="users" title="Open research" body="Find customers to talk to about this." onClick={() => navigate('/research/find')} />
                <ActionCard
                  icon="arrow-up-right"
                  title="Route to CS"
                  body="Hand off to the account team."
                  onClick={() => setSignalStatus(sel.id, 'routed', 'CS — Dana Ito')}
                />
                <ActionCard icon="circle-check" title="Resolve" body="Mark handled and clear it." onClick={() => setSignalStatus(sel.id, 'resolved')} />
              </div>

              <div className="mt-5 flex items-center gap-2 border-t border-line pt-4">
                {sel.status === 'new' && (
                  <Button variant="secondary" icon="check" onClick={() => setSignalStatus(sel.id, 'acknowledged')}>
                    Acknowledge
                  </Button>
                )}
                <Button variant="ghost" iconRight="arrow-right" onClick={() => navigate(`/signals/${sel.id}`)}>
                  Open full signal
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </Screen>
  )
}

function ActionCard({ icon, title, body, onClick }: { icon: any; title: string; body: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-start gap-3 rounded-lg border border-line bg-paper-raised p-3.5 text-left transition-colors hover:border-rust/40 hover:bg-rust-wash/30"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-paper-sunken text-rust">
        <Icon name={icon} size={16} />
      </span>
      <div>
        <div className="text-sm font-medium text-ink">{title}</div>
        <div className="text-xs text-ink-mute">{body}</div>
      </div>
    </button>
  )
}
