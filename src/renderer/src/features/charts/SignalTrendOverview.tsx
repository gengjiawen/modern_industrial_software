import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Activity, Gauge, Layers3 } from 'lucide-react'

import { LineTrendChart } from '@/features/charts/LineTrendChart'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const data = [
  { date: '02:00', throughput: 124, energy: 68, yield: 92 },
  { date: '04:00', throughput: 138, energy: 72, yield: 94 },
  { date: '06:00', throughput: 142, energy: 70, yield: 93 },
  { date: '08:00', throughput: 156, energy: 76, yield: 95 },
  { date: '10:00', throughput: 149, energy: 74, yield: 94 },
  { date: '12:00', throughput: 163, energy: 79, yield: 96 }
]

export function SignalTrendOverview() {
  const { t } = useTranslation()

  const series = useMemo(
    () => [
      {
        color: 'var(--chart-2)',
        icon: Activity,
        key: 'throughput',
        label: t('Throughput')
      },
      {
        color: 'var(--chart-1)',
        icon: Gauge,
        key: 'energy',
        label: t('Energy')
      },
      {
        color: 'var(--chart-4)',
        icon: Layers3,
        key: 'yield',
        label: t('Yield')
      }
    ],
    [t]
  )

  return (
    <Card className="overflow-hidden border-border/70 bg-card/90 shadow-lg shadow-black/5 backdrop-blur">
      <CardHeader className="gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full px-3 py-1">{t('Latest shift')}</Badge>
            <Badge variant="outline" className="rounded-full px-3 py-1">
              {t('Preview dataset')}
            </Badge>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl tracking-tight">{t('Signal trend overview')}</CardTitle>
            <CardDescription className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {t('Signal trend overview description')}
            </CardDescription>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {series.map((item) => {
            const Icon = item.icon
            const latestValue = data[data.length - 1]?.[item.key as keyof (typeof data)[number]]

            return (
              <div
                key={item.key}
                className="rounded-2xl border border-border/70 bg-secondary/50 px-4 py-3"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className="size-4" style={{ color: item.color }} />
                  <span>{item.label}</span>
                </div>
                <p className="mt-2 text-2xl font-semibold tracking-tight">{latestValue}</p>
              </div>
            )
          })}
        </div>
      </CardHeader>
      <CardContent>
        <LineTrendChart data={data} labelKey="date" series={series} />
      </CardContent>
    </Card>
  )
}
