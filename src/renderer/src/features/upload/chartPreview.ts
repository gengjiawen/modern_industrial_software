export type WorksheetRow = Record<string, unknown>
type ChartRow = Record<string, number | string>
type ChartSeries = { color: string; key: string }

export type ChartPreview = {
  labelKey: string
  rows: ChartRow[]
  series: ChartSeries[]
}

export const MAX_FILE_SIZE = 50 * 1024 ** 2
export const MAX_FILE_SIZE_MB = 50

const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)'
]

export function isSpreadsheetFile(file: File) {
  return /\.(xlsx|xls)$/i.test(file.name)
}

function normalizeNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const normalized = value.replace(/,/g, '').trim()
    if (!normalized) {
      return null
    }

    const parsed = Number(normalized)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return null
}

export function buildChartPreview(rows: WorksheetRow[]): ChartPreview | null {
  if (!rows.length) {
    return null
  }

  const keys = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row).forEach((key) => set.add(key))
      return set
    }, new Set<string>())
  )

  const numericKeys = keys.filter((key) => {
    let numericCount = 0

    for (const row of rows) {
      if (normalizeNumber(row[key]) !== null) {
        numericCount += 1
      }

      if (numericCount >= 2) {
        return true
      }
    }

    return false
  })

  if (!numericKeys.length) {
    return null
  }

  const labelKey =
    keys.find((key) =>
      rows.some((row) => typeof row[key] === 'string' && String(row[key]).trim())
    ) ?? keys[0]

  const series = numericKeys.slice(0, CHART_COLORS.length).map((key, index) => ({
    color: CHART_COLORS[index],
    key
  }))

  const chartRows = rows
    .map((row, index) => {
      const labelValue = row[labelKey]
      const nextRow: ChartRow = {
        [labelKey]: labelValue ? String(labelValue) : `${index + 1}`
      }

      let hasNumericValue = false

      for (const item of series) {
        const value = normalizeNumber(row[item.key])
        if (value !== null) {
          nextRow[item.key] = value
          hasNumericValue = true
        }
      }

      return hasNumericValue ? nextRow : null
    })
    .filter((row): row is ChartRow => row !== null)

  if (!chartRows.length) {
    return null
  }

  return {
    labelKey,
    rows: chartRows,
    series
  }
}
