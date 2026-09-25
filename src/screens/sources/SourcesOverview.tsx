import { useNavigate } from 'react-router-dom'
import { Button, PageHeader, Screen, StatTile } from '../../components/ui'
import { CountUp } from '../../components/motion'
import { Reveal } from '../../components/motion'
import { SourceCard } from './shared'
import { useSources } from '../../store/hooks'
import { fmtNum } from '../../lib/format'

export function SourcesOverview() {
  const sources = useSources()
  const navigate = useNavigate()
  const ingested = sources.reduce((s, x) => s + x.itemCount, 0)
  const connected = sources.filter((s) => s.status === 'connected' || s.status === 'syncing').length
  const avgCoverage = Math.round((sources.reduce((s, x) => s + x.coverage, 0) / sources.length) * 100)

  return (
    <Screen>
      <PageHeader
        kicker="Sources & Ingestion"
        title="Sources"
        subtitle="Every channel feeding Lighthouse, and how completely it's captured."
        actions={<Button variant="primary" icon="plus" onClick={() => navigate('/sources/connect')}>Connect source</Button>}
      />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Feedback ingested" value={<CountUp end={ingested} format={fmtNum} />} icon="activity" />
        <StatTile label="Connected" value={`${connected}/${sources.length}`} icon="plug" />
        <StatTile label="Avg coverage" value={<CountUp end={avgCoverage} format={(n) => `${Math.round(n)}%`} />} icon="eye" />
        <StatTile label="Needs attention" value={<CountUp end={sources.filter((s) => s.status === 'error').length} />} deltaKind="up-bad" icon="alert-triangle" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sources.map((s, i) => (
          <Reveal key={s.id} i={i}>
            <SourceCard s={s} />
          </Reveal>
        ))}
      </div>
    </Screen>
  )
}
