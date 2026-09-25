import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Screen } from '../../components/ui'
import { Icon } from '../../components/icons'
import { useAnswers, useExecutiveMetrics, useSources, useAccounts } from '../../store/hooks'
import { fmtNum, relTime } from '../../lib/format'

const SUGGESTED = [
  'What is driving churn risk in our enterprise accounts this quarter?',
  'Which themes are growing fastest in the last 30 days?',
  'What do enterprise customers love most?',
  'How is pricing sentiment trending?',
]

export function AskHome() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const answers = useAnswers()
  const m = useExecutiveMetrics()
  const sources = useSources()
  const accounts = useAccounts()

  const ask = (question: string) => {
    if (!question.trim()) return
    navigate(`/ask/answer?q=${encodeURIComponent(question.trim())}`)
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      ask(q)
    }
  }

  return (
    <Screen width="max-w-4xl">
      {/* hero */}
      <div className="relative pt-10 pb-2 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-16 -z-10 h-72 w-72 -translate-x-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(180,69,31,.18), transparent 70%)', filter: 'blur(24px)', animation: 'glow-pulse 4s ease-in-out infinite' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-16 -z-10 h-72 w-72 -translate-x-1/2"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(201,162,39,.22) 16deg, rgba(180,69,31,.10) 30deg, transparent 46deg)',
            WebkitMaskImage: 'radial-gradient(circle, #000 28%, transparent 72%)',
            maskImage: 'radial-gradient(circle, #000 28%, transparent 72%)',
            filter: 'blur(6px)',
            animation: 'beacon-rotate 14s linear infinite',
          }}
        />
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-paper-raised px-3 py-1 text-xs text-ink-mute">
          <span className="h-1.5 w-1.5 rounded-full bg-sentiment-pos" />
          Analyzing {fmtNum(m.ingested)} pieces of feedback · {sources.length} sources · {accounts.length} accounts
        </div>
        <h1 className="font-display text-display-lg leading-[1.02] text-ink" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 40, 'WONK' 1" }}>
          Ask your customers
          <br />
          anything.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ink-soft">
          Lighthouse reads every ticket, call, review, and survey — then answers in plain language, with the receipts.
        </p>
      </div>

      {/* ask box */}
      <div className="mt-7 rounded-xl border border-line bg-paper-raised shadow-card focus-within:ring-2 focus-within:ring-rust/25 focus-within:border-rust/40 transition">
        <textarea
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
          placeholder="e.g. Why are enterprise accounts unhappy this month?"
          className="w-full resize-none bg-transparent px-4 pt-4 pb-2 text-[15px] text-ink placeholder:text-ink-faint focus:outline-none"
        />
        <div className="flex items-center justify-between px-3 pb-3">
          <span className="text-xs text-ink-faint pl-1">Press ↵ to ask · Shift+↵ for newline</span>
          <Button variant="primary" icon="send" onClick={() => ask(q)} disabled={!q.trim()}>
            Ask Lighthouse
          </Button>
        </div>
      </div>

      {/* suggested prompts */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {SUGGESTED.map((s) => (
          <button
            key={s}
            onClick={() => ask(s)}
            className="rounded-full border border-line bg-paper-raised px-3.5 py-1.5 text-[13px] text-ink-soft transition-colors hover:border-rust/40 hover:text-rust"
          >
            {s}
          </button>
        ))}
      </div>

      {/* saved answers */}
      <div className="mt-14">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-heading text-ink">Saved answers</h2>
          <button onClick={() => navigate('/ask/saved')} className="text-sm font-medium text-rust hover:text-rust-dark">
            View all
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {answers.slice(0, 4).map((a) => (
            <button
              key={a.id}
              onClick={() => navigate(`/ask/answer?id=${a.id}`)}
              className="card p-4 text-left transition-shadow hover:shadow-raised"
            >
              <div className="mb-1.5 flex items-center gap-1.5 text-xs text-ink-mute">
                {a.pinned && <Icon name="pin" size={12} />}
                <span>{relTime(a.createdISO)}</span>
                <span className="text-ink-faint">·</span>
                <span>{Math.round(a.confidence * 100)}% confidence</span>
              </div>
              <div className="font-medium text-ink">{a.question}</div>
              <div className="mt-1 line-clamp-2 text-sm text-ink-mute">{a.answer.replace(/\*\*/g, '')}</div>
            </button>
          ))}
        </div>
      </div>
    </Screen>
  )
}
