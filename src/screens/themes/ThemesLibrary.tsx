import { useState } from 'react'
import { PageHeader, Screen, cx } from '../../components/ui'
import { ThemeCard } from '../../components/domain'
import { useThemeCategories, useThemes } from '../../store/hooks'

export function ThemesLibrary() {
  const categories = useThemeCategories()
  const themes = useThemes({ sort: 'impact' })
  const [active, setActive] = useState<'all' | string>('all')
  const shown = active === 'all' ? themes : themes.filter((t) => t.category === active)

  return (
    <Screen>
      <PageHeader kicker="Themes" title="Library" subtitle="Every theme, organized by your feedback taxonomy." />
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* taxonomy rail */}
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setActive('all')}
            className={cx(
              'flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
              active === 'all' ? 'bg-sidebar-sel font-semibold text-ink' : 'text-ink-soft hover:bg-paper-sunken',
            )}
          >
            All themes <span className="text-xs text-ink-mute">{themes.length}</span>
          </button>
          {categories.map((c) => {
            const count = themes.filter((t) => t.category === c).length
            return (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={cx(
                  'flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
                  active === c ? 'bg-sidebar-sel font-semibold text-ink' : 'text-ink-soft hover:bg-paper-sunken',
                )}
              >
                <span className="truncate pr-2 text-left">{c}</span>
                <span className="text-xs text-ink-mute">{count}</span>
              </button>
            )
          })}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {shown.map((t) => (
            <ThemeCard key={t.id} theme={t} />
          ))}
        </div>
      </div>
    </Screen>
  )
}
