import { useMemo } from 'react'
import { useStore } from './LighthouseProvider'
import type { IconName } from '../components/icons'
import type {
  Account,
  Channel,
  Database,
  FeedbackItem,
  ID,
  SentimentLabel,
  Severity,
  SignalStatus,
  SignalType,
  Theme,
  ThemeTrend,
} from '../data/types'

// ---- raw db + pure resolvers ---------------------------------------------------
export function useDb(): Database {
  return useStore().db
}
export const findAccount = (db: Database, id?: ID) => db.accounts.find((a) => a.id === id)
export const findTheme = (db: Database, id?: ID) => db.themes.find((t) => t.id === id)
export const findSource = (db: Database, id?: ID) => db.sources.find((s) => s.id === id)
export const findOpportunity = (db: Database, id?: ID) => db.opportunities.find((o) => o.id === id)

// ---- entity collections & single lookups --------------------------------------
export const useSources = () => useDb().sources
export const useAccounts = () => useDb().accounts
export const useRules = () => useDb().rules
export const useReports = () => useDb().reports
export const useAnswers = () => useDb().answers
export const useProfile = () => useDb().profile

export function useAccount(id?: ID) {
  const db = useDb()
  return useMemo(() => db.accounts.find((a) => a.id === id), [db, id])
}
export function useTheme(id?: ID) {
  const db = useDb()
  return useMemo(() => db.themes.find((t) => t.id === id), [db, id])
}
export function useSignal(id?: ID) {
  const db = useDb()
  return useMemo(() => db.signals.find((s) => s.id === id), [db, id])
}
export function useOpportunity(id?: ID) {
  const db = useDb()
  return useMemo(() => db.opportunities.find((o) => o.id === id), [db, id])
}
export function useCandidate(id?: ID) {
  const db = useDb()
  return useMemo(() => db.candidates.find((c) => c.id === id), [db, id])
}
export function useReport(id?: ID) {
  const db = useDb()
  return useMemo(() => db.reports.find((r) => r.id === id), [db, id])
}
export function useAnswer(id?: ID) {
  const db = useDb()
  return useMemo(() => db.answers.find((a) => a.id === id), [db, id])
}

// ---- filtered feedback ---------------------------------------------------------
export interface FeedbackFilters {
  themeId?: ID
  accountId?: ID
  sourceId?: ID
  channel?: Channel
  sentiment?: SentimentLabel
  severity?: Severity
  search?: string
  limit?: number
}
export function useFeedback(filters: FeedbackFilters = {}) {
  const db = useDb()
  return useMemo(() => {
    let out: FeedbackItem[] = db.feedback
    if (filters.themeId) out = out.filter((f) => f.themeIds.includes(filters.themeId!))
    if (filters.accountId) out = out.filter((f) => f.accountId === filters.accountId)
    if (filters.sourceId) out = out.filter((f) => f.sourceId === filters.sourceId)
    if (filters.channel) out = out.filter((f) => f.channel === filters.channel)
    if (filters.sentiment) out = out.filter((f) => f.sentiment === filters.sentiment)
    if (filters.severity) out = out.filter((f) => f.severity === filters.severity)
    if (filters.search) {
      const q = filters.search.toLowerCase()
      out = out.filter((f) => f.text.toLowerCase().includes(q) || f.keywords.some((k) => k.includes(q)))
    }
    out = [...out].sort((a, b) => b.createdISO.localeCompare(a.createdISO))
    return filters.limit ? out.slice(0, filters.limit) : out
  }, [db, JSON.stringify(filters)])
}

// ---- filtered / sorted themes --------------------------------------------------
export type ThemeSort = 'impact' | 'volume' | 'trend' | 'recent'
export interface ThemeFilters {
  category?: string
  trend?: ThemeTrend
  sentiment?: SentimentLabel
  following?: boolean
  search?: string
  sort?: ThemeSort
}
export function useThemes(filters: ThemeFilters = {}) {
  const db = useDb()
  return useMemo(() => {
    let out: Theme[] = db.themes
    if (filters.category) out = out.filter((t) => t.category === filters.category)
    if (filters.trend) out = out.filter((t) => t.trend === filters.trend)
    if (filters.sentiment) out = out.filter((t) => t.sentiment === filters.sentiment)
    if (filters.following) out = out.filter((t) => t.following)
    if (filters.search) {
      const q = filters.search.toLowerCase()
      out = out.filter((t) => t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q))
    }
    const sort = filters.sort ?? 'impact'
    out = [...out].sort((a, b) => {
      if (sort === 'volume') return b.volume - a.volume
      if (sort === 'trend') return b.volumeTrendPct - a.volumeTrendPct
      if (sort === 'recent') return b.firstSeenISO.localeCompare(a.firstSeenISO)
      return b.impact - a.impact
    })
    return out
  }, [db, JSON.stringify(filters)])
}
export function useThemeCategories() {
  const db = useDb()
  return useMemo(() => [...new Set(db.themes.map((t) => t.category))].sort(), [db])
}

// ---- filtered signals ----------------------------------------------------------
export interface SignalFilters {
  status?: SignalStatus
  severity?: Severity
  type?: SignalType
}
export function useSignals(filters: SignalFilters = {}) {
  const db = useDb()
  return useMemo(() => {
    let out = db.signals
    if (filters.status) out = out.filter((s) => s.status === filters.status)
    if (filters.severity) out = out.filter((s) => s.severity === filters.severity)
    if (filters.type) out = out.filter((s) => s.type === filters.type)
    const sevRank: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 }
    return [...out].sort(
      (a, b) => sevRank[a.severity] - sevRank[b.severity] || b.detectedISO.localeCompare(a.detectedISO),
    )
  }, [db, JSON.stringify(filters)])
}

// ---- candidates / opportunities ------------------------------------------------
export function useCandidates() {
  const db = useDb()
  return useMemo(() => [...db.candidates].sort((a, b) => b.matchScore - a.matchScore), [db])
}
export function useOpportunities() {
  const db = useDb()
  return useMemo(() => [...db.opportunities].sort((a, b) => b.rice - a.rice), [db])
}

// ---- computed executive metrics ------------------------------------------------
export interface ProductHealth {
  area: string
  score: number
  total: number
  pos: number
  neg: number
}
export function useExecutiveMetrics() {
  const db = useDb()
  return useMemo(() => {
    const fb = db.feedback
    const total = fb.length || 1
    const pos = fb.filter((f) => f.sentiment === 'positive').length
    const neg = fb.filter((f) => f.sentiment === 'negative').length
    const neu = total - pos - neg
    const npsProxy = Math.round(((pos - neg) / total) * 100)

    const areaMap = new Map<string, { pos: number; neg: number; total: number }>()
    for (const f of fb) {
      const a = areaMap.get(f.productArea) ?? { pos: 0, neg: 0, total: 0 }
      if (f.sentiment === 'positive') a.pos++
      else if (f.sentiment === 'negative') a.neg++
      a.total++
      areaMap.set(f.productArea, a)
    }
    const productHealth: ProductHealth[] = [...areaMap.entries()]
      .map(([area, c]) => ({
        area,
        score: Math.round((((c.pos - c.neg) / c.total + 1) / 2) * 100),
        total: c.total,
        pos: c.pos,
        neg: c.neg,
      }))
      .sort((a, b) => a.score - b.score)

    const segments = (['Enterprise', 'Mid-Market', 'SMB'] as const).map((segment) => {
      const accs = db.accounts.filter((a) => a.segment === segment)
      return {
        segment,
        accounts: accs.length,
        arr: accs.reduce((s, a) => s + a.arr, 0),
        avgHealth: Math.round(accs.reduce((s, a) => s + a.health, 0) / (accs.length || 1)),
      }
    })

    const atRiskAccounts = db.accounts.filter((a) => a.health < 50).sort((a, b) => a.health - b.health)
    const arrAtRisk = atRiskAccounts.reduce((s, a) => s + a.arr, 0)
    const totalArr = db.accounts.reduce((s, a) => s + a.arr, 0)
    const criticalSignals = db.signals.filter((s) => s.severity === 'critical' && s.status !== 'resolved').length
    const topThemes = [...db.themes].sort((a, b) => b.impact - a.impact).slice(0, 6)
    const ingested = db.sources.reduce((s, x) => s + x.itemCount, 0)

    return {
      total: fb.length,
      pos,
      neg,
      neu,
      posPct: Math.round((pos / total) * 100),
      negPct: Math.round((neg / total) * 100),
      neuPct: Math.round((neu / total) * 100),
      npsProxy,
      productHealth,
      segments,
      atRiskAccounts,
      arrAtRisk,
      totalArr,
      criticalSignals,
      topThemes,
      ingested,
    }
  }, [db])
}

// ---- computed ROI --------------------------------------------------------------
export function useRoi() {
  const db = useDb()
  return useMemo(() => {
    const r = db.roi
    const annualReturn = r.churnPreventedArr + r.expansionInfluencedArr + r.efficiencyCostSaved
    const roiMultiple = Math.round((annualReturn / r.investmentAnnual) * 10) / 10
    const paybackMonths = Math.max(0.5, Math.round((r.investmentAnnual / (annualReturn / 12)) * 10) / 10)
    return { ...r, annualReturn, roiMultiple, paybackMonths }
  }, [db])
}

// ---- feedback volume time-series (for charts) ----------------------------------
export function useFeedbackTimeseries(weeks = 12) {
  const db = useDb()
  return useMemo(() => {
    const anchor = Date.parse('2026-08-05T12:00:00Z')
    const week = 7 * 86_400_000
    const buckets = Array.from({ length: weeks }, (_, i) => ({
      weekStart: anchor - (weeks - 1 - i) * week,
      label: '',
      pos: 0,
      neg: 0,
      neu: 0,
      total: 0,
    }))
    for (const f of db.feedback) {
      const t = Date.parse(f.createdISO)
      const idx = Math.floor((t - buckets[0].weekStart) / week)
      if (idx >= 0 && idx < weeks) {
        const b = buckets[idx]
        b.total++
        b[f.sentiment === 'positive' ? 'pos' : f.sentiment === 'negative' ? 'neg' : 'neu']++
      }
    }
    return buckets.map((b) => {
      const d = new Date(b.weekStart)
      return { ...b, label: `${d.getUTCMonth() + 1}/${d.getUTCDate()}` }
    })
  }, [db, weeks])
}

// ---- notifications (derived + read state) --------------------------------------
export interface NotifItem {
  id: string
  icon: IconName
  title: string
  detail: string
  iso: string
  to: string
}
export function useNotifications() {
  const db = useDb()
  return useMemo(() => {
    const list: NotifItem[] = []
    db.signals.forEach((s) =>
      list.push({ id: `n_${s.id}`, icon: 'activity', title: s.title, detail: s.detail, iso: s.detectedISO, to: `/signals/${s.id}` }),
    )
    db.reports
      .filter((r) => r.status === 'ready')
      .slice(0, 2)
      .forEach((r) =>
        list.push({ id: `n_${r.id}`, icon: 'file-text', title: `Report ready — ${r.title}`, detail: `Your ${r.audience} report has been generated.`, iso: r.createdISO, to: `/reports/${r.id}` }),
      )
    const err = db.sources.find((s) => s.status === 'error')
    if (err) list.push({ id: `n_${err.id}`, icon: 'alert-triangle', title: `${err.name} needs attention`, detail: 'Ingestion errored — reconnect to restore coverage.', iso: err.lastSyncISO, to: '/sources' })
    db.candidates
      .filter((c) => c.status === 'completed')
      .slice(0, 1)
      .forEach((c) => list.push({ id: `n_${c.id}`, icon: 'users', title: 'Research interview completed', detail: c.reason, iso: c.lastContactISO ?? '2026-08-01T00:00:00Z', to: `/research/${c.id}` }))
    list.sort((a, b) => b.iso.localeCompare(a.iso))
    const readSet = new Set(db.readNotifications)
    return { items: list, readSet, unread: list.filter((n) => !readSet.has(n.id)).length }
  }, [db])
}

// ---- bound action creators -----------------------------------------------------
export function useActions() {
  const { dispatch } = useStore()
  return useMemo(
    () => ({
      setSignalStatus: (id: string, status: SignalStatus, routedTo?: string) =>
        dispatch({ type: 'SIGNAL_STATUS', id, status, routedTo }),
      toggleRule: (id: string) => dispatch({ type: 'TOGGLE_RULE', id }),
      followTheme: (id: string, following: boolean) => dispatch({ type: 'FOLLOW_THEME', id, following }),
      setOppStatus: (id: string, status: 'backlog' | 'planned' | 'in-progress' | 'shipped') =>
        dispatch({ type: 'OPP_STATUS', id, status }),
      setCandidateStatus: (
        id: string,
        status: 'suggested' | 'invited' | 'scheduled' | 'completed' | 'declined',
      ) => dispatch({ type: 'CANDIDATE_STATUS', id, status }),
      saveAnswer: (answer: import('../data/types').Answer) => dispatch({ type: 'SAVE_ANSWER', answer }),
      pinAnswer: (id: string, pinned: boolean) => dispatch({ type: 'PIN_ANSWER', id, pinned }),
      setSourceStatus: (id: string, status: 'connected' | 'syncing' | 'error' | 'paused') =>
        dispatch({ type: 'SOURCE_STATUS', id, status }),
      setReportStatus: (id: string, status: 'draft' | 'generating' | 'ready') =>
        dispatch({ type: 'REPORT_STATUS', id, status }),
      addReport: (report: import('../data/types').Report) => dispatch({ type: 'ADD_REPORT', report }),
      markNotificationRead: (id: string) => dispatch({ type: 'MARK_NOTIF_READ', id }),
      markNotificationsRead: (ids: string[]) => dispatch({ type: 'MARK_NOTIFS_READ', ids }),
      updateProfile: (patch: Partial<import('../data/types').UserProfile>) => dispatch({ type: 'UPDATE_PROFILE', patch }),
      reset: () => dispatch({ type: 'RESET' }),
    }),
    [dispatch],
  )
}

export type { Account, FeedbackItem }
