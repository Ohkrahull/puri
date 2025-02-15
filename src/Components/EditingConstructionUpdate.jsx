import React, { useState, useEffect, useRef } from 'react';
import Calendar from './calender';
import SingleDatePicker from '../Components/SingleDatePicker'

const EditingConstructionModal = ({ isOpen, onClose, booking, onSave }) => {
  const [editingBooking, setEditingBooking] = useState(booking || {});
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isWingDropdownOpen, setIsWingDropdownOpen] = useState(false);
  const [selectedWings, setSelectedWings] = useState([]);
  const timeDropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const optionsRef = useRef(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef(null);
  const dateInputRef = useRef(null);
  
  const toggleOptions = () => setIsWingDropdownOpen(!isWingDropdownOpen);

  const handleWingClick = (wing) => {
    setSelectedWings(prev => {
      if (prev.includes(wing)) {
        return prev.filter(w => w !== wing);
      } else {
        return [...prev, wing];
      }
    });
  };

  useEffect(() => {
    setEditingBooking(booking || {});
    setSelectedWings(booking?.wings || []);
  }, [booking, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target)) {
        setIsTimeDropdownOpen(false);
      }
      if (optionsRef.current && !optionsRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsWingDropdownOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDateSelection = (formattedDate) => {
    handleInputChange('slotDate', formattedDate);
    setIsCalendarOpen(false);
  };

  const handleInputChange = (name, value) => {
    setEditingBooking(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = () => {
    const updatedBooking = { ...editingBooking, wings: selectedWings };
    onSave(updatedBooking);
    onClose();
  };

  const handleClearAll = () => {
    setEditingBooking({});
    setSelectedWings([]);
  };

  const dropdownSvg = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M16.2345 7.06754L9.98453 13.3175C9.92648 13.3756 9.85755 13.4217 9.78168 13.4532C9.7058 13.4847 9.62447 13.5008 9.54234 13.5008C9.46021 13.5008 9.37888 13.4847 9.303 13.4532C9.22713 13.4217 9.1582 13.3756 9.10015 13.3175L2.85015 7.06754C2.73288 6.95026 2.66699 6.7912 2.66699 6.62535C2.66699 6.4595 2.73288 6.30044 2.85015 6.18316C2.96743 6.06588 3.12649 6 3.29234 6C3.45819 6 3.61725 6.06588 3.73453 6.18316L9.54234 11.9918L15.3502 6.18316C15.4082 6.12509 15.4772 6.07903 15.553 6.0476C15.6289 6.01617 15.7102 6 15.7923 6C15.8745 6 15.9558 6.01617 16.0317 6.0476C16.1075 6.07903 16.1765 6.12509 16.2345 6.18316C16.2926 6.24123 16.3387 6.31017 16.3701 6.38604C16.4015 6.46191 16.4177 6.54323 16.4177 6.62535C16.4177 6.70747 16.4015 6.78879 16.3701 6.86466C16.3387 6.94053 16.2926 7.00947 16.2345 7.06754Z" fill="#6B7280"/>
    </svg>
  );

  const modalStyle = {
    position: 'fixed',
    inset: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    width: '428px',
    fontFamily: 'Plus Jakarta Sans, sans-serif'
  };

  const modalHeaderStyle = {
    padding: '24px',
    borderBottom: '1px solid #E5E7EB'
  };

  const modalTitleStyle = {
    color: 'var(--Gray-900, #030712)',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    fontSize: '18px',
    fontWeight: 600,
    lineHeight: '28px'
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    border: '1px solid var(--Gray-300, #D1D5DB)',
    borderRadius: '6px',
    color: 'var(--Gray-500, #4B5563)',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '24px',
    backgroundColor: 'white',
    height: '44px',
    outline: 'none',
  };

  const labelStyle = {
    color: 'var(--Gray-500, #4B5563)',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: '20px',
    marginBottom: '4px',
    display: 'block',
  };

  const clearButtonStyle = {
    color: 'var(--Gray-900, #030712)',
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: '24px',
    textDecorationLine: 'underline',
    marginLeft: '10px',
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  };

  const saveButtonStyle = {
    display: 'flex',
    padding: '10px 20px',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    borderRadius: '8px',
    background: 'var(--Gray-900, #030712)',
    color: 'var(--Gray-25, #F9FAFB)',
    textAlign: 'center',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '24px',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
  };

  const availableTimeSlots = [
    "01:00 AM - 02:00 AM", "02:00 AM - 03:00 AM", "03:00 AM - 04:00 AM",
    "04:00 AM - 05:00 AM", "05:00 AM - 06:00 AM", "06:00 AM - 07:00 AM",
    "07:00 AM - 08:00 AM", "08:00 AM - 09:00 AM", "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "12:00 PM - 01:00 PM",
    "01:00 PM - 02:00 PM", "02:00 PM - 03:00 PM", "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM", "05:00 PM - 06:00 PM", "06:00 PM - 07:00 PM",
    "07:00 PM - 08:00 PM", "08:00 PM - 09:00 PM", "09:00 PM - 10:00 PM",
    "10:00 PM - 11:00 PM", "11:00 PM - 12:00 AM"
  ];

  const wingOptions = ["A", "B", "C", "D"];

  const calendarContainerStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    zIndex: 1000,
    marginTop: '8px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  };

  if (!isOpen) return null;

  return (
    <div style={modalStyle}>
      <div style={modalContentStyle}>
        <div style={modalHeaderStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: '24px' }}></div>
            <h2 style={modalTitleStyle}>
              Edit Updates
            </h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19.2806 18.2194C19.3502 18.289 19.4055 18.3718 19.4432 18.4628C19.4809 18.5539 19.5003 18.6514 19.5003 18.75C19.5003 18.8485 19.4809 18.9461 19.4432 19.0372C19.4055 19.1282 19.3502 19.2109 19.2806 19.2806C19.2109 19.3503 19.1281 19.4056 19.0371 19.4433C18.9461 19.481 18.8485 19.5004 18.7499 19.5004C18.6514 19.5004 18.5538 19.481 18.4628 19.4433C18.3717 19.4056 18.289 19.3503 18.2193 19.2806L11.9999 13.0603L5.78055 19.2806C5.63982 19.4213 5.44895 19.5004 5.24993 19.5004C5.05091 19.5004 4.86003 19.4213 4.7193 19.2806C4.57857 19.1399 4.49951 18.949 4.49951 18.75C4.49951 18.551 4.57857 18.3601 4.7193 18.2194L10.9396 12L4.7193 5.78061C4.57857 5.63988 4.49951 5.44901 4.49951 5.24999C4.49951 5.05097 4.57857 4.8601 4.7193 4.71936C4.86003 4.57863 5.05091 4.49957 5.24993 4.49957C5.44895 4.49957 5.63982 4.57863 5.78055 4.71936L11.9999 10.9397L18.2193 4.71936C18.36 4.57863 18.5509 4.49957 18.7499 4.49957C18.949 4.49957 19.1398 4.57863 19.2806 4.71936C19.4213 4.8601 19.5003 5.05097 19.5003 5.24999C19.5003 5.44901 19.4213 5.63988 19.2806 5.78061L13.0602 12L19.2806 18.2194Z" fill="#030712"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>
              Name
            </label>
            <input
              type="text"
              name="name"
              value={editingBooking.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              style={inputStyle}
              placeholder="Search Member"
            />
          </div>
          
          <div style={{ marginBottom: '16px', position: 'relative' }}>
            <label style={labelStyle}>
              Choose Wings
            </label>
            <button 
              ref={buttonRef}
              onClick={toggleOptions}
              style={{
                ...inputStyle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                backgroundColor: 'white',
              }}
            >
              <span>{selectedWings.length > 0 ? selectedWings.join(', ') : "Choose Wings"}</span>
              {dropdownSvg}
            </button>
            {isWingDropdownOpen && (
              <div 
                ref={optionsRef}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  zIndex: 1000,
                  marginTop: '8px',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  width: '100%',
                  border: '1px solid #D1D5DB',
                  color: '#6B7280'
                }}
              >
                {wingOptions.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleWingClick(option)}
                    style={{
                      padding: '8px 16px',
                      cursor: 'pointer',
                      backgroundColor: selectedWings.includes(option) ? '#F3F4F6' : 'white',
                      color: 'var(--Gray-400, #6B7280)',fontSize: '14px',
                    }}
                  >
                    Wing {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '4px' }}>
            <label style={labelStyle}>
              Choose date
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
                <button 
                ref={dateInputRef}
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  style={{
                    ...inputStyle,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    backgroundColor: 'white',
                  }}
                >
                  <span>{editingBooking.slotDate || "Select Date"}</span>
                  {dropdownSvg}
                </button>
                {isCalendarOpen && (
                  <div ref={calendarRef} style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: 0,
                    zIndex: 1000,
                    marginTop: '8px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                  }}>
                    <SingleDatePicker onDateSelect={handleDateSelection} />
                  </div>
                )}
              </div>
              {/* <div style={{ flex: 1, position: 'relative' }} ref={timeDropdownRef}>
                <button 
                  onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                  style={{
                    ...inputStyle,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    backgroundColor: 'white',
                  }}
                >
                  <span>{editingBooking.slotTime || "Select Time"}</span>
                  {dropdownSvg}
                </button>
                {isTimeDropdownOpen && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      zIndex: 1000,
                      marginTop: '8px',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      width: '100%',
                      border: '1px solid #D1D5DB',
                      color: '#6B7280',
                      maxHeight: '200px',
                      overflowY: 'auto',
                    }}
                  >
                    {availableTimeSlots.map((time, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          handleInputChange('slotTime', time);
                          setIsTimeDropdownOpen(false);
                        }}
                        style={{
                          padding: '8px 16px',
                          cursor: 'pointer',
                          hover: {
                            backgroundColor: '#F3F4F6',
                          },
                          color: 'var(--Gray-400, #6B7280)',
                          fontSize: '14px',
                          borderBottom: index === availableTimeSlots.length - 1 ? 'none' : '1px solid var(--Gray-100, #E5E7EB)'
                        }}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                )}
              </div> */}
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderTop: '1px solid #E5E7EB' }}>
          <button onClick={handleClearAll} style={clearButtonStyle}>
            Clear All
          </button>
          <button onClick={handleSaveEdit} style={saveButtonStyle}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditingConstructionModal;