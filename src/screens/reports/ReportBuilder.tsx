import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, PageHeader, Screen, Select, TextInput, Toggle, cx } from '../../components/ui'
import { Icon } from '../../components/icons'
import { useActions, useExecutiveMetrics, useOpportunities, useReports, useRoi, useSignals, useThemes } from '../../store/hooks'
import { fmtNum, fmtUSD } from '../../lib/format'
import type { Report, ReportSection } from '../../data/types'

type Kind = ReportSection['kind']
const SECTION_DEFS: { kind: Kind; heading: string; label: string }[] = [
  { kind: 'summary', heading: 'Executive summary', label: 'Executive summary' },
  { kind: 'themes', heading: 'Top themes', label: 'Top themes' },
  { kind: 'signals', heading: 'Signals & risks', label: 'Signals & risks' },
  { kind: 'roi', heading: 'Value & ROI', label: 'Value & ROI' },
  { kind: 'recommendations', heading: 'Recommendations', label: 'Recommendations' },
]

export function ReportBuilder() {
  const navigate = useNavigate()
  const { addReport } = useActions()
  const reports = useReports()
  const m = useExecutiveMetrics()
  const roi = useRoi()
  const themes = useThemes({ sort: 'impact' })
  const fastest = useThemes({ sort: 'trend' })
  const signals = useSignals({})
  const opps = useOpportunities()

  const [title, setTitle] = useState('August 2026 Voice of the Customer')
  const [period, setPeriod] = useState('August 2026')
  const [audience, setAudience] = useState<Report['audience']>('Executive')
  const [on, setOn] = useState<Record<Kind, boolean>>({ summary: true, themes: true, signals: true, roi: true, recommendations: true })

  const bodyFor = (kind: Kind): string => {
    const top3 = themes.slice(0, 3).map((t) => t.title.toLowerCase())
    switch (kind) {
      case 'summary':
        return `Lighthouse analyzed ${fmtNum(m.total)} pieces of feedback this period. Sentiment is ${m.posPct}% positive against ${m.negPct}% negative. Risk clusters in ${top3.join(', ')}, with ${fmtUSD(m.arrAtRisk)} of ARR at risk across ${m.atRiskAccounts.length} accounts.`
      case 'themes':
        return `Leading themes by impact are ${top3.join(', ')}. Fastest-growing this period: ${fastest[0]?.title} (${fastest[0]?.volumeTrendPct > 0 ? '+' : ''}${fastest[0]?.volumeTrendPct}%).`
      case 'signals':
        return `${m.criticalSignals} critical signals are open. Notable: ${signals.filter((s) => s.type === 'churn-risk').slice(0, 2).map((s) => s.title).join('; ')}.`
      case 'roi':
        return `Feedback-driven action is associated with ${fmtUSD(roi.churnPreventedArr)} in churn prevented and ${fmtUSD(roi.expansionInfluencedArr)} in expansion influenced — a ${roi.roiMultiple}× return with payback inside ${roi.paybackMonths} months.`
      case 'recommendations':
        return `Prioritize ${opps[0]?.title} and ${opps[1]?.title}. Open discovery with the top research candidates tied to at-risk accounts.`
    }
  }

  const generate = () => {
    const kinds = SECTION_DEFS.filter((s) => on[s.kind])
    const sections: ReportSection[] = kinds.map((s, i) => ({ id: `rs_new_${i}`, heading: s.heading, kind: s.kind, body: bodyFor(s.kind) }))
    const id = `rep_new_${reports.length + 1}`
    const report: Report = {
      id,
      title,
      period,
      audience,
      status: 'generating',
      createdBy: 'Lighthouse',
      createdISO: new Date().toISOString(),
      sharedWith: [],
      sections,
    }
    addReport(report)
    navigate(`/reports/generating?id=${id}`)
  }

  const count = SECTION_DEFS.filter((s) => on[s.kind]).length

  return (
    <Screen width="max-w-3xl">
      <PageHeader kicker="Reports · Builder" title="Build a report" subtitle="Pick the audience and sections. Lighthouse writes each one from live feedback." />

      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-mute">Title</label>
            <TextInput value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-mute">Period</label>
            <TextInput value={period} onChange={(e) => setPeriod(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-mute">Audience</label>
            <Select
              value={audience}
              onChange={(v) => setAudience(v as Report['audience'])}
              options={[
                { value: 'Executive', label: 'Executive' },
                { value: 'Board', label: 'Board' },
                { value: 'Product', label: 'Product' },
                { value: 'CS', label: 'Customer Success' },
              ]}
            />
          </div>
        </div>

        <Card className="p-5">
          <div className="mb-3 text-sm font-semibold text-ink">Sections</div>
          <div className="flex flex-col gap-1">
            {SECTION_DEFS.map((s) => (
              <label key={s.kind} className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 hover:bg-paper-sunken">
                <span className={cx('text-sm', on[s.kind] ? 'text-ink' : 'text-ink-mute')}>{s.label}</span>
                <Toggle checked={on[s.kind]} onChange={(v) => setOn((o) => ({ ...o, [s.kind]: v }))} />
              </label>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Button variant="primary" icon="sparkles" onClick={generate} disabled={count === 0}>
          Generate report
        </Button>
        <span className="text-sm text-ink-mute">{count} section{count !== 1 && 's'} · {audience}</span>
      </div>
    </Screen>
  )
}
