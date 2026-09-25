import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button, PageHeader, Screen, Select, cx } from '../../components/ui'
import { FeedbackQuote, ThemeChip } from '../../components/domain'
import { Icon } from '../../components/icons'
import { findTheme, useAnswers, useDb } from '../../store/hooks'
import type { Channel, SentimentLabel } from '../../data/types'

const channelLabel: Record<Channel, string> = {
  support: 'Support',
  'sales-call': 'Sales calls',
  nps: 'NPS',
  review: 'Reviews',
  community: 'Community',
  'in-app': 'In-app',
  'csm-note': 'CS notes',
  social: 'Social',
}

export function SourcesEvidence() {
  const [params] = useSearchParams()
  const id = params.get('id')
  const navigate = useNavigate()
  const answers = useAnswers()
  const db = useDb()
  const answer = answers.find((a) => a.id === id) ?? answers.find((a) => a.id === 'ans_golden') ?? answers[0]

  const citedThemes = answer.citationThemeIds.map((t) => findTheme(db, t)).filter(Boolean)
  const evidenceIds = useMemo(
    () => new Set<string>([...answer.citationFeedbackIds, ...citedThemes.flatMap((t) => t!.feedbackItemIds)]),
    [answer, citedThemes],
  )
  const all = useMemo(() => db.feedback.filter((f) => evidenceIds.has(f.id)), [db, evidenceIds])

  const [channel, setChannel] = useState<'all' | Channel>('all')
  const [sentiment, setSentiment] = useState<'all' | SentimentLabel>('all')

  const filtered = useMemo(
    () =>
      all
        .filter((f) => (channel === 'all' || f.channel === channel) && (sentiment === 'all' || f.sentiment === sentiment))
        .sort((a, b) => b.createdISO.localeCompare(a.createdISO)),
    [all, channel, sentiment],
  )
  const channels = useMemo(() => [...new Set(all.map((f) => f.channel))], [all])
  const srcCount = useMemo(() => new Set(all.map((f) => f.sourceId)).size, [all])

  const sentiments: Array<'all' | SentimentLabel> = ['all', 'negative', 'neutral', 'positive']

  return (
    <Screen>
      <button
        onClick={() => navigate(`/ask/answer?id=${answer.id}`)}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-mute hover:text-rust"
      >
        <Icon name="chevron-right" size={14} className="rotate-180" />
        Back to answer
      </button>
      <PageHeader
        kicker="Sources & Evidence"
        title="The feedback behind the answer"
        subtitle={`“${answer.question}” — grounded in ${all.length} pieces of feedback across ${srcCount} sources.`}
      />

      {citedThemes.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-mute">Themes</span>
          {citedThemes.map((t) => (
            <ThemeChip key={t!.id} theme={t!} />
          ))}
        </div>
      )}

      {/* filter bar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-line bg-paper-raised p-1">
          {sentiments.map((s) => (
            <button
              key={s}
              onClick={() => setSentiment(s)}
              className={cx(
                'rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors',
                sentiment === s ? 'bg-ink text-paper' : 'text-ink-mute hover:text-ink',
              )}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
        <Select
          value={channel}
          onChange={setChannel}
          className="w-44"
          options={[{ value: 'all', label: 'All channels' }, ...channels.map((c) => ({ value: c, label: channelLabel[c] }))]}
        />
        <span className="text-sm text-ink-mute">
          {filtered.length} of {all.length}
        </span>
      </div>

      <div className="grid gap-2.5 md:grid-cols-2">
        {filtered.map((f) => (
          <FeedbackQuote key={f.id} item={f} />
        ))}
      </div>
    </Screen>
  )
}
