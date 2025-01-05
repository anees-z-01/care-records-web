import type { DateRange } from '../types'

export const DATE_RANGE_LABELS: Record<DateRange, string> = {
  today: 'Today',
  this_week: 'This week',
  this_month: 'This month',
  this_year: 'This year',
  all_time: 'All time',
}

interface DateRangeSelectorProps {
  selectedRange: DateRange
  onRangeChange: (range: DateRange) => void
}

export function DateRangeSelector({ selectedRange, onRangeChange }: DateRangeSelectorProps) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <label htmlFor="date-range" className="mb-1 block text-sm font-medium text-slate-700">
        Statistics range
      </label>
      <select
        id="date-range"
        value={selectedRange}
        onChange={event => onRangeChange(event.target.value as DateRange)}
        className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      >
        {Object.entries(DATE_RANGE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  )
}
