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
    <div>
      <label htmlFor="date-range" className="field-label">Statistics range</label>
      <select
        id="date-range"
        value={selectedRange}
        onChange={event => onRangeChange(event.target.value as DateRange)}
        className="field-control"
      >
        {Object.entries(DATE_RANGE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  )
}
