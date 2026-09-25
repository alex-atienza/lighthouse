import { useNavigate } from 'react-router-dom'
import { Button, EmptyState, PageHeader, Screen, cx } from '../../components/ui'
import { Icon } from '../../components/icons'
import { useActions, useNotifications, type NotifItem } from '../../store/hooks'
import { relTime } from '../../lib/format'

const NOW = Date.parse('2026-08-05T12:00:00Z')

export function Notifications() {
  const navigate = useNavigate()
  const { items, readSet, unread } = useNotifications()
  const { markNotificationRead, markNotificationsRead } = useActions()

  const open = (n: NotifItem) => {
    markNotificationRead(n.id)
    navigate(n.to)
  }
  const today = items.filter((i) => NOW - Date.parse(i.iso) < 86_400_000)
  const earlier = items.filter((i) => NOW - Date.parse(i.iso) >= 86_400_000)

  const Row = (n: NotifItem) => {
    const isRead = readSet.has(n.id)
    return (
      <button key={n.id} onClick={() => open(n)} className="card flex w-full items-start gap-3 p-4 text-left transition-shadow hover:shadow-raised">
        <span className={cx('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', isRead ? 'bg-paper-sunken text-ink-mute' : 'bg-rust-wash text-rust')}>
          <Icon name={n.icon} size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {!isRead && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rust" />}
            <span className={cx('truncate', isRead ? 'text-ink-soft' : 'font-medium text-ink')}>{n.title}</span>
          </div>
          <div className="mt-0.5 line-clamp-1 text-sm text-ink-mute">{n.detail}</div>
        </div>
        <span className="shrink-0 text-xs text-ink-mute">{relTime(n.iso)}</span>
      </button>
    )
  }

  return (
    <Screen width="max-w-3xl">
      <PageHeader
        title="Notifications"
        subtitle={unread ? `${unread} unread` : 'You’re all caught up.'}
        actions={unread > 0 ? <Button variant="secondary" icon="check" onClick={() => markNotificationsRead(items.map((i) => i.id))}>Mark all read</Button> : undefined}
      />
      {items.length === 0 ? (
        <EmptyState icon="bell" title="Nothing new" body="Signals, reports, and research updates will show up here." />
      ) : (
        <div className="flex flex-col gap-6">
          {today.length > 0 && (
            <div>
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-mute">Today</div>
              <div className="flex flex-col gap-2.5">{today.map(Row)}</div>
            </div>
          )}
          {earlier.length > 0 && (
            <div>
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-mute">Earlier</div>
              <div className="flex flex-col gap-2.5">{earlier.map(Row)}</div>
            </div>
          )}
        </div>
      )}
    </Screen>
  )
}
