// // // // // // import React from 'react';
// // // // // // import { X } from 'lucide-react';

// // // // // // const NotificationItem = ({ avatar, name, action, target, time, initials, backgroundColor }) => {
// // // // // //   return (
// // // // // //     <div className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
// // // // // //       {avatar ? (
// // // // // //         <img 
// // // // // //           src={avatar} 
// // // // // //           alt={name} 
// // // // // //           className="w-10 h-10 rounded-full object-cover"
// // // // // //         />
// // // // // //       ) : (
// // // // // //         <div 
// // // // // //           className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
// // // // // //           style={{ backgroundColor: backgroundColor || '#E5E7EB' }}
// // // // // //         >
// // // // // //           {initials}
// // // // // //         </div>
// // // // // //       )}
// // // // // //       <div className="flex-1 min-w-0">
// // // // // //         <p className="text-[14px] text-gray-900 leading-snug">
// // // // // //           <span className="font-medium">{name}</span>{' '}
// // // // // //           <span className="font-normal">{action}</span>
// // // // // //           {target && <span className="font-medium"> {target}</span>}
// // // // // //         </p>
// // // // // //         <p className="text-xs text-gray-400 mt-1">{time}</p>
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // const NotificationSidebar = ({ isOpen, onClose }) => {
// // // // // //   const notifications = [
// // // // // //     {
// // // // // //       name: 'Sonal Jain',
// // // // // //       action: 'has listed their flat',
// // // // // //       target: 'Tower C-105 for rent.',
// // // // // //       time: '2 hours ago',
// // // // // //     //   avatar: '/path/to/avatar1.jpg'
// // // // // //     initials: 'SJ',
// // // // // //     },
// // // // // //     {
// // // // // //       name: 'Harsh Dhanmer',
// // // // // //       action: 'has raised a support ticket.',
// // // // // //       time: '3 hours ago',
// // // // // //       initials: 'HD',
// // // // // //       backgroundColor: '#FEE2E2' // Light red background
// // // // // //     },
// // // // // //     {
// // // // // //       name: 'Ramesh Kumar',
// // // // // //       action: 'has added a new helper,',
// // // // // //       target: 'Anita Devi',
// // // // // //       time: 'Yesterday',
// // // // // //       initials: 'RK',
// // // // // //     //   avatar: '/path/to/avatar2.jpg'
// // // // // //     },
// // // // // //     {
// // // // // //       name: 'Kirti Das',
// // // // // //       action: 'has raised a support ticket.',
// // // // // //       time: '3 hours ago',
// // // // // //       initials: 'KD',
// // // // // //       backgroundColor: '#E0E7FF' // Light purple background
// // // // // //     },
// // // // // //     {
// // // // // //       name: 'Anuj Kumar',
// // // // // //       action: 'has added a new helper,',
// // // // // //       target: 'Madhuri Ghadge',
// // // // // //       time: 'Yesterday',
// // // // // //       backgroundColor: '#FEE2E2', // Light red background,
// // // // // //     //   avatar: '/path/to/avatar3.jpg'
// // // // // //     initials: 'AK',
// // // // // //     },
// // // // // //     {
// // // // // //       name: 'Suyash Pal',
// // // // // //       action: 'has added a new helper,',
// // // // // //       target: 'Aarti Patel',
// // // // // //       time: 'Yesterday',
// // // // // //       initials: 'SP',
// // // // // //     //   avatar: '/path/to/avatar4.jpg',
// // // // // //     backgroundColor: '#FEE2E2' // Light red background
// // // // // //     }
// // // // // //   ];

// // // // // //   return (
// // // // // //     <>
// // // // // //       {/* Backdrop */}
// // // // // //       {isOpen && (
// // // // // //         <div 
// // // // // //           className="fixed inset-0 bg-black/50 transition-opacity z-50"
// // // // // //           onClick={onClose}
// // // // // //         />
// // // // // //       )}

// // // // // //       {/* Sidebar */}
// // // // // //       <div 
// // // // // //         className={`fixed inset-y-0 right-0 w-[350px] bg-white transform transition-transform duration-300 ease-in-out z-50 ${
// // // // // //           isOpen ? 'translate-x-0' : 'translate-x-full'
// // // // // //         }`}
// // // // // //       >
// // // // // //         {/* Header */}
// // // // // //         <div className="px-4 py-4 border-b border-gray-100 flex justify-between items-center">
// // // // // //           <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
// // // // // //           <button 
// // // // // //             onClick={onClose}
// // // // // //             className="p-1 hover:bg-gray-100 rounded-full transition-colors"
// // // // // //           >
// // // // // //             <X className="h-4 w-4 text-gray-500" />
// // // // // //           </button>
// // // // // //         </div>

// // // // // //         {/* Notifications List */}
// // // // // //         <div className="overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
// // // // // //           {notifications.map((notification, index) => (
// // // // // //             <NotificationItem 
// // // // // //               key={index}
// // // // // //               {...notification}
// // // // // //             />
// // // // // //           ))}
// // // // // //         </div>

// // // // // //         {/* Footer */}
// // // // // //         <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white flex justify-between">
// // // // // //           <button 
// // // // // //             onClick={onClose}
// // // // // //             className="px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
// // // // // //           >
// // // // // //             Close
// // // // // //           </button>
// // // // // //           <button 
// // // // // //             className="px-4 py-2 text-white bg-[#3B82F6] hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
// // // // // //           >
// // // // // //             <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
// // // // // //               <path d="M16.667 5L7.50033 14.1667L3.33366 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
// // // // // //             </svg>
// // // // // //             Mark as all read
// // // // // //           </button>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     </>
// // // // // //   );
// // // // // // };

// // // // // // export default NotificationSidebar;


// // // // // import React, { useState, useEffect } from 'react';
// // // // // import { X, Bell, Check, AlertTriangle, UserCheck, Clock } from 'lucide-react';
// // // // // import { fcmService } from '../services/fcmServices';
// // // // // import { formatDistanceToNow } from 'date-fns';

// // // // // const NotificationItem = ({ notification }) => {
// // // // //   const { title, body, timestamp, read, data = {}, id } = notification;
  
// // // // //   // Generate initials from name or use fallback
// // // // //   const getName = () => {
// // // // //     if (data.firstName && data.lastName) {
// // // // //       return `${data.firstName} ${data.lastName}`;
// // // // //     } else if (data.visitorName) {
// // // // //       return data.visitorName;
// // // // //     } else if (data.firstName) {
// // // // //       return data.firstName;
// // // // //     }
// // // // //     return 'User';
// // // // //   };
  
// // // // //   const getInitials = () => {
// // // // //     const name = getName();
// // // // //     return name
// // // // //       .split(' ')
// // // // //       .map(part => part[0])
// // // // //       .join('')
// // // // //       .toUpperCase()
// // // // //       .substring(0, 2);
// // // // //   };
  
// // // // //   // Get notification color based on type
// // // // //   const getBackgroundColor = () => {
// // // // //     const type = data.type || '';
    
// // // // //     if (type.includes('SOS') || type === 'SOS_ALERT') {
// // // // //       return '#FEE2E2'; // Light red
// // // // //     } else if (type === 'VISITOR_APPROVAL') {
// // // // //       return '#D1FAE5'; // Light green
// // // // //     } else if (type === 'SUPPORT_TICKET') {
// // // // //       return '#E0E7FF'; // Light purple
// // // // //     }
// // // // //     return '#E5E7EB'; // Default gray
// // // // //   };
  
// // // // //   // Format time
// // // // //   const formatTime = (timestamp) => {
// // // // //     try {
// // // // //       return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
// // // // //     } catch (error) {
// // // // //       return 'Unknown time';
// // // // //     }
// // // // //   };
  
// // // // //   // Handle notification click
// // // // //   const handleClick = async () => {
// // // // //     if (!read) {
// // // // //       await fcmService.markAsRead(id);
// // // // //     }
// // // // //   };
  
// // // // //   // Get notification icon
// // // // //   const getIcon = () => {
// // // // //     const type = data.type || '';
    
// // // // //     if (type.includes('SOS') || type === 'SOS_ALERT') {
// // // // //       return <AlertTriangle size={16} className="text-red-500" />;
// // // // //     } else if (type === 'VISITOR_APPROVAL') {
// // // // //       return <UserCheck size={16} className="text-green-500" />;
// // // // //     } else if (type === 'SUPPORT_TICKET') {
// // // // //       return <Clock size={16} className="text-purple-500" />;
// // // // //     }
// // // // //     return <Bell size={16} className="text-gray-500" />;
// // // // //   };
  
// // // // //   return (
// // // // //     <div 
// // // // //       className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${!read ? 'bg-blue-50' : ''}`}
// // // // //       onClick={handleClick}
// // // // //     >
// // // // //       {data.imageUrl || data.visitorImage ? (
// // // // //         <img 
// // // // //           src={data.imageUrl || data.visitorImage} 
// // // // //           alt={getName()} 
// // // // //           className="w-10 h-10 rounded-full object-cover"
// // // // //         />
// // // // //       ) : (
// // // // //         <div 
// // // // //           className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
// // // // //           style={{ backgroundColor: getBackgroundColor() }}
// // // // //         >
// // // // //           {getInitials()}
// // // // //         </div>
// // // // //       )}
// // // // //       <div className="flex-1 min-w-0">
// // // // //         <div className="flex items-center gap-2">
// // // // //           <p className="text-[14px] text-gray-900 leading-snug font-medium">
// // // // //             {title}
// // // // //           </p>
// // // // //           {!read && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
// // // // //         </div>
// // // // //         <p className="text-[13px] text-gray-700 mt-1 line-clamp-2">{body}</p>
// // // // //         <div className="flex items-center gap-2 mt-1">
// // // // //           {getIcon()}
// // // // //           <p className="text-xs text-gray-400">{formatTime(timestamp)}</p>
// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // const NotificationSidebar = ({ isOpen, onClose }) => {
// // // // //   const [notifications, setNotifications] = useState([]);
// // // // //   const [isLoading, setIsLoading] = useState(true);
// // // // //   const [unreadCount, setUnreadCount] = useState(0);

// // // // //   const debugNotifications = async () => {
// // // // //     try {
// // // // //       console.log("DEBUG: Starting notification debugging");
      
// // // // //       // 1. Check if FCM service exists
// // // // //       console.log("DEBUG: FCM Service exists:", !!fcmService);
      
// // // // //       // 2. Log the getNotifications function
// // // // //       console.log("DEBUG: getNotifications function:", fcmService.getNotifications);
      
// // // // //       // 3. Call getNotifications directly with debugging
// // // // //       console.log("DEBUG: Calling getNotifications directly");
// // // // //       const notificationData = await fcmService.getNotifications(30);
// // // // //       console.log("DEBUG: Raw notification data received:", notificationData);
      
// // // // //       // 4. Check the structure of each notification
// // // // //       if (Array.isArray(notificationData)) {
// // // // //         notificationData.forEach((notification, index) => {
// // // // //           console.log(`DEBUG: Notification ${index} structure:`, notification);
// // // // //           console.log(`DEBUG: Notification ${index} id:`, notification.id);
// // // // //           console.log(`DEBUG: Notification ${index} title:`, notification.title);
// // // // //           console.log(`DEBUG: Notification ${index} body:`, notification.body);
// // // // //           console.log(`DEBUG: Notification ${index} timestamp:`, notification.timestamp);
// // // // //           console.log(`DEBUG: Notification ${index} data:`, notification.data);
// // // // //         });
// // // // //       } else {
// // // // //         console.log("DEBUG: notificationData is not an array!");
// // // // //       }
      
// // // // //       // 5. Check unread count directly
// // // // //       const count = await fcmService.getUnreadCount();
// // // // //       console.log("DEBUG: Unread count directly from service:", count);
      
// // // // //     } catch (error) {
// // // // //       console.error("DEBUG ERROR:", error);
// // // // //     }
// // // // //   };
  
// // // // //   // Fetch notifications
// // // // //   // Also modify your fetchNotifications function to add more debugging
// // // // // const fetchNotifications = async () => {
// // // // //   try {
// // // // //     setIsLoading(true);
// // // // //     console.log("FETCH: Starting to fetch notifications");
// // // // //     const notificationData = await fcmService.getNotifications(30);
// // // // //     console.log("FETCH: Notifications received:", notificationData);
    
// // // // //     // Add this check to fix potential data issues
// // // // //     if (Array.isArray(notificationData)) {
// // // // //       setNotifications(notificationData);
// // // // //     } else {
// // // // //       console.error("FETCH ERROR: Notification data is not an array:", notificationData);
// // // // //       setNotifications([]);
// // // // //     }
    
// // // // //     // Get unread count
// // // // //     console.log("FETCH: Getting unread count");
// // // // //     const count = await fcmService.getUnreadCount();
// // // // //     console.log("FETCH: Unread count:", count);
// // // // //     setUnreadCount(count);
// // // // //   } catch (error) {
// // // // //     console.error("FETCH ERROR:", error);
// // // // //     setNotifications([]);
// // // // //   } finally {
// // // // //     setIsLoading(false);
// // // // //   }
// // // // // };
  
// // // // //   // Handle mark all as read
// // // // //   const handleMarkAllAsRead = async () => {
// // // // //     try {
// // // // //       const count = await fcmService.markAllAsRead();
// // // // //       console.log(`Marked ${count} notifications as read`);
      
// // // // //       // Refresh notifications
// // // // //       fetchNotifications();
// // // // //     } catch (error) {
// // // // //       console.error('Error marking all as read:', error);
// // // // //     }
// // // // //   };
  
// // // // //   // Then call this debug function in your useEffect
// // // // // useEffect(() => {
// // // // //   // Fetch notifications on mount
// // // // //   fetchNotifications();
  
// // // // //   // DEBUG: Add this line to run debugging
// // // // //   debugNotifications();
  
// // // // //   // Register handler for new notifications
// // // // //   const unregister = fcmService.registerNotificationHandler(() => {
// // // // //     fetchNotifications();
// // // // //   });
  
// // // // //   // Cleanup
// // // // //   return () => {
// // // // //     unregister();
// // // // //   };
// // // // // }, []);
  
// // // // //   return (
// // // // //     <>
// // // // //       {/* Backdrop */}
// // // // //       {isOpen && (
// // // // //         <div 
// // // // //           className="fixed inset-0 bg-black/50 transition-opacity z-50"
// // // // //           onClick={onClose}
// // // // //         />
// // // // //       )}

// // // // //       {/* Sidebar */}
// // // // //       <div 
// // // // //         className={`fixed inset-y-0 right-0 w-[350px] bg-white transform transition-transform duration-300 ease-in-out z-50 ${
// // // // //           isOpen ? 'translate-x-0' : 'translate-x-full'
// // // // //         }`}
// // // // //       >
// // // // //         {/* Header */}
// // // // //         <div className="px-4 py-4 border-b border-gray-100 flex justify-between items-center">
// // // // //           <div className="flex items-center gap-2">
// // // // //             <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
// // // // //             {unreadCount > 0 && (
// // // // //               <span className="bg-red-500 text-white text-xs font-semibold py-1 px-2 rounded-full">
// // // // //                 {unreadCount}
// // // // //               </span>
// // // // //             )}
// // // // //           </div>
// // // // //           <button 
// // // // //             onClick={onClose}
// // // // //             className="p-1 hover:bg-gray-100 rounded-full transition-colors"
// // // // //           >
// // // // //             <X className="h-4 w-4 text-gray-500" />
// // // // //           </button>
// // // // //         </div>

// // // // //         {/* Notifications List */}
// // // // //         <div className="overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
// // // // //           {isLoading ? (
// // // // //             <div className="flex justify-center items-center h-32">
// // // // //               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
// // // // //             </div>
// // // // //           ) : notifications.length > 0 ? (
// // // // //             notifications.map((notification) => (
// // // // //               <NotificationItem 
// // // // //                 key={notification.id}
// // // // //                 notification={notification}
// // // // //               />
// // // // //             ))
// // // // //           ) : (
// // // // //             <div className="py-8 text-center text-gray-500">
// // // // //               <Bell className="h-10 w-10 text-gray-300 mx-auto mb-2" />
// // // // //               <p>No notifications yet</p>
// // // // //             </div>
// // // // //           )}
// // // // //         </div>

// // // // //         {/* Footer */}
// // // // //         <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white flex justify-between">
// // // // //           <button 
// // // // //             onClick={onClose}
// // // // //             className="px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
// // // // //           >
// // // // //             Close
// // // // //           </button>
// // // // //           <button 
// // // // //             onClick={handleMarkAllAsRead}
// // // // //             className="px-4 py-2 text-white bg-[#3B82F6] hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
// // // // //             disabled={unreadCount === 0}
// // // // //           >
// // // // //             <Check size={16} />
// // // // //             Mark all as read
// // // // //           </button>
// // // // //         </div>
// // // // //       </div>
// // // // //     </>
// // // // //   );
// // // // // };

// // // // // export default NotificationSidebar;

// // // // import React, { useState, useEffect, useCallback } from 'react';
// // // // import { X } from 'lucide-react';
// // // // import { getAuth } from 'firebase/auth';
// // // // import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, getFirestore } from 'firebase/firestore';
// // // // import io from 'socket.io-client';

// // // // // Replace with your actual server URL
// // // // const SERVER_URL = 'http://localhost:5000';

// // // // const NotificationItem = ({ avatar, name, action, target, time, initials, backgroundColor, read, id, onMarkAsRead }) => {
// // // //   return (
// // // //     <div className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${read ? '' : 'bg-blue-50'}`}>
// // // //       {avatar ? (
// // // //         <img 
// // // //           src={avatar} 
// // // //           alt={name} 
// // // //           className="w-10 h-10 rounded-full object-cover"
// // // //         />
// // // //       ) : (
// // // //         <div 
// // // //           className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
// // // //           style={{ backgroundColor: backgroundColor || '#E5E7EB' }}
// // // //         >
// // // //           {initials}
// // // //         </div>
// // // //       )}
// // // //       <div className="flex-1 min-w-0">
// // // //         <p className="text-[14px] text-gray-900 leading-snug">
// // // //           <span className="font-medium">{name}</span>{' '}
// // // //           <span className="font-normal">{action}</span>
// // // //           {target && <span className="font-medium"> {target}</span>}
// // // //         </p>
// // // //         <p className="text-xs text-gray-400 mt-1">{time}</p>
// // // //       </div>
// // // //       {!read && (
// // // //         <button 
// // // //           onClick={() => onMarkAsRead(id)}
// // // //           className="text-xs text-blue-600 hover:text-blue-800 whitespace-nowrap"
// // // //         >
// // // //           Mark as read
// // // //         </button>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // const NotificationSidebar = ({ isOpen, onClose, onSelectTicket }) => {
// // // //   const [notifications, setNotifications] = useState([]);
// // // //   const [unreadCount, setUnreadCount] = useState(0);
// // // //   const [socket, setSocket] = useState(null);
// // // //   const [connected, setConnected] = useState(false);
// // // //   const db = getFirestore();

// // // //   // Format notification data
// // // //   const formatNotification = useCallback((notification) => {
// // // //     let action = "has sent a notification";
// // // //     let target = "";
// // // //     let name = notification.senderName || "User";
// // // //     let initials = name.split(' ').map(n => n[0]).join('');
    
// // // //     // Handle different notification types
// // // //     if (notification.type === 'support') {
// // // //       action = "has raised a support ticket";
// // // //       target = notification.data?.category ? `for ${notification.data.category}` : "";
      
// // // //       // If we have a phone number, use it for the name if senderName isn't available
// // // //       if (!notification.senderName && notification.data?.phoneNumber) {
// // // //         name = notification.data.phoneNumber;
// // // //         initials = 'U'; // Generic initial for user
// // // //       }
// // // //     }
    
// // // //     // Format time
// // // //     let time;
// // // //     if (notification.timestamp) {
// // // //       const date = notification.timestamp.toDate ? notification.timestamp.toDate() : new Date(notification.timestamp);
// // // //       const now = new Date();
// // // //       const diffMs = now - date;
// // // //       const diffMins = Math.floor(diffMs / 60000);
// // // //       const diffHours = Math.floor(diffMins / 60);
// // // //       const diffDays = Math.floor(diffHours / 24);
      
// // // //       if (diffMins < 1) {
// // // //         time = 'Just now';
// // // //       } else if (diffMins < 60) {
// // // //         time = `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
// // // //       } else if (diffHours < 24) {
// // // //         time = `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
// // // //       } else if (diffDays < 7) {
// // // //         time = `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
// // // //       } else {
// // // //         time = date.toLocaleDateString();
// // // //       }
// // // //     } else {
// // // //       time = 'Unknown time';
// // // //     }
    
// // // //     // Determine background color based on notification type
// // // //     let backgroundColor = '#E5E7EB'; // Default gray
// // // //     if (notification.type === 'support') {
// // // //       backgroundColor = '#FEE2E2'; // Light red for support tickets
// // // //     }
    
// // // //     return {
// // // //       id: notification.id,
// // // //       name,
// // // //       action,
// // // //       target,
// // // //       time,
// // // //       initials,
// // // //       backgroundColor,
// // // //       read: notification.read || false,
// // // //       data: notification.data,
// // // //       type: notification.type
// // // //     };
// // // //   }, []);

// // // //   // Initialize WebSocket connection
// // // //   useEffect(() => {
// // // //     const connectSocket = async () => {
// // // //       try {
// // // //         const auth = getAuth();
// // // //         const user = auth.currentUser;
        
// // // //         if (!user) {
// // // //           console.log('No user signed in, cannot initialize socket');
// // // //           return;
// // // //         }
        
// // // //         // Get token for authentication
// // // //         const token = await user.getIdToken();
        
// // // //         // Initialize socket
// // // //         const newSocket = io(SERVER_URL);
// // // //         setSocket(newSocket);
        
// // // //         // Set up event listeners
// // // //         newSocket.on('connect', () => {
// // // //           console.log('Connected to notification server');
// // // //           setConnected(true);
          
// // // //           // Authenticate after connection
// // // //           newSocket.emit('authenticate', {
// // // //             token,
// // // //             clientType: 'dashboard'
// // // //           });
// // // //         });
        
// // // //         newSocket.on('disconnect', () => {
// // // //           console.log('Disconnected from notification server');
// // // //           setConnected(false);
// // // //         });
        
// // // //         newSocket.on('authenticated', (response) => {
// // // //           if (response.success) {
// // // //             console.log('Successfully authenticated with notification server');
// // // //             // Fetch existing notifications
// // // //             newSocket.emit('get-notifications', {
// // // //               clientType: 'dashboard'
// // // //             });
// // // //           } else {
// // // //             console.error('Authentication failed:', response.error);
// // // //           }
// // // //         });
        
// // // //         newSocket.on('notifications-list', (data) => {
// // // //           if (data.notifications && Array.isArray(data.notifications)) {
// // // //             const formattedNotifications = data.notifications.map(formatNotification);
// // // //             setNotifications(formattedNotifications);
// // // //             setUnreadCount(formattedNotifications.filter(n => !n.read).length);
// // // //           }
// // // //         });
        
// // // //         newSocket.on('new-notification', (notification) => {
// // // //           console.log('New notification received:', notification);
// // // //           const formattedNotification = formatNotification(notification);
          
// // // //           setNotifications(prev => [formattedNotification, ...prev]);
// // // //           setUnreadCount(prev => prev + 1);
          
// // // //           // Play notification sound
// // // //           const audio = new Audio('/notification-sound.mp3');
// // // //           audio.play().catch(e => console.error('Error playing sound:', e));
// // // //         });
        
// // // //         newSocket.on('notification-updated', (data) => {
// // // //           if (data.success && data.id) {
// // // //             setNotifications(prev => 
// // // //               prev.map(n => 
// // // //                 n.id === data.id ? { ...n, read: true } : n
// // // //               )
// // // //             );
// // // //             setUnreadCount(prev => Math.max(0, prev - 1));
// // // //           }
// // // //         });
        
// // // //         newSocket.on('error', (error) => {
// // // //           console.error('Socket error:', error);
// // // //         });
// // // //       } catch (error) {
// // // //         console.error('Error setting up WebSocket:', error);
// // // //       }
// // // //     };
    
// // // //     if (isOpen) {
// // // //       connectSocket();
// // // //     }
    
// // // //     return () => {
// // // //       if (socket) {
// // // //         socket.disconnect();
// // // //         setSocket(null);
// // // //       }
// // // //     };
// // // //   }, [isOpen, formatNotification]);
  
// // // //   // Setup Firestore listener as fallback
// // // //   useEffect(() => {
// // // //     if (!isOpen) return;
    
// // // //     const q = query(
// // // //       collection(db, 'notifications'),
// // // //       where('recipient', '==', 'dashboard'),
// // // //       orderBy('timestamp', 'desc')
// // // //     );
    
// // // //     const unsubscribe = onSnapshot(q, (snapshot) => {
// // // //       if (!connected) {
// // // //         const newNotifications = [];
// // // //         snapshot.forEach(doc => {
// // // //           newNotifications.push({
// // // //             id: doc.id,
// // // //             ...doc.data()
// // // //           });
// // // //         });
        
// // // //         const formattedNotifications = newNotifications.map(formatNotification);
// // // //         setNotifications(formattedNotifications);
// // // //         setUnreadCount(formattedNotifications.filter(n => !n.read).length);
// // // //       }
// // // //     });
    
// // // //     return unsubscribe;
// // // //   }, [isOpen, connected, db, formatNotification]);
  
// // // //   const handleMarkAsRead = useCallback((notificationId) => {
// // // //     if (!notificationId) return;
    
// // // //     // Update via WebSocket if connected
// // // //     if (connected && socket) {
// // // //       socket.emit('mark-read', { notificationId });
// // // //     } else {
// // // //       // Fallback to Firestore
// // // //       try {
// // // //         updateDoc(doc(db, 'notifications', notificationId), {
// // // //           read: true
// // // //         });
// // // //       } catch (error) {
// // // //         console.error('Error marking notification as read:', error);
// // // //       }
// // // //     }
    
// // // //     // Optimistically update UI
// // // //     setNotifications(prev => 
// // // //       prev.map(n => 
// // // //         n.id === notificationId ? { ...n, read: true } : n
// // // //       )
// // // //     );
// // // //     setUnreadCount(prev => Math.max(0, prev - 1));
// // // //   }, [connected, socket, db]);
  
// // // //   const handleMarkAllAsRead = useCallback(() => {
// // // //     // Get all unread notification IDs
// // // //     const unreadIds = notifications
// // // //       .filter(n => !n.read)
// // // //       .map(n => n.id);
    
// // // //     if (unreadIds.length === 0) return;
    
// // // //     // Mark each as read
// // // //     unreadIds.forEach(id => {
// // // //       if (connected && socket) {
// // // //         socket.emit('mark-read', { notificationId: id });
// // // //       } else {
// // // //         try {
// // // //           updateDoc(doc(db, 'notifications', id), {
// // // //             read: true
// // // //           });
// // // //         } catch (error) {
// // // //           console.error('Error marking notification as read:', error);
// // // //         }
// // // //       }
// // // //     });
    
// // // //     // Optimistically update UI
// // // //     setNotifications(prev => 
// // // //       prev.map(n => ({ ...n, read: true }))
// // // //     );
// // // //     setUnreadCount(0);
// // // //   }, [notifications, connected, socket, db]);
  
// // // //   const handleNotificationClick = useCallback((notification) => {
// // // //     // Mark as read if not already
// // // //     if (!notification.read) {
// // // //       handleMarkAsRead(notification.id);
// // // //     }
    
// // // //     // Handle the notification based on type
// // // //     if (notification.type === 'support' && notification.data?.ticketId) {
// // // //       onSelectTicket?.(notification.data.ticketId);
// // // //       onClose();
// // // //     }
// // // //   }, [handleMarkAsRead, onSelectTicket, onClose]);
  
// // // //   return (
// // // //     <>
// // // //       {/* Backdrop */}
// // // //       {isOpen && (
// // // //         <div 
// // // //           className="fixed inset-0 bg-black/50 transition-opacity z-50"
// // // //           onClick={onClose}
// // // //         />
// // // //       )}

// // // //       {/* Sidebar */}
// // // //       <div 
// // // //         className={`fixed inset-y-0 right-0 w-[350px] bg-white transform transition-transform duration-300 ease-in-out z-50 ${
// // // //           isOpen ? 'translate-x-0' : 'translate-x-full'
// // // //         }`}
// // // //       >
// // // //         {/* Header */}
// // // //         <div className="px-4 py-4 border-b border-gray-100 flex justify-between items-center">
// // // //           <h2 className="text-lg font-semibold text-gray-900">
// // // //             Notifications
// // // //             {unreadCount > 0 && (
// // // //               <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
// // // //                 {unreadCount} new
// // // //               </span>
// // // //             )}
// // // //           </h2>
// // // //           <button 
// // // //             onClick={onClose}
// // // //             className="p-1 hover:bg-gray-100 rounded-full transition-colors"
// // // //           >
// // // //             <X className="h-4 w-4 text-gray-500" />
// // // //           </button>
// // // //         </div>

// // // //         {/* Connection Status */}
// // // //         {!connected && (
// // // //           <div className="px-4 py-2 bg-yellow-50 text-yellow-800 text-sm border-b border-yellow-100">
// // // //             Offline mode. Reconnecting...
// // // //           </div>
// // // //         )}

// // // //         {/* Notifications List */}
// // // //         <div className="overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
// // // //           {notifications.length === 0 ? (
// // // //             <div className="flex flex-col items-center justify-center h-full text-gray-400">
// // // //               <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
// // // //                 <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
// // // //                 <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
// // // //               </svg>
// // // //               <p className="mt-2">No notifications yet</p>
// // // //             </div>
// // // //           ) : (
// // // //             notifications.map((notification) => (
// // // //               <div key={notification.id} onClick={() => handleNotificationClick(notification)} className="cursor-pointer">
// // // //                 <NotificationItem 
// // // //                   {...notification}
// // // //                   onMarkAsRead={handleMarkAsRead}
// // // //                 />
// // // //               </div>
// // // //             ))
// // // //           )}
// // // //         </div>

// // // //         {/* Footer */}
// // // //         <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white flex justify-between">
// // // //           <button 
// // // //             onClick={onClose}
// // // //             className="px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
// // // //           >
// // // //             Close
// // // //           </button>
// // // //           <button 
// // // //             onClick={handleMarkAllAsRead}
// // // //             disabled={unreadCount === 0}
// // // //             className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
// // // //               unreadCount === 0 ? 'bg-blue-300 cursor-not-allowed' : 'bg-[#3B82F6] hover:bg-blue-600'
// // // //             }`}
// // // //           >
// // // //             <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
// // // //               <path d="M16.667 5L7.50033 14.1667L3.33366 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
// // // //             </svg>
// // // //             Mark all as read
// // // //           </button>
// // // //         </div>
// // // //       </div>
// // // //     </>
// // // //   );
// // // // };

// // // // export default NotificationSidebar;

// // // // import React, { useState, useEffect, useCallback, useRef } from 'react';
// // // // import { X } from 'lucide-react';
// // // // import { getAuth } from 'firebase/auth';
// // // // import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, getFirestore, limit } from 'firebase/firestore';
// // // // import io from 'socket.io-client';

// // // // // Server URLs for different environments
// // // // const PRODUCTION_URL = 'https://puriserver.onrender.com';
// // // // const DEVELOPMENT_URL = 'http://localhost:5000';

// // // // // Use the appropriate URL based on environment
// // // // const SERVER_URL = process.env.NODE_ENV === 'production' 
// // // //   ? PRODUCTION_URL 
// // // //   : DEVELOPMENT_URL;

// // // // console.log(`Using notification server: ${SERVER_URL}`);

// // // // const NotificationItem = ({ avatar, name, action, target, time, initials, backgroundColor, read, id, onMarkAsRead }) => {
// // // //   return (
// // // //     <div className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${read ? '' : 'bg-blue-50'}`}>
// // // //       {avatar ? (
// // // //         <img 
// // // //           src={avatar} 
// // // //           alt={name} 
// // // //           className="w-10 h-10 rounded-full object-cover"
// // // //         />
// // // //       ) : (
// // // //         <div 
// // // //           className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
// // // //           style={{ backgroundColor: backgroundColor || '#E5E7EB' }}
// // // //         >
// // // //           {initials}
// // // //         </div>
// // // //       )}
// // // //       <div className="flex-1 min-w-0">
// // // //         <p className="text-[14px] text-gray-900 leading-snug">
// // // //           <span className="font-medium">{name}</span>{' '}
// // // //           <span className="font-normal">{action}</span>
// // // //           {target && <span className="font-medium"> {target}</span>}
// // // //         </p>
// // // //         <p className="text-xs text-gray-400 mt-1">{time}</p>
// // // //       </div>
// // // //       {!read && (
// // // //         <button 
// // // //           onClick={(e) => {
// // // //             e.stopPropagation();
// // // //             onMarkAsRead(id);
// // // //           }}
// // // //           className="text-xs text-blue-600 hover:text-blue-800 whitespace-nowrap"
// // // //         >
// // // //           Mark as read
// // // //         </button>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // const NotificationSidebar = ({ isOpen, onClose, onSelectTicket }) => {
// // // //   const [notifications, setNotifications] = useState([]);
// // // //   const [unreadCount, setUnreadCount] = useState(0);
// // // //   const [socket, setSocket] = useState(null);
// // // //   const [connected, setConnected] = useState(false);
// // // //   const [connectionAttempts, setConnectionAttempts] = useState(0);
// // // //   const db = getFirestore();
// // // //   const firestoreUnsubscribeRef = useRef(null);

// // // //   // Format notification data
// // // //   const formatNotification = useCallback((notification) => {
// // // //     let action = "has sent a notification";
// // // //     let target = "";
// // // //     let name = notification.senderName || "User";
// // // //     let initials = name.split(' ').map(n => n[0]).join('');
    
// // // //     // Handle different notification types
// // // //     if (notification.type === 'support') {
// // // //       action = "has raised a support ticket";
// // // //       target = notification.data?.category ? `for ${notification.data.category}` : "";
      
// // // //       // If we have a phone number, use it for the name if senderName isn't available
// // // //       if (!notification.senderName && notification.data?.phoneNumber) {
// // // //         name = notification.data.phoneNumber;
// // // //         initials = 'U'; // Generic initial for user
// // // //       }
      
// // // //       // If we have senderPhone, use that if no senderName
// // // //       if (!notification.senderName && notification.senderPhone) {
// // // //         name = notification.senderPhone;
// // // //         initials = 'U';
// // // //       }
// // // //     }
    
// // // //     // Format time
// // // //     let time;
// // // //     if (notification.timestamp) {
// // // //       const date = notification.timestamp.toDate ? notification.timestamp.toDate() : new Date(notification.timestamp);
// // // //       const now = new Date();
// // // //       const diffMs = now - date;
// // // //       const diffMins = Math.floor(diffMs / 60000);
// // // //       const diffHours = Math.floor(diffMins / 60);
// // // //       const diffDays = Math.floor(diffHours / 24);
      
// // // //       if (diffMins < 1) {
// // // //         time = 'Just now';
// // // //       } else if (diffMins < 60) {
// // // //         time = `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
// // // //       } else if (diffHours < 24) {
// // // //         time = `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
// // // //       } else if (diffDays < 7) {
// // // //         time = `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
// // // //       } else {
// // // //         time = date.toLocaleDateString();
// // // //       }
// // // //     } else {
// // // //       time = 'Unknown time';
// // // //     }
    
// // // //     // Determine background color based on notification type
// // // //     let backgroundColor = '#E5E7EB'; // Default gray
// // // //     if (notification.type === 'support') {
// // // //       backgroundColor = '#FEE2E2'; // Light red for support tickets
// // // //     }
    
// // // //     return {
// // // //       id: notification.id,
// // // //       name,
// // // //       action,
// // // //       target,
// // // //       time,
// // // //       initials,
// // // //       backgroundColor,
// // // //       read: notification.read || false,
// // // //       data: notification.data,
// // // //       type: notification.type
// // // //     };
// // // //   }, []);

// // // //   // Load notifications from Firestore
// // // //   const loadFirestoreNotifications = useCallback(() => {
// // // //     console.log('Loading notifications from Firestore');
    
// // // //     // Clean up any existing subscription
// // // //     if (firestoreUnsubscribeRef.current) {
// // // //       firestoreUnsubscribeRef.current();
// // // //       firestoreUnsubscribeRef.current = null;
// // // //     }
    
// // // //     const q = query(
// // // //       collection(db, 'notifications'),
// // // //       where('recipient', '==', 'dashboard'),
// // // //       orderBy('timestamp', 'desc'),
// // // //       limit(50)
// // // //     );
    
// // // //     try {
// // // //       const unsubscribe = onSnapshot(q, (snapshot) => {
// // // //         const newNotifications = [];
// // // //         snapshot.forEach(doc => {
// // // //           newNotifications.push({
// // // //             id: doc.id,
// // // //             ...doc.data()
// // // //           });
// // // //         });
        
// // // //         const formattedNotifications = newNotifications.map(formatNotification);
// // // //         setNotifications(formattedNotifications);
// // // //         setUnreadCount(formattedNotifications.filter(n => !n.read).length);
// // // //       }, (error) => {
// // // //         console.error('Error loading Firestore notifications:', error);
// // // //       });
      
// // // //       firestoreUnsubscribeRef.current = unsubscribe;
// // // //       return unsubscribe;
// // // //     } catch (error) {
// // // //       console.error('Error setting up Firestore listener:', error);
// // // //       return () => {};
// // // //     }
// // // //   }, [db, formatNotification]);

// // // //   // Initialize WebSocket connection
// // // //   useEffect(() => {
// // // //     let socketInitialized = false;
    
// // // //     const connectSocket = async () => {
// // // //       if (socketInitialized) return;
// // // //       socketInitialized = true;
      
// // // //       try {
// // // //         const auth = getAuth();
// // // //         const user = auth.currentUser;
        
// // // //         if (!user) {
// // // //           console.log('No user signed in, cannot initialize socket');
// // // //           // Use Firestore fallback
// // // //           loadFirestoreNotifications();
// // // //           return;
// // // //         }
        
// // // //         // Get token for authentication
// // // //         const token = await user.getIdToken();
        
// // // //         // Initialize socket
// // // //         console.log(`Connecting to notification server: ${SERVER_URL}`);
// // // //         const newSocket = io(SERVER_URL, {
// // // //           transports: ['websocket'],
// // // //           timeout: 10000,
// // // //           reconnection: true,
// // // //           reconnectionAttempts: 5
// // // //         });
        
// // // //         setSocket(newSocket);
// // // //         setConnectionAttempts(prev => prev + 1);
        
// // // //         // Set up event listeners
// // // //         newSocket.on('connect', () => {
// // // //           console.log('Connected to notification server');
// // // //           setConnected(true);
          
// // // //           // Authenticate after connection
// // // //           newSocket.emit('authenticate', {
// // // //             token,
// // // //             clientType: 'dashboard'
// // // //           });
// // // //         });
        
// // // //         newSocket.on('disconnect', () => {
// // // //           console.log('Disconnected from notification server');
// // // //           setConnected(false);
// // // //         });
        
// // // //         newSocket.on('connect_error', (error) => {
// // // //           console.error('Connection error:', error);
// // // //           setConnected(false);
// // // //           setConnectionAttempts(prev => prev + 1);
// // // //         });
        
// // // //         newSocket.on('authenticated', (response) => {
// // // //           if (response.success) {
// // // //             console.log('Successfully authenticated with notification server');
// // // //             // Fetch existing notifications
// // // //             newSocket.emit('get-notifications', {
// // // //               clientType: 'dashboard'
// // // //             });
// // // //           } else {
// // // //             console.error('Authentication failed:', response.error);
// // // //           }
// // // //         });
        
// // // //         newSocket.on('notifications-list', (data) => {
// // // //           if (data.notifications && Array.isArray(data.notifications)) {
// // // //             const formattedNotifications = data.notifications.map(formatNotification);
// // // //             setNotifications(formattedNotifications);
// // // //             setUnreadCount(formattedNotifications.filter(n => !n.read).length);
// // // //           }
// // // //         });
        
// // // //         newSocket.on('new-notification', (notification) => {
// // // //           console.log('New notification received:', notification);
// // // //           const formattedNotification = formatNotification(notification);
          
// // // //           setNotifications(prev => {
// // // //             // Make sure we don't add duplicates
// // // //             const exists = prev.some(n => n.id === formattedNotification.id);
// // // //             if (exists) return prev;
// // // //             return [formattedNotification, ...prev];
// // // //           });
          
// // // //           if (!notification.read) {
// // // //             setUnreadCount(prev => prev + 1);
            
// // // //             // Play notification sound
// // // //             try {
// // // //               const audio = new Audio('/notification-sound.mp3');
// // // //               audio.play().catch(e => console.error('Error playing sound:', e));
// // // //             } catch (error) {
// // // //               console.error('Error playing notification sound:', error);
// // // //             }
// // // //           }
// // // //         });
        
// // // //         newSocket.on('notification-updated', (data) => {
// // // //           if (data.success && data.id) {
// // // //             setNotifications(prev => 
// // // //               prev.map(n => 
// // // //                 n.id === data.id ? { ...n, read: true } : n
// // // //               )
// // // //             );
// // // //             setUnreadCount(prev => Math.max(0, prev - 1));
// // // //           }
// // // //         });
        
// // // //         newSocket.on('error', (error) => {
// // // //           console.error('Socket error:', error);
// // // //         });
// // // //       } catch (error) {
// // // //         console.error('Error setting up WebSocket:', error);
// // // //       }
// // // //     };
    
// // // //     // Connect if sidebar is open
// // // //     if (isOpen) {
// // // //       connectSocket();
// // // //     }
    
// // // //     // Cleanup
// // // //     return () => {
// // // //       if (socket) {
// // // //         socket.disconnect();
// // // //         setSocket(null);
// // // //       }
// // // //     };
// // // //   }, [isOpen, loadFirestoreNotifications, formatNotification]);
  
// // // //   // Use Firestore as fallback if WebSocket fails
// // // //   useEffect(() => {
// // // //     if (!isOpen) return;
    
// // // //     // If we've tried to connect and failed, or if we're not connected after attempting,
// // // //     // use Firestore as fallback
// // // //     if (connectionAttempts >= 2 || (!connected && connectionAttempts > 0)) {
// // // //       loadFirestoreNotifications();
// // // //     }
    
// // // //     return () => {
// // // //       if (firestoreUnsubscribeRef.current) {
// // // //         firestoreUnsubscribeRef.current();
// // // //       }
// // // //     };
// // // //   }, [isOpen, connectionAttempts, connected, loadFirestoreNotifications]);
  
// // // //   const handleMarkAsRead = useCallback((notificationId) => {
// // // //     if (!notificationId) return;
    
// // // //     // Update via WebSocket if connected
// // // //     if (connected && socket) {
// // // //       socket.emit('mark-read', { notificationId });
// // // //     } else {
// // // //       // Fallback to Firestore
// // // //       try {
// // // //         updateDoc(doc(db, 'notifications', notificationId), {
// // // //           read: true
// // // //         });
// // // //       } catch (error) {
// // // //         console.error('Error marking notification as read:', error);
// // // //       }
// // // //     }
    
// // // //     // Optimistically update UI
// // // //     setNotifications(prev => 
// // // //       prev.map(n => 
// // // //         n.id === notificationId ? { ...n, read: true } : n
// // // //       )
// // // //     );
// // // //     setUnreadCount(prev => Math.max(0, prev - 1));
// // // //   }, [connected, socket, db]);
  
// // // //   const handleMarkAllAsRead = useCallback(() => {
// // // //     // Get all unread notification IDs
// // // //     const unreadIds = notifications
// // // //       .filter(n => !n.read)
// // // //       .map(n => n.id);
    
// // // //     if (unreadIds.length === 0) return;
    
// // // //     // Mark each as read
// // // //     unreadIds.forEach(id => {
// // // //       if (connected && socket) {
// // // //         socket.emit('mark-read', { notificationId: id });
// // // //       } else {
// // // //         try {
// // // //           updateDoc(doc(db, 'notifications', id), {
// // // //             read: true
// // // //           });
// // // //         } catch (error) {
// // // //           console.error('Error marking notification as read:', error);
// // // //         }
// // // //       }
// // // //     });
    
// // // //     // Optimistically update UI
// // // //     setNotifications(prev => 
// // // //       prev.map(n => ({ ...n, read: true }))
// // // //     );
// // // //     setUnreadCount(0);
// // // //   }, [notifications, connected, socket, db]);
  
// // // //   const handleNotificationClick = useCallback((notification) => {
// // // //     // Mark as read if not already
// // // //     if (!notification.read) {
// // // //       handleMarkAsRead(notification.id);
// // // //     }
    
// // // //     // Handle the notification based on type
// // // //     if (notification.type === 'support' && notification.data?.ticketId) {
// // // //       onSelectTicket?.(notification.data.ticketId);
// // // //       onClose();
// // // //     }
// // // //   }, [handleMarkAsRead, onSelectTicket, onClose]);
  
// // // //   return (
// // // //     <>
// // // //       {/* Backdrop */}
// // // //       {isOpen && (
// // // //         <div 
// // // //           className="fixed inset-0 bg-black/50 transition-opacity z-50"
// // // //           onClick={onClose}
// // // //         />
// // // //       )}

// // // //       {/* Sidebar */}
// // // //       <div 
// // // //         className={`fixed inset-y-0 right-0 w-[350px] bg-white transform transition-transform duration-300 ease-in-out z-50 ${
// // // //           isOpen ? 'translate-x-0' : 'translate-x-full'
// // // //         }`}
// // // //       >
// // // //         {/* Header */}
// // // //         <div className="px-4 py-4 border-b border-gray-100 flex justify-between items-center">
// // // //           <h2 className="text-lg font-semibold text-gray-900">
// // // //             Notifications
// // // //             {unreadCount > 0 && (
// // // //               <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
// // // //                 {unreadCount} new
// // // //               </span>
// // // //             )}
// // // //           </h2>
// // // //           <button 
// // // //             onClick={onClose}
// // // //             className="p-1 hover:bg-gray-100 rounded-full transition-colors"
// // // //           >
// // // //             <X className="h-4 w-4 text-gray-500" />
// // // //           </button>
// // // //         </div>

// // // //         {/* Connection Status */}
// // // //         {/* {!connected && (
// // // //           <div className="px-4 py-2 bg-yellow-50 text-yellow-800 text-sm border-b border-yellow-100">
// // // //             Offline mode. Using Firestore for notifications.
// // // //           </div>
// // // //         )} */}

// // // //         {/* Notifications List */}
// // // //         <div className="overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
// // // //           {notifications.length === 0 ? (
// // // //             <div className="flex flex-col items-center justify-center h-full text-gray-400">
// // // //               <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
// // // //                 <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
// // // //                 <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
// // // //               </svg>
// // // //               <p className="mt-2">No notifications yet</p>
// // // //             </div>
// // // //           ) : (
// // // //             notifications.map((notification) => (
// // // //               <div key={notification.id} onClick={() => handleNotificationClick(notification)} className="cursor-pointer">
// // // //                 <NotificationItem 
// // // //                   {...notification}
// // // //                   onMarkAsRead={handleMarkAsRead}
// // // //                 />
// // // //               </div>
// // // //             ))
// // // //           )}
// // // //         </div>

// // // //         {/* Footer */}
// // // //         <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white flex justify-between">
// // // //           <button 
// // // //             onClick={onClose}
// // // //             className="px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
// // // //           >
// // // //             Close
// // // //           </button>
// // // //           <button 
// // // //             onClick={handleMarkAllAsRead}
// // // //             disabled={unreadCount === 0}
// // // //             className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
// // // //               unreadCount === 0 ? 'bg-blue-300 cursor-not-allowed' : 'bg-[#3B82F6] hover:bg-blue-600'
// // // //             }`}
// // // //           >
// // // //             <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
// // // //               <path d="M16.667 5L7.50033 14.1667L3.33366 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
// // // //             </svg>
// // // //             Mark all as read
// // // //           </button>
// // // //         </div>
// // // //       </div>
// // // //     </>
// // // //   );
// // // // };

// // // // export default NotificationSidebar;
// // // // src/components/NotificationSidebar.js


// // // import React, { useCallback } from 'react';
// // // import { X } from 'lucide-react';
// // // import { useNotifications } from '../context/NotificationContext';

// // // const NotificationItem = ({ avatar, name, action, target, time, initials, backgroundColor, read, id, onMarkAsRead }) => {
// // //   return (
// // //     <div className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${read ? '' : 'bg-blue-50'}`}>
// // //       {avatar ? (
// // //         <img 
// // //           src={avatar} 
// // //           alt={name} 
// // //           className="w-10 h-10 rounded-full object-cover"
// // //         />
// // //       ) : (
// // //         <div 
// // //           className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
// // //           style={{ backgroundColor: backgroundColor || '#E5E7EB' }}
// // //         >
// // //           {initials}
// // //         </div>
// // //       )}
// // //       <div className="flex-1 min-w-0">
// // //         <p className="text-[14px] text-gray-900 leading-snug">
// // //           <span className="font-medium">{name}</span>{' '}
// // //           <span className="font-normal">{action}</span>
// // //           {target && <span className="font-medium"> {target}</span>}
// // //         </p>
// // //         <p className="text-xs text-gray-400 mt-1">{time}</p>
// // //       </div>
// // //       {!read && (
// // //         <button 
// // //           onClick={(e) => {
// // //             e.stopPropagation();
// // //             onMarkAsRead(id);
// // //           }}
// // //           className="text-xs text-blue-600 hover:text-blue-800 whitespace-nowrap"
// // //         >
// // //           Mark as read
// // //         </button>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // const NotificationSidebar = ({ onSelectTicket }) => {
// // //   const { 
// // //     notifications, 
// // //     unreadCount, 
// // //     isOpen, 
// // //     closeSidebar, 
// // //     markAsRead, 
// // //     markAllAsRead,
// // //     clearAllNotifications,
// // //     connected
// // //   } = useNotifications();
  
// // //   const handleNotificationClick = useCallback((notification) => {
// // //     // Mark as read if not already
// // //     if (!notification.read) {
// // //       markAsRead(notification.id);
// // //     }
    
// // //     // Handle the notification based on type
// // //     if (notification.type === 'support' && notification.data?.ticketId) {
// // //       if (onSelectTicket) {
// // //         onSelectTicket(notification.data.ticketId);
// // //         closeSidebar();
// // //       }
// // //     }
// // //   }, [markAsRead, onSelectTicket, closeSidebar]);
  
// // //   // Don't render if not open to improve performance
// // //   if (!isOpen) {
// // //     return null;
// // //   }
  
// // //   return (
// // //     <>
// // //       {/* Backdrop */}
// // //       <div 
// // //         className="fixed inset-0 bg-black/20 transition-opacity z-50"
// // //         onClick={closeSidebar}
// // //       />

// // //       {/* Sidebar */}
// // //       <div className="fixed inset-y-0 right-0 w-[350px] bg-white transform transition-transform duration-300 ease-in-out z-50">
// // //         {/* Header */}
// // //         <div className="px-4 py-4 border-b border-gray-100 flex justify-between items-center">
// // //           <h2 className="text-lg font-semibold text-gray-900">
// // //             Notifications
// // //             {unreadCount > 0 && (
// // //               <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
// // //                 {unreadCount} new
// // //               </span>
// // //             )}
// // //           </h2>
// // //           <button 
// // //             onClick={closeSidebar}
// // //             className="p-1 hover:bg-gray-100 rounded-full transition-colors"
// // //           >
// // //             <X className="h-4 w-4 text-gray-500" />
// // //           </button>
// // //         </div>

// // //         {/* Connection Status (optional) */}
// // //         {/* {!connected && (
// // //           <div className="px-4 py-2 bg-yellow-50 text-yellow-800 text-sm border-b border-yellow-100">
// // //             Offline mode. Using local database for notifications.
// // //           </div>
// // //         )} */}

// // //         {/* Notifications List */}
// // //         <div className="overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
// // //           {notifications.length === 0 ? (
// // //             <div className="flex flex-col items-center justify-center h-full text-gray-400">
// // //               <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
// // //                 <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
// // //                 <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
// // //               </svg>
// // //               <p className="mt-2">No notifications yet</p>
// // //             </div>
// // //           ) : (
// // //             notifications.map((notification) => (
// // //               <div key={notification.id} onClick={() => handleNotificationClick(notification)} className="cursor-pointer">
// // //                 <NotificationItem 
// // //                   {...notification}
// // //                   onMarkAsRead={markAsRead}
// // //                 />
// // //               </div>
// // //             ))
// // //           )}
// // //         </div>

// // //         {/* Footer */}
// // //         <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white flex justify-between">
// // //           <button 
// // //             onClick={notifications.length > 0 ? clearAllNotifications : closeSidebar}
// // //             className="px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
// // //           >
// // //             {notifications.length > 0 ? "Clear All" : "Close"}
// // //           </button>
// // //           <button 
// // //             onClick={markAllAsRead}
// // //             disabled={unreadCount === 0}
// // //             className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
// // //               unreadCount === 0 ? 'bg-blue-300 cursor-not-allowed' : 'bg-[#3B82F6] hover:bg-blue-600'
// // //             }`}
// // //           >
// // //             <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
// // //               <path d="M16.667 5L7.50033 14.1667L3.33366 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
// // //             </svg>
// // //             Mark all as read
// // //           </button>

          
// // //         </div>
// // //       </div>
// // //     </>
// // //   );
// // // };

// // // export default NotificationSidebar;
// // import React, { useCallback } from 'react';
// // import { X } from 'lucide-react';
// // import { useNotifications } from '../context/NotificationContext';

// // const NotificationItem = ({ avatar, name, action, target, time, initials, backgroundColor, read, id, onMarkAsRead }) => {
// //   return (
// //     <div className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${read ? '' : 'bg-blue-50'}`}>
// //       {avatar ? (
// //         <img 
// //           src={avatar} 
// //           alt={name} 
// //           className="w-10 h-10 rounded-full object-cover"
// //         />
// //       ) : (
// //         <div 
// //           className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
// //           style={{ backgroundColor: backgroundColor || '#E5E7EB' }}
// //         >
// //           {initials}
// //         </div>
// //       )}
// //       <div className="flex-1 min-w-0">
// //         <p className="text-[14px] text-gray-900 leading-snug">
// //           <span className="font-medium">{name}</span>{' '}
// //           <span className="font-normal">{action}</span>
// //           {target && <span className="font-medium"> {target}</span>}
// //         </p>
// //         <p className="text-xs text-gray-400 mt-1">{time}</p>
// //       </div>
// //       {!read && (
// //         <button 
// //           onClick={(e) => {
// //             e.stopPropagation();
// //             onMarkAsRead(id);
// //           }}
// //           className="text-xs text-blue-600 hover:text-blue-800 whitespace-nowrap"
// //         >
// //           Mark as read
// //         </button>
// //       )}
// //     </div>
// //   );
// // };

// // const NotificationSidebar = ({ onSelectTicket }) => {
// //   const { 
// //     notifications, 
// //     unreadCount, 
// //     isOpen, 
// //     closeSidebar, 
// //     markAsRead, 
// //     markAllAsRead,
// //     clearAllNotifications,
// //     connected
// //   } = useNotifications();
  
// //   const handleNotificationClick = useCallback((notification) => {
// //     // Mark as read if not already
// //     if (!notification.read) {
// //       markAsRead(notification.id);
// //     }
    
// //     // Handle the notification based on type
// //     if (notification.type === 'support' && notification.data?.ticketId) {
// //       if (onSelectTicket) {
// //         onSelectTicket(notification.data.ticketId);
// //         closeSidebar();
// //       }
// //     }
// //   }, [markAsRead, onSelectTicket, closeSidebar]);
  
// //   // Don't render if not open to improve performance
// //   if (!isOpen) {
// //     return null;
// //   }
  
// //   return (
// //     <>
// //       {/* Backdrop */}
// //       <div 
// //         className="fixed inset-0 bg-black/20 transition-opacity z-50"
// //         onClick={closeSidebar}
// //       />

// //       {/* Sidebar */}
// //       <div className="fixed inset-y-0 right-0 w-[350px] bg-white transform transition-transform duration-300 ease-in-out z-50">
// //         {/* Header */}
// //         <div className="px-4 py-4 border-b border-gray-100 flex justify-between items-center">
// //           <h2 className="text-lg font-semibold text-gray-900">
// //             Notifications
// //             {unreadCount > 0 && (
// //               <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
// //                 {unreadCount} new
// //               </span>
// //             )}
// //           </h2>
// //           <button 
// //             onClick={closeSidebar}
// //             className="p-1 hover:bg-gray-100 rounded-full transition-colors"
// //           >
// //             <X className="h-4 w-4 text-gray-500" />
// //           </button>
// //         </div>

// //         {/* Connection Status (optional) */}
// //         {/* {!connected && (
// //           <div className="px-4 py-2 bg-yellow-50 text-yellow-800 text-sm border-b border-yellow-100">
// //             Offline mode. Using local database for notifications.
// //           </div>
// //         )} */}

// //         {/* Notifications List */}
// //         <div className="overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
// //           {notifications.length === 0 ? (
// //             <div className="flex flex-col items-center justify-center h-full text-gray-400">
// //               <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
// //                 <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
// //                 <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
// //               </svg>
// //               <p className="mt-2">No notifications yet</p>
// //             </div>
// //           ) : (
// //             notifications.map((notification) => (
// //               <div key={notification.id} onClick={() => handleNotificationClick(notification)} className="cursor-pointer">
// //                 <NotificationItem 
// //                   {...notification}
// //                   onMarkAsRead={markAsRead}
// //                 />
// //               </div>
// //             ))
// //           )}
// //         </div>

// //         {/* Footer */}
// //         <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white flex justify-between">
// //           <button 
// //             onClick={notifications.length > 0 ? clearAllNotifications : closeSidebar}
// //             className="px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
// //           >
// //             {notifications.length > 0 ? "Clear All" : "Close"}
// //           </button>
// //           <button 
// //             onClick={markAllAsRead}
// //             disabled={unreadCount === 0}
// //             className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
// //               unreadCount === 0 ? 'bg-blue-300 cursor-not-allowed' : 'bg-[#3B82F6] hover:bg-blue-600'
// //             }`}
// //           >
// //             <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
// //               <path d="M16.667 5L7.50033 14.1667L3.33366 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
// //             </svg>
// //             Mark all as read
// //           </button>
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default NotificationSidebar;

// import React, { useCallback } from 'react';
// import { X } from 'lucide-react';
// import { useNotifications } from '../context/NotificationContext';

// const NotificationItem = ({ avatar, name, action, target, time, initials, backgroundColor, read, id, onMarkAsRead }) => {
//   return (
//     <div className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${read ? '' : 'bg-blue-50'}`}>
//       {avatar ? (
//         <img 
//           src={avatar} 
//           alt={name} 
//           className="w-10 h-10 rounded-full object-cover"
//         />
//       ) : (
//         <div 
//           className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
//           style={{ backgroundColor: backgroundColor || '#E5E7EB' }}
//         >
//           {initials}
//         </div>
//       )}
//       <div className="flex-1 min-w-0">
//         <p className="text-[14px] text-gray-900 leading-snug">
//           <span className="font-medium">{name}</span>{' '}
//           <span className="font-normal">{action}</span>
//           {target && <span className="font-medium"> {target}</span>}
//         </p>
//         <p className="text-xs text-gray-400 mt-1">{time}</p>
//       </div>
//       {!read && (
//         <button 
//           onClick={(e) => {
//             e.stopPropagation();
//             onMarkAsRead(id);
//           }}
//           className="text-xs text-blue-600 hover:text-blue-800 whitespace-nowrap"
//         >
//           Mark as read
//         </button>
//       )}
//     </div>
//   );
// };

// const NotificationSidebar = ({ onSelectTicket }) => {
//   const { 
//     notifications, 
//     unreadCount, 
//     isOpen, 
//     closeSidebar, 
//     markAsRead, 
//     markAllAsRead,
//     clearAllNotifications,
//     connected
//   } = useNotifications();
  
//   const handleNotificationClick = useCallback((notification) => {
//     // Mark as read if not already
//     if (!notification.read) {
//       markAsRead(notification.id);
//     }
    
//     // Handle the notification based on type
//     if (notification.type === 'support' && notification.data?.ticketId) {
//       if (onSelectTicket) {
//         onSelectTicket(notification.data.ticketId);
//         // Don't close sidebar automatically to keep notifications visible
//         // closeSidebar();
//       }
//     }
    
//     // IMPORTANT: Don't remove the notification from the list
//     // Just mark it as read and keep it visible
//   }, [markAsRead, onSelectTicket]);
  
//   // Don't render if not open to improve performance
//   if (!isOpen) {
//     return null;
//   }
  
//   return (
//     <>
//       {/* Backdrop */}
//       <div 
//         className="fixed inset-0 bg-black/20 transition-opacity z-50"
//         onClick={closeSidebar}
//       />

//       {/* Sidebar */}
//       <div className="fixed inset-y-0 right-0 w-[350px] bg-white transform transition-transform duration-300 ease-in-out z-50">
//         {/* Header */}
//         <div className="px-4 py-4 border-b border-gray-100 flex justify-between items-center">
//           <h2 className="text-lg font-semibold text-gray-900">
//             Notifications
//             {unreadCount > 0 && (
//               <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
//                 {unreadCount} new
//               </span>
//             )}
//           </h2>
//           <button 
//             onClick={closeSidebar}
//             className="p-1 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <X className="h-4 w-4 text-gray-500" />
//           </button>
//         </div>

//         {/* Connection Status (optional) */}
//         {/* {!connected && (
//           <div className="px-4 py-2 bg-yellow-50 text-yellow-800 text-sm border-b border-yellow-100">
//             Offline mode. Using local database for notifications.
//           </div>
//         )} */}

//         {/* Notifications List */}
//         <div className="overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
//           {notifications.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-full text-gray-400">
//               <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
//                 <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
//               </svg>
//               <p className="mt-2">No notifications yet</p>
//             </div>
//           ) : (
//             notifications.map((notification) => (
//               <div key={notification.id} onClick={() => handleNotificationClick(notification)} className="cursor-pointer">
//                 <NotificationItem 
//                   {...notification}
//                   onMarkAsRead={markAsRead}
//                 />
//               </div>
//             ))
//           )}
//         </div>

//         {/* Footer */}
//         <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white flex justify-between">
//           <button 
//             onClick={notifications.length > 0 ? clearAllNotifications : closeSidebar}
//             className="px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
//           >
//             {notifications.length > 0 ? "Clear All" : "Close"}
//           </button>
//           <button 
//             onClick={markAllAsRead}
//             disabled={unreadCount === 0}
//             className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
//               unreadCount === 0 ? 'bg-blue-300 cursor-not-allowed' : 'bg-[#3B82F6] hover:bg-blue-600'
//             }`}
//           >
//             <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//               <path d="M16.667 5L7.50033 14.1667L3.33366 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//             Mark all as read
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default NotificationSidebar;

import React, { useCallback } from 'react';
import { X } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const NotificationItem = ({ avatar, name, action, target, time, initials, backgroundColor, read, id, onMarkAsRead }) => {
  return (
    <div className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${read ? '' : 'bg-blue-50'}`}>
      {avatar ? (
        <img 
          src={avatar} 
          alt={name} 
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
          style={{ backgroundColor: backgroundColor || '#E5E7EB' }}
        >
          {initials}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] text-gray-900 leading-snug">
          <span className="font-medium">{name}</span>{' '}
          <span className="font-normal">{action}</span>
          {target && <span className="font-medium"> {target}</span>}
        </p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
      {!read && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onMarkAsRead(id);
          }}
          className="text-xs text-blue-600 hover:text-blue-800 whitespace-nowrap"
        >
          Mark as read
        </button>
      )}
    </div>
  );
};

const NotificationSidebar = ({ onSelectTicket }) => {
  const { 
    notifications, 
    unreadCount, 
    isOpen, 
    closeSidebar, 
    markAsRead, 
    markAllAsRead,
    clearAllNotifications,
    connected
  } = useNotifications();
  
  const handleNotificationClick = useCallback((notification) => {
    // Mark as read if not already
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Handle the notification based on type
    if (notification.type === 'support' && notification.data?.ticketId) {
      if (onSelectTicket) {
        onSelectTicket(notification.data.ticketId);
        // Don't close sidebar automatically to keep notifications visible
        // closeSidebar();
      }
    }
    
    // IMPORTANT: Don't remove the notification from the list
    // Just mark it as read and keep it visible
  }, [markAsRead, onSelectTicket]);
  
  // Don't render if not open to improve performance
  if (!isOpen) {
    return null;
  }
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 transition-opacity z-50"
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <div className="fixed inset-y-0 right-0 w-[350px] bg-white transform transition-transform duration-300 ease-in-out z-50">
        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                {unreadCount} new
              </span>
            )}
          </h2>
          <button 
            onClick={closeSidebar}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Connection Status (optional) */}
        {/* {!connected && (
          <div className="px-4 py-2 bg-yellow-50 text-yellow-800 text-sm border-b border-yellow-100">
            Offline mode. Using local database for notifications.
          </div>
        )} */}

        {/* Notifications List */}
        <div className="overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <p className="mt-2">No notifications yet</p>
            </div>
          ) : (
            <div className="notification-list">
              {/* Always display all notifications, regardless of read status */}
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  onClick={() => handleNotificationClick(notification)} 
                  className="cursor-pointer"
                >
                  <NotificationItem 
                    {...notification}
                    onMarkAsRead={markAsRead}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white flex justify-between">
          <button 
            onClick={notifications.length > 0 ? clearAllNotifications : closeSidebar}
            className="px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
          >
            {notifications.length > 0 ? "Clear All" : "Close"}
          </button>
          <button 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              unreadCount === 0 ? 'bg-blue-300 cursor-not-allowed' : 'bg-[#3B82F6] hover:bg-blue-600'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M16.667 5L7.50033 14.1667L3.33366 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Mark all as read
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationSidebar;