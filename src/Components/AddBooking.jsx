import React, { useState, useEffect, useRef } from 'react';
import SingleDatePicker from '../Components/SingleDatePickerForAddBooking'
import { saveBooking, getBookedSlots, updateBooking } from '../firebase/services/bookingsData';
import { toast, Toast } from 'react-toastify';
import { getAllAuthorizedUsers } from '../firebase/services/UserData' // Import the new function
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

import ClearableProp from '../Components/SingleDatePicker';
import Calendar from '../Components/calender' // Assuming you have a Calendar component
import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs';

// Move these utility functions to the top, before any other code

// Add this function at the beginning with other utility functions
const isPastTime = (date, timeSlot) => {
  const today = new Date();
  const selectedDate = new Date(date);
  
  // If selected date is in future, all times are valid
  if (selectedDate.getDate() > today.getDate() || 
      selectedDate.getMonth() > today.getMonth() || 
      selectedDate.getFullYear() > today.getFullYear()) {
    return false;
  }
  
  // If selected date is in past, all times are invalid
  if (selectedDate.getDate() < today.getDate() || 
      selectedDate.getMonth() < today.getMonth() || 
      selectedDate.getFullYear() < today.getFullYear()) {
    return true;
  }
  
  // For current date, compare with current time
  const [timeStr, period] = timeSlot.toLowerCase().split(' ');
  let [hours] = timeStr.split(':').map(Number);
  
  // Convert to 24 hour format
  if (period === 'pm' && hours !== 12) {
    hours += 12;
  } else if (period === 'am' && hours === 12) {
    hours = 0;
  }
  
  const currentHour = today.getHours();
  return hours <= currentHour;
};

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
  
  if (!currentTime || !endTime24) return [];
  
  while (currentTime <= endTime24) {
    slots.push(formatTimeSlot(currentTime));
    // Add duration hours to current time
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
const AddBooking = ({ onClose, onSave, booking, isEditing = false }) => {
  const [editingBooking, setEditingBooking] = useState(booking || {});
  const [isStartTimeDropdownOpen, setIsStartTimeDropdownOpen] = useState(false);
  const [isEndTimeDropdownOpen, setIsEndTimeDropdownOpen] = useState(false);
  const [isAmenityDropdownOpen, setIsAmenityDropdownOpen] = useState(false);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  // const [isAmenityDropdownOpen, setIsAmenityDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Choose Amenity');
  const [selectedAmenityId, setSelectedAmenityId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const timeDropdownRef = useRef(null);
  const {user} = useAuth();
  const buttonRef = useRef(null);
  const optionsRef = useRef(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef(null);
  const dateInputRef = useRef(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [authorizedUsers, setAuthorizedUsers] = useState([]); // For storing authorized users
  const dropdownRef = useRef(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);
  const [amenities, setAmenities] = useState([]);
  const [amenityTimeConfig, setAmenityTimeConfig] = useState({
    startTime: '',
    endTime: '',
    slotDuration: 0
  });

  const startTimeDropdownRef = useRef(null);
  const endTimeDropdownRef = useRef(null);
  const amenityDropdownRef = useRef(null);

  // useEffect(() => {
  //   if (isEditing && booking) {
  //     console.log('Editing Mode Debug:');
  //     console.log('Booking:', booking);
  //     console.log('Selected Option:', selectedOption);
  //     console.log('Selected Amenity ID:', selectedAmenityId);
  //     console.log('Editing Booking:', editingBooking);
  //     console.log('User:', selectedUser);
  //     console.log('Search Term:', searchTerm);
  //     console.log('Amenity Time Config:', amenityTimeConfig);
  //   }
  // }, [isEditing, booking, selectedOption, selectedAmenityId, editingBooking, selectedUser, searchTerm, amenityTimeConfig]);
  
  
  const toggleOptions = () => setIsAmenityDropdownOpen(!isAmenityDropdownOpen);

  // const handleTimeSlotSelection = (time, type) => {
  //   if (bookedSlots.includes(time)) {
  //     toast.error('This slot is already booked');
  //     return;
  //   }
  
  //   if (isPastTime(editingBooking.slotDate, time)) {
  //     toast.error('Cannot book past time slots');
  //     return;
  //   }
  
  //   if (type === 'start') {
  //     const endTime = calculateEndTime(time, amenityTimeConfig.slotDuration);
  //     if (endTime) {
  //       handleInputChange('slotStart', time);
  //       handleInputChange('slotEnd', endTime);
  //       setIsStartTimeDropdownOpen(false);
  //     }
  //   }
  // };

  const handleTimeSlotSelection = (time, type) => {
    console.log('Time slot selected:', time, 'type:', type);
    if (bookedSlots.includes(time)) {
      toast.error('This slot is already booked');
      return;
    }
  
    if (isPastTime(editingBooking.slotDate, time)) {
      toast.error('Cannot book past time slots');
      return;
    }
  
    if (type === 'start') {
      const endTime = calculateEndTime(time, amenityTimeConfig.slotDuration);
      console.log('Calculated end time:', endTime);
      if (endTime) {
        handleInputChange('slotStart', time);
        handleInputChange('slotEnd', endTime);
        setIsStartTimeDropdownOpen(false);
      }
    }
  };

  const isTimeSlotBooked = (time) => {
    return bookedSlots.some(slot => {
      const timeToCheck = convertTo24Hour(time);
      const startTime = convertTo24Hour(slot.timeSlotStart);
      const endTime = convertTo24Hour(slot.timeSlotEnd);
      return timeToCheck >= startTime && timeToCheck < endTime;
    });
  };

  


// useEffect(() => {
//   if (isEditing && booking) {
//     setSelectedOption(booking.amenityName || 'Choose Amenity');
//     setSelectedUser(booking.userDetails);
//     setSearchTerm(`${booking.userDetails?.firstName || ''} ${booking.userDetails?.lastName || ''}`);
//     setEditingBooking({
//       ...booking,
//       slotDate: dayjs(booking.date.toDate()).format('D MMM, YYYY'),
//       slotStart: booking.timeSlotStart,
//       slotEnd: booking.timeSlotEnd,
//     });
//     setSelectedAmenityId(booking.amenityId);

//     // Fetch amenity time config for the selected amenity
//     if (booking.amenityId) {
//       fetchAmenityTimeConfig(booking.amenityId);
//     }
//   }
// }, [isEditing, booking]);
useEffect(() => {
  if (isEditing && booking) {
    console.log('Initial booking data:', booking);
    
    // Create user details object from flat structure
    const userDetails = {
      id: booking.userId,
      firstName: booking.userFirstName,
      lastName: booking.userLastName,
      phoneNumber: booking.phoneNumber
    };

    // Set the selected user and search term
    setSelectedUser(userDetails);
    setSearchTerm(`${booking.userFirstName} ${booking.userLastName}`.trim());
    
    // Set the amenity details
    setSelectedOption(booking.amenityName);
    setSelectedAmenityId(booking.amenityId);
    
    // Format and set the date
    const formattedDate = booking.date ? dayjs(booking.date.toDate()).format('D MMM, YYYY') : '';
    
    // Set all booking details
    setEditingBooking(prev => ({
      ...prev,
      ...booking,
      slotDate: formattedDate,
      slotStart: booking.timeSlotStart,
      slotEnd: booking.timeSlotEnd
    }));

    // Fetch amenity time config
    const fetchConfig = async () => {
      if (booking.amenityId) {
        const amenityDoc = await getDoc(doc(db, 'amenities', booking.amenityId));
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
      }
    };
    fetchConfig();

    // Fetch booked slots
    const fetchSlots = async () => {
      if (formattedDate && booking.amenityName) {
        const slots = await getBookedSlots(formattedDate, booking.amenityName);
        // Don't filter out current booking's slot for proper collision detection
        setBookedSlots(slots);
      }
    };
    fetchSlots();
  }
}, [isEditing, booking]);


const modalTitle = isEditing ? 'Edit Booking' : 'Add Booking';

const buttonText = isEditing ? 'Update Booking' : 'Add Booking';

const availableSlots = generateTimeSlots(
  amenityTimeConfig.startTime,
  amenityTimeConfig.endTime,
  amenityTimeConfig.slotDuration
);



  // Fetch amenity time configuration
  // const fetchAmenityTimeConfig = async (amenityId) => {
  //   try {
  //     const amenityDoc = await getDoc(doc(db, 'amenities', amenityId));
  //     if (amenityDoc.exists()) {
  //       const data = amenityDoc.data();
  //       if (data.timeSlots) {
  //         setAmenityTimeConfig({
  //           startTime: data.timeSlots.startTime,
  //           endTime: data.timeSlots.endTime,
  //           slotDuration: data.timeSlots.slotDuration
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error fetching amenity time config:', error);
  //   }
  // };
  const fetchAmenityTimeConfig = async (amenityId) => {
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
  
  

  // const handleAmenitySelect = async (amenity) => {
  //   try {
  //     setSelectedOption(amenity.heading);
  //     setSelectedAmenityId(amenity.id);
  //     setIsAmenityDropdownOpen(false);
      
  //     const amenityDoc = await getDoc(doc(db, 'amenities', amenity.id));
  //     if (amenityDoc.exists()) {
  //       const data = amenityDoc.data();
  //       if (data.timeSlots) {
  //         setAmenityTimeConfig({
  //           startTime: data.timeSlots.startTime,
  //           endTime: data.timeSlots.endTime,
  //           slotDuration: data.timeSlots.slotDuration
  //         });
  //       }
  //     }
      
  //     // Reset time selections
  //     handleInputChange('slotStart', '');
  //     handleInputChange('slotEnd', '');
  //   } catch (error) {
  //     console.error('Error fetching amenity config:', error);
  //     toast.error('Failed to fetch amenity configuration');
  //   }
  // };
  const handleAmenitySelect = async (amenity) => {
    console.log('Selecting amenity:', amenity);
    try {
      // Check if amenity selection has changed
      const isAmenityChanged = selectedOption !== amenity.heading;
      
      setSelectedOption(amenity.heading);
      setSelectedAmenityId(amenity.id);
      setIsAmenityDropdownOpen(false);
      
      const amenityDoc = await getDoc(doc(db, 'amenities', amenity.id));
      if (amenityDoc.exists()) {
        const data = amenityDoc.data();
        console.log('Fetched amenity data:', data);
        if (data.timeSlots) {
          setAmenityTimeConfig({
            startTime: data.timeSlots.startTime,
            endTime: data.timeSlots.endTime,
            slotDuration: data.timeSlots.slotDuration
          });
          
          // Clear time slots if amenity has changed
          if (isAmenityChanged) {
            handleInputChange('slotStart', '');
            handleInputChange('slotEnd', '');
            
            // Also clear booked slots for the new amenity
            if (editingBooking.slotDate) {
              const slots = await getBookedSlots(editingBooking.slotDate, amenity.heading);
              setBookedSlots(slots);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in handleAmenitySelect:', error);
      toast.error('Failed to fetch amenity configuration');
    }
  };

  useEffect(() => {
    if (isEditing && booking && amenityTimeConfig.startTime) {
      // Recalculate end time based on start time and duration
      const endTime = calculateEndTime(booking.timeSlotStart, amenityTimeConfig.slotDuration);
      if (endTime) {
        handleInputChange('slotEnd', endTime);
      }
    }
  }, [amenityTimeConfig, isEditing, booking]);
  

  const handleDateSelection = (formattedDate) => {
    handleInputChange('slotDate', formattedDate);
    setIsCalendarOpen(false);
    handleInputChange('slotStart', '');
    handleInputChange('slotEnd', '');
  };
  
 

 // Fetch amenities from database
 useEffect(() => {
  const fetchAmenities = async () => {
    try {
      const amenitiesCollection = collection(db, 'amenities');
      const amenitiesSnapshot = await getDocs(amenitiesCollection);
      const amenitiesList = amenitiesSnapshot.docs.map(doc => ({
        id: doc.id,
        heading: doc.data().heading
      }));
      setAmenities(amenitiesList);
    } catch (error) {
      console.error('Error fetching amenities:', error);
    }
  };
  fetchAmenities();
}, []);



  useEffect(() => {
    // Fetch all authorized users when component mounts
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

  const handleUserSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setIsUserDropdownOpen(term.length > 0);
    if (term === '') {
      setFilteredUsers([]);
    } else {
      const filtered = authorizedUsers.filter((user) =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSearchTerm(`${user.firstName} ${user.lastName}`);
    setIsUserDropdownOpen(false);
  };


  // useEffect(() => {
  //   setEditingBooking(booking || {});
  //   setSelectedOption(booking?.amenity || 'Choose Amenity');
  // }, [booking]);

  useEffect(() => {
    console.log("User object from useAuth:", user); // Add this for debugging
  }, [user]);

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


  const handleInputChange = (name, value) => {
    setEditingBooking(prev => ({ ...prev, [name]: value }));
  };

  


  const handleSaveEdit = async () => {
    // Updated validation check
    if (!selectedUser || 
        !selectedOption || 
        !editingBooking.slotDate || 
        !editingBooking.slotStart || 
        !editingBooking.slotEnd || 
        selectedOption === 'Choose Amenity') {
      toast.error('Please fill in all fields');
      return;
    }
  
    if (!user) {
      toast.error('You must be logged in to make a booking');
      return;
    }
  
    
  try {
    const bookingDate = new Date(editingBooking.slotDate);
    if (isNaN(bookingDate.getTime())) {
      toast.error('Invalid date. Please select a valid date.');
      return;
    }

    const bookingData = {
      // If editing, include the original ID
      ...(isEditing ? { id: booking.id } : {}),
      amenityName: selectedOption,
      amenityId: selectedAmenityId,
      date: bookingDate,
      timeSlotStart: editingBooking.slotStart,
      timeSlotEnd: editingBooking.slotEnd,
      type: 'amenities',
      phoneNumber: selectedUser.phoneNumber || '',
      userId: selectedUser.id,
      userFirstName: selectedUser.firstName,
      userLastName: selectedUser.lastName,
    };

    if (isEditing) {
      // Update existing booking
      await updateBooking(booking.id, bookingData);
    } else {
      // Create new booking
      await saveBooking(bookingData);
    }

    toast.success(`Booking ${isEditing ? 'updated' : 'saved'} successfully`);

    if (typeof onSave === 'function') {
      onSave(bookingData);
    }

    if (typeof onClose === 'function') {
      onClose();
    }
  } catch (error) {
    console.error('Error saving booking:', error);
    toast.error(`Failed to ${isEditing ? 'update' : 'save'} booking: ${error.message}`);
  }
};


  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (editingBooking.slotDate && selectedOption) {
        const slots = await getBookedSlots(editingBooking.slotDate, selectedOption);
        setBookedSlots(slots);
      }
    };

    fetchBookedSlots();
  }, [editingBooking.slotDate, selectedOption]);

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

  
  

  const options = ["Swimming pool", "Gym", "Multi-Purpose Court", "Banquet Hall", "Party Hall", "Jacuzzi & Spa", "Indoor Theatre", "Movie Lawn", "Table Tennis Room"];

  const dropdownSvg = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M16.2345 7.06754L9.98453 13.3175C9.92648 13.3756 9.85755 13.4217 9.78168 13.4532C9.7058 13.4847 9.62447 13.5008 9.54234 13.5008C9.46021 13.5008 9.37888 13.4847 9.303 13.4532C9.22713 13.4217 9.1582 13.3756 9.10015 13.3175L2.85015 7.06754C2.73288 6.95026 2.66699 6.7912 2.66699 6.62535C2.66699 6.4595 2.73288 6.30044 2.85015 6.18316C2.96743 6.06588 3.12649 6 3.29234 6C3.45819 6 3.61725 6.06588 3.73453 6.18316L9.54234 11.9918L15.3502 6.18316C15.4082 6.12509 15.4772 6.07903 15.553 6.0476C15.6289 6.01617 15.7102 6 15.7923 6C15.8745 6 15.9558 6.01617 16.0317 6.0476C16.1075 6.07903 16.1765 6.12509 16.2345 6.18316C16.2926 6.24123 16.3387 6.31017 16.3701 6.38604C16.4015 6.46191 16.4177 6.54323 16.4177 6.62535C16.4177 6.70747 16.4015 6.78879 16.3701 6.86466C16.3387 6.94053 16.2926 7.00947 16.2345 7.06754Z" fill="#6B7280"/>
    </svg>
  );

  const inputStyle = {
    width: '100%',
    padding: '8px',
    border: '1px solid var(--Gray-300, #D1D5DB)',
    borderRadius: '6px',
    color: 'var(--Gray-500, #4B5563)',
    // color
    // color:'red',
    // fontFamily: 'Plus Jakarta Sans, sans-serif',
    fontFamily:'Plus_Jakarta',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '24px',
    backgroundColor: 'white',
    height: '44px',
    outline: 'none',
  };

  const labelStyle = {
    color: 'var(--Gray-500, #4B5563)',
    // fontFamily: 'Plus Jakarta Sans, sans-serif',
    fontFamily:'Plus_Jakarta',
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: '20px',
    marginBottom: '4px',
    display: 'block',
  };

  const clearButtonStyle = {
    color: 'var(--Gray-900, #030712)',
    // fontFamily: "Plus Jakarta Sans, sans-serif",
    fontFamily:'Plus_Jakarta',
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
    // fontFamily: 'Plus Jakarta Sans, sans-serif',
    fontFamily:'Plus_Jakarta',
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '24px',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
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

  const dropdownItemStyle = {
    padding: '8px 16px',
    cursor: 'pointer',
    hover: {
      backgroundColor: '#F3F4F6',
    },
    color: 'var(--Gray-400, #6B7280)',
    fontSize: '14px',
    borderBottom: '1px solid var(--Gray-100, #E5E7EB)'
  };

 

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


  return (
    <div style={modalStyle}>
      <div style={modalContentStyle}>
        <div style={modalHeaderStyle}>
          <div className="flex justify-between items-center">
            <div className="w-6"></div>
            <h2 style={{
              color: 'var(--Gray-900, #030712)',
              fontFamily: 'Plus_Jakarta',
              fontSize: '18px',
              fontWeight: 600,
              lineHeight: '28px'
            }}>
              {modalTitle}
            </h2>
            <button onClick={onClose}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19.2806 18.2194C19.3502 18.289 19.4055 18.3718 19.4432 18.4628C19.4809 18.5539 19.5003 18.6514 19.5003 18.75C19.5003 18.8485 19.4809 18.9461 19.4432 19.0372C19.4055 19.1282 19.3502 19.2109 19.2806 19.2806C19.2109 19.3503 19.1281 19.4056 19.0371 19.4433C18.9461 19.481 18.8485 19.5004 18.7499 19.5004C18.6514 19.5004 18.5538 19.481 18.4628 19.4433C18.3717 19.4056 18.289 19.3503 18.2193 19.2806L11.9999 13.0603L5.78055 19.2806C5.63982 19.4213 5.44895 19.5004 5.24993 19.5004C5.05091 19.5004 4.86003 19.4213 4.7193 19.2806C4.57857 19.1399 4.49951 18.949 4.49951 18.75C4.49951 18.551 4.57857 18.3601 4.7193 18.2194L10.9396 12L4.7193 5.78061C4.57857 5.63988 4.49951 5.44901 4.49951 5.24999C4.49951 5.05097 4.57857 4.8601 4.7193 4.71936C4.86003 4.57863 5.05091 4.49957 5.24993 4.49957C5.44895 4.49957 5.63982 4.57863 5.78055 4.71936L11.9999 10.9397L18.2193 4.71936C18.36 4.57863 18.5509 4.49957 18.7499 4.49957C18.949 4.49957 19.1398 4.57863 19.2806 4.71936C19.4213 4.8601 19.5003 5.05097 19.5003 5.24999C19.5003 5.44901 19.4213 5.63988 19.2806 5.78061L13.0602 12L19.2806 18.2194Z" fill="#030712"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-4" style={{ position: 'relative',fontFamily:'Plus_Jakarta' }}>
            <label style={labelStyle}>
              Search User
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                
                placeholder="Search for user"
                style={inputStyle}
                value={searchTerm}
                onChange={handleUserSearch}
              />
            </div>
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
                        ...dropdownItemStyle,
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
                  <div style={dropdownItemStyle}>No users found</div>
                )}
              </div>
            )}
          </div>
          
          <div style={{ marginBottom: '16px', position: 'relative' }}>
            <label style={labelStyle}>
              Choose Amenity
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
                fontFamily:'Plus_Jakarta'
              }}
            >
              <span>{selectedOption}</span>
              {dropdownSvg}
            </button>
            {isAmenityDropdownOpen && (
  <div ref={optionsRef} 
    style={{
      ...dropdownStyle,
      maxHeight: '150px',
      overflowY: 'auto',
    }}>
    {amenities.map((amenity, index) => (
      <div
        key={amenity.id}
        onClick={() => handleAmenitySelect(amenity)}
        style={{
          ...dropdownItemStyle,
          borderBottom: index === options.length - 1 ? 'none' : '1px solid var(--Gray-100, #E5E7EB)'
        }}
      >
        {amenity.heading}
      </div>
    ))}
  </div>
)}
          </div>
          
         {/* Date and Time Selection */}
         <div className="mb-4">
            <label style={labelStyle}>
              Choose Date & Time
            </label>
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
              {/* Date Selection */}
              <div style={{ position: 'relative' }}>
                <button 
                  ref={dateInputRef}
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  style={{
                    ...inputStyle,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
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

              {/* Time Slots Container */}
              <div style={{ display: 'flex', gap: '10px' }}>
                {/* Start Time */}
                <div style={{ flex: 1, position: 'relative' }} ref={startTimeDropdownRef}>
                  <button 
                    onClick={() => setIsStartTimeDropdownOpen(!isStartTimeDropdownOpen)}
                    disabled={!selectedAmenityId}
                    style={{
                      ...inputStyle,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: selectedAmenityId ? 'pointer' : 'not-allowed',
                      opacity: selectedAmenityId ? 1 : 0.7,
                    }}
                  >
                    <span>{editingBooking.slotStart || "Slot Start"}</span>
                    {dropdownSvg}
                  </button>
                  {isStartTimeDropdownOpen && (
  <div style={{
    ...dropdownStyle,
    maxHeight: '150px',
    overflowY: 'auto',
  }}>
    {availableSlots.map((time, index) => {
      const isPast = isPastTime(editingBooking.slotDate, time);
      const isBooked = isTimeSlotBooked(time);
      const isCurrentBooking = isEditing && time === editingBooking.slotStart;
      
      // Allow selecting current booking's time slot when editing
      const isSelectable = !isPast && (!isBooked || isCurrentBooking);
      
      return (
        <div
          key={time}
          onClick={() => isSelectable && handleTimeSlotSelection(time, 'start')}
          style={{
            ...dropdownItemStyle,
            borderBottom: index === availableSlots.length - 1 ? 'none' : '1px solid var(--Gray-100, #E5E7EB)',
            backgroundColor: (!isSelectable) ? '#E5E7EB' : 
                           isCurrentBooking ? '#EFF6FF' : 'white',
            color: (!isSelectable) ? '#9CA3AF' : 'var(--Gray-400, #6B7280)',
            cursor: isSelectable ? 'pointer' : 'not-allowed',
          }}
        >
          {time} {isBooked && !isCurrentBooking ? '(Booked)' : isPast ? '(Past)' : ''}
        </div>
      );
    })}
  </div>
)}
                </div>

                {/* End Time (Read-only) */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    ...inputStyle,
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#F3F4F6',
                    // cursor: 'not-allowed',
                  }}>
                    <span>{editingBooking.slotEnd || "Slot End"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/* </div> */}
        {/* </div> */}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderTop: '1px solid #E5E7EB' ,fontFamily:'Plus_Jakarta'}}>
          <button onClick={handleClearAll} style={clearButtonStyle}>
            Clear All
          </button>
          <button onClick={handleSaveEdit} style={saveButtonStyle}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBooking;
