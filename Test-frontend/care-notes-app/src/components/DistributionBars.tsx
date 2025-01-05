interface DistributionRow {
  key: string
  label: string
  count: number
}

export function DistributionBars({ title, rows }: { title: string; rows: DistributionRow[] }) {
  const total = rows.reduce((sum, row) => sum + row.count, 0)

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {total === 0 ? (
        <p className="py-4 text-center text-sm text-slate-500">No notes in this range.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map(row => {
            const percentage = (row.count / total) * 100
            return (
              <li key={row.key}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{row.label}</span>
                  <span className="text-slate-500">{row.count} ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100" aria-hidden="true">
                  <div className="h-2 rounded-full bg-teal-600" style={{ width: `${percentage}%` }} />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
