import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Screen, cx } from '../../components/ui'
import { Icon } from '../../components/icons'
import { useActions, useReports } from '../../store/hooks'

const STEPS = ['Gathering themes & signals', 'Computing value & ROI', 'Writing the narrative', 'Formatting for share']

export function ReportGenerating() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { setReportStatus } = useActions()
  const reports = useReports()
  const id = params.get('id') ?? reports.find((r) => r.status === 'generating')?.id
  const report = reports.find((r) => r.id === id)
  const [step, setStep] = useState(0)
  const done = useRef(false)

  useEffect(() => {
    if (!id || done.current) return
    done.current = true
    const timers: number[] = []
    STEPS.forEach((_, i) => timers.push(window.setTimeout(() => setStep(i), i * 500)))
    timers.push(
      window.setTimeout(() => {
        setReportStatus(id, 'ready')
        navigate(`/reports/${id}`, { replace: true })
      }, STEPS.length * 500 + 400),
    )
    return () => timers.forEach(clearTimeout)
  }, [id, navigate, setReportStatus])

  return (
    <Screen width="max-w-xl">
      <div className="flex flex-col items-center py-20 text-center">
        <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rust text-white">
          <Icon name="sparkles" size={26} />
        </span>
        <h1 className="font-display text-title text-ink">Generating your report</h1>
        <p className="mt-2 text-sm text-ink-mute">{report ? `"${report.title}"` : 'Assembling from live feedback…'}</p>

        <div className="mt-8 flex w-full max-w-sm flex-col gap-3 text-left">
          {STEPS.map((s, i) => (
            <div key={s} className={cx('flex items-center gap-3 text-sm transition-opacity', i <= step ? 'opacity-100' : 'opacity-40')}>
              <span className={cx('flex h-5 w-5 items-center justify-center rounded-full', i < step ? 'bg-sentiment-pos text-white' : i === step ? 'bg-rust text-white' : 'bg-paper-sunken text-ink-mute')}>
                {i < step ? <Icon name="check" size={12} /> : <span className={cx('h-1.5 w-1.5 rounded-full bg-current', i === step && 'animate-pulse')} />}
              </span>
              <span className={i <= step ? 'text-ink' : 'text-ink-mute'}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  )
}
