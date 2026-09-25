import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Screen, cx } from '../../components/ui'
import { Rich } from '../../components/domain'
import { Icon, Logo } from '../../components/icons'
import { findTheme, useAnswers, useDb } from '../../store/hooks'

interface Turn {
  role: 'user' | 'assistant'
  text: string
  points?: string[]
}

export function Thread() {
  const [params] = useSearchParams()
  const id = params.get('id')
  const seed = params.get('q')
  const navigate = useNavigate()
  const answers = useAnswers()
  const db = useDb()
  const answer = answers.find((a) => a.id === id) ?? answers.find((a) => a.id === 'ans_golden') ?? answers[0]
  const topTheme = findTheme(db, answer.citationThemeIds[0])

  const cannedReply = (): Turn => ({
    role: 'assistant',
    text: topTheme
      ? `Zooming in: “${topTheme.title}” is the strongest signal here — ${topTheme.volume} mentions, ${topTheme.volumeTrendPct > 0 ? '+' : ''}${topTheme.volumeTrendPct}% vs. the prior period. The affected accounts skew Enterprise, and it already maps to an owned opportunity on the Prioritize board, so that's where I'd start.`
      : `Based on the current feedback, the affected accounts skew Enterprise. I'd take this to the Prioritize board to weigh impact against effort.`,
  })

  const initial: Turn[] = [
    { role: 'user', text: answer.question },
    { role: 'assistant', text: answer.answer, points: answer.keyPoints },
  ]
  const [turns, setTurns] = useState<Turn[]>(() => (seed ? [...initial, { role: 'user', text: seed }, cannedReply()] : initial))
  const [draft, setDraft] = useState('')

  const send = () => {
    if (!draft.trim()) return
    setTurns((t) => [...t, { role: 'user', text: draft.trim() }, cannedReply()])
    setDraft('')
  }

  return (
    <Screen width="max-w-3xl">
      <button onClick={() => navigate('/ask')} className="mb-5 inline-flex items-center gap-1.5 text-sm text-ink-mute hover:text-rust">
        <Icon name="chevron-right" size={14} className="rotate-180" />
        Ask
      </button>
      <div className="text-xs font-semibold uppercase tracking-wider text-rust mb-4">Thread</div>

      <div className="flex flex-col gap-5">
        {turns.map((t, i) =>
          t.role === 'user' ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-rust px-4 py-2.5 text-[15px] text-white">{t.text}</div>
            </div>
          ) : (
            <div key={i} className="flex gap-3">
              <div className="shrink-0">
                <Logo size={30} />
              </div>
              <div className="min-w-0 flex-1">
                <Rich text={t.text} className="text-[15px] leading-relaxed text-ink-soft [&_strong]:text-ink" />
                {t.points && (
                  <ul className="mt-3 flex flex-col gap-1.5">
                    {t.points.slice(0, 3).map((p, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-ink-soft">
                        <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rust/15 text-rust">
                          <Icon name="check" size={11} strokeWidth={2.5} />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ),
        )}
      </div>

      {/* composer */}
      <div className="sticky bottom-4 mt-8">
        <div className="flex items-center gap-2 rounded-xl border border-line bg-paper-raised p-2 pl-4 shadow-raised">
          <Icon name="sparkles" size={16} className="shrink-0 text-rust" />
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Ask a follow-up…"
            className="flex-1 bg-transparent py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
          />
          <Button size="sm" variant="primary" icon="send" onClick={send} disabled={!draft.trim()}>
            Send
          </Button>
        </div>
      </div>
    </Screen>
  )
}
