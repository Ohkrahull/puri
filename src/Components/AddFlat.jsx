// import React, { useState, useRef, useEffect } from 'react';
// import { ChevronDown, X } from 'lucide-react';
// import { Link,useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
// import {checkFlatStatus, createVacantRegistration } from '../firebase/services/userProfile';


// const db = getFirestore();

// const WING_DATA = [
//   { label: 'A', value: 'A' },
//   { label: 'B', value: 'B' },
//   { label: 'C', value: 'C' },
//   { label: 'D', value: 'D' },
// ];

// const FLAT_DATA = {
//   'A': ['101', '102', '103', '104', '105', '201', '202', '203', '204', '205', '301', '302', '303', '304', '305', '444'],
//   'B': ['101', '102', '103', '104', '105', '201', '202', '203', '204', '205', '301', '302', '303', '304', '305', '444'],
//   'C': ['101', '102', '103', '104', '105', '201', '202', '203', '204', '205', '301', '302', '303', '304', '305', '444'],
//   'D': ['101', '102', '103', '104', '105', '201', '202', '203', '204', '205', '301', '302', '303', '304', '305', '444'],
// };

// const AddFlat = ({ onClose, onSave }) => {
//   const [selectedWing, setSelectedWing] = useState('');
//   const [flatNumber, setFlatNumber] = useState('');
//   const [isVacant, setIsVacant] = useState(false);
//   const [isWingOpen, setIsWingOpen] = useState(false);
//   const [filteredFlats, setFilteredFlats] = useState([]);
//   const [isDropdownVisible, setIsDropdownVisible] = useState(false);
//   const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isExisting, setIsExisting] = useState(false);
//   const [flatStatus, setFlatStatus] = useState({
//     exists: false,
//     isVacant: false,
//     registrationId: null
//   });

//   const navigate = useNavigate();

//   const wingDropdownRef = useRef(null);
//   const inputRef = useRef(null);

//   // Check flat status when wing or flat number changes
//   useEffect(() => {
//     const checkStatus = async () => {
//       if (selectedWing && flatNumber) {
//         setIsLoading(true);
//         try {
//           const status = await checkFlatStatus(selectedWing, flatNumber);
//           setFlatStatus(status);
          
//           if (status.exists && !status.isVacant) {
//             toast.info(`Flat ${selectedWing}-${flatNumber} already has residents. You can add more owners/tenants.`);
//           }
//         } catch (error) {
//           console.error('Error checking flat:', error);
//           toast.error('Error checking flat status');
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };

//     checkStatus();
//   }, [selectedWing, flatNumber]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (wingDropdownRef.current && !wingDropdownRef.current.contains(event.target)) {
//         setIsWingOpen(false);
//       }
//       if (inputRef.current && !inputRef.current.contains(event.target)) {
//         setIsDropdownVisible(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleWingSelect = (wing) => {
//     setSelectedWing(wing);
//     setIsWingOpen(false);
//     setFlatNumber('');
//     setFlatStatus({
//       exists: false,
//       isVacant: false,
//       registrationId: null
//     });
//     updateFilteredFlats('', wing);
//   };

//   const updateFilteredFlats = (searchText, wing = selectedWing) => {
//     if (wing && searchText) {
//       const flats = FLAT_DATA[wing].filter(flat => 
//         flat.toLowerCase().includes(searchText.toLowerCase())
//       );
//       setFilteredFlats(flats);
//       setIsDropdownVisible(true);
//     } else {
//       setFilteredFlats([]);
//       setIsDropdownVisible(false);
//     }
//   };

//   const handleFlatNumberChange = (e) => {
//     const value = e.target.value;
//     setFlatNumber(value);
//     updateFilteredFlats(value);
//   };

//   const handleFlatSelect = (flat) => {
//     setFlatNumber(flat);
//     setIsDropdownVisible(false);
//   };

//   const validateForm = () => {
//     setHasAttemptedSubmit(true);
//     return selectedWing && flatNumber;
//   };

//   const handleSave = () => {
//     if (selectedWing && flatNumber) {
//       onSave?.({
//         wing: selectedWing,
//         flatNumber,
//         isVacant
//       });
//       onClose?.();
//     }
//   };

// const handleVacantRegistration = async () => {
//   setIsLoading(true);
//   try {
//     const result = await createVacantRegistration(selectedWing, flatNumber);
//     if (result.success) {
//       toast.success('Flat marked as vacant successfully');
//       onClose();
//     } else {
//       toast.error(result.error || 'Failed to mark flat as vacant');
//     }
//   } catch (error) {
//     console.error('Error in vacant registration:', error);
//     toast.error('Failed to mark flat as vacant');
//   } finally {
//     setIsLoading(false);
//   }
// };
// const handleContinue = () => {
//   if (!selectedWing || !flatNumber) {
//     toast.error('Please select wing and flat number');
//     return;
//   }

//   if (isVacant) {
//     handleVacantRegistration();
//   } else {
    
//     navigate('/FlatNoForm', {
//       state: {
//         wing: selectedWing,
//         flatNumber,
//         isVacant: false,
//         fullFlatNumber: `${selectedWing}-${flatNumber}`,
//         registrationId: flatStatus.registrationId, // Pass registration ID if exists
//         isExisting: flatStatus.exists,
//         currentVacantStatus: flatStatus.isVacant
//       }
//     });
//   }
// };

// const getButtonText = () => {
//   if (isLoading) return 'Processing...';
//   if (isVacant) return 'Mark as Vacant';
//   if (flatStatus.exists && !flatStatus.isVacant) return 'Add Owner/Tenant';
//   if (flatStatus.exists && flatStatus.isVacant) return 'Add First Owner';
//   return 'Continue';
// };

//   // Styles from AddBooking
//   const style = {
//     overlay: {
//       position: 'fixed',
//       inset: 0,
//       backgroundColor: 'rgba(0, 0, 0, 0.5)',
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       zIndex: 50,
//       fontFamily: 'Plus_Jakarta',
//     },
//     content: {
//       backgroundColor: 'white',
//       borderRadius: '16px',
//       width: '428px',
//     },
//     header: {
//       padding: '20px',
//       borderBottom: '1px solid var(--Gray-100, #E5E7EB)',
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//     },
//     headerTitle: {
//       color: 'var(--Gray-900, #030712)',
//       fontSize: '18px',
//       fontWeight: 600,
//       lineHeight: '28px',
//       textAlign: 'center',
//       flex: 1,
//     },
//     subtitle: {
//       color: 'var(--Gray-900, #030712)',
//       fontSize: '16px',
//       fontWeight: 500,
//       lineHeight: '24px',
//       marginBottom: '16px',
//     },
//     inputContainer: {
//     //   backgroundColor: '#F9FAFB',
//       borderRadius: '8px',
//       padding: '2px',
//       display: 'flex',
//       gap: '4px',
//       marginBottom: '16px',
//     },
//     dropdown: {
//       position: 'absolute',
//       top: '100%',
//       left: 0,
//       right: 0,
//       marginTop: '4px',
//       backgroundColor: 'white',
//       border: '1px solid #E5E7EB',
//       borderRadius: '8px',
//       maxHeight: '200px',
//       overflowY: 'auto',
//       zIndex: 10,
//       boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
//     },
//     input: {
//       width: '100%',
//       height: '44px',
//       padding: '10px 16px',
//       borderRadius: '8px',
//       border: '1px solid #E5E7EB',
//     //   backgroundColor: 'white',
//     backgroundColor: '#F3F3F3',
//       fontSize: '14px',
//       color: '#4B5563',
//       outline: 'none',
//     },
//     checkbox: {
//       display: 'flex',
//       alignItems: 'center',
//       gap: '8px',
//       marginTop: '16px',
//     },
//     checkboxInput: {
//       width: '16px',
//       height: '16px',
//       borderRadius: '4px',
//       border: '1px solid #D1D5DB',
//       cursor: 'pointer',
//     },
//     checkboxLabel: {
//       fontSize: '14px',
//       color: '#4B5563',
//     },
//     dropdownButton: {
//       width: '120px',
//       height: '44px',
//       padding: '10px 16px',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       borderRadius: '8px',
//       border: '1px solid #E5E7EB',
//       backgroundColor: '#F3F3F3',
//       cursor: 'pointer',
//       fontSize: '14px',
//       color: '#4B5563',
//     },
//     dropdownItem: {
//       padding: '10px 16px',
//       cursor: 'pointer',
//       borderBottom: '1px solid #E5E7EB',
//       fontSize: '14px',
//       color: '#4B5563',
//       '&:hover': {
//         backgroundColor: '#F9FAFB',
//       },
//     },
//   };

//   return (
//     <div style={style.overlay}>
//       <div style={style.content}>
//         {/* Header */}
//         <div style={style.header}>
//           <div style={{ width: 24 }} />
//           <h2 style={style.headerTitle}>Add Flat</h2>
//           <button onClick={onClose} className="p-2">
//             <X size={20} color="#030712" />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-6">
//           <h3 style={style.subtitle}>Select Flat No.</h3>

//           <div style={style.inputContainer}>
//             {/* Wing Dropdown */}
//             <div ref={wingDropdownRef} className="relative">
//               <button
//                 style={style.dropdownButton}
//                 onClick={() => setIsWingOpen(!isWingOpen)}

//               >
//                 <span>{selectedWing || 'Wing'}</span>
//                 <ChevronDown size={16} />
//               </button>

//               {isWingOpen && (
//                 <div style={style.dropdown}>
//                   {WING_DATA.map((wing) => (
//                     <div
//                       key={wing.value}
//                       style={style.dropdownItem}
//                       onClick={() => handleWingSelect(wing.value)}
//                       className="hover:bg-gray-50"
//                     >
//                       {wing.label}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Flat Number Input */}
//             <div ref={inputRef} className="relative flex-1">
//               <input
//                 type="text"
//                 placeholder="Flat number"
//                 value={flatNumber}
//                 onChange={handleFlatNumberChange}
//                 style={style.input}
//               />

//               {isDropdownVisible && filteredFlats.length > 0 && (
//                 <div style={style.dropdown}>
//                   {filteredFlats.map((flat) => (
//                     <div
//                       key={flat}
//                       style={style.dropdownItem}
//                       onClick={() => handleFlatSelect(flat)}
//                       className="hover:bg-gray-50"
//                     >
//                       {selectedWing}-{flat}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Vacant Checkbox */}
//           {/* <label style={style.checkbox}>
//             <input
//               type="checkbox"
//               checked={isVacant}
//               onChange={(e) => setIsVacant(e.target.checked)}
//               style={style.checkboxInput}
//             />
//             <span style={style.checkboxLabel}>Vacant</span>
//           </label> */}
//             {/* Vacant Checkbox - Show only for new flats or vacant flats */}
//             {(!flatStatus.exists || flatStatus.isVacant) && (
//             <label style={style.checkbox}>
//               <input
//                 type="checkbox"
//                 checked={isVacant}
//                 onChange={(e) => setIsVacant(e.target.checked)}
//                 style={style.checkboxInput}
//               />
//               <span style={style.checkboxLabel}>Mark as Vacant</span>
//             </label>
//           )}

//             {/* Status message */}
//             {flatStatus.exists && (
//             <p className={`text-sm mt-4 ${flatStatus.isVacant ? 'text-yellow-600' : 'text-blue-600'}`}>
//               {flatStatus.isVacant 
//                 ? 'This flat is currently vacant. You can add owners/tenants or keep it vacant.'
//                 : 'This flat has existing residents. You can add more owners/tenants.'}
//             </p>
//           )}
//         </div>

       
//         {/* <div className="p-6 border-t border-gray-200">
//   <Link 
//     to="/FlatNoForm" 
//     state={{ 
//       wing: selectedWing, 
//       flatNumber: flatNumber,
//       isVacant: isVacant,
//       fullFlatNumber: `${selectedWing}-${flatNumber}` // Combining both for display
//     }}
//     onClick={handleSave}
//     style={{
//       display: 'inline-block',
//       padding: '10px 24px',
//       borderRadius: '8px',
//       marginBottom: '10px',
//       backgroundColor: (!selectedWing || !flatNumber) ? 'rgba(3, 7, 18, 0.5)' : '#030712',
//       color: 'white',
//       textAlign: 'center',
//       cursor: (!selectedWing || !flatNumber) ? 'not-allowed' : 'pointer',
//       float: 'right'
//     }}
//     className="font-semibold"
//   >
//     Continue
//   </Link>
// </div> */}
//  {/* <div className="p-6 border-t border-gray-200">
//           <button
//             onClick={handleContinue}
//             disabled={isLoading || (!selectedWing || !flatNumber)}
//             className="float-right px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ease-in-out mb-4"
//             style={{
//               backgroundColor: (!selectedWing || !flatNumber) ? 'rgba(3, 7, 18, 0.5)' : '#030712',
//               cursor: (!selectedWing || !flatNumber) ? 'not-allowed' : 'pointer',
//             }}
//           >
//             {isLoading ? (
//               <div className="flex items-center">
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Saving...
//               </div>
//             ) : isVacant ? 'Save' : 'Continue'}
//           </button>
//         </div> */}
//         {/* Update only the button section of the component */}
// <div className="p-6 border-t border-gray-200 ">
// <button
//             onClick={handleContinue}
//             disabled={isLoading || !selectedWing || !flatNumber}
//             className="float-right px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ease-in-out mb-4"
//             style={{
//               backgroundColor: (!selectedWing || !flatNumber || isLoading) 
//                 ? 'rgba(3, 7, 18, 0.5)' 
//                 : '#030712',
//               cursor: (!selectedWing || !flatNumber || isLoading) 
//                 ? 'not-allowed' 
//                 : 'pointer',
//             }}
//           >
//             {isLoading ? (
//               <div className="flex items-center">
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
//                 </svg>
//                 Processing...
//               </div>
//             ) : (
//               getButtonText()
//             )}
//           </button>
// </div>
//       </div>
//     </div>
//   );
// };

// export default AddFlat;

// import React, { useState, useRef, useEffect } from 'react';
// import { ChevronDown, X } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { 
//   checkFlatStatus, 
//   createVacantRegistration,
//   createOrUpdateFlat 
// } from '../firebase/services/userProfile';

// const WING_DATA = [
//   { label: 'A', value: 'A' },
//   { label: 'B', value: 'B' },
//   { label: 'C', value: 'C' },
//   { label: 'D', value: 'D' },
// ];

// const FLAT_DATA = {
//   'A': ['101', '102', '103', '104', '105', '201', '202', '203', '204', '205', '301', '302', '303', '304', '305', '444'],
//   'B': ['101', '102', '103', '104', '105', '201', '202', '203', '204', '205', '301', '302', '303', '304', '305', '444'],
//   'C': ['101', '102', '103', '104', '105', '201', '202', '203', '204', '205', '301', '302', '303', '304', '305', '444'],
//   'D': ['101', '102', '103', '104', '105', '201', '202', '203', '204', '205', '301', '302', '303', '304', '305', '444'],
// };

// const AddFlat = ({ onClose, onSave }) => {
//   // State management
//   const [selectedWing, setSelectedWing] = useState('');
//   const [flatNumber, setFlatNumber] = useState('');
//   const [isVacant, setIsVacant] = useState(false);
//   const [isWingOpen, setIsWingOpen] = useState(false);
//   const [filteredFlats, setFilteredFlats] = useState([]);
//   const [isDropdownVisible, setIsDropdownVisible] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [flatStatus, setFlatStatus] = useState({
//     exists: false,
//     isVacant: false,
//     registrationId: null,
//     users: []
//   });

//   const navigate = useNavigate();
//   const wingDropdownRef = useRef(null);
//   const inputRef = useRef(null);

//   // Styles
//   const styles = {
//     container: `
//       fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50
//       font-['Plus_Jakarta'] text-gray-900
//     `,
//     modal: `
//       bg-white rounded-2xl w-[428px] shadow-xl
//     `,
//     header: `
//       flex items-center justify-between px-5 py-5 border-b border-gray-100
//     `,
//     title: `
//       text-lg font-semibold flex-1 text-center
//     `,
//     closeButton: `
//       p-2 hover:bg-gray-100 rounded-lg transition-colors
//     `,
//     content: `
//       p-6
//     `,
//     subtitle: `
//       text-base font-medium mb-4
//     `,
//     inputContainer: `
//       flex gap-2 mb-4
//     `,
//     wingDropdown: `
//       relative
//     `,
//     dropdownButton: `
//       w-[120px] h-11 px-4 flex items-center justify-between
//       bg-gray-100 border border-gray-200 rounded-lg
//       text-sm text-gray-600 cursor-pointer
//       hover:bg-gray-50 transition-colors
//     `,
//     dropdownMenu: `
//       absolute top-full left-0 right-0 mt-1
//       bg-white border border-gray-200 rounded-lg
//       max-h-[200px] overflow-y-auto shadow-lg z-10
//     `,
//     dropdownItem: `
//       px-4 py-2.5 text-sm text-gray-600 cursor-pointer
//       hover:bg-gray-50 border-b border-gray-100 last:border-0
//     `,
//     input: `
//       flex-1 h-11 px-4 
//       bg-gray-100 border border-gray-200 rounded-lg
//       text-sm text-gray-600
//       focus:outline-none focus:ring-2 focus:ring-gray-200
//     `,
//     checkbox: `
//       flex items-center gap-2 mt-4 cursor-pointer
//     `,
//     checkboxInput: `
//       w-4 h-4 rounded border-gray-300
//       text-black focus:ring-gray-200
//     `,
//     checkboxLabel: `
//       text-sm text-gray-600
//     `,
//     statusMessage: `
//       text-sm mt-4
//     `,
//     footer: `
//       p-6 border-t border-gray-200 flex justify-end
//     `,
//     button: `
//       px-6 py-3 rounded-lg font-semibold text-white
//       transition-all duration-200 ease-in-out
//       disabled:bg-opacity-50 disabled:cursor-not-allowed
//     `,
//     spinner: `
//       animate-spin -ml-1 mr-3 h-5 w-5 text-white
//     `
//   };

//   // Check flat status when wing or flat number changes
//   useEffect(() => {
//     const checkStatus = async () => {
//       if (selectedWing && flatNumber) {
//         setIsLoading(true);
//         try {
//           const status = await checkFlatStatus(selectedWing, flatNumber);
//           setFlatStatus(status);
          
//           if (status.exists && !status.isVacant) {
//             const userCount = status.users.length;
//             toast.info(`Flat ${selectedWing}-${flatNumber} has ${userCount} resident${userCount > 1 ? 's' : ''}. You can add more owners/tenants.`);
//           }
//         } catch (error) {
//           console.error('Error checking flat:', error);
//           toast.error('Error checking flat status');
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };

//     checkStatus();
//   }, [selectedWing, flatNumber]);

//   // Handle click outside dropdowns
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (wingDropdownRef.current && !wingDropdownRef.current.contains(event.target)) {
//         setIsWingOpen(false);
//       }
//       if (inputRef.current && !inputRef.current.contains(event.target)) {
//         setIsDropdownVisible(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleWingSelect = (wing) => {
//     setSelectedWing(wing);
//     setIsWingOpen(false);
//     setFlatNumber('');
//     setFlatStatus({
//       exists: false,
//       isVacant: false,
//       registrationId: null,
//       users: []
//     });
//     updateFilteredFlats('', wing);
//   };

//   const updateFilteredFlats = (searchText, wing = selectedWing) => {
//     if (wing && searchText) {
//       const flats = FLAT_DATA[wing].filter(flat => 
//         flat.toLowerCase().includes(searchText.toLowerCase())
//       );
//       setFilteredFlats(flats);
//       setIsDropdownVisible(true);
//     } else {
//       setFilteredFlats([]);
//       setIsDropdownVisible(false);
//     }
//   };

//   const handleFlatNumberChange = (e) => {
//     const value = e.target.value;
//     setFlatNumber(value);
//     updateFilteredFlats(value);
//   };

//   const handleFlatSelect = (flat) => {
//     setFlatNumber(flat);
//     setIsDropdownVisible(false);
//   };

//   const handleVacantRegistration = async () => {
//     setIsLoading(true);
//     try {
//       const result = await createVacantRegistration(selectedWing, flatNumber);
//       if (result.success) {
//         toast.success('Flat marked as vacant successfully');
//         onSave?.({ wing: selectedWing, flatNumber, isVacant: true });
//         onClose?.();
//       } else {
//         toast.error(result.error || 'Failed to mark flat as vacant');
//       }
//     } catch (error) {
//       console.error('Error in vacant registration:', error);
//       toast.error('Failed to mark flat as vacant');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleContinue = () => {
//     if (!selectedWing || !flatNumber) {
//       toast.error('Please select wing and flat number');
//       return;
//     }

//     if (isVacant) {
//       handleVacantRegistration();
//     } else {
//       navigate('/FlatNoForm', {
//         state: {
//           wing: selectedWing,
//           flatNumber,
//           isVacant: false,
//           fullFlatNumber: `${selectedWing}-${flatNumber}`,
//           flatId: `flat_${selectedWing}_${flatNumber}`,
//           isExisting: flatStatus.exists,
//           currentVacantStatus: flatStatus.isVacant,
//           existingUsers: flatStatus.users || []
//         }
//       });
//     }
//   };

//   const getButtonText = () => {
//     if (isLoading) return 'Processing...';
//     if (isVacant) return 'Mark as Vacant';
//     if (flatStatus.exists && !flatStatus.isVacant) return 'Add Owner/Tenant';
//     if (flatStatus.exists && flatStatus.isVacant) return 'Add First Owner';
//     return 'Continue';
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.modal}>
//         {/* Header */}
//         <div className={styles.header}>
//           <div className="w-6" />
//           <h2 className={styles.title}>Add Flat</h2>
//           <button onClick={onClose} className={styles.closeButton}>
//             <X size={20} />
//           </button>
//         </div>

//         {/* Content */}
//         <div className={styles.content}>
//           <h3 className={styles.subtitle}>Select Flat No.</h3>

//           <div className={styles.inputContainer}>
//             {/* Wing Dropdown */}
//             <div ref={wingDropdownRef} className={styles.wingDropdown}>
//               <button
//                 className={styles.dropdownButton}
//                 onClick={() => setIsWingOpen(!isWingOpen)}
//               >
//                 <span>{selectedWing || 'Wing'}</span>
//                 <ChevronDown size={16} />
//               </button>

//               {isWingOpen && (
//                 <div className={styles.dropdownMenu}>
//                   {WING_DATA.map((wing) => (
//                     <div
//                       key={wing.value}
//                       className={styles.dropdownItem}
//                       onClick={() => handleWingSelect(wing.value)}
//                     >
//                       {wing.label}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Flat Number Input */}
//             <div ref={inputRef} className="relative flex-1">
//               <input
//                 type="text"
//                 placeholder="Flat number"
//                 value={flatNumber}
//                 onChange={handleFlatNumberChange}
//                 className={styles.input}
//               />

//               {isDropdownVisible && filteredFlats.length > 0 && (
//                 <div className={styles.dropdownMenu}>
//                   {filteredFlats.map((flat) => (
//                     <div
//                       key={flat}
//                       className={styles.dropdownItem}
//                       onClick={() => handleFlatSelect(flat)}
//                     >
//                       {selectedWing}-{flat}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Vacant Checkbox */}
//           {(!flatStatus.exists || flatStatus.isVacant) && (
//             <label className={styles.checkbox}>
//               <input
//                 type="checkbox"
//                 checked={isVacant}
//                 onChange={(e) => setIsVacant(e.target.checked)}
//                 className={styles.checkboxInput}
//               />
//               <span className={styles.checkboxLabel}>Mark as Vacant</span>
//             </label>
//           )}

//           {/* Status message */}
//           {flatStatus.exists && (
//             <p className={`${styles.statusMessage} ${
//               flatStatus.isVacant ? 'text-yellow-600' : 'text-blue-600'
//             }`}>
//               {flatStatus.isVacant 
//                 ? 'This flat is currently vacant. You can add owners/tenants or keep it vacant.'
//                 : `This flat has ${flatStatus.users.length} resident${flatStatus.users.length > 1 ? 's' : ''}. You can add more owners/tenants.`}
//             </p>
//           )}
//         </div>

//         {/* Footer */}
//         <div className={styles.footer}>
//           <button
//             onClick={handleContinue}
//             disabled={isLoading || !selectedWing || !flatNumber}
//             className={`${styles.button} ${
//               (!selectedWing || !flatNumber || isLoading)
//                 ? 'bg-gray-900 bg-opacity-50'
//                 : 'bg-gray-900'
//             }`}
//           >
//             {isLoading ? (
//               <div className="flex items-center">
//                 <svg className={styles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
//                 </svg>
//                 Processing...
//               </div>
//             ) : (
//               getButtonText()
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddFlat;
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  checkFlatStatus, 
  createVacantRegistration,
  createOrUpdateFlat 
} from '../firebase/services/userProfile';

const WING_DATA = [
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'C', value: 'C' },
  { label: 'D', value: 'D' },
];

const FLAT_DATA = {
  'A': ['101', '102', '103', '104', '105', '201', '202', '203', '204', '205', '301', '302', '303', '304', '305', '444'],
  'B': ['101', '102', '103', '104', '105', '201', '202', '203', '204', '205', '301', '302', '303', '304', '305', '444'],
  'C': ['101', '102', '103', '104', '105', '201', '202', '203', '204', '205', '301', '302', '303', '304', '305', '444'],
  'D': ['101', '102', '103', '104', '105', '201', '202', '203', '204', '205', '301', '302', '303', '304', '305', '444'],
};

const AddFlat = ({ onClose, onSave }) => {
  const [selectedWing, setSelectedWing] = useState('');
  const [flatNumber, setFlatNumber] = useState('');
  const [isVacant, setIsVacant] = useState(false);
  const [isWingOpen, setIsWingOpen] = useState(false);
  const [filteredFlats, setFilteredFlats] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [flatStatus, setFlatStatus] = useState({
    exists: false,
    isVacant: false,
    registrationId: null,
    users: []
  });

  const navigate = useNavigate();
  const wingDropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Original styles
  const style = {
    overlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 50,
      fontFamily: 'Plus_Jakarta',
    },
    content: {
      backgroundColor: 'white',
      borderRadius: '16px',
      width: '428px',
    },
    header: {
      padding: '20px',
      borderBottom: '1px solid var(--Gray-100, #E5E7EB)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      color: 'var(--Gray-900, #030712)',
      fontSize: '18px',
      fontWeight: 600,
      lineHeight: '28px',
      textAlign: 'center',
      flex: 1,
    },
    subtitle: {
      color: 'var(--Gray-900, #030712)',
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: '24px',
      marginBottom: '16px',
    },
    inputContainer: {
      borderRadius: '8px',
      padding: '2px',
      display: 'flex',
      gap: '4px',
      marginBottom: '16px',
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      marginTop: '4px',
      backgroundColor: 'white',
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      maxHeight: '200px',
      overflowY: 'auto',
      zIndex: 10,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    input: {
      width: '100%',
      height: '44px',
      padding: '10px 16px',
      borderRadius: '8px',
      border: '1px solid #E5E7EB',
      backgroundColor: '#F3F3F3',
      fontSize: '14px',
      color: '#4B5563',
      outline: 'none',
    },
    checkbox: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '16px',
    },
    checkboxInput: {
      width: '16px',
      height: '16px',
      borderRadius: '4px',
      border: '1px solid #D1D5DB',
      cursor: 'pointer',
    },
    checkboxLabel: {
      fontSize: '14px',
      color: '#4B5563',
    },
    dropdownButton: {
      width: '120px',
      height: '44px',
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: '8px',
      border: '1px solid #E5E7EB',
      backgroundColor: '#F3F3F3',
      cursor: 'pointer',
      fontSize: '14px',
      color: '#4B5563',
    },
    dropdownItem: {
      padding: '10px 16px',
      cursor: 'pointer',
      borderBottom: '1px solid #E5E7EB',
      fontSize: '14px',
      color: '#4B5563',
    }
  };

  // Check flat status when wing or flat number changes
  useEffect(() => {
    const checkStatus = async () => {
      if (selectedWing && flatNumber) {
        setIsLoading(true);
        try {
          const status = await checkFlatStatus(selectedWing, flatNumber);
          setFlatStatus(status);
          
          if (status.exists && !status.isVacant) {
            const userCount = status.users.length;
            toast.info(`Flat ${selectedWing}-${flatNumber} has ${userCount} resident${userCount > 1 ? 's' : ''}. You can add more owners/tenants.`);
          }
        } catch (error) {
          console.error('Error checking flat:', error);
          toast.error('Error checking flat status');
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkStatus();
  }, [selectedWing, flatNumber]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wingDropdownRef.current && !wingDropdownRef.current.contains(event.target)) {
        setIsWingOpen(false);
      }
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleWingSelect = (wing) => {
    setSelectedWing(wing);
    setIsWingOpen(false);
    setFlatNumber('');
    setFlatStatus({
      exists: false,
      isVacant: false,
      registrationId: null,
      users: []
    });
    updateFilteredFlats('', wing);
  };

  const updateFilteredFlats = (searchText, wing = selectedWing) => {
    if (wing && searchText) {
      const flats = FLAT_DATA[wing].filter(flat => 
        flat.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredFlats(flats);
      setIsDropdownVisible(true);
    } else {
      setFilteredFlats([]);
      setIsDropdownVisible(false);
    }
  };

  const handleFlatNumberChange = (e) => {
    const value = e.target.value;
    setFlatNumber(value);
    updateFilteredFlats(value);
  };

  const handleFlatSelect = (flat) => {
    setFlatNumber(flat);
    setIsDropdownVisible(false);
  };

  const handleVacantRegistration = async () => {
    setIsLoading(true);
    try {
      const result = await createVacantRegistration(selectedWing, flatNumber);
      if (result.success) {
        toast.success('Flat marked as vacant successfully');
        onSave?.({ wing: selectedWing, flatNumber, isVacant: true });
        onClose?.();
      } else {
        toast.error(result.error || 'Failed to mark flat as vacant');
      }
    } catch (error) {
      console.error('Error in vacant registration:', error);
      toast.error('Failed to mark flat as vacant');
    } finally {
      setIsLoading(false);
    }
  };

  // const handleContinue = () => {
  //   if (!selectedWing || !flatNumber) {
  //     toast.error('Please select wing and flat number');
  //     return;
  //   }

  //   if (isVacant) {
  //     handleVacantRegistration();
  //   } else {
  //     navigate('/FlatNoForm', {
  //       state: {
  //         wing: selectedWing,
  //         flatNumber,
  //         isVacant: false,
  //         fullFlatNumber: `${selectedWing}-${flatNumber}`,
  //         flatId: `flat_${selectedWing}_${flatNumber}`,
  //         isExisting: flatStatus.exists,
  //         currentVacantStatus: flatStatus.isVacant,
  //         existingUsers: flatStatus.users || []
  //       }
  //     });
  //   }
  // };
  const handleContinue = () => {
    if (!selectedWing || !flatNumber) {
      toast.error('Please select wing and flat number');
      return;
    }
  
    const flatId = `flat_${selectedWing}_${flatNumber}`;
  
    if (isVacant) {
      handleVacantRegistration();
    } else {
      // Navigate with flatId parameter and state
      navigate(`/FlatNoForm/${flatId}`, {
        state: {
          wing: selectedWing,
          flatNumber,
          isVacant: false,
          fullFlatNumber: `${selectedWing}-${flatNumber}`,
          flatId,
          isExisting: flatStatus.exists,
          currentVacantStatus: flatStatus.isVacant,
          existingUsers: flatStatus.users || []
        }
      });
    }
  };

  const getButtonText = () => {
    if (isLoading) return 'Processing...';
    if (isVacant) return 'Mark as Vacant';
    if (flatStatus.exists && !flatStatus.isVacant) return 'Add Owner/Tenant';
    if (flatStatus.exists && flatStatus.isVacant) return 'Add First Owner';
    return 'Continue';
  };

  return (
    <div style={style.overlay}>
      <div style={style.content}>
        {/* Header */}
        <div style={style.header}>
          <div style={{ width: 24 }} />
          <h2 style={style.headerTitle}>Add Flat</h2>
          <button onClick={onClose} className="p-2">
            <X size={20} color="#030712" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 style={style.subtitle}>Select Flat No.</h3>

          <div style={style.inputContainer}>
            {/* Wing Dropdown */}
            <div ref={wingDropdownRef} className="relative">
              <button
                style={style.dropdownButton}
                onClick={() => setIsWingOpen(!isWingOpen)}
              >
                <span>{selectedWing || 'Wing'}</span>
                <ChevronDown size={16} />
              </button>

              {isWingOpen && (
                <div style={style.dropdown}>
                  {WING_DATA.map((wing) => (
                    <div
                      key={wing.value}
                      style={style.dropdownItem}
                      onClick={() => handleWingSelect(wing.value)}
                      className="hover:bg-gray-50"
                    >
                      {wing.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Flat Number Input */}
            <div ref={inputRef} className="relative flex-1">
              <input
                type="text"
                placeholder="Flat number"
                value={flatNumber}
                onChange={handleFlatNumberChange}
                style={style.input}
              />

              {isDropdownVisible && filteredFlats.length > 0 && (
                <div style={style.dropdown}>
                  {filteredFlats.map((flat) => (
                    <div
                      key={flat}
                      style={style.dropdownItem}
                      onClick={() => handleFlatSelect(flat)}
                      className="hover:bg-gray-50"
                    >
                      {selectedWing}-{flat}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Vacant Checkbox */}
          {(!flatStatus.exists || flatStatus.isVacant) && (
            <label style={style.checkbox}>
              <input
                type="checkbox"
                checked={isVacant}
                onChange={(e) => setIsVacant(e.target.checked)}
                style={style.checkboxInput}
              />
              <span style={style.checkboxLabel}>Mark as Vacant</span>
            </label>
          )}

          {/* Status message */}
          {flatStatus.exists && (
            <p className={`text-sm mt-4 ${flatStatus.isVacant ? 'text-yellow-600' : 'text-blue-600'}`}>
              {flatStatus.isVacant 
                ? 'This flat is currently vacant. You can add owners/tenants or keep it vacant.'
                : `This flat has ${flatStatus.users.length} resident${flatStatus.users.length > 1 ? 's' : ''}. You can add more owners/tenants.`}
            </p>
          )}
        </div>

        {/* Button Section */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleContinue}
            disabled={isLoading || !selectedWing || !flatNumber}
            className="float-right px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ease-in-out mb-4"
            style={{
              backgroundColor: (!selectedWing || !flatNumber || isLoading) 
                ? 'rgba(3, 7, 18, 0.5)' 
                : '#030712',
              cursor: (!selectedWing || !flatNumber || isLoading) 
                ? 'not-allowed' 
                : 'pointer',
            }}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Processing...
              </div>
            ) : (
              getButtonText()
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFlat;