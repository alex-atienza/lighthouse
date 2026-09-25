import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, PageHeader, Screen, cx } from '../../components/ui'
import { Icon } from '../../components/icons'
import { channelLabel } from './shared'
import { useSources } from '../../store/hooks'
import { useFx } from '../../components/fx'

const CATALOG = [
  { name: 'Intercom', icon: '💬', type: 'support' as const },
  { name: 'Slack', icon: '🔔', type: 'community' as const },
  { name: 'App Store', icon: '⭐', type: 'review' as const },
  { name: 'Typeform', icon: '📋', type: 'nps' as const },
  { name: 'Reddit', icon: '👾', type: 'social' as const },
  { name: 'Zoom', icon: '🎥', type: 'sales-call' as const },
  { name: 'Trustpilot', icon: '✅', type: 'review' as const },
  { name: 'Jira Service', icon: '🧰', type: 'support' as const },
]

export function Connect() {
  const sources = useSources()
  const navigate = useNavigate()
  const fx = useFx()
  const [added, setAdded] = useState<Set<string>>(new Set())

  return (
    <Screen>
      <button onClick={() => navigate('/sources')} className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-mute hover:text-rust">
        <Icon name="chevron-right" size={14} className="rotate-180" /> Sources
      </button>
      <PageHeader kicker="Sources & Ingestion" title="Connect a source" subtitle="Add a channel and Lighthouse starts categorizing its feedback automatically." />

      <div className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-mute">Connected · {sources.length}</div>
      <div className="mb-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {sources.map((s) => (
          <div key={s.id} className="flex items-center gap-3 rounded-lg border border-line bg-paper-raised p-3">
            <span className="text-xl">{s.icon}</span>
            <span className="flex-1 truncate text-sm text-ink">{s.name}</span>
            <Icon name="circle-check" size={16} className="text-sentiment-pos" />
          </div>
        ))}
      </div>

      <div className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-mute">Available</div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CATALOG.map((c) => {
          const isAdded = added.has(c.name)
          return (
            <Card key={c.name} className="flex flex-col p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-paper-sunken text-xl">{c.icon}</span>
                <div>
                  <div className="font-medium text-ink">{c.name}</div>
                  <div className="text-xs text-ink-mute">{channelLabel[c.type]}</div>
                </div>
              </div>
              <Button
                className="mt-4"
                size="sm"
                variant={isAdded ? 'secondary' : 'primary'}
                icon={isAdded ? 'check' : 'plus'}
                onClick={() => { setAdded((s) => new Set([...s, c.name])); fx.toast(`${c.name} connected — ingesting now`, { icon: 'plug', tone: 'success' }) }}
                disabled={isAdded}
              >
                {isAdded ? 'Connected' : 'Connect'}
              </Button>
            </Card>
          )
        })}
      </div>
    </Screen>
  )
}
