// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   Search, 
//   BellRing, 
//   HelpCircle, 
//   ChevronDown,
//   Settings,
//   LogOut,
//   User
// } from 'lucide-react';

// const Header = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isNotificationOpen, setIsNotificationOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
  
//   const notificationRef = useRef(null);
//   const profileRef = useRef(null);

//   // Handle click outside to close dropdowns
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (notificationRef.current && !notificationRef.current.contains(event.target)) {
//         setIsNotificationOpen(false);
//       }
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         setIsProfileOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Keyboard shortcut for search
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.ctrlKey && e.key === 'k') {
//         e.preventDefault();
//         document.querySelector('input[type="search"]')?.focus();
//       }
//     };

//     document.addEventListener('keydown', handleKeyDown);
//     return () => document.removeEventListener('keydown', handleKeyDown);
//   }, []);

//   return (
//     <header className="w-full bg-white border-b border-gray-100">
//       <div className="px-4 py-2">
//         <div className="max-w-[120rem] mx-auto flex items-center justify-between gap-4">
//           {/* Logo */}
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-black text-white rounded flex items-center justify-center">
//               <img 
//                 src="/api/placeholder/40/40" 
//                 alt="Puri Logo"
//                 className="w-full h-full object-contain rounded"
//               />
//             </div>
//             <span className="text-xl font-semibold hidden sm:block">PURI</span>
//           </div>

//           {/* Search Bar */}
//           <div className="flex-1 max-w-3xl">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <input
//                 type="search"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search"
//                 className="w-full h-10 pl-10 pr-12 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-300 text-sm"
//               />
//               <div className="absolute right-3 top-1/2 -translate-y-1/2">
//                 <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-400 bg-gray-100 rounded">
//                   ctrl + k
//                 </kbd>
//               </div>
//             </div>
//           </div>

//           {/* Right Section */}
//           <div className="flex items-center gap-2 sm:gap-4">
//             {/* Help Button */}
//             <button className="p-2 hover:bg-gray-100 rounded-full">
//               <HelpCircle className="h-5 w-5 text-gray-600" />
//             </button>

//             {/* Notifications */}
//             <div className="relative" ref={notificationRef}>
//               <button 
//                 className="p-2 hover:bg-gray-100 rounded-full relative"
//                 onClick={() => setIsNotificationOpen(!isNotificationOpen)}
//               >
//                 <BellRing className="h-5 w-5 text-gray-600" />
//                 <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//               </button>
              
//               {isNotificationOpen && (
//                 <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
//                   <div className="px-4 py-2 border-b border-gray-100">
//                     <h3 className="font-semibold">Notifications</h3>
//                   </div>
//                   <div className="p-4 text-sm text-gray-500 text-center">
//                     No new notifications
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Profile */}
//             <div className="relative" ref={profileRef}>
//               <button 
//                 className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100"
//                 onClick={() => setIsProfileOpen(!isProfileOpen)}
//               >
//                 <div className="flex items-center gap-2">
//                   <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
//                     <span className="text-white text-sm font-medium">SJ</span>
//                   </div>
//                   <div className="hidden md:block text-left">
//                     <p className="text-sm font-medium">Srikrishna Nagan...</p>
//                     <p className="text-xs text-gray-500">Admin</p>
//                   </div>
//                   <ChevronDown className="h-4 w-4 text-gray-500" />
//                 </div>
//               </button>

//               {isProfileOpen && (
//                 <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
//                   <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center">
//                     <User className="mr-2 h-4 w-4" />
//                     Profile
//                   </button>
//                   <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center">
//                     <Settings className="mr-2 h-4 w-4" />
//                     Settings
//                   </button>
//                   <div className="my-1 border-t border-gray-100" />
//                   <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center text-red-600">
//                     <LogOut className="mr-2 h-4 w-4" />
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
// Header.jsx


import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Search, BellRing, HelpCircle, ChevronDown, Save, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHeader } from '../context/HeaderContext';
import Logo from "../Images/logo.png";
import dashImag from '../Images/image 2.svg';
import { WarningCircle } from 'phosphor-react';

const Header = () => {
  const { user } = useAuth();
  const { isFormEditing, formDirty, setFormDirty } = useHeader();
  const location = useLocation();
  const navigate = useNavigate();
  const isOnFlatNoForm = location.pathname === '/FlatNoForm';
  const [isSaving, setIsSaving] = useState(false);

//   const handleSave = async () => {
//     // Get the form element
//     const form = document.getElementById('owner-form');
//     if (form) {
//       // Create a custom event that carries the 'save' action
//       const saveEvent = new CustomEvent('saveForm', {
//         bubbles: true,
//         detail: {
//           successCallback: () => {
//             setFormDirty(false);
//             navigate('/flatmain');
//           }
//         }
//       });
//       // Dispatch the event to be handled by the form component
//       form.dispatchEvent(saveEvent);
//     }
//   };
// const handleSave = async () => {
//     setIsSaving(true);
//     const form = document.getElementById('owner-form');
//     if (form) {
//       const saveEvent = new CustomEvent('saveForm', {
//         bubbles: true,
//         detail: {
//           successCallback: () => {
//             setIsSaving(false);
//             setFormDirty(false);
//             navigate('/flatmain');
//           },
//           errorCallback: () => {
//             setIsSaving(false);
//           }
//         }
//       });
//       form.dispatchEvent(saveEvent);
//     }
//   };

const handleSave = async () => {
    setIsSaving(true);
    const form = document.getElementById('owner-form');
    if (form) {
      const saveEvent = new CustomEvent('saveForm', {
        bubbles: true,
        detail: {
          registrationId: location.state?.registrationData?.id, // Pass the registrationId
          successCallback: () => {
            setIsSaving(false);
            setFormDirty(false);
            navigate('/flatmain');
          },
          errorCallback: () => {
            setIsSaving(false);
          },
          validationErrorCallback: () => {
            setIsSaving(false);
          }
        }
      });
      form.dispatchEvent(saveEvent);
    }
  };

  const handleDiscard = () => {
    if (window.confirm('Are you sure you want to discard changes? All unsaved changes will be lost.')) {
      setFormDirty(false);
      navigate('/flatmain');
    }
  };

//   const renderSearchOrSave = () => {
//     if (isOnFlatNoForm && (isFormEditing || formDirty)) {
//       return (
//         <div className="flex-1 max-w-4xl">
//           <div className="relative w-full flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
//             {/* <Save size={20} className="text-gray-500" /> */}
//             <WarningCircle size={24} className="text-gray-500"  />
//             <span className=''  style={{color:'#333333', fontSize:14, fontWeight:'500'}}>Unsaved Changes</span>
//             <div className="ml-auto flex items-center gap-3">
//               <button 
//                 className="px-4 py-2 text-gray-700 bg-gray-200  hover:bg-gray-300 rounded-lg "
//                 onClick={() => window.location.reload()} // Or your discard logic
//                 style={{fontSize:14,fontWeight:500 }}
//               >
//                 Discard
//               </button>
//               <button 
//                 className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
//                 onClick={() => {
//                   // Your save logic here
//                   const form = document.getElementById('owner-form');
//                   if (form) {
//                     form.dispatchEvent(new Event('submit', { bubbles: true }));
//                   }
//                 }}
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       );
//     }

//     return (
//         <div className="flex-1 max-w-4xl">
//           <div className="relative w-full">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//             <input
//               type="search"
//               placeholder="Search"
//               style={{borderColor:'#D0D5DD', border:'1px solid #D0D5DD', fontSize:16}}
//               className="w-full pl-10 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300"
//             />
//             <div className="absolute right-3 top-1/2 -translate-y-1/2">
//               <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-400 rounded">
//                 ctrl + k
//               </kbd>
//             </div>
//           </div>
//         </div>
//       );
//     };

// Header.js
// const renderSearchOrSave = () => {
//     if (isOnFlatNoForm && (isFormEditing || formDirty)) {
//       return (
//         <div className="flex-1 max-w-4xl transition-all duration-300 ease-in-out transform">
//           <div 
//             className="relative w-full flex items-center gap-4 px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 animate-slideIn"
//             style={{
//               animation: 'slideIn 0.3s ease-out'
//             }}
//           >
//             <WarningCircle size={24} className="text-gray-500" />
//             <span className="text-[#333333] text-sm font-medium">Unsaved Changes</span>
//             <div className="ml-auto flex items-center gap-3">
//               <button 
//                 className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 onClick={handleDiscard}
//                 disabled={isSaving}
//               >
//                 Discard
//               </button>
//               <button 
//                 className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm font-medium transition-colors flex items-center gap-2 min-w-[80px] justify-center disabled:opacity-50 disabled:cursor-not-allowed"
//                 onClick={handleSave}
//                 disabled={isSaving}
//               >
//                 {isSaving ? (
//                   <>
//                     <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
//                     Saving...
//                   </>
//                 ) : (
//                   'Save'
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className="flex-1 max-w-4xl transition-all duration-300 ease-in-out">
//         <div className="relative w-full animate-slideIn">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//           <input
//             type="search"
//             placeholder="Search"
//             style={{borderColor:'#D0D5DD', border:'1px solid #D0D5DD', fontSize:16}}
//             className="w-full pl-10 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300"
//           />
//           <div className="absolute right-3 top-1/2 -translate-y-1/2">
//             <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-400 rounded">
//               ctrl + k
//             </kbd>
//           </div>
//         </div>
//       </div>
//     );
//   };

const renderSearchOrSave = () => {
    // Check if we're on either the new registration or update path
    const isFormPath = isOnFlatNoForm || location.pathname.startsWith('/FlatNoForm/');
  
    if (isFormPath && (isFormEditing || formDirty)) {
      return (
        <div className="flex-1 max-w-4xl transition-all duration-300 ease-in-out transform">
          <div 
            className="relative w-full flex items-center gap-4 px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 animate-slideIn"
            style={{
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            <WarningCircle size={24} className="text-gray-500" />
            <span className="text-[#333333] text-sm font-medium">Unsaved Changes</span>
            <div className="ml-auto flex items-center gap-3">
              <button 
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDiscard}
                disabled={isSaving}
              >
                Discard
              </button>
              <button 
                className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm font-medium transition-colors flex items-center gap-2 min-w-[80px] justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </div>
        </div>
      );
    }
  
    return (
      <div className="flex-1 max-w-4xl transition-all duration-300 ease-in-out">
        <div className="relative w-full animate-slideIn">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="search"
            placeholder="Search"
            style={{borderColor:'#D0D5DD', border:'1px solid #D0D5DD', fontSize:16}}
            className="w-full pl-10 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-400 rounded">
              ctrl + k
            </kbd>
          </div>
        </div>
      </div>
    );
  };
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="h-[72px] px-6 flex items-center justify-between">
        {/* Left section - Logo */}
        <div className="flex items-center gap-5 ml-2">
          <Link to="/" className="flex items-center gap-5">
            <div className="flex items-center gap-3">
              <img src={Logo} alt="Puri Logo" className="h-13 w-13" />
              <img src={dashImag} alt="Dashboard" className="h-13 w-13 -ml-1" />
            </div>
          </Link>
        </div>

        {/* Center and Right Section Container */}
        <div className="flex flex-1 items-center justify-end gap-8 ml-16 mr-10">
          {/* Search Bar */}
          {/* <div className="flex-1 max-w-4xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2  text-gray-400" size={20} />
              <input
                type="search"
                placeholder="Search"
                style={{borderColor:'#D0D5DD' , border:'1px solid  #D0D5DD', fontSize:16}}
                className="w-full  pl-10 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 "
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-400 rounded">
                  ctrl + k
                </kbd>
              </div>
            </div>
          </div> */}
            {renderSearchOrSave()}

          {/* Icons and Profile */}
          <div className="flex items-center gap-6">
            {/* Help Icon */}
            <button className="p-2 hover:bg-gray-50 rounded-full">
              <HelpCircle color='#4b5563' size={24}/>
            </button>

            {/* Notification Icon */}
            <button className="p-2 hover:bg-gray-50 rounded-full relative">
              <BellRing className="" color='#4b5563' size={24} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Divider for Profile Section */}
            <div className="h-8 border-l border-gray-200 mx-8"></div>

            {/* Profile Section */}
            <div className="flex items-center gap-5 cursor-pointer">
              <div className="w-[36px] h-[36px] rounded-full bg-purple-500 flex items-center justify-center">
                <span className="text-white" style={{fontSize:14}}>
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-base font-medium text-gray-700 line-clamp-1" style={{fontSize:14}}>
                  {user?.firstName} {user?.lastName}
                </p>
                <p className=" text-gray-500" style={{fontSize:12}}>Admin</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;