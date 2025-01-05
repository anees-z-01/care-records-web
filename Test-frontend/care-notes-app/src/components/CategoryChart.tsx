import { DistributionBars } from "./DistributionBars"

export function CategoryChart({ data }: { data: Record<string, number> }) {
  const rows = Object.entries(data)
    .sort(([, a], [, b]) => b - a)
    .map(([category, count]) => ({ key: category, label: category.charAt(0).toUpperCase() + category.slice(1), count }))
  return <DistributionBars title="Notes by category" rows={rows} />
}
