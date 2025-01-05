import { DistributionBars } from "./DistributionBars"

const PRIORITIES = [1, 2, 3, 4, 5]

// The API does not define whether 1 or 5 is most urgent, so priorities are
// shown as plain numbers with one neutral colour rather than a severity scale.
export function PriorityDistribution({ data }: { data: Record<number, number> }) {
  const rows = PRIORITIES.map(priority => ({ key: String(priority), label: `Priority ${priority}`, count: data[priority] ?? 0 }))
  return <DistributionBars title="Notes by priority" rows={rows} />
}
