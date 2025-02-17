// // // import React, { useState, useEffect, useCallback } from 'react';
// // // import { useNavigate } from 'react-router-dom';
// // // import { Search, X } from 'lucide-react';

// // // // Define searchable routes with their display names and icons
// // // const SEARCHABLE_ROUTES = [
// // //   { 
// // //     path: '/flatmain', 
// // //     name: 'Flat Management', 
// // //     keywords: ['flat', 'property', 'apartment', 'housing']
// // //   },
// // //   { 
// // //     path: '/UserRequests', 
// // //     name: 'User Requests', 
// // //     keywords: ['request', 'user', 'pending', 'approval']
// // //   },
// // //   { 
// // //     path: '/Facility', 
// // //     name: 'Facility', 
// // //     keywords: ['amenity', 'service', 'facility']
// // //   },
// // //   { 
// // //     path: '/Booking', 
// // //     name: 'Bookings', 
// // //     keywords: ['book', 'reservation', 'schedule']
// // //   },
// // //   { 
// // //     path: '/Guest', 
// // //     name: 'Guest', 
// // //     keywords: ['visitor', 'guest', 'temporary']
// // //   },
// // //   { 
// // //     path: '/Helper', 
// // //     name: 'Helper', 
// // //     keywords: ['assist', 'helper', 'support']
// // //   },
// // //   { 
// // //     path: '/Parcels', 
// // //     name: 'Parcels', 
// // //     keywords: ['package', 'delivery', 'parcel']
// // //   },
// // //   { 
// // //     path: '/Notices', 
// // //     name: 'Notices', 
// // //     keywords: ['announcement', 'notice', 'communication']
// // //   },
// // //   { 
// // //     path: '/sosHistory', 
// // //     name: 'SOS History', 
// // //     keywords: ['emergency', 'sos', 'alert']
// // //   },
// // //   { 
// // //     path: '/feedback', 
// // //     name: 'Feedback', 
// // //     keywords: ['comment', 'review', 'feedback']
// // //   },
// // //   { 
// // //     path: '/special_request', 
// // //     name: 'Special Request', 
// // //     keywords: ['special', 'request', 'custom']
// // //   },
// // //   { 
// // //     path: '/document', 
// // //     name: 'Documents', 
// // //     keywords: ['file', 'document', 'legal']
// // //   },
// // //   { 
// // //     path: '/construction', 
// // //     name: 'Construction Update', 
// // //     keywords: ['update', 'construction', 'progress']
// // //   },
// // //   { 
// // //     path: '/Resident', 
// // //     name: 'Resident', 
// // //     keywords: ['resident', 'housing', 'occupant']
// // //   },
// // //   { 
// // //     path: '/user', 
// // //     name: 'Staff', 
// // //     keywords: ['employee', 'staff', 'worker']
// // //   },
// // //   { 
// // //     path: '/Referrals', 
// // //     name: 'Referrals', 
// // //     keywords: ['refer', 'recommendation', 'referral']
// // //   },
// // //   { 
// // //     path: '/support', 
// // //     name: 'Support', 
// // //     keywords: ['help', 'support', 'assistance']
// // //   }
// // // ];

// // // const GlobalSearch = ({ onClose }) => {
// // //   const [searchTerm, setSearchTerm] = useState('');
// // //   const [searchResults, setSearchResults] = useState([]);
// // //   const navigate = useNavigate();

// // //   // Keyboard shortcut handler
// // //   useEffect(() => {
// // //     const handleKeyDown = (e) => {
// // //       // Ctrl + K to open search
// // //       if (e.ctrlKey && e.key === 'k') {
// // //         e.preventDefault();
// // //       }
// // //       // Escape to close search
// // //       if (e.key === 'Escape') {
// // //         onClose();
// // //       }
// // //     };

// // //     window.addEventListener('keydown', handleKeyDown);
// // //     return () => {
// // //       window.removeEventListener('keydown', handleKeyDown);
// // //     };
// // //   }, [onClose]);

// // //   const performSearch = useCallback((term) => {
// // //     if (!term) {
// // //       setSearchResults([]);
// // //       return;
// // //     }

// // //     const lowercaseTerm = term.toLowerCase();
// // //     const results = SEARCHABLE_ROUTES.filter(route => 
// // //       route.name.toLowerCase().includes(lowercaseTerm) ||
// // //       route.keywords.some(keyword => keyword.includes(lowercaseTerm))
// // //     );

// // //     setSearchResults(results);
// // //   }, []);

// // //   useEffect(() => {
// // //     performSearch(searchTerm);
// // //   }, [searchTerm, performSearch]);

// // //   const handleSearchSelect = (path) => {
// // //     navigate(path);
// // //     onClose();
// // //   };

// // //   return (
// // //     <div 
// // //       className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center"
// // //       onClick={onClose}
// // //     >
// // //       <div 
// // //         className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
// // //         onClick={(e) => e.stopPropagation()}
// // //       >
// // //         {/* Search Input */}
// // //         <div className="flex items-center p-4 border-b">
// // //           <Search className="text-gray-400 mr-3" size={20} />
// // //           <input 
// // //             type="text"
// // //             placeholder="Search anything in the app..."
// // //             className="flex-1 outline-none text-lg"
// // //             value={searchTerm}
// // //             onChange={(e) => setSearchTerm(e.target.value)}
// // //             autoFocus
// // //           />
// // //           <button 
// // //             onClick={onClose}
// // //             className="ml-3 hover:bg-gray-100 rounded-full p-2"
// // //           >
// // //             <X size={20} className="text-gray-500" />
// // //           </button>
// // //         </div>

// // //         {/* Search Results */}
// // //         <div className="max-h-[400px] overflow-y-auto">
// // //           {searchResults.length > 0 ? (
// // //             <ul>
// // //               {searchResults.map((result) => (
// // //                 <li 
// // //                   key={result.path}
// // //                   className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
// // //                   onClick={() => handleSearchSelect(result.path)}
// // //                 >
// // //                   <div className="flex items-center">
// // //                     <span className="font-medium text-gray-700">{result.name}</span>
// // //                     <span className="ml-auto text-gray-500 text-sm">{result.path}</span>
// // //                   </div>
// // //                 </li>
// // //               ))}
// // //             </ul>
// // //           ) : searchTerm ? (
// // //             <div className="p-4 text-center text-gray-500">
// // //               No results found
// // //             </div>
// // //           ) : (
// // //             <div className="p-4 text-center text-gray-500">
// // //               Start typing to search
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default GlobalSearch;

// // import React, { useState, useEffect, useCallback, useRef } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { Search, X } from 'lucide-react';

// // // Define comprehensive searchable routes
// // const SEARCHABLE_ROUTES = [
// //   // Dashboard
// //   { 
// //     path: '/', 
// //     name: 'Dashboard', 
// //     parent: 'Navigation',
// //     icon: '📊',
// //     keywords: ['home', 'main', 'overview']
// //   },
  
// //   // Flat Management
// //   { 
// //     path: '/flatmain', 
// //     name: 'Flat Management', 
// //     parent: 'Flat',
// //     icon: '🏢',
// //     keywords: ['flat', 'property', 'apartment', 'housing']
// //   },
  
// //   // Bookings
// //   { 
// //     path: '/Booking', 
// //     name: 'Bookings', 
// //     parent: 'Bookings',
// //     icon: '📅',
// //     keywords: ['book', 'reservation', 'schedule']
// //   },
// //   { 
// //     path: '/booking1', 
// //     name: 'Add Bookings', 
// //     parent: 'Bookings',
// //     icon: '➕',
// //     keywords: ['new booking', 'create booking']
// //   },
  
// //   // Visitors
// //   { 
// //     path: '/Guest', 
// //     name: 'Guest', 
// //     parent: 'Visitors',
// //     icon: '👥',
// //     keywords: ['visitor', 'guest', 'temporary']
// //   },
// //   { 
// //     path: '/Helper', 
// //     name: 'Helper', 
// //     parent: 'Visitors',
// //     icon: '🤝',
// //     keywords: ['assist', 'helper', 'support']
// //   },
// //   { 
// //     path: '/Delivery', 
// //     name: 'Delivery', 
// //     parent: 'Visitors',
// //     icon: '📦',
// //     keywords: ['package', 'courier']
// //   },
// //   { 
// //     path: '/Cab', 
// //     name: 'Cab', 
// //     parent: 'Visitors',
// //     icon: '🚕',
// //     keywords: ['taxi', 'transport']
// //   },
  
// //   // Notices
// //   { 
// //     path: '/Notices', 
// //     name: 'Notices', 
// //     parent: 'Notices',
// //     icon: '📢',
// //     keywords: ['announcement', 'notice', 'communication']
// //   },
// //   { 
// //     path: '/Noticeform', 
// //     name: 'Add Notices', 
// //     parent: 'Notices',
// //     icon: '➕',
// //     keywords: ['new notice', 'create notice']
// //   },
  
// //   // Other sections
// //   { 
// //     path: '/Parcels', 
// //     name: 'Parcels', 
// //     parent: 'Logistics',
// //     icon: '📮',
// //     keywords: ['package', 'delivery', 'parcel']
// //   },
// //   { 
// //     path: '/sosHistory', 
// //     name: 'SOS History', 
// //     parent: 'Emergency',
// //     icon: '🚨',
// //     keywords: ['emergency', 'sos', 'alert']
// //   },
// //   { 
// //     path: '/feedback', 
// //     name: 'Feedback', 
// //     parent: 'Communication',
// //     icon: '💬',
// //     keywords: ['comment', 'review', 'feedback']
// //   }
// // ];

// // const GlobalSearchDropdown = () => {
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [searchResults, setSearchResults] = useState([]);
// //   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
// //   const searchContainerRef = useRef(null);
// //   const navigate = useNavigate();

// //   // Click outside handler
// //   useEffect(() => {
// //     const handleClickOutside = (event) => {
// //       if (searchContainerRef.current && 
// //           !searchContainerRef.current.contains(event.target)) {
// //         setIsDropdownOpen(false);
// //       }
// //     };

// //     document.addEventListener('mousedown', handleClickOutside);
// //     return () => {
// //       document.removeEventListener('mousedown', handleClickOutside);
// //     };
// //   }, []);

// //   // Keyboard shortcut handler
// //   useEffect(() => {
// //     const handleKeyDown = (e) => {
// //       // Ctrl + K to focus search
// //       if (e.ctrlKey && e.key === 'k') {
// //         e.preventDefault();
// //         const searchInput = document.getElementById('global-search-input');
// //         if (searchInput) {
// //           searchInput.focus();
// //           setIsDropdownOpen(true);
// //         }
// //       }
// //     };

// //     window.addEventListener('keydown', handleKeyDown);
// //     return () => {
// //       window.removeEventListener('keydown', handleKeyDown);
// //     };
// //   }, []);

// //   const performSearch = useCallback((term) => {
// //     if (!term) {
// //       setSearchResults([]);
// //       return;
// //     }

// //     const lowercaseTerm = term.toLowerCase();
// //     const results = SEARCHABLE_ROUTES.filter(route => 
// //       route.name.toLowerCase().includes(lowercaseTerm) ||
// //       route.keywords.some(keyword => keyword.includes(lowercaseTerm)) ||
// //       route.parent.toLowerCase().includes(lowercaseTerm)
// //     );

// //     setSearchResults(results);
// //     setIsDropdownOpen(true);
// //   }, []);

// //   const handleSearchChange = (e) => {
// //     const value = e.target.value;
// //     setSearchTerm(value);
// //     performSearch(value);
// //   };

// //   const handleSearchSelect = (path) => {
// //     navigate(path);
// //     setIsDropdownOpen(false);
// //     setSearchTerm('');
// //   };

// //   return (
// //     <div 
// //       ref={searchContainerRef} 
// //       className="relative flex-1 max-w-4xl transition-all duration-300 ease-in-out"
// //       style={{ fontFamily: "Plus_Jakarta" }}
// //     >
// //       <div className="relative w-full">
// //         <Search 
// //           className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
// //           size={20} 
// //         />
// //         <input
// //           id="global-search-input"
// //           type="search"
// //           placeholder="Search"
// //           className="w-full pl-10 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //           value={searchTerm}
// //           onChange={handleSearchChange}
// //           onFocus={() => searchTerm && performSearch(searchTerm)}
// //         />
// //         <div className="absolute right-3 top-1/2 -translate-y-1/2">
// //           <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-400 rounded">
// //             ctrl + k
// //           </kbd>
// //         </div>
// //       </div>

// //       {/* Dropdown Results */}
// //       {isDropdownOpen && searchResults.length > 0 && (
// //         <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[300px] overflow-y-auto">
// //           <ul>
// //             {searchResults.map((result) => (
// //               <li 
// //                 key={result.path}
// //                 className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center"
// //                 onClick={() => handleSearchSelect(result.path)}
// //               >
// //                 <span className="mr-3">{result.icon}</span>
// //                 <div>
// //                   <span className="font-medium text-gray-800">{result.name}</span>
// //                   <p className="text-sm text-gray-500">{result.parent}</p>
// //                 </div>
// //               </li>
// //             ))}
// //           </ul>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default GlobalSearchDropdown;
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Search, X, ChevronRight } from 'lucide-react';

// // Define comprehensive searchable routes with categories
// const SEARCHABLE_ROUTES = [
//   // Navigation Section
//   { 
//     category: 'Navigation',
//     items: [
//       { 
//         path: '/', 
//         name: 'Dashboard', 
//         icon: '📊',
//         keywords: ['home', 'main', 'overview']
//       }
//     ]
//   },
  
//   // Flat Management Section
//   { 
//     category: 'Flat Management',
//     items: [
//       { 
//         path: '/flatmain', 
//         name: 'Flat Management', 
//         icon: '🏢',
//         keywords: ['flat', 'property', 'apartment', 'housing']
//       },
//       { 
//         path: '/FlatNoform', 
//         name: 'Add Flat', 
//         icon: '➕',
//         keywords: ['new flat', 'create flat']
//       }
//     ]
//   },
  
//   // Bookings Section
//   { 
//     category: 'Bookings',
//     items: [
//       { 
//         path: '/Booking', 
//         name: 'Bookings', 
//         icon: '📅',
//         keywords: ['book', 'reservation', 'schedule']
//       },
//       { 
//         path: '/booking1', 
//         name: 'Add Bookings', 
//         icon: '➕',
//         keywords: ['new booking', 'create booking']
//       }
//     ]
//   },
  
//   // Visitors Section
//   { 
//     category: 'Visitors',
//     items: [
//       { 
//         path: '/Guest', 
//         name: 'Guest', 
//         icon: '👥',
//         keywords: ['visitor', 'guest', 'temporary']
//       },
//       { 
//         path: '/Helper', 
//         name: 'Helper', 
//         icon: '🤝',
//         keywords: ['assist', 'helper', 'support']
//       },
//       { 
//         path: '/Delivery', 
//         name: 'Delivery', 
//         icon: '📦',
//         keywords: ['package', 'courier']
//       },
//       { 
//         path: '/Cab', 
//         name: 'Cab', 
//         icon: '🚕',
//         keywords: ['taxi', 'transport']
//       }
//     ]
//   },
  
//   // Notices Section
//   { 
//     category: 'Notices',
//     items: [
//       { 
//         path: '/Notices', 
//         name: 'Notices', 
//         icon: '📢',
//         keywords: ['announcement', 'notice', 'communication']
//       },
//       { 
//         path: '/Noticeform', 
//         name: 'Add Notices', 
//         icon: '➕',
//         keywords: ['new notice', 'create notice']
//       }
//     ]
//   },
  
//   // Other Important Sections
//   { 
//     category: 'Quick Access',
//     items: [
//       { 
//         path: '/Parcels', 
//         name: 'Parcels', 
//         icon: '📮',
//         keywords: ['package', 'delivery', 'parcel']
//       },
//       { 
//         path: '/sosHistory', 
//         name: 'SOS History', 
//         icon: '🚨',
//         keywords: ['emergency', 'sos', 'alert']
//       },
//       { 
//         path: '/feedback', 
//         name: 'Feedback', 
//         icon: '💬',
//         keywords: ['comment', 'review', 'feedback']
//       },
//       { 
//         path: '/special_request', 
//         name: 'Special Request', 
//         icon: '✉️',
//         keywords: ['special request', 'custom']
//       }
//     ]
//   }
// ];

// const GlobalSearchDropdown = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const searchContainerRef = useRef(null);
//   const navigate = useNavigate();

//   // Click outside handler
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (searchContainerRef.current && 
//           !searchContainerRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // Keyboard shortcut handler
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       // Ctrl + K to focus search
//       if (e.ctrlKey && e.key === 'k') {
//         e.preventDefault();
//         const searchInput = document.getElementById('global-search-input');
//         if (searchInput) {
//           searchInput.focus();
//           setIsDropdownOpen(true);
//         }
//       }
//       // Escape to close search
//       if (e.key === 'Escape') {
//         setIsDropdownOpen(false);
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//     };
//   }, []);

//   const performSearch = useCallback((term) => {
//     if (!term) {
//       setSearchResults([]);
//       return;
//     }

//     const lowercaseTerm = term.toLowerCase();
//     const results = SEARCHABLE_ROUTES.map(category => ({
//       ...category,
//       items: category.items.filter(route => 
//         route.name.toLowerCase().includes(lowercaseTerm) ||
//         route.keywords.some(keyword => keyword.includes(lowercaseTerm))
//       )
//     })).filter(category => category.items.length > 0);

//     setSearchResults(results);
//     setIsDropdownOpen(true);
//   }, []);

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);
//     performSearch(value);
//   };

//   const handleSearchSelect = (path) => {
//     navigate(path);
//     setIsDropdownOpen(false);
//     setSearchTerm('');
//   };

//   return (
//     <div 
//       ref={searchContainerRef} 
//       className="relative flex-1 max-w-4xl transition-all duration-300 ease-in-out"
//       style={{ fontFamily: "Plus_Jakarta" }}
//     >
//       <div className="relative w-full">
//         <Search 
//           className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
//           size={20} 
//         />
//         <input
//           id="global-search-input"
//           type="search"
//           placeholder="Search"
//           className="w-full pl-10 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
//           value={searchTerm}
//           onChange={handleSearchChange}
//           onFocus={() => searchTerm && performSearch(searchTerm)}
//         />
//         <div className="absolute right-3 top-1/2 -translate-y-1/2">
//           <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-400 rounded">
//             ctrl + k
//           </kbd>
//         </div>
//       </div>

//       {/* Dropdown Results */}
//       {isDropdownOpen && searchResults.length > 0 && (
//         <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-2xl max-h-[500px] overflow-y-auto">
//           {searchResults.map((category, categoryIndex) => (
//             <div key={categoryIndex} className="border-b last:border-b-0 border-gray-100">
//               <div className="px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                 {category.category}
//               </div>
//               <ul>
//                 {category.items.map((result, index) => (
//                   <li 
//                     key={index}
//                     className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center justify-between group"
//                     onClick={() => handleSearchSelect(result.path)}
//                   >
//                     <div className="flex items-center">
//                       <span className="mr-3 text-xl">{result.icon}</span>
//                       <div>
//                         <span className="font-medium text-gray-800 group-hover:text-blue-600">
//                           {result.name}
//                         </span>
//                       </div>
//                     </div>
//                     <ChevronRight 
//                       size={20} 
//                       className="text-gray-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all"
//                     />
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default GlobalSearchDropdown;


import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronRight } from 'lucide-react';
import SEARCHABLE_ROUTES from './Searchable_Routes';


const GlobalSearchDropdown = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && 
          !searchContainerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + K to focus search
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          setIsDropdownOpen(true);
        }
      }
      // Escape to close search
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const performSearch = useCallback((term) => {
    if (!term) {
      setSearchResults([]);
      return;
    }

    const lowercaseTerm = term.toLowerCase();
    const results = SEARCHABLE_ROUTES.map(category => ({
      ...category,
      items: category.items.filter(route => 
        route.name.toLowerCase().includes(lowercaseTerm) ||
        route.breadcrumb.some(bc => bc.toLowerCase().includes(lowercaseTerm))
      )
    })).filter(category => category.items.length > 0);

    setSearchResults(results);
    setIsDropdownOpen(true);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    performSearch(value);
  };

  const handleSearchSelect = (path) => {
    navigate(path);
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  return (
    <div 
      ref={searchContainerRef} 
      className="relative flex-1 max-w-4xl transition-all duration-300 ease-in-out"
      style={{ fontFamily: "Plus_Jakarta" }}
    >
      <div className="relative w-full">
        <Search 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
          size={20} 
        />
        <input
          ref={searchInputRef}
          id="global-search-input"
          type="search"
          placeholder="Search"
          className="w-full pl-10 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-base"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => searchTerm && performSearch(searchTerm)}
        />
        {searchTerm && (
          <button 
            onClick={() => {
              setSearchTerm('');
              setSearchResults([]);
              setIsDropdownOpen(false);
            }}
            style={{cursor: 'pointer'}}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {/* <X size={14} /> */}
          </button>
        )}
        {!searchTerm && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <kbd 
            
            className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-400 rounded">
              ctrl + k
            </kbd>
          </div>
        )}
      </div>

      {/* Dropdown Results */}
      {isDropdownOpen && searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-2xl max-h-[500px] overflow-y-auto">
          {searchResults.map((category, categoryIndex) => (
            <div key={categoryIndex} className="border-b last:border-b-0 border-gray-100">
              <div className="px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {category.category}
              </div>
              <ul>
                {category.items.map((result, index) => (
                  <li 
                    key={index}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer group"
                    onClick={() => handleSearchSelect(result.path)}
                  >
                    {/* <div className="flex items-center justify-between">
                      <div>
                        <div className='flex'>

                        
                      <span className="mr-3 w-6 h-6 bg-blue-50 rounded flex items-center justify-center">
                              <result.icon size={16} weight="regular" />
                            </span>
                        <span className="font-medium text-gray-800 group-hover:text-blue-600">
                          {result.name}
                        </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                          {result.breadcrumb.map((bc, bcIndex) => (
                            <React.Fragment key={bc}>
                              {bcIndex > 0 && (
                                <ChevronRight 
                                  size={12} 
                                  className="mx-1 text-gray-400" 
                                />
                              )}
                              <span>{bc}</span>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                      <ChevronRight 
                        size={20} 
                        className="text-gray-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all" 
                      />
                    </div> */}
                     <div className="flex items-center">
                        <div className="flex-grow">
                          <div className="flex items-center">
                            <span className="mr-3 w-6 h-6 mt-1  rounded flex items-center justify-center">
                              <result.icon size={16} className="text-gray-500"  color="gray"/>
                            </span>
                            <span className="font-medium text-gray-800">
                              {result.name}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 ml-9">
                            {result.breadcrumb.join(' → ')}
                          </div>
                        </div>
                        <ChevronRight 
                        size={20} 
                        className="text-gray-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all" 
                      />
                      </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GlobalSearchDropdown;