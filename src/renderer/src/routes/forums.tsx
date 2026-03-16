import { createFileRoute } from '@tanstack/react-router'
import { PanelsTopLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { PlaceholderPanel } from '@/components/app/PlaceholderPanel'

export const Route = createFileRoute('/forums')({
  component: ForumsRoute
})

function ForumsRoute() {
  const { t } = useTranslation()

  return (
    <PlaceholderPanel
      icon={<PanelsTopLeft className="size-6" />}
      title={t('Forums')}
      description={t('Forums description')}
    />
  )
}
