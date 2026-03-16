import { createFileRoute } from '@tanstack/react-router'

import { HomePanel } from '@/components/app/HomePanel'

export const Route = createFileRoute('/')({
  component: HomeRoute
})

function HomeRoute() {
  return <HomePanel />
}
