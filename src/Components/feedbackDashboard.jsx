import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import styles from './CustomScrollbar.module.css';
// import SearchInput from './SearchInput';
import SortButton from '../Buttons/Sortdate';
import { fetchAllFeedback, deleteFeedback } from '../firebase/services/FeedbackService';
import DeleteModal from '../Modals/DeleteModal'; // Make sure to import the DeleteModal component
import { toast } from 'react-toastify';

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
    setSearchTerm(`${feedback.firstName} ${feedback.lastName}`);
    setShowDropdown(false);
    onSearch(`${feedback.firstName} ${feedback.lastName}`);
  };

  const filteredFeedback = feedbackList.filter(
    (feedback) =>
      `${feedback.firstName} ${feedback.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.feedbackText?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M17.9419 17.0579L14.0302 13.1469C15.1639 11.7858 15.7293 10.0399 15.6086 8.2725C15.488 6.50512 14.6906 4.85229 13.3823 3.65785C12.074 2.46341 10.3557 1.81932 8.58462 1.85957C6.81357 1.89982 5.12622 2.62131 3.87358 3.87395C2.62094 5.12659 1.89945 6.81394 1.8592 8.58498C1.81895 10.356 2.46304 12.0744 3.65748 13.3827C4.85192 14.6909 6.50475 15.4883 8.27214 15.609C10.0395 15.7297 11.7854 15.1643 13.1466 14.0305L17.0575 17.9422C17.1156 18.0003 17.1845 18.0464 17.2604 18.0778C17.3363 18.1092 17.4176 18.1254 17.4997 18.1254C17.5818 18.1254 17.6631 18.1092 17.739 18.0778C17.8149 18.0464 17.8838 18.0003 17.9419 17.9422C17.9999 17.8842 18.046 17.8152 18.0774 17.7394C18.1089 17.6635 18.125 17.5822 18.125 17.5001C18.125 17.4179 18.1089 17.3366 18.0774 17.2607C18.046 17.1849 17.9999 17.1159 17.9419 17.0579ZM3.12469 8.75006C3.12469 7.63754 3.45459 6.55 4.07267 5.62497C4.69076 4.69995 5.56926 3.97898 6.5971 3.55323C7.62493 3.12749 8.75593 3.0161 9.84707 3.23314C10.9382 3.45018 11.9405 3.98591 12.7272 4.77258C13.5138 5.55925 14.0496 6.56153 14.2666 7.65267C14.4837 8.74382 14.3723 9.87482 13.9465 10.9027C13.5208 11.9305 12.7998 12.809 11.8748 13.4271C10.9497 14.0452 9.86221 14.3751 8.74969 14.3751C7.25836 14.3734 5.82858 13.7802 4.77404 12.7257C3.71951 11.6712 3.12634 10.2414 3.12469 8.75006Z" fill="#6B7280"/>
        </svg>
      </div>

      {showDropdown && filteredFeedback.length > 0 && (
        <div className="absolute w-full mt-3 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          {filteredFeedback.map((feedback, index) => (
            <div
              key={index}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
              style={{borderBottom: '1px solid var(--Gray-100, #E5E7EB)'}}
              onClick={() => handleItemClick(feedback)}
            >
              <div className="font-medium" style={{fontSize:'16px', color:'#6B7280'}}>
                {`${feedback.firstName} ${feedback.lastName}`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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


  const itemsPerPage = 7;

  // useEffect(() => {
  //   const unsubscribe = fetchAllFeedback((processedFeedback, error) => {
  //     if (error) {
  //       console.error("Error fetching feedback:", error);
  //       setError("Failed to load feedback. Please try again later.");
  //       setIsLoading(false);
  //       return;
  //     }
      
  //     console.log("processedFeedback: ", processedFeedback);
  //     setFeedbackList(processedFeedback);
  //     setFilteredFeedback(processedFeedback);
  //     setIsLoading(false);
  //   });

  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    const unsubscribe = fetchAllFeedback((processedFeedback, error) => {
      if (error) {
        console.error("Error fetching feedback:", error);
        setError("Failed to load feedback. Please try again later.");
        setIsLoading(false);
        return;
      }
      
      // Sort the feedback by createdAt in descending order (newest first)
      const sortedFeedback = processedFeedback.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      console.log("sortedFeedback: ", sortedFeedback);
      setFeedbackList(sortedFeedback);
      setFilteredFeedback(sortedFeedback);
      setIsLoading(false);
    });
  
    return () => unsubscribe();
  }, []);

  // useEffect(() => {
  //   const unsubscribe = fetchAllFeedback((fetchedFeedback) => {
  //     // Convert Firebase Timestamp to JavaScript Date
  //     const processedFeedback = fetchedFeedback.map(feedback => ({
  //       ...feedback,
  //       createdAt: feedback.createdAt?.toDate() || new Date() // Use current date as fallback
  //     }));
  //     console.log("processedFeedback: ", processedFeedback);
      
  //     setFeedbackList(processedFeedback);
  //     setFilteredFeedback(processedFeedback);
  //     setIsLoading(false);
  //   }, (error) => {
  //     console.error("Error fetching feedback:", error);
  //     setError("Failed to load feedback. Please try again later.");
  //     setIsLoading(false);
  //   });

  //   return () => unsubscribe();
  // }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = feedbackList.filter(
      (feedback) => {
        const name = feedback.userInfo ? `${feedback.userInfo.firstName || ''} ${feedback.userInfo.lastName || ''}`.toLowerCase() : '';
        const comment = feedback.feedbackText ? feedback.feedbackText.toLowerCase() : '';
        return name.includes(term.toLowerCase()) || comment.includes(term.toLowerCase());
      }
    );
    setFilteredFeedback(filtered);
    setCurrentPage(1);
  };

  const handleSort = (startDate, endDate) => {
    let filtered = feedbackList;
    if (startDate || endDate) {
      filtered = feedbackList.filter(feedback => {
        const feedbackDate = dayjs(feedback.createdAt);
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
    
    filtered.sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf());
    
    setFilteredFeedback(filtered);
    setCurrentPage(1);
  };

  const hideScrollbarStyle = {
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  };


  const handleDeleteClick = (index) => {
    const feedbackToDelete = filteredFeedback[index];
    setDeleteItemName(`feedback from ${feedbackToDelete.firstName} ${feedbackToDelete.lastName}`);
    setDeleteFunction(() => async () => {
      try {
        await deleteFeedback(feedbackToDelete.id);
        const updatedFeedback = filteredFeedback.filter((_, i) => i !== index);
        setFilteredFeedback(updatedFeedback);
        setFeedbackList(prevList => prevList.filter(fb => fb.id !== feedbackToDelete.id));
        toast.success('Feedback deleted successfully');
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error("Error deleting feedback:", error);
        toast.error('Failed to delete feedback');
      }
    });
    setIsDeleteModalOpen(true);
  };

  const totalPages = Math.ceil((filteredFeedback?.length || 0) / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFeedback?.slice(indexOfFirstItem, indexOfLastItem) || [];

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

  const isAllSelected = currentItems.length > 0 && selectedRows.length === currentItems.length;

  const handleDeleteSelected = () => {
    setDeleteItemName('all selected feedback');
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
  const truncateName = (firstName, lastName) => {
    const fullName = `${firstName} ${lastName}`;
    return fullName.length > 14 ? fullName.slice(0, 14) + '...' : fullName;
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

  // const truncateName = (firstName, lastName) => {
  //   const fullName = `${firstName} ${lastName}`;
  //   return fullName.length > 12 ? fullName.slice(0, 12) + '...' : fullName;
  // };

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
              <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
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
      // const truncatedName = truncateName(feedback.firstName, feedback.lastName);
      const truncatedName = feedback.userInfo 
      ? truncateName(feedback.userInfo.firstName || '', feedback.userInfo.lastName || '')
      : 'N/A';

      return (
        <tr key={feedback.id} className="bg-white border-b hover:bg-gray-50 " style={{fontSize:'14px'}}>
          {/* <td className="p-4 w-4" style={{width:'5%'}}>
          
          </td> */}
          <td className="py-6 px-8 text-left " style={{width: '30%'}}>
          {truncateText(truncatedName, 20)}
          </td>
          
          <td className="px-6 py-4 text-left" style={{width: '30%'}}>
          <Link to={`/feedbackForm/${feedback.id}`} className="text-blue-600 hover:underline">View</Link>
          </td>
          <td className="px-6 py-4 text-right" style={{width: '40%'}}>
            <div className="flex justify-end space-x-4">
              <svg onClick={() => handleDeleteClick(actualIndex)} style={{cursor:'pointer'}} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.875 3.75H3.125C2.95924 3.75 2.80027 3.81585 2.68306 3.93306C2.56585 4.05027 2.5 4.20924 2.5 4.375C2.5 4.54076 2.56585 4.69973 2.68306 4.81694C2.80027 4.93415 2.95924 5 3.125 5H3.75V16.25C3.75 16.5815 3.8817 16.8995 4.11612 17.1339C4.35054 17.3683 4.66848 17.5 5 17.5H15C15.3315 17.5 15.6495 17.3683 15.8839 17.1339C16.1183 16.8995 16.25 16.5815 16.25 16.25V5H16.875C17.0408 5 17.1997 4.93415 17.3169 4.81694C17.4342 4.69973 17.5 4.54076 17.5 4.375C17.5 4.20924 17.4342 4.05027 17.3169 3.93306C17.1997 3.81585 17.0408 3.75 16.875 3.75ZM15 16.25H5V5H15V16.25ZM6.25 1.875C6.25 1.70924 6.31585 1.55027 6.43306 1.43306C6.55027 1.31585 6.70924 1.25 6.875 1.25H13.125C13.2908 1.25 13.4497 1.31585 13.5669 1.43306C13.6842 1.55027 13.75 1.70924 13.75 1.875C13.75 2.04076 13.6842 2.19973 13.5669 2.31694C13.4497 2.43415 13.2908 2.5 13.125 2.5H6.875C6.70924 2.5 6.55027 2.43415 6.43306 2.31694C6.31585 2.19973 6.25 2.04076 6.25 1.875Z" fill="#EF4444"/>
              </svg>
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className=" bg-white bottom-0   overflow-hidden flex flex-col" style={{ height: '321px',overflow: 'hidden' ,}}>
      <div className="sticky top-0 z-20 bg-white">
        {/* <div className="flex justify-between items-center p-6">
          <div className="relative z-40">
            <SearchInput feedbackList={feedbackList} onSearch={handleSearch} onItemClick={() => {}} />
          </div>
          <div className='flex justify-end'>
            <SortButton onSort={handleSort} />
            <button className='flex text-end justify-end ml-[10px]' style={{display:'flex',padding:'8px 16px', justifyContent:'center', alignItems:'center', border:'1px solid #D1D5DB',borderRadius:'10px', color:'#6B7280', fontSize:'16px', fontFamily:'Plus Jakarta Sans, sans-serif'}}>
              Filter
            </button>
          </div>
        </div> */}
        <div className="border-y bg-gray-50">
          <table className="w-full text-sm text-gray-500">
            <thead className="text-xs text-gray-500 sticky top-0 z-10 bg-gray-50" style={{fontSize:'12px'}}>
              <tr className="border-y">
                {/* <th scope="col" className="p-4 w-4" style={{width:'1%', border:'2px solid red'}}>
                  
                </th> */}
                <th scope="col" className="py-4 px-8 text-left " style={{fontSize:'12px', width: '30%'}}>Name</th>
                
                <th scope="col" className="px-6 py-4 text-left" style={{width: '30%'}}>Feedback</th>
               <th style={{width:'40%'}}></th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto" style={hideScrollbarStyle}>
        <table className="w-full text-sm text-left text-gray-500">
          <tbody>
            {renderTableContent()}
          </tbody>
        </table>
      </div>
      {/* <div className="flex mt-[-2px] justify-between items-center px-6 py-3 border-t">
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
      </div> */}
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