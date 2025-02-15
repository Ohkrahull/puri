// // // import React, { useState, useEffect, useRef } from 'react';
// // // import { collection, query, onSnapshot, getFirestore, orderBy, deleteDoc, doc } from 'firebase/firestore';
// // // import { getApp } from 'firebase/app';
// // // import dayjs from 'dayjs';
// // // import { toast } from 'react-toastify';
// // // import SortButton from '../Buttons/Sortdate';
// // // import DeleteModal from '../Modals/DeleteModal';

// // // const SearchInput = ({ visitors, onSearch,activeTab }) => {
// // //   const [searchTerm, setSearchTerm] = useState("");
// // //   const [showDropdown, setShowDropdown] = useState(false);

// // //   const handleInputChange = (e) => {
// // //     const value = e.target.value;
// // //     setSearchTerm(value);
// // //     setShowDropdown(value.length > 0);
// // //     onSearch(value);
// // //   };

// // //   const handleItemClick = (visitor) => {
// // //     const fullName = `${visitor.firstName || ''} ${visitor.lastName || ''}`.trim() || 'N/A';
// // //     setSearchTerm(fullName);
// // //     setShowDropdown(false);
// // //     onSearch(visitor);
// // //   };

// // //   const filteredVisitors = visitors.filter((visitor) => {
// // //     // First filter by current/past status and delivery purpose
// // //     const isPastDeliveryMatch = activeTab === 'past' ? 
// // //       visitor.current === false : 
// // //       visitor.current === true;
// // //     const isDelivery = visitor.purpose?.toLowerCase() === 'delivery';
// // //     const statusMatch = visitor.status?.toLowerCase() === 'preapproved' ||
// // //                        visitor.status?.toLowerCase() === 'approved';

// // //     // Then apply search filters
// // //     const matchesSearch = ((visitor.firstName || '') + ' ' + (visitor.lastName || '')).toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //       visitor.flatNumber?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //       visitor.visitorPhoneNumber?.toLowerCase().includes(searchTerm.toLowerCase());

// // //     return isPastDeliveryMatch && isDelivery && statusMatch && matchesSearch;
// // //   });

// // //   return (
// // //     <div className="relative w-full sm:w-[250px] md:w-[300px]" style={{  fontFamily: 'Plus_Jakarta' }}>
// // //       <div className="flex items-center justify-between p-2 sm:py-3 border border-[#D1D5DB] rounded-[10px] text-[#6B7280] text-sm sm:text-base font-['Plus_Jakarta']" style={{ backgroundColor:'#F3F3F3',fontFamily: 'Plus_Jakarta' }}>
// // //         <input
// // //           type="text"
// // //           placeholder="Search"
// // //           value={searchTerm}
// // //           onChange={handleInputChange}
// // //           className="w-full bg-transparent border-none outline-none shadow-none text-inherit font-inherit text-sm sm:text-base"
// // //           style={{ border: "none", outline: "none", boxShadow: "none", fontSize: "16px" }}
// // //         />
// // //         <svg
// // //           xmlns="http://www.w3.org/2000/svg"
// // //           className="w-5 h-5 sm:w-6 sm:h-6 mr-2"
// // //           viewBox="0 0 20 20"
// // //           fill="none"
// // //         >
// // //           <path
// // //             d="M17.9419 17.0579L14.0302 13.1469C15.1639 11.7858 15.7293 10.0399 15.6086 8.2725C15.488 6.50512 14.6906 4.85229 13.3823 3.65785C12.074 2.46341 10.3557 1.81932 8.58462 1.85957C6.81357 1.89982 5.12622 2.62131 3.87358 3.87395C2.62094 5.12659 1.89945 6.81394 1.8592 8.58498C1.81895 10.356 2.46304 12.0744 3.65748 13.3827C4.85192 14.6909 6.50475 15.4883 8.27214 15.609C10.0395 15.7297 11.7854 15.1643 13.1466 14.0305L17.0575 17.9422C17.1156 18.0003 17.1845 18.0464 17.2604 18.0778C17.3363 18.1092 17.4176 18.1254 17.4997 18.1254C17.5818 18.1254 17.6631 18.1092 17.739 18.0778C17.8149 18.0464 17.8838 18.0003 17.9419 17.9422C17.9999 17.8842 18.046 17.8152 18.0774 17.7394C18.1089 17.6635 18.125 17.5822 18.125 17.5001C18.125 17.4179 18.1089 17.3366 18.0774 17.2607C18.046 17.1849 17.9999 17.1159 17.9419 17.0579ZM3.12469 8.75006C3.12469 7.63754 3.45459 6.55 4.07267 5.62497C4.69076 4.69995 5.56926 3.97898 6.5971 3.55323C7.62493 3.12749 8.75593 3.0161 9.84707 3.23314C10.9382 3.45018 11.9405 3.98591 12.7272 4.77258C13.5138 5.55925 14.0496 6.56153 14.2666 7.65267C14.4837 8.74382 14.3723 9.87482 13.9465 10.9027C13.5208 11.9305 12.7998 12.809 11.8748 13.4271C10.9497 14.0452 9.86221 14.3751 8.74969 14.3751C7.25836 14.3734 5.82858 13.7802 4.77404 12.7257C3.71951 11.6712 3.12634 10.2414 3.12469 8.75006Z"
// // //             fill="#6B7280"
// // //           />
// // //         </svg>
// // //       </div>
// // //       {showDropdown && filteredVisitors.length > 0 && (
// // //         <div className="absolute w-full mt-2 sm:mt-3 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-y-auto">
// // //           {filteredVisitors.map((visitor, index) => {
// // //             const fullName = `${visitor.firstName || ''} ${visitor.lastName || ''}`.trim() || 'N/A';
// // //             return (
// // //               <div
// // //                 key={index}
// // //                 className="px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-100 cursor-pointer border-b border-[#E5E7EB] last:border-b-0"
// // //                 onClick={() => handleItemClick(visitor)}
// // //               >
// // //                 <div className="font-medium flex justify-between text-sm sm:text-base text-[#6B7280]">
// // //                   {fullName}
// // //                   <span>{visitor.wing || 'N/A'} - {visitor.flatNumber || 'N/A'}</span>
// // //                 </div>
// // //               </div>
// // //             );
// // //           })}
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // const GuestTable = () => {
// // //   const [activeTab, setActiveTab] = useState('current');
// // //   const [visitors, setVisitors] = useState([]);
// // //   const [filteredVisitors, setFilteredVisitors] = useState([]);
// // //   const [currentPage, setCurrentPage] = useState(1);
// // //   const [dateSortDirection, setDateSortDirection] = useState('asc');
// // //   const [searchTerm, setSearchTerm] = useState('');
// // //   const [selectedRows, setSelectedRows] = useState([]);
// // //   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
// // //   const [deleteItemName, setDeleteItemName] = useState('');
// // //   const [deleteFunction, setDeleteFunction] = useState(null);

// // //   const db = getFirestore(getApp());
// // //   const sortDateRef = useRef(null);
// // //   const itemsPerPage = 10;

// // //   useEffect(() => {
// // //     const visitorQuery = query(collection(db, 'visitors'), orderBy('createdAt', 'desc'));
    
// // //     const unsubscribe = onSnapshot(visitorQuery, (snapshot) => {
// // //       const visitorsData = snapshot.docs.map(doc => ({
// // //         id: doc.id,
// // //         ...doc.data()
// // //       }));
// // //       setVisitors(visitorsData);
// // //       filterVisitors(visitorsData);
// // //     });

// // //     return () => unsubscribe();
// // //   }, []);

// // //   const filterVisitors = (data) => {
// // //     let filtered = data.filter((visitor) => {
// // //       const isPastDeliveryMatch = activeTab === 'past' ? 
// // //         visitor.current === false : 
// // //         visitor.current === true;

// // //       const isDelivery = visitor.purpose?.toLowerCase() === 'delivery';
// // //       const statusMatch = visitor.status?.toLowerCase() === 'preapproved' ||
// // //                          visitor.status?.toLowerCase() === 'approved';

// // //       return isPastDeliveryMatch && isDelivery && statusMatch;
// // //     });

// // //     if (searchTerm) {
// // //       filtered = filtered.filter(visitor => {
// // //         const fullName = `${visitor.firstName || ''} ${visitor.lastName || ''}`.toLowerCase();
// // //         const searchLower = searchTerm.toLowerCase();
// // //         return fullName.includes(searchLower) ||
// // //                visitor.flatNumber?.toString().includes(searchLower) ||
// // //                visitor.visitorPhoneNumber?.includes(searchLower);
// // //       });
// // //     }

// // //     filtered.sort((a, b) => {
// // //       const dateA = a.createdAt ? a.createdAt.toDate().getTime() : 0;
// // //       const dateB = b.createdAt ? b.createdAt.toDate().getTime() : 0;
// // //       return dateSortDirection === 'asc' ? dateA - dateB : dateB - dateA;
// // //     });

// // //     setFilteredVisitors(filtered);
// // //     setCurrentPage(1);
// // //   };

// // //   useEffect(() => {
// // //     filterVisitors(visitors);
// // //   }, [activeTab, searchTerm, dateSortDirection]);

// // //   const handleSearch = (termOrVisitor) => {
// // //     setSearchTerm(typeof termOrVisitor === 'string' ? termOrVisitor : 
// // //                  `${termOrVisitor.firstName || ''} ${termOrVisitor.lastName || ''}`);
// // //   };

// // //   const handleSort = (startDate, endDate) => {
// // //     let filtered = visitors;
// // //     if (startDate || endDate) {
// // //       filtered = visitors.filter((visitor) => {
// // //         const visitorDate = visitor.createdAt ? dayjs(visitor.createdAt.toDate()) : null;
// // //         if (!visitorDate) return false;

// // //         if (startDate && endDate) {
// // //           return visitorDate.isSameOrAfter(dayjs(startDate, "DD MMM, YYYY"), "day") &&
// // //                  visitorDate.isSameOrBefore(dayjs(endDate, "DD MMM, YYYY"), "day");
// // //         }
// // //         return startDate ? visitorDate.isSameOrAfter(dayjs(startDate, "DD MMM, YYYY"), "day") :
// // //                           visitorDate.isSameOrBefore(dayjs(endDate, "DD MMM, YYYY"), "day");
// // //       });
// // //     }
// // //     filterVisitors(filtered);
// // //   };

// // //   const formatTimeWithAmPm = (timestamp) => {
// // //     if (!timestamp) return 'N/A';
// // //     return dayjs(timestamp.toDate()).format('hh:mm A');
// // //   };

// // //   const totalPages = Math.ceil(filteredVisitors.length / itemsPerPage);
// // //   const indexOfLastItem = currentPage * itemsPerPage;
// // //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// // //   const currentItems = filteredVisitors.slice(indexOfFirstItem, indexOfLastItem);
// // //   const isAllSelected = currentItems.length > 0 && selectedRows.length === currentItems.length;

// // //   const handleDateSort = () => {
// // //     setDateSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
// // //   };

// // //   const handleRowSelect = (index) => {
// // //     setSelectedRows(prev => {
// // //       if (prev.includes(index)) {
// // //         return prev.filter(i => i !== index);
// // //       }
// // //       return [...prev, index];
// // //     });
// // //   };

// // //   const handleSelectAll = () => {
// // //     if (isAllSelected) {
// // //       setSelectedRows([]);
// // //     } else {
// // //       setSelectedRows(currentItems.map((_, index) => indexOfFirstItem + index));
// // //     }
// // //   };

// // //   const handleDeleteSelected = () => {
// // //     setDeleteItemName(`${selectedRows.length} selected deliveries`);
// // //     setDeleteFunction(() => async () => {
// // //       try {
// // //         const visitorIds = selectedRows.map(index => {
// // //           const relativeIndex = index - indexOfFirstItem;
// // //           return currentItems[relativeIndex].id;
// // //         });
        
// // //         for (const id of visitorIds) {
// // //           await deleteDoc(doc(db, "visitors", id));
// // //         }
        
// // //         setSelectedRows([]);
// // //         toast.success("Selected deliveries deleted successfully");
// // //         setIsDeleteModalOpen(false);
// // //       } catch (error) {
// // //         console.error("Error deleting deliveries:", error);
// // //         toast.error("Failed to delete selected deliveries");
// // //       }
// // //     });
// // //     setIsDeleteModalOpen(true);
// // //   };

// // //   const CheckboxWithTick = ({ isSelected, onClick, isMinusIcon = false }) => (
// // //     <div
// // //       onClick={onClick}
// // //       className="w-5 h-5 border border-gray-400 rounded-md flex items-center justify-center cursor-pointer"
// // //       style={{ backgroundColor: isSelected ? '#F3F4F6' : 'white' }}
// // //     >
// // //       {isSelected && (
// // //         isMinusIcon ? (
// // //           <svg width="12" height="2" viewBox="0 0 12 2" fill="none">
// // //             <path d="M1 1H11" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"/>
// // //           </svg>
// // //         ) : (
// // //           <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
// // //             <path d="M10 3L4.5 8.5L2 6" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
// // //           </svg>
// // //         )
// // //       )}
// // //     </div>
// // //   );

// // //   return (
// // //     <div className="mt-1 bg-white border rounded-lg overflow-hidden flex flex-col" style={{ position: 'relative', zIndex: 1, fontFamily: 'Plus_Jakarta' }}>
// // //       <div className="sticky top-0 z-20 bg-white">
// // //         <div className="ml-7 mt-7 gap-4">
// // //           <span
// // //             className={`p-2 cursor-pointer ${
// // //               activeTab === 'current' ? 'border border-[#E4E7EC] bg-[#F9FAFB] text-black' : 'text-[#6B7280]'
// // //             }`}
// // //             style={{ borderRadius: 8 }}
// // //             onClick={() => setActiveTab('current')}
// // //           >
// // //             Current
// // //           </span>
          

// // //           <span
// // //             className={`ml-3 p-2 cursor-pointer ${
// // //               activeTab === 'expected' ? 'border border-[#E4E7EC] bg-[#F9FAFB] text-black' : 'text-[#6B7280]'
// // //             }`}
// // //             style={{ borderRadius: 8 }}
// // //             onClick={() => setActiveTab('expected')}
// // //           >
// // //             Expected
// // //           </span>

// // //           <span
// // //             className={`ml-3 p-2 cursor-pointer ${
// // //               activeTab === 'visited' ? 'border border-[#E4E7EC] bg-[#F9FAFB] text-black' : 'text-[#6B7280]'
// // //             }`}
// // //             style={{ borderRadius: 8 }}
// // //             onClick={() => setActiveTab('visited')}
// // //           >
// // //             Visited
// // //           </span>

// // //           <span
// // //             className={`ml-3 p-2 cursor-pointer ${
// // //               activeTab === 'rejected' ? 'border border-[#E4E7EC] bg-[#F9FAFB] text-black' : 'text-[#6B7280]'
// // //             }`}
// // //             style={{ borderRadius: 8 }}
// // //             onClick={() => setActiveTab('rejected')}
// // //           >
// // //             Rejected
// // //           </span>

// // //           <span
// // //             className={`ml-3 p-2 cursor-pointer ${
// // //               activeTab === 'wrongEntry' ? 'border border-[#E4E7EC] bg-[#F9FAFB] text-black' : 'text-[#6B7280]'
// // //             }`}
// // //             style={{ borderRadius: 8 }}
// // //             onClick={() => setActiveTab('wrongEntry')}
// // //           >
// // //             WrongEntry
// // //           </span>
// // //         </div>

// // //         <div className="flex flex-col sm:flex-row items-stretch p-6 gap-4 justify-between">
// // //         <SearchInput 
// // //   visitors={visitors} 
// // //   onSearch={handleSearch} 
// // //   activeTab={activeTab}  // Add this prop
// // // />
// // //           <div className="w-full sm:w-auto">
// // //             <SortButton onSort={handleSort} ref={sortDateRef}/>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       <div className="flex-grow overflow-auto">
// // //         <table className="w-full text-sm text-gray-500 relative" style={{ minWidth: '1000px' }}>
// // //         <thead className="text-xs text-gray-500 bg-gray-50 sticky top-0" style={{fontSize:'12px'}}>
// // //   <tr className="border-y">
// // //     {selectedRows.length > 0 ? (
// // //       <>
// // //         <th scope="col" className="p-4 w-10">
// // //           <div className="flex items-center justify-center">
// // //             <CheckboxWithTick
// // //               isSelected={selectedRows.length > 0}
// // //               onClick={handleSelectAll}
// // //               isMinusIcon={selectedRows.length > 0 && selectedRows.length < currentItems.length}
// // //             />
// // //           </div>
// // //         </th>
// // //         <th scope="col" className="px-6 py-3">
// // //           <div className="flex text-gray-600 gap-2">
// // //             <span className="font-semibold" style={{color:'#4B5563', fontSize:12}}>{selectedRows.length}</span>
// // //             <span className="font-semibold" style={{color:'#4B5563', fontSize:12}}>selected</span>
// // //           </div>
// // //         </th>
// // //         <th scope="col" className="px-6 py-3"></th>
// // //         <th scope="col" className="px-6 py-3"></th>
// // //         <th scope="col" className="px-6 py-3"></th>
// // //         <th scope="col" className="px-6 py-3"></th>
// // //         <th scope="col" className="px-6 py-3"></th>
// // //         <th scope="col" className="px-6 py-3 text-right">
// // //           <span 
// // //             onClick={handleDeleteSelected}
// // //             className="text-red-600 cursor-pointer hover:text-red-700"
// // //           >
// // //             Delete
// // //           </span>
// // //         </th>
// // //       </>
// // //     ) : (
// // //       <>
// // //         <th scope="col" className="p-4" style={{width:'40px'}}>
// // //           <div className="flex items-center justify-center">
// // //             <CheckboxWithTick
// // //               isSelected={isAllSelected}
// // //               onClick={handleSelectAll}
// // //             />
// // //           </div>
// // //         </th>
// // //         <th scope="col" className="px-6 py-3 text-left">Name</th>
// // //         <th scope="col" className="px-6 py-3 text-left">Phone Number</th>
// // //         <th scope="col" className="px-6 py-3 text-left">Flat Number</th>
// // //         <th scope="col" className="px-6 py-3 text-left">Company Name</th>
// // //         <th scope="col" className="px-6 py-3 text-left">Approved By</th>
// // //         <th scope="col" className="px-6 py-3 text-left cursor-pointer" onClick={handleDateSort}>
// // //           <div className="flex items-center">
// // //             Date
// // //             <svg className="ml-2" xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
// // //               <path d="M8.66699 3.66667V12M8.66699 12L4.66699 8M8.66699 12L12.667 8" stroke="#4B5563" strokeLinecap="round" strokeLinejoin="round"/>
// // //             </svg>
// // //           </div>
// // //         </th>
// // //         <th scope="col" className="px-6 py-3 text-left">Check In</th>
// // //       </>
// // //     )}
// // //   </tr>
// // // </thead>
// // //           <tbody>
// // //             {currentItems.map((visitor, index) => {
// // //               const actualIndex = indexOfFirstItem + index;
// // //               const isSelected = selectedRows.includes(actualIndex);
              
// // //               return (
// // //                 <tr key={visitor.id} className="bg-white border-b hover:bg-gray-50" style={{fontSize:'14px'}}>
// // //                   <td className="p-4" style={{width:'40px'}}>
// // //                     <div className="flex items-center justify-center">
// // //                       <CheckboxWithTick
// // //                         isSelected={isSelected}
// // //                         onClick={() => handleRowSelect(actualIndex)}
// // //                       />
// // //                     </div>
// // //                   </td>
// // //                   <td className="px-6 py-4 font-medium text-gray-900">
// // //                     {`${visitor.firstName || ''} ${visitor.lastName || ''}`}
// // //                   </td>
// // //                   <td className="px-6 py-4">
// // //                     {visitor.visitorPhoneNumber || 'N/A'}
// // //                   </td>
// // //                   <td className="px-6 py-4">
// // //                     {`${visitor.wing || ''}-${visitor.flatNumber || ''}`}
// // //                   </td>
// // //                   <td className="px-6 py-4">
// // //                     {visitor.company || 'N/A'}
// // //                   </td>
// // //                   <td className="px-6 py-4">
// // //                     {visitor.approvedBy ? visitor.approvedBy.name : 'N/A'}
// // //                   </td>
// // //                   <td className="px-6 py-4">
// // //                     {visitor.createdAt ? dayjs(visitor.createdAt.toDate()).format('D MMM, YYYY') : 'N/A'}
// // //                   </td>
// // //                   <td className="px-6 py-4">
// // //                     {formatTimeWithAmPm(visitor.checkInTime)}
// // //                   </td>
// // //                 </tr>
// // //               );
// // //             })}
// // //             {filteredVisitors.length === 0 && (
// // //               <tr>
// // //                 <td colSpan="8" className="px-6 py-4 text-center text-gray-500" style={{ height: '300px' }}>
// // //                   <div className="flex flex-col items-center justify-center h-full">
// // //                     <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
// // //                     </svg>
// // //                     <p className="text-lg font-semibold">No delivery visitors found</p>
// // //                     <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
// // //                   </div>
// // //                 </td>
// // //               </tr>
// // //             )}
// // //           </tbody>
// // //         </table>
// // //       </div>

// // //       <div className="sticky bottom-0 bg-white flex justify-between items-center px-6 py-3 border-t z-20">
// // //         <div className="text-sm font-semibold text-gray-700">
// // //           Page {currentPage} of {totalPages || 1}
// // //         </div>
// // //         <div className="flex space-x-2">
// // //           <button
// // //             onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
// // //             disabled={currentPage === 1}
// // //             className={`px-3 py-1 border rounded ${
// // //               currentPage === 1 ? "bg-gray-100 text-gray-400" : "bg-white text-gray-700 hover:bg-gray-50"
// // //             }`}
// // //             style={{ fontSize: "14px", border: "1px solid #D1D5DB" }}
// // //           >
// // //             Previous
// // //           </button>
// // //           <button
// // //             onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
// // //             disabled={currentPage === totalPages}
// // //             className={`px-3 py-1 border rounded ${
// // //               currentPage === totalPages ? "bg-gray-100 text-gray-400" : "bg-white text-gray-700 hover:bg-gray-50"
// // //             }`}
// // //             style={{ fontSize: "14px", border: "1px solid #D1D5DB" }}
// // //           >
// // //             Next
// // //           </button>
// // //         </div>
// // //       </div>

// // //       <DeleteModal
// // //         isOpen={isDeleteModalOpen}
// // //         onClose={() => setIsDeleteModalOpen(false)}
// // //         onDelete={deleteFunction}
// // //         itemName={deleteItemName}
// // //       />
// // //     </div>
// // //   );
// // // };

// // // export default GuestTable;

// // import React, { useState, useEffect, useRef } from 'react';
// // import { collection, query, onSnapshot, getFirestore, orderBy, deleteDoc, doc } from 'firebase/firestore';
// // import { getApp } from 'firebase/app';
// // import dayjs from 'dayjs';
// // import { toast } from 'react-toastify';
// // import SortButton from '../Buttons/Sortdate';
// // import DeleteModal from '../Modals/DeleteModal';

// // const SearchInput = ({ visitors, onSearch, activeTab }) => {
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [showDropdown, setShowDropdown] = useState(false);

// //   const handleInputChange = (e) => {
// //     const value = e.target.value;
// //     setSearchTerm(value);
// //     setShowDropdown(value.length > 0);
// //     onSearch(value);
// //   };

// //   const handleItemClick = (visitor) => {
// //     const fullName = `${visitor.firstName || ''} ${visitor.lastName || ''}`.trim() || 'N/A';
// //     setSearchTerm(fullName);
// //     setShowDropdown(false);
// //     onSearch(visitor);
// //   };

// //   const filteredVisitors = visitors.filter((visitor) => {
// //     const isGuest = visitor.purpose?.toLowerCase() === 'guest';
// //     if (!isGuest) return false;

// //     let tabConditionMet = false;
// //     switch(activeTab) {
// //       case 'current':
// //         tabConditionMet = visitor.current === true;
// //         break;
// //       case 'expected':
// //         tabConditionMet = visitor.status?.toLowerCase() === 'preapproved';
// //         break;
// //       case 'visited':
// //         tabConditionMet = visitor.current === false;
// //         break;
// //       case 'rejected':
// //         tabConditionMet = visitor.status?.toLowerCase() === 'rejected';
// //         break;
// //       case 'wrongEntry':
// //         tabConditionMet = visitor.current === 'wrongEntry';
// //         break;
// //       default:
// //         tabConditionMet = false;
// //     }
    
// //     if (!tabConditionMet) return false;

// //     const matchesSearch = ((visitor.firstName || '') + ' ' + (visitor.lastName || '')).toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       visitor.flatNumber?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       visitor.visitorPhoneNumber?.toLowerCase().includes(searchTerm.toLowerCase());

// //     return matchesSearch;
// //   });



// //   return (
// //     <div className="relative w-full sm:w-[250px] md:w-[300px]" style={{ fontFamily: 'Plus_Jakarta' }}>
// //       {/* Existing SearchInput CSS remains unchanged */}
// //       <div className="flex items-center justify-between p-2 sm:py-3 border border-[#D1D5DB] rounded-[10px] text-[#6B7280] text-sm sm:text-base font-['Plus_Jakarta']" style={{ backgroundColor:'#F3F3F3',fontFamily: 'Plus_Jakarta' }}>
// //         <input
// //           type="text"
// //           placeholder="Search"
// //           value={searchTerm}
// //           onChange={handleInputChange}
// //           className="w-full bg-transparent border-none outline-none shadow-none text-inherit font-inherit text-sm sm:text-base"
// //           style={{ border: "none", outline: "none", boxShadow: "none", fontSize: "16px" }}
// //         />
// //         <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6 mr-2" viewBox="0 0 20 20" fill="none">
// //           <path d="M17.9419 17.0579L14.0302 13.1469C15.1639 11.7858 15.7293 10.0399 15.6086 8.2725C15.488 6.50512 14.6906 4.85229 13.3823 3.65785C12.074 2.46341 10.3557 1.81932 8.58462 1.85957C6.81357 1.89982 5.12622 2.62131 3.87358 3.87395C2.62094 5.12659 1.89945 6.81394 1.8592 8.58498C1.81895 10.356 2.46304 12.0744 3.65748 13.3827C4.85192 14.6909 6.50475 15.4883 8.27214 15.609C10.0395 15.7297 11.7854 15.1643 13.1466 14.0305L17.0575 17.9422C17.1156 18.0003 17.1845 18.0464 17.2604 18.0778C17.3363 18.1092 17.4176 18.1254 17.4997 18.1254C17.5818 18.1254 17.6631 18.1092 17.739 18.0778C17.8149 18.0464 17.8838 18.0003 17.9419 17.9422C17.9999 17.8842 18.046 17.8152 18.0774 17.7394C18.1089 17.6635 18.125 17.5822 18.125 17.5001C18.125 17.4179 18.1089 17.3366 18.0774 17.2607C18.046 17.1849 17.9999 17.1159 17.9419 17.0579Z" fill="#6B7280"/>
// //         </svg>
// //       </div>
// //       {showDropdown && filteredVisitors.length > 0 && (
// //         <div className="absolute w-full mt-2 sm:mt-3 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-y-auto">
// //           {/* Dropdown content remains unchanged */}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // const GuestTable = () => {
// //   const [activeTab, setActiveTab] = useState('current');
// //   const [visitors, setVisitors] = useState([]);
// //   const [filteredVisitors, setFilteredVisitors] = useState([]);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [dateSortDirection, setDateSortDirection] = useState('asc');
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [selectedRows, setSelectedRows] = useState([]);
// //   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
// //   const [deleteItemName, setDeleteItemName] = useState('');
// //   const [deleteFunction, setDeleteFunction] = useState(null);

// //   const db = getFirestore(getApp());
// //   const sortDateRef = useRef(null);
// //   const itemsPerPage = 10;

// //   useEffect(() => {
// //     const visitorQuery = query(collection(db, 'visitors'), orderBy('createdAt', 'desc'));
    
// //     const unsubscribe = onSnapshot(visitorQuery, (snapshot) => {
// //       const visitorsData = snapshot.docs.map(doc => ({
// //         id: doc.id,
// //         ...doc.data()
// //       }));
// //       setVisitors(visitorsData);
// //       filterVisitors(visitorsData);
// //     });

// //     return () => unsubscribe();
// //   }, []);

// //   const filterVisitors = (data) => {
// //     let filtered = data.filter((visitor) => {
// //       const isGuest = visitor.purpose?.toLowerCase() === 'guest';
// //       if (!isGuest) return false;

// //       switch(activeTab) {
// //         case 'current':
// //           return visitor.current === true;
// //         case 'expected':
// //           return visitor.status?.toLowerCase() === 'preapproved';
// //         case 'visited':
// //           return visitor.current === false;
// //         case 'rejected':
// //           return visitor.status?.toLowerCase() === 'rejected';
// //         case 'wrongEntry':
// //           return visitor.current === 'wrongEntry';
// //         default:
// //           return false;
// //       }
// //     });

// //     if (searchTerm) {
// //       filtered = filtered.filter(visitor => {
// //         const fullName = `${visitor.firstName || ''} ${visitor.lastName || ''}`.toLowerCase();
// //         const searchLower = searchTerm.toLowerCase();
// //         return fullName.includes(searchLower) ||
// //                visitor.flatNumber?.toString().includes(searchLower) ||
// //                visitor.visitorPhoneNumber?.includes(searchLower);
// //       });
// //     }

// //     filtered.sort((a, b) => {
// //       const dateA = a.createdAt ? a.createdAt.toDate().getTime() : 0;
// //       const dateB = b.createdAt ? b.createdAt.toDate().getTime() : 0;
// //       return dateSortDirection === 'asc' ? dateA - dateB : dateB - dateA;
// //     });

// //     setFilteredVisitors(filtered);
// //     setCurrentPage(1);
// //   };

// //   const getTableColumns = () => {
// //     switch(activeTab) {
// //       case 'expected':
// //         return [
// //           'Name',
// //           'Flat Number',
// //           'Entry Code',
// //           'Phone Number',
// //           'Accompanying',
// //           'Date'
// //         ];
// //       case 'visited':
// //         return [
// //           'Name',
// //           'Phone Number',
// //           'Flat Number',
// //           'Company Name',
// //           'Approved By',
// //           'Date',
// //           'Check In'
// //         ];
// //       case 'rejected':
// //         return [
// //           'Name',
// //           'Flat Number',
// //           'Phone Number',
// //           'Accompanied',
// //           'Vehicle Number',
// //           'Date',
// //           'Time'
// //         ];
// //       case 'wrongEntry':
// //       case 'current':
// //       default:
// //         return [
// //           'Name',
// //           'Phone Number',
// //           'Flat Number',
// //           'Company Name',
// //           'Approved By',
// //           'Date',
// //           'Check In'
// //         ];
// //     }
// //   };

// //   const renderTableCell = (visitor, column) => {
// //     switch(column) {
// //       case 'Name':
// //         return `${visitor.firstName || ''} ${visitor.lastName || ''}`;
// //       case 'Phone Number':
// //         return visitor.visitorPhoneNumber || 'N/A';
// //       case 'Flat Number':
// //         return `${visitor.wing || ''}-${visitor.flatNumber || ''}`;
// //       case 'Company Name':
// //         return visitor.company || 'N/A';
// //       case 'Approved By':
// //         return visitor.approvedBy ? visitor.approvedBy.name : 'N/A';
// //       case 'Date':
// //         return visitor.createdAt ? dayjs(visitor.createdAt.toDate()).format('D MMM, YYYY') : 'N/A';
// //       case 'Check In':
// //         return visitor.checkInTime ? dayjs(visitor.checkInTime.toDate()).format('hh:mm A') : 'N/A';
// //       case 'Entry Code':
// //         return visitor.entryCode || 'N/A';
// //       case 'Accompanying':
// //         return visitor.nop || 'N/A';
// //       case 'Accompanied':
// //         return visitor.nop || 'N/A';
// //       case 'Vehicle Number':
// //         return visitor.vehicleNumber || 'N/A';
// //       case 'Time':
// //         return visitor.checkInTime ? dayjs(visitor.checkInTime.toDate()).format('hh:mm A') : 'N/A';
// //       default:
// //         return 'N/A';
// //     }
// //   };

// //   // Rest of the component methods remain unchanged
// //   const handleSearch = (termOrVisitor) => {
// //     setSearchTerm(typeof termOrVisitor === 'string' ? termOrVisitor : 
// //                  `${termOrVisitor.firstName || ''} ${termOrVisitor.lastName || ''}`);
// //   };

// //   const handleSort = (startDate, endDate) => {
// //     let filtered = visitors;
// //     if (startDate || endDate) {
// //       filtered = visitors.filter((visitor) => {
// //         const visitorDate = visitor.createdAt ? dayjs(visitor.createdAt.toDate()) : null;
// //         if (!visitorDate) return false;

// //         if (startDate && endDate) {
// //           return visitorDate.isSameOrAfter(dayjs(startDate, "DD MMM, YYYY"), "day") &&
// //                  visitorDate.isSameOrBefore(dayjs(endDate, "DD MMM, YYYY"), "day");
// //         }
// //         return startDate ? visitorDate.isSameOrAfter(dayjs(startDate, "DD MMM, YYYY"), "day") :
// //                           visitorDate.isSameOrBefore(dayjs(endDate, "DD MMM, YYYY"), "day");
// //       });
// //     }
// //     filterVisitors(filtered);
// //   };

// //       const handleRowSelect = (index) => {
// //     setSelectedRows(prev => {
// //       if (prev.includes(index)) {
// //         return prev.filter(i => i !== index);
// //       }
// //       return [...prev, index];
// //     });
// //   };

 
// //   const handleDateSort = () => {
// //     setDateSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
// //   };

// //   const columns = getTableColumns();
// //   const totalPages = Math.ceil(filteredVisitors.length / itemsPerPage);
// //   const indexOfLastItem = currentPage * itemsPerPage;
// //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// //   const currentItems = filteredVisitors.slice(indexOfFirstItem, indexOfLastItem);
// //   const isAllSelected = currentItems.length > 0 && selectedRows.length === currentItems.length;

// //   const handleSelectAll = () => {
// //     if (isAllSelected) {
// //       setSelectedRows([]);
// //     } else {
// //       setSelectedRows(currentItems.map((_, index) => indexOfFirstItem + index));
// //     }
// //   };
   

// //   return (
// //     <div className="mt-1 bg-white border rounded-lg overflow-hidden flex flex-col" style={{ position: 'relative', zIndex: 1, fontFamily: 'Plus_Jakarta' }}>
// //       {/* Tab buttons and search section remain unchanged */}
// //       <div className="sticky top-0 z-20 bg-white">
// //         <div className="ml-7 mt-7 gap-4">
// //           {['current', 'expected', 'visited', 'rejected', 'wrongEntry'].map((tab) => (
// //             <span
// //               key={tab}
// //               className={`${tab === 'current' ? '' : 'ml-3'} p-2 cursor-pointer ${
// //                 activeTab === tab ? 'border border-[#E4E7EC] bg-[#F9FAFB] text-black' : 'text-[#6B7280]'
// //               }`}
// //               style={{ borderRadius: 8 }}
// //               onClick={() => setActiveTab(tab)}
// //             >
// //               {tab.charAt(0).toUpperCase() + tab.slice(1)}
// //             </span>
// //           ))}
// //         </div>

// //         <div className="flex flex-col sm:flex-row items-stretch p-6 gap-4 justify-between">
// //           <SearchInput 
// //             visitors={visitors} 
// //             onSearch={handleSearch}
// //             activeTab={activeTab}
// //           />
// //           <div className="w-full sm:w-auto">
// //             <SortButton onSort={handleSort} ref={sortDateRef}/>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="flex-grow overflow-auto">
// //         <table className="w-full text-sm text-gray-500 relative" style={{ minWidth: '1000px' }}>
// //           <thead className="text-xs text-gray-500 bg-gray-50 sticky top-0" style={{fontSize:'12px'}}>
// //             <tr className="border-y">
// //               <th scope="col" className="p-4" style={{width:'40px'}}>
// //                 <div className="flex items-center justify-center">
// //                   <input type="checkbox"
// //                   className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
// //                   checked={isAllSelected}
// //                   onChange={handleSelectAll}
// //                 />
// //                 </div>
// //               </th>
// //               {columns.map((column) => (
// //                 <th
// //                   key={column}
// //                   scope="col"
// //                   className="px-6 py-3 text-left"
// //                   onClick={column === 'Date' ? handleDateSort : undefined}
// //                   style={column === 'Date' ? { cursor: 'pointer' } : {}}
// //                 >
// //                   <div className="flex items-center">
// //                     {column}
// //                     {column === 'Date' && (
// //                       <svg className="ml-2" xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
// //                         <path d="M8.66699 3.66667V12M8.66699 12L4.66699 8M8.66699 12L12.667 8" stroke="#4B5563" strokeLinecap="round" strokeLinejoin="round"/>
// //                       </svg>
// //                     )}
// //                   </div>
// //                 </th>
// //               ))}
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {currentItems.map((visitor, index) => {
// //               const actualIndex = indexOfFirstItem + index;
// //               const isSelected = selectedRows.includes(actualIndex);
              
// //               return (
// //                 <tr key={visitor.id} className="bg-white border-b hover:bg-gray-50" style={{fontSize:'14px'}}>
// //                   <td className="p-4" style={{width:'40px'}}>
// //                     <div className="flex items-center justify-center">
// //                       <input
// //                         type="checkbox"
// //                         className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
// //                         checked={isSelected}
// //                         onChange={() => handleRowSelect(actualIndex)}
// //                       />
// //                     </div>
// //                   </td>
// //                   {columns.map((column, colIndex) => (
// //                     <td key={colIndex} className="px-6 py-4">
// //                       {renderTableCell(visitor, column)}
// //                     </td>
// //                   ))}
// //                 </tr>
// //               );
// //             })}
// //             {filteredVisitors.length === 0 && (
// //               <tr>
// //                 <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-gray-500" style={{ height: '300px' }}>
// //                   <div className="flex flex-col items-center justify-center h-full">
// //                     <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
// //                     </svg>
// //                     <p className="text-lg font-semibold">No guest visitors found</p>
// //                     <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
// //                   </div>
// //                 </td>
// //               </tr>
// //             )}
// //           </tbody>
// //         </table>
// //       </div>

// //       <div className="sticky bottom-0 bg-white flex justify-between items-center px-6 py-3 border-t z-20">
// //         <div className="text-sm font-semibold text-gray-700">
// //           Page {currentPage} of {totalPages || 1}
// //         </div>
// //         <div className="flex space-x-2">
// //           <button
// //             onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
// //             disabled={currentPage === 1}
// //             className={`px-3 py-1 border rounded ${
// //               currentPage === 1 ? "bg-gray-100 text-gray-400" : "bg-white text-gray-700 hover:bg-gray-50"
// //             }`}
// //             style={{ fontSize: "14px", border: "1px solid #D1D5DB" }}
// //           >
// //             Previous
// //           </button>
// //           <button
// //             onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
// //             disabled={currentPage === totalPages}
// //             className={`px-3 py-1 border rounded ${
// //               currentPage === totalPages ? "bg-gray-100 text-gray-400" : "bg-white text-gray-700 hover:bg-gray-50"
// //             }`}
// //             style={{ fontSize: "14px", border: "1px solid #D1D5DB" }}
// //           >
// //             Next
// //           </button>
// //         </div>
// //       </div>

// //       <DeleteModal
// //         isOpen={isDeleteModalOpen}
// //         onClose={() => setIsDeleteModalOpen(false)}
// //         onDelete={deleteFunction}
// //         itemName={deleteItemName}
// //       />
// //     </div>
// //   );
// // };

// // export default GuestTable;


// import React, { useState, useEffect, useRef } from 'react';
// import { collection, query, onSnapshot, getFirestore, orderBy, deleteDoc, doc } from 'firebase/firestore';
// import { getApp } from 'firebase/app';
// import dayjs from 'dayjs';
// import { toast } from 'react-toastify';
// import DeleteModal from '../Modals/DeleteModal';

// // SVG icon component that rotates based on sort direction
// const SortIcon = ({ direction = 'asc' }) => (
//   <svg 
//     className="ml-2" 
//     xmlns="http://www.w3.org/2000/svg" 
//     width="17" 
//     height="16" 
//     viewBox="0 0 17 16" 
//     fill="none"
//     style={{ transform: direction === 'desc' ? 'rotate(180deg)' : 'none' }}
//   >
//     <path 
//       d="M8.66699 3.66667V12M8.66699 12L4.66699 8M8.66699 12L12.667 8" 
//       stroke="#4B5563" 
//       strokeLinecap="round" 
//       strokeLinejoin="round"
//     />
//   </svg>
// );


// const GuestDashTable = () => {
//   const [activeTab, setActiveTab] = useState('current');
//   const [visitors, setVisitors] = useState([]);
//   const [filteredVisitors, setFilteredVisitors] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [dateSortDirection, setDateSortDirection] = useState('asc');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [deleteItemName, setDeleteItemName] = useState('');
//   const [deleteFunction, setDeleteFunction] = useState(null);
//  const [activeMainTab, setActiveMainTab] = useState("Guest")
//   const db = getFirestore(getApp());
//   const sortDateRef = useRef(null);
//   const itemsPerPage = 10;

//   // Initial data fetch
//   useEffect(() => {
//     const visitorQuery = query(collection(db, 'visitors'), orderBy('createdAt', 'desc'));
    
//     const unsubscribe = onSnapshot(visitorQuery, (snapshot) => {
//       const visitorsData = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       setVisitors(visitorsData);
//       filterVisitors(visitorsData);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Clear selected rows when tab changes
//   useEffect(() => {
//     setSelectedRows([]);
//     // Reset to 'current' tab if 'expected' is selected but not available for this main tab
//     if (activeTab === 'expected' && !(activeMainTab === 'Guest' || activeMainTab === 'Delivery')) {
//       setActiveTab('current');
//     }
//     filterVisitors(visitors);
//   }, [activeTab, activeMainTab]);

//   const filterVisitors = (data) => {
//     let filtered = data.filter((visitor) => {
//       // First, filter by the main tab (visitor purpose)
//       const visitorPurpose = visitor.purpose?.toLowerCase() || '';
//       const mainTabPurpose = activeMainTab.toLowerCase();
//       if (visitorPurpose !== mainTabPurpose) return false;

//       const status = visitor.status?.toLowerCase();
//       const current = visitor.current;

//       // Then filter by the sub-tab status
//       switch(activeTab) {
//         case 'current':
//           return current === true && status === 'approved';
//         case 'expected':
//           return status === 'preapproved';
//         case 'visited':
//           return current === false;
//         case 'rejected':
//           return status === 'rejected';
//         case 'wrongEntry':
//           return current === 'wrongEntry';
//         default:
//           return false;
//       }
//     });

//     if (searchTerm) {
//       filtered = filtered.filter(visitor => {
//         const fullName = `${visitor.firstName || ''} ${visitor.lastName || ''}`.toLowerCase();
//         const searchLower = searchTerm.toLowerCase();
//         return fullName.includes(searchLower) ||
//                visitor.flatNumber?.toString().includes(searchLower) ||
//                visitor.visitorPhoneNumber?.includes(searchLower);
//       });
//     }

//     filtered.sort((a, b) => {
//       const dateA = a.createdAt ? a.createdAt.toDate().getTime() : 0;
//       const dateB = b.createdAt ? b.createdAt.toDate().getTime() : 0;
//       return dateSortDirection === 'asc' ? dateA - dateB : dateB - dateA;
//     });

//     setFilteredVisitors(filtered);
//     setCurrentPage(1);
//   };

//   useEffect(() => {
//     filterVisitors(visitors);
//   }, [activeTab, searchTerm, dateSortDirection]);

//   const handleSearch = (termOrVisitor) => {
//     setSearchTerm(typeof termOrVisitor === 'string' ? termOrVisitor : 
//                  `${termOrVisitor.firstName || ''} ${termOrVisitor.lastName || ''}`);
//   };

//   const handleSort = (startDate, endDate) => {
//     let filtered = visitors;
//     if (startDate || endDate) {
//       filtered = visitors.filter((visitor) => {
//         const visitorDate = visitor.createdAt ? dayjs(visitor.createdAt.toDate()) : null;
//         if (!visitorDate) return false;

//         if (startDate && endDate) {
//           return visitorDate.isSameOrAfter(dayjs(startDate, "DD MMM, YYYY"), "day") &&
//                  visitorDate.isSameOrBefore(dayjs(endDate, "DD MMM, YYYY"), "day");
//         }
//         return startDate ? visitorDate.isSameOrAfter(dayjs(startDate, "DD MMM, YYYY"), "day") :
//                           visitorDate.isSameOrBefore(dayjs(endDate, "DD MMM, YYYY"), "day");
//       });
//     }
//     filterVisitors(filtered);
//   };

//   const getTableColumns = () => {
//     switch(activeTab) {
//       case 'expected':
//         return [
//           'Name',
//           'Flat Number',
//           'Date'
//         ];
//       case 'visited':
//         return [
//           'Name',
//           'Flat Number',
//           'Check Out Date',
//         ];
//       case 'rejected':
//         return [
//           'Name',
//           'Flat Number',
//           'Phone Number',
//           'Accompanied',
//           'Vehicle Number',
//           'Date',
//           'Time'
//         ];
//       case 'wrongEntry':
//         return [
//           'Name',
//           'Approved by',
//           'Flat Number',
//           'Phone Number',
//           'Accompanied',
//           'Vehicle Number',
//           'Check In Date',
//           'Check In',
//           'Check Out Date',
//           'Check Out'
//         ];
//       case 'current':
//       default:
//         return [
//           'Name',
          
//           'Flat Number',
//           'Check In Date',
//         ];
//     }
//   };

//   const isDateColumn = (column) => {
//     return ['Check In Date', 'Check In', 'Check Out Date', 'Check Out', 'Date', 'Time'].includes(column);
//   };

//   const renderTableCell = (visitor, column) => {
//     switch (column) {
//       case 'Name':
//         return (
//           <div className="flex items-center space-x-3">
//             {visitor.imageUrl ? (
//               <img 
//                 src={visitor.imageUrl} 
//                 alt={`${visitor.firstName || ''} ${visitor.lastName || ''}`}
//                 className="w-10 h-10 rounded-full object-cover"
//                 onError={(e) => {
//                   e.target.onerror = null; // Prevent infinite loop
//                   e.target.src = '/Images/profile.png'; // Placeholder image
//                 }}
//               />
//             ) : (
//               <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
//                 <span className="text-gray-600 uppercase">
//                   {`${visitor.firstName?.[0] || ''}${visitor.lastName?.[0] || ''}`}
//                 </span>
//               </div>
//             )}
//             <span className="font-medium text-gray-900">
//               {`${visitor.firstName || ''} ${visitor.lastName || ''}`}
//             </span>
//           </div>
//         );
//       case 'Phone Number':
//         return visitor.visitorPhoneNumber || 'N/A';
//       case 'Flat Number':
//         return `${visitor.wing || ''}-${visitor.flatNumber || ''}`;
//       case 'Company Name':
//         return visitor.company || 'N/A';
//       case 'Approved By':
//         return visitor.approvedBy ? visitor.approvedBy.name : 'N/A';
//       case 'Date':
//         return visitor.createdAt ? dayjs(visitor.createdAt.toDate()).format('D MMM, YYYY') : 'N/A';
//       case 'Check In':
//       case 'Time':
//         return visitor.checkInTime ? dayjs(visitor.checkInTime.toDate()).format('hh:mm A') : 'N/A';
//       case 'Entry Code':
//         return visitor.ticketId || 'N/A';
//       case 'Accompanying':
//       case 'Accompanied':
//         return visitor.nop || 'N/A';
//       case 'Vehicle Number':
//         return visitor.vehicleNumber || 'N/A';
//       case 'Check In Date':
//         return visitor.createdAt ? dayjs(visitor.createdAt.toDate()).format('D MMM, YYYY') : 'N/A';
//       case 'Check Out Date':
//         return visitor.checkOutDate ? dayjs(visitor.checkOutDate.toDate()).format('D MMM, YYYY') : 'N/A';
//       case 'Check Out':
//         return visitor.checkOutTime ? dayjs(visitor.checkOutTime.toDate()).format('hh:mm A') : 'N/A';
//       default:
//         return 'N/A';
//     }
//   };
//   // const renderTableCell = (visitor, column) => {
//   //   switch(column) {
//   //     case 'Name':
//   //       return `${visitor.firstName || ''} ${visitor.lastName || ''}`;
//   //     case 'Phone Number':
//   //       return visitor.visitorPhoneNumber || 'N/A';
//   //     case 'Flat Number':
//   //       return `${visitor.wing || ''}-${visitor.flatNumber || ''}`;
//   //     case 'Company Name':
//   //       return visitor.company || 'N/A';
//   //     case 'Approved By':
//   //       return visitor.approvedBy ? visitor.approvedBy.name : 'N/A';
//   //       case 'Date':
//   //         return visitor.createdAt ? dayjs(visitor.createdAt.toDate()).format('D MMM, YYYY') : 'N/A';
//   //       case 'Check In':
//   //       case 'Time':
//   //         return visitor.checkInTime ? dayjs(visitor.checkInTime.toDate()).format('hh:mm A') : 'N/A';
//   //       case 'Entry Code':
//   //         return visitor.ticketId || 'N/A';
//   //       case 'Accompanying':
//   //       case 'Accompanied':
//   //         return visitor.nop || 'N/A';
//   //       case 'Vehicle Number':
//   //         return visitor.vehicleNumber || 'N/A';
//   //       case 'Check In Date':
//   //         return visitor.createdAt ? dayjs(visitor.createdAt.toDate()).format('D MMM, YYYY') : 'N/A';
//   //       case 'Check Out Date':
//   //         return visitor.checkOutDate ? dayjs(visitor.checkOutDate.toDate()).format('D MMM, YYYY') : 'N/A';
//   //       case 'Check Out':
//   //         return visitor.checkOutTime ? dayjs(visitor.checkOutTime.toDate()).format('hh:mm A') : 'N/A';
//   //       default:
//   //         return 'N/A';
//   //     }
//   //   };
  
//     const handleDateSort = () => {
//       setDateSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
//     };
  
//     const handleRowSelect = (index) => {
//       setSelectedRows(prev => {
//         if (prev.includes(index)) {
//           return prev.filter(i => i !== index);
//         }
//         return [...prev, index];
//       });
//     };
  
//     const handleSelectAll = () => {
//       if (selectedRows.length === currentItems.length) {
//         setSelectedRows([]);
//       } else {
//         setSelectedRows(currentItems.map((_, index) => indexOfFirstItem + index));
//       }
//     };
  
//     const handleDeleteSelected = () => {
//       setDeleteItemName(`${selectedRows.length} selected visitors`);
//       setDeleteFunction(() => async () => {
//         try {
//           const visitorIds = selectedRows.map(index => {
//             const relativeIndex = index - indexOfFirstItem;
//             return currentItems[relativeIndex].id;
//           });
          
//           for (const id of visitorIds) {
//             await deleteDoc(doc(db, "visitors", id));
//           }
          
//           setSelectedRows([]);
//           toast.success("Selected visitors deleted successfully");
//           setIsDeleteModalOpen(false);
//         } catch (error) {
//           console.error("Error deleting visitors:", error);
//           toast.error("Failed to delete selected visitors");
//         }
//       });
//       setIsDeleteModalOpen(true);
//     };
  
//     const totalPages = Math.ceil(filteredVisitors.length / itemsPerPage);
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentItems = filteredVisitors.slice(indexOfFirstItem, indexOfLastItem);
//     const isAllSelected = currentItems.length > 0 && selectedRows.length === currentItems.length;
  
//     return (
//       <div className="mt-1 bg-white border rounded-lg overflow-hidden flex flex-col" style={{ position: 'relative', zIndex: 1, fontFamily: 'Plus_Jakarta' }}>
//         {/* <div className="sticky top-0 z-20 bg-white">
//             <div className='flex justify-between'>
//                 <div className='flex  gap-3 ml-7 mt-7 '>
//                     <h1 className='flex-1'>Visitors</h1>
//                     <h4>View all your visitors</h4>
//                 </div>
//                 <div className="ml-7 mt-7 gap-4">
//             {['current', 'expected', 'visited'].map((tab) => (
//               <span
//                 key={tab}
//                 className={`${tab === 'current' ? '' : 'ml-3'} p-2 cursor-pointer ${
//                   activeTab === tab ? 'border border-[#E4E7EC] bg-[#F9FAFB] font-semibold text-black' : 'text-[#6B7280]'
//                 }`}
//                 style={{ borderRadius: 8 }}
//                 onClick={() => setActiveTab(tab)}
//               >
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </span>
//             ))}
//           </div>
//             </div>
         
  
//           <div className="flex flex-col sm:flex-row items-stretch p-6 gap-7">
            
//             <span>Guest</span>
//             <span>Guest</span>
//             <span>Guest</span>
//             <span>Guest</span>
//             <span>Guest</span>
//           </div>
//         </div> */}
//   <div className="sticky top-0 z-20 bg-white">
//   <div className="flex justify-between items-start">
//     {/* Left side - Title and View all link */}
//     <div className="flex flex-col gap-1 ml-7 mt-7">
//       <h1 className="text-2xl font-semibold text-gray-900">Visitors</h1>
//       <a href="#" className="text-[15px] text-gray-500 hover:underline underline">View all your visitors</a>
//     </div>

//     {/* Right side - Filter buttons */}
//     <div className="flex gap-2 mt-7 mr-7">
//     {['Current', ...(activeMainTab === 'Guest' || activeMainTab === 'Delivery' ? ['Expected'] : []), 'Visited'].map((filter) => (
//               <button
//                 key={filter}
//                 onClick={() => setActiveTab(filter.toLowerCase())}
//                 className={`px-4 py-2 rounded-lg text-[15px] ${
//                   activeTab === filter.toLowerCase()
//                     ? 'bg-gray-50 border border-gray-200 text-gray-900'
//                     : 'text-gray-500 hover:bg-gray-50'
//                 }`}
//               >
//                 {filter}
//               </button>
//             ))}
//     </div>
//   </div>

//   {/* Navigation tabs */}
//   <div className="flex gap-8 px-7 mt-6 mb-5">
//     {['Guest', 'Helper', 'Delivery', 'Cab', 'Other'].map((tab) => (
//       <button
//         key={tab}
//         onClick={() => setActiveMainTab(tab)}
//         className={`relative pb-1 text-[15px] font-medium ${
//           activeMainTab === tab
//             ? 'text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gray-900'
//             : 'text-gray-500 hover:text-gray-700'
//         }`}
//       >
//         {tab}
//       </button>
//     ))}
//   </div>
// </div>
//         <div className="flex-grow overflow-x-auto">
//           <div className="inline-block min-w-full align-middle">
//             <table className="min-w-full divide-y divide-gray-200" style={{ tableLayout: 'fixed', width: 'max-content' }}>
//               <thead className="text-xs text-gray-500 bg-gray-50 sticky top-0" style={{fontSize:'12px'}}>
//                 <tr className="border-y">
//                   {selectedRows.length > 0 ? (
//                     <>
//                       <th scope="col" className="p-4 w-10">
//                         {/* <div className="flex items-center justify-center">
//                           <CheckboxWithTick
//                             isSelected={selectedRows.length > 0}
//                             onClick={handleSelectAll}
//                             isMinusIcon={selectedRows.length > 0 && selectedRows.length < currentItems.length}
//                           />
//                         </div> */}
//                       </th>
//                       <th scope="col" className="px-6 py-3">
//                         <div className="flex text-gray-600 gap-2">
//                           <span className="font-semibold" style={{color:'#4B5563', fontSize:12}}>{selectedRows.length}</span>
//                           <span className="font-semibold" style={{color:'#4B5563', fontSize:12}}>selected</span>
//                         </div>
//                       </th>
//                       <th scope="col" className="px-6 py-3"></th>
//                       <th scope="col" className="px-6 py-3"></th>
//                       <th scope="col" className="px-6 py-3"></th>
//                       <th scope="col" className="px-6 py-3"></th>
//                       <th scope="col" className="px-6 py-3"></th>
//                       <th scope="col" className="px-6 py-3"></th>
//                       <th scope="col" className="px-6 py-3"></th>
//                       <th scope="col" className="px-6 py-3"></th>
//                       <th scope="col" className="px-6 py-3 text-right">
//                         <span 
//                           onClick={handleDeleteSelected}
//                           className="text-red-600 cursor-pointer hover:text-red-700"
//                         >
//                           Delete
//                         </span>
//                       </th>
//                     </>
//                   ) : (
//                     <>
//                       <th scope="col" className="p-2">
//                         {/* <div className="flex items-center justify-center">
//                           <CheckboxWithTick
//                             isSelected={isAllSelected}
//                             onClick={handleSelectAll}
//                           />
//                         </div> */}
//                       </th>
//                       {getTableColumns().map((column) => (
//                         <th
//                           key={column}
//                           scope="col"
//                           className="px-4 py-3 text-left whitespace-nowrap"
//                           onClick={isDateColumn(column) ? handleDateSort : undefined}
//                           style={isDateColumn(column) ? { cursor: 'pointer', minWidth: '150px' } : { minWidth: '120px' }}
//                         >
//                           <div className="flex items-center">
//                             {column}
//                             {isDateColumn(column) && <SortIcon direction={dateSortDirection} />}
//                           </div>
//                         </th>
//                       ))}
//                     </>
//                   )}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {currentItems.map((visitor, index) => {
//                   const actualIndex = indexOfFirstItem + index;
//                   const isSelected = selectedRows.includes(actualIndex);
                  
//                   return (
//                     <tr key={visitor.id} className="bg-white hover:bg-gray-50" style={{fontSize:'14px'}}>
//                       <td className="p-2" >
//                         <div className="flex items-center justify-center">
//                           {/* <CheckboxWithTick
//                             isSelected={isSelected}
//                             onClick={() => handleRowSelect(actualIndex)}
//                           /> */}
//                         </div>
//                       </td>
//                       {getTableColumns().map((column, colIndex) => (
//                         <td key={colIndex} className="px-4 py-4 whitespace-nowrap">
//                           {renderTableCell(visitor, column)}
//                         </td>
//                       ))}
//                     </tr>
//                   );
//                 })}
//                 {filteredVisitors.length === 0 && (
//                   <tr>
//                     <td colSpan={getTableColumns().length + 1} className="px-6 py-4 text-center text-gray-500" style={{ height: '300px' }}>
//                       <div className="flex flex-col items-center justify-center h-full">
//                         <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
//                         </svg>
//                         <p className="text-lg font-semibold">No guest visitors found</p>
//                         <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
  
//         {/* <div className="sticky bottom-0 bg-white flex justify-between items-center px-6 py-3 border-t z-20">
//           <div className="text-sm font-semibold text-gray-700">
//             Page {currentPage} of {totalPages || 1}
//           </div>
//           <div className="flex space-x-2">
//             <button
//               onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className={`px-3 py-1 border rounded ${
//                 currentPage === 1 ? "bg-gray-100 text-gray-400" : "bg-white text-gray-700 hover:bg-gray-50"
//               }`}
//               style={{ fontSize: "14px", border: "1px solid #D1D5DB" }}
//             >
//               Previous
//             </button>
//             <button
//               onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//               disabled={currentPage === totalPages}
//               className={`px-3 py-1 border rounded ${
//                 currentPage === totalPages ? "bg-gray-100 text-gray-400" : "bg-white text-gray-700 hover:bg-gray-50"
//               }`}
//               style={{ fontSize: "14px", border: "1px solid #D1D5DB" }}
//             >
//               Next
//             </button>
//           </div>
//         </div> */}
  
//         <DeleteModal
//           isOpen={isDeleteModalOpen}
//           onClose={() => setIsDeleteModalOpen(false)}
//           onDelete={deleteFunction}
//           itemName={deleteItemName}
//         />
//       </div>
//     );
//   };
  
//   export default GuestDashTable;

import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, getFirestore, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import DeleteModal from '../Modals/DeleteModal';

// Dropdown component for multiple flats
const MultipleFlatsCell = ({ flatNumbers }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!flatNumbers || flatNumbers.length <= 1) {
    return <span>{flatNumbers?.[0] || 'N/A'}</span>;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1 text-medium text-gray-700  rounded-md hover:bg-gray-50"
      >
        <span>{flatNumbers.length} Flats</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 z-10 w-45 mt-1 bg-white border rounded-md shadow-lg">
          <div className="py-1">
            {flatNumbers.map((flat, index) => (
              <div key={index} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                {flat}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Sort icon component
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

const VisitorDashboard = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [activeMainTab, setActiveMainTab] = useState("Guest");
  const [visitors, setVisitors] = useState([]);
  const [helpers, setHelpers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateSortDirection, setDateSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemName, setDeleteItemName] = useState('');
  const [deleteFunction, setDeleteFunction] = useState(null);

  const db = getFirestore(getApp());
  const itemsPerPage = 10;

  // Fetch visitors and helpers data
  useEffect(() => {
    // Fetch visitors
    const visitorQuery = query(collection(db, 'visitors'), orderBy('createdAt', 'desc'));
    const unsubscribeVisitors = onSnapshot(visitorQuery, (snapshot) => {
      const visitorsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVisitors(visitorsData);
    });

    // Fetch helpers
    const helperQuery = query(collection(db, 'helpers'), orderBy('createdAt', 'desc'));
    const unsubscribeHelpers = onSnapshot(helperQuery, (snapshot) => {
      const helpersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHelpers(helpersData);
    });

    return () => {
      unsubscribeVisitors();
      unsubscribeHelpers();
    };
  }, []);

  const scrollbarHideStyles = {
    '.hide-scrollbar': {
      /* Hide scrollbar for Chrome, Safari and Opera */
      '&::-webkit-scrollbar': {
        display: 'none'
      },
      /* Hide scrollbar for IE, Edge and Firefox */
      '-ms-overflow-style': 'none',
      'scrollbar-width': 'none'
    }
  };

  // Filter data based on active tabs
  useEffect(() => {
    let filtered = [];
    
    if (activeMainTab === 'Helper') {
      filtered = helpers.filter(helper => {
        // Filter logic for helpers
        switch(activeTab) {
          case 'current':
            return helper.current === true && helper.status?.toLowerCase() === 'approved';
          case 'visited':
            return helper.current === false;
          default:
            return true;
        }
      });
    } else {
      filtered = visitors.filter(visitor => {
        // Filter logic for other visitor types
        const visitorPurpose = visitor.purpose?.toLowerCase() || '';
        const mainTabPurpose = activeMainTab.toLowerCase();
        if (visitorPurpose !== mainTabPurpose) return false;

        switch(activeTab) {
          case 'current':
            return visitor.current === true && visitor.status?.toLowerCase() === 'approved';
          case 'expected':
            return visitor.status?.toLowerCase() === 'preapproved';
          case 'visited':
            return visitor.current === false;
          default:
            return false;
        }
      });
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => {
        const fullName = `${item.firstName || ''} ${item.lastName || ''}`.toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        return fullName.includes(searchLower) ||
               (item.flatNumber?.toString().includes(searchLower)) ||
               (item.phoneNumber || item.visitorPhoneNumber)?.includes(searchLower);
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = a.createdAt ? a.createdAt.toDate().getTime() : 0;
      const dateB = b.createdAt ? b.createdAt.toDate().getTime() : 0;
      return dateSortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [activeTab, activeMainTab, searchTerm, dateSortDirection, visitors, helpers]);

  // Get table columns based on active tab
  const getTableColumns = () => {
    if (activeMainTab === 'Helper') {
      return [
        'Name',
        'Flat Number',
        ...(activeTab === 'visited' ? ['Check Out Date'] : ['Check In Date']),
      ];
    }

    switch(activeTab) {
      case 'expected':
        return [
          'Name',
          'Flat Number',
          'Date'
        ];
      case 'visited':
        return [
          'Name',
          'Flat Number',
          'Check Out Date',
        ];
      case 'current':
      default:
        return [
          'Name',
          'Flat Number',
          'Check In Date',
        ];
    }
  };

  // Render table cell content
  const renderTableCell = (item, column) => {
    if (activeMainTab === 'Helper') {
      switch (column) {
        case 'Name':
          return (
            <div className="flex items-center space-x-3">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={`${item.firstName || ''} ${item.lastName || ''}`}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/Images/profile.png';
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600 uppercase">
                    {`${item.firstName?.[0] || ''}${item.lastName?.[0] || ''}`}
                  </span>
                </div>
              )}
              <span className="font-medium text-gray-900">
                {`${item.firstName || ''} ${item.lastName || ''}`}
              </span>
            </div>
          );
        case 'Flat Number':
          return <MultipleFlatsCell flatNumbers={item.flatNumbers} />;
        case 'Phone Number':
          return item.phoneNumber || 'N/A';
        case 'Check In Date':
          return item.checkInDate ? dayjs(item.checkInDate.toDate()).format('D MMM, YYYY') : 'N/A';
        case 'Check Out Date':
          return item.checkOutDate ? dayjs(item.checkOutDate.toDate()).format('D MMM, YYYY') : 'N/A';
        default:
          return 'N/A';
      }
    }

    // Regular visitor cells
    switch (column) {
      case 'Name':
        return (
          <div className="flex items-center space-x-3">
            {item.imageUrl ? (
              <img 
                src={item.imageUrl} 
                alt={`${item.firstName || ''} ${item.lastName || ''}`}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/Images/profile.png';
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 uppercase">
                  {`${item.firstName?.[0] || ''}${item.lastName?.[0] || ''}`}
                </span>
              </div>
            )}
            <span className="font-medium text-gray-900">
              {`${item.firstName || ''} ${item.lastName || ''}`}
            </span>
          </div>
        );
      case 'Flat Number':
        return `${item.wing || ''}-${item.flatNumber || ''}`;
      case 'Date':
      case 'Check In Date':
        return item.createdAt ? dayjs(item.createdAt.toDate()).format('D MMM, YYYY') : 'N/A';
      case 'Check Out Date':
        return item.checkOutDate ? dayjs(item.checkOutDate.toDate()).format('D MMM, YYYY') : 'N/A';
      default:
        return 'N/A';
    }
  };

  const getColumnWidth = (column) => {
    switch(column) {
      case 'Name':
        return '300px';  // Fixed width for name column
      case 'Flat Number':
        return '200px';  // Fixed width for flat number
      case 'Check In Date':
      case 'Check Out Date':
      case 'Date':
        return '200px';  // Fixed width for date columns
      default:
        return '200px';  // Default width for other columns
    }
  };

  const handleDateSort = () => {
    setDateSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const isDateColumn = (column) => {
    return ['Check In Date', 'Check Out Date', 'Date'].includes(column);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="mt-1 bg-white border rounded-lg overflow-hidden flex flex-col  min-w-[400px] " 
         style={{ position: 'relative', zIndex: 1, fontFamily: 'Plus_Jakarta',   minWidth: '400px'  }}>
      <div className="sticky top-0 z-20 bg-white">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1 ml-7 mt-7">
            <h1 className="text-[16px] font-semibold text-gray-900">Visitors</h1>
            <a href="#" className="text-[12px] text-gray-500 hover:underline underline">
              View all your visitors
            </a>
          </div>

          {/* Top Filters */}
          <div className="flex gap-2 mt-7 mr-7">
            {['Current', ...(activeMainTab === 'Guest' || activeMainTab === 'Delivery' ? ['Expected'] : []), 'Visited']
              .map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveTab(filter.toLowerCase())}
                  className={`px-4 py-2 rounded-lg text-[12px] font-semibold ${
                    activeTab === filter.toLowerCase()
                      ? 'bg-gray-50 border border-gray-200 text-gray-900'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {filter}
                </button>
              ))}
          </div>
        </div>

        {/* Main Navigation Tabs */}
        <div className="flex gap-8 px-7 mt-6 mb-5">
          {['Guest', 'Helper', 'Delivery', 'Cab', 'Other'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveMainTab(tab)}
              className={`relative pb-1 text-[12px] font-medium ${
                activeMainTab === tab
                  ? 'text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gray-900 '
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-grow overflow-hidden">
        <div className="h-full overflow-auto hide-scrollbar">
          <table className="min-w-full divide-y divide-gray-200" 
                 style={{ tableLayout: 'fixed', minWidth: '400px'  }}>
            <thead className="text-xs font-medium text-gray-500 bg-gray-50 sticky top-0" 
                   style={{fontSize:'12px'}}>
              <tr className="border-y">
                <th scope="col" className="p-2"></th>
                {getTableColumns().map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className="px-4 py-3 text-left whitespace-nowrap font-medium"
                    onClick={isDateColumn(column) ? handleDateSort : undefined}
                    style={{ 
                        ...isDateColumn(column) ? { cursor: 'pointer' } : {},
                        width: getColumnWidth(column)  // Apply fixed width
                      }}
                    >
                      <div className="flex items-center">
                        {column}
                        {isDateColumn(column) && <SortIcon direction={dateSortDirection} />}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
              {currentItems.slice(0, 10).map((item, index) => (
                  <tr key={item.id} className="bg-white hover:bg-gray-50" style={{fontSize:'14px'}}>
                    <td className="p-2"></td>
                    {getTableColumns().map((column, colIndex) => (
                      <td key={colIndex} className="px-4 py-4 whitespace-nowrap">
                        {renderTableCell(item, column)}
                      </td>
                    ))}
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={getTableColumns().length + 1} className="px-6 py-4 text-center text-gray-500" style={{ height: '400px' }}>
                      <div className="flex flex-col items-center justify-center h-full">
                        <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <p className="text-lg font-semibold">
                          {activeMainTab === 'Helper' ? 'No helpers found' : 'No visitors found'}
                        </p>
                        <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
                      </div>
                    </td>
                  </tr>
                )}

{filteredData.length > 0 && filteredData.length < 10 && 
                [...Array(10 - filteredData.length)].map((_, index) => (
                  <tr key={`empty-${index}`} style={{ height: '69px' }}>
                    <td colSpan={getTableColumns().length + 1}></td>
                  </tr>
                ))
              }
              </tbody>
            </table>
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
  
  export default VisitorDashboard;