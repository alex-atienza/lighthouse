import { PageHeader, Screen, cx } from '../../components/ui'
import { Icon } from '../../components/icons'
import { OPP_STATUSES, OppCard, oppStatusMeta } from './shared'
import { useActions, useOpportunities } from '../../store/hooks'
import { fmtUSD } from '../../lib/format'
import type { OppStatus } from '../../data/types'

export function PrioritizeBoard() {
  const opps = useOpportunities()
  const { setOppStatus } = useActions()

  const move = (id: string, current: OppStatus, dir: -1 | 1) => {
    const i = OPP_STATUSES.indexOf(current)
    const next = OPP_STATUSES[i + dir]
    if (next) setOppStatus(id, next)
  }

  return (
    <Screen>
      <PageHeader
        kicker="Prioritize & Plan"
        title="Opportunity board"
        subtitle="Every product bet, ranked by RICE and grounded in customer themes. Move a card to change its stage."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {OPP_STATUSES.map((status) => {
          const items = opps.filter((o) => o.status === status)
          const meta = oppStatusMeta[status]
          return (
            <div key={status} className="flex flex-col">
              <div className="mb-2 flex items-center gap-2 px-1">
                <span className={cx('h-2 w-2 rounded-full', meta.dot)} />
                <span className="text-sm font-semibold text-ink">{meta.label}</span>
                <span className="text-xs text-ink-mute">{items.length}</span>
                <span className="ml-auto text-xs text-ink-mute">{fmtUSD(items.reduce((s, o) => s + o.arrReach, 0))}</span>
              </div>
              <div className="flex flex-col gap-2.5 rounded-xl bg-paper-sunken/40 p-2">
                {items.length === 0 && <div className="p-3 text-center text-xs text-ink-faint">—</div>}
                {items.map((o) => {
                  const i = OPP_STATUSES.indexOf(o.status)
                  return (
                    <div key={o.id} className="group relative">
                      <OppCard o={o} />
                      <div className="mt-1 flex items-center justify-between px-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button disabled={i === 0} onClick={() => move(o.id, o.status, -1)} className="text-ink-faint hover:text-rust disabled:opacity-30" title="Move back">
                          <Icon name="chevron-right" size={14} className="rotate-180" />
                        </button>
                        <span className="text-[10px] uppercase tracking-wide text-ink-faint">move</span>
                        <button disabled={i === OPP_STATUSES.length - 1} onClick={() => move(o.id, o.status, 1)} className="text-ink-faint hover:text-rust disabled:opacity-30" title="Move forward">
                          <Icon name="chevron-right" size={14} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </Screen>
  )
}
