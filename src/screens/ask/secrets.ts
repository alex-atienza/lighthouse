import type { Answer } from '../../data/types'

export interface Secret extends Answer {
  beam?: boolean
}

const mk = (question: string, answer: string, keyPoints: string[], beam = false): Secret => ({
  id: 'secret',
  question,
  answer,
  keyPoints,
  citationFeedbackIds: [],
  citationThemeIds: [],
  confidence: 1,
  createdISO: '2026-08-05T12:00:00Z',
  pinned: false,
  beam,
})

// Hidden playful answers for certain prompts. Returns null for normal questions.
export function getSecret(q: string): Secret | null {
  const s = q.trim().toLowerCase()

  if (/who (built|made|created|designed)|who are you|what are you/.test(s))
    return mk(
      'Who built Lighthouse?',
      "Lighthouse is a Voice-of-the-Customer prototype for **New Relic**, brought to life as a fully clickable app. Every screen is real React; the “AI” here is a warm, deterministic stand-in so the story stays consistent for the demo. Think of me as the lighthouse keeper — I point the beam, you steer the ship. 🗼",
      ['A faithful front-end build of Direction A', 'No real backend — one coherent seeded dataset', 'The keeper is always on watch'],
      true,
    )

  if (/meaning of life|answer to everything|\b42\b/.test(s))
    return mk(
      'The meaning of life?',
      "**42.** But if you're asking what your customers *actually* want — that one I can source. Try asking about churn risk, or the fastest-growing themes.",
      ['42', '…though customer truth beats cosmic truth', 'Ask me something sourced next'],
    )

  if (/^(hi|hey|hello|yo|sup|howdy)\b/.test(s))
    return mk(
      'Hello 👋',
      "Hello! I'm Lighthouse. I read every ticket, call, review, and survey so you don't have to. Ask me what's driving churn, which themes are heating up, or where to focus next.",
      ['Try: “what is driving churn risk this quarter?”', 'Or: “which themes are growing fastest?”'],
    )

  if (/light the way|lighthouse|beam|keeper|guide me/.test(s))
    return mk(
      'Light the way',
      "Consider the beam lit. When the sea of feedback gets loud, the point of a lighthouse isn't to shout back — it's to show you exactly where the rocks are. Tonight, watch three: **alert noise**, **pricing**, and **dashboard performance**.",
      ['Beam engaged 🗼', 'Watch: alert noise · pricing · dashboard perf', 'Steer toward the quick wins'],
      true,
    )

  return null
}
