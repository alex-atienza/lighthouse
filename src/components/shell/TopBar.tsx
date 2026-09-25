import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../icons'
import { AccountMenu } from './AccountMenu'
import { useNotifications } from '../../store/hooks'
import { useFx } from '../fx'

export function TopBar() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const unread = useNotifications().unread
  const fx = useFx()

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!q.trim()) return
    navigate(`/ask/answer?q=${encodeURIComponent(q.trim())}`)
    setQ('')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-line bg-paper/85 px-6 backdrop-blur">
      <form onSubmit={submit} className="relative w-full max-w-xl">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-rust">
          <Icon name="sparkles" size={16} />
        </span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Ask Lighthouse"
          placeholder="Ask Lighthouse anything about your customers…"
          className="w-full rounded-lg border border-line bg-paper-raised pl-9 pr-16 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-rust/25 focus:border-rust/40"
        />
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-line bg-paper-sunken px-1.5 py-0.5 text-[10px] font-medium text-ink-mute">
          ↵
        </kbd>
      </form>

      <div className="ml-auto flex items-center gap-3">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('lh:command'))}
          className="hidden items-center gap-1.5 rounded-lg border border-line bg-paper-raised px-2.5 py-1.5 text-xs text-ink-mute transition-colors hover:border-line-strong hover:text-ink sm:flex"
          aria-label="Open command palette"
        >
          <Icon name="search" size={13} />
          <kbd className="font-sans">⌘K</kbd>
        </button>
        <button
          onClick={() => fx.toggleTheme()}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-paper-sunken"
          aria-label="Toggle theme"
          title="Toggle light / dark"
        >
          <Icon name={fx.theme === 'dark' ? 'sun' : 'moon'} size={18} />
        </button>
        <button
          onClick={() => navigate('/notifications')}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft hover:bg-paper-sunken transition-colors"
          aria-label="Notifications"
          title="Notifications"
        >
          <Icon name="bell" size={18} />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rust px-1 text-[10px] font-semibold text-white">
              {unread}
            </span>
          )}
        </button>
        <div className="h-6 w-px bg-line" />
        <AccountMenu />
      </div>
    </header>
  )
}
