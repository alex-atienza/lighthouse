import { useRef } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { NAV, NAV_UTILITY } from '../../config/nav'
import { Icon, Logo } from '../icons'
import { cx, Pill } from '../ui'
import { useActions, useNotifications } from '../../store/hooks'
import { useFx } from '../fx'

export function Sidebar() {
  const { pathname } = useLocation()
  const activeKey = NAV.find((n) => pathname === n.to || pathname.startsWith(n.to + '/'))?.key
  const { reset } = useActions()
  const navigate = useNavigate()
  const unread = useNotifications().unread
  const fx = useFx()
  const clicks = useRef(0)
  const clickTimer = useRef<number>()
  const onBrandClick = () => {
    navigate('/ask')
    clicks.current += 1
    if (clickTimer.current) clearTimeout(clickTimer.current)
    clickTimer.current = window.setTimeout(() => (clicks.current = 0), 1200)
    if (clicks.current >= 5) {
      clicks.current = 0
      fx.sweep()
      fx.toast('The keeper waves back 🗼', { icon: 'sparkles', tone: 'success' })
    }
  }

  return (
    <aside className="flex h-screen w-[264px] shrink-0 flex-col border-r border-line bg-sidebar">
      {/* brand */}
      <button onClick={onBrandClick} className="flex select-none items-center gap-2.5 px-5 h-16 shrink-0 text-left" title="Lighthouse">
        <span className="transition-transform active:scale-90">
          <Logo size={30} />
        </span>
        <div className="leading-tight">
          <div className="font-display text-[19px] font-semibold text-ink" style={{ fontVariationSettings: "'wght' 600, 'SOFT' 40, 'WONK' 1" }}>
            Lighthouse
          </div>
          <div className="text-[11px] text-ink-mute -mt-0.5">Voice of the Customer</div>
        </div>
      </button>

      {/* nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 pt-1">
        {NAV.map((item) => {
          const active = item.key === activeKey
          return (
            <div key={item.key} className="mb-0.5">
              <NavLink
                to={item.to}
                className={cx(
                  'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  active ? 'bg-sidebar-sel text-ink font-semibold' : 'text-ink-soft hover:bg-sidebar-sel/60 font-medium',
                )}
              >
                <Icon name={item.icon} size={18} strokeWidth={active ? 2 : 1.75} />
                <span className="flex-1">{item.label}</span>
                {active && <span className="h-1.5 w-1.5 rounded-full bg-rust" />}
              </NavLink>

              {/* sub-pages appear under the active workflow */}
              {active && (
                <div className="mt-0.5 mb-1.5 ml-[26px] border-l border-line pl-3 flex flex-col gap-0.5 animate-fade-in">
                  {item.subs.map((sub) => (
                    <NavLink
                      key={sub.to}
                      to={sub.to}
                      end={sub.end}
                      className={({ isActive }) =>
                        cx(
                          'rounded-md px-2.5 py-1.5 text-[13px] transition-colors',
                          isActive ? 'text-rust font-semibold bg-rust-wash/60' : 'text-ink-mute hover:text-ink-soft',
                        )
                      }
                    >
                      {sub.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* utility */}
      <div className="border-t border-line px-3 py-2">
        {NAV_UTILITY.map((u) => (
          <NavLink
            key={u.to}
            to={u.to}
            className={({ isActive }) =>
              cx(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive ? 'bg-sidebar-sel text-ink font-semibold' : 'text-ink-soft hover:bg-sidebar-sel/60 font-medium',
              )
            }
          >
            <Icon name={u.icon} size={18} />
            <span className="flex-1">{u.label}</span>
            {u.to === '/notifications' && unread > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-rust px-1 text-[10px] font-semibold text-white">{unread}</span>
            )}
          </NavLink>
        ))}
      </div>

      {/* footer */}
      <div className="border-t border-line px-4 py-3">
        <div className="flex items-center justify-between">
          <Pill>Prototype</Pill>
          <button
            onClick={() => { reset(); fx.toast('Demo data reset', { icon: 'refresh', tone: 'success' }) }}
            className="inline-flex items-center gap-1.5 text-xs text-ink-mute hover:text-rust transition-colors"
            title="Reset demo data"
          >
            <Icon name="refresh" size={13} />
            Reset demo
          </button>
        </div>
      </div>
    </aside>
  )
}
