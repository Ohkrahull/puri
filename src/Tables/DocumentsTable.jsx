import React, { useEffect, useRef, useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, onSnapshot, query, where, orderBy, deleteDoc, doc } from 'firebase/firestore';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import SortButton from '../Buttons/Sortdate';
import EditingDocumentModal from '../Components/EditingDocumentModal';
import { toast } from 'react-toastify';
import DeleteModal from '../Modals/DeleteModal';
import { fetchAuthorizedUserDetails } from '../firebase/services/bookingsData';

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
    setSearchTerm(`${document.userInfo?.firstName || ''} ${document.userInfo?.lastName || ''}`);
    setShowDropdown(false);
    onSearch(document); // Pass the entire document object
  };

  const filteredDocuments = documents.filter(
    (document) =>
      `${document.userInfo?.firstName || ''} ${document.userInfo?.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
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
        <svg className='mr-1' xmlns="http://www.w3.org/2000/svg"  width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M17.9419 17.0579L14.0302 13.1469C15.1639 11.7858 15.7293 10.0399 15.6086 8.2725C15.488 6.50512 14.6906 4.85229 13.3823 3.65785C12.074 2.46341 10.3557 1.81932 8.58462 1.85957C6.81357 1.89982 5.12622 2.62131 3.87358 3.87395C2.62094 5.12659 1.89945 6.81394 1.8592 8.58498C1.81895 10.356 2.46304 12.0744 3.65748 13.3827C4.85192 14.6909 6.50475 15.4883 8.27214 15.609C10.0395 15.7297 11.7854 15.1643 13.1466 14.0305L17.0575 17.9422C17.1156 18.0003 17.1845 18.0464 17.2604 18.0778C17.3363 18.1092 17.4176 18.1254 17.4997 18.1254C17.5818 18.1254 17.6631 18.1092 17.739 18.0778C17.8149 18.0464 17.8838 18.0003 17.9419 17.9422C17.9999 17.8842 18.046 17.8152 18.0774 17.7394C18.1089 17.6635 18.125 17.5822 18.125 17.5001C18.125 17.4179 18.1089 17.3366 18.0774 17.2607C18.046 17.1849 17.9999 17.1159 17.9419 17.0579ZM3.12469 8.75006C3.12469 7.63754 3.45459 6.55 4.07267 5.62497C4.69076 4.69995 5.56926 3.97898 6.5971 3.55323C7.62493 3.12749 8.75593 3.0161 9.84707 3.23314C10.9382 3.45018 11.9405 3.98591 12.7272 4.77258C13.5138 5.55925 14.0496 6.56153 14.2666 7.65267C14.4837 8.74382 14.3723 9.87482 13.9465 10.9027C13.5208 11.9305 12.7998 12.809 11.8748 13.4271C10.9497 14.0452 9.86221 14.3751 8.74969 14.3751C7.25836 14.3734 5.82858 13.7802 4.77404 12.7257C3.71951 11.6712 3.12634 10.2414 3.12469 8.75006Z" fill="#6B7280"/>
        </svg>
      </div>

      {showDropdown && filteredDocuments.length > 0 && (
        <div className="absolute w-full mt-3 bg-white border border-gray-200 rounded-md shadow-lg z-10"
        style={{
          maxHeight: filteredDocuments.length > 4 ? '240px' : 'auto',
          overflowY: filteredDocuments.length > 4 ? 'auto' : 'visible'
        }}
        >
          {filteredDocuments.map((document, index) => (
            <div
              key={index}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
              style={{borderBottom: '1px solid var(--Gray-100, #E5E7EB)'}}
              onClick={() => handleItemClick(document)}
            >
              <div className="font-medium flex justify-between" style={{fontSize:'14px', color:'#6B7280'}}>
                {/* {`${document.userInfo?.firstName || ''} ${document.userInfo?.lastName || ''}`} */}
                {truncateText(`${document.userInfo.firstName || "N/A"} ${document.userInfo.lastName || "N/A"}`, 20)}

                <span>{document.userInfo.wing || "N/A"} - {document.userInfo.flatNumber || "N/A"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DocumentTable = ({ onTabChange }) => {
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
  const [selectedStatus, setSelectedStatus] = useState("Sort Status");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemName, setDeleteItemName] = useState('');
  const [deleteFunction, setDeleteFunction] = useState(null);
  const [dateSortDirection, setDateSortDirection] = useState('desc');
  const [activeTab, setActiveTab] = useState("Agreement");

  const itemsPerPage = 10;
  const StatusDropdownRef = useRef(null);
  const sortDateRef = useRef(null);


  // useEffect(() => {
  //   const fetchDocuments = () => {
  //     setIsLoading(true);
  //     const q = query(
  //       collection(db, 'documents'),
  //       where('documentType', '==', 'Agreement for sale')
  //     );
  
  //     const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //       const fetchedDocuments = querySnapshot.docs.map(doc => ({
  //         id: doc.id,
  //         ...doc.data()
  //       }));
        
  //       // Sort documents by uploadDate in descending order
  //       const sortedDocuments = fetchedDocuments.sort((a, b) => 
  //         b.uploadDate.toDate() - a.uploadDate.toDate()
  //       );
  
  //       console.log("fetchdoc", sortedDocuments);
        
  //       setDocuments(sortedDocuments);
  //       setSortedDocuments(sortedDocuments);
  //       setFilteredDocuments(sortedDocuments);
  //       setIsLoading(false);
  //     }, (error) => {
  //       console.error("Error fetching documents:", error);
  //       setError("Failed to load documents. Please try again later.");
  //       setIsLoading(false);
  //     });
  
  //     return () => unsubscribe();
  //   };
  
  //   fetchDocuments();
  // }, []);
  // useEffect(() => {
  //   const fetchDocuments = () => {
      
      
  //     setIsLoading(true);
  //     const q = query(
  //       collection(db, 'documents'),
  //       where('documentType', '==', 'Agreement for sale')
  //     );
  
  //     const unsubscribe = onSnapshot(q, async (querySnapshot) => {
  //       const fetchedDocumentsPromises = querySnapshot.docs.map(async doc => {
  //         const documentData = {
  //           id: doc.id,
  //           ...doc.data()
  //         };
          
  //         // Fetch user details for each document
  //         const userDetails = await fetchAuthorizedUserDetails(documentData.phoneNumber);
          
  //         return {
  //           ...documentData,
  //           userInfo: userDetails
  //         };
  //       });

  //       const fetchedDocuments = await Promise.all(fetchedDocumentsPromises);
        
  //       // Sort documents by uploadDate in descending order
  //       const sortedDocuments = fetchedDocuments.sort((a, b) => 
  //         b.uploadDate.toDate() - a.uploadDate.toDate()
  //       );
  
  //       console.log("fetchdoc", sortedDocuments);
        
  //       setDocuments(sortedDocuments);
  //       setSortedDocuments(sortedDocuments);
  //       setFilteredDocuments(sortedDocuments);
  //       setIsLoading(false);
  //     }, (error) => {
  //       console.error("Error fetching documents:", error);
  //       setError("Failed to load documents. Please try again later.");
  //       setIsLoading(false);
  //     });
  
  //     return () => unsubscribe();
  //   };
  
  //   fetchDocuments();
  // }, []);

  // useEffect(() => {
  //   const fetchDocuments = () => {
  //     setIsLoading(true);
  //     const q = query(
  //       collection(db, 'documents')
  //       // Remove the 'where' clause to fetch all documents
  //     );
  
  //     const unsubscribe = onSnapshot(q, async (querySnapshot) => {
  //       console.log('Raw snapshot size:', querySnapshot.size);
  //       console.log('Raw snapshot docs:', querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
  //       const fetchedDocumentsPromises = querySnapshot.docs.map(async doc => {
  //         const documentData = {
  //           id: doc.id,
  //           ...doc.data()
  //         };
          
  //         // Fetch user details for each document
  //         let userDetails = null;
  //         if (documentData.phoneNumber) {
  //           userDetails = await fetchAuthorizedUserDetails(documentData.phoneNumber);
  //           console.log('User details for document:', documentData.id, userDetails);
  //         } else {
  //           console.log('No phone number for document:', documentData.id);
  //         }
          
  //         return {
  //           ...documentData,
  //           userInfo: userDetails
  //         };
  //       });
  
  //       const fetchedDocuments = await Promise.all(fetchedDocumentsPromises);
        
  //       // Sort documents by uploadDate in descending order, if uploadDate exists
  //       const sortedDocuments = fetchedDocuments.sort((a, b) => {
  //         if (a.uploadDate && b.uploadDate) {
  //           return b.uploadDate.toDate() - a.uploadDate.toDate();
  //         }
  //         return 0; // If uploadDate doesn't exist, don't change order
  //       });
  
  //       console.log("Processed documents:", sortedDocuments);
        
  //       setDocuments(sortedDocuments);
  //       setSortedDocuments(sortedDocuments);
  //       setFilteredDocuments(sortedDocuments);
  //       setIsLoading(false);
  //     }, (error) => {
  //       console.error("Error fetching documents:", error);
  //       setError("Failed to load documents. Please try again later.");
  //       setIsLoading(false);
  //     });
  
  //     return () => unsubscribe();
  //   };
  
  //   fetchDocuments();
  // }, []);

  // useEffect(() => {
  //   const fetchDocuments = () => {
  //     setIsLoading(true);
  //     const q = query(
  //       collection(db, 'documents'),
  //       where('documentType', '==', 'Agreement for sale')
  //     );
  
  //     const unsubscribe = onSnapshot(q, async (querySnapshot) => {
  //       // console.log('Raw snapshot size:', querySnapshot.size);
  //       // console.log('Raw snapshot docs:', querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
  //       const fetchedDocumentsPromises = querySnapshot.docs.map(async doc => {
  //         const documentData = {
  //           id: doc.id,
  //           ...doc.data()
  //         };
          
  //         // Fetch user details for each document
  //         let userDetails = null;
  //         if (documentData.phoneNumber) {
  //           userDetails = await fetchAuthorizedUserDetails(documentData.phoneNumber);
  //           // console.log('User details for document:', documentData.id, userDetails);
  //         } else {
  //           console.log('No phone number for document:', documentData.id);
  //         }
          
  //         return {
  //           ...documentData,
  //           userInfo: userDetails
  //         };
  //       });
  
  //       const fetchedDocuments = await Promise.all(fetchedDocumentsPromises);
        
  //       // Sort documents by uploadDate in descending order, if uploadDate exists
  //       const sortedDocuments = fetchedDocuments.sort((a, b) => {
  //         if (a.uploadDate && b.uploadDate) {
  //           return b.uploadDate.toDate() - a.uploadDate.toDate();
  //         }
  //         return 0; // If uploadDate doesn't exist, don't change order
  //       });
  
  //       // console.log("Processed documents:", sortedDocuments);
        
  //       setDocuments(sortedDocuments);
  //       setSortedDocuments(sortedDocuments);
  //       setFilteredDocuments(sortedDocuments);
  //       setIsLoading(false);
  //     }, (error) => {
  //       // console.error("Error fetching documents:", error);
  //       setError("Failed to load documents. Please try again later.");
  //       setIsLoading(false);
  //     });
  
  //     return () => unsubscribe();
  //   };
  
  //   fetchDocuments();
  // }, []);

  // useEffect(() => {
  //   const fetchDocuments = () => {
  //     setIsLoading(true);
  //     const q = query(
  //       collection(db, 'documents'),
  //       where('documentType', '==', 'Agreement for sale')
  //     );
  
  //     const unsubscribe = onSnapshot(q, async (querySnapshot) => {
  //       const fetchedDocumentsPromises = querySnapshot.docs.map(async doc => {
  //         const documentData = {
  //           id: doc.id,
  //           ...doc.data()
  //         };
          
  //         let userDetails = null;
  //         if (documentData.phoneNumber) {
  //           userDetails = await fetchAuthorizedUserDetails(documentData.phoneNumber);
  //         } else {
  //           console.log('No phone number for document:', documentData.id);
  //         }
          
  //         return {
  //           ...documentData,
  //           userInfo: userDetails
  //         };
  //       });
  
  //       const fetchedDocuments = await Promise.all(fetchedDocumentsPromises);
        
  //       // Sort documents by uploadDate in descending order, if uploadDate exists
  //       const sortedDocuments = fetchedDocuments.sort((a, b) => {
  //         if (a.uploadDate && b.uploadDate) {
  //           return dateSortDirection === 'asc' 
  //             ? a.uploadDate.toDate() - b.uploadDate.toDate()
  //             : b.uploadDate.toDate() - a.uploadDate.toDate();
  //         }
  //         return 0; // If uploadDate doesn't exist, don't change order
  //       });
        
  //       setDocuments(sortedDocuments);
  //       setSortedDocuments(sortedDocuments);
  //       setFilteredDocuments(sortedDocuments);
  //       setIsLoading(false);
  //     }, (error) => {
  //       console.error("Error fetching documents:", error);
  //       setError("Failed to load documents. Please try again later.");
  //       setIsLoading(false);
  //     });
  
  //     return () => unsubscribe();
  //   };
  
  //   fetchDocuments();
  // }, [dateSortDirection]); // Add dateSortDirection as a dependency
  
  useEffect(() => {
    const fetchDocuments = () => {
      setIsLoading(true);
      const docType = activeTab === "Agreement" ? "Agreement for sale" : "Demand letters";
      
      const q = query(
        collection(db, 'documents'),
        where('documentType', '==', docType)
      );

      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const fetchedDocumentsPromises = querySnapshot.docs.map(async doc => {
          const documentData = { id: doc.id, ...doc.data() };
          let userDetails = null;
          if (documentData.phoneNumber) {
            userDetails = await fetchAuthorizedUserDetails(documentData.phoneNumber);
          }
          return { ...documentData, userInfo: userDetails };
        });

        const fetchedDocuments = await Promise.all(fetchedDocumentsPromises);
        const sortedDocs = fetchedDocuments.sort((a, b) => {
          if (a.uploadDate && b.uploadDate) {
            return dateSortDirection === 'asc' 
              ? a.uploadDate.toDate() - b.uploadDate.toDate()
              : b.uploadDate.toDate() - a.uploadDate.toDate();
          }
          return 0;
        });

        setDocuments(sortedDocs);
        setSortedDocuments(sortedDocs);
        setFilteredDocuments(sortedDocs);
        setIsLoading(false);
      }, (error) => {
        console.error("Error fetching documents:", error);
        setError("Failed to load documents. Please try again later.");
        setIsLoading(false);
      });

      return () => unsubscribe();
    };

    fetchDocuments();
  }, [activeTab, dateSortDirection]);

  useEffect(() => {
    // This effect will run whenever searchTerm, selectedStatus, or dateSortDirection changes
    let filtered = [...documents];
  
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(doc =>
        `${doc.userInfo?.firstName || ''} ${doc.userInfo?.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  
    // Apply status filter
    if (selectedStatus && selectedStatus !== "Sort Status") {
      filtered = filtered.filter(doc => doc.status.toLowerCase() === selectedStatus.toLowerCase());
    }
  
    // Apply sorting
    filtered.sort((a, b) => {
      if (a.uploadDate && b.uploadDate) {
        return dateSortDirection === 'asc' 
          ? a.uploadDate.toDate() - b.uploadDate.toDate()
          : b.uploadDate.toDate() - a.uploadDate.toDate();
      }
      return 0;
    });
  
    setFilteredDocuments(filtered);
    setCurrentPage(1);
  }, [documents, searchTerm, selectedStatus, dateSortDirection]);

  // useEffect(() => {
  //   console.log('Documents state updated:', documents);
  //   console.log('Filtered documents:', filteredDocuments);
  // }, [documents, filteredDocuments]);

  const hideScrollbarStyle = {
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  };


  useEffect(() => {
    filterDocuments(searchTerm, selectedStatus, sortedDocuments);
  }, [sortedDocuments, searchTerm, selectedStatus]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (StatusDropdownRef.current && !StatusDropdownRef.current.contains(event.target)) {
        setIsStatusDropdownOpen(false);
      }
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



  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);
  const isAllSelected = currentItems.length > 0 && selectedRows.length === currentItems.length;

  const handleSort = (startDate, endDate) => {
    let filtered;
    if (!startDate && !endDate) {
      filtered = documents;
    } else {
      filtered = documents.filter(doc => {
        const docDate = dayjs(doc.uploadDate.toDate());
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

    filtered.sort((a, b) => b.uploadDate.toDate() - a.uploadDate.toDate());
    
    setSortedDocuments(filtered);
    filterDocuments(searchTerm, selectedStatus, filtered);
    setCurrentPage(1);
  };


  const filterDocuments = (documentOrTerm, status, docsToFilter = sortedDocuments) => {
    let filtered = docsToFilter;
    
    if (documentOrTerm) {
      if (typeof documentOrTerm === 'string') {
        const term = documentOrTerm.toLowerCase();
        filtered = filtered.filter(doc =>
          `${doc.userInfo?.firstName || ''} ${doc.userInfo?.lastName || ''}`.toLowerCase().includes(term)
        );
      } else {
        // If a document object is passed, filter for exact match
        filtered = filtered.filter(doc =>
          doc.id === documentOrTerm.id ||
          (doc.userInfo?.firstName === documentOrTerm.userInfo?.firstName &&
           doc.userInfo?.lastName === documentOrTerm.userInfo?.lastName)
        );
      }
    }

    if (status && status !== "Sort Status") {
      filtered = filtered.filter(doc => doc.status.toLowerCase() === status.toLowerCase());
    }
    
    setFilteredDocuments(filtered);
    setCurrentPage(1);
  };

  const handleTabClick = (tab) => {
    const newTab = tab === 'Agreement for sale' ? 'Agreement' : 'DemandLetter';
    setActiveTab(newTab);
    onTabChange?.(newTab); // Notify parent component
  };

  // const filterDocuments = (term, status, docsToFilter = sortedDocuments) => {
  //   let filtered = docsToFilter;
    
  //   if (term) {
  //     filtered = filtered.filter(doc =>
  //       (doc.userInfo?.firstName && doc.userInfo?.firstName.toLowerCase().includes(term.toLowerCase())) ||
  //       (doc.userInfo?.lastName && doc.userInfo?.lastName.toLowerCase().includes(term.toLowerCase())) ||
  //       doc.name.toLowerCase().includes(term.toLowerCase()) ||
  //       doc.fileName.toLowerCase().includes(term.toLowerCase())
  //     );
  //   }

  //   if (status && status !== "Sort Status") {
  //     filtered = filtered.filter(doc => doc.status.toLowerCase() === status.toLowerCase());
  //   }
    
  //   setFilteredDocuments(filtered);
  //   setCurrentPage(1);
  // };
const handleDateSort = () => {
  const newDirection = dateSortDirection === 'asc' ? 'desc' : 'asc';
  setDateSortDirection(newDirection);
  
  const sorted = [...filteredDocuments].sort((a, b) => {
    const dateA = a.uploadDate ? a.uploadDate.toDate() : new Date(0);
    const dateB = b.uploadDate ? b.uploadDate.toDate() : new Date(0);
    return newDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });
  
  setFilteredDocuments(sorted);
};

  const handleSearch = (document) => {
    if (document) {
      setSearchTerm(`${document.userInfo?.firstName || ''} ${document.userInfo?.lastName || ''}`);
      filterDocuments(document, selectedStatus, sortedDocuments);
    } else {
      setSearchTerm('');
      filterDocuments('', selectedStatus, sortedDocuments);
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

  // const handleDeleteSelected = async () => {
  //   if (window.confirm('Are you sure you want to delete all selected documents?')) {
  //     try {
  //       const deletePromises = selectedRows.map(index => {
  //         const docId = filteredDocuments[index].id;
  //         return deleteDoc(doc(db, 'documents', docId));
  //       });
  //       await Promise.all(deletePromises);
  //       setSelectedRows([]);
  //       toast.success('Selected documents deleted successfully');
  //     } catch (error) {
  //       console.error('Error deleting selected documents:', error);
  //       toast.error('Failed to delete selected documents');
  //     }
  //   }
  // };

  const handleDeleteSelected = () => {
    setDeleteItemName('all selected documents');
    setDeleteFunction(() => async () => {
      try {
        const deletePromises = selectedRows.map(index => {
          const docId = filteredDocuments[index].id;
          return deleteDoc(doc(db, 'documents', docId));
        });
        await Promise.all(deletePromises);
        setSelectedRows([]);
        toast.success('Selected documents deleted successfully');
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error('Error deleting selected documents:', error);
        toast.error('Failed to delete selected documents');
      }
    });
    setIsDeleteModalOpen(true);
  };
  // const handleDownload = (e) => {
  //   e.preventDefault();
  //   if (req?.fileUrl) {
  //     // Create a temporary anchor element
  //     const link = document.createElement('a');
  //     link.href = req.fileUrl;
  //     link.target = '_blank';
  //     link.download = req.fileName || 'document.pdf';
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   } else {
  //     console.error('No file URL available for download');
  //     alert('No file available for download');
  //   }
  // };
  const handleDownload = (fileUrl, fileName) => {
   
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.target = '_blank';
      link.download = fileName || 'document';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast.error('No file available for download');
    }
  };

  // const handleDeleteClick = async (docId) => {
  //   if (window.confirm('Are you sure you want to delete this document?')) {
  //     try {
  //       await deleteDoc(doc(db, 'documents', docId));
  //       toast.success('Document deleted successfully');
  //     } catch (error) {
  //       console.error('Error deleting document:', error);
  //       toast.error('Failed to delete document');
  //     }
  //   }
  // };

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
    width:'242px',
     height:'50px'
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
    hover: {
      backgroundColor: '#F3F4F6',
    },
    color: 'var(--Gray-400, #6B7280)',
    fontSize: '14px',
    borderBottom: '1px solid var(--Gray-100, #E5E7EB)'
  };

  const handleDeleteClick = (docId, docName) => {
    setDeleteItemName(docName);
    setDeleteFunction(() => async () => {
      try {
        await deleteDoc(doc(db, 'documents', docId));
        toast.success('Document deleted successfully');
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error('Error deleting document:', error);
        toast.error('Failed to delete document');
      }
    });
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (document, index) => {
    setEditingDocument({ ...document });
    setEditingIndex(index);
    setIsEditModalOpen(true);
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

  const handleSaveEdit = (updatedDocument) => {
    // Implement save edit functionality here
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingDocument(null);
    setEditingIndex(null);
  };

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setIsStatusDropdownOpen(false);
    filterDocuments(searchTerm, status, sortedDocuments);
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
              <p className="text-lg font-semibold">No documents found</p>
              <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
            </div>
          </td>
        </tr>
      );
    }

    return currentItems.map((doc, index) => {
      const actualIndex = indexOfFirstItem + index;
      const isSelected = selectedRows.includes(actualIndex);
      
      const displayName = doc.userInfo?.firstName && doc.userInfo?.lastName 
        ? `${doc.userInfo?.firstName || 'N/A'} ${doc.userInfo?.lastName || 'N/A'}`
        : doc.name || 'N/A';
  
      const truncatedName = displayName.length > 15 
        ? `${displayName.slice(0, 15)}...` 
        : displayName;
  
      const uploadDateTime = doc.uploadDate ? dayjs(doc.uploadDate.toDate()) : null;
      const uploadTime = uploadDateTime ? uploadDateTime.format('h:mm A') : 'N/A';
      const uploadDate = uploadDateTime ? uploadDateTime.format('MMM D, YYYY') : 'N/A';
  
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
        <td className="px-6 py-4 whitespace-nowrap text-left font-medium text-gray-900" style={{minWidth: '130px'}}>
          <span className="truncate block" title={displayName}>{truncatedName}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-left font-medium text-gray-900" style={{minWidth: '130px'}}>
          {/* <span className="truncate block" title={displayName}>{truncateText(doc.name, 20)}</span> */}
          {getFlatDisplay(doc)}
          {/* {doc.userInfo?.wing|| "N/A"} - {doc.userInfo?.flatNumber || "N/A"}       
           </td> */}
           </td>
        <td className="px-6 py-4 whitespace-nowrap text-left" style={{minWidth: '120px'}}>
            <span
              className={`text-center align-baseline inline-flex px-2 sm:px-4  sm:py-2 mr-auto items-center font-semibold text-xs sm:text-sm leading-none ${
                doc.status === 'Seen'
                  ? 'text-success bg-success-light'
                  : 'text-gray-500 bg-gray-100'
              } rounded-full`}
            >
              <div className="flex items-center">
                <span
                  className={`inline-block rounded-full ${
                    doc.status === 'Seen' ? 'bg-green-600' : 'bg-gray-500'
                  } w-1.5 h-1.5 sm:w-2 sm:h-2  sm:mr-1`}
                ></span>
                <span className="truncate max-w-[60px] sm:max-w-full">{doc.status}</span>
              </div>
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-left" style={{minWidth: '120px'}}>{uploadTime}</td>
        <td className="px-6 py-4 whitespace-nowrap text-left" style={{minWidth: '120px'}}>{uploadDate}</td>
        <td className="px-6 py-4 whitespace-nowrap text-right" style={{minWidth: '120px'}}>
          <div className="flex justify-end space-x-4">
            {doc.fileUrl && (
              <button onClick={() => handleDownload(doc.fileUrl, doc.fileName)}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.5 11.25V16.25C17.5 16.4158 17.4342 16.5747 17.3169 16.6919C17.1997 16.8092 17.0408 16.875 16.875 16.875H3.125C2.95924 16.875 2.80027 16.8092 2.68306 16.6919C2.56585 16.5747 2.5 16.4158 2.5 16.25V11.25C2.5 11.0842 2.56585 10.9253 2.68306 10.8081C2.80027 10.6908 2.95924 10.625 3.125 10.625C3.29076 10.625 3.44973 10.6908 3.56694 10.8081C3.68415 10.9253 3.75 11.0842 3.75 11.25V15.625H16.25V11.25C16.25 11.0842 16.3158 10.9253 16.4331 10.8081C16.5503 10.6908 16.7092 10.625 16.875 10.625C17.0408 10.625 17.1997 10.6908 17.3169 10.8081C17.4342 10.9253 17.5 11.0842 17.5 11.25ZM9.55781 11.6922C9.61586 11.7503 9.68479 11.7964 9.76066 11.8279C9.83654 11.8593 9.91787 11.8755 10 11.8755C10.0821 11.8755 10.1635 11.8593 10.2393 11.8279C10.3152 11.7964 10.3841 11.7503 10.4422 11.6922L13.5672 8.56719C13.6253 8.50912 13.6713 8.44018 13.7027 8.36431C13.7342 8.28844 13.7503 8.20712 13.7503 8.125C13.7503 8.04288 13.7342 7.96156 13.7027 7.88569C13.6713 7.80982 13.6253 7.74088 13.5672 7.68281C13.5091 7.62474 13.4402 7.57868 13.3643 7.54725C13.2884 7.51583 13.2071 7.49965 13.125 7.49965C13.0429 7.49965 12.9616 7.51583 12.8857 7.54725C12.8098 7.57868 12.7409 7.62474 12.6828 7.68281L10.625 9.74141V2.5C10.625 2.33424 10.5592 2.17527 10.4419 2.05806C10.3247 1.94085 10.1658 1.875 10 1.875C9.83424 1.875 9.67527 1.94085 9.55806 2.05806C9.44085 2.17527 9.375 2.33424 9.375 2.5V9.74141L7.31719 7.68281C7.19991 7.56554 7.04085 7.49965 6.875 7.49965C6.70915 7.49965 6.55009 7.56554 6.43281 7.68281C6.31554 7.80009 6.24965 7.95915 6.24965 8.125C6.24965 8.29085 6.31554 8.44991 6.43281 8.56719L9.55781 11.6922Z" fill="#6B7280"/>
                </svg>
              </button>
            )}
            <button onClick={() => handleEditClick(doc, actualIndex)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.7586 5.73201L14.268 2.24061C14.1519 2.1245 14.0141 2.0324 13.8624 1.96957C13.7107 1.90673 13.5482 1.87439 13.384 1.87439C13.2198 1.87439 13.0572 1.90673 12.9056 1.96957C12.7539 2.0324 12.6161 2.1245 12.5 2.24061L2.86641 11.875C2.74983 11.9906 2.65741 12.1283 2.59451 12.28C2.5316 12.4317 2.49948 12.5944 2.50001 12.7586V16.25C2.50001 16.5815 2.6317 16.8994 2.86612 17.1339C3.10054 17.3683 3.41849 17.5 3.75001 17.5H7.24141C7.40563 17.5005 7.5683 17.4684 7.71999 17.4055C7.87168 17.3426 8.00935 17.2502 8.12501 17.1336L17.7586 7.49998C17.8747 7.3839 17.9668 7.24609 18.0296 7.09442C18.0925 6.94274 18.1248 6.78017 18.1248 6.616C18.1248 6.45182 18.0925 6.28925 18.0296 6.13758C17.9668 5.9859 17.8747 5.84809 17.7586 5.73201ZM7.24141 16.25H3.75001V12.7586L10.625 5.88358L14.1164 9.37498L7.24141 16.25ZM15 8.49061L11.5086 4.99998L13.3836 3.12498L16.875 6.61561L15 8.49061Z" fill="#6B7280"/>
              </svg>
            </button>
            <button onClick={() => handleDeleteClick(doc.id, doc.name || 'this document')}>
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
  
  
  const Status = ['Sort Status', 'Seen', 'Pending'];

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
  
  return (
    <div className="mt-1 bg-white border rounded-lg overflow-hidden flex flex-col h-full">
    <div className="sticky top-0 z-20 bg-white">
    <div className="ml-7 mt-7 gap-4 flex">
          {['Agreement for sale', 'Demand letters'].map((tab) => (
            <span
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`${tab === 'Agreement for sale' ? '' : 'ml-3'} p-2 cursor-pointer ${
                (tab === 'Agreement for sale' && activeTab === 'Agreement') || 
                (tab === 'Demand letters' && activeTab === 'DemandLetter')
                  ? 'border border-[#E4E7EC] bg-[#F9FAFB] font-semibold text-black' 
                  : 'text-[#6B7280]'
              }`}
              style={{ borderRadius: 8 }}
            >
              {tab}
            </span>
          ))}
        </div>
          {/* <div className="flex mt-8 relative">
          <div className="flex gap-6 border-b border-gray-200 w-full">
            <button
              className={`pb-2 font-semibold relative ${
                activeTab === "Agreement" ? "text-gray-900" : "text-gray-400"
              }`}
              onClick={() => setActiveTab("Agreement")}
            >
              Agreement for sale
              {activeTab === "Agreement" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900"></div>
              )}
            </button>
            <button
              className={`pb-2 font-semibold relative ${
                activeTab === "DemandLetter" ? "text-gray-900" : "text-gray-400"
              }`}
              onClick={() => setActiveTab("DemandLetter")}
            >
              Demand letters
              {activeTab === "DemandLetter" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900"></div>
              )}
            </button>
          </div>
        </div> */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-6">
        <div className="w-full sm:w-auto mb-4 sm:mb-0">
          <SearchInput documents={documents} onSearch={handleSearch} />
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-[242px]  " style={{ position: 'relative', zIndex: 43 }}>
            {/* <div className="relative" ref={StatusDropdownRef}> */}
              <button
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="w-full  flex items-center justify-between px-3 py-4 p-2 bg-[#F3F3F3] border border-[#D1D5DB] rounded-[10px] text-[#6B7280] text-[14px]"

              >
                {selectedStatus}
                <svg className='mr-0' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.2345 7.06754L9.98453 13.3175C9.92648 13.3756 9.85755 13.4217 9.78168 13.4532C9.7058 13.4847 9.62447 13.5008 9.54234 13.5008C9.46021 13.5008 9.37888 13.4847 9.303 13.4532C9.22713 13.4217 9.1582 13.3756 9.10015 13.3175L2.85015 7.06754C2.73288 6.95026 2.66699 6.7912 2.66699 6.62535C2.66699 6.4595 2.73288 6.30044 2.85015 6.18316C2.96743 6.06588 3.12649 6 3.29234 6C3.45819 6 3.61725 6.06588 3.73453 6.18316L9.54234 11.9918L15.3502 6.18316C15.4082 6.12509 15.4772 6.07903 15.553 6.0476C15.6289 6.01617 15.7102 6 15.7923 6C15.8745 6 15.9558 6.01617 16.0317 6.0476C16.1075 6.07903 16.1765 6.12509 16.2345 6.18316C16.2926 6.24123 16.3387 6.31017 16.3701 6.38604C16.4015 6.46191 16.4177 6.54323 16.4177 6.62535C16.4177 6.70747 16.4015 6.78879 16.3701 6.86466C16.3387 6.94053 16.2926 7.00947 16.2345 7.06754Z" fill="#6B7280"/>
                </svg>
              </button>
              {isStatusDropdownOpen && (
                <div style={{
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
                }}>
                  {['Sort Status', 'Seen', 'Pending'].map((status, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '8px 16px',
                        cursor: 'pointer',
                        color: 'var(--Gray-400, #6B7280)',
                        fontSize: '14px',
                        borderBottom: '1px solid var(--Gray-100, #E5E7EB)'
                      }}
                      onClick={() => handleStatusSelect(status)}
                    >
                      {status}
                    </div>
                  ))}
                </div>
              )}
           {/* </div> */}
            </div>
            <div className="w-full sm:w-auto">
                <SortButton onSort={handleSort} ref={sortDateRef}/>
              </div>
            </div>
        {/* <div className="w-full sm:w-auto ">
          <SortButton onSort={handleSort} ref={sortDateRef} />
          <div className="relative" ref={StatusDropdownRef}>
              <button
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                style={{
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
                  width: '242px',
                  height: '50px'
                }}
              >
                {selectedStatus}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.2345 7.06754L9.98453 13.3175C9.92648 13.3756 9.85755 13.4217 9.78168 13.4532C9.7058 13.4847 9.62447 13.5008 9.54234 13.5008C9.46021 13.5008 9.37888 13.4847 9.303 13.4532C9.22713 13.4217 9.1582 13.3756 9.10015 13.3175L2.85015 7.06754C2.73288 6.95026 2.66699 6.7912 2.66699 6.62535C2.66699 6.4595 2.73288 6.30044 2.85015 6.18316C2.96743 6.06588 3.12649 6 3.29234 6C3.45819 6 3.61725 6.06588 3.73453 6.18316L9.54234 11.9918L15.3502 6.18316C15.4082 6.12509 15.4772 6.07903 15.553 6.0476C15.6289 6.01617 15.7102 6 15.7923 6C15.8745 6 15.9558 6.01617 16.0317 6.0476C16.1075 6.07903 16.1765 6.12509 16.2345 6.18316C16.2926 6.24123 16.3387 6.31017 16.3701 6.38604C16.4015 6.46191 16.4177 6.54323 16.4177 6.62535C16.4177 6.70747 16.4015 6.78879 16.3701 6.86466C16.3387 6.94053 16.2926 7.00947 16.2345 7.06754Z" fill="#6B7280"/>
                </svg>
              </button>
              {isStatusDropdownOpen && (
                <div style={{
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
                }}>
                  {['Sort Status', 'Seen', 'Pending'].map((status, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '8px 16px',
                        cursor: 'pointer',
                        color: 'var(--Gray-400, #6B7280)',
                        fontSize: '14px',
                        borderBottom: '1px solid var(--Gray-100, #E5E7EB)'
                      }}
                      onClick={() => handleStatusSelect(status)}
                    >
                      {status}
                    </div>
                  ))}
                </div>
              )}
           </div>
              </div> */}
            </div>
            </div>
            <div className="flex-grow overflow-auto">
        <table className="w-full text-sm text-gray-500" style={{ minWidth: '1000px' }}>
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
              <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '130px'}}>Name</th>
              <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '130px'}}>Flat Number</th>
              <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px'}}>Status</th>
              <th scope="col" className="px-6 py-3 text-left" style={{minWidth: '120px'}}>
                <div className="flex items-center">
                  Time
                  {/* <svg className="ml-2" xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                    <path d="M8.66699 3.66667V12M8.66699 12L4.66699 8M8.66699 12L12.667 8" stroke="#4B5563" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg> */}
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
      <path 
        d="M8.66699 3.66667V12M8.66699 12L4.66699 8M8.66699 12L12.667 8" 
        stroke="#4B5563" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  </div>
</th>
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

      <EditingDocumentModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        document={editingDocument}
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

export default DocumentTable;