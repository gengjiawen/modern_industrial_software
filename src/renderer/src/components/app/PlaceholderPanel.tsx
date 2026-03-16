import type { ReactNode } from 'react'

import { Card, CardContent } from '@/components/ui/card'

type PlaceholderPanelProps = {
  description: string
  icon: ReactNode
  title: string
}

export function PlaceholderPanel({ description, icon, title }: PlaceholderPanelProps) {
  return (
    <Card>
      <CardContent className="flex min-h-[360px] flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="rounded-md border p-3 text-muted-foreground">{icon}</div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="max-w-xl text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
