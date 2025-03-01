import React, { useEffect, useRef, useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, onSnapshot, query, where, orderBy, deleteDoc, doc } from 'firebase/firestore';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import SortButton from '../Buttons/Sortdate';
import EditingConstructionModal from './EditingConstructionUpdate';
import { toast } from 'react-toastify';
import DeleteModal from '../Modals/DeleteModal';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { fetchConstructionUpdates, editConstructionUpdate, deleteConstructionUpdate } from '../firebase/services/constructionUpdate';
import ConstructionEdit from './constructionEdit';
import { Link, useNavigate } from 'react-router-dom';


dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const SearchInput = ({ documents, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length > 0);
    onSearch(value);
  };

  const handleItemClick = (document) => {
    setSearchTerm(document.heading);
    setShowDropdown(false);
    onSearch(document);
  };

  const filteredDocuments = documents.filter(
    (document) => document.heading.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="relative w-full sm:w-[250px] md:w-[300px] z-50">
      <div
        className="flex items-center justify-between p-2 sm:py-2 border border-[#D1D5DB] rounded-[10px] text-[#6B7280] text-[14px] sm:text-[14px] font-['Plus_Jakarta']"
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
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M17.9419 17.0579L14.0302 13.1469C15.1639 11.7858 15.7293 10.0399 15.6086 8.2725C15.488 6.50512 14.6906 4.85229 13.3823 3.65785C12.074 2.46341 10.3557 1.81932 8.58462 1.85957C6.81357 1.89982 5.12622 2.62131 3.87358 3.87395C2.62094 5.12659 1.89945 6.81394 1.8592 8.58498C1.81895 10.356 2.46304 12.0744 3.65748 13.3827C4.85192 14.6909 6.50475 15.4883 8.27214 15.609C10.0395 15.7297 11.7854 15.1643 13.1466 14.0305L17.0575 17.9422C17.1156 18.0003 17.1845 18.0464 17.2604 18.0778C17.3363 18.1092 17.4176 18.1254 17.4997 18.1254C17.5818 18.1254 17.6631 18.1092 17.739 18.0778C17.8149 18.0464 17.8838 18.0003 17.9419 17.9422C17.9999 17.8842 18.046 17.8152 18.0774 17.7394C18.1089 17.6635 18.125 17.5822 18.125 17.5001C18.125 17.4179 18.1089 17.3366 18.0774 17.2607C18.046 17.1849 17.9999 17.1159 17.9419 17.0579ZM3.12469 8.75006C3.12469 7.63754 3.45459 6.55 4.07267 5.62497C4.69076 4.69995 5.56926 3.97898 6.5971 3.55323C7.62493 3.12749 8.75593 3.0161 9.84707 3.23314C10.9382 3.45018 11.9405 3.98591 12.7272 4.77258C13.5138 5.55925 14.0496 6.56153 14.2666 7.65267C14.4837 8.74382 14.3723 9.87482 13.9465 10.9027C13.5208 11.9305 12.7998 12.809 11.8748 13.4271C10.9497 14.0452 9.86221 14.3751 8.74969 14.3751C7.25836 14.3734 5.82858 13.7802 4.77404 12.7257C3.71951 11.6712 3.12634 10.2414 3.12469 8.75006Z" fill="#6B7280"/>
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
              <div className="font-medium" style={{fontSize:'14px', color:'#6B7280'}}>
                {/* {document.heading} */}
                {truncateText(`${document.heading} `, 20)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ConstructionUpdateTable = () => {
  const [documents, setDocuments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortedDocuments, setSortedDocuments] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemName, setDeleteItemName] = useState('');
  const [deleteFunction, setDeleteFunction] = useState(null);
  const [dateSortDirection, setDateSortDirection] = useState('desc');

  const sortDateRef = useRef(null);

  const itemsPerPage = 10;

  // useEffect(() => {
  //   const fetchConstructionUpdates = () => {
  //     setIsLoading(true);
  //     const q = query(collection(db, 'constructionUpdates'), orderBy('createdAt', 'desc'));
  
  //     const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //       const fetchedUpdates = querySnapshot.docs.map(doc => ({
  //         id: doc.id,
  //         ...doc.data()
  //       }));
        
  //       setDocuments(fetchedUpdates);
  //       setSortedDocuments(fetchedUpdates);
  //       setFilteredDocuments(fetchedUpdates);
  //       setIsLoading(false);
  //     }, (error) => {
  //       console.error("Error fetching construction updates:", error);
  //       setError("Failed to load construction updates. Please try again later.");
  //       setIsLoading(false);
  //     });
  
  //     return () => unsubscribe();
  //   };
  
  //   fetchConstructionUpdates();
  // }, []);

  useEffect(() => {
    const fetchConstructionUpdates = () => {
      setIsLoading(true);
      const q = query(collection(db, 'constructionUpdates'), orderBy('createdAt', dateSortDirection));
  
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedUpdates = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setDocuments(fetchedUpdates);
        setSortedDocuments(fetchedUpdates);
        setFilteredDocuments(fetchedUpdates);
        setIsLoading(false);
      }, (error) => {
        console.error("Error fetching construction updates:", error);
        setError("Failed to load construction updates. Please try again later.");
        setIsLoading(false);
      });
  
      return () => unsubscribe();
    };
  
    fetchConstructionUpdates();
  }, [dateSortDirection]);

  // useEffect(() => {
  //   const fetchUpdates = async () => {
  //     setIsLoading(true);
  //     try {
  //       const fetchedUpdates = await fetchConstructionUpdates();
  //       setDocuments(fetchedUpdates);
  //       setSortedDocuments(fetchedUpdates);
  //       setFilteredDocuments(fetchedUpdates);
  //     } catch (error) {
  //       console.error("Error fetching construction updates:", error);
  //       setError("Failed to load construction updates. Please try again later.");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchUpdates();
  // }, []);
  const navigate = useNavigate();

  const hideScrollbarStyle = {
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  };

  const handleDateSort = () => {
    setDateSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleEditClick = (document) => {
    navigate(`/construction/edit/${document.id}`, { state: { document } });
  };

  useEffect(() => {
    filterDocuments(searchTerm, sortedDocuments);
  }, [sortedDocuments, searchTerm]);

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);
  const isAllSelected = currentItems.length > 0 && selectedRows.length === currentItems.length;

  // const handleSort = (startDate, endDate) => {
  //   let filtered;
  //   if (!startDate && !endDate) {
  //     filtered = documents;
  //   } else {
  //     filtered = documents.filter(doc => {
  //       const docDate = dayjs(doc.createdAt.toDate());
  //       if (startDate && endDate) {
  //         return docDate.isSameOrAfter(dayjs(startDate), 'day') && 
  //                docDate.isSameOrBefore(dayjs(endDate), 'day');
  //       } else if (startDate) {
  //         return docDate.isSameOrAfter(dayjs(startDate), 'day');
  //       } else if (endDate) {
  //         return docDate.isSameOrBefore(dayjs(endDate), 'day');
  //       }
  //       return true;
  //     });
  //   }

  //   filtered.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
    
  //   setSortedDocuments(filtered);
  //   filterDocuments(searchTerm, filtered);
  //   setCurrentPage(1);
  // };

  const handleSort = (startDate, endDate) => {
    let filtered;
    if (!startDate && !endDate) {
      filtered = documents;
    } else {
      filtered = documents.filter(doc => {
        const docDate = dayjs(doc.createdAt.toDate());
        if (startDate && endDate) {
          return docDate.isSameOrAfter(dayjs(startDate), 'day') && 
                 docDate.isSameOrBefore(dayjs(endDate), 'day');
        } else if (startDate) {
          return docDate.isSameOrAfter(dayjs(startDate), 'day');
        } else if (endDate) {
          return docDate.isSameOrBefore(dayjs(endDate), 'day');
        }
        return true;
      });
    }
  
    filtered.sort((a, b) => {
      const dateA = a.createdAt.toDate();
      const dateB = b.createdAt.toDate();
      return dateSortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
    setSortedDocuments(filtered);
    filterDocuments(searchTerm, filtered);
    setCurrentPage(1);
  };

  const filterDocuments = (term, docsToFilter = sortedDocuments) => {
    let filtered = docsToFilter;
    
    if (term) {
      filtered = filtered.filter(doc =>
        doc.heading.toLowerCase().includes(term.toLowerCase()) ||
        doc.subText.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    setFilteredDocuments(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // if (searchRef.current && !searchRef.current.contains(event.target)) {
      //   setIsSearchDropdownOpen(false);
      // }
      // if (amenityRef.current && !amenityRef.current.contains(event.target)) {
      //   setIsAmenityDropdownOpen(false);
      // }
      if (sortDateRef.current && !sortDateRef.current.contains(event.target)) {
        // Assuming SortButton has a method to close its dropdown
        sortDateRef.current.closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (termOrDocument) => {
    if (typeof termOrDocument === 'string') {
      setSearchTerm(termOrDocument);
      filterDocuments(termOrDocument, sortedDocuments);
    } else {
      setSearchTerm(termOrDocument.heading);
      filterDocuments(termOrDocument.heading, sortedDocuments);
    }
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
    setDeleteItemName('all selected updates');
    setDeleteFunction(() => async () => {
      try {
        const deletePromises = selectedRows.map(index => {
          const docId = filteredDocuments[index].id;
          return deleteDoc(doc(db, 'constructionUpdates', docId));
        });
        await Promise.all(deletePromises);
        setSelectedRows([]);
        toast.success('Selected updates deleted successfully');
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error('Error deleting selected updates:', error);
        toast.error('Failed to delete selected updates');
      }
    });
    setIsDeleteModalOpen(true);
  };

  // const handleDownload = (fileUrl, fileName) => {
  //   if (fileUrl) {
  //     const link = document.createElement('a');
  //     link.href = fileUrl;
  //     link.target = '_blank';
  //     link.download = fileName || 'document';
      
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   } else {
  //     toast.error('No file available for download');
  //   }
  // };


const storage = getStorage();
const handleDownload = async (doc) => {
  const { certificateFile, images, fileName } = doc;
  const urls = [certificateFile, ...(images || [])].filter(Boolean);

  if (urls.length === 0) {
    toast.error('No files available for download');
    return;
  }

  try {
    for (const filePath of urls) {
      const fileRef = ref(storage, filePath);
      const url = await getDownloadURL(fileRef);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    toast.success('Download completed successfully');
  } catch (error) {
    console.error('Error downloading file:', error);
    toast.error(`Failed to download: ${error.message}`);
  }
};


  
  const handleDeleteClick = (docId, docName) => {
    setDeleteItemName(docName);
    setDeleteFunction(() => async () => {
      try {
        await deleteDoc(doc(db, 'constructionUpdates', docId));
        toast.success('Update deleted successfully');
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error('Error deleting update:', error);
        toast.error('Failed to delete update');
      }
    });
    setIsDeleteModalOpen(true);
  };

  // const handleEditClick = (document, index) => {
  //   setEditingDocument({ ...document });
  //   setEditingIndex(index);
  //   setIsEditModalOpen(true);
  // };

  const handleSaveEdit = async (updatedDocument) => {
    try {
      await editConstructionUpdate(updatedDocument);
      const updatedDocuments = [...documents];
      updatedDocuments[editingIndex] = updatedDocument;
      setDocuments(updatedDocuments);
      setSortedDocuments(updatedDocuments);
      setFilteredDocuments(updatedDocuments);
      setIsEditModalOpen(false);
      toast.success('Construction update edited successfully');
    } catch (error) {
      console.error('Error editing construction update:', error);
      toast.error('Failed to edit construction update');
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingDocument(null);
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



  const renderWings = (wings) => {
    const wingColors = {
      'A Wing': { bg: '#EFF6FF', color: '#1E40AF' },
      'B Wing': { bg: '#F0FDF4', color: '#166534' },
      'C Wing': { bg: '#FAF5FF', color: '#6B21A8' },
      'D Wing': { bg: '#FEF2F2', color: '#991B1B' },
    };

    return wings.map((wing, index) => (
      <span
      key={index}
      className="text-center align-baseline inline-flex px-2 py-1 items-center font-semibold text-xs leading-none rounded-lg mr-3" 
      style={{ backgroundColor: wingColors[wing].bg, color: wingColors[wing].color , padding:'4px 12px',borderRadius:'13px', fontSize:'12px', gap:'4px' , marginRight:'4px',fontWeight:'600',lineHeight:'18px', }}
    >
      {wing}
    </span>
  ));
};
 // Add this new function to truncate text
  // const truncateText = (text, wordLimit = 9) => {
  //   const words = text.split(' ');
  //   if (words.length > wordLimit) {
  //     return words.slice(0, wordLimit).join(' ') + '...';
  //   }
  //   return text;
  // };

const renderTableContent = () => {
  if (isLoading) {
    return (
      <tr>
        <td colSpan="5" className="px-6 mt-8 py-4 text-center">
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
        <td colSpan="5" className="px-6 py-4 text-center text-red-500">{error}</td>
      </tr>
    );
  }

  if (currentItems.length === 0) {
    return (
      <tr>
        <td colSpan="5" className="px-6 py-4 text-center text-gray-500" style={{ height: '300px' }}>
          <div className="flex flex-col items-center justify-center h-full">
            <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-lg font-semibold">No construction updates found</p>
            <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
          </div>
        </td>
      </tr>
    );
  }

  return currentItems.map((doc, index) => {
    
    const actualIndex = indexOfFirstItem + index;
    const isSelected = selectedRows.includes(actualIndex);

    // Function to truncate the heading
    const truncateHeading = (heading, wordLimit = 20) => {
      const words = heading.split(' ');
      if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(' ') + '...';
      }
      return heading;
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
      <tr key={doc.id} className="bg-white border-b hover:bg-gray-50" style={{fontSize:'14px'}}>
        <td className="px-6 py-3 whitespace-nowrap" style={{width:'40px'}}>
          <div className="flex items-center">
            <CheckboxWithTick
              isSelected={isSelected}
              onClick={() => handleRowSelect(actualIndex)}
            />
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-left font-medium text-gray-900" style={{minWidth: '300px'}}>
          {truncateText(doc.heading, 70)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-left" style={{minWidth: '100px'}}>
          {dayjs(doc.createdAt.toDate()).format('D MMM, YYYY')}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-left" style={{minWidth: '100px'}}>
          {renderWings(doc.selectedWings || [])}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right" style={{minWidth: '100px'}}>
          <div className="flex justify-end space-x-4">
            <button onClick={() => handleEditClick(doc, actualIndex)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.7586 5.73201L14.268 2.24061C14.1519 2.1245 14.0141 2.0324 13.8624 1.96957C13.7107 1.90673 13.5482 1.87439 13.384 1.87439C13.2198 1.87439 13.0572 1.90673 12.9056 1.96957C12.7539 2.0324 12.6161 2.1245 12.5 2.24061L2.86641 11.875C2.74983 11.9906 2.65741 12.1283 2.59451 12.28C2.5316 12.4317 2.49948 12.5944 2.50001 12.7586V16.25C2.50001 16.5815 2.6317 16.8994 2.86612 17.1339C3.10054 17.3683 3.41849 17.5 3.75001 17.5H7.24141C7.40563 17.5005 7.5683 17.4684 7.71999 17.4055C7.87168 17.3426 8.00935 17.2502 8.12501 17.1336L17.7586 7.49998C17.8747 7.3839 17.9668 7.24609 18.0296 7.09442C18.0925 6.94274 18.1248 6.78017 18.1248 6.616C18.1248 6.45182 18.0925 6.28925 18.0296 6.13758C17.9668 5.9859 17.8747 5.84809 17.7586 5.73201ZM7.24141 16.25H3.75001V12.7586L10.625 5.88358L14.1164 9.37498L7.24141 16.25ZM15 8.49061L11.5086 4.99998L13.3836 3.12498L16.875 6.61561L15 8.49061Z" fill="#6B7280"/>
              </svg>
            </button>
            <button onClick={() => handleDeleteClick(doc.id, doc.heading)}>
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
  <div className="mt-1 bg-white border rounded-lg overflow-hidden flex flex-col">
    <div className="sticky top-0 z-20 bg-white">
      <div className="flex flex-col sm:flex-row justify-between items-center p-6">
        <div className="w-full sm:w-auto mb-4 sm:mb-0">
          <SearchInput documents={documents} onSearch={handleSearch} />
        </div>
        <div className="w-full sm:w-auto">
          <SortButton onSort={handleSort} ref={sortDateRef} />
        </div>
      </div>
    </div>
    <div className="flex-grow overflow-auto" >
      <table className="w-full text-sm text-gray-500" style={{ minWidth: '700px' }}>
        <thead className="text-xs text-gray-500 bg-gray-50 sticky top-0" style={{fontSize:'12px'}}>
          <tr className="border-y">
            <th scope="col" className="px-6 py-3" style={{width:'40px'}}>
              <div className="flex items-center">
                <CheckboxWithTick
                  isSelected={isAllSelected}
                  onClick={handleSelectAll}
                />
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '300px'}}>Update</th>
            <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '100px'}}>
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
            <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '100px'}}>Wing</th>
            <th scope="col" className="px-6 py-3 text-right" style={{minWidth: '100px'}}>
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
    <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-3 border-t">
      <div
        className="text-sm text-gray-700 mb-2 sm:mb-0"
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

export default ConstructionUpdateTable;