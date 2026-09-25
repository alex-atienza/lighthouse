// Deterministic seed dataset. A fixed PRNG seed + fixed "now" anchor means the
// demo data is identical on every load — predictable for pitching, yet rich
// enough that charts and distributions look real. Domain = New Relic (observability).
import type {
  Account,
  Answer,
  Channel,
  Database,
  FeedbackItem,
  Opportunity,
  ResearchCandidate,
  Report,
  Rule,
  SentimentLabel,
  Severity,
  Signal,
  Source,
  Theme,
  ThemeTrend,
} from './types'
import { USER } from '../config/user'

// ---- deterministic randomness -------------------------------------------------
const NOW = new Date('2026-08-05T12:00:00Z').getTime()
const DAY = 86_400_000
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = mulberry32(0x1a2b3c4d)
const ri = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min
const pick = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)]
const daysAgoISO = (d: number, jitterHours = 0) =>
  new Date(NOW - d * DAY - (jitterHours ? ri(0, jitterHours) * 3_600_000 : 0)).toISOString()
const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

// ---- sources -------------------------------------------------------------------
const sources: Source[] = [
  { id: 'src_zendesk', name: 'Zendesk', type: 'support', status: 'connected', itemCount: 18420, lastSyncISO: daysAgoISO(0, 2), coverage: 0.98, icon: '🎫', description: 'Support tickets & CSAT' },
  { id: 'src_gong', name: 'Gong', type: 'sales-call', status: 'connected', itemCount: 6210, lastSyncISO: daysAgoISO(0, 5), coverage: 0.86, icon: '📞', description: 'Sales & renewal call transcripts' },
  { id: 'src_delighted', name: 'Delighted (NPS)', type: 'nps', status: 'connected', itemCount: 9040, lastSyncISO: daysAgoISO(1, 6), coverage: 0.92, icon: '📊', description: 'NPS & CSAT verbatims' },
  { id: 'src_g2', name: 'G2', type: 'review', status: 'connected', itemCount: 1280, lastSyncISO: daysAgoISO(1, 8), coverage: 0.74, icon: '⭐', description: 'Public product reviews' },
  { id: 'src_discourse', name: 'Community', type: 'community', status: 'syncing', itemCount: 7360, lastSyncISO: daysAgoISO(0, 1), coverage: 0.81, icon: '💬', description: 'Discourse forum threads' },
  { id: 'src_inapp', name: 'In-App Widget', type: 'in-app', status: 'connected', itemCount: 5115, lastSyncISO: daysAgoISO(0, 1), coverage: 0.95, icon: '📱', description: 'In-product feedback prompts' },
  { id: 'src_gainsight', name: 'Gainsight', type: 'csm-note', status: 'connected', itemCount: 3420, lastSyncISO: daysAgoISO(2, 10), coverage: 0.7, icon: '📝', description: 'CS notes & QBR summaries' },
  { id: 'src_social', name: 'Social (X)', type: 'social', status: 'error', itemCount: 2190, lastSyncISO: daysAgoISO(4, 4), coverage: 0.4, icon: '🐦', description: 'Public social mentions' },
]
const sourceByChannel: Record<Channel, Source> = sources.reduce(
  (acc, s) => ((acc[s.type] = s), acc),
  {} as Record<Channel, Source>,
)

// ---- accounts ------------------------------------------------------------------
const companyNames = [
  'Northwind Logistics', 'Meridian Bank', 'Vantage Health', 'Cobalt Retail', 'Sequoia Media',
  'Atlas Freight', 'Lumen Payments', 'Orchard Foods', 'Ironclad Security', 'Beacon Insurance',
  'Tidewater Energy', 'Summit Robotics', 'Cedar Analytics', 'Halcyon Travel', 'Vertex Manufacturing',
  'Pinnacle Telecom', 'Riverstone Capital', 'Aurora Biotech', 'Keystone Education', 'Solstice Gaming',
  'Nimbus Cloud', 'Granite Construction', 'Marlin Shipping', 'Verdant Agriculture', 'Copper Mountain Ski',
  'Lattice Semiconductors', 'Harbor Freight Co', 'Zephyr Airlines', 'Onyx Consulting', 'Fable Publishing',
  'Quill Software', 'Drift Commerce', 'Ember Utilities', 'Sable Automotive', 'Willow Home',
]
const industries = [
  'Logistics', 'Financial Services', 'Healthcare', 'Retail', 'Media', 'Freight', 'Fintech', 'Food & Beverage',
  'Security', 'Insurance', 'Energy', 'Robotics', 'Analytics', 'Travel', 'Manufacturing', 'Telecom', 'Capital Markets',
  'Biotech', 'Education', 'Gaming', 'Cloud Infra', 'Construction', 'Shipping', 'Agriculture', 'Hospitality',
  'Semiconductors', 'Logistics', 'Airlines', 'Consulting', 'Publishing', 'Software', 'eCommerce', 'Utilities',
  'Automotive', 'Home Services',
]
const csms = ['Priya Nair', 'Marcus Webb', 'Dana Ito', 'Luis Romero', 'Grace Kim', 'Tom Fisher']
const aes = ['Alex Chen', 'Sam Okafor', 'Jordan Blake', 'Nadia Farouk', 'Ben Carter', 'Mia Alvarez']

const accounts: Account[] = companyNames.map((name, i) => {
  // first 10 Enterprise, next 13 Mid-Market, rest SMB
  const segment = i < 10 ? 'Enterprise' : i < 23 ? 'Mid-Market' : 'SMB'
  const arr =
    segment === 'Enterprise' ? ri(45, 210) * 10_000 : segment === 'Mid-Market' ? ri(9, 44) * 10_000 : ri(1, 8) * 10_000
  return {
    id: `acc_${i + 1}`,
    name,
    segment,
    arr,
    health: ri(28, 95),
    renewalISO: daysAgoISO(-ri(20, 330)),
    csm: pick(csms),
    ae: pick(aes),
    industry: industries[i] ?? 'Software',
    logoInitials: initials(name),
  }
})
const accountWeight: Record<string, number> = { Enterprise: 3, 'Mid-Market': 2, SMB: 1 }
const weightedAccounts: Account[] = accounts.flatMap((a) => Array(accountWeight[a.segment]).fill(a))

// ---- theme definitions (feedback generated from these) -------------------------
interface ThemeDef {
  id: string
  title: string
  summary: string
  category: string
  productArea: string
  baseSentiment: SentimentLabel
  target: number
  trend: ThemeTrend
  volumeTrendPct: number
  impact: number
  keywords: string[]
  templates: string[]
}
const themeDefs: ThemeDef[] = [
  { id: 'alert-noise', title: 'Alert noise & flapping', summary: 'Teams are overwhelmed by low-value, flapping alerts; signal-to-noise is the #1 alerting complaint.', category: 'Alerting & Incident', productArea: 'Alerts & AI', baseSentiment: 'negative', target: 34, trend: 'growing', volumeTrendPct: 42, impact: 92, keywords: ['alert fatigue', 'flapping', 'noise', 'thresholds'], templates: ['We get hundreds of flapping alerts a day — the on-call team is drowning in noise.', '{acct} needs alert grouping. Static thresholds fire constantly during deploys.', 'Too many low-value alerts. We’re starting to ignore them, which is dangerous.'] },
  { id: 'dash-perf', title: 'Dashboard load performance', summary: 'Large dashboards are slow to render, especially with long time-windows and many widgets.', category: 'Performance', productArea: 'Dashboards', baseSentiment: 'negative', target: 28, trend: 'growing', volumeTrendPct: 19, impact: 85, keywords: ['slow', 'dashboard', 'render', 'timeout'], templates: ['Our exec dashboard takes 15+ seconds to load with a 30-day window.', '{acct} sees timeouts on dashboards with more than ~20 widgets.', 'Dashboard performance has gotten noticeably worse this quarter.'] },
  { id: 'pricing-confusion', title: 'Confusing usage-based pricing', summary: 'Usage-based billing is hard to predict; customers fear surprise overages and cannot self-forecast.', category: 'Pricing & Billing', productArea: 'Billing', baseSentiment: 'negative', target: 31, trend: 'growing', volumeTrendPct: 28, impact: 88, keywords: ['pricing', 'overage', 'unpredictable', 'billing'], templates: ['We can’t predict our monthly bill — usage-based pricing is a black box.', '{acct} got a surprise overage and finance is escalating.', 'Please give us cost controls and forecasting. Budgeting is impossible right now.'] },
  { id: 'nrql-curve', title: 'NRQL learning curve', summary: 'New users struggle to write NRQL; query authoring is a barrier to self-serve insight.', category: 'UI & Navigation', productArea: 'Query & NRQL', baseSentiment: 'neutral', target: 22, trend: 'stable', volumeTrendPct: 4, impact: 78, keywords: ['NRQL', 'query', 'learning curve', 'syntax'], templates: ['NRQL is powerful but the learning curve is steep for new engineers.', 'A natural-language query builder would help {acct}’s junior team a lot.', 'I always end up copy-pasting NRQL from docs — wish it were more discoverable.'] },
  { id: 'onboarding-setup', title: 'Onboarding & instrumentation setup', summary: 'Initial instrumentation and agent setup is fiddly; time-to-first-value is too long.', category: 'Onboarding & Setup', productArea: 'Onboarding', baseSentiment: 'negative', target: 26, trend: 'stable', volumeTrendPct: 6, impact: 80, keywords: ['setup', 'instrumentation', 'onboarding', 'agent'], templates: ['Getting our services instrumented took two weeks — onboarding needs to be guided.', '{acct} struggled to install the agent across their K8s fleet.', 'Time-to-first-dashboard was way too long for a new team.'] },
  { id: 'otel-k8s', title: 'OpenTelemetry & Kubernetes gaps', summary: 'OTel collector and Kubernetes integrations have rough edges; parity with native agents is uneven.', category: 'Integrations', productArea: 'OTel & K8s', baseSentiment: 'negative', target: 24, trend: 'emerging', volumeTrendPct: 61, impact: 83, keywords: ['OpenTelemetry', 'OTel', 'kubernetes', 'collector'], templates: ['The OTel collector crashes under load in our K8s cluster.', '{acct} wants OTel parity with the native APM agents.', 'Kubernetes auto-discovery misses half our pods — setup is manual.'] },
  { id: 'log-cost', title: 'Log ingest cost surprises', summary: 'Log ingestion drives unexpected cost; customers want sampling and drop rules.', category: 'Pricing & Billing', productArea: 'Logs', baseSentiment: 'negative', target: 27, trend: 'growing', volumeTrendPct: 110, impact: 82, keywords: ['logs', 'ingest', 'cost', 'sampling'], templates: ['Log ingest cost doubled after we added a service — we need drop rules.', '{acct} is considering cutting log volume to control spend.', 'We want sampling and cardinality controls before the next billing cycle.'] },
  { id: 'retention-limits', title: 'Data retention limits', summary: 'Default retention windows are too short for compliance and long-term trend analysis.', category: 'Data & Retention', productArea: 'Data Platform', baseSentiment: 'neutral', target: 15, trend: 'stable', volumeTrendPct: 3, impact: 62, keywords: ['retention', 'compliance', 'archive', 'history'], templates: ['We need 13-month retention for compliance — 30 days is not enough.', '{acct} wants archival tiers for cheaper long-term storage.', 'Losing historical data makes year-over-year analysis impossible.'] },
  { id: 'ui-nav', title: 'UI navigation complexity', summary: 'Information architecture is hard to navigate; users get lost moving between capabilities.', category: 'UI & Navigation', productArea: 'Platform UX', baseSentiment: 'negative', target: 20, trend: 'stable', volumeTrendPct: 8, impact: 70, keywords: ['navigation', 'UX', 'confusing', 'menus'], templates: ['The nav is overwhelming — I can never find the entity explorer.', '{acct}’s new users say the UI has too many entry points.', 'Too many clicks to get from an alert to the underlying trace.'] },
  { id: 'sso-rbac', title: 'SSO/SAML & RBAC gaps', summary: 'Enterprise identity needs — SCIM, granular roles, and audit — are incomplete.', category: 'Security & Access', productArea: 'Security', baseSentiment: 'negative', target: 14, trend: 'emerging', volumeTrendPct: 33, impact: 66, keywords: ['SSO', 'SAML', 'RBAC', 'SCIM'], templates: ['We need granular RBAC — today it’s all-or-nothing access.', '{acct} requires SCIM provisioning before rollout to 2,000 users.', 'Audit logs for access changes are a hard security requirement.'] },
  { id: 'synthetics-flaky', title: 'Synthetics reliability', summary: 'Synthetic monitors report false failures from the monitoring side, eroding trust.', category: 'Alerting & Incident', productArea: 'Synthetics', baseSentiment: 'negative', target: 12, trend: 'stable', volumeTrendPct: 7, impact: 58, keywords: ['synthetics', 'false positive', 'flaky', 'monitor'], templates: ['Our synthetic checks report failures that are actually on your side.', '{acct} lost trust in synthetics after a week of false alerts.', 'Flaky synthetic monitors page us at 3am for nothing.'] },
  { id: 'agent-coverage', title: 'APM agent language coverage', summary: 'Requests for deeper coverage in newer runtimes and frameworks.', category: 'Integrations', productArea: 'APM Agents', baseSentiment: 'neutral', target: 11, trend: 'stable', volumeTrendPct: 2, impact: 55, keywords: ['agent', 'language', 'framework', 'coverage'], templates: ['We’d love first-class support for our Rust services.', '{acct} needs better auto-instrumentation for newer frameworks.', 'The agent misses some of our async call paths.'] },
  { id: 'support-slow', title: 'Slow support response', summary: 'First-response times on support tickets are slipping, especially for high-severity issues.', category: 'Support & Docs', productArea: 'Support', baseSentiment: 'negative', target: 18, trend: 'growing', volumeTrendPct: 24, impact: 64, keywords: ['support', 'response time', 'SLA', 'slow'], templates: ['It took three days to get a first response on a Sev-2 ticket.', '{acct} is frustrated with support turnaround on critical issues.', 'Support response times have gotten slower over the last month.'] },
  { id: 'docs-quality', title: 'Documentation quality', summary: 'Docs are occasionally stale or lack end-to-end examples for real workflows.', category: 'Support & Docs', productArea: 'Docs', baseSentiment: 'neutral', target: 16, trend: 'stable', volumeTrendPct: 1, impact: 52, keywords: ['docs', 'examples', 'stale', 'tutorial'], templates: ['The docs are missing an end-to-end example for OTel setup.', '{acct} found a few doc pages that were out of date.', 'More real-world tutorials would make self-serve much easier.'] },
  { id: 'slack-teams', title: 'Slack/Teams integration requests', summary: 'Popular requests for richer, two-way Slack and Teams workflows from alerts.', category: 'Integrations', productArea: 'Integrations', baseSentiment: 'positive', target: 10, trend: 'growing', volumeTrendPct: 15, impact: 55, keywords: ['slack', 'teams', 'integration', 'notifications'], templates: ['Love the Slack alerts — would be amazing to acknowledge from the thread.', '{acct} wants two-way Teams integration to triage from chat.', 'The Slack integration is great; please add incident channels.'] },
  { id: 'anomaly-accuracy', title: 'Anomaly detection accuracy', summary: 'Mixed feedback on AI anomaly detection — promising but needs tuning to cut false positives.', category: 'AI & Analytics', productArea: 'Alerts & AI', baseSentiment: 'neutral', target: 13, trend: 'stable', volumeTrendPct: 5, impact: 60, keywords: ['anomaly', 'AI', 'false positive', 'baseline'], templates: ['Anomaly detection is promising but still noisy for seasonal traffic.', '{acct} wants to tune sensitivity per service.', 'The AI baselines need a longer warm-up to be trustworthy.'] },
  { id: 'cross-account', title: 'Cross-account observability', summary: 'Larger customers want unified rollups across many sub-accounts and business units.', category: 'Data & Retention', productArea: 'Data Platform', baseSentiment: 'neutral', target: 12, trend: 'emerging', volumeTrendPct: 22, impact: 57, keywords: ['cross-account', 'rollup', 'multi-account', 'org'], templates: ['We manage 40 sub-accounts and need a single rollup view.', '{acct} wants org-level dashboards spanning business units.', 'Cross-account querying is painful today.'] },
  { id: 'oncall-routing', title: 'On-call & alert routing', summary: 'Routing alerts to the right team and on-call rotation needs more flexibility.', category: 'Alerting & Incident', productArea: 'Alerts & AI', baseSentiment: 'negative', target: 15, trend: 'growing', volumeTrendPct: 17, impact: 72, keywords: ['on-call', 'routing', 'escalation', 'rotation'], templates: ['Routing alerts to the right squad requires too much manual config.', '{acct} needs escalation policies tied to service ownership.', 'On-call rotations should sync from our existing tooling.'] },
  { id: 'query-large', title: 'Query performance on large data', summary: 'Queries over very large datasets time out or slow down interactive exploration.', category: 'Performance', productArea: 'Query & NRQL', baseSentiment: 'negative', target: 14, trend: 'stable', volumeTrendPct: 9, impact: 68, keywords: ['query', 'timeout', 'large data', 'slow'], templates: ['Queries over 90 days of data frequently time out.', '{acct} sees slow interactive queries on high-cardinality metrics.', 'Exploration gets painful once you cross a certain data volume.'] },
  { id: 'mobile-crash', title: 'Mobile crash reporting love', summary: 'Strong positive sentiment for mobile crash reporting; requests to expand it further.', category: 'AI & Analytics', productArea: 'Mobile', baseSentiment: 'positive', target: 9, trend: 'growing', volumeTrendPct: 12, impact: 52, keywords: ['mobile', 'crash', 'reporting', 'symbolication'], templates: ['Mobile crash reporting is fantastic — caught a regression instantly.', '{acct} loves the crash grouping; would love more symbolication options.', 'The mobile SDK is our favorite feature this year.'] },
]

// ---- generate feedback from themes --------------------------------------------
const personas = ['SRE Lead', 'Platform Engineer', 'DevOps Manager', 'VP Engineering', 'Observability Eng', 'Backend Developer', 'IT Ops', 'Eng Manager', 'CTO', 'Security Engineer']
function deriveSentiment(base: SentimentLabel): { label: SentimentLabel; score: number } {
  const roll = rand()
  if (base === 'negative') {
    if (roll < 0.72) return { label: 'negative', score: -(0.4 + rand() * 0.55) }
    if (roll < 0.92) return { label: 'neutral', score: -0.1 + rand() * 0.2 }
    return { label: 'positive', score: 0.3 + rand() * 0.4 }
  }
  if (base === 'positive') {
    if (roll < 0.72) return { label: 'positive', score: 0.45 + rand() * 0.5 }
    if (roll < 0.92) return { label: 'neutral', score: -0.1 + rand() * 0.2 }
    return { label: 'negative', score: -(0.3 + rand() * 0.3) }
  }
  if (roll < 0.5) return { label: 'neutral', score: -0.15 + rand() * 0.3 }
  if (roll < 0.78) return { label: 'negative', score: -(0.3 + rand() * 0.4) }
  return { label: 'positive', score: 0.35 + rand() * 0.4 }
}
function severityFor(label: SentimentLabel): Severity {
  const roll = rand()
  if (label === 'negative') return roll < 0.18 ? 'critical' : roll < 0.55 ? 'high' : roll < 0.85 ? 'medium' : 'low'
  if (label === 'neutral') return roll < 0.5 ? 'low' : roll < 0.85 ? 'medium' : 'high'
  return roll < 0.7 ? 'low' : 'medium'
}
function sparkline(total: number, trend: ThemeTrend): number[] {
  const base = Math.max(1, Math.round(total / 8))
  const drift = trend === 'growing' || trend === 'emerging' ? 0.1 : trend === 'declining' ? -0.1 : 0
  let v = Math.max(1, base - Math.round(base * drift * 4))
  const out: number[] = []
  for (let i = 0; i < 8; i++) {
    v = Math.max(0, Math.round(v * (1 + drift) + (rand() - 0.5) * base * 0.6))
    out.push(v)
  }
  return out
}

const feedback: FeedbackItem[] = []
let fc = 0
const themes: Theme[] = themeDefs.map((def) => {
  const ids: string[] = []
  const acctSet = new Set<string>()
  let scoreSum = 0
  for (let i = 0; i < def.target; i++) {
    const acct = pick(weightedAccounts)
    const source = pick(sources)
    const { label, score } = deriveSentiment(def.baseSentiment)
    const tmpl = pick(def.templates).replace('{acct}', acct.name)
    const id = `fb_${String(++fc).padStart(4, '0')}`
    feedback.push({
      id,
      text: tmpl,
      sourceId: source.id,
      accountId: acct.id,
      channel: source.type,
      createdISO: daysAgoISO(ri(0, 88), 23),
      sentiment: label,
      sentimentScore: Math.round(score * 100) / 100,
      themeIds: [def.id],
      keywords: def.keywords.slice(0, ri(2, def.keywords.length)),
      severity: severityFor(label),
      productArea: def.productArea,
      author: pick(personas),
    })
    ids.push(id)
    acctSet.add(acct.id)
    scoreSum += score
  }
  const accountIds = [...acctSet]
  const arrImpact = accountIds.reduce((s, aid) => s + (accounts.find((a) => a.id === aid)?.arr ?? 0), 0)
  const avg = scoreSum / def.target
  return {
    id: def.id,
    title: def.title,
    summary: def.summary,
    category: def.category,
    feedbackItemIds: ids,
    sentiment: avg < -0.15 ? 'negative' : avg > 0.2 ? 'positive' : 'neutral',
    sentimentScore: Math.round(avg * 100) / 100,
    volume: ids.length,
    volumeTrendPct: def.volumeTrendPct,
    trend: def.trend,
    impact: def.impact,
    arrImpact,
    accountIds,
    firstSeenISO: daysAgoISO(ri(30, 180)),
    following: ['alert-noise', 'pricing-confusion', 'otel-k8s'].includes(def.id),
    sparkline: sparkline(def.target, def.trend),
  }
})
const themeById = (id: string) => themes.find((t) => t.id === id)!

// ---- opportunities -------------------------------------------------------------
function rice(reach: number, impact: number, effort: number) {
  return Math.round(((reach * (impact / 100) * 0.8) / (effort / 10)) * 10) / 10
}
const oppSpecs: Array<Omit<Opportunity, 'rice'>> = [
  { id: 'opp_1', title: 'Smart alert grouping & noise reduction', summary: 'Cluster correlated alerts and suppress flapping to cut on-call noise.', themeIds: ['alert-noise', 'oncall-routing'], impact: 92, effort: 55, reachAccounts: 140, arrReach: 4_200_000, status: 'in-progress', quarter: "Q3 '26", jiraKey: 'NR-1201', owner: 'Alerts squad' },
  { id: 'opp_2', title: 'Dashboard render pipeline v2', summary: 'Re-architect dashboard rendering for large time-windows and widget counts.', themeIds: ['dash-perf', 'query-large'], impact: 85, effort: 70, reachAccounts: 210, arrReach: 6_100_000, status: 'planned', quarter: "Q4 '26", jiraKey: 'NR-1188', owner: 'Dashboards' },
  { id: 'opp_3', title: 'Transparent usage & cost controls', summary: 'Cost forecasting, budgets, and drop/sampling rules for predictable spend.', themeIds: ['pricing-confusion', 'log-cost'], impact: 88, effort: 45, reachAccounts: 260, arrReach: 7_400_000, status: 'planned', quarter: "Q3 '26", jiraKey: 'NR-1150', owner: 'Billing' },
  { id: 'opp_4', title: 'Guided onboarding & auto-instrumentation', summary: 'Wizard-driven setup with auto-instrumentation to shrink time-to-value.', themeIds: ['onboarding-setup', 'agent-coverage'], impact: 80, effort: 50, reachAccounts: 300, arrReach: 5_000_000, status: 'in-progress', quarter: "Q3 '26", jiraKey: 'NR-1099', owner: 'Onboarding' },
  { id: 'opp_5', title: 'OTel-native collector & K8s wizard', summary: 'Hardened OTel collector and one-click Kubernetes discovery.', themeIds: ['otel-k8s'], impact: 83, effort: 65, reachAccounts: 120, arrReach: 3_600_000, status: 'planned', quarter: "Q4 '26", jiraKey: 'NR-1210', owner: 'Integrations' },
  { id: 'opp_6', title: 'NRQL copilot (natural-language query)', summary: 'Natural-language to NRQL to lower the query authoring barrier.', themeIds: ['nrql-curve', 'anomaly-accuracy'], impact: 78, effort: 40, reachAccounts: 180, arrReach: 3_100_000, status: 'backlog', quarter: "Q1 '27", owner: 'Query' },
  { id: 'opp_7', title: 'Data retention tiers & archival', summary: 'Longer retention with cheaper archival storage tiers.', themeIds: ['retention-limits'], impact: 62, effort: 35, reachAccounts: 90, arrReach: 2_200_000, status: 'backlog', quarter: "Q4 '26", owner: 'Data Platform' },
  { id: 'opp_8', title: 'Navigation & IA redesign', summary: 'Simplify information architecture and reduce clicks between capabilities.', themeIds: ['ui-nav'], impact: 70, effort: 60, reachAccounts: 250, arrReach: 4_000_000, status: 'backlog', quarter: "Q1 '27", owner: 'Platform UX' },
  { id: 'opp_9', title: 'SSO/SAML + granular RBAC', summary: 'SCIM provisioning, granular roles, and access audit logs.', themeIds: ['sso-rbac'], impact: 66, effort: 45, reachAccounts: 70, arrReach: 2_800_000, status: 'planned', quarter: "Q4 '26", jiraKey: 'NR-1177', owner: 'Security' },
  { id: 'opp_10', title: 'Synthetics reliability hardening', summary: 'Reduce false failures and add multi-location verification.', themeIds: ['synthetics-flaky'], impact: 58, effort: 40, reachAccounts: 60, arrReach: 1_400_000, status: 'in-progress', quarter: "Q3 '26", jiraKey: 'NR-1160', owner: 'Synthetics' },
  { id: 'opp_11', title: 'Support SLA & in-product help', summary: 'Tighten first-response SLAs and add contextual in-product help.', themeIds: ['support-slow', 'docs-quality'], impact: 64, effort: 30, reachAccounts: 200, arrReach: 3_000_000, status: 'planned', quarter: "Q3 '26", owner: 'Support Ops' },
  { id: 'opp_12', title: 'Slack/Teams two-way integration', summary: 'Acknowledge, triage, and open incident channels from chat.', themeIds: ['slack-teams'], impact: 55, effort: 25, reachAccounts: 150, arrReach: 1_800_000, status: 'shipped', quarter: "Q2 '26", jiraKey: 'NR-1042', owner: 'Integrations' },
  { id: 'opp_13', title: 'Anomaly detection tuning controls', summary: 'Per-service sensitivity and seasonality-aware baselines.', themeIds: ['anomaly-accuracy'], impact: 60, effort: 50, reachAccounts: 110, arrReach: 2_000_000, status: 'backlog', quarter: "Q1 '27", owner: 'Alerts & AI' },
  { id: 'opp_14', title: 'Cross-account rollup views', summary: 'Org-level dashboards and querying across sub-accounts.', themeIds: ['cross-account'], impact: 57, effort: 55, reachAccounts: 80, arrReach: 1_900_000, status: 'backlog', quarter: "Q4 '26", owner: 'Data Platform' },
  { id: 'opp_15', title: 'Mobile crash-reporting expansion', summary: 'Expand symbolication and grouping for mobile crash reporting.', themeIds: ['mobile-crash'], impact: 52, effort: 35, reachAccounts: 95, arrReach: 1_500_000, status: 'planned', quarter: "Q4 '26", owner: 'Mobile' },
]
const opportunities: Opportunity[] = oppSpecs.map((o) => ({ ...o, rice: rice(o.reachAccounts, o.impact, o.effort) }))
// link themes → opportunities
opportunities.forEach((o) => o.themeIds.forEach((tid) => { const t = themeById(tid); if (t && !t.opportunityId) t.opportunityId = o.id }))

// ---- signals -------------------------------------------------------------------
const signals: Signal[] = [
  { id: 'sig_1', type: 'spike', title: 'Alert-noise complaints up 42% this week', detail: 'Flapping-alert feedback spiked across enterprise accounts after the 8.2 agent release.', severity: 'high', themeId: 'alert-noise', ruleId: 'rule_3', detectedISO: daysAgoISO(1, 6), status: 'new', metricDeltaPct: 42 },
  { id: 'sig_2', type: 'churn-risk', title: 'Meridian Bank at renewal risk — sentiment −38%', detail: 'Sentiment for Meridian Bank fell 38% over 30 days amid unresolved alerting issues; renewal in 62 days.', severity: 'critical', accountId: 'acc_2', themeId: 'alert-noise', ruleId: 'rule_2', detectedISO: daysAgoISO(0, 5), status: 'new', metricDeltaPct: -38 },
  { id: 'sig_3', type: 'sentiment-drop', title: 'Pricing sentiment dropped after billing change', detail: 'Usage-based pricing complaints rose sharply following the July billing update.', severity: 'high', themeId: 'pricing-confusion', ruleId: 'rule_8', detectedISO: daysAgoISO(2, 8), status: 'acknowledged', metricDeltaPct: -22 },
  { id: 'sig_4', type: 'emerging-theme', title: 'New theme forming: OTel collector crashes', detail: '18 new items in 72 hours describe OTel collector instability under load.', severity: 'medium', themeId: 'otel-k8s', ruleId: 'rule_3', detectedISO: daysAgoISO(1, 3), status: 'new', metricDeltaPct: 61 },
  { id: 'sig_5', type: 'competitor-mention', title: 'Datadog mentioned in 9 deals this month', detail: 'Competitive mentions of Datadog rose in Gong call transcripts, mostly around pricing and OTel.', severity: 'medium', ruleId: 'rule_4', detectedISO: daysAgoISO(3, 10), status: 'new', metricDeltaPct: 30 },
  { id: 'sig_6', type: 'churn-risk', title: 'Cobalt Retail — 3 critical tickets unresolved', detail: 'Three Sev-1 support tickets open >48h for Cobalt Retail; CSAT trending down.', severity: 'high', accountId: 'acc_4', themeId: 'support-slow', ruleId: 'rule_5', detectedISO: daysAgoISO(2, 6), status: 'routed', routedTo: 'CS — Dana Ito' },
  { id: 'sig_7', type: 'spike', title: 'Log ingest cost complaints doubled', detail: 'Log-cost feedback volume up 110% month-over-month; several finance escalations.', severity: 'high', themeId: 'log-cost', ruleId: 'rule_6', detectedISO: daysAgoISO(1, 4), status: 'new', metricDeltaPct: 110 },
  { id: 'sig_8', type: 'sentiment-drop', title: 'Dashboard-perf NPS detractors rising', detail: 'Detractor share for dashboard performance rose among mid-market accounts.', severity: 'medium', themeId: 'dash-perf', ruleId: 'rule_7', detectedISO: daysAgoISO(4, 9), status: 'acknowledged', metricDeltaPct: -14 },
  { id: 'sig_9', type: 'churn-risk', title: 'Tidewater Energy usage down 60%, renewal in 45d', detail: 'Ingest volume for Tidewater Energy dropped 60%; renewal approaching with low engagement.', severity: 'critical', accountId: 'acc_11', themeId: 'retention-limits', ruleId: 'rule_2', detectedISO: daysAgoISO(0, 8), status: 'new', metricDeltaPct: -60 },
  { id: 'sig_10', type: 'emerging-theme', title: 'SSO/RBAC requests emerging in enterprise', detail: 'Enterprise identity requests (SCIM, granular roles) clustering into a distinct theme.', severity: 'medium', themeId: 'sso-rbac', ruleId: 'rule_3', detectedISO: daysAgoISO(3, 5), status: 'new', metricDeltaPct: 33 },
  { id: 'sig_11', type: 'competitor-mention', title: 'Grafana comparisons rising in community', detail: 'Community threads comparing dashboards to Grafana increased this month.', severity: 'low', detectedISO: daysAgoISO(5, 8), status: 'new', metricDeltaPct: 12 },
  { id: 'sig_12', type: 'spike', title: 'Support response-time complaints spike', detail: 'First-response-time complaints up 24%, concentrated on Sev-2 tickets.', severity: 'high', themeId: 'support-slow', ruleId: 'rule_5', detectedISO: daysAgoISO(2, 7), status: 'routed', routedTo: 'Support Ops' },
  { id: 'sig_13', type: 'sentiment-drop', title: 'Synthetics flakiness frustration', detail: 'False-failure reports for synthetics rose slightly; trust concerns noted.', severity: 'medium', themeId: 'synthetics-flaky', ruleId: 'rule_7', detectedISO: daysAgoISO(6, 6), status: 'new', metricDeltaPct: -9 },
  { id: 'sig_14', type: 'churn-risk', title: 'Sequoia Media downgrade risk', detail: 'Sequoia Media signalled a possible tier downgrade citing dashboard performance.', severity: 'high', accountId: 'acc_5', themeId: 'dash-perf', ruleId: 'rule_2', detectedISO: daysAgoISO(3, 9), status: 'acknowledged', metricDeltaPct: -18 },
]

// ---- rules ---------------------------------------------------------------------
const rules: Rule[] = [
  { id: 'rule_1', name: 'Enterprise sentiment drop > 20%', condition: 'segment = Enterprise AND sentiment_delta < -20% over 30d', route: 'slack', routeTarget: '#voc-alerts', enabled: true, firedCount: 12, severity: 'high' },
  { id: 'rule_2', name: 'Churn-risk on account > $250k ARR', condition: 'signal.type = churn-risk AND account.arr > 250000', route: 'email', routeTarget: 'cs-leadership@newrelic.com', enabled: true, firedCount: 5, severity: 'critical' },
  { id: 'rule_3', name: 'New emerging theme (≥ 8 items / 72h)', condition: 'new_theme.items >= 8 within 72h', route: 'slack', routeTarget: '#product-signals', enabled: true, firedCount: 9, severity: 'medium' },
  { id: 'rule_4', name: 'Competitor mention in sales calls', condition: 'channel = sales-call AND text ~ competitor_list', route: 'slack', routeTarget: '#compete', enabled: true, firedCount: 21, severity: 'medium' },
  { id: 'rule_5', name: 'Critical support ticket unresolved > 48h', condition: 'severity = critical AND status = open AND age > 48h', route: 'jira', routeTarget: 'SUP board', enabled: true, firedCount: 7, severity: 'high' },
  { id: 'rule_6', name: 'Log cost anomaly > 2× baseline', condition: 'log_ingest_cost > 2 × 30d_baseline', route: 'email', routeTarget: 'billing-ops@newrelic.com', enabled: false, firedCount: 3, severity: 'high' },
  { id: 'rule_7', name: 'NPS detractor from Enterprise', condition: 'channel = nps AND score <= 6 AND segment = Enterprise', route: 'slack', routeTarget: '#cs-enterprise', enabled: true, firedCount: 33, severity: 'medium' },
  { id: 'rule_8', name: 'Pricing complaint cluster', condition: 'theme = pricing AND items > 10 / 7d', route: 'none', routeTarget: '—', enabled: false, firedCount: 4, severity: 'low' },
]

// ---- research candidates -------------------------------------------------------
const candidates: ResearchCandidate[] = [
  { id: 'cand_1', accountId: 'acc_2', reason: 'High churn risk plus six alerting complaints — urgent discovery.', themeIds: ['alert-noise', 'oncall-routing'], matchScore: 94, status: 'suggested', assignedAE: 'Alex Chen', persona: 'VP Platform Engineering' },
  { id: 'cand_2', accountId: 'acc_4', reason: 'Pricing confusion but strong usage — expansion + research candidate.', themeIds: ['pricing-confusion', 'log-cost'], matchScore: 88, status: 'suggested', assignedAE: 'Sam Okafor', persona: 'Director of DevOps' },
  { id: 'cand_3', accountId: 'acc_3', reason: 'OTel setup struggles; ideal design-partner fit for collector work.', themeIds: ['otel-k8s', 'onboarding-setup'], matchScore: 91, status: 'invited', assignedAE: 'Jordan Blake', persona: 'SRE Lead', lastContactISO: daysAgoISO(3) },
  { id: 'cand_4', accountId: 'acc_5', reason: 'Dashboard performance detractor considering downgrade.', themeIds: ['dash-perf'], matchScore: 82, status: 'scheduled', assignedAE: 'Nadia Farouk', persona: 'Engineering Manager', lastContactISO: daysAgoISO(2) },
  { id: 'cand_5', accountId: 'acc_6', reason: 'NRQL learning-curve feedback — enablement + copilot research.', themeIds: ['nrql-curve'], matchScore: 76, status: 'suggested', assignedAE: 'Ben Carter', persona: 'Observability Engineer' },
  { id: 'cand_6', accountId: 'acc_11', reason: 'Renewal risk deep-dive; retention and cost concerns.', themeIds: ['retention-limits', 'pricing-confusion'], matchScore: 90, status: 'invited', assignedAE: 'Mia Alvarez', persona: 'Platform Director', lastContactISO: daysAgoISO(5) },
  { id: 'cand_7', accountId: 'acc_12', reason: 'Synthetics reliability feedback — validation interview.', themeIds: ['synthetics-flaky'], matchScore: 71, status: 'completed', assignedAE: 'Alex Chen', persona: 'SRE', lastContactISO: daysAgoISO(9) },
  { id: 'cand_8', accountId: 'acc_18', reason: 'Security/RBAC needs ahead of 2,000-seat rollout.', themeIds: ['sso-rbac'], matchScore: 84, status: 'suggested', assignedAE: 'Jordan Blake', persona: 'Security Engineer' },
  { id: 'cand_9', accountId: 'acc_21', reason: 'Cross-account observability advocate; multi-account power user.', themeIds: ['cross-account'], matchScore: 79, status: 'scheduled', assignedAE: 'Sam Okafor', persona: 'Principal Engineer', lastContactISO: daysAgoISO(1) },
  { id: 'cand_10', accountId: 'acc_16', reason: 'Support-experience feedback; process-improvement input.', themeIds: ['support-slow', 'docs-quality'], matchScore: 73, status: 'declined', assignedAE: 'Ben Carter', persona: 'IT Ops Manager', lastContactISO: daysAgoISO(12) },
]

// ---- answers (Ask) -------------------------------------------------------------
const churnThemeCitations = ['alert-noise', 'pricing-confusion', 'dash-perf']
const goldenCitationFeedback = churnThemeCitations.flatMap((tid) => themeById(tid).feedbackItemIds.slice(0, 2))
const answers: Answer[] = [
  {
    id: 'ans_golden',
    question: 'What is driving churn risk in our enterprise accounts this quarter?',
    answer:
      'Enterprise churn risk this quarter is concentrated in three reinforcing themes. **Alert noise** is the dominant driver — flapping, low-value alerts are eroding trust in the platform, and the accounts most affected (led by Meridian Bank) also show the steepest sentiment declines. **Pricing unpredictability** is the second driver: usage-based billing and log-ingest cost surprises are prompting finance escalations, especially where spend spiked after the July billing change. **Dashboard performance** rounds out the top three, with detractors citing slow loads on large time-windows. Together these themes touch the majority of at-risk ARR, and two of the three already have opportunities in flight.',
    keyPoints: [
      'Alert noise is the #1 driver; Meridian Bank (−38% sentiment) is the clearest renewal risk.',
      'Pricing & log-cost surprises are escalating to finance, up sharply after the July billing change.',
      'Dashboard performance is a rising detractor among mid-market and enterprise accounts.',
      'Two of the three drivers already map to in-flight opportunities (alert grouping, cost controls).',
    ],
    citationFeedbackIds: goldenCitationFeedback,
    citationThemeIds: churnThemeCitations,
    confidence: 0.88,
    createdISO: daysAgoISO(0, 3),
    pinned: true,
  },
  { id: 'ans_2', question: 'Which themes are growing fastest in the last 30 days?', answer: 'The fastest-growing themes are log-ingest cost surprises (+110%), OTel/Kubernetes gaps (+61%), and alert noise (+42%). All three are negative-sentiment and concentrated in enterprise and mid-market segments.', keyPoints: ['Log cost +110%', 'OTel/K8s +61%', 'Alert noise +42%'], citationFeedbackIds: themeById('log-cost').feedbackItemIds.slice(0, 2), citationThemeIds: ['log-cost', 'otel-k8s', 'alert-noise'], confidence: 0.83, createdISO: daysAgoISO(2, 4), pinned: false },
  { id: 'ans_3', question: 'What do enterprise customers love most?', answer: 'Positive sentiment clusters around mobile crash reporting and the Slack integration. Customers repeatedly call crash reporting a favorite feature and want two-way chat workflows expanded.', keyPoints: ['Mobile crash reporting is a favorite', 'Slack alerts well-liked; want two-way triage'], citationFeedbackIds: themeById('mobile-crash').feedbackItemIds.slice(0, 2), citationThemeIds: ['mobile-crash', 'slack-teams'], confidence: 0.79, createdISO: daysAgoISO(6, 5), pinned: false },
  { id: 'ans_4', question: 'Where should we focus onboarding improvements?', answer: 'Onboarding friction centers on instrumentation setup and OTel/Kubernetes discovery. Guided setup and auto-instrumentation would most reduce time-to-first-value, especially for larger fleets.', keyPoints: ['Instrumentation setup is the top friction', 'K8s auto-discovery gaps slow rollout'], citationFeedbackIds: themeById('onboarding-setup').feedbackItemIds.slice(0, 2), citationThemeIds: ['onboarding-setup', 'otel-k8s'], confidence: 0.81, createdISO: daysAgoISO(8, 6), pinned: false },
  { id: 'ans_5', question: 'How is pricing sentiment trending?', answer: 'Pricing sentiment has declined since the July billing change, driven by unpredictability and log-ingest overages. Requests for forecasting and cost controls are rising across segments.', keyPoints: ['Sentiment down since July billing change', 'Forecasting & cost controls in demand'], citationFeedbackIds: themeById('pricing-confusion').feedbackItemIds.slice(0, 2), citationThemeIds: ['pricing-confusion', 'log-cost'], confidence: 0.85, createdISO: daysAgoISO(10, 7), pinned: false },
  { id: 'ans_6', question: 'What competitive threats are showing up in feedback?', answer: 'Competitive mentions are rising, led by Datadog in sales calls (pricing and OTel parity) and Grafana in community threads (dashboards). Volume is still moderate but trending up.', keyPoints: ['Datadog mentioned in 9 deals this month', 'Grafana dashboard comparisons rising'], citationFeedbackIds: [], citationThemeIds: ['pricing-confusion', 'otel-k8s'], confidence: 0.72, createdISO: daysAgoISO(12, 8), pinned: false },
]

// ---- reports -------------------------------------------------------------------
const reports: Report[] = [
  {
    id: 'rep_1', title: 'July 2026 Voice of the Customer', period: 'July 2026', audience: 'Executive', status: 'ready', createdBy: 'Lighthouse', createdISO: daysAgoISO(4), sharedWith: ['CPO', 'VP Product', 'VP CS'],
    sections: [
      { id: 'rs_1', heading: 'Executive summary', body: 'Feedback volume rose 12% month-over-month. Sentiment dipped slightly, driven by alerting noise and pricing concerns. Enterprise churn risk is concentrated in three themes; mitigations are in flight for two.', kind: 'summary' },
      { id: 'rs_2', heading: 'Top themes', body: 'Alert noise, confusing usage-based pricing, and dashboard performance lead by impact. Log-ingest cost is the fastest-growing theme at +110%.', kind: 'themes' },
      { id: 'rs_3', heading: 'Signals & risks', body: 'Two critical churn-risk signals (Meridian Bank, Tidewater Energy) require CS attention ahead of renewal.', kind: 'signals' },
      { id: 'rs_4', heading: 'Recommendations', body: 'Prioritize smart alert grouping and transparent cost controls; open discovery with three research candidates.', kind: 'recommendations' },
    ],
  },
  {
    id: 'rep_2', title: "Q2 FY26 Board VoC Narrative", period: "Q2 FY26", audience: 'Board', status: 'ready', createdBy: 'Lighthouse', createdISO: daysAgoISO(20), sharedWith: ['Board'],
    sections: [
      { id: 'rs_5', heading: 'The customer, in one page', body: 'Retention held despite rising alerting friction. Investments in alerting and cost transparency directly protect at-risk ARR.', kind: 'summary' },
      { id: 'rs_6', heading: 'Value delivered', body: 'Lighthouse-linked interventions are associated with $8.4M churn prevented and $5.6M expansion influenced this half.', kind: 'roi' },
    ],
  },
  {
    id: 'rep_3', title: 'Enterprise Churn Risk Deep-Dive', period: 'July 2026', audience: 'Executive', status: 'ready', createdBy: 'Lighthouse', createdISO: daysAgoISO(6), sharedWith: ['VP CS', 'CPO'],
    sections: [
      { id: 'rs_7', heading: 'At-risk accounts', body: 'Meridian Bank, Tidewater Energy, and Sequoia Media represent the largest at-risk ARR, each tied to a distinct theme.', kind: 'signals' },
      { id: 'rs_8', heading: 'Root causes', body: 'Alert noise, retention limits, and dashboard performance respectively. Each maps to an owned opportunity.', kind: 'themes' },
    ],
  },
  {
    id: 'rep_4', title: 'Product Signals — Weekly', period: 'Wk of Aug 4', audience: 'Product', status: 'ready', createdBy: 'Lighthouse', createdISO: daysAgoISO(1), sharedWith: ['Product managers'],
    sections: [
      { id: 'rs_9', heading: 'This week', body: 'Emerging: OTel collector crashes. Spiking: log-ingest cost. Watch: SSO/RBAC requests clustering in enterprise.', kind: 'signals' },
    ],
  },
  { id: 'rep_5', title: 'August 2026 Voice of the Customer', period: 'August 2026', audience: 'Executive', status: 'generating', createdBy: 'Lighthouse', createdISO: daysAgoISO(0), sharedWith: [], sections: [] },
  { id: 'rep_6', title: 'CS Health Review (draft)', period: 'Q3 FY26', audience: 'CS', status: 'draft', createdBy: 'Dana Ito', createdISO: daysAgoISO(0), sharedWith: [], sections: [{ id: 'rs_10', heading: 'Draft outline', body: 'Health by segment, at-risk accounts, and CS actions for the quarter.', kind: 'summary' }] },
]

// ---- assemble ------------------------------------------------------------------
export function seedDatabase(): Database {
  return {
    sources,
    accounts,
    feedback,
    themes,
    signals,
    rules,
    candidates,
    opportunities,
    answers,
    reports,
    roi: {
      churnPreventedArr: 8_400_000,
      churnPreventedAccounts: 11,
      expansionInfluencedArr: 5_600_000,
      efficiencyHoursSaved: 4_200,
      efficiencyCostSaved: 520_000,
      adoptionLiftPct: 18,
      investmentAnnual: 1_200_000,
    },
    readNotifications: [],
    profile: { name: USER.name, email: USER.email, role: USER.role, team: USER.team, memberSinceISO: USER.memberSinceISO },
  }
}

export const seededCounts = {
  feedback: feedback.length,
  themes: themes.length,
  signals: signals.length,
  accounts: accounts.length,
  ingestedTotal: sources.reduce((s, x) => s + x.itemCount, 0),
}
