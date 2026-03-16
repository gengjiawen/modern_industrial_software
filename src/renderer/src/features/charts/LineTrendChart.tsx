import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

type ChartDatum = Record<string, number | string>

type LineTrendChartProps = {
  data: ChartDatum[]
  labelKey: string
  series: Array<{
    color: string
    key: string
    label: string
  }>
}

export function LineTrendChart({ data, labelKey, series }: LineTrendChartProps) {
  return (
    <div className="h-[340px] w-full rounded-2xl border border-border/70 bg-background/70 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis dataKey={labelKey} tickLine={false} axisLine={false} tickMargin={10} />
          <YAxis tickLine={false} axisLine={false} tickMargin={10} />
          <Tooltip
            cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
            contentStyle={{
              borderRadius: '16px',
              borderColor: 'var(--border)',
              backgroundColor: 'var(--card)'
            }}
          />
          <Legend />
          {series.map((item) => (
            <Line
              key={item.key}
              type="monotone"
              dataKey={item.key}
              name={item.label}
              stroke={item.color}
              strokeWidth={2.4}
              dot={{ r: 0 }}
              activeDot={{ r: 5, fill: item.color }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
