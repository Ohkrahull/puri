          
import React, { useEffect, useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { collection, query, onSnapshot, getFirestore, doc, deleteDoc } from 'firebase/firestore';
import { toast } from "react-toastify";
import { db } from "../../firebase/firebase";
import EditingBookingModal from "../EditingModal";
import DeleteModal from "../../Modals/DeleteModal";
import { useNavigate } from "react-router-dom";

const SearchInput = ({ registrations, onSearch, users }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length > 0);
    onSearch(value);
  };

  const getUserName = (userId) => {
    const user = users[userId];
    if (!user) return 'N/A';
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A';
  };

  const getRoleText = (role) => {
    switch(role) {
      case 'primary_owner': return 'Primary Owner';
      case 'primary_tenant': return 'Primary Tenant';
      case 'owner': return 'Owner';
      case 'tenant': return 'Tenant';
      default: return role;
    }
  };

  const filteredRegistrations = registrations.filter((registration) => {
    if (!searchTerm) return false;
    
    const searchLower = searchTerm.toLowerCase().trim();

    // Search in all users (owners and tenants)
    const userMatch = registration.users?.some(user => {
      const userName = getUserName(user.userId).toLowerCase();
      const userRole = getRoleText(user.role).toLowerCase();
      return userName.includes(searchLower) || userRole.includes(searchLower);
    });

    // Search in flat number
    const flatNumberMatch = `${registration.wing}-${registration.flatNumber}`.toLowerCase().includes(searchLower);

    return userMatch || flatNumberMatch;
  });

  const handleItemClick = (registration) => {
    // Find primary owner first, then regular owner
    const primaryOwner = registration.users?.find(user => user.role === "primary_owner");
    const owner = registration.users?.find(user => user.role === "owner");
    const selectedUser = primaryOwner || owner;

    if (selectedUser) {
      const userName = getUserName(selectedUser.userId);
      const roleText = getRoleText(selectedUser.role);
      setSearchTerm(`${userName} (${roleText})`);
    } else {
      setSearchTerm(`${registration.wing}-${registration.flatNumber}`);
    }
    
    setShowDropdown(false);
    onSearch(registration);
  };

  return (
    <div className="relative w-full sm:w-[250px] md:w-[300px]">
      <div className="flex items-center justify-between p-2 sm:py-3 border border-[#D1D5DB] rounded-[10px] text-[#6B7280] text-sm sm:text-base bg-[#F3F3F3]">
        <input
          type="text"
          placeholder="Search by name, flat no. or role"
          value={searchTerm}
          onChange={handleInputChange}
          className="w-full bg-transparent border-none outline-none shadow-none text-inherit font-inherit text-sm sm:text-base focus:ring-0"
        />
        <Search className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
      </div>

      {showDropdown && filteredRegistrations.length > 0 && (
        <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
          {filteredRegistrations.map((registration, index) => {
            const owners = registration.users?.filter(u => u.role.includes('owner'))
              .map(u => ({
                name: getUserName(u.userId),
                role: getRoleText(u.role)
              }));
            
            const tenants = registration.users?.filter(u => u.role.includes('tenant'))
              .map(u => ({
                name: getUserName(u.userId),
                role: getRoleText(u.role)
              }));

            return (
              <div
                key={index}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                onClick={() => handleItemClick(registration)}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-900">
                    {`${registration.wing}-${registration.flatNumber}`}
                  </span>
                  <span className={`text-sm px-2 py-1 rounded ${registration.isVacant ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    {registration.isVacant ? 'Vacant' : 'Occupied'}
                  </span>
                </div>
                {owners.length > 0 && (
                  <div className="text-sm text-gray-600">
                    {owners.map((owner, i) => (
                      <div key={i}>{`${owner.name} (${owner.role})`}</div>
                    ))}
                  </div>
                )}
                {tenants.length > 0 && (
                  <div className="text-sm text-gray-600 mt-1">
                    {tenants.map((tenant, i) => (
                      <div key={i}>{`${tenant.name} (${tenant.role})`}</div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const FlatTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [users, setusers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemName, setDeleteItemName] = useState("");
  const [deleteFunction, setDeleteFunction] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState(null);
  const navigate = useNavigate();

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRegistrations.slice(indexOfFirstItem, indexOfLastItem);
  const isAllSelected = currentItems.length > 0 && selectedRows.length === currentItems.length;

  useEffect(() => {
    // Fetch flats data
    const flatsRef = collection(db, 'flats');
    const flatsUnsubscribe = onSnapshot(query(flatsRef), (snapshot) => {
      const flatsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort by createdAt timestamp in descending order
      const sortedData = flatsData.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      
      setRegistrations(sortedData);
      setFilteredRegistrations(sortedData);
    });

    // Fetch authorized users data
    const usersRef = collection(db, 'users');
    const usersUnsubscribe = onSnapshot(query(usersRef), (snapshot) => {
      const users = {};
      snapshot.docs.forEach(doc => {
        users[doc.id] = doc.data();
      });
      setusers(users);
      setIsLoading(false);
    });

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      flatsUnsubscribe();
      usersUnsubscribe();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleDeleteSelected = async () => {
    try {
      setIsLoading(true);
      const selectedRegistrations = selectedRows.map(index => currentItems[index]);
      
      await Promise.all(
        selectedRegistrations.map(reg => 
          deleteDoc(doc(db, 'flats', reg.id))
        )
      );
      
      const remainingRegistrations = registrations.filter(
        reg => !selectedRegistrations.some(selected => selected.id === reg.id)
      );
      setRegistrations(remainingRegistrations);
      setFilteredRegistrations(remainingRegistrations);
      setSelectedRows([]);
      
      const message = selectedRegistrations.length > 1 
        ? 'Selected flats deleted successfully'
        : 'Flat deleted successfully';
      toast.success(message);
    } catch (error) {
      console.error('Error deleting flats:', error);
      toast.error('Failed to delete flats');
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleSearch = useCallback((registrationOrTerm) => {
    if (registrationOrTerm && typeof registrationOrTerm === 'object') {
      setFilteredRegistrations([registrationOrTerm]);
    } else {
      const term = (registrationOrTerm || '').toLowerCase().trim();
      
      const filtered = registrations.filter(reg => {
        const userMatch = reg.users?.some(user => {
          const userData = users[user.userId];
          if (!userData) return false;
          const userName = `${userData.firstName || ''} ${userData.lastName || ''}`.toLowerCase();
          return userName.includes(term);
        });

        const flatNumberMatch = reg.flatId?.toLowerCase().includes(term) ||
                              reg.flatNumber?.toLowerCase().includes(term);

        return userMatch || flatNumberMatch;
      });

      setFilteredRegistrations(filtered);
    }
    setCurrentPage(1);
  }, [registrations, users]);

  const handleDeleteClick = () => {
    const selectedCount = selectedRows.length;
    if (selectedCount === 0) return;
  
    setDeleteItemName(
      selectedCount === 1 
        ? currentItems[selectedRows[0]].flatId
        : `${selectedCount} selected flats`
    );
    setDeleteFunction(() => handleDeleteSelected);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (registration) => {
    navigate(`/FlatNoForm/${registration.flatId}`, {
      state: {
        isEditing: true,
        registrationData: registration,
        wing: registration.wing,
        flatNumber: registration.flatNumber,
        flatId: registration.flatId,
        isVacant: registration.isVacant,
        registrationId: registration.id,
        users: registration.users || []
      }
    });
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingRegistration(null);
  };

  const handleRowSelect = (index) => {
    setSelectedRows(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === currentItems.length 
        ? [] 
        : currentItems.map((_, index) => indexOfFirstItem + index)
    );
  };

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  
  const getPersonDetails = (flat, users) => {
    // Find primary owner first
    const primaryOwner = flat.users?.find(user => user.role === "primary_owner");
    
    // If no primary owner, find regular owner
    const owner = !primaryOwner ? flat.users?.find(user => user.role === "owner") : null;
    
    // Find primary tenant
    const primaryTenant = flat.users?.find(user => user.role === "primary_tenant");
    
    // If no primary tenant, find regular tenant
    const tenant = !primaryTenant ? flat.users?.find(user => user.role === "tenant") : null;
  
    // Get owner name (prioritize primary owner, then regular owner)
    const ownerDetails = primaryOwner || owner;
    const ownerUser = ownerDetails ? users[ownerDetails.userId] : null;
    const ownerName = ownerUser 
      ? `${ownerUser.firstName || ''} ${ownerUser.lastName || ''}`.trim() 
      : '-';
  
    // Get tenant name (prioritize primary tenant, then regular tenant)
    const tenantDetails = primaryTenant || tenant;
    const tenantUser = tenantDetails ? users[tenantDetails.userId] : null;
    const tenantName = tenantUser
      ? `${tenantUser.firstName || ''} ${tenantUser.lastName || ''}`.trim()
      : '-';;

      const isResiding = flat.Users?.some(user => user.isResiding) || false
  
    return {
      ownerName,
      tenantName,
      isResiding
    };
  };


  const getStatusText = (flat) => {
    if (flat.isVacant) {
      return {
        text: "Vacant",
        style: {
          bg: "var(--Rose-25, #FFF1F2)",
          color: "var(--Rose-700, #9F1239)"
        }
      };
    }
  
    // Check if any user (owner or tenant) is residing
    const hasResidingUser = flat.users?.some(user => user.isResiding);
  
    if (hasResidingUser) {
      return {
        text: "Residing",
        style: {
          bg: "var(--Emerald-25, #F0FDF4)",
          color: "var(--Emerald-700, #166534)"
        }
      };
    }
  
    return {
      text: "Not-Residing",
      style: {
        bg: "#F3F4F6",
        color: "#4B5563"
      }
    };
  };

  const getUserName = (userId) => {
    const user = users[userId];
    if (!user) return 'N/A';
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A';
  };

  const CheckboxWithTick = ({ isSelected, onClick }) => (
    <div
      onClick={onClick}
      className="w-5 h-5 border border-gray-500 rounded-md flex items-center justify-center cursor-pointer"
    >
      {isSelected && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 3L4.5 8.5L2 6" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  );

  const headerStyle = {
    display: "flex",
    flexDirection: windowWidth > 768 ? "row" : "column",
    alignItems: windowWidth > 768 ? "center" : "stretch",
    justifyContent: "space-between",
    padding: "24px",
    gap: "16px",
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-1 bg-white border rounded-lg overflow-hidden flex flex-col" 
           style={{ position: 'relative', zIndex: 1, fontFamily: 'Plus_Jakarta' }}>
        <div className="sticky top-0 z-20 bg-white">
          <div style={headerStyle}>
            <div style={{ width: windowWidth > 768 ? 'auto' : '100%', marginBottom: windowWidth > 768 ? 0 : '16px' }}>
              <SearchInput 
                registrations={registrations}
                users={users}
                onSearch={handleSearch}
              />
            </div>
          </div>
        </div>

        <div className="flex-grow overflow-auto">
          <table className="w-full text-sm text-gray-500" style={{ minWidth: '1000px' }}>
            <thead className="text-xs text-gray-500 bg-gray-50 sticky top-0" style={{fontSize:'12px'}}>
              <tr className="border-y">
                <th className="p-4 w-10">
                  <CheckboxWithTick
                    isSelected={isAllSelected}
                    onClick={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left">Flat Number</th>
                <th className="px-6 py-3 text-left">Owner Name </th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Tenant Name</th>
                <th className="px-6 py-3 text-right">
                  {selectedRows.length > 0 && (
                    <span 
                      style={{cursor: 'pointer', color: '#EF4444'}}
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
                currentItems.map((flat, index) => {
                  const actualIndex = indexOfFirstItem + index;
                  const isSelected = selectedRows.includes(actualIndex);

                  const { ownerName, tenantName } = getPersonDetails(flat, users);
                  
                  const statusDisplay = getStatusText(flat);

                  return (
                    <tr key={flat.id} className="bg-white border-b hover:bg-gray-50" style={{fontSize:'14px'}}>
                      <td className="p-4">
                        <div className="flex items-center justify-center">
                          <CheckboxWithTick
                            isSelected={isSelected}
                            onClick={() => handleRowSelect(actualIndex)}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {/* {flat.flatId} */}
                        {`${flat.wing || 'N/A'}-${flat.flatNumber || 'N/A'}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ownerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      {statusDisplay.text}
                        
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tenantName}
                      </td>
                      
                                           <td className="px-6 py-4 whitespace-nowrap text-right" style={{minWidth: '120px'}}>
                       <div className="flex justify-end space-x-4">
                         <button onClick={() => handleEditClick(flat)}>
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
          <div className="text-sm text-gray-700 font-semibold">
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