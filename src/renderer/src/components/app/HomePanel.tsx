import { Link } from '@tanstack/react-router'
import { Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { SignalTrendOverview } from '@/features/charts/SignalTrendOverview'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const quickStats = [
  { key: 'Pipeline lanes', value: '04' },
  { key: 'Signal groups', value: '12' },
  { key: 'Open datasets', value: '06' }
] as const

export function HomePanel() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="space-y-4">
          <div>
            <CardTitle>{t('Operations deck')}</CardTitle>
            <CardDescription>{t('Operations deck description')}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" asChild>
              <Link to="/upload">
                <Upload className="size-4" />
                {t('Upload')}
              </Link>
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {quickStats.map((stat) => (
              <div key={stat.key} className="rounded-lg border px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {t(stat.key)}
                </p>
                <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
              </div>
            ))}
          </div>
        </CardHeader>
      </Card>

      <SignalTrendOverview />
    </div>
  )
}
