import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Icon, type IconName } from './icons'

interface Toast {
  id: number
  msg: string
  icon?: IconName
  tone?: 'default' | 'success'
  leaving?: boolean
}
type Theme = 'light' | 'dark'
interface FxValue {
  toast: (msg: string, opts?: { icon?: IconName; tone?: 'default' | 'success' }) => void
  sweep: () => void
  theme: Theme
  toggleTheme: () => void
}

const FxContext = createContext<FxValue | null>(null)
export function useFx(): FxValue {
  return useContext(FxContext) ?? { toast: () => {}, sweep: () => {}, theme: 'light', toggleTheme: () => {} }
}

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

export function FxProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [beam, setBeam] = useState(false)
  const idRef = useRef(0)
  const beamTimer = useRef<number>()
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  )
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      document.documentElement.classList.toggle('dark', next === 'dark')
      try {
        localStorage.setItem('lh-theme', next)
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  const toast = useCallback((msg: string, opts?: { icon?: IconName; tone?: 'default' | 'success' }) => {
    const id = ++idRef.current
    setToasts((t) => [...t, { id, msg, icon: opts?.icon, tone: opts?.tone }])
    // enter decelerates; after a beat, flag leaving so the exit accelerates out
    window.setTimeout(() => setToasts((t) => t.map((x) => (x.id === id ? { ...x, leaving: true } : x))), 2400)
  }, [])

  const sweep = useCallback(() => {
    setBeam(false)
    // next frame so the animation restarts even on rapid triggers
    requestAnimationFrame(() => {
      setBeam(true)
      if (beamTimer.current) clearTimeout(beamTimer.current)
      beamTimer.current = window.setTimeout(() => setBeam(false), 1600)
    })
  }, [])

  // Konami code easter egg
  useEffect(() => {
    let pos = 0
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      pos = key === KONAMI[pos] ? pos + 1 : key === KONAMI[0] ? 1 : 0
      if (pos === KONAMI.length) {
        pos = 0
        sweep()
        toast("You found the keeper's light 🗼", { icon: 'sparkles', tone: 'success' })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sweep, toast])

  const value = useMemo(() => ({ toast, sweep, theme, toggleTheme }), [toast, sweep, theme, toggleTheme])

  return (
    <FxContext.Provider value={value}>
      {children}

      {/* lighthouse beam sweep */}
      {beam && (
        <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
          <div
            className="absolute -top-1/2 left-0 h-[200%] w-2/5"
            style={{
              background: 'linear-gradient(100deg, transparent, rgba(180,69,31,.16) 40%, rgba(201,162,39,.30) 55%, rgba(255,255,255,.20) 62%, transparent)',
              filter: 'blur(10px)',
              animation: 'beam-sweep 1.5s ease-in-out',
            }}
          />
        </div>
      )}

      {/* toasts */}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[70] flex flex-col items-end gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            onAnimationEnd={() => t.leaving && setToasts((list) => list.filter((x) => x.id !== t.id))}
            className="pointer-events-auto flex items-center gap-2.5 rounded-lg bg-ink px-3.5 py-2.5 text-paper shadow-pop"
            style={{ animation: t.leaving ? 'toast-out .18s cubic-bezier(.4,0,1,1) both' : 'toast-in .3s cubic-bezier(.2,.7,.3,1) both' }}
          >
            {t.icon && <Icon name={t.icon} size={16} className={t.tone === 'success' ? 'text-sentiment-pos' : 'text-rust'} />}
            <span className="text-sm">{t.msg}</span>
          </div>
        ))}
      </div>
    </FxContext.Provider>
  )
}
