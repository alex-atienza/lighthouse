import { useLocation } from 'react-router-dom'
import { NAV } from '../config/nav'
import { Card, PageHeader, Screen } from '../components/ui'
import { Icon } from '../components/icons'
import { titleCase } from '../lib/format'

// Path-aware placeholder for screens not yet built. Nav, data, and shell are
// live; this keeps every route reachable and labelled while views land.
export function Placeholder() {
  const { pathname } = useLocation()
  const item = NAV.find((n) => pathname === n.to || pathname.startsWith(n.to + '/'))
  const sub = item?.subs.find((s) => s.to === pathname)
  const seg = pathname.split('/').filter(Boolean).pop() ?? ''
  const title = sub?.label ?? titleCase(seg.replace(/-/g, ' '))

  return (
    <Screen>
      <PageHeader kicker={item?.label} title={title} subtitle={item?.blurb} />
      <Card className="flex flex-col items-center gap-3 p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rust-wash text-rust">
          <Icon name={item?.icon ?? 'sparkles'} size={24} />
        </div>
        <div className="font-display text-heading text-ink">This screen is being built</div>
        <p className="max-w-md text-sm text-ink-mute">
          “{title}” is part of the {item?.label} workflow. The shell, data model, and navigation are already live —
          this view’s layout is coming next.
        </p>
      </Card>
    </Screen>
  )
}
