'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { MonthlyMetric } from '@/lib/metrics-data'

export default function TrafficChart({ data }: { data: MonthlyMetric[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="sessions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C9A24C" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#C9A24C" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="conversions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#163C34" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#163C34" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 4" stroke="rgba(201,162,76,0.15)" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0E1B2B',
              border: '1px solid rgba(201,162,76,0.3)',
              fontSize: 12,
              color: '#EDEAE2',
            }}
          />
          <Area type="monotone" dataKey="sessions" stroke="#C9A24C" fill="url(#sessions)" strokeWidth={2} />
          <Area type="monotone" dataKey="conversions" stroke="#163C34" fill="url(#conversions)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
