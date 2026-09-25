import { PageHeader, Screen, StatTile, cx } from '../../components/ui'
import { Icon } from '../../components/icons'
import { CAND_FLOW, CandidateCard, candStatusMeta } from './shared'
import { useActions, useCandidates } from '../../store/hooks'
import type { CandidateStatus } from '../../data/types'

export function ResearchPipeline() {
  const candidates = useCandidates()
  const { setCandidateStatus } = useActions()
  const declined = candidates.filter((c) => c.status === 'declined')

  const advance = (id: string, current: CandidateStatus) => {
    const i = CAND_FLOW.indexOf(current)
    const next = CAND_FLOW[i + 1]
    if (next) setCandidateStatus(id, next)
  }

  return (
    <Screen>
      <PageHeader kicker="Research & Outreach" title="Research pipeline" subtitle="Customers worth talking to, from first suggestion to completed interview." />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="In pipeline" value={candidates.filter((c) => c.status !== 'declined').length} icon="users" />
        <StatTile label="Suggested" value={candidates.filter((c) => c.status === 'suggested').length} icon="sparkles" />
        <StatTile label="Scheduled" value={candidates.filter((c) => c.status === 'scheduled').length} icon="calendar" />
        <StatTile label="Completed" value={candidates.filter((c) => c.status === 'completed').length} deltaKind="up-good" icon="circle-check" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {CAND_FLOW.map((status) => {
          const items = candidates.filter((c) => c.status === status)
          return (
            <div key={status} className="flex flex-col">
              <div className="mb-2 flex items-center gap-2 px-1">
                <span className="text-sm font-semibold text-ink">{candStatusMeta[status].label}</span>
                <span className="text-xs text-ink-mute">{items.length}</span>
              </div>
              <div className="flex flex-col gap-2.5 rounded-xl bg-paper-sunken/40 p-2">
                {items.length === 0 && <div className="p-3 text-center text-xs text-ink-faint">—</div>}
                {items.map((c) => (
                  <div key={c.id} className="group relative">
                    <CandidateCard c={c} />
                    {status !== 'completed' && (
                      <button
                        onClick={() => advance(c.id, c.status)}
                        className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-md bg-paper px-2 py-1 text-[11px] font-medium text-rust opacity-0 shadow-card transition-opacity group-hover:opacity-100"
                      >
                        Advance <Icon name="arrow-right" size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {declined.length > 0 && (
        <div className="mt-6">
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-mute">Declined</div>
          <div className="flex flex-wrap gap-2">
            {declined.map((c) => (
              <span key={c.id} className="pill bg-paper-sunken text-ink-mute">{c.persona}</span>
            ))}
          </div>
        </div>
      )}
    </Screen>
  )
}
