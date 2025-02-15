import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';

const SingleDatePicker = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(null);

//   const handleDateChange = (newDate) => {
//     setSelectedDate(newDate);
//     const formattedDate = newDate.format('D MMM, YYYY');
//     onDateSelect(formattedDate);
//   };
const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    const day = newDate.date();
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedDate = newDate.format(`${formattedDay} MMM, YYYY`);
    onDateSelect(formattedDate);
  };

  const isDateDisabled = (date) => {
    return date.isAfter(dayjs(), 'day');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        value={selectedDate}
        onChange={handleDateChange}
        views={['year', 'month', 'day']}
        // disablePast
        shouldDisableDate={isDateDisabled}
      />
    </LocalizationProvider>
  );
};

export default SingleDatePicker;