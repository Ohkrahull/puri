import React, { useState, useRef, useEffect,useImperativeHandle, forwardRef } from 'react';
import Datepicker from "react-tailwindcss-datepicker";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const SortButton = forwardRef(({ onSort }, ref) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Sort Date');
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const buttonRef = useRef(null);
  const optionsRef = useRef(null);
  const calendarRef = useRef(null);
  
  const toggleOptions = () => setIsOptionsOpen(!isOptionsOpen);

  const handleOptionClick = (option) => {
    if (option === 'Custom') {
      setIsCalendarOpen(true);
      setIsOptionsOpen(false);
    } else {
      setSelectedOption(option);
      setIsOptionsOpen(false);
      setIsCalendarOpen(false);
      filterBookings(option);
    }
  };

  

  // const handleDateSelection = (newValue) => {
  //   setDateRange(newValue);
  //   if (newValue.startDate && newValue.endDate) {
  //     let startDate = dayjs(newValue.startDate);
  //     let endDate = dayjs(newValue.endDate);
      
  //     // Ensure startDate is always the earlier date
  //     if (startDate.isAfter(endDate)) {
  //       [startDate, endDate] = [endDate, startDate];
  //     }

  //     const formattedStartDate = startDate.format('DD MMM, YYYY');
  //     const formattedEndDate = endDate.format('DD MMM, YYYY');
  //     setSelectedOption(`${formattedStartDate} - ${formattedEndDate}`);
  //     onSort(startDate.format('DD MMM, YYYY'), endDate.format('DD MMM, YYYY'));
  //     setIsCalendarOpen(false);
  //   }
  // };
  const handleDateSelection = (newValue) => {
    setDateRange(newValue);
    if (newValue.startDate && newValue.endDate) {
      let startDate = dayjs(newValue.startDate);
      let endDate = dayjs(newValue.endDate);
      
      // Ensure startDate is always the earlier date
      if (startDate.isAfter(endDate)) {
        [startDate, endDate] = [endDate, startDate];
      }
  
      const formattedStartDate = startDate.format('DD MMM, YYYY');
      const formattedEndDate = endDate.format('DD MMM, YYYY');
      setSelectedOption(`${formattedStartDate} - ${formattedEndDate}`);
      onSort(formattedStartDate, formattedEndDate);
      setIsCalendarOpen(false);
    }
  };


  const filterBookings = (option) => {
    const today = dayjs();
    let startDate, endDate;

    switch(option) {
      case 'All':
        startDate = null;
        endDate = null;
        break;
      case 'Today':
        startDate = today.format('DD MMM, YYYY');
        endDate = today.format('DD MMM, YYYY');
        break;
      case 'Yesterday':
        startDate = today.subtract(1, 'day').format('DD MMM, YYYY');
        endDate = today.subtract(1, 'day').format('DD MMM, YYYY');
        break;
      case 'Last 7 days':
        startDate = today.subtract(6, 'day').format('DD MMM, YYYY');
        endDate = today.format('DD MMM, YYYY');
        break;
      case 'Last Month':
        startDate = today.subtract(1, 'month').format('DD MMM, YYYY');
        endDate = today.format('DD MMM, YYYY');
        break;
      default:
        startDate = null;
        endDate = null;
    }

    if (startDate && endDate) {
      setSelectedOption(`${startDate} - ${endDate}`);
    } else {
      setSelectedOption(option);
    }

    onSort(startDate, endDate);
  };



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target) &&
          optionsRef.current && !optionsRef.current.contains(event.target) &&
          calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsOptionsOpen(false);
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const options = ['All', 'Today', 'Yesterday', 'Last 7 days', 'Last Month', 'Custom'];

  // Calculate button width based on selected option
  const getButtonWidth = () => {
    if (selectedOption.includes('-')) {
      // For date ranges, use a larger width
      return 'auto';
    }
    return '242px'; // Default width
  };
  useImperativeHandle(ref, () => ({
    closeDropdown: () => {
      setIsOptionsOpen(false);
      setIsCalendarOpen(false);
    },
    contains: (target) => {
      return (
        buttonRef.current?.contains(target) ||
        optionsRef.current?.contains(target) ||
        calendarRef.current?.contains(target)
      );
    }
  }));
  return (
    <div ref={buttonRef} className='sm:w-[250px] md:w-[300px]'  style={{ position: 'relative', zIndex: 40 ,}}>
      <button 
        ref={buttonRef}
        onClick={toggleOptions}
        className='sm:py-4 p-3 sm:w-[300px] sm:justify-between w-full md:w-[300px] flex items-center justify-between text-base '
        style={{
          // display: 'flex',
          // width: getButtonWidth(),
          // minWidth: '242px', // Ensure a minimum width
          // padding: '12px 16px',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid #D1D5DB',
          borderRadius: '10px',
          color: '#6B7280',
          fontSize: '16px',
          // fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontFamily:'Plus_Jakarta',
          // marginLeft:'10px',
          background: '#F3F3F3',
          cursor: 'pointer',
          zIndex: 40,
          transition: 'width 0.3s ease', // Smooth transition for width changes
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden', whiteSpace: 'nowrap', }}>
          <span className='mr-3'>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M9.19254 13.3078C9.25065 13.3659 9.29674 13.4348 9.3282 13.5107C9.35965 13.5865 9.37584 13.6679 9.37584 13.75C9.37584 13.8321 9.35965 13.9135 9.3282 13.9893C9.29674 14.0652 9.25065 14.1341 9.19254 14.1922L6.69254 16.6922C6.63449 16.7503 6.56556 16.7964 6.48969 16.8279C6.41381 16.8593 6.33248 16.8755 6.25035 16.8755C6.16821 16.8755 6.08688 16.8593 6.01101 16.8279C5.93514 16.7964 5.86621 16.7503 5.80816 16.6922L3.30816 14.1922C3.25009 14.1341 3.20403 14.0652 3.1726 13.9893C3.14118 13.9134 3.125 13.8321 3.125 13.75C3.125 13.6679 3.14118 13.5866 3.1726 13.5107C3.20403 13.4348 3.25009 13.3659 3.30816 13.3078C3.42544 13.1905 3.5845 13.1247 3.75035 13.1247C3.83247 13.1247 3.91379 13.1408 3.98966 13.1723C4.06553 13.2037 4.13447 13.2497 4.19253 13.3078L5.62535 14.7414V3.75C5.62535 3.58424 5.6912 3.42527 5.80841 3.30806C5.92562 3.19085 6.08459 3.125 6.25035 3.125C6.41611 3.125 6.57508 3.19085 6.69229 3.30806C6.8095 3.42527 6.87535 3.58424 6.87535 3.75V14.7414L8.30816 13.3078C8.36621 13.2497 8.43514 13.2036 8.51101 13.1722C8.58688 13.1407 8.66821 13.1245 8.75035 13.1245C8.83248 13.1245 8.91381 13.1407 8.98969 13.1722C9.06556 13.2036 9.13449 13.2497 9.19254 13.3078ZM16.6925 5.80782L14.1925 3.30782C14.1345 3.24971 14.0656 3.20361 13.9897 3.17215C13.9138 3.1407 13.8325 3.12451 13.7503 3.12451C13.6682 3.12451 13.5869 3.1407 13.511 3.17215C13.4351 3.20361 13.3662 3.24971 13.3082 3.30782L10.8082 5.80782C10.6909 5.92509 10.625 6.08415 10.625 6.25C10.625 6.41586 10.6909 6.57492 10.8082 6.69219C10.9254 6.80947 11.0845 6.87535 11.2503 6.87535C11.4162 6.87535 11.5753 6.80947 11.6925 6.69219L13.1253 5.2586V16.25C13.1253 16.4158 13.1912 16.5747 13.3084 16.6919C13.4256 16.8092 13.5846 16.875 13.7503 16.875C13.9161 16.875 14.0751 16.8092 14.1923 16.6919C14.3095 16.5747 14.3753 16.4158 14.3753 16.25V5.2586L15.8082 6.69219C15.9254 6.80947 16.0845 6.87535 16.2503 6.87535C16.4162 6.87535 16.5753 6.80947 16.6925 6.69219C16.8098 6.57492 16.8757 6.41586 16.8757 6.25C16.8757 6.08415 16.8098 5.92509 16.6925 5.80782Z" fill="#6B7280"/>
            </svg>
          </span>
          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{selectedOption}</span>
        </div>
        <span>
          <svg className='flex text-end justify-end' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M16.2345 7.06754L9.98453 13.3175C9.92648 13.3756 9.85755 13.4217 9.78168 13.4532C9.7058 13.4847 9.62447 13.5008 9.54234 13.5008C9.46021 13.5008 9.37888 13.4847 9.303 13.4532C9.22713 13.4217 9.1582 13.3756 9.10015 13.3175L2.85015 7.06754C2.73288 6.95026 2.66699 6.7912 2.66699 6.62535C2.66699 6.4595 2.73288 6.30044 2.85015 6.18316C2.96743 6.06588 3.12649 6 3.29234 6C3.45819 6 3.61725 6.06588 3.73453 6.18316L9.54234 11.9918L15.3502 6.18316C15.4082 6.12509 15.4772 6.07903 15.553 6.0476C15.6289 6.01617 15.7102 6 15.7923 6C15.8745 6 15.9558 6.01617 16.0317 6.0476C16.1075 6.07903 16.1765 6.12509 16.2345 6.18316C16.2926 6.24123 16.3387 6.31017 16.3701 6.38604C16.4015 6.46191 16.4177 6.54323 16.4177 6.62535C16.4177 6.70747 16.4015 6.78879 16.3701 6.86466C16.3387 6.94053 16.2926 7.00947 16.2345 7.06754Z" fill="#6B7280"/>
          </svg>
        </span>
      </button>

      {isOptionsOpen && (
        <div 
          ref={optionsRef}
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: '10px',
            // zIndex: 1050,
            zIndex: 9999, // Increase this value
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            backgroundColor: 'white',
            borderRadius: '8px',
            width: '242px',
            border: '1px solid #D1D5DB',
            color: '#6B7280',
            maxHeight: '300px',
            overflowY: 'auto'
          }}
        >
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(option)}
              style={{
                padding: '8px 16px',
                cursor: 'pointer',
                hover: {
                  backgroundColor: '#F3F4F6',
                },
                color: option === selectedOption ? '#4F46E5' : 'var(--Gray-400, #6B7280)',
                fontWeight: option === selectedOption ? 'bold' : 'normal',
                fontSize:'14px',
                borderBottom: index === options.length - 1 ? 'none' : '1px solid var(--Gray-100, #E5E7EB)'
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}

      {isCalendarOpen && (
        <div 
          ref={calendarRef}
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: '10px',
            zIndex: 9999,
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            backgroundColor: 'white',
            borderRadius: '8px',
          }}
        >
          <Datepicker
            primaryColor={"red"}
            value={dateRange}
            onChange={handleDateSelection}
            // showShortcuts={true}
            toggleClassName="absolute bg-red-600 rounded-r-lg text-white right-0 h-full px-3 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed "
containerClassName="relative "
            // useRange={false}
            popoverDirection="down"
            // asSingle={true}
            
          />
        </div>
      )}
    </div>
  );
});

export default SortButton;
              