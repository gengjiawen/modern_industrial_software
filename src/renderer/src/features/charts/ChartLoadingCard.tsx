import { Skeleton } from '@/components/ui/skeleton'

export function ChartLoadingCard() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-[340px] rounded-2xl" />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    </div>
  )
}
