// import React, { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
// // import { addStaffUser } from '../firebase/services/UserService';
// import { useStaff } from '../context/StaffContext';
// // import { createUserWithEmailAndPassword } from "firebase/auth";
// // import { auth } from '../firebase/firebase';

// const AddStaffModal = ({ isOpen, onClose, onAdd }) => {
//   const { addStaffMember, isAddingStaff } = useStaff();
//   const initialStaffState = {
//     firstName: '',
//     lastName: '',
//     email: '',
//     phoneNumber:'',
//     password: '',
//     confirmPassword: '',
//     role: 'Select role',
//   };
//   const [staff, setStaff] = useState(initialStaffState);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [error, setError] = useState('');
//   const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '' });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setStaff(prev => ({ ...prev, [name]: value }));
//     setError('');
//     if (name === 'password') {
//       checkPasswordStrength(value);
//     }
//   };

//   const checkPasswordStrength = (password) => {
//     // Simple password strength check
//     let score = 0;
//     if (password.length >= 8) score++;
//     if (password.match(/[a-z]/) && password.match(/[A-Z]/)) score++;
//     if (password.match(/\d/)) score++;
//     if (password.match(/[^a-zA-Z\d]/)) score++;

//     let label = '';
//     let color = '';
//     if (score === 0) { label = 'Very Weak'; color = '#ff4136'; }
//     else if (score === 1) { label = 'Weak'; color = '#ff851b'; }
//     else if (score === 2) { label = 'Fair'; color = '#ffdc00'; }
//     else if (score === 3) { label = 'Good'; color = '#2ecc40'; }
//     else if (score === 4) { label = 'Strong'; color = '#0074d9'; }

//     setPasswordStrength({ score, label, color });
//   };

//   const resetForm = () => {
//     setStaff(initialStaffState);
//     setError('');
//   };

//   // const handleAdd = async () => {
//   //   if (!staff.firstName || !staff.lastName || !staff.email || !staff.password || !staff.confirmPassword || staff.role === 'Select role') {
//   //     toast.error("Please fill in all fields.");
//   //     return;
//   //   }

//   //   if (staff.password !== staff.confirmPassword) {
//   //     toast.error("Passwords do not match.");
//   //     return;
//   //   }

//   //   try {
//   //     const userData = {
//   //       ...staff,
//   //       roles: [staff.role.toLowerCase()],
//   //     };
//   //     delete userData.confirmPassword;

//   //     await addStaffUser(userData);
//   //     console.log("New staff added successfully: ", staff);
//   //     // toast.success('Staff added successfully');
//   //     onAdd(staff);
//   //     resetForm();
//   //     onClose();
//   //   } catch (error) {
//   //     console.error("Error adding new staff: ", error);
//   //     toast.error("Error adding staff. Please try again.");
//   //   }
//   // };
// // const handleAdd = async () => {
// //     if (!staff.firstName || !staff.lastName || !staff.email || !staff.password || !staff.confirmPassword || staff.role === 'Select role') {
// //       toast.error("Please fill in all fields.");
// //       return;
// //     }

// //     if (staff.password !== staff.confirmPassword) {
// //       toast.error("Passwords do not match.");
// //       return;
// //     }

// //     try {
// //       const userData = {
// //         ...staff,
// //         role: staff.role,  // This is now a single string value
// //       };
// //       delete userData.confirmPassword;

// //       await addStaffUser(userData);
// //       console.log("New staff added successfully: ", staff);
// //       onAdd(staff);
// //       resetForm();
// //       onClose();
// //     } catch (error) {
// //       console.error("Error adding new staff: ", error);
// //       toast.error("Error adding staff. Please try again.");
// //     }
// //   };
  
// // const handleAdd = async () => {
// //   if (!staff.firstName || !staff.lastName || !staff.email || !staff.password || !staff.confirmPassword || staff.role === 'Select role') {
// //     toast.error("Please fill in all fields.");
// //     return;
// //   }

// //   if (staff.password !== staff.confirmPassword) {
// //     toast.error("Passwords do not match.");
// //     return;
// //   }

// //   try {
// //     const userData = {
// //       ...staff,
// //       role: staff.role,
// //     };
// //     delete userData.confirmPassword;

// //     await addStaffUser(userData);
// //     console.log("New staff added successfully: ", staff);
// //     onAdd(staff);
// //     resetForm();
// //     onClose();
// //     // toast.success("Staff member added successfully!");
// //   } catch (error) {
// //     console.error("Error adding new staff: ", error);
// //     if (error.message === "This email is already registered. Please use a different email address.") {
// //       toast.error(error.message);
// //     } else {
// //       toast.error("Error adding staff. Please try again.");
// //     }
// //   }
// // };
// // const handleAdd = async () => {
// //   if (!staff.firstName || !staff.lastName || !staff.email || !staff.password || !staff.confirmPassword || staff.role === 'Select role') {
// //     toast.error("Please fill in all fields.");
// //     return;
// //   }

// //   if (staff.password !== staff.confirmPassword) {
// //     toast.error("Passwords do not match.");
// //     return;
// //   }

// //   try {
// //     // Create Firebase Auth user
// //     const userCredential = await createUserWithEmailAndPassword(auth, staff.email, staff.password);
// //     const firebaseUser = userCredential.user;

// //     const userData = {
// //       ...staff,
// //       role: staff.role,
// //       firebaseUid: firebaseUser.uid
// //     };
// //     delete userData.confirmPassword;

// //     await addStaffUser(userData);
// //     console.log("New staff added successfully: ", staff);
// //     onAdd(staff);
// //     resetForm();
// //     onClose();
// //     toast.success("Staff member added successfully!");
// //   } catch (error) {
// //     console.error("Error adding new staff: ", error);
// //     if (error.code === 'auth/email-already-in-use') {
// //       toast.error("This email is already registered. Please use a different email address.");
// //     } else {
// //       toast.error("Error adding staff. Please try again.");
// //     }
// //   }
// // };

// const handleAdd = async () => {
//   if (!staff.firstName || !staff.lastName || !staff.phoneNumber || !staff.email || !staff.password || !staff.confirmPassword || staff.role === 'Select role') {
//     toast.error("Please fill in all fields.");
//     return;
//   }

//   if (staff.password !== staff.confirmPassword) {
//     toast.error("Passwords do not match.");
//     return;
//   }

//   if (passwordStrength.score < 3) {
//     toast.error("Please use a stronger password.");
//     return;
//   }

//   try {
//     const result = await addStaffMember(staff);
//     console.log("New staff added successfully: ", result);
//     onAdd(result);
//     resetForm();
//     onClose();
//     toast.success('Staff member added successfully');
//   } catch (error) {
//     console.error("Error adding new staff: ", error);
//     toast.error(error.message || 'Failed to add staff member. Please try again.');
//     setError(error.message || 'Failed to add staff member. Please try again.');
//   }
// };

// const handleClearAll = () => {
//     resetForm();
//   };

//   useEffect(() => {
//     if (isOpen) {
//       resetForm();
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;

//   const modalContentStyle = {
//     display: 'inline-flex',
//     flexDirection: 'column',
//     alignItems: 'flex-start',
//     borderRadius: '16px',
//     background: '#FFF',
//     fontFamily: 'Plus Jakarta Sans, sans-serif',
//     width: '428px',
//     height: '600px', // Fixed height
//     overflowY: 'auto', // Allow scrolling if content exceeds height
//     msOverflowStyle: 'none',  // IE and Edge
//     scrollbarWidth: 'none',  // Firefox
//     '&::-webkit-scrollbar': {
//       display: 'none'  // Chrome, Safari and Opera
//     }
//   };

//   const contentStyle = {
//     display: 'flex',
//     padding: '24px',
//     flexDirection: 'column',
//     alignItems: 'flex-start',
//     gap: '20px',
//     alignSelf: 'stretch',
//     flex: 1, // Take up remaining space
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div style={modalContentStyle}>
//         {/* Header */}
//         <div style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           alignSelf: 'stretch',
//           padding: '20px 24px',
//           borderBottom: '1px solid var(--Gray-200, #E5E7EB)',
//           width: '100%',
//         }}>
//           <div style={{ width: '24px' }}></div>
//           <h2 style={{
//             color: 'var(--Gray-900, #030712)',
//             textAlign: 'center',
//             fontFamily: 'Plus Jakarta Sans, sans-serif',
//             fontSize: '18px',
//             fontStyle: 'normal',
//             fontWeight: 600,
//             lineHeight: '28px',
//           }}>Add Staff</h2>
//           <button onClick={onClose} style={{ width: '24px', height: '24px', background: 'none', border: 'none', cursor: 'pointer' }}>
//             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//               <path d="M19.2806 18.2194C19.3502 18.2891 19.4055 18.3718 19.4432 18.4629C19.4809 18.5539 19.5003 18.6515 19.5003 18.7501C19.5003 18.8486 19.4809 18.9462 19.4432 19.0372C19.4055 19.1283 19.3502 19.211 19.2806 19.2807C19.2109 19.3504 19.1281 19.4056 19.0371 19.4433C18.9461 19.4811 18.8485 19.5005 18.7499 19.5005C18.6514 19.5005 18.5538 19.4811 18.4628 19.4433C18.3717 19.4056 18.289 19.3504 18.2193 19.2807L11.9999 13.0604L5.78055 19.2807C5.63982 19.4214 5.44895 19.5005 5.24993 19.5005C5.05091 19.5005 4.86003 19.4214 4.7193 19.2807C4.57857 19.1399 4.49951 18.9491 4.49951 18.7501C4.49951 18.551 4.57857 18.3602 4.7193 18.2194L10.9396 12.0001L4.7193 5.78068C4.57857 5.63995 4.49951 5.44907 4.49951 5.25005C4.49951 5.05103 4.57857 4.86016 4.7193 4.71943C4.86003 4.5787 5.05091 4.49963 5.24993 4.49963C5.44895 4.49963 5.63982 4.5787 5.78055 4.71943L11.9999 10.9397L18.2193 4.71943C18.36 4.5787 18.5509 4.49963 18.7499 4.49963C18.949 4.49963 19.1398 4.5787 19.2806 4.71943C19.4213 4.86016 19.5003 5.05103 19.5003 5.25005C19.5003 5.44907 19.4213 5.63995 19.2806 5.78068L13.0602 12.0001L19.2806 18.2194Z" fill="#030712"/>
//             </svg>
//           </button>
//         </div>

//         {/* Content */}
//         <div style={{
//           display: 'flex',
//           padding: '24px',
//           flexDirection: 'column',
//           alignItems: 'flex-start',
//           gap: '20px',
//           alignSelf: 'stretch',
//           flex: 1, // Take up remaining space
//           overflowY: 'auto' // Allow scrolling if content exceeds
//         }}>
//           {/* First name and Last name */}
//           <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
//             <div style={{ flex: 1 }}>
//               <label style={{
//                 color: 'var(--Gray-900, #030712)',
//                 fontFamily: 'Plus Jakarta Sans, sans-serif',
//                 fontSize: '14px',
//                 fontStyle: 'normal',
//                 fontWeight: 500,
//                 lineHeight: '20px',
//                 marginBottom: '4px',
//                 display: 'block'
//               }}>First name</label>
//               <input
//                 type="text"
//                 name="firstName"
//                 value={staff.firstName}
//                 onChange={handleInputChange}
//                 style={{
//                   display: 'flex',
//                   height: '44px',
//                   padding: '10px 14px',
//                   alignItems: 'center',
//                   gap: '8px',
//                   alignSelf: 'stretch',
//                   borderRadius: '8px',
//                   border: '1px solid var(--Gray-300, #D1D5DB)',
//                   background: 'var(--White, #FFF)',
//                   width: '100%',
//                   color: 'var(--Gray-500, #4B5563)',
//                   fontFamily: 'Plus Jakarta Sans, sans-serif',
//                   fontSize: '16px',
//                   fontStyle: 'normal',
//                   fontWeight: 500,
//                   lineHeight: '24px'
//                 }}
//                 placeholder="John"
//               />
//             </div>
//             <div style={{ flex: 1 }}>
//               <label style={{
//                 color: 'var(--Gray-900, #030712)',
//                 fontFamily: 'Plus Jakarta Sans, sans-serif',
//                 fontSize: '14px',
//                 fontStyle: 'normal',
//                 fontWeight: 500,
//                 lineHeight: '20px',
//                 marginBottom: '4px',
//                 display: 'block'
//               }}>Last name</label>
//               <input
//                 type="text"
//                 name="lastName"
//                 value={staff.lastName}
//                 onChange={handleInputChange}
//                 style={{
//                   display: 'flex',
//                   height: '44px',
//                   padding: '10px 14px',
//                   alignItems: 'center',
//                   gap: '8px',
//                   alignSelf: 'stretch',
//                   borderRadius: '8px',
//                   border: '1px solid var(--Gray-300, #D1D5DB)',
//                   background: 'var(--White, #FFF)',
//                   width: '100%',
//                   color: 'var(--Gray-500, #4B5563)',
//                   fontFamily: 'Plus Jakarta Sans, sans-serif',
//                   fontSize: '16px',
//                   fontStyle: 'normal',
//                   fontWeight: 500,
//                   lineHeight: '24px'
//                 }}
//                 placeholder="Doe"
//               />
//             </div>
//           </div>

//           {/* Email */}
//           <div style={{ width: '100%' }}>
//             <label style={{
//               color: 'var(--Gray-900, #030712)',
//               fontFamily: 'Plus Jakarta Sans, sans-serif',
//               fontSize: '14px',
//               fontStyle: 'normal',
//               fontWeight: 500,
//               lineHeight: '20px',
//               marginBottom: '4px',
//               display: 'block'
//             }}>Email</label>
//             <input
//               type="email"
//               name="email"
//               value={staff.email}
//               onChange={handleInputChange}
//               style={{
//                 display: 'flex',
//                 height: '44px',
//                 padding: '10px 14px',
//                 alignItems: 'center',
//                 gap: '8px',
//                 alignSelf: 'stretch',
//                 borderRadius: '8px',
//                 border: '1px solid var(--Gray-300, #D1D5DB)',
//                 background: 'var(--White, #FFF)',
//                 width: '100%',
//                 color: 'var(--Gray-500, #4B5563)',
//                 fontFamily: 'Plus Jakarta Sans, sans-serif',
//                 fontSize: '16px',
//                 fontStyle: 'normal',
//                 fontWeight: 500,
//                 lineHeight: '24px'
//               }}
//               placeholder="john.doe@gmail.com"
//             />
//           </div>

//           <div style={{ width: '100%' }}>
//             <label style={{
//               color: 'var(--Gray-900, #030712)',
//               fontFamily: 'Plus Jakarta Sans, sans-serif',
//               fontSize: '14px',
//               fontStyle: 'normal',
//               fontWeight: 500,
//               lineHeight: '20px',
//               marginBottom: '4px',
//               display: 'block'
//             }}>Phone</label>
//             <input
//               type="tel"
//               name="phoneNumber"
//               value={staff.phoneNumber}
//               onChange={handleInputChange}
//               style={{
//                 display: 'flex',
//                 height: '44px',
//                 padding: '10px 14px',
//                 alignItems: 'center',
//                 gap: '8px',
//                 alignSelf: 'stretch',
//                 borderRadius: '8px',
//                 border: '1px solid var(--Gray-300, #D1D5DB)',
//                 background: 'var(--White, #FFF)',
//                 width: '100%',
//                 color: 'var(--Gray-500, #4B5563)',
//                 fontFamily: 'Plus Jakarta Sans, sans-serif',
//                 fontSize: '16px',
//                 fontStyle: 'normal',
//                 fontWeight: 500,
//                 lineHeight: '24px'
//               }}
//               placeholder="1234567890"
//             />
//           </div>

//           {/* Password */}
//           <div style={{ width: '100%', position: 'relative' }}>
//             <label style={{
//               color: 'var(--Gray-900, #030712)',
//               fontFamily: 'Plus Jakarta Sans, sans-serif',
//               fontSize: '14px',
//               fontWeight: 500,
//               lineHeight: '20px',
//               marginBottom: '4px',
//               display: 'block'
//             }}>Password</label>
//             <div style={{ position: 'relative' }}>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={staff.password}
//                 onChange={handleInputChange}
//                 style={{
//                   width: '100%',
//                   height: '44px',
//                   padding: '10px 40px 10px 14px', // Increased right padding for eye icon
//                   borderRadius: '8px',
//                   border: '1px solid var(--Gray-300, #D1D5DB)',
//                   background: 'var(--White, #FFF)',
//                   color: 'var(--Gray-500, #4B5563)',
//                   fontFamily: 'Plus Jakarta Sans, sans-serif',
//                   fontSize: '16px',
//                   fontWeight: 500,
//                   lineHeight: '24px'
//                 }}
//                 placeholder="Enter password"
//               />
//               <button 
//                 onClick={() => setShowPassword(!showPassword)} 
//                 style={{
//                   position: 'absolute',
//                   right: '10px',
//                   top: '50%',
//                   transform: 'translateY(-50%)',
//                   background: 'none',
//                   border: 'none',
//                   cursor: 'pointer'
//                 }}
//               >
//                 {/* Eye icon SVG */}
//                 {showPassword ? (
//                <svg className='' xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#000000" viewBox="0 0 256 256"><path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
//               ) : (
//                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#000000" viewBox="0 0 256 256"><path d="M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76Zm47.33,75.84,41.67,45.85a32,32,0,0,1-41.67-45.85ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.16,133.16,0,0,1,25,128c4.69-8.79,19.66-33.39,47.35-49.38l18,19.75a48,48,0,0,0,63.66,70l14.73,16.2A112,112,0,0,1,128,192Zm6-95.43a8,8,0,0,1,3-15.72,48.16,48.16,0,0,1,38.77,42.64,8,8,0,0,1-7.22,8.71,6.39,6.39,0,0,1-.75,0,8,8,0,0,1-8-7.26A32.09,32.09,0,0,0,134,96.57Zm113.28,34.69c-.42.94-10.55,23.37-33.36,43.8a8,8,0,1,1-10.67-11.92A132.77,132.77,0,0,0,231.05,128a133.15,133.15,0,0,0-23.12-30.77C185.67,75.19,158.78,64,128,64a118.37,118.37,0,0,0-19.36,1.57A8,8,0,1,1,106,49.79,134,134,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.83,27.3,37.62,27.65,38.41A8,8,0,0,1,247.31,131.26Z"></path></svg>
//               )}
//               </button>
//             </div>
//             {staff.password && (
//               <div style={{ 
//                 marginTop: '4px', 
//                 fontSize: '12px', 
//                 color: passwordStrength.color,
//                 height: '16px' // Fixed height for strength label
//               }}>
//                 Password strength: {passwordStrength.label}
//               </div>
//             )}
//           </div>

//           {/* Confirm Password */}
//           <div style={{ width: '100%', position: 'relative' }}>
//             <label style={{
//               color: 'var(--Gray-900, #030712)',
//               fontFamily: 'Plus Jakarta Sans, sans-serif',
//               fontSize: '14px',
//               fontStyle: 'normal',
//               fontWeight: 500,
//               lineHeight: '20px',
//               marginBottom: '4px',
//               display: 'block'
//             }}>Confirm Password</label>
//             <input
//               type={showConfirmPassword ? "text" : "password"}
//               name="confirmPassword"
//               value={staff.confirmPassword}
//               onChange={handleInputChange}
//               style={{
//                 display: 'flex',
//                 height: '44px',
//                 padding: '10px 14px',
//                 alignItems: 'center',
//                 gap: '8px',
//                 alignSelf: 'stretch',
//                 borderRadius: '8px',
//                 border: '1px solid var(--Gray-300, #D1D5DB)',
//                 background: 'var(--White, #FFF)',
//                 width: '100%',
//                 color: 'var(--Gray-500, #4B5563)',
//                 fontFamily: 'Plus Jakarta Sans, sans-serif',
//                 fontSize: '16px',
//                 fontStyle: 'normal',
//                 fontWeight: 500,
//                 lineHeight: '24px'
//               }}
//               placeholder="Confirm password"
//             />
//             <button 
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
//               style={{
//                 position: 'absolute',
//                 right: '10px',
//                 top: '70%',
//                 transform: 'translateY(-50%)',
//                 background: 'none',
//                 border: 'none',
//                 cursor: 'pointer'
//               }}
//             >
//               {showConfirmPassword ? (
//                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#000000" viewBox="0 0 256 256"><path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
//               ) : (
//                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#000000" viewBox="0 0 256 256"><path d="M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76Zm47.33,75.84,41.67,45.85a32,32,0,0,1-41.67-45.85ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.16,133.16,0,0,1,25,128c4.69-8.79,19.66-33.39,47.35-49.38l18,19.75a48,48,0,0,0,63.66,70l14.73,16.2A112,112,0,0,1,128,192Zm6-95.43a8,8,0,0,1,3-15.72,48.16,48.16,0,0,1,38.77,42.64,8,8,0,0,1-7.22,8.71,6.39,6.39,0,0,1-.75,0,8,8,0,0,1-8-7.26A32.09,32.09,0,0,0,134,96.57Zm113.28,34.69c-.42.94-10.55,23.37-33.36,43.8a8,8,0,1,1-10.67-11.92A132.77,132.77,0,0,0,231.05,128a133.15,133.15,0,0,0-23.12-30.77C185.67,75.19,158.78,64,128,64a118.37,118.37,0,0,0-19.36,1.57A8,8,0,1,1,106,49.79,134,134,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.83,27.3,37.62,27.65,38.41A8,8,0,0,1,247.31,131.26Z"></path></svg>
//               )}
//             </button>
//           </div>

//           {/* Assign role */}
//           <div style={{ width: '100%' }}>
//             <label style={{
//               color: 'var(--Gray-900, #030712)',
//               fontFamily: 'Plus Jakarta Sans, sans-serif',
//               fontSize: '14px',
//               fontStyle: 'normal',
//               fontWeight: 500,
//               lineHeight: '20px',
//               marginBottom: '4px',
//               display: 'block'
//             }}>Assign role</label>
//             <select
//               name="role"
//               value={staff.role}
//               onChange={handleInputChange}
//               style={{
//                 display: 'flex',
//                 height: '44px',
//                 padding: '10px 14px',
//                 alignItems: 'center',
//                 gap: '8px',
//                 alignSelf: 'stretch',
//                 borderRadius: '8px',
//                 border: '1px solid var(--Gray-300, #D1D5DB)',
//                 background: 'var(--White, #FFF)',
//                 width: '100%',
//                 color: 'var(--Gray-500, #4B5563)',
//                 fontFamily: 'Plus Jakarta Sans, sans-serif',
//                 fontSize: '16px',
//                 fontStyle: 'normal',
//                 fontWeight: 500,
//                 lineHeight: '24px'
//               }}
//             >
//               <option value="Select role">Select role</option>
//               <option value="Admin">Admin</option>
//               <option value="Booking Manager">Booking Manager</option>
//               <option value="Legal Documents">Legal Documents</option>
//               <option value="Construction Update">Construction Update</option>
//             </select>
//           </div>
//         </div>

//         {/* Footer */}
//         <div style={{
//           display: 'flex',
//           width: '100%',
//           padding: '20px 24px',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           borderTop: '1px solid var(--Gray-100, #E5E7EB)'
//         }}>
//           <button onClick={handleClearAll} style={{
//             color: 'var(--Gray-900, #030712)',
//             fontFamily: 'Plus Jakarta Sans, sans-serif',
//             fontSize: '16px',
//             fontStyle: 'normal',
//             fontWeight: 500,
//             lineHeight: '24px',
//             textDecorationLine: 'underline',
//             background: 'none',
//             border: 'none',
//             cursor: 'pointer'
//           }}>
//             Clear all
//           </button>
//           <button 
//             onClick={handleAdd} 
//             disabled={isAddingStaff || !staff.firstName || !staff.lastName || !staff.email || !staff.password || !staff.confirmPassword || staff.role === 'Select role' || passwordStrength.score < 3}
//             style={{
//               display: 'flex',
//               padding: '10px 20px',
//               justifyContent: 'center',
//               alignItems: 'center',
//               gap: '8px',
//               borderRadius: '8px',
//               background: (staff.firstName && staff.lastName && staff.email && staff.password && staff.confirmPassword && staff.role !== 'Select role' && !isAddingStaff && passwordStrength.score >= 3) 
//                 ? 'var(--Gray-900, #030712)' 
//                 : 'var(--Gray-300, #D1D5DB)',
//               color: 'var(--Gray-25, #F9FAFB)',
//               textAlign: 'center',
//               fontFamily: 'Plus Jakarta Sans, sans-serif',
//               fontSize: '16px',
//               fontStyle: 'normal',
//               fontWeight: 600,
//               lineHeight: '24px',
//               border: 'none',
//               cursor: (staff.firstName && staff.lastName && staff.email && staff.password && staff.confirmPassword && staff.role !== 'Select role' && !isAddingStaff &&  passwordStrength.score >= 3) 
//                 ? 'pointer' 
//                 : 'not-allowed'
//           }}>
//             {isAddingStaff ? 'Adding...' : 'Add'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddStaffModal;
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useStaff } from '../context/StaffContext';

const AddStaffModal = ({ isOpen, onClose, onAdd }) => {
  const { addStaffMember, isAddingStaff } = useStaff();
  const initialStaffState = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    roles: {
      admin: false,
      dashboard: false,
      flatManagement: false,
      userRequests: false,
      facility: false,
      bookings: false,
      visitors: false,
      parcels: false,
      notices: false,
      sosHistory: false,
      feedback: false,
      specialRequest: false,
      rentalRequest: false,
      documents: false,
      constructionUpdate: false,
      users: false,
      referrals: false,
      support: false
    },
  };
  const [staff, setStaff] = useState(initialStaffState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // For phone number, only allow digits
    if (name === 'phoneNumber') {
      const onlyDigits = value.replace(/\D/g, '');
      setStaff(prev => ({ ...prev, [name]: onlyDigits }));
    } else {
      setStaff(prev => ({ ...prev, [name]: value }));
    }
    
    setError('');
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const handleRoleChange = (e) => {
    const { name, checked } = e.target;
    
    // Special handling for admin role - if admin is selected, enable all roles
    if (name === 'admin') {
      if (checked) {
        // If admin is checked, enable all roles
        setStaff(prev => ({
          ...prev,
          roles: Object.keys(prev.roles).reduce((acc, role) => {
            acc[role] = true;
            return acc;
          }, {})
        }));
      } else {
        // If admin is unchecked, keep other roles as they are
        setStaff(prev => ({
          ...prev,
          roles: {
            ...prev.roles,
            admin: false
          }
        }));
      }
    } else {
      // For other roles, just toggle that specific role
      setStaff(prev => ({
        ...prev,
        roles: {
          ...prev.roles,
          [name]: checked,
          // If a non-admin role is unchecked, also uncheck admin
          admin: checked 
            ? prev.roles.admin 
            : false // Admin is only true if it was already true AND we're not unchecking anything
        }
      }));
    }
  };

  const checkPasswordStrength = (password) => {
    // Simple password strength check
    let score = 0;
    if (password.length >= 8) score++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) score++;
    if (password.match(/\d/)) score++;
    if (password.match(/[^a-zA-Z\d]/)) score++;

    let label = '';
    let color = '';
    if (score === 0) { label = 'Very Weak'; color = '#ff4136'; }
    else if (score === 1) { label = 'Weak'; color = '#ff851b'; }
    else if (score === 2) { label = 'Fair'; color = '#ffdc00'; }
    else if (score === 3) { label = 'Good'; color = '#2ecc40'; }
    else if (score === 4) { label = 'Strong'; color = '#0074d9'; }

    setPasswordStrength({ score, label, color });
  };

  const resetForm = () => {
    setStaff(initialStaffState);
    setError('');
  };

  const handleAdd = async () => {
    if (!staff.firstName || !staff.lastName || !staff.phoneNumber || !staff.email || !staff.password || !staff.confirmPassword || !Object.values(staff.roles).some(Boolean)) {
      toast.error("Please fill in all fields and select at least one role.");
      return;
    }

    if (staff.password !== staff.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (passwordStrength.score < 3) {
      toast.error("Please use a stronger password.");
      return;
    }

    try {
      // Format phone number to include +91 prefix if not already present
      let formattedPhoneNumber = staff.phoneNumber;
      if (formattedPhoneNumber && !formattedPhoneNumber.startsWith('+')) {
        formattedPhoneNumber = `+91${formattedPhoneNumber.replace(/^0+/, '')}`;
      }

      // Update phoneNumber with formatted value
      const staffWithFormattedPhone = {
        ...staff,
        phoneNumber: formattedPhoneNumber
      };

      const result = await addStaffMember(staffWithFormattedPhone);
      console.log("New staff added successfully: ", result);
      onAdd(result);
      resetForm();
      onClose();
      toast.success('Staff member added successfully');
    } catch (error) {
      console.error("Error adding new staff: ", error);
      toast.error(error.message || 'Failed to add staff member. Please try again.');
      setError(error.message || 'Failed to add staff member. Please try again.');
    }
  };

  const handleClearAll = () => {
    resetForm();
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const roleOptions = [
    { key: 'admin', label: 'Admin (Full Access)', description: 'Can access all features and manage staff' },
    { key: 'dashboard', label: 'Dashboard', description: 'Can access the main dashboard' },
    { key: 'flatManagement', label: 'Flat Management', description: 'Can manage flat registrations and details' },
    { key: 'userRequests', label: 'User Requests', description: 'Can handle user registration requests' },
    { key: 'facility', label: 'Facility', description: 'Can manage facility information' },
    { key: 'bookings', label: 'Bookings', description: 'Can manage facility bookings' },
    { key: 'visitors', label: 'Visitors', description: 'Can manage visitor entries and approvals' },
    { key: 'parcels', label: 'Parcels', description: 'Can manage parcel deliveries' },
    { key: 'notices', label: 'Notices', description: 'Can post and manage notices' },
    { key: 'sosHistory', label: 'SOS History', description: 'Can view emergency request history' },
    { key: 'feedback', label: 'Feedback', description: 'Can access user feedback' },
    { key: 'specialRequest', label: 'Special Request', description: 'Can handle special requests from users' },
    { key: 'rentalRequest', label: 'Rental Request', description: 'Can manage rental and tenant requests' },
    { key: 'documents', label: 'Documents', description: 'Can manage legal documents' },
    { key: 'constructionUpdate', label: 'Construction Update', description: 'Can post construction updates' },
    { key: 'users', label: 'Users', description: 'Can manage user accounts' },
    { key: 'referrals', label: 'Referrals', description: 'Can access referral information' },
    { key: 'support', label: 'Support', description: 'Can handle support requests' }
  ];

  const modalContentStyle = {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderRadius: '16px',
    background: '#FFF',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    width: '428px',
    height: '600px', // Fixed height
    overflowY: 'auto', // Allow scrolling if content exceeds height
    msOverflowStyle: 'none',  // IE and Edge
    scrollbarWidth: 'none',  // Firefox
    '&::-webkit-scrollbar': {
      display: 'none'  // Chrome, Safari and Opera
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div style={modalContentStyle}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignSelf: 'stretch',
          padding: '20px 24px',
          borderBottom: '1px solid var(--Gray-200, #E5E7EB)',
          width: '100%',
        }}>
          <div style={{ width: '24px' }}></div>
          <h2 style={{
            color: 'var(--Gray-900, #030712)',
            textAlign: 'center',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '18px',
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: '28px',
          }}>Add Staff</h2>
          <button onClick={onClose} style={{ width: '24px', height: '24px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19.2806 18.2194C19.3502 18.2891 19.4055 18.3718 19.4432 18.4629C19.4809 18.5539 19.5003 18.6515 19.5003 18.7501C19.5003 18.8486 19.4809 18.9462 19.4432 19.0372C19.4055 19.1283 19.3502 19.211 19.2806 19.2807C19.2109 19.3504 19.1281 19.4056 19.0371 19.4433C18.9461 19.4811 18.8485 19.5005 18.7499 19.5005C18.6514 19.5005 18.5538 19.4811 18.4628 19.4433C18.3717 19.4056 18.289 19.3504 18.2193 19.2807L11.9999 13.0604L5.78055 19.2807C5.63982 19.4214 5.44895 19.5005 5.24993 19.5005C5.05091 19.5005 4.86003 19.4214 4.7193 19.2807C4.57857 19.1399 4.49951 18.9491 4.49951 18.7501C4.49951 18.551 4.57857 18.3602 4.7193 18.2194L10.9396 12.0001L4.7193 5.78068C4.57857 5.63995 4.49951 5.44907 4.49951 5.25005C4.49951 5.05103 4.57857 4.86016 4.7193 4.71943C4.86003 4.5787 5.05091 4.49963 5.24993 4.49963C5.44895 4.49963 5.63982 4.5787 5.78055 4.71943L11.9999 10.9397L18.2193 4.71943C18.36 4.5787 18.5509 4.49963 18.7499 4.49963C18.949 4.49963 19.1398 4.5787 19.2806 4.71943C19.4213 4.86016 19.5003 5.05103 19.5003 5.25005C19.5003 5.44907 19.4213 5.63995 19.2806 5.78068L13.0602 12.0001L19.2806 18.2194Z" fill="#030712"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div style={{
          display: 'flex',
          padding: '24px',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '20px',
          alignSelf: 'stretch',
          flex: 1, // Take up remaining space
          overflowY: 'auto' // Allow scrolling if content exceeds
        }}>
          {/* First name and Last name */}
          <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
            <div style={{ flex: 1 }}>
              <label style={{
                color: 'var(--Gray-900, #030712)',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '20px',
                marginBottom: '4px',
                display: 'block'
              }}>First name</label>
              <input
                type="text"
                name="firstName"
                value={staff.firstName}
                onChange={handleInputChange}
                style={{
                  display: 'flex',
                  height: '44px',
                  padding: '10px 14px',
                  alignItems: 'center',
                  gap: '8px',
                  alignSelf: 'stretch',
                  borderRadius: '8px',
                  border: '1px solid var(--Gray-300, #D1D5DB)',
                  background: 'var(--White, #FFF)',
                  width: '100%',
                  color: 'var(--Gray-500, #4B5563)',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: '24px'
                }}
                placeholder="John"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{
                color: 'var(--Gray-900, #030712)',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '20px',
                marginBottom: '4px',
                display: 'block'
              }}>Last name</label>
              <input
                type="text"
                name="lastName"
                value={staff.lastName}
                onChange={handleInputChange}
                style={{
                  display: 'flex',
                  height: '44px',
                  padding: '10px 14px',
                  alignItems: 'center',
                  gap: '8px',
                  alignSelf: 'stretch',
                  borderRadius: '8px',
                  border: '1px solid var(--Gray-300, #D1D5DB)',
                  background: 'var(--White, #FFF)',
                  width: '100%',
                  color: 'var(--Gray-500, #4B5563)',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: '24px'
                }}
                placeholder="Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ width: '100%' }}>
            <label style={{
              color: 'var(--Gray-900, #030712)',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '14px',
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: '20px',
              marginBottom: '4px',
              display: 'block'
            }}>Email</label>
            <input
              type="email"
              name="email"
              value={staff.email}
              onChange={handleInputChange}
              style={{
                display: 'flex',
                height: '44px',
                padding: '10px 14px',
                alignItems: 'center',
                gap: '8px',
                alignSelf: 'stretch',
                borderRadius: '8px',
                border: '1px solid var(--Gray-300, #D1D5DB)',
                background: 'var(--White, #FFF)',
                width: '100%',
                color: 'var(--Gray-500, #4B5563)',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '24px'
              }}
              placeholder="john.doe@gmail.com"
            />
          </div>

          {/* Phone */}
          <div style={{ width: '100%' }}>
            <label style={{
              color: 'var(--Gray-900, #030712)',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '14px',
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: '20px',
              marginBottom: '4px',
              display: 'block'
            }}>Phone</label>
            <input
              type="tel"
              name="phoneNumber"
              value={staff.phoneNumber}
              onChange={handleInputChange}
              style={{
                display: 'flex',
                height: '44px',
                padding: '10px 14px',
                alignItems: 'center',
                gap: '8px',
                alignSelf: 'stretch',
                borderRadius: '8px',
                border: '1px solid var(--Gray-300, #D1D5DB)',
                background: 'var(--White, #FFF)',
                width: '100%',
                color: 'var(--Gray-500, #4B5563)',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '24px'
              }}
              placeholder="1234567890"
            />
          </div>

          {/* Password */}
          <div style={{ width: '100%', position: 'relative' }}>
            <label style={{
              color: 'var(--Gray-900, #030712)',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '20px',
              marginBottom: '4px',
              display: 'block'
            }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={staff.password}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '10px 40px 10px 14px', // Increased right padding for eye icon
                  borderRadius: '8px',
                  border: '1px solid var(--Gray-300, #D1D5DB)',
                  background: 'var(--White, #FFF)',
                  color: 'var(--Gray-500, #4B5563)',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: '24px'
                }}
                placeholder="Enter password"
              />
              <button 
                onClick={() => setShowPassword(!showPassword)} 
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
                type="button"
              >
                {/* Eye icon SVG */}
                {showPassword ? (
                  <svg className='' xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#000000" viewBox="0 0 256 256"><path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#000000" viewBox="0 0 256 256"><path d="M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76Zm47.33,75.84,41.67,45.85a32,32,0,0,1-41.67-45.85ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.16,133.16,0,0,1,25,128c4.69-8.79,19.66-33.39,47.35-49.38l18,19.75a48,48,0,0,0,63.66,70l14.73,16.2A112,112,0,0,1,128,192Zm6-95.43a8,8,0,0,1,3-15.72,48.16,48.16,0,0,1,38.77,42.64,8,8,0,0,1-7.22,8.71,6.39,6.39,0,0,1-.75,0,8,8,0,0,1-8-7.26A32.09,32.09,0,0,0,134,96.57Zm113.28,34.69c-.42.94-10.55,23.37-33.36,43.8a8,8,0,1,1-10.67-11.92A132.77,132.77,0,0,0,231.05,128a133.15,133.15,0,0,0-23.12-30.77C185.67,75.19,158.78,64,128,64a118.37,118.37,0,0,0-19.36,1.57A8,8,0,1,1,106,49.79,134,134,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.83,27.3,37.62,27.65,38.41A8,8,0,0,1,247.31,131.26Z"></path></svg>
                )}
              </button>
            </div>
            {staff.password && (
              <div style={{ 
                marginTop: '4px', 
                fontSize: '12px', 
                color: passwordStrength.color,
                height: '16px' // Fixed height for strength label
              }}>
                Password strength: {passwordStrength.label}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div style={{ width: '100%', position: 'relative' }}>
            <label style={{
              color: 'var(--Gray-900, #030712)',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '14px',
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: '20px',
              marginBottom: '4px',
              display: 'block'
            }}>Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={staff.confirmPassword}
              onChange={handleInputChange}
              style={{
                display: 'flex',
                height: '44px',
                padding: '10px 14px',
                alignItems: 'center',
                gap: '8px',
                alignSelf: 'stretch',
                borderRadius: '8px',
                border: '1px solid var(--Gray-300, #D1D5DB)',
                background: 'var(--White, #FFF)',
                width: '100%',
                color: 'var(--Gray-500, #4B5563)',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '24px'
              }}
              placeholder="Confirm password"
            />
            <button 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
              style={{
                position: 'absolute',
                right: '10px',
                top: '70%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
              type="button"
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#000000" viewBox="0 0 256 256"><path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#000000" viewBox="0 0 256 256"><path d="M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76Zm47.33,75.84,41.67,45.85a32,32,0,0,1-41.67-45.85ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.16,133.16,0,0,1,25,128c4.69-8.79,19.66-33.39,47.35-49.38l18,19.75a48,48,0,0,0,63.66,70l14.73,16.2A112,112,0,0,1,128,192Zm6-95.43a8,8,0,0,1,3-15.72,48.16,48.16,0,0,1,38.77,42.64,8,8,0,0,1-7.22,8.71,6.39,6.39,0,0,1-.75,0,8,8,0,0,1-8-7.26A32.09,32.09,0,0,0,134,96.57Zm113.28,34.69c-.42.94-10.55,23.37-33.36,43.8a8,8,0,1,1-10.67-11.92A132.77,132.77,0,0,0,231.05,128a133.15,133.15,0,0,0-23.12-30.77C185.67,75.19,158.78,64,128,64a118.37,118.37,0,0,0-19.36,1.57A8,8,0,1,1,106,49.79,134,134,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.83,27.3,37.62,27.65,38.41A8,8,0,0,1,247.31,131.26Z"></path></svg>
              )}
            </button>
          </div>

          {/* Assign roles - Checkbox Group */}
          <div style={{ width: '100%' }}>
            <label style={{
              color: 'var(--Gray-900, #030712)',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '14px',
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: '20px',
              marginBottom: '8px',
              display: 'block'
            }}>Assign roles</label>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '16px',
              border: '1px solid var(--Gray-200, #E5E7EB)',
              borderRadius: '8px',
              background: '#F9FAFB',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {/* Admin role at the top */}
              <div key="admin" style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '10px',
                paddingBottom: '10px',
                borderBottom: '1px solid var(--Gray-200, #E5E7EB)'
              }}>
                <input
                  type="checkbox"
                  id="role-admin"
                  name="admin"
                  checked={staff.roles.admin}
                  onChange={handleRoleChange}
                  style={{
                    width: '18px',
                    height: '18px',
                    marginTop: '2px'
                  }}
                />
                <div>
                  <label 
                    htmlFor="role-admin"
                    style={{
                      color: 'var(--Gray-900, #030712)',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontSize: '15px',
                      fontWeight: 600,
                      lineHeight: '20px',
                      display: 'block',
                      cursor: 'pointer'
                    }}
                  >
                    Admin (Full Access)
                  </label>
                  <p style={{
                    color: 'var(--Gray-500, #6B7280)',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '12px',
                    lineHeight: '18px',
                    marginTop: '2px'
                  }}>
                    Can access all features and manage all areas of the application
                  </p>
                </div>
              </div>
              
              {/* Other roles */}
              {roleOptions.filter(role => role.key !== 'admin').map((role) => (
                <div key={role.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <input
                    type="checkbox"
                    id={`role-${role.key}`}
                    name={role.key}
                    checked={staff.roles[role.key]}
                    onChange={handleRoleChange}
                    style={{
                      width: '18px',
                      height: '18px',
                      marginTop: '2px'
                    }}
                  />
                  <div>
                    <label 
                      htmlFor={`role-${role.key}`}
                      style={{
                        color: 'var(--Gray-900, #030712)',
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontSize: '14px',
                        fontWeight: 500,
                        lineHeight: '20px',
                        display: 'block',
                        cursor: 'pointer'
                      }}
                    >
                      {role.label}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          width: '100%',
          padding: '20px 24px',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--Gray-100, #E5E7EB)'
        }}>
          <button onClick={handleClearAll} style={{
            color: 'var(--Gray-900, #030712)',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: '24px',
            textDecorationLine: 'underline',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}>
            Clear all
          </button>
          <button 
            onClick={handleAdd} 
            disabled={isAddingStaff || 
              !staff.firstName || 
              !staff.lastName || 
              !staff.email || 
              !staff.password || 
              !staff.confirmPassword || 
              !Object.values(staff.roles).some(Boolean) || 
              passwordStrength.score < 3}
            style={{
              display: 'flex',
              padding: '10px 20px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '8px',
              background: (staff.firstName && 
                staff.lastName && 
                staff.email && 
                staff.password && 
                staff.confirmPassword && 
                Object.values(staff.roles).some(Boolean) && 
                !isAddingStaff && 
                passwordStrength.score >= 3) 
                  ? 'var(--Gray-900, #030712)' 
                  : 'var(--Gray-300, #D1D5DB)',
              color: 'var(--Gray-25, #F9FAFB)',
              textAlign: 'center',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '16px',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: '24px',
              border: 'none',
              minWidth: '100px',
              cursor: (staff.firstName && 
                staff.lastName && 
                staff.email && 
                staff.password && 
                staff.confirmPassword && 
                Object.values(staff.roles).some(Boolean) && 
                !isAddingStaff && 
                passwordStrength.score >= 3) 
                  ? 'pointer' 
                  : 'not-allowed'
          }}>
            {isAddingStaff ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg 
                  style={{ 
                    animation: 'spin 1s linear infinite',
                    height: '20px',
                    width: '20px',
                    marginRight: '8px'
                  }} 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                    opacity="0.25"
                  ></circle>
                  <path 
                    fill="currentColor" 
                    opacity="0.75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Adding...
              </div>
            ) : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStaffModal;