import React, { useEffect, useRef, useState, useCallback } from 'react';
// import styles from './CustomScrollbar.module.css';
// import SearchInput from '../Buttons/SearchInput';
import SortButton from '../Buttons/Sortdate';
import NextSearchInput from '../Components/NextSearch';
import EditingDocumentModal from '../Components/EditingDocumentModal';
import EditingUserModal from '../Components/EditingUserModal';
// import NextSearchUserInput from './NextSearchUserInput';
// import NextSearchUserInput from './NextSearchUserInput';
import { toast } from 'react-toastify';
import {getAllAuthorizedUsers, removeAuthorizedUser, updateAuthorizedUser} from '../firebase/services/UserData'
import DeleteModal from '../Modals/DeleteModal';



const SearchInput = ({ users, onSearch, onItemClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length > 0);
    onSearch(value);
  };

  const handleItemClick = (user) => {
    setSearchTerm(`${user.firstName} ${user.lastName}`);
    setShowDropdown(false);
    onItemClick(user);
  };

  const filteredUsers = users.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
          // border: "none",
            // outline: "none",
        }}
      >
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleInputChange}
          style={{
            border: "none",
            outline: "none",
            width: "100%",
            background: "transparent",
            color: "inherit",
            fontSize: "inherit",
            fontFamily: "inherit",
            border:'white',
            outline: "none",
            boxShadow:'none',
          }}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M17.9419 17.0579L14.0302 13.1469C15.1639 11.7858 15.7293 10.0399 15.6086 8.2725C15.488 6.50512 14.6906 4.85229 13.3823 3.65785C12.074 2.46341 10.3557 1.81932 8.58462 1.85957C6.81357 1.89982 5.12622 2.62131 3.87358 3.87395C2.62094 5.12659 1.89945 6.81394 1.8592 8.58498C1.81895 10.356 2.46304 12.0744 3.65748 13.3827C4.85192 14.6909 6.50475 15.4883 8.27214 15.609C10.0395 15.7297 11.7854 15.1643 13.1466 14.0305L17.0575 17.9422C17.1156 18.0003 17.1845 18.0464 17.2604 18.0778C17.3363 18.1092 17.4176 18.1254 17.4997 18.1254C17.5818 18.1254 17.6631 18.1092 17.739 18.0778C17.8149 18.0464 17.8838 18.0003 17.9419 17.9422C17.9999 17.8842 18.046 17.8152 18.0774 17.7394C18.1089 17.6635 18.125 17.5822 18.125 17.5001C18.125 17.4179 18.1089 17.3366 18.0774 17.2607C18.046 17.1849 17.9999 17.1159 17.9419 17.0579ZM3.12469 8.75006C3.12469 7.63754 3.45459 6.55 4.07267 5.62497C4.69076 4.69995 5.56926 3.97898 6.5971 3.55323C7.62493 3.12749 8.75593 3.0161 9.84707 3.23314C10.9382 3.45018 11.9405 3.98591 12.7272 4.77258C13.5138 5.55925 14.0496 6.56153 14.2666 7.65267C14.4837 8.74382 14.3723 9.87482 13.9465 10.9027C13.5208 11.9305 12.7998 12.809 11.8748 13.4271C10.9497 14.0452 9.86221 14.3751 8.74969 14.3751C7.25836 14.3734 5.82858 13.7802 4.77404 12.7257C3.71951 11.6712 3.12634 10.2414 3.12469 8.75006Z"
            fill="#6B7280"
          />
        </svg>
      </div>

      {showDropdown && filteredUsers.length > 0 && (
        <div className="absolute w-full mt-3 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-y-auto" 
        style={{
          maxHeight: filteredUsers.length > 4 ? '240px' : 'auto',
          overflowY: filteredUsers.length > 4 ? 'auto' : 'visible'
        }}>
          {filteredUsers.map((user, index) => (
            <div
              key={index}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
              style={{borderBottom: '1px solid var(--Gray-100, #E5E7EB)',}}
              onClick={() => handleItemClick(user)}
            >
              <div className="font-medium flex justify-between" style={{fontSize:'14px', color:'#6B7280'}}>
                {/* {user.firstName} {user.lastName} */}
                {truncateText(`${user.firstName} ${user.lastName}`, 20)}
              <span>  {`${user.wing || ''} - ${user.flatNumber || ''}`}</span>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const MemberTable = ({ refreshTrigger }) => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 9;
  const [selectedRows, setSelectedRows] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemName, setDeleteItemName] = useState('');
  const [deleteFunction, setDeleteFunction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const isAllSelected = filteredUsers.length > 0 && selectedRows.length === filteredUsers.length;

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const authorizedUsers = await getAllAuthorizedUsers();
      setUsers(authorizedUsers);
      setFilteredUsers(authorizedUsers);
    } catch (error) {
      console.error("Error fetching authorized users:", error);
      setError("Failed to fetch users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, refreshTrigger]);

  const handleItemClick = (user) => {
    setSearchTerm(user.firstName + " " + user.lastName);
    setFilteredUsers([user]);
    setCurrentPage(1);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) => 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase()) ||
        user.phoneNumber.includes(term)
      );
      setFilteredUsers(filtered);
    }
    setCurrentPage(1);
  };

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
    if (selectedRows.length === filteredUsers.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredUsers.map((_, index) => indexOfFirstItem + index));
    }
  };

  const handleDeleteSelected = () => {
    setDeleteItemName('all selected users');
    setDeleteFunction(() => async () => {
      try {
        const deletePromises = selectedRows.map(index => {
          const userToDelete = filteredUsers[index];
          return removeAuthorizedUser(userToDelete.phoneNumber);
        });
        await Promise.all(deletePromises);
        toast.success("Selected users deleted successfully");
        fetchUsers();
        setSelectedRows([]);
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error("Error deleting selected users:", error);
        toast.error("Failed to delete selected users. Please try again.");
      }
    });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setDeleteItemName(`${user.firstName} ${user.lastName}`);
    setDeleteFunction(() => async () => {
      try {
        await removeAuthorizedUser(user.phoneNumber);
        toast.success("User deleted successfully");
        fetchUsers();
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user. Please try again.");
      }
    });
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (user, index) => {
    setEditingUser({ ...user });
    setEditingIndex(index);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedUser) => {
    try {
      await updateAuthorizedUser(updatedUser.phoneNumber, updatedUser);
      await fetchUsers(); // Refetch to get the updated list with correct sorting
      setIsEditModalOpen(false);
      setEditingUser(null);
      setEditingIndex(null);
      toast.success("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user. Please try again.");
    }
  };
  const truncateEmail = (email) => {
    if (email.length > 14) {
      return `${email.slice(0, 14)}...`; // Show first 11 characters, followed by "..."
    }
    return email;
  };

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

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
    setEditingIndex(null);
  };

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
          <td colSpan="6" className="px-6 py-4 text-center text-red-500">{error}</td>
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
              <p className="text-lg font-semibold">No Users found</p>
              <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
            </div>
          </td>
        </tr>
      );
    }

    return currentItems.map((user, index) => {
      const actualIndex = indexOfFirstItem + index;
      const isSelected = selectedRows.includes(actualIndex);
      return (
        <tr key={index} className="bg-white border-b hover:bg-gray-50" style={{fontSize:'14px'}}>
          <td className="p-4" style={{width:'40px'}}>
            <div className="flex items-center justify-center">
              <CheckboxWithTick
                isSelected={isSelected}
                onClick={() => handleRowSelect(actualIndex)}
              />
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 text-left" style={{minWidth: '200px'}}>
            {/* {user.firstName} {user.lastName} */}
            {truncateText(`${user.firstName} ${user.lastName}`, 20)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-left" style={{minWidth: '150px'}}>{user.phoneNumber}</td>
          <td className="px-6 py-4 whitespace-nowrap text-left" style={{minWidth: '200px'}}>{truncateEmail(user.email)}</td>
          <td className="px-6 py-4 whitespace-nowrap text-left" style={{minWidth: '150px'}}>
            {user.wing && user.flatNumber ? `${user.wing} - ${user.flatNumber}` : '-'}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right" style={{minWidth: '120px'}}>
            <div className="flex justify-end space-x-4">
              <button onClick={() => handleEditClick(user, actualIndex)}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.7586 5.73201L14.268 2.24061C14.1519 2.1245 14.0141 2.0324 13.8624 1.96957C13.7107 1.90673 13.5482 1.87439 13.384 1.87439C13.2198 1.87439 13.0572 1.90673 12.9056 1.96957C12.7539 2.0324 12.6161 2.1245 12.5 2.24061L2.86641 11.875C2.74983 11.9906 2.65741 12.1283 2.59451 12.28C2.5316 12.4317 2.49948 12.5944 2.50001 12.7586V16.25C2.50001 16.5815 2.6317 16.8994 2.86612 17.1339C3.10054 17.3683 3.41849 17.5 3.75001 17.5H7.24141C7.40563 17.5005 7.5683 17.4684 7.71999 17.4055C7.87168 17.3426 8.00935 17.2502 8.12501 17.1336L17.7586 7.49998C17.8747 7.3839 17.9668 7.24609 18.0296 7.09442C18.0925 6.94274 18.1248 6.78017 18.1248 6.616C18.1248 6.45182 18.0925 6.28925 18.0296 6.13758C17.9668 5.9859 17.8747 5.84809 17.7586 5.73201ZM7.24141 16.25H3.75001V12.7586L10.625 5.88358L14.1164 9.37498L7.24141 16.25ZM15 8.49061L11.5086 4.99998L13.3836 3.12498L16.875 6.61561L15 8.49061Z" fill="#6B7280"/>
                </svg>
              </button>
              <button onClick={() => handleDeleteClick(user)}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.875 3.75H3.125C2.95924 3.75 2.80027 3.81585 2.68306 3.93306C2.56585 4.05027 2.5 4.20924 2.5 4.375C2.5 4.54076 2.56585 4.69973 2.68306 4.81694C2.80027 4.93415 2.95924 5 3.125 5H3.75V16.25C3.75 16.5815 3.8817 16.8995 4.11612 17.1339C4.35054 17.3683 4.66848 17.5 5 17.5H15C15.3315 17.5 15.6495 17.3683 15.8839 17.1339C16.1183 16.8995 16.25 16.5815 16.25 16.25V5H16.875C17.0408 5 17.1997 4.93415 17.3169 4.81694C17.4342 4.69973 17.5 4.54076 17.5 4.375C17.5 4.20924 17.4342 4.05027 17.3169 3.93306C17.1997 3.81585 17.0408 3.75 16.875 3.75ZM15 16.25H5V5H15V16.25ZM6.25 1.875C6.25 1.70924 6.31585 1.55027 6.43306 1.43306C6.55027 1.31585 6.70924 1.25 6.875 1.25H13.125C13.2908 1.25 13.4497 1.31585 13.5669 1.43306C13.6842 1.55027 13.75 1.70924 13.75 1.875C13.75 2.04076 13.6842 2.19973 13.5669 2.31694C13.4497 2.43415 13.2908 2.5 13.125 2.5H6.875C6.70924 2.5 6.55027 2.43415 6.43306 2.31694C6.31585 2.19973 6.25 2.04076 6.25 1.875Z" fill="#EF4444"/>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="mt-1 bg-white border rounded-lg overflow-hidden flex flex-col h-full" style={{ fontFamily: 'Plus_Jakarta' }}>
      <div className="sticky top-0 z-20 bg-white">
        <div className="flex flex-col sm:flex-row justify-between items-center p-6">
          <div className="w-full sm:w-auto mb-4 sm:mb-0">
            <SearchInput users={users} onSearch={handleSearch} onItemClick={handleItemClick} />
          </div>
          <div className="w-full sm:w-auto flex items-center space-x-4">
            {/* Add any additional buttons or components here */}
          </div>
        </div>
      </div>
      
      <div className="flex-grow overflow-auto">
        <table className="w-full text-sm text-gray-500" style={{ minWidth: '1000px' }}>
          <thead className="text-xs text-gray-500 bg-gray-50 sticky top-0" style={{fontSize:'12px'}}>
            <tr className="border-y">
              <th className="p-4" style={{width:'40px'}}>
                <div className="flex items-center justify-center">
                  <CheckboxWithTick
                    isSelected={isAllSelected}
                    onClick={handleSelectAll}
                  />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '200px'}}>Name</th>
              <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '150px'}}>Phone Number</th>
              <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '200px'}}>Email</th>
              <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '150px'}}>Wing / FlatNumber</th>
              <th scope="col" className="px-6 py-3 text-right" style={{minWidth: '120px'}}>
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

      <EditingUserModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        user={editingUser}
        onSave={handleSaveEdit}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={deleteFunction}
        itemName={deleteItemName}
      />
    </div>
  );
};

export default MemberTable;

