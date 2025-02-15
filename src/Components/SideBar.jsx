// // import React from 'react'
// import React, { useState, useEffect } from 'react';
// import Logo from "../Images/logo.png";
// import UserImg from "../Images/profile.png";
// import dashImag from '../Images/image 2.svg'
// import styles from './CustomScrollbar.module.css';
// import './../App.css';
// import './../index.css';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { toast } from 'react-toastify';


// const SideBar = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();
  
//   const isActive = (path) => {
//     return location.pathname === path ? "bg-gray-100" : "";
//   }

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   const handleLogout = async () => {
//     try {
//       await logout();
//       toast.error('Logged out successfully');
//       navigate('/login')
//     } catch (error) {
//       console.error('Logout error:', error);
//       toast.error('Failed to logout');
//     }
//   }

//   const getVisibleLinks = () => {
//     const links = [];
    
//     // Dashboard is visible only to admin
//     if (user.roles?.admin) {
//       links.push(
//         <li key="dashboard" >
//           <Link to='/' className={`flex  items-center ml-2 p-3 text-gray-600 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${isActive('/')}`}>
//           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//   <path d="M9.75 3.75H5.25C4.85218 3.75 4.47064 3.90804 4.18934 4.18934C3.90804 4.47064 3.75 4.85218 3.75 5.25V9.75C3.75 10.1478 3.90804 10.5294 4.18934 10.8107C4.47064 11.092 4.85218 11.25 5.25 11.25H9.75C10.1478 11.25 10.5294 11.092 10.8107 10.8107C11.092 10.5294 11.25 10.1478 11.25 9.75V5.25C11.25 4.85218 11.092 4.47064 10.8107 4.18934C10.5294 3.90804 10.1478 3.75 9.75 3.75ZM9.75 9.75H5.25V5.25H9.75V9.75ZM18.75 3.75H14.25C13.8522 3.75 13.4706 3.90804 13.1893 4.18934C12.908 4.47064 12.75 4.85218 12.75 5.25V9.75C12.75 10.1478 12.908 10.5294 13.1893 10.8107C13.4706 11.092 13.8522 11.25 14.25 11.25H18.75C19.1478 11.25 19.5294 11.092 19.8107 10.8107C20.092 10.5294 20.25 10.1478 20.25 9.75V5.25C20.25 4.85218 20.092 4.47064 19.8107 4.18934C19.5294 3.90804 19.1478 3.75 18.75 3.75ZM18.75 9.75H14.25V5.25H18.75V9.75ZM9.75 12.75H5.25C4.85218 12.75 4.47064 12.908 4.18934 13.1893C3.90804 13.4706 3.75 13.8522 3.75 14.25V18.75C3.75 19.1478 3.90804 19.5294 4.18934 19.8107C4.47064 20.092 4.85218 20.25 5.25 20.25H9.75C10.1478 20.25 10.5294 20.092 10.8107 19.8107C11.092 19.5294 11.25 19.1478 11.25 18.75V14.25C11.25 13.8522 11.092 13.4706 10.8107 13.1893C10.5294 12.908 10.1478 12.75 9.75 12.75ZM9.75 18.75H5.25V14.25H9.75V18.75ZM18.75 12.75H14.25C13.8522 12.75 13.4706 12.908 13.1893 13.1893C12.908 13.4706 12.75 13.8522 12.75 14.25V18.75C12.75 19.1478 12.908 19.5294 13.1893 19.8107C13.4706 20.092 13.8522 20.25 14.25 20.25H18.75C19.1478 20.25 19.5294 20.092 19.8107 19.8107C20.092 19.5294 20.25 19.1478 20.25 18.75V14.25C20.25 13.8522 20.092 13.4706 19.8107 13.1893C19.5294 12.908 19.1478 12.75 18.75 12.75ZM18.75 18.75H14.25V14.25H18.75V18.75Z" fill="#4B5563"/>
// </svg>
//             <span className="flex-1 ms-3 whitespace-nowrap" style={{fontSize: '16px', fontStyle: 'normal', fontWeight: '500', lineHeight: '24px', color: 'var(--Gray-500, #4B5563)'}}>Dashboard</span>
//           </Link>
//         </li>
//       );
//     }

//     if (user.roles?.admin || user.roles?.booking) {
//       links.push(
//         <li key="bookings" >
//           <Link to='/booking' className={`flex  items-center ml-2 p-3 text-gray-600 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${isActive('/booking')}`}>
//           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//   <path d="M19.5 3H17.25V2.25C17.25 2.05109 17.171 1.86032 17.0303 1.71967C16.8897 1.57902 16.6989 1.5 16.5 1.5C16.3011 1.5 16.1103 1.57902 15.9697 1.71967C15.829 1.86032 15.75 2.05109 15.75 2.25V3H8.25V2.25C8.25 2.05109 8.17098 1.86032 8.03033 1.71967C7.88968 1.57902 7.69891 1.5 7.5 1.5C7.30109 1.5 7.11032 1.57902 6.96967 1.71967C6.82902 1.86032 6.75 2.05109 6.75 2.25V3H4.5C4.10218 3 3.72064 3.15804 3.43934 3.43934C3.15804 3.72064 3 4.10218 3 4.5V19.5C3 19.8978 3.15804 20.2794 3.43934 20.5607C3.72064 20.842 4.10218 21 4.5 21H19.5C19.8978 21 20.2794 20.842 20.5607 20.5607C20.842 20.2794 21 19.8978 21 19.5V4.5C21 4.10218 20.842 3.72064 20.5607 3.43934C20.2794 3.15804 19.8978 3 19.5 3ZM6.75 4.5V5.25C6.75 5.44891 6.82902 5.63968 6.96967 5.78033C7.11032 5.92098 7.30109 6 7.5 6C7.69891 6 7.88968 5.92098 8.03033 5.78033C8.17098 5.63968 8.25 5.44891 8.25 5.25V4.5H15.75V5.25C15.75 5.44891 15.829 5.63968 15.9697 5.78033C16.1103 5.92098 16.3011 6 16.5 6C16.6989 6 16.8897 5.92098 17.0303 5.78033C17.171 5.63968 17.25 5.44891 17.25 5.25V4.5H19.5V7.5H4.5V4.5H6.75ZM19.5 19.5H4.5V9H19.5V19.5ZM13.125 12.375C13.125 12.5975 13.059 12.815 12.9354 13C12.8118 13.185 12.6361 13.3292 12.4305 13.4144C12.225 13.4995 11.9988 13.5218 11.7805 13.4784C11.5623 13.435 11.3618 13.3278 11.2045 13.1705C11.0472 13.0132 10.94 12.8127 10.8966 12.5945C10.8532 12.3762 10.8755 12.15 10.9606 11.9445C11.0458 11.7389 11.19 11.5632 11.375 11.4396C11.56 11.316 11.7775 11.25 12 11.25C12.2984 11.25 12.5845 11.3685 12.7955 11.5795C13.0065 11.7905 13.125 12.0766 13.125 12.375ZM17.25 12.375C17.25 12.5975 17.184 12.815 17.0604 13C16.9368 13.185 16.7611 13.3292 16.5555 13.4144C16.35 13.4995 16.1238 13.5218 15.9055 13.4784C15.6873 13.435 15.4868 13.3278 15.3295 13.1705C15.1722 13.0132 15.065 12.8127 15.0216 12.5945C14.9782 12.3762 15.0005 12.15 15.0856 11.9445C15.1708 11.7389 15.315 11.5632 15.5 11.4396C15.685 11.316 15.9025 11.25 16.125 11.25C16.4234 11.25 16.7095 11.3685 16.9205 11.5795C17.1315 11.7905 17.25 12.0766 17.25 12.375ZM9 16.125C9 16.3475 8.93402 16.565 8.8104 16.75C8.68679 16.935 8.51109 17.0792 8.30552 17.1644C8.09995 17.2495 7.87375 17.2718 7.65552 17.2284C7.43729 17.185 7.23684 17.0778 7.0795 16.9205C6.92217 16.7632 6.81502 16.5627 6.77162 16.3445C6.72821 16.1262 6.75049 15.9 6.83564 15.6945C6.92078 15.4889 7.06498 15.3132 7.24998 15.1896C7.43499 15.066 7.6525 15 7.875 15C8.17337 15 8.45952 15.1185 8.6705 15.3295C8.88147 15.5405 9 15.8266 9 16.125ZM13.125 16.125C13.125 16.3475 13.059 16.565 12.9354 16.75C12.8118 16.935 12.6361 17.0792 12.4305 17.1644C12.225 17.2495 11.9988 17.2718 11.7805 17.2284C11.5623 17.185 11.3618 17.0778 11.2045 16.9205C11.0472 16.7632 10.94 16.5627 10.8966 16.3445C10.8532 16.1262 10.8755 15.9 10.9606 15.6945C11.0458 15.4889 11.19 15.3132 11.375 15.1896C11.56 15.066 11.7775 15 12 15C12.2984 15 12.5845 15.1185 12.7955 15.3295C13.0065 15.5405 13.125 15.8266 13.125 16.125ZM17.25 16.125C17.25 16.3475 17.184 16.565 17.0604 16.75C16.9368 16.935 16.7611 17.0792 16.5555 17.1644C16.35 17.2495 16.1238 17.2718 15.9055 17.2284C15.6873 17.185 15.4868 17.0778 15.3295 16.9205C15.1722 16.7632 15.065 16.5627 15.0216 16.3445C14.9782 16.1262 15.0005 15.9 15.0856 15.6945C15.1708 15.4889 15.315 15.3132 15.5 15.1896C15.685 15.066 15.9025 15 16.125 15C16.4234 15 16.7095 15.1185 16.9205 15.3295C17.1315 15.5405 17.25 15.8266 17.25 16.125Z" fill="#4B5563"/>
// </svg>
//             <span className="flex-1 ms-3 whitespace-nowrap" style={{fontSize: '16px', fontStyle: 'normal', fontWeight: '500', lineHeight: '24px', color: 'var(--Gray-500, #4B5563)'}}>Bookings</span>
//           </Link>
//         </li>
//       );
//     }

//     if (user.roles?.admin || user.roles?.documents) {
//       links.push(
//         <li key="documents">
//           <Link to='/document' className={`flex  items-center ml-2 p-3 text-gray-600 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${isActive('/document')}`}>
//           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//   <path d="M20.0306 6.21938L16.2806 2.46938C16.2109 2.39975 16.1282 2.34454 16.0371 2.3069C15.9461 2.26926 15.8485 2.24992 15.75 2.25H8.25C7.85218 2.25 7.47064 2.40804 7.18934 2.68934C6.90804 2.97064 6.75 3.35218 6.75 3.75V5.25H5.25C4.85218 5.25 4.47064 5.40804 4.18934 5.68934C3.90804 5.97064 3.75 6.35218 3.75 6.75V20.25C3.75 20.6478 3.90804 21.0294 4.18934 21.3107C4.47064 21.592 4.85218 21.75 5.25 21.75H15.75C16.1478 21.75 16.5294 21.592 16.8107 21.3107C17.092 21.0294 17.25 20.6478 17.25 20.25V18.75H18.75C19.1478 18.75 19.5294 18.592 19.8107 18.3107C20.092 18.0294 20.25 17.6478 20.25 17.25V6.75C20.2501 6.65148 20.2307 6.55391 20.1931 6.46286C20.1555 6.37182 20.1003 6.28908 20.0306 6.21938ZM15.75 20.25H5.25V6.75H12.4397L15.75 10.0603V17.985C15.75 17.9906 15.75 17.9953 15.75 18C15.75 18.0047 15.75 18.0094 15.75 18.015V20.25ZM18.75 17.25H17.25V9.75C17.2501 9.65148 17.2307 9.55391 17.1931 9.46286C17.1555 9.37182 17.1003 9.28908 17.0306 9.21937L13.2806 5.46938C13.2109 5.39975 13.1282 5.34454 13.0371 5.3069C12.9461 5.26926 12.8485 5.24992 12.75 5.25H8.25V3.75H15.4397L18.75 7.06031V17.25ZM13.5 14.25C13.5 14.4489 13.421 14.6397 13.2803 14.7803C13.1397 14.921 12.9489 15 12.75 15H8.25C8.05109 15 7.86032 14.921 7.71967 14.7803C7.57902 14.6397 7.5 14.4489 7.5 14.25C7.5 14.0511 7.57902 13.8603 7.71967 13.7197C7.86032 13.579 8.05109 13.5 8.25 13.5H12.75C12.9489 13.5 13.1397 13.579 13.2803 13.7197C13.421 13.8603 13.5 14.0511 13.5 14.25ZM13.5 17.25C13.5 17.4489 13.421 17.6397 13.2803 17.7803C13.1397 17.921 12.9489 18 12.75 18H8.25C8.05109 18 7.86032 17.921 7.71967 17.7803C7.57902 17.6397 7.5 17.4489 7.5 17.25C7.5 17.0511 7.57902 16.8603 7.71967 16.7197C7.86032 16.579 8.05109 16.5 8.25 16.5H12.75C12.9489 16.5 13.1397 16.579 13.2803 16.7197C13.421 16.8603 13.5 17.0511 13.5 17.25Z" fill="#4B5563"/>
// </svg>
//             <span className="flex-1 ms-3 whitespace-nowrap" style={{fontSize: '16px', fontStyle: 'normal', fontWeight: '500', lineHeight: '24px', color: 'var(--Gray-500, #4B5563)'}}>Documents</span>
//           </Link>
//         </li>
//       );
//     }

//     if (user.roles?.admin || user.roles?.constructionUpdate) {
//       links.push(
//         <li key="construction">
//           <Link to="/construction" className={`flex  items-center ml-2 p-3 text-gray-600 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${isActive('/construction')}`}>
//           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//   <path d="M21 4.49995V8.99995C21 9.19886 20.921 9.38962 20.7803 9.53028C20.6397 9.67093 20.4489 9.74995 20.25 9.74995H15.75C15.5511 9.74995 15.3603 9.67093 15.2197 9.53028C15.079 9.38962 15 9.19886 15 8.99995C15 8.80103 15.079 8.61027 15.2197 8.46962C15.3603 8.32896 15.5511 8.24995 15.75 8.24995H18.4397L17.0681 6.87838C15.6742 5.47814 13.7817 4.68815 11.8059 4.68182H11.7638C9.80454 4.67723 7.92227 5.44408 6.52406 6.81651C6.38083 6.95022 6.19096 7.02256 5.99507 7.01807C5.79918 7.01358 5.61283 6.9326 5.47588 6.79247C5.33893 6.65233 5.26226 6.46417 5.26227 6.26823C5.26228 6.07229 5.33897 5.88413 5.47594 5.74401C7.1705 4.08782 9.44983 3.16671 11.8193 3.18057C14.1887 3.19444 16.4571 4.14216 18.1322 5.81807L19.5 7.18963V4.49995C19.5 4.30103 19.579 4.11027 19.7197 3.96962C19.8603 3.82896 20.0511 3.74995 20.25 3.74995C20.4489 3.74995 20.6397 3.82896 20.7803 3.96962C20.921 4.11027 21 4.30103 21 4.49995ZM17.4759 17.1834C16.0639 18.5627 14.1651 19.3297 12.1912 19.3181C10.2173 19.3065 8.32762 18.5173 6.93188 17.1215L5.56031 15.7499H8.25C8.44891 15.7499 8.63968 15.6709 8.78033 15.5303C8.92098 15.3896 9 15.1989 9 14.9999C9 14.801 8.92098 14.6103 8.78033 14.4696C8.63968 14.329 8.44891 14.2499 8.25 14.2499H3.75C3.55109 14.2499 3.36032 14.329 3.21967 14.4696C3.07902 14.6103 3 14.801 3 14.9999V19.4999C3 19.6989 3.07902 19.8896 3.21967 20.0303C3.36032 20.1709 3.55109 20.2499 3.75 20.2499C3.94891 20.2499 4.13968 20.1709 4.28033 20.0303C4.42098 19.8896 4.5 19.6989 4.5 19.4999V16.8103L5.87156 18.1818C7.54426 19.8629 9.816 20.8112 12.1875 20.8181H12.2372C14.5885 20.8241 16.8476 19.9036 18.525 18.2559C18.662 18.1158 18.7387 17.9276 18.7387 17.7317C18.7387 17.5357 18.662 17.3476 18.5251 17.2074C18.3881 17.0673 18.2018 16.9863 18.0059 16.9818C17.81 16.9773 17.6201 17.0497 17.4769 17.1834H17.4759Z" fill="#4B5563"/>
// </svg>
//             <span className="flex-1 ms-3 whitespace-nowrap" style={{fontSize: '16px', fontStyle: 'normal', fontWeight: '500', lineHeight: '24px', color: 'var(--Gray-500, #4B5563)'}}>Construction Update</span>
//           </Link>
//         </li>
//       );
//     }

//     // Only Admin can see these links
//     if (user.roles?.admin) {
//       links.push(
//         <li key="feedback">
//           <Link to='/feedback' className={`flex  items-center ml-2 p-3 text-gray-600 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${isActive('/feedback')}`}>
//           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//   <path d="M20.25 4.5H3.75003C3.3522 4.5 2.97067 4.65804 2.68937 4.93934C2.40806 5.22064 2.25003 5.60218 2.25003 6V21C2.24833 21.2859 2.32916 21.5662 2.48281 21.8074C2.63646 22.0485 2.85641 22.2401 3.11628 22.3594C3.31486 22.4516 3.53109 22.4996 3.75003 22.5C4.10215 22.4992 4.4426 22.3736 4.71096 22.1456L4.7194 22.1391L7.78128 19.5H20.25C20.6479 19.5 21.0294 19.342 21.3107 19.0607C21.592 18.7794 21.75 18.3978 21.75 18V6C21.75 5.60218 21.592 5.22064 21.3107 4.93934C21.0294 4.65804 20.6479 4.5 20.25 4.5ZM20.25 18H7.50003C7.31994 18.0001 7.1459 18.065 7.00971 18.1828L3.75003 21V6H20.25V18ZM8.25003 10.5C8.25003 10.3011 8.32904 10.1103 8.4697 9.96967C8.61035 9.82902 8.80111 9.75 9.00003 9.75H15C15.1989 9.75 15.3897 9.82902 15.5304 9.96967C15.671 10.1103 15.75 10.3011 15.75 10.5C15.75 10.6989 15.671 10.8897 15.5304 11.0303C15.3897 11.171 15.1989 11.25 15 11.25H9.00003C8.80111 11.25 8.61035 11.171 8.4697 11.0303C8.32904 10.8897 8.25003 10.6989 8.25003 10.5ZM8.25003 13.5C8.25003 13.3011 8.32904 13.1103 8.4697 12.9697C8.61035 12.829 8.80111 12.75 9.00003 12.75H15C15.1989 12.75 15.3897 12.829 15.5304 12.9697C15.671 13.1103 15.75 13.3011 15.75 13.5C15.75 13.6989 15.671 13.8897 15.5304 14.0303C15.3897 14.171 15.1989 14.25 15 14.25H9.00003C8.80111 14.25 8.61035 14.171 8.4697 14.0303C8.32904 13.8897 8.25003 13.6989 8.25003 13.5Z" fill="#4B5563"/>
// </svg>
//             <span className="flex-1 ms-3 whitespace-nowrap" style={{fontSize: '16px', fontStyle: 'normal', fontWeight: '500', lineHeight: '24px', color: 'var(--Gray-500, #4B5563)'}}>Feedback</span>
//           </Link>
//         </li>,
//         <li key="special_request">
//           <Link to='/special_request' className={`flex  items-center ml-2 p-3 text-gray-600 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${isActive('/special_request')}`}>
//           <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
//   <path d="M18.5306 3.46935L15.5306 0.469355C15.461 0.399622 15.3783 0.344303 15.2872 0.30656C15.1962 0.268816 15.0986 0.24939 15 0.24939C14.9014 0.24939 14.8038 0.268816 14.7128 0.30656C14.6217 0.344303 14.539 0.399622 14.4694 0.469355L5.46937 9.46935C5.39975 9.53906 5.34454 9.6218 5.3069 9.71284C5.26926 9.80389 5.24992 9.90146 5.25 9.99998V13C5.25 13.1989 5.32902 13.3897 5.46967 13.5303C5.61032 13.671 5.80109 13.75 6 13.75H9C9.09852 13.7501 9.19609 13.7307 9.28714 13.6931C9.37818 13.6554 9.46092 13.6002 9.53063 13.5306L18.5306 4.53061C18.6004 4.46095 18.6557 4.37823 18.6934 4.28718C18.7312 4.19614 18.7506 4.09854 18.7506 3.99998C18.7506 3.90142 18.7312 3.80382 18.6934 3.71277C18.6557 3.62173 18.6004 3.53901 18.5306 3.46935ZM8.68969 12.25H6.75V10.3103L12.75 4.31029L14.6897 6.24998L8.68969 12.25ZM15.75 5.18967L13.8103 3.24998L15 2.06029L16.9397 3.99998L15.75 5.18967ZM18 9.99998V17.5C18 17.8978 17.842 18.2793 17.5607 18.5606C17.2794 18.8419 16.8978 19 16.5 19H1.5C1.10218 19 0.720644 18.8419 0.43934 18.5606C0.158035 18.2793 0 17.8978 0 17.5V2.49998C0 2.10215 0.158035 1.72062 0.43934 1.43932C0.720644 1.15801 1.10218 0.99998 1.5 0.99998H9C9.19891 0.99998 9.38968 1.079 9.53033 1.21965C9.67098 1.3603 9.75 1.55107 9.75 1.74998C9.75 1.94889 9.67098 2.13966 9.53033 2.28031C9.38968 2.42096 9.19891 2.49998 9 2.49998H1.5V17.5H16.5V9.99998C16.5 9.80107 16.579 9.6103 16.7197 9.46965C16.8603 9.329 17.0511 9.24998 17.25 9.24998C17.4489 9.24998 17.6397 9.329 17.7803 9.46965C17.921 9.6103 18 9.80107 18 9.99998Z" fill="#4B5563"/>
// </svg>
//             {/* <svg className="ml-1" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> */}
//               {/* <path d="M21.5306 5.46935L18.5306 2.46935C18.461 2.39962 18.3783 2.3443 18.2872 2.30656C18.1962 2.26882 18.0986 2.24939 18 2.24939C17.9014 2.24939 17.8038 2.26882 17.7128 2.30656C17.6217 2.3443 17.539 2.39962 17.4694 2.46935L8.46937 11.4694C8.39975 11.5391 8.34454 11.6218 8.3069 11.7128C8.26926 11.8039 8.24992 11.9015 8.25 12V15C8.25 */}
//               <span className="flex-1 ms-3 whitespace-nowrap" style={{fontSize: '16px', fontStyle: 'normal', fontWeight: '500', lineHeight: '24px', color: 'var(--Gray-500, #4B5563)'}}>Special Request</span>
//           </Link>
//         </li>,
//         <li key="users">
//           <Link to='/user' className={`flex  items-center ml-2 p-3 text-gray-600 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${isActive('/user')}`}>
//           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//   <path d="M12 2.25C10.0716 2.25 8.18657 2.82183 6.58319 3.89317C4.97982 4.96451 3.73013 6.48726 2.99218 8.26884C2.25422 10.0504 2.06114 12.0108 2.43735 13.9021C2.81355 15.7934 3.74215 17.5307 5.10571 18.8943C6.46928 20.2579 8.20656 21.1865 10.0979 21.5627C11.9892 21.9389 13.9496 21.7458 15.7312 21.0078C17.5127 20.2699 19.0355 19.0202 20.1068 17.4168C21.1782 15.8134 21.75 13.9284 21.75 12C21.7473 9.41498 20.7192 6.93661 18.8913 5.10872C17.0634 3.28084 14.585 2.25273 12 2.25ZM6.945 18.5156C7.48757 17.6671 8.23501 16.9688 9.11843 16.4851C10.0019 16.0013 10.9928 15.7478 12 15.7478C13.0072 15.7478 13.9982 16.0013 14.8816 16.4851C15.765 16.9688 16.5124 17.6671 17.055 18.5156C15.6097 19.6397 13.831 20.2499 12 20.2499C10.169 20.2499 8.39032 19.6397 6.945 18.5156ZM9 11.25C9 10.6567 9.17595 10.0766 9.5056 9.58329C9.83524 9.08994 10.3038 8.70542 10.852 8.47836C11.4001 8.2513 12.0033 8.19189 12.5853 8.30764C13.1672 8.4234 13.7018 8.70912 14.1213 9.12868C14.5409 9.54824 14.8266 10.0828 14.9424 10.6647C15.0581 11.2467 14.9987 11.8499 14.7716 12.3981C14.5446 12.9462 14.1601 13.4148 13.6667 13.7444C13.1734 14.0741 12.5933 14.25 12 14.25C11.2044 14.25 10.4413 13.9339 9.87868 13.3713C9.31607 12.8087 9 12.0456 9 11.25ZM18.165 17.4759C17.3285 16.2638 16.1524 15.3261 14.7844 14.7806C15.5192 14.2019 16.0554 13.4085 16.3184 12.5108C16.5815 11.6132 16.5582 10.6559 16.252 9.77207C15.9457 8.88825 15.3716 8.12183 14.6096 7.5794C13.8475 7.03696 12.9354 6.74548 12 6.74548C11.0646 6.74548 10.1525 7.03696 9.39044 7.5794C8.62839 8.12183 8.05432 8.88825 7.74805 9.77207C7.44179 10.6559 7.41855 11.6132 7.68157 12.5108C7.94459 13.4085 8.4808 14.2019 9.21563 14.7806C7.84765 15.3261 6.67147 16.2638 5.835 17.4759C4.77804 16.2873 4.0872 14.8185 3.84567 13.2464C3.60415 11.6743 3.82224 10.0658 4.47368 8.61478C5.12512 7.16372 6.18213 5.93192 7.51745 5.06769C8.85276 4.20346 10.4094 3.74367 12 3.74367C13.5906 3.74367 15.1473 4.20346 16.4826 5.06769C17.8179 5.93192 18.8749 7.16372 19.5263 8.61478C20.1778 10.0658 20.3959 11.6743 20.1543 13.2464C19.9128 14.8185 19.222 16.2873 18.165 17.4759Z" fill="#4B5563"/>
// </svg>
//             <span className="flex-1 ms-3 whitespace-nowrap" style={{fontSize: '16px', fontStyle: 'normal', fontWeight: '500', lineHeight: '24px', color: 'var(--Gray-500, #4B5563)'}}>Users</span>
//           </Link>
//         </li>,
//         <li key="referrals">
//           <Link to='/referrals' className={`flex  items-center ml-2 p-3 text-gray-600 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${isActive('/referrals')}`}>
//           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//   <path d="M20.25 6.75009H16.9613C16.9978 6.71915 17.0353 6.68915 17.0709 6.65634C17.3557 6.40338 17.5851 6.09439 17.745 5.7487C17.9049 5.40301 17.9917 5.02805 18 4.64728C18.0123 4.23072 17.9394 3.81604 17.7856 3.4287C17.6319 3.04136 17.4006 2.68953 17.106 2.39481C16.8113 2.10008 16.4596 1.86869 16.0723 1.71483C15.685 1.56097 15.2703 1.4879 14.8538 1.50009C14.4728 1.50829 14.0977 1.59504 13.7518 1.75491C13.406 1.91477 13.0968 2.14431 12.8438 2.42915C12.4936 2.83499 12.2089 3.293 12 3.78665C11.7911 3.293 11.5064 2.83499 11.1562 2.42915C10.9032 2.14431 10.594 1.91477 10.2482 1.75491C9.90232 1.59504 9.52718 1.50829 9.14625 1.50009C8.72969 1.4879 8.31503 1.56097 7.92774 1.71483C7.54044 1.86869 7.18868 2.10008 6.89405 2.39481C6.59941 2.68953 6.36812 3.04136 6.21438 3.4287C6.06064 3.81604 5.98768 4.23072 6 4.64728C6.00833 5.02805 6.09514 5.40301 6.255 5.7487C6.41486 6.09439 6.64434 6.40338 6.92906 6.65634C6.96469 6.68728 7.00219 6.71728 7.03875 6.75009H3.75C3.35218 6.75009 2.97064 6.90812 2.68934 7.18943C2.40804 7.47073 2.25 7.85226 2.25 8.25009V11.2501C2.25 11.6479 2.40804 12.0294 2.68934 12.3107C2.97064 12.5921 3.35218 12.7501 3.75 12.7501V18.7501C3.75 19.1479 3.90804 19.5294 4.18934 19.8107C4.47064 20.0921 4.85218 20.2501 5.25 20.2501H18.75C19.1478 20.2501 19.5294 20.0921 19.8107 19.8107C20.092 19.5294 20.25 19.1479 20.25 18.7501V12.7501C20.6478 12.7501 21.0294 12.5921 21.3107 12.3107C21.592 12.0294 21.75 11.6479 21.75 11.2501V8.25009C21.75 7.85226 21.592 7.47073 21.3107 7.18943C21.0294 6.90812 20.6478 6.75009 20.25 6.75009ZM13.9688 3.4229C14.0875 3.29176 14.2321 3.18659 14.3934 3.11399C14.5547 3.04139 14.7293 3.00293 14.9062 3.00103H14.9522C15.1595 3.00232 15.3645 3.04499 15.5552 3.12653C15.7458 3.20807 15.9183 3.32684 16.0624 3.47588C16.2066 3.62493 16.3195 3.80124 16.3947 3.9945C16.4698 4.18776 16.5056 4.39407 16.5 4.60134C16.4981 4.77824 16.4596 4.95284 16.387 5.11417C16.3144 5.27551 16.2093 5.42009 16.0781 5.53884C15.1884 6.32634 13.7119 6.60384 12.7969 6.70134C12.9094 5.70853 13.2188 4.26571 13.9688 3.4229ZM7.96031 3.45665C8.25088 3.16611 8.64441 3.00203 9.05531 3.00009H9.10125C9.27815 3.002 9.45275 3.04046 9.61409 3.11306C9.77542 3.18566 9.92 3.29083 10.0388 3.42196C10.8253 4.31071 11.1028 5.78446 11.2003 6.69571C10.2891 6.60196 8.81531 6.32071 7.92656 5.53415C7.79543 5.4154 7.69026 5.27082 7.61766 5.10949C7.54506 4.94815 7.5066 4.77355 7.50469 4.59665C7.49887 4.38593 7.53593 4.17623 7.61361 3.98027C7.69128 3.7843 7.80796 3.60616 7.95656 3.45665H7.96031ZM3.75 8.25009H11.25V11.2501H3.75V8.25009ZM5.25 12.7501H11.25V18.7501H5.25V12.7501ZM18.75 18.7501H12.75V12.7501H18.75V18.7501ZM20.25 11.2501H12.75V8.25009H20.25V11.2501Z" fill="#5D5D5D"/>
// </svg>
//             <span className="flex-1 ms-3 whitespace-nowrap" style={{fontSize: '16px', fontStyle: 'normal', fontWeight: '500', lineHeight: '24px', color: 'var(--Gray-500, #4B5563)'}}>Referrals</span>
//           </Link>
//         </li>,
//         <li key="support">
//           <Link to='/support' className={`flex  items-center ml-2 p-3 text-gray-600 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${isActive('/support')}`}>
//           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//   <path d="M12 2.25C10.0716 2.25 8.18657 2.82183 6.58319 3.89317C4.97982 4.96451 3.73013 6.48726 2.99218 8.26884C2.25422 10.0504 2.06114 12.0108 2.43735 13.9021C2.81355 15.7934 3.74215 17.5307 5.10571 18.8943C6.46928 20.2579 8.20656 21.1865 10.0979 21.5627C11.9892 21.9389 13.9496 21.7458 15.7312 21.0078C17.5127 20.2699 19.0355 19.0202 20.1068 17.4168C21.1782 15.8134 21.75 13.9284 21.75 12C21.7473 9.41498 20.7192 6.93661 18.8913 5.10872C17.0634 3.28084 14.585 2.25273 12 2.25ZM15.6656 14.6053C16.2083 13.8449 16.4999 12.9341 16.4999 12C16.4999 11.0659 16.2083 10.155 15.6656 9.39469L18.3375 6.72375C19.5732 8.20427 20.2501 10.0715 20.2501 12C20.2501 13.9285 19.5732 15.7957 18.3375 17.2762L15.6656 14.6053ZM9 12C9 11.4067 9.17595 10.8266 9.5056 10.3333C9.83524 9.83994 10.3038 9.45542 10.852 9.22836C11.4001 9.0013 12.0033 8.94189 12.5853 9.05764C13.1672 9.1734 13.7018 9.45912 14.1213 9.87868C14.5409 10.2982 14.8266 10.8328 14.9424 11.4147C15.0581 11.9967 14.9987 12.5999 14.7716 13.1481C14.5446 13.6962 14.1601 14.1648 13.6667 14.4944C13.1734 14.8241 12.5933 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12ZM17.2763 5.6625L14.6053 8.33438C13.845 7.79174 12.9341 7.50007 12 7.50007C11.0659 7.50007 10.1551 7.79174 9.39469 8.33438L6.72375 5.6625C8.20427 4.42678 10.0715 3.74991 12 3.74991C13.9285 3.74991 15.7957 4.42678 17.2763 5.6625ZM5.6625 6.72375L8.33438 9.39469C7.79175 10.155 7.50007 11.0659 7.50007 12C7.50007 12.9341 7.79175 13.8449 8.33438 14.6053L5.6625 17.2762C4.42678 15.7957 3.74991 13.9285 3.74991 12C3.74991 10.0715 4.42678 8.20427 5.6625 6.72375ZM6.72375 18.3375L9.39469 15.6656C10.1551 16.2083 11.0659 16.4999 12 16.4999C12.9341 16.4999 13.845 16.2083 14.6053 15.6656L17.2763 18.3375C15.7957 19.5732 13.9285 20.2501 12 20.2501C10.0715 20.2501 8.20427 19.5732 6.72375 18.3375Z" fill="#5D5D5D"/>
// </svg>
//             <span className="flex-1 ms-3 whitespace-nowrap" style={{fontSize: '16px', fontStyle: 'normal', fontWeight: '500', lineHeight: '24px', color: 'var(--Gray-500, #4B5563)'}}>Support</span>
//           </Link>
//         </li>
//       );
//     }

//     return links;
//   }

//   // Determine the default route based on user role
//   const getDefaultRoute = () => {
//     if (user.roles?.admin) return '/';
//     if (user.roles?.booking) return '/booking';
//     if (user.roles?.documents) return '/document';
//     if (user.roles?.constructionUpdate) return '/construction';
//     return '/'; // Fallback to dashboard if no specific role is found
//   }

//   // Redirect to the appropriate page if the user is on an unauthorized route
//   React.useEffect(() => {
//     const defaultRoute = getDefaultRoute();
//     if (location.pathname === '/' && !user.roles?.admin) {
//       navigate(defaultRoute);
//     }
//   }, [location, user.roles, navigate]);

//   return (
//     <>
//       <div>
//         <button
//         onClick={toggleSidebar}
//           data-drawer-target="separator-sidebar"
//           data-drawer-toggle="separator-sidebar"
//           aria-controls="separator-sidebar"
//           type="button"
//           className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
//         >
//           <span className="sr-only">Open sidebar</span>
//           <svg
//             className="w-6 h-6"
//             aria-hidden="true"
//             fill="currentColor"
//             viewBox="0 0 20 20"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               clipRule="evenodd"
//               fillRule="evenodd"
//               d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
//             ></path>
//           </svg>
//         </button>

//         <aside
//   id="separator-sidebar"
//   className={`${styles.customScrollbar} fixed top-0 left-0 z-40 w-[320px] h-screen transition-transform ${
//     sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//   } sm:translate-x-0`}
//   aria-label="Sidebar"
//   style={{ fontFamily: 'Plus_Jakarta', background: ' var(--Base-White, #FFF)' }}
// >
//           <div className={`${styles.customScrollbar} flex flex-col mt-4 h-full px-3 py-4 overflow-y-auto bg-white dark:bg-gray-800`} style={{padding: '20px 24px 36px 24px'}}>
//             <div className="flex-grow overflow-y-auto">
//               <ul className="space-y-2 font-medium ">
//                 {/* <li>
//                   <Link to='/' className="flex  items-center p-2 text-gray-700 rounded-lg">
//                     <img className="w-14 h-14 mr-2" src={Logo} alt="Logo" />
//                     <img className="w-14 h-14 mr-2" src={dashImag} alt="dashImag" />
//                   </Link>
//                 </li> */}
//                 {/* <li>
//                   <Link to='/' className="flex items-center p-2 text-gray-700 rounded-lg">
//                     <img className="w-14 h-14 mr-2" src={dashImag} alt="dashImag" />
//                   </Link>
//                 </li> */}
//                 {getVisibleLinks()}
//               </ul>
//             </div>
//             <br/>
//             <ul className="space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
//               <li>
//                 <div>
//                   <a className="flex items-center mt-3 p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
//                       <rect width="48" height="48" rx="24" fill="url(#paint0_linear_131_506)"/>
//                       <text className='mt-5' x="49%" y="52%" dominantBaseline="middle" textAnchor="middle" fill="white" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="bold">
//                         {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
//                       </text>
//                       <defs>
//                         <linearGradient id="paint0_linear_131_506" x1="24" y1="0" x2="24" y2="48" gradientUnits="userSpaceOnUse">
//                           <stop stopColor="#AA9EF1"/>
//                           <stop offset="1" stopColor="#7E35C7"/>
//                         </linearGradient>
//                       </defs>
//                     </svg>
//                     <a className="flex flex-col ml-3">
//                       <span className="text-base font-semibold" style={{color: 'var(--Gray-500, #4B5563)'}}>{user.firstName} {user.lastName}</span>
//                       <span className="text-sm text-gray-400" style={{color: 'var(--Gray-500, #667085)'}}>
//                         {user.roles?.admin ? 'Admin' : 
//                          user.roles?.booking ? 'Booking Manager' : 
//                          user.roles?.documents ? 'Legal Documents' : 
//                          user.roles?.constructionUpdate ? 'Construction Update' : 'No Role'}
//                       </span>
//                     </a>
//                     <svg
//                       onClick={handleLogout}
//                       style={{cursor:'pointer'}}
//                       className="flex-shrink-0 w-5 h-5 ml-auto text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
//                       aria-hidden="true"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 18 16"
//                     >
//                       <path
//                         stroke="currentColor"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
//                       />
//                     </svg>
//                   </a>
//                 </div>
//               </li>
//             </ul>
//           </div>
//         </aside>
//       </div>
//     </>
//   )
// }

// export default SideBar
              

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './CustomScrollbar.module.css';
import './../App.css';
import './../index.css';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { ArrowsClockwise, Buildings, ChatText, Files, Gift, Megaphone, NotePencil, Package, SquaresFour, UserCircle, UserCirclePlus, UserList } from 'phosphor-react'
import { CalendarDots, Siren } from '@phosphor-icons/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const SideBar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [visitorsOpen, setVisitorsOpen] = useState(false);
  const [rentalOpen, setRentalOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  
  const isActive = (path) => {
    return location.pathname === path ? "bg-gray-100" : "";
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.error('Logged out successfully');
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  }

    

  // Determine the default route based on user role
  const getDefaultRoute = () => {
    if (user.roles?.admin) return '/';
    if (user.roles?.booking) return '/booking';
    if (user.roles?.documents) return '/document';
    if (user.roles?.constructionUpdate) return '/construction';
    return '/'; // Fallback to dashboard if no specific role is found
  }

  // Redirect to the appropriate page if the user is on an unauthorized route
  React.useEffect(() => {
    const defaultRoute = getDefaultRoute();
    if (location.pathname === '/' && !user.roles?.admin) {
      navigate(defaultRoute);
    }
  }, [location, user.roles, navigate]);


  const toggleVisitors = () => {
    setVisitorsOpen(!visitorsOpen);
  };
  
  const toggleRental = () => {
    setRentalOpen(!rentalOpen);
  };

  const toggleUser = () => {
    setUserOpen(!userOpen);
  };
  

  return (
    <>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`${styles.customScrollbar} fixed top-[72px] left-0 z-40  transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0 bg-white`}
      >
        <div className={`${styles.customScrollbar} flex flex-col h-full px-6 py-6 overflow-y-auto`}>
          {/* Navigation Links */}
          <div className="flex-grow">
            <ul className="space-y-2">
              {user?.roles?.admin && (
                <li>
                  <li key="dashboard" >
          <Link to='/' className={`flex  items-center ml-2 p-3 text-gray-600 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${isActive('/')}`}>
          
<SquaresFour size={24} />
            <span className="flex-1 ms-3 whitespace-nowrap" style={{fontSize: '16px', fontStyle: 'normal', fontWeight: '500', lineHeight: '24px', color: 'var(--Gray-500, #4B5563)'}}>Dashboard</span>
          </Link>
        </li>
                  
                </li>
              )}

              {/* Add your other menu items here following the same pattern */}
              {/* Example for Flat Management */}
              <li key="flatmain">
                <Link to="/flatmain" className={`flex items-center ml-2 p-3  text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/flatmain')}`}>
                 
                    <Buildings size={24} />
                
                  <span className="ml-3 text-[16px] font-medium leading-6">Flat Management</span>
                </Link>
              </li>
              <li key="userRequest">
                <Link to="/user-request" className={`flex items-center ml-2 p-3  text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/flat-management')}`}>
                  
                    <UserCirclePlus size={24} />
                  
                  <span className="ml-3 text-[16px] font-medium leading-6">User Requests</span>
                </Link>
              </li>
              <li key="Facility">
                <Link to="/Facility" className={`flex items-center ml-2 p-3  text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Facility')}`}>
                  
                    <Buildings size={24} />
                
                  <span className="ml-3 text-[16px] font-medium leading-6">Facility</span>
                </Link>
              </li>
              <li key="Booking">
                <Link to="/Booking" className={`flex items-center ml-2 p-3  text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/bookings')}`}>
                 
                    <CalendarDots size={24} />
                  
                  <span className="ml-3 text-[16px] font-medium leading-6">Bookings</span>
                </Link>
              </li>
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
              

              <li key="Parcels">
                <Link to="/Parcels" className={`flex items-center ml-2 p-3  text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Booking')}`}>
                 
                <Package size={24} />
                  
                  <span className="ml-3 text-[16px] font-medium leading-6">Parcels</span>
                </Link>
              </li>
              <li key="Notices">
                <Link to="/Notices" className={`flex items-center ml-2 p-3  text-gray-600 rounded-lg hover:bg-gray-100  ${isActive('/Booking')}`}>
                 
                <Megaphone size={24}  />
                  
                  <span className="ml-3 text-[16px] font-medium leading-6">Notices</span>
                </Link>
              </li>
              <li key="sosHistory">
                <Link to="/sosHistory" className={`flex items-center ml-2 p-3  text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/sosHistory')}`}>
                 
                <Siren size={24} />
                  
                  <span className="ml-3 text-[16px] font-medium leading-6">SOS History</span>
                </Link>
              </li>
              <li key="Feedback">
                <Link to="/feedback" className={`flex items-center ml-2 p-3  text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Booking')}`}>
                <ChatText size={24} />
                  
                  <span className="ml-3 text-[16px] font-medium leading-6">Feedback</span>
                </Link>
              </li>
              <li key="SpecialRequest">
                <Link to="/SpecialRequest" className={`flex items-center ml-2 p-3  text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Booking')}`}>
                 
                <NotePencil size={24} />
                  
                  <span className="ml-3 text-[16px] font-medium leading-6">Special Request</span>
                </Link>
              </li>
              
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
              
              <li key="Documents">
                <Link to="/document" className={`flex items-center ml-2 p-3  text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/document')}`}>
                 
                <Files size={24} />
                  
                  <span className="ml-3 text-[16px] font-medium leading-6">Documents</span>
                </Link>
              </li>
              <li key="ConstructionUpdate">
                <Link to="/ConstructionUpdate" className={`flex items-center ml-2 p-3  text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Booking')}`}>
                 
                <ArrowsClockwise size={24} />
                  
                  <span className="ml-3 text-[16px] font-medium leading-6">Construction Update</span>
                </Link>
              </li>

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
                      <Link to="/Resident" className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Guest')}`}>
                        <span className="text-[14px] font-medium">Resident</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/Staff" className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Helper')}`}>
                        <span className="text-[14px] font-medium">Staff</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/GuestLogin" className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Delivery')}`}>
                        <span className="text-[14px] font-medium">Guest Login</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/Guard" className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Cab')}`}>
                        <span className="text-[14px] font-medium">Guard</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/Other" className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Other')}`}>
                        <span className="text-[14px] font-medium">Helper</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              

              <li key="Referrals">
                <Link to="/Referrals" className={`flex items-center ml-2 p-3  text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Booking')}`}>
                 
                <Gift size={24} />
                  
                  <span className="ml-3 text-[16px] font-medium leading-6">Support</span>
                </Link>
              </li>
              <li key="Referrals">
                <Link to="/Referrals" className={`flex items-center ml-2 p-3  text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/Booking')}`}>
                 
                <Gift size={24} />
                  
                  <span className="ml-3 text-[16px] font-medium leading-6">Referrals</span>
                </Link>
              </li>
              {/* <li key="support">
                <Link to="/support" className={`flex items-center ml-2 p-3  text-gray-600 rounded-lg hover:bg-gray-100 ${isActive('/support')}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
   <path d="M12 2.25C10.0716 2.25 8.18657 2.82183 6.58319 3.89317C4.97982 4.96451 3.73013 6.48726 2.99218 8.26884C2.25422 10.0504 2.06114 12.0108 2.43735 13.9021C2.81355 15.7934 3.74215 17.5307 5.10571 18.8943C6.46928 20.2579 8.20656 21.1865 10.0979 21.5627C11.9892 21.9389 13.9496 21.7458 15.7312 21.0078C17.5127 20.2699 19.0355 19.0202 20.1068 17.4168C21.1782 15.8134 21.75 13.9284 21.75 12C21.7473 9.41498 20.7192 6.93661 18.8913 5.10872C17.0634 3.28084 14.585 2.25273 12 2.25ZM15.6656 14.6053C16.2083 13.8449 16.4999 12.9341 16.4999 12C16.4999 11.0659 16.2083 10.155 15.6656 9.39469L18.3375 6.72375C19.5732 8.20427 20.2501 10.0715 20.2501 12C20.2501 13.9285 19.5732 15.7957 18.3375 17.2762L15.6656 14.6053ZM9 12C9 11.4067 9.17595 10.8266 9.5056 10.3333C9.83524 9.83994 10.3038 9.45542 10.852 9.22836C11.4001 9.0013 12.0033 8.94189 12.5853 9.05764C13.1672 9.1734 13.7018 9.45912 14.1213 9.87868C14.5409 10.2982 14.8266 10.8328 14.9424 11.4147C15.0581 11.9967 14.9987 12.5999 14.7716 13.1481C14.5446 13.6962 14.1601 14.1648 13.6667 14.4944C13.1734 14.8241 12.5933 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12ZM17.2763 5.6625L14.6053 8.33438C13.845 7.79174 12.9341 7.50007 12 7.50007C11.0659 7.50007 10.1551 7.79174 9.39469 8.33438L6.72375 5.6625C8.20427 4.42678 10.0715 3.74991 12 3.74991C13.9285 3.74991 15.7957 4.42678 17.2763 5.6625ZM5.6625 6.72375L8.33438 9.39469C7.79175 10.155 7.50007 11.0659 7.50007 12C7.50007 12.9341 7.79175 13.8449 8.33438 14.6053L5.6625 17.2762C4.42678 15.7957 3.74991 13.9285 3.74991 12C3.74991 10.0715 4.42678 8.20427 5.6625 6.72375ZM6.72375 18.3375L9.39469 15.6656C10.1551 16.2083 11.0659 16.4999 12 16.4999C12.9341 16.4999 13.845 16.2083 14.6053 15.6656L17.2763 18.3375C15.7957 19.5732 13.9285 20.2501 12 20.2501C10.0715 20.2501 8.20427 19.5732 6.72375 18.3375Z" fill="#5D5D5D"/>
 </svg>
                    
                  
                  <span className="ml-3 text-[16px] font-medium leading-6">Support</span>
                </Link>
              </li> */}
              

             

              
            </ul>
          </div>

        
        </div>
      </aside>
    </>
  );
};

export default SideBar;