import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ScrollableBookingTable = () => {
  const [bookings, setBookings] = useState([
    { name: "Marvin McKinney", slotTime: "9:00 - 10:00 am", slotDate: "8 Sep, 2020", amenity: "Swimming pool" },
    { name: "Kathryn Murphy", slotTime: "2:00 - 3: 00 pm", slotDate: "1 Feb, 2020", amenity: "Tennis court" },
    { name: "Annette Black", slotTime: "3:00 - 4:00 am", slotDate: "17 Oct, 2020", amenity: "Mini theater" },
    { name: "Jacob Jones", slotTime: "9:00 - 12:00 am", slotDate: "8 Sep, 2020", amenity: "Swimming pool" },
    { name: "Leslie Alexander", slotTime: "2:00 - 3: 00 pm", slotDate: "22 Oct, 2020", amenity: "Tennis court" },
    { name: "Annette Black", slotTime: "3:00 - 4:00 am", slotDate: "17 Oct, 2020", amenity: "Mini theater" },
    { name: "Jacob Jones", slotTime: "9:00 - 12:00 am", slotDate: "8 Sep, 2020", amenity: "Swimming pool" },
    { name: "Leslie Alexander", slotTime: "2:00 - 3: 00 pm", slotDate: "22 Oct, 2020", amenity: "Tennis court" },
    // Add more bookings to test scrolling
  ]);

  const handleEditClick = (booking, index) => {
    // Implement edit functionality
  };

  const handleDeleteClick = (index) => {
    const updatedBookings = bookings.filter((_, i) => i !== index);
    setBookings(updatedBookings);
  };

  const getAmenityStyle = (amenity) => {
    switch(amenity) {
      case 'Swimming pool':
        return { backgroundColor: 'var(--Blue-25, #EFF6FF)', color: 'var(--Blue-700, #1E40AF)' };
      case 'Tennis court':
        return { backgroundColor: 'var(--Emerald-25, #F0FDF4)', color: 'var(--Emerald-700, #166534)' };
      case 'Mini theater':
        return { backgroundColor: 'var(--Rose-25, #FFF1F2)', color: 'var(--Rose-700, #9F1239)' };
      default:
        return { backgroundColor: '#F3F4F6', color: '#4B5563' };
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      alignSelf: 'stretch',
      borderRadius: '12px',
      border: '1px solid var(--Gray-100, #E5E7EB)',
      background: 'var(--Base-White, #FFF)',
      maxHeight: '500px', // Adjust as needed
      overflow: 'hidden'
    }}>
      <div style={{ width: '100%', padding: '16px 24px', borderBottom: '1px solid var(--Gray-100, #E5E7EB)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{
              color: 'var(--Gray-900, #030712)',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: '24px'
            }}>Recent Bookings</h2>
            <span style={{
              color: 'var(--Gray-400, #6B7280)',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: '12px',
              fontWeight: 400,
              lineHeight: '18px'
            }}>View all your recent Bookings</span>
          </div>
          <Link to="/booking" style={{
            color: 'var(--Gray-900, #030712)',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: '12px',
            fontWeight: 600,
            lineHeight: '18px',
            textDecorationLine: 'underline',
            display: 'flex',
            alignItems: 'center'
          }}>
            View all
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="14" viewBox="0 0 11 14" fill="none" style={{ marginLeft: '4px' }}>
              <path d="M8.1642 7.40393L4.99233 11.2102C4.90295 11.3174 4.78172 11.3777 4.65532 11.3777C4.52891 11.3777 4.40769 11.3174 4.31831 11.2102C4.22892 11.1029 4.17871 10.9575 4.17871 10.8058C4.17871 10.6541 4.22892 10.5086 4.31831 10.4014L7.15357 6.99999L4.3191 3.59768C4.27484 3.54457 4.23974 3.48152 4.21578 3.41213C4.19183 3.34274 4.1795 3.26837 4.1795 3.19327C4.1795 3.11816 4.19183 3.04379 4.21578 2.9744C4.23974 2.90501 4.27484 2.84196 4.3191 2.78885C4.36336 2.73574 4.4159 2.69362 4.47372 2.66487C4.53155 2.63613 4.59352 2.62134 4.65611 2.62134C4.7187 2.62134 4.78068 2.63613 4.8385 2.66487C4.89632 2.69362 4.94887 2.73574 4.99312 2.78885L8.165 6.5951C8.2093 6.64821 8.24443 6.71128 8.26838 6.78072C8.29232 6.85015 8.30461 6.92457 8.30454 6.99971C8.30446 7.07486 8.29203 7.14924 8.26795 7.21861C8.24387 7.28797 8.20861 7.35095 8.1642 7.40393Z" fill="black"/>
            </svg>
          </Link>
        </div>
       <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
    <thead style={{
      position: 'sticky',
      top: 0,
      backgroundColor: 'white',
      zIndex: 1,
      borderBottom: '1px solid var(--Gray-100, #E5E7EB)'
    }}>
      <tr style={{
        color: 'var(--Gray-500, #4B5563)',
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        fontSize: '12px',
        fontWeight: 600,
        lineHeight: '18px',
        height: '44px',
      }}>
        <th style={{ 
          textAlign: 'center', 
          padding: '12px 40px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          height: '44px',
        }}>Name</th>
        <th style={{ 
          textAlign: 'center', 
          padding: '12px 40px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          height: '44px',
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '100%',
            position: 'relative'
          }}>
            Slot time
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 17 16" 
              fill="none"
              style={{
                position: 'absolute',
                right: '-28px', // Adjust this value to get the right spacing
              }}
            >
              <path d="M8.66699 3.66667V12M8.66699 12L4.66699 8M8.66699 12L12.667 8" stroke="#4B5563" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </th>
        <th style={{ 
          textAlign: 'center', 
          padding: '12px 40px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          height: '44px',
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '100%',
            position: 'relative'
          }}>
            Slot date
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 17 16" 
              fill="none"
              style={{
                position: 'absolute',
                right: '-28px', // Adjust this value to get the right spacing
              }}
            >
              <path d="M8.66699 3.66667V12M8.66699 12L4.66699 8M8.66699 12L12.667 8" stroke="#4B5563" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </th>
        <th style={{ 
          textAlign: 'center', 
          padding: '12px 40px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          height: '44px',
        }}>Amenities</th>
        <th style={{ 
          textAlign: 'center', 
          padding: '12px 40px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          height: '44px',
        }}>Actions</th>
      </tr>
    </thead>
  </table>
      </div>
      <div style={{ overflowY: 'auto', width: '100%', maxHeight: 'calc(100% - 120px)' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={index} style={{ 
                backgroundColor: 'white',
                borderBottom: '1px solid var(--Gray-100, #E5E7EB)'
              }}>
                <td style={{
                  padding: '16px',
                  color: 'var(--Gray-900, #030712)',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px'
                }}>{booking.name}</td>
                <td style={{
                  padding: '16px',
                  color: 'var(--Gray-500, #4B5563)',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px'
                }}>{booking.slotTime}</td>
                <td style={{
                  padding: '16px',
                  color: 'var(--Gray-500, #4B5563)',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px'
                }}>{booking.slotDate}</td>
                <td style={{ padding: '16px' }}>
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
                    lineHeight: '18px'
                  }}>
                    {booking.amenity}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button onClick={() => handleEditClick(booking, index)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '8px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M17.7586 5.73201L14.268 2.24061C14.1519 2.1245 14.0141 2.0324 13.8624 1.96957C13.7107 1.90673 13.5482 1.87439 13.384 1.87439C13.2198 1.87439 13.0572 1.90673 12.9056 1.96957C12.7539 2.0324 12.6161 2.1245 12.5 2.24061L2.86641 11.875C2.74983 11.9906 2.65741 12.1283 2.59451 12.28C2.5316 12.4317 2.49948 12.5944 2.50001 12.7586V16.25C2.50001 16.5815 2.6317 16.8994 2.86612 17.1339C3.10054 17.3683 3.41849 17.5 3.75001 17.5H7.24141C7.40563 17.5005 7.5683 17.4684 7.71999 17.4055C7.87168 17.3426 8.00935 17.2502 8.12501 17.1336L17.7586 7.49998C17.8747 7.3839 17.9668 7.24609 18.0296 7.09442C18.0925 6.94274 18.1248 6.78017 18.1248 6.616C18.1248 6.45182 18.0925 6.28925 18.0296 6.13758C17.9668 5.9859 17.8747 5.84809 17.7586 5.73201ZM7.24141 16.25H3.75001V12.7586L10.625 5.88358L14.1164 9.37498L7.24141 16.25ZM15 8.49061L11.5086 4.99998L13.3836 3.12498L16.875 6.61561L15 8.49061Z" fill="#6B7280"/>
                    </svg>
                  </button>
                  <button onClick={() => handleDeleteClick(index)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M16.875 3.75H3.125C2.95924 3.75 2.80027 3.81585 2.68306 3.93306C2.56585 4.05027 2.5 4.20924 2.5 4.375C2.5 4.54076 2.56585 4.69973 2.68306 4.81694C2.80027 4.93415 2.95924 5 3.125 5H3.75V16.25C3.75 16.5815 3.8817 16.8995 4.11612 17.1339C4.35054 17.3683 4.66848 17.5 5 17.5H15C15.3315 17.5 15.6495 17.3683 15.8839 17.1339C16.1183 16.8995 16.25 16.5815 16.25 16.25V5H16.875C17.0408 5 17.1997 4.93415 17.3169 4.81694C17.4342 4.69973 17.5 4.54076 17.5 4.375C17.5 4.20924 17.4342 4.05027 17.3169 3.93306C17.1997 3.81585 17.0408 3.75 16.875 3.75ZM15 16.25H5V5H15V16.25ZM6.25 1.875C6.25 1.70924 6.25 1.875C6.25 1.70924 6.31585 1.55027 6.43306 1.43306C6.55027 1.31585 6.70924 1.25 6.875 1.25H13.125C13.2908 1.25 13.4497 1.31585 13.5669 1.43306C13.6842 1.55027 13.75 1.70924 13.75 1.875C13.75 2.04076 13.6842 2.19973 13.5669 2.31694C13.4497 2.43415 13.2908 2.5 13.125 2.5H6.875C6.70924 2.5 6.55027 2.43415 6.43306 2.31694C6.31585 2.19973 6.25 2.04076 6.25 1.875Z" fill="#EF4444"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScrollableBookingTable;