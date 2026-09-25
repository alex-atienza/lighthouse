import { Link } from 'react-router-dom'
import { PageHeader, Screen, Avatar } from '../../components/ui'
import { MatchScore, CandStatusPill } from './shared'
import { SegmentPill } from '../../components/domain'
import { Icon } from '../../components/icons'
import { findAccount, findTheme, useCandidates, useDb } from '../../store/hooks'

export function Matches() {
  const candidates = useCandidates()
  const db = useDb()
  const themeIds = [...new Set(candidates.map((c) => c.themeIds[0]).filter(Boolean))]
  const groups = themeIds
    .map((tid) => ({ theme: findTheme(db, tid), cands: candidates.filter((c) => c.themeIds[0] === tid) }))
    .filter((g) => g.theme)
    .sort((a, b) => b.cands.length - a.cands.length)

  return (
    <Screen>
      <PageHeader kicker="Research & Outreach" title="Matches" subtitle="The best customers to talk to, grouped by the theme they can speak to." />
      <div className="flex flex-col gap-6">
        {groups.map(({ theme, cands }) => (
          <div key={theme!.id}>
            <div className="mb-2 flex items-center gap-2">
              <Icon name="layers" size={14} className="text-ink-mute" />
              <Link to={`/themes/${theme!.id}`} className="font-display text-heading text-ink hover:text-rust">{theme!.title}</Link>
              <span className="text-xs text-ink-mute">{cands.length} match{cands.length !== 1 && 'es'}</span>
            </div>
            <div className="grid gap-2.5 md:grid-cols-2">
              {cands.map((c) => {
                const acc = findAccount(db, c.accountId)
                return (
                  <Link key={c.id} to={`/research/${c.id}`} className="card flex items-center gap-3 p-3.5 transition-shadow hover:shadow-raised">
                    <MatchScore score={c.matchScore} size={40} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Avatar initials={acc?.logoInitials ?? '—'} size={22} />
                        <span className="truncate text-sm font-medium text-ink">{acc?.name}</span>
                        {acc && <SegmentPill segment={acc.segment} />}
                      </div>
                      <div className="mt-0.5 text-xs text-ink-mute">{c.persona}</div>
                    </div>
                    <CandStatusPill status={c.status} />
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </Screen>
  )
}
