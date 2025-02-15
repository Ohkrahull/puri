// import React, { useEffect, useRef, useState, useCallback } from "react";
// import styles from "./CustomScrollbar.module.css";
// import SortButton from "../Buttons/Sortdate";
// import EditingBookingModal from "./EditingModal";
// import dayjs from "dayjs";
// import customParseFormat from "dayjs/plugin/customParseFormat";
// import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
// import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
// import { useAuth } from "../context/AuthContext";
// import { toast } from "react-toastify";
// import DeleteModal from "../Modals/DeleteModal";
// import {
//   fetchAllBookings,
//   updateBooking,
//   deleteBooking,
// } from "../firebase/services/bookingsData";
// import { collection, deleteDoc, doc, getFirestore, onSnapshot, orderBy, query } from "firebase/firestore";
// import { getApp } from "firebase/app";

// dayjs.extend(customParseFormat);
// dayjs.extend(isSameOrAfter);
// dayjs.extend(isSameOrBefore);


// // import React, { useState } from 'react';

// const SearchInput = ({ alerts, onSearch }) => {
//     const [searchTerm, setSearchTerm] = useState("");
//     const [showDropdown, setShowDropdown] = useState(false);
  
//     const handleInputChange = (e) => {
//       const value = e.target.value;
//       setSearchTerm(value);
//       setShowDropdown(value.length > 0);
//       onSearch(value);
//     };
  
//     const handleItemClick = (alert) => {
//       const fullName = `${alert.userDetails?.firstName || ''} ${alert.userDetails?.lastName || ''}`.trim() || 'N/A';
//       setSearchTerm(fullName);
//       setShowDropdown(false);
//       onSearch(alert);
//     };
  
//     const filteredAlerts = alerts.filter(
//       (alert) =>
//         (alert.userDetails && 
//          `${alert.userDetails.firstName || ''} ${alert.userDetails.lastName || ''}`
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase())) ||
//         (alert.type && alert.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (alert.flatNumber && alert.flatNumber.toString().toLowerCase().includes(searchTerm.toLowerCase()))
//     );
  
//     const truncateText = (text, charLimit = 20) => {
//       if (!text) return 'N/A';
//       if (text.length <= charLimit) {
//         return text;
//       }
      
//       const lastSpace = text.lastIndexOf(' ', charLimit);
      
//       if (lastSpace > 0) {
//         return text.slice(0, lastSpace) + '...';
//       }
      
//       return text.slice(0, charLimit) + '...';
//     };
  
//     return (
//       <div className="relative w-full sm:w-[250px] md:w-[300px]">
//         <div
//           className="flex items-center justify-between p-2 sm:py-3 border border-[#D1D5DB] rounded-[10px] text-[#6B7280] text-sm sm:text-base font-['Plus_Jakarta']"
//           style={{ fontFamily: "Plus_Jakarta", backgroundColor:'#F3F3F3' }}
//         >
//           <input
//             type="text"
//             placeholder="Search"
//             value={searchTerm}
//             style={{
//               border: "none",
//               outline: "none",
//               boxShadow: "none",
//               fontSize: "16px",
//             }}
//             onChange={handleInputChange}
//             className="w-full bg-transparent border-none outline-none shadow-none text-inherit font-inherit text-sm sm:text-base"
//           />
//           <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="w-5 h-5 sm:w-6 sm:h-6 mr-2"
//           viewBox="0 0 20 20"
//           fill="none"
//         >
//           <path
//             d="M17.9419 17.0579L14.0302 13.1469C15.1639 11.7858 15.7293 10.0399 15.6086 8.2725C15.488 6.50512 14.6906 4.85229 13.3823 3.65785C12.074 2.46341 10.3557 1.81932 8.58462 1.85957C6.81357 1.89982 5.12622 2.62131 3.87358 3.87395C2.62094 5.12659 1.89945 6.81394 1.8592 8.58498C1.81895 10.356 2.46304 12.0744 3.65748 13.3827C4.85192 14.6909 6.50475 15.4883 8.27214 15.609C10.0395 15.7297 11.7854 15.1643 13.1466 14.0305L17.0575 17.9422C17.1156 18.0003 17.1845 18.0464 17.2604 18.0778C17.3363 18.1092 17.4176 18.1254 17.4997 18.1254C17.5818 18.1254 17.6631 18.1092 17.739 18.0778C17.8149 18.0464 17.8838 18.0003 17.9419 17.9422C17.9999 17.8842 18.046 17.8152 18.0774 17.7394C18.1089 17.6635 18.125 17.5822 18.125 17.5001C18.125 17.4179 18.1089 17.3366 18.0774 17.2607C18.046 17.1849 17.9999 17.1159 17.9419 17.0579ZM3.12469 8.75006C3.12469 7.63754 3.45459 6.55 4.07267 5.62497C4.69076 4.69995 5.56926 3.97898 6.5971 3.55323C7.62493 3.12749 8.75593 3.0161 9.84707 3.23314C10.9382 3.45018 11.9405 3.98591 12.7272 4.77258C13.5138 5.55925 14.0496 6.56153 14.2666 7.65267C14.4837 8.74382 14.3723 9.87482 13.9465 10.9027C13.5208 11.9305 12.7998 12.809 11.8748 13.4271C10.9497 14.0452 9.86221 14.3751 8.74969 14.3751C7.25836 14.3734 5.82858 13.7802 4.77404 12.7257C3.71951 11.6712 3.12634 10.2414 3.12469 8.75006Z"
//             fill="#6B7280"
//           />
//         </svg>
//         </div>
  
//         {showDropdown && filteredAlerts.length > 0 && (
//           <div
//             className="absolute w-full mt-2 sm:mt-3 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-y-auto"
//             style={{
//               maxHeight: filteredAlerts.length > 4 ? "240px" : "auto",
//             }}
//           >
//             {filteredAlerts.map((alert, index) => {
//               const fullName = `${alert.userDetails?.firstName || ''} ${alert.userDetails?.lastName || ''}`.trim() || 'N/A';
//               return (
//                 <div
//                   key={index}
//                   className="px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-100 cursor-pointer border-b border-[#E5E7EB] last:border-b-0"
//                   onClick={() => handleItemClick(alert)}
//                 >
//                   <div className="font-medium flex justify-between text-sm sm:text-base text-[#6B7280]">
//                     {truncateText(fullName, 20)}
//                     <span>{alert.wing || 'N/A'} - {alert.flatNumber || 'N/A'}</span>
//                   </div>
                  
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     );
//   };

// // export default SearchInput;

// // export default SearchInput;

// const SOSTable = ({ onEditClick, onDeleteClick }) => {
//     const [guardUsers, setGuardUsers] = useState({});
//     const [alerts, setAlerts] = useState([]);
//     const [filteredAlerts, setFilteredAlerts] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [dateSortDirection, setDateSortDirection] = useState('asc');
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
//   const [bookings, setBookings] = useState([]);
//   // const { bookings, fetchAllBookings, deleteBooking, updateBooking } = useAuth();
//   // const [bookings, setBookings] = useState([]);
//   const [filteredBookings, setFilteredBookings] = useState([]);
//   const [selectedAmenity, setSelectedAmenity] = useState("All Category");
//   const [isAmenityDropdownOpen, setIsAmenityDropdownOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [deleteItemName, setDeleteItemName] = useState("");
//   const [deleteFunction, setDeleteFunction] = useState(null);
//   const [amenities, setAmenities] = useState([
//     "All Category",
//     "Medical",
//     "Theft",
//     "Lift",
//     "Fire",
//   ]);
//   const [selectedSosType, setSelectedSosType] = useState("All Category");
//   const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
//   const [sosTypes] = useState([
//     "All Category",
//     "MEDICAL",
//     "FIRE",
//     "LIFT",  
//     "THEFT",
//     "SECURITY"
//   ]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortedBookings, setSortedBookings] = useState([]);
//   const [selectedBooking, setSelectedBooking] = useState(null);

//   const amenityDropdownRef = useRef(null);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [editingBooking, setEditingBooking] = useState(null);
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
//   const searchRef = useRef(null);
//   const amenityRef = useRef(null);
//   const sortDateRef = useRef(null);
//   const db = getFirestore(getApp());

//   const itemsPerPage = 10;
//   const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredAlerts.slice(
//     indexOfFirstItem,
//     indexOfLastItem
//   );
//   const isAllSelected =
//     currentItems.length > 0 && selectedRows.length === currentItems.length;


//      // Real-time data fetching
//   useEffect(() => {
//     const sosQuery = query(
//       collection(db, "sosAlerts"),
//       orderBy("createdAt", "desc") // Newest first
//     );

//     const unsubscribe = onSnapshot(sosQuery, (snapshot) => {
//       const sosData = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       setAlerts(sosData);
//       setFilteredAlerts(sosData);

//       console.log("All SOS Alerts:", sosData);
//     }, (error) => {
//       console.error("Error fetching SOS alerts:", error);
//       toast.error("Failed to fetch SOS alerts");
//     });

//     return () => unsubscribe();
//   }, []);

//    // Search functionality
//    useEffect(() => {
//     const filtered = alerts.filter(alert => {
//       const name = `${alert.userDetails?.firstName || ''} ${alert.userDetails?.lastName || ''}`.toLowerCase();
//       const flatNumber = alert.flatNumber?.toString().toLowerCase();
//       const type = alert.type?.toLowerCase();
//       const search = searchTerm.toLowerCase();

//       return name.includes(search) || 
//              flatNumber?.includes(search) || 
//              type?.includes(search);
//     });
//     setFilteredAlerts(filtered);
//     setCurrentPage(1);
//   }, [searchTerm, alerts]);

//   const handleSearch = (termOrAlert) => {
//     if (!termOrAlert) {
//       setFilteredAlerts(alerts);
//       return;
//     }
  
//     // If termOrAlert is an object (an alert)
//     if (typeof termOrAlert === 'object') {
//       const filtered = alerts.filter(alert => alert.id === termOrAlert.id);
//       setFilteredAlerts(filtered);
//     } else {
//       // If termOrAlert is a string (search term)
//       const searchStr = termOrAlert.toLowerCase();
//       const filtered = alerts.filter(alert => {
//         const name = `${alert.userDetails?.firstName || ''} ${alert.userDetails?.lastName || ''}`.toLowerCase();
//         const flatNumber = alert.flatNumber?.toString().toLowerCase();
//         const type = alert.type?.toLowerCase();
        
//         return name.includes(searchStr) || 
//                flatNumber?.includes(searchStr) || 
//                type?.includes(searchStr);
//       });
//       setFilteredAlerts(filtered);
//     }
//     setCurrentPage(1);
//   };

//   const handleSosTypeSelect = (type) => {
//     setSelectedSosType(type);
//     setIsTypeDropdownOpen(false);
  
//     if (type === "All Category") {
//       setFilteredAlerts(alerts);
//     } else {
//       const filtered = alerts.filter((alert) => 
//         alert.type === type
//       );
//       setFilteredAlerts(filtered);
//     }
//     setCurrentPage(1);
//   };

//   // Replace toggleDropdown
// const toggleTypeDropdown = () => {
//     setIsTypeDropdownOpen(!isTypeDropdownOpen);
//   };

//   const getStatusStyle = (status) => {
//     switch (status?.toUpperCase()) {
//       case 'ACKNOWLEDGED':
//         return { backgroundColor: '#FEF3C7', color: '#92400E' }; // Amber
//       case 'RESOLVED':
//         return { backgroundColor: '#DEF7EC', color: '#03543F' }; // Green
//       case 'PENDING':
//         return { backgroundColor: '#FEE2E2', color: '#991B1B' }; // Red
//       default:
//         return { backgroundColor: '#E5E7EB', color: '#374151' }; // Gray
//     }
//   };

//   const getTypeStyle = (type) => {
//     switch (type?.toUpperCase()) {
//       case 'MEDICAL':
//         return { backgroundColor: '#FEE2E2', color: '#991B1B' }; // Red
//       case 'FIRE':
//         return { backgroundColor: '#FFEDD5', color: '#9A3412' }; // Orange
//       case 'SECURITY':
//         return { backgroundColor: '#DBEAFE', color: '#1E40AF' }; // Blue
//       case 'LIFT':
//         return { backgroundColor: '#E0E7FF', color: '#3730A3' }; // Indigo
//       case 'THEFT':
//         return { backgroundColor: '#FCE7F3', color: '#9D174D' }; // Pink
//       default:
//         return { backgroundColor: '#E5E7EB', color: '#374151' }; // Gray
//     }
//   };

//   useEffect(() => {
//     const guardQuery = query(collection(db, "guardUser"));
//     const unsubscribe = onSnapshot(guardQuery, (snapshot) => {
//       const guards = {};
//       snapshot.docs.forEach(doc => {
//         guards[doc.data().employeeId] = {
//           firstName: doc.data().firstName,
//           lastName: doc.data().lastName
//         };
//       });
//       setGuardUsers(guards);
//     });
  
//     return () => unsubscribe();
//   }, [db]);

//   const formatTimeWithAmPm = (timestamp) => {
//     if (!timestamp) return 'N/A';
//     return dayjs(timestamp.toDate()).format('hh:mm A');
//   };

// //   // Fetch bookings on mount
// //   useEffect(() => {
// //     fetchAllBookings((fetchedBookings) => {
// //       console.log("fetchedBookings",fetchedBookings);
      
// //       setBookings(fetchedBookings);
// //       setFilteredBookings(fetchedBookings);
// //     });
// //   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setIsSearchDropdownOpen(false);
//       }
//       if (amenityRef.current && !amenityRef.current.contains(event.target)) {
//         setIsAmenityDropdownOpen(false);
//       }
//       if (sortDateRef.current && !sortDateRef.current.contains(event.target)) {
//         // Assuming SortButton has a method to close its dropdown
//         sortDateRef.current.closeDropdown();
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

 

//   const filterBookings = useCallback(
//     (bookingOrTerm, amenity) => {
//       let filtered = bookings;
  
//       if (bookingOrTerm) {
//         if (typeof bookingOrTerm === 'string') {
//           const term = bookingOrTerm.toLowerCase();
//           filtered = filtered.filter(
//             (booking) =>
//               `${booking.userDetails?.firstName || ''} ${booking.userDetails?.lastName || ''}`
//                 .toLowerCase()
//                 .includes(term) ||
//               booking.amenityName?.toLowerCase().includes(term)
//           );
//         } else {
//           // If a booking object is passed, filter for exact match
//           filtered = filtered.filter(
//             (booking) =>
//               booking.id === bookingOrTerm.id ||
//               (booking.userDetails?.firstName === bookingOrTerm.userDetails?.firstName &&
//                booking.userDetails?.lastName === bookingOrTerm.userDetails?.lastName)
//           );
//         }
//       }
  
//       if (amenity && amenity !== "All Amenities") {
//         filtered = filtered.filter(
//           (booking) =>
//             booking.amenityName?.toLowerCase() === amenity.toLowerCase()
//         );
//       }

//       // Apply date sort
//   filtered.sort((a, b) => {
//     const dateA = dayjs(a.date.toDate());
//     const dateB = dayjs(b.date.toDate());
//     return dateSortDirection === 'asc' ? dateA - dateB : dateB - dateA;
//   });
  
//       setFilteredBookings(filtered);
//       setCurrentPage(1);
//     },
//     [bookings,searchTerm,selectedAmenity,dateSortDirection]
//   );

//   useEffect(() => {
//     filterBookings(searchTerm, selectedAmenity);
//   }, [filterBookings, searchTerm, selectedAmenity]);

  

//   const handleRowSelect = (index) => {
//     setSelectedRows((prev) => {
//       if (prev.includes(index)) {
//         return prev.filter((i) => i !== index);
//       } else {
//         return [...prev, index];
//       }
//     });
//   };

//   const handleSelectAll = () => {
//     if (selectedRows.length === currentItems.length) {
//       setSelectedRows([]);
//     } else {
//       setSelectedRows(currentItems.map((_, index) => indexOfFirstItem + index));
//     }
//   };

// //   const handleDeleteSelected = () => {
// //     setDeleteItemName("all selected bookings");
// //     setDeleteFunction(() => async () => {
// //       try {
// //         for (const index of selectedRows) {
// //           const bookingId = filteredBookings[index].id;
// //           await deleteBooking(bookingId);
// //         }
// //         fetchAllBookings(setBookings);
// //         setSelectedRows([]);
// //         toast.success("Selected bookings deleted successfully");
// //         setIsDeleteModalOpen(false);
// //       } catch (error) {
// //         toast.error("Failed to delete selected bookings");
// //       }
// //     });
// //     setIsDeleteModalOpen(true);
// //   };

// const handleDeleteSelected = () => {
//     setDeleteItemName(`${selectedRows.length} selected alerts`);
//     setDeleteFunction(() => async () => {
//       try {
//         // Get the actual alerts to delete from the currentItems array
//         const alertsToDelete = selectedRows.map(index => {
//           const relativeIndex = index - indexOfFirstItem;
//           return currentItems[relativeIndex];
//         });
  
//         // Delete each alert
//         for (const alert of alertsToDelete) {
//           await deleteDoc(doc(db, "sosAlerts", alert.id));
//         }
  
//         setSelectedRows([]);
//         toast.success("Selected alerts deleted successfully");
//         setIsDeleteModalOpen(false);
//       } catch (error) {
//         console.error("Error deleting alerts:", error);
//         toast.error("Failed to delete selected alerts");
//       }
//     });
//     setIsDeleteModalOpen(true);
//   };
  
//   const handleDeleteClick = (alert) => {
//     const fullName = `${alert.userDetails?.firstName || 'Unknown'} ${alert.userDetails?.lastName || ''}`.trim();
//     setDeleteItemName(`SOS alert from ${fullName}`);
//     setDeleteFunction(() => async () => {
//       try {
//         await deleteDoc(doc(db, "sosAlerts", alert.id));
//         toast.success("Alert deleted successfully");
//         setIsDeleteModalOpen(false);
//       } catch (error) {
//         console.error("Error deleting alert:", error);
//         toast.error("Failed to delete alert");
//       }
//     });
//     setIsDeleteModalOpen(true);
//   };
//   const handleEditClick = (booking) => {
//     setEditingBooking(booking);
//     setIsEditModalOpen(true);
//   };



// //   const handleDeleteClick = (booking) => {
// //     const firstName = booking.userDetails?.firstName || 'Unknown';
// //     const lastName = booking.userDetails?.lastName || 'User';
// //     setDeleteItemName(`booking for ${firstName} ${lastName}`);
// //     setDeleteFunction(() => async () => {
// //       try {
// //         await deleteBooking(booking.id);
// //         setBookings(bookings.filter((b) => b.id !== booking.id));
// //         toast.success("Booking deleted successfully");
// //         setIsDeleteModalOpen(false);
// //       } catch (error) {
// //         toast.error("Failed to delete booking");
// //       }
// //     });
// //     setIsDeleteModalOpen(true);
// //   };

//   const handleSaveEdit = async (updatedBooking) => {
//     try {
//       await updateBooking(updatedBooking.id, updatedBooking);
//       fetchAllBookings(setBookings); // Refetch bookings after update
//       toast.success("Booking updated successfully");
//       setIsEditModalOpen(false);
//     } catch (error) {
//       toast.error("Failed to update booking");
//     }
//   };

//   const handleCloseModal = () => {
//     setIsEditModalOpen(false);
//     setEditingBooking(null);
//     // setEditingIndex(null);
//   };

//   const handlePrevious = () => {
//     setCurrentPage((prev) => Math.max(prev - 1, 1));
//   };

//   const handleNext = () => {
//     setCurrentPage((prev) => Math.min(prev + 1, totalPages));
//   };

 

//   useEffect(() => {
//     const handleResize = () => setWindowWidth(window.innerWidth);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);


//   // Updated handleSearch function in ScrollableAdminBookingTable
// //   const handleSearch = (bookingOrTerm) => {
// //     if (bookingOrTerm && typeof bookingOrTerm === 'object') {
// //       // If a booking object is passed
// //       setSearchTerm(`${bookingOrTerm.userDetails?.firstName || ''} ${bookingOrTerm.userDetails?.lastName || ''}`);
// //       filterBookings(bookingOrTerm, selectedAmenity);
// //     } else {
// //       // If a string is passed or clearing the search
// //       setSearchTerm(bookingOrTerm || '');
// //       filterBookings(bookingOrTerm || '', selectedAmenity);
// //     }
// //   };

//   const handleAmenitySelect = (amenity) => {
//     if (amenity === "Sort Category") {
//       const sortedAmenities = [...amenities].sort((a, b) => a.localeCompare(b));
//       setAmenities([
//         "Sort Amenities",
//         ...sortedAmenities.filter(
//           (a) => a !== "Sort Category" && a !== "All Category"
//         ),
//       ]);
//     } else {
//       setSelectedAmenity(amenity);
//       setIsAmenityDropdownOpen(false);
//       // filterBookings(searchTerm, amenity);
//     }
//   };

//   const toggleDropdown = () => {
//     setIsAmenityDropdownOpen(!isAmenityDropdownOpen);
//   };


//   // Helper function to parse dates
//   const parseDate = (dateValue) => {
//     if (dateValue instanceof Date) {
//       return dayjs(dateValue);
//     }
//     if (typeof dateValue === "object" && dateValue.seconds) {
//       // Firestore Timestamp
//       return dayjs(dateValue.toDate());
//     }
//     if (typeof dateValue === "string") {
//       return dayjs(dateValue);
//     }
//     console.error("Unrecognized date format:", dateValue);
//     return null;
//   };

//   const handleDateSort = (columnName) => {
//     const sortedAlerts = [...filteredAlerts].sort((a, b) => {
//       const timeA = a.createdAt.toDate().getTime();
//       const timeB = b.createdAt.toDate().getTime();
//       return dateSortDirection === 'asc' ? timeA - timeB : timeB - timeA;
//     });
    
//     setFilteredAlerts(sortedAlerts);
//     setDateSortDirection(dateSortDirection === 'asc' ? 'desc' : 'asc');
//   };


//   const handleSort = useCallback(
//     (startDate, endDate) => {
//       let filtered;
//       if (!startDate && !endDate) {
//         filtered = alerts;
//       } else {
//         filtered = alerts.filter((alert) => {
//           // Get the alert's creation date
//           const alertDate = alert.createdAt ? dayjs(alert.createdAt.toDate()) : null;
//           if (!alertDate) return false;

//           if (startDate && endDate) {
//             return (
//               alertDate.isSameOrAfter(dayjs(startDate, "DD MMM, YYYY"), "day") &&
//               alertDate.isSameOrBefore(dayjs(endDate, "DD MMM, YYYY"), "day")
//             );
//           } else if (startDate) {
//             return alertDate.isSameOrAfter(dayjs(startDate, "DD MMM, YYYY"), "day");
//           } else if (endDate) {
//             return alertDate.isSameOrBefore(dayjs(endDate, "DD MMM, YYYY"), "day");
//           }
//           return true;
//         });
//       }

//       // Sort by creation date
//       filtered.sort((a, b) => {
//         const dateA = a.createdAt ? a.createdAt.toDate().getTime() : 0;
//         const dateB = b.createdAt ? b.createdAt.toDate().getTime() : 0;
//         return dateSortDirection === 'asc' ? dateA - dateB : dateB - dateA;
//       });

//       setFilteredAlerts(filtered);
//       setCurrentPage(1);
//     },
//     [alerts, dateSortDirection]
//   );
  
//   // Close the dropdown if clicking outside
//   const handleClickOutside = (event) => {
//     if (
//       amenityDropdownRef.current &&
//       !amenityDropdownRef.current.contains(event.target)
//     ) {
//       setIsAmenityDropdownOpen(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleItemClick = (booking) => {
//     // setSelectedBooking(booking);
//     setFilteredBookings([booking]);
//     setCurrentPage(1);
//   };

 

//   const getAmenityStyle = (amenity) => {
//     switch (
//       amenity.toLowerCase() // Use toLowerCase to ensure case-insensitive matching
//     ) {
//       case "swimming pool":
//         return {
//           backgroundColor: "var(--Blue-25, #EFF6FF)",
//           color: "var(--Blue-700, #1E40AF)",
//         };
//       case "gym":
//         return {
//           backgroundColor: "var(--Rose-25, #FFF1F2)",
//           color: "var(--Rose-700, #9F1239)",
//         };
//       case "multi-purpose court":
//         return {
//           backgroundColor: "var(--Emerald-25, #F0FDF4)",
//           color: "var(--Emerald-700, #166534)",
//         };
//       case "banquet hall":
//         return {
//           backgroundColor: "var(--Purple-25, #FAF5FF)",
//           color: "var(--Purple-700, #6B21A8)",
//         };
//       case "party hall":
//         return {
//           backgroundColor: "var(--Lime-25, #F7FEE7)",
//           color: "var(--Lime-500, #65A30D)",
//         };
//       case "jacuzzi & spa":
//         return {
//           backgroundColor: "var(--Cyan-25, #ECFEFF)",
//           color: "var(--Cyan-700, #155E75)",
//         };
//       case "indoor theatre":
//         return {
//           backgroundColor: "var(--Pink-25, #FDF2F8)",
//           color: "var(--Pink-700, #9D174D)",
//         };
//       case "movie lawn":
//         return {
//           backgroundColor: "var(--Orange-25, #FFF7ED)",
//           color: "var(--Orange-700, #9A3412)",
//         };
//       case "table tennis room":
//         return {
//           backgroundColor: "var(--Yellow-25, #FEFCE8)",
//           color: "var(--Yellow-700, #854D0E)",
//         };

//       // case 'multi-purpose Court':
//       // case 'banquet hall':
//       // case 'party hall',
//       // case 'jacuzzi & spa':
//       //   case:'Indoor Theatre':
//       //   case:'movie lawn',
//       //   // case:'table tennis room':
//       default:
//         return { backgroundColor: "#F3F4F6", color: "#4B5563" }; // Default styling
//     }
//   };

//   const CheckboxWithTick = ({ isSelected, onClick, isMinusIcon = false }) => (
//     <div
//       onClick={onClick}
//       style={{
//         width: "20px",
//         height: "20px",
//         border: "1px solid #6B7280",
//         borderRadius: "6px",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         cursor: "pointer",
//         backgroundColor: isSelected ? "#F3F4F6" : "white"
//       }}
//     >
//       {isSelected && (
//         isMinusIcon ? (
//           // Minus icon
//           <svg
//             width="12"
//             height="2"
//             viewBox="0 0 12 2"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M1 1H11"
//               stroke="#4F46E5"
//               strokeWidth="2"
//               strokeLinecap="round"
//             />
//           </svg>
//         ) : (
//           // Checkmark icon
//           <svg
//             width="12"
//             height="12"
//             viewBox="0 0 12 12"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M10 3L4.5 8.5L2 6"
//               stroke="#4F46E5"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//         )
//       )}
//     </div>
//   );

//   const dropdownButtonStyle = {
//     display: "flex",
//     padding: "8px 16px",
//     justifyContent: "space-between",
//     alignItems: "center",
//     border: "1px solid #D1D5DB",
//     borderRadius: "10px",
//     color: "#6B7280",
//     fontSize: "16px",
//     fontFamily: "Plus_Jakarta",
//     cursor: "pointer",
//     backgroundColor: "white",
//     width: windowWidth > 768 ? "242px" : "100%",
//     height: "50px",
//   };

//   const headerStyle = {
//     display: "flex",
//     flexDirection: windowWidth > 768 ? "row" : "column",
//     alignItems: windowWidth > 768 ? "center" : "stretch",
//     justifyContent: "space-between",
//     padding: "24px",
//     gap: "16px",
//   };

//   const buttonGroupStyle = {
//     display: "flex",
//     flexDirection: windowWidth > 768 ? "row" : "column",
//     gap: "10px",
//     width: windowWidth > 768 ? "auto" : "100%",
//   };

//   const dropdownStyle = {
//     position: "absolute",
//     top: "100%",
//     left: 0,
//     zIndex: 1000,
//     marginTop: "8px",
//     boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
//     backgroundColor: "white",
//     borderRadius: "8px",
//     width: "100%",
//     border: "1px solid #D1D5DB",
//     color: "#6B7280",
//   };
//   const dropdownContentStyle = {
//     position: "absolute",
//     top: "100%",
//     left: 0,
//     zIndex: 1000,
//     marginTop: "8px",
//     boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
//     backgroundColor: "white",
//     borderRadius: "8px",
//     width: "100%",
//     border: "1px solid #D1D5DB",
//     color: "#6B7280",
//   };

//   const dropdownItemStyle = {
//     padding: "8px 16px",
//     cursor: "pointer",
//     hover: {
//       backgroundColor: "#F3F4F6",
//     },
//     color: "var(--Gray-400, #6B7280)",
//     fontSize: "14px",
//     borderBottom: "1px solid var(--Gray-100, #E5E7EB)",
//   };

//   const leftSideSvg = (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="14"
//       height="14"
//       viewBox="0 0 14 14"
//       fill="none"
//     >
//       <path
//         d="M6.19254 10.3078C6.25065 10.3659 6.29674 10.4348 6.3282 10.5107C6.35965 10.5865 6.37584 10.6679 6.37584 10.75C6.37584 10.8321 6.35965 10.9135 6.3282 10.9893C6.29674 11.0652 6.25065 11.1341 6.19254 11.1922L3.69254 13.6922C3.63449 13.7503 3.56556 13.7964 3.48969 13.8279C3.41381 13.8593 3.33248 13.8755 3.25035 13.8755C3.16821 13.8755 3.08688 13.8593 3.01101 13.8279C2.93514 13.7964 2.86621 13.7503 2.80816 13.6922L0.30816 11.1922C0.250091 11.1341 0.204028 11.0652 0.172602 10.9893C0.141175 10.9134 0.125 10.8321 0.125 10.75C0.125 10.6679 0.141175 10.5866 0.172602 10.5107C0.204028 10.4348 0.250091 10.3659 0.30816 10.3078C0.425435 10.1905 0.584495 10.1247 0.750347 10.1247C0.832469 10.1247 0.913787 10.1408 0.989658 10.1723C1.06553 10.2037 1.13447 10.2497 1.19253 10.3078L2.62535 11.7414V0.750003C2.62535 0.584243 2.6912 0.425272 2.80841 0.308062C2.92562 0.190852 3.08459 0.125003 3.25035 0.125003C3.41611 0.125003 3.57508 0.190852 3.69229 0.308062C3.8095 0.425272 3.87535 0.584243 3.87535 0.750003V11.7414L5.30816 10.3078C5.36621 10.2497 5.43514 10.2036 5.51101 10.1722C5.58688 10.1407 5.66821 10.1245 5.75035 10.1245C5.83248 10.1245 5.91381 10.1407 5.98969 10.1722C6.06556 10.2036 6.13449 10.2497 6.19254 10.3078ZM13.6925 2.80782L11.1925 0.307816C11.1345 0.249706 11.0656 0.203606 10.9897 0.172154C10.9138 0.140701 10.8325 0.124512 10.7503 0.124512C10.6682 0.124512 10.5869 0.140701 10.511 0.172154C10.4351 0.203606 10.3662 0.249706 10.3082 0.307816L7.80816 2.80782C7.69088 2.92509 7.625 3.08415 7.625 3.25C7.625 3.41586 7.69088 3.57492 7.80816 3.69219C7.92544 3.80947 8.0845 3.87535 8.25035 3.87535C8.4162 3.87535 8.57526 3.80947 8.69254 3.69219L10.1253 2.2586V13.25C10.1253 13.4158 10.1912 13.5747 10.3084 13.6919C10.4256 13.8092 10.5846 13.875 10.7503 13.875C10.9161 13.875 11.0751 13.8092 11.1923 13.6919C11.3095 13.5747 11.3753 13.4158 11.3753 13.25V2.2586L12.8082 3.69219C12.9254 3.80947 13.0845 3.87535 13.2503 3.87535C13.4162 3.87535 13.5753 3.80947 13.6925 3.69219C13.8098 3.57492 13.8757 3.41586 13.8757 3.25C13.8757 3.08415 13.8098 2.92509 13.6925 2.80782Z"
//         fill="#6B7280"
//       />
//     </svg>
//   );

//   const dropdownSvg = (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="20"
//       height="20"
//       viewBox="0 0 20 20"
//       fill="none"
//     >
//       <path
//         d="M16.2345 7.06754L9.98453 13.3175C9.92648 13.3756 9.85755 13.4217 9.78168 13.4532C9.7058 13.4847 9.62447 13.5008 9.54234 13.5008C9.46021 13.5008 9.37888 13.4847 9.303 13.4532C9.22713 13.4217 9.1582 13.3756 9.10015 13.3175L2.85015 7.06754C2.73288 6.95026 2.66699 6.7912 2.66699 6.62535C2.66699 6.4595 2.73288 6.30044 2.85015 6.18316C2.96743 6.06588 3.12649 6 3.29234 6C3.45819 6 3.61725 6.06588 3.73453 6.18316L9.54234 11.9918L15.3502 6.18316C15.4082 6.12509 15.4772 6.07903 15.553 6.0476C15.6289 6.01617 15.7102 6 15.7923 6C15.8745 6 15.9558 6.01617 16.0317 6.0476C16.1075 6.07903 16.1765 6.12509 16.2345 6.18316C16.2926 6.24123 16.3387 6.31017 16.3701 6.38604C16.4015 6.46191 16.4177 6.54323 16.4177 6.62535C16.4177 6.70747 16.4015 6.78879 16.3701 6.86466C16.3387 6.94053 16.2926 7.00947 16.2345 7.06754Z"
//         fill="#6B7280"
//       />
//     </svg>
//   );

//   // Custom scrollbar styles
//   const customScrollbarStyle = `
//     .custom-scrollbar::-webkit-scrollbar {
//       width: 2px;
//     }
//     .custom-scrollbar::-webkit-scrollbar-track {
//       background: #f1f1f1;
//     }
//     .custom-scrollbar::-webkit-scrollbar-thumb {
//       background: #888;
//     }
//     .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//       background: #555;
//     }
//   `;

//   // Add new styles for responsiveness
//   const responsiveStyles = `
//     @media (max-width: 1024px) {
//       .table-container {
//         overflow-x: auto;
//       }
//       .responsive-table {
//         min-width: 800px;
//       }
//       .responsive-header {
//         flex-direction: column;
//         align-items: flex-start;
//       }
//       .responsive-header > div {
//         margin-bottom: 1rem;
//       }
//       .responsive-dropdown {
//         width: 100%;
//         max-width: 242px;
//       }
//     }
//     @media (max-width: 640px) {
//       .responsive-header {
//         padding: 1rem;
//       }
//       .responsive-search {
//         width: 100%;
//       }
//       .responsive-buttons {
//         flex-wrap: wrap;
//         justify-content: flex-start;
//       }
//       .responsive-buttons > * {
//         margin-right: 0.5rem;
//         margin-bottom: 0.5rem;
//       }
//     }
//   `;

//   const hideScrollbarStyle = {
//     scrollbarWidth: "none",
//     msOverflowStyle: "none",
//     "&::-webkit-scrollbar": {
//       display: "none",
//     },
//   };

//   const options = [
//     "Sort Amenities",
//     "Swimming pool",
//     "Gym",
//     "Multi-Purpose Court",
//     "Jacuzzi & Spa",
//     "Inoor Theatre",
//     "Movie Lawn",
//     "Table Tennis Room",
//     "Banquet Hall",
//   ];

//   const truncateText = (text, charLimit = 20) => {
//     if (!text) return 'N/A';
//     if (text.length <= charLimit) {
//       return text;
//     }
    
//     const lastSpace = text.lastIndexOf(' ', charLimit);
    
//     if (lastSpace > 0) {
//       return text.slice(0, lastSpace) + '...';
//     }
    
//     return text.slice(0, charLimit) + '...';
//   };
//   // const SearchInput = ({ bookings, onSearch, onItemClick, ref, isOpen, setIsOpen }) => {

//   // return (
//     return (
//       <>
//        <style>{customScrollbarStyle}</style>
//        <style>{responsiveStyles}</style>
//        <div className="mt-1 bg-white border rounded-lg overflow-hidden flex flex-col" style={{ position: 'relative', zIndex: 1, fontFamily: 'Plus_Jakarta' }}>
//         <div className="sticky top-0 z-20 bg-white">
//           <div style={headerStyle}>
//             <div style={{ width: windowWidth > 768 ? 'auto' : '100%', marginBottom: windowWidth > 768 ? 0 : '16px' }}>
//             <SearchInput
//   alerts={alerts}  // This is correct
//   onSearch={handleSearch}
// />
//             </div>
//             <div className='flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full lg:w-auto'>
//               <div className="relative w-full sm:w-auto" ref={amenityRef} style={{ width: '242px', zIndex: 30 }}>
//                 <button 
//                   onClick={toggleTypeDropdown}
//                   style={{
//                     display: 'flex',
//                     padding: '8px 16px',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     border: '1px solid #D1D5DB',
//                     borderRadius: '10px',
//                     color: '#6B7280',
//                     fontSize: '16px',
//                     fontFamily: 'Plus_Jakarta',
//                     cursor: 'pointer',
//                     backgroundColor: '#F3F3F3',
//                     width: '100%',
//                     height: '50px'
//                   }}
//                 >  <span>
//                   <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
//                   <path d="M6.19254 10.3078C6.25065 10.3659 6.29674 10.4348 6.3282 10.5107C6.35965 10.5865 6.37584 10.6679 6.37584 10.75C6.37584 10.8321 6.35965 10.9135 6.3282 10.9893C6.29674 11.0652 6.25065 11.1341 6.19254 11.1922L3.69254 13.6922C3.63449 13.7503 3.56556 13.7964 3.48969 13.8279C3.41381 13.8593 3.33248 13.8755 3.25035 13.8755C3.16821 13.8755 3.08688 13.8593 3.01101 13.8279C2.93514 13.7964 2.86621 13.7503 2.80816 13.6922L0.30816 11.1922C0.250091 11.1341 0.204028 11.0652 0.172602 10.9893C0.141175 10.9134 0.125 10.8321 0.125 10.75C0.125 10.6679 0.141175 10.5866 0.172602 10.5107C0.204028 10.4348 0.250091 10.3659 0.30816 10.3078C0.425435 10.1905 0.584495 10.1247 0.750347 10.1247C0.832469 10.1247 0.913787 10.1408 0.989658 10.1723C1.06553 10.2037 1.13447 10.2497 1.19253 10.3078L2.62535 11.7414V0.750003C2.62535 0.584243 2.6912 0.425272 2.80841 0.308062C2.92562 0.190852 3.08459 0.125003 3.25035 0.125003C3.41611 0.125003 3.57508 0.190852 3.69229 0.308062C3.8095 0.425272 3.87535 0.584243 3.87535 0.750003V11.7414L5.30816 10.3078C5.36621 10.2497 5.43514 10.2036 5.51101 10.1722C5.58688 10.1407 5.66821 10.1245 5.75035 10.1245C5.83248 10.1245 5.91381 10.1407 5.98969 10.1722C6.06556 10.2036 6.13449 10.2497 6.19254 10.3078ZM13.6925 2.80782L11.1925 0.307816C11.1345 0.249706 11.0656 0.203606 10.9897 0.172154C10.9138 0.140701 10.8325 0.124512 10.7503 0.124512C10.6682 0.124512 10.5869 0.140701 10.511 0.172154C10.4351 0.203606 10.3662 0.249706 10.3082 0.307816L7.80816 2.80782C7.69088 2.92509 7.625 3.08415 7.625 3.25C7.625 3.41586 7.69088 3.57492 7.80816 3.69219C7.92544 3.80947 8.0845 3.87535 8.25035 3.87535C8.4162 3.87535 8.57526 3.80947 8.69254 3.69219L10.1253 2.2586V13.25C10.1253 13.4158 10.1912 13.5747 10.3084 13.6919C10.4256 13.8092 10.5846 13.875 10.7503 13.875C10.9161 13.875 11.0751 13.8092 11.1923 13.6919C11.3095 13.5747 11.3753 13.4158 11.3753 13.25V2.2586L12.8082 3.69219C12.9254 3.80947 13.0845 3.87535 13.2503 3.87535C13.4162 3.87535 13.5753 3.80947 13.6925 3.69219C13.8098 3.57492 13.8757 3.41586 13.8757 3.25C13.8757 3.08415 13.8098 2.92509 13.6925 2.80782Z" fill="#6B7280"/>
//                 </svg>
//                 </span>
//                 <span>{selectedSosType}</span>
//                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
//                   <path d="M16.2345 7.06754L9.98453 13.3175C9.92648 13.3756 9.85755 13.4217 9.78168 13.4532C9.7058 13.4847 9.62447 13.5008 9.54234 13.5008C9.46021 13.5008 9.37888 13.4847 9.303 13.4532C9.22713 13.4217 9.1582 13.3756 9.10015 13.3175L2.85015 7.06754C2.73288 6.95026 2.66699 6.7912 2.66699 6.62535C2.66699 6.4595 2.73288 6.30044 2.85015 6.18316C2.96743 6.06588 3.12649 6 3.29234 6C3.45819 6 3.61725 6.06588 3.73453 6.18316L9.54234 11.9918L15.3502 6.18316C15.4082 6.12509 15.4772 6.07903 15.553 6.0476C15.6289 6.01617 15.7102 6 15.7923 6C15.8745 6 15.9558 6.01617 16.0317 6.0476C16.1075 6.07903 16.1765 6.12509 16.2345 6.18316C16.2926 6.24123 16.3387 6.31017 16.3701 6.38604C16.4015 6.46191 16.4177 6.54323 16.4177 6.62535C16.4177 6.70747 16.4015 6.78879 16.3701 6.86466C16.3387 6.94053 16.2926 7.00947 16.2345 7.06754Z" fill="#6B7280"/>
//                 </svg>
//               </button>
//               {isTypeDropdownOpen && (
//                 <div 
//                   className="custom-scrollbar"
//                   style={{
//                     position: 'absolute',
//                     top: '100%',
//                     left: 0,
//                     zIndex: 1000,
//                     marginTop: '8px',
//                     boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
//                     backgroundColor: 'white',
//                     borderRadius: '8px',
//                     width: '100%',
//                     border: '1px solid #D1D5DB',
//                     color: '#6B7280',
//                     maxHeight: '228px',
//                     overflowY: 'auto',
//                   }}
//                 >
//                   {sosTypes.map((type, index) => (
//                     <div
//                       key={index}
//                       onClick={() => handleSosTypeSelect(type)}
//                       style={{
//                         padding: '8px 16px',
//                         cursor: 'pointer',
//                         hover: {
//                           backgroundColor: '#F3F4F6',
//                         },
//                         color: 'var(--Gray-400, #6B7280)',
//                         fontSize: '14px',
//                         borderBottom: index === sosTypes.length - 1 ? 'none' : '1px solid var(--Gray-100, #E5E7EB)'
//                       }}
//                     >
//                       {type}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//             <div className="w-full sm:w-auto" style={{ zIndex: 40 }}>
//               <SortButton onSort={handleSort} ref={sortDateRef}/>
//             </div>
//           </div>
//         </div>
//       </div>
          
//       <div className="flex-grow overflow-auto">
//         <table className="w-full text-sm text-gray-500 relative" style={{ minWidth: '1000px' }}>
//         {/* // Replace the existing thead section with this: */}
// <thead className="text-xs text-gray-500 bg-gray-50 sticky top-0" style={{fontSize:'12px'}}>
// <tr className="border-y">
//     {selectedRows.length > 0 ? (
//       <>
//         <th scope="col" className="p-4 w-10 ">
//           <div className="flex items-center justify-center">
//           <CheckboxWithTick
//       isSelected={selectedRows.length > 0}
//       onClick={handleSelectAll}
//       isMinusIcon={selectedRows.length > 0 && selectedRows.length < currentItems.length}
//     />
//           </div>
//         </th>
//         <div className="flex  ml-6 text-gray-600 mt-5 gap-2">
//           <span className=" font-semibold " style={{color:'#4B5563', fontSize:12}}>{selectedRows.length}</span>
//           <span className=" font-semibold " style={{color:'#4B5563', fontSize:12}}>selected</span>
//         </div>
//         {/* Add empty cells to maintain structure */}
//         <th scope="col" className="px-6 py-3"></th>
//         <th scope="col" className="px-6 py-3"></th>
//         <th scope="col" className="px-6 py-3"></th>
//         <th scope="col" className="px-6 py-3"></th>
//         <th scope="col" className="px-6 py-3"></th>
//         <th scope="col" className="px-6 py-3 text-right">
//           <span 
//             onClick={handleDeleteSelected}
//             className="text-red-600 cursor-pointer hover:text-red-700"
//           >
//             Delete
//           </span>
//         </th>
//                 <th scope="col" className="px-6 py-3"></th>

//       </>
//     ) : (
//       <>
//         <th scope="col" className="p-4" style={{width:'40px'}}>
//           <div className="flex items-center justify-center">
//             <CheckboxWithTick
//               isSelected={isAllSelected}
//               onClick={handleSelectAll}
//             />
//           </div>
//         </th>
//         <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '130px'}}>Name</th>
//         <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px'}}>
//           <div className="flex items-center">
//             Flat Number
//           </div>
//         </th>
//         <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px',cursor: "pointer"}}>
//           <div className="flex items-center" onClick={handleDateSort}>
//             Date
//             <svg 
//               className="ml-2 pointer-events-auto" 
//               xmlns="http://www.w3.org/2000/svg" 
//               width="17" 
//               height="16" 
//               viewBox="0 0 17 16" 
//               fill="none"
//               style={{transform: dateSortDirection === 'desc' ? 'rotate(180deg)' : 'none'}}
//             >
//               <path 
//                 d="M8.66699 3.66667V12M8.66699 12L4.66699 8M8.66699 12L12.667 8" 
//                 stroke="#4B5563" 
//                 strokeLinecap="round" 
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </div>
//         </th>
//         <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px',cursor: "pointer"}}>
//           <div className="flex items-center" onClick={handleDateSort}>
//             Time
//             <svg 
//               className="ml-2 pointer-events-auto" 
//               xmlns="http://www.w3.org/2000/svg" 
//               width="17" 
//               height="16" 
//               viewBox="0 0 17 16" 
//               fill="none"
//               style={{transform: dateSortDirection === 'desc' ? 'rotate(180deg)' : 'none'}}
//             >
//               <path 
//                 d="M8.66699 3.66667V12M8.66699 12L4.66699 8M8.66699 12L12.667 8" 
//                 stroke="#4B5563" 
//                 strokeLinecap="round" 
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </div>
//         </th>
//         <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '150px'}}>SOS Type</th>
//         <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '180px',cursor: "pointer"}}>
//           <div className="flex items-center" onClick={handleDateSort}>
//             Acknowledged By
//             <svg 
//               className="ml-2 pointer-events-auto" 
//               xmlns="http://www.w3.org/2000/svg" 
//               width="17" 
//               height="16" 
//               viewBox="0 0 17 16" 
//               fill="none"
//               style={{transform: dateSortDirection === 'desc' ? 'rotate(180deg)' : 'none'}}
//             >
//               <path 
//                 d="M8.66699 3.66667V12M8.66699 12L4.66699 8M8.66699 12L12.667 8" 
//                 stroke="#4B5563" 
//                 strokeLinecap="round" 
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </div>
//         </th>
//         <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '180px',cursor: "pointer"}}>
//           <div className="flex items-center" onClick={handleDateSort}>
//             Acknowledge Time
//             <svg 
//               className="ml-2 pointer-events-auto" 
//               xmlns="http://www.w3.org/2000/svg" 
//               width="17" 
//               height="16" 
//               viewBox="0 0 17 16" 
//               fill="none"
//               style={{transform: dateSortDirection === 'desc' ? 'rotate(180deg)' : 'none'}}
//             >
//               <path 
//                 d="M8.66699 3.66667V12M8.66699 12L4.66699 8M8.66699 12L12.667 8" 
//                 stroke="#4B5563" 
//                 strokeLinecap="round" 
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </div>
//         </th>
//         <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '180px',cursor: "pointer"}}>
//           <div className="flex items-center" onClick={handleDateSort}>
//             Resolved Time
//             <svg 
//               className="ml-2 pointer-events-auto" 
//               xmlns="http://www.w3.org/2000/svg" 
//               width="17" 
//               height="16" 
//               viewBox="0 0 17 16" 
//               fill="none"
//               style={{transform: dateSortDirection === 'desc' ? 'rotate(180deg)' : 'none'}}
//             >
//               <path 
//                 d="M8.66699 3.66667V12M8.66699 12L4.66699 8M8.66699 12L12.667 8" 
//                 stroke="#4B5563" 
//                 strokeLinecap="round" 
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </div>
//         </th>
//       </>
//     )}
//   </tr>
// </thead>
//           <tbody className="relative" style={{ zIndex: 1 }}>
//           {/* // Update the table row rendering section */}
// {filteredAlerts.length > 0 ? (
//   currentItems.map((alert, index) => {
//     const actualIndex = indexOfFirstItem + index;
//     const isSelected = selectedRows.includes(actualIndex);
//     const fullName = `${alert.userDetails?.firstName || ''} ${alert.userDetails?.lastName || ''}`.trim();
    
//     return (
//       <tr key={alert.id} className="bg-white border-b hover:bg-gray-50" style={{fontSize:'14px'}}>
//         <td className="p-4" style={{width:'40px'}}>
//           <div className="flex items-center justify-center">
//             <CheckboxWithTick
//               isSelected={isSelected}
//               onClick={() => handleRowSelect(actualIndex)}
//             />
//           </div>
//         </td>
//         <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900" style={{minWidth: '130px'}}>
//           {fullName}
//         </td>
//         <td className="px-6 py-4 whitespace-nowrap" style={{minWidth: '120px'}}>
//           {`${alert.wing || ''}-${alert.flatNumber || ''}`}
//         </td>
//         <td className="px-6 py-4 whitespace-nowrap" style={{minWidth: '120px'}}>
//           {alert.createdAt ? dayjs(alert.createdAt.toDate()).format('D MMM, YYYY') : ''}
//         </td>
//         <td className="px-6 py-4 whitespace-nowrap lowercase" style={{minWidth: '120px'}}>
//           {/* {alert.createdAt ? dayjs(alert.createdAt.toDate()).format('HH:mm:ss') : ''} */}
//           {formatTimeWithAmPm(alert.createdAt)}
//         </td>
//         <td className="px-6 py-4 whitespace-nowrap" style={{minWidth: '150px'}}>
//           <span
//             className="inline-flex px-4 py-2 items-center font-semibold text-xs leading-4 rounded-xl "
//             style={{  fontSize: '12px', borderRadius: '13px',  }}
//           >
//             {alert.type}
//           </span>
//         </td>
//         <td className="px-6 py-4 whitespace-nowrap" style={{minWidth: '180px'}}>
//   {alert.employeeId ? 
//     `${guardUsers[alert.employeeId]?.firstName || ''} ${guardUsers[alert.employeeId]?.lastName || ''}` 
//     : 'Not assigned'
//   }
// </td>
// <td className="px-6 py-4 whitespace-nowrap" style={{minWidth: '180px'}}>
//   {formatTimeWithAmPm(alert.acknowledgedAt)}
// </td>
// <td className="px-6 py-4 whitespace-nowrap" style={{minWidth: '180px'}}>
//   {alert.resolved ? 
//     formatTimeWithAmPm(alert.cancelledAt)
//     : 'Pending'
//   }
// </td>
//         {/* <td className="px-6 py-4 whitespace-nowrap text-right" style={{minWidth: '120px'}}>
//           <div className="flex justify-end space-x-4">
//             <button onClick={() => handleEditClick(alert)}>
//               <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M17.7586 5.73201L14.268 2.24061C14.1519 2.1245 14.0141 2.0324 13.8624 1.96957C13.7107 1.90673 13.5482 1.87439 13.384 1.87439C13.2198 1.87439 13.0572 1.90673 12.9056 1.96957C12.7539 2.0324 12.6161 2.1245 12.5 2.24061L2.86641 11.875C2.74983 11.9906 2.65741 12.1283 2.59451 12.28C2.5316 12.4317 2.49948 12.5944 2.50001 12.7586V16.25C2.50001 16.5815 2.6317 16.8994 2.86612 17.1339C3.10054 17.3683 3.41849 17.5 3.75001 17.5H7.24141C7.40563 17.5005 7.5683 17.4684 7.71999 17.4055C7.87168 17.3426 8.00935 17.2502 8.12501 17.1336L17.7586 7.49998C17.8747 7.3839 17.9668 7.24609 18.0296 7.09442C18.0925 6.94274 18.1248 6.78017 18.1248 6.616C18.1248 6.45182 18.0925 6.28925 18.0296 6.13758C17.9668 5.9859 17.8747 5.84809 17.7586 5.73201ZM7.24141 16.25H3.75001V12.7586L10.625 5.88358L14.1164 9.37498L7.24141 16.25ZM15 8.49061L11.5086 4.99998L13.3836 3.12498L16.875 6.61561L15 8.49061Z" fill="#6B7280"/>
//               </svg>
//             </button>
//             <button onClick={() => handleDeleteClick(alert)}>
//               <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M16.875 3.75H3.125C2.95924 3.75 2.80027 3.81585 2.68306 3.93306C2.56585 4.05027 2.5 4.20924 2.5 4.375C2.5 4.54076 2.56585 4.69973 2.68306 4.81694C2.80027 4.93415 2.95924 5 3.125 5H3.75V16.25C3.75 16.5815 3.8817 16.8995 4.11612 17.1339C4.35054 17.3683 4.66848 17.5 5 17.5H15C15.3315 17.5 15.6495 17.3683 15.8839 17.1339C16.1183 16.8995 16.25 16.5815 16.25 16.25V5H16.875C17.0408 5 17.1997 4.93415 17.3169 4.81694C17.4342 4.69973 17.5 4.54076 17.5 4.375C17.5 4.20924 17.4342 4.05027 17.3169 3.93306C17.1997 3.81585 17.0408 3.75 16.875 3.75ZM15 16.25H5V5H15V16.25ZM6.25 1.875C6.25 1.70924 6.31585 1.55027 6.43306 1.43306C6.55027 1.31585 6.70924 1.25 6.875 1.25H13.125C13.2908 1.25 13.4497 1.31585 13.5669 1.43306C13.6842 1.55027 13.75 1.70924 13.75 1.875C13.75 2.04076 13.6842 2.19973 13.5669 2.31694C13.4497 2.43415 13.2908 2.5 13.125 2.5H6.875C6.70924 2.5 6.55027 2.43415 6.43306 2.31694C6.31585 2.19973 6.25 2.04076 6.25 1.875Z" fill="#EF4444"/>
//               </svg>
//             </button>
//           </div>
//         </td> */}
//       </tr>
//     );
//   })
// ) : (
//   <tr>
//     <td colSpan="10" className="px-6 py-4 text-center text-gray-500" style={{ height: '300px' }}>
//       <div className="flex flex-col items-center justify-center h-full">
//         <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//         </svg>
//         <p className="text-lg font-semibold">No SOS alerts found</p>
//         <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
//       </div>
//     </td>
//   </tr>
// )}
//           </tbody>
//         </table>
//       </div>

//       <div className="sticky bottom-0 bg-white flex justify-between items-center px-6 py-3 border-t z-20">
//         <div
//           className="text-sm text-gray-700"
//           style={{
//             color: "var(--Gray-700, #1F2937)",
//             fontSize: "14px",
//             fontWeight: "600",
//           }}
//         >
//           Page {currentPage} of {totalPages}
//         </div>
//         <div className="flex space-x-2">
//           <button
//             onClick={handlePrevious}
//             disabled={currentPage === 1}
//             className={`px-3 py-1 border rounded ${
//               currentPage === 1
//                 ? "bg-gray-100 text-gray-400"
//                 : "bg-white text-gray-700 hover:bg-gray-50"
//             }`}
//             style={{ fontSize: "14px", border: "1px solid #D1D5DB" }}
//           >
//             Previous
//           </button>
//           <button
//             onClick={handleNext}
//             disabled={currentPage === totalPages}
//             className={`px-3 py-1 border rounded ${
//               currentPage === totalPages
//                 ? "bg-gray-100 text-gray-400"
//                 : "bg-white text-gray-700 hover:bg-gray-50"
//             }`}
//             style={{ fontSize: "14px", border: "1px solid #D1D5DB" }}
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>

//     <EditingBookingModal 
//       isOpen={isEditModalOpen} 
//       onClose={handleCloseModal}    
//       booking={editingBooking} 
//       onSave={handleSaveEdit} 
//     />

//     <DeleteModal
//       isOpen={isDeleteModalOpen}
//       onClose={() => setIsDeleteModalOpen(false)}
//       onDelete={deleteFunction}
//       itemName={deleteItemName}
//     />
//   </>
//   );
// };

// export default SOSTable;
               

import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { collection, deleteDoc, doc, getFirestore, onSnapshot, orderBy, query } from "firebase/firestore";
import { getApp } from "firebase/app";
import SortButton from "../Buttons/Sortdate";
import DeleteModal from "../Modals/DeleteModal";

const SearchInput = ({ alerts, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length > 0);
    onSearch(value);
  };

  const handleItemClick = (alert) => {
    const fullName = `${alert.userDetails?.firstName || ''} ${alert.userDetails?.lastName || ''}`.trim() || 'N/A';
    setSearchTerm(fullName);
    setShowDropdown(false);
    onSearch(alert);
  };

  const filteredAlerts = alerts.filter(
    (alert) =>
      (alert.userDetails && 
       `${alert.userDetails.firstName || ''} ${alert.userDetails.lastName || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())) ||
      (alert.type && alert.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (alert.flatNumber && alert.flatNumber.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const truncateText = (text, charLimit = 20) => {
    if (!text) return 'N/A';
    if (text.length <= charLimit) return text;
    const lastSpace = text.lastIndexOf(' ', charLimit);
    return lastSpace > 0 ? text.slice(0, lastSpace) + '...' : text.slice(0, charLimit) + '...';
  };

  return (
    <div className="relative w-full sm:w-[250px] md:w-[300px]">
      <div
        className="flex items-center justify-between p-2 sm:py-3 border border-[#D1D5DB] rounded-[10px] text-[#6B7280] text-sm sm:text-base font-['Plus_Jakarta']"
        style={{ fontFamily: "Plus_Jakarta", backgroundColor:'#F3F3F3' }}
      >
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          style={{
            border: "none",
            outline: "none",
            boxShadow: "none",
            fontSize: "16px",
          }}
          onChange={handleInputChange}
          className="w-full bg-transparent border-none outline-none shadow-none text-inherit font-inherit text-sm sm:text-base"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 sm:w-6 sm:h-6 mr-2"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M17.9419 17.0579L14.0302 13.1469C15.1639 11.7858 15.7293 10.0399 15.6086 8.2725C15.488 6.50512 14.6906 4.85229 13.3823 3.65785C12.074 2.46341 10.3557 1.81932 8.58462 1.85957C6.81357 1.89982 5.12622 2.62131 3.87358 3.87395C2.62094 5.12659 1.89945 6.81394 1.8592 8.58498C1.81895 10.356 2.46304 12.0744 3.65748 13.3827C4.85192 14.6909 6.50475 15.4883 8.27214 15.609C10.0395 15.7297 11.7854 15.1643 13.1466 14.0305L17.0575 17.9422C17.1156 18.0003 17.1845 18.0464 17.2604 18.0778C17.3363 18.1092 17.4176 18.1254 17.4997 18.1254C17.5818 18.1254 17.6631 18.1092 17.739 18.0778C17.8149 18.0464 17.8838 18.0003 17.9419 17.9422C17.9999 17.8842 18.046 17.8152 18.0774 17.7394C18.1089 17.6635 18.125 17.5822 18.125 17.5001C18.125 17.4179 18.1089 17.3366 18.0774 17.2607C18.046 17.1849 17.9999 17.1159 17.9419 17.0579ZM3.12469 8.75006C3.12469 7.63754 3.45459 6.55 4.07267 5.62497C4.69076 4.69995 5.56926 3.97898 6.5971 3.55323C7.62493 3.12749 8.75593 3.0161 9.84707 3.23314C10.9382 3.45018 11.9405 3.98591 12.7272 4.77258C13.5138 5.55925 14.0496 6.56153 14.2666 7.65267C14.4837 8.74382 14.3723 9.87482 13.9465 10.9027C13.5208 11.9305 12.7998 12.809 11.8748 13.4271C10.9497 14.0452 9.86221 14.3751 8.74969 14.3751C7.25836 14.3734 5.82858 13.7802 4.77404 12.7257C3.71951 11.6712 3.12634 10.2414 3.12469 8.75006Z"
            fill="#6B7280"
          />
        </svg>
      </div>

      {showDropdown && filteredAlerts.length > 0 && (
        <div
          className="absolute w-full mt-2 sm:mt-3 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-y-auto"
          style={{
            maxHeight: filteredAlerts.length > 4 ? "240px" : "auto",
          }}
        >
          {filteredAlerts.map((alert, index) => {
            const fullName = `${alert.userDetails?.firstName || ''} ${alert.userDetails?.lastName || ''}`.trim() || 'N/A';
            return (
              <div
                key={index}
                className="px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-100 cursor-pointer border-b border-[#E5E7EB] last:border-b-0"
                onClick={() => handleItemClick(alert)}
              >
                <div className="font-medium flex justify-between text-sm sm:text-base text-[#6B7280]">
                  {truncateText(fullName, 20)}
                  <span>{alert.wing || 'N/A'} - {alert.flatNumber || 'N/A'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const SOSTable = () => {
  const [guardUsers, setGuardUsers] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateSortDirection, setDateSortDirection] = useState('asc');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemName, setDeleteItemName] = useState("");
  const [deleteFunction, setDeleteFunction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSosType, setSelectedSosType] = useState("All Category");
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [sosTypes] = useState([
    "All Category",
    "MEDICAL",
    "FIRE",
    "LIFT",  
    "THEFT",
    "SECURITY"
  ]);

  const searchRef = useRef(null);
  const sortDateRef = useRef(null);
  const db = getFirestore(getApp());

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAlerts.slice(indexOfFirstItem, indexOfLastItem);
  const isAllSelected = currentItems.length > 0 && selectedRows.length === currentItems.length;

  useEffect(() => {
    const sosQuery = query(
      collection(db, "sosAlerts"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(sosQuery, (snapshot) => {
      const sosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAlerts(sosData);
      setFilteredAlerts(sosData);
    }, (error) => {
      console.error("Error fetching SOS alerts:", error);
      toast.error("Failed to fetch SOS alerts");
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const guardQuery = query(collection(db, "guardUser"));
    const unsubscribe = onSnapshot(guardQuery, (snapshot) => {
      const guards = {};
      snapshot.docs.forEach(doc => {
        guards[doc.data().employeeId] = {
          firstName: doc.data().firstName,
          lastName: doc.data().lastName
        };
      });
      setGuardUsers(guards);
    });
  
    return () => unsubscribe();
  }, [db]);

  useEffect(() => {
    const filtered = alerts.filter(alert => {
      const name = `${alert.userDetails?.firstName || ''} ${alert.userDetails?.lastName || ''}`.toLowerCase();
      const flatNumber = alert.flatNumber?.toString().toLowerCase();
      const type = alert.type?.toLowerCase();
      const search = searchTerm.toLowerCase();

      return name.includes(search) || 
             flatNumber?.includes(search) || 
             type?.includes(search);
    });
    setFilteredAlerts(filtered);
    setCurrentPage(1);
  }, [searchTerm, alerts]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatTimeWithAmPm = (timestamp) => {
    if (!timestamp) return 'N/A';
    return dayjs(timestamp.toDate()).format('hh:mm A');
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return ""; // Handle undefined or null
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const handleSearch = (termOrAlert) => {
    if (!termOrAlert) {
      setFilteredAlerts(alerts);
      return;
    }
  
    if (typeof termOrAlert === 'object') {
      const filtered = alerts.filter(alert => alert.id === termOrAlert.id);
      setFilteredAlerts(filtered);
    } else {
      const searchStr = termOrAlert.toLowerCase();
      const filtered = alerts.filter(alert => {
        const name = `${alert.userDetails?.firstName || ''} ${alert.userDetails?.lastName || ''}`.toLowerCase();
        const flatNumber = alert.flatNumber?.toString().toLowerCase();
        const type = alert.type?.toLowerCase();
        
        return name.includes(searchStr) || 
               flatNumber?.includes(searchStr) || 
               type?.includes(searchStr);
      });
      setFilteredAlerts(filtered);
    }
    setCurrentPage(1);
  };

  const handleSosTypeSelect = (type) => {
    setSelectedSosType(type);
    setIsTypeDropdownOpen(false);
  
    if (type === "All Category") {
      setFilteredAlerts(alerts);
    } else {
      const filtered = alerts.filter((alert) => alert.type === type);
      setFilteredAlerts(filtered);
    }
    setCurrentPage(1);
  };

  const handleSort = (startDate, endDate) => {
    let filtered;
    if (!startDate && !endDate) {
      filtered = alerts;
    } else {
      filtered = alerts.filter((alert) => {
        const alertDate = alert.createdAt ? dayjs(alert.createdAt.toDate()) : null;
        if (!alertDate) return false;

        if (startDate && endDate) {
          return (
            alertDate.isSameOrAfter(dayjs(startDate, "DD MMM, YYYY"), "day") &&
            alertDate.isSameOrBefore(dayjs(endDate, "DD MMM, YYYY"), "day")
          );
        } else if (startDate) {
          return alertDate.isSameOrAfter(dayjs(startDate, "DD MMM, YYYY"), "day");
        } else if (endDate) {
          return alertDate.isSameOrBefore(dayjs(endDate, "DD MMM, YYYY"), "day");
        }
        return true;
      });
    }

    filtered.sort((a, b) => {
      const dateA = a.createdAt ? a.createdAt.toDate().getTime() : 0;
      const dateB = b.createdAt ? b.createdAt.toDate().getTime() : 0;
      return dateSortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setFilteredAlerts(filtered);
    setCurrentPage(1);
  };

  const handleDateSort = () => {
    const sortedAlerts = [...filteredAlerts].sort((a, b) => {
      const timeA = a.createdAt.toDate().getTime();
      const timeB = b.createdAt.toDate().getTime();
      return dateSortDirection === 'asc' ? timeA - timeB : timeB - timeA;
    });
    
    setFilteredAlerts(sortedAlerts);
    setDateSortDirection(dateSortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleRowSelect = (index) => {
    setSelectedRows((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.length === currentItems.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentItems.map((_, index) => indexOfFirstItem + index));
    }
  };

  const handleDeleteSelected = () => {
    setDeleteItemName(`${selectedRows.length} selected alerts`);
    setDeleteFunction(() => async () => {
      try {
        const alertsToDelete = selectedRows.map(index => {
          const relativeIndex = index - indexOfFirstItem;
          return currentItems[relativeIndex];
        });
  
        for (const alert of alertsToDelete) {
          await deleteDoc(doc(db, "sosAlerts", alert.id));
        }
  
        setSelectedRows([]);
        toast.success("Selected alerts deleted successfully");
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error("Error deleting alerts:", error);
        toast.error("Failed to delete selected alerts");
      }
    });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteClick = (alert) => {
    const fullName = `${alert.userDetails?.firstName || 'Unknown'} ${alert.userDetails?.lastName || ''}`.trim();
    setDeleteItemName(`SOS alert from ${fullName}`);
    setDeleteFunction(() => async () => {
      try {
        await deleteDoc(doc(db, "sosAlerts", alert.id));
        toast.success("Alert deleted successfully");
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error("Error deleting alert:", error);
        toast.error("Failed to delete alert");
      }
    });
    setIsDeleteModalOpen(true);
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const CheckboxWithTick = ({ isSelected, onClick, isMinusIcon = false }) => (
    <div
      onClick={onClick}
      style={{
        width: "20px",
        height: "20px",
        border: "1px solid #6B7280",
        borderRadius: "6px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        backgroundColor: isSelected ? "#F3F4F6" : "white"
      }}
    >
      {isSelected && (
        isMinusIcon ? (
          <svg
            width="12"
            height="2"
            viewBox="0 0 12 2"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1H11"
              stroke="#4F46E5"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 3L4.5 8.5L2 6"
              stroke="#4F46E5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )
      )}
    </div>
  );

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        
        @media (max-width: 1024px) {
          .table-container {
            overflow-x: auto;
          }
          .responsive-table {
            min-width: 800px;
          }
          .responsive-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .responsive-header > div {
            margin-bottom: 1rem;
          }
          .responsive-dropdown {
            width: 100%;
            max-width: 242px;
          }
        }
        @media (max-width: 640px) {
          .responsive-header {
            padding: 1rem;
          }
          .responsive-search {
            width: 100%;
          }
          .responsive-buttons {
            flex-wrap: wrap;
            justify-content: flex-start;
          }
          .responsive-buttons > * {
            margin-right: 0.5rem;
            margin-bottom: 0.5rem;
          }
        }
      `}</style>

      <div className="mt-1 bg-white border rounded-lg overflow-hidden flex flex-col" style={{ position: 'relative', zIndex: 1, fontFamily: 'Plus_Jakarta' }}>
        <div className="sticky top-0 z-20 bg-white ">
          <div className="flex flex-col sm:flex-row items-stretch p-6 gap-4 justify-between">
            <div className="w-full sm:w-auto">
              <SearchInput alerts={alerts} onSearch={handleSearch} />
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
              <div className="relative w-full sm:w-[242px]">
                <button 
                  onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                  className="w-full h-[50px] flex items-center justify-between px-4 py-2 bg-[#F3F3F3] border border-[#D1D5DB] rounded-[10px] text-[#6B7280] text-base"
                >
                  <span className="flex items-center gap-2 font-medium " style={{fontSize:14}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M6.19254 10.3078C6.25065 10.3659 6.29674 10.4348 6.3282 10.5107C6.35965 10.5865 6.37584 10.6679 6.37584 10.75C6.37584 10.8321 6.35965 10.9135 6.3282 10.9893C6.29674 11.0652 6.25065 11.1341 6.19254 11.1922L3.69254 13.6922C3.63449 13.7503 3.56556 13.7964 3.48969 13.8279C3.41381 13.8593 3.33248 13.8755 3.25035 13.8755C3.16821 13.8755 3.08688 13.8593 3.01101 13.8279C2.93514 13.7964 2.86621 13.7503 2.80816 13.6922L0.30816 11.1922C0.250091 11.1341 0.204028 11.0652 0.172602 10.9893C0.141175 10.9134 0.125 10.8321 0.125 10.75C0.125 10.6679 0.141175 10.5866 0.172602 10.5107C0.204028 10.4348 0.250091 10.3659 0.30816 10.3078C0.425435 10.1905 0.584495 10.1247 0.750347 10.1247C0.832469 10.1247 0.913787 10.1408 0.989658 10.1723C1.06553 10.2037 1.13447 10.2497 1.19253 10.3078L2.62535 11.7414V0.750003C2.62535 0.584243 2.6912 0.425272 2.80841 0.308062C2.92562 0.190852 3.08459 0.125003 3.25035 0.125003C3.41611 0.125003 3.57508 0.190852 3.69229 0.308062C3.8095 0.425272 3.87535 0.584243 3.87535 0.750003V11.7414L5.30816 10.3078C5.36621 10.2497 5.43514 10.2036 5.51101 10.1722C5.58688 10.1407 5.66821 10.1245 5.75035 10.1245C5.83248 10.1245 5.91381 10.1407 5.98969 10.1722C6.06556 10.2036 6.13449 10.2497 6.19254 10.3078ZM13.6925 2.80782L11.1925 0.307816C11.1345 0.249706 11.0656 0.203606 10.9897 0.172154C10.9138 0.140701 10.8325 0.124512 10.7503 0.124512C10.6682 0.124512 10.5869 0.140701 10.511 0.172154C10.4351 0.203606 10.3662 0.249706 10.3082 0.307816L7.80816 2.80782C7.69088 2.92509 7.625 3.08415 7.625 3.25C7.625 3.41586 7.69088 3.57492 7.80816 3.69219C7.92544 3.80947 8.0845 3.87535 8.25035 3.87535C8.4162 3.87535 8.57526 3.80947 8.69254 3.69219L10.1253 2.2586V13.25C10.1253 13.4158 10.1912 13.5747 10.3084 13.6919C10.4256 13.8092 10.5846 13.875 10.7503 13.875C10.9161 13.875 11.0751 13.8092 11.1923 13.6919C11.3095 13.5747 11.3753 13.4158 11.3753 13.25V2.2586L12.8082 3.69219C12.9254 3.80947 13.0845 3.87535 13.2503 3.87535C13.4162 3.87535 13.5753 3.80947 13.6925 3.69219C13.8098 3.57492 13.8757 3.41586 13.8757 3.25C13.8757 3.08415 13.8098 2.92509 13.6925 2.80782Z" fill="#6B7280"/>
                    </svg>
                    {selectedSosType}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.2345 7.06754L9.98453 13.3175C9.92648 13.3756 9.85755 13.4217 9.78168 13.4532C9.7058 13.4847 9.62447 13.5008 9.54234 13.5008C9.46021 13.5008 9.37888 13.4847 9.303 13.4532C9.22713 13.4217 9.1582 13.3756 9.10015 13.3175L2.85015 7.06754C2.73288 6.95026 2.66699 6.7912 2.66699 6.62535C2.66699 6.4595 2.73288 6.30044 2.85015 6.18316C2.96743 6.06588 3.12649 6 3.29234 6C3.45819 6 3.61725 6.06588 3.73453 6.18316L9.54234 11.9918L15.3502 6.18316C15.4082 6.12509 15.4772 6.07903 15.553 6.0476C15.6289 6.01617 15.7102 6 15.7923 6C15.8745 6 15.9558 6.01617 16.0317 6.0476C16.1075 6.07903 16.1765 6.12509 16.2345 6.18316C16.2926 6.24123 16.3387 6.31017 16.3701 6.38604C16.4015 6.46191 16.4177 6.54323 16.4177 6.62535C16.4177 6.70747 16.4015 6.78879 16.3701 6.86466C16.3387 6.94053 16.2926 7.00947 16.2345 7.06754Z" fill="#6B7280"/>
                  </svg>
                </button>
                {isTypeDropdownOpen && (
                  <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-[228px] overflow-y-auto custom-scrollbar">
                    {sosTypes.map((type, index) => (
                      <div
                        key={index}
                        onClick={() => handleSosTypeSelect(type)}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-md text-gray-600 border-b border-gray-100 last:border-b-0 "
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="w-full sm:w-auto">
                <SortButton onSort={handleSort} ref={sortDateRef}/>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-grow overflow-auto">
          <table className="w-full text-sm text-gray-500 relative" style={{ minWidth: '1000px' }}>
            <thead className="text-xs text-gray-500 bg-gray-50 sticky top-0" style={{fontSize:'12px'}}>
              <tr className="border-y">
                {selectedRows.length > 0 ? (
                  <>
                    <th scope="col" className="p-4 w-10">
                      <div className="flex items-center justify-center">
                        <CheckboxWithTick
                          isSelected={selectedRows.length > 0}
                          onClick={handleSelectAll}
                          isMinusIcon={selectedRows.length > 0 && selectedRows.length < currentItems.length}
                        />
                      </div>
                    </th>
                    <div className="flex ml-6 text-gray-600 mt-5 gap-2">
                      <span className="font-semibold" style={{color:'#4B5563', fontSize:12}}>{selectedRows.length}</span>
                      <span className="font-semibold" style={{color:'#4B5563', fontSize:12}}>selected</span>
                    </div>
                    <th scope="col" className="px-6 py-3"></th>
                    <th scope="col" className="px-6 py-3"></th>
                    <th scope="col" className="px-6 py-3"></th>
                    <th scope="col" className="px-6 py-3"></th>
                    <th scope="col" className="px-6 py-3"></th>
                    <th scope="col" className="px-6 py-3 text-right">
                      <span 
                        onClick={handleDeleteSelected}
                        className="text-red-600 cursor-pointer hover:text-red-700"
                      >
                        Delete
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3"></th>
                  </>
                ) : (
                  <>
                    <th scope="col" className="p-4" style={{width:'40px'}}>
                      <div className="flex items-center justify-center">
                        <CheckboxWithTick
                          isSelected={isAllSelected}
                          onClick={handleSelectAll}
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '130px'}}>Name</th>
                    <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px'}}>
                      <div className="flex items-center">
                        Flat Number
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px', cursor: "pointer"}}>
                      <div className="flex items-center" onClick={handleDateSort}>
                        Date
                        <svg 
                          className="ml-2 pointer-events-auto" 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="17" 
                          height="16" 
                          viewBox="0 0 17 16" 
                          fill="none"
                          style={{transform: dateSortDirection === 'desc' ? 'rotate(180deg)' : 'none'}}
                        >
                          <path 
                            d="M8.66699 3.66667V12M8.66699 12L4.66699 8M8.66699 12L12.667 8" 
                            stroke="#4B5563" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px'}}>Time</th>
                    <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '150px'}}>SOS Type</th>
                    <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '180px'}}>Acknowledged By</th>
                    <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '180px'}}>Acknowledge Time
                        
                    </th>
                    <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '180px'}}>Resolved Time</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="relative" style={{ zIndex: 1 }}>
              {filteredAlerts.length > 0 ? (
                currentItems.map((alert, index) => {
                  const actualIndex = indexOfFirstItem + index;
                  const isSelected = selectedRows.includes(actualIndex);
                  const fullName = `${alert.userDetails?.firstName || ''} ${alert.userDetails?.lastName || ''}`.trim();
                  
                  return (
                    <tr key={alert.id} className="bg-white border-b hover:bg-gray-50" style={{fontSize:'14px'}}>
                      <td className="p-4" style={{width:'40px'}}>
                        <div className="flex items-center justify-center">
                          <CheckboxWithTick
                            isSelected={isSelected}
                            onClick={() => handleRowSelect(actualIndex)}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900" style={{minWidth: '130px'}}>
                        {fullName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" style={{minWidth: '120px'}}>
                        {`${alert.wing || ''}-${alert.flatNumber || ''}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" style={{minWidth: '120px'}}>
                        {alert.createdAt ? dayjs(alert.createdAt.toDate()).format('D MMM, YYYY') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" style={{minWidth: '120px'}}>
                        {formatTimeWithAmPm(alert.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap lowercase" style={{minWidth: '150px'}}>
                        {/* <span className="inline-flex px-4 py-2 items-center font-semibold  leading-4 rounded-xl"> */}
                          {/* {alert.type || 'N/A'} */}
                          {capitalizeFirstLetter(alert.type || 'N/A')}

                        {/* </span> */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" style={{minWidth: '180px'}}>
                        {alert.employeeId ? 
                          `${guardUsers[alert.employeeId]?.firstName || ''} ${guardUsers[alert.employeeId]?.lastName || ''}` 
                          : 'Not assigned'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" style={{minWidth: '180px'}}>
                        {formatTimeWithAmPm(alert.acknowledgedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" style={{minWidth: '180px'}}>
                        {alert.resolved ? formatTimeWithAmPm(alert.cancelledAt) : 'Pending'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-gray-500" style={{ height: '300px' }}>
                    <div className="flex flex-col items-center justify-center h-full">
                      <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <p className="text-lg font-semibold">No SOS alerts found</p>
                      <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="sticky bottom-0 bg-white flex justify-between items-center px-6 py-3 border-t z-20">
          <div className="text-sm font-semibold text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              style={{ fontSize: "14px", border: "1px solid #D1D5DB" }}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              style={{ fontSize: "14px", border: "1px solid #D1D5DB" }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={deleteFunction}
        itemName={deleteItemName}
      />
    </>
  );
};

export default SOSTable;