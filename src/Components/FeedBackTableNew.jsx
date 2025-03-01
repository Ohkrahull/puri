
// import React, { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import dayjs from 'dayjs';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import SortButton from '../Buttons/Sortdate';
// import { fetchAllFeedback, deleteFeedback } from '../firebase/services/FeedbackService';
// import DeleteModal from '../Modals/DeleteModal';

// // Enhanced CheckboxWithTick component with minus icon support
// const CheckboxWithTick = ({ isSelected, onClick, isMinusIcon = false }) => (
//   <div
//     onClick={onClick}
//     className="w-5 h-5 border border-gray-400 rounded-md flex items-center justify-center cursor-pointer"
//     style={{ backgroundColor: isSelected ? '#F3F4F6' : 'white' }}
//   >
//     {isSelected && (
//       isMinusIcon ? (
//         <svg width="12" height="2" viewBox="0 0 12 2" fill="none">
//           <path d="M1 1H11" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"/>
//         </svg>
//       ) : (
//         <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
//           <path d="M10 3L4.5 8.5L2 6" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//         </svg>
//       )
//     )}
//   </div>
// );

// // Search input component
// const SearchInput = ({ feedbackList, onSearch }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showDropdown, setShowDropdown] = useState(false);

//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);
//     setShowDropdown(value.length > 0);
//     onSearch(value);
//   };

//   const handleItemClick = (feedback) => {
//     setSearchTerm(`${feedback.userInfo.firstName} ${feedback.userInfo.lastName}`);
//     setShowDropdown(false);
//     onSearch(`${feedback.userInfo.firstName} ${feedback.userInfo.lastName}`);
//   };

//   const filteredFeedback = feedbackList.filter(
//     (feedback) =>
//       `${feedback.userInfo?.firstName || ''} ${feedback.userInfo?.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       feedback.feedbackText?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const truncateText = (text, charLimit = 20) => {
//     if (text.length <= charLimit) {
//       return text;
//     }
    
//     // Find the last space within the character limit
//     const lastSpace = text.lastIndexOf(' ', charLimit);
    
//     // If there's a space within the limit, cut at that space
//     if (lastSpace > 0) {
//       return text.slice(0, lastSpace) + '...';
//     }
    
//     // If there's no space (it's one long word), just cut at the character limit
//     return text.slice(0, charLimit) + '...';
//   };

//   const truncateName = (firstName = '', lastName = '') => {
//     const fullName = `${firstName} ${lastName}`.trim();
//     return fullName.length > 14 ? fullName.slice(0, 14) + '...' : fullName || 'N/A';
//   };

//   return (
//     <div className="relative w-full sm:w-[250px] md:w-[300px] z-50">
//     <div
//       className="flex items-center justify-between p-2 sm:py-2 border border-[#D1D5DB] rounded-[10px] text-[#6B7280] text-sm sm:text-base font-['Plus_Jakarta']"
//       style={{ fontFamily: "Plus_Jakarta", backgroundColor:'#F3F3F3' }}
//     >
//         <input
//           type="text"
//           placeholder="Search"
//           value={searchTerm}
//           onChange={handleInputChange}
//           style={{
//             border: 'white',
//             outline: "none",
//             boxShadow: 'none',
//             width: "100%",
//             background: "transparent",
//             color: "inherit",
//             fontSize: "inherit",
//             fontFamily: "inherit",
//           }}
//         />
//         <svg  xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" width="20" height="20" viewBox="0 0 20 20" fill="none">
//           <path d="M17.9419 17.0579L14.0302 13.1469C15.1639 11.7858 15.7293 10.0399 15.6086 8.2725C15.488 6.50512 14.6906 4.85229 13.3823 3.65785C12.074 2.46341 10.3557 1.81932 8.58462 1.85957C6.81357 1.89982 5.12622 2.62131 3.87358 3.87395C2.62094 5.12659 1.89945 6.81394 1.8592 8.58498C1.81895 10.356 2.46304 12.0744 3.65748 13.3827C4.85192 14.6909 6.50475 15.4883 8.27214 15.609C10.0395 15.7297 11.7854 15.1643 13.1466 14.0305L17.0575 17.9422C17.1156 18.0003 17.1845 18.0464 17.2604 18.0778C17.3363 18.1092 17.4176 18.1254 17.4997 18.1254C17.5818 18.1254 17.6631 18.1092 17.739 18.0778C17.8149 18.0464 17.8838 18.0003 17.9419 17.9422C17.9999 17.8842 18.046 17.8152 18.0774 17.7394C18.1089 17.6635 18.125 17.5822 18.125 17.5001C18.125 17.4179 18.1089 17.3366 18.0774 17.2607C18.046 17.1849 17.9999 17.1159 17.9419 17.0579ZM3.12469 8.75006C3.12469 7.63754 3.45459 6.55 4.07267 5.62497C4.69076 4.69995 5.56926 3.97898 6.5971 3.55323C7.62493 3.12749 8.75593 3.0161 9.84707 3.23314C10.9382 3.45018 11.9405 3.98591 12.7272 4.77258C13.5138 5.55925 14.0496 6.56153 14.2666 7.65267C14.4837 8.74382 14.3723 9.87482 13.9465 10.9027C13.5208 11.9305 12.7998 12.809 11.8748 13.4271C10.9497 14.0452 9.86221 14.3751 8.74969 14.3751C7.25836 14.3734 5.82858 13.7802 4.77404 12.7257C3.71951 11.6712 3.12634 10.2414 3.12469 8.75006Z" fill="#6B7280"/>
//         </svg>
//       </div>

//       {showDropdown && filteredFeedback.length > 0 && (
//         <div className="absolute w-full mt-3 bg-white border border-gray-200 rounded-md shadow-lg z-10"
//         style={{
//           maxHeight: filteredFeedback.length > 4 ? '240px' : 'auto',
//           overflowY: filteredFeedback.length > 4 ? 'auto' : 'visible'
//         }}>
//           {filteredFeedback.map((feedback, index) => (
//             <div
//               key={index}
//               className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
//               style={{borderBottom: '1px solid var(--Gray-100, #E5E7EB)'}}
//               onClick={() => handleItemClick(feedback)}
//             >
//               <div className="font-medium flex justify-between" style={{fontSize:'14px', color:'#6B7280'}}>
//                 {/* {`${feedback.userInfo?.firstName || ''} ${feedback.userInfo?.lastName || ''}`} */}
//                 {truncateText(`${feedback.userInfo.firstName} ${feedback.userInfo.lastName}`, 20)}
//                 {/* {truncateText(truncatedName, 20)} */}
//                 <span>{feedback.userInfo.wing} - {feedback.userInfo.flatNumber}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // Main FeedBack Table component
// const FeedBackTableNew = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [feedbackList, setFeedbackList] = useState([]);
//   const [filteredFeedback, setFilteredFeedback] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [deleteItemName, setDeleteItemName] = useState('');
//   const [deleteFunction, setDeleteFunction] = useState(null);
//   const [dateSortDirection, setDateSortDirection] = useState('desc');
//   const sortDateRef = useRef(null);
//   const navigate = useNavigate();
//   const itemsPerPage = 10;

//   // Fetch feedback data
//   useEffect(() => {
//     const unsubscribe = fetchAllFeedback((processedFeedback, error) => {
//       if (error) {
//         console.error("Error fetching feedback:", error);
//         setError("Failed to load feedback. Please try again later.");
//         setIsLoading(false);
//         return;
//       }
      
//       const sortedFeedback = processedFeedback.sort((a, b) => {
//         const dateA = new Date(a.createdAt);
//         const dateB = new Date(b.createdAt);
//         return dateSortDirection === 'asc' ? dateA - dateB : dateB - dateA;
//       });
      
//       setFeedbackList(sortedFeedback);
//       setFilteredFeedback(sortedFeedback);
//       setIsLoading(false);
//     });
  
//     return () => unsubscribe();
//   }, [dateSortDirection]);

//   const handleDateSort = () => {
//     setDateSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
//   };

//   const handleSearch = (term) => {
//     setSearchTerm(term);
//     const filtered = feedbackList.filter(
//       (feedback) =>
//         `${feedback.userInfo?.firstName || ''} ${feedback.userInfo?.lastName || ''}`.toLowerCase().includes(term.toLowerCase()) ||
//         feedback.feedbackText?.toLowerCase().includes(term.toLowerCase())
//     );
//     setFilteredFeedback(filtered);
//     setCurrentPage(1);
//   };

//   const handleSort = (startDate, endDate) => {
//     let filtered = feedbackList;
//     if (startDate || endDate) {
//       filtered = feedbackList.filter(feedback => {
//         const feedbackDate = dayjs(feedback.createdAt);
//         if (startDate && endDate) {
//           return feedbackDate.isAfter(dayjs(startDate)) && feedbackDate.isBefore(dayjs(endDate).add(1, 'day'));
//         } else if (startDate) {
//           return feedbackDate.isAfter(dayjs(startDate));
//         } else if (endDate) {
//           return feedbackDate.isBefore(dayjs(endDate).add(1, 'day'));
//         }
//         return true;
//       });
//     }
    
//     filtered.sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf());
//     setFilteredFeedback(filtered);
//     setCurrentPage(1);
//   };

//   const handleRowSelect = (index) => {
//     setSelectedRows(prev => {
//       if (prev.includes(index)) {
//         return prev.filter(i => i !== index);
//       } else {
//         return [...prev, index];
//       }
//     });
//   };

//   const handleSelectAll = () => {
//     if (selectedRows.length === currentItems.length) {
//       setSelectedRows([]);
//     } else {
//       setSelectedRows(currentItems.map((_, index) => indexOfFirstItem + index));
//     }
//   };

//   const handleDeleteSelected = () => {
//     setDeleteItemName(`${selectedRows.length} selected feedback items`);
//     setDeleteFunction(() => async () => {
//       try {
//         for (const index of selectedRows) {
//           const feedbackToDelete = filteredFeedback[index];
//           await deleteFeedback(feedbackToDelete.id);
//         }
        
//         const updatedFeedback = filteredFeedback.filter((_, index) => !selectedRows.includes(index));
//         setFilteredFeedback(updatedFeedback);
//         setFeedbackList(prevList => prevList.filter(fb => !selectedRows.includes(filteredFeedback.findIndex(f => f.id === fb.id))));
//         setSelectedRows([]);
//         toast.success('Selected feedback deleted successfully');
//         setIsDeleteModalOpen(false);
//       } catch (error) {
//         console.error("Error deleting feedback:", error);
//         toast.error('Failed to delete selected feedback');
//       }
//     });
//     setIsDeleteModalOpen(true);
//   };

//   const totalPages = Math.ceil((filteredFeedback?.length || 0) / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredFeedback?.slice(indexOfFirstItem, indexOfLastItem) || [];
//   const isAllSelected = currentItems.length > 0 && selectedRows.length === currentItems.length;

//   const truncateText = (text, charLimit = 20) => {
//     if (!text || text.length <= charLimit) return text || '';
//     const lastSpace = text.lastIndexOf(' ', charLimit);
//     return lastSpace > 0 ? text.slice(0, lastSpace) + '...' : text.slice(0, charLimit) + '...';
//   };

//   const renderTableContent = () => {
//     if (isLoading) {
//       return (
//         <tr>
//           <td colSpan="6" className="px-6 py-4 text-center">
//             <div className="animate-pulse flex justify-center items-center mt-24">
//               <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
//               <div className="h-4 w-4 bg-gray-200 rounded-full mx-2"></div>
//               <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
//             </div>
//           </td>
//         </tr>
//       );
//     }

//     if (error) {
//       return (
//         <tr>
//           <td colSpan="6" className="px-6 py-4 text-center text-red-500">
//             {error}
//           </td>
//         </tr>
//       );
//     }

//     if (currentItems.length === 0) {
//       return (
//         <tr>
//           <td colSpan="6" className="px-6 py-4 text-center text-gray-500" style={{ height: '300px' }}>
//             <div className="flex flex-col items-center justify-center h-full">
//               <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
//               </svg>
//               <p className="text-lg font-semibold">No Feedback found</p>
//               <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
//             </div>
//           </td>
//         </tr>
//       );
//     }

//     return currentItems.map((feedback, index) => {
//       const actualIndex = indexOfFirstItem + index;
//       const isSelected = selectedRows.includes(actualIndex);
//       const truncatedName = feedback.userInfo 
//         ? truncateText(`${feedback.userInfo.firstName || ''} ${feedback.userInfo.lastName || ''}`, 20)
//         : 'N/A';
      
//       return (
//         <tr 
//           key={feedback.id} 
//           className="bg-white border-b hover:bg-gray-50 cursor-pointer" 
//           onClick={(e) => {
//             if (!e.target.closest('.checkbox-container')) {
//               navigate(`/feedbackForm/${feedback.id}`);
//             }
//           }}
//           style={{fontSize:'14px'}}
//         >
//           <td className="p-4 checkbox-container" onClick={e => e.stopPropagation()}>
//             <div className="flex items-center justify-center">
//               <CheckboxWithTick isSelected={isSelected}
//                 onClick={() => handleRowSelect(actualIndex)}
//               />
//             </div>
//           </td>
//           <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900" style={{minWidth: '120px'}}>
//             {truncatedName}
//           </td>
//           <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900" style={{minWidth: '120px'}}>
//             {/* {feedback.userInfo.wing || "N/A"}-{feedback.userInfo.flatNumber ||"N/A"} */}
//           </td>
//           <td className="px-6 py-4 whitespace-nowrap" style={{minWidth: '120px'}}>
//             {dayjs(feedback.createdAt).format('MMM D, YYYY')}
//           </td>
//           <td className="px-6 py-4 whitespace-nowrap" style={{minWidth: '120px'}}>
//             {dayjs(feedback.createdAt).format('h:mm A')}
//           </td>
//           <td></td>
//         </tr>
//       );
//     });
//   };

//   return (
//     <div className="mt-1 bg-white border rounded-lg overflow-hidden flex flex-col h-full">
//       <div className="sticky top-0 z-20 bg-white">
//         <div className="flex flex-col sm:flex-row justify-between items-center p-6">
//           <div className="w-full sm:w-auto mb-4 sm:mb-0">
//             <SearchInput feedbackList={feedbackList} onSearch={handleSearch} />
//           </div>
//           <div className="w-full sm:w-auto">
//             <SortButton onSort={handleSort} ref={sortDateRef} />
//             {/* <button
//               className="flex justify-end text-center px-4 py-2 border border-gray-300 rounded-lg text-gray-600"
//               style={{
//                 fontSize: '16px',
//                 fontFamily: 'Plus Jakarta Sans, sans-serif',
//               }}
//             >
//               Filter
//             </button> */}
//           </div>
//         </div>
//       </div>
      
//       <div className="flex-grow overflow-auto">
//         <table className="w-full text-sm text-gray-500" style={{ minWidth: '1000px' }}>
//           <thead className="text-xs text-gray-500 bg-gray-50 sticky top-0" style={{fontSize:'12px'}}>
//             <tr className="border-y">
//               {selectedRows.length > 0 ? (
//                 <>
//                   <th scope="col" className="p-4 w-10">
//                     <div className="flex items-center justify-center">
//                       <CheckboxWithTick
//                         isSelected={selectedRows.length > 0}
//                         onClick={handleSelectAll}
//                         isMinusIcon={selectedRows.length > 0 && selectedRows.length < currentItems.length}
//                       />
//                     </div>
//                   </th>
//                   <th scope="col" className="px-6 py-3">
//                     <div className="flex text-gray-600 gap-2">
//                       <span className="font-semibold" style={{color:'#4B5563', fontSize:12}}>{selectedRows.length}</span>
//                       <span className="font-semibold" style={{color:'#4B5563', fontSize:12}}>selected</span>
//                     </div>
//                   </th>
//                   <th scope="col" className="px-6 py-3"></th>
//                   <th scope="col" className="px-6 py-3"></th>
//                   <th scope="col" className="px-6 py-3"></th>
//                   <th scope="col" className="px-6 py-3 text-right">
//                     <span 
//                       onClick={handleDeleteSelected}
//                       className="text-red-600 cursor-pointer hover:text-red-700"
//                     >
//                       Delete
//                     </span>
//                   </th>
//                 </>
//               ) : (
//                 <>
//                   <th scope="col" className="p-4" style={{width:'40px'}}>
//                     <div className="flex items-center justify-center">
//                       <CheckboxWithTick
//                         isSelected={isAllSelected}
//                         onClick={handleSelectAll}
//                       />
//                     </div>
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px'}}>Name</th>
//                   <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px'}}>
//                     <div className="flex items-center cursor-pointer">
//                       Flat Number
//                     </div>
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px'}}>
//                     <div className="flex items-center cursor-pointer" onClick={handleDateSort}>
//                       Date
//                       <svg 
//                         className="ml-2" 
//                         xmlns="http://www.w3.org/2000/svg" 
//                         width="17" 
//                         height="16" 
//                         viewBox="0 0 17 16" 
//                         fill="none"
//                         style={{
//                           transform: dateSortDirection === 'desc' ? 'rotate(180deg)' : 'none',
//                           transition: 'transform 0.3s ease'
//                         }}
//                       >
//                         <path d="M8.66699 3.66667V12M8.66699 12L4.66699 8M8.66699 12L12.667 8" stroke="#4B5563" strokeLinecap="round" strokeLinejoin="round"/>
//                       </svg>
//                     </div>
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px'}}>
//                     <div className="flex items-center cursor-pointer">
//                       Time
//                       <svg 
//                         className="ml-2" 
//                         xmlns="http://www.w3.org/2000/svg" 
//                         width="17" 
//                         height="16" 
//                         viewBox="0 0 17 16" 
//                         fill="none"
//                         style={{
//                           transform: dateSortDirection === 'desc' ? 'rotate(180deg)' : 'none',
//                           transition: 'transform 0.3s ease'
//                         }}
//                       >
//                         <path d="M8.66699 3.66667V12M8.66699 12L4.66699 8M8.66699 12L12.667 8" stroke="#4B5563" strokeLinecap="round" strokeLinejoin="round"/>
//                       </svg>
//                     </div>
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-right" style={{minWidth: '120px'}}></th>
//                 </>
//               )}
//             </tr>
//           </thead>
//           <tbody>
//             {renderTableContent()}
//           </tbody>
//         </table>
//       </div>
      
//       <div className="sticky bottom-0 bg-white flex justify-between items-center px-6 py-3 border-t z-20">
//         <div className="text-sm text-gray-700 font-semibold">
//           Page {currentPage} of {totalPages}
//         </div>
//         <div className="flex space-x-2">
//           <button
//             onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className={`px-3 py-1 border rounded ${
//               currentPage === 1
//                 ? "bg-gray-100 text-gray-400"
//                 : "bg-white text-gray-700 hover:bg-gray-50"
//             }`}
//             style={{ fontSize: "14px", border: "1px solid #D1D5DB" }}
//           >
//             Previous
//           </button>
//           <button
//             onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//             disabled={currentPage === totalPages}
//             className={`px-3 py-1 border rounded ${
//               currentPage === totalPages
//                 ? "bg-gray-100 text-gray-400"
//                 : "bg-white text-gray-700 hover:bg-gray-50"
//             }`}
//             style={{ fontSize: "14px", border: "1px solid #D1D5DB" }}
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       <DeleteModal
//         isOpen={isDeleteModalOpen}
//         onClose={() => setIsDeleteModalOpen(false)}
//         onDelete={deleteFunction}
//         itemName={deleteItemName}
//       />
//     </div>
//   );
// };

// export default FeedBackTableNew;
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SortButton from '../Buttons/Sortdate';
import { collection, getDocs, query, orderBy, where, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import DeleteModal from '../Modals/DeleteModal';

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

// Helper function to get flat display string
const getFlatDisplay = (userInfo) => {
  if (!userInfo) return 'N/A';
  
  // Check for flats.approved array first
  if (userInfo.flats?.approved && Array.isArray(userInfo.flats.approved) && userInfo.flats.approved.length > 0) {
    const flat = userInfo.flats.approved[0]; // Display first approved flat
    return `${flat.wing || ''} - ${flat.flatNumber || ''}`;
  }
  
  // Fallback to wing and flatNumber directly on userInfo
  if (userInfo.wing && userInfo.flatNumber) {
    return `${userInfo.wing} - ${userInfo.flatNumber}`;
  }
  
  return 'N/A';
};

// Search input component
const SearchInput = ({ feedbackList, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length > 0);
    onSearch(value);
  };

  const handleItemClick = (feedback) => {
    setSearchTerm(`${feedback.userInfo?.firstName || ''} ${feedback.userInfo?.lastName || ''}`);
    setShowDropdown(false);
    onSearch(`${feedback.userInfo?.firstName || ''} ${feedback.userInfo?.lastName || ''}`);
  };

  const filteredFeedback = feedbackList.filter(
    (feedback) =>
      `${feedback.userInfo?.firstName || ''} ${feedback.userInfo?.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.feedbackText?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const truncateText = (text, charLimit = 20) => {
    if (!text) return '';
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
        <svg  xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M17.9419 17.0579L14.0302 13.1469C15.1639 11.7858 15.7293 10.0399 15.6086 8.2725C15.488 6.50512 14.6906 4.85229 13.3823 3.65785C12.074 2.46341 10.3557 1.81932 8.58462 1.85957C6.81357 1.89982 5.12622 2.62131 3.87358 3.87395C2.62094 5.12659 1.89945 6.81394 1.8592 8.58498C1.81895 10.356 2.46304 12.0744 3.65748 13.3827C4.85192 14.6909 6.50475 15.4883 8.27214 15.609C10.0395 15.7297 11.7854 15.1643 13.1466 14.0305L17.0575 17.9422C17.1156 18.0003 17.1845 18.0464 17.2604 18.0778C17.3363 18.1092 17.4176 18.1254 17.4997 18.1254C17.5818 18.1254 17.6631 18.1092 17.739 18.0778C17.8149 18.0464 17.8838 18.0003 17.9419 17.9422C17.9999 17.8842 18.046 17.8152 18.0774 17.7394C18.1089 17.6635 18.125 17.5822 18.125 17.5001C18.125 17.4179 18.1089 17.3366 18.0774 17.2607C18.046 17.1849 17.9999 17.1159 17.9419 17.0579ZM3.12469 8.75006C3.12469 7.63754 3.45459 6.55 4.07267 5.62497C4.69076 4.69995 5.56926 3.97898 6.5971 3.55323C7.62493 3.12749 8.75593 3.0161 9.84707 3.23314C10.9382 3.45018 11.9405 3.98591 12.7272 4.77258C13.5138 5.55925 14.0496 6.56153 14.2666 7.65267C14.4837 8.74382 14.3723 9.87482 13.9465 10.9027C13.5208 11.9305 12.7998 12.809 11.8748 13.4271C10.9497 14.0452 9.86221 14.3751 8.74969 14.3751C7.25836 14.3734 5.82858 13.7802 4.77404 12.7257C3.71951 11.6712 3.12634 10.2414 3.12469 8.75006Z" fill="#6B7280"/>
        </svg>
      </div>

      {showDropdown && filteredFeedback.length > 0 && (
        <div className="absolute w-full mt-3 bg-white border border-gray-200 rounded-md shadow-lg z-10"
        style={{
          maxHeight: filteredFeedback.length > 4 ? '240px' : 'auto',
          overflowY: filteredFeedback.length > 4 ? 'auto' : 'visible'
        }}>
          {filteredFeedback.map((feedback, index) => (
            <div
              key={index}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
              style={{borderBottom: '1px solid var(--Gray-100, #E5E7EB)'}}
              onClick={() => handleItemClick(feedback)}
            >
              <div className="font-medium flex justify-between" style={{fontSize:'14px', color:'#6B7280'}}>
                {truncateText(`${feedback.userInfo?.firstName || ''} ${feedback.userInfo?.lastName || ''}`, 20)}
                <span>{getFlatDisplay(feedback.userInfo)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Implementation of feedback service functions
const fetchAllFeedback = async () => {
  try {
    const feedbackQuery = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'));
    const feedbackSnapshot = await getDocs(feedbackQuery);
    
    const feedbackItems = await Promise.all(
      feedbackSnapshot.docs.map(async (feedbackDoc) => {
        const feedbackData = { id: feedbackDoc.id, ...feedbackDoc.data() };
        
        // If phoneNumber exists, fetch user info
        if (feedbackData.phoneNumber) {
          try {
            const usersQuery = query(
              collection(db, 'users'),
              where('phoneNumber', '==', feedbackData.phoneNumber)
            );
            const usersSnapshot = await getDocs(usersQuery);
            
            if (!usersSnapshot.empty) {
              const userData = usersSnapshot.docs[0].data();
              feedbackData.userInfo = userData;
            }
          } catch (userError) {
            console.error('Error fetching user data:', userError);
          }
        }
        
        return feedbackData;
      })
    );
    
    return feedbackItems;
  } catch (error) {
    console.error('Error getting feedback documents:', error);
    throw error;
  }
};

const deleteFeedback = async (id) => {
  try {
    await deleteDoc(doc(db, 'feedback', id));
    return true;
  } catch (error) {
    console.error('Error deleting feedback:', error);
    throw error;
  }
};

// Main FeedBack Table component
const FeedBackTableNew = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [feedbackList, setFeedbackList] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemName, setDeleteItemName] = useState('');
  const [deleteFunction, setDeleteFunction] = useState(null);
  const [dateSortDirection, setDateSortDirection] = useState('desc');
  const sortDateRef = useRef(null);
  const navigate = useNavigate();
  const itemsPerPage = 10;

  // Fetch feedback data
  useEffect(() => {
    const loadFeedbackData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAllFeedback();
        
        const sortedFeedback = [...data].sort((a, b) => {
          const dateA = a.createdAt ? (a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt)) : new Date();
          const dateB = b.createdAt ? (b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt)) : new Date();
          return dateSortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        });
        
        setFeedbackList(sortedFeedback);
        setFilteredFeedback(sortedFeedback);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setError("Failed to load feedback. Please try again later.");
        setIsLoading(false);
      }
    };

    loadFeedbackData();
  }, [dateSortDirection]);

  const handleDateSort = () => {
    setDateSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = feedbackList.filter(
      (feedback) =>
        `${feedback.userInfo?.firstName || ''} ${feedback.userInfo?.lastName || ''}`.toLowerCase().includes(term.toLowerCase()) ||
        feedback.feedbackText?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredFeedback(filtered);
    setCurrentPage(1);
  };

  const handleSort = (startDate, endDate) => {
    let filtered = feedbackList;
    if (startDate || endDate) {
      filtered = feedbackList.filter(feedback => {
        const feedbackDate = feedback.createdAt ? 
          dayjs(feedback.createdAt.toDate ? feedback.createdAt.toDate() : feedback.createdAt) : 
          dayjs();
          
        if (startDate && endDate) {
          return feedbackDate.isAfter(dayjs(startDate)) && feedbackDate.isBefore(dayjs(endDate).add(1, 'day'));
        } else if (startDate) {
          return feedbackDate.isAfter(dayjs(startDate));
        } else if (endDate) {
          return feedbackDate.isBefore(dayjs(endDate).add(1, 'day'));
        }
        return true;
      });
    }
    
    filtered.sort((a, b) => {
      const dateA = a.createdAt ? (a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt)) : new Date();
      const dateB = b.createdAt ? (b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt)) : new Date();
      return dateSortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
    setFilteredFeedback(filtered);
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
    if (selectedRows.length === currentItems.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentItems.map((_, index) => indexOfFirstItem + index));
    }
  };

  const handleDeleteSelected = () => {
    setDeleteItemName(`${selectedRows.length} selected feedback items`);
    setDeleteFunction(() => async () => {
      try {
        for (const index of selectedRows) {
          const feedbackToDelete = filteredFeedback[index];
          await deleteFeedback(feedbackToDelete.id);
        }
        
        const updatedFeedback = filteredFeedback.filter((_, index) => !selectedRows.includes(index));
        setFilteredFeedback(updatedFeedback);
        setFeedbackList(prevList => prevList.filter(fb => !selectedRows.includes(filteredFeedback.findIndex(f => f.id === fb.id))));
        setSelectedRows([]);
        toast.success('Selected feedback deleted successfully');
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error("Error deleting feedback:", error);
        toast.error('Failed to delete selected feedback');
      }
    });
    setIsDeleteModalOpen(true);
  };

  const totalPages = Math.ceil((filteredFeedback?.length || 0) / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFeedback?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const isAllSelected = currentItems.length > 0 && selectedRows.length === currentItems.length;

  const truncateText = (text, charLimit = 20) => {
    if (!text || text.length <= charLimit) return text || '';
    const lastSpace = text.lastIndexOf(' ', charLimit);
    return lastSpace > 0 ? text.slice(0, lastSpace) + '...' : text.slice(0, charLimit) + '...';
  };

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan="6" className="px-6 py-4 text-center">
            <div className="animate-pulse flex justify-center items-center mt-24">
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
              <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p className="text-lg font-semibold">No Feedback found</p>
              <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
            </div>
          </td>
        </tr>
      );
    }

    return currentItems.map((feedback, index) => {
      const actualIndex = indexOfFirstItem + index;
      const isSelected = selectedRows.includes(actualIndex);
      const truncatedName = feedback.userInfo 
        ? truncateText(`${feedback.userInfo.firstName || ''} ${feedback.userInfo.lastName || ''}`, 20)
        : 'N/A';
      
      const formattedDate = feedback.createdAt 
        ? dayjs(feedback.createdAt.toDate ? feedback.createdAt.toDate() : feedback.createdAt).format('MMM D, YYYY')
        : 'N/A';
        
      const formattedTime = feedback.createdAt 
        ? dayjs(feedback.createdAt.toDate ? feedback.createdAt.toDate() : feedback.createdAt).format('h:mm A')
        : 'N/A';
      
      return (
        <tr 
          key={feedback.id} 
          className="bg-white border-b hover:bg-gray-50 cursor-pointer" 
          onClick={(e) => {
            if (!e.target.closest('.checkbox-container')) {
              navigate(`/feedbackForm/${feedback.id}`);
            }
          }}
          style={{fontSize:'14px'}}
        >
          <td className="p-4 checkbox-container" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-center">
              <CheckboxWithTick isSelected={isSelected}
                onClick={() => handleRowSelect(actualIndex)}
              />
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900" style={{minWidth: '120px'}}>
            {truncatedName}
          </td>
          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900" style={{minWidth: '120px'}}>
            {getFlatDisplay(feedback.userInfo)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap" style={{minWidth: '120px'}}>
            {formattedDate}
          </td>
          <td className="px-6 py-4 whitespace-nowrap" style={{minWidth: '120px'}}>
            {formattedTime}
          </td>
          <td></td>
        </tr>
      );
    });
  };

  return (
    <div className="mt-1 bg-white border rounded-lg overflow-hidden flex flex-col h-full">
      <div className="sticky top-0 z-20 bg-white">
        <div className="flex flex-col sm:flex-row justify-between items-center p-6">
          <div className="w-full sm:w-auto mb-4 sm:mb-0">
            <SearchInput feedbackList={feedbackList} onSearch={handleSearch} />
          </div>
          <div className="w-full sm:w-auto">
            <SortButton onSort={handleSort} ref={sortDateRef} />
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
                  <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px'}}>
                    <div className="flex items-center cursor-pointer">
                      Flat Number
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
                  <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px'}}>
                    <div className="flex items-center cursor-pointer">
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
        <div className="text-sm text-gray-700 font-semibold">
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

export default FeedBackTableNew;