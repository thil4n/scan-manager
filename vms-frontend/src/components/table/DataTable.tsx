import { useState, useMemo, type ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Column definition
// ---------------------------------------------------------------------------

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render: (row: T) => ReactNode;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor?: (row: T) => string;
  emptyMessage?: string;
}

type SortDir = 'asc' | 'desc';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No data available.',
}: DataTableProps<T>) {  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const col = columns.find((c) => c.key === sortKey);
      if (!col) return 0;
      const aVal = String(col.render(a));
      const bVal = String(col.render(b));
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }, [data, sortKey, sortDir, columns]);

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-gray-800 bg-gray-900 p-8 text-center text-sm text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-800">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-800 bg-gray-900/50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-400 ${
                  col.sortable ? 'cursor-pointer select-none hover:text-gray-200' : ''
                }`}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <span className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && sortKey === col.key && (
                    <span className="text-gray-300">{sortDir === 'asc' ? '↑' : '↓'}</span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/50 bg-gray-900">
          {sortedData.map((row, idx) => (
            <tr key={keyExtractor ? keyExtractor(row) : idx} className="transition-colors hover:bg-gray-800/40">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-gray-300">
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
