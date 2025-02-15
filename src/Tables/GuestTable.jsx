import React, { useCallback, useEffect, useRef, useState } from 'react';
// import styles from './CustomScrollbar.module.css';
// import SearchInput from '../Buttons/SearchInput';
import SortButton from '../Buttons/Sortdate';
import NextSearchInput from '../Components/NextSearch';
import EditingDocumentModal from '../Components/EditingDocumentModal';
import EditingUserModal from '../Components/EditingUserModal';
import NextSearchUserInput from './NextSearchUserInput';
import { getAllGuestUsers,deleteGuestUser,getGuestUserData } from '../firebase/services/UserService';
import { toast } from 'react-toastify';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import DeleteModal from '../Modals/DeleteModal';
// import { toast } from 'react-toastify';
// import NextSearchUserInput from './NextSearchUserInput';

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
    // setSearchTerm(`${user.firstName} ${user.lastName}`);
    const nameToDisplay = user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName;
setSearchTerm(nameToDisplay)
    setShowDropdown(false);
    onItemClick(user);
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <div className="absolute w-full mt-3 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-y-auto" style={{ maxHeight: '223px' }}>            {filteredUsers.map((user, index) => (
            <div
              key={index}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
              style={{borderBottom: '1px solid var(--Gray-100, #E5E7EB)'}}
              onClick={() => handleItemClick(user)}
            >
              <div className="font-medium" style={{fontSize:'14px', color:'#6B7280'}}>
                {/* {`${user.firstName} ${user.lastName}`} */}
                {/* {user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName} */}
                {truncateText(user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName, 20)}
              </div>
              {/* <div className="text-sm text-gray-500">{user.wing}</div> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


const GuestTable = ({refreshTrigger}) => {
  const [users, setUsers] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 9;
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  
  const [selectedStatus, setSelectedStatus] = useState("Sort Status");
  const [selectedRole, setSelectedRole] = useState("Sort Role");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState(false)
  const [isLoading,setIsLoading] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemName, setDeleteItemName] = useState('');
  const [deleteFunction, setDeleteFunction] = useState(null);

  const roleDropdownRef = useRef(null);
  // const StatusDropdownRef = useRef(null);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  
      // Calculate the current page's data
      
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
      const isAllSelected = filteredUsers.length > 0 && selectedRows.length === filteredUsers.length;

      const handleItemClick = (user) => {
        setSearchTerm(user.name);
        setFilteredUsers([user]);
        setCurrentPage(1);
      };

      useEffect(() => {
        setFilteredUsers(users);
      }, [users]);

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };
  const hideScrollbarStyle = {
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  };

  const fetchGuestUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const guestUsersSnapshot = await getDocs(collection(db, 'guestUsers'));
      const guestUsersData = await Promise.all(
        guestUsersSnapshot.docs.map(async (doc) => {
          const userData = await getGuestUserData(doc.id);
          return { id: doc.id, ...userData };
        })
      );
      setUsers(guestUsersData);
      setFilteredUsers(guestUsersData);
    } catch (error) {
      console.error("Error fetching guest users:", error);
      setError("Failed to load guest users. Please try again.");
      toast.error("Failed to load guest users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuestUsers();
  }, [fetchGuestUsers, refreshTrigger]);

  

  // const bookings = [
  //   { name: "Marvin McKinney", phoneNumber: "123-456-7890", email: "marvin@example.com", role: "User", slotTime: "08:20 am", slotDate: "8 Sep, 2020", Feedback: 'Development in previous...' },
  //   { name: "Jane Cooper", phoneNumber: "234-567-8901", email: "jane@example.com", role: "User", slotTime: "08:20 pm", slotDate: "9 Sep, 2020", Feedback: 'The key to surviving this' },
  //   { name: "Robert Fox", phoneNumber: "345-678-9012", email: "robert@example.com", role: "User", slotTime: "08:20 pm", slotDate: "10 Sep, 2020", Feedback: 'The key to surviving this' },
  //   { name: "Jenny Wilson", phoneNumber: "456-789-0123", email: "jenny@example.com", role: "User", slotTime: "08:20 pm", slotDate: "11 Sep, 2020", Feedback: 'The key to surviving this' },
  //   { name: "Wade Warren", phoneNumber: "567-890-1234", email: "wade@example.com", role: "User", slotTime: "08:20 am", slotDate: "12 Sep, 2020", Feedback: 'The key to surviving this' },
  //   { name: "Esther Howard", phoneNumber: "678-901-2345", email: "esther@example.com", role: "User", slotTime: "08:20 pm", slotDate: "13 Sep, 2020", Feedback: 'The key to surviving this' },
  //   { name: "Cameron Williamson", phoneNumber: "789-012-3456", email: "cameron@example.com", role: "User", slotTime: "08:20 pm", slotDate: "14 Sep, 2020", Feedback: 'Development in previous...' },
  //   { name: "Brooklyn Simmons", phoneNumber: "890-123-4567", email: "brooklyn@example.com", role: "User", slotTime: "08:20 pm", slotDate: "15 Sep, 2020", Feedback: 'Development in previous...' },
  //   { name: "Leslie Alexander", phoneNumber: "901-234-5678", email: "leslie@example.com", role: "User", slotTime: "08:20 am", slotDate: "16 Sep, 2020", Feedback: 'Development in previous...' },
  //   { name: "Guy Hawkins", phoneNumber: "012-345-6789", email: "guy@example.com", role: "User", slotTime: "08:20 pm", slotDate: "17 Sep, 2020", Feedback: 'Development in previous...' },
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
    if (selectedRows.length === filteredUsers.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredUsers.map((_, index) => indexOfFirstItem + index));
    }
  };

 // Fix 4: Deleting all selected rows
 const handleDeleteSelected = () => {
  setDeleteItemName('all selected guest users');
  setDeleteFunction(() => async () => {
    try {
      await Promise.all(selectedRows.map(index => deleteGuestUser(filteredUsers[index].phoneNumber)));
      setSelectedRows([]);
      toast.success('Selected guest users deleted successfully');
      setIsDeleteModalOpen(false);
      fetchGuestUsers(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting selected guest users:', error);
      toast.error('Failed to delete selected guest users');
    }
  });
  setIsDeleteModalOpen(true);
};

  // Fix 1: Deleting a single row
  const handleDeleteClick = (phoneNumber, userName) => {
    setDeleteItemName(userName);
    setDeleteFunction(() => async () => {
      try {
        await deleteGuestUser(phoneNumber);
        toast.success('Guest user deleted successfully');
        setIsDeleteModalOpen(false);
        fetchGuestUsers(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting guest user:', error);
        toast.error('Failed to delete guest user');
      }
    });
    setIsDeleteModalOpen(true);
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

// useEffect(() => {
//   const handleClickOutside = (event) => {
//     if (StatusDropdownRef.current && !StatusDropdownRef.current.contains(event.target)) {
//       setIsStatusDropdownOpen(false);
//     }
//   };

//   document.addEventListener('mousedown', handleClickOutside);
//   return () => {
//     document.removeEventListener('mousedown', handleClickOutside);
//   };
// }, []);


   // Fix 2: Saving edits
   const handleSaveEdit = (updatedUser) => {
    const updatedUsers = users.map((user, index) => 
      index === editingIndex ? updatedUser : user
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setIsEditModalOpen(false);
    setEditingUser(null);
    setEditingIndex(null);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
    setEditingIndex(null);
  };

  const handleEditClick = (user, index) => {
    setEditingUser({ ...user });
    setEditingIndex(index);
    setIsEditModalOpen(true);
  };

  // Fix 3: Sort status dropdown
  
  // const handleAmenitySelect = (status) => {
  //   setSelectedStatus(status);
  //   setIsStatusDropdownOpen(false);

  //   let filtered;
  //   if (status === "Sort Status") {
  //     filtered = bookings;
  //   } else {
  //     filtered = bookings.filter(booking => booking.status.toLowerCase() === status.toLowerCase());
  //   }
  //   setFilteredBookings(filtered);
  //   setCurrentPage(1);
  // };

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


const handleRoleSelect = (role) => {
  setSelectedRole(role);
  setIsRoleDropdownOpen(false);

  let filtered;
  if (role === "Sort Role") {
    filtered = users;
  } else {
    filtered = users.filter(user => user.role.toLowerCase() === role.toLowerCase());
  }
  setFilteredUsers(filtered);
  setCurrentPage(1);
};

  
  // useEffect(()=>{
  //   setFilteredBookings(bookings)
  // },[])

//   const handleSearch = (term) => {
//     setSearchTerm(term);
//     if (term.trim() === "") {
//       setFilteredUsers(users);
//     } else {
//       const filtered = users.filter((user) => 
//         user.name.toLowerCase().includes(term.toLowerCase()) ||
//         user.email.toLowerCase().includes(term.toLowerCase())
//       );
//       setFilteredUsers(filtered);
//     }
//     setCurrentPage(1);
//   };

//   const handleItemClick =(booking)=>{
// setSearchTerm(booking.name);
// setFilteredBookings([booking])
// setCurrentPage(1);
//   }
// const handleSearch = (term) => {
//   setSearchTerm(term);
//   if (term.trim() === "") {
//     setFilteredUsers(users);
//   } else {
//     const filtered = users.filter((user) => 
//       user.name.toLowerCase().includes(term.toLowerCase()) ||
//       user.email.toLowerCase().includes(term.toLowerCase())
//     );
//     setFilteredUsers(filtered);
//   }
//   setCurrentPage(1);
// };
const handleSearch = (term) => {
  setSearchTerm(term);
  if (term.trim() === "") {
    setFilteredUsers(users);
  } else {
    const filtered = users.filter((user) => 
      user.firstName.toLowerCase().includes(term.toLowerCase()) ||
      (user.lastName && user.lastName.toLowerCase().includes(term.toLowerCase())) ||
      user.email.toLowerCase().includes(term.toLowerCase()) ||
      user.phoneNumber.includes(term)
    );
    setFilteredUsers(filtered);
  }
  setCurrentPage(1);
};



  const getAmenityStyle = (amenity) => {
    switch(amenity) {
      case 'Swimming pool':
        return { backgroundColor: 'var(--Blue-25, #EFF6FF)', color: 'var(--Blue-700, #1E40AF)' };
      case 'Tennis court':
        return { backgroundColor: 'var(--Emerald-25, #F0FDF4)', color: 'var(--Emerald-700, #166534)' };
      case 'Mini theater':
        return { backgroundColor: 'var(--Rose-25, #FFF1F2)', color: 'var(--Rose-700, #9F1239)' };
      default:
        return { backgroundColor: '#F3F4F6', color: '#4B5563' }; // Default gray styling
    }
  };

  // Add these style definitions
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
    width: '242px'
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
    '&:hover': {
      backgroundColor: '#F3F4F6',
    },
    color: 'var(--Gray-400, #6B7280)',
    fontSize: '14px',
    borderBottom: '1px solid var(--Gray-100, #E5E7EB)'
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
  

  return (
    <div className="mt-1 bg-white border rounded-lg overflow-hidden flex flex-col h-full">
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
              <th scope="col" className="p-4" style={{width:'40px'}}>
                <div className="flex items-center justify-center">
                  <CheckboxWithTick
                    isSelected={isAllSelected}
                    onClick={handleSelectAll}
                  />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '200px'}}>Name</th>
              <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '150px'}}>Phone number</th>
              <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '200px'}}>Email</th>
              <th scope="col" className="px-6 py-3 text-right" style={{minWidth: '120px'}}>
                <span
                  style={{
                    visibility: selectedRows.length > 1 ? 'visible' : 'hidden',
                    cursor: 'pointer',
                    color: '#EF4444',
                  }}
                  onClick={handleDeleteSelected}
                >
                  Delete All
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">
                  <div className="animate-pulse flex justify-center items-center mt-[100px]">
                    <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                    <div className="h-4 w-4 bg-gray-200 rounded-full mx-2"></div>
                    <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-red-500">{error}</td>
              </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((user, index) => {
                const actualIndex = indexOfFirstItem + index;
                const isSelected = selectedRows.includes(actualIndex);
                return (
                  <tr key={user.id} className="bg-white border-b hover:bg-gray-50" style={{fontSize:'14px'}}>
                    <td className="p-4" style={{width:'40px'}}>
                      <div className="flex items-center justify-center">
                        <CheckboxWithTick
                          isSelected={isSelected}
                          onClick={() => handleRowSelect(actualIndex)}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900" style={{minWidth: '200px'}}>
                      {/* {`${user.firstName} ${user.lastName || ''}`} */}             
                       {/* ${user.firstName || ''} ${user.lastName || ''} */}

                      {truncateText(` ${user.firstName || ''} ${user.lastName || ''}`, 20)}

                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" style={{minWidth: '150px'}}>{user.phoneNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap" style={{minWidth: '200px'}}>{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right" style={{minWidth: '120px'}}>
                      <button onClick={() => handleDeleteClick(user.phoneNumber, `${user.firstName} ${user.lastName || ''}`)}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.875 3.75H3.125C2.95924 3.75 2.80027 3.81585 2.68306 3.93306C2.56585 4.05027 2.5 4.20924 2.5 4.375C2.5 4.54076 2.56585 4.69973 2.68306 4.81694C2.80027 4.93415 2.95924 5 3.125 5H3.75V16.25C3.75 16.5815 3.8817 16.8995 4.11612 17.1339C4.35054 17.3683 4.66848 17.5 5 17.5H15C15.3315 17.5 15.6495 17.3683 15.8839 17.1339C16.1183 16.8995 16.25 16.5815 16.25 16.25V5H16.875C17.0408 5 17.1997 4.93415 17.3169 4.81694C17.4342 4.69973 17.5 4.54076 17.5 4.375C17.5 4.20924 17.4342 4.05027 17.3169 3.93306C17.1997 3.81585 17.0408 3.75 16.875 3.75ZM15 16.25H5V5H15V16.25ZM6.25 1.875C6.25 1.70924 6.31585 1.55027 6.43306 1.43306C6.55027 1.31585 6.70924 1.25 6.875 1.25H13.125C13.2908 1.25 13.4497 1.31585 13.5669 1.43306C13.6842 1.55027 13.75 1.70924 13.75 1.875C13.75 2.04076 13.6842 2.19973 13.5669 2.31694C13.4497 2.43415 13.2908 2.5 13.125 2.5H6.875C6.70924 2.5 6.55027 2.43415 6.43306 2.31694C6.31585 2.19973 6.25 2.04076 6.25 1.875Z" fill="#EF4444"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500" style={{ height: '300px' }}>
                  <div className="flex flex-col items-center justify-center h-full">
                    <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="text-lg font-semibold">No Users found</p>
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

export default GuestTable;






//     <div className="mt-1 bg-white border  rounded-lg overflow-hidden">
//       <div className="flex justify-between  p-6">
//         {/* <div className="text-gray-900">
//           <h1 className="font-bold text-base" style={{color: 'var(--Gray-900, #030712)', fontStyle:'normal', fontWeight:'500', lineHeight:'24px',fontSize:'16px'}}>Recent Booking</h1>
//           <span className="text-gray-400 text-xs" style={{color: 'var(--Gray-400, #6B7280)', fontStyle:'normal', fontWeight:'400', lineHeight:'18px',fontSize:'12px'}}>
//             View all your recent Booking
//           </span>
//         </div>
//         <button className="text-xs font-semibold text-gray-700 underline flex items-center" style={{color: 'var(--Gray-900, #030712)', fontStyle:'normal', fontWeight:'600', lineHeight:'18px'}}>
//           View all
//           <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//             <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//           </svg>
//         </button> */}
//          <div>
//             <SearchInput/>

//          </div>
//          <div className='flex justify-end'>
         

//                 {/* <SortButton/> */}
//                 <button style={{
//       display: 'flex',
//       width: '242px',
//       padding: '8px 16px',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       border: '1px solid #D1D5DB',
//       borderRadius: '10px',
//       color: '#6B7280',
//       fontSize: '16px',
//       fontFamily: 'Plus Jakarta Sans, sans-serif',
//       marginLeft:'10px'
//     }}>
//       <div style={{ display: 'flex', alignItems: 'center' }}>
//         <span className='mr-3'>
//           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
//             <path d="M9.19254 13.3078C9.25065 13.3659 9.29674 13.4348 9.3282 13.5107C9.35965 13.5865 9.37584 13.6679 9.37584 13.75C9.37584 13.8321 9.35965 13.9135 9.3282 13.9893C9.29674 14.0652 9.25065 14.1341 9.19254 14.1922L6.69254 16.6922C6.63449 16.7503 6.56556 16.7964 6.48969 16.8279C6.41381 16.8593 6.33248 16.8755 6.25035 16.8755C6.16821 16.8755 6.08688 16.8593 6.01101 16.8279C5.93514 16.7964 5.86621 16.7503 5.80816 16.6922L3.30816 14.1922C3.25009 14.1341 3.20403 14.0652 3.1726 13.9893C3.14118 13.9134 3.125 13.8321 3.125 13.75C3.125 13.6679 3.14118 13.5866 3.1726 13.5107C3.20403 13.4348 3.25009 13.3659 3.30816 13.3078C3.42544 13.1905 3.5845 13.1247 3.75035 13.1247C3.83247 13.1247 3.91379 13.1408 3.98966 13.1723C4.06553 13.2037 4.13447 13.2497 4.19253 13.3078L5.62535 14.7414V3.75C5.62535 3.58424 5.6912 3.42527 5.80841 3.30806C5.92562 3.19085 6.08459 3.125 6.25035 3.125C6.41611 3.125 6.57508 3.19085 6.69229 3.30806C6.8095 3.42527 6.87535 3.58424 6.87535 3.75V14.7414L8.30816 13.3078C8.36621 13.2497 8.43514 13.2036 8.51101 13.1722C8.58688 13.1407 8.66821 13.1245 8.75035 13.1245C8.83248 13.1245 8.91381 13.1407 8.98969 13.1722C9.06556 13.2036 9.13449 13.2497 9.19254 13.3078ZM16.6925 5.80782L14.1925 3.30782C14.1345 3.24971 14.0656 3.20361 13.9897 3.17215C13.9138 3.1407 13.8325 3.12451 13.7503 3.12451C13.6682 3.12451 13.5869 3.1407 13.511 3.17215C13.4351 3.20361 13.3662 3.24971 13.3082 3.30782L10.8082 5.80782C10.6909 5.92509 10.625 6.08415 10.625 6.25C10.625 6.41586 10.6909 6.57492 10.8082 6.69219C10.9254 6.80947 11.0845 6.87535 11.2503 6.87535C11.4162 6.87535 11.5753 6.80947 11.6925 6.69219L13.1253 5.2586V16.25C13.1253 16.4158 13.1912 16.5747 13.3084 16.6919C13.4256 16.8092 13.5846 16.875 13.7503 16.875C13.9161 16.875 14.0751 16.8092 14.1923 16.6919C14.3095 16.5747 14.3753 16.4158 14.3753 16.25V5.2586L15.8082 6.69219C15.9254 6.80947 16.0845 6.87535 16.2503 6.87535C16.4162 6.87535 16.5753 6.80947 16.6925 6.69219C16.8098 6.57492 16.8757 6.41586 16.8757 6.25C16.8757 6.08415 16.8098 5.92509 16.6925 5.80782Z" fill="#6B7280"/>
//           </svg>
//         </span>
//         <span>Sort role</span>
//       </div>
//       <span>
//         <svg className='flex text-end justify-end' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
//           <path d="M16.2345 7.06754L9.98453 13.3175C9.92648 13.3756 9.85755 13.4217 9.78168 13.4532C9.7058 13.4847 9.62447 13.5008 9.54234 13.5008C9.46021 13.5008 9.37888 13.4847 9.303 13.4532C9.22713 13.4217 9.1582 13.3756 9.10015 13.3175L2.85015 7.06754C2.73288 6.95026 2.66699 6.7912 2.66699 6.62535C2.66699 6.4595 2.73288 6.30044 2.85015 6.18316C2.96743 6.06588 3.12649 6 3.29234 6C3.45819 6 3.61725 6.06588 3.73453 6.18316L9.54234 11.9918L15.3502 6.18316C15.4082 6.12509 15.4772 6.07903 15.553 6.0476C15.6289 6.01617 15.7102 6 15.7923 6C15.8745 6 15.9558 6.01617 16.0317 6.0476C16.1075 6.07903 16.1765 6.12509 16.2345 6.18316C16.2926 6.24123 16.3387 6.31017 16.3701 6.38604C16.4015 6.46191 16.4177 6.54323 16.4177 6.62535C16.4177 6.70747 16.4015 6.78879 16.3701 6.86466C16.3387 6.94053 16.2926 7.00947 16.2345 7.06754Z" fill="#6B7280"/>
//         </svg>
//       </span>
//     </button>

//                 {/* <button className='flex text-end justify-end ml-[10px]' style={{display:'flex',padding:'8px 16px', justifyContent:'center', alignItems:'center', border:'1px solid #D1D5DB',borderRadius:'10px', color:'#6B7280', fontSize:'16px', fontFamily:'Plus_Jakarta'}}>
                
//                 Filter
//                 </button> */}
//          </div>





                
//       </div>
//       <div className="overflow-x-auto">
//         <div className="max-h-[430px] overflow-y-auto" style={hideScrollbarStyle}>
//         <table className="w-full text-sm text-gray-500">
//         <thead className="text-xs text-gray-500 bg-gray-50 sticky top-0 z-10" style={{fontSize:'12px'}}>
//         <tr className="border-y">
//           <th scope="col" className="justify-center text-center">
//             <div className="flex items-center justify-center text-center mt-1">
//               <span style={{width:'20px', height:'20px', padding:'1px', marginLeft:'10px', border:'1px solid #6B7280', gap:'8px', alignItems:'center', borderRadius:'6px'}}></span>
//             </div>
//           </th>
//           <th scope="col" className="px-6 py-3 text-start" style={{fontSize:'12px'}}>
//             Name
//           </th>
//           <th scope="col" className="px-6 py-3">
//             <div className="flex text-center items-center">
//               Phone Number
//             </div>
//           </th>
//           <th scope="col" className="px-6 py-3">
//             <div className="flex text-center items-center">
//               Email
//             </div>
//           </th>
//           <th scope="col" className="px-6 py-3">
//             <div className="flex text-center items-center">
//               Role
//               <svg className="ml-2" xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
//                 <path d="M8.66699 3.66667V12M8.66699 12L4.66699 8M8.66699 12L12.667 8" stroke="#4B5563" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//             </div>
//           </th>
//           <th scope="col" className="px-6 py-3 text-right">
//             Delete All
//           </th>
//         </tr>
//       </thead>
//             <tbody>
//               {bookings.map((booking, index) => (
//                 <tr key={index} className="bg-white border-b hover:bg-gray-50" style={{fontSize:'14px'}}>
//                   <td className="w-4 p-4">
//                     <div className="flex items-center">
//                       <span style={{width:'20px', height:'20px', padding:'1px', marginLeft:'10px', border:'1px solid #6B7280', gap:'8px', alignItems:'center', borderRadius:'6px'}}></span>
//                     </div>
//                   </td>
//                   <th scope="row" className="px-6 flex text-start py-4 font-medium text-gray-900 whitespace-nowrap">
//                     {booking.name}
//                   </th>
//                   <td className="px-6 py-4">{booking.phoneNumber}</td>
//                   <td className="px-6 py-4">{booking.email}</td>
//                   <td className="px-6 py-4">
//                     <span className="text-center align-baseline inline-flex px-4 py-3 mr-auto items-center font-semibold text-[.95rem] leading-none rounded-lg" style={{padding:'4px 12px', fontSize:'14px', color: 'var(--Gray-500, #4B5563)'}}>
//                       {booking.role}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 flex justify-end mt-2">
//                   <svg className="ml-6" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path d="M17.7586 5.73201L14.268 2.24061C14.1519 2.1245 14.0141 2.0324 13.8624 1.96957C13.7107 1.90673 13.5482 1.87439 13.384 1.87439C13.2198 1.87439 13.0572 1.90673 12.9056 1.96957C12.7539 2.0324 12.6161 2.1245 12.5 2.24061L2.86641 11.875C2.74983 11.9906 2.65741 12.1283 2.59451 12.28C2.5316 12.4317 2.49948 12.5944 2.50001 12.7586V16.25C2.50001 16.5815 2.6317 16.8994 2.86612 17.1339C3.10054 17.3683 3.41849 17.5 3.75001 17.5H7.24141C7.40563 17.5005 7.5683 17.4684 7.71999 17.4055C7.87168 17.3426 8.00935 17.2502 8.12501 17.1336L17.7586 7.49998C17.8747 7.3839 17.9668 7.24609 18.0296 7.09442C18.0925 6.94274 18.1248 6.78017 18.1248 6.616C18.1248 6.45182 18.0925 6.28925 18.0296 6.13758C17.9668 5.9859 17.8747 5.84809 17.7586 5.73201ZM7.24141 16.25H3.75001V12.7586L10.625 5.88358L14.1164 9.37498L7.24141 16.25ZM15 8.49061L11.5086 4.99998L13.3836 3.12498L16.875 6.61561L15 8.49061Z" fill="#6B7280"/>
//           </svg>
//                     <svg className="ml-6" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                       <path d="M16.875 3.75H3.125C2.95924 3.75 2.80027 3.81585 2.68306 3.93306C2.56585 4.05027 2.5 4.20924 2.5 4.375C2.5 4.54076 2.56585 4.69973 2.68306 4.81694C2.80027 4.93415 2.95924 5 3.125 5H3.75V16.25C3.75 16.5815 3.8817 16.8995 4.11612 17.1339C4.35054 17.3683 4.66848 17.5 5 17.5H15C15.3315 17.5 15.6495 17.3683 15.8839 17.1339C16.1183 16.8995 16.25 16.5815 16.25 16.25V5H16.875C17.0408 5 17.1997 4.93415 17.3169 4.81694C17.4342 4.69973 17.5 4.54076 17.5 4.375C17.5 4.20924 17.4342 4.05027 17.3169 3.93306C17.1997 3.81585 17.0408 3.75 16.875 3.75ZM15 16.25H5V5H15V16.25ZM6.25 1.875C6.25 1.70924 6.31585 1.55027 6.43306 1.43306C6.55027 1.31585 6.70924 1.25 6.875 1.25H13.125C13.2908 1.25 13.4497 1.31585 13.5669 1.43306C13.6842 1.55027 13.75 1.70924 13.75 1.875C13.75 2.04076 13.6842 2.19973 13.5669 2.31694C13.4497 2.43415 13.2908 2.5 13.125 2.5H6.875C6.70924 2.5 6.55027 2.43415 6.43306 2.31694C6.31585 2.19973 6.25 2.04076 6.25 1.875Z" fill="#EF4444"/>
//                     </svg>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//       </div>

//       {/* Pagination */}
//       <div className="flex mt-[-2px] justify-between items-center px-6 py-3 border-t">
//         <div className="text-sm text-gray-700" style={{color: 'var(--Gray-700, #1F2937)',fontSize:'14px', fontWeight:'600'}}>
//           Page {currentPage} of {totalPages}
//         </div>
//         <div className="flex space-x-2">
//           <button
//             onClick={handlePrevious}
//             disabled={currentPage === 1}
//             className={`px-3 py-1 border rounded ${
//               currentPage === 1 ? 'bg-gray-100 #6B7280' : 'bg-white text-gray-700 hover:bg-gray-50'
//             }`} style={{fontSize:'14px', border:'1px solid #D1D5DB'}}
//           >
//             Previous
//           </button>
//           <button
//             onClick={handleNext}
//             disabled={currentPage === totalPages}
//             className={`px-3 py-1 border rounded ${
//               currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50' 
//             }`} style={{fontSize:'14px',border:'1px solid #D1D5DB'}}
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SpecialReqTable;