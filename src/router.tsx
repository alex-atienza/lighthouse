import { createHashRouter, Navigate } from 'react-router-dom'
import { AppShell } from './components/shell/AppShell'
import { AskHome } from './screens/ask/AskHome'
import { AnswerScreen } from './screens/ask/AnswerScreen'
import { SourcesEvidence } from './screens/ask/SourcesEvidence'
import { Thread } from './screens/ask/Thread'
import { SavedAnswers } from './screens/ask/SavedAnswers'
import { ThemesExplorer } from './screens/themes/ThemesExplorer'
import { ThemeDetail } from './screens/themes/ThemeDetail'
import { ThemesLibrary } from './screens/themes/ThemesLibrary'
import { ThemesFollowing } from './screens/themes/ThemesFollowing'
import { ThemesDigest } from './screens/themes/ThemesDigest'
import { SignalsFeed } from './screens/signals/SignalsFeed'
import { SignalDetail } from './screens/signals/SignalDetail'
import { SignalsRules } from './screens/signals/SignalsRules'
import { SignalsRouting } from './screens/signals/SignalsRouting'
import { SignalsAct } from './screens/signals/SignalsAct'
import { StateOfCustomer } from './screens/executive/StateOfCustomer'
import { ProductHealth } from './screens/executive/ProductHealth'
import { WhereToFocus } from './screens/executive/WhereToFocus'
import { RevenueImpact } from './screens/executive/RevenueImpact'
import { BoardNarrative } from './screens/executive/BoardNarrative'
import { ValueDashboard } from './screens/executive/ValueDashboard'
import { ChurnPrevented } from './screens/executive/ChurnPrevented'
import { Expansion } from './screens/executive/Expansion'
import { Efficiency } from './screens/executive/Efficiency'
import { BusinessCase } from './screens/executive/BusinessCase'
import { ReportsOverview } from './screens/reports/ReportsOverview'
import { ReportBuilder } from './screens/reports/ReportBuilder'
import { ReportGenerating } from './screens/reports/ReportGenerating'
import { ReportView } from './screens/reports/ReportView'
import { ReportShare } from './screens/reports/ReportShare'
import { PrioritizeBoard } from './screens/prioritize/PrioritizeBoard'
import { OpportunityDetail } from './screens/prioritize/OpportunityDetail'
import { ImpactEffort } from './screens/prioritize/ImpactEffort'
import { Roadmap } from './screens/prioritize/Roadmap'
import { JiraSync } from './screens/prioritize/JiraSync'
import { Outcomes } from './screens/prioritize/Outcomes'
import { ResearchPipeline } from './screens/research/ResearchPipeline'
import { FindCandidates } from './screens/research/FindCandidates'
import { Matches } from './screens/research/Matches'
import { CandidateProfile } from './screens/research/CandidateProfile'
import { NotifyAE } from './screens/research/NotifyAE'
import { SourcesOverview } from './screens/sources/SourcesOverview'
import { Connect } from './screens/sources/Connect'
import { Pipeline } from './screens/sources/Pipeline'
import { Taxonomy } from './screens/sources/Taxonomy'
import { Coverage } from './screens/sources/Coverage'
import { Notifications } from './screens/system/Notifications'
import { Settings } from './screens/system/Settings'
import { Account } from './screens/system/Account'
import { Help } from './screens/system/Help'

// All 46 Direction A screens. Built screens map to real components; the rest use
// the path-aware Placeholder until their turn in the build.
export const router = createHashRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/ask" replace /> },

      // 1 · Ask
      { path: 'ask', element: <AskHome /> },
      { path: 'ask/answer', element: <AnswerScreen /> },
      { path: 'ask/answer/sources', element: <SourcesEvidence /> },
      { path: 'ask/thread', element: <Thread /> },
      { path: 'ask/saved', element: <SavedAnswers /> },

      // 2 · Themes
      { path: 'themes', element: <ThemesExplorer /> },
      { path: 'themes/library', element: <ThemesLibrary /> },
      { path: 'themes/following', element: <ThemesFollowing /> },
      { path: 'themes/digest', element: <ThemesDigest /> },
      { path: 'themes/:id', element: <ThemeDetail /> },

      // 3 · Signals
      { path: 'signals', element: <SignalsFeed /> },
      { path: 'signals/rules', element: <SignalsRules /> },
      { path: 'signals/routing', element: <SignalsRouting /> },
      { path: 'signals/act', element: <SignalsAct /> },
      { path: 'signals/:id', element: <SignalDetail /> },

      // 4 · Executive (WF8 Command Center + WF9 Value & ROI)
      { path: 'executive', element: <StateOfCustomer /> },
      { path: 'executive/health', element: <ProductHealth /> },
      { path: 'executive/focus', element: <WhereToFocus /> },
      { path: 'executive/revenue', element: <RevenueImpact /> },
      { path: 'executive/narrative', element: <BoardNarrative /> },
      { path: 'executive/value', element: <ValueDashboard /> },
      { path: 'executive/value/churn', element: <ChurnPrevented /> },
      { path: 'executive/value/expansion', element: <Expansion /> },
      { path: 'executive/value/efficiency', element: <Efficiency /> },
      { path: 'executive/value/business-case', element: <BusinessCase /> },

      // 5 · Reports
      { path: 'reports', element: <ReportsOverview /> },
      { path: 'reports/builder', element: <ReportBuilder /> },
      { path: 'reports/generating', element: <ReportGenerating /> },
      { path: 'reports/:id', element: <ReportView /> },
      { path: 'reports/:id/share', element: <ReportShare /> },

      // 6 · Prioritize
      { path: 'prioritize', element: <PrioritizeBoard /> },
      { path: 'prioritize/matrix', element: <ImpactEffort /> },
      { path: 'prioritize/roadmap', element: <Roadmap /> },
      { path: 'prioritize/sync', element: <JiraSync /> },
      { path: 'prioritize/outcomes', element: <Outcomes /> },
      { path: 'prioritize/:id', element: <OpportunityDetail /> },

      // 7 · Research
      { path: 'research', element: <ResearchPipeline /> },
      { path: 'research/find', element: <FindCandidates /> },
      { path: 'research/matches', element: <Matches /> },
      { path: 'research/:id', element: <CandidateProfile /> },
      { path: 'research/:id/notify', element: <NotifyAE /> },

      // 8 · Sources
      { path: 'sources', element: <SourcesOverview /> },
      { path: 'sources/connect', element: <Connect /> },
      { path: 'sources/pipeline', element: <Pipeline /> },
      { path: 'sources/taxonomy', element: <Taxonomy /> },
      { path: 'sources/coverage', element: <Coverage /> },

      // System / chrome
      { path: 'notifications', element: <Notifications /> },
      { path: 'settings', element: <Settings /> },
      { path: 'account', element: <Account /> },
      { path: 'help', element: <Help /> },

      { path: '*', element: <Navigate to="/ask" replace /> },
    ],
  },
])
