import React, { useState, useRef, useEffect } from 'react';

const Calendar = ({ onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [tempYear, setTempYear] = useState(currentDate.getFullYear());
  const [tempMonth, setTempMonth] = useState(currentDate.getMonth());

  const monthPickerRef = useRef(null);
  const yearPickerRef = useRef(null);

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  useEffect(() => {
    if (showPicker) {
      if (monthPickerRef.current) {
        monthPickerRef.current.scrollTop = tempMonth * 50;
      }
      if (yearPickerRef.current) {
        yearPickerRef.current.scrollTop = (tempYear - 1900) * 50;
      }
    }
  }, [showPicker]);

  const formatDate = (date) => {
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
  };

  const handleSave = () => {
    setCurrentDate(new Date(tempYear, tempMonth, 1));
    setSelectedDate(null);
    setShowPicker(false);
    if (typeof onClose === 'function') {
      onClose(formatDate(new Date(tempYear, tempMonth, 1)));
    }
  };

  const handleMonthYearClick = () => {
    setTempMonth(currentDate.getMonth());
    setTempYear(currentDate.getFullYear());
    setShowPicker(true);
  };

  const handleScroll = (e, setter, min, max, itemHeight) => {
    const scrollTop = e.target.scrollTop;
    const centerOffset = (e.target.clientHeight - itemHeight) / 2;
    const centeredIndex = Math.round((scrollTop + centerOffset - itemHeight / 2) / itemHeight);
    let newValue = centeredIndex + min;
    
    if (newValue > max) newValue = max;
    if (newValue < min) newValue = min;
    
    setter(newValue);
  };

  const getCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    
    let days = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= lastDate; i++) {
      days.push(i);
    }
    
    return days;
  };

  // Styles
  const styles = {
    container: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      width: '245px',
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      padding: '16px',
      position: 'relative',
    },
    header: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '16px',
      cursor: 'pointer',
    },
    monthYear: {
      color: '#4B5563',
      fontSize: '14.111px',
      fontWeight: 600,
      lineHeight: '16.933px',
      letterSpacing: '0.268px',
    },
    weekday: {
      color: '#9CA3AF',
      textAlign: 'center',
      fontSize: '9.172px',
      fontWeight: 600,
      lineHeight: '12.7px',
      letterSpacing: '-0.055px',
    },
    day: {
      color: '#4B5563',
      textAlign: 'center',
      fontSize: '12px',
      fontWeight: 500,
      lineHeight: '18px',
      padding: '4px',
    },
    saveButton: {
      color: '#FFF',
      background: '#030712',
      borderRadius: '4px',
      padding: '4px 12px',
      fontSize: '12px',
      fontWeight: 500,
      lineHeight: '18px',
      border: 'none',
      cursor: 'pointer',
    },
    footer: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '16px',
    },
    picker: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    pickerContent: {
      background: '#F3F4F6',
      borderRadius: '8px',
      width: '80%',
      maxWidth: '300px',
      maxHeight: '80%',
      display: 'flex',
      flexDirection: 'column',
    },
    pickerHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '16px',
      borderBottom: '1px solid #E5E7EB',
      background: '#FFF',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
    },
    pickerBody: {
      display: 'flex',
      height: '200px',
      position: 'relative',
      overflow: 'hidden',
      background: '#FFF',
    },
    pickerColumn: {
      flex: 1,
      overflowY: 'scroll',
      textAlign: 'center',
      msOverflowStyle: 'none',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        display: 'none'
      },
    },
    pickerItem: (isSelected) => ({
      padding: '15px 0',
      fontSize: '16px',
      color: isSelected ? '#000' : '#999',
      fontWeight: isSelected ? 'bold' : 'normal',
      backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
      transition: 'color 0.2s, font-weight 0.2s, background-color 0.2s',
    }),
    selectionIndicator: {
      position: 'absolute',
      left: '0',
      right: '0',
      top: '50%',
      height: '50px',
      transform: 'translateY(-50%)',
      borderTop: '1px solid #E5E7EB',
      borderBottom: '1px solid #E5E7EB',
      pointerEvents: 'none',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header} onClick={handleMonthYearClick}>
        <span style={styles.monthYear}>{`${monthNames[tempMonth]} ${tempYear}`}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" fill="none" style={{marginLeft: '8px'}}>
          <path d="M1.41 0.589966L6 5.16997L10.59 0.589966L12 1.99997L6 7.99997L0 1.99997L1.41 0.589966Z" fill="#4B5563"/>
        </svg>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
        {daysOfWeek.map(day => (
          <div key={day} style={styles.weekday}>{day}</div>
        ))}
        {getCalendarDays(currentDate).map((day, index) => (
          <div 
            key={index} 
            style={{
              ...styles.day,
              backgroundColor: selectedDate && day === selectedDate.getDate() ? '#E5E7EB' : 'transparent',
              cursor: 'pointer'
            }}
            onClick={() => day !== null && handleDateClick(day)}
          >
            {day !== null ? day : ''}
          </div>
        ))}
      </div>
      <div style={styles.footer}>
        <button style={styles.saveButton} onClick={handleSave}>Save</button>
      </div>
      {showPicker && (
        <div style={styles.picker}>
          <div style={styles.pickerContent}>
            <div style={styles.pickerHeader}>
              <span>{`${monthNames[tempMonth]} ${tempYear}`}</span>
              <button onClick={handleSave}>Done</button>
            </div>
            <div style={styles.pickerBody}>
              <div 
                style={styles.pickerColumn} 
                ref={monthPickerRef} 
                onScroll={(e) => handleScroll(e, setTempMonth, 0, 11, 50)}
              >
                <div style={{height: '6px', border:'1px solid red'}}></div>
                {[...Array(12)].map((_, index) => (
                  <div key={index} style={styles.pickerItem(index === tempMonth)}>
                    {monthNames[index]}
                  </div>
                ))}
                {/* <div style={{height: '75px'}}></div> */}
              </div>
              <div 
                style={styles.pickerColumn} 
                ref={yearPickerRef} 
                onScroll={(e) => handleScroll(e, setTempYear, 1900, 2100, 50)}
              >
                <div style={{height: '75px', border:'1px solid red'}}></div>
                {Array.from({length: 201}, (_, i) => i + 1900).map(year => (
                  <div key={year} style={styles.pickerItem(year === tempYear)}>
                    {year}
                  </div>
                ))}
                {/* <div style={{height: '75px'}}></div> */}
              </div>
              <div style={styles.selectionIndicator}>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;