import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

export type DateRange = 'today' | 'this_week' | 'this_month' | 'this_year' | 'all_time';

interface DateRangeSelectorProps {
  selectedRange: DateRange;
  onRangeChange: (range: DateRange) => void;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  selectedRange,
  onRangeChange,
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    onRangeChange(event.target.value as DateRange);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="date-range-select-label">Date Range</InputLabel>
      <Select
        labelId="date-range-select-label"
        id="date-range-select"
        value={selectedRange}
        label="Date Range"
        onChange={handleChange}
      >
        <MenuItem value="today">Today</MenuItem>
        <MenuItem value="this_week">This Week</MenuItem>
        <MenuItem value="this_month">This Month</MenuItem>
        <MenuItem value="this_year">This Year</MenuItem>
        <MenuItem value="all_time">All Time</MenuItem>
      </Select>
    </FormControl>
  );
};