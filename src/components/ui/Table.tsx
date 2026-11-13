import React from 'react';
import { ChevronRight, Inbox } from 'lucide-react';

interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

const render = <T,>(col: Column<T>, item: T) =>
  col.cell ? col.cell(item) : String((item as Record<string, unknown>)[col.accessorKey as string] ?? '—');

/**
 * Desktop: a frosted data table. Mobile: each row becomes a tappable card
 * (first column as the title, the rest as label/value pairs), like an app list.
 */
export function Table<T>({ data, columns, keyExtractor, onRowClick, isLoading, emptyTitle = 'No records found', emptyDescription }: TableProps<T>) {
  const [first, ...rest] = columns;
  const detailColumns = rest.filter((col) => col.header);
  const actionColumns = rest.filter((col) => !col.header);

  const empty = !isLoading && data.length === 0 && (
    <div className="flex flex-col items-center justify-center py-14 px-4 text-center">
      <div className="w-12 h-12 rounded-2xl bg-white/80 ring-1 ring-slate-900/5 flex items-center justify-center mb-3 shadow-sm">
        <Inbox className="w-5 h-5 text-slate-400" />
      </div>
      <div className="text-sm font-medium text-slate-700">{emptyTitle}</div>
      {emptyDescription && <div className="text-sm text-slate-500 mt-1 max-w-sm">{emptyDescription}</div>}
    </div>
  );

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-900/[0.06] bg-white/40">
                {columns.map((col, idx) => (
                  <th key={idx} scope="col" className={`px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap ${col.className ?? ''}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/[0.05] stagger">
              {isLoading &&
                Array.from({ length: 6 }).map((_, row) => (
                  <tr key={`s${row}`}>
                    {columns.map((_, idx) => (
                      <td key={idx} className="px-4 py-4">
                        <div className="skeleton h-4" style={{ width: `${50 + ((row * 13 + idx * 29) % 45)}%` }} />
                      </td>
                    ))}
                  </tr>
                ))}
              {!isLoading &&
                data.map((item) => (
                  <tr
                    key={keyExtractor(item)}
                    onClick={() => onRowClick?.(item)}
                    className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-white/60' : ''}`}
                  >
                    {columns.map((col, idx) => (
                      <td key={idx} className={`px-4 py-3 whitespace-nowrap text-slate-700 ${col.className ?? ''}`}>
                        {render(col, item)}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {empty}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {isLoading &&
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="glass rounded-2xl p-4 space-y-3">
              <div className="skeleton h-5 w-2/3" />
              <div className="skeleton h-4 w-1/2" />
              <div className="skeleton h-4 w-1/3" />
            </div>
          ))}
        {!isLoading && (
          <div className="space-y-3 stagger">
            {data.map((item) => (
              <div
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={`glass rounded-2xl p-4 ${onRowClick ? 'press cursor-pointer' : ''}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1 text-[15px]">{first && render(first, item)}</div>
                  {onRowClick && <ChevronRight className="w-5 h-5 text-slate-300 shrink-0" />}
                </div>
                {detailColumns.length > 0 && (
                  <dl className="mt-3 pt-3 border-t border-slate-900/[0.06] grid grid-cols-2 gap-x-4 gap-y-2.5">
                    {detailColumns.map((col, idx) => (
                      <div key={idx} className="min-w-0">
                        <dt className="text-[11px] uppercase tracking-wide text-slate-400">{col.header}</dt>
                        <dd className="text-sm text-slate-700 mt-0.5 break-words">{render(col, item)}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {actionColumns.length > 0 && (
                  <div className="mt-3 flex justify-end gap-2" onClick={(event) => event.stopPropagation()}>
                    {actionColumns.map((col, idx) => (
                      <React.Fragment key={idx}>{render(col, item)}</React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {!isLoading && data.length === 0 && <div className="glass rounded-2xl">{empty}</div>}
      </div>
    </>
  );
}
