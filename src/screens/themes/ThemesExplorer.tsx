import { useState } from 'react'
import { Button, EmptyState, PageHeader, Screen, SearchInput, Select, cx } from '../../components/ui'
import { ThemeCard } from '../../components/domain'
import { Reveal } from '../../components/motion'
import { useThemeCategories, useThemes, type ThemeSort } from '../../store/hooks'
import type { SentimentLabel } from '../../data/types'

export function ThemesExplorer() {
  const categories = useThemeCategories()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<'all' | string>('all')
  const [sentiment, setSentiment] = useState<'all' | SentimentLabel>('all')
  const [sort, setSort] = useState<ThemeSort>('impact')

  const themes = useThemes({
    search: search || undefined,
    category: category === 'all' ? undefined : category,
    sentiment: sentiment === 'all' ? undefined : sentiment,
    sort,
  })
  const all = useThemes({})
  const negative = all.filter((t) => t.sentiment === 'negative').length
  const emerging = all.filter((t) => t.trend === 'emerging').length

  const sentiments: Array<'all' | SentimentLabel> = ['all', 'negative', 'neutral', 'positive']

  return (
    <Screen>
      <PageHeader
        kicker="Themes"
        title="Theme explorer"
        subtitle={`${all.length} themes tracked · ${negative} trending negative · ${emerging} emerging`}
      />

      {/* controls */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search themes…" className="w-64" />
        <div className="flex items-center gap-1 rounded-lg border border-line bg-paper-raised p-1">
          {sentiments.map((s) => (
            <button
              key={s}
              onClick={() => setSentiment(s)}
              className={cx(
                'rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors',
                sentiment === s ? 'bg-ink text-paper' : 'text-ink-mute hover:text-ink',
              )}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
        <Select
          value={category}
          onChange={setCategory}
          className="w-48"
          options={[{ value: 'all', label: 'All categories' }, ...categories.map((c) => ({ value: c, label: c }))]}
        />
        <Select
          value={sort}
          onChange={setSort}
          className="w-40"
          options={[
            { value: 'impact', label: 'Sort: Impact' },
            { value: 'volume', label: 'Sort: Volume' },
            { value: 'trend', label: 'Sort: Fastest growing' },
            { value: 'recent', label: 'Sort: Newest' },
          ]}
        />
        <span className="ml-auto text-sm text-ink-mute">{themes.length} themes</span>
      </div>

      {themes.length === 0 ? (
        <EmptyState
          title="No themes match"
          body="Try widening your filters or clearing the search."
          action={
            <Button variant="secondary" onClick={() => { setSearch(''); setCategory('all'); setSentiment('all') }}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {themes.map((t, i) => (
            <Reveal key={t.id} i={i}>
              <ThemeCard theme={t} />
            </Reveal>
          ))}
        </div>
      )}
    </Screen>
  )
}
