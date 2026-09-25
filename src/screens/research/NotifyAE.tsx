import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Avatar, Button, Card, EmptyState, Screen, TextInput } from '../../components/ui'
import { Icon } from '../../components/icons'
import { findAccount, findTheme, useActions, useCandidate, useDb } from '../../store/hooks'

export function NotifyAE() {
  const { id } = useParams()
  const c = useCandidate(id)
  const db = useDb()
  const navigate = useNavigate()
  const { setCandidateStatus } = useActions()
  const acc = findAccount(db, c?.accountId)
  const theme = findTheme(db, c?.themeIds[0])

  const [subject, setSubject] = useState(acc ? `Research opportunity: ${acc.name}` : 'Research opportunity')
  const [body, setBody] = useState(
    c && acc
      ? `Hi ${c.assignedAE.split(' ')[0]},\n\nLighthouse flagged ${acc.name} (${acc.segment}, ${c.persona}) as a strong research candidate — ${c.reason}${theme ? ` It ties directly to the "${theme.title}" theme.` : ''}\n\nCould you help set up a 30-minute conversation? I'll prep the discussion guide.\n\nThanks!`
      : '',
  )
  const [sent, setSent] = useState(false)

  if (!c) {
    return (
      <Screen>
        <EmptyState icon="users" title="Candidate not found" action={<Button onClick={() => navigate('/research')}>Back to pipeline</Button>} />
      </Screen>
    )
  }

  if (sent) {
    return (
      <Screen width="max-w-xl">
        <div className="flex flex-col items-center py-20 text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sentiment-pos-tint text-sentiment-pos">
            <Icon name="circle-check" size={28} />
          </span>
          <h1 className="font-display text-title text-ink">Sent to {c.assignedAE}</h1>
          <p className="mt-2 text-sm text-ink-mute">{acc?.name} has been moved to <span className="font-medium">Invited</span> in the pipeline.</p>
          <div className="mt-5 flex gap-2">
            <Button variant="primary" onClick={() => navigate('/research')}>Back to pipeline</Button>
            <Button variant="secondary" onClick={() => navigate(`/research/${c.id}`)}>View candidate</Button>
          </div>
        </div>
      </Screen>
    )
  }

  return (
    <Screen width="max-w-2xl">
      <button onClick={() => navigate(`/research/${c.id}`)} className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-mute hover:text-rust">
        <Icon name="chevron-right" size={14} className="rotate-180" /> Back to candidate
      </button>
      <div className="text-xs font-semibold uppercase tracking-wider text-rust mb-2">Research & Outreach</div>
      <h1 className="font-display text-title text-ink">Notify the account team</h1>

      <Card className="mt-5 p-5">
        <div className="mb-4 flex items-center gap-3 border-b border-line pb-4">
          <span className="text-xs uppercase tracking-wide text-ink-mute">To</span>
          <div className="flex items-center gap-2">
            <Avatar initials={c.assignedAE.split(' ').map((w) => w[0]).join('')} size={26} />
            <span className="text-sm font-medium text-ink">{c.assignedAE}</span>
            <span className="text-xs text-ink-mute">· Account Executive</span>
          </div>
        </div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-mute">Subject</label>
        <TextInput value={subject} onChange={(e) => setSubject(e.target.value)} className="mb-4" />
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-mute">Message</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={9}
          className="w-full resize-none rounded-lg border border-line bg-paper px-3 py-2 text-sm leading-relaxed text-ink focus:outline-none focus:ring-2 focus:ring-rust/25"
        />
        <div className="mt-4 flex items-center gap-2">
          <Button variant="primary" icon="send" onClick={() => { setCandidateStatus(c.id, 'invited'); setSent(true) }}>
            Send to {c.assignedAE.split(' ')[0]}
          </Button>
          <Button variant="ghost" onClick={() => navigate(`/research/${c.id}`)}>Cancel</Button>
        </div>
      </Card>
    </Screen>
  )
}
