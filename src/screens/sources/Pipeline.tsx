import { Card, PageHeader, Screen } from '../../components/ui'
import { Icon, type IconName } from '../../components/icons'
import { Reveal } from '../../components/motion'
import { FeedbackQuote } from '../../components/domain'
import { useDb, useExecutiveMetrics, useSignals, useSources, useThemes } from '../../store/hooks'
import { fmtNum } from '../../lib/format'

export function Pipeline() {
  const sources = useSources()
  const db = useDb()
  const m = useExecutiveMetrics()
  const themes = useThemes({})
  const signals = useSignals({})
  const recent = [...db.feedback].sort((a, b) => b.createdISO.localeCompare(a.createdISO)).slice(0, 5)

  const stages: { icon: IconName; label: string; value: string; sub: string }[] = [
    { icon: 'plug', label: 'Sources', value: `${sources.length}`, sub: `${fmtNum(m.ingested)} items` },
    { icon: 'refresh', label: 'Ingest & dedupe', value: fmtNum(m.ingested), sub: 'normalized' },
    { icon: 'sparkles', label: 'Classify (NLP)', value: fmtNum(m.total), sub: 'sentiment + tags' },
    { icon: 'layers', label: 'Cluster themes', value: `${themes.length}`, sub: 'themes' },
    { icon: 'activity', label: 'Insights', value: `${signals.length}`, sub: 'signals raised' },
  ]

  return (
    <Screen>
      <PageHeader kicker="Sources & Ingestion" title="Ingestion pipeline" subtitle="How raw feedback becomes categorized, scored, and clustered into themes and signals." />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
        {stages.map((st, i) => (
          <Reveal key={st.label} i={i} className="flex flex-1 items-center gap-3">
            <Card className="flex-1 p-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rust-wash text-rust">
                <Icon name={st.icon} size={17} />
              </span>
              <div className="mt-3 font-display text-title leading-none text-ink">{st.value}</div>
              <div className="mt-1 text-sm font-medium text-ink">{st.label}</div>
              <div className="text-xs text-ink-mute">{st.sub}</div>
            </Card>
            {i < stages.length - 1 && (
              <Icon name="arrow-right" size={18} className="hidden shrink-0 text-rust/60 lg:block animate-[flow-x_1.8s_ease-in-out_infinite]" />
            )}
          </Reveal>
        ))}
      </div>

      <h2 className="mb-3 mt-8 font-display text-heading text-ink">Live intake</h2>
      <div className="flex flex-col gap-2.5">
        {recent.map((f) => (
          <FeedbackQuote key={f.id} item={f} compact />
        ))}
      </div>
    </Screen>
  )
}
