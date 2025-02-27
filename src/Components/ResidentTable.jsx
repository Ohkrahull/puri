
import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, getFirestore, orderBy, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { PencilSimple } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DeleteModal from '../Modals/DeleteModal';

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
    setSearchTerm(resident.firstName ? `${resident.firstName} ${resident.lastName}` : resident.phone);
    setShowDropdown(false);
    onSearch(resident);
  };

  const filteredResidents = residents.filter((resident) => {
    if (!searchTerm) return false;
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${resident.firstName || ''} ${resident.lastName || ''}`.toLowerCase();
    const flatNumber = `${resident.wing || ''}-${resident.flatNumber || ''}`.toLowerCase();
    const phone = (resident.phone || '').toLowerCase();
    
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
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6 mr-2" viewBox="0 0 20 20" fill="none">
          <path d="M17.9419 17.0579L14.0302 13.1469C15.1639 11.7858 15.7293 10.0399 15.6086 8.2725C15.488 6.50512 14.6906 4.85229 13.3823 3.65785C12.074 2.46341 10.3557 1.81932 8.58462 1.85957C6.81357 1.89982 5.12622 2.62131 3.87358 3.87395C2.62094 5.12659 1.89945 6.81394 1.8592 8.58498C1.81895 10.356 2.46304 12.0744 3.65748 13.3827C4.85192 14.6909 6.50475 15.4883 8.27214 15.609C10.0395 15.7297 11.7854 15.1643 13.1466 14.0305L17.0575 17.9422C17.1156 18.0003 17.1845 18.0464 17.2604 18.0778C17.3363 18.1092 17.4176 18.1254 17.4997 18.1254C17.5818 18.1254 17.6631 18.1092 17.739 18.0778C17.8149 18.0464 17.8838 18.0003 17.9419 17.9422C17.9999 17.8842 18.046 17.8152 18.0774 17.7394C18.1089 17.6635 18.125 17.5822 18.125 17.5001C18.125 17.4179 18.1089 17.3366 18.0774 17.2607C18.046 17.1849 17.9999 17.1159 17.9419 17.0579Z" fill="#6B7280"/>
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemName, setDeleteItemName] = useState('');
  const [deleteFunction, setDeleteFunction] = useState(null);

  useEffect(() => {
    const fetchUserData = async (userId) => {
      try {
        const userDoc = await getDoc(doc(db, 'authorizedUsers', userId));
        if (userDoc.exists()) {
          return userDoc.data();
        }
        return null;
      } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
      }
    };

    const flatsQuery = query(
      collection(db, 'flats'),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(flatsQuery, async (snapshot) => {
      const processedResidents = [];

      for (const doc of snapshot.docs) {
        const data = doc.data();
        const flatData = {
          id: doc.id,
          wing: data.wing,
          flatNumber: data.flatNumber,
          createdAt: data.createdAt // Store timestamp for sorting in UI
        };

        if (data.users && Array.isArray(data.users)) {
          for (const user of data.users) {
            const userData = await fetchUserData(user.userId);
            if (userData) {
              processedResidents.push({
                ...userData,
                ...flatData,
                role: user.role,
                isResiding: user.isResiding,
                userId: user.userId
              });
            }
          }
        }
      }
// Sort by `createdAt` to ensure new entries always appear first
processedResidents.sort((a, b) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0));
 
      setResidents(processedResidents);
      filterResidents(processedResidents);
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
        const phone = (resident.phone || '').toLowerCase();
        const email = (resident.email || '').toLowerCase();
        
        return (
          fullName.includes(searchLower) ||
          phone.includes(searchLower) ||
          flatNumber.includes(searchLower) ||
          email.includes(searchLower)
        );
      });
    }

    // Sort again by `createdAt` for consistency
    filtered.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

  
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
      const searchValue = termOrResident.firstName ? 
        `${termOrResident.firstName} ${termOrResident.lastName}` : 
        termOrResident.phone;
      setSearchTerm(searchValue);
    } else {
      setSearchTerm(termOrResident);
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.length === currentItems.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentItems.map((_, index) => indexOfFirstItem + index));
    }
  };

  const handleDeleteSelected = () => {
    setDeleteItemName(`${selectedRows.length} selected resident${selectedRows.length > 1 ? 's' : ''}`);
    setDeleteFunction(() => async () => {
      try {
        const selectedResidents = selectedRows.map(index => {
          const relativeIndex = index - indexOfFirstItem;
          return currentItems[relativeIndex];
        });

        // Process each flat's deletions
        for (const resident of selectedResidents) {
          const flatDocRef = doc(db, 'flats', resident.id);
          const flatDoc = await getDoc(flatDocRef);
          
          if (flatDoc.exists()) {
            const flatData = flatDoc.data();
            const updatedUsers = (flatData.users || []).filter(user => user.userId !== resident.userId);
            
            await updateDoc(flatDocRef, {
              users: updatedUsers
            });
          }
        }

        setSelectedRows([]);
        toast.success(`Successfully deleted ${selectedRows.length} resident${selectedRows.length > 1 ? 's' : ''}`);
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error('Error deleting residents:', error);
        toast.error('Failed to delete residents. Please try again.');
      }
    });
    setIsDeleteModalOpen(true);
  };

  const handleRowSelect = (index) => {
    setSelectedRows(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      return [...prev, index];
    });
  };

  const formatRole = (role) => {
    switch(role) {
      case 'primary_owner': return 'Primary Owner';
      case 'primary_tenant': return 'Primary Tenant';
      case 'owner': return 'Owner';
      case 'tenant': return 'Tenant';
      default: return role;
    }
  };

  // const handleEdit = (resident) => {
  //   navigate(`/FlatNoForm/${resident.id}`, {
  //     state: {
  //       wing: resident.wing,
  //       flatNumber: resident.flatNumber,
  //       registrationData: {
  //         id: resident.userId,
  //         firstName: resident.firstName,
  //         lastName: resident.lastName,
  //         phone: resident.phone,
  //         email: resident.email,
  //         isResiding: resident.isResiding || true,
  //         role: resident.role,
  //         documents: resident.documents || []
  //       },
  //       isEditing: true
  //     }
  //   });
  // };
  const handleEdit = (resident) => {
    // Use the flatId directly from the data
    navigate(`/FlatNoForm/${resident.id}/${resident.userId}`, {
      state: {
        wing: resident.wing,
        flatNumber: resident.flatNumber,
        registrationData: {
          id: resident.userId,
          firstName: resident.firstName,
          lastName: resident.lastName,
          phone: resident.phone,
          email: resident.email,
          isResiding: resident.isResiding || true,
          role: resident.role,
          documents: resident.documents || []
        },
        isEditing: true
      }
    });
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

  const totalPages = Math.ceil(filteredResidents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResidents.slice(indexOfFirstItem, indexOfLastItem);
  const isAllSelected = currentItems.length > 0 && selectedRows.length === currentItems.length;

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
                <th className="p-4 w-4">
                  <CheckboxWithTick
                    isSelected={isAllSelected}
                    onClick={handleSelectAll}
                    isMinusIcon={selectedRows.length > 0 && selectedRows.length < currentItems.length}
                  />
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex text-gray-600 gap-2">
                    <span className="font-semibold" style={{color:'#4B5563', fontSize:12}}>
                      {selectedRows.length}
                    </span>
                    <span className="font-semibold" style={{color:'#4B5563', fontSize:12}}>
                      selected
                    </span>
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
                <th className="p-4 w-4">
                  <CheckboxWithTick
                    isSelected={isAllSelected}
                    onClick={handleSelectAll}
                  />
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
                <tr key={`${resident.id}_${index}`} className="bg-white border-b hover:bg-gray-50" style={{fontSize:'14px'}}>
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
                    {`${resident.wing}-${resident.flatNumber}`}
                  </td>
                  <td className="px-6 py-4">
                    {formatPhoneNumber(resident.phone)}
                  </td>
                  <td className="px-6 py-4">
                    {resident.email || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    {/* {resident.role} */}
                    {formatRole(resident.role)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(resident)}
                      className="text-gray-500 hover:text-gray-700"
                    >
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

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={deleteFunction}
        itemName={deleteItemName}
      />
    </div>
  );
};

export default ResidentTable;