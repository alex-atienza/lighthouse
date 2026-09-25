import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, EmptyState, PageHeader, Screen, SearchInput } from '../../components/ui'
import { ConfidencePill } from '../../components/domain'
import { Icon } from '../../components/icons'
import { useActions, useAnswers } from '../../store/hooks'
import { relTime } from '../../lib/format'

export function SavedAnswers() {
  const answers = useAnswers()
  const { pinAnswer } = useActions()
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const list = useMemo(() => {
    let l = answers
    if (q) {
      const s = q.toLowerCase()
      l = l.filter((a) => a.question.toLowerCase().includes(s) || a.answer.toLowerCase().includes(s))
    }
    return [...l].sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.createdISO.localeCompare(a.createdISO))
  }, [answers, q])

  return (
    <Screen>
      <PageHeader
        kicker="Ask"
        title="Saved answers"
        subtitle="Every question you've asked Lighthouse, with its sourced brief."
        actions={
          <Button variant="primary" icon="plus" onClick={() => navigate('/ask')}>
            New question
          </Button>
        }
      />

      <div className="mb-5 max-w-md">
        <SearchInput value={q} onChange={setQ} placeholder="Search saved answers…" />
      </div>

      {list.length === 0 ? (
        <EmptyState title="No matching answers" body="Try a different search, or ask something new." />
      ) : (
        <div className="flex flex-col gap-2.5">
          {list.map((a) => (
            <div key={a.id} className="card group flex items-start gap-4 p-4 transition-shadow hover:shadow-raised">
              <button className="min-w-0 flex-1 text-left" onClick={() => navigate(`/ask/answer?id=${a.id}`)}>
                <div className="mb-1 flex items-center gap-2 text-xs text-ink-mute">
                  <ConfidencePill value={a.confidence} />
                  <span>{relTime(a.createdISO)}</span>
                </div>
                <div className="font-medium text-ink">{a.question}</div>
                <div className="mt-1 line-clamp-2 text-sm text-ink-mute">{a.answer.replace(/\*\*/g, '')}</div>
              </button>
              <button
                onClick={() => pinAnswer(a.id, !a.pinned)}
                className={a.pinned ? 'text-rust' : 'text-ink-faint hover:text-ink-mute'}
                title={a.pinned ? 'Unpin' : 'Pin'}
              >
                <Icon name="pin" size={17} />
              </button>
            </div>
          ))}
        </div>
      )}
    </Screen>
  )
}
