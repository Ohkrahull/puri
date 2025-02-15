// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import { getAllSupportDocuments, deleteSupportDocument } from '../firebase/services/support';
// import EditSupport from '../Components/EditSupport';
// import DeleteModal from '../Modals/DeleteModal';
// import { toast } from 'react-toastify';
// import { Link } from 'react-router-dom';

// const SearchInput = ({ supportDocuments, onSearch }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showDropdown, setShowDropdown] = useState(false);

//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);
//     setShowDropdown(value.length > 0);
//     onSearch(value);
//   };

//   const handleItemClick = (document) => {
//     setSearchTerm(`${document.userInfo?.firstName || ''} ${document.userInfo?.lastName || ''}`);
//     setShowDropdown(false);
//     onSearch(document); // Pass the entire document object
//   };

//   const filteredDocuments = supportDocuments.filter(
//     (document) =>
//       `${document.userInfo?.firstName || ''} ${document.userInfo?.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
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

//   return (
//     <div className="relative">
//       <div style={{
//         display: "flex",
//         padding: "8px 16px",
//         alignItems: "center",
//         justifyContent: "space-between",
//         alignSelf: "stretch",
//         border: "1px solid #D1D5DB",
//         borderRadius: "10px",
//         color: "#6B7280",
//         fontSize: "16px",
//         fontFamily:'Plus_Jakarta',
//         width: "300px",
//       }}>
//         <input
//           type="text"
//           placeholder="Search"
//           value={searchTerm}
//           onChange={handleInputChange}
//           style={{
//             border: 'none',
//             outline: "none",
//             boxShadow: 'none',
//             width: "100%",
//             background: "transparent",
//             color: "inherit",
//             fontSize: "inherit",
//             fontFamily: "inherit",
//           }}
//         />
//         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
//           <path d="M17.9419 17.0579L14.0302 13.1469C15.1639 11.7858 15.7293 10.0399 15.6086 8.2725C15.488 6.50512 14.6906 4.85229 13.3823 3.65785C12.074 2.46341 10.3557 1.81932 8.58462 1.85957C6.81357 1.89982 5.12622 2.62131 3.87358 3.87395C2.62094 5.12659 1.89945 6.81394 1.8592 8.58498C1.81895 10.356 2.46304 12.0744 3.65748 13.3827C4.85192 14.6909 6.50475 15.4883 8.27214 15.609C10.0395 15.7297 11.7854 15.1643 13.1466 14.0305L17.0575 17.9422C17.1156 18.0003 17.1845 18.0464 17.2604 18.0778C17.3363 18.1092 17.4176 18.1254 17.4997 18.1254C17.5818 18.1254 17.6631 18.1092 17.739 18.0778C17.8149 18.0464 17.8838 18.0003 17.9419 17.9422C17.9999 17.8842 18.046 17.8152 18.0774 17.7394C18.1089 17.6635 18.125 17.5822 18.125 17.5001C18.125 17.4179 18.1089 17.3366 18.0774 17.2607C18.046 17.1849 17.9999 17.1159 17.9419 17.0579ZM3.12469 8.75006C3.12469 7.63754 3.45459 6.55 4.07267 5.62497C4.69076 4.69995 5.56926 3.97898 6.5971 3.55323C7.62493 3.12749 8.75593 3.0161 9.84707 3.23314C10.9382 3.45018 11.9405 3.98591 12.7272 4.77258C13.5138 5.55925 14.0496 6.56153 14.2666 7.65267C14.4837 8.74382 14.3723 9.87482 13.9465 10.9027C13.5208 11.9305 12.7998 12.809 11.8748 13.4271C10.9497 14.0452 9.86221 14.3751 8.74969 14.3751C7.25836 14.3734 5.82858 13.7802 4.77404 12.7257C3.71951 11.6712 3.12634 10.2414 3.12469 8.75006Z" fill="#6B7280"/>
//         </svg>
//       </div>

//       {showDropdown && filteredDocuments.length > 0 && (
//         <div className="absolute w-full mt-3 bg-white border border-gray-200 rounded-md shadow-lg z-10"
//         style={{
//           maxHeight: filteredDocuments.length > 4 ? '240px' : 'auto',
//           overflowY: filteredDocuments.length > 4 ? 'auto' : 'visible'
//         }}
//         >
//           {filteredDocuments.map((document, index) => (
//             <div
//               key={index}
//               className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
//               style={{borderBottom: '1px solid var(--Gray-100, #E5E7EB)'}}
//               onClick={() => handleItemClick(document)}
//             >
//               <div className="font-medium flex justify-between" style={{fontSize:'14px', color:'#6B7280'}}>
//                 {/* {`${document.userInfo?.firstName || ''} ${document.userInfo?.lastName || ''}`} */}
//                 {truncateText(`${document.userInfo?.firstName || ''} ${document.userInfo?.lastName || ''}`, 20)}

//                 <span> {`${document.userInfo?.wing || ''} - ${document.userInfo?.flatNumber || ''}`}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const SupportTable = () => {
//   const [supportData, setSupportData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [filteredData, setFilteredData] = useState([]);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [editingSupport, setEditingSupport] = useState(null);
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [deleteItemName, setDeleteItemName] = useState('');
//   const [deleteFunction, setDeleteFunction] = useState(null);

//   const itemsPerPage = 9;
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
//   const isAllSelected = filteredData.length > 0 && selectedRows.length === filteredData.length;

//   const fetchSupportData = useCallback(async () => {
//     try {
//       const data = await getAllSupportDocuments();
//       // console.log(data);
      
//       setSupportData(data);
//       setFilteredData(data);
//     } catch (error) {
//       // console.error('Error fetching support data:', error);
//       toast.error('Failed to fetch support data');
//     }
//   }, []);

//   useEffect(() => {
//     fetchSupportData();
//   }, [fetchSupportData]);

//   const handleSearch = (documentOrTerm) => {
//     if (typeof documentOrTerm === 'string') {
//       const term = documentOrTerm.toLowerCase();
//       if (term === "") {
//         setFilteredData(supportData);
//       } else {
//         const filtered = supportData.filter((item) => {
//           const fullName = `${item.userInfo?.firstName || ''} ${item.userInfo?.lastName || ''}`.toLowerCase();
//           return fullName.includes(term);
//         });
//         setFilteredData(filtered);
//       }
//     } else if (typeof documentOrTerm === 'object') {
//       // If a document object is passed, filter to show only that document
//       setFilteredData([documentOrTerm]);
//     }
//     setCurrentPage(1);
//   };

//   const handleItemClick = (support) => {
//     setFilteredData([support]);
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
//     if (selectedRows.length === filteredData.length) {
//       setSelectedRows([]);
//     } else {
//       setSelectedRows(filteredData.map((_, index) => index));
//     }
//   };

//   const handleDeleteSelected = () => {
//     setDeleteItemName('all selected support items');
//     setDeleteFunction(() => async () => {
//       try {
//         await Promise.all(selectedRows.map(index => deleteSupportDocument(filteredData[index].id)));
//         setSelectedRows([]);
//         setIsDeleteModalOpen(false);
//         fetchSupportData();
//         toast.success('Selected support items deleted successfully');
//       } catch (error) {
//         console.error('Error deleting selected support items:', error);
//         toast.error('Failed to delete selected support items');
//       }
//     });
//     setIsDeleteModalOpen(true);
//   };

//   const handleDeleteClick = (id, comment) => {
//     setDeleteItemName(`support item "${comment.substring(0, 20)}..."`);
//     setDeleteFunction(() => async () => {
//       try {
//         await deleteSupportDocument(id);
//         setIsDeleteModalOpen(false);
//         fetchSupportData();
//         toast.success('Support item deleted successfully');
//       } catch (error) {
//         console.error('Error deleting support item:', error);
//         toast.error('Failed to delete support item');
//       }
//     });
//     setIsDeleteModalOpen(true);
//   };

//   const handleEditClick = (support, index) => {
//     setEditingSupport({ ...support });
//     setEditingIndex(index);
//     setIsEditModalOpen(true);
//   };

//   const handleSaveEdit = async (updatedSupport) => {
//     try {
//       // Implement the logic to update the support item in Firebase
//       // For now, we'll just update it in the local state
//       const updatedData = supportData.map((item, index) => 
//         index === editingIndex ? updatedSupport : item
//       );
//       setSupportData(updatedData);
//       setFilteredData(updatedData);
//       setIsEditModalOpen(false);
//       setEditingSupport(null);
//       setEditingIndex(null);
//       toast.success('Support item updated successfully');
//     } catch (error) {
//       console.error('Error updating support item:', error);
//       toast.error('Failed to update support item');
//     }
//   };

//   const handleCloseModal = () => {
//     setIsEditModalOpen(false);
//     setEditingSupport(null);
//     setEditingIndex(null);
//   };

//   const CheckboxWithTick = ({ isSelected, onClick }) => (
//     <div
//       onClick={onClick}
//       style={{
//         width: '20px',
//         height: '20px',
//         border: '1px solid #6B7280',
//         borderRadius: '6px',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         cursor: 'pointer',
//       }}
//     >
//       {isSelected && (
//         <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
//           <path d="M10 3L4.5 8.5L2 6" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//         </svg>
//       )}
//     </div>
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

//   return (
//     <div className="mt-1 bg-white border rounded-lg overflow-hidden flex flex-col h-full">
//       <div className="sticky top-0 z-20 bg-white">
//         <div className="flex justify-between items-center p-6">
//           <div className="relative z-40">
//             <SearchInput supportDocuments={supportData} onSearch={handleSearch} />
//           </div>
//         </div>
//       </div>
      
//       <div className="flex-grow overflow-auto">
//         <table className="w-full text-sm text-gray-500" style={{ minWidth: '1000px' }}>
//           <thead className="text-xs text-gray-500 bg-gray-50 sticky top-0" style={{fontSize:'12px'}}>
//             <tr className="border-y">
//               <th scope="col" className="p-4" style={{width:'40px'}}>
//                 <div className="flex items-center justify-center">
//                   <CheckboxWithTick
//                     isSelected={isAllSelected}
//                     onClick={handleSelectAll}
//                   />
//                 </div>
//               </th>
//               <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '150px'}}>Name</th>
//               <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px'}}>Phone No</th>
//               <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '200px'}}>Email</th>
//               <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '100px'}}>Role</th>
//               <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '150px'}}>Comments</th>
//               <th scope="col" className="px-6 py-3 text-right" style={{minWidth: '120px'}}>
//                 <span 
//                   style={{
//                     visibility: selectedRows.length > 1 ? 'visible' : 'hidden',
//                     cursor: 'pointer',
//                     color: '#EF4444'
//                   }}
//                   onClick={handleDeleteSelected}
//                 >
//                   Delete All
//                 </span>
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentItems.length > 0 ? (
//               currentItems.map((item, index) => {
//                 const actualIndex = indexOfFirstItem + index;
//                 const isSelected = selectedRows.includes(actualIndex);
//                 return (
//                   <tr key={item.id} className="bg-white border-b hover:bg-gray-50" style={{fontSize:'14px'}}>
//                     <td className="p-4" style={{width:'40px'}}>
//                       <div className="flex items-center justify-center">
//                         <CheckboxWithTick
//                           isSelected={isSelected}
//                           onClick={() => handleRowSelect(actualIndex)}
//                         />
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-gray-900 font-medium" style={{minWidth: '150px'}}>
//                       {/* {`${item.userInfo?.firstName || 'N/A'} ${item.userInfo?.lastName || ''}`} */}
//                                     {truncateText(`${item.userInfo?.firstName || 'N/A'} ${item.userInfo?.lastName || ''}`, 20)}

//                     </td>
//                     <td className="px-6 py-4" style={{minWidth: '120px'}}>{item.phoneNumber || 'N/A'}</td>
//                     <td className="px-6 py-4" style={{minWidth: '200px'}}>{item.userInfo?.email || 'N/A'}</td>
//                     <td className="px-6 py-4" style={{minWidth: '100px'}}>{item.userInfo?.userType || 'N/A'}</td>
//                     <td className="px-6 py-4" style={{minWidth: '150px'}}>
//                       {item.comment ? (
//                         <Link to={`/support_view/${item.id}`} className="text-blue-600 hover:underline">
//                           View
//                         </Link>
//                       ) : (
//                         'N/A'
//                       )}
//                     </td>
//                     <td className="px-6 py-4 text-right" style={{minWidth: '120px'}}>
//                       <div className="flex justify-end space-x-4">
//                         <svg onClick={() => handleDeleteClick(item.id, item.comment)} style={{cursor:'pointer'}} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                           <path d="M16.875 3.75H3.125C2.95924 3.75 2.80027 3.81585 2.68306 3.93306C2.56585 4.05027 2.5 4.20924 2.5 4.375C2.5 4.54076 2.56585 4.69973 2.68306 4.81694C2.80027 4.93415 2.95924 5 3.125 5H3.75V16.25C3.75 16.5815 3.8817 16.8995 4.11612 17.1339C4.35054 17.3683 4.66848 17.5 5 17.5H15C15.3315 17.5 15.6495 17.3683 15.8839 17.1339C16.1183 16.8995 16.25 16.5815 16.25 16.25V5H16.875C17.0408 5 17.1997 4.93415 17.3169 4.81694C17.4342 4.69973 17.5 4.54076 17.5 4.375C17.5 4.20924 17.4342 4.05027 17.3169 3.93306C17.1997 3.81585 17.0408 3.75 16.875 3.75ZM15 16.25H5V5H15V16.25ZM6.25 1.875C6.25 1.70924 6.31585 1.55027 6.43306 1.43306C6.55027 1.31585 6.70924 1.25 6.875 1.25H13.125C13.2908 1.25 13.4497 1.31585 13.5669 1.43306C13.6842 1.55027 13.75 1.70924 13.75 1.875C13.75 2.04076 13.6842 2.19973 13.5669 2.31694C13.4497 2.43415 13.2908 2.5 13.125 2.5H6.875C6.70924 2.5 6.55027 2.43415 6.43306 2.31694C6.31585 2.19973 6.25 2.04076 6.25 1.875Z" fill="#EF4444"/>
//                         </svg>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td colSpan="7" className="px-6 py-4 text-center text-gray-500" style={{ height: '300px' }}>
//                   <div className="flex flex-col items-center justify-center h-full">
//                     <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                     </svg>
//                     <p className="text-lg font-semibold">No support items found</p>
//                     <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
//                   </div>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
      
//       <div className="sticky bottom-0 bg-white flex justify-between items-center px-6 py-3 border-t z-20">
//         <div
//           className="text-sm text-gray-700"
//           style={{
//             color: "var(--Gray-700, #1F2937)",
//             fontSize: "14px",
//             fontWeight: "600",
//           }}
//         >
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

// export default SupportTable;


import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getAllSupportDocuments, deleteSupportDocument, updateSupportStatus } from '../firebase/services/support';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DeleteModal from '../Modals/DeleteModal';




const SearchInput = ({ supportDocuments, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length > 0);
    onSearch(value);
  };

  const handleItemClick = (document) => {
    setSearchTerm(`${document.userInfo?.firstName || ''} ${document.userInfo?.lastName || ''}`);
    setShowDropdown(false);
    onSearch(document);
  };

  const filteredDocuments = supportDocuments.filter(
    (document) =>
      `${document.userInfo?.firstName || ''} ${document.userInfo?.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const truncateText = (text, charLimit = 20) => {
    if (text.length <= charLimit) return text;
    const lastSpace = text.lastIndexOf(' ', charLimit);
    return lastSpace > 0 ? text.slice(0, lastSpace) + '...' : text.slice(0, charLimit) + '...';
  };

  return (
    <div className="relative">
      <div style={{
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
        backgroundColor: '#F3F3F3',
      }}>
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

      {showDropdown && filteredDocuments.length > 0 && (
        <div className="absolute w-full mt-3 bg-white border border-gray-200 rounded-md shadow-lg z-10"
          style={{
            maxHeight: filteredDocuments.length > 4 ? '240px' : 'auto',
            overflowY: filteredDocuments.length > 4 ? 'auto' : 'visible'
          }}>
          {filteredDocuments.map((document, index) => (
            <div
              key={index}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
              style={{borderBottom: '1px solid var(--Gray-100, #E5E7EB)'}}
              onClick={() => handleItemClick(document)}
            >
              <div className="font-medium flex justify-between" style={{fontSize:'14px', color:'#6B7280'}}>
                {truncateText(`${document.userInfo?.firstName || ''} ${document.userInfo?.lastName || ''}`, 20)}
                <span>{`${document.userInfo?.wing || ''} - ${document.userInfo?.flatNumber || ''}`}</span>
              </div>
            </div>
          ))}
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



const SupportTable = () => {
  const [supportData, setSupportData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemName, setDeleteItemName] = useState('');
  const [deleteFunction, setDeleteFunction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const roleRef = useRef(null);
  const statusRef = useRef(null);

  const roles = ['All Roles', 'Member', 'Guest', 'Owner', 'N/A'];
  const statusOptions = ['All Status', 'Pending', 'Resolved', 'Rejected'];

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const isAllSelected = currentItems.length > 0 && selectedRows.length === currentItems.length;

  const fetchSupportData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllSupportDocuments();
      setSupportData(data);
      setFilteredData(data);
      setIsLoading(false);
    } catch (error) {
      setError('Failed to fetch support data');
      setIsLoading(false);
      toast.error('Failed to fetch support data');
    }
  }, []);

  useEffect(() => {
    fetchSupportData();
  }, [fetchSupportData]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roleRef.current && !roleRef.current.contains(event.target)) {
        setIsRoleDropdownOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setIsStatusDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setIsRoleDropdownOpen(false);
    filterData(role, selectedStatus);
  };

  const handleStatusSelect = async (status) => {
    setSelectedStatus(status);
    setIsStatusDropdownOpen(false);
    filterData(selectedRole, status);
  };

  const filterData = (role, status) => {
    let filtered = [...supportData];

    if (role !== 'All Roles') {
      filtered = filtered.filter(item => item.userInfo?.userType === role);
    }

    if (status !== 'All Status') {
      filtered = filtered.filter(item => item.status === status.toLowerCase());
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const updateStatus = async (itemId, newStatus) => {
    try {
      await updateSupportStatus(itemId, newStatus.toLowerCase());
      fetchSupportData(); // Refresh data
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleSearch = (documentOrTerm) => {
    if (typeof documentOrTerm === 'string') {
      const term = documentOrTerm.toLowerCase();
      if (term === "") {
        setFilteredData(supportData);
      } else {
        const filtered = supportData.filter((item) => {
          const fullName = `${item.userInfo?.firstName || ''} ${item.userInfo?.lastName || ''}`.toLowerCase();
          return fullName.includes(term);
        });
        setFilteredData(filtered);
      }
    } else if (typeof documentOrTerm === 'object') {
      setFilteredData([documentOrTerm]);
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
    if (selectedRows.length === currentItems.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentItems.map((_, index) => indexOfFirstItem + index));
    }
  };

  

  const handleDeleteSelected = () => {
    setDeleteItemName('all selected support items');
    setDeleteFunction(() => async () => {
      try {
        await Promise.all(selectedRows.map(index => deleteSupportDocument(filteredData[index].id)));
        setSelectedRows([]);
        setIsDeleteModalOpen(false);
        fetchSupportData();
        toast.success('Selected support items deleted successfully');
      } catch (error) {
        console.error('Error deleting selected support items:', error);
        toast.error('Failed to delete selected support items');
      }
    });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteClick = (id, comment) => {
    setDeleteItemName(`support item "${comment?.substring(0, 20)}..."`);
    setDeleteFunction(() => async () => {
      try {
        await deleteSupportDocument(id);
        setIsDeleteModalOpen(false);
        fetchSupportData();
        toast.success('Support item deleted successfully');
      } catch (error) {
        console.error('Error deleting support item:', error);
        toast.error('Failed to delete support item');
      }
    });
    setIsDeleteModalOpen(true);
  };

  const truncateText = (text, charLimit = 20) => {
    if (!text) return 'N/A';
    if (text.length <= charLimit) return text;
    const lastSpace = text.lastIndexOf(' ', charLimit);
    return lastSpace > 0 ? text.slice(0, lastSpace) + '...' : text.slice(0, charLimit) + '...';
  };

  const handleViewRequest = (support) => {
    navigate(`/support_view/${support.id}`);
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };


  const StatusDropdown = ({ currentStatus, onStatusChange }) => {
    const statuses = ['Pending', 'Approved', 'Rejected'];
    const [isOpen, setIsOpen] = useState(false);
  
    const getStatusStyles = (status) => {
      switch (capitalizeFirstLetter(status)) {
        case 'Approved':
          return {
            container: 'bg-green-50 text-green-700',
            dot: 'bg-green-600',
            text: 'text-green-700'
          };
        case 'Pending':
          return {
            container: 'bg-yellow-50 text-yellow-700',
            dot: 'bg-yellow-600',
            text: 'text-yellow-700'
          };
        case 'Rejected':
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
  
    // Get current status with first letter capitalized
    const displayStatus = capitalizeFirstLetter(currentStatus);
    const styles = getStatusStyles(currentStatus);
  
    return (
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`inline-flex items-center gap-2 cursor-pointer px-3 py-2 rounded-full ${styles.container}`}
          style={{ fontSize: '12px' }}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}></span>
          <span className={`${styles.text} font-medium`}>{displayStatus || 'N/A'}</span>
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
                  onClick={() => {
                    onStatusChange(status); // Pass the properly capitalized status
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 flex items-center gap-2 ${
                    capitalizeFirstLetter(currentStatus) === status ? 'bg-gray-50' : ''
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
  

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan="7" className="px-6 mt-8 py-4 text-center">
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
          <td colSpan="7" className="px-6 py-4 text-center text-red-500">
            {error}
          </td>
        </tr>
      );
    }

    if (currentItems.length === 0) {
      return (
        <tr>
          <td colSpan="7" className="px-6 py-4 text-center text-gray-500" style={{ height: '300px' }}>
            <div className="flex flex-col items-center justify-center h-full">
              <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-lg font-semibold">No support items found</p>
              <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
            </div>
          </td>
        </tr>
      );
    }

    return currentItems.map((item, index) => {
      const actualIndex = indexOfFirstItem + index;
      const isSelected = selectedRows.includes(actualIndex);
      return (
        <tr 
          key={item.id} 
          className="bg-white border-b hover:bg-gray-50 cursor-pointer"
          style={{fontSize:'14px'}}
        >
          <td className="p-4" style={{width:'40px'}}>
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
          <td 
            onClick={() => handleViewRequest(item)}
            className="px-6 py-4 whitespace-nowrap font-medium text-gray-900" 
            style={{minWidth: '120px'}}
          >
            {truncateText(`${item.userInfo?.firstName || 'N/A'} ${item.userInfo?.lastName || ''}`, 20)}
          </td>
          <td 
            onClick={() => handleViewRequest(item)}
            className="px-6 py-4 whitespace-nowrap font-medium " 
            style={{minWidth: '120px'}}
          >
             #{item.ticketId || 'N/A'}
            {/* {truncateText(`${item.userInfo?.firstName || 'N/A'} ${item.userInfo?.lastName || ''}`, 20)} */}
          </td>
          <td 
            onClick={() => handleViewRequest(item)}
            className="px-6 py-4 whitespace-nowrap" 
            style={{minWidth: '120px'}}
          >
           
            {truncateText(`${item.userInfo?.wing || 'N/A'} - ${item.userInfo?.flatNumber || 'N/A'}`, 20)}
          </td>
          <td 
            onClick={() => handleViewRequest(item)}
            className="px-6 py-4 whitespace-nowrap" 
            style={{minWidth: '120px'}}
          >
            {item.phoneNumber || 'N/A'}
          </td>
         
          <td 
            onClick={() => handleViewRequest(item)}
            className="px-6 py-4 whitespace-nowrap" 
            style={{minWidth: '120px'}}
          >
            {item.userInfo?.userType || 'N/A'}
          </td>
          <td 
            onClick={() => handleViewRequest(item)}
            className="px-6 py-4 whitespace-nowrap" 
            style={{minWidth: '120px'}}
          >
            {item.category || 'N/A'}
            {/* {item.userInfo?.email || 'N/A'} */}
          </td>
          <td className="px-6 py-4">
        <StatusDropdown
          currentStatus={item.status}
          onStatusChange={(newStatus) => updateStatus(item.id, newStatus)}
        />
      </td>
          {/* <td 
        onClick={() => handleViewRequest(item)}
        className="px-6 py-4 whitespace-nowrap" 
        style={{minWidth: '120px'}}
      >
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              item.status === 'resolved' 
                ? 'bg-green-100 text-green-800'
                : item.status === 'rejected'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
            onClick={() => setIsStatusDropdownOpen(item.id)}
          >
            {item.status || 'pending'}
          </button>
          {isStatusDropdownOpen === item.id && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
              {statusOptions.map((status) => (
                <div
                  key={status}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700"
                  onClick={() => {
                    updateStatus(item.id, status);
                    setIsStatusDropdownOpen(false);
                  }}
                >
                  {status}
                </div>
              ))}
            </div>
          )}
        </div>
      </td> */}
          {/* <td className="px-6 py-4 whitespace-nowrap text-right" style={{minWidth: '120px'}}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(item.id, item.comment);
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.875 3.75H3.125C2.95924 3.75 2.80027 3.81585 2.68306 3.93306C2.56585 4.05027 2.5 4.20924 2.5 4.375C2.5 4.54076 2.56585 4.69973 2.68306 4.81694C2.80027 4.93415 2.95924 5 3.125 5H3.75V16.25C3.75 16.5815 3.8817 16.8995 4.11612 17.1339C4.35054 17.3683 4.66848 17.5 5 17.5H15C15.3315 17.5 15.6495 17.3683 15.8839 17.1339C16.1183 16.8995 16.25 16.5815 16.25 16.25V5H16.875C17.0408 5 17.1997 4.93415 17.3169 4.81694C17.4342 4.69973 17.5 4.54076 17.5 4.375C17.5 4.20924 17.4342 4.05027 17.3169 3.93306C17.1997 3.81585 17.0408 3.75 16.875 3.75ZM15 16.25H5V5H15V16.25ZM6.25 1.875C6.25 1.70924 6.31585 1.55027 6.43306 1.43306C6.55027 1.31585 6.70924 1.25 6.875 1.25H13.125C13.2908 1.25 13.4497 1.31585 13.5669 1.43306C13.6842 1.55027 13.75 1.70924 13.75 1.875C13.75 2.04076 13.6842 2.19973 13.5669 2.31694C13.4497 2.43415 13.2908 2.5 13.125 2.5H6.875C6.70924 2.5 6.55027 2.43415 6.43306 2.31694C6.31585 2.19973 6.25 2.04076 6.25 1.875Z" fill="#EF4444"/>
              </svg>
            </button>
          </td> */}
        </tr>
      );
    });
  };

  return (
    <div className="mt-1 bg-white border rounded-lg overflow-hidden flex flex-col h-full">
      <div className="sticky top-0 z-20 bg-white">
        <div className="flex flex-col sm:flex-row justify-between items-center p-6">
          <div className="w-full sm:w-auto mb-4 sm:mb-0">
            <SearchInput supportDocuments={supportData} onSearch={handleSearch} />
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
              <div className="relative w-full sm:w-[242px]" ref={roleRef} style={{ position: 'relative', zIndex: 40 }}>
                <button 
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="w-full h-[50px] flex items-center justify-between px-4 py-2 bg-[#F3F3F3] border border-[#D1D5DB] rounded-[10px] text-[#6B7280] text-base"
                >
                  <span className="flex items-center gap-2 font-medium" style={{fontSize:14}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M9.19254 13.3078C9.25065 13.3659 9.29674 13.4348 9.3282 13.5107C9.35965 13.5865 9.37584 13.6679 9.37584 13.75C9.37584 13.8321 9.35965 13.9135 9.3282 13.9893C9.29674 14.0652 9.25065 14.1341 9.19254 14.1922L6.69254 16.6922C6.63449 16.7503 6.56556 16.7964 6.48969 16.8279C6.41381 16.8593 6.33248 16.8755 6.25035 16.8755C6.16821 16.8755 6.08688 16.8593 6.01101 16.8279C5.93514 16.7964 5.86621 16.7503 5.80816 16.6922L3.30816 14.1922C3.25009 14.1341 3.20403 14.0652 3.1726 13.9893C3.14118 13.9134 3.125 13.8321 3.125 13.75C3.125 13.6679 3.14118 13.5866 3.1726 13.5107C3.20403 13.4348 3.25009 13.3659 3.30816 13.3078C3.42544 13.1905 3.5845 13.1247 3.75035 13.1247C3.83247 13.1247 3.91379 13.1408 3.98966 13.1723C4.06553 13.2037 4.13447 13.2497 4.19253 13.3078L5.62535 14.7414V3.75C5.62535 3.58424 5.6912 3.42527 5.80841 3.30806C5.92562 3.19085 6.08459 3.125 6.25035 3.125C6.41611 3.125 6.57508 3.19085 6.69229 3.30806C6.8095 3.42527 6.87535 3.58424 6.87535 3.75V14.7414L8.30816 13.3078C8.36621 13.2497 8.43514 13.2036 8.51101 13.1722C8.58688 13.1407 8.66821 13.1245 8.75035 13.1245C8.83248 13.1245 8.91381 13.1407 8.98969 13.1722C9.06556 13.2036 9.13449 13.2497 9.19254 13.3078ZM16.6925 5.80782L14.1925 3.30782C14.1345 3.24971 14.0656 3.20361 13.9897 3.17215C13.9138 3.1407 13.8325 3.12451 13.7503 3.12451C13.6682 3.12451 13.5869 3.1407 13.511 3.17215C13.4351 3.20361 13.3662 3.24971 13.3082 3.30782L10.8082 5.80782C10.6909 5.92509 10.625 6.08415 10.625 6.25C10.625 6.41586 10.6909 6.57492 10.8082 6.69219C10.9254 6.80947 11.0845 6.87535 11.2503 6.87535C11.4162 6.87535 11.5753 6.80947 11.6925 6.69219L13.1253 5.2586V16.25C13.1253 16.4158 13.1912 16.5747 13.3084 16.6919C13.4256 16.8092 13.5846 16.875 13.7503 16.875C13.9161 16.875 14.0751 16.8092 14.1923 16.6919C14.3095 16.5747 14.3753 16.4158 14.3753 16.25V5.2586L15.8082 6.69219C15.9254 6.80947 16.0845 6.87535 16.2503 6.87535C16.4162 6.87535 16.5753 6.80947 16.6925 6.69219C16.8098 6.57492 16.8757 6.41586 16.8757 6.25C16.8757 6.08415 16.8098 5.92509 16.6925 5.80782Z" fill="#6B7280"/>
                    </svg>
                    {/* {selectedSosType} */}
                    {selectedRole}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.2345 7.06754L9.98453 13.3175C9.92648 13.3756 9.85755 13.4217 9.78168 13.4532C9.7058 13.4847 9.62447 13.5008 9.54234 13.5008C9.46021 13.5008 9.37888 13.4847 9.303 13.4532C9.22713 13.4217 9.1582 13.3756 9.10015 13.3175L2.85015 7.06754C2.73288 6.95026 2.66699 6.7912 2.66699 6.62535C2.66699 6.4595 2.73288 6.30044 2.85015 6.18316C2.96743 6.06588 3.12649 6 3.29234 6C3.45819 6 3.61725 6.06588 3.73453 6.18316L9.54234 11.9918L15.3502 6.18316C15.4082 6.12509 15.4772 6.07903 15.553 6.0476C15.6289 6.01617 15.7102 6 15.7923 6C15.8745 6 15.9558 6.01617 16.0317 6.0476C16.1075 6.07903 16.1765 6.12509 16.2345 6.18316C16.2926 6.24123 16.3387 6.31017 16.3701 6.38604C16.4015 6.46191 16.4177 6.54323 16.4177 6.62535C16.4177 6.70747 16.4015 6.78879 16.3701 6.86466C16.3387 6.94053 16.2926 7.00947 16.2345 7.06754Z" fill="#6B7280"/>
                  </svg>
                </button>
                {isRoleDropdownOpen && (
                  <div 
                    className="absolute w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg overflow-y-auto custom-scrollbar"
                    style={{
                      maxHeight: "228px",
                      zIndex: 50,
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      minWidth: '100%',
                      transform: 'none',
                    }}
                  >
                    {roles.map((role) => (
                      <div
                        key={role}
                        onClick={()=> handleRoleSelect(role)}
                        // onClick={() => handleSosTypeSelect(category)}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-md text-gray-600 border-b border-gray-100 last:border-b-0"
                      >
                        {role}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="w-full sm:w-auto">
                {/* <SortButton onSort={handleSort} ref={sortDateRef}/> */}
              </div>
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
                  <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px'}}>Ticket ID</th>
                  <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px'}}>Flat Number</th>
                  <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px'}}>Phone No</th>
                  <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px'}}>Role</th>
                  <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px'}}>Category</th>
                  <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px'}}>Status</th>
                 
                  {/* <th scope="col" className="px-6 py-3 text-right" style={{minWidth: '120px'}}></th> */}
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

export default SupportTable;