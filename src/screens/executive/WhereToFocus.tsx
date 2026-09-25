import { useNavigate } from 'react-router-dom'
import { Button, Card, PageHeader, Screen, Pill, Meter } from '../../components/ui'
import { Icon } from '../../components/icons'
import { useOpportunities } from '../../store/hooks'
import { fmtUSD } from '../../lib/format'

export function WhereToFocus() {
  const navigate = useNavigate()
  const levers = useOpportunities().slice(0, 4)

  return (
    <Screen width="max-w-4xl">
      <PageHeader
        kicker="Executive · Command Center"
        title="Where to focus"
        subtitle="The four highest-leverage bets right now, ranked by reach, impact, and revenue exposure — each already grounded in customer themes."
      />
      <div className="flex flex-col gap-4">
        {levers.map((o, i) => (
          <Card key={o.id} className="flex gap-5 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rust text-lg font-semibold text-white font-display">
              {i + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-display text-heading text-ink">{o.title}</div>
                  <p className="mt-1 text-sm text-ink-soft">{o.summary}</p>
                </div>
                <Pill tone="rust">{o.status}</Pill>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <div className="text-xs uppercase tracking-wide text-ink-mute">ARR reach</div>
                  <div className="font-display text-[18px] text-ink">{fmtUSD(o.arrReach)}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-ink-mute">Accounts</div>
                  <div className="font-display text-[18px] text-ink">{o.reachAccounts}</div>
                </div>
                <div>
                  <div className="mb-1 text-xs uppercase tracking-wide text-ink-mute">Impact</div>
                  <Meter value={o.impact} />
                </div>
                <div>
                  <div className="mb-1 text-xs uppercase tracking-wide text-ink-mute">Effort</div>
                  <Meter value={o.effort} tone="bg-ink-mute" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Button size="sm" variant="secondary" iconRight="arrow-right" onClick={() => navigate(`/prioritize/${o.id}`)}>
                  Open in plan
                </Button>
                <span className="text-xs text-ink-mute">{o.quarter}{o.jiraKey ? ` · ${o.jiraKey}` : ''}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Screen>
  )
}
