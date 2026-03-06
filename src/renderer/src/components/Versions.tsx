import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function Versions() {
  const { t } = useTranslation()
  const versions = window.electron?.process?.versions

  const items = useMemo(() => {
    if (!versions) return []

    return [
      { label: t('Electron'), value: versions.electron },
      { label: t('Chromium'), value: versions.chrome },
      { label: t('Node'), value: versions.node }
    ]
  }, [t, versions])

  if (!versions) {
    return <p className="text-sm text-muted-foreground">{t('Version info unavailable')}</p>
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.label} className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">{t('Runtime component')}</p>
            </div>
            <Badge variant="outline" className="rounded-full px-3 py-1 font-mono font-normal">
              {item.value}
            </Badge>
          </div>
          {index < items.length - 1 ? <Separator /> : null}
        </div>
      ))}
    </div>
  )
}
