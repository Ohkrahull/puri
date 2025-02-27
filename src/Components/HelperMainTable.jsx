import React, { useState, useEffect, useRef } from 'react';
import { collection, query, onSnapshot, getFirestore, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import DeleteModal from '../Modals/DeleteModal';
import SortButton from '../Buttons/Sortdate';
import StatusBadge from './StatusBadge';
import { useImageViewer } from '../context/ImageViewerContext';

// // Confirmation Dialog Component
// const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
//     if (!isOpen) return null;
  
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
//           <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
//           <p className="text-gray-600 mb-6">{message}</p>
          
//           <div className="flex justify-end gap-3">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={onConfirm}
//               className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
//             >
//               Confirm
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

// SVG icon component for sort direction
const SortIcon = ({ direction = 'asc' }) => (
  <svg 
    className="ml-2" 
    xmlns="http://www.w3.org/2000/svg" 
    width="17" 
    height="16" 
    viewBox="0 0 17 16" 
    fill="none"
    style={{ transform: direction === 'desc' ? 'rotate(180deg)' : 'none' }}
  >
    <path 
      d="M8.66699 3.66667V12M8.66699 12L4.66699 8M8.66699 12L12.667 8" 
      stroke="#4B5563" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// Custom checkbox component
const CheckboxWithTick = ({ isSelected, onClick, isMinusIcon = false }) => (
  <div
    onClick={onClick}
    className="w-5 h-5 border border-gray-400 rounded-md flex items-center justify-center cursor-pointer checkbox-container"
    style={{ backgroundColor: isSelected ? '#F3F4F6' : 'white' }}
  >
    {isSelected && (
      isMinusIcon ? (
        <svg width="12" height="2" viewBox="0 0 12 2" fill="none">
          <path d="M1 1H11" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M10 3L4.5 8.5L2 6" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    )}
  </div>
);

// Search input component
const SearchInput = ({ helpers = [], onSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
  
    const handleInputChange = (e) => {
      const value = e.target.value;
      setSearchTerm(value);
      setShowDropdown(value.length > 0);
      onSearch(value);
    };
  
    const handleItemClick = (helper) => {
      setSearchTerm(`${helper.firstName || ''} ${helper.lastName || ''}`);
      setShowDropdown(false);
      onSearch(`${helper.firstName || ''} ${helper.lastName || ''}`);
    };
  
    const filteredHelpers = helpers.filter(
      (helper) =>
        `${helper.firstName || ''} ${helper.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (helper.visitorPhoneNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (helper.ticketId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (helper.services?.[0]?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const truncateText = (text, charLimit = 20) => {
      if (!text) return 'N/A';
      if (text.length <= charLimit) return text;
      const lastSpace = text.lastIndexOf(' ', charLimit);
      return lastSpace > 0 ? text.slice(0, lastSpace) + '...' : text.slice(0, charLimit) + '...';
    };
  
    return (
      <div className="relative">
        <div
          style={{
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
            backgroundColor: '#F3F3F3',
          }}
        >
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
  
        {showDropdown && filteredHelpers.length > 0 && (
          <div 
            className="absolute w-full mt-3 bg-white border border-gray-200 rounded-md shadow-lg z-10"
            style={{
              maxHeight: filteredHelpers.length > 4 ? '240px' : 'auto',
              overflowY: filteredHelpers.length > 4 ? 'auto' : 'visible'
            }}
          >
            {filteredHelpers.map((helper, index) => (
              <div
                key={index}
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                style={{borderBottom: '1px solid var(--Gray-100, #E5E7EB)'}}
                onClick={() => handleItemClick(helper)}
              >
                <div className="font-medium flex justify-between" style={{fontSize:'14px', color:'#6B7280'}}>
                  {truncateText(`${helper.firstName || ''} ${helper.lastName || ''}`)}
                  <span>{helper.ticketId || 'No Entry Code'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

const FlatNumberDisplay = ({ flatNumbers }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    if (!flatNumbers || flatNumbers.length === 0) return <span>N/A</span>;
    if (flatNumbers.length === 1) return <span>{flatNumbers[0]}</span>;
  
    const handleClick = (e) => {
      e.stopPropagation(); // Stop event from bubbling up to the row
      setIsOpen(!isOpen);
    };
  
    const handleDropdownClick = (e) => {
      e.stopPropagation(); // Prevent row click when clicking dropdown items
    };
  
    return (
      <div className="relative">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={handleClick}
        >
          <span>{flatNumbers.length} Flats</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={`transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
        
        {isOpen && (
          <div 
            className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1"
            onClick={handleDropdownClick}
          >
            {flatNumbers.map((flat, index) => (
              <div key={index} className="px-4 py-2 hover:bg-gray-50">
                {flat}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

const HelperTable = () => {
  const [helpers, setHelpers] = useState([]);
  const [filteredHelpers, setFilteredHelpers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [dateSortDirection, setDateSortDirection] = useState('asc');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemName, setDeleteItemName] = useState('');
  const [deleteFunction, setDeleteFunction] = useState(null);
  const { openImageViewer } = useImageViewer();

  const navigate = useNavigate();
  const db = getFirestore(getApp());
  const sortDateRef = useRef(null);
  const itemsPerPage = 10;

  

  // Initial data fetch
  useEffect(() => {
    const helpersQuery = query(collection(db, 'helpers'), orderBy('createdAt', 'asc'));
    
    const unsubscribe = onSnapshot(helpersQuery, (snapshot) => {
      const helpersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHelpers(helpersData);
      filterHelpers(helpersData);
    });

    return () => unsubscribe();
  }, []);

  const filterHelpers = (data) => {
    let filtered = data;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(helper => {
        const fullName = `${helper.firstName || ''} ${helper.lastName || ''}`.toLowerCase();
        const phoneNumber = helper.visitorPhoneNumber?.toLowerCase() || '';
        const ticketId = helper.ticketId?.toLowerCase() || '';
        const service = helper.services?.[0]?.name?.toLowerCase() || '';
        
        return fullName.includes(searchLower) ||
               phoneNumber.includes(searchLower) ||
               ticketId.includes(searchLower) ||
               service.includes(searchLower);
      });
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = a.createdAt?.toDate().getTime() || 0;
      const dateB = b.createdAt?.toDate().getTime() || 0;
      return dateSortDirection === 'desc' ? dateA - dateB : dateB - dateA;
    });

    setFilteredHelpers(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    filterHelpers(helpers);
  }, [searchTerm, dateSortDirection]);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleDateSort = () => {
    setDateSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleRowClick = (id) => {
    navigate(`/Helperprofile/${id}`);
  };

  const handleRowSelect = (index) => {
    setSelectedRows(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      return [...prev, index];
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
    setDeleteItemName(`${selectedRows.length} selected helpers`);
    setDeleteFunction(() => async () => {
      try {
        const helperIds = selectedRows.map(index => {
          const relativeIndex = index - indexOfFirstItem;
          return currentItems[relativeIndex].id;
        });
        
        for (const id of helperIds) {
          await deleteDoc(doc(db, "helpers", id));
        }
        
        setSelectedRows([]);
        toast.success("Selected helpers deleted successfully");
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error("Error deleting helpers:", error);
        toast.error("Failed to delete selected helpers");
      }
    });
    setIsDeleteModalOpen(true);
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHelpers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHelpers.length / itemsPerPage);
  const isAllSelected = currentItems.length > 0 && selectedRows.length === currentItems.length;

  return (
    <div className="mt-1 bg-white border rounded-lg overflow-hidden flex flex-col" style={{ fontFamily: 'Plus_Jakarta' }}>
      <div className="sticky top-0 z-20 bg-white">
        <div className="flex flex-col sm:flex-row items-stretch p-6 gap-4 justify-between">
        <SearchInput 
    helpers={helpers} 
    onSearch={handleSearch} 
  />
          {/* <div className="w-full sm:w-auto">
            <SortButton onSort={() => {}} ref={sortDateRef} />
          </div> */}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200" style={{fontSize:'12px'}}>
          <thead className="text-xs text-gray-500 bg-gray-50 sticky top-0" style={{fontSize:'12px'}}>
            <tr>
              <th className="p-4 w-4">
                <CheckboxWithTick
                  isSelected={isAllSelected}
                  onClick={handleSelectAll}
                  isMinusIcon={selectedRows.length > 0 && selectedRows.length < currentItems.length}
                />
              </th>
              {selectedRows.length > 0 ? (
                <>
                  <th className="px-6 py-3 text-left">
                    <div className="flex text-gray-600 gap-2">
                      <span className="font-semibold" style={{color:'#4B5563', fontSize:12}}>{selectedRows.length}</span>
                      <span className="font-semibold" style={{color:'#4B5563', fontSize:12}}>selected</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right" colSpan={6}>
                    <span 
                    style={{fontSize:'12px'}}
                      onClick={handleDeleteSelected}
                      className="text-red-600 cursor-pointer hover:text-red-700 text-xs"
                    >
                      Delete
                    </span>
                  </th>
                </>
              ) : (
                <>
                  <th className="px-6 py-3 text-left text-xs text-gray-500  font-bold" style={{color:'#4B5563', fontSize:12,}}>Name</th>
                  <th className="px-6 py-3 text-left text-xs  text-gray-500  font-bold" style={{color:'#4B5563', fontSize:12}}>
                    Entry Code
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs  text-gray-500 font-bold  cursor-pointer"
                    onClick={handleDateSort}
                    style={{color:'#4B5563', fontSize:12}}
                  >
                    <div className="flex items-center">
                      Date
                      <SortIcon direction={dateSortDirection} />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs  font-bold text-gray-500 " style={{color:'#4B5563', fontSize:12}}>
                    Flat Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 " style={{color:'#4B5563', fontSize:12}}>
                    Phone Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 " style={{color:'#4B5563', fontSize:12}}>
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 " style={{color:'#4B5563', fontSize:12}}>
                    Status
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((helper, index) => {
              const actualIndex = indexOfFirstItem + index;
              const isSelected = selectedRows.includes(actualIndex);

              return (
                <tr 
                  key={helper.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  style={{fontSize:'14px'}}
                  onClick={(e) => handleRowClick(helper.id)}
                >
                  <td className="p-4 w-4">
                    <div className="flex items-center justify-center">
                      <CheckboxWithTick
                        isSelected={isSelected}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowSelect(actualIndex);
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                      <div className="relative group">
                <img 
                  src={helper.imageUrl} 
                  alt={`${helper.firstName || ''} ${helper.lastName || ''}`}
                  className="w-10 h-10 rounded-full object-cover cursor-zoom-in transition-all duration-200 group-hover:ring-2 group-hover:ring-blue-500"
                  // onClick={() => openImageViewer(
                  //   helper.imageUrl,
                  //   `${helper.firstName || ''} ${helper.lastName || ''}`
                  // )}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openImageViewer(
                      helper.imageUrl,
                      `${helper.firstName || ''} ${helper.lastName || ''}`
                    );
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/Images/profile.png';
                  }}
                />
                <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                  Click to view
                </div>
              </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900" style={{fontSize:'14px'}}>
                          {`${helper.firstName || ''} ${helper.lastName || ''}`}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" style={{fontSize:'14px'}}>
                    {helper.ticketId || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" style={{fontSize:'14px'}}>
                    {helper.createdAt ? dayjs(helper.createdAt.toDate()).format('D MMM, YYYY') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" style={{fontSize:'14px'}}>
                    {/* {helper.flatNumbers?.map((flat, index) => (
                      <span key={index}>
                        {flat}
                        {index < helper.flatNumbers.length - 1 ? ', ' : ''}
                      </span>
                    )) || 'N/A'} */}
                    <FlatNumberDisplay flatNumbers={helper.flatNumbers || "N/A"} style={{fontSize:'14px'}} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" style={{fontSize:'14px'}}>
                    {helper.visitorPhoneNumber || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" style={{fontSize:'14px'}}>
                    {helper.services?.[0]?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* <StatusBadge status={helper.status || 'N/A'} /> */}
                    <StatusBadge 
    status={helper.status || 'N/A'} 
    helper={helper}
  />
                  </td>
                </tr>
              );
            })}
            {filteredHelpers.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500" style={{ height: '300px' }}>
                  <div className="flex flex-col items-center justify-center h-full">
                    <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p className="text-lg font-semibold">No helpers found</p>
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
          Page {currentPage} of {totalPages || 1}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 border rounded ${
              currentPage === 1 ? "bg-gray-100 text-gray-400" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            style={{ fontSize: "14px", border: "1px solid #D1D5DB" }}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border rounded ${
              currentPage === totalPages ? "bg-gray-100 text-gray-400" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            style={{ fontSize: "14px", border: "1px solid #D1D5DB" }}
          >
            Next
          </button>
        </div>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={deleteFunction}
        itemName={deleteItemName}
      />
    </div>
  );
};

export default HelperTable;