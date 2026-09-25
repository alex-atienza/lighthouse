import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react'
import type {
  Answer,
  Database,
  Opportunity,
  Report,
  ResearchCandidate,
  Signal,
  Source,
  UserProfile,
} from '../data/types'
import { seedDatabase } from '../data/seed'

export type Action =
  | { type: 'SIGNAL_STATUS'; id: string; status: Signal['status']; routedTo?: string }
  | { type: 'TOGGLE_RULE'; id: string }
  | { type: 'FOLLOW_THEME'; id: string; following: boolean }
  | { type: 'OPP_STATUS'; id: string; status: Opportunity['status'] }
  | { type: 'CANDIDATE_STATUS'; id: string; status: ResearchCandidate['status'] }
  | { type: 'SAVE_ANSWER'; answer: Answer }
  | { type: 'PIN_ANSWER'; id: string; pinned: boolean }
  | { type: 'SOURCE_STATUS'; id: string; status: Source['status'] }
  | { type: 'REPORT_STATUS'; id: string; status: Report['status'] }
  | { type: 'ADD_REPORT'; report: Report }
  | { type: 'UPDATE_PROFILE'; patch: Partial<UserProfile> }
  | { type: 'MARK_NOTIF_READ'; id: string }
  | { type: 'MARK_NOTIFS_READ'; ids: string[] }
  | { type: 'RESET' }

interface StoreValue {
  db: Database
  dispatch: Dispatch<Action>
}

const StoreContext = createContext<StoreValue | null>(null)

function reducer(db: Database, action: Action): Database {
  switch (action.type) {
    case 'SIGNAL_STATUS':
      return {
        ...db,
        signals: db.signals.map((s) =>
          s.id === action.id ? { ...s, status: action.status, routedTo: action.routedTo ?? s.routedTo } : s,
        ),
      }
    case 'TOGGLE_RULE':
      return { ...db, rules: db.rules.map((r) => (r.id === action.id ? { ...r, enabled: !r.enabled } : r)) }
    case 'FOLLOW_THEME':
      return { ...db, themes: db.themes.map((t) => (t.id === action.id ? { ...t, following: action.following } : t)) }
    case 'OPP_STATUS':
      return { ...db, opportunities: db.opportunities.map((o) => (o.id === action.id ? { ...o, status: action.status } : o)) }
    case 'CANDIDATE_STATUS':
      return { ...db, candidates: db.candidates.map((c) => (c.id === action.id ? { ...c, status: action.status } : c)) }
    case 'SAVE_ANSWER':
      return { ...db, answers: [action.answer, ...db.answers.filter((a) => a.id !== action.answer.id)] }
    case 'PIN_ANSWER':
      return { ...db, answers: db.answers.map((a) => (a.id === action.id ? { ...a, pinned: action.pinned } : a)) }
    case 'SOURCE_STATUS':
      return { ...db, sources: db.sources.map((s) => (s.id === action.id ? { ...s, status: action.status } : s)) }
    case 'REPORT_STATUS':
      return { ...db, reports: db.reports.map((r) => (r.id === action.id ? { ...r, status: action.status } : r)) }
    case 'ADD_REPORT':
      return { ...db, reports: [action.report, ...db.reports] }
    case 'UPDATE_PROFILE':
      return { ...db, profile: { ...db.profile, ...action.patch } }
    case 'MARK_NOTIF_READ':
      return db.readNotifications.includes(action.id) ? db : { ...db, readNotifications: [...db.readNotifications, action.id] }
    case 'MARK_NOTIFS_READ':
      return { ...db, readNotifications: [...new Set([...db.readNotifications, ...action.ids])] }
    case 'RESET':
      return seedDatabase()
    default:
      return db
  }
}

export function LighthouseProvider({ children }: { children: ReactNode }) {
  const [db, dispatch] = useReducer(reducer, undefined, seedDatabase)
  const value = useMemo(() => ({ db, dispatch }), [db])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within LighthouseProvider')
  return ctx
}
