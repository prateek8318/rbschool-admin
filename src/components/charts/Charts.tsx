import React, { useId, useState } from 'react';
import { SERIES, STATUS } from './palette';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

/*
 * Chart kit following the dataviz method:
 * - one series -> slot-1 blue, title names it, no legend
 * - part-to-whole -> segmented bar with legend + values (no donuts)
 * - ordered categories -> ordinal blue ramp
 * - status colours only when the colour means good / warning / critical
 * Values and labels always use text colours, never the series colour.
 */

const tooltipBox = 'rounded-xl bg-slate-900/90 backdrop-blur px-3 py-2 text-xs text-white shadow-xl';

// ---------------- Area trend (change over time, one series) ----------------

export const AreaTrend: React.FC<{
  data: Array<{ label: string; value: number }>;
  format?: (value: number) => string;
  valueLabel?: string;
  height?: number;
}> = ({ data, format = String, valueLabel = 'Value', height = 260 }) => {
  const id = useId().replace(/:/g, '');
  // A trend needs at least two points; with one, the number itself is the chart.
  if (data.length < 2) {
    const only = data[0];
    return (
      <div style={{ height: Math.min(height, 180) }} className="w-full flex flex-col items-center justify-center text-center">
        <div className="text-xs uppercase tracking-wider text-slate-400">{only?.label ?? ''}</div>
        <div className="text-4xl font-semibold text-slate-900 tabular mt-1">{only ? format(only.value) : '—'}</div>
        <div className="text-sm text-slate-500 mt-1">{valueLabel}</div>
        <div className="text-xs text-slate-400 mt-3">The trend appears once there is data for two or more months.</div>
      </div>
    );
  }
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`area-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SERIES.blue} stopOpacity={0.28} />
              <stop offset="100%" stopColor={SERIES.blue} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'var(--chart-axis)' }} axisLine={false} tickLine={false} dy={6} />
          <YAxis tickFormatter={(v) => format(Number(v))} tick={{ fontSize: 12, fill: 'var(--chart-axis)' }} axisLine={false} tickLine={false} width={60} />
          <Tooltip
            cursor={{ stroke: '#94a3b8', strokeWidth: 1 }}
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <div className={tooltipBox}>
                  <div className="text-slate-300">{label}</div>
                  <div className="font-semibold tabular">{valueLabel}: {format(Number(payload[0].value))}</div>
                </div>
              ) : null
            }
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={SERIES.blue}
            strokeWidth={2}
            fill={`url(#area-${id})`}
            activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff', fill: SERIES.blue }}
            dot={data.length <= 2 ? { r: 4, fill: SERIES.blue, stroke: '#fff', strokeWidth: 2 } : false}
            animationDuration={700}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// ---------------- Ranked bar list (magnitude, one series) ----------------

export const BarList: React.FC<{
  items: Array<{ key: string; label: string; value: number; sub?: string; tone?: 'default' | 'critical' }>;
  format?: (value: number) => string;
  max?: number;
  emptyText?: string;
}> = ({ items, format = String, max, emptyText = 'No data yet' }) => {
  if (!items.length) return <p className="text-sm text-slate-500 py-6 text-center">{emptyText}</p>;
  const top = max ?? Math.max(...items.map((item) => item.value), 1);
  return (
    <ul className="space-y-3.5">
      {items.map((item, index) => (
        <li key={item.key} className="group" title={`${item.label}: ${format(item.value)}`}>
          <div className="flex items-baseline justify-between gap-3 text-sm mb-1.5">
            <span className="text-slate-700 truncate">
              {item.label}
              {item.sub && <span className="text-xs text-slate-400 ml-1.5">{item.sub}</span>}
            </span>
            <span className="font-semibold text-slate-900 tabular shrink-0">{format(item.value)}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-900/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full bar-grow transition-[filter] group-hover:brightness-110"
              style={{
                width: `${Math.max(2, (item.value / top) * 100)}%`,
                background: item.tone === 'critical' ? STATUS.critical : SERIES.blue,
                animationDelay: `${index * 40}ms`,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
};

// ---------------- Segmented bar (part-to-whole, <= 6 parts) ----------------

export interface Segment {
  key: string;
  label: string;
  value: number;
  color: string;
  hint?: string;
}

export const SegmentedBar: React.FC<{ segments: Segment[]; format?: (value: number) => string; height?: number }> = ({
  segments,
  format = String,
  height = 14,
}) => {
  const [hover, setHover] = useState<string | null>(null);
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const visible = segments.filter((segment) => segment.value > 0);
  return (
    <div>
      <div className="flex w-full gap-[2px] overflow-hidden rounded-full bg-slate-900/[0.06]" style={{ height }}>
        {total === 0 ? (
          <div className="flex-1" />
        ) : (
          visible.map((segment, index) => (
            <div
              key={segment.key}
              className="h-full bar-grow first:rounded-l-full last:rounded-r-full transition-opacity"
              style={{
                width: `${(segment.value / total) * 100}%`,
                background: segment.color,
                opacity: hover && hover !== segment.key ? 0.35 : 1,
                animationDelay: `${index * 60}ms`,
              }}
              onMouseEnter={() => setHover(segment.key)}
              onMouseLeave={() => setHover(null)}
              title={`${segment.label}: ${format(segment.value)} (${Math.round((segment.value / total) * 100)}%)`}
            />
          ))
        )}
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
        {segments.map((segment) => (
          <li
            key={segment.key}
            className={`flex items-start gap-2 rounded-lg transition-opacity ${hover && hover !== segment.key ? 'opacity-50' : ''}`}
            onMouseEnter={() => setHover(segment.key)}
            onMouseLeave={() => setHover(null)}
          >
            <span className="mt-1.5 w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: segment.color }} />
            <span className="min-w-0">
              <span className="block text-xs text-slate-500">{segment.label}</span>
              <span className="block text-sm font-semibold text-slate-900 tabular">
                {format(segment.value)}
                {total > 0 && <span className="ml-1 text-xs font-normal text-slate-400">{Math.round((segment.value / total) * 100)}%</span>}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ---------------- Column chart (ordered categories) ----------------

export const Columns: React.FC<{
  data: Array<{ label: string; value: number }>;
  colors?: string[];
  valueLabel?: string;
  height?: number;
}> = ({ data, colors, valueLabel = 'Count', height = 220 }) => (
  <div style={{ height }} className="w-full">
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'var(--chart-axis)' }} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'var(--chart-axis)' }} axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: 'rgb(15 23 42 / 0.04)' }}
          content={({ active, payload, label }) =>
            active && payload?.length ? (
              <div className={tooltipBox}>
                <div className="text-slate-300">{label}</div>
                <div className="font-semibold tabular">{valueLabel}: {String(payload[0].value)}</div>
              </div>
            ) : null
          }
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={36} animationDuration={600}>
          {data.map((_, index) => (
            <Cell key={index} fill={colors?.[index] ?? SERIES.blue} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

// ---------------- Progress ring (a single percentage headline) ----------------

export const Ring: React.FC<{ value: number | null; size?: number; label?: string; tone?: 'good' | 'warning' | 'critical' | 'brand' }> = ({
  value,
  size = 112,
  label,
  tone = 'brand',
}) => {
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, value ?? 0));
  const color = tone === 'brand' ? SERIES.blue : STATUS[tone];
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgb(15 23 42 / 0.07)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct / 100)}
          style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-semibold text-slate-900 tabular">{value == null ? '—' : `${Math.round(pct)}%`}</span>
        {label && <span className="text-[11px] text-slate-500">{label}</span>}
      </div>
    </div>
  );
};
