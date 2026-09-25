import { useNavigate } from 'react-router-dom'
import { Button, Card, PageHeader, Screen, cx } from '../../components/ui'
import { Icon, type IconName } from '../../components/icons'
import { useReports } from '../../store/hooks'
import { fmtDate } from '../../lib/format'
import type { Report } from '../../data/types'

const audienceIcon: Record<Report['audience'], IconName> = {
  Executive: 'compass',
  Product: 'target',
  CS: 'users',
  Board: 'file-text',
}
const statusStyle: Record<Report['status'], string> = {
  ready: 'bg-sentiment-pos-tint text-sentiment-pos',
  generating: 'bg-rust-wash text-rust-dark',
  draft: 'bg-paper-sunken text-ink-mute',
}

export function ReportsOverview() {
  const reports = useReports()
  const navigate = useNavigate()

  return (
    <Screen>
      <PageHeader
        kicker="Reports"
        title="Reports"
        subtitle="Shareable, sourced briefings — generated from live feedback, ready for any audience."
        actions={<Button variant="primary" icon="plus" onClick={() => navigate('/reports/builder')}>New report</Button>}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <button
            key={r.id}
            onClick={() => navigate(r.status === 'draft' ? '/reports/builder' : `/reports/${r.id}`)}
            className="card flex flex-col p-5 text-left transition-shadow hover:shadow-raised"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-paper-sunken text-ink-soft">
                <Icon name={audienceIcon[r.audience]} size={17} />
              </span>
              <span className={cx('pill capitalize', statusStyle[r.status])}>
                {r.status === 'generating' && <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-current" />}
                {r.status}
              </span>
            </div>
            <div className="font-display text-[17px] leading-snug text-ink">{r.title}</div>
            <div className="mt-1 text-sm text-ink-mute">{r.period} · {r.audience}</div>
            <div className="mt-4 flex items-center gap-2 text-xs text-ink-mute">
              <span>{fmtDate(r.createdISO)}</span>
              {r.sharedWith.length > 0 && (
                <>
                  <span className="text-ink-faint">·</span>
                  <span className="inline-flex items-center gap-1"><Icon name="users" size={12} /> {r.sharedWith.length}</span>
                </>
              )}
            </div>
          </button>
        ))}
      </div>
    </Screen>
  )
}
