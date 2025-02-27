

// import React, { useState, useEffect, useRef } from 'react';
// import { collection, query, onSnapshot, getFirestore, orderBy, deleteDoc, doc } from 'firebase/firestore';
// import { getApp } from 'firebase/app';
// import dayjs from 'dayjs';
// import { toast } from 'react-toastify';
// import SortButton from '../Buttons/Sortdate';
// import DeleteModal from '../Modals/DeleteModal';
// import { useAuth } from '../context/AuthContext';

// const CombinedTable = () => {
//   const [activeTab, setActiveTab] = useState('tenant');
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [dateSortDirection, setDateSortDirection] = useState('asc');
//   const [searchTerm, setSearchTerm] = useState('');
//   const db = getFirestore(getApp());
//   const { user } = useAuth();

//   useEffect(() => {
//     const collectionName = activeTab;
//     const dataQuery = query(collection(db, collectionName));
    
//     const unsubscribe = onSnapshot(dataQuery, (snapshot) => {
//       const fetchedData = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       setData(fetchedData);
//       filterData(fetchedData);
//     });

//     return () => unsubscribe();
//   }, [activeTab, db]);

//   const filterData = (data) => {
//     let filtered = data;

//     if (searchTerm) {
//       filtered = filtered.filter(item => {
//         const fullName = `${item.firstName || ''} ${item.lastName || ''}`.toLowerCase();
//         const searchLower = searchTerm.toLowerCase();
//         return fullName.includes(searchLower) ||
//                item.phoneNumber?.includes(searchLower);
//       });
//     }

//     filtered.sort((a, b) => {
//       const dateField = activeTab === 'tenant' ? 'moveInDate' : 'availabilityDate';
//       const dateA = a[dateField] ? new Date(a[dateField].toDate()).getTime() : 0;
//       const dateB = b[dateField] ? new Date(b[dateField].toDate()).getTime() : 0;
//       return dateSortDirection === 'asc' ? dateA - dateB : dateB - dateA;
//     });

//     setFilteredData(filtered);
//   };

//   useEffect(() => {
//     filterData(data);
//   }, [searchTerm, dateSortDirection]);

//   const handleSearch = (term) => {
//     setSearchTerm(term);
//   };

//   const handleDateSort = () => {
//     setDateSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
//   };

//   const getColumns = () => {
//     const commonColumns = [
//       { key: 'name', label: 'Name' },
//       { key: 'phoneNumber', label: 'Phone Number' },
//       { key: 'rentalBudget', label: 'Rental Budget' },
//       { key: 'furnishingType', label: 'Furnishing Type' },
//       { key: 'status', label: 'Status' }
//     ];

//     if (activeTab === 'tenant') {
//       return [
//         ...commonColumns.slice(0, 3),
//         { key: 'moveInDate', label: 'Move-In Date' },
//         { key: 'leaseTenure', label: 'Lease Tenure' },
//         ...commonColumns.slice(3)
//       ];
//     }

//     return [
//       ...commonColumns.slice(0, 3),
//       { key: 'securityBudget', label: 'Security Budget' },
//       { key: 'availabilityDate', label: 'Availability Date' },
//       ...commonColumns.slice(3)
//     ];
//   };

//   const formatCell = (item, column) => {
//     switch (column.key) {
//       case 'name':
//         return `${item.firstName || ''} ${item.lastName || ''}`;
//       case 'rentalBudget':
//       case 'securityBudget':
//         return `₹${item[column.key] || 'N/A'}`;
//       case 'moveInDate':
//       case 'availabilityDate':
//         return item[column.key] ? 
//           dayjs(item[column.key].toDate()).format('D MMM, YYYY') : 
//           'N/A';
//       case 'status':
//         return (
//           <div className="flex items-center gap-2">
//             <span className={`flex items-center justify-center text-center px-2 py-2 rounded-full text-[12px] font-medium ${
//               item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//               item.status === 'approved' ? 'bg-green-100 text-green-800' :
//               item.status === 'rejected' ? 'bg-red-100 text-red-800' :
//               'bg-gray-100 text-gray-800'
//             }`}>
//               <div className={`w-2 h-2 rounded-full mr-1 ${
//                 item.status === 'pending' ? 'bg-yellow-500' :
//                 item.status === 'approved' ? 'bg-green-500' :
//                 item.status === 'rejected' ? 'bg-red-500' :
//                 'bg-gray-500'
//               }`}></div>
//               {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'N/A'}
//             </span>
//           </div>
//         );
//       default:
//         return item[column.key] || 'N/A';
//     }
//   };

//   return (
//     <div className="mt-1 bg-white border h-[500px] rounded-lg overflow-hidden flex flex-col" 
//          style={{ position: 'relative', zIndex: 1, fontFamily: 'Plus_Jakarta' }}>
//       <div className="sticky top-0 z-20 bg-white">
//         <div className="flex justify-between items-center px-7 py-5 border-b">
//         <div className="flex flex-col gap-1 ">
//             <h1 className="text-[16px] font-semibold text-gray-900">Visitors</h1>
//             <a href="#" className="text-[12px] text-gray-500 hover:underline underline">
//               View all your visitors
//             </a>
//           </div>
//           <div className="flex gap-4">

//             <button
//               onClick={() => setActiveTab('tenant')}
//               className={`px-4 py-2 text-[14px] font-medium rounded-lg ${
//                 activeTab === 'tenant' ? 'bg-gray-900 text-white' : 'text-gray-500'
//               }`}
//             >
//               Tenant
//             </button>
//             <button
//               onClick={() => setActiveTab('owner')}
//               className={`px-4 py-2 text-[14px] font-medium rounded-lg ${
//                 activeTab === 'owner' ? 'bg-gray-900 text-white' : 'text-gray-500'
//               }`}
//             >
//               Owner
//             </button>
//           </div>

         
//         </div>
//       </div>

//       <div className="flex-grow overflow-auto">
//         <table className="w-full text-sm text-gray-500" style={{ minWidth: '1000px' }}>
//           <thead className="text-xs text-gray-500 bg-gray-50 sticky top-0" style={{fontSize:'12px'}}>
//             <tr className="border-y">
//               {getColumns().map((column) => (
//                 <th key={column.key} className="px-6 py-3 text-left">
//                   <div className="flex items-center">
//                     {column.label}
//                     {['rentalBudget', 'securityBudget', 'availabilityDate', 'moveInDate'].includes(column.key) && (
//                       <svg className="ml-2" xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
//                         <path d="M8.66699 3.66667V12M8.66699 12L4.66699 8M8.66699 12L12.667 8" stroke="#4B5563" strokeLinecap="round" strokeLinejoin="round"/>
//                       </svg>
//                     )}
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.map((item) => (
//               <tr key={item.id} className="bg-white border-b hover:bg-gray-50" style={{fontSize:'14px'}}>
//                 {getColumns().map((column) => (
//                   <td key={column.key} className="px-6 py-4">
//                     {formatCell(item, column)}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//             {filteredData.length === 0 && (
//               <tr>
//                 <td colSpan={getColumns().length} className="px-6 py-4 text-center text-gray-500" style={{ height: '300px' }}>
//                   <div className="flex flex-col items-center justify-center h-full">
//                     <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
//                     </svg>
//                     <p className="text-lg font-semibold">No {activeTab}s found</p>
//                     <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
//                   </div>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default CombinedTable;

import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, getFirestore, where, getDocs } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CombinedTable = () => {
  const [activeTab, setActiveTab] = useState('tenant');
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [sortField, setSortField] = useState('moveInDate');
  const [sortDirection, setSortDirection] = useState('asc');
  const navigate = useNavigate();
  const db = getFirestore(getApp());
  const { user } = useAuth();

  useEffect(() => {
    const rentalQuery = query(
      collection(db, 'rentalRequest'),
      where('requestType', '==', activeTab === 'tenant' ? 'propertySearch' : 'propertyList')
    );
    
    const unsubscribe = onSnapshot(rentalQuery, async (snapshot) => {
      const requestsData = await Promise.all(snapshot.docs.map(async (doc) => {
        const data = doc.data();
        let userDetails = { firstName: '', lastName: '' };
        
        if (data.phoneNumber) {
          userDetails = await fetchUserDetails(db, data.phoneNumber);
        }
        
        return {
          id: doc.id,
          ...data,
          firstName: userDetails.firstName,
          lastName: userDetails.lastName
        };
      }));
      
      setRequests(requestsData);
      filterRequests(requestsData);
    });

    return () => unsubscribe();
  }, [activeTab, db]);

  const fetchUserDetails = async (db, phoneNumber) => {
    try {
      const userQuery = query(
        collection(db, 'authorizedUsers'),
        where('phoneNumber', '==', phoneNumber)
      );
      const userSnapshot = await getDocs(userQuery);
      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        return {
          firstName: userData.firstName || '',
          lastName: userData.lastName || ''
        };
      }
      return { firstName: '', lastName: '' };
    } catch (error) {
      console.error('Error fetching user details:', error);
      return { firstName: '', lastName: '' };
    }
  };

  const filterRequests = (data) => {
    let filtered = data;

    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'monthlyBudget':
          const budgetA = parseInt(a.monthlyBudget?.replace(/[^0-9]/g, '')) || 0;
          const budgetB = parseInt(b.monthlyBudget?.replace(/[^0-9]/g, '')) || 0;
          comparison = budgetA - budgetB;
          break;
        case 'leaseTenure':
          const tenureA = Math.round(parseFloat(a.leaseTenure) || 0);
          const tenureB = Math.round(parseFloat(b.leaseTenure) || 0);
          comparison = tenureA - tenureB;
          break;
        case 'moveInDate':
        case 'availabilityDate':
          const dateA = a[sortField] ? a[sortField].toDate().getTime() : 0;
          const dateB = b[sortField] ? b[sortField].toDate().getTime() : 0;
          comparison = dateA - dateB;
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    setFilteredRequests(filtered);
  };

  useEffect(() => {
    filterRequests(requests);
  }, [sortField, sortDirection, requests]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(current => current === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }) => (
    <svg 
      className={`ml-2 transition-transform duration-200 ${
        sortField === field 
          ? sortDirection === 'desc' 
            ? 'rotate-180 transform' 
            : 'rotate-0 transform' 
          : ''
      }`}
      xmlns="http://www.w3.org/2000/svg" 
      width="17" 
      height="16" 
      viewBox="0 0 17 16" 
      fill="none"
    >
      <path 
        d="M8.66699 3.66667V12M8.66699 12L4.66699 8M8.66699 12L12.667 8" 
        stroke="#4B5563" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

  const getColumns = () => {
    const commonColumns = [
      { key: 'name', label: 'Name' },
      { key: 'ticketId', label: 'Ticket ID' },
      { key: 'phoneNumber', label: 'Phone Number' },
      { key: 'monthlyBudget', label: 'Monthly Budget', sortable: true },
    ];

    if (activeTab === 'tenant') {
      return [
        ...commonColumns,
        { key: 'bhkType', label: 'BHK Type' },
        { key: 'leaseTenure', label: 'Lease Tenure', sortable: true },
        { key: 'moveInDate', label: 'Move-In Date', sortable: true },
        { key: 'furnishingType', label: 'Furnishing Type' },
        { key: 'status', label: 'Status' }
      ];
    }

    return [
      ...commonColumns,
      { key: 'securityDeposit', label: 'Security Deposit', sortable: true },
      { key: 'availabilityDate', label: 'Availability Date', sortable: true },
      { key: 'furnishingType', label: 'Furnishing Type' },
      { key: 'status', label: 'Status' }
    ];
  };

  const formatCell = (item, column) => {
    switch (column.key) {
      case 'name':
        return `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'N/A';
      case 'monthlyBudget':
      case 'securityDeposit':
        return `₹${item[column.key] || 'N/A'}`;
      case 'leaseTenure':
        return item[column.key] ? `${Math.round(item[column.key])} Months` : 'N/A';
      case 'moveInDate':
      case 'availabilityDate':
        return item[column.key] ? 
          dayjs(item[column.key].toDate()).format('D MMM, YYYY') : 
          'N/A';
      case 'status':
        return (
          <div className="flex items-center gap-2">
            <span className={`flex items-center justify-center text-center px-2 py-2 rounded-full text-[12px] font-medium ${
              item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              item.status === 'approved' ? 'bg-green-100 text-green-800' :
              item.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-1 ${
                item.status === 'pending' ? 'bg-yellow-500' :
                item.status === 'approved' ? 'bg-green-500' :
                item.status === 'rejected' ? 'bg-red-500' :
                'bg-gray-500'
              }`}></div>
              {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'N/A'}
            </span>
          </div>
        );
      default:
        return item[column.key] || 'N/A';
    }
  };

  const handleRowClick = (itemId) => {
    navigate(`/${activeTab === 'tenant' ? 'tenant' : 'owner'}/${itemId}`);
  };

  return (
    <div className="mt-1 bg-white  border rounded-lg overflow-hidden h-[500px] flex flex-col  border-gray-200" style={{ position: 'relative', zIndex: 1, fontFamily: 'Plus_Jakarta' }}>
      <div className="sticky top-0 z-20 bg-white">
        <div className="flex justify-between items-center px-7 py-6 border-b ">
          <div className="flex flex-col gap-1">
            <h1 className="text-[16px] font-semibold text-gray-900">Visitors</h1>
            <a href="#" className="text-[12px] text-gray-500 hover:underline underline">
              View all your visitors
            </a>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('tenant')}
              className={`px-4 py-2 text-[14px] font-medium rounded-lg ${
                activeTab === 'tenant' ? 'bg-gray-50 border border-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Tenant
            </button>
            <button
              onClick={() => setActiveTab('owner')}
              className={`px-4 py-2 text-[14px] font-medium rounded-lg ${
                activeTab === 'owner' ? 'bg-gray-50 border border-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Owner
            </button>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-auto ">
        <table className="w-full text-sm text-gray-500" style={{ minWidth: '1000px' }}>
          <thead className="text-xs text-gray-500 bg-gray-50 sticky top-0" style={{fontSize:'12px'}}>
            <tr className="border-y whitespace-nowrap">
              {getColumns().map((column) => (
                <th 
                  key={column.key} 
                  className={`px-6 py-3 text-left ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center whitespace-nowrap">
                    {column.label}
                    {column.sortable && <SortIcon field={column.key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((item) => (
              <tr 
                key={item.id} 
                className="bg-white border-b hover:bg-gray-50 cursor-pointer whitespace-nowrap" 
                onClick={() => handleRowClick(item.id)}
                style={{fontSize:'14px'}}
              >
                {getColumns().map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {formatCell(item, column)}
                  </td>
                ))}
              </tr>
            ))}
            {filteredRequests.length === 0 && (
              <tr>
                <td colSpan={getColumns().length} className="px-6 py-4 text-center text-gray-500" style={{ height: '300px' }}>
                  <div className="flex flex-col items-center justify-center h-full">
                    <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p className="text-lg font-semibold">No {activeTab}s found</p>
                    <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CombinedTable;