
import React, { useState, useEffect, useRef } from 'react';
import { collection, query, onSnapshot, getFirestore, orderBy, where } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import dayjs from 'dayjs';
import SortButton from '../Buttons/Sortdate';
import DeleteModal from '../Modals/DeleteModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDocs, deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';

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
    const fullName = `${request.firstName || ''} ${request.lastName || ''}`.trim();
    setSearchTerm(fullName || request.ticketId || 'N/A');
    setShowDropdown(false);
    onSearch(request);
  };

  const filteredRequests = requests.filter((request) => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${request.firstName || ''} ${request.lastName || ''}`.trim().toLowerCase();
    const matchesSearch = 
      fullName.includes(searchLower) ||
      (request.ticketId || '').toLowerCase().includes(searchLower) ||
      request.phoneNumber?.toLowerCase().includes(searchLower);
    return matchesSearch;
  });

  return (
    <div className="relative w-full sm:w-[250px] md:w-[300px]" style={{ fontFamily: 'Plus_Jakarta' }}>
      <div className="flex items-center justify-between p-2 sm:py-2 border border-[#D1D5DB] rounded-[10px] text-[#6B7280] text-sm sm:text-base" style={{ backgroundColor:'#F3F3F3', fontFamily: 'Plus_Jakarta' }}>
        <input
          type="text"
          placeholder="Search by Name, Ticket ID or Phone"
          value={searchTerm}
          onChange={handleInputChange}
          className="w-full bg-transparent border-none outline-none shadow-none text-inherit font-inherit text-sm sm:text-base"
          style={{ border: "none", outline: "none", boxShadow: "none", fontSize: "16px" }}
        />
        {/* <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6 mr-2" viewBox="0 0 20 20" fill="none">
          <path d="M17.9419 17.0579L14.0302 13.1469C15.1639 11.7858 15.7293 10.0399 15.6086 8.2725C15.488 6.50512 14.6906 4.85229 13.3823 3.65785C12.074 2.46341 10.3557 1.81932 8.58462 1.85957C6.81357 1.89982 5.12622 2.62131 3.87358 3.87395C2.62094 5.12659 1.89945 6.81394 1.8592 8.58498C1.81895 10.356 2.46304 12.0744 3.65748 13.3827C4.85192 14.6909 6.50475 15.4883 8.27214 15.609C10.0395 15.7297 11.7854 15.1643 13.1466 14.0305L17.0575 17.9422C17.1156 18.0003 17.1845 18.0464 17.2604 18.0778C17.3363 18.1092 17.4176 18.1254 17.4997 18.1254C17.5818 18.1254 17.6631 18.1092 17.739 18.0778C17.8149 18.0464 17.8838 18.0003 17.9419 17.9422C17.9999 17.8842 18.046 17.8152 18.0774 17.7394C18.1089 17.6635 18.125 17.5822 18.125 17.5001C18.125 17.4179 18.1089 17.3366 18.0774 17.2607C18.046 17.1849 17.9999 17.1159 17.9419 17.0579Z" fill="#6B7280"/>
        </svg> */}
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
      {showDropdown && filteredRequests.length > 0 && (
        <div className="absolute w-full mt-2 sm:mt-3 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-y-auto max-h-60">
          {filteredRequests.map((request, index) => {
            const fullName = `${request.firstName || ''} ${request.lastName || ''}`.trim();
            return (
              <div
                key={index}
                className="px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-100 cursor-pointer border-b border-[#E5E7EB] last:border-b-0"
                onClick={() => handleItemClick(request)}
              >
                <div className="font-medium flex flex-col gap-1">
                  <div className="flex justify-between text-sm sm:text-base text-[#6B7280]">
                    <span>{fullName || 'N/A'}</span>
                    <span>{request.phoneNumber || 'N/A'}</span>
                  </div>
                 
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

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

const RentalRequestTable = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateSortDirection, setDateSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemName, setDeleteItemName] = useState('');
  const [deleteFunction, setDeleteFunction] = useState(null);
  const [sortField, setSortField] = useState('availabilityDate'); // Default sort field
  const [sortDirection, setSortDirection] = useState('asc'); // Default sort direction
  const navigate = useNavigate();
  const db = getFirestore(getApp());
  const sortDateRef = useRef(null);
  const itemsPerPage = 10;
  const {user} = useAuth();

 
  useEffect(() => {
    console.log('Starting data fetch...');
    
    const rentalQuery = query(
      collection(db, 'rentalRequest'),
      where('requestType', '==', 'propertySearch')
    );
    
    const unsubscribe = onSnapshot(rentalQuery, async (snapshot) => {
      console.log('Snapshot received:', snapshot.size, 'documents');
      
      const requestsData = await Promise.all(snapshot.docs.map(async (doc) => {
        const data = doc.data();
        let userDetails = { firstName: '', lastName: '' };
        
        if (data.phoneNumber) {
          userDetails = await fetchUserDetails(db, data.phoneNumber);
        }
        
        return {
          id: doc.id,
          ...data,
          firstName: userDetails.firstName,
          lastName: userDetails.lastName
        };
      }));
      
      console.log('Processed data:', requestsData);
      setRequests(requestsData);
      filterRequests(requestsData);
    });
  
    return () => unsubscribe();
  }, []);
  
  const filterRequests = (data) => {
    let filtered = data;
  
    if (searchTerm) {
      filtered = filtered.filter(request => {
        const searchLower = searchTerm.toLowerCase();
        const fullName = `${request.firstName || ''} ${request.lastName || ''}`.trim().toLowerCase();
        return fullName.includes(searchLower) ||
               request.ticketId?.toLowerCase().includes(searchLower) ||
               request.phoneNumber?.toLowerCase().includes(searchLower);
      });
    }
  
    // Sort based on the current sort field and direction
    filtered.sort((a, b) => {
      let comparison = 0;
  
      switch (sortField) {
        case 'monthlyBudget':
          // Convert string budget to number and handle invalid values
          const budgetA = parseInt(a.monthlyBudget?.replace(/[^0-9]/g, '')) || 0;
          const budgetB = parseInt(b.monthlyBudget?.replace(/[^0-9]/g, '')) || 0;
          comparison = budgetA - budgetB;
          break;
  
        case 'leaseTenure':
          // Handle lease tenure with Math.round as used in display
          const tenureA = Math.round(parseFloat(a.leaseTenure) || 0);
          const tenureB = Math.round(parseFloat(b.leaseTenure) || 0);
          comparison = tenureA - tenureB;
          break;
  
        case 'moveInDate':
          // Handle timestamp comparison for moveInDate
          const dateA = a.moveInDate ? a.moveInDate.toDate().getTime() : 0;
          const dateB = b.moveInDate ? b.moveInDate.toDate().getTime() : 0;
          comparison = dateA - dateB;
          break;
  
        default:
          comparison = 0;
      }
  
      // Return comparison based on sort direction
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  
    setFilteredRequests(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    filterRequests(requests);
  }, [searchTerm, sortField, sortDirection, requests]);

  const fetchUserDetails = async (db, phoneNumber) => {
    try {
      const userQuery = query(
        collection(db, 'authorizedUsers'),
        where('phoneNumber', '==', phoneNumber)
      );
      const userSnapshot = await getDocs(userQuery);
      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        return {
          firstName: userData.firstName || '',
          lastName: userData.lastName || ''
        };
      }
      return { firstName: '', lastName: '' };
    } catch (error) {
      console.error('Error fetching user details:', error);
      return { firstName: '', lastName: '' };
    }
  };

  const handleSearch = (termOrRequest) => {
    setSearchTerm(typeof termOrRequest === 'string' ? termOrRequest : termOrRequest.ticketId);
  };

  const SortIcon = ({ field }) => (
    <svg 
      className={`ml-2 transition-transform duration-200 ${
        sortField === field 
          ? sortDirection === 'desc' 
            ? 'rotate-180 transform' 
            : 'rotate-0 transform' 
          : ''
      }`}
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
  );

  const SortableHeader = ({ field, children }) => (
    <th 
      scope="col" 
      className="px-6 py-3 text-left cursor-pointer whitespace-nowrap hover:bg-gray-100" 
      onClick={() => handleTableSort(field)}
    >
      <div className="flex items-center">
        {children}
        <SortIcon field={field} />
      </div>
    </th>
  );

  const handleSort = (startDate, endDate) => {
    let filtered = requests;
    if (startDate || endDate) {
      filtered = requests.filter((request) => {
        const requestDate = request.createdAt ? dayjs(request.createdAt.toDate()) : null;
        if (!requestDate) return false;

        if (startDate && endDate) {
          return requestDate.isSameOrAfter(dayjs(startDate, "DD MMM, YYYY"), "day") &&
                 requestDate.isSameOrBefore(dayjs(endDate, "DD MMM, YYYY"), "day");
        }
        return startDate ? requestDate.isSameOrAfter(dayjs(startDate, "DD MMM, YYYY"), "day") :
                          requestDate.isSameOrBefore(dayjs(endDate, "DD MMM, YYYY"), "day");
      });
    }
    filterRequests(filtered);
  };

 

  const handleTableSort = (field) => {
    console.log('Sorting by:', field, 'Current field:', sortField, 'Current direction:', sortDirection);
    if (sortField === field) {
      // If same field, toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // If new field, set field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };
  const handleRowSelect = (index) => {
    setSelectedRows(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      return [...prev, index];
    });
  };

  const handleDeleteSelected = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedRows.length} selected items?`)) {
      try {
        for (const index of selectedRows) {
          const request = currentItems[index - indexOfFirstItem];
          await deleteDoc(doc(db, 'rentalRequest', request.id));
        }
        setSelectedRows([]);
        toast.success('Selected items deleted successfully');
      } catch (error) {
        console.error('Error deleting items:', error);
        toast.error('Error deleting items');
      }
    }
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentItems.map((_, index) => indexOfFirstItem + index));
    }
  };

  
      const handleRowClick = (ownerId, e) => {
    // Don't navigate if clicking on checkbox or when rows are selected
    if (
      e.target.closest('.checkbox-cell') || 
      selectedRows.length > 0
    ) {
      return;
    }
    // Pass both ownerId and user data through state
    navigate(`/Tenant/${ownerId}`);
  };

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const isAllSelected = currentItems.length > 0 && selectedRows.length === currentItems.length;

  return (
    <div className="mt-1 bg-white border rounded-lg overflow-hidden flex flex-col" style={{ position: 'relative', zIndex: 1, fontFamily: 'Plus_Jakarta' }}>
      <div className="sticky top-0 z-20 bg-white">
        <div className="flex flex-col sm:flex-row items-stretch p-6 gap-4 justify-between">
          <SearchInput requests={requests} onSearch={handleSearch} />
          <div className="w-full sm:w-auto">
            <SortButton onSort={handleSort} ref={sortDateRef}/>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-auto">
        <table className="w-full text-sm text-gray-500 relative" style={{ minWidth: '1000px' }}>
          {/* <thead className="text-xs text-gray-500 bg-gray-50 sticky top-0" style={{fontSize:'12px'}}>
            <tr className="border-y">
              <th scope="col" className="p-4" style={{width:'40px'}}>
                <div className="flex items-center justify-center">
                  <CheckboxWithTick
                    isSelected={isAllSelected}
                    onClick={handleSelectAll}
                  />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left">Ticket ID</th>
              <th scope="col" className="px-6 py-3 text-left">Phone Number</th>
              <th scope="col" className="px-6 py-3 text-left">Monthly Budget</th>
              <th scope="col" className="px-6 py-3 text-left">Security Deposit</th>
              <th scope="col" className="px-6 py-3 text-left">Availability Date</th>
              <th scope="col" className="px-6 py-3 text-left">Profession</th>
              <th scope="col" className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead> */}
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
        <th scope="col" className="px-6 py-3 text-left whitespace-nowrap">Name</th>
        <th scope="col" className="px-6 py-3 text-left whitespace-nowrap">Ticket ID</th>
        <th scope="col" className="px-6 py-3 text-left whitespace-nowrap">Phone Number</th>
        
                    <SortableHeader field="monthlyBudget">Rental Budget</SortableHeader>
                    <SortableHeader field="leaseTenure">Lease Tenure</SortableHeader>
                    <SortableHeader field="moveInDate">Move-In Date</SortableHeader>
        
        <th scope="col" className="px-6 py-3 text-left whitespace-nowrap">Furnishing Type</th>
        <th scope="col" className="px-6 py-3 text-left whitespace-nowrap">Status</th>
      </>
    )}
  </tr>
</thead>
          <tbody>
            {currentItems.map((request, index) => {
              const actualIndex = indexOfFirstItem + index;
              const isSelected = selectedRows.includes(actualIndex);
              
              return (
                <tr key={request.id} 
                    className="bg-white border-b hover:bg-gray-50 cursor-pointer"
                    onClick={(e) => handleRowClick(request.id, e)}
                    style={{fontSize:'14px'}}>
                  <td className="p-4" style={{width:'40px'}}>
                    <div className="flex items-center justify-center checkbox-cell">
                      <CheckboxWithTick
                        isSelected={isSelected}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowSelect(actualIndex);
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
  {`${request.firstName || ''} ${request.lastName || ''}` || 'N/A'}
</td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {request.ticketId || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {request.phoneNumber || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                  ₹{request.monthlyBudget || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
  {request.leaseTenure ? `${Math.round(request.leaseTenure)} Months` : 'N/A'}
</td>

                  <td className="px-6 py-4 whitespace-nowrap">
                  {request.moveInDate ? dayjs(request.moveInDate.toDate()).format('D MMM, YYYY') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {request.furnishingType || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center justify-center text-center px-2 py-2 rounded-full text-[12px] font-medium ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        <div className={`w-2 h-2 rounded-full mr-1 ${
                          request.status === 'pending' ? 'bg-yellow-500' :
                          request.status === 'approved' ? 'bg-green-500' :
                          request.status === 'rejected' ? 'bg-red-500' :
                          'bg-gray-500'
                        }`}></div>
                        {request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : 'N/A'}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredRequests.length === 0 && (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-500" style={{ height: '300px' }}>
                  <div className="flex flex-col items-center justify-center h-full">
                    <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p className="text-lg font-semibold">No rental requests found</p>
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

export default RentalRequestTable;