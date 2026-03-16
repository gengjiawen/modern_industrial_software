import { createFileRoute } from '@tanstack/react-router'
import { Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { PlaceholderPanel } from '@/components/app/PlaceholderPanel'

export const Route = createFileRoute('/community')({
  component: CommunityRoute
})

function CommunityRoute() {
  const { t } = useTranslation()

  return (
    <PlaceholderPanel
      icon={<Users className="size-6" />}
      title={t('Community')}
      description={t('Community description')}
    />
  )
}
