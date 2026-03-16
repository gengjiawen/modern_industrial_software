import { createFileRoute } from '@tanstack/react-router'

import { SignalTrendOverview } from '@/features/charts/SignalTrendOverview'

export const Route = createFileRoute('/messages')({
  component: MessagesRoute
})

function MessagesRoute() {
  return <SignalTrendOverview />
}
