import { Button, Card, PageHeader, Screen, SeverityBadge, Toggle, cx } from '../../components/ui'
import { Icon, type IconName } from '../../components/icons'
import { useActions, useRules } from '../../store/hooks'
import type { Rule } from '../../data/types'

const routeIcon: Record<Rule['route'], IconName> = { slack: 'hash', email: 'mail', jira: 'external', none: 'x' }
const routeLabel: Record<Rule['route'], string> = { slack: 'Slack', email: 'Email', jira: 'Jira', none: 'No route' }

export function SignalsRules() {
  const rules = useRules()
  const { toggleRule } = useActions()
  const active = rules.filter((r) => r.enabled).length

  return (
    <Screen>
      <PageHeader
        kicker="Signals"
        title="Alert rules"
        subtitle={`${active} of ${rules.length} rules active. Rules decide what becomes a signal and where it goes.`}
        actions={<Button variant="primary" icon="plus" title="Prototype">New rule</Button>}
      />

      <div className="flex flex-col gap-2.5">
        {rules.map((r) => (
          <Card key={r.id} className={cx('flex items-center gap-4 p-4', !r.enabled && 'opacity-60')}>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-ink">{r.name}</span>
                <SeverityBadge value={r.severity} />
              </div>
              <div className="mt-0.5 font-mono text-xs text-ink-mute">{r.condition}</div>
            </div>
            <div className="hidden items-center gap-1.5 text-sm text-ink-soft sm:flex">
              <Icon name={routeIcon[r.route]} size={15} />
              {r.route === 'none' ? routeLabel[r.route] : r.routeTarget}
            </div>
            <div className="hidden w-24 text-right text-xs text-ink-mute md:block">{r.firedCount}× fired</div>
            <Toggle checked={r.enabled} onChange={() => toggleRule(r.id)} />
          </Card>
        ))}
      </div>
    </Screen>
  )
}
