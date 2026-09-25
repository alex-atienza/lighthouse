import { useMemo, useState } from 'react'
import { Button, Card, PageHeader, Screen, cx } from '../../components/ui'
import { Icon } from '../../components/icons'
import { OppStatusPill } from './shared'
import { useOpportunities } from '../../store/hooks'
import { useFx } from '../../components/fx'

export function JiraSync() {
  const opps = useOpportunities()
  const fx = useFx()
  const [extra, setExtra] = useState<Record<string, string>>({})
  const [nextNum, setNextNum] = useState(1300)

  const keyFor = (id: string, seeded?: string) => seeded ?? extra[id]
  const unsynced = opps.filter((o) => !keyFor(o.id, o.jiraKey))

  const syncOne = (id: string) => {
    setExtra((e) => ({ ...e, [id]: `NR-${nextNum}` }))
    setNextNum((n) => n + 1)
    fx.toast(`Created NR-${nextNum} in Jira`, { icon: 'external', tone: 'success' })
  }
  const syncAll = () => {
    let n = nextNum
    const add: Record<string, string> = {}
    unsynced.forEach((o) => {
      add[o.id] = `NR-${n}`
      n += 1
    })
    setExtra((e) => ({ ...e, ...add }))
    setNextNum(n)
    fx.toast(`Synced ${unsynced.length} opportunities to Jira`, { icon: 'external', tone: 'success' })
  }

  const syncedCount = useMemo(() => opps.filter((o) => keyFor(o.id, o.jiraKey)).length, [opps, extra])

  return (
    <Screen>
      <PageHeader
        kicker="Prioritize & Plan"
        title="Jira sync"
        subtitle={`${syncedCount} of ${opps.length} opportunities are tracked in Jira.`}
        actions={<Button variant="primary" icon="external" onClick={syncAll} disabled={unsynced.length === 0}>Sync all ({unsynced.length})</Button>}
      />
      <div className="flex flex-col gap-2.5">
        {opps.map((o) => {
          const key = keyFor(o.id, o.jiraKey)
          return (
            <Card key={o.id} className="flex items-center gap-4 p-4">
              <span className={cx('flex h-8 w-8 items-center justify-center rounded-lg', key ? 'bg-sentiment-pos-tint text-sentiment-pos' : 'bg-paper-sunken text-ink-mute')}>
                <Icon name={key ? 'circle-check' : 'external'} size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-ink">{o.title}</div>
                <div className="flex items-center gap-2 text-xs text-ink-mute">
                  <OppStatusPill status={o.status} />
                  <span>{o.owner}</span>
                </div>
              </div>
              {key ? (
                <span className="font-mono text-xs text-ink-soft">{key}</span>
              ) : (
                <Button size="sm" variant="secondary" icon="external" onClick={() => syncOne(o.id)}>
                  Sync
                </Button>
              )}
            </Card>
          )
        })}
      </div>
    </Screen>
  )
}
