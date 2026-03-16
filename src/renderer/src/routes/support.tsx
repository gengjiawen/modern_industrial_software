import { createFileRoute } from '@tanstack/react-router'
import { ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { PlaceholderPanel } from '@/components/app/PlaceholderPanel'

export const Route = createFileRoute('/support')({
  component: SupportRoute
})

function SupportRoute() {
  const { t } = useTranslation()

  return (
    <PlaceholderPanel
      icon={<ShieldCheck className="size-6" />}
      title={t('Support')}
      description={t('Support description')}
    />
  )
}
