import React, { useEffect, useRef, useState, useCallback } from "react";
// import styles from "./CustomScrollbar.module.css";
// import SortButton from "../Buttons/Sortdate";
import SortButton from "../../Buttons/Sortdate";

import EditingBookingModal from "../EditingModal";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
// import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import DeleteModal from "../../Modals/DeleteModal";
import {
  fetchAllBookings,
  updateBooking,
  deleteBooking,
} from "../../firebase/services/bookingsData";
import { collection, deleteDoc, doc, getFirestore, onSnapshot, query } from "firebase/firestore";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// import React, { useState } from 'react';

const SearchInput = ({ registrations, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length > 0);
    onSearch(value);
  };

  const handleItemClick = (registration) => {
    // Get primary owner or first owner
    const primaryOwner = registration.owners?.find(owner => owner.isPrimaryStatus) || 
                         registration.owners?.[0];
    
    // Get primary tenant or first tenant
    const primaryTenant = registration.tenants?.find(tenant => tenant.isPrimaryStatus) || 
                          registration.tenants?.[0];
  
    // Prioritize owner name, then tenant name
    const fullName = primaryOwner 
      ? `${primaryOwner.firstName || ''} ${primaryOwner.lastName || ''}`.trim()
      : primaryTenant
      ? `${primaryTenant.firstName || ''} ${primaryTenant.lastName || ''}`.trim()
      : 'N/A';
  
    setSearchTerm(fullName);
    setShowDropdown(false);
    onSearch(registration);
  };

  const filteredRegistrations = registrations.filter(
    (registration) => {
      const term = searchTerm.toLowerCase().trim();
      
      // Check owner names
      const ownerMatch = registration.owners?.some(owner => 
        `${owner.firstName || ''} ${owner.lastName || ''}`.toLowerCase().includes(term) ||
        (owner.firstName || '').toLowerCase().includes(term) ||
        (owner.lastName || '').toLowerCase().includes(term)
      );
  
      // Check tenant names
      const tenantMatch = registration.tenants?.some(tenant => 
        `${tenant.firstName || ''} ${tenant.lastName || ''}`.toLowerCase().includes(term) ||
        (tenant.firstName || '').toLowerCase().includes(term) ||
        (tenant.lastName || '').toLowerCase().includes(term)
      );
  
      // Check flat number
      const flatNumberMatch = registration.fullFlatNumber?.toLowerCase().includes(term);
  
      return ownerMatch || tenantMatch || flatNumberMatch;
    }
  );

  const truncateText = (text, charLimit = 20) => {
    if (!text) return 'N/A';
    if (text.length <= charLimit) return text;
    const lastSpace = text.lastIndexOf(' ', charLimit);
    return lastSpace > 0 ? text.slice(0, lastSpace) + '...' : text.slice(0, charLimit) + '...';
  };

  return (
    <div className="relative w-full sm:w-[250px] md:w-[300px]">
      <div className="flex items-center justify-between p-2 sm:py-3 border border-[#D1D5DB] rounded-[10px] text-[#6B7280] text-sm sm:text-base font-['Plus_Jakarta']" style={{fontFamily:'Plus_Jakarta', backgroundColor:'#F3F3F3', fontSize:'16', fontWeight:500}}>
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
        <Search className="w-5 h-5 sm:w-6 sm:h-6 mr-2 " style={{color:'#6B7280' }} size={20} />
      </div>

      {showDropdown && filteredRegistrations.length > 0 && (
        <div className="absolute w-full mt-2 sm:mt-3 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-y-auto">
          {filteredRegistrations.map((registration, index) => {
            const primaryOwner = registration.owners?.find(owner => owner.isPrimaryStatus) || registration.owners?.[0];
            const ownerName = primaryOwner ? 
              `${primaryOwner.firstName || ''} ${primaryOwner.lastName || ''}`.trim() || 'N/A' : 'N/A';

            return (
              <div
                key={index}
                className="px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-100 cursor-pointer border-b border-[#E5E7EB] last:border-b-0"
                onClick={() => handleItemClick(registration)}
              >
                <div className="font-medium flex justify-between text-sm sm:text-base text-[#6B7280]">
                  {truncateText(ownerName, 20)}
                  <span>{registration.wing || 'N/A'} - {registration.flatNumber || 'N/A'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};



const FlatTable = ({ onEditClick, onDeleteClick }) => {
    const [currentPage, setCurrentPage] = useState(1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemName, setDeleteItemName] = useState("");
  const [deleteFunction, setDeleteFunction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState(null);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRegistrations.slice(indexOfFirstItem, indexOfLastItem);
  const isAllSelected = currentItems.length > 0 && selectedRows.length === currentItems.length;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // Added loading state


useEffect(() => {
    const db = getFirestore();
    const registrationsRef = collection(db, 'registrations');
    const q = query(registrationsRef);
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const registrationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort by createdAt timestamp in descending order (newest first)
      const sortedData = registrationsData.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA; // Descending order
      });
      
      // Log the fetched data
      console.log("Fetched Registrations Data:", sortedData);
      console.log("Sample Registration Structure:", sortedData[0]);
      
      // Log specific details about documents
      sortedData.forEach(reg => {
        if (reg.documents) {
          console.log(`Documents for ${reg.fullFlatNumber}:`, reg.documents);
        }
      });
  
      setRegistrations(sortedData);
      setFilteredRegistrations(sortedData);
    }, (error) => {
      console.error("Error fetching registrations:", error);
      toast.error("Error loading registrations");
    });
  
    return () => unsubscribe();
  }, []);

  

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

  

const handleCloseModal = () => {
    console.log("Closing edit modal");
    setIsEditModalOpen(false);
    setEditingRegistration(null);
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

 
  const handleSearch = useCallback((registrationOrTerm) => {
    if (registrationOrTerm && typeof registrationOrTerm === 'object') {
      // Existing logic for selecting a specific registration
      const primaryOwner = registrationOrTerm.owners?.find(owner => owner.isPrimaryStatus) || 
                           registrationOrTerm.owners?.[0];
      
      const primaryTenant = registrationOrTerm.tenants?.find(tenant => tenant.isPrimaryStatus) || 
                            registrationOrTerm.tenants?.[0];
  
      const fullName = primaryOwner 
        ? `${primaryOwner.firstName || ''} ${primaryOwner.lastName || ''}`.trim()
        : primaryTenant
        ? `${primaryTenant.firstName || ''} ${primaryTenant.lastName || ''}`.trim()
        : 'N/A';
  
      setSearchTerm(fullName);
      setFilteredRegistrations([registrationOrTerm]);
    } else {
      // Modify search to be case-insensitive and more flexible
      setSearchTerm(registrationOrTerm || '');
      const term = (registrationOrTerm || '').toLowerCase().trim();
      
      const filtered = registrations.filter(reg => {
        // Check owner names (first and last)
        const ownerMatch = reg.owners?.some(owner => 
          `${owner.firstName || ''} ${owner.lastName || ''}`.toLowerCase().includes(term) ||
          (owner.firstName || '').toLowerCase().includes(term) ||
          (owner.lastName || '').toLowerCase().includes(term)
        );
  
        // Check tenant names (first and last)
        const tenantMatch = reg.tenants?.some(tenant => 
          `${tenant.firstName || ''} ${tenant.lastName || ''}`.toLowerCase().includes(term) ||
          (tenant.firstName || '').toLowerCase().includes(term) ||
          (tenant.lastName || '').toLowerCase().includes(term)
        );
  
        // Check flat number
        const flatNumberMatch = reg.fullFlatNumber?.toLowerCase().includes(term);
  
        return ownerMatch || tenantMatch || flatNumberMatch;
      });
  
      const sortedFiltered = filtered.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
  
      setFilteredRegistrations(sortedFiltered);
    }
    setCurrentPage(1);
  }, [registrations]);

  // const getStatusText = (registration) => {
  //   if (registration.isVacant) {
  //     return { text: "Vacant", style: { bg: "var(--Rose-25, #FFF1F2)", color: "var(--Rose-700, #9F1239)" } };
  //   }
  //   if (registration.isResiding) {
  //     return { text: "Residing", style: { bg: "var(--Emerald-25, #F0FDF4)", color: "var(--Emerald-700, #166534)" } };
  //   }
  //   return { text: "Not-Residing", style: { bg: "#F3F4F6", color: "#4B5563" } };
  // };

 
  // Helper function to parse dates
  const parseDate = (dateValue) => {
    if (dateValue instanceof Date) {
      return dayjs(dateValue);
    }
    if (typeof dateValue === "object" && dateValue.seconds) {
      // Firestore Timestamp
      return dayjs(dateValue.toDate());
    }
    if (typeof dateValue === "string") {
      return dayjs(dateValue);
    }
    console.error("Unrecognized date format:", dateValue);
    return null;
  };

  const handleDeleteSelected = async () => {
    try {
      setIsLoading(true);
      
      // Get the selected registrations
      const selectedRegistrations = selectedRows.map(index => currentItems[index]);
      
      // Delete all selected registrations
      await Promise.all(
        selectedRegistrations.map(reg => 
          deleteDoc(doc(db, 'registrations', reg.id))
        )
      );
      
      // Update local state
      const remainingRegistrations = registrations.filter(
        reg => !selectedRegistrations.some(selected => selected.id === reg.id)
      );
      setRegistrations(remainingRegistrations);
      setFilteredRegistrations(remainingRegistrations);
      
      // Reset selected rows
      setSelectedRows([]);
      
      const message = selectedRegistrations.length > 1 
        ? 'Selected registrations deleted successfully'
        : 'Registration deleted successfully';
      toast.success(message);
    } catch (error) {
      console.error('Error deleting registrations:', error);
      toast.error('Failed to delete registrations');
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
    }
  };
  
  const handleDeleteClick = () => {
    const selectedCount = selectedRows.length;
    if (selectedCount === 0) return;
  
    setDeleteItemName(
      selectedCount === 1 
        ? currentItems[selectedRows[0]].fullFlatNumber
        : `${selectedCount} selected registrations`
    );
    setDeleteFunction(() => handleDeleteSelected);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (registration) => {
    // Extract owners and tenants data
    const owners = registration.owners || [];
    const tenants = registration.tenants || [];
    
    // Get primary or first owner/tenant
    const primaryOwner = owners.find(owner => owner.isPrimaryStatus) || owners[0];
    const primaryTenant = tenants.find(tenant => tenant.isPrimaryStatus) || tenants[0];
  
    navigate(`/FlatNoForm/${registration.fullFlatNumber}`, {
      state: {
        isEditing: true,
        registrationData: registration,
        wing: registration.wing,
        flatNumber: registration.flatNumber,
        fullFlatNumber: registration.fullFlatNumber,
        isVacant: !owners.length && !tenants.length, // Flat is vacant if no owners and tenants
        registrationId: registration.id,
        // Pass owners and tenants data
        owners: registration.owners || [],
        tenants: registration.tenants || [],
        // Pass documents if they exist
        documents: registration.documents || [],
        // Pass the primary owner and tenant data
        primaryOwner,
        primaryTenant
      }
    });
  };



  
  
  

  const CheckboxWithTick = ({ isSelected, onClick }) => (
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
      }}
    >
      {isSelected && (
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
      )}
    </div>
  );

  const dropdownButtonStyle = {
    display: "flex",
    padding: "8px 16px",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #D1D5DB",
    borderRadius: "10px",
    color: "#6B7280",
    fontSize: "16px",
    fontFamily: "Plus_Jakarta",
    cursor: "pointer",
    backgroundColor: "white",
    width: windowWidth > 768 ? "242px" : "100%",
    height: "50px",
  };

  const headerStyle = {
    display: "flex",
    flexDirection: windowWidth > 768 ? "row" : "column",
    alignItems: windowWidth > 768 ? "center" : "stretch",
    justifyContent: "space-between",
    padding: "24px",
    gap: "16px",
  };

  const buttonGroupStyle = {
    display: "flex",
    flexDirection: windowWidth > 768 ? "row" : "column",
    gap: "10px",
    width: windowWidth > 768 ? "auto" : "100%",
  };

  const dropdownStyle = {
    position: "absolute",
    top: "100%",
    left: 0,
    zIndex: 1000,
    marginTop: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "white",
    borderRadius: "8px",
    width: "100%",
    border: "1px solid #D1D5DB",
    color: "#6B7280",
  };
  const dropdownContentStyle = {
    position: "absolute",
    top: "100%",
    left: 0,
    zIndex: 1000,
    marginTop: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "white",
    borderRadius: "8px",
    width: "100%",
    border: "1px solid #D1D5DB",
    color: "#6B7280",
  };

  const dropdownItemStyle = {
    padding: "8px 16px",
    cursor: "pointer",
    hover: {
      backgroundColor: "#F3F4F6",
    },
    color: "var(--Gray-400, #6B7280)",
    fontSize: "14px",
    borderBottom: "1px solid var(--Gray-100, #E5E7EB)",
  };

  const leftSideSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
    >
      <path
        d="M6.19254 10.3078C6.25065 10.3659 6.29674 10.4348 6.3282 10.5107C6.35965 10.5865 6.37584 10.6679 6.37584 10.75C6.37584 10.8321 6.35965 10.9135 6.3282 10.9893C6.29674 11.0652 6.25065 11.1341 6.19254 11.1922L3.69254 13.6922C3.63449 13.7503 3.56556 13.7964 3.48969 13.8279C3.41381 13.8593 3.33248 13.8755 3.25035 13.8755C3.16821 13.8755 3.08688 13.8593 3.01101 13.8279C2.93514 13.7964 2.86621 13.7503 2.80816 13.6922L0.30816 11.1922C0.250091 11.1341 0.204028 11.0652 0.172602 10.9893C0.141175 10.9134 0.125 10.8321 0.125 10.75C0.125 10.6679 0.141175 10.5866 0.172602 10.5107C0.204028 10.4348 0.250091 10.3659 0.30816 10.3078C0.425435 10.1905 0.584495 10.1247 0.750347 10.1247C0.832469 10.1247 0.913787 10.1408 0.989658 10.1723C1.06553 10.2037 1.13447 10.2497 1.19253 10.3078L2.62535 11.7414V0.750003C2.62535 0.584243 2.6912 0.425272 2.80841 0.308062C2.92562 0.190852 3.08459 0.125003 3.25035 0.125003C3.41611 0.125003 3.57508 0.190852 3.69229 0.308062C3.8095 0.425272 3.87535 0.584243 3.87535 0.750003V11.7414L5.30816 10.3078C5.36621 10.2497 5.43514 10.2036 5.51101 10.1722C5.58688 10.1407 5.66821 10.1245 5.75035 10.1245C5.83248 10.1245 5.91381 10.1407 5.98969 10.1722C6.06556 10.2036 6.13449 10.2497 6.19254 10.3078ZM13.6925 2.80782L11.1925 0.307816C11.1345 0.249706 11.0656 0.203606 10.9897 0.172154C10.9138 0.140701 10.8325 0.124512 10.7503 0.124512C10.6682 0.124512 10.5869 0.140701 10.511 0.172154C10.4351 0.203606 10.3662 0.249706 10.3082 0.307816L7.80816 2.80782C7.69088 2.92509 7.625 3.08415 7.625 3.25C7.625 3.41586 7.69088 3.57492 7.80816 3.69219C7.92544 3.80947 8.0845 3.87535 8.25035 3.87535C8.4162 3.87535 8.57526 3.80947 8.69254 3.69219L10.1253 2.2586V13.25C10.1253 13.4158 10.1912 13.5747 10.3084 13.6919C10.4256 13.8092 10.5846 13.875 10.7503 13.875C10.9161 13.875 11.0751 13.8092 11.1923 13.6919C11.3095 13.5747 11.3753 13.4158 11.3753 13.25V2.2586L12.8082 3.69219C12.9254 3.80947 13.0845 3.87535 13.2503 3.87535C13.4162 3.87535 13.5753 3.80947 13.6925 3.69219C13.8098 3.57492 13.8757 3.41586 13.8757 3.25C13.8757 3.08415 13.8098 2.92509 13.6925 2.80782Z"
        fill="#6B7280"
      />
    </svg>
  );

  const dropdownSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M16.2345 7.06754L9.98453 13.3175C9.92648 13.3756 9.85755 13.4217 9.78168 13.4532C9.7058 13.4847 9.62447 13.5008 9.54234 13.5008C9.46021 13.5008 9.37888 13.4847 9.303 13.4532C9.22713 13.4217 9.1582 13.3756 9.10015 13.3175L2.85015 7.06754C2.73288 6.95026 2.66699 6.7912 2.66699 6.62535C2.66699 6.4595 2.73288 6.30044 2.85015 6.18316C2.96743 6.06588 3.12649 6 3.29234 6C3.45819 6 3.61725 6.06588 3.73453 6.18316L9.54234 11.9918L15.3502 6.18316C15.4082 6.12509 15.4772 6.07903 15.553 6.0476C15.6289 6.01617 15.7102 6 15.7923 6C15.8745 6 15.9558 6.01617 16.0317 6.0476C16.1075 6.07903 16.1765 6.12509 16.2345 6.18316C16.2926 6.24123 16.3387 6.31017 16.3701 6.38604C16.4015 6.46191 16.4177 6.54323 16.4177 6.62535C16.4177 6.70747 16.4015 6.78879 16.3701 6.86466C16.3387 6.94053 16.2926 7.00947 16.2345 7.06754Z"
        fill="#6B7280"
      />
    </svg>
  );

  // Custom scrollbar styles
  const customScrollbarStyle = `
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
  `;

  // Add new styles for responsiveness
  const responsiveStyles = `
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
  `;

  const hideScrollbarStyle = {
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  };

  const options = [
    "Sort Amenities",
    "Swimming pool",
    "Gym",
    "Multi-Purpose Court",
    "Jacuzzi & Spa",
    "Inoor Theatre",
    "Movie Lawn",
    "Table Tennis Room",
    "Banquet Hall",
  ];

  const truncateText = (text, charLimit = 20) => {
    if (!text) return 'N/A';
    if (text.length <= charLimit) {
      return text;
    }
    
    const lastSpace = text.lastIndexOf(' ', charLimit);
    
    if (lastSpace > 0) {
      return text.slice(0, lastSpace) + '...';
    }
    
    return text.slice(0, charLimit) + '...';
  };
  

  // const getPersonAndStatus = (registration) => {
  //   // Find primary owner
  //   const primaryOwner = registration.owners?.find(owner => owner.isPrimaryStatus) || null;
    
  //   // Fix: Changed primarytenant to primaryTenant
  //   const primaryTenant = registration.tenants?.find(tenant => tenant.isPrimaryStatus) || null;
    
  //   const residingOwner = registration.owners?.find(owner => owner.isResiding) || null;
  //   const residingTenant = registration.tenants?.find(tenant => tenant.isResiding) || null;
  
  //   let status = "Vacant";
  //   if (primaryOwner?.isResiding) {
  //     status = "Residing";
  //   } else if (residingOwner) {
  //     status = "Residing";
  //   } else if (primaryTenant?.isResiding) {  // Fix: Changed primarytenant to primaryTenant
  //     status = "Residing";
  //   } else if (residingTenant) {
  //     status = "Residing";
  //   }
  
  //   return {
  //     primaryOwner,
  //     primaryTenant,  // Fix: Changed primarytenant to primaryTenant
  //     status
  //   };
  // };
  const getPersonAndStatus = (registration) => {
    // Find primary owner or first owner
    const primaryOwner = registration.owners?.find(owner => owner.isPrimaryStatus) || 
                        registration.owners?.[0] || null;
    
    // Find primary tenant or first tenant
    const primaryTenant = registration.tenants?.find(tenant => tenant.isPrimaryStatus) || 
                         registration.tenants?.[0] || null;
    
    const residingOwner = registration.owners?.find(owner => owner.isResiding) || null;
    const residingTenant = registration.tenants?.find(tenant => tenant.isResiding) || null;
  
    let status = "Vacant";
    if (primaryOwner?.isResiding || residingOwner) {
      status = "Residing";
    } else if (primaryTenant?.isResiding || residingTenant) {
      status = "Residing";
    }
  
    return {
      primaryOwner,
      primaryTenant,
      status
    };
  };


  const getStatusText = (registration) => {
    const { status } = getPersonAndStatus(registration);
    
    switch (status) {
      case "Residing":
        return { 
          text: "Residing", 
          style: { 
            bg: "var(--Emerald-25, #F0FDF4)", 
            color: "var(--Emerald-700, #166534)" 
          } 
        };
      case "Vacant":
        return { 
          text: "Vacant", 
          style: { 
            bg: "var(--Rose-25, #FFF1F2)", 
            color: "var(--Rose-700, #9F1239)" 
          } 
        };
      default:
        return { 
          text: "Not-Residing", 
          style: { 
            bg: "#F3F4F6", 
            color: "#4B5563" 
          } 
        };
    }
  };



    return (
      <>
       <style>{customScrollbarStyle}</style>
       <style>{responsiveStyles}</style>
       <div className="mt-1 bg-white border rounded-lg overflow-hidden flex flex-col" style={{ position: 'relative', zIndex: 1, fontFamily: 'Plus_Jakarta' }}>
        <div className="sticky top-0 z-20 bg-white">
          <div style={headerStyle}>
            <div style={{ width: windowWidth > 768 ? 'auto' : '100%', marginBottom: windowWidth > 768 ? 0 : '16px' }}>
            <SearchInput 
  registrations={registrations} 
  onSearch={handleSearch} 
/>
            </div>
            
        </div>
      </div>
          
      <div className="flex-grow overflow-auto">
        <table className="w-full text-sm text-gray-500" style={{ minWidth: '1000px' }}>
          <thead className="text-xs text-gray-500 bg-gray-50 sticky top-0" style={{fontSize:'12px'}}>
            <tr className="border-y">
              <th scope="col" className="p-4" style={{width:'40px'}}>
                <div className="flex items-center justify-center">
                  <CheckboxWithTick
                    isSelected={isAllSelected}
                    onClick={handleSelectAll}
                  />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '130px'}}>Flat Number</th>
              <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px'}}>
                <div className="flex items-center">
                  Owner Name
                 
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px',cursor: "pointer",}}>
                <div className="flex items-center">
                  Status
                 
                </div>
              </th>                                            
              <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px'}}>Tenant Name</th>

              {/* <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '150px'}}>Amenities</th> */}

              <th scope="col" className="px-6 py-3 text-right" style={{minWidth: '120px'}}>
      {selectedRows.length > 0 && (
        <span 
          style={{
            cursor: 'pointer',
            color: '#EF4444'
          }}
          onClick={handleDeleteClick}
        >
          Delete {selectedRows.length > 1 ? 'All' : ''}
        </span>
      )}
    </th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrations.length > 0 ? (
                // console.log(filteredRegistrations);
                
              currentItems.map((booking, index) => {
                
                
                const actualIndex = indexOfFirstItem + index;
                const isSelected = selectedRows.includes(actualIndex);
                const firstName = booking.userDetails?.firstName || 'N/A';
                const lastName = booking.userDetails?.lastName || 'N/A';
                const fullName = `${firstName} ${lastName}`;
                // const status = getStatusText(booking);
                const { primaryOwner, primaryTenant, status } = getPersonAndStatus(booking);
                
                
                const statusDisplay = getStatusText(booking);

                  // Format owner name
                  const ownerName = primaryOwner 
                  ? `${primaryOwner.firstName || ''} ${primaryOwner.lastName || ''}`.trim() || '-'
                  : booking.owners && booking.owners.length > 0
                    ? `${booking.owners[0].firstName || ''} ${booking.owners[0].lastName || ''}`.trim() || '-'
                    : '-';

// Format tenant name
const tenantName = primaryTenant
  ? `${primaryTenant.firstName || ''} ${primaryTenant.lastName || ''}`.trim() || '-'
  : booking.tenants && booking.tenants.length > 0
    ? `${booking.tenants[0].firstName || ''} ${booking.tenants[0].lastName || ''}`.trim() || '-'
    : '-';


                 // Handle owner name display
//   const ownerName = booking.isVacant ? "-" : 
//   `${booking.firstName || '-'} ${booking.lastName || ''}`.trim();

// // Handle tenant name display
// const tenantName = booking.TenantfirstName || booking.TenantlastName ? 
//   `${booking.TenantfirstName || ''} ${booking.TenantlastName || ''}`.trim() : 
//   '-';
                return (
                  <tr key={booking.id} className="bg-white border-b hover:bg-gray-50" style={{fontSize:'14px'}}>
                    <td className="p-4" style={{width:'40px'}}>
                      <div className="flex items-center justify-center">
                        <CheckboxWithTick
                          isSelected={isSelected}
                          onClick={() => handleRowSelect(actualIndex)}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900" style={{minWidth: '130px'}}>
                      {/* {fullName} */}
                      {booking.fullFlatNumber}
                      {/* {truncateText(`${booking.userDetails.firstName} ${booking.userDetails.lastName}`, 20)} */}

                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" style={{minWidth: '120px'}}>
                      {/* {truncateText(`${booking.firstName || '-'} ${booking.lastName}`, 20 || '-')} */}
                      {/* {truncateText(`${{ownerName}} `, 20 || '-')} */}
                      {ownerName}

                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" style={{minWidth: '120px'}}>
                    {/* <span
          className="inline-flex px-4 py-2 items-center font-semibold text-xs leading-4 rounded-xl"
          style={{ backgroundColor: status.style.bg, color: status.style.color, fontSize: '12px', borderRadius: '13px' }}
        >
          {status.text}
        </span> */}
        {statusDisplay.text}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" style={{minWidth: '120px'}}>
                      {/* {booking.} */}
                      {/* {truncateText(`${booking.TenantfirstName || '-'} ${booking.TenantlastName}`, 20 || '-')} */}
                      {tenantName}

                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap" style={{minWidth: '150px'}}>
                      <span
                        className="inline-flex px-4 py-2 items-center font-semibold text-xs leading-4 rounded-xl"
                        // style={{ ...getAmenityStyle(booking.amenityName), fontSize: '12px', borderRadius: '13px' }}
                      >
                        {booking.amenityName}
                      </span>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-right" style={{minWidth: '120px'}}>
                      <div className="flex justify-end space-x-4">
                        <button onClick={() => handleEditClick(booking)}>
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
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500" style={{ height: '300px' }}>
                  <div className="flex flex-col items-center justify-center h-full">
                    <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="text-lg font-semibold">No Flats found</p>
                    <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="sticky bottom-0 bg-white flex justify-between items-center px-6 py-3 border-t z-20">
        <div
          className="text-sm text-gray-700"
          style={{
            color: "var(--Gray-700, #1F2937)",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
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

    <EditingBookingModal 
  isOpen={isEditModalOpen} 
  onClose={handleCloseModal} 
  registration={editingRegistration}
//   onSave={handleSaveEdit} 
/>

    <DeleteModal
      isOpen={isDeleteModalOpen}
      onClose={() => setIsDeleteModalOpen(false)}
      onDelete={deleteFunction}
      itemName={deleteItemName}
    />
  </>
  );
};

export default FlatTable;
               