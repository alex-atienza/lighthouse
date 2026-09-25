import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Card, Screen, cx } from '../../components/ui'
import { ConfidencePill, FeedbackQuote, Rich, ThemeChip } from '../../components/domain'
import { Icon } from '../../components/icons'
import { findTheme, useActions, useAnswers, useDb } from '../../store/hooks'
import { useFx } from '../../components/fx'
import { getSecret } from './secrets'
import { relTime } from '../../lib/format'
import type { Answer } from '../../data/types'

const GEN_STEPS = [
  'Scanning feedback across 8 sources',
  'Clustering into themes',
  'Weighing sentiment & ARR impact',
  'Composing your answer',
]

function Generating({ question }: { question: string }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => Math.min(v + 1, GEN_STEPS.length - 1)), 360)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="mt-2">
      <div className="mb-6 flex items-center gap-2 text-sm text-rust">
        <Icon name="sparkles" size={16} />
        <span>Lighthouse is reading the feedback…</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {GEN_STEPS.map((s, idx) => (
          <div key={s} className={cx('flex items-center gap-2.5 text-sm transition-opacity', idx <= i ? 'opacity-100' : 'opacity-40')}>
            <span
              className={cx(
                'flex h-5 w-5 items-center justify-center rounded-full',
                idx < i ? 'bg-sentiment-pos text-white' : idx === i ? 'bg-rust text-white' : 'bg-paper-sunken text-ink-mute',
              )}
            >
              {idx < i ? <Icon name="check" size={12} /> : <span className={cx('h-1.5 w-1.5 rounded-full bg-current', idx === i && 'animate-pulse')} />}
            </span>
            <span className={idx <= i ? 'text-ink' : 'text-ink-mute'}>{s}</span>
          </div>
        ))}
      </div>
      <div className="mt-7 space-y-2.5">
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-11/12" />
        <div className="skeleton h-4 w-4/5" />
      </div>
    </div>
  )
}

export function AnswerScreen() {
  const [params] = useSearchParams()
  const id = params.get('id')
  const q = params.get('q')
  const navigate = useNavigate()
  const answers = useAnswers()
  const db = useDb()
  const { pinAnswer } = useActions()
  const fx = useFx()
  const secret = useMemo(() => (q ? getSecret(q) : null), [q])

  const resolved: Answer = useMemo(() => {
    if (id) return answers.find((a) => a.id === id) ?? answers[0]
    if (q) {
      const ql = q.toLowerCase()
      const match = answers.find(
        (a) => a.question.toLowerCase().includes(ql.slice(0, 18)) || ql.includes(a.question.toLowerCase().slice(0, 18)),
      )
      return match ?? answers.find((a) => a.id === 'ans_golden') ?? answers[0]
    }
    return answers.find((a) => a.id === 'ans_golden') ?? answers[0]
  }, [id, q, answers])
  const answer: Answer = secret ?? resolved

  const [generating, setGenerating] = useState(!!q)
  useEffect(() => {
    if (!q) {
      setGenerating(false)
      return
    }
    setGenerating(true)
    const t = setTimeout(() => setGenerating(false), 1650)
    return () => clearTimeout(t)
  }, [q, answer.id])

  useEffect(() => {
    if ((secret as { beam?: boolean } | null)?.beam && !generating) fx.sweep()
  }, [secret, generating, fx])

  const citedThemes = answer.citationThemeIds.map((tid) => findTheme(db, tid)).filter(Boolean)
  const citedFeedback = useMemo(() => {
    const direct = db.feedback.filter((f) => answer.citationFeedbackIds.includes(f.id))
    if (direct.length) return direct.slice(0, 3)
    const first = citedThemes[0]
    return first ? db.feedback.filter((f) => first.feedbackItemIds.includes(f.id)).slice(0, 3) : []
  }, [db, answer])

  const hasReceipts = citedThemes.length > 0 || citedFeedback.length > 0
  const [followUp, setFollowUp] = useState('')

  return (
    <Screen width="max-w-3xl">
      <button onClick={() => navigate('/ask')} className="mb-5 inline-flex items-center gap-1.5 text-sm text-ink-mute hover:text-rust">
        <Icon name="chevron-right" size={14} className="rotate-180" />
        Ask
      </button>

      <div className="text-xs font-semibold uppercase tracking-wider text-rust mb-2">Answer</div>
      <h1 className="font-display text-title leading-tight text-ink">{answer.question}</h1>

      {generating ? (
        <Generating question={answer.question} />
      ) : (
        <div className="animate-fade-in">
          {/* meta */}
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line pb-4">
            <ConfidencePill value={answer.confidence} />
            <span className="text-xs text-ink-mute">
              Synthesized from {citedThemes.length} theme{citedThemes.length !== 1 && 's'} · {relTime(answer.createdISO)}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <Button size="sm" variant={answer.pinned ? 'primary' : 'secondary'} icon="pin" onClick={() => { const nv = !answer.pinned; pinAnswer(answer.id, nv); fx.toast(nv ? 'Saved to your answers' : 'Removed from saved', { icon: 'pin', tone: nv ? 'success' : 'default' }) }}>
                {answer.pinned ? 'Saved' : 'Save'}
              </Button>
              <Button size="sm" variant="secondary" icon="share">
                Share
              </Button>
            </div>
          </div>

          {/* body */}
          <Rich text={answer.answer} className="mt-6 text-[16px] leading-[1.75] text-ink-soft [&_strong]:text-ink" />

          {/* key points */}
          <div className="mt-6 rounded-xl border border-line bg-rust-wash/40 p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
              <Icon name="zap" size={16} className="text-rust" />
              Key points
            </div>
            <ul className="flex flex-col gap-2.5">
              {answer.keyPoints.map((k, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[15px] text-ink-soft">
                  <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rust/15 text-rust">
                    <Icon name="check" size={11} strokeWidth={2.5} />
                  </span>
                  {k}
                </li>
              ))}
            </ul>
          </div>

          {/* receipts */}
          {hasReceipts && (
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-heading text-ink">The receipts</h2>
              <Link
                to={`/ask/answer/sources?id=${answer.id}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-rust hover:text-rust-dark"
              >
                See all evidence <Icon name="arrow-right" size={14} />
              </Link>
            </div>
            {citedThemes.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {citedThemes.map((t) => (
                  <ThemeChip key={t!.id} theme={t!} />
                ))}
              </div>
            )}
            <div className="flex flex-col gap-2.5">
              {citedFeedback.map((f) => (
                <FeedbackQuote key={f.id} item={f} />
              ))}
            </div>
          </div>
          )}

          {/* follow up */}
          <div className="mt-8 rounded-xl border border-line bg-paper-raised p-2 pl-4 shadow-card flex items-center gap-2">
            <Icon name="sparkles" size={16} className="text-rust shrink-0" />
            <input
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/ask/thread?id=${answer.id}${followUp ? `&q=${encodeURIComponent(followUp)}` : ''}`)}
              placeholder="Ask a follow-up…"
              className="flex-1 bg-transparent py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
            />
            <Button
              size="sm"
              variant="primary"
              icon="arrow-right"
              onClick={() => navigate(`/ask/thread?id=${answer.id}${followUp ? `&q=${encodeURIComponent(followUp)}` : ''}`)}
            >
              Continue
            </Button>
          </div>
        </div>
      )}
    </Screen>
  )
}
