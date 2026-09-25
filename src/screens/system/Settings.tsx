import { useState, type ReactNode } from 'react'
import { Button, Card, PageHeader, Pill, Screen, Select, TextInput, Toggle } from '../../components/ui'
import { useActions, useProfile } from '../../store/hooks'
import { useFx } from '../../components/fx'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="p-5">
      <div className="mb-1 text-sm font-semibold text-ink">{title}</div>
      <div className="divide-y divide-line">{children}</div>
    </Card>
  )
}
function Row({ title, desc, children }: { title: string; desc?: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <div className="text-sm font-medium text-ink">{title}</div>
        {desc && <div className="text-xs text-ink-mute">{desc}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

export function Settings() {
  const { reset, updateProfile } = useActions()
  const fx = useFx()
  const profile = useProfile()
  const [form, setForm] = useState({ name: profile.name, email: profile.email, role: profile.role })
  const [prefs, setPrefs] = useState({ critical: true, weekly: true, competitor: false, emerging: true })
  const [autoRoute, setAutoRoute] = useState(true)
  const [threshold, setThreshold] = useState<'20' | '30' | '40'>('20')
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable')
  const set = (k: keyof typeof prefs) => (v: boolean) => setPrefs((p) => ({ ...p, [k]: v }))

  return (
    <Screen width="max-w-3xl">
      <PageHeader title="Settings" subtitle="Tune Lighthouse to how your team works." />
      <div className="flex flex-col gap-4">
        <Section title="Profile">
          <Row title="Name">
            <TextInput value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-56" aria-label="Name" />
          </Row>
          <Row title="Email">
            <TextInput value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-56" aria-label="Email" />
          </Row>
          <Row title="Role">
            <TextInput value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className="w-56" aria-label="Role" />
          </Row>
          <div className="pt-3">
            <Button variant="primary" icon="check" onClick={() => { updateProfile(form); fx.toast('Profile saved', { icon: 'check', tone: 'success' }) }}>
              Save changes
            </Button>
          </div>
        </Section>

        <Section title="Notifications">
          <Row title="Critical signal alerts" desc="Get notified the moment a critical signal fires.">
            <Toggle checked={prefs.critical} onChange={set('critical')} label="Critical signal alerts" />
          </Row>
          <Row title="Weekly digest email" desc="A Monday summary of what moved.">
            <Toggle checked={prefs.weekly} onChange={set('weekly')} label="Weekly digest email" />
          </Row>
          <Row title="Competitor mentions" desc="Alert when a competitor is named in feedback.">
            <Toggle checked={prefs.competitor} onChange={set('competitor')} label="Competitor mentions" />
          </Row>
          <Row title="New emerging themes">
            <Toggle checked={prefs.emerging} onChange={set('emerging')} label="New emerging themes" />
          </Row>
        </Section>

        <Section title="Alerting defaults">
          <Row title="Sentiment-drop threshold" desc="Raise a signal when sentiment falls by more than this.">
            <Select value={threshold} onChange={setThreshold} className="w-28" ariaLabel="Sentiment-drop threshold" options={[{ value: '20', label: '20%' }, { value: '30', label: '30%' }, { value: '40', label: '40%' }]} />
          </Row>
          <Row title="Auto-route critical to CS" desc="Hand critical churn-risk signals straight to the account team.">
            <Toggle checked={autoRoute} onChange={setAutoRoute} label="Auto-route critical to CS" />
          </Row>
        </Section>

        <Section title="Appearance">
          <Row title="Theme" desc="Warm editorial — Fraunces + Inter">
            <span className="flex items-center gap-1.5">
              {['#B4451F', '#F7F3EC', '#1C1815'].map((c) => (
                <span key={c} className="h-5 w-5 rounded-full border border-line" style={{ background: c }} />
              ))}
            </span>
          </Row>
          <Row title="Density">
            <Select value={density} onChange={setDensity} className="w-40" ariaLabel="Density" options={[{ value: 'comfortable', label: 'Comfortable' }, { value: 'compact', label: 'Compact' }]} />
          </Row>
        </Section>

        <Section title="Data & demo">
          <Row title="Reset demo data" desc="Restore the sample dataset to its original state.">
            <Button variant="secondary" icon="refresh" onClick={() => { reset(); fx.toast('Demo data reset', { icon: 'refresh', tone: 'success' }) }}>
              Reset
            </Button>
          </Row>
          <Row title="Data source" desc="Deterministic seed · no backend · prototype">
            <Pill>In-memory</Pill>
          </Row>
        </Section>
      </div>
    </Screen>
  )
}
