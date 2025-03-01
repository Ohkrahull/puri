             

import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { collection, deleteDoc, doc, getFirestore, onSnapshot, orderBy, query } from "firebase/firestore";
import { getApp } from "firebase/app";
import SortButton from "../Buttons/Sortdate";
import DeleteModal from "../Modals/DeleteModal";
import { getAllAmenities } from "../firebase/services/amenityService";
import { Navigate, useNavigate } from "react-router-dom";

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
    // const fullName = `${alert.userDetails?.firstName || ''} ${alert.userDetails?.lastName || ''}`.trim() || 'N/A';
    setSearchTerm(alert.heading);
    setShowDropdown(false);
    onSearch(alert);
  };

  const filteredAlerts = alerts.filter(
    (amenity) =>
        (amenity.heading && amenity.heading.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (amenity.location && amenity.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (amenity.about && amenity.about.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const truncateText = (text, charLimit = 20) => {
    if (!text) return 'N/A';
    if (text.length <= charLimit) return text;
    const lastSpace = text.lastIndexOf(' ', charLimit);
    return lastSpace > 0 ? text.slice(0, lastSpace) + '...' : text.slice(0, charLimit) + '...';
  };

  return (
    <div className="relative w-full sm:w-[250px] md:w-[300px] z-50">
      <div
        className="flex items-center justify-between p-2 sm:py-2 border border-[#D1D5DB] rounded-[10px] text-[#6B7280] text-sm sm:text-base font-['Plus_Jakarta']"
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
                  {/* {truncateText(fullName, 20)} */}
                  <span>{truncateText(alert.heading, 20)}</span>
                  {/* <span>{alert.wing || 'N/A'} - {alert.flatNumber || 'N/A'}</span> */}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const AmenityTable = () => {
    const [amenities, setAmenities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uniqueHeadings, setUniqueHeadings] = useState([]);
    const [activeTab, setActiveTab] = useState('amenities');

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
//   const [alerts] = useState([
//     "Sort Amenities",
//   ]);

  const searchRef = useRef(null);
  const sortDateRef = useRef(null);
  const db = getFirestore(getApp());

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAlerts.slice(indexOfFirstItem, indexOfLastItem);
  const isAllSelected = currentItems.length > 0 && selectedRows.length === currentItems.length;
  const navigate = useNavigate();

  useEffect(() => {
    if (alerts && alerts.length > 0) {
      const uniqueHeadingSet = new Set(alerts.map(alert => alert.heading));
      const headingsArray = [...uniqueHeadingSet].filter(Boolean).sort();
      setUniqueHeadings(headingsArray);
    }
  }, [alerts]);

//   useEffect(() => {
//     const fetchAmenities = async () => {
//       try {
//         const response = await getAllAmenities();
//         if (response.success) {
//           setAmenities(response.data);
//         } else {
//           setError(response.error);
//         }
//       } catch (err) {
//         setError('Failed to fetch amenities');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAmenities();
//   }, []);

  useEffect(() => {
    const sosQuery = query(
      collection(db, "amenities"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(sosQuery, (snapshot) => {
      const sosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(sosData);
      
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
      const filtered = alerts.filter(amenity => {
        return (
          amenity.heading?.toLowerCase().includes(searchStr) ||
          amenity.location?.toLowerCase().includes(searchStr) ||
          amenity.about?.toLowerCase().includes(searchStr)
        );
      });
      setFilteredAlerts(filtered);
    }
    setCurrentPage(1);
  };

  const handleSosTypeSelect = (type) => {
    setSelectedSosType(type);
    setIsTypeDropdownOpen(false);
  
    if (type === "Sort Amenity") {
      setFilteredAlerts(alerts);
    } else {
      const filtered = alerts.filter((alert) => alert.heading === type);
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

//   const handleEditClick = (amenity) => {
//     navigate(`/AmenityForm/${amenity.id}`, {
//       state: {
//         amenityData: amenity,  // Pass selected amenity data
//       },
//     });
//   };
const handleEditClick = (amenity) => {
    navigate('/AmenityForm', {
      state: {
        amenityData: {
          id: amenity.id,
          heading: amenity.heading,
          location: amenity.location,
          about: amenity.about,
          timeSlots: {
            startTime: amenity.timeSlots?.startTime || '10:00',
            endTime: amenity.timeSlots?.endTime || '23:00',
            slotDuration: amenity.timeSlots?.slotDuration || ''
          },
          isDisabled: amenity.isDisabled || false,
          imageUrls: amenity.imageUrls || []
        }
      }
    });
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
            {/* <div className="ml-7 mt-7 gap-4">
                <span className=" p-2 " style={{border:'1px solid #E4E7EC', borderRadius:8, backgroundColor:'#F9FAFB'}}>Amenities</span>
                <span className="ml-3 p-2 " style={{border:'1px solid red'}}>Services</span>
            </div> */}
             <div className="ml-7 mt-7 gap-4">
      <span
        className="p-2 cursor-pointer"
        style={{
          border: activeTab === 'amenities' ? '1px solid #E4E7EC' : '1px solid transparent',
          borderRadius: 8,
          backgroundColor: activeTab === 'amenities' ? '#F9FAFB' : 'transparent',
          color: activeTab === 'amenities' ? '#000' : '#6B7280',
          transition: 'all 0.3s ease-in-out'
        }}
        onClick={() => setActiveTab('amenities')}
      >
        Amenities
      </span>

      <span
        className="ml-3 p-2 cursor-pointer"
        style={{
          border: activeTab === 'services' ? '1px solid #E4E7EC' : '1px solid transparent',
          borderRadius: 8,
          backgroundColor: activeTab === 'services' ? '#F9FAFB' : 'transparent',
          color: activeTab === 'services' ? '#000' : '#6B7280',
          transition: 'all 0.3s ease-in-out'
        }}
        onClick={() => setActiveTab('services')}
      >
        Services
      </span>
    </div>
          <div className="flex flex-col sm:flex-row items-stretch p-6 gap-4 justify-between">
            
            <div className="w-full sm:w-auto">
              <SearchInput alerts={alerts} onSearch={handleSearch} />
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-[242px]  " style={{ position: 'relative', zIndex: 43 }}>
  <button 
    onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
    className="w-full  flex items-center justify-between px-4 py-4 p-2 bg-[#F3F3F3] border border-[#D1D5DB] rounded-[10px] text-[#6B7280] text-base"
  >
    <span className="flex items-center gap-2 font-medium" style={{fontSize:14}}>
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M9.19254 13.3078C9.25065 13.3659 9.29674 13.4348 9.3282 13.5107C9.35965 13.5865 9.37584 13.6679 9.37584 13.75C9.37584 13.8321 9.35965 13.9135 9.3282 13.9893C9.29674 14.0652 9.25065 14.1341 9.19254 14.1922L6.69254 16.6922C6.63449 16.7503 6.56556 16.7964 6.48969 16.8279C6.41381 16.8593 6.33248 16.8755 6.25035 16.8755C6.16821 16.8755 6.08688 16.8593 6.01101 16.8279C5.93514 16.7964 5.86621 16.7503 5.80816 16.6922L3.30816 14.1922C3.25009 14.1341 3.20403 14.0652 3.1726 13.9893C3.14118 13.9134 3.125 13.8321 3.125 13.75C3.125 13.6679 3.14118 13.5866 3.1726 13.5107C3.20403 13.4348 3.25009 13.3659 3.30816 13.3078C3.42544 13.1905 3.5845 13.1247 3.75035 13.1247C3.83247 13.1247 3.91379 13.1408 3.98966 13.1723C4.06553 13.2037 4.13447 13.2497 4.19253 13.3078L5.62535 14.7414V3.75C5.62535 3.58424 5.6912 3.42527 5.80841 3.30806C5.92562 3.19085 6.08459 3.125 6.25035 3.125C6.41611 3.125 6.57508 3.19085 6.69229 3.30806C6.8095 3.42527 6.87535 3.58424 6.87535 3.75V14.7414L8.30816 13.3078C8.36621 13.2497 8.43514 13.2036 8.51101 13.1722C8.58688 13.1407 8.66821 13.1245 8.75035 13.1245C8.83248 13.1245 8.91381 13.1407 8.98969 13.1722C9.06556 13.2036 9.13449 13.2497 9.19254 13.3078ZM16.6925 5.80782L14.1925 3.30782C14.1345 3.24971 14.0656 3.20361 13.9897 3.17215C13.9138 3.1407 13.8325 3.12451 13.7503 3.12451C13.6682 3.12451 13.5869 3.1407 13.511 3.17215C13.4351 3.20361 13.3662 3.24971 13.3082 3.30782L10.8082 5.80782C10.6909 5.92509 10.625 6.08415 10.625 6.25C10.625 6.41586 10.6909 6.57492 10.8082 6.69219C10.9254 6.80947 11.0845 6.87535 11.2503 6.87535C11.4162 6.87535 11.5753 6.80947 11.6925 6.69219L13.1253 5.2586V16.25C13.1253 16.4158 13.1912 16.5747 13.3084 16.6919C13.4256 16.8092 13.5846 16.875 13.7503 16.875C13.9161 16.875 14.0751 16.8092 14.1923 16.6919C14.3095 16.5747 14.3753 16.4158 14.3753 16.25V5.2586L15.8082 6.69219C15.9254 6.80947 16.0845 6.87535 16.2503 6.87535C16.4162 6.87535 16.5753 6.80947 16.6925 6.69219C16.8098 6.57492 16.8757 6.41586 16.8757 6.25C16.8757 6.08415 16.8098 5.92509 16.6925 5.80782Z" fill="#6B7280"/>
            </svg>
      {selectedSosType}
    </span>
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M16.2345 7.06754L9.98453 13.3175C9.92648 13.3756 9.85755 13.4217 9.78168 13.4532C9.7058 13.4847 9.62447 13.5008 9.54234 13.5008C9.46021 13.5008 9.37888 13.4847 9.303 13.4532C9.22713 13.4217 9.1582 13.3756 9.10015 13.3175L2.85015 7.06754C2.73288 6.95026 2.66699 6.7912 2.66699 6.62535C2.66699 6.4595 2.73288 6.30044 2.85015 6.18316C2.96743 6.06588 3.12649 6 3.29234 6C3.45819 6 3.61725 6.06588 3.73453 6.18316L9.54234 11.9918L15.3502 6.18316C15.4082 6.12509 15.4772 6.07903 15.553 6.0476C15.6289 6.01617 15.7102 6 15.7923 6C15.8745 6 15.9558 6.01617 16.0317 6.0476C16.1075 6.07903 16.1765 6.12509 16.2345 6.18316C16.2926 6.24123 16.3387 6.31017 16.3701 6.38604C16.4015 6.46191 16.4177 6.54323 16.4177 6.62535C16.4177 6.70747 16.4015 6.78879 16.3701 6.86466C16.3387 6.94053 16.2926 7.00947 16.2345 7.06754Z" fill="#6B7280"/>
    </svg>
  </button>
  {isTypeDropdownOpen && (
  <div 
    className="absolute w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg overflow-y-auto custom-scrollbar"
    style={{
      maxHeight: "228px",
      zIndex: 50,  // Increased z-index
      position: 'absolute',
      top: '100%',  // Position right below the button
      left: 0,
      minWidth: '100%',
      transform: 'none',  // Remove any transforms that might affect positioning
    }}
  >
    <div
      onClick={() => handleSosTypeSelect("Sort Amenity")}
      className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-md text-gray-600 border-b border-gray-100"
    >
      Sort Amenity
    </div>
    
    {uniqueHeadings.map((heading, index) => (
      <div
        key={index}
        onClick={() => handleSosTypeSelect(heading)}
        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-md text-gray-600 border-b border-gray-100 last:border-b-0"
      >
        {heading}
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
                    {/* <th scope="col" className="px-6 py-3"></th> */}
                    {/* <th scope="col" className="px-6 py-3"></th> */}
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
                    {/* <th scope="col" className="px-6 py-3"></th> */}
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
                    {/* <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '130px'}}>Name</th> */}
                    <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px'}}>
                      <div className="flex items-center">
                        Name
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px', cursor: "pointer"}}>
                      <div className="flex items-center" onClick={handleDateSort}>
                        Open
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
                    <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px', cursor: "pointer"}}>
                      <div className="flex items-center" onClick={handleDateSort}>
                        Close
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
                    <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px', cursor: "pointer"}}>
                      <div className="flex items-center" onClick={handleDateSort}>
                        Location
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
                    {/* <th scope="col" className="px-6 py-3 text-right" style={{minWidth: '120px'}}>
                <span 
                  style={{
                    visibility: selectedRows.length > 1 ? 'visible' : 'hidden',
                    cursor: 'pointer',
                    color: '#EF4444'
                  }}
                //   onClick={handleDeleteSelected}
                >
                  Delete All
                </span>
              </th> */}
                    <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px'}}></th>
                    <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '150px'}}></th>
                    {/* <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '180px'}}>Acknowledged By</th> */}
                    {/* <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '180px'}}>Acknowledge Time</th> */}
                    {/* <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '180px'}}>Resolved Time</th> */}
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
                        {/* {fullName || 'N/A'} */}
                        {alert.heading}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" style={{minWidth: '120px'}}>
                        {/* {`${alert.wing || ''}-${alert.flatNumber || ''}`} */}
                        {alert.timeSlots?.startTime || 'N/A'}                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" style={{minWidth: '120px'}}>
                        {/* {alert.createdAt ? dayjs(alert.createdAt.toDate()).format('D MMM, YYYY') : 'N/A'} */}
                                                {alert.timeSlots.endTime}

                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" style={{minWidth: '120px'}}>
                        {/* {formatTimeWithAmPm(alert.createdAt)} */}
                        {alert.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap lowercase" style={{minWidth: '150px'}}>
                        {/* <span className="inline-flex px-4 py-2 items-center font-semibold  leading-4 rounded-xl">
                          {alert.type || 'N/A'}
                        </span> */}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap" style={{minWidth: '180px'}}>
                        {alert.employeeId ? 
                          `${guardUsers[alert.employeeId]?.firstName || ''} ${guardUsers[alert.employeeId]?.lastName || ''}` 
                          : 'Not assigned'
                        }
                      </td> */}
                      {/* <td className="px-6 py-4 whitespace-nowrap" style={{minWidth: '180px'}}>
                        {formatTimeWithAmPm(alert.acknowledgedAt)}
                      </td> */}
                      {/* <td className="px-6 py-4 whitespace-nowrap" style={{minWidth: '180px'}}>
                        {alert.resolved ? formatTimeWithAmPm(alert.cancelledAt) : 'Pending'}
                      </td> */}
                       <td className="px-6 py-4 whitespace-nowrap text-right" style={{minWidth: '120px'}}>
                      <div className="flex justify-end space-x-4">
                        <button onClick={() => handleEditClick(alert)} >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.7586 5.73201L14.268 2.24061C14.1519 2.1245 14.0141 2.0324 13.8624 1.96957C13.7107 1.90673 13.5482 1.87439 13.384 1.87439C13.2198 1.87439 13.0572 1.90673 12.9056 1.96957C12.7539 2.0324 12.6161 2.1245 12.5 2.24061L2.86641 11.875C2.74983 11.9906 2.65741 12.1283 2.59451 12.28C2.5316 12.4317 2.49948 12.5944 2.50001 12.7586V16.25C2.50001 16.5815 2.6317 16.8994 2.86612 17.1339C3.10054 17.3683 3.41849 17.5 3.75001 17.5H7.24141C7.40563 17.5005 7.5683 17.4684 7.71999 17.4055C7.87168 17.3426 8.00935 17.2502 8.12501 17.1336L17.7586 7.49998C17.8747 7.3839 17.9668 7.24609 18.0296 7.09442C18.0925 6.94274 18.1248 6.78017 18.1248 6.616C18.1248 6.45182 18.0925 6.28925 18.0296 6.13758C17.9668 5.9859 17.8747 5.84809 17.7586 5.73201ZM7.24141 16.25H3.75001V12.7586L10.625 5.88358L14.1164 9.37498L7.24141 16.25ZM15 8.49061L11.5086 4.99998L13.3836 3.12498L16.875 6.61561L15 8.49061Z" fill="#6B7280"/>
                              </svg>
                        </button>
                        
                      </div>
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

export default AmenityTable;