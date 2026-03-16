import { LineChart } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { LineTrendChart } from '@/features/charts/LineTrendChart'
import { Badge } from '@/components/ui/badge'
import type { ChartPreview } from '@/features/upload/chartPreview'

type WorkbookPreviewChartProps = {
  preview: ChartPreview
}

export function WorkbookPreviewChart({ preview }: WorkbookPreviewChartProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-5">
      <LineTrendChart
        data={preview.rows}
        labelKey={preview.labelKey}
        series={preview.series.map((item) => ({
          color: item.color,
          key: item.key,
          label: item.key
        }))}
      />
      <div className="rounded-2xl border border-border/70 bg-secondary/40 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium">
          <LineChart className="size-4 text-primary" />
          {t('Detected columns')}
        </div>
        <div className="flex flex-wrap gap-2">
          {preview.series.map((item) => (
            <Badge key={item.key} variant="outline" className="rounded-full px-3 py-1">
              {item.key}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
