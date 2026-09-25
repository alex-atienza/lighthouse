import { useState } from 'react'
import { PageHeader, Screen, Select, StatTile, cx } from '../../components/ui'
import { CountUp } from '../../components/motion'
import { SignalRow } from './shared'
import { useSignals } from '../../store/hooks'
import type { Severity, SignalStatus, SignalType } from '../../data/types'

export function SignalsFeed() {
  const [status, setStatus] = useState<'all' | SignalStatus>('all')
  const [severity, setSeverity] = useState<'all' | Severity>('all')
  const [type, setType] = useState<'all' | SignalType>('all')

  const all = useSignals({})
  const signals = useSignals({
    status: status === 'all' ? undefined : status,
    severity: severity === 'all' ? undefined : severity,
    type: type === 'all' ? undefined : type,
  })

  const newCount = all.filter((s) => s.status === 'new').length
  const critical = all.filter((s) => s.severity === 'critical' && s.status !== 'resolved').length
  const churn = all.filter((s) => s.type === 'churn-risk').length

  const statuses: Array<'all' | SignalStatus> = ['all', 'new', 'acknowledged', 'routed', 'resolved']

  return (
    <Screen>
      <PageHeader kicker="Signals" title="Signal feed" subtitle="Notable changes Lighthouse surfaced from the feedback stream." />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="New" value={<CountUp end={newCount} />} icon="bell" hint="need triage" />
        <StatTile label="Critical open" value={<CountUp end={critical} />} deltaKind="up-bad" icon="alert-triangle" />
        <StatTile label="Churn-risk" value={<CountUp end={churn} />} icon="trending-down" hint="accounts flagged" />
        <StatTile label="Total signals" value={<CountUp end={all.length} />} icon="activity" />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-line bg-paper-raised p-1">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={cx(
                'rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors',
                status === s ? 'bg-ink text-paper' : 'text-ink-mute hover:text-ink',
              )}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
        <Select
          value={severity}
          onChange={setSeverity}
          className="w-36"
          options={[
            { value: 'all', label: 'All severity' },
            { value: 'critical', label: 'Critical' },
            { value: 'high', label: 'High' },
            { value: 'medium', label: 'Medium' },
            { value: 'low', label: 'Low' },
          ]}
        />
        <Select
          value={type}
          onChange={setType}
          className="w-44"
          options={[
            { value: 'all', label: 'All types' },
            { value: 'churn-risk', label: 'Churn risk' },
            { value: 'spike', label: 'Spike' },
            { value: 'emerging-theme', label: 'Emerging theme' },
            { value: 'sentiment-drop', label: 'Sentiment drop' },
            { value: 'competitor-mention', label: 'Competitor mention' },
          ]}
        />
        <span className="ml-auto text-sm text-ink-mute">{signals.length} shown</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {signals.map((s) => (
          <SignalRow key={s.id} signal={s} />
        ))}
      </div>
    </Screen>
  )
}
