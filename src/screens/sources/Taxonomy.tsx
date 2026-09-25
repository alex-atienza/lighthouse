import { Link } from 'react-router-dom'
import { Card, PageHeader, Screen } from '../../components/ui'
import { SentimentDot } from '../../components/ui'
import { Icon } from '../../components/icons'
import { useThemeCategories, useThemes } from '../../store/hooks'
import { fmtNum } from '../../lib/format'

export function Taxonomy() {
  const categories = useThemeCategories()
  const themes = useThemes({ sort: 'volume' })

  return (
    <Screen>
      <PageHeader
        kicker="Sources & Ingestion"
        title="Taxonomy"
        subtitle="The category structure Lighthouse sorts feedback into. Each theme rolls up to a category."
      />
      <div className="grid gap-3 md:grid-cols-2">
        {categories.map((cat) => {
          const items = themes.filter((t) => t.category === cat)
          const mentions = items.reduce((s, t) => s + t.volume, 0)
          return (
            <Card key={cat} className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="grid" size={15} className="text-ink-mute" />
                  <span className="font-medium text-ink">{cat}</span>
                </div>
                <span className="text-xs text-ink-mute">{items.length} themes · {fmtNum(mentions)} mentions</span>
              </div>
              <div className="flex flex-col">
                {items.map((t) => (
                  <Link key={t.id} to={`/themes/${t.id}`} className="flex items-center gap-2.5 rounded-md px-2 py-1.5 -mx-2 text-sm transition-colors hover:bg-paper-sunken">
                    <SentimentDot value={t.sentiment} />
                    <span className="flex-1 truncate text-ink-soft">{t.title}</span>
                    <span className="text-xs tabular-nums text-ink-mute">{t.volume}</span>
                  </Link>
                ))}
              </div>
            </Card>
          )
        })}
      </div>
    </Screen>
  )
}
