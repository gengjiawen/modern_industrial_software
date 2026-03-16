import { createFileRoute } from '@tanstack/react-router'

import { SettingsPage } from '@/components/settings/SettingsPage'

type SettingsSearch = {
  standalone?: '1'
}

export const Route = createFileRoute('/settings')({
  component: SettingsRoute,
  validateSearch: (search: Record<string, unknown>): SettingsSearch => ({
    standalone: search.standalone === '1' ? '1' : undefined
  })
})

function SettingsRoute() {
  return <SettingsPage />
}
