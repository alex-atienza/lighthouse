import { useNavigate } from 'react-router-dom'
import { Button, EmptyState, PageHeader, Screen, Pill } from '../../components/ui'
import { SegmentPill } from '../../components/domain'
import { Sparkline, TrendBadge } from '../../components/ui'
import { Icon } from '../../components/icons'
import { useActions, useThemes } from '../../store/hooks'
import { fmtUSD } from '../../lib/format'

export function ThemesFollowing() {
  const following = useThemes({ following: true, sort: 'trend' })
  const { followTheme } = useActions()
  const navigate = useNavigate()

  return (
    <Screen>
      <PageHeader
        kicker="Themes"
        title="Following"
        subtitle="Themes you're tracking. You'll see these in your weekly digest and get signals when they move."
      />
      {following.length === 0 ? (
        <EmptyState
          icon="layers"
          title="You're not following any themes yet"
          body="Follow themes from the explorer to keep an eye on the ones that matter."
          action={<Button variant="primary" onClick={() => navigate('/themes')}>Browse themes</Button>}
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {following.map((t) => (
            <div key={t.id} className="card flex items-center gap-4 p-4">
              <button className="min-w-0 flex-1 text-left" onClick={() => navigate(`/themes/${t.id}`)}>
                <div className="flex items-center gap-2">
                  <span className="font-display text-[16px] text-ink">{t.title}</span>
                  <TrendBadge pct={t.volumeTrendPct} />
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-ink-mute">
                  <Pill tone={t.sentiment === 'positive' ? 'positive' : t.sentiment === 'negative' ? 'negative' : 'neutral'}>
                    {t.category}
                  </Pill>
                  {t.volume} mentions · {fmtUSD(t.arrImpact)} ARR
                </div>
              </button>
              <Sparkline data={t.sparkline} width={90} height={30} tone={t.sentiment === 'positive' ? '#3E7D5A' : '#B4451F'} />
              <Button variant="ghost" size="sm" icon="check" onClick={() => followTheme(t.id, false)}>
                Following
              </Button>
            </div>
          ))}
        </div>
      )}
    </Screen>
  )
}
