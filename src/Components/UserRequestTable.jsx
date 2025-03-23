import React, { useState, useEffect, useRef } from 'react';
import { collection, query, onSnapshot, getFirestore, orderBy, deleteDoc, doc, updateDoc, getDoc, getDocs, where, arrayUnion } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import SortButton from '../Buttons/Sortdate';
import DeleteModal from '../Modals/DeleteModal';
import { useNavigate } from 'react-router-dom';


const SearchInput = ({ requests, onSearch, userDetails }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
  
    const handleInputChange = (e) => {
      const value = e.target.value;
      setSearchTerm(value);
      setShowDropdown(value.length > 0);
      onSearch(value);
    };
  
    const handleItemClick = (request) => {
      const user = userDetails[request.phoneNumber] || {};
      const searchValue = user.firstName ? `${user.firstName} ${user.lastName}` : 
                         (request.phoneNumber || request.flatNumber || '');
      setSearchTerm(searchValue);
      setShowDropdown(false);
      onSearch(request);
    };
  
    const filteredRequests = requests.filter((request) => {
      const searchLower = searchTerm.toLowerCase();
      const user = userDetails[request.phoneNumber] || {};
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
      
      return (
        fullName.includes(searchLower) ||
        request.phoneNumber?.toLowerCase().includes(searchLower) ||
        request.flatNumber?.toString().toLowerCase().includes(searchLower)
      );
    });
  
    return (
      <div className="relative w-full sm:w-[250px] md:w-[300px] z-50" style={{ fontFamily: 'Plus_Jakarta' }}>
        <div className="flex items-center justify-between p-2 sm:py-2 border border-[#D1D5DB] rounded-[10px] text-[#6B7280] text-sm sm:text-base" style={{ backgroundColor: '#F3F3F3', fontFamily: 'Plus_Jakarta' }}>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleInputChange}
            className="w-full bg-transparent border-none outline-none shadow-none text-inherit font-inherit text-sm sm:text-base"
            style={{ border: "none", outline: "none", boxShadow: "none", fontSize: "16px" }}
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
        {showDropdown && filteredRequests.length > 0 && (
          <div className="absolute w-full mt-2 sm:mt-3 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-y-auto">
            {filteredRequests.map((request, index) => {
              const user = userDetails[request.phoneNumber] || {};
              const displayName = user.firstName ? `${user.firstName} ${user.lastName}` : 'N/A';
              
              return (
                <div
                  key={index}
                  className="px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-100 cursor-pointer border-b border-[#E5E7EB] last:border-b-0"
                  onClick={() => handleItemClick(request)}
                >
                  <div className="font-medium flex justify-between text-sm sm:text-base text-[#6B7280]">
                    <span>{displayName}</span>
                    <span>{request.wing || 'N/A'} - {request.flatNumber || 'N/A'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

const FlatRequestsTable = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateSortDirection, setDateSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemName, setDeleteItemName] = useState('');
  const [deleteFunction, setDeleteFunction] = useState(null);
  const [userDetails, setUserDetails] = useState({});

  const db = getFirestore(getApp());
  const sortDateRef = useRef(null);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const requestsQuery = query(collection(db, 'flatRequests'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRequests(requestsData);
      filterRequests(requestsData);
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    const fetchUserDetails = async () => {
      const usersQuery = query(collection(db, 'users'));
      const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
        const users = {};
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          if (data.phoneNumber) {
            users[data.phoneNumber] = {
              firstName: data.firstName || '',
              lastName: data.lastName || ''
            };
          }
        });
        setUserDetails(users);
      });
      return () => unsubscribe();
    };
  
    fetchUserDetails();
  }, []);

  const filterRequests = (data) => {
    let filtered = data;
  
    if (searchTerm) {
      filtered = filtered.filter(request => {
        const searchLower = searchTerm.toLowerCase();
        const user = userDetails[request.phoneNumber] || {};
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
        
        return (
          fullName.includes(searchLower) ||
          request.phoneNumber?.toLowerCase().includes(searchLower) ||
          request.flatNumber?.toString().toLowerCase().includes(searchLower) ||
          `${request.wing || ''}-${request.flatNumber || ''}`.toLowerCase().includes(searchLower)
        );
      });
    }
  
    filtered.sort((a, b) => {
      const dateA = a.createdAt ? a.createdAt.toDate().getTime() : 0;
      const dateB = b.createdAt ? b.createdAt.toDate().getTime() : 0;
      return dateSortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
  
    setFilteredRequests(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    filterRequests(requests);
  }, [searchTerm, dateSortDirection, userDetails]);


  // const handleStatusChange = async (requestId, newStatus) => {
  //   try {
  //     await updateDoc(doc(db, "flatRequests", requestId), {
  //       status: newStatus
  //     });
  //     toast.success("Status updated successfully");
  //   } catch (error) {
  //     console.error("Error updating status:", error);
  //     toast.error("Failed to update status");
  //   }
  // };
  // const handleStatusChange = async (requestId, newStatus, phoneNumber) => {
  //   try {
  //     // First update the status in Firestore
  //     await updateDoc(doc(db, "flatRequests", requestId), {
  //       status: newStatus
  //     });
      
  //     // If status is changed to Approved, send notification to the user
  //     if (newStatus === 'Approved') {
  //       // Send notification to the user
  //       const notificationData = {
  //         phoneNumber: phoneNumber,
  //         title: "Flat Request Approved",
  //         body: "Your flat request has been approved. Welcome to the community!",
  //         additionalData: {
  //           type: "flat_request", 
  //           requestId: requestId,
  //           status: "approved"
  //         }
  //       };
        
  //       try {
  //         // Call the server API to send notification
  //         const response = await fetch('http://localhost:5000/api/send-user-notification', {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify(notificationData),
  //         });
          
  //         const result = await response.json();
  //         if (result.error) {
  //           console.error("Notification error:", result.error);
  //         } else {
  //           console.log("Notification sent successfully");
  //         }
  //       } catch (notificationError) {
  //         console.error("Error sending notification:", notificationError);
  //         // Don't throw here, as we've already updated the status
  //       }
  //     }
      
  //     toast.success("Status updated successfully");
  //   } catch (error) {
  //     console.error("Error updating status:", error);
  //     toast.error("Failed to update status");
  //   }
  // };
  const handleStatusChange = async (requestId, newStatus, phoneNumber, flatDetails) => {
    try {
      // Get the full request details
      const requestRef = doc(db, 'flatRequests', requestId);
      const requestSnap = await getDoc(requestRef);
      
      if (!requestSnap.exists()) {
        toast.error("Request not found");
        return;
      }
      
      const requestData = requestSnap.data();
      
      // Find the user document
      const userQuery = query(
        collection(db, 'users'),
        where('phoneNumber', '==', phoneNumber)
      );
      const userSnap = await getDocs(userQuery);
  
      if (userSnap.empty) {
        toast.error('User not found');
        return;
      }
  
      const userDoc = userSnap.docs[0];
      const userData = userDoc.data();
      const userRef = doc(db, 'users', userDoc.id);
  
      // Prepare the flat request details
      const flatRequestDetails = {
        flatId: requestData.flatId,
        flatNumber: flatDetails.flatNumber,
        wing: flatDetails.wing
      };
  
      if (newStatus === 'Approved') {
        // 1. Update user's flats document
        // Ensure flats and its sub-fields exist
        const currentFlats = userData.flats || {};
        const currentPending = currentFlats.pending || [];
        const currentApproved = currentFlats.approved || [];
  
        // Remove the specific flat from pending
        const updatedPending = currentPending.filter(
          flat => flat.flatId !== flatRequestDetails.flatId
        );
  
        // Add the flat to approved
        const updatedApproved = [...currentApproved, flatRequestDetails];
  
        // Update the entire flats structure in users
        await updateDoc(userRef, {
          flats: {
            ...currentFlats,
            pending: updatedPending,
            approved: updatedApproved
          }
        });
        
        // If documents exist, add them to the user's document
        if (requestData.documents) {
          await updateDoc(userRef, {
            documents: requestData.documents
          });
        }
  
        // 2. Update the flats document to add this user
        const flatRef = doc(db, 'flats', requestData.flatId);
        
        // Determine isResiding based on residenceType (assuming owners are residing unless specified)
        const isResiding = requestData.residenceType === 'tenant' ? false : true;
        
        // Create the new user entry for the flat
        const newUserEntry = {
          userId: phoneNumber,
          role: requestData.residenceType || 'owner', // Use residenceType as role
          isResiding: isResiding
        };
        
        // Add the user to the flat's users array
        await updateDoc(flatRef, {
          users: arrayUnion(newUserEntry),
          updatedAt: new Date()
        });
      } else if (newStatus === 'Rejected') {
        // For rejection, we just update the status in flatRequests
        // You could potentially also update the user's pending list
      } else if (newStatus === 'Pending') {
        // Handle reverting to pending state if needed
      }
      
      // 3. Always update the flat request status
      await updateDoc(requestRef, {
        status: newStatus
      });
      
      // 4. Send notifications
      if (newStatus === 'Approved' || newStatus === 'Rejected') {
        // Prepare notification data based on status
        const title = newStatus === 'Approved' 
          ? "Flat Request Approved" 
          : "Flat Request Status Update";
          
        const body = newStatus === 'Approved'
          ? `Your flat request for ${flatDetails.wing}-${flatDetails.flatNumber} has been approved. Welcome to the community!`
          : `Your flat request for ${flatDetails.wing}-${flatDetails.flatNumber} has been rejected. Please contact support for more information.`;
        
        // Additional data for the notification
        const additionalData = {
          type: "flat_request", 
          requestId: requestId,
          status: newStatus.toLowerCase(),
          wing: flatDetails.wing,
          flatNumber: flatDetails.flatNumber
        };
        
        try {
          // Call the server API to send notification to the specific user
          const response = await fetch('https://puri-dashboard-server.onrender.com/api/send-user-notification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              phoneNumber: phoneNumber,
              title: title,
              body: body,
              additionalData: additionalData
            }),
          });
          
          if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
          }
          
          const result = await response.json();
          if (result.error) {
            console.error("Notification error:", result.error);
          } else {
            console.log(`Notification sent successfully for ${newStatus} status`);
          }
        } catch (notificationError) {
          console.error("Error sending notification:", notificationError);
          // Don't throw here, as we've already updated the status
        }
      }
      
      toast.success(`Status updated to ${newStatus} successfully`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    return phone.startsWith('+91') ? phone.slice(3) : phone;
  };

  // const StatusDropdown = ({ currentStatus, onStatusChange }) => {
  //   const statuses = ['Pending', 'Approved', 'Rejected'];
  //   const [isOpen, setIsOpen] = useState(false);
  
  //   const getStatusStyles = (status) => {
  //     switch (status?.toLowerCase()) {
  //       case 'approved':
  //         return {
  //           container: 'bg-green-50 text-green-700',
  //           dot: 'bg-green-600',
  //           text: 'text-green-700'
  //         };
  //       case 'pending':
  //         return {
  //           container: 'bg-yellow-50 text-yellow-700',
  //           dot: 'bg-yellow-600',
  //           text: 'text-yellow-700'
  //         };
  //       case 'rejected':
  //         return {
  //           container: 'bg-red-50 text-red-700',
  //           dot: 'bg-red-600',
  //           text: 'text-red-700'
  //         };
  //       default:
  //         return {
  //           container: 'bg-gray-50 text-gray-700',
  //           dot: 'bg-gray-600',
  //           text: 'text-gray-700'
  //         };
  //     }
  //   };
  
  //   const styles = getStatusStyles(currentStatus);
  
  //   const handleStatusClick = (e) => {
  //     e.stopPropagation(); // Stop event from bubbling up
  //     setIsOpen(!isOpen);
  //   };
  
  //   const handleStatusChange = (e, newStatus) => {
  //     e.stopPropagation(); // Stop event from bubbling up
  //     onStatusChange(newStatus);
  //     setIsOpen(false);
  //   };
  
  //   return (
  //     <div className="relative status-dropdown" onClick={(e) => e.stopPropagation()}>
  //       <div
  //         onClick={handleStatusClick}
  //         className={`inline-flex items-center gap-2 cursor-pointer px-3 py-1 rounded-full ${styles.container}`}
  //         style={{ fontSize: '12px' }}
  //       >
  //         <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}></span>
  //         <span className={`${styles.text} font-medium`}>{currentStatus || 'N/A'}</span>
  //         <svg
  //           className="w-4 h-4"
  //           fill="none"
  //           stroke="currentColor"
  //           viewBox="0 0 24 24"
  //         >
  //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  //         </svg>
  //       </div>
  //       {isOpen && (
  //         <div className="absolute z-50 mt-1 w-32 bg-white border rounded-md shadow-lg">
  //           {statuses.map((status) => {
  //             const itemStyles = getStatusStyles(status);
  //             return (
  //               <div
  //                 key={status}
  //                 onClick={(e) => handleStatusChange(e, status)}
  //                 className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 flex items-center gap-2 ${
  //                   currentStatus?.toLowerCase() === status.toLowerCase() ? 'bg-gray-50' : ''
  //                 }`}
  //               >
  //                 <span className={`h-1.5 w-1.5 rounded-full ${itemStyles.dot}`}></span>
  //                 <span className={itemStyles.text}>{status}</span>
  //               </div>
  //             );
  //           })}
  //         </div>
  //       )}
  //     </div>
  //   );
  // };
  
  const StatusDropdown = ({ currentStatus, onStatusChange, phoneNumber }) => {
    const statuses = ['Pending', 'Approved', 'Rejected'];
    const [isOpen, setIsOpen] = useState(false);
  
    const getStatusStyles = (status) => {
      switch (status?.toLowerCase()) {
        case 'approved':
          return {
            container: 'bg-green-50 text-green-700',
            dot: 'bg-green-600',
            text: 'text-green-700'
          };
        case 'pending':
          return {
            container: 'bg-yellow-50 text-yellow-700',
            dot: 'bg-yellow-600',
            text: 'text-yellow-700'
          };
        case 'rejected':
          return {
            container: 'bg-red-50 text-red-700',
            dot: 'bg-red-600',
            text: 'text-red-700'
          };
        default:
          return {
            container: 'bg-gray-50 text-gray-700',
            dot: 'bg-gray-600',
            text: 'text-gray-700'
          };
      }
    };
  
    const styles = getStatusStyles(currentStatus);
  
    const handleStatusClick = (e) => {
      e.stopPropagation(); // Stop event from bubbling up
      setIsOpen(!isOpen);
    };
  
    const handleStatusChange = (e, newStatus) => {
      e.stopPropagation(); // Stop event from bubbling up
      onStatusChange(newStatus);
      setIsOpen(false);
    };
  
    return (
      <div className="relative status-dropdown" onClick={(e) => e.stopPropagation()}>
        <div
          onClick={handleStatusClick}
          className={`inline-flex items-center gap-2 cursor-pointer px-3 py-1 rounded-full ${styles.container}`}
          style={{ fontSize: '12px' }}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}></span>
          <span className={`${styles.text} font-medium`}>{currentStatus || 'N/A'}</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {isOpen && (
          <div className="absolute z-50 mt-1 w-32 bg-white border rounded-md shadow-lg">
            {statuses.map((status) => {
              const itemStyles = getStatusStyles(status);
              return (
                <div
                  key={status}
                  onClick={(e) => handleStatusChange(e, status)}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 flex items-center gap-2 ${
                    currentStatus?.toLowerCase() === status.toLowerCase() ? 'bg-gray-50' : ''
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${itemStyles.dot}`}></span>
                  <span className={itemStyles.text}>{status}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const handleSearch = (termOrRequest) => {
    if (typeof termOrRequest === 'string') {
      setSearchTerm(termOrRequest);
    } else {
      // If it's a request object
      const user = userDetails[termOrRequest.phoneNumber] || {};
      const searchValue = user.firstName ? 
        `${user.firstName} ${user.lastName}` : 
        termOrRequest.phoneNumber || 
        `${termOrRequest.wing || ''}-${termOrRequest.flatNumber || ''}`;
      setSearchTerm(searchValue);
    }
  };

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

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const isAllSelected = currentItems.length > 0 && selectedRows.length === currentItems.length;

  const handleDateSort = () => {
    setDateSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
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
    if (isAllSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentItems.map((_, index) => indexOfFirstItem + index));
    }
  };

  const handleDeleteRequest = async (requestId) => {
    try {
      // First, get the request details
      const requestRef = doc(db, "flatRequests", requestId);
      const requestSnap = await getDoc(requestRef);
      
      if (!requestSnap.exists()) {
        toast.error("Request not found");
        return false;
      }
      
      const requestData = requestSnap.data();
      const phoneNumber = requestData.phoneNumber;
      const flatId = requestData.flatId;
      
      // Find the user document
      if (phoneNumber) {
        const userQuery = query(
          collection(db, 'users'),
          where('phoneNumber', '==', phoneNumber)
        );
        
        const userSnap = await getDocs(userQuery);
        
        if (!userSnap.empty) {
          const userDoc = userSnap.docs[0];
          const userData = userDoc.data();
          const userRef = doc(db, 'users', userDoc.id);
          
          // Check if the user has flats data
          if (userData.flats) {
            const currentFlats = { ...userData.flats };
            
            // Remove from pending if present
            if (currentFlats.pending && Array.isArray(currentFlats.pending)) {
              currentFlats.pending = currentFlats.pending.filter(
                flat => flat.flatId !== flatId
              );
            }
            
            // Remove from approved if present
            if (currentFlats.approved && Array.isArray(currentFlats.approved)) {
              currentFlats.approved = currentFlats.approved.filter(
                flat => flat.flatId !== flatId
              );
            }
            
            // Update user document with cleaned flats data
            await updateDoc(userRef, { flats: currentFlats });
            console.log(`Removed flat ${flatId} from user's flats data`);
          }
          
          // If the request status was 'Approved', we may need to remove the user from flat users list
          if (requestData.status === 'Approved') {
            try {
              const flatRef = doc(db, 'flats', flatId);
              const flatSnap = await getDoc(flatRef);
              
              if (flatSnap.exists()) {
                const flatData = flatSnap.data();
                
                if (flatData.users && Array.isArray(flatData.users)) {
                  // Filter out this user from the flat's users array
                  const updatedUsers = flatData.users.filter(
                    user => user.userId !== phoneNumber
                  );
                  
                  // Update the flat document
                  await updateDoc(flatRef, { 
                    users: updatedUsers,
                    updatedAt: new Date()
                  });
                  
                  console.log(`Removed user from flat ${flatId}`);
                }
              }
            } catch (flatError) {
              console.error("Error updating flat document:", flatError);
              // Continue with deletion even if this part fails
            }
          }
        }
      }
      
      // Finally, delete the request from flatRequests collection
      await deleteDoc(requestRef);
      console.log(`Deleted request ${requestId}`);
      
      // Optionally, send a notification about the request deletion
      if (phoneNumber) {
        try {
          const notificationData = {
            phoneNumber: phoneNumber,
            title: "Flat Request Deleted",
            body: `Your flat request for ${requestData.wing}-${requestData.flatNumber} has been removed.`,
            additionalData: {
              type: "flat_request_deleted",
              flatId: flatId,
              wing: requestData.wing,
              flatNumber: requestData.flatNumber
            }
          };
          
          const response = await fetch('https://puri-dashboard-server.onrender.com/api/send-user-notification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(notificationData),
          });
          
          if (response.ok) {
            console.log("Deletion notification sent successfully");
          }
        } catch (notifyError) {
          console.error("Error sending deletion notification:", notifyError);
          // Continue even if notification fails
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting request:", error);
      toast.error("Failed to delete request");
      return false;
    }
  };

  // const handleDeleteSelected = (indices = selectedRows) => {
  //   const selectedCount = Array.isArray(indices) ? indices.length : 1;
  //   setDeleteItemName(`${selectedCount} selected ${selectedCount === 1 ? 'request' : 'requests'}`);
  //   setDeleteFunction(() => async () => {
  //     try {
  //       const requestIds = (Array.isArray(indices) ? indices : [indices]).map(index => {
  //         const relativeIndex = index - indexOfFirstItem;
  //         return currentItems[relativeIndex].id;
  //       });
        
  //       for (const id of requestIds) {
  //         await deleteDoc(doc(db, "flatRequests", id));
  //       }
        
  //       setSelectedRows([]);
  //       toast.success(`${selectedCount} ${selectedCount === 1 ? 'request' : 'requests'} deleted successfully`);
  //       setIsDeleteModalOpen(false);
  //     } catch (error) {
  //       console.error("Error deleting requests:", error);
  //       toast.error("Failed to delete selected requests");
  //     }
  //   });
  //   setIsDeleteModalOpen(true);
  // };

  const handleDeleteSelected = (indices = selectedRows) => {
    const selectedCount = Array.isArray(indices) ? indices.length : 1;
    setDeleteItemName(`${selectedCount} selected ${selectedCount === 1 ? 'request' : 'requests'}`);
    
    setDeleteFunction(() => async () => {
      try {
        const requestIds = (Array.isArray(indices) ? indices : [indices]).map(index => {
          const relativeIndex = index - indexOfFirstItem;
          return currentItems[relativeIndex].id;
        });
        
        let successCount = 0;
        for (const id of requestIds) {
          const success = await handleDeleteRequest(id);
          if (success) successCount++;
        }
        
        setSelectedRows([]);
        
        if (successCount === requestIds.length) {
          toast.success(`${selectedCount} ${selectedCount === 1 ? 'request' : 'requests'} deleted successfully`);
        } else if (successCount > 0) {
          toast.warning(`Deleted ${successCount} out of ${requestIds.length} requests`);
        } else {
          toast.error("Failed to delete selected requests");
        }
        
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error("Error deleting requests:", error);
        toast.error("Failed to delete selected requests");
      }
    });
    
    setIsDeleteModalOpen(true);
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

  return (
    <div className="mt-1 bg-white border rounded-lg overflow-hidden flex flex-col" style={{ position: 'relative', zIndex: 1, fontFamily: 'Plus_Jakarta' }}>
      <div className="sticky top-0 z-20 bg-white">
        <div className="flex flex-col sm:flex-row items-stretch p-6 gap-4 justify-between">
          <SearchInput requests={requests} onSearch={handleSearch} userDetails={userDetails} />
          <div className="w-full sm:w-auto">
            <SortButton onSort={handleSort} ref={sortDateRef}/>
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
                  <th scope="col" className="px-6 py-3 text-left">Phone Number</th>
                  <th scope="col" className="px-6 py-3 text-left">Flat Number</th>
                  <th scope="col" className="px-6 py-3 text-left">Role</th>
                  <th scope="col" className="px-6 py-3 text-left cursor-pointer" onClick={handleDateSort}>
  <div className="flex items-center">
    Date
    <svg 
      className="ml-2" 
      xmlns="http://www.w3.org/2000/svg" 
      width="17" 
      height="16" 
      viewBox="0 0 17 16" 
      fill="none"
    >
      <path 
        d={dateSortDirection === 'asc' 
          ? "M8.66699 12.3333V4M8.66699 4L12.667 8M8.66699 4L4.66699 8" // Up arrow
          : "M8.66699 3.66667V12M8.66699 12L4.66699 8M8.66699 12L12.667 8" // Down arrow
        } 
        stroke="#4B5563" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  </div>
</th>
                  <th scope="col" className="px-6 py-3 text-left">Status</th>
                  {/* <th scope="col" className="px-6 py-3 text-left">Created By</th>
                  <th scope="col" className="px-6 py-3 text-right">Actions</th> */}
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((request, index) => {
              const actualIndex = indexOfFirstItem + index;
              const isSelected = selectedRows.includes(actualIndex);
              const user = userDetails[request.phoneNumber] || {};

              const handleRowClick = () => {
                navigate(`/UserRequests/${request.id}`);
              };
              
              return (
                <tr key={request.id} className="bg-white border-b hover:bg-gray-50 cursor-pointer"  style={{fontSize:'14px'}} 
                
                onClick={handleRowClick}>
                  <td className="p-4 checkbox-cell" style={{width:'40px'}} onClick={(e) => e.stopPropagation()}>
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
                  <td className="px-6 py-4 font-medium text-gray-900">
                  {user ? `${user.firstName || ''} ${user.lastName || ''}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                  {formatPhoneNumber(request.phoneNumber)}
                  </td>
                  <td className="px-6 py-4">
                  {`${request.wing || ''}-${request.flatNumber || ''}`}
                  </td>
                  <td className="px-6 py-4">
                  
                    {request.residenceType || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    {request.createdAt ? dayjs(request.createdAt.toDate()).format('D MMM, YYYY') : 'N/A'}
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
        {/* <StatusDropdown
          currentStatus={request.status}
          onStatusChange={(newStatus) => handleStatusChange(request.id, newStatus)}
        /> */}
         {/* <StatusDropdown
    currentStatus={request.status}
    phoneNumber={request.phoneNumber}
    onStatusChange={(newStatus) => handleStatusChange(request.id, newStatus, request.phoneNumber)}
  /> */}
  <StatusDropdown
    currentStatus={request.status}
    phoneNumber={request.phoneNumber}
    onStatusChange={(newStatus) => handleStatusChange(
      request.id, 
      newStatus, 
      request.phoneNumber, 
      { 
        wing: request.wing || '', 
        flatNumber: request.flatNumber || '' 
      }
    )}
  />
      </td>
                 
                  {/* <td className="px-6 py-4">
                    {request.createdBy?.name || 'N/A'}
                  </td> */}
                  {/* <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteSelected([actualIndex])}
                      className="text-red-600 hover:text-red-800 cursor-pointer"
                    >
                      Delete
                    </button>
                  </td> */}
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
                    <p className="text-lg font-semibold">No flat requests found</p>
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

export default FlatRequestsTable;