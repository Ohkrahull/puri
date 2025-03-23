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
        className="flex items-center gap-2 px-2 py-1 text-medium text-gray-700 rounded-md hover:bg-gray-50"
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

// Define delivery services array (copied from DeliveryTable)
const DELIVERY_SERVICES = [
  { id: 1, name: 'Swiggy', icon: require('../assets/images/swiggy.png'), backgroundColor: '#FC8019' },
  { id: 2, name: 'Zomato', icon: require('../assets/images/zomato.png'), backgroundColor: '#E23744' },
  { id: 3, name: 'Flipkart', icon: require('../assets/images/flipcart.png'), backgroundColor: '#2874F0' },
  { id: 4, name: 'Amazon', icon: require('../assets/images/amazon.png'), backgroundColor: '#232F3E' },
  { id: 5, name: 'Myntra', icon: require('../assets/images/myntra.png'), backgroundColor: '#F5F5F5' },
  { id: 6, name: 'Snapdeal', icon: require('../assets/images/snapdeal.jpg'), backgroundColor: '#E40046' },
  { id: 7, name: 'Blinkit', icon: require('../assets/images/blinkit.jpg'), backgroundColor: '#F2C200' },
  { id: 8, name: 'Zepto', icon: require('../assets/images/zepto.jpg'), backgroundColor: '#8000FF' },
  { id: 9, name: 'Delivery', icon: require('../assets/images/delhivery.png'), backgroundColor: '#000000' },
  { id: 10, name: 'Shadowfax', icon: require('../assets/images/shadow.jpg'), backgroundColor: '#FF6B00' },
  { id: 11, name: 'Big Basket', icon: require('../assets/images/bigbasket.png'), backgroundColor: '#84C225' },
  { id: 12, name: 'Dunzo', icon: require('../assets/images/dunzo.png'), backgroundColor: '#00B1B1' },
  { id: 13, name: 'Licious', icon: require('../assets/images/licious.png'), backgroundColor: '#E41D36' },
  { id: 14, name: 'FedEx', icon: require('../assets/images/fedex.png'), backgroundColor: '#4D148C' },
  { id: 15, name: 'DHL', icon: require('../assets/images/dhl.png'), backgroundColor: '#FFCC00' },
  { id: 16, name: 'Other', icon: null, backgroundColor: '#F5F5F5' }
];
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
  const itemsPerPage = 6;

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

  // Custom CSS to hide scrollbar but keep functionality
  const scrollbarHideStyles = {
    scrollbarWidth: 'none', /* Firefox */
    msOverflowStyle: 'none', /* Internet Explorer 10+ */
    WebkitScrollbarWidth: '0px',
    WebkitScrollbarHeight: '0px',
    WebkitAppearance: 'none'
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

    // For Delivery tab in Expected state, show Company Name first
    if (activeMainTab === 'Delivery' && activeTab === 'expected') {
      return [
        'Company Name',
        'Phone Number',
        'Flat Number',
        'Date'
      ];
    }

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
    if (activeMainTab === 'Delivery' && column === 'Company Name') {
      const deliveryService = DELIVERY_SERVICES.find(service => 
        service.name.toLowerCase() === item.company?.toLowerCase()
      );
      
      return (
        <div className="flex items-center space-x-3">
          {deliveryService ? (
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: deliveryService.backgroundColor }}
            >
              <img 
                src={deliveryService.icon} 
                alt={item.company} 
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/Images/profile.png';
                }}
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600 uppercase">
                {`${item.company?.[0] || ''}`}
              </span>
            </div>
          )}

          <div className="flex flex-col">
            <span className="font-medium text-gray-900">
              {`${item.company || 'N/A'}`}
            </span>

            {item.atGate && (
              <span className="mt-1 px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full w-fit">
                Leave at gate
              </span>
            )}
          </div>
        </div>
      );
    }
    
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

  // Calculate total table width based on columns
  const getTableWidth = () => {
    const columns = getTableColumns();
    let width = 50; // Initial padding
    columns.forEach(column => {
      width += parseInt(getColumnWidth(column).replace('px', ''), 10);
    });
    return `${width}px`;
  };

  return (
    <div className="mt-1 bg-white rounded-lg flex flex-col h-[500px] border border-gray-200" 
         style={{ fontFamily: 'Plus_Jakarta', position: 'relative', zIndex: 1 }}>
      <div className="sticky top-0 z-20 bg-white">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:px-7 sm:py-5">
          <div className="flex flex-col gap-1 mb-4 sm:mb-0">
            <h1 className="text-[16px] font-semibold text-gray-900">Visitors</h1>
            <a href="#" className="text-[12px] text-gray-500 hover:underline underline">
              View all your visitors
            </a>
          </div>

          {/* Top Filters */}
          <div className="flex flex-wrap gap-2">
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

        {/* Main Navigation Tabs - Horizontally scrollable on small screens */}
        <div className="flex overflow-x-auto" style={scrollbarHideStyles}>
          <div className="flex gap-8 px-7 mt-2 mb-5 min-w-max">
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
      </div>

      {/* Table Section with Fixed Header and Scrollable Body */}
      <div className="flex-grow overflow-hidden relative">
        {/* Table with fixed layout */}
        <div className="overflow-x-auto overflow-y-hidden h-full" style={{...scrollbarHideStyles}}>
          <div style={{ minWidth: getTableWidth() }}>
            {/* Fixed Header - will stay in place */}
            <table className="w-full table-fixed border-collapse">
              <thead className="bg-gray-50">
                <tr className="border-y border-gray-200">
                  <th style={{ width: '0px', padding: '1px' }}></th>
                  {getTableColumns().map((column) => (
                    <th
                      key={column}
                      onClick={isDateColumn(column) ? handleDateSort : undefined}
                      style={{ 
                        width: getColumnWidth(column),
                        textAlign: 'left',
                        padding: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#4B5563',
                        whiteSpace: 'nowrap',
                        cursor: isDateColumn(column) ? 'pointer' : 'default'
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
            </table>
            
            {/* Scrollable Body */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(500px - 180px)', ...scrollbarHideStyles }}>
              <table className="w-full table-fixed border-collapse">
                <tbody className="divide-y divide-gray-200">
                  {currentItems.slice(0, 10).map((item, index) => (
                    <tr key={item.id} className="bg-white hover:bg-gray-50" style={{fontSize:'14px'}}>
                      <td style={{ width: '0px', padding: '1px' }}></td>
                      {getTableColumns().map((column, colIndex) => (
                        <td 
                          key={colIndex} 
                          style={{ 
                            width: getColumnWidth(column),
                            padding: '12px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {renderTableCell(item, column)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={getTableColumns().length + 1} style={{ height: '400px', padding: '24px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                          <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          <p className="text-lg font-semibold text-gray-700">
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