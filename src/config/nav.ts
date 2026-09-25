import type { IconName } from '../components/icons'

export interface NavSub {
  label: string
  to: string
  end?: boolean
}
export interface NavItem {
  key: string
  label: string
  icon: IconName
  to: string
  blurb: string
  subs: NavSub[]
}

// Single source of truth for the 8-item workflow nav. Drives both the sidebar
// and (loosely) the route table. Dynamic detail routes are reached by drilling in.
export const NAV: NavItem[] = [
  {
    key: 'ask',
    label: 'Ask',
    icon: 'sparkles',
    to: '/ask',
    blurb: 'Ask anything about your customers',
    subs: [
      { label: 'Ask', to: '/ask', end: true },
      { label: 'Answer', to: '/ask/answer' },
      { label: 'Sources & Evidence', to: '/ask/answer/sources' },
      { label: 'Thread', to: '/ask/thread' },
      { label: 'Saved Answers', to: '/ask/saved' },
    ],
  },
  {
    key: 'themes',
    label: 'Themes',
    icon: 'layers',
    to: '/themes',
    blurb: 'What customers are talking about',
    subs: [
      { label: 'Explorer', to: '/themes', end: true },
      { label: 'Library', to: '/themes/library' },
      { label: 'Following', to: '/themes/following' },
      { label: 'Digest', to: '/themes/digest' },
    ],
  },
  {
    key: 'signals',
    label: 'Signals',
    icon: 'activity',
    to: '/signals',
    blurb: 'Notable changes & alerts',
    subs: [
      { label: 'Feed', to: '/signals', end: true },
      { label: 'Rules', to: '/signals/rules' },
      { label: 'Routing', to: '/signals/routing' },
      { label: 'Act', to: '/signals/act' },
    ],
  },
  {
    key: 'executive',
    label: 'Executive',
    icon: 'compass',
    to: '/executive',
    blurb: 'The customer, for the C-suite',
    subs: [
      { label: 'State of the Customer', to: '/executive', end: true },
      { label: 'Product Health', to: '/executive/health' },
      { label: 'Where to Focus', to: '/executive/focus' },
      { label: 'Revenue Impact', to: '/executive/revenue' },
      { label: 'Board Narrative', to: '/executive/narrative' },
      { label: 'Value & ROI', to: '/executive/value', end: true },
      { label: 'Churn Prevented', to: '/executive/value/churn' },
      { label: 'Expansion & Upsell', to: '/executive/value/expansion' },
      { label: 'Efficiency & Adoption', to: '/executive/value/efficiency' },
      { label: 'Business Case', to: '/executive/value/business-case' },
    ],
  },
  {
    key: 'reports',
    label: 'Reports',
    icon: 'file-text',
    to: '/reports',
    blurb: 'Shareable, sourced briefings',
    subs: [
      { label: 'Overview', to: '/reports', end: true },
      { label: 'Builder', to: '/reports/builder' },
      { label: 'Generating', to: '/reports/generating' },
    ],
  },
  {
    key: 'prioritize',
    label: 'Prioritize',
    icon: 'target',
    to: '/prioritize',
    blurb: 'Turn themes into a plan',
    subs: [
      { label: 'Board', to: '/prioritize', end: true },
      { label: 'Impact–Effort', to: '/prioritize/matrix' },
      { label: 'Roadmap', to: '/prioritize/roadmap' },
      { label: 'Jira Sync', to: '/prioritize/sync' },
      { label: 'Outcomes', to: '/prioritize/outcomes' },
    ],
  },
  {
    key: 'research',
    label: 'Research',
    icon: 'users',
    to: '/research',
    blurb: 'Find & reach the right customers',
    subs: [
      { label: 'Pipeline', to: '/research', end: true },
      { label: 'Find Candidates', to: '/research/find' },
      { label: 'Matches', to: '/research/matches' },
    ],
  },
  {
    key: 'sources',
    label: 'Sources',
    icon: 'plug',
    to: '/sources',
    blurb: 'Where feedback comes from',
    subs: [
      { label: 'Overview', to: '/sources', end: true },
      { label: 'Connect', to: '/sources/connect' },
      { label: 'Pipeline', to: '/sources/pipeline' },
      { label: 'Taxonomy', to: '/sources/taxonomy' },
      { label: 'Coverage', to: '/sources/coverage' },
    ],
  },
]

// Secondary utility links, shown beneath the workflow nav.
export const NAV_UTILITY: { label: string; to: string; icon: IconName }[] = [
  { label: 'Notifications', to: '/notifications', icon: 'bell' },
  { label: 'Settings', to: '/settings', icon: 'sliders' },
  { label: 'Help & About', to: '/help', icon: 'book-open' },
]
