import { useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Button, Card, EmptyState, Screen, Select, StatTile, cx } from '../../components/ui'
import { FeedbackQuote, SegmentPill } from '../../components/domain'
import { Avatar, Pill } from '../../components/ui'
import { Icon } from '../../components/icons'
import { findAccount, findOpportunity, useActions, useDb, useTheme } from '../../store/hooks'
import { useFx } from '../../components/fx'
import { fmtUSD } from '../../lib/format'
import type { Channel } from '../../data/types'

const channelLabel: Record<Channel, string> = {
  support: 'Support', 'sales-call': 'Sales calls', nps: 'NPS', review: 'Reviews',
  community: 'Community', 'in-app': 'In-app', 'csm-note': 'CS notes', social: 'Social',
}
const trendTone: Record<string, string> = {
  emerging: 'negative', growing: 'negative', stable: 'neutral', declining: 'positive',
}

export function ThemeDetail() {
  const { id } = useParams()
  const theme = useTheme(id)
  const db = useDb()
  const navigate = useNavigate()
  const { followTheme } = useActions()
  const fx = useFx()
  const [channel, setChannel] = useState<'all' | Channel>('all')

  const feedback = useMemo(
    () =>
      theme
        ? db.feedback
            .filter((f) => theme.feedbackItemIds.includes(f.id) && (channel === 'all' || f.channel === channel))
            .sort((a, b) => b.createdISO.localeCompare(a.createdISO))
        : [],
    [db, theme, channel],
  )

  if (!theme) {
    return (
      <Screen>
        <EmptyState icon="layers" title="Theme not found" action={<Button onClick={() => navigate('/themes')}>Back to explorer</Button>} />
      </Screen>
    )
  }

  const opp = theme.opportunityId ? findOpportunity(db, theme.opportunityId) : undefined
  const accounts = theme.accountIds.map((a) => findAccount(db, a)).filter(Boolean).sort((a, b) => b!.arr - a!.arr)
  const channels = [...new Set(db.feedback.filter((f) => theme.feedbackItemIds.includes(f.id)).map((f) => f.channel))]
  const maxSpark = Math.max(...theme.sparkline, 1)

  return (
    <Screen>
      <button onClick={() => navigate('/themes')} className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-mute hover:text-rust">
        <Icon name="chevron-right" size={14} className="rotate-180" />
        Themes
      </button>

      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink-mute">
            <Icon name="layers" size={13} /> {theme.category}
          </div>
          <h1 className="font-display text-title text-ink">{theme.title}</h1>
          <p className="mt-2 max-w-2xl text-ink-soft">{theme.summary}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant={theme.following ? 'primary' : 'secondary'}
            icon={theme.following ? 'check' : 'plus'}
            onClick={() => {
              const nv = !theme.following
              followTheme(theme.id, nv)
              fx.toast(nv ? `Following “${theme.title}”` : 'Unfollowed', { icon: nv ? 'check' : 'x', tone: nv ? 'success' : 'default' })
            }}
          >
            {theme.following ? 'Following' : 'Follow'}
          </Button>
          <Button variant="secondary" icon="sparkles" onClick={() => navigate(`/ask/answer?q=${encodeURIComponent('Tell me about ' + theme.title)}`)}>
            Ask
          </Button>
        </div>
      </div>

      {/* stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Mentions" value={theme.volume} delta={`${theme.volumeTrendPct > 0 ? '+' : ''}${theme.volumeTrendPct}%`} deltaKind={theme.volumeTrendPct > 0 ? 'up-bad' : 'down-good'} hint="vs last period" icon="activity" />
        <StatTile label="ARR touched" value={fmtUSD(theme.arrImpact)} hint={`${theme.accountIds.length} accounts`} icon="target" />
        <StatTile label="Impact score" value={theme.impact} hint="0–100" icon="zap" />
        <StatTile label="Sentiment" value={<span className="capitalize">{theme.sentiment}</span>} hint={`score ${theme.sentimentScore}`} icon="activity" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* left: volume + feedback */}
        <div className="lg:col-span-2">
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-ink">Mention volume · last 8 weeks</div>
              <Pill tone={trendTone[theme.trend] as any}>{theme.trend}</Pill>
            </div>
            <div className="flex h-32 items-end gap-2">
              {theme.sparkline.map((v, i) => (
                <div key={i} className="flex h-full flex-1 items-end">
                  <div className="w-full rounded-t fill-rust" style={{ height: `${Math.max(3, (v / maxSpark) * 100)}%` }} title={`${v} mentions`} />
                </div>
              ))}
            </div>
            <div className="mt-1 flex gap-2">
              {theme.sparkline.map((_, i) => (
                <span key={i} className="flex-1 text-center text-[10px] text-ink-faint">
                  w{i + 1}
                </span>
              ))}
            </div>
          </Card>

          <div className="mt-6 mb-3 flex items-center justify-between">
            <h2 className="font-display text-heading text-ink">What customers said</h2>
            <Select
              value={channel}
              onChange={setChannel}
              className="w-40"
              options={[{ value: 'all', label: 'All channels' }, ...channels.map((c) => ({ value: c, label: channelLabel[c] }))]}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            {feedback.length === 0 && (
              <div className="rounded-lg border border-line bg-paper-raised p-4 text-sm text-ink-mute">No feedback on this channel yet.</div>
            )}
            {feedback.slice(0, 12).map((f) => (
              <FeedbackQuote key={f.id} item={f} />
            ))}
          </div>
        </div>

        {/* right: opportunity + accounts */}
        <div className="flex flex-col gap-6">
          {opp && (
            <Card className="p-5">
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-mute">Linked opportunity</div>
              <Link to={`/prioritize/${opp.id}`} className="font-display text-[17px] leading-snug text-ink hover:text-rust">
                {opp.title}
              </Link>
              <p className="mt-1 text-[13px] text-ink-mute">{opp.summary}</p>
              <div className="mt-3 flex items-center gap-2">
                <Pill tone="rust">{opp.status}</Pill>
                <span className="text-xs text-ink-mute">{opp.quarter}</span>
                {opp.jiraKey && <span className="text-xs font-mono text-ink-mute">{opp.jiraKey}</span>}
              </div>
            </Card>
          )}
          <Card className="p-5">
            <div className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-mute">
              Affected accounts · {accounts.length}
            </div>
            <div className="flex flex-col gap-3">
              {accounts.slice(0, 6).map((a) => (
                <div key={a!.id} className="flex items-center gap-3">
                  <Avatar initials={a!.logoInitials} size={30} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-ink">{a!.name}</div>
                    <div className="flex items-center gap-1.5 text-xs text-ink-mute">
                      <SegmentPill segment={a!.segment} /> {fmtUSD(a!.arr)}
                    </div>
                  </div>
                  <div className={cx('text-xs font-semibold', a!.health < 50 ? 'text-sentiment-neg' : a!.health < 70 ? 'text-[#8A6414]' : 'text-sentiment-pos')}>
                    {a!.health}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Screen>
  )
}
