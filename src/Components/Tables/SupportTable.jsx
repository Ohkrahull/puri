// import React, { useState } from "react";
// import styles from './CustomScrollbar.module.css';
// import "../App.css";
// import "../index.css";
// import SupportTable from "../Tables/Support";
// import ExportModal from "./SupportExport";
// import { getAllSupportDocuments } from '../firebase/services/support';

// const Support = () => {
//   const [showExportModal, setShowExportModal] = useState(false);

//   const handleCloseModal = () => {
//     setShowExportModal(false);
//   };

//   return (
//     <div className="p-8 lg:p-12">
//       <div className="flex justify-between">
//         <div>
//           <h1 className={`${styles.customScrollbar} flex-1 text-gray-900`} style={{ fontWeight: "bold", fontSize: "24px", lineHeight: "32px", gap: "2px" }}>
//             Support
//           </h1>
//           <p className="gap-2" style={{ fontSize: "17px", color: "var(--Gray-400, #6B7280)", fontStyle: "normal", fontWeight: "500", lineHeight: "28px" }}>
//             Manage all your user queries in one place.
//           </p>
//         </div>
//         <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", justifyItems: "flex-end" }}>
//           <button
//             onClick={() => setShowExportModal(true)}
//             style={{
//               display: "flex",
//               padding: "12px 24px",
//               justifyContent: "center",
//               alignItems: "center",
//               border: "1px solid #D1D5DB",
//               borderRadius: "10px",
//               color: "#6B7280",
//               fontSize: "16px",
//               fontFamily: "Plus Jakarta Sans, sans-serif",
//             }}
//           >
//             <span>
//               <svg className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
//                 <path d="M16.875 8.75V16.25C16.875 16.5815 16.7433 16.8995 16.5089 17.1339C16.2745 17.3683 15.9565 17.5 15.625 17.5H4.375C4.04348 17.5 3.72554 17.3683 3.49112 17.1339C3.2567 16.8995 3.125 16.5815 3.125 16.25V8.75C3.125 8.41848 3.2567 8.10054 3.49112 7.86612C3.72554 7.6317 4.04348 7.5 4.375 7.5H6.25C6.41576 7.5 6.57473 7.56585 6.69194 7.68306C6.80915 7.80027 6.875 7.95924 6.875 8.125C6.875 8.29076 6.80915 8.44974 6.69194 8.56695C6.57473 8.68416 6.41576 8.75 6.25 8.75H4.375V16.25H15.625V8.75H13.75C13.5842 8.75 13.4253 8.68416 13.3081 8.56695C13.1908 8.44974 13.125 8.29076 13.125 8.125C13.125 7.95924 13.1908 7.80027 13.3081 7.68306C13.4253 7.56585 13.5842 7.5 13.75 7.5H15.625C15.9565 7.5 16.2745 7.6317 16.5089 7.86612C16.7433 8.10054 16.875 8.41848 16.875 8.75ZM7.31719 5.44219L9.375 3.3836V10.625C9.375 10.7908 9.44085 10.9497 9.55806 11.0669C9.67527 11.1842 9.83424 11.25 10 11.25C10.1658 11.25 10.3247 11.1842 10.4419 11.0669C10.5592 10.9497 10.625 10.7908 10.625 10.625V3.3836L12.6828 5.44219C12.8001 5.55947 12.9591 5.62535 13.125 5.62535C13.2909 5.62535 13.4499 5.55947 13.5672 5.44219C13.6845 5.32492 13.7503 5.16586 13.7503 5C13.7503 4.83415 13.6845 4.67509 13.5672 4.55782L10.4422 1.43282C10.3841 1.37471 10.3152 1.32861 10.2393 1.29715C10.1635 1.2657 10.0821 1.24951 10 1.24951C9.91787 1.24951 9.83654 1.2657 9.76066 1.29715C9.68479 1.32861 9.61586 1.37471 9.55781 1.43282L6.43281 4.55782C6.31554 4.67509 6.24965 4.83415 6.24965 5C6.24965 5.16586 6.31554 5.32492 6.43281 5.44219C6.55009 5.55947 6.70915 5.62535 6.875 5.62535C7.04085 5.62535 7.19991 5.55947 7.31719 5.44219Z" fill="#6B7280"/>
//               </svg>
//             </span>
//             Export
//           </button>
//         </div>
//       </div>

//       <div className="mt-6 rounded-lg overflow-hidden">
//         <div className="overflow-x-auto">
//           <SupportTable />
//         </div>
//       </div>

//       {showExportModal && (
//         <ExportModal
//           onClose={handleCloseModal}
//           fetchData={getAllSupportDocuments}
//         />
//       )}
//     </div>
//   );
// };

// export default Support;

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getAllSupportDocuments, deleteSupportDocument } from '../firebase/services/support';
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
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M17.9419 17.0579L14.0302 13.1469C15.1639 11.7858 15.7293 10.0399 15.6086 8.2725C15.488 6.50512 14.6906 4.85229 13.3823 3.65785C12.074 2.46341 10.3557 1.81932 8.58462 1.85957C6.81357 1.89982 5.12622 2.62131 3.87358 3.87395C2.62094 5.12659 1.89945 6.81394 1.8592 8.58498C1.81895 10.356 2.46304 12.0744 3.65748 13.3827C4.85192 14.6909 6.50475 15.4883 8.27214 15.609C10.0395 15.7297 11.7854 15.1643 13.1466 14.0305L17.0575 17.9422C17.1156 18.0003 17.1845 18.0464 17.2604 18.0778C17.3363 18.1092 17.4176 18.1254 17.4997 18.1254C17.5818 18.1254 17.6631 18.1092 17.739 18.0778C17.8149 18.0464 17.8838 18.0003 17.9419 17.9422C17.9999 17.8842 18.046 17.8152 18.0774 17.7394C18.1089 17.6635 18.125 17.5822 18.125 17.5001C18.125 17.4179 18.1089 17.3366 18.0774 17.2607C18.046 17.1849 17.9999 17.1159 17.9419 17.0579Z" fill="#6B7280"/>
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
            {item.userInfo?.email || 'N/A'}
          </td>
          <td 
            onClick={() => handleViewRequest(item)}
            className="px-6 py-4 whitespace-nowrap" 
            style={{minWidth: '120px'}}
          >
            {item.userInfo?.userType || 'N/A'}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right" style={{minWidth: '120px'}}>
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
          </td>
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
                  <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px'}}>Flat Number</th>
                  <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px'}}>Phone No</th>
                  <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px'}}>Email</th>
                  <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px'}}>Role</th>
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