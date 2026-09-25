// The signed-in user — shared across the top bar, account menu, and profile/settings.
export const USER = {
  name: 'Hanan Alnizami',
  firstName: 'Hanan',
  role: 'Product',
  email: 'hanan@newrelic.com',
  team: 'Voice of the Customer',
  initials: 'HA',
  memberSinceISO: '2026-02-03T00:00:00Z',
}

// Derive initials from a (possibly edited) display name.
export function initialsFor(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || 'NR'
  )
}
