// Formatting helpers. Time is measured against the same fixed anchor the seed
// uses, so relative timestamps stay consistent with the demo data.
const NOW_ANCHOR = Date.parse('2026-08-05T12:00:00Z')

export function fmtUSD(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}k`
  return `$${Math.round(n)}`
}

export function fmtNum(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}k`
  return `${Math.round(n)}`
}

export function fmtPct(n: number, withSign = false): string {
  const r = Math.round(n)
  return `${withSign && r > 0 ? '+' : ''}${r}%`
}

export function relTime(iso: string): string {
  const diff = NOW_ANCHOR - Date.parse(iso)
  const m = Math.round(diff / 60_000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.round(h / 24)
  if (d < 7) return `${d}d ago`
  const w = Math.round(d / 7)
  if (d < 30) return `${w}w ago`
  return fmtDate(iso)
}

const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
const dateFmtYear = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export function fmtDate(iso: string, withYear = false): string {
  return (withYear ? dateFmtYear : dateFmt).format(new Date(iso))
}

export function daysUntil(iso: string): number {
  return Math.round((Date.parse(iso) - NOW_ANCHOR) / 86_400_000)
}

export function titleCase(s: string): string {
  return s.replace(/(^|[\s-])\w/g, (c) => c.toUpperCase())
}
