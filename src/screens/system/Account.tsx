import { Link, useNavigate } from 'react-router-dom'
import { Avatar, Button, Card, PageHeader, Screen, StatTile } from '../../components/ui'
import { Icon } from '../../components/icons'
import { useFx } from '../../components/fx'
import { initialsFor } from '../../config/user'
import { useAnswers, useProfile, useReports, useSignals, useThemes } from '../../store/hooks'
import { fmtDate } from '../../lib/format'

export function Account() {
  const fx = useFx()
  const navigate = useNavigate()
  const profile = useProfile()
  const answers = useAnswers()
  const following = useThemes({ following: true })
  const reports = useReports()
  const signals = useSignals({})
  const handled = signals.filter((s) => s.status === 'resolved' || s.status === 'routed').length
  const saved = answers.filter((a) => a.pinned)

  return (
    <Screen width="max-w-3xl">
      <PageHeader kicker="Account" title="Your profile" />

      <Card className="flex items-center gap-4 p-6">
        <Avatar initials={initialsFor(profile.name)} size={64} />
        <div className="flex-1">
          <div className="font-display text-heading text-ink">{profile.name}</div>
          <div className="text-sm text-ink-mute">
            {profile.role} · {profile.team}
          </div>
          <div className="mt-0.5 text-xs text-ink-faint">Member since {fmtDate(profile.memberSinceISO, true)}</div>
        </div>
        <Button variant="secondary" icon="sliders" onClick={() => navigate('/settings')}>
          Edit profile
        </Button>
      </Card>

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Questions asked" value={answers.length} icon="sparkles" />
        <StatTile label="Following" value={following.length} icon="layers" />
        <StatTile label="Reports" value={reports.length} icon="file-text" />
        <StatTile label="Signals handled" value={handled} icon="activity" />
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <div className="mb-2 text-sm font-semibold text-ink">Saved answers</div>
          <div className="flex flex-col gap-2">
            {saved.length === 0 && <div className="text-sm text-ink-mute">No saved answers yet.</div>}
            {saved.map((a) => (
              <Link key={a.id} to={`/ask/answer?id=${a.id}`} className="card flex items-center justify-between gap-2 p-3 text-sm text-ink transition-shadow hover:shadow-raised">
                <span className="truncate">{a.question}</span>
                <Icon name="chevron-right" size={14} className="shrink-0 text-ink-faint" />
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 text-sm font-semibold text-ink">Following</div>
          <div className="flex flex-col gap-2">
            {following.length === 0 && <div className="text-sm text-ink-mute">Not following any themes.</div>}
            {following.map((t) => (
              <Link key={t.id} to={`/themes/${t.id}`} className="card flex items-center justify-between gap-2 p-3 text-sm text-ink transition-shadow hover:shadow-raised">
                <span className="truncate">{t.title}</span>
                <Icon name="chevron-right" size={14} className="shrink-0 text-ink-faint" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Screen>
  )
}
