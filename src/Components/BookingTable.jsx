import React, { useState } from 'react';
import styles from './CustomScrollbar.module.css';
import EditingBookingModal from './EditingModal';
import { Link } from 'react-router-dom';

const ScrollableBookingTable = () => {
  const [bookings, setBookings] = useState([
    { name: "Marvin McKinney", slotTime:"01:00 AM - 02:00 AM", slotDate: "8 Sep, 2020", amenity: "Swimming pool" },
    { name: "Jane Cooper", slotTime:"04:00 AM - 05:00 AM", slotDate: "9 Sep, 2020", amenity: "Tennis court" },
    { name: "Robert Fox", slotTime:"04:00 AM - 05:00 AM", slotDate: "10 Sep, 2020", amenity: "Gym" },
    { name: "Jenny Wilson", slotTime:"04:00 AM - 05:00 AM", slotDate: "11 Sep, 2020", amenity: "Yoga studio" },
    { name: "Wade Warren", slotTime: "04:00 AM - 05:00 AM", slotDate: "12 Sep, 2020", amenity: "Swimming pool" },
    { name: "Esther Howard", slotTime:"04:00 AM - 05:00 AM", slotDate: "13 Sep, 2020", amenity: "Tennis court" },
    { name: "Cameron Williamson", slotTime: "04:00 AM - 05:00 AM", slotDate: "14 Sep, 2020", amenity: "Gym" },
    { name: "Brooklyn Simmons", slotTime: "04:00 AM - 05:00 AM", slotDate: "15 Sep, 2020", amenity: "Yoga studio" },
    { name: "Leslie Alexander", slotTime:"04:00 AM - 05:00 AM", slotDate: "16 Sep, 2020", amenity: "Swimming pool" },
    { name: "Guy Hawkins", slotTime: "04:00 AM - 05:00 AM", slotDate: "17 Sep, 2020", amenity: "Tennis court" },
  ]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleEditClick = (booking, index) => {
    setEditingBooking({ ...booking });
    setEditingIndex(index);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (index) => {
    const updatedBookings = bookings.filter((_, i) => i !== index);
    setBookings(updatedBookings);
  };

  const handleSaveEdit = (updatedBooking) => {
    const updatedBookings = [...bookings];
    updatedBookings[editingIndex] = updatedBooking;
    setBookings(updatedBookings);
    setIsEditModalOpen(false);
    setEditingBooking(null);
    setEditingIndex(null);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingBooking(null);
    setEditingIndex(null);
  };

  const hideScrollbarStyle = {
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  };

  const getAmenityStyle = (amenity) => {
    switch(amenity) {
      case 'Swimming pool':
        return { backgroundColor: 'var(--Blue-25, #EFF6FF)', color: 'var(--Blue-700, #1E40AF)', borderRadius:'8px' };
      case 'Tennis court':
        return { backgroundColor: 'var(--Emerald-25, #F0FDF4)', color: 'var(--Emerald-700, #166534)' };
      case 'Mini theater':
        return { backgroundColor: 'var(--Rose-25, #FFF1F2)', color: 'var(--Rose-700, #9F1239)' };
      default:
        return { backgroundColor: '#F3F4F6', color: '#4B5563' };
    }
  };

  // const getAmenityStyle = (amenity) => {
  //   switch(amenity) {
  //     case 'Swimming pool':
  //       return { backgroundColor: 'var(--Blue-25, #EFF6FF)', color: 'var(--Blue-700, #1E40AF)' };
  //     case 'Tennis court':
  //       return { backgroundColor: 'var(--Emerald-25, #F0FDF4)', color: 'var(--Emerald-700, #166534)' };
  //     case 'Mini theater':
  //       return { backgroundColor: 'var(--Rose-25, #FFF1F2)', color: 'var(--Rose-700, #9F1239)' };
  //     default:
  //       return { backgroundColor: '#F3F4F6', color: '#4B5563' };
  //   }
  // };

  return (
    <div className='relative'>
      <div className={`mt-1 bg-white border rounded-lg overflow-hidden flex flex-col ${isEditModalOpen ? 'opacity-50' : ''}`} style={{ maxHeight: '500px' }}>
        <div className="sticky top-0 z-20 bg-white">
          <div className="flex justify-between items-center p-6">
            <div className="text-gray-900">
              <h1 className="font-bold text-base" style={{color: 'var(--Gray-900, #030712)', fontStyle:'normal', fontWeight:'500', lineHeight:'24px',fontSize:'16px'}}>Recent Booking</h1>
              <span className="text-gray-400 text-xs" style={{color: 'var(--Gray-400, #6B7280)', fontStyle:'normal', fontWeight:'400', lineHeight:'18px',fontSize:'12px'}}>
                View all your recent Booking
              </span>
            </div>
            <Link to="/booking" className="text-xs font-semibold text-gray-700 underline flex items-center" style={{color: 'var(--Gray-900, #030712)', fontStyle:'normal', fontWeight:'600', lineHeight:'18px',fontSize:'12px'}}>
              View all
              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          <div className="border-y bg-gray-50" >
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-500 sticky top-0 z-10" style={{fontSize:'12px'}}>
                <tr>
                  <th scope="col" className="p-4 w-4">
                    <div className="flex items-center"></div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left" style={{fontSize:'12px'}}>
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div className="flex items-center justify-center text-center ml-6  float-center">
                      Slot time
                      <svg className="ml-2" xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                        <path d="M8.66699 3.66667V12M8.66699 12L4.66699 8M8.66699 12L12.667 8" stroke="#4B5563" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3 justify-center ">
                    <div className="flex float-left  ">
                      Slot date
                      <svg className="ml-2" xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                        <path d="M8.66699 3.66667V12M8.66699 12L4.66699 8M8.66699 12L12.667 8" stroke="#4B5563" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3  float-start justify-center mr-3" >
                    Amenities
                  </th>
                  <th scope="col" className="px-6 py-3"></th>
                  <th scope="col" className="px-6 py-3"></th>
                </tr>
              </thead>
            </table>
          </div>
        </div>
        <div className="overflow-y-auto" style={hideScrollbarStyle} >
          <table className="w-full text-sm text-left text-gray-500" >
            <tbody >
              {bookings.map((booking, index) => (
                <tr key={index} className="bg-white  border-b hover:bg-gray-50" style={{fontSize:'14px' }}>
                  <td className="w-4 p-4">
                    <div className="flex items-center"></div>
                  </td>
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {booking.name}
                  </th>
                  <td className=" text-left float-left justify-start">{booking.slotTime}</td>
                  <td className="px-6 py-4 justify-center text-center ">{booking.slotDate}</td>
                  <td className="px-6 py-4">
                    {/* <span className="text-center align-baseline inline-flex px-4 py-3 mr-auto items-center font-semibold text-[.95rem]  leading-none rounded-lg" style={{padding:'4px 12px',borderRadius:'10px', fontSize:'12px', ...getAmenityStyle(booking.amenity)}}>
                      {booking.amenity}
                    </span> */}
                    {/* <span className='justify-start text-start ml-15' >{booking.amenity}</span> */}
                    <span style={{
                    ...getAmenityStyle(booking.amenity),
                    display: 'inline-flex',
                    padding: '4px 12px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '4px',
                    borderRadius: '13px',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontSize: '12px',
                    fontWeight: 600,
                    lineHeight: '18px',
                    float:'inline-start',
                    marginLeft:'60px'
                  }}>
                    {booking.amenity}
                  </span>
                  </td>
                  <td className="px-6 py-4"></td>
                  <td className="px-6 py-4 flex justify-end">
                    <svg onClick={() => handleEditClick(booking, index)} style={{cursor:'pointer'}} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.7586 5.73201L14.268 2.24061C14.1519 2.1245 14.0141 2.0324 13.8624 1.96957C13.7107 1.90673 13.5482 1.87439 13.384 1.87439C13.2198 1.87439 13.0572 1.90673 12.9056 1.96957C12.7539 2.0324 12.6161 2.1245 12.5 2.24061L2.86641 11.875C2.74983 11.9906 2.65741 12.1283 2.59451 12.28C2.5316 12.4317 2.49948 12.5944 2.50001 12.7586V16.25C2.50001 16.5815 2.6317 16.8994 2.86612 17.1339C3.10054 17.3683 3.41849 17.5 3.75001 17.5H7.24141C7.40563 17.5005 7.5683 17.4684 7.71999 17.4055C7.87168 17.3426 8.00935 17.2502 8.12501 17.1336L17.7586 7.49998C17.8747 7.3839 17.9668 7.24609 18.0296 7.09442C18.0925 6.94274 18.1248 6.78017 18.1248 6.616C18.1248 6.45182 18.0925 6.28925 18.0296 6.13758C17.9668 5.9859 17.8747 5.84809 17.7586 5.73201ZM7.24141 16.25H3.75001V12.7586L10.625 5.88358L14.1164 9.37498L7.24141 16.25ZM15 8.49061L11.5086 4.99998L13.3836 3.12498L16.875 6.61561L15 8.49061Z" fill="#6B7280"/>
                    </svg>
                    <svg onClick={()=> handleDeleteClick(index)} style={{cursor:'pointer'}} className="ml-6" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.875 3.75H3.125C2.95924 3.75 2.80027 3.81585 2.68306 3.93306C2.56585 4.05027 2.5 4.20924 2.5 4.375C2.5 4.54076 2.56585 4.69973 2.68306 4.81694C2.80027 4.93415 2.95924 5 3.125 5H3.75V16.25C3.75 16.5815 3.8817 16.8995 4.11612 17.1339C4.35054 17.3683 4.66848 17.5 5 17.5H15C15.3315 17.5 15.6495 17.3683 15.8839 17.1339C16.1183 16.8995 16.25 16.5815 16.25 16.25V5H16.875C17.0408 5 17.1997 4.93415 17.3169 4.81694C17.4342 4.69973 17.5 4.54076 17.5 4.375C17.5 4.20924 17.4342 4.05027 17.3169 3.93306C17.1997 3.81585 17.0408 3.75 16.875 3.75ZM15 16.25H5V5H15V16.25ZM6.25 1.875C6.25 1.70924 6.31585 1.55027 6.43306 1.43306C6.55027 1.31585 6.70924 1.25 6.875 1.25H13.125C13.2908 1.25 13.4497 1.31585 13.5669 1.43306C13.6842 1.55027 13.75 1.70924 13.75 1.875C13.75 2.04076 13.6842 2.19973 13.5669 2.31694C13.4497 2.43415 13.2908 2.5 13.125 2.5H6.875C6.70924 2.5 6.55027 2.43415 6.43306 2.31694C6.31585 2.19973 6.25 2.04076 6.25 1.875Z" fill="#EF4444"/>
                    </svg>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EditingBookingModal 
        isOpen={isEditModalOpen} 
        onClose={handleCloseModal} 
        booking={editingBooking} 
        onSave={handleSaveEdit} 
      />
    </div>
  );
};

export default ScrollableBookingTable;