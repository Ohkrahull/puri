import React, { useState, useRef, useEffect } from 'react';
import SingleDatePicker from './SingleDatePickerForAddBooking';
import { saveTargetDate } from '../firebase/services/constructionUpdate';
import { toast } from 'react-toastify';

const SetTargetDateModal = ({ onClose }) => {
  const [targetDate, setTargetDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleDateSelect = (date) => {
    setTargetDate(formatDate(new Date(date)));
    setShowCalendar(false);
  };

  const handleClear = () => {
    setTargetDate('');
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }).split('/').join('-');
  };

  const handleSetDate = async () => {
    if (!targetDate) {
      toast.error("Please select a date before setting the target date.");
      return;
    }

    try {
      // Parse the date string to ensure we have a valid Date object
      const [day, month, year] = targetDate.split('-').map(num => parseInt(num, 10));
      const dateObject = new Date(year, month - 1, day); // month is 0-indexed in JavaScript Date

      if (isNaN(dateObject.getTime())) {
        throw new Error('Invalid date');
      }

      await saveTargetDate(dateObject);
      toast.success("Target date set successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      onClose();
    } catch (error) {
      console.error("Error setting target date:", error);
      toast.error("Failed to set target date. Please ensure the date is valid and try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" style={{fontFamily: "Plus_Jakarta"}}>
      <div ref={modalRef} className="bg-white rounded-2xl shadow-xl w-[428px] relative" style={{fontFamily: "Plus_Jakarta"}}>
        {/* Top section */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <div className="flex-grow text-center text-gray-900 text-lg font-semibold leading-7" style={{fontFamily: "Plus_Jakarta", fontSize:'18px'}}>Set Target Date</div>
          <button className="text-gray-900" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19.2806 18.2193C19.3502 18.289 19.4055 18.3717 19.4432 18.4628C19.4809 18.5538 19.5003 18.6514 19.5003 18.7499C19.5003 18.8485 19.4809 18.9461 19.4432 19.0371C19.4055 19.1281 19.3502 19.2109 19.2806 19.2806C19.2109 19.3502 19.1281 19.4055 19.0371 19.4432C18.9461 19.4809 18.8485 19.5003 18.7499 19.5003C18.6514 19.5003 18.5538 19.4809 18.4628 19.4432C18.3717 19.4055 18.289 19.3502 18.2193 19.2806L11.9999 13.0602L5.78055 19.2806C5.63982 19.4213 5.44895 19.5003 5.24993 19.5003C5.05091 19.5003 4.86003 19.4213 4.7193 19.2806C4.57857 19.1398 4.49951 18.949 4.49951 18.7499C4.49951 18.5509 4.57857 18.36 4.7193 18.2193L10.9396 11.9999L4.7193 5.78055C4.57857 5.63982 4.49951 5.44895 4.49951 5.24993C4.49951 5.05091 4.57857 4.86003 4.7193 4.7193C4.86003 4.57857 5.05091 4.49951 5.24993 4.49951C5.44895 4.49951 5.63982 4.57857 5.78055 4.7193L11.9999 10.9396L18.2193 4.7193C18.36 4.57857 18.5509 4.49951 18.7499 4.49951C18.949 4.49951 19.1398 4.57857 19.2806 4.7193C19.4213 4.86003 19.5003 5.05091 19.5003 5.24993C19.5003 5.44895 19.4213 5.63982 19.2806 5.78055L13.0602 11.9999L19.2806 18.2193Z" fill="#030712"/>
            </svg>
          </button>
        </div>

        {/* Middle section */}
        <div className="px-6 py-5">
          <div className="flex flex-col relative">
            <label htmlFor="targetDate" className="text-gray-900 text-sm font-medium mb-2" style={{fontFamily: "Plus_Jakarta", fontSize:'14px'}}>Target Date</label>
            <input
              type="text"
              id="targetDate"
              placeholder="DD-MM-YYYY"
              className="p-2.5 border border-gray-200 rounded-lg text-gray-500 text-sm w-full cursor-pointer"
              value={targetDate}
              onClick={() => setShowCalendar(!showCalendar)}
              readOnly
            />
            {showCalendar && (
              <div className="absolute bottom-auto left-0 bg-white shadow-lg rounded-lg z-10">
                <SingleDatePicker onDateSelect={handleDateSelect} />
              </div>
            )}
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex justify-between items-center px-6 py-6 mb-2 border-t border-gray-100" style={{padding:'10px 20px'}}>
          <button 
            className="text-gray-900 text-sm font-medium underline"
            onClick={handleClear}
            style={{fontFamily: "Plus_Jakarta", fontSize:'16px'}}
          >
            Clear
          </button>
          <button
            onClick={handleSetDate}
            className="bg-gray-900 text-white px-5 py-4 rounded-lg text-sm font-medium relative after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-white after:rounded-b-lg"
            style={{fontFamily: "Plus_Jakarta", fontSize:'16px', width:'100px', height:'44px', textAlign:'center'}}
          >
            Set Date
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetTargetDateModal;