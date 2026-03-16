import { lazy, Suspense, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, FileSpreadsheet, LineChart, UploadCloud } from 'lucide-react'
import { read, utils } from 'xlsx'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartLoadingCard } from '@/features/charts/ChartLoadingCard'
import {
  MAX_FILE_SIZE,
  MAX_FILE_SIZE_MB,
  buildChartPreview,
  isSpreadsheetFile,
  type WorksheetRow
} from '@/features/upload/chartPreview'
import { cn } from '@/lib/utils'

const LazyWorkbookPreviewChart = lazy(async () => {
  const module = await import('@/features/charts/WorkbookPreviewChart')

  return { default: module.WorkbookPreviewChart }
})

export function UploadPage() {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')
  const [sheetName, setSheetName] = useState('')
  const [rows, setRows] = useState<WorksheetRow[]>([])

  const chartPreview = useMemo(() => buildChartPreview(rows), [rows])
  const columns = useMemo(() => {
    const values = rows.flatMap((row) => Object.keys(row))
    return Array.from(new Set(values))
  }, [rows])

  async function handleFile(file: File) {
    setError('')
    setFileName(file.name)

    if (!isSpreadsheetFile(file)) {
      setRows([])
      setSheetName('')
      setError(t('Spreadsheet format error'))
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setRows([])
      setSheetName('')
      setError(t('Spreadsheet size error', { size: MAX_FILE_SIZE_MB }))
      return
    }

    try {
      const workbook = read(await file.arrayBuffer(), { type: 'array' })
      const selectedSheet = workbook.SheetNames.includes('SDD21') ? 'SDD21' : workbook.SheetNames[0]

      if (!selectedSheet) {
        setRows([])
        setSheetName('')
        setError(t('Workbook empty error'))
        return
      }

      const worksheet = workbook.Sheets[selectedSheet]
      const nextRows = utils.sheet_to_json<WorksheetRow>(worksheet, { defval: '' })

      setSheetName(selectedSheet)
      setRows(nextRows)
    } catch {
      setRows([])
      setSheetName('')
      setError(t('Workbook read error'))
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <Card className="overflow-hidden border-border/70 bg-card/90 shadow-lg shadow-black/5 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-2">
              <Badge className="rounded-full px-3 py-1">{t('Upload')}</Badge>
              <CardTitle className="text-2xl tracking-tight">
                {t('Drop your workbook here')}
              </CardTitle>
              <CardDescription className="leading-6">
                {t('Drop your workbook here description')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) {
                void handleFile(file)
              }
            }}
          />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault()
              setIsDragging(false)
              const file = event.dataTransfer.files?.[0]
              if (file) {
                void handleFile(file)
              }
            }}
            className={cn(
              'flex min-h-[260px] w-full flex-col items-center justify-center gap-4 rounded-3xl border border-dashed px-6 py-10 text-center transition-colors',
              isDragging
                ? 'border-primary bg-primary/8 text-primary'
                : 'border-border/80 bg-secondary/40 hover:border-primary/60 hover:bg-secondary/70'
            )}
          >
            <div className="rounded-full border border-border/70 bg-background/80 p-4 shadow-sm">
              <UploadCloud className="size-8" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {isDragging ? t('Drop to analyze') : t('Browse files')}
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                {isDragging
                  ? t('Drop to analyze description')
                  : t('Browse files description', { size: MAX_FILE_SIZE_MB })}
              </p>
            </div>
          </button>

          {error ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/8 p-4 text-sm text-destructive">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <p>{error}</p>
              </div>
            </div>
          ) : null}

          <div className="space-y-3 rounded-2xl border border-border/70 bg-secondary/40 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileSpreadsheet className="size-4 text-primary" />
              {t('Selection summary')}
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {t('Selected file')}: {fileName || t('None')}
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {t('Sheet')}: {sheetName || t('Pending')}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border/70 bg-card/90 shadow-lg shadow-black/5 backdrop-blur">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {t('Workbook preview')}
              </Badge>
              <CardTitle className="text-2xl tracking-tight">{t('Series preview')}</CardTitle>
              <CardDescription className="leading-6">
                {t('Series preview description')}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {t('Rows')}: {rows.length}
              </Badge>
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {t('Columns')}: {columns.length}
              </Badge>
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {t('Detected signals')}: {chartPreview?.series.length ?? 0}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {chartPreview ? (
            <Suspense fallback={<ChartLoadingCard />}>
              <LazyWorkbookPreviewChart preview={chartPreview} />
            </Suspense>
          ) : rows.length ? (
            <div className="flex min-h-[340px] flex-col items-center justify-center gap-4 rounded-2xl border border-border/70 bg-background/70 p-8 text-center">
              <div className="rounded-full border border-border/70 bg-secondary/70 p-4 text-primary">
                <LineChart className="size-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold tracking-tight">{t('No chartable data')}</h3>
                <p className="max-w-md text-sm leading-6 text-muted-foreground">
                  {t('No chartable data description')}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {columns.slice(0, 8).map((column) => (
                  <Badge key={column} variant="outline" className="rounded-full px-3 py-1">
                    {column}
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex min-h-[340px] flex-col items-center justify-center gap-4 rounded-2xl border border-border/70 bg-background/70 p-8 text-center">
              <div className="rounded-full border border-border/70 bg-secondary/70 p-4 text-primary">
                <FileSpreadsheet className="size-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold tracking-tight">{t('Preview idle title')}</h3>
                <p className="max-w-md text-sm leading-6 text-muted-foreground">
                  {t('Preview idle description')}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
