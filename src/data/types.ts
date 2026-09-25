// Domain model for Lighthouse — New Relic's Voice of the Customer engine.
// Everything is cross-referenced by string ID so screens read one coherent dataset.

export type ID = string

export type Segment = 'Enterprise' | 'Mid-Market' | 'SMB'
export type SentimentLabel = 'positive' | 'neutral' | 'negative'
export type Severity = 'low' | 'medium' | 'high' | 'critical'

export type Channel =
  | 'support' // Zendesk tickets
  | 'sales-call' // Gong call transcripts
  | 'nps' // Delighted / NPS verbatims
  | 'review' // G2 reviews
  | 'community' // Discourse forum
  | 'in-app' // in-product feedback widget
  | 'csm-note' // Gainsight / CS notes
  | 'social' // X / social mentions

export interface Source {
  id: ID
  name: string
  type: Channel
  status: 'connected' | 'syncing' | 'error' | 'paused'
  itemCount: number
  lastSyncISO: string
  coverage: number // 0..1 — share of that channel's volume captured
  icon: string // emoji glyph used in the UI
  description: string
}

export interface Account {
  id: ID
  name: string
  segment: Segment
  arr: number // annual recurring revenue, USD
  health: number // 0..100
  renewalISO: string
  csm: string
  ae: string
  industry: string
  logoInitials: string
}

export interface FeedbackItem {
  id: ID
  text: string
  sourceId: ID
  accountId: ID
  channel: Channel
  createdISO: string
  sentiment: SentimentLabel
  sentimentScore: number // -1..1
  themeIds: ID[]
  keywords: string[]
  severity: Severity
  productArea: string
  author: string // persona / role
}

export type ThemeTrend = 'emerging' | 'growing' | 'stable' | 'declining'

export interface Theme {
  id: ID
  title: string
  summary: string
  category: string
  feedbackItemIds: ID[]
  sentiment: SentimentLabel
  sentimentScore: number
  volume: number
  volumeTrendPct: number // vs prior period
  trend: ThemeTrend
  impact: number // 0..100
  arrImpact: number // USD of ARR touched by this theme
  accountIds: ID[]
  opportunityId?: ID
  firstSeenISO: string
  following: boolean
  sparkline: number[] // weekly volume, oldest→newest
}

export type SignalType =
  | 'spike'
  | 'emerging-theme'
  | 'churn-risk'
  | 'sentiment-drop'
  | 'competitor-mention'

export type SignalStatus = 'new' | 'acknowledged' | 'routed' | 'resolved'

export interface Signal {
  id: ID
  type: SignalType
  title: string
  detail: string
  severity: Severity
  themeId?: ID
  accountId?: ID
  ruleId?: ID
  detectedISO: string
  status: SignalStatus
  routedTo?: string
  metricDeltaPct?: number
}

export interface Rule {
  id: ID
  name: string
  condition: string
  route: 'slack' | 'email' | 'jira' | 'none'
  routeTarget: string
  enabled: boolean
  firedCount: number
  severity: Severity
}

export type CandidateStatus =
  | 'suggested'
  | 'invited'
  | 'scheduled'
  | 'completed'
  | 'declined'

export interface ResearchCandidate {
  id: ID
  accountId: ID
  reason: string
  themeIds: ID[]
  matchScore: number // 0..100
  status: CandidateStatus
  assignedAE: string
  persona: string
  lastContactISO?: string
}

export type OppStatus = 'backlog' | 'planned' | 'in-progress' | 'shipped'

export interface Opportunity {
  id: ID
  title: string
  summary: string
  themeIds: ID[]
  impact: number // 0..100
  effort: number // 0..100 (higher = costlier)
  reachAccounts: number
  arrReach: number
  status: OppStatus
  quarter: string
  jiraKey?: string
  owner: string
  rice: number
}

export interface Answer {
  id: ID
  question: string
  answer: string
  keyPoints: string[]
  citationFeedbackIds: ID[]
  citationThemeIds: ID[]
  confidence: number // 0..1
  createdISO: string
  pinned: boolean
}

export type ReportStatus = 'draft' | 'generating' | 'ready'

export interface ReportSection {
  id: ID
  heading: string
  body: string
  kind: 'summary' | 'themes' | 'signals' | 'roi' | 'recommendations'
}

export interface Report {
  id: ID
  title: string
  period: string
  audience: 'Executive' | 'Product' | 'CS' | 'Board'
  status: ReportStatus
  createdBy: string
  createdISO: string
  sharedWith: string[]
  sections: ReportSection[]
}

export interface RoiBaseline {
  churnPreventedArr: number
  churnPreventedAccounts: number
  expansionInfluencedArr: number
  efficiencyHoursSaved: number
  efficiencyCostSaved: number
  adoptionLiftPct: number
  investmentAnnual: number
}

export interface UserProfile {
  name: string
  email: string
  role: string
  team: string
  memberSinceISO: string
}

export interface Database {
  sources: Source[]
  accounts: Account[]
  feedback: FeedbackItem[]
  themes: Theme[]
  signals: Signal[]
  rules: Rule[]
  candidates: ResearchCandidate[]
  opportunities: Opportunity[]
  answers: Answer[]
  reports: Report[]
  roi: RoiBaseline
  readNotifications: ID[]
  profile: UserProfile
}
