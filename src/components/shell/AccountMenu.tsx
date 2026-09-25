import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, cx } from '../ui'
import { Icon, type IconName } from '../icons'
import { useActions, useProfile } from '../../store/hooks'
import { useFx } from '../fx'
import { initialsFor } from '../../config/user'

export function AccountMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { reset } = useActions()
  const fx = useFx()
  const profile = useProfile()

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const go = (to: string) => {
    setOpen(false)
    navigate(to)
  }
  const Item = ({ icon, label, onClick }: { icon: IconName; label: string; onClick: () => void }) => (
    <button role="menuitem" onClick={onClick} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-paper-sunken">
      <Icon name={icon} size={15} className="text-ink-mute" />
      {label}
    </button>
  )

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className={cx('flex items-center gap-2 rounded-lg px-1 py-1 transition-colors hover:bg-paper-sunken', open && 'bg-paper-sunken')}
      >
        <Avatar initials={initialsFor(profile.name)} size={30} />
        <div className="hidden text-left leading-tight sm:block">
          <div className="text-[13px] font-semibold text-ink">{profile.name}</div>
          <div className="-mt-0.5 text-[11px] text-ink-mute">{profile.role}</div>
        </div>
        <Icon name="chevron-down" size={14} className="hidden text-ink-mute sm:block" />
      </button>

      {open && (
        <div role="menu" className="absolute right-0 z-50 mt-1 w-56 overflow-hidden rounded-xl border border-line bg-paper-raised shadow-pop animate-fade-in">
          <div className="border-b border-line px-3 py-2.5">
            <div className="text-sm font-medium text-ink">{profile.name}</div>
            <div className="text-xs text-ink-mute">{profile.email}</div>
          </div>
          <div className="py-1">
            <Item icon="users" label="Profile" onClick={() => go('/account')} />
            <Item icon="sliders" label="Settings" onClick={() => go('/settings')} />
            <Item icon="bell" label="Notifications" onClick={() => go('/notifications')} />
            <Item icon="book-open" label="Help & About" onClick={() => go('/help')} />
          </div>
          <div className="border-t border-line py-1">
            <Item icon={fx.theme === 'dark' ? 'sun' : 'moon'} label={fx.theme === 'dark' ? 'Light mode' : 'Dark mode'} onClick={() => { setOpen(false); fx.toggleTheme() }} />
            <Item icon="refresh" label="Reset demo data" onClick={() => { setOpen(false); reset(); fx.toast('Demo data reset', { icon: 'refresh', tone: 'success' }) }} />
            <Item icon="external" label="Sign out" onClick={() => { setOpen(false); fx.toast('Signed out — this is a prototype', { icon: 'external' }) }} />
          </div>
        </div>
      )}
    </div>
  )
}
