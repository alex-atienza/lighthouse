import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, EmptyState, PageHeader, Screen, Select, TextInput, cx } from '../../components/ui'
import { Avatar } from '../../components/ui'
import { Icon } from '../../components/icons'
import { useReport } from '../../store/hooks'

export function ReportShare() {
  const { id } = useParams()
  const report = useReport(id)
  const navigate = useNavigate()
  const [recipients, setRecipients] = useState<string[]>(report?.sharedWith ?? [])
  const [draft, setDraft] = useState('')
  const [perm, setPerm] = useState<'view' | 'comment'>('view')
  const [copied, setCopied] = useState(false)

  if (!report) {
    return (
      <Screen>
        <EmptyState icon="file-text" title="Report not found" action={<Button onClick={() => navigate('/reports')}>Back to reports</Button>} />
      </Screen>
    )
  }

  const add = () => {
    if (!draft.trim()) return
    setRecipients((r) => [...new Set([...r, draft.trim()])])
    setDraft('')
  }
  const link = `https://lighthouse.newrelic.com/r/${report.id}`

  return (
    <Screen width="max-w-2xl">
      <button onClick={() => navigate(`/reports/${report.id}`)} className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-mute hover:text-rust">
        <Icon name="chevron-right" size={14} className="rotate-180" /> Back to report
      </button>
      <PageHeader kicker="Reports · Share" title={`Share "${report.title}"`} subtitle="Send this briefing to stakeholders or copy a link." />

      {/* link */}
      <Card className="mb-5 flex items-center gap-3 p-3 pl-4">
        <Icon name="external" size={16} className="shrink-0 text-ink-mute" />
        <span className="min-w-0 flex-1 truncate font-mono text-sm text-ink-soft">{link}</span>
        <Button
          size="sm"
          variant={copied ? 'primary' : 'secondary'}
          icon={copied ? 'check' : 'file-text'}
          onClick={() => {
            navigator.clipboard?.writeText(link).catch(() => {})
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          }}
        >
          {copied ? 'Copied' : 'Copy link'}
        </Button>
      </Card>

      {/* add recipient */}
      <div className="mb-2 flex items-center gap-2">
        <TextInput value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="name@company.com" />
        <Select value={perm} onChange={setPerm} className="w-32" options={[{ value: 'view', label: 'Can view' }, { value: 'comment', label: 'Can comment' }]} />
        <Button variant="primary" icon="plus" onClick={add}>Add</Button>
      </div>

      <Card className="p-2">
        {recipients.length === 0 ? (
          <div className="p-4 text-sm text-ink-mute">No one yet — add a recipient above.</div>
        ) : (
          recipients.map((r) => (
            <div key={r} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-paper-sunken">
              <Avatar initials={r.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase() || 'NR'} size={30} />
              <span className="flex-1 text-sm text-ink">{r}</span>
              <span className="text-xs text-ink-mute capitalize">{perm}</span>
              <button onClick={() => setRecipients((list) => list.filter((x) => x !== r))} className="text-ink-faint hover:text-sentiment-neg">
                <Icon name="x" size={15} />
              </button>
            </div>
          ))
        )}
      </Card>
    </Screen>
  )
}
