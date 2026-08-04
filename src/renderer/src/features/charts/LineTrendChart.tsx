import { useMemo } from 'react'
// Granular entries keep the unused marks, transforms, and their D3 modules out
// of the chart chunk.
import { d3Curve } from '@tanstack/charts/d3/shape'
import { colorLegend } from '@tanstack/charts/legend'
import { lineY } from '@tanstack/charts/line'
import { defineChart } from '@tanstack/charts/scene'
import { tooltip } from '@tanstack/charts/tooltip'
import { portal } from '@tanstack/charts/tooltip/portal'
import { scaleLinear } from '@tanstack/charts-scales/linear'
import { scalePoint } from '@tanstack/charts-scales/point'
import { Chart } from '@tanstack/react-charts'
import { curveMonotoneX } from 'd3-shape'

type ChartDatum = Record<string, number | string>

type LineTrendSeries = {
  color: string
  key: string
  label: string
}

type LineTrendChartProps = {
  ariaLabel: string
  data: ChartDatum[]
  labelKey: string
  series: LineTrendSeries[]
}

type TrendPoint = {
  label: string
  series: string
  value: number | null
}

// The surrounding card is 340px tall and pads 16px on the top and bottom edges.
const CHART_HEIGHT = 308
const MAX_AXIS_TICKS = 8
const monotone = d3Curve(curveMonotoneX)

function toRowLabels(data: ChartDatum[], labelKey: string) {
  return data.map((row, index) => {
    const label = row[labelKey]
    return label === undefined || label === '' ? `${index + 1}` : String(label)
  })
}

// A point scale offers every domain value as a tick candidate, so guides are
// sampled here to stay readable for workbooks with many rows.
function toAxisTicks(labels: string[]) {
  const unique = Array.from(new Set(labels))
  if (unique.length <= MAX_AXIS_TICKS) {
    return unique
  }

  const step = (unique.length - 1) / (MAX_AXIS_TICKS - 1)
  return Array.from({ length: MAX_AXIS_TICKS }, (_value, index) => unique[Math.round(index * step)])
}

// A null value keeps the row in place and breaks the line, so a gap in the
// source data stays a gap instead of being connected across.
function toTrendPoints(labels: string[], data: ChartDatum[], series: LineTrendSeries[]) {
  return series.flatMap((item) =>
    data.map((row, index): TrendPoint => {
      const value = row[item.key]

      return {
        label: labels[index],
        series: item.label,
        value: typeof value === 'number' ? value : null
      }
    })
  )
}

export function LineTrendChart({ ariaLabel, data, labelKey, series }: LineTrendChartProps) {
  const definition = useMemo(() => {
    const labels = toRowLabels(data, labelKey)

    return defineChart({
      marks: [
        lineY(toTrendPoints(labels, data, series), {
          x: 'label',
          y: 'value',
          z: 'series',
          strokeWidth: 2.4,
          curve: monotone
        })
      ],
      x: {
        scale: scalePoint,
        axis: {
          line: false,
          ticks: { values: toAxisTicks(labels), size: 0, padding: 10 }
        }
      },
      y: {
        scale: scaleLinear,
        nice: true,
        grid: true,
        axis: { line: false, ticks: { size: 0, padding: 10 } }
      },
      color: {
        domain: series.map((item) => item.label),
        range: series.map((item) => item.color),
        legend: colorLegend()
      },
      animate: true,
      focus: 'group-x',
      tooltip: {
        use: tooltip,
        portal,
        anchor: 'group-center',
        placement: ['top', 'right', 'left', 'bottom'],
        sort: 'color-domain'
      }
    })
  }, [data, labelKey, series])

  return (
    <div className="w-full rounded-2xl border border-border/70 bg-background/70 p-4">
      <Chart definition={definition} height={CHART_HEIGHT} ariaLabel={ariaLabel} />
    </div>
  )
}
