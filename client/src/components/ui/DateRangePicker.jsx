import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import './DateRangePicker.css';

export const DateRangePicker = ({ value, onChange, disabled = [] }) => {
  const [range, setRange] = useState(value);

  const handleSelect = (selected) => {
    setRange(selected);
    onChange?.(selected);
  };

  return (
    <div className="premium-calendar rounded-lg border border-gold/30 bg-black/30 p-4">
      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
        disabled={disabled}
        showOutsideDays={false}
        footer={
          range?.from
            ? `${range.from.toDateString()}${range.to ? ` – ${range.to.toDateString()}` : ''}`
            : 'Pick a date range'
        }
      />
    </div>
  );
};
