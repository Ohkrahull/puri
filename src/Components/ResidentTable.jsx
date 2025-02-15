import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, getFirestore, orderBy } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import SortButton from '../Buttons/Sortdate';
import { PencilSimple } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';

const SearchInput = ({ residents, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
  
    const handleInputChange = (e) => {
      const value = e.target.value;
      setSearchTerm(value);
      setShowDropdown(value.length > 0);
      onSearch(value);
    };
  
    const handleItemClick = (resident) => {
        setSearchTerm(resident.firstName ? `${resident.firstName} ${resident.lastName}` : resident.phoneNumber);
        setShowDropdown(false);
        onSearch(resident);
      };
  
  
      const filteredResidents = residents.filter((resident) => {
        if (!searchTerm) return false;
        const searchLower = searchTerm.toLowerCase();
        const fullName = `${resident.firstName || ''} ${resident.lastName || ''}`.toLowerCase();
        const flatNumber = `${resident.wing || ''}-${resident.flatNumber || ''}`.toLowerCase();
        const phone = (resident.phoneNumber || '').toLowerCase();
        
        return (
          fullName.includes(searchLower) ||
          phone.includes(searchLower) ||
          flatNumber.includes(searchLower)
        );
      });
  
    return (
      <div className="relative w-full sm:w-[250px] md:w-[300px]">
        <div className="flex items-center justify-between p-2 sm:py-2 border border-[#D1D5DB] rounded-[10px] text-[#6B7280] text-sm sm:text-base bg-[#F3F3F3]">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleInputChange}
            className="w-full bg-transparent border-none outline-none shadow-none text-inherit font-inherit text-sm sm:text-base focus:ring-0"
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
        {showDropdown && filteredResidents.length > 0 && (
          <div className="absolute w-full mt-2 sm:mt-3 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-y-auto max-h-60">
            {filteredResidents.map((resident, index) => (
              <div
                key={index}
                className="px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-100 cursor-pointer border-b border-[#E5E7EB] last:border-b-0"
                onClick={() => handleItemClick(resident)}
              >
                <div className="font-medium flex justify-between text-sm sm:text-base text-[#6B7280]">
                  <span>{`${resident.firstName || ''} ${resident.lastName || ''}`}</span>
                  <span>{resident.wing || 'N/A'} - {resident.flatNumber || 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

const ResidentTable = () => {
  const [residents, setResidents] = useState([]);
  const [filteredResidents, setFilteredResidents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const db = getFirestore(getApp());

  useEffect(() => {
    const residentsQuery = query(
      collection(db, 'authorizedUsers'), 
      orderBy('firstName', 'asc')
    );
    
    const unsubscribe = onSnapshot(residentsQuery, (snapshot) => {
      const residentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setResidents(residentsData);
      filterResidents(residentsData);
    });

    return () => unsubscribe();
  }, []);

  const filterResidents = (data) => {
    let filtered = data;
  
    if (searchTerm && typeof searchTerm === 'string') {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(resident => {
        const fullName = `${resident.firstName || ''} ${resident.lastName || ''}`.toLowerCase();
        const flatNumber = `${resident.wing || ''}-${resident.flatNumber || ''}`.toLowerCase();
        const phone = (resident.phoneNumber || '').toLowerCase();
        const email = (resident.email || '').toLowerCase();
        
        return (
          fullName.includes(searchLower) ||
          phone.includes(searchLower) ||
          flatNumber.includes(searchLower) ||
          email.includes(searchLower)
        );
      });
    }
  
    setFilteredResidents(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    filterResidents(residents);
  }, [searchTerm]);

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    return phone.startsWith('+91') ? phone.slice(3) : phone;
  };

  const handleSearch = (termOrResident) => {
    if (typeof termOrResident === 'object') {
      // If it's a resident object
      const searchValue = termOrResident.firstName ? 
        `${termOrResident.firstName} ${termOrResident.lastName}` : 
        termOrResident.phoneNumber;
      setSearchTerm(searchValue);
    } else {
      // If it's a string
      setSearchTerm(termOrResident);
    }
  };

  const totalPages = Math.ceil(filteredResidents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResidents.slice(indexOfFirstItem, indexOfLastItem);
  const isAllSelected = currentItems.length > 0 && selectedRows.length === currentItems.length;

  const handleRowSelect = (index) => {
    setSelectedRows(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      return [...prev, index];
    });
  };

    const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentItems.map((_, index) => indexOfFirstItem + index));
    }
  };

  const handleEdit = (resident) => {
    navigate(`/FlatNoForm/${resident.id}`, {
      state: {
        wing: resident.wing,
        flatNumber: resident.flatNumber,
        fullFlatNumber: `${resident.wing}-${resident.flatNumber}`,
        registrationData: {
          id: resident.id,
          firstName: resident.firstName,
          lastName: resident.lastName,
          phone: resident.phoneNumber,
          email: resident.email,
          isResiding: resident.isResiding || true,
          isPrimaryOwner: resident.isPrimaryOwner || true,
          notificationsEnabled: resident.notificationsEnabled || true,
          documents: resident.documents || [],
        },
        isEditing: true
      }
    });
  };

  const handleDeleteSelected = (indices = selectedRows) => {
    const selectedCount = Array.isArray(indices) ? indices.length : 1;
    const residentIds = (Array.isArray(indices) ? indices : [indices]).map(index => {
      const relativeIndex = index - indexOfFirstItem;
      return currentItems[relativeIndex].id;
    });
    
    // Here you would implement the actual delete functionality
    console.log('Deleting residents:', residentIds);
    setSelectedRows([]);
  };

  const CheckboxWithTick = ({ isSelected, onClick }) => (
    <div
      onClick={onClick}
      className="w-5 h-5 border border-gray-400 rounded-md flex items-center justify-center cursor-pointer"
      style={{ backgroundColor: isSelected ? '#F3F4F6' : 'white' }}
    >
      {isSelected && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M10 3L4.5 8.5L2 6" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  );

  return (
    <div className="mt-1 bg-white border rounded-lg overflow-hidden flex flex-col">
      <div className="sticky top-0 z-20 bg-white">
        <div className="flex flex-col sm:flex-row items-stretch p-6 gap-4 justify-between">
          <SearchInput residents={residents} onSearch={handleSearch} />
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
                  <th scope="col" className="px-6 py-3 text-right">
                    <span 
                      onClick={() => handleDeleteSelected()}
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
                  <th scope="col" className="px-6 py-3 text-left">Name</th>
                  <th scope="col" className="px-6 py-3 text-left">Flat Number</th>
                  <th scope="col" className="px-6 py-3 text-left">Phone Number</th>
                  <th scope="col" className="px-6 py-3 text-left">Email</th>
                  <th scope="col" className="px-6 py-3 text-left">Role</th>
                  <th scope="col" className="px-6 py-3 text-right"></th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((resident, index) => {
              const actualIndex = indexOfFirstItem + index;
              const isSelected = selectedRows.includes(actualIndex);
              
              return (
                <tr key={resident.id} className="bg-white border-b hover:bg-gray-50" style={{fontSize:'14px'}}>
                  <td className="p-4">
                    <div className="flex items-center justify-center">
                      <CheckboxWithTick
                        isSelected={isSelected}
                        onClick={() => handleRowSelect(actualIndex)}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {`${resident.firstName || ''} ${resident.lastName || ''}`}
                  </td>
                  <td className="px-6 py-4">
                    {`${resident.wing || ''}-${resident.flatNumber || ''}`}
                  </td>
                  <td className="px-6 py-4">
                    {formatPhoneNumber(resident.phoneNumber)}
                  </td>
                  <td className="px-6 py-4">
                    {resident.email || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    Owner
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(resident)}
                     className="text-gray-500 hover:text-gray-700">
                    <PencilSimple size={20} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredResidents.length === 0 && (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500" style={{ height: '300px' }}>
                  <div className="flex flex-col items-center justify-center h-full">
                    <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p className="text-lg font-semibold">No residents found</p>
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
    </div>
  );
};

export default ResidentTable;