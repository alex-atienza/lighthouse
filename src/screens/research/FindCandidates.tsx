import { useMemo, useState } from 'react'
import { Button, PageHeader, Screen, Select, cx } from '../../components/ui'
import { Avatar } from '../../components/ui'
import { MatchScore, CandStatusPill } from './shared'
import { SegmentPill, ThemeChip } from '../../components/domain'
import { Icon } from '../../components/icons'
import { findAccount, findTheme, useActions, useCandidates, useDb, useThemes } from '../../store/hooks'
import { fmtUSD } from '../../lib/format'

export function FindCandidates() {
  const candidates = useCandidates()
  const db = useDb()
  const themes = useThemes({ sort: 'impact' })
  const { setCandidateStatus } = useActions()
  const [theme, setTheme] = useState<'all' | string>('all')

  const ranked = useMemo(
    () =>
      candidates
        .filter((c) => (theme === 'all' ? true : c.themeIds.includes(theme)))
        .sort((a, b) => b.matchScore - a.matchScore),
    [candidates, theme],
  )

  return (
    <Screen>
      <PageHeader
        kicker="Research & Outreach"
        title="Find candidates"
        subtitle="Ranked by how well each account matches an open research need — with the reason spelled out."
      />

      <div className="mb-4 flex items-center gap-3">
        <Select
          value={theme}
          onChange={setTheme}
          className="w-64"
          options={[{ value: 'all', label: 'All themes' }, ...themes.map((t) => ({ value: t.id, label: t.title }))]}
        />
        <span className="text-sm text-ink-mute">{ranked.length} candidates</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {ranked.map((c) => {
          const acc = findAccount(db, c.accountId)
          const cthemes = c.themeIds.map((t) => findTheme(db, t)).filter(Boolean)
          return (
            <div key={c.id} className="card flex items-start gap-4 p-4">
              <MatchScore score={c.matchScore} size={52} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Avatar initials={acc?.logoInitials ?? '—'} size={24} />
                  <span className="text-sm font-semibold text-ink">{acc?.name}</span>
                  {acc && <SegmentPill segment={acc.segment} />}
                  {acc && <span className="text-xs text-ink-mute">{fmtUSD(acc.arr)}</span>}
                  <span className="ml-2 text-xs text-ink-mute">{c.persona}</span>
                </div>
                <p className="mt-1 text-sm text-ink-soft">{c.reason}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {cthemes.map((t) => (
                    <ThemeChip key={t!.id} theme={t!} />
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                {c.status === 'suggested' ? (
                  <Button size="sm" variant="primary" icon="mail" onClick={() => setCandidateStatus(c.id, 'invited')}>
                    Invite
                  </Button>
                ) : (
                  <CandStatusPill status={c.status} />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Screen>
  )
}
