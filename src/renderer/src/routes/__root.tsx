import { createRootRoute } from '@tanstack/react-router'

import { AppShell } from '@/components/app/AppShell'
import { NotFoundPanel } from '@/components/app/NotFoundPanel'

export const Route = createRootRoute({
  component: AppShell,
  notFoundComponent: NotFoundPanel
})
