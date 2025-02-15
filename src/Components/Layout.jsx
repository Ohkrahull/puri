// // import React from 'react';
// // import { Outlet } from 'react-router-dom';
// // import SideBar from './SideBar';
// // import styles from './CustomScrollbar.module.css';

// // const Layout = () => {
// //   return (
// //     <div className="flex h-screen overflow-hidden font-plus-jakarta" style={{ fontFamily: "Plus_Jakarta", background: 'var(--Gray-25, #F9FAFB)' }}>
// //       {/* Left Sidebar (320px) */}
// //       <div className="w-[320px] overflow-y-auto">
// //         <SideBar />
// //       </div>

// //       {/* Main Content Area */}
// //       <div className="flex-1 overflow-x-hidden overflow-y-auto">
// //         <Outlet />
// //       </div>
// //     </div>
// //   );
// // };

// // export default Layout;

// // import React from 'react';
// // import { Outlet, Link } from 'react-router-dom';
// // import { Search, BellRing, HelpCircle, ChevronDown } from 'lucide-react';
// // import SideBar from './SideBar';
// // import styles from './CustomScrollbar.module.css';
// // import { useAuth } from '../context/AuthContext';
// // import Logo from "../Images/logo.png";
// // import dashImag from '../Images/image 2.svg';

// // const Layout = () => {
// //   const { user } = useAuth();

// //   return (
// //     <div className="flex h-screen bg-[#F9FAFB] overflow-hidden font-plus-jakarta">
// //       {/* Sidebar */}
// //       <div className="w-[320px] overflow-y-auto">
// //         <SideBar />
// //       </div>

// //       {/* Main Content Area */}
// //       <div className="flex-1 flex flex-col overflow-hidden">
// //         {/* Header */}
// //         <header className="bg-white border-b border-gray-100 h-[72px] flex items-center">
// //           <div className="px-6 w-full">
// //             <div className="flex items-center justify-between gap-4">
// //               {/* Logo Section */}
// //               <div className="flex items-center gap-2">
// //                 <Link to="/" className="flex items-center">
// //                   <img src={Logo} alt="Logo" className="h-14 w-14" />
// //                   <img src={dashImag} alt="Dash" className="h-14 w-14" />
// //                 </Link>
// //               </div>

// //               {/* Search Bar */}
// //               <div className="flex-1 max-w-3xl">
// //                 <div className="relative">
// //                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
// //                   <input
// //                     type="search"
// //                     placeholder="Search"
// //                     className="w-full h-10 pl-10 pr-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-300 text-sm"
// //                   />
// //                   <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-semibold text-gray-400 bg-gray-100 rounded">
// //                     ctrl + k
// //                   </kbd>
// //                 </div>
// //               </div>

// //               {/* Right Section */}
// //               <div className="flex items-center gap-6">
// //                 {/* Help Icon */}
// //                 <button className="p-2 hover:bg-gray-50 rounded-full">
// //                   <HelpCircle className="h-5 w-5 text-gray-600" />
// //                 </button>

// //                 {/* Notification Icon */}
// //                 <button className="p-2 hover:bg-gray-50 rounded-full relative">
// //                   <BellRing className="h-5 w-5 text-gray-600" />
// //                   <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
// //                 </button>

// //                 {/* Profile Section */}
// //                 <div className="flex items-center gap-2 cursor-pointer group">
// //                   <div className="flex items-center gap-2">
// //                     <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
// //                       <span className="text-white text-sm font-medium">
// //                         {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
// //                       </span>
// //                     </div>
// //                     <div className="hidden md:block text-left">
// //                       <p className="text-sm font-medium text-gray-700 line-clamp-1">
// //                         {user?.firstName} {user?.lastName}
// //                       </p>
// //                       <p className="text-xs text-gray-500">
// //                         {user?.roles?.admin ? 'Admin' : 
// //                          user?.roles?.booking ? 'Booking Manager' : 
// //                          user?.roles?.documents ? 'Legal Documents' : 
// //                          user?.roles?.constructionUpdate ? 'Construction Update' : 
// //                          'No Role'}
// //                       </p>
// //                     </div>
// //                     <ChevronDown className="h-4 w-4 text-gray-500" />
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </header>

// //         {/* Main Content */}
// //         <div className={`flex-1 overflow-y-auto ${styles.customScrollbar}`}>
// //           <Outlet />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Layout;
// // Layout.jsx


// // import React from 'react';
// // import { Outlet, Link } from 'react-router-dom';
// // import { Search, BellRing, HelpCircle, ChevronDown, Menu } from 'lucide-react';
// // import SideBar from './SideBar';
// // import styles from './CustomScrollbar.module.css';
// // import { useAuth } from '../context/AuthContext';
// // import Logo from "../Images/logo.png";
// // import dashImag from '../Images/image 2.svg';

// // const Layout = () => {
// //   const { user } = useAuth();
// //   const [sidebarOpen, setSidebarOpen] = React.useState(false);

// //   return (
// //     <div className="flex h-screen bg-[#F9FAFB] overflow-hidden font-plus-jakarta">
// //       {/* Sidebar */}
// //       <div className="w-[320px] overflow-y-auto fixed h-full left-0 top-0 z-30 transform -translate-x-full sm:translate-x-0 transition-transform duration-300 ease-in-out">
// //         <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
// //       </div>

// //       {/* Main Content Area */}
// //       <div className="flex-1 flex flex-col overflow-hidden sm:ml-[320px]">
// //         {/* Header */}
// //         <header className="bg-white border-b border-gray-100 h-[72px] flex items-center px-4">
// //           <div className="w-full flex items-center justify-between gap-4">
// //             {/* Left section with menu and logo */}
// //             <div className="flex items-center gap-4">
// //               <button
// //                 onClick={() => setSidebarOpen(!sidebarOpen)}
// //                 className="p-2 rounded-lg hover:bg-gray-100 sm:hidden"
// //               >
// //                 <Menu className="h-6 w-6 text-gray-500" />
// //               </button>
// //               <Link to="/" className="flex items-center gap-2">
// //                 <img src={Logo} alt="Logo" className="h-14 w-14" />
// //                 <img src={dashImag} alt="Dash" className="h-14 w-14" />
// //               </Link>
// //             </div>

// //             {/* Search Bar */}
// //             <div className="flex-1 max-w-3xl px-4">
// //               <div className="relative">
// //                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
// //                 <input
// //                   type="search"
// //                   placeholder="Search"
// //                   className="w-full h-10 pl-10 pr-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-300 text-sm"
// //                 />
// //                 <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-semibold text-gray-400 bg-gray-100 rounded">
// //                   ctrl + k
// //                 </kbd>
// //               </div>
// //             </div>

// //             {/* Right Section */}
// //             <div className="flex items-center gap-4">
// //               <button className="p-2 hover:bg-gray-50 rounded-full">
// //                 <HelpCircle className="h-5 w-5 text-gray-600" />
// //               </button>

// //               <button className="p-2 hover:bg-gray-50 rounded-full relative">
// //                 <BellRing className="h-5 w-5 text-gray-600" />
// //                 <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
// //               </button>

// //               <div className="flex items-center gap-2 cursor-pointer">
// //                 <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
// //                   <span className="text-white text-sm font-medium">
// //                     {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
// //                   </span>
// //                 </div>
// //                 <div className="hidden md:block text-left">
// //                   <p className="text-sm font-medium text-gray-700">
// //                     {user?.firstName} {user?.lastName}
// //                   </p>
// //                   <p className="text-xs text-gray-500">Admin</p>
// //                 </div>
// //                 <ChevronDown className="h-4 w-4 text-gray-500" />
// //               </div>
// //             </div>
// //           </div>
// //         </header>

// //         {/* Main Content */}
// //         <div className={`flex-1 overflow-y-auto ${styles.customScrollbar}`}>
// //           <Outlet />
// //         </div>
// //       </div>

// //       {/* Mobile Sidebar Overlay */}
// //       {sidebarOpen && (
// //         <div 
// //           className="fixed inset-0 bg-black bg-opacity-50 z-20 sm:hidden"
// //           onClick={() => setSidebarOpen(false)}
// //         />
// //       )}
// //     </div>
// //   );
// // };

// // export default Layout;
// import React, { useState } from 'react';
// import { Outlet } from 'react-router-dom';
// // import Header from './Header';
// import SideBar from './SideBar';
// import styles from './CustomScrollbar.module.css';
// import Header from './puriHeader';

// const Layout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="min-h-screen bg-[#F9FAFB]" style={{ fontFamily: "Plus_Jakarta" }}>
//       {/* Header - Full Width */}
//       <Header />
      
//       {/* Main Content with Sidebar */}
//       <div className="flex">
//         {/* Sidebar */}
//         <div className="fixed top-[72px] left-0">
//           <SideBar />
//         </div>

//         {/* Main Content Area */}
//         <div className="ml-[320px] flex-1 p-6">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Layout;

import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Search, BellRing, HelpCircle, ChevronDown, Save, Loader } from 'lucide-react';
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

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isFormEditing, formDirty, setFormDirty,startSave , endSave, headerData } = useHeader();
  const [visitorsOpen, setVisitorsOpen] = useState(false);
  const [rentalOpen, setRentalOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const isOnFlatNoForm = location.pathname === '/FlatNoForm';
  const [isSearchOpen, setIsSearchOpen] = useState(false);


  // Keyboard shortcut for search
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

  const isActive = (path) => {
    return location.pathname === path ? "bg-gray-100" : "";
  }

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

  const handleSave = async () => {
    console.log('Save triggered'); // Debug log
    const form = document.getElementById('owner-form');
    if (!form) {
      console.error('Form element not found');
      return;
    }
  
    startSave(); // Use context function
  
    const saveEvent = new CustomEvent('saveForm', {
      bubbles: true,
      detail: {
        successCallback: () => {
          endSave(true);
          setFormDirty(false);
          navigate('/flatmain');
        },
        errorCallback: () => {
          endSave(false);
          toast.error('Failed to save changes');
        },
        validationErrorCallback: () => {
          endSave(false);
        }
      }
    });
  
    form.dispatchEvent(saveEvent);
  };

  const handleDiscard = () => {
    if (window.confirm('Are you sure you want to discard changes? All unsaved changes will be lost.')) {
      setFormDirty(false);
      navigate('/flatmain');
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
    const isFormPath = isOnFlatNoForm || location.pathname.startsWith('/FlatNoForm/');
    const { getCurrentList, hasChanges, selectedUser, isAddingNew } = headerData;
  
    if (isFormPath && (isFormEditing || formDirty)) {
      return (
        <div className="flex-1 max-w-4xl transition-all duration-300 ease-in-out transform" style={{ fontFamily: "Plus_Jakarta" }}>
          <div className="relative w-full flex items-center gap-4 px-4 py-2 rounded-lg border border-gray-200 bg-gray-50">
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
                  <span>{selectedUser && !isAddingNew ? 'Updating...' : 'Submitting...'}</span>
                </div>
                ) : (
                  <span>{selectedUser && !isAddingNew ? 'Update' : 'Submit'}</span>
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
      // <div className="flex-1 max-w-4xl transition-all duration-300 ease-in-out" style={{ fontFamily: "Plus_Jakarta" }}>
      //   <div className="relative w-full">
      //     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      //     <input
      //       type="search"
      //       placeholder="Search"
      //       className="w-full pl-10 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300"
      //     />
      //     <div className="absolute right-3 top-1/2 -translate-y-1/2">
      //       <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-400 rounded">
      //         ctrl + k
      //       </kbd>
      //     </div>
      //   </div>
      // </div>
      // <div 
      //   className="flex-1 max-w-4xl transition-all duration-300 ease-in-out cursor-pointer" 
      //   style={{ fontFamily: "Plus_Jakarta" }}
      //   onClick={() => setIsSearchOpen(true)}
      // >
      //   <div className="relative w-full">
      //     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      //     <input
      //       type="search"
      //       placeholder="Search"
      //       className="w-full pl-10 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300"
            
      //     />
      //     <div className="absolute right-3 top-1/2 -translate-y-1/2">
      //       <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-400 rounded">
      //         ctrl + k
      //       </kbd>
      //     </div>
      //   </div>
      // </div>
      // <div>
      //   {isSearchOpen && (
      //   <GlobalSearch onClose={() => setIsSearchOpen(false)} />
      // )}
      // </div>
    );
  };
  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "Plus_Jakarta" }}>
     
     {/* Global Search Modal */}
     
     
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="h-[72px] px-6 flex items-center justify-between">
          <div className="flex items-center gap-5 ml-2">
            <Link to="/" className="flex items-center gap-5">
              <div className="flex items-center gap-3">
                <img src={Logo} alt="Puri Logo" className="h-13 w-13" />
                <img src={dashImag} alt="Dashboard" className="h-13 w-13 -ml-1" />
              </div>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-end gap-8 ml-16 mr-10">
            {renderSearchOrSave()}

            <div className="flex items-center gap-6">
              <button className="p-2 hover:bg-gray-50 rounded-full">
                <HelpCircle color='#4b5563' size={24}/>
              </button>

              <button 
  className="p-2 hover:bg-gray-50 rounded-full relative"
  onClick={() => setIsNotificationOpen(true)}
>
  <Bell size={24} />
  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
</button>

              <div className="h-8 border-l border-gray-200 mx-8"></div>

              {/* <div className="flex items-center gap-5 cursor-pointer">
                <div className="w-[36px] h-[36px] rounded-full bg-purple-500 flex items-center justify-center">
                  <span className="text-white text-sm">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-700 line-clamp-1">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div> */}
              <ProfileDropdown 
    user={user} 
    onLogout={() => {
      logout();
      navigate('/login');
    }} 
  />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        type="button"
        className="fixed top-20 left-4 inline-flex items-center p-2 mt-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 z-50"
      >
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
          <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`${styles.customScrollbar} fixed top-[72px] left-0 z-40 h-[calc(100vh-72px)] w-68 transition-transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } sm:translate-x-0 bg-white border-r border-gray-100`}>
        <div className={`${styles.customScrollbar} flex flex-col h-full px-2 py-6 overflow-y-auto`}>
          <nav className="flex-grow list-none">
            {/* Admin Dashboard */}
              {user?.roles?.admin && (
                <li>
                  <Link to='/' className={`flex items-center ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/')}`}>
                    <SquaresFour size={24} />
                    <span className="flex-1 ms-3 whitespace-nowrap text-[16px] font-medium leading-6 text-gray-500">Dashboard</span>
                  </Link>
                </li>
              )}

              {/* Flat Management */}
              <li>
                <Link to="/flatmain" className={`flex items-center ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/flatmain')}`}>
                  <Buildings size={24} />
                  <span className="ml-3 text-[16px] font-medium leading-6">Flat Management</span>
                </Link>
              </li>

              {/* User Requests */}
              <li>
                <Link to="/UserRequests" className={`flex items-center ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/UserRequests')}`}>
                  <UserCirclePlus size={24} />
                  <span className="ml-3 text-[16px] font-medium leading-6">User Requests</span>
                </Link>
              </li>

              {/* Facility */}
              <li>
                <Link to="/Facility" className={`flex items-center ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Facility')}`}>
                  <Buildings size={24} />
                  <span className="ml-3 text-[16px] font-medium leading-6">Facility</span>
                </Link>
              </li>

              {/* Bookings */}
              <li>
                <Link to="/Booking" className={`flex items-center ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Booking')}`}>
                  <CalendarDots size={24} />
                  <span className="ml-3 text-[16px] font-medium leading-6">Bookings</span>
                </Link>
              </li>

              {/* Visitors Section */}
              <li>
                <button
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

              {/* Parcels */}
              <li>
                <Link to="/Parcels" className={`flex items-center ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Parcels')}`}>
                  <Package size={24} />
                  <span className="ml-3 text-[16px] font-medium leading-6">Parcels</span>
                </Link>
              </li>

              {/* Notices */}
              <li>
                <Link to="/Notices" className={`flex items-center ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Notices')}`}>
                  <Megaphone size={24} />
                  <span className="ml-3 text-[16px] font-medium leading-6">Notices</span>
                </Link>
              </li>

              {/* SOS History */}
              <li>
                <Link to="/sosHistory" className={`flex items-center ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/sosHistory')}`}>
                  <Siren size={24} />
                  <span className="ml-3 text-[16px] font-medium leading-6">SOS History</span>
                </Link>
              </li>

              {/* Feedback */}
              <li>
                <Link to="/feedback" className={`flex items-center ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/feedback')}`}>
                  <ChatText size={24} />
                  <span className="ml-3 text-[16px] font-medium leading-6">Feedback</span>
                </Link>
              </li>

              {/* Special Request */}
              <li>
                <Link to="/special_request" className={`flex items-center ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/special_request')}`}>
                  <NotePencil size={24} />
                  <span className="ml-3 text-[16px] font-medium leading-6">Special Request</span>
                </Link>
              </li>

              {/* Rental Request Section */}
              <li>
                <button
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

              {/* Documents */}
              <li>
                <Link to="/document" className={`flex items-center ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/document')}`}>
                  <Files size={24} />
                  <span className="ml-3 text-[16px] font-medium leading-6">Documents</span>
                </Link>
              </li>

              {/* Construction Update */}
              <li>
                <Link to="/construction" className={`flex items-center ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/construction')}`}>
                  <ArrowsClockwise size={24} />
                  <span className="ml-3 text-[16px] font-medium leading-6">Construction Update</span>
                </Link>
              </li>

              {/* Users Section */}
              <li>
                <button
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

              {/* Referrals */}
              <li>
                <Link to="/Referrals" className={`flex items-center ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Referrals')}`}>
                  <Gift size={24} />
                  <span className="ml-3 text-[16px] font-medium leading-6">Referrals</span>
                </Link>
              </li>
              <li>
                <Link to="/support" className={`flex items-center ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/support')}`}>
                  {/* <Gift size={24} /> */}
                  <DownloadSimple size={24} />
                  <span className="ml-3 text-[16px] font-medium leading-6">Support</span>
                </Link>
              </li>

              {/* Support */}
              {/* <li>
                <Link to="/support" className={`flex items-center ml-2 p-3 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/support')}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2.25C10.0716 2.25 8.18657 2.82183 6.58319 3.89317C4.97982 4.96451 3.73013 6.48726 2.99218 8.26884C2.25422 10.0504 2.06114 12.0108 2.43735 13.9021C2.81355 15.7934 3.74215 17.5307 5.10571 18.8943C6.46928 20.2579 8.20656 21.1865 10.0979 21.5627C11.9892 21.9389 13.9496 21.7458 15.7312 21.0078C17.5127 20.2699 19.0355 19.0202 20.1068 17.4168C21.1782 15.8134 21.75 13.9284 21.75 12C21.7473 9.41498 20.7192 6.93661 18.8913 5.10872C17.0634 3.28084 14.585 2.25273 12 2.25ZM15.6656 14.6053C16.2083 13.8449 16.4999 12.9341 16.4999 12C16.4999 11.0659 16.2083 10.155 15.6656 9.39469L18.3375 6.72375C19.5732 8.20427 20.2501 10.0715 20.2501 12C20.2501 13.9285 19.5732 15.7957 18.3375 17.2762L15.6656 14.6053ZM9 12C9 11.4067 9.17595 10.8266 9.5056 10.3333C9.83524 9.83994 10.3038 9.45542 10.852 9.22836C11.4001 9.0013 12.0033 8.94189 12.5853 9.05764C13.1672 9.1734 13.7018 9.45912 14.1213 9.87868C14.5409 10.2 />
        
         </Link>
         </li> */}
        </nav>
        </div>
      </aside>

      <NotificationSidebar 
  isOpen={isNotificationOpen}
  onClose={() => setIsNotificationOpen(false)}
/>

      {/* Main Content */}
      <main className={`pt-[72px] transition-all duration-300 ${sidebarOpen ? 'sm:ml-64' : 'sm:ml-64 ml-0'}`} >
        <div className="p-6" style={{ fontFamily: "Plus_Jakarta" }}>
        <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;