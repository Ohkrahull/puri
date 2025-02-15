

import React, { useEffect, useRef, useState } from 'react';
// import SearchInput from '../Buttons/SearchInput';
import SortButton from '../Buttons/Sortdate';
import NextSearchInput from '../Components/NextSearch';
import EditingDocumentModal from '../Components/EditingDocumentModal'
import EditingConstructionModal from './EditingConstructionUpdate';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
const SearchInput = ({ documents, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length > 0);
    onSearch(value);
  };

  const handleItemClick = (document) => {
    setSearchTerm(`${document.userInfo?.firstName || ''} ${document.userInfo?.lastName || ''}`);
    setShowDropdown(false);
    onSearch(document); // Pass the entire document object
  };

  const filteredDocuments = documents.filter(
    (document) =>
      `${document.userInfo?.firstName || ''} ${document.userInfo?.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <div style={{
        display: "flex",
        padding: "8px 16px",
        alignItems: "center",
        justifyContent: "space-between",
        alignSelf: "stretch",
        border: "1px solid #D1D5DB",
        borderRadius: "10px",
        color: "#6B7280",
        fontSize: "16px",
        fontFamily: "Plus Jakarta Sans, sans-serif",
        width: "300px",
      }}>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleInputChange}
          style={{
            border: 'white',
            outline: "none",
            boxShadow: 'none',
            width: "100%",
            background: "transparent",
            color: "inherit",
            fontSize: "inherit",
            fontFamily: "inherit",
          }}
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M17.9419 17.0579L14.0302 13.1469C15.1639 11.7858 15.7293 10.0399 15.6086 8.2725C15.488 6.50512 14.6906 4.85229 13.3823 3.65785C12.074 2.46341 10.3557 1.81932 8.58462 1.85957C6.81357 1.89982 5.12622 2.62131 3.87358 3.87395C2.62094 5.12659 1.89945 6.81394 1.8592 8.58498C1.81895 10.356 2.46304 12.0744 3.65748 13.3827C4.85192 14.6909 6.50475 15.4883 8.27214 15.609C10.0395 15.7297 11.7854 15.1643 13.1466 14.0305L17.0575 17.9422C17.1156 18.0003 17.1845 18.0464 17.2604 18.0778C17.3363 18.1092 17.4176 18.1254 17.4997 18.1254C17.5818 18.1254 17.6631 18.1092 17.739 18.0778C17.8149 18.0464 17.8838 18.0003 17.9419 17.9422C17.9999 17.8842 18.046 17.8152 18.0774 17.7394C18.1089 17.6635 18.125 17.5822 18.125 17.5001C18.125 17.4179 18.1089 17.3366 18.0774 17.2607C18.046 17.1849 17.9999 17.1159 17.9419 17.0579ZM3.12469 8.75006C3.12469 7.63754 3.45459 6.55 4.07267 5.62497C4.69076 4.69995 5.56926 3.97898 6.5971 3.55323C7.62493 3.12749 8.75593 3.0161 9.84707 3.23314C10.9382 3.45018 11.9405 3.98591 12.7272 4.77258C13.5138 5.55925 14.0496 6.56153 14.2666 7.65267C14.4837 8.74382 14.3723 9.87482 13.9465 10.9027C13.5208 11.9305 12.7998 12.809 11.8748 13.4271C10.9497 14.0452 9.86221 14.3751 8.74969 14.3751C7.25836 14.3734 5.82858 13.7802 4.77404 12.7257C3.71951 11.6712 3.12634 10.2414 3.12469 8.75006Z" fill="#6B7280"/>
        </svg>
      </div>

      {showDropdown && filteredDocuments.length > 0 && (
        <div className="absolute w-full mt-3 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          {filteredDocuments.map((document, index) => (
            <div
              key={index}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
              style={{borderBottom: '1px solid var(--Gray-100, #E5E7EB)'}}
              onClick={() => handleItemClick(document)}
            >
              <div className="font-medium" style={{fontSize:'16px', color:'#6B7280'}}>
                {`${document.userInfo?.firstName || ''} ${document.userInfo?.lastName || ''}`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
const ConstructionUpdatetable = () => {
    const [bookings, setBookings] = useState([
        { name: "Marvin McKinney", slotTime:"01:00 AM - 02:00 AM", slotDate: "04 Sep, 2024", amenity: "Swimming pool" ,Feedback: "Development in previous...",status: "Seen", wings: ['A', 'B'] },
        { name: "Jane Cooper", slotTime:"04:00 AM - 05:00 AM", slotDate: "01 Sep, 2024", amenity: "Tennis court" ,Feedback: "Development in previous...", status: "Pending", wings: ['A', 'B'] },
        { name: "Robert Fox", slotTime:"04:00 AM - 05:00 AM", slotDate: "02 Sep, 2024", amenity: "Gym" ,Feedback: "Development in previous...",status: "Seen"},
        { name: "Jenny Wilson", slotTime:"04:00 AM - 05:00 AM", slotDate: "11 Sep, 2020", amenity: "Yoga studio" ,Feedback: "Development in previous...", status: "Pending",wings: ['A', 'B'] },
        { name: "Wade Warren", slotTime: "04:00 AM - 05:00 AM", slotDate: "12 Sep, 2020", amenity: "Swimming pool" ,Feedback: "Development in previous...",status: "Seen",wings: ['A', 'B'] },
        { name: "Esther Howard", slotTime:"04:00 AM - 05:00 AM", slotDate: "13 Sep, 2020", amenity: "Tennis court" ,Feedback: "Development in previous...", status: "Pending",wings: ['A', 'B'] },
        { name: "Cameron Williamson", slotTime: "04:00 AM - 05:00 AM", slotDate: "14 Sep, 2020", amenity: "Gym",Feedback: "Development in previous..." , status: "Pending",wings: ['A', 'B'] },
        { name: "Brooklyn Simmons", slotTime: "04:00 AM - 05:00 AM", slotDate: "15 Sep, 2020", amenity: "Yoga studio",Feedback: "Development in previous..." ,status: "Seen",wings: ['A', 'B']},
        { name: "Leslie Alexander", slotTime:"04:00 AM - 05:00 AM", slotDate: "16 Sep, 2020", amenity: "Swimming pool" ,Feedback: "Development in previous...", status: "Pending", wings: ['A', 'B']},
        { name: "Guy Hawkins", slotTime: "04:00 AM - 05:00 AM", slotDate: "17 Sep, 2020", amenity: "Tennis court" ,Feedback: "Development in previous...", status: "Pending", wings: ['A', 'B'] },
      ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("Sort Status");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const StatusDropdownRef = useRef(null);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const [sortedBookings, setSortedBookings] = useState([]);

  useEffect(() => {
    setSortedBookings(bookings);
  }, [bookings]);

    // Calculate the current page's data
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
    const isAllSelected = currentItems.length > 0 && selectedRows.length === currentItems.length;



    const handleSort = (startDate, endDate) => {
      let filtered;
      if (!startDate && !endDate) {
        filtered = bookings;
      } else {
        filtered = bookings.filter(booking => {
          const bookingDate = dayjs(booking.slotDate, 'D MMM, YYYY');
          if (startDate && endDate) {
            return bookingDate.isSameOrAfter(dayjs(startDate, 'DD MMM, YYYY'), 'day') && 
                   bookingDate.isSameOrBefore(dayjs(endDate, 'DD MMM, YYYY'), 'day');
          } else if (startDate) {
            return bookingDate.isSameOrAfter(dayjs(startDate, 'DD MMM, YYYY'), 'day');
          } else if (endDate) {
            return bookingDate.isSameOrBefore(dayjs(endDate, 'DD MMM, YYYY'), 'day');
          }
          return true;
        });
      }
      
      filtered.sort((a, b) => {
        return dayjs(a.slotDate, 'D MMM, YYYY').valueOf() - dayjs(b.slotDate, 'D MMM, YYYY').valueOf();
      });
      
      setSortedBookings(filtered);
      filterBookings(searchTerm, selectedStatus, filtered);
      setCurrentPage(1);
    };

    const filterBookings = (term, status, bookingsToFilter = sortedBookings) => {
      let filtered = bookingsToFilter;
      
      if (term) {
        filtered = filtered.filter(booking =>
          booking.name.toLowerCase().includes(term.toLowerCase()) ||
          booking.amenity.toLowerCase().includes(term.toLowerCase())
        );
      }
  
      if (status && status !== "Sort Status") {
        filtered = filtered.filter(booking => booking.status.toLowerCase() === status.toLowerCase());
      }
      
      setFilteredBookings(filtered);
      setCurrentPage(1);
    };

    useEffect(() => {
      filterBookings(searchTerm, selectedStatus, sortedBookings);
    }, [sortedBookings, searchTerm, selectedStatus]);
  
    const handleSearch = (term) => {
      setSearchTerm(term);
      filterBookings(term, selectedStatus, sortedBookings);
    };

    const renderWings = (wings) => {
        const wingColors = {
          A: { bg: '#EFF6FF', color: '#1E40AF' },
          B: { bg: '#F0FDF4', color: '#166534' },
          C: { bg: '#FAF5FF', color: '#6B21A8' },
          D: { bg: '#FEF2F2', color: '#991B1B' },
        };
    
        return (
          <div className="flex gap-2">
            {wings.map((wing, index) => (
              <span
                key={index}
                className="text-center align-baseline inline-flex px-2 py-1 items-center font-semibold text-xs leading-none rounded-lg"
                style={{ backgroundColor: wingColors[wing].bg, color: wingColors[wing].color , fontSize:'12px'}}
              >
                {wing} Wing
              </span>
            ))}
          </div>
        );
      };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const hideScrollbarStyle = {
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  };

  // const bookings = [
  //   { name: "Marvin McKinney", slotTime: "08:20 am", slotDate: "8 Sep, 2020", amenity: "Swimming pool", Feedback: 'Development in previous...', wingA: 'A wing', wingB: 'B wing' },
  //   { name: "Jane Cooper", slotTime: "08:20 pm", slotDate: "9 Sep, 2020", amenity: "Tennis court", Feedback: 'The key to surviving this' },
  //   { name: "Robert Fox", slotTime: "08:20 pm", slotDate: "10 Sep, 2020", amenity: "Gym", Feedback: 'The key to surviving this', wingA: 'A wing' },
  //   { name: "Jenny Wilson", slotTime: "08:20 pm", slotDate: "11 Sep, 2020", amenity: "Yoga studio", Feedback: 'The key to surviving this', wingB: 'B wing' },
  //   { name: "Wade Warren", slotTime: "08:20 am", slotDate: "12 Sep, 2020", amenity: "Swimming pool", Feedback: 'The key to surviving this', wingB: 'B wing', wingC: 'C wing' },
  //   { name: "Esther Howard", slotTime: "08:20 pm", slotDate: "13 Sep, 2020", amenity: "Tennis court", Feedback: 'The key to surviving this', wingA: 'A wing' },
  //   { name: "Cameron Williamson", slotTime: "08:20 pm", slotDate: "14 Sep, 2020", amenity: "Gym", Feedback: 'Development in previous...', wingC: 'C wing' },
  //   { name: "Brooklyn Simmons", slotTime: "08:20 pm", slotDate: "15 Sep, 2020", amenity: "Yoga studio", Feedback: 'Development in previous...', wingA: 'A wing', wingB: 'B wing', wingC: 'C wing' },
  //   { name: "Leslie Alexander", slotTime: "08:20 am", slotDate: "16 Sep, 2020", amenity: "Swimming pool", Feedback: 'Development in previous...', wingB: 'B wing' },
  //   { name: "Guy Hawkins", slotTime: "08:20 pm", slotDate: "17 Sep, 2020", amenity: "Tennis court", Feedback: 'Development in previous...', wingB: 'B wing' },
  // ];


  const handleRowSelect = (index) => {
    setSelectedRows(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
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

 // Fix 4: Deleting all selected rows
 const handleDeleteSelected = () => {
  const updatedBookings = bookings.filter((_, index) => !selectedRows.includes(index));
  setBookings(updatedBookings);
  setFilteredBookings(updatedBookings);
  setSelectedRows([]);
};

  // Fix 1: Deleting a single row
  const handleDeleteClick = (index) => {
    const updatedBookings = bookings.filter((_, i) => i !== index);
    setBookings(updatedBookings);
    setFilteredBookings(updatedBookings);
    setSelectedRows([]);
  };

  // const filterBookings = (term, bookingsToFilter = bookings) => {
  //   let filtered = bookingsToFilter;
    
  //   if (term) {
  //     filtered = filtered.filter(booking =>
  //       booking.name.toLowerCase().includes(term.toLowerCase()) ||
  //       booking.amenity.toLowerCase().includes(term.toLowerCase())
  //     );
  //   }

  //   if (Status && Status !== "Sort Status") {
  //     filtered = filtered.filter(booking => booking.amenity === Status);
  //   }
    
  //   setFilteredBookings(filtered);
  //   setCurrentPage(1);
  // };

 // const isAllSelected = currentItems.length > 0 && selectedRows.length === currentItems.length;

 const CheckboxWithTick = ({ isSelected, onClick }) => (
  <div
    onClick={onClick}
    style={{
      width: '20px',
      height: '20px',
      border: '1px solid #6B7280',
      borderRadius: '6px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
    }}
  >
    {isSelected && (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 3L4.5 8.5L2 6" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )}
  </div>
);
// const handleItemClick = (booking) => {
//   setSearchTerm(booking.name);
//   setFilteredBookings([booking]);
// };

useEffect(() => {
  const handleClickOutside = (event) => {
    if (StatusDropdownRef.current && !StatusDropdownRef.current.contains(event.target)) {
      setIsStatusDropdownOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

  
useEffect(()=>{
  setFilteredBookings(bookings)
},[bookings])

  // const handleSearch =(term)=>{
  //   setSearchTerm(term)
  //   if(term.trim() === ""){
  //     setFilteredBookings(bookings);
  //   } else{
  //     const filtered = bookings.filter( (booking) => booking.name.toLowerCase().includes(term.toLowerCase()))
  //     setFilteredBookings(filtered)
  //   }
  //   setCurrentPage(1);
  // }

  const handleItemClick =(booking)=>{
setSearchTerm(booking.name);
setFilteredBookings([booking])
setCurrentPage(1);
  }

  
  const dropdownButtonStyle = {
    display: 'flex',
    padding: '8px 16px',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #D1D5DB',
    borderRadius: '10px',
    color: '#6B7280',
    fontSize: '16px',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    cursor: 'pointer',
    backgroundColor: 'white',
    width:'242px'
  };

  const dropdownContentStyle = {
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



   // Fix 2: Saving edits
   const handleSaveEdit = (updatedBooking) => {
    const updatedBookings = bookings.map((booking, index) => 
      index === editingIndex ? { ...booking, ...updatedBooking } : booking
    );
    setBookings(updatedBookings);
    setFilteredBookings(updatedBookings);
    setIsEditModalOpen(false);
    setEditingBooking(null);
    setEditingIndex(null);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingBooking(null);
    setEditingIndex(null);
  };

  const handleEditClick = (booking, index) => {
    setEditingBooking({ ...booking });
    setEditingIndex(index);
    setIsEditModalOpen(true);
  };

  // Fix 3: Sort status dropdown
  
  const handleAmenitySelect = (status) => {
    setSelectedStatus(status);
    setIsStatusDropdownOpen(false);

    let filtered;
    if (status === "Sort Status") {
      filtered = bookings;
    } else {
      filtered = bookings.filter(booking => booking.status.toLowerCase() === status.toLowerCase());
    }
    setFilteredBookings(filtered);
    setCurrentPage(1);
  };

  const leftSideSvg = (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M6.19254 10.3078C6.25065 10.3659 6.29674 10.4348 6.3282 10.5107C6.35965 10.5865 6.37584 10.6679 6.37584 10.75C6.37584 10.8321 6.35965 10.9135 6.3282 10.9893C6.29674 11.0652 6.25065 11.1341 6.19254 11.1922L3.69254 13.6922C3.63449 13.7503 3.56556 13.7964 3.48969 13.8279C3.41381 13.8593 3.33248 13.8755 3.25035 13.8755C3.16821 13.8755 3.08688 13.8593 3.01101 13.8279C2.93514 13.7964 2.86621 13.7503 2.80816 13.6922L0.30816 11.1922C0.250091 11.1341 0.204028 11.0652 0.172602 10.9893C0.141175 10.9134 0.125 10.8321 0.125 10.75C0.125 10.6679 0.141175 10.5866 0.172602 10.5107C0.204028 10.4348 0.250091 10.3659 0.30816 10.3078C0.425435 10.1905 0.584495 10.1247 0.750347 10.1247C0.832469 10.1247 0.913787 10.1408 0.989658 10.1723C1.06553 10.2037 1.13447 10.2497 1.19253 10.3078L2.62535 11.7414V0.750003C2.62535 0.584243 2.6912 0.425272 2.80841 0.308062C2.92562 0.190852 3.08459 0.125003 3.25035 0.125003C3.41611 0.125003 3.57508 0.190852 3.69229 0.308062C3.8095 0.425272 3.87535 0.584243 3.87535 0.750003V11.7414L5.30816 10.3078C5.36621 10.2497 5.43514 10.2036 5.51101 10.1722C5.58688 10.1407 5.66821 10.1245 5.75035 10.1245C5.83248 10.1245 5.91381 10.1407 5.98969 10.1722C6.06556 10.2036 6.13449 10.2497 6.19254 10.3078ZM13.6925 2.80782L11.1925 0.307816C11.1345 0.249706 11.0656 0.203606 10.9897 0.172154C10.9138 0.140701 10.8325 0.124512 10.7503 0.124512C10.6682 0.124512 10.5869 0.140701 10.511 0.172154C10.4351 0.203606 10.3662 0.249706 10.3082 0.307816L7.80816 2.80782C7.69088 2.92509 7.625 3.08415 7.625 3.25C7.625 3.41586 7.69088 3.57492 7.80816 3.69219C7.92544 3.80947 8.0845 3.87535 8.25035 3.87535C8.4162 3.87535 8.57526 3.80947 8.69254 3.69219L10.1253 2.2586V13.25C10.1253 13.4158 10.1912 13.5747 10.3084 13.6919C10.4256 13.8092 10.5846 13.875 10.7503 13.875C10.9161 13.875 11.0751 13.8092 11.1923 13.6919C11.3095 13.5747 11.3753 13.4158 11.3753 13.25V2.2586L12.8082 3.69219C12.9254 3.80947 13.0845 3.87535 13.2503 3.87535C13.4162 3.87535 13.5753 3.80947 13.6925 3.69219C13.8098 3.57492 13.8757 3.41586 13.8757 3.25C13.8757 3.08415 13.8098 2.92509 13.6925 2.80782Z" fill="#6B7280"/>
</svg>
  )

  const dropdownSvg = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M16.2345 7.06754L9.98453 13.3175C9.92648 13.3756 9.85755 13.4217 9.78168 13.4532C9.7058 13.4847 9.62447 13.5008 9.54234 13.5008C9.46021 13.5008 9.37888 13.4847 9.303 13.4532C9.22713 13.4217 9.1582 13.3756 9.10015 13.3175L2.85015 7.06754C2.73288 6.95026 2.66699 6.7912 2.66699 6.62535C2.66699 6.4595 2.73288 6.30044 2.85015 6.18316C2.96743 6.06588 3.12649 6 3.29234 6C3.45819 6 3.61725 6.06588 3.73453 6.18316L9.54234 11.9918L15.3502 6.18316C15.4082 6.12509 15.4772 6.07903 15.553 6.0476C15.6289 6.01617 15.7102 6 15.7923 6C15.8745 6 15.9558 6.01617 16.0317 6.0476C16.1075 6.07903 16.1765 6.12509 16.2345 6.18316C16.2926 6.24123 16.3387 6.31017 16.3701 6.38604C16.4015 6.46191 16.4177 6.54323 16.4177 6.62535C16.4177 6.70747 16.4015 6.78879 16.3701 6.86466C16.3387 6.94053 16.2926 7.00947 16.2345 7.06754Z" fill="#6B7280"/>
    </svg>
  );


const Status =['Sort Status','seen','pending']



  return (
    <>
    <div className="mt-1 bg-white border rounded-lg overflow-hidden flex flex-col" style={{ height: '560px' }}>
      {/* Sticky Header and Top Section */}
      <div className="sticky top-0 bg-white z-20">
        <div className="flex justify-between p-6">
        <div className='relative z-40'>
            <NextSearchInput onItemClick={handleItemClick} onSearch={handleSearch} bookings={bookings} />
          </div>
          <div className="flex justify-end">
          <SortButton onSort={handleSort} />
            <button
              className="flex text-end justify-end ml-[10px]"
              style={{
                display: 'flex',
                padding: '8px 16px',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid #D1D5DB',
                borderRadius: '10px',
                color: '#6B7280',
                fontSize: '16px',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            >
              Filter
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div>
          <table className="w-full text-sm text-gray-500">
            <thead
              className="sticky top-0  z-10 text-xs text-gray-500 bg-gray-50"
              style={{ fontSize: '12px', borderBottom: '1px solid #D1D5DB' }}
            >
              <tr className="border-y">
                <th scope="col" className="justify-center text-center">
                  <div className="flex items-center justify-center text-center mt-1">
                  <CheckboxWithTick
                        isSelected={isAllSelected}
                        onClick={handleSelectAll}
                      />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-start" style={{ fontSize: '12px' }}>
                  Update
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className="flex text-center items-center justify-center">
                    Date
                    <svg
                      className="ml-2"
                      xmlns="http://www.w3.org/2000/svg"
                      width="17"
                      height="16"
                      viewBox="0 0 17 16"
                      fill="none"
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
                <th scope="col" className="px-6 py-3 flex items-center text-left justify-center">
                  Wing
                </th>
                <th scope="col" className="px-6 py-3 text-left"></th>
                <th scope="col" className="px-6 py-3 text-right">
                <span 
    style={{
      visibility: selectedRows.length > 1 ? 'visible' : 'hidden',
      cursor: 'pointer',
      color: '#EF4444'
    }}
    onClick={handleDeleteSelected}
  >
    Delete All
  </span>
                </th>
              </tr>
            </thead>
          </table>
        </div>
      </div>

      {/* Table Body */}
      <div className="flex flex-col flex-grow overflow-hidden">
      <div className="flex-grow overflow-y-auto" style={hideScrollbarStyle}>
      <table className="w-full text-sm text-gray-500">
          <tbody style={hideScrollbarStyle}>
            {filteredBookings.length > 0 ?  (
              currentItems.map((booking, index) => {
                const actualIndex = indexOfFirstItem + index;
              const isSelected = selectedRows.includes(actualIndex);
              return (
              <tr
                key={index}
                className="bg-white border-b hover:bg-gray-50"
                style={{ fontSize: '14px' }}
              >
                <td className="w-4 p-4 text-left">
                  <div className="flex items-center">
                  <CheckboxWithTick
                            isSelected={isSelected}
                            onClick={() => handleRowSelect(actualIndex)}
                          />
                  </div>
                </td>
                <th
                  scope="row"
                  className="px-6 flex text-start py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {booking.name}
                </th>
                <td className="px-6 py-4">{booking.slotDate}</td>
                <td className="px-6 py-4">
                  {/* <div className="flex gap-2">
                    {booking.wingA && (
                      <span
                        className="text-center align-baseline inline-flex px-2 py-1 items-center font-semibold text-xs leading-none rounded-lg"
                        style={{ backgroundColor: '#EFF6FF', color: '#1E40AF' }}
                      >
                        A Wing
                      </span>
                    )}
                    {booking.wingB && (
                      <span
                        className="text-center align-baseline inline-flex px-2 py-1 items-center font-semibold text-xs leading-none rounded-lg"
                        style={{ backgroundColor: '#F0FDF4', color: '#166534' }}
                      >
                        B Wing
                      </span>
                    )}
                    {booking.wingC && (
                      <span
                        className="text-center align-baseline inline-flex px-2 py-1 items-center font-semibold text-xs leading-none rounded-lg"
                        style={{ backgroundColor: '#FAF5FF', color: '#6B21A8' }}
                      >
                        C Wing
                      </span>
                    )}
                  </div> */}
                   {renderWings(booking.wings || [])}
                </td>
                <td></td>
                <td className="px-6 py-4 flex justify-end items-center">
                  {/* Action Icons */}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      className="mr-6"
                      d="M17.5 11.25V16.25C17.5 16.4158 17.4342 16.5747 17.3169 16.6919C17.1997 16.8092 17.0408 16.875 16.875 16.875H3.125C2.95924 16.875 2.80027 16.8092 2.68306 16.6919C2.56585 16.5747 2.5 16.4158 2.5 16.25V11.25C2.5 11.0842 2.56585 10.9253 2.68306 10.8081C2.80027 10.6908 2.95924 10.625 3.125 10.625C3.29076 10.625 3.44973 10.6908 3.56694 10.8081C3.68415 10.9253 3.75 11.0842 3.75 11.25V15.625H16.25V11.25C16.25 11.0842 16.3158 10.9253 16.4331 10.8081C16.5503 10.6908 16.7092 10.625 16.875 10.625C17.0408 10.625 17.1997 10.6908 17.3169 10.8081C17.4342 10.9253 17.5 11.0842 17.5 11.25ZM9.55781 11.6922C9.61586 11.7503 9.68479 11.7964 9.76066 11.8279C9.83654 11.8593 9.91787 11.8755 10 11.8755C10.0821 11.8755 10.1635 11.8593 10.2393 11.8279C10.3152 11.7964 10.3841 11.7503 10.4422 11.6922L13.5672 8.56719C13.6253 8.50912 13.6713 8.44018 13.7027 8.36431C13.7342 8.28844 13.7503 8.20712 13.7503 8.125C13.7503 8.04288 13.7342 7.96156 13.7027 7.88569C13.6713 7.80982 13.6253 7.74088 13.5672 7.68281C13.5091 7.62474 13.4402 7.57868 13.3643 7.54725C13.2884 7.51583 13.2071 7.49965 13.125 7.49965C13.0429 7.49965 12.9616 7.51583 12.8857 7.54725C12.8098 7.57868 12.7409 7.62474 12.6828 7.68281L10.625 9.74141V2.5C10.625 2.33424 10.5592 2.17527 10.4419 2.05806C10.3247 1.94085 10.1658 1.875 10 1.875C9.83424 1.875 9.67527 1.94085 9.55806 2.05806C9.44085 2.17527 9.375 2.33424 9.375 2.5V9.74141L7.31719 7.68281C7.19991 7.56554 7.04085 7.49965 6.875 7.49965C6.70915 7.49965 6.55009 7.56554 6.43281 7.68281C6.31554 7.80009 6.24965 7.95915 6.24965 8.125C6.24965 8.29085 6.31554 8.44991 6.43281 8.56719L9.55781 11.6922Z"
                      fill="#6B7280"
                    />
                  </svg>
                  <svg
                   onClick={() => handleEditClick(booking, actualIndex)} style={{cursor:'pointer'}}
                    className="ml-6"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.7586 5.73201L14.268 2.24061C14.1519 2.1245 14.0141 2.0324 13.8624 1.96957C13.7107 1.90673 13.5482 1.87439 13.384 1.87439C13.2198 1.87439 13.0572 1.90673 12.9056 1.96957C12.7539 2.0324 12.6161 2.1245 12.5 2.24061L2.86641 11.875C2.74983 11.9906 2.65741 12.1283 2.59451 12.28C2.5316 12.4317 2.49948 12.5944 2.50001 12.7586V16.25C2.50001 16.5815 2.6317 16.8994 2.86612 17.1339C3.10054 17.3683 3.41849 17.5 3.75001 17.5H7.24141C7.40563 17.5005 7.5683 17.4684 7.71999 17.4055C7.87168 17.3426 8.00935 17.2502 8.12501 17.1336L17.7586 7.49998C17.8747 7.3839 17.9668 7.24609 18.0296 7.09442C18.0925 6.94274 18.1248 6.78017 18.1248 6.616C18.1248 6.45182 18.0925 6.28925 18.0296 6.13758C17.9668 5.9859 17.8747 5.84809 17.7586 5.73201ZM7.24141 16.25H3.75001V12.7586L10.625 5.88358L14.1164 9.37498L7.24141 16.25ZM15 8.49061L11.5086 4.99998L13.3836 3.12498L16.875 6.61561L15 8.49061Z"
                      fill="#6B7280"
                    />
                  </svg>
                  <svg
                  onClick={() => handleDeleteClick(actualIndex)} style={{cursor:'pointer'}} 
                    className="ml-6"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.875 3.75H3.125C2.95924 3.75 2.80027 3.81585 2.68306 3.93306C2.56585 4.05027 2.5 4.20924 2.5 4.375C2.5 4.54076 2.56585 4.69973 2.68306 4.81694C2.80027 4.93415 2.95924 5 3.125 5H3.75V16.25C3.75 16.5815 3.8817 16.8995 4.11612 17.1339C4.35054 17.3683 4.66848 17.5 5 17.5H15C15.3315 17.5 15.6495 17.3683 15.8839 17.1339C16.1183 16.8995 16.25 16.5815 16.25 16.25V5H16.875C17.0408 5 17.1997 4.93415 17.3169 4.81694C17.4342 4.69973 17.5 4.54076 17.5 4.375C17.5 4.20924 17.4342 4.05027 17.3169 3.93306C17.1997 3.81585 17.0408 3.75 16.875 3.75ZM15 16.25H5V5H15V16.25ZM6.25 1.875C6.25 1.70924 6.31585 1.55027 6.43306 1.43306C6.55027 1.31585 6.70924 1.25 6.875 1.25H13.125C13.2908 1.25 13.4497 1.31585 13.5669 1.43306C13.6842 1.55027 13.75 1.70924 13.75 1.875C13.75 2.04076 13.6842 2.19973 13.5669 2.31694C13.4497 2.43415 13.2908 2.5 13.125 2.5H6.875C6.70924 2.5 6.55027 2.43415 6.43306 2.31694C6.31585 2.19973 6.25 2.04076 6.25 1.875Z"
                      fill="#EF4444"
                    />
                  </svg>
                </td>
              </tr>
            );
})
          ):(
            <tr>
            <td colSpan="8" className="px-6 py-4 text-center text-gray-500" style={{ height: '300px' }}>
              <div className="flex flex-col items-center justify-center h-full">
                <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-lg font-semibold">No bookings found</p>
                <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
              </div>
            </td>
          </tr>
          )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center px-6 py-3 border-t bg-white">
        <div
          className="text-sm text-gray-700"
          style={{ color: 'var(--Gray-700, #1F2937)', fontSize: '14px', fontWeight: '600' }}
        >
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-3 py-1 border rounded ${
              currentPage === 1 ? 'bg-gray-100 #6B7280' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            style={{ fontSize: '14px', border: '1px solid #D1D5DB' }}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border rounded ${
              currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            style={{ fontSize: '14px', border: '1px solid #D1D5DB' }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
    </div>

    <EditingConstructionModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        booking={editingBooking}
        onSave={handleSaveEdit}
      />
    </>
  );
};

export default ConstructionUpdatetable;

