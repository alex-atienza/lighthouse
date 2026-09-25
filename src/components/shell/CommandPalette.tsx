import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NAV, NAV_UTILITY } from '../../config/nav'
import { Icon, type IconName } from '../icons'
import { cx } from '../ui'
import { useActions } from '../../store/hooks'
import { useFx } from '../fx'

type Group = 'Workflows' | 'Go to' | 'Actions'
interface Command {
  id: string
  label: string
  hint?: string
  icon: IconName
  group: Group
  keywords?: string
  run: () => void
}

// subsequence + prefix scoring; higher is better, -1 = no match
function score(label: string, kw: string, q: string): number {
  if (!q) return 0
  const s = q.toLowerCase()
  const l = label.toLowerCase()
  const idx = l.indexOf(s)
  if (idx === 0) return 4
  if (idx > 0) return 3
  if ((kw || '').toLowerCase().includes(s)) return 2
  let i = 0
  for (const ch of l) {
    if (ch === s[i]) i++
    if (i === s.length) return 1
  }
  return -1
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const navigate = useNavigate()
  const { reset } = useActions()
  const fx = useFx()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const commands = useMemo<Command[]>(() => {
    const go = (to: string) => () => navigate(to)
    const cmds: Command[] = []
    NAV.forEach((n) => cmds.push({ id: `wf-${n.key}`, label: n.label, hint: n.blurb, icon: n.icon, group: 'Workflows', keywords: n.blurb, run: go(n.to) }))
    NAV.forEach((n) =>
      n.subs.forEach((s) =>
        cmds.push({ id: `nav-${s.to}`, label: `${n.label} · ${s.label}`, icon: n.icon, group: 'Go to', keywords: `${n.label} ${s.label}`, run: go(s.to) }),
      ),
    )
    NAV_UTILITY.forEach((u) => cmds.push({ id: `util-${u.to}`, label: u.label, icon: u.icon, group: 'Go to', run: go(u.to) }))
    cmds.push({ id: 'nav-account', label: 'Account', icon: 'users', group: 'Go to', run: go('/account') })
    cmds.push({ id: 'act-ask', label: 'Ask Lighthouse a question', icon: 'sparkles', group: 'Actions', keywords: 'search query question', run: go('/ask') })
    cmds.push({ id: 'act-report', label: 'Build a report', icon: 'file-text', group: 'Actions', run: go('/reports/builder') })
    cmds.push({ id: 'act-theme', label: 'Toggle dark mode', icon: 'moon', group: 'Actions', keywords: 'theme night light dark appearance', run: () => fx.toggleTheme() })
    cmds.push({ id: 'act-reset', label: 'Reset demo data', icon: 'refresh', group: 'Actions', run: () => { reset(); fx.toast('Demo data reset', { icon: 'refresh', tone: 'success' }) } })
    cmds.push({ id: 'act-beam', label: 'Light the beam', icon: 'sparkles', group: 'Actions', keywords: 'lighthouse easter egg', run: () => fx.sweep() })
    return cmds
  }, [navigate, reset, fx])

  // open via ⌘K / Ctrl+K, and a custom event other chrome can dispatch
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('lh:command', onOpen as EventListener)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('lh:command', onOpen as EventListener)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setQ('')
      setSel(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  // filtered + grouped
  const results = useMemo(() => {
    const scored = commands
      .map((c) => ({ c, s: score(c.label, c.keywords ?? '', q) }))
      .filter((x) => x.s >= (q ? 1 : 0))
    if (q) scored.sort((a, b) => b.s - a.s)
    const ask: Command | null =
      q.trim().length > 1
        ? { id: 'ask-query', label: `Ask: “${q.trim()}”`, icon: 'sparkles', group: 'Actions', run: () => navigate(`/ask/answer?q=${encodeURIComponent(q.trim())}`) }
        : null
    const flat = [...(ask ? [ask] : []), ...scored.map((x) => x.c)]
    return flat.slice(0, 12)
  }, [commands, q, navigate])

  useEffect(() => setSel(0), [q])
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-i="${sel}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [sel])

  if (!open) return null
  const exec = (c: Command) => {
    setOpen(false)
    c.run()
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false)
    else if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); results[sel] && exec(results[sel]) }
  }

  // group headers (only when not searching)
  let lastGroup: string | null = null

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="absolute inset-0 bg-ink/25 backdrop-blur-[2px]" style={{ animation: 'fade-in .15s ease both' }} onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-paper-raised shadow-pop" style={{ animation: 'fade-in .22s cubic-bezier(.2,.8,.2,1) both' }}>
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Icon name="search" size={18} className="shrink-0 text-ink-mute" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search or jump to…"
            aria-label="Command search"
            className="w-full bg-transparent py-4 text-[15px] text-ink placeholder:text-ink-faint focus:outline-none"
          />
          <kbd className="shrink-0 rounded border border-line bg-paper-sunken px-1.5 py-0.5 text-[10px] font-medium text-ink-mute">esc</kbd>
        </div>

        <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 && <div className="px-3 py-8 text-center text-sm text-ink-mute">No matches for “{q}”.</div>}
          {results.map((c, i) => {
            const header = !q && c.group !== lastGroup ? ((lastGroup = c.group)) : null
            return (
              <div key={c.id}>
                {header && <div className="px-2 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wide text-ink-faint">{header}</div>}
                <button
                  data-i={i}
                  onMouseMove={() => setSel(i)}
                  onClick={() => exec(c)}
                  className={cx(
                    'flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors',
                    i === sel ? 'bg-sidebar-sel' : 'hover:bg-paper-sunken',
                  )}
                >
                  <span className={cx('flex h-7 w-7 shrink-0 items-center justify-center rounded-md', i === sel ? 'bg-rust text-white' : 'bg-paper-sunken text-ink-soft')}>
                    <Icon name={c.icon} size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-ink">{c.label}</span>
                    {c.hint && <span className="block truncate text-xs text-ink-mute">{c.hint}</span>}
                  </span>
                  {i === sel && <Icon name="arrow-right" size={14} className="shrink-0 text-ink-mute" />}
                </button>
              </div>
            )
          })}
        </div>

        <div className="flex items-center gap-3 border-t border-line px-4 py-2 text-[11px] text-ink-mute">
          <span className="inline-flex items-center gap-1"><kbd className="rounded border border-line bg-paper-sunken px-1">↑</kbd><kbd className="rounded border border-line bg-paper-sunken px-1">↓</kbd> navigate</span>
          <span className="inline-flex items-center gap-1"><kbd className="rounded border border-line bg-paper-sunken px-1">↵</kbd> open</span>
          <span className="ml-auto inline-flex items-center gap-1">Lighthouse Command</span>
        </div>
      </div>
    </div>
  )
}
