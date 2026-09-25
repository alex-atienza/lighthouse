import type { Channel, Source } from '../../data/types'
import { Button, Meter, cx } from '../../components/ui'
import { Icon } from '../../components/icons'
import { useActions } from '../../store/hooks'
import { useFx } from '../../components/fx'
import { fmtNum, relTime } from '../../lib/format'

export const channelLabel: Record<Channel, string> = {
  support: 'Support tickets', 'sales-call': 'Sales calls', nps: 'NPS & surveys', review: 'Public reviews',
  community: 'Community', 'in-app': 'In-app', 'csm-note': 'CS notes', social: 'Social',
}

export const srcStatusMeta: Record<Source['status'], { label: string; cls: string; dot: string }> = {
  connected: { label: 'Connected', cls: 'bg-sentiment-pos-tint text-sentiment-pos', dot: 'bg-sentiment-pos' },
  syncing: { label: 'Syncing', cls: 'bg-rust-wash text-rust-dark', dot: 'bg-rust animate-pulse' },
  error: { label: 'Error', cls: 'bg-sentiment-neg-tint text-sentiment-neg', dot: 'bg-sentiment-neg' },
  paused: { label: 'Paused', cls: 'bg-paper-sunken text-ink-mute', dot: 'bg-ink-faint' },
}

export function SourceCard({ s }: { s: Source }) {
  const { setSourceStatus } = useActions()
  const fx = useFx()
  const meta = srcStatusMeta[s.status]
  return (
    <div className="card flex flex-col p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-paper-sunken text-xl">{s.icon}</span>
          <div>
            <div className="font-medium text-ink">{s.name}</div>
            <div className="text-xs text-ink-mute">{channelLabel[s.type]}</div>
          </div>
        </div>
        <span className={cx('pill', meta.cls)}>
          <span className={cx('mr-1 inline-block h-1.5 w-1.5 rounded-full', meta.dot)} />
          {meta.label}
        </span>
      </div>

      <p className="mt-3 text-[13px] text-ink-mute">{s.description}</p>

      <div className="mt-4 flex items-center justify-between text-xs text-ink-mute">
        <span>{fmtNum(s.itemCount)} items</span>
        <span>updated {relTime(s.lastSyncISO)}</span>
      </div>
      <div className="mt-2">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-ink-mute">Coverage</span>
          <span className="font-medium text-ink">{Math.round(s.coverage * 100)}%</span>
        </div>
        <Meter value={s.coverage * 100} />
      </div>

      <div className="mt-4 flex items-center gap-2">
        {s.status === 'connected' && <Button size="sm" variant="ghost" icon="x" onClick={() => { setSourceStatus(s.id, 'paused'); fx.toast(`${s.name} paused`, { icon: 'x' }) }}>Pause</Button>}
        {s.status === 'paused' && <Button size="sm" variant="secondary" icon="refresh" onClick={() => { setSourceStatus(s.id, 'connected'); fx.toast(`${s.name} resumed`, { icon: 'refresh', tone: 'success' }) }}>Resume</Button>}
        {s.status === 'error' && <Button size="sm" variant="secondary" icon="refresh" onClick={() => { setSourceStatus(s.id, 'connected'); fx.toast(`${s.name} reconnected`, { icon: 'circle-check', tone: 'success' }) }}>Retry</Button>}
        {s.status === 'syncing' && <span className="inline-flex items-center gap-1.5 text-xs text-ink-mute"><Icon name="refresh" size={13} className="animate-spin" /> syncing…</span>}
      </div>
    </div>
  )
}
