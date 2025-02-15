import React, { useState, useEffect, useRef } from 'react';
// import SingleDatePicker from '../Components/SingleDatePicker'
import SingleDatePicker from '../Components/SingleDatePickerForAddBooking'
import { editBooking, getBookedSlots } from '../firebase/services/bookingsData';
import { toast } from 'react-toastify';
import { getAllAuthorizedUsers } from '../firebase/services/UserData';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import dayjs from 'dayjs';


const convertTo24Hour = (timeStr) => {
  if (!timeStr) return null;
  const [time, period] = timeStr.toLowerCase().split(' ');
  let [hours, minutes = '00'] = time.split(':');
  hours = parseInt(hours);
  minutes = parseInt(minutes);
  
  if (period === 'pm' && hours !== 12) {
    hours += 12;
  } else if (period === 'am' && hours === 12) {
    hours = 0;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const formatTimeSlot = (time24) => {
  if (!time24) return '';
  const [hours24, minutes] = time24.split(':').map(Number);
  const period = hours24 >= 12 ? 'pm' : 'am';
  let hours12 = hours24 % 12;
  hours12 = hours12 === 0 ? 12 : hours12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

const generateTimeSlots = (startTime, endTime, duration) => {
  if (!startTime || !endTime || !duration) return [];
  const slots = [];
  let currentTime = convertTo24Hour(startTime);
  const endTime24 = convertTo24Hour(endTime);
  
  while (currentTime <= endTime24) {
    slots.push(formatTimeSlot(currentTime));
    let [hours, minutes] = currentTime.split(':').map(Number);
    hours += parseInt(duration);
    currentTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  return slots;
};

const calculateEndTime = (startTime, duration) => {
  if (!startTime || !duration) return '';
  const start24 = convertTo24Hour(startTime);
  if (!start24) return '';
  let [hours, minutes] = start24.split(':').map(Number);
  hours += parseInt(duration);
  const end24 = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  return formatTimeSlot(end24);
};

const EditingBookingModal = ({ isOpen, onClose, booking, onSave }) => {
  const [editingBooking, setEditingBooking] = useState({});
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isAmenityDropdownOpen, setIsAmenityDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Choose Amenity');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isStartTimeDropdownOpen, setIsStartTimeDropdownOpen] = useState(false);
  const [isEndTimeDropdownOpen, setIsEndTimeDropdownOpen] = useState(false);
  const [amenityTimeConfig, setAmenityTimeConfig] = useState({
    startTime: '',
    endTime: '',
    slotDuration: 0
  });  

  // New state variables for name search
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [authorizedUsers, setAuthorizedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const timeDropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const optionsRef = useRef(null);
  const calendarRef = useRef(null);
  const dateInputRef = useRef(null);
  const userDropdownRef = useRef(null);
  const startTimeDropdownRef = useRef(null);
  const endTimeDropdownRef = useRef(null);

  const toggleOptions = () => setIsAmenityDropdownOpen(!isAmenityDropdownOpen);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsAmenityDropdownOpen(false);
    handleInputChange('amenityName', option);
  };
  console.log("edit booking", booking);
  
  useEffect(() => {
    if (booking) {
      setEditingBooking({
        ...booking,
        slotDate: dayjs(booking.date.toDate()).format('D MMM, YYYY'),
        slotStart: booking.timeSlotStart,
        slotEnd: booking.timeSlotEnd
      });
      setSelectedOption(booking.amenityName || 'Choose Amenity');
      if (booking.userDetails) {
        setSelectedUser(booking.userDetails);
        setSearchTerm(`${booking.userDetails.firstName} ${booking.userDetails.lastName}`.trim());
      }
      fetchAmenityTimeConfig(booking.amenityId);
    }
  }, [booking]);

  const fetchAmenityTimeConfig = async (amenityId) => {
    if (!amenityId) return;
    try {
      const amenityDoc = await getDoc(doc(db, 'amenities', amenityId));
      if (amenityDoc.exists()) {
        const data = amenityDoc.data();
        if (data.timeSlots) {
          setAmenityTimeConfig({
            startTime: data.timeSlots.startTime,
            endTime: data.timeSlots.endTime,
            slotDuration: data.timeSlots.slotDuration
          });
        }
      }
    } catch (error) {
      console.error('Error fetching amenity time config:', error);
    }
  };


  const handleTimeSlotSelection = (time, type) => {
    if (bookedSlots.includes(time)) {
      toast.error('This slot is already booked');
      return;
    }

    if (type === 'start') {
      const endTime = calculateEndTime(time, amenityTimeConfig.slotDuration);
      if (endTime) {
        handleInputChange('slotStart', time);
        handleInputChange('slotEnd', endTime);
        setIsStartTimeDropdownOpen(false);
      }
    }
  };


  const handleDateSelection = (formattedDate) => {
    handleInputChange('slotDate', formattedDate);
    setIsCalendarOpen(false);
    handleInputChange('slotStart', '');
    handleInputChange('slotEnd', '');
  };
  // useEffect(() => {
  //   if (booking) {
  //     setEditingBooking(booking);
  //     setSelectedOption(booking.amenityName || 'Choose Amenity');
  //     if (booking.userDetails) {
  //       setSearchTerm(`${booking.userDetails.firstName} ${booking.userDetails.lastName}`.trim());
  //     } else {
  //       setSearchTerm(booking.phoneNumber || '');
  //     }
  //   }
  // }, [booking]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllAuthorizedUsers();
        setAuthorizedUsers(users);
      } catch (error) {
        console.error('Error fetching authorized users:', error);
      }
    };

    fetchUsers();
  }, []);

  // useEffect(() => {
  //   const fetchBookedSlots = async () => {
  //     if (editingBooking.slotDate && selectedOption) {
  //       const slots = await getBookedSlots(editingBooking.slotDate, selectedOption);
  //       setBookedSlots(slots.filter(slot => slot !== editingBooking.timeSlot));
  //     }
  //   };

  //   fetchBookedSlots();
  // }, [editingBooking.slotDate, selectedOption, editingBooking.timeSlot]);

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (editingBooking.slotDate && selectedOption) {
        const slots = await getBookedSlots(editingBooking.slotDate, selectedOption);
        // Filter out the current booking's time slot if it's the same date and amenity
        setBookedSlots(slots.filter(slot => 
          slot !== editingBooking.timeSlot || 
          editingBooking.date !== editingBooking.slotDate || 
          editingBooking.amenityName !== selectedOption
        ));
      }
    };

    fetchBookedSlots();
  }, [editingBooking.slotDate, selectedOption, editingBooking.timeSlot, editingBooking.date, editingBooking.amenityName]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target)) {
        setIsTimeDropdownOpen(false);
      }
      if (optionsRef.current && !optionsRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsAmenityDropdownOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleUserSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setIsUserDropdownOpen(term.length > 0);
    if (term === '') {
      setFilteredUsers([]);
    } else {
      const filtered = authorizedUsers.filter((user) =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(term.toLowerCase()) ||
        user.phoneNumber.includes(term)
      );
      setFilteredUsers(filtered);
    }
  };

  
  const handleUserSelect = (user) => {
    setEditingBooking(prev => ({
      ...prev,
      phoneNumber: user.phoneNumber,
      userDetails: {
        firstName: user.firstName,
        lastName: user.lastName
      }
    }));
    setSearchTerm(`${user.firstName} ${user.lastName}`);
    setIsUserDropdownOpen(false);
  };


  const handleNameChange = (e) => {
    const fullName = e.target.value;
    const lastSpaceIndex = fullName.lastIndexOf(' ');
    
    if (lastSpaceIndex === -1) {
      handleInputChange('userFirstName', fullName);
      handleInputChange('userLastName', '');
    } else {
      const firstName = fullName.slice(0, lastSpaceIndex);
      const lastName = fullName.slice(lastSpaceIndex + 1);
      handleInputChange('userFirstName', firstName);
      handleInputChange('userLastName', lastName);
    }
  };

  const handleInputChange = (name, value) => {
    setEditingBooking(prev => ({ ...prev, [name]: value }));
  };

  // const handleDateSelection = (formattedDate) => {
  //   handleInputChange('slotDate', formattedDate);
  //   setIsCalendarOpen(false);
  //   handleInputChange('timeSlot', '');
  // };
  //   const handleDateSelection = (formattedDate) => {
  //   setEditingBooking(prev => ({ ...prev, slotDate: formattedDate }));
  //   setIsCalendarOpen(false);
  //   // Clear the time slot when date changes
  //   setEditingBooking(prev => ({ ...prev, timeSlot: '' }));
  // };

  // const handleTimeSlotSelection = (time) => {
  //   if (bookedSlots.includes(time)) {
  //     toast.error('This slot is already booked. Please choose a different time.');
  //   } else {
  //     handleInputChange('timeSlot', time);
  //     setIsTimeDropdownOpen(false);
  //   }
  // };
  // const handleTimeSlotSelection = (time) => {
  //   if (bookedSlots.includes(time)) {
  //     toast.error('This slot is already booked. Please choose a different time.');
  //   } else {
  //     setEditingBooking(prev => ({ ...prev, timeSlot: time }));
  //     setIsTimeDropdownOpen(false);
  //   }
  // };

  const handleSaveEdit = async () => {
    if (!selectedUser || !selectedOption || !editingBooking.slotDate || 
        !editingBooking.slotStart || !editingBooking.slotEnd) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const bookingDate = new Date(editingBooking.slotDate);
      if (isNaN(bookingDate.getTime())) {
        throw new Error('Invalid date');
      }

      const updatedBooking = {
        id: editingBooking.id,
        amenityName: selectedOption,
        phoneNumber: selectedUser.phoneNumber,
        timeSlotStart: editingBooking.slotStart,
        timeSlotEnd: editingBooking.slotEnd,
        date: bookingDate,
        type: "amenities",
        userDetails: {
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          wing: selectedUser.wing,
          flatNumber: selectedUser.flatNumber
        }
      };

      const result = await editBooking(updatedBooking);
      onSave(result);
      onClose();
      toast.success('Booking updated successfully');
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error(`Failed to update booking: ${error.message}`);
    }
  };
  // const handleSaveEdit = async () => {
  //   if (!editingBooking.phoneNumber || !selectedOption) {
  //     toast.error('Please fill in all required fields');
  //     return;
  //   }
  
  //   try {
  //     let bookingDate;
  //     if (editingBooking.slotDate) {
  //       bookingDate = new Date(editingBooking.slotDate);
  //     } else if (editingBooking.date instanceof Date) {
  //       bookingDate = editingBooking.date;
  //     } else if (typeof editingBooking.date === 'string') {
  //       bookingDate = new Date(editingBooking.date);
  //     } else if (editingBooking.date && editingBooking.date.seconds) {
  //       bookingDate = new Date(editingBooking.date.seconds * 1000);
  //     } else {
  //       bookingDate = new Date();
  //     }
  
  //     if (isNaN(bookingDate.getTime())) {
  //       throw new Error('Invalid date');
  //     }
  
  //     const updatedBooking = {
  //       id: editingBooking.id,
  //       amenityName: selectedOption,
  //       phoneNumber: editingBooking.phoneNumber,
  //       timeSlot: editingBooking.timeSlot,
  //       date: bookingDate,
  //       type: "amenities",
  //     };
  
  //     const result = await editBooking(updatedBooking);
  //     onSave(result);
  //     onClose();
  //   } catch (error) {
  //     console.error('Error updating booking:', error);
  //     toast.error(`Failed to update booking: ${error.message}`);
  //   }
  // };

  // const handleSaveEdit = async () => {
  //   if (!editingBooking.phoneNumber || !selectedOption) {
  //     toast.error('Please fill in all required fields');
  //     return;
  //   }

  //   try {
  //     const bookingDate = new Date(editingBooking.slotDate);

  //     if (isNaN(bookingDate.getTime())) {
  //       throw new Error('Invalid date');
  //     }

  //     // Check if the selected time slot is already booked
  //     if (bookedSlots.includes(editingBooking.timeSlot)) {
  //       toast.error('This slot is already booked. Please choose a different time.');
  //       return;
  //     }

  //     const updatedBooking = {
  //       id: editingBooking.id,
  //       amenityName: selectedOption,
  //       phoneNumber: editingBooking.phoneNumber,
  //       timeSlot: editingBooking.timeSlot,
  //       date: bookingDate,
  //       type: "amenities",
  //     };

  //     const result = await editBooking(updatedBooking);
  //     onSave(result);
  //     onClose();
  //     toast.success('Booking updated successfully');
  //   } catch (error) {
  //     console.error('Error updating booking:', error);
  //     toast.error(`Failed to update booking: ${error.message}`);
  //   }
  // };


  const handleClearAll = () => {
    setEditingBooking({});
    setSelectedOption('Choose Amenity');
    setSearchTerm('');
    setSelectedUser(null);
    setAmenityTimeConfig({
      startTime: '',
      endTime: '',
      slotDuration: 0
    });
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
    zIndex: 9999  // Increased from 50 to 9999
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    width: '428px',
    fontFamily: 'Plus_Jakarta'
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
    '1:00 am', '2:00 am', '3:00 am', '4:00 am', '5:00 am', '6:00 am',
    '7:00 am', '8:00 am', '9:00 am', '10:00 am', '11:00 am', '12:00 pm',
    '1:00 pm', '2:00 pm', '3:00 pm', '4:00 pm', '5:00 pm', '6:00 pm',
    '7:00 pm', '8:00 pm', '9:00 pm', '10:00 pm', '11:00 pm'
  ];

  const options = ["Swimming pool", "Tennis court", "Yoga studio", "Gym", "Multi-Purpose Court", "Banquet Hall", "Party Hall", "Jacuzzi & Spa", "Inoor Theatre", "Movie Lawn", "Table Tennis Room"];

  const dropdownContentStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    maxHeight: '200px',
    overflowY: 'auto',
    backgroundColor: 'white',
    border: '1px solid var(--Gray-300, #D1D5DB)',
    borderRadius: '6px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    zIndex: 1,
    padding: '8px',
    marginTop: '8px',
  };

  const dropdownStyle = {
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
  };

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
              Edit Booking
            </h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19.2806 18.2194C19.3502 18.289 19.4055 18.3718 19.4432 18.4628C19.4809 18.5539 19.5003 18.6514 19.5003 18.75C19.5003 18.8485 19.4809 18.9461 19.4432 19.0372C19.4055 19.1282 19.3502 19.2109 19.2806 19.2806C19.2109 19.3503 19.1281 19.4056 19.0371 19.4433C18.9461 19.481 18.8485 19.5004 18.7499 19.5004C18.6514 19.5004 18.5538 19.481 18.4628 19.4433C18.3717 19.4056 18.289 19.3503 18.2193 19.2806L11.9999 13.0603L5.78055 19.2806C5.63982 19.4213 5.44895 19.5004 5.24993 19.5004C5.05091 19.5004 4.86003 19.4213 4.7193 19.2806C4.57857 19.1399 4.49951 18.949 4.49951 18.75C4.49951 18.551 4.57857 18.3601 4.7193 18.2194L10.9396 12L4.7193 5.78061C4.57857 5.63988 4.49951 5.44901 4.49951 5.24999C4.49951 5.05097 4.57857 4.8601 4.7193 4.71936C4.86003 4.57863 5.05091 4.49957 5.24993 4.49957C5.44895 4.49957 5.63982 4.57863 5.78055 4.71936L11.9999 10.9397L18.2193 4.71936C18.36 4.57863 18.5509 4.49957 18.7499 4.49957C18.949 4.49957 19.1398 4.57863 19.2806 4.71936C19.4213 4.8601 19.5003 5.05097 19.5003 5.24999C19.5003 5.44901 19.4213 5.63988 19.2806 5.78061L13.0602 12L19.2806 18.2194Z" fill="#030712"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px', position: 'relative' }}>
            <label style={labelStyle}>
              Name (Required)
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleUserSearch}
              style={inputStyle}
              placeholder="Search for user by name or phone number"
            />
            {isUserDropdownOpen && (
              <div ref={userDropdownRef} 
              style={{
                ...dropdownStyle,
                maxHeight: '150px',  // Limit height to around 5 items (~40px per item)
                overflowY: 'auto',  // Enable vertical scrolling
              }}>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <div
                      key={index}
                      onClick={() => handleUserSelect(user)}
                      style={{
                        padding: '8px 16px',
                        cursor: 'pointer',
                        backgroundColor: 'white',
                        color: 'var(--Gray-400, #6B7280)',
                        fontSize: '14px',
                        borderBottom: index === filteredUsers.length - 1 ? 'none' : '1px solid var(--Gray-100, #E5E7EB)'
                      }}
                    >
                      <div className='flex justify-between'>
                        <span>{user.firstName} {user.lastName}</span>
                        <span>{user.wing} - {user.flatNumber}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '8px 16px', color: 'var(--Gray-400, #6B7280)' }}>No users found</div>
                )}
              </div>
            )}
          </div>
          
          <div style={{ marginBottom: '16px', position: 'relative' }}>
            <label style={labelStyle}>
              Choose Amenity (Required)
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
              <span>{selectedOption}</span>
              {dropdownSvg}
            </button>
            {isAmenityDropdownOpen && (
              <div 
                ref={optionsRef}
                style={{
                  ...dropdownStyle,
                  maxHeight: '150px',  // Limit height to around 5 items (~40px per item)
                  overflowY: 'auto',  // Enable vertical scrolling
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
                      color: 'var(--Gray-400, #6B7280)',
                      fontSize: '14px',
                      borderBottom: index === options.length - 1 ? 'none' : '1px solid var(--Gray-100, #E5E7EB)'
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '4px' }}>
            <label style={labelStyle}>
              Choose date & time (Optional)
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

              <div style={{ flex: 1, position: 'relative' }} ref={timeDropdownRef}>
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
                  <span>{editingBooking.timeSlot || "Select Time"}</span>
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
                        onClick={() => handleTimeSlotSelection(time)}
                        style={{
                          padding: '8px 16px',
                          cursor: bookedSlots.includes(time) ? 'not-allowed' : 'pointer',
                          backgroundColor: bookedSlots.includes(time) ? '#E5E7EB' : 'white',
                          color: bookedSlots.includes(time) ? '#9CA3AF' : 'var(--Gray-400, #6B7280)',
                          fontSize: '14px',
                          borderBottom: index === availableTimeSlots.length - 1 ? 'none' : '1px solid var(--Gray-100, #E5E7EB)'
                        }}
                      >
                        {time} {bookedSlots.includes(time) && '(Booked)'}
                      </div>
                    ))}
                  </div>
                )}
              </div>
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

export default EditingBookingModal;