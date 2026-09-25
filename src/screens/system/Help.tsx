import { Link } from 'react-router-dom'
import { Card, PageHeader, Pill, Screen } from '../../components/ui'
import { Icon } from '../../components/icons'
import { NAV } from '../../config/nav'

const SHORTCUTS: { keys: string; desc: string }[] = [
  { keys: '↵', desc: 'Ask Lighthouse from the top bar' },
  { keys: 'Click', desc: 'Drill into any theme, signal, or opportunity to see its evidence' },
  { keys: 'Reset demo', desc: 'Restore the sample data anytime (sidebar footer)' },
]

export function Help() {
  return (
    <Screen width="max-w-3xl">
      <PageHeader
        kicker="Help & About"
        title="How Lighthouse works"
        subtitle="Lighthouse reads every piece of customer feedback — tickets, calls, reviews, surveys — categorizes and scores it, then turns it into answers, signals, and plans. Here’s the map."
      />

      <h2 className="mb-3 mt-8 font-display text-heading text-ink">The workflows</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {NAV.map((n) => (
          <Link key={n.key} to={n.to} className="card flex items-start gap-3 p-4 transition-shadow hover:shadow-raised">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rust-wash text-rust">
              <Icon name={n.icon} size={17} />
            </span>
            <div>
              <div className="font-medium text-ink">{n.label}</div>
              <div className="text-sm text-ink-mute">{n.blurb}</div>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="mb-3 mt-8 font-display text-heading text-ink">Tips &amp; shortcuts</h2>
      <Card className="divide-y divide-line p-2">
        {SHORTCUTS.map((s) => (
          <div key={s.desc} className="flex items-center gap-4 px-3 py-2.5">
            <kbd className="min-w-16 rounded border border-line bg-paper-sunken px-2 py-1 text-center text-xs font-medium text-ink-soft">{s.keys}</kbd>
            <span className="text-sm text-ink-soft">{s.desc}</span>
          </div>
        ))}
      </Card>
      <p className="mt-3 text-sm text-ink-mute">
        Psst — the keeper hides a light or two. Try the Konami code, or tap the lighthouse five times. 🗼
      </p>

      <h2 className="mb-3 mt-8 font-display text-heading text-ink">About this prototype</h2>
      <Card className="p-5 text-sm leading-relaxed text-ink-soft">
        Lighthouse is a front-end prototype of New Relic’s Voice-of-the-Customer engine. All data is a deterministic,
        seeded sample — there’s no backend and no live AI. Built with React, Vite, and Tailwind, with charts following a
        validated visualization method.
        <div className="mt-3">
          <Pill>v0.1.0 · Prototype</Pill>
        </div>
      </Card>
    </Screen>
  )
}
