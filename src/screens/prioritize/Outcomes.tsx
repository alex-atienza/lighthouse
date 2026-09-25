import { Link, useNavigate } from 'react-router-dom'
import { Card, EmptyState, PageHeader, Screen, StatTile } from '../../components/ui'
import { Icon } from '../../components/icons'
import { OppStatusPill } from './shared'
import { findTheme, useDb, useOpportunities } from '../../store/hooks'
import { fmtUSD } from '../../lib/format'

export function Outcomes() {
  const opps = useOpportunities()
  const db = useDb()
  const navigate = useNavigate()
  const shipped = opps.filter((o) => o.status === 'shipped')
  const inFlight = opps.filter((o) => o.status === 'in-progress')

  return (
    <Screen>
      <PageHeader kicker="Prioritize & Plan" title="Outcomes" subtitle="What shipped, and what it moved. Closing the loop from feedback to result." />

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Shipped" value={shipped.length} icon="circle-check" deltaKind="up-good" />
        <StatTile label="In flight" value={inFlight.length} icon="zap" />
        <StatTile label="ARR reach delivered" value={fmtUSD(shipped.reduce((s, o) => s + o.arrReach, 0))} icon="target" />
        <StatTile label="Avg RICE shipped" value={shipped.length ? Math.round((shipped.reduce((s, o) => s + o.rice, 0) / shipped.length) * 10) / 10 : 0} icon="trending-up" />
      </div>

      <h2 className="mb-3 font-display text-heading text-ink">Shipped</h2>
      {shipped.length === 0 ? (
        <EmptyState icon="circle-check" title="Nothing shipped yet" body="Move an opportunity to Shipped on the board to see its outcome here." />
      ) : (
        <div className="flex flex-col gap-3">
          {shipped.map((o) => {
            const theme = findTheme(db, o.themeIds[0])
            return (
              <Card key={o.id} className="flex items-start gap-4 p-5">
                <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-sentiment-pos-tint text-sentiment-pos">
                  <Icon name="circle-check" size={18} />
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Link to={`/prioritize/${o.id}`} className="font-display text-[17px] text-ink hover:text-rust">{o.title}</Link>
                    <OppStatusPill status={o.status} />
                  </div>
                  <p className="mt-1 text-sm text-ink-soft">{o.summary}</p>
                  {theme && (
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                      <span className="text-ink-mute">
                        Addressed <Link to={`/themes/${theme.id}`} className="font-medium text-ink hover:text-rust">{theme.title}</Link>
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-sentiment-pos">
                        <Icon name="trending-up" size={14} /> sentiment +12 pts since ship
                      </span>
                      <span className="text-ink-mute">{fmtUSD(o.arrReach)} reach</span>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {inFlight.length > 0 && (
        <>
          <h2 className="mb-3 mt-8 font-display text-heading text-ink">Landing soon</h2>
          <div className="flex flex-col gap-2.5">
            {inFlight.map((o) => (
              <Card key={o.id} className="flex items-center gap-3 p-4">
                <Icon name="zap" size={16} className="text-rust" />
                <Link to={`/prioritize/${o.id}`} className="flex-1 text-sm font-medium text-ink hover:text-rust">{o.title}</Link>
                <span className="text-xs text-ink-mute">{o.quarter}</span>
                <OppStatusPill status={o.status} />
              </Card>
            ))}
          </div>
        </>
      )}
    </Screen>
  )
}
