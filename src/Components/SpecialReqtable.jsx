import React, { useEffect, useRef, useState } from 'react';
import { deleteSpecialRequest, fetchAllSpecialRequests } from '../firebase/services/SpecialRequests';
import { getAllAuthorizedUsers } from '../firebase/services/UserData';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrBefore';
import { useNavigate } from 'react-router-dom';
import SortButton from '../Buttons/Sortdate';
import { toast } from 'react-toastify';
import DeleteModal from '../Modals/DeleteModal';

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);

// Enhanced CheckboxWithTick component with minus icon support
const CheckboxWithTick = ({ isSelected, onClick, isMinusIcon = false }) => (
  <div
    onClick={onClick}
    className="w-5 h-5 border border-gray-400 rounded-md flex items-center justify-center cursor-pointer"
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

const SearchInput = ({ requests, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length > 0);
    onSearch(value);
  };

  const handleItemClick = (request) => {
    setSearchTerm(`${request.userInfo?.firstName || ''} ${request.userInfo?.lastName || ''}`);
    setShowDropdown(false);
    onSearch(`${request.userInfo?.firstName || ''} ${request.userInfo?.lastName || ''}`);
  };

  const filteredRequests = requests.filter(
    (request) =>
      `${request.userInfo?.firstName || ''} ${request.userInfo?.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.requestType || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const truncateText = (text, charLimit = 20) => {
    if (text.length <= charLimit) {
      return text;
    }
    
    // Find the last space within the character limit
    const lastSpace = text.lastIndexOf(' ', charLimit);
    
    // If there's a space within the limit, cut at that space
    if (lastSpace > 0) {
      return text.slice(0, lastSpace) + '...';
    }
    
    // If there's no space (it's one long word), just cut at the character limit
    return text.slice(0, charLimit) + '...';
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
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M17.9419 17.0579L14.0302 13.1469C15.1639 11.7858 15.7293 10.0399 15.6086 8.2725C15.488 6.50512 14.6906 4.85229 13.3823 3.65785C12.074 2.46341 10.3557 1.81932 8.58462 1.85957C6.81357 1.89982 5.12622 2.62131 3.87358 3.87395C2.62094 5.12659 1.89945 6.81394 1.8592 8.58498C1.81895 10.356 2.46304 12.0744 3.65748 13.3827C4.85192 14.6909 6.50475 15.4883 8.27214 15.609C10.0395 15.7297 11.7854 15.1643 13.1466 14.0305L17.0575 17.9422C17.1156 18.0003 17.1845 18.0464 17.2604 18.0778C17.3363 18.1092 17.4176 18.1254 17.4997 18.1254C17.5818 18.1254 17.6631 18.1092 17.739 18.0778C17.8149 18.0464 17.8838 18.0003 17.9419 17.9422C17.9999 17.8842 18.046 17.8152 18.0774 17.7394C18.1089 17.6635 18.125 17.5822 18.125 17.5001C18.125 17.4179 18.1089 17.3366 18.0774 17.2607C18.046 17.1849 17.9999 17.1159 17.9419 17.0579ZM3.12469 8.75006C3.12469 7.63754 3.45459 6.55 4.07267 5.62497C4.69076 4.69995 5.56926 3.97898 6.5971 3.55323C7.62493 3.12749 8.75593 3.0161 9.84707 3.23314C10.9382 3.45018 11.9405 3.98591 12.7272 4.77258C13.5138 5.55925 14.0496 6.56153 14.2666 7.65267C14.4837 8.74382 14.3723 9.87482 13.9465 10.9027C13.5208 11.9305 12.7998 12.809 11.8748 13.4271C10.9497 14.0452 9.86221 14.3751 8.74969 14.3751C7.25836 14.3734 5.82858 13.7802 4.77404 12.7257C3.71951 11.6712 3.12634 10.2414 3.12469 8.75006Z" fill="#6B7280"/>
        </svg>
      </div>

      {showDropdown && filteredRequests.length > 0 && (
        <div className="absolute w-full mt-3 bg-white border border-gray-200 rounded-md shadow-lg z-10"
        style={{
          maxHeight: filteredRequests.length > 4 ? '240px' : 'auto',
          overflowY: filteredRequests.length > 4 ? 'auto' : 'visible'
        }}>
          {filteredRequests.map((request, index) => (
            <div
              key={index}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
              style={{borderBottom: '1px solid var(--Gray-100, #E5E7EB)'}}
              onClick={() => handleItemClick(request)}
            >
              <div className="font-medium flex justify-between" style={{fontSize:'14px', color:'#6B7280'}}>
                {/* {`${request.userInfo?.firstName || ''} ${request.userInfo?.lastName || ''}`} */}
                {truncateText(`${request.userInfo?.firstName || ''} ${request.userInfo?.lastName || ''}`, 20)}

                <span>{`${request.userInfo?.wing || ''} - ${request.userInfo?.flatNumber || ''}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SpecialReqTable = () => {
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemName, setDeleteItemName] = useState('');
  const [deleteFunction, setDeleteFunction] = useState(null);
  const sortDateRef = useRef(null);
  const [dateSortDirection, setDateSortDirection] = useState('desc');
  
  const itemsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const fetchedRequests = await fetchAllSpecialRequests();
        const authorizedUsers = await getAllAuthorizedUsers();
        
        const requestsWithUserInfo = fetchedRequests.map(request => {
          const authorizedUser = authorizedUsers.find(user => user.phoneNumber === request.phoneNumber);
          return {
            ...request,
            userInfo: authorizedUser || null
          };
        });
        
        // Sort the requests by timestamp
        const sortedRequests = requestsWithUserInfo.sort((a, b) => {
          const dateA = a.timestamp?.toDate();
          const dateB = b.timestamp?.toDate();
          return dateSortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        });
        
        setRequests(sortedRequests);
        setFilteredRequests(sortedRequests);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading special requests:', error);
        setError("Failed to load special requests. Please try again later.");
        setIsLoading(false);
      }
    };
    loadRequests();
  }, [dateSortDirection]);

  const hideScrollbarStyle = {
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  };

  const handleDateSort = () => {
    setDateSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleViewRequest = (request) => {
    navigate(`/special_requestNext/${request.id}`, { state: { requestData: request } });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = requests.filter((request) =>
      `${request.userInfo?.firstName || ''} ${request.userInfo?.lastName || ''}`.toLowerCase().includes(term.toLowerCase()) ||
      (request.requestType || '').toLowerCase().includes(term.toLowerCase())
    );
    setFilteredRequests(filtered);
    setCurrentPage(1);
  };

  const handleSort = (startDate, endDate) => {
    let filtered = requests;
    if (startDate || endDate) {
      filtered = requests.filter(request => {
        const requestDate = dayjs(request.timestamp?.toDate());
        if (startDate && endDate) {
          return requestDate.isAfter(dayjs(startDate)) && requestDate.isBefore(dayjs(endDate).add(1, 'day'));
        } else if (startDate) {
          return requestDate.isAfter(dayjs(startDate));
        } else if (endDate) {
          return requestDate.isBefore(dayjs(endDate).add(1, 'day'));
        }
        return true;
      });
    }
    
    filtered.sort((a, b) => dayjs(b.timestamp?.toDate()).valueOf() - dayjs(a.timestamp?.toDate()).valueOf());
    
    setFilteredRequests(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil((filteredRequests?.length || 0) / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests?.slice(indexOfFirstItem, indexOfLastItem) || [];

  const CheckboxWithTick = ({ isSelected, onClick, isMinusIcon = false }) => (
    <div
      onClick={onClick}
      className="w-5 h-5 border border-gray-400 rounded-md flex items-center justify-center cursor-pointer"
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

  const handleRowSelect = (index) => {
    setSelectedRows(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // if (searchRef.current && !searchRef.current.contains(event.target)) {
      //   setIsSearchDropdownOpen(false);
      // }
      // if (amenityRef.current && !amenityRef.current.contains(event.target)) {
      //   setIsAmenityDropdownOpen(false);
      // }
      if (sortDateRef.current && !sortDateRef.current.contains(event.target)) {
        // Assuming SortButton has a method to close its dropdown
        sortDateRef.current.closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const truncateText = (text, charLimit = 20) => {
    if (text.length <= charLimit) {
      return text;
    }
    
    // Find the last space within the character limit
    const lastSpace = text.lastIndexOf(' ', charLimit);
    
    // If there's a space within the limit, cut at that space
    if (lastSpace > 0) {
      return text.slice(0, lastSpace) + '...';
    }
    
    // If there's no space (it's one long word), just cut at the character limit
    return text.slice(0, charLimit) + '...';
  };

  const handleDeleteClick = (requestId, requestName) => {
    setDeleteItemName(requestName || `Request ${requestId}`);
    setDeleteFunction(() => async () => {
      try {
        await deleteSpecialRequest(requestId);
        const updatedRequests = requests.filter(req => req.id !== requestId);
        setRequests(updatedRequests);
        setFilteredRequests(updatedRequests);
        toast.success('Request deleted successfully');
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error('Error deleting special request:', error);
        toast.error('Failed to delete request');
      }
    });
    setIsDeleteModalOpen(true);
  };

  const handleSelectAll = () => {
    if (selectedRows.length === currentItems.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentItems.map((_, index) => indexOfFirstItem + index));
    }
  };

  const isAllSelected = currentItems.length > 0 && selectedRows.length === currentItems.length;

  const handleDeleteSelected = () => {
    setDeleteItemName('all selected requests');
    setDeleteFunction(() => async () => {
      try {
        const deletePromises = selectedRows.map(index => {
          const requestId = filteredRequests[index].id;
          return deleteSpecialRequest(requestId);
        });
        await Promise.all(deletePromises);
        const updatedRequests = requests.filter(req => !selectedRows.includes(filteredRequests.findIndex(r => r.id === req.id)));
        setRequests(updatedRequests);
        setFilteredRequests(updatedRequests);
        setSelectedRows([]);
        toast.success('Selected requests deleted successfully');
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error('Error deleting selected requests:', error);
        toast.error('Failed to delete selected requests');
      }
    });
    setIsDeleteModalOpen(true);
  };


  const renderTableContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan="6" className="px-6 mt-8 py-4 text-center">
            <div className="animate-pulse flex justify-center items-center mt-[100px]">
              <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
              <div className="h-4 w-4 bg-gray-200 rounded-full mx-2"></div>
              <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
            </div>
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan="6" className="px-6 py-4 text-center text-red-500">
            {error}
          </td>
        </tr>
      );
    }

    if (currentItems.length === 0) {
      return (
        <tr>
          <td colSpan="6" className="px-6 py-4 text-center text-gray-500" style={{ height: '300px' }}>
            <div className="flex flex-col items-center justify-center h-full">
              <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-lg font-semibold">No requests found</p>
              <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
            </div>
          </td>
        </tr>
      );
    }

    return currentItems.map((request, index) => {
      const actualIndex = indexOfFirstItem + index;
      const isSelected = selectedRows.includes(actualIndex);
      return (
        <tr key={request.id}
        
        
        className="bg-white border-b hover:bg-gray-50  cursor-pointer" 
       
         
           style={{fontSize:'14px'}}
        
        >
          <td className="p-4" style={{width:'40px'}}>
            <div className="flex items-center justify-center">
              <CheckboxWithTick
                isSelected={isSelected}
                onClick={() => handleRowSelect(actualIndex)}
              />
            </div>
          </td>
          <td  onClick={(e) => {
          // Prevent navigation when clicking checkbox
          if (e.target.closest('.checkbox-container')) return;
          handleViewRequest(request);
        }}
         className="px-6 py-4 whitespace-nowrap font-medium text-gray-900" style={{minWidth: '120px'}}>
            {/* {`${request.userInfo?.firstName || ''} ${request.userInfo?.lastName || ''}`} */}
            {truncateText(`${request.userInfo?.firstName || 'N/A'} ${request.userInfo?.lastName || 'N/A'}`, 20)}

          </td>
          <td
           onClick={(e) => {
            // Prevent navigation when clicking checkbox
            if (e.target.closest('.checkbox-container')) return;
            handleViewRequest(request);
          }}
          
          className="px-6 py-4 whitespace-nowrap font-medium text-gray-900" style={{minWidth: '120px'}}>
            {/* {`${request.userInfo?.firstName || ''} ${request.userInfo?.lastName || ''}`} */}
            {truncateText(`${request.userInfo?.wing || 'N/A'} - ${request.userInfo?.flatNumber || 'N/A'}`, 20)}

          </td>
          <td
           onClick={(e) => {
            // Prevent navigation when clicking checkbox
            if (e.target.closest('.checkbox-container')) return;
            handleViewRequest(request);
          }}
          className="px-6 py-4 whitespace-nowrap" style={{minWidth: '120px'}}>
            {dayjs(request.timestamp?.toDate()).format('h:mm A')}
          </td>
          <td
          
          onClick={(e) => {
            // Prevent navigation when clicking checkbox
            if (e.target.closest('.checkbox-container')) return;
            handleViewRequest(request);
          }}
          className="px-6 py-4 whitespace-nowrap" style={{minWidth: '120px'}}>
            {dayjs(request.timestamp?.toDate()).format('MMM D, YYYY')}
          </td>
          <td></td>
          {/* <td className="px-6 py-4 whitespace-nowrap" style={{minWidth: '150px'}}>
            <button 
              onClick={() => handleViewRequest(request)}
              className="text-blue-600 hover:underline"
            >
              View
            </button>
          </td> */}
          {/* <td className="px-6 py-4 whitespace-nowrap text-right" style={{minWidth: '120px'}}>
            <button onClick={() => handleDeleteClick(request.id, `${request.userInfo?.firstName || ''} ${request.userInfo?.lastName || ''}`)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.875 3.75H3.125C2.95924 3.75 2.80027 3.81585 2.68306 3.93306C2.56585 4.05027 2.5 4.20924 2.5 4.375C2.5 4.54076 2.56585 4.69973 2.68306 4.81694C2.80027 4.93415 2.95924 5 3.125 5H3.75V16.25C3.75 16.5815 3.8817 16.8995 4.11612 17.1339C4.35054 17.3683 4.66848 17.5 5 17.5H15C15.3315 17.5 15.6495 17.3683 15.8839 17.1339C16.1183 16.8995 16.25 16.5815 16.25 16.25V5H16.875C17.0408 5 17.1997 4.93415 17.3169 4.81694C17.4342 4.69973 17.5 4.54076 17.5 4.375C17.5 4.20924 17.4342 4.05027 17.3169 3.93306C17.1997 3.81585 17.0408 3.75 16.875 3.75ZM15 16.25H5V5H15V16.25ZM6.25 1.875C6.25 1.70924 6.31585 1.55027 6.43306 1.43306C6.55027 1.31585 6.70924 1.25 6.875 1.25H13.125C13.2908 1.25 13.4497 1.31585 13.5669 1.43306C13.6842 1.55027 13.75 1.70924 13.75 1.875C13.75 2.04076 13.6842 2.19973 13.5669 2.31694C13.4497 2.43415 13.2908 2.5 13.125 2.5H6.875C6.70924 2.5 6.55027 2.43415 6.43306 2.31694C6.31585 2.19973 6.25 2.04076 6.25 1.875Z" fill="#EF4444"/>
              </svg>
            </button>
          </td> */}
        </tr>
      );
    });
  };

  // return (
    return (
      <div className="mt-1 bg-white border rounded-lg overflow-hidden flex flex-col h-full">
        <div className="sticky top-0 z-20 bg-white">
          <div className="flex flex-col sm:flex-row justify-between items-center p-6">
            <div className="w-full sm:w-auto mb-4 sm:mb-0">
              <SearchInput requests={requests} onSearch={handleSearch} />
            </div>
            <div className="w-full sm:w-auto">
              <SortButton onSort={handleSort} ref={sortDateRef} />
              {/* <button
              className="flex  justify-end text-center"
              style={{
                display: 'flex',
                padding: '12px 16px',
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
            </button> */}
            </div>
          </div>
        </div>
        
        <div className="flex-grow overflow-auto">
          <table className="w-full text-sm text-gray-500" style={{ minWidth: '1000px' }}>
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
                  <th scope="col" className="px-6 py-3">
                    <div className="flex text-gray-600 gap-2">
                      <span className="font-semibold" style={{color:'#4B5563', fontSize:12}}>{selectedRows.length}</span>
                      <span className="font-semibold" style={{color:'#4B5563', fontSize:12}}>selected</span>
                    </div>
                  </th>
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
                  <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px'}}>Name</th>
                  <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px'}}>Flat Number</th>
                  <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px'}}>
                    <div className="flex items-center cursor-pointer" onClick={handleDateSort}>
                      Time
                      <svg 
                        className="ml-2" 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="17" 
                        height="16" 
                        viewBox="0 0 17 16" 
                        fill="none"
                        style={{
                          transform: dateSortDirection === 'desc' ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.3s ease'
                        }}
                      >
                        <path d="M8.66699 3.66667V12M8.66699 12L4.66699 8M8.66699 12L12.667 8" stroke="#4B5563" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px'}}>
                    <div className="flex items-center cursor-pointer" onClick={handleDateSort}>
                      Date
                      <svg 
                        className="ml-2" 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="17" 
                        height="16" 
                        viewBox="0 0 17 16" 
                        fill="none"
                        style={{
                          transform: dateSortDirection === 'desc' ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.3s ease'
                        }}
                      >
                        <path d="M8.66699 3.66667V12M8.66699 12L4.66699 8M8.66699 12L12.667 8" stroke="#4B5563" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right" style={{minWidth: '120px'}}></th>
                </>
              )}
            </tr>
          </thead>
            <tbody>
              {renderTableContent()}
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
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
  
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={deleteFunction}
          itemName={deleteItemName}
        />
      </div>
    );
  };

export default SpecialReqTable;