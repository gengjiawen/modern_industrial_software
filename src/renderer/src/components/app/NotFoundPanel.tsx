import { Link, useLocation } from '@tanstack/react-router'
import { Compass } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function NotFoundPanel() {
  const { t } = useTranslation()
  const requestedPath = useLocation({
    select: (location) => `${location.pathname}${location.searchStr}`
  })

  return (
    <Card>
      <CardContent className="flex min-h-[360px] flex-col items-center justify-center gap-5 p-8 text-center">
        <div className="rounded-full border p-4 text-muted-foreground">
          <Compass className="size-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">{t('Page not found')}</h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            {t('Page not found description')}
          </p>
          <p className="text-xs text-muted-foreground">{requestedPath}</p>
        </div>
        <Button asChild>
          <Link to="/">{t('Back to workspace')}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
