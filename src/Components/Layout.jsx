import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Search, BellRing, HelpCircle, ChevronDown, Save, Loader, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHeader } from '../context/HeaderContext';
import Logo from "../Images/logo.png";
import dashImag from '../Images/image 2.svg';
import { ArrowsClockwise, Bell, DownloadSimple, WarningCircle } from 'phosphor-react';
import { Buildings, ChatText, Files, Gift, Megaphone, NotePencil, Package, SquaresFour, UserCircle, UserCirclePlus, UserList } from 'phosphor-react';
import { CalendarDots, Siren } from '@phosphor-icons/react';
import { ChevronUp } from 'lucide-react';
import styles from './CustomScrollbar.module.css';
import ProfileDropdown from './ProfileDropdown';
import NotificationSidebar from './NotificationSidebar';
import { toast } from 'react-toastify';
import GlobalSearch from './GlobalSearch';
import GlobalSearchDropdown from './GlobalSearch';
import { useNotifications } from '../context/NotificationContext'; // Import notification context
import NotificationBadge from './NotificationBadge';

// Add new CSS style for dropdown animations
const dropdownStyles = {
  container: {
    overflow: 'hidden'
  },
  content: {
    transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
    opacity: 1
  },
  hidden: {
    maxHeight: 0,
    opacity: 0,
    paddingTop: 0,
    paddingBottom: 0
  },
  visible: {
    maxHeight: '500px', // Adjust this to accommodate your largest dropdown
    opacity: 1
  }
};

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  // console.log("User Data", user);
  
  const { isFormEditing, formDirty, setFormDirty,startSave , endSave, headerData } = useHeader();
 
  const [isSaving, setIsSaving] = useState(false);
  // Use notification context
  const { unreadCount, toggleSidebar: toggleNotificationSidebar, isOpen: isNotificationSidebarOpen } = useNotifications();
  // const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const isOnFlatNoForm = location.pathname === '/FlatNoForm';
  
  const isHelperProfile = location.pathname.includes('/Helperprofile/'); // Match your exact path
const isUpdateMode = isHelperProfile && location.pathname.includes('/'); // Check if we're editing
  const isFormPath = isOnFlatNoForm || 
    location.pathname.startsWith('/FlatNoForm/') || 
    isHelperProfile;
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isTablet = windowWidth >= 540 && windowWidth < 768; // Define tablet range
const isMobile = windowWidth < 540;
const isTabletOrMobile = windowWidth < 600;
  // Get current path
  const currentPath = location.pathname;

  useEffect(() => {
    // Close sidebar when route changes (but only on mobile/tablet)
    if (isTabletOrMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [location.pathname]); // This will trigger when the path changes
  
  // References for dropdown content elements to measure heights
  const visitorsRef = useRef(null);
  const rentalRef = useRef(null);
  const userRef = useRef(null);

    // Automatically determine which dropdowns should be open based on the current path
    // const [visitorsOpen, setVisitorsOpen] = useState(
    //   currentPath.includes('/Guest') || 
    //   currentPath.includes('/Helper') || 
    //   currentPath.includes('/Delivery') || 
    //   currentPath.includes('/Cab') || 
    //   currentPath.includes('/Other')
    // );
    const [visitorsOpen, setVisitorsOpen] = useState(
      currentPath.includes('/Guest/') || 
      currentPath === '/Guest' ||
      currentPath.includes('/Helper') || 
      currentPath.includes('/Delivery') || 
      currentPath.includes('/Cab') || 
      currentPath.includes('/Other')
    );

    const [rentalOpen, setRentalOpen] = useState(
      currentPath.includes('/Owner') || 
      currentPath.includes('/Tenant')
    );

    // const [userOpen, setUserOpen] = useState(
    //   currentPath.includes('/Resident') || 
    //   currentPath.includes('/user') || 
    //   currentPath.includes('/GuestLogin') || 
    //   currentPath.includes('/AddGuard') || 
    //   currentPath.includes('/AddHelper')
    // );
    const [userOpen, setUserOpen] = useState(
      currentPath.includes('/Resident') || 
      currentPath === '/user' ||
      currentPath === '/GuestLogin' || // Exact match
      currentPath.includes('/AddGuard') || 
      currentPath.includes('/AddHelper')
    );

    // Update dropdown states when route changes
  useEffect(() => {
    setVisitorsOpen(
      // currentPath.includes('/Guest') || 
      // currentPath.includes('/Helper') || 
      // currentPath.includes('/Delivery') || 
      // currentPath.includes('/Cab') || 
      // currentPath.includes('/Other')
      currentPath === '/Guest' ||
    currentPath.includes('/Guest/') || 
    currentPath.includes('/Helper') || 
    currentPath.includes('/Delivery') || 
    currentPath.includes('/Cab') || 
    currentPath.includes('/Other')
    );
    
    setRentalOpen(
      currentPath.includes('/Owner') || 
      currentPath.includes('/Tenant')
    );
    
    setUserOpen(
      // currentPath.includes('/Resident') || 
      // currentPath.includes('/user') || 
      // currentPath.includes('/GuestLogin') || 
      // currentPath.includes('/AddGuard') || 
      // currentPath.includes('/AddHelper')
      currentPath.includes('/Resident') || 
    currentPath === '/user' ||
    currentPath === '/GuestLogin' || // Exact match
    currentPath.includes('/AddGuard') || 
    currentPath.includes('/AddHelper')
    );
  }, [currentPath]);

   // Determine if user has access to a specific feature
   const hasAccess = (featureName) => {
    // If user is admin, they have access to everything
    if (user?.roles?.admin) return true;
    
    // Otherwise, check if they have access to the specific feature
    return user?.roles?.[featureName] === true;
  };

  // Get first accessible route for the user
  const getFirstAccessibleRoute = () => {
    if (hasAccess('dashboard')) return '/';
    if (hasAccess('flatManagement')) return '/flatmain';
    if (hasAccess('userRequests')) return '/UserRequests';
    if (hasAccess('facility')) return '/Facility';
    if (hasAccess('bookings')) return '/Booking';
    if (hasAccess('visitors')) return '/Guest'; // First page in visitors section
    if (hasAccess('parcels')) return '/Parcels';
    if (hasAccess('notices')) return '/Notices';
    if (hasAccess('sosHistory')) return '/sosHistory';
    if (hasAccess('feedback')) return '/feedback';
    if (hasAccess('specialRequest')) return '/special_request';
    if (hasAccess('rentalRequest')) return '/Owner'; // First page in rental section
    if (hasAccess('documents')) return '/document';
    if (hasAccess('constructionUpdate')) return '/construction';
    if (hasAccess('users')) return '/Resident'; // First page in users section
    if (hasAccess('referrals')) return '/Referrals';
    if (hasAccess('support')) return '/support';
    
    // If no specific access, return a default route
    return '/'; // A dedicated page for users with no permissions
  };

   // Check if current path requires permissions, redirect if needed
   useEffect(() => {
    // Map of paths to their corresponding permission keys
    const pathPermissions = {
      '/': 'dashboard',
      '/flatmain': 'flatManagement',
      '/UserRequests': 'userRequests',
      '/Facility': 'facility',
      '/Booking': 'bookings',
      '/Guest': 'visitors',
      '/Helper': 'visitors',
      '/Delivery': 'visitors',
      '/Cab': 'visitors',
      '/Other': 'visitors',
      '/Parcels': 'parcels',
      '/Notices': 'notices',
      '/sosHistory': 'sosHistory',
      '/feedback': 'feedback',
      '/special_request': 'specialRequest',
      '/Owner': 'rentalRequest',
      '/Tenant': 'rentalRequest',
      '/document': 'documents',
      '/construction': 'constructionUpdate',
      '/Resident': 'users',
      '/user': 'users',
      '/GuestLogin': 'users',
      '/AddGuard': 'users',
      '/AddHelper': 'users',
      '/Referrals': 'referrals',
      '/support': 'support'
    };
    
    // Special case for home route
    if (currentPath === '/') {
      if (!hasAccess('dashboard')) {
        navigate(getFirstAccessibleRoute());
      }
      return;
    }
    
    // Find the base path for permission checking
    // This handles nested routes by checking the base path
    const basePath = Object.keys(pathPermissions).find(path => 
      currentPath === path || (currentPath.startsWith(path) && path !== '/')
    );
    
    if (basePath) {
      const requiredPermission = pathPermissions[basePath];
      if (!hasAccess(requiredPermission)) {
        // User doesn't have access, redirect to first accessible route
        navigate(getFirstAccessibleRoute());
      }
    }
  }, [currentPath, user, navigate]);

  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  

  // const isActive = (path) => {
  //   if (path === '/') {
  //     // For home path, only exact match
  //     return location.pathname === path ? "bg-gray-100" : "";
  //   }
    
  //   // For other paths, check if current path starts with this path
  //   return location.pathname.startsWith(path) ? "bg-gray-100" : "";
  // };
  const isActive = (path) => {
    if (path === '/') {
      // For home path, only exact match
      return location.pathname === path ? "bg-gray-100" : "";
    }
    
    // Special case for Guest vs GuestLogin to prevent conflicts
    if (path === '/Guest' && location.pathname.includes('/GuestLogin')) {
      return ""; // Don't highlight Guest when on GuestLogin
    }
    
    // For other paths, check if current path exactly matches or starts with this path + /
    return (location.pathname === path || 
           (location.pathname.startsWith(path + '/') && location.pathname !== '/GuestLogin')) 
           ? "bg-gray-100" : "";
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleVisitors = () => {
    setVisitorsOpen(!visitorsOpen);
  };
  
  const toggleRental = () => {
    setRentalOpen(!rentalOpen);
  };

  const toggleUser = () => {
    setUserOpen(!userOpen);
  };

   // Determine icon size based on screen width
   const getIconSize = () => {
    if (isMobile) {
      return 26; // Larger icon size for mobile
    }
    return 24; // Regular size for desktop
  };

  // const handleSave = async () => {
  //   console.log('Save triggered'); // Debug log
  //   const form = document.getElementById('owner-form');
  //   if (!form) {
  //     console.error('Form element not found');
  //     return;
  //   }
  
  //   startSave(); // Use context function
  
  //   const saveEvent = new CustomEvent('saveForm', {
  //     bubbles: true,
  //     detail: {
  //       successCallback: () => {
  //         endSave(true);
  //         setFormDirty(false);
  //         navigate('/flatmain');
  //       },
  //       errorCallback: () => {
  //         endSave(false);
  //         toast.error('Failed to save changes');
  //       },
  //       validationErrorCallback: () => {
  //         endSave(false);
  //       }
  //     }
  //   });
  
  //   form.dispatchEvent(saveEvent);
  // };

  const handleSave = async () => {
    const form = document.getElementById('owner-form');
    if (!form) {
      console.error('Form element not found');
      return;
    }

    setIsSaving(true);
    startSave();

    const saveEvent = new CustomEvent('saveForm', {
      bubbles: true,
      detail: {
        successCallback: () => {
          endSave(true);
          setFormDirty(false);
          setIsSaving(false);
          // Navigate based on current path
          if (isHelperProfile) {
            navigate('/AddHelper');
          } else {
            navigate('/flatmain');
          }
        },
        errorCallback: () => {
          endSave(false);
          setIsSaving(false);
          toast.error('Failed to save changes');
        },
        validationErrorCallback: () => {
          endSave(false);
          setIsSaving(false);
        }
      }
    });

    form.dispatchEvent(saveEvent);
  };

  
  const handleDiscard = () => {
    if (window.confirm('Are you sure you want to discard changes? All unsaved changes will be lost.')) {
      setFormDirty(false);
      // Navigate based on current path
      if (isHelperProfile) {
        navigate('/AddHelper');
      } else {
        navigate('/flatmain');
      }
    }
  };

  // const renderSearchOrSave = () => {
  //   const isFormPath = isOnFlatNoForm || location.pathname.startsWith('/FlatNoForm/');
  
  //   if (isFormPath && (isFormEditing || formDirty)) {
  //     return (
  //       <div className="flex-1 max-w-4xl transition-all duration-300 ease-in-out transform" style={{ fontFamily: "Plus_Jakarta" }}>
  //         <div className="relative w-full flex items-center gap-4 px-4 py-2 rounded-lg border border-gray-200 bg-gray-50">
  //           <WarningCircle size={24} className="text-gray-500" />
  //           <span className="text-[#333333] text-sm font-medium">Unsaved Changes</span>
  //           <div className="ml-auto flex items-center gap-3">
  //             <button 
  //               className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  //               onClick={handleDiscard}
  //               disabled={isSaving}
  //             >
  //               Discard
  //             </button>
  //             <button 
  //               className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm font-medium transition-colors flex items-center gap-2 min-w-[80px] justify-center disabled:opacity-50 disabled:cursor-not-allowed"
  //               onClick={handleSave}
  //               disabled={isSaving}
  //             >
  //               {isSaving ? (
  //                 <>
  //                   <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
  //                   Saving...
  //                 </>
  //               ) : 'Save'}
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   }
  
  //   return (
  //     <div className="flex-1 max-w-4xl transition-all duration-300 ease-in-out" style={{ fontFamily: "Plus_Jakarta" }}>
  //       <div className="relative w-full">
  //         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
  //         <input
  //           type="search"
  //           placeholder="Search"
  //           className="w-full pl-10 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300"
  //         />
  //         <div className="absolute right-3 top-1/2 -translate-y-1/2">
  //           <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-400 rounded">
  //             ctrl + k
  //           </kbd>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };
  const renderSearchOrSave = () => {
    // const isFormPath = isOnFlatNoForm || location.pathname.startsWith('/FlatNoForm/');
    const { getCurrentList, hasChanges, selectedUser, isAddingNew } = headerData;
    const isInUpdateMode = isUpdateMode || (selectedUser && !isAddingNew);
  
    if (isFormPath && (isFormEditing || formDirty)) {
      return (
        <div className="flex-1 max-w-5xl transition-all duration-300 ease-in-out transform" style={{ fontFamily: "Plus_Jakarta" }}>
          <div className="relative w-full flex items-center gap-4 px-4 py-3 rounded-lg border border-gray-200 bg-gray-50">
            <WarningCircle size={24} className="text-gray-500" />
            <span className="text-[#333333] text-sm font-medium">Unsaved Changes</span>
            <div className="ml-auto flex items-center gap-3">
              {/* Only show Discard button if there's an existing list or changes */}
              {(getCurrentList()?.length > 0 || hasChanges) && (
                <button 
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleDiscard}
                  disabled={isSaving}
                >
                  Discard
                </button>
              )}
              
              <button 
                className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm font-medium transition-colors flex items-center gap-2 min-w-[80px] justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  // <>
                  //   <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" color='white' />
                  //   {selectedUser && !isAddingNew ? 'Updating...' : 'Submitting...'}
                  // </>
                  <div className="flex items-center justify-center">
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                  <span>{isInUpdateMode ? 'Updating...' : 'Saving...'}</span>
                  {/* <span>{selectedUser && !isAddingNew ? 'Updating...' : 'Submitting...'}</span> */}
                </div>
                ) : (
                  <span>{isInUpdateMode ? 'Update' : 'Save'}</span>
                  // <span>{selectedUser && !isAddingNew ? 'Update' : 'Submit'}</span>
                  // selectedUser && !isAddingNew ? 'Update' : 'Submit'
                )}
              </button>
            </div>
          </div>
        </div>
      );
    }
  
    return (
      <GlobalSearchDropdown />
      
    );
  };

   // Render a dropdown section with animation
   const renderDropdownSection = (isOpen, toggleFunction, icon, title, children) => {
    return (
      <li>
        <button
          onClick={toggleFunction}
          className="flex items-center justify-between w-full ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <div className="flex items-center">
            {icon}
            <span className="ml-3 text-[16px] font-medium leading-6">{title}</span>
          </div>
          {isOpen ? (
            <ChevronUp size={20} className="text-gray-500 transition-transform duration-300" />
          ) : (
            <ChevronDown size={20} className="text-gray-500 transition-transform duration-300" />
          )}
        </button>
        <div style={{
          ...dropdownStyles.container,
          ...dropdownStyles.content,
          ...(isOpen ? dropdownStyles.visible : dropdownStyles.hidden)
        }}>
          {children}
        </div>
      </li>
    );
  };

const renderUserProfileInSidebar = () => {
  if (!user) return null;

  // Format user role label
  const userRoleLabel = user?.roles?.admin ? "Admin" : "Staff";

  // Format first name and last name
  const formatProperCase = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const firstName = formatProperCase(user?.firstName || '');
  const lastName = formatProperCase(user?.lastName || '');
  
  // Get first initials for the avatar
  const firstInitial = user?.firstName?.charAt(0)?.toUpperCase() || '';
  const lastInitial = user?.lastName?.charAt(0)?.toUpperCase() || '';

  return (
    <div className="mt-auto mb-4 px-4">
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center px-2 py-3">
          <div className="w-[40px] h-[40px] rounded-full bg-purple-500 flex items-center justify-center overflow-hidden">
            <span className="text-white text-lg font-medium flex items-center justify-center leading-none">
              {firstInitial}{lastInitial}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700 line-clamp-1">
              {firstName} {lastName}
            </p>
            <p className="text-xs text-gray-500">{userRoleLabel}</p>
          </div>
        </div>
        
        <button 
          onClick={() => {
            logout();
            toast.success("Logged out successfully");
            navigate('/login');
          }}
          className="mt-2 flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-lg"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "Plus_Jakarta" }}>
     
     {/* Global Search Modal */}
     
     
      {/* Header */}
      {/* <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="h-[72px] px-6 flex items-center justify-between">
          <div className="flex items-center gap-5 ml-2 mr-[80px]">
            <Link  to={getFirstAccessibleRoute()} className="flex items-center gap-5">
              <div className="flex items-center gap-3">
                <img src={Logo} alt="Puri Logo" className="h-13 w-13" />
                <img src={dashImag} alt="Dashboard" className="h-13 w-13 -ml-1" />
              </div>
            </Link>
          </div> */}
          <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="h-[72px] px-4 sm:px-5 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-5 ml-0 sm:ml-2 mr-2 sm:mr-[80px]">
            {/* <Link to={getFirstAccessibleRoute()} className="flex items-center gap-3 sm:gap-5">
              <div className="flex items-center gap-2 sm:gap-2">
                <img src={Logo} alt="Puri Logo" className="h-12 w-12 sm:h-16 sm:w-16" />
                <img src={dashImag} alt="Dashboard" className="h-12 w-12 sm:h-16 sm:w-16" />
              </div>
            </Link> */}
            <div className="flex items-center gap-3">
            {/* Mobile menu toggle button integrated with the logo */}
            {isTabletOrMobile  ? (
      <>
        <button
          onClick={toggleSidebar}
          type="button"
          className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
        
        {/* Logo on mobile */}
        <Link to={getFirstAccessibleRoute()} className="flex items-center gap-1">
          <img src={Logo} alt="Puri Logo" className="h-12 w-12" />
          {/* <img src={dashImag} alt="Dashboard" className="h-12 w-12" /> */}
        </Link>
      </>
    ) : (
      /* Desktop layout - full logo with both images */
      <Link to={getFirstAccessibleRoute()} className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="Puri Logo" className="h-14 w-14" />
          <img src={dashImag} alt="Dashboard" className="h-14 w-14" />
        </div>
      </Link>
    )}
          </div>
          </div>
        

          <div className="flex flex-1 items-center justify-end gap-2 lg:gap-8  ml-6 mr-0 sm:ml-8">
            {renderSearchOrSave()}

            <div className="flex items-center gap-2">
              
{/* <button 
                className="p-2 hover:bg-gray-50 rounded-full relative"
                onClick={toggleNotificationSidebar}
                aria-label="Notifications"
              >
                <Bell size={24} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button> */}

<NotificationBadge key={`notification-badge-${Date.now()}`} />


   {!isMobile && (
                <>
                  <div className="h-8 border-l border-gray-200 mx-2 sm:mx-8"></div>
                  <ProfileDropdown 
                    user={user} 
                    onLogout={() => {
                      logout();
                      navigate('/login');
                    }} 
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      
      <aside className={`${styles.customScrollbar} fixed top-[72px] left-0 z-40 h-[calc(100vh-72px)] min-w-[220px] transition-transform ${
  sidebarOpen ? 'translate-x-0' : '-translate-x-full'
} ${isTabletOrMobile ? '' : 'translate-x-0'} bg-white border-r border-gray-100`}>
        <div className={`${styles.customScrollbar} flex flex-col h-full px-2 py-6 overflow-y-auto`}>
          <nav className="flex-grow list-none">
            {/* Admin Dashboard */}
            {hasAccess('dashboard') && (
                <li>
                  <Link to='/' className={`flex items-center ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/')}`}>
                    <SquaresFour size={24} />
                    <span className="flex-1 ms-3 whitespace-nowrap text-[16px] font-medium leading-6 text-gray-500">Dashboard</span>
                  </Link>
                </li>
              )}

              {/* Flat Management */}
              {hasAccess('flatManagement') && (
              <li>
                <Link to="/flatmain" className={`flex items-center ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/flatmain')}`}>
                  <Buildings size={24} />
                  <span className="ml-3 text-[16px] font-medium leading-6">Flat Management</span>
                </Link>
              </li>
              )}

              {/* User Requests */}
              {hasAccess('userRequests') && (

              
              <li>
                <Link to="/UserRequests" className={`flex items-center ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/UserRequests')}`}>
                  <UserCirclePlus size={24} />
                  <span className="ml-3 text-[16px] font-medium leading-6">User Requests</span>
                </Link>
              </li>
              )}

              {/* Facility */}
              {hasAccess("facility") &&(

             
              <li>
                <Link to="/Facility" className={`flex items-center ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Facility')}`}>
                  <Buildings size={24} />
                  <span className="ml-3 text-[16px] font-medium leading-6">Facility</span>
                </Link>
              </li>
               )}

              {/* Bookings */}
              {hasAccess('bookings') && (
              <li>
                <Link to="/Booking" className={`flex items-center ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Booking')}`}>
                  <CalendarDots size={24} />
                  <span className="ml-3 text-[16px] font-medium leading-6">Bookings</span>
                </Link>
              </li>
              )}

{hasAccess('visitors') && renderDropdownSection(
              visitorsOpen,
              toggleVisitors,
              <UserList size={24} />,
              "Visitors",
              <ul className="pl-10 mt-2 space-y-2">
                <li>
                  <Link to="/Guest" className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Guest')}`}>
                    <span className="text-[14px] font-medium">Guest</span>
                  </Link>
                </li>
                <li>
                  <Link to="/Helper" className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Helper')}`}>
                    <span className="text-[14px] font-medium">Helper</span>
                  </Link>
                </li>
                <li>
                  <Link to="/Delivery" className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Delivery')}`}>
                    <span className="text-[14px] font-medium">Delivery</span>
                  </Link>
                </li>
                <li>
                  <Link to="/Cab" className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Cab')}`}>
                    <span className="text-[14px] font-medium">Cab</span>
                  </Link>
                </li>
                <li>
                  <Link to="/Other" className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Other')}`}>
                    <span className="text-[14px] font-medium">Other</span>
                  </Link>
                </li>
              </ul>
            )}
              {/* Visitors Section */}
              {/* {hasAccess('visitors') && (
              <li> */}
                 {/* <button
                  onClick={toggleVisitors}
                  className={`flex items-center justify-between w-full ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${
                    isActive('/Guest') || isActive('/Helper') || isActive('/Delivery') || isActive('/Cab') || isActive('/Other') ? "bg-gray-100" : ""
                  }`}
                > */}
                {/* <button
                  onClick={toggleVisitors}
                  className="flex items-center justify-between w-full ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100"
                >

                  <div className="flex items-center">
                    <UserList size={24} />
                    <span className="ml-3 text-[16px] font-medium leading-6">Visitors</span>
                  </div>
                  {visitorsOpen ? (
                    <ChevronUp size={20} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500" />
                  )}
                </button>
                {visitorsOpen && (
                  <ul className="pl-10 mt-2 space-y-2">
                    <li>
                      <Link to="/Guest" className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Guest')}`}>
                        <span className="text-[14px] font-medium">Guest</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/Helper" className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Helper')}`}>
                        <span className="text-[14px] font-medium">Helper</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/Delivery" className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Delivery')}`}>
                        <span className="text-[14px] font-medium">Delivery</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/Cab" className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Cab')}`}>
                        <span className="text-[14px] font-medium">Cab</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/Other" className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Other')}`}>
                        <span className="text-[14px] font-medium">Other</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              )} */}

              {/* Parcels */}
              {hasAccess('parcels') && (
              <li>
                <Link to="/Parcels" className={`flex items-center ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Parcels')}`}>
                  <Package size={24} />
                  <span className="ml-3 text-[16px] font-medium leading-6">Parcels</span>
                </Link>
              </li>

              )}
              {/* Notices */}
              {hasAccess('notices') && (
              <li>
                <Link to="/Notices" className={`flex items-center ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Notices')}`}>
                  <Megaphone size={24} />
                  <span className="ml-3 text-[16px] font-medium leading-6">Notices</span>
                </Link>
              </li>
              )}

              {/* SOS History */}
              {hasAccess('sosHistory') && (
              <li>
                <Link to="/sosHistory" className={`flex items-center ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/sosHistory')}`}>
                  <Siren size={24} />
                  <span className="ml-3 text-[16px] font-medium leading-6">SOS History</span>
                </Link>
              </li>
              )}

              {/* Feedback */}
              {hasAccess('feedback') && (
              <li>
                <Link to="/feedback" className={`flex items-center ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/feedback')}`}>
                  <ChatText size={24} />
                  <span className="ml-3 text-[16px] font-medium leading-6">Feedback</span>
                </Link>
              </li>
              )}

              {/* Special Request */}
              {hasAccess('specialRequest') && (
              <li>
                <Link to="/special_request" className={`flex items-center ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/special_request')}`}>
                  <NotePencil size={24} />
                  <span className="ml-3 text-[16px] font-medium leading-6">Special Request</span>
                </Link>
              </li>
              )}

              {/* Rental Request Section */}
              {/* {hasAccess('rentalRequest') && (
              <li> */}
                {/* <button
                  onClick={toggleRental}
                  className={`flex items-center justify-between w-full ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${
                    isActive('/Owner') || isActive('/Tenant') ? "bg-gray-100" : ""
                  }`}
                > */}
                {/* <button
                  onClick={toggleRental}
                  className="flex items-center justify-between w-full ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <NotePencil size={24} />
                    <span className="ml-3 text-[16px] font-medium leading-6">Rental Request</span>
                  </div>
                  {rentalOpen ? (
                    <ChevronUp size={20} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500" />
                  )}
                </button>
                {rentalOpen && (
                  <ul className="pl-10 mt-2 space-y-2">
                    <li>
                      <Link to="/Owner" className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Owner')}`}>
                        <span className="text-[14px] font-medium">Owner</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/Tenant" className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Tenant')}`}>
                        <span className="text-[14px] font-medium">Tenant</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              )} */}
               {/* Rental Request Section - With Animation */}
            {hasAccess('rentalRequest') && renderDropdownSection(
              rentalOpen,
              toggleRental,
              <NotePencil size={24} />,
              "Rental Request",
              <ul className="pl-10 mt-2 space-y-2">
                <li>
                  <Link to="/Owner" className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Owner')}`}>
                    <span className="text-[14px] font-medium">Owner</span>
                  </Link>
                </li>
                <li>
                  <Link to="/Tenant" className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Tenant')}`}>
                    <span className="text-[14px] font-medium">Tenant</span>
                  </Link>
                </li>
              </ul>
            )}

              {/* Documents */}
              {hasAccess('documents') && (
              <li>
                <Link to="/document" className={`flex items-center ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/document')}`}>
                  <Files size={24} />
                  <span className="ml-3 text-[16px] font-medium leading-6">Documents</span>
                </Link>
              </li>
              )}

              {/* Construction Update */}
              {hasAccess('constructionUpdate') && (
              <li>
                <Link to="/construction" className={`flex items-center ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/construction')}`}>
                  <ArrowsClockwise size={24} />
                  <span className="ml-3 text-[16px] font-medium leading-6">Construction Update</span>
                </Link>
              </li>
              )}

              {/* Users Section */}
              {/* {hasAccess('users') && (
              <li> */}
                {/* <button
                  onClick={toggleUser}
                  className={`flex items-center justify-between w-full ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${
                    isActive('/Resident') || isActive('/user') || isActive('/GuestLogin') || isActive('/AddGuard') || isActive('/AddHelper') ? "bg-gray-100" : ""
                  }`}
                > */}
                {/* <button
                  onClick={toggleUser}
                  className="flex items-center justify-between w-full ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <UserCircle size={24} />
                    <span className="ml-3 text-[16px] font-medium leading-6">Users</span>
                  </div>
                  {userOpen ? (
                    <ChevronUp size={20} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500" />
                  )}
                </button>
                {userOpen && (
                  <ul className="pl-10 mt-2 space-y-2">
                    <li>
                      <Link to="/Resident" className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Resident')}`}>
                        <span className="text-[14px] font-medium">Resident</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/user" className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/user')}`}>
                        <span className="text-[14px] font-medium">Staff</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/GuestLogin" className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/GuestLogin')}`}>
                        <span className="text-[14px] font-medium">Guest Login</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/AddGuard" className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/AddGuard')}`}>
                        <span className="text-[14px] font-medium">Guard</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/AddHelper" className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/AddHelper')}`}>
                        <span className="text-[14px] font-medium">Helper</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              )} */}
              {hasAccess('users') && renderDropdownSection(
              userOpen,
              toggleUser,
              <UserCircle size={24} />,
              "Users",
              <ul className="pl-10 mt-2 space-y-2">
                <li>
                  <Link to="/Resident" className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Resident')}`}>
                    <span className="text-[14px] font-medium">Resident</span>
                  </Link>
                </li>
                <li>
                  <Link to="/user" className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/user')}`}>
                    <span className="text-[14px] font-medium">Staff</span>
                  </Link>
                </li>
                <li>
                  <Link to="/GuestLogin" className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/GuestLogin')}`}>
                    <span className="text-[14px] font-medium">Guest Login</span>
                  </Link>
                </li>
                <li>
                  <Link to="/AddGuard" className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/AddGuard')}`}>
                    <span className="text-[14px] font-medium">Guard</span>
                  </Link>
                </li>
                <li>
                  <Link to="/AddHelper" className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/AddHelper')}`}>
                    <span className="text-[14px] font-medium">Helper</span>
                  </Link>
                </li>
              </ul>
            )}

              {/* Referrals */}
              {hasAccess('referrals') && (
              <li>
                <Link to="/Referrals" className={`flex items-center ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Referrals')}`}>
                  <Gift size={24} />
                  <span className="ml-3 text-[16px] font-medium leading-6">Referrals</span>
                </Link>
              </li>
              )}

{hasAccess('support') && (
              <li>
                <Link to="/support" className={`flex items-center ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/support')}`}>
                  {/* <Gift size={24} /> */}
                  <DownloadSimple size={24} />
                  <span className="ml-3 text-[16px] font-medium leading-6">Support</span>
                </Link>
              </li>
)}

{isMobile && renderUserProfileInSidebar()}
              
        </nav>
        </div>
      </aside>

      {/* <NotificationSidebar 
  isOpen={isNotificationOpen}
  onClose={() => setIsNotificationOpen(false)}
/> */}
 <NotificationSidebar />

      {/* Main Content */}
      {/* <main className={`pt-[72px] transition-all duration-300 ${sidebarOpen ? 'sm:ml-64' : 'sm:ml-64 ml-0'}`} >
        <div className="p-6" style={{ fontFamily: "Plus_Jakarta" }}>
        <Outlet />
        </div>
      </main> */}
      <main className={`pt-[72px] transition-all duration-300 ${
  sidebarOpen && isTabletOrMobile ? 'ml-0' : ''
} ${isTabletOrMobile ? 'ml-0' : 'ml-64'}`}>
  <div className="p-6" style={{ fontFamily: "Plus_Jakarta" }}>
    <Outlet />
  </div>
</main>
    </div>
  );
};

export default Layout;