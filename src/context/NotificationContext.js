
// // // // // // // // import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
// // // // // // // // import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, getFirestore, limit, deleteDoc } from 'firebase/firestore';
// // // // // // // // import { getAuth } from 'firebase/auth';
// // // // // // // // import io from 'socket.io-client';
// // // // // // // // import { toast, ToastContainer } from 'react-toastify';
// // // // // // // // import 'react-toastify/dist/ReactToastify.css';

// // // // // // // // // Create the context
// // // // // // // // const NotificationContext = createContext();

// // // // // // // // // Server URLs for different environments
// // // // // // // // const PRODUCTION_URL = 'https://puriserver.onrender.com';
// // // // // // // // const DEVELOPMENT_URL = 'http://localhost:5000';
// // // // // // // // const SERVER_URL = process.env.NODE_ENV === 'production' ? PRODUCTION_URL : DEVELOPMENT_URL;

// // // // // // // // export const useNotifications = () => useContext(NotificationContext);

// // // // // // // // export const NotificationProvider = ({ children }) => {
// // // // // // // //   const [notifications, setNotifications] = useState([]);
// // // // // // // //   const [unreadCount, setUnreadCount] = useState(0);
// // // // // // // //   const [isOpen, setIsOpen] = useState(false);
// // // // // // // //   const [socket, setSocket] = useState(null);
// // // // // // // //   const [connected, setConnected] = useState(false);
// // // // // // // //   const [connectionAttempts, setConnectionAttempts] = useState(0);
// // // // // // // //   const db = getFirestore();
// // // // // // // //   const firestoreUnsubscribeRef = useRef(null);

// // // // // // // //   // Format notification data
// // // // // // // //   const formatNotification = useCallback((notification) => {
// // // // // // // //     let action = "has sent a notification";
// // // // // // // //     let target = "";
// // // // // // // //     let name = notification.senderName || "User";
// // // // // // // //     let initials = name.split(' ').map(n => n[0]).join('');
    
// // // // // // // //     // Handle different notification types
// // // // // // // //     if (notification.type === 'support') {
// // // // // // // //       action = "has raised a support ticket";
// // // // // // // //       target = notification.data?.category ? `for ${notification.data.category}` : "";
      
// // // // // // // //       if (!notification.senderName && notification.data?.phoneNumber) {
// // // // // // // //         name = notification.data.phoneNumber;
// // // // // // // //         initials = 'U';
// // // // // // // //       }
      
// // // // // // // //       if (!notification.senderName && notification.senderPhone) {
// // // // // // // //         name = notification.senderPhone;
// // // // // // // //         initials = 'U';
// // // // // // // //       }
// // // // // // // //     }
    
// // // // // // // //     // Format time - Fixed to handle various timestamp formats
// // // // // // // //     let time;
// // // // // // // //     if (notification.timestamp) {
// // // // // // // //       try {
// // // // // // // //         // Handle Firebase timestamp object (has toDate method)
// // // // // // // //         if (notification.timestamp.toDate) {
// // // // // // // //           time = formatTimeAgo(notification.timestamp.toDate());
// // // // // // // //         } 
// // // // // // // //         // Handle ISO string timestamp
// // // // // // // //         else if (typeof notification.timestamp === 'string') {
// // // // // // // //           time = formatTimeAgo(new Date(notification.timestamp));
// // // // // // // //         } 
// // // // // // // //         // Handle timestamp number/seconds
// // // // // // // //         else if (typeof notification.timestamp === 'number') {
// // // // // // // //           // Check if this is seconds (Firebase timestamp) or milliseconds
// // // // // // // //           const date = notification.timestamp > 9999999999
// // // // // // // //             ? new Date(notification.timestamp) // milliseconds
// // // // // // // //             : new Date(notification.timestamp * 1000); // seconds
// // // // // // // //           time = formatTimeAgo(date);
// // // // // // // //         }
// // // // // // // //         // If none of these, fallback
// // // // // // // //         else {
// // // // // // // //           time = 'Recent';
// // // // // // // //         }
// // // // // // // //       } catch (err) {
// // // // // // // //         console.error('Error formatting timestamp:', err, notification.timestamp);
// // // // // // // //         time = 'Recent';
// // // // // // // //       }
// // // // // // // //     } else {
// // // // // // // //       time = 'Recent';
// // // // // // // //     }
    
// // // // // // // //     // Determine background color based on notification type
// // // // // // // //     let backgroundColor = '#E5E7EB'; // Default gray
// // // // // // // //     if (notification.type === 'support') {
// // // // // // // //       backgroundColor = '#FEE2E2'; // Light red for support tickets
// // // // // // // //     }
    
// // // // // // // //     return {
// // // // // // // //       id: notification.id,
// // // // // // // //       name,
// // // // // // // //       action,
// // // // // // // //       target,
// // // // // // // //       time,
// // // // // // // //       initials,
// // // // // // // //       backgroundColor,
// // // // // // // //       read: notification.read || false,
// // // // // // // //       data: notification.data,
// // // // // // // //       type: notification.type,
// // // // // // // //       title: notification.title || `New ${notification.type || 'notification'}`
// // // // // // // //     };
// // // // // // // //   }, []);

// // // // // // // //   // Helper function to format time ago
// // // // // // // //   const formatTimeAgo = (date) => {
// // // // // // // //     if (!(date instanceof Date) || isNaN(date.getTime())) {
// // // // // // // //       console.warn('Invalid date provided to formatTimeAgo', date);
// // // // // // // //       return 'Recent';
// // // // // // // //     }
    
// // // // // // // //     const now = new Date();
// // // // // // // //     const diffMs = now - date;
// // // // // // // //     const diffMins = Math.floor(diffMs / 60000);
// // // // // // // //     const diffHours = Math.floor(diffMins / 60);
// // // // // // // //     const diffDays = Math.floor(diffHours / 24);
    
// // // // // // // //     if (diffMins < 1) {
// // // // // // // //       return 'Just now';
// // // // // // // //     } else if (diffMins < 60) {
// // // // // // // //       return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
// // // // // // // //     } else if (diffHours < 24) {
// // // // // // // //       return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
// // // // // // // //     } else if (diffDays < 7) {
// // // // // // // //       return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
// // // // // // // //     } else {
// // // // // // // //       return date.toLocaleDateString();
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   // Load notifications from Firestore
// // // // // // // //   const loadFirestoreNotifications = useCallback(() => {
// // // // // // // //     console.log('Loading notifications from Firestore');
    
// // // // // // // //     // Clean up any existing subscription
// // // // // // // //     if (firestoreUnsubscribeRef.current) {
// // // // // // // //       firestoreUnsubscribeRef.current();
// // // // // // // //       firestoreUnsubscribeRef.current = null;
// // // // // // // //     }
    
// // // // // // // //     const q = query(
// // // // // // // //       collection(db, 'notifications'),
// // // // // // // //       where('recipient', '==', 'dashboard'),
// // // // // // // //       orderBy('timestamp', 'desc'),
// // // // // // // //       limit(50)
// // // // // // // //     );
    
// // // // // // // //     try {
// // // // // // // //       const unsubscribe = onSnapshot(q, (snapshot) => {
// // // // // // // //         const newNotifications = [];
// // // // // // // //         snapshot.forEach(doc => {
// // // // // // // //           newNotifications.push({
// // // // // // // //             id: doc.id,
// // // // // // // //             ...doc.data()
// // // // // // // //           });
// // // // // // // //         });
        
// // // // // // // //         const formattedNotifications = newNotifications.map(formatNotification);
// // // // // // // //         setNotifications(formattedNotifications);
// // // // // // // //         setUnreadCount(formattedNotifications.filter(n => !n.read).length);
// // // // // // // //       }, (error) => {
// // // // // // // //         console.error('Error loading Firestore notifications:', error);
// // // // // // // //       });
      
// // // // // // // //       firestoreUnsubscribeRef.current = unsubscribe;
// // // // // // // //       return unsubscribe;
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error('Error setting up Firestore listener:', error);
// // // // // // // //       return () => {};
// // // // // // // //     }
// // // // // // // //   }, [db, formatNotification]);

// // // // // // // //   // Initialize WebSocket connection
// // // // // // // //   useEffect(() => {
// // // // // // // //     let socketInitialized = false;
// // // // // // // //     let cleanup = null;
    
// // // // // // // //     const connectSocket = async () => {
// // // // // // // //       if (socketInitialized) return;
// // // // // // // //       socketInitialized = true;
      
// // // // // // // //       try {
// // // // // // // //         const auth = getAuth();
// // // // // // // //         const user = auth.currentUser;
        
// // // // // // // //         if (!user) {
// // // // // // // //           console.log('No user signed in, using Firestore fallback');
// // // // // // // //           const unsubscribe = loadFirestoreNotifications();
// // // // // // // //           return () => unsubscribe();
// // // // // // // //         }
        
// // // // // // // //         // Get token for authentication
// // // // // // // //         const token = await user.getIdToken();
        
// // // // // // // //         // Initialize socket
// // // // // // // //         console.log(`Connecting to notification server: ${SERVER_URL}`);
// // // // // // // //         const newSocket = io(SERVER_URL, {
// // // // // // // //           transports: ['websocket'],
// // // // // // // //           timeout: 10000,
// // // // // // // //           reconnection: true,
// // // // // // // //           reconnectionAttempts: 5
// // // // // // // //         });
        
// // // // // // // //         setSocket(newSocket);
// // // // // // // //         setConnectionAttempts(prev => prev + 1);
        
// // // // // // // //         // Set up event listeners
// // // // // // // //         newSocket.on('connect', () => {
// // // // // // // //           console.log('Connected to notification server');
// // // // // // // //           setConnected(true);
          
// // // // // // // //           // Authenticate after connection
// // // // // // // //           newSocket.emit('authenticate', {
// // // // // // // //             token,
// // // // // // // //             clientType: 'dashboard'
// // // // // // // //           });
// // // // // // // //         });
        
// // // // // // // //         newSocket.on('disconnect', () => {
// // // // // // // //           console.log('Disconnected from notification server');
// // // // // // // //           setConnected(false);
// // // // // // // //         });
        
// // // // // // // //         newSocket.on('connect_error', (error) => {
// // // // // // // //           console.error('Connection error:', error);
// // // // // // // //           setConnected(false);
// // // // // // // //           setConnectionAttempts(prev => prev + 1);
// // // // // // // //         });
        
// // // // // // // //         newSocket.on('authenticated', (response) => {
// // // // // // // //           if (response.success) {
// // // // // // // //             console.log('Successfully authenticated with notification server');
// // // // // // // //             // Fetch existing notifications
// // // // // // // //             newSocket.emit('get-notifications', {
// // // // // // // //               clientType: 'dashboard'
// // // // // // // //             });
// // // // // // // //           } else {
// // // // // // // //             console.error('Authentication failed:', response.error);
            
// // // // // // // //             // Use Firestore as fallback
// // // // // // // //             loadFirestoreNotifications();
// // // // // // // //           }
// // // // // // // //         });
        
// // // // // // // //         newSocket.on('notifications-list', (data) => {
// // // // // // // //           if (data.notifications && Array.isArray(data.notifications)) {
// // // // // // // //             const formattedNotifications = data.notifications.map(formatNotification);
// // // // // // // //             setNotifications(formattedNotifications);
// // // // // // // //             setUnreadCount(formattedNotifications.filter(n => !n.read).length);
// // // // // // // //           }
// // // // // // // //         });
        
// // // // // // // //         newSocket.on('new-notification', (notification) => {
// // // // // // // //           console.log('New notification received:', notification);
// // // // // // // //           const formattedNotification = formatNotification(notification);
          
// // // // // // // //           // Add to notifications list
// // // // // // // //           setNotifications(prev => {
// // // // // // // //             // Make sure we don't add duplicates
// // // // // // // //             const exists = prev.some(n => n.id === formattedNotification.id);
// // // // // // // //             if (exists) return prev;
// // // // // // // //             return [formattedNotification, ...prev];
// // // // // // // //           });
          
// // // // // // // //           if (!notification.read) {
// // // // // // // //             setUnreadCount(prev => prev + 1);
            
// // // // // // // //             // Show toast notification
// // // // // // // //             showToastNotification(formattedNotification);
            
// // // // // // // //             // Play notification sound
// // // // // // // //             try {
// // // // // // // //               const audio = new Audio('/notification-sound.mp3');
// // // // // // // //               audio.play().catch(e => console.error('Error playing sound:', e));
// // // // // // // //             } catch (error) {
// // // // // // // //               console.error('Error playing notification sound:', error);
// // // // // // // //             }
// // // // // // // //           }
// // // // // // // //         });
        
// // // // // // // //         newSocket.on('notification-updated', (data) => {
// // // // // // // //           if (data.success && data.id) {
// // // // // // // //             setNotifications(prev => 
// // // // // // // //               prev.map(n => 
// // // // // // // //                 n.id === data.id ? { ...n, read: true } : n
// // // // // // // //               )
// // // // // // // //             );
// // // // // // // //             setUnreadCount(prev => Math.max(0, prev - 1));
// // // // // // // //           }
// // // // // // // //         });
        
// // // // // // // //         newSocket.on('error', (error) => {
// // // // // // // //           console.error('Socket error:', error);
// // // // // // // //         });
        
// // // // // // // //         return () => {
// // // // // // // //           newSocket.disconnect();
// // // // // // // //         };
// // // // // // // //       } catch (error) {
// // // // // // // //         console.error('Error setting up WebSocket:', error);
        
// // // // // // // //         // Use Firestore as fallback
// // // // // // // //         const unsubscribe = loadFirestoreNotifications();
// // // // // // // //         return () => unsubscribe();
// // // // // // // //       }
// // // // // // // //     };
    
// // // // // // // //     cleanup = connectSocket();
    
// // // // // // // //     return () => {
// // // // // // // //       if (typeof cleanup === 'function') {
// // // // // // // //         cleanup();
// // // // // // // //       }
      
// // // // // // // //       if (socket) {
// // // // // // // //         socket.disconnect();
// // // // // // // //         setSocket(null);
// // // // // // // //       }
// // // // // // // //     };
// // // // // // // //   }, [loadFirestoreNotifications, formatNotification]);
  
// // // // // // // //   // Use Firestore as fallback if WebSocket fails
// // // // // // // //   useEffect(() => {
// // // // // // // //     // If we've tried to connect and failed, or if we're not connected after attempting,
// // // // // // // //     // use Firestore as fallback
// // // // // // // //     if (connectionAttempts >= 2 || (!connected && connectionAttempts > 0)) {
// // // // // // // //       loadFirestoreNotifications();
// // // // // // // //     }
    
// // // // // // // //     return () => {
// // // // // // // //       if (firestoreUnsubscribeRef.current) {
// // // // // // // //         firestoreUnsubscribeRef.current();
// // // // // // // //       }
// // // // // // // //     };
// // // // // // // //   }, [connectionAttempts, connected, loadFirestoreNotifications]);
  
// // // // // // // //   // Show toast notification
// // // // // // // //   const showToastNotification = (notification) => {
// // // // // // // //     const NotificationContent = () => (
// // // // // // // //       <div className="flex items-start gap-3">
// // // // // // // //         <div 
// // // // // // // //           className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
// // // // // // // //           style={{ backgroundColor: notification.backgroundColor || '#E5E7EB' }}
// // // // // // // //         >
// // // // // // // //           {notification.initials}
// // // // // // // //         </div>
// // // // // // // //         <div>
// // // // // // // //           <p className="font-medium">{notification.title || 'New notification'}</p>
// // // // // // // //           <p className="text-sm">
// // // // // // // //             <span className="font-medium">{notification.name}</span>{' '}
// // // // // // // //             <span>{notification.action}</span>
// // // // // // // //             {notification.target && <span> {notification.target}</span>}
// // // // // // // //           </p>
// // // // // // // //         </div>
// // // // // // // //       </div>
// // // // // // // //     );
    
// // // // // // // //     toast(<NotificationContent />, {
// // // // // // // //       position: "top-right",
// // // // // // // //       autoClose: 5000,
// // // // // // // //       hideProgressBar: false,
// // // // // // // //       closeOnClick: true,
// // // // // // // //       pauseOnHover: true,
// // // // // // // //       draggable: true,
// // // // // // // //       progress: undefined,
// // // // // // // //       onClick: () => {
// // // // // // // //         // Open notification sidebar when toast is clicked
// // // // // // // //         setIsOpen(true);
// // // // // // // //       }
// // // // // // // //     });
// // // // // // // //   };
  
// // // // // // // //   // Mark notification as read
// // // // // // // //   const markAsRead = useCallback((notificationId) => {
// // // // // // // //     if (!notificationId) return;
    
// // // // // // // //     // Update via WebSocket if connected
// // // // // // // //     if (connected && socket) {
// // // // // // // //       socket.emit('mark-read', { notificationId });
// // // // // // // //     } else {
// // // // // // // //       // Fallback to Firestore
// // // // // // // //       try {
// // // // // // // //         updateDoc(doc(db, 'notifications', notificationId), {
// // // // // // // //           read: true
// // // // // // // //         });
// // // // // // // //       } catch (error) {
// // // // // // // //         console.error('Error marking notification as read:', error);
// // // // // // // //       }
// // // // // // // //     }
    
// // // // // // // //     // Optimistically update UI
// // // // // // // //     setNotifications(prev => 
// // // // // // // //       prev.map(n => 
// // // // // // // //         n.id === notificationId ? { ...n, read: true } : n
// // // // // // // //       )
// // // // // // // //     );
// // // // // // // //     setUnreadCount(prev => Math.max(0, prev - 1));
// // // // // // // //   }, [connected, socket, db]);
  
// // // // // // // //   // Mark all notifications as read
// // // // // // // //   const markAllAsRead = useCallback(() => {
// // // // // // // //     // Get all unread notification IDs
// // // // // // // //     const unreadIds = notifications
// // // // // // // //       .filter(n => !n.read)
// // // // // // // //       .map(n => n.id);
    
// // // // // // // //     if (unreadIds.length === 0) return;
    
// // // // // // // //     // Mark each as read
// // // // // // // //     unreadIds.forEach(id => {
// // // // // // // //       if (connected && socket) {
// // // // // // // //         socket.emit('mark-read', { notificationId: id });
// // // // // // // //       } else {
// // // // // // // //         try {
// // // // // // // //           updateDoc(doc(db, 'notifications', id), {
// // // // // // // //             read: true
// // // // // // // //           });
// // // // // // // //         } catch (error) {
// // // // // // // //           console.error('Error marking notification as read:', error);
// // // // // // // //         }
// // // // // // // //       }
// // // // // // // //     });
    
// // // // // // // //     // Optimistically update UI
// // // // // // // //     setNotifications(prev => 
// // // // // // // //       prev.map(n => ({ ...n, read: true }))
// // // // // // // //     );
// // // // // // // //     setUnreadCount(0);
// // // // // // // //   }, [notifications, connected, socket, db]);

// // // // // // // //   // Clear all notifications
// // // // // // // //   const clearAllNotifications = useCallback(async () => {
// // // // // // // //     if (notifications.length === 0) return;
    
// // // // // // // //     try {
// // // // // // // //       // Delete all notifications from Firestore
// // // // // // // //       const deletePromises = notifications.map(notification => 
// // // // // // // //         deleteDoc(doc(db, 'notifications', notification.id))
// // // // // // // //       );
      
// // // // // // // //       await Promise.all(deletePromises);
      
// // // // // // // //       // Clear notifications from state
// // // // // // // //       setNotifications([]);
// // // // // // // //       setUnreadCount(0);
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error('Error clearing notifications:', error);
// // // // // // // //     }
// // // // // // // //   }, [notifications, db]);
  
// // // // // // // //   // Toggle sidebar
// // // // // // // //   const toggleSidebar = useCallback(() => {
// // // // // // // //     setIsOpen(prev => !prev);
// // // // // // // //   }, []);
  
// // // // // // // //   // Close sidebar
// // // // // // // //   const closeSidebar = useCallback(() => {
// // // // // // // //     setIsOpen(false);
// // // // // // // //   }, []);
  
// // // // // // // //   // Open sidebar
// // // // // // // //   const openSidebar = useCallback(() => {
// // // // // // // //     setIsOpen(true);
// // // // // // // //   }, []);
  
// // // // // // // //   // Context value
// // // // // // // //   const value = {
// // // // // // // //     notifications,
// // // // // // // //     unreadCount,
// // // // // // // //     isOpen,
// // // // // // // //     markAsRead,
// // // // // // // //     markAllAsRead,
// // // // // // // //     clearAllNotifications,
// // // // // // // //     toggleSidebar,
// // // // // // // //     closeSidebar,
// // // // // // // //     openSidebar,
// // // // // // // //     connected
// // // // // // // //   };
  
// // // // // // // //   return (
// // // // // // // //     <NotificationContext.Provider value={value}>
// // // // // // // //       {children}
// // // // // // // //       <ToastContainer
// // // // // // // //         position="top-right"
// // // // // // // //         autoClose={5000}
// // // // // // // //         hideProgressBar={false}
// // // // // // // //         newestOnTop
// // // // // // // //         closeOnClick
// // // // // // // //         rtl={false}
// // // // // // // //         pauseOnFocusLoss
// // // // // // // //         draggable
// // // // // // // //         pauseOnHover
// // // // // // // //       />
// // // // // // // //     </NotificationContext.Provider>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // export default NotificationContext;
// // // // // // // // src/context/NotificationContext.js

// // // // // // // import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
// // // // // // // import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, getFirestore, limit, deleteDoc } from 'firebase/firestore';
// // // // // // // import { getAuth } from 'firebase/auth';
// // // // // // // import io from 'socket.io-client';
// // // // // // // import { toast, ToastContainer } from 'react-toastify';
// // // // // // // import 'react-toastify/dist/ReactToastify.css';

// // // // // // // // Create the context
// // // // // // // const NotificationContext = createContext();

// // // // // // // // Server URLs for different environments
// // // // // // // const PRODUCTION_URL = 'https://puriserver.onrender.com';
// // // // // // // const DEVELOPMENT_URL = 'http://localhost:5000';
// // // // // // // const SERVER_URL = process.env.NODE_ENV === 'production' ? PRODUCTION_URL : DEVELOPMENT_URL;

// // // // // // // export const useNotifications = () => useContext(NotificationContext);

// // // // // // // export const NotificationProvider = ({ children }) => {
// // // // // // //   const [notifications, setNotifications] = useState([]);
// // // // // // //   const [unreadCount, setUnreadCount] = useState(0);
// // // // // // //   const [isOpen, setIsOpen] = useState(false);
// // // // // // //   const [socket, setSocket] = useState(null);
// // // // // // //   const [connected, setConnected] = useState(false);
// // // // // // //   const [connectionAttempts, setConnectionAttempts] = useState(0);
// // // // // // //   const db = getFirestore();
// // // // // // //   const firestoreUnsubscribeRef = useRef(null);
// // // // // // //   const recentNotificationsRef = useRef(new Map()); // Track recently processed notifications

// // // // // // //   // Format notification data
// // // // // // //   const formatNotification = useCallback((notification) => {
// // // // // // //     let action = "has sent a notification";
// // // // // // //     let target = "";
// // // // // // //     let name = notification.senderName || "User";
// // // // // // //     let initials = name.split(' ').map(n => n[0]).join('');
    
// // // // // // //     // Handle different notification types
// // // // // // //     if (notification.type === 'support') {
// // // // // // //       action = "has raised a support ticket";
// // // // // // //       target = notification.data?.category ? `for ${notification.data.category}` : "";
      
// // // // // // //       if (!notification.senderName && notification.data?.phoneNumber) {
// // // // // // //         name = notification.data.phoneNumber;
// // // // // // //         initials = 'U';
// // // // // // //       }
      
// // // // // // //       if (!notification.senderName && notification.senderPhone) {
// // // // // // //         name = notification.senderPhone;
// // // // // // //         initials = 'U';
// // // // // // //       }
// // // // // // //     }
    
// // // // // // //     // Format time - Fixed to handle various timestamp formats
// // // // // // //     let time;
// // // // // // //     if (notification.timestamp) {
// // // // // // //       try {
// // // // // // //         // Handle Firebase timestamp object (has toDate method)
// // // // // // //         if (notification.timestamp.toDate) {
// // // // // // //           time = formatTimeAgo(notification.timestamp.toDate());
// // // // // // //         } 
// // // // // // //         // Handle ISO string timestamp
// // // // // // //         else if (typeof notification.timestamp === 'string') {
// // // // // // //           time = formatTimeAgo(new Date(notification.timestamp));
// // // // // // //         } 
// // // // // // //         // Handle timestamp number/seconds
// // // // // // //         else if (typeof notification.timestamp === 'number') {
// // // // // // //           // Check if this is seconds (Firebase timestamp) or milliseconds
// // // // // // //           const date = notification.timestamp > 9999999999
// // // // // // //             ? new Date(notification.timestamp) // milliseconds
// // // // // // //             : new Date(notification.timestamp * 1000); // seconds
// // // // // // //           time = formatTimeAgo(date);
// // // // // // //         }
// // // // // // //         // If none of these, fallback
// // // // // // //         else {
// // // // // // //           time = 'Recent';
// // // // // // //         }
// // // // // // //       } catch (err) {
// // // // // // //         console.error('Error formatting timestamp:', err, notification.timestamp);
// // // // // // //         time = 'Recent';
// // // // // // //       }
// // // // // // //     } else {
// // // // // // //       time = 'Recent';
// // // // // // //     }
    
// // // // // // //     // Determine background color based on notification type
// // // // // // //     let backgroundColor = '#E5E7EB'; // Default gray
// // // // // // //     if (notification.type === 'support') {
// // // // // // //       backgroundColor = '#FEE2E2'; // Light red for support tickets
// // // // // // //     }
    
// // // // // // //     return {
// // // // // // //       id: notification.id,
// // // // // // //       name,
// // // // // // //       action,
// // // // // // //       target,
// // // // // // //       time,
// // // // // // //       initials,
// // // // // // //       backgroundColor,
// // // // // // //       read: notification.read || false,
// // // // // // //       data: notification.data,
// // // // // // //       type: notification.type,
// // // // // // //       title: notification.title || `New ${notification.type || 'notification'}`,
// // // // // // //       receivedAt: Date.now() // Add timestamp when this notification was processed
// // // // // // //     };
// // // // // // //   }, []);

// // // // // // //   // Helper function to format time ago
// // // // // // //   const formatTimeAgo = (date) => {
// // // // // // //     if (!(date instanceof Date) || isNaN(date.getTime())) {
// // // // // // //       console.warn('Invalid date provided to formatTimeAgo', date);
// // // // // // //       return 'Recent';
// // // // // // //     }
    
// // // // // // //     const now = new Date();
// // // // // // //     const diffMs = now - date;
// // // // // // //     const diffMins = Math.floor(diffMs / 60000);
// // // // // // //     const diffHours = Math.floor(diffMins / 60);
// // // // // // //     const diffDays = Math.floor(diffHours / 24);
    
// // // // // // //     if (diffMins < 1) {
// // // // // // //       return 'Just now';
// // // // // // //     } else if (diffMins < 60) {
// // // // // // //       return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
// // // // // // //     } else if (diffHours < 24) {
// // // // // // //       return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
// // // // // // //     } else if (diffDays < 7) {
// // // // // // //       return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
// // // // // // //     } else {
// // // // // // //       return date.toLocaleDateString();
// // // // // // //     }
// // // // // // //   };

// // // // // // //   // Check if notification is a duplicate
// // // // // // //   const isDuplicate = useCallback((notification) => {
// // // // // // //     const signature = `${notification.type || ''}-${notification.senderName || ''}-${notification.data?.ticketId || ''}`;
// // // // // // //     const now = Date.now();
// // // // // // //     const DEDUPLICATION_WINDOW = 10000; // 10 seconds
    
// // // // // // //     if (recentNotificationsRef.current.has(signature)) {
// // // // // // //       const lastSeen = recentNotificationsRef.current.get(signature);
// // // // // // //       if (now - lastSeen < DEDUPLICATION_WINDOW) {
// // // // // // //         console.log('Duplicate notification prevented:', signature);
// // // // // // //         return true;
// // // // // // //       }
// // // // // // //     }
    
// // // // // // //     // Update record
// // // // // // //     recentNotificationsRef.current.set(signature, now);
    
// // // // // // //     // Clean up old entries
// // // // // // //     for (const [key, timestamp] of recentNotificationsRef.current.entries()) {
// // // // // // //       if (now - timestamp > DEDUPLICATION_WINDOW) {
// // // // // // //         recentNotificationsRef.current.delete(key);
// // // // // // //       }
// // // // // // //     }
    
// // // // // // //     return false;
// // // // // // //   }, []);

// // // // // // //   // Load notifications from Firestore
// // // // // // //   const loadFirestoreNotifications = useCallback(() => {
// // // // // // //     console.log('Loading notifications from Firestore');
    
// // // // // // //     // Clean up any existing subscription
// // // // // // //     if (firestoreUnsubscribeRef.current) {
// // // // // // //       firestoreUnsubscribeRef.current();
// // // // // // //       firestoreUnsubscribeRef.current = null;
// // // // // // //     }
    
// // // // // // //     const q = query(
// // // // // // //       collection(db, 'notifications'),
// // // // // // //       where('recipient', '==', 'dashboard'),
// // // // // // //       orderBy('timestamp', 'desc'),
// // // // // // //       limit(50)
// // // // // // //     );
    
// // // // // // //     try {
// // // // // // //       const unsubscribe = onSnapshot(q, (snapshot) => {
// // // // // // //         const newNotifications = [];
// // // // // // //         const processedIds = new Set(); // Track IDs to prevent duplicates
        
// // // // // // //         snapshot.forEach(doc => {
// // // // // // //           const notificationId = doc.id;
          
// // // // // // //           // Skip if we've already processed this ID
// // // // // // //           if (processedIds.has(notificationId)) return;
          
// // // // // // //           // Add ID to processed set
// // // // // // //           processedIds.add(notificationId);
          
// // // // // // //           newNotifications.push({
// // // // // // //             id: notificationId,
// // // // // // //             ...doc.data()
// // // // // // //           });
// // // // // // //         });
        
// // // // // // //         const formattedNotifications = newNotifications.map(formatNotification);
// // // // // // //         setNotifications(formattedNotifications);
// // // // // // //         setUnreadCount(formattedNotifications.filter(n => !n.read).length);
// // // // // // //       }, (error) => {
// // // // // // //         console.error('Error loading Firestore notifications:', error);
// // // // // // //       });
      
// // // // // // //       firestoreUnsubscribeRef.current = unsubscribe;
// // // // // // //       return unsubscribe;
// // // // // // //     } catch (error) {
// // // // // // //       console.error('Error setting up Firestore listener:', error);
// // // // // // //       return () => {};
// // // // // // //     }
// // // // // // //   }, [db, formatNotification]);

// // // // // // //   // Show toast notification - FIXED VERSION
// // // // // // //   const showToastNotification = useCallback((notification) => {
// // // // // // //     console.log('Showing toast notification:', notification);
    
// // // // // // //     try {
// // // // // // //       const NotificationContent = () => (
// // // // // // //         <div className="flex items-start gap-3">
// // // // // // //           <div 
// // // // // // //             className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
// // // // // // //             style={{ backgroundColor: notification.backgroundColor || '#E5E7EB' }}
// // // // // // //           >
// // // // // // //             {notification.initials}
// // // // // // //           </div>
// // // // // // //           <div>
// // // // // // //             <p className="font-medium">{notification.title || 'New notification'}</p>
// // // // // // //             <p className="text-sm">
// // // // // // //               <span className="font-medium">{notification.name}</span>{' '}
// // // // // // //               <span>{notification.action}</span>
// // // // // // //               {notification.target && <span> {notification.target}</span>}
// // // // // // //             </p>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       );
      
// // // // // // //       // Use the imported toast function directly
// // // // // // //       toast(<NotificationContent />, {
// // // // // // //         position: "top-right",
// // // // // // //         autoClose: 5000,
// // // // // // //         hideProgressBar: false,
// // // // // // //         closeOnClick: true,
// // // // // // //         pauseOnHover: true,
// // // // // // //         draggable: true,
// // // // // // //         progress: undefined,
// // // // // // //         onClick: () => {
// // // // // // //           // Open notification sidebar when toast is clicked
// // // // // // //           setIsOpen(true);
// // // // // // //         }
// // // // // // //       });
// // // // // // //     } catch (error) {
// // // // // // //       console.error('Error showing toast notification:', error);
      
// // // // // // //       // Try a basic toast as fallback
// // // // // // //       try {
// // // // // // //         toast.info(`${notification.title || 'New notification'}: ${notification.name} ${notification.action} ${notification.target || ''}`, {
// // // // // // //           position: "top-right",
// // // // // // //           autoClose: 5000
// // // // // // //         });
// // // // // // //       } catch (fallbackError) {
// // // // // // //         console.error('Fallback toast also failed:', fallbackError);
// // // // // // //       }
// // // // // // //     }
// // // // // // //   }, []);

// // // // // // //   // Special function to process notifications from Firestore that were stored as fallback
// // // // // // //   const loadAndProcessFirestoreNotifications = useCallback(() => {
// // // // // // //     console.log('Loading and processing all Firestore notifications');
    
// // // // // // //     // Clean up any existing subscription
// // // // // // //     if (firestoreUnsubscribeRef.current) {
// // // // // // //       firestoreUnsubscribeRef.current();
// // // // // // //       firestoreUnsubscribeRef.current = null;
// // // // // // //     }
    
// // // // // // //     // Query for all notifications, including fallback ones
// // // // // // //     const q = query(
// // // // // // //       collection(db, 'notifications'),
// // // // // // //       where('recipient', '==', 'dashboard'),
// // // // // // //       orderBy('timestamp', 'desc'),
// // // // // // //       limit(50)
// // // // // // //     );
    
// // // // // // //     try {
// // // // // // //       const unsubscribe = onSnapshot(q, (snapshot) => {
// // // // // // //         const newNotifications = [];
// // // // // // //         const processedIds = new Set(); // Track IDs to prevent duplicates
        
// // // // // // //         // Process all notifications
// // // // // // //         snapshot.docChanges().forEach(async (change) => {
// // // // // // //           // Only process new notifications
// // // // // // //           if (change.type === 'added') {
// // // // // // //             const notification = {
// // // // // // //               id: change.doc.id,
// // // // // // //               ...change.doc.data()
// // // // // // //             };
            
// // // // // // //             // Skip duplicates
// // // // // // //             if (processedIds.has(notification.id)) return;
// // // // // // //             processedIds.add(notification.id);
            
// // // // // // //             // Special handling for fallback notifications
// // // // // // //             if (notification.sentVia === 'fallback' && notification.processed !== true) {
// // // // // // //               console.log('Found unprocessed fallback notification:', notification.id);
              
// // // // // // //               if (!isDuplicate(notification)) {
// // // // // // //                 // Format and show toast
// // // // // // //                 const formattedNotification = formatNotification(notification);
                
// // // // // // //                 // Show toast for unread fallback notifications
// // // // // // //                 if (!notification.read) {
// // // // // // //                   console.log('Showing toast for fallback notification');
// // // // // // //                   showToastNotification(formattedNotification);
                  
// // // // // // //                   // Play notification sound
// // // // // // //                   try {
// // // // // // //                     const audio = new Audio('/notification-sound.mp3');
// // // // // // //                     audio.play().catch(e => console.error('Error playing sound:', e));
// // // // // // //                   } catch (error) {
// // // // // // //                     console.error('Error playing notification sound:', error);
// // // // // // //                   }
// // // // // // //                 }
                
// // // // // // //                 // Mark as processed
// // // // // // //                 try {
// // // // // // //                   await updateDoc(doc(db, 'notifications', notification.id), {
// // // // // // //                     processed: true
// // // // // // //                   });
// // // // // // //                   console.log('Marked notification as processed:', notification.id);
// // // // // // //                 } catch (error) {
// // // // // // //                   console.error('Error marking notification as processed:', error);
// // // // // // //                 }
// // // // // // //               }
// // // // // // //             }
            
// // // // // // //             // Add to list for state update
// // // // // // //             newNotifications.push(notification);
// // // // // // //           }
// // // // // // //         });
        
// // // // // // //         // Format and update state
// // // // // // //         const formattedNotifications = newNotifications.map(formatNotification);
// // // // // // //         setNotifications(formattedNotifications);
// // // // // // //         setUnreadCount(formattedNotifications.filter(n => !n.read).length);
// // // // // // //       }, (error) => {
// // // // // // //         console.error('Error loading Firestore notifications:', error);
// // // // // // //       });
      
// // // // // // //       firestoreUnsubscribeRef.current = unsubscribe;
// // // // // // //       return unsubscribe;
// // // // // // //     } catch (error) {
// // // // // // //       console.error('Error setting up Firestore listener:', error);
// // // // // // //       return () => {};
// // // // // // //     }
// // // // // // //   }, [db, formatNotification, showToastNotification, isDuplicate]);

// // // // // // //   // Initialize WebSocket connection
// // // // // // //   useEffect(() => {
// // // // // // //     let socketInitialized = false;
// // // // // // //     let cleanup = null;
    
// // // // // // //     const connectSocket = async () => {
// // // // // // //       if (socketInitialized) return;
// // // // // // //       socketInitialized = true;
      
// // // // // // //       try {
// // // // // // //         const auth = getAuth();
// // // // // // //         const user = auth.currentUser;
        
// // // // // // //         if (!user) {
// // // // // // //           console.log('No user signed in, using Firestore fallback');
// // // // // // //           const unsubscribe = loadAndProcessFirestoreNotifications();
// // // // // // //           return () => unsubscribe();
// // // // // // //         }
        
// // // // // // //         // Get token for authentication
// // // // // // //         const token = await user.getIdToken();
        
// // // // // // //         // Initialize socket
// // // // // // //         console.log(`Connecting to notification server: ${SERVER_URL}`);
// // // // // // //         const newSocket = io(SERVER_URL, {
// // // // // // //           transports: ['websocket'],
// // // // // // //           timeout: 10000,
// // // // // // //           reconnection: true,
// // // // // // //           reconnectionAttempts: 5
// // // // // // //         });
        
// // // // // // //         setSocket(newSocket);
// // // // // // //         setConnectionAttempts(prev => prev + 1);
        
// // // // // // //         // Set up event listeners
// // // // // // //         newSocket.on('connect', () => {
// // // // // // //           console.log('Connected to notification server');
// // // // // // //           setConnected(true);
          
// // // // // // //           // Authenticate after connection
// // // // // // //           newSocket.emit('authenticate', {
// // // // // // //             token,
// // // // // // //             clientType: 'dashboard'
// // // // // // //           });
// // // // // // //         });
        
// // // // // // //         newSocket.on('disconnect', () => {
// // // // // // //           console.log('Disconnected from notification server');
// // // // // // //           setConnected(false);
// // // // // // //         });
        
// // // // // // //         newSocket.on('connect_error', (error) => {
// // // // // // //           console.error('Connection error:', error);
// // // // // // //           setConnected(false);
// // // // // // //           setConnectionAttempts(prev => prev + 1);
// // // // // // //         });
        
// // // // // // //         newSocket.on('authenticated', (response) => {
// // // // // // //           if (response.success) {
// // // // // // //             console.log('Successfully authenticated with notification server');
// // // // // // //             // Fetch existing notifications
// // // // // // //             newSocket.emit('get-notifications', {
// // // // // // //               clientType: 'dashboard'
// // // // // // //             });
// // // // // // //           } else {
// // // // // // //             console.error('Authentication failed:', response.error);
            
// // // // // // //             // Use Firestore as fallback
// // // // // // //             loadAndProcessFirestoreNotifications();
// // // // // // //           }
// // // // // // //         });
        
// // // // // // //         newSocket.on('notifications-list', (data) => {
// // // // // // //           if (data.notifications && Array.isArray(data.notifications)) {
// // // // // // //             const formattedNotifications = data.notifications.map(formatNotification);
// // // // // // //             setNotifications(formattedNotifications);
// // // // // // //             setUnreadCount(formattedNotifications.filter(n => !n.read).length);
// // // // // // //           }
// // // // // // //         });
        
// // // // // // //         newSocket.on('new-notification', (notification) => {
// // // // // // //           console.log('New notification received:', notification);
          
// // // // // // //           // Skip if it's a duplicate notification
// // // // // // //           if (isDuplicate(notification)) {
// // // // // // //             return;
// // // // // // //           }
          
// // // // // // //           const formattedNotification = formatNotification(notification);
          
// // // // // // //           // Add to notifications list
// // // // // // //           setNotifications(prev => {
// // // // // // //             // Also check by ID
// // // // // // //             const exists = prev.some(n => n.id === formattedNotification.id);
// // // // // // //             if (exists) return prev;
// // // // // // //             return [formattedNotification, ...prev];
// // // // // // //           });
          
// // // // // // //           if (!notification.read) {
// // // // // // //             setUnreadCount(prev => prev + 1);
            
// // // // // // //             // Show toast notification
// // // // // // //             showToastNotification(formattedNotification);
            
// // // // // // //             // Play notification sound
// // // // // // //             try {
// // // // // // //               const audio = new Audio('/notification-sound.mp3');
// // // // // // //               audio.play().catch(e => console.error('Error playing sound:', e));
// // // // // // //             } catch (error) {
// // // // // // //               console.error('Error playing notification sound:', error);
// // // // // // //             }
// // // // // // //           }
// // // // // // //         });
        
// // // // // // //         newSocket.on('notification-updated', (data) => {
// // // // // // //           if (data.success && data.id) {
// // // // // // //             setNotifications(prev => 
// // // // // // //               prev.map(n => 
// // // // // // //                 n.id === data.id ? { ...n, read: true } : n
// // // // // // //               )
// // // // // // //             );
// // // // // // //             setUnreadCount(prev => Math.max(0, prev - 1));
// // // // // // //           }
// // // // // // //         });
        
// // // // // // //         newSocket.on('error', (error) => {
// // // // // // //           console.error('Socket error:', error);
// // // // // // //         });
        
// // // // // // //         return () => {
// // // // // // //           newSocket.disconnect();
// // // // // // //         };
// // // // // // //       } catch (error) {
// // // // // // //         console.error('Error setting up WebSocket:', error);
        
// // // // // // //         // Use Firestore as fallback
// // // // // // //         const unsubscribe = loadAndProcessFirestoreNotifications();
// // // // // // //         return () => unsubscribe();
// // // // // // //       }
// // // // // // //     };
    
// // // // // // //     cleanup = connectSocket();
    
// // // // // // //     return () => {
// // // // // // //       if (typeof cleanup === 'function') {
// // // // // // //         cleanup();
// // // // // // //       }
      
// // // // // // //       if (socket) {
// // // // // // //         socket.disconnect();
// // // // // // //         setSocket(null);
// // // // // // //       }
// // // // // // //     };
// // // // // // //   }, [loadAndProcessFirestoreNotifications, formatNotification, showToastNotification, isDuplicate]);
  
// // // // // // //   // Also load fallback notifications specifically when component mounts
// // // // // // //   useEffect(() => {
// // // // // // //     console.log('Initial load of notifications, including fallback');
// // // // // // //     const unsubscribe = loadAndProcessFirestoreNotifications();
    
// // // // // // //     return () => {
// // // // // // //       if (typeof unsubscribe === 'function') {
// // // // // // //         unsubscribe();
// // // // // // //       }
// // // // // // //     };
// // // // // // //   }, [loadAndProcessFirestoreNotifications]);
  
// // // // // // //   // Use Firestore as fallback if WebSocket fails
// // // // // // //   useEffect(() => {
// // // // // // //     // If we've tried to connect and failed, or if we're not connected after attempting,
// // // // // // //     // use Firestore as fallback
// // // // // // //     if (connectionAttempts >= 2 || (!connected && connectionAttempts > 0)) {
// // // // // // //       loadAndProcessFirestoreNotifications();
// // // // // // //     }
    
// // // // // // //     return () => {
// // // // // // //       if (firestoreUnsubscribeRef.current) {
// // // // // // //         firestoreUnsubscribeRef.current();
// // // // // // //       }
// // // // // // //     };
// // // // // // //   }, [connectionAttempts, connected, loadAndProcessFirestoreNotifications]);
  
// // // // // // //   // Mark notification as read
// // // // // // //   const markAsRead = useCallback((notificationId) => {
// // // // // // //     if (!notificationId) return;
    
// // // // // // //     // Update via WebSocket if connected
// // // // // // //     if (connected && socket) {
// // // // // // //       socket.emit('mark-read', { notificationId });
// // // // // // //     } else {
// // // // // // //       // Fallback to Firestore
// // // // // // //       try {
// // // // // // //         updateDoc(doc(db, 'notifications', notificationId), {
// // // // // // //           read: true
// // // // // // //         });
// // // // // // //       } catch (error) {
// // // // // // //         console.error('Error marking notification as read:', error);
// // // // // // //       }
// // // // // // //     }
    
// // // // // // //     // Optimistically update UI
// // // // // // //     setNotifications(prev => 
// // // // // // //       prev.map(n => 
// // // // // // //         n.id === notificationId ? { ...n, read: true } : n
// // // // // // //       )
// // // // // // //     );
// // // // // // //     setUnreadCount(prev => Math.max(0, prev - 1));
// // // // // // //   }, [connected, socket, db]);
  
// // // // // // //   // Mark all notifications as read
// // // // // // //   const markAllAsRead = useCallback(() => {
// // // // // // //     // Get all unread notification IDs
// // // // // // //     const unreadIds = notifications
// // // // // // //       .filter(n => !n.read)
// // // // // // //       .map(n => n.id);
    
// // // // // // //     if (unreadIds.length === 0) return;
    
// // // // // // //     // Mark each as read
// // // // // // //     unreadIds.forEach(id => {
// // // // // // //       if (connected && socket) {
// // // // // // //         socket.emit('mark-read', { notificationId: id });
// // // // // // //       } else {
// // // // // // //         try {
// // // // // // //           updateDoc(doc(db, 'notifications', id), {
// // // // // // //             read: true
// // // // // // //           });
// // // // // // //         } catch (error) {
// // // // // // //           console.error('Error marking notification as read:', error);
// // // // // // //         }
// // // // // // //       }
// // // // // // //     });
    
// // // // // // //     // Optimistically update UI
// // // // // // //     setNotifications(prev => 
// // // // // // //       prev.map(n => ({ ...n, read: true }))
// // // // // // //     );
// // // // // // //     setUnreadCount(0);
// // // // // // //   }, [notifications, connected, socket, db]);

// // // // // // //   // Clear all notifications
// // // // // // //   const clearAllNotifications = useCallback(async () => {
// // // // // // //     if (notifications.length === 0) return;
    
// // // // // // //     try {
// // // // // // //       // Delete all notifications from Firestore
// // // // // // //       const deletePromises = notifications.map(notification => 
// // // // // // //         deleteDoc(doc(db, 'notifications', notification.id))
// // // // // // //       );
      
// // // // // // //       await Promise.all(deletePromises);
      
// // // // // // //       // Clear notifications from state
// // // // // // //       setNotifications([]);
// // // // // // //       setUnreadCount(0);
// // // // // // //     } catch (error) {
// // // // // // //       console.error('Error clearing notifications:', error);
// // // // // // //     }
// // // // // // //   }, [notifications, db]);
  
// // // // // // //   // Toggle sidebar
// // // // // // //   const toggleSidebar = useCallback(() => {
// // // // // // //     setIsOpen(prev => !prev);
// // // // // // //   }, []);
  
// // // // // // //   // Close sidebar
// // // // // // //   const closeSidebar = useCallback(() => {
// // // // // // //     setIsOpen(false);
// // // // // // //   }, []);
  
// // // // // // //   // Open sidebar
// // // // // // //   const openSidebar = useCallback(() => {
// // // // // // //     setIsOpen(true);
// // // // // // //   }, []);
  
// // // // // // //   // Context value
// // // // // // //   const value = {
// // // // // // //     notifications,
// // // // // // //     unreadCount,
// // // // // // //     isOpen,
// // // // // // //     markAsRead,
// // // // // // //     markAllAsRead,
// // // // // // //     clearAllNotifications,
// // // // // // //     toggleSidebar,
// // // // // // //     closeSidebar,
// // // // // // //     openSidebar,
// // // // // // //     connected,
// // // // // // //     showToastNotification // Expose for testing
// // // // // // //   };
  
// // // // // // //   return (
// // // // // // //     <NotificationContext.Provider value={value}>
// // // // // // //       {children}
// // // // // // //       <ToastContainer
// // // // // // //         position="top-right"
// // // // // // //         autoClose={5000}
// // // // // // //         hideProgressBar={false}
// // // // // // //         newestOnTop
// // // // // // //         closeOnClick
// // // // // // //         rtl={false}
// // // // // // //         pauseOnFocusLoss
// // // // // // //         draggable
// // // // // // //         pauseOnHover
// // // // // // //         style={{ zIndex: 9999 }} // Ensure high z-index
// // // // // // //       />
// // // // // // //     </NotificationContext.Provider>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default NotificationContext;
// // // // // // import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
// // // // // // import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, getFirestore, limit, deleteDoc } from 'firebase/firestore';
// // // // // // import { getAuth } from 'firebase/auth';
// // // // // // import io from 'socket.io-client';
// // // // // // import { toast, ToastContainer } from 'react-toastify';
// // // // // // import 'react-toastify/dist/ReactToastify.css';

// // // // // // // Create the context
// // // // // // const NotificationContext = createContext();

// // // // // // // Server URLs for different environments
// // // // // // const PRODUCTION_URL = 'https://puriserver.onrender.com';
// // // // // // const DEVELOPMENT_URL = 'http://localhost:5000';
// // // // // // const SERVER_URL = process.env.NODE_ENV === 'production' ? PRODUCTION_URL : DEVELOPMENT_URL;

// // // // // // export const useNotifications = () => useContext(NotificationContext);

// // // // // // export const NotificationProvider = ({ children }) => {
// // // // // //   const [notifications, setNotifications] = useState([]);
// // // // // //   const [unreadCount, setUnreadCount] = useState(0);
// // // // // //   const [isOpen, setIsOpen] = useState(false);
// // // // // //   const [socket, setSocket] = useState(null);
// // // // // //   const [connected, setConnected] = useState(false);
// // // // // //   const [connectionAttempts, setConnectionAttempts] = useState(0);
// // // // // //   const db = getFirestore();
// // // // // //   const firestoreUnsubscribeRef = useRef(null);
// // // // // //   const recentNotificationsRef = useRef(new Map()); // Track recently processed notifications

// // // // // //   // Format notification data
// // // // // //   const formatNotification = useCallback((notification) => {
// // // // // //     let action = "has sent a notification";
// // // // // //     let target = "";
// // // // // //     let name = notification.senderName || "User";
// // // // // //     let initials = name.split(' ').map(n => n[0]).join('');
    
// // // // // //     // Handle different notification types
// // // // // //     if (notification.type === 'support') {
// // // // // //       action = "has raised a support ticket";
// // // // // //       target = notification.data?.category ? `for ${notification.data.category}` : "";
      
// // // // // //       if (!notification.senderName && notification.data?.phoneNumber) {
// // // // // //         name = notification.data.phoneNumber;
// // // // // //         initials = 'U';
// // // // // //       }
      
// // // // // //       if (!notification.senderName && notification.senderPhone) {
// // // // // //         name = notification.senderPhone;
// // // // // //         initials = 'U';
// // // // // //       }
// // // // // //     }
    
// // // // // //     // Format time - Fixed to handle various timestamp formats
// // // // // //     let time;
// // // // // //     if (notification.timestamp) {
// // // // // //       try {
// // // // // //         // Handle Firebase timestamp object (has toDate method)
// // // // // //         if (notification.timestamp.toDate) {
// // // // // //           time = formatTimeAgo(notification.timestamp.toDate());
// // // // // //         } 
// // // // // //         // Handle ISO string timestamp
// // // // // //         else if (typeof notification.timestamp === 'string') {
// // // // // //           time = formatTimeAgo(new Date(notification.timestamp));
// // // // // //         } 
// // // // // //         // Handle timestamp number/seconds
// // // // // //         else if (typeof notification.timestamp === 'number') {
// // // // // //           // Check if this is seconds (Firebase timestamp) or milliseconds
// // // // // //           const date = notification.timestamp > 9999999999
// // // // // //             ? new Date(notification.timestamp) // milliseconds
// // // // // //             : new Date(notification.timestamp * 1000); // seconds
// // // // // //           time = formatTimeAgo(date);
// // // // // //         }
// // // // // //         // If none of these, fallback
// // // // // //         else {
// // // // // //           time = 'Recent';
// // // // // //         }
// // // // // //       } catch (err) {
// // // // // //         console.error('Error formatting timestamp:', err, notification.timestamp);
// // // // // //         time = 'Recent';
// // // // // //       }
// // // // // //     } else {
// // // // // //       time = 'Recent';
// // // // // //     }
    
// // // // // //     // Determine background color based on notification type
// // // // // //     let backgroundColor = '#E5E7EB'; // Default gray
// // // // // //     if (notification.type === 'support') {
// // // // // //       backgroundColor = '#FEE2E2'; // Light red for support tickets
// // // // // //     }
    
// // // // // //     return {
// // // // // //       id: notification.id,
// // // // // //       name,
// // // // // //       action,
// // // // // //       target,
// // // // // //       time,
// // // // // //       initials,
// // // // // //       backgroundColor,
// // // // // //       read: notification.read || false,
// // // // // //       data: notification.data,
// // // // // //       type: notification.type,
// // // // // //       title: notification.title || `New ${notification.type || 'notification'}`,
// // // // // //       receivedAt: Date.now() // Add timestamp when this notification was processed
// // // // // //     };
// // // // // //   }, []);

// // // // // //   // Helper function to format time ago
// // // // // //   const formatTimeAgo = (date) => {
// // // // // //     if (!(date instanceof Date) || isNaN(date.getTime())) {
// // // // // //       console.warn('Invalid date provided to formatTimeAgo', date);
// // // // // //       return 'Recent';
// // // // // //     }
    
// // // // // //     const now = new Date();
// // // // // //     const diffMs = now - date;
// // // // // //     const diffMins = Math.floor(diffMs / 60000);
// // // // // //     const diffHours = Math.floor(diffMins / 60);
// // // // // //     const diffDays = Math.floor(diffHours / 24);
    
// // // // // //     if (diffMins < 1) {
// // // // // //       return 'Just now';
// // // // // //     } else if (diffMins < 60) {
// // // // // //       return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
// // // // // //     } else if (diffHours < 24) {
// // // // // //       return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
// // // // // //     } else if (diffDays < 7) {
// // // // // //       return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
// // // // // //     } else {
// // // // // //       return date.toLocaleDateString();
// // // // // //     }
// // // // // //   };

// // // // // //   // Check if notification is a duplicate
// // // // // //   const isDuplicate = useCallback((notification) => {
// // // // // //     const signature = `${notification.type || ''}-${notification.senderName || ''}-${notification.data?.ticketId || ''}`;
// // // // // //     const now = Date.now();
// // // // // //     const DEDUPLICATION_WINDOW = 10000; // 10 seconds
    
// // // // // //     if (recentNotificationsRef.current.has(signature)) {
// // // // // //       const lastSeen = recentNotificationsRef.current.get(signature);
// // // // // //       if (now - lastSeen < DEDUPLICATION_WINDOW) {
// // // // // //         console.log('Duplicate notification prevented:', signature);
// // // // // //         return true;
// // // // // //       }
// // // // // //     }
    
// // // // // //     // Update record
// // // // // //     recentNotificationsRef.current.set(signature, now);
    
// // // // // //     // Clean up old entries
// // // // // //     for (const [key, timestamp] of recentNotificationsRef.current.entries()) {
// // // // // //       if (now - timestamp > DEDUPLICATION_WINDOW) {
// // // // // //         recentNotificationsRef.current.delete(key);
// // // // // //       }
// // // // // //     }
    
// // // // // //     return false;
// // // // // //   }, []);

// // // // // //   // Load notifications from Firestore
// // // // // //   const loadFirestoreNotifications = useCallback(() => {
// // // // // //     console.log('Loading notifications from Firestore');
    
// // // // // //     // Clean up any existing subscription
// // // // // //     if (firestoreUnsubscribeRef.current) {
// // // // // //       firestoreUnsubscribeRef.current();
// // // // // //       firestoreUnsubscribeRef.current = null;
// // // // // //     }
    
// // // // // //     const q = query(
// // // // // //       collection(db, 'notifications'),
// // // // // //       where('recipient', '==', 'dashboard'),
// // // // // //       orderBy('timestamp', 'desc'),
// // // // // //       limit(50)
// // // // // //     );
    
// // // // // //     try {
// // // // // //       const unsubscribe = onSnapshot(q, (snapshot) => {
// // // // // //         const newNotifications = [];
// // // // // //         const processedIds = new Set(); // Track IDs to prevent duplicates
        
// // // // // //         snapshot.forEach(doc => {
// // // // // //           const notificationId = doc.id;
          
// // // // // //           // Skip if we've already processed this ID
// // // // // //           if (processedIds.has(notificationId)) return;
          
// // // // // //           // Add ID to processed set
// // // // // //           processedIds.add(notificationId);
          
// // // // // //           newNotifications.push({
// // // // // //             id: notificationId,
// // // // // //             ...doc.data()
// // // // // //           });
// // // // // //         });
        
// // // // // //         const formattedNotifications = newNotifications.map(formatNotification);
// // // // // //         setNotifications(formattedNotifications);
// // // // // //         setUnreadCount(formattedNotifications.filter(n => !n.read).length);
// // // // // //       }, (error) => {
// // // // // //         console.error('Error loading Firestore notifications:', error);
// // // // // //       });
      
// // // // // //       firestoreUnsubscribeRef.current = unsubscribe;
// // // // // //       return unsubscribe;
// // // // // //     } catch (error) {
// // // // // //       console.error('Error setting up Firestore listener:', error);
// // // // // //       return () => {};
// // // // // //     }
// // // // // //   }, [db, formatNotification]);

// // // // // //   // Show toast notification - FIXED VERSION
// // // // // //   const showToastNotification = useCallback((notification) => {
// // // // // //     console.log('Showing toast notification:', notification);
    
// // // // // //     try {
// // // // // //       const NotificationContent = () => (
// // // // // //         <div className="flex items-start gap-3">
// // // // // //           <div 
// // // // // //             className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
// // // // // //             style={{ backgroundColor: notification.backgroundColor || '#E5E7EB' }}
// // // // // //           >
// // // // // //             {notification.initials}
// // // // // //           </div>
// // // // // //           <div>
// // // // // //             <p className="font-medium">{notification.title || 'New notification'}</p>
// // // // // //             <p className="text-sm">
// // // // // //               <span className="font-medium">{notification.name}</span>{' '}
// // // // // //               <span>{notification.action}</span>
// // // // // //               {notification.target && <span> {notification.target}</span>}
// // // // // //             </p>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       );
      
// // // // // //       // Use the imported toast function directly
// // // // // //       toast(<NotificationContent />, {
// // // // // //         position: "top-right",
// // // // // //         autoClose: 5000,
// // // // // //         hideProgressBar: false,
// // // // // //         closeOnClick: true,
// // // // // //         pauseOnHover: true,
// // // // // //         draggable: true,
// // // // // //         progress: undefined,
// // // // // //         onClick: () => {
// // // // // //           // Open notification sidebar when toast is clicked
// // // // // //           setIsOpen(true);
// // // // // //         }
// // // // // //       });
// // // // // //     } catch (error) {
// // // // // //       console.error('Error showing toast notification:', error);
      
// // // // // //       // Try a basic toast as fallback
// // // // // //       try {
// // // // // //         toast.info(`${notification.title || 'New notification'}: ${notification.name} ${notification.action} ${notification.target || ''}`, {
// // // // // //           position: "top-right",
// // // // // //           autoClose: 5000
// // // // // //         });
// // // // // //       } catch (fallbackError) {
// // // // // //         console.error('Fallback toast also failed:', fallbackError);
// // // // // //       }
// // // // // //     }
// // // // // //   }, []);

// // // // // //   // Special function to process notifications from Firestore that were stored as fallback
// // // // // //   const loadAndProcessFirestoreNotifications = useCallback(() => {
// // // // // //     console.log('Loading and processing all Firestore notifications');
    
// // // // // //     // Clean up any existing subscription
// // // // // //     if (firestoreUnsubscribeRef.current) {
// // // // // //       firestoreUnsubscribeRef.current();
// // // // // //       firestoreUnsubscribeRef.current = null;
// // // // // //     }
    
// // // // // //     // Query for all notifications, including fallback ones
// // // // // //     const q = query(
// // // // // //       collection(db, 'notifications'),
// // // // // //       where('recipient', '==', 'dashboard'),
// // // // // //       orderBy('timestamp', 'desc'),
// // // // // //       limit(50)
// // // // // //     );
    
// // // // // //     try {
// // // // // //       const unsubscribe = onSnapshot(q, (snapshot) => {
// // // // // //         const newNotifications = [];
// // // // // //         const processedIds = new Set(); // Track IDs to prevent duplicates
        
// // // // // //         // Process all notifications
// // // // // //         snapshot.docChanges().forEach(async (change) => {
// // // // // //           // Only process new notifications
// // // // // //           if (change.type === 'added') {
// // // // // //             const notification = {
// // // // // //               id: change.doc.id,
// // // // // //               ...change.doc.data()
// // // // // //             };
            
// // // // // //             // Skip duplicates
// // // // // //             if (processedIds.has(notification.id)) return;
// // // // // //             processedIds.add(notification.id);
            
// // // // // //             // Special handling for fallback notifications
// // // // // //             if (notification.sentVia === 'fallback' && notification.processed !== true) {
// // // // // //               console.log('Found unprocessed fallback notification:', notification.id);
              
// // // // // //               if (!isDuplicate(notification)) {
// // // // // //                 // Format and show toast
// // // // // //                 const formattedNotification = formatNotification(notification);
                
// // // // // //                 // Show toast for unread fallback notifications
// // // // // //                 if (!notification.read) {
// // // // // //                   console.log('Showing toast for fallback notification');
// // // // // //                   showToastNotification(formattedNotification);
                  
// // // // // //                   // Play notification sound
// // // // // //                   try {
// // // // // //                     const audio = new Audio('/notification-sound.mp3');
// // // // // //                     audio.play().catch(e => console.error('Error playing sound:', e));
// // // // // //                   } catch (error) {
// // // // // //                     console.error('Error playing notification sound:', error);
// // // // // //                   }
// // // // // //                 }
                
// // // // // //                 // Mark as processed
// // // // // //                 try {
// // // // // //                   await updateDoc(doc(db, 'notifications', notification.id), {
// // // // // //                     processed: true
// // // // // //                   });
// // // // // //                   console.log('Marked notification as processed:', notification.id);
// // // // // //                 } catch (error) {
// // // // // //                   console.error('Error marking notification as processed:', error);
// // // // // //                 }
// // // // // //               }
// // // // // //             }
            
// // // // // //             // Add to list for state update
// // // // // //             newNotifications.push(notification);
// // // // // //           }
// // // // // //         });
        
// // // // // //         // Format and update state
// // // // // //         const formattedNotifications = newNotifications.map(formatNotification);
// // // // // //         setNotifications(formattedNotifications);
// // // // // //         setUnreadCount(formattedNotifications.filter(n => !n.read).length);
// // // // // //       }, (error) => {
// // // // // //         console.error('Error loading Firestore notifications:', error);
// // // // // //       });
      
// // // // // //       firestoreUnsubscribeRef.current = unsubscribe;
// // // // // //       return unsubscribe;
// // // // // //     } catch (error) {
// // // // // //       console.error('Error setting up Firestore listener:', error);
// // // // // //       return () => {};
// // // // // //     }
// // // // // //   }, [db, formatNotification, showToastNotification, isDuplicate]);

// // // // // //   // Initialize WebSocket connection
// // // // // //   useEffect(() => {
// // // // // //     let socketInitialized = false;
// // // // // //     let cleanup = null;
    
// // // // // //     const connectSocket = async () => {
// // // // // //       if (socketInitialized) return;
// // // // // //       socketInitialized = true;
      
// // // // // //       try {
// // // // // //         const auth = getAuth();
// // // // // //         const user = auth.currentUser;
        
// // // // // //         if (!user) {
// // // // // //           console.log('No user signed in, using Firestore fallback');
// // // // // //           const unsubscribe = loadAndProcessFirestoreNotifications();
// // // // // //           return () => unsubscribe();
// // // // // //         }
        
// // // // // //         // Get token for authentication
// // // // // //         const token = await user.getIdToken();
        
// // // // // //         // Initialize socket
// // // // // //         console.log(`Connecting to notification server: ${SERVER_URL}`);
// // // // // //         const newSocket = io(SERVER_URL, {
// // // // // //           transports: ['websocket'],
// // // // // //           timeout: 10000,
// // // // // //           reconnection: true,
// // // // // //           reconnectionAttempts: 5
// // // // // //         });
        
// // // // // //         setSocket(newSocket);
// // // // // //         setConnectionAttempts(prev => prev + 1);
        
// // // // // //         // Set up event listeners
// // // // // //         newSocket.on('connect', () => {
// // // // // //           console.log('Connected to notification server');
// // // // // //           setConnected(true);
          
// // // // // //           // Authenticate after connection
// // // // // //           newSocket.emit('authenticate', {
// // // // // //             token,
// // // // // //             clientType: 'dashboard'
// // // // // //           });
// // // // // //         });
        
// // // // // //         newSocket.on('disconnect', () => {
// // // // // //           console.log('Disconnected from notification server');
// // // // // //           setConnected(false);
// // // // // //         });
        
// // // // // //         newSocket.on('connect_error', (error) => {
// // // // // //           console.error('Connection error:', error);
// // // // // //           setConnected(false);
// // // // // //           setConnectionAttempts(prev => prev + 1);
// // // // // //         });
        
// // // // // //         newSocket.on('authenticated', (response) => {
// // // // // //           if (response.success) {
// // // // // //             console.log('Successfully authenticated with notification server');
// // // // // //             // Fetch existing notifications
// // // // // //             newSocket.emit('get-notifications', {
// // // // // //               clientType: 'dashboard'
// // // // // //             });
// // // // // //           } else {
// // // // // //             console.error('Authentication failed:', response.error);
            
// // // // // //             // Use Firestore as fallback
// // // // // //             loadAndProcessFirestoreNotifications();
// // // // // //           }
// // // // // //         });
        
// // // // // //         newSocket.on('notifications-list', (data) => {
// // // // // //           if (data.notifications && Array.isArray(data.notifications)) {
// // // // // //             const formattedNotifications = data.notifications.map(formatNotification);
// // // // // //             setNotifications(formattedNotifications);
// // // // // //             setUnreadCount(formattedNotifications.filter(n => !n.read).length);
// // // // // //           }
// // // // // //         });
        
// // // // // //         newSocket.on('new-notification', (notification) => {
// // // // // //           console.log('New notification received:', notification);
          
// // // // // //           // Skip if it's a duplicate notification
// // // // // //           if (isDuplicate(notification)) {
// // // // // //             return;
// // // // // //           }
          
// // // // // //           const formattedNotification = formatNotification(notification);
          
// // // // // //           // Add to notifications list
// // // // // //           setNotifications(prev => {
// // // // // //             // Also check by ID
// // // // // //             const exists = prev.some(n => n.id === formattedNotification.id);
// // // // // //             if (exists) return prev;
// // // // // //             return [formattedNotification, ...prev];
// // // // // //           });
          
// // // // // //           if (!notification.read) {
// // // // // //             setUnreadCount(prev => prev + 1);
            
// // // // // //             // Show toast notification
// // // // // //             showToastNotification(formattedNotification);
            
// // // // // //             // Play notification sound
// // // // // //             try {
// // // // // //               const audio = new Audio('/notification-sound.mp3');
// // // // // //               audio.play().catch(e => console.error('Error playing sound:', e));
// // // // // //             } catch (error) {
// // // // // //               console.error('Error playing notification sound:', error);
// // // // // //             }
// // // // // //           }
// // // // // //         });
        
// // // // // //         newSocket.on('notification-updated', (data) => {
// // // // // //           if (data.success && data.id) {
// // // // // //             setNotifications(prev => 
// // // // // //               prev.map(n => 
// // // // // //                 n.id === data.id ? { ...n, read: true } : n
// // // // // //               )
// // // // // //             );
// // // // // //             setUnreadCount(prev => Math.max(0, prev - 1));
// // // // // //           }
// // // // // //         });
        
// // // // // //         newSocket.on('error', (error) => {
// // // // // //           console.error('Socket error:', error);
// // // // // //         });
        
// // // // // //         return () => {
// // // // // //           newSocket.disconnect();
// // // // // //         };
// // // // // //       } catch (error) {
// // // // // //         console.error('Error setting up WebSocket:', error);
        
// // // // // //         // Use Firestore as fallback
// // // // // //         const unsubscribe = loadAndProcessFirestoreNotifications();
// // // // // //         return () => unsubscribe();
// // // // // //       }
// // // // // //     };
    
// // // // // //     cleanup = connectSocket();
    
// // // // // //     return () => {
// // // // // //       if (typeof cleanup === 'function') {
// // // // // //         cleanup();
// // // // // //       }
      
// // // // // //       if (socket) {
// // // // // //         socket.disconnect();
// // // // // //         setSocket(null);
// // // // // //       }
// // // // // //     };
// // // // // //   }, [loadAndProcessFirestoreNotifications, formatNotification, showToastNotification, isDuplicate]);
  
// // // // // //   // Also load fallback notifications specifically when component mounts
// // // // // //   useEffect(() => {
// // // // // //     console.log('Initial load of notifications, including fallback');
// // // // // //     const unsubscribe = loadAndProcessFirestoreNotifications();
    
// // // // // //     return () => {
// // // // // //       if (typeof unsubscribe === 'function') {
// // // // // //         unsubscribe();
// // // // // //       }
// // // // // //     };
// // // // // //   }, [loadAndProcessFirestoreNotifications]);
  
// // // // // //   // Use Firestore as fallback if WebSocket fails
// // // // // //   useEffect(() => {
// // // // // //     // If we've tried to connect and failed, or if we're not connected after attempting,
// // // // // //     // use Firestore as fallback
// // // // // //     if (connectionAttempts >= 2 || (!connected && connectionAttempts > 0)) {
// // // // // //       loadAndProcessFirestoreNotifications();
// // // // // //     }
    
// // // // // //     return () => {
// // // // // //       if (firestoreUnsubscribeRef.current) {
// // // // // //         firestoreUnsubscribeRef.current();
// // // // // //       }
// // // // // //     };
// // // // // //   }, [connectionAttempts, connected, loadAndProcessFirestoreNotifications]);
  
// // // // // //   // Mark notification as read
// // // // // //   const markAsRead = useCallback((notificationId) => {
// // // // // //     if (!notificationId) return;
    
// // // // // //     // Update via WebSocket if connected
// // // // // //     if (connected && socket) {
// // // // // //       socket.emit('mark-read', { notificationId });
// // // // // //     } else {
// // // // // //       // Fallback to Firestore
// // // // // //       try {
// // // // // //         updateDoc(doc(db, 'notifications', notificationId), {
// // // // // //           read: true
// // // // // //         });
// // // // // //       } catch (error) {
// // // // // //         console.error('Error marking notification as read:', error);
// // // // // //       }
// // // // // //     }
    
// // // // // //     // Optimistically update UI - Don't remove the notification, just mark it as read
// // // // // //     setNotifications(prev => 
// // // // // //       prev.map(n => 
// // // // // //         n.id === notificationId ? { ...n, read: true } : n
// // // // // //       )
// // // // // //     );
// // // // // //     setUnreadCount(prev => Math.max(0, prev - 1));
// // // // // //   }, [connected, socket, db]);
  
// // // // // //   // Mark all notifications as read
// // // // // //   const markAllAsRead = useCallback(() => {
// // // // // //     // Get all unread notification IDs
// // // // // //     const unreadIds = notifications
// // // // // //       .filter(n => !n.read)
// // // // // //       .map(n => n.id);
    
// // // // // //     if (unreadIds.length === 0) return;
    
// // // // // //     // Mark each as read
// // // // // //     unreadIds.forEach(id => {
// // // // // //       if (connected && socket) {
// // // // // //         socket.emit('mark-read', { notificationId: id });
// // // // // //       } else {
// // // // // //         try {
// // // // // //           updateDoc(doc(db, 'notifications', id), {
// // // // // //             read: true
// // // // // //           });
// // // // // //         } catch (error) {
// // // // // //           console.error('Error marking notification as read:', error);
// // // // // //         }
// // // // // //       }
// // // // // //     });
    
// // // // // //     // Optimistically update UI - Don't remove the notifications, just mark them as read
// // // // // //     setNotifications(prev => 
// // // // // //       prev.map(n => ({ ...n, read: true }))
// // // // // //     );
// // // // // //     setUnreadCount(0);
// // // // // //   }, [notifications, connected, socket, db]);

// // // // // //   // Clear all notifications
// // // // // //   const clearAllNotifications = useCallback(async () => {
// // // // // //     if (notifications.length === 0) return;
    
// // // // // //     try {
// // // // // //       // Delete all notifications from Firestore
// // // // // //       const deletePromises = notifications.map(notification => 
// // // // // //         deleteDoc(doc(db, 'notifications', notification.id))
// // // // // //       );
      
// // // // // //       await Promise.all(deletePromises);
      
// // // // // //       // Clear notifications from state
// // // // // //       setNotifications([]);
// // // // // //       setUnreadCount(0);
// // // // // //     } catch (error) {
// // // // // //       console.error('Error clearing notifications:', error);
// // // // // //     }
// // // // // //   }, [notifications, db]);
  
// // // // // //   // Toggle sidebar
// // // // // //   const toggleSidebar = useCallback(() => {
// // // // // //     setIsOpen(prev => !prev);
// // // // // //   }, []);
  
// // // // // //   // Close sidebar
// // // // // //   const closeSidebar = useCallback(() => {
// // // // // //     setIsOpen(false);
// // // // // //   }, []);
  
// // // // // //   // Open sidebar
// // // // // //   const openSidebar = useCallback(() => {
// // // // // //     setIsOpen(true);
// // // // // //   }, []);
  
// // // // // //   // Context value
// // // // // //   const value = {
// // // // // //     notifications,
// // // // // //     unreadCount,
// // // // // //     isOpen,
// // // // // //     markAsRead,
// // // // // //     markAllAsRead,
// // // // // //     clearAllNotifications,
// // // // // //     toggleSidebar,
// // // // // //     closeSidebar,
// // // // // //     openSidebar,
// // // // // //     connected,
// // // // // //     showToastNotification // Expose for testing
// // // // // //   };
  
// // // // // //   return (
// // // // // //     <NotificationContext.Provider value={value}>
// // // // // //       {children}
// // // // // //       <ToastContainer
// // // // // //         position="top-right"
// // // // // //         autoClose={5000}
// // // // // //         hideProgressBar={false}
// // // // // //         newestOnTop
// // // // // //         closeOnClick
// // // // // //         rtl={false}
// // // // // //         pauseOnFocusLoss
// // // // // //         draggable
// // // // // //         pauseOnHover
// // // // // //         style={{ zIndex: 9999 }} // Ensure high z-index
// // // // // //       />
// // // // // //     </NotificationContext.Provider>
// // // // // //   );
// // // // // // };

// // // // // // export default NotificationContext;
// // // // // import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
// // // // // import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, getFirestore, limit, deleteDoc } from 'firebase/firestore';
// // // // // import { getAuth } from 'firebase/auth';
// // // // // import io from 'socket.io-client';
// // // // // import { toast, ToastContainer } from 'react-toastify';
// // // // // import 'react-toastify/dist/ReactToastify.css';

// // // // // // Create the context
// // // // // const NotificationContext = createContext();

// // // // // // Server URLs for different environments
// // // // // const PRODUCTION_URL = 'https://puriserver.onrender.com';
// // // // // const DEVELOPMENT_URL = 'http://localhost:5000';
// // // // // const SERVER_URL = process.env.NODE_ENV === 'production' ? PRODUCTION_URL : DEVELOPMENT_URL;

// // // // // export const useNotifications = () => useContext(NotificationContext);

// // // // // export const NotificationProvider = ({ children }) => {
// // // // //   const [notifications, setNotifications] = useState([]);
// // // // //   const [unreadCount, setUnreadCount] = useState(0);
// // // // //   const [isOpen, setIsOpen] = useState(false);
// // // // //   const [socket, setSocket] = useState(null);
// // // // //   const [connected, setConnected] = useState(false);
// // // // //   const [connectionAttempts, setConnectionAttempts] = useState(0);
// // // // //   const db = getFirestore();
// // // // //   const firestoreUnsubscribeRef = useRef(null);
// // // // //   const recentNotificationsRef = useRef(new Map()); // Track recently processed notifications

// // // // //   // Format notification data
// // // // //   const formatNotification = useCallback((notification) => {
// // // // //     let action = "has sent a notification";
// // // // //     let target = "";
// // // // //     let name = notification.senderName || "User";
// // // // //     let initials = name.split(' ').map(n => n[0]).join('');
    
// // // // //     // Handle different notification types
// // // // //     if (notification.type === 'support') {
// // // // //       action = "has raised a support ticket";
// // // // //       target = notification.data?.category ? `for ${notification.data.category}` : "";
      
// // // // //       if (!notification.senderName && notification.data?.phoneNumber) {
// // // // //         name = notification.data.phoneNumber;
// // // // //         initials = 'U';
// // // // //       }
      
// // // // //       if (!notification.senderName && notification.senderPhone) {
// // // // //         name = notification.senderPhone;
// // // // //         initials = 'U';
// // // // //       }
// // // // //     }
    
// // // // //     // Format time - Fixed to handle various timestamp formats
// // // // //     let time;
// // // // //     if (notification.timestamp) {
// // // // //       try {
// // // // //         // Handle Firebase timestamp object (has toDate method)
// // // // //         if (notification.timestamp.toDate) {
// // // // //           time = formatTimeAgo(notification.timestamp.toDate());
// // // // //         } 
// // // // //         // Handle ISO string timestamp
// // // // //         else if (typeof notification.timestamp === 'string') {
// // // // //           time = formatTimeAgo(new Date(notification.timestamp));
// // // // //         } 
// // // // //         // Handle timestamp number/seconds
// // // // //         else if (typeof notification.timestamp === 'number') {
// // // // //           // Check if this is seconds (Firebase timestamp) or milliseconds
// // // // //           const date = notification.timestamp > 9999999999
// // // // //             ? new Date(notification.timestamp) // milliseconds
// // // // //             : new Date(notification.timestamp * 1000); // seconds
// // // // //           time = formatTimeAgo(date);
// // // // //         }
// // // // //         // If none of these, fallback
// // // // //         else {
// // // // //           time = 'Recent';
// // // // //         }
// // // // //       } catch (err) {
// // // // //         console.error('Error formatting timestamp:', err, notification.timestamp);
// // // // //         time = 'Recent';
// // // // //       }
// // // // //     } else {
// // // // //       time = 'Recent';
// // // // //     }
    
// // // // //     // Determine background color based on notification type
// // // // //     let backgroundColor = '#E5E7EB'; // Default gray
// // // // //     if (notification.type === 'support') {
// // // // //       backgroundColor = '#FEE2E2'; // Light red for support tickets
// // // // //     }
    
// // // // //     return {
// // // // //       id: notification.id,
// // // // //       name,
// // // // //       action,
// // // // //       target,
// // // // //       time,
// // // // //       initials,
// // // // //       backgroundColor,
// // // // //       read: notification.read || false,
// // // // //       data: notification.data,
// // // // //       type: notification.type,
// // // // //       title: notification.title || `New ${notification.type || 'notification'}`,
// // // // //       receivedAt: Date.now() // Add timestamp when this notification was processed
// // // // //     };
// // // // //   }, []);

// // // // //   // Helper function to format time ago
// // // // //   const formatTimeAgo = (date) => {
// // // // //     if (!(date instanceof Date) || isNaN(date.getTime())) {
// // // // //       console.warn('Invalid date provided to formatTimeAgo', date);
// // // // //       return 'Recent';
// // // // //     }
    
// // // // //     const now = new Date();
// // // // //     const diffMs = now - date;
// // // // //     const diffMins = Math.floor(diffMs / 60000);
// // // // //     const diffHours = Math.floor(diffMins / 60);
// // // // //     const diffDays = Math.floor(diffHours / 24);
    
// // // // //     if (diffMins < 1) {
// // // // //       return 'Just now';
// // // // //     } else if (diffMins < 60) {
// // // // //       return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
// // // // //     } else if (diffHours < 24) {
// // // // //       return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
// // // // //     } else if (diffDays < 7) {
// // // // //       return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
// // // // //     } else {
// // // // //       return date.toLocaleDateString();
// // // // //     }
// // // // //   };

// // // // //   // Check if notification is a duplicate
// // // // //   const isDuplicate = useCallback((notification) => {
// // // // //     const signature = `${notification.type || ''}-${notification.senderName || ''}-${notification.data?.ticketId || ''}`;
// // // // //     const now = Date.now();
// // // // //     const DEDUPLICATION_WINDOW = 10000; // 10 seconds
    
// // // // //     if (recentNotificationsRef.current.has(signature)) {
// // // // //       const lastSeen = recentNotificationsRef.current.get(signature);
// // // // //       if (now - lastSeen < DEDUPLICATION_WINDOW) {
// // // // //         console.log('Duplicate notification prevented:', signature);
// // // // //         return true;
// // // // //       }
// // // // //     }
    
// // // // //     // Update record
// // // // //     recentNotificationsRef.current.set(signature, now);
    
// // // // //     // Clean up old entries
// // // // //     for (const [key, timestamp] of recentNotificationsRef.current.entries()) {
// // // // //       if (now - timestamp > DEDUPLICATION_WINDOW) {
// // // // //         recentNotificationsRef.current.delete(key);
// // // // //       }
// // // // //     }
    
// // // // //     return false;
// // // // //   }, []);

// // // // //   // Load notifications from Firestore
// // // // //   const loadFirestoreNotifications = useCallback(() => {
// // // // //     console.log('Loading notifications from Firestore');
    
// // // // //     // Clean up any existing subscription
// // // // //     if (firestoreUnsubscribeRef.current) {
// // // // //       firestoreUnsubscribeRef.current();
// // // // //       firestoreUnsubscribeRef.current = null;
// // // // //     }
    
// // // // //     const q = query(
// // // // //       collection(db, 'notifications'),
// // // // //       where('recipient', '==', 'dashboard'),
// // // // //       orderBy('timestamp', 'desc'), // Most recent notifications first
// // // // //       limit(50)
// // // // //     );
    
// // // // //     try {
// // // // //       const unsubscribe = onSnapshot(q, (snapshot) => {
// // // // //         const newNotifications = [];
// // // // //         const processedIds = new Set(); // Track IDs to prevent duplicates
        
// // // // //         snapshot.forEach(doc => {
// // // // //           const notificationId = doc.id;
          
// // // // //           // Skip if we've already processed this ID
// // // // //           if (processedIds.has(notificationId)) return;
          
// // // // //           // Add ID to processed set
// // // // //           processedIds.add(notificationId);
          
// // // // //           // Get notification data with the read status from Firestore
// // // // //           // to ensure we respect the persistent read status
// // // // //           const notificationData = doc.data();
          
// // // // //           newNotifications.push({
// // // // //             id: notificationId,
// // // // //             ...notificationData
// // // // //           });
// // // // //         });
        
// // // // //         const formattedNotifications = newNotifications.map(formatNotification);
        
// // // // //         // Sort notifications to ensure newest are at the top
// // // // //         formattedNotifications.sort((a, b) => {
// // // // //           // First sort by read status (unread first)
// // // // //           if (!a.read && b.read) return -1;
// // // // //           if (a.read && !b.read) return 1;
          
// // // // //           // Then by timestamp (most recent first)
// // // // //           // Use receivedAt as a fallback for consistent sorting
// // // // //           const aTime = a.receivedAt || 0;
// // // // //           const bTime = b.receivedAt || 0;
// // // // //           return bTime - aTime;
// // // // //         });
        
// // // // //         setNotifications(formattedNotifications);
// // // // //         setUnreadCount(formattedNotifications.filter(n => !n.read).length);
// // // // //       }, (error) => {
// // // // //         console.error('Error loading Firestore notifications:', error);
// // // // //       });
      
// // // // //       firestoreUnsubscribeRef.current = unsubscribe;
// // // // //       return unsubscribe;
// // // // //     } catch (error) {
// // // // //       console.error('Error setting up Firestore listener:', error);
// // // // //       return () => {};
// // // // //     }
// // // // //   }, [db, formatNotification]);

// // // // //   // Show toast notification - Left-to-right animation
// // // // //   const showToastNotification = useCallback((notification) => {
// // // // //     console.log('Showing toast notification:', notification);
    
// // // // //     try {
// // // // //       const NotificationContent = () => (
// // // // //         <div className="flex items-start gap-3">
// // // // //           <div 
// // // // //             className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
// // // // //             style={{ backgroundColor: notification.backgroundColor || '#E5E7EB' }}
// // // // //           >
// // // // //             {notification.initials}
// // // // //           </div>
// // // // //           <div>
// // // // //             <p className="font-medium">{notification.title || 'New notification'}</p>
// // // // //             <p className="text-sm">
// // // // //               <span className="font-medium">{notification.name}</span>{' '}
// // // // //               <span>{notification.action}</span>
// // // // //               {notification.target && <span> {notification.target}</span>}
// // // // //             </p>
// // // // //           </div>
// // // // //         </div>
// // // // //       );
      
// // // // //       // Use the imported toast function directly with left-to-right animation
// // // // //       toast(<NotificationContent />, {
// // // // //         position: "top-left", // Changed from top-right to top-left
// // // // //         autoClose: 5000,
// // // // //         hideProgressBar: false,
// // // // //         closeOnClick: true,
// // // // //         pauseOnHover: true,
// // // // //         draggable: true,
// // // // //         progress: undefined,
// // // // //         // transition: toast.Slide, // Slide transition for the left-to-right effect
// // // // //         onClick: () => {
// // // // //           // Open notification sidebar when toast is clicked
// // // // //           setIsOpen(true);
// // // // //         }
// // // // //       });
// // // // //     } catch (error) {
// // // // //       console.error('Error showing toast notification:', error);
      
// // // // //       // Try a basic toast as fallback
// // // // //       try {
// // // // //         toast.info(`${notification.title || 'New notification'}: ${notification.name} ${notification.action} ${notification.target || ''}`, {
// // // // //           position: "top-left", // Changed from top-right to top-left
// // // // //           autoClose: 5000,
// // // // //         //   transition: toast.Slide // Slide transition for the left-to-right effect
// // // // //         });
// // // // //       } catch (fallbackError) {
// // // // //         console.error('Fallback toast also failed:', fallbackError);
// // // // //       }
// // // // //     }
// // // // //   }, []);

// // // // //   // Enhanced function to process notifications from Firestore and show toast notifications
// // // // //   const loadAndProcessFirestoreNotifications = useCallback(() => {
// // // // //     console.log('Loading and processing all Firestore notifications');
    
// // // // //     // Clean up any existing subscription
// // // // //     if (firestoreUnsubscribeRef.current) {
// // // // //       firestoreUnsubscribeRef.current();
// // // // //       firestoreUnsubscribeRef.current = null;
// // // // //     }
    
// // // // //     // Query for all notifications, including fallback ones
// // // // //     const q = query(
// // // // //       collection(db, 'notifications'),
// // // // //       where('recipient', '==', 'dashboard'),
// // // // //       orderBy('timestamp', 'desc'),
// // // // //       limit(50)
// // // // //     );
    
// // // // //     try {
// // // // //       const unsubscribe = onSnapshot(q, (snapshot) => {
// // // // //         const newNotifications = [];
// // // // //         const processedIds = new Set(); // Track IDs to prevent duplicates
        
// // // // //         // Process all notifications
// // // // //         snapshot.docChanges().forEach(async (change) => {
// // // // //           // Only process new notifications
// // // // //           if (change.type === 'added') {
// // // // //             const notification = {
// // // // //               id: change.doc.id,
// // // // //               ...change.doc.data()
// // // // //             };
            
// // // // //             // Skip duplicates
// // // // //             if (processedIds.has(notification.id)) return;
// // // // //             processedIds.add(notification.id);
            
// // // // //             // Process any new notification that hasn't been read yet
// // // // //             if (!notification.read) {
// // // // //               console.log('Found new unread notification:', notification.id);
              
// // // // //               if (!isDuplicate(notification)) {
// // // // //                 // Format and show toast
// // // // //                 const formattedNotification = formatNotification(notification);
                
// // // // //                 // Show toast notification for ALL unread notifications from Firestore
// // // // //                 console.log('Showing toast for notification');
// // // // //                 showToastNotification(formattedNotification);
                
// // // // //                 // Play notification sound
// // // // //                 try {
// // // // //                   const audio = new Audio('/notification-sound.mp3');
// // // // //                   audio.play().catch(e => console.error('Error playing sound:', e));
// // // // //                 } catch (error) {
// // // // //                   console.error('Error playing notification sound:', error);
// // // // //                 }
                
// // // // //                 // Mark as processed if it's a fallback notification
// // // // //                 if (notification.sentVia === 'fallback' && notification.processed !== true) {
// // // // //                   try {
// // // // //                     await updateDoc(doc(db, 'notifications', notification.id), {
// // // // //                       processed: true
// // // // //                     });
// // // // //                     console.log('Marked notification as processed:', notification.id);
// // // // //                   } catch (error) {
// // // // //                     console.error('Error marking notification as processed:', error);
// // // // //                   }
// // // // //                 }
// // // // //               }
// // // // //             }
            
// // // // //             // Add to list for state update
// // // // //             newNotifications.push(notification);
// // // // //           }
// // // // //         });
        
// // // // //         // Format and update state
// // // // //         const formattedNotifications = newNotifications.map(formatNotification);
// // // // //         setNotifications(formattedNotifications);
// // // // //         setUnreadCount(formattedNotifications.filter(n => !n.read).length);
// // // // //       }, (error) => {
// // // // //         console.error('Error loading Firestore notifications:', error);
// // // // //       });
      
// // // // //       firestoreUnsubscribeRef.current = unsubscribe;
// // // // //       return unsubscribe;
// // // // //     } catch (error) {
// // // // //       console.error('Error setting up Firestore listener:', error);
// // // // //       return () => {};
// // // // //     }
// // // // //   }, [db, formatNotification, showToastNotification, isDuplicate]);

// // // // //   // Initialize WebSocket connection
// // // // //   useEffect(() => {
// // // // //     let socketInitialized = false;
// // // // //     let cleanup = null;
    
// // // // //     const connectSocket = async () => {
// // // // //       if (socketInitialized) return;
// // // // //       socketInitialized = true;
      
// // // // //       try {
// // // // //         const auth = getAuth();
// // // // //         const user = auth.currentUser;
        
// // // // //         if (!user) {
// // // // //           console.log('No user signed in, using Firestore fallback');
// // // // //           const unsubscribe = loadAndProcessFirestoreNotifications();
// // // // //           return () => unsubscribe();
// // // // //         }
        
// // // // //         // Get token for authentication
// // // // //         const token = await user.getIdToken();
        
// // // // //         // Initialize socket
// // // // //         console.log(`Connecting to notification server: ${SERVER_URL}`);
// // // // //         const newSocket = io(SERVER_URL, {
// // // // //           transports: ['websocket'],
// // // // //           timeout: 10000,
// // // // //           reconnection: true,
// // // // //           reconnectionAttempts: 5
// // // // //         });
        
// // // // //         setSocket(newSocket);
// // // // //         setConnectionAttempts(prev => prev + 1);
        
// // // // //         // Set up event listeners
// // // // //         newSocket.on('connect', () => {
// // // // //           console.log('Connected to notification server');
// // // // //           setConnected(true);
          
// // // // //           // Authenticate after connection
// // // // //           newSocket.emit('authenticate', {
// // // // //             token,
// // // // //             clientType: 'dashboard'
// // // // //           });
// // // // //         });
        
// // // // //         newSocket.on('disconnect', () => {
// // // // //           console.log('Disconnected from notification server');
// // // // //           setConnected(false);
// // // // //         });
        
// // // // //         newSocket.on('connect_error', (error) => {
// // // // //           console.error('Connection error:', error);
// // // // //           setConnected(false);
// // // // //           setConnectionAttempts(prev => prev + 1);
// // // // //         });
        
// // // // //         newSocket.on('authenticated', (response) => {
// // // // //           if (response.success) {
// // // // //             console.log('Successfully authenticated with notification server');
// // // // //             // Fetch existing notifications
// // // // //             newSocket.emit('get-notifications', {
// // // // //               clientType: 'dashboard'
// // // // //             });
// // // // //           } else {
// // // // //             console.error('Authentication failed:', response.error);
            
// // // // //             // Use Firestore as fallback
// // // // //             loadAndProcessFirestoreNotifications();
// // // // //           }
// // // // //         });
        
// // // // //         newSocket.on('notifications-list', (data) => {
// // // // //           if (data.notifications && Array.isArray(data.notifications)) {
// // // // //             const formattedNotifications = data.notifications.map(formatNotification);
// // // // //             setNotifications(formattedNotifications);
// // // // //             setUnreadCount(formattedNotifications.filter(n => !n.read).length);
// // // // //           }
// // // // //         });
        
// // // // //         newSocket.on('new-notification', (notification) => {
// // // // //           console.log('New notification received:', notification);
          
// // // // //           // Skip if it's a duplicate notification
// // // // //           if (isDuplicate(notification)) {
// // // // //             return;
// // // // //           }
          
// // // // //           // Save to Firestore to ensure persistence
// // // // //           try {
// // // // //             // Use the notification ID if available, otherwise Firestore will generate one
// // // // //             const notificationRef = notification.id 
// // // // //               ? doc(db, 'notifications', notification.id)
// // // // //               : doc(collection(db, 'notifications'));
            
// // // // //             // If notification has an ID, update the document
// // // // //             if (notification.id) {
// // // // //               updateDoc(notificationRef, {
// // // // //                 ...notification,
// // // // //                 recipient: 'dashboard',
// // // // //                 receivedAt: new Date(),
// // // // //                 processed: true
// // // // //               }).catch(error => {
// // // // //                 console.error('Error updating notification in Firestore:', error);
// // // // //               });
// // // // //             } 
// // // // //             // Otherwise, create a new document
// // // // //             else {
// // // // //               const newNotificationId = notificationRef.id;
// // // // //               notification.id = newNotificationId;
              
// // // // //               // Use setDoc since we already have a reference with ID
// // // // //               import('firebase/firestore').then(({ setDoc }) => {
// // // // //                 setDoc(notificationRef, {
// // // // //                   ...notification,
// // // // //                   recipient: 'dashboard',
// // // // //                   receivedAt: new Date(),
// // // // //                   processed: true
// // // // //                 }).catch(error => {
// // // // //                   console.error('Error saving notification to Firestore:', error);
// // // // //                 });
// // // // //               });
// // // // //             }
// // // // //           } catch (error) {
// // // // //             console.error('Error saving notification to Firestore:', error);
// // // // //           }
          
// // // // //           const formattedNotification = formatNotification(notification);
          
// // // // //           // Add to notifications list
// // // // //           setNotifications(prev => {
// // // // //             // Check if notification already exists
// // // // //             const exists = prev.some(n => n.id === formattedNotification.id);
// // // // //             if (exists) return prev;
            
// // // // //             // Add new notification at the top of the list
// // // // //             const updatedNotifications = [formattedNotification, ...prev];
            
// // // // //             // Sort notifications to ensure proper order
// // // // //             return updatedNotifications.sort((a, b) => {
// // // // //               // Unread notifications first
// // // // //               if (!a.read && b.read) return -1;
// // // // //               if (a.read && !b.read) return 1;
              
// // // // //               // Then by timestamp
// // // // //               const aTime = a.receivedAt || 0;
// // // // //               const bTime = b.receivedAt || 0;
// // // // //               return bTime - aTime;
// // // // //             });
// // // // //           });
          
// // // // //           if (!notification.read) {
// // // // //             setUnreadCount(prev => prev + 1);
            
// // // // //             // Show toast notification
// // // // //             showToastNotification(formattedNotification);
            
// // // // //             // Play notification sound
// // // // //             try {
// // // // //               const audio = new Audio('/notification-sound.mp3');
// // // // //               audio.play().catch(e => console.error('Error playing sound:', e));
// // // // //             } catch (error) {
// // // // //               console.error('Error playing notification sound:', error);
// // // // //             }
// // // // //           }
// // // // //         });
        
// // // // //         newSocket.on('notification-updated', (data) => {
// // // // //           if (data.success && data.id) {
// // // // //             setNotifications(prev => 
// // // // //               prev.map(n => 
// // // // //                 n.id === data.id ? { ...n, read: true } : n
// // // // //               )
// // // // //             );
// // // // //             setUnreadCount(prev => Math.max(0, prev - 1));
// // // // //           }
// // // // //         });
        
// // // // //         newSocket.on('error', (error) => {
// // // // //           console.error('Socket error:', error);
// // // // //         });
        
// // // // //         return () => {
// // // // //           newSocket.disconnect();
// // // // //         };
// // // // //       } catch (error) {
// // // // //         console.error('Error setting up WebSocket:', error);
        
// // // // //         // Use Firestore as fallback
// // // // //         const unsubscribe = loadAndProcessFirestoreNotifications();
// // // // //         return () => unsubscribe();
// // // // //       }
// // // // //     };
    
// // // // //     cleanup = connectSocket();
    
// // // // //     return () => {
// // // // //       if (typeof cleanup === 'function') {
// // // // //         cleanup();
// // // // //       }
      
// // // // //       if (socket) {
// // // // //         socket.disconnect();
// // // // //         setSocket(null);
// // // // //       }
// // // // //     };
// // // // //   }, [loadAndProcessFirestoreNotifications, formatNotification, showToastNotification, isDuplicate]);
  
// // // // //   // Also load fallback notifications specifically when component mounts
// // // // //   useEffect(() => {
// // // // //     console.log('Initial load of notifications, including fallback');
// // // // //     const unsubscribe = loadAndProcessFirestoreNotifications();
    
// // // // //     return () => {
// // // // //       if (typeof unsubscribe === 'function') {
// // // // //         unsubscribe();
// // // // //       }
// // // // //     };
// // // // //   }, [loadAndProcessFirestoreNotifications]);
  
// // // // //   // Use Firestore as fallback if WebSocket fails
// // // // //   useEffect(() => {
// // // // //     // If we've tried to connect and failed, or if we're not connected after attempting,
// // // // //     // use Firestore as fallback
// // // // //     if (connectionAttempts >= 2 || (!connected && connectionAttempts > 0)) {
// // // // //       loadAndProcessFirestoreNotifications();
// // // // //     }
    
// // // // //     return () => {
// // // // //       if (firestoreUnsubscribeRef.current) {
// // // // //         firestoreUnsubscribeRef.current();
// // // // //       }
// // // // //     };
// // // // //   }, [connectionAttempts, connected, loadAndProcessFirestoreNotifications]);
  
// // // // //   // Mark notification as read
// // // // //   const markAsRead = useCallback((notificationId) => {
// // // // //     if (!notificationId) return;
    
// // // // //     // Always update in Firestore to ensure persistence across page refreshes
// // // // //     try {
// // // // //       updateDoc(doc(db, 'notifications', notificationId), {
// // // // //         read: true,
// // // // //         lastReadAt: new Date() // Add timestamp when it was read
// // // // //       });
// // // // //       console.log('Marked notification as read in Firestore:', notificationId);
// // // // //     } catch (error) {
// // // // //       console.error('Error marking notification as read in Firestore:', error);
// // // // //     }
    
// // // // //     // Also update via WebSocket if connected
// // // // //     if (connected && socket) {
// // // // //       socket.emit('mark-read', { notificationId });
// // // // //       console.log('Sent mark-read event to WebSocket for:', notificationId);
// // // // //     }
    
// // // // //     // Optimistically update UI - Don't remove the notification, just mark it as read
// // // // //     setNotifications(prev => {
// // // // //       const updated = prev.map(n => 
// // // // //         n.id === notificationId ? { ...n, read: true } : n
// // // // //       );
      
// // // // //       // Re-sort to maintain order (unread first, then by time)
// // // // //       return updated.sort((a, b) => {
// // // // //         if (!a.read && b.read) return -1;
// // // // //         if (a.read && !b.read) return 1;
// // // // //         const aTime = a.receivedAt || 0;
// // // // //         const bTime = b.receivedAt || 0;
// // // // //         return bTime - aTime;
// // // // //       });
// // // // //     });
    
// // // // //     setUnreadCount(prev => Math.max(0, prev - 1));
// // // // //   }, [connected, socket, db]);
  
// // // // //   // Mark all notifications as read
// // // // //   const markAllAsRead = useCallback(() => {
// // // // //     // Get all unread notification IDs
// // // // //     const unreadIds = notifications
// // // // //       .filter(n => !n.read)
// // // // //       .map(n => n.id);
    
// // // // //     if (unreadIds.length === 0) return;
    
// // // // //     // Mark each as read
// // // // //     unreadIds.forEach(id => {
// // // // //       if (connected && socket) {
// // // // //         socket.emit('mark-read', { notificationId: id });
// // // // //       } else {
// // // // //         try {
// // // // //           updateDoc(doc(db, 'notifications', id), {
// // // // //             read: true
// // // // //           });
// // // // //         } catch (error) {
// // // // //           console.error('Error marking notification as read:', error);
// // // // //         }
// // // // //       }
// // // // //     });
    
// // // // //     // Optimistically update UI - Don't remove the notifications, just mark them as read
// // // // //     setNotifications(prev => 
// // // // //       prev.map(n => ({ ...n, read: true }))
// // // // //     );
// // // // //     setUnreadCount(0);
// // // // //   }, [notifications, connected, socket, db]);

// // // // //   // Clear all notifications
// // // // //   const clearAllNotifications = useCallback(async () => {
// // // // //     if (notifications.length === 0) return;
    
// // // // //     try {
// // // // //       // Delete all notifications from Firestore
// // // // //       const deletePromises = notifications.map(notification => 
// // // // //         deleteDoc(doc(db, 'notifications', notification.id))
// // // // //       );
      
// // // // //       await Promise.all(deletePromises);
      
// // // // //       // Clear notifications from state
// // // // //       setNotifications([]);
// // // // //       setUnreadCount(0);
// // // // //     } catch (error) {
// // // // //       console.error('Error clearing notifications:', error);
// // // // //     }
// // // // //   }, [notifications, db]);
  
// // // // //   // Toggle sidebar
// // // // //   const toggleSidebar = useCallback(() => {
// // // // //     setIsOpen(prev => !prev);
// // // // //   }, []);
  
// // // // //   // Close sidebar
// // // // //   const closeSidebar = useCallback(() => {
// // // // //     setIsOpen(false);
// // // // //   }, []);
  
// // // // //   // Open sidebar
// // // // //   const openSidebar = useCallback(() => {
// // // // //     setIsOpen(true);
// // // // //   }, []);
  
// // // // //   // Context value
// // // // //   const value = {
// // // // //     notifications,
// // // // //     unreadCount,
// // // // //     isOpen,
// // // // //     markAsRead,
// // // // //     markAllAsRead,
// // // // //     clearAllNotifications,
// // // // //     toggleSidebar,
// // // // //     closeSidebar,
// // // // //     openSidebar,
// // // // //     connected,
// // // // //     showToastNotification // Expose for testing
// // // // //   };
  
// // // // //   return (
// // // // //     <NotificationContext.Provider value={value}>
// // // // //       {children}
// // // // //       <ToastContainer
// // // // //         position="top-left"
// // // // //         autoClose={5000}
// // // // //         hideProgressBar={false}
// // // // //         newestOnTop
// // // // //         closeOnClick
// // // // //         rtl={false}
// // // // //         pauseOnFocusLoss
// // // // //         draggable
// // // // //         pauseOnHover
// // // // //         // transition={toast.Slide}
// // // // //         style={{ zIndex: 9999 }} // Ensure high z-index
// // // // //       />
// // // // //     </NotificationContext.Provider>
// // // // //   );
// // // // // };

// // // // // export default NotificationContext;

// // // // import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
// // // // import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, getFirestore, limit, deleteDoc } from 'firebase/firestore';
// // // // import { getAuth } from 'firebase/auth';
// // // // import io from 'socket.io-client';
// // // // import { toast, ToastContainer } from 'react-toastify';
// // // // import 'react-toastify/dist/ReactToastify.css';

// // // // // Create the context
// // // // const NotificationContext = createContext();

// // // // // Server URLs for different environments
// // // // const PRODUCTION_URL = 'https://puriserver.onrender.com';
// // // // const DEVELOPMENT_URL = 'http://localhost:5000';
// // // // const SERVER_URL = process.env.NODE_ENV === 'production' ? PRODUCTION_URL : DEVELOPMENT_URL;

// // // // export const useNotifications = () => useContext(NotificationContext);

// // // // export const NotificationProvider = ({ children }) => {
// // // //   const [notifications, setNotifications] = useState([]);
// // // //   const [unreadCount, setUnreadCount] = useState(0);
// // // //   const [isOpen, setIsOpen] = useState(false);
// // // //   const [socket, setSocket] = useState(null);
// // // //   const [connected, setConnected] = useState(false);
// // // //   const [connectionAttempts, setConnectionAttempts] = useState(0);
// // // //   const db = getFirestore();
// // // //   const firestoreUnsubscribeRef = useRef(null);
// // // //   const recentNotificationsRef = useRef(new Map()); // Track recently processed notifications

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
      
// // // //       if (!notification.senderName && notification.data?.phoneNumber) {
// // // //         name = notification.data.phoneNumber;
// // // //         initials = 'U';
// // // //       }
      
// // // //       if (!notification.senderName && notification.senderPhone) {
// // // //         name = notification.senderPhone;
// // // //         initials = 'U';
// // // //       }
// // // //     }
    
// // // //     // Format time - Fixed to handle various timestamp formats
// // // //     let time;
// // // //     if (notification.timestamp) {
// // // //       try {
// // // //         // Handle Firebase timestamp object (has toDate method)
// // // //         if (notification.timestamp.toDate) {
// // // //           time = formatTimeAgo(notification.timestamp.toDate());
// // // //         } 
// // // //         // Handle ISO string timestamp
// // // //         else if (typeof notification.timestamp === 'string') {
// // // //           time = formatTimeAgo(new Date(notification.timestamp));
// // // //         } 
// // // //         // Handle timestamp number/seconds
// // // //         else if (typeof notification.timestamp === 'number') {
// // // //           // Check if this is seconds (Firebase timestamp) or milliseconds
// // // //           const date = notification.timestamp > 9999999999
// // // //             ? new Date(notification.timestamp) // milliseconds
// // // //             : new Date(notification.timestamp * 1000); // seconds
// // // //           time = formatTimeAgo(date);
// // // //         }
// // // //         // If none of these, fallback
// // // //         else {
// // // //           time = 'Recent';
// // // //         }
// // // //       } catch (err) {
// // // //         console.error('Error formatting timestamp:', err, notification.timestamp);
// // // //         time = 'Recent';
// // // //       }
// // // //     } else {
// // // //       time = 'Recent';
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
// // // //       type: notification.type,
// // // //       title: notification.title || `New ${notification.type || 'notification'}`,
// // // //       receivedAt: Date.now() // Add timestamp when this notification was processed
// // // //     };
// // // //   }, []);

// // // //   // Helper function to format time ago
// // // //   const formatTimeAgo = (date) => {
// // // //     if (!(date instanceof Date) || isNaN(date.getTime())) {
// // // //       console.warn('Invalid date provided to formatTimeAgo', date);
// // // //       return 'Recent';
// // // //     }
    
// // // //     const now = new Date();
// // // //     const diffMs = now - date;
// // // //     const diffMins = Math.floor(diffMs / 60000);
// // // //     const diffHours = Math.floor(diffMins / 60);
// // // //     const diffDays = Math.floor(diffHours / 24);
    
// // // //     if (diffMins < 1) {
// // // //       return 'Just now';
// // // //     } else if (diffMins < 60) {
// // // //       return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
// // // //     } else if (diffHours < 24) {
// // // //       return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
// // // //     } else if (diffDays < 7) {
// // // //       return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
// // // //     } else {
// // // //       return date.toLocaleDateString();
// // // //     }
// // // //   };

// // // //   // Check if notification is a duplicate
// // // //   const isDuplicate = useCallback((notification) => {
// // // //     const signature = `${notification.type || ''}-${notification.senderName || ''}-${notification.data?.ticketId || ''}`;
// // // //     const now = Date.now();
// // // //     const DEDUPLICATION_WINDOW = 10000; // 10 seconds
    
// // // //     if (recentNotificationsRef.current.has(signature)) {
// // // //       const lastSeen = recentNotificationsRef.current.get(signature);
// // // //       if (now - lastSeen < DEDUPLICATION_WINDOW) {
// // // //         console.log('Duplicate notification prevented:', signature);
// // // //         return true;
// // // //       }
// // // //     }
    
// // // //     // Update record
// // // //     recentNotificationsRef.current.set(signature, now);
    
// // // //     // Clean up old entries
// // // //     for (const [key, timestamp] of recentNotificationsRef.current.entries()) {
// // // //       if (now - timestamp > DEDUPLICATION_WINDOW) {
// // // //         recentNotificationsRef.current.delete(key);
// // // //       }
// // // //     }
    
// // // //     return false;
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
// // // //       orderBy('timestamp', 'desc'), // Most recent notifications first
// // // //       limit(50)
// // // //     );
    
// // // //     try {
// // // //       const unsubscribe = onSnapshot(q, (snapshot) => {
// // // //         const newNotifications = [];
// // // //         const processedIds = new Set(); // Track IDs to prevent duplicates
        
// // // //         snapshot.forEach(doc => {
// // // //           const notificationId = doc.id;
          
// // // //           // Skip if we've already processed this ID
// // // //           if (processedIds.has(notificationId)) return;
          
// // // //           // Add ID to processed set
// // // //           processedIds.add(notificationId);
          
// // // //           // Get notification data with the read status from Firestore
// // // //           // to ensure we respect the persistent read status
// // // //           const notificationData = doc.data();
          
// // // //           newNotifications.push({
// // // //             id: notificationId,
// // // //             ...notificationData
// // // //           });
// // // //         });
        
// // // //         const formattedNotifications = newNotifications.map(formatNotification);
        
// // // //         // Sort notifications to ensure newest are at the top
// // // //         formattedNotifications.sort((a, b) => {
// // // //           // First sort by read status (unread first)
// // // //           if (!a.read && b.read) return -1;
// // // //           if (a.read && !b.read) return 1;
          
// // // //           // Then by timestamp (most recent first)
// // // //           // Use receivedAt as a fallback for consistent sorting
// // // //           const aTime = a.receivedAt || 0;
// // // //           const bTime = b.receivedAt || 0;
// // // //           return bTime - aTime;
// // // //         });
        
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

// // // //   // Show toast notification - Left-to-right animation (react-toastify v10.0.5)
// // // //   const showToastNotification = useCallback((notification) => {
// // // //     console.log('Showing toast notification:', notification);
    
// // // //     try {
// // // //       const NotificationContent = () => (
// // // //         <div className="flex items-start gap-3">
// // // //           <div 
// // // //             className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
// // // //             style={{ backgroundColor: notification.backgroundColor || '#E5E7EB' }}
// // // //           >
// // // //             {notification.initials}
// // // //           </div>
// // // //           <div>
// // // //             <p className="font-medium">{notification.title || 'New notification'}</p>
// // // //             <p className="text-sm">
// // // //               <span className="font-medium">{notification.name}</span>{' '}
// // // //               <span>{notification.action}</span>
// // // //               {notification.target && <span> {notification.target}</span>}
// // // //             </p>
// // // //           </div>
// // // //         </div>
// // // //       );
      
// // // //       // For react-toastify v10.0.5, use the correct API for transitions
// // // //       toast(<NotificationContent />, {
// // // //         position: "top-left",
// // // //         autoClose: 5000,
// // // //         hideProgressBar: false,
// // // //         closeOnClick: true,
// // // //         pauseOnHover: true,
// // // //         draggable: true,
// // // //         theme: "light",
// // // //         onClick: () => {
// // // //           // Open notification sidebar when toast is clicked
// // // //           setIsOpen(true);
// // // //         }
// // // //       });
// // // //     } catch (error) {
// // // //       console.error('Error showing toast notification:', error);
      
// // // //       // Try a basic toast as fallback
// // // //       try {
// // // //         toast.info(`${notification.title || 'New notification'}: ${notification.name} ${notification.action} ${notification.target || ''}`, {
// // // //           position: "top-left",
// // // //           autoClose: 5000
// // // //         });
// // // //       } catch (fallbackError) {
// // // //         console.error('Fallback toast also failed:', fallbackError);
// // // //       }
// // // //     }
// // // //   }, []);

// // // //   // Enhanced function to process notifications from Firestore and show toast notifications
// // // //   const loadAndProcessFirestoreNotifications = useCallback(() => {
// // // //     console.log('Loading and processing all Firestore notifications');
    
// // // //     // Clean up any existing subscription
// // // //     if (firestoreUnsubscribeRef.current) {
// // // //       firestoreUnsubscribeRef.current();
// // // //       firestoreUnsubscribeRef.current = null;
// // // //     }
    
// // // //     // Query for all notifications, including fallback ones
// // // //     const q = query(
// // // //       collection(db, 'notifications'),
// // // //       where('recipient', '==', 'dashboard'),
// // // //       orderBy('timestamp', 'desc'),
// // // //       limit(50)
// // // //     );
    
// // // //     try {
// // // //       const unsubscribe = onSnapshot(q, (snapshot) => {
// // // //         const newNotifications = [];
// // // //         const processedIds = new Set(); // Track IDs to prevent duplicates
        
// // // //         // Process all notifications
// // // //         snapshot.docChanges().forEach(async (change) => {
// // // //           // Only process new notifications
// // // //           if (change.type === 'added') {
// // // //             const notification = {
// // // //               id: change.doc.id,
// // // //               ...change.doc.data()
// // // //             };
            
// // // //             // Skip duplicates
// // // //             if (processedIds.has(notification.id)) return;
// // // //             processedIds.add(notification.id);
            
// // // //             // Process any new notification that hasn't been read yet
// // // //             if (!notification.read) {
// // // //               console.log('Found new unread notification:', notification.id);
              
// // // //               if (!isDuplicate(notification)) {
// // // //                 // Format and show toast
// // // //                 const formattedNotification = formatNotification(notification);
                
// // // //                 // Show toast notification for ALL unread notifications from Firestore
// // // //                 console.log('Showing toast for notification');
// // // //                 showToastNotification(formattedNotification);
                
// // // //                 // Play notification sound
// // // //                 try {
// // // //                   const audio = new Audio('/notification-sound.mp3');
// // // //                   audio.play().catch(e => console.error('Error playing sound:', e));
// // // //                 } catch (error) {
// // // //                   console.error('Error playing notification sound:', error);
// // // //                 }
                
// // // //                 // Mark as processed if it's a fallback notification
// // // //                 if (notification.sentVia === 'fallback' && notification.processed !== true) {
// // // //                   try {
// // // //                     await updateDoc(doc(db, 'notifications', notification.id), {
// // // //                       processed: true
// // // //                     });
// // // //                     console.log('Marked notification as processed:', notification.id);
// // // //                   } catch (error) {
// // // //                     console.error('Error marking notification as processed:', error);
// // // //                   }
// // // //                 }
// // // //               }
// // // //             }
            
// // // //             // Add to list for state update
// // // //             newNotifications.push(notification);
// // // //           }
// // // //         });
        
// // // //         // Format and update state
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
// // // //   }, [db, formatNotification, showToastNotification, isDuplicate]);

// // // //   // Initialize WebSocket connection
// // // //   useEffect(() => {
// // // //     let socketInitialized = false;
// // // //     let cleanup = null;
    
// // // //     const connectSocket = async () => {
// // // //       if (socketInitialized) return;
// // // //       socketInitialized = true;
      
// // // //       try {
// // // //         const auth = getAuth();
// // // //         const user = auth.currentUser;
        
// // // //         if (!user) {
// // // //           console.log('No user signed in, using Firestore fallback');
// // // //           const unsubscribe = loadAndProcessFirestoreNotifications();
// // // //           return () => unsubscribe();
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
            
// // // //             // Use Firestore as fallback
// // // //             loadAndProcessFirestoreNotifications();
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
          
// // // //           // Skip if it's a duplicate notification
// // // //           if (isDuplicate(notification)) {
// // // //             return;
// // // //           }
          
// // // //           // Save to Firestore to ensure persistence
// // // //           try {
// // // //             // Use the notification ID if available, otherwise Firestore will generate one
// // // //             const notificationRef = notification.id 
// // // //               ? doc(db, 'notifications', notification.id)
// // // //               : doc(collection(db, 'notifications'));
            
// // // //             // If notification has an ID, update the document
// // // //             if (notification.id) {
// // // //               updateDoc(notificationRef, {
// // // //                 ...notification,
// // // //                 recipient: 'dashboard',
// // // //                 receivedAt: new Date(),
// // // //                 processed: true
// // // //               }).catch(error => {
// // // //                 console.error('Error updating notification in Firestore:', error);
// // // //               });
// // // //             } 
// // // //             // Otherwise, create a new document
// // // //             else {
// // // //               const newNotificationId = notificationRef.id;
// // // //               notification.id = newNotificationId;
              
// // // //               // Use setDoc since we already have a reference with ID
// // // //               import('firebase/firestore').then(({ setDoc }) => {
// // // //                 setDoc(notificationRef, {
// // // //                   ...notification,
// // // //                   recipient: 'dashboard',
// // // //                   receivedAt: new Date(),
// // // //                   processed: true
// // // //                 }).catch(error => {
// // // //                   console.error('Error saving notification to Firestore:', error);
// // // //                 });
// // // //               });
// // // //             }
// // // //           } catch (error) {
// // // //             console.error('Error saving notification to Firestore:', error);
// // // //           }
          
// // // //           const formattedNotification = formatNotification(notification);
          
// // // //           // Add to notifications list
// // // //           setNotifications(prev => {
// // // //             // Check if notification already exists
// // // //             const exists = prev.some(n => n.id === formattedNotification.id);
// // // //             if (exists) return prev;
            
// // // //             // Add new notification at the top of the list
// // // //             const updatedNotifications = [formattedNotification, ...prev];
            
// // // //             // Sort notifications to ensure proper order
// // // //             return updatedNotifications.sort((a, b) => {
// // // //               // Unread notifications first
// // // //               if (!a.read && b.read) return -1;
// // // //               if (a.read && !b.read) return 1;
              
// // // //               // Then by timestamp
// // // //               const aTime = a.receivedAt || 0;
// // // //               const bTime = b.receivedAt || 0;
// // // //               return bTime - aTime;
// // // //             });
// // // //           });
          
// // // //           if (!notification.read) {
// // // //             setUnreadCount(prev => prev + 1);
            
// // // //             // Show toast notification
// // // //             showToastNotification(formattedNotification);
            
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
        
// // // //         return () => {
// // // //           newSocket.disconnect();
// // // //         };
// // // //       } catch (error) {
// // // //         console.error('Error setting up WebSocket:', error);
        
// // // //         // Use Firestore as fallback
// // // //         const unsubscribe = loadAndProcessFirestoreNotifications();
// // // //         return () => unsubscribe();
// // // //       }
// // // //     };
    
// // // //     cleanup = connectSocket();
    
// // // //     return () => {
// // // //       if (typeof cleanup === 'function') {
// // // //         cleanup();
// // // //       }
      
// // // //       if (socket) {
// // // //         socket.disconnect();
// // // //         setSocket(null);
// // // //       }
// // // //     };
// // // //   }, [loadAndProcessFirestoreNotifications, formatNotification, showToastNotification, isDuplicate]);
  
// // // //   // Also load fallback notifications specifically when component mounts
// // // //   useEffect(() => {
// // // //     console.log('Initial load of notifications, including fallback');
// // // //     const unsubscribe = loadAndProcessFirestoreNotifications();
    
// // // //     return () => {
// // // //       if (typeof unsubscribe === 'function') {
// // // //         unsubscribe();
// // // //       }
// // // //     };
// // // //   }, [loadAndProcessFirestoreNotifications]);
  
// // // //   // Use Firestore as fallback if WebSocket fails
// // // //   useEffect(() => {
// // // //     // If we've tried to connect and failed, or if we're not connected after attempting,
// // // //     // use Firestore as fallback
// // // //     if (connectionAttempts >= 2 || (!connected && connectionAttempts > 0)) {
// // // //       loadAndProcessFirestoreNotifications();
// // // //     }
    
// // // //     return () => {
// // // //       if (firestoreUnsubscribeRef.current) {
// // // //         firestoreUnsubscribeRef.current();
// // // //       }
// // // //     };
// // // //   }, [connectionAttempts, connected, loadAndProcessFirestoreNotifications]);
  
// // // //   // Mark notification as read
// // // //   const markAsRead = useCallback((notificationId) => {
// // // //     if (!notificationId) return;
    
// // // //     // Always update in Firestore to ensure persistence across page refreshes
// // // //     try {
// // // //       updateDoc(doc(db, 'notifications', notificationId), {
// // // //         read: true,
// // // //         lastReadAt: new Date() // Add timestamp when it was read
// // // //       });
// // // //       console.log('Marked notification as read in Firestore:', notificationId);
// // // //     } catch (error) {
// // // //       console.error('Error marking notification as read in Firestore:', error);
// // // //     }
    
// // // //     // Also update via WebSocket if connected
// // // //     if (connected && socket) {
// // // //       socket.emit('mark-read', { notificationId });
// // // //       console.log('Sent mark-read event to WebSocket for:', notificationId);
// // // //     }
    
// // // //     // Optimistically update UI - Don't remove the notification, just mark it as read
// // // //     setNotifications(prev => {
// // // //       const updated = prev.map(n => 
// // // //         n.id === notificationId ? { ...n, read: true } : n
// // // //       );
      
// // // //       // Re-sort to maintain order (unread first, then by time)
// // // //       return updated.sort((a, b) => {
// // // //         if (!a.read && b.read) return -1;
// // // //         if (a.read && !b.read) return 1;
// // // //         const aTime = a.receivedAt || 0;
// // // //         const bTime = b.receivedAt || 0;
// // // //         return bTime - aTime;
// // // //       });
// // // //     });
    
// // // //     setUnreadCount(prev => Math.max(0, prev - 1));
// // // //   }, [connected, socket, db]);
  
// // // //   // Mark all notifications as read
// // // //   const markAllAsRead = useCallback(() => {
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
    
// // // //     // Optimistically update UI - Don't remove the notifications, just mark them as read
// // // //     setNotifications(prev => 
// // // //       prev.map(n => ({ ...n, read: true }))
// // // //     );
// // // //     setUnreadCount(0);
// // // //   }, [notifications, connected, socket, db]);

// // // //   // Clear all notifications
// // // //   const clearAllNotifications = useCallback(async () => {
// // // //     if (notifications.length === 0) return;
    
// // // //     try {
// // // //       // Delete all notifications from Firestore
// // // //       const deletePromises = notifications.map(notification => 
// // // //         deleteDoc(doc(db, 'notifications', notification.id))
// // // //       );
      
// // // //       await Promise.all(deletePromises);
      
// // // //       // Clear notifications from state
// // // //       setNotifications([]);
// // // //       setUnreadCount(0);
// // // //     } catch (error) {
// // // //       console.error('Error clearing notifications:', error);
// // // //     }
// // // //   }, [notifications, db]);
  
// // // //   // Toggle sidebar
// // // //   const toggleSidebar = useCallback(() => {
// // // //     setIsOpen(prev => !prev);
// // // //   }, []);
  
// // // //   // Close sidebar
// // // //   const closeSidebar = useCallback(() => {
// // // //     setIsOpen(false);
// // // //   }, []);
  
// // // //   // Open sidebar
// // // //   const openSidebar = useCallback(() => {
// // // //     setIsOpen(true);
// // // //   }, []);
  
// // // //   // Context value
// // // //   const value = {
// // // //     notifications,
// // // //     unreadCount,
// // // //     isOpen,
// // // //     markAsRead,
// // // //     markAllAsRead,
// // // //     clearAllNotifications,
// // // //     toggleSidebar,
// // // //     closeSidebar,
// // // //     openSidebar,
// // // //     connected,
// // // //     showToastNotification // Expose for testing
// // // //   };
  
// // // //   return (
// // // //     <NotificationContext.Provider value={value}>
// // // //       {children}
// // // //       <ToastContainer
// // // //         position="top-left"
// // // //         autoClose={5000}
// // // //         hideProgressBar={false}
// // // //         newestOnTop
// // // //         closeOnClick
// // // //         rtl={false}
// // // //         pauseOnFocusLoss
// // // //         draggable
// // // //         pauseOnHover
// // // //         theme="light"
// // // //         style={{ zIndex: 9999 }} // Ensure high z-index
// // // //       />
// // // //     </NotificationContext.Provider>
// // // //   );
// // // // };

// // // // export default NotificationContext;

// // // // import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
// // // // import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, getFirestore, limit, deleteDoc } from 'firebase/firestore';
// // // // import { getAuth } from 'firebase/auth';
// // // // import io from 'socket.io-client';
// // // // import { toast, ToastContainer } from 'react-toastify';
// // // // import 'react-toastify/dist/ReactToastify.css';

// // // // // Create the context
// // // // const NotificationContext = createContext();

// // // // // Server URLs for different environments
// // // // const PRODUCTION_URL = 'https://puriserver.onrender.com';
// // // // const DEVELOPMENT_URL = 'http://localhost:5000';
// // // // const SERVER_URL = process.env.NODE_ENV === 'production' ? PRODUCTION_URL : DEVELOPMENT_URL;

// // // // export const useNotifications = () => useContext(NotificationContext);

// // // // export const NotificationProvider = ({ children }) => {
// // // //   const [notifications, setNotifications] = useState([]);
// // // //   const [unreadCount, setUnreadCount] = useState(0);
// // // //   const [isOpen, setIsOpen] = useState(false);
// // // //   const [socket, setSocket] = useState(null);
// // // //   const [connected, setConnected] = useState(false);
// // // //   const [connectionAttempts, setConnectionAttempts] = useState(0);
// // // //   const db = getFirestore();
// // // //   const firestoreUnsubscribeRef = useRef(null);
// // // //   const recentNotificationsRef = useRef(new Map()); // Track recently processed notifications

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
      
// // // //       if (!notification.senderName && notification.data?.phoneNumber) {
// // // //         name = notification.data.phoneNumber;
// // // //         initials = 'U';
// // // //       }
      
// // // //       if (!notification.senderName && notification.senderPhone) {
// // // //         name = notification.senderPhone;
// // // //         initials = 'U';
// // // //       }
// // // //     }
    
// // // //     // Format time - Fixed to handle various timestamp formats
// // // //     let time;
// // // //     if (notification.timestamp) {
// // // //       try {
// // // //         // Handle Firebase timestamp object (has toDate method)
// // // //         if (notification.timestamp.toDate) {
// // // //           time = formatTimeAgo(notification.timestamp.toDate());
// // // //         } 
// // // //         // Handle ISO string timestamp
// // // //         else if (typeof notification.timestamp === 'string') {
// // // //           time = formatTimeAgo(new Date(notification.timestamp));
// // // //         } 
// // // //         // Handle timestamp number/seconds
// // // //         else if (typeof notification.timestamp === 'number') {
// // // //           // Check if this is seconds (Firebase timestamp) or milliseconds
// // // //           const date = notification.timestamp > 9999999999
// // // //             ? new Date(notification.timestamp) // milliseconds
// // // //             : new Date(notification.timestamp * 1000); // seconds
// // // //           time = formatTimeAgo(date);
// // // //         }
// // // //         // If none of these, fallback
// // // //         else {
// // // //           time = 'Recent';
// // // //         }
// // // //       } catch (err) {
// // // //         console.error('Error formatting timestamp:', err, notification.timestamp);
// // // //         time = 'Recent';
// // // //       }
// // // //     } else {
// // // //       time = 'Recent';
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
// // // //       type: notification.type,
// // // //       title: notification.title || `New ${notification.type || 'notification'}`,
// // // //       receivedAt: Date.now() // Add timestamp when this notification was processed
// // // //     };
// // // //   }, []);

// // // //   // Helper function to format time ago
// // // //   const formatTimeAgo = (date) => {
// // // //     if (!(date instanceof Date) || isNaN(date.getTime())) {
// // // //       console.warn('Invalid date provided to formatTimeAgo', date);
// // // //       return 'Recent';
// // // //     }
    
// // // //     const now = new Date();
// // // //     const diffMs = now - date;
// // // //     const diffMins = Math.floor(diffMs / 60000);
// // // //     const diffHours = Math.floor(diffMins / 60);
// // // //     const diffDays = Math.floor(diffHours / 24);
    
// // // //     if (diffMins < 1) {
// // // //       return 'Just now';
// // // //     } else if (diffMins < 60) {
// // // //       return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
// // // //     } else if (diffHours < 24) {
// // // //       return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
// // // //     } else if (diffDays < 7) {
// // // //       return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
// // // //     } else {
// // // //       return date.toLocaleDateString();
// // // //     }
// // // //   };

// // // //   // Check if notification is a duplicate
// // // //   const isDuplicate = useCallback((notification) => {
// // // //     const signature = `${notification.type || ''}-${notification.senderName || ''}-${notification.data?.ticketId || ''}`;
// // // //     const now = Date.now();
// // // //     const DEDUPLICATION_WINDOW = 10000; // 10 seconds
    
// // // //     if (recentNotificationsRef.current.has(signature)) {
// // // //       const lastSeen = recentNotificationsRef.current.get(signature);
// // // //       if (now - lastSeen < DEDUPLICATION_WINDOW) {
// // // //         console.log('Duplicate notification prevented:', signature);
// // // //         return true;
// // // //       }
// // // //     }
    
// // // //     // Update record
// // // //     recentNotificationsRef.current.set(signature, now);
    
// // // //     // Clean up old entries
// // // //     for (const [key, timestamp] of recentNotificationsRef.current.entries()) {
// // // //       if (now - timestamp > DEDUPLICATION_WINDOW) {
// // // //         recentNotificationsRef.current.delete(key);
// // // //       }
// // // //     }
    
// // // //     return false;
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
// // // //       orderBy('timestamp', 'desc'), // Most recent notifications first
// // // //       limit(50)
// // // //     );
    
// // // //     try {
// // // //       const unsubscribe = onSnapshot(q, (snapshot) => {
// // // //         const newNotifications = [];
// // // //         const processedIds = new Set(); // Track IDs to prevent duplicates
        
// // // //         snapshot.forEach(doc => {
// // // //           const notificationId = doc.id;
          
// // // //           // Skip if we've already processed this ID
// // // //           if (processedIds.has(notificationId)) return;
          
// // // //           // Add ID to processed set
// // // //           processedIds.add(notificationId);
          
// // // //           // Get notification data with the read status from Firestore
// // // //           // to ensure we respect the persistent read status
// // // //           const notificationData = doc.data();
          
// // // //           newNotifications.push({
// // // //             id: notificationId,
// // // //             ...notificationData
// // // //           });
// // // //         });
        
// // // //         const formattedNotifications = newNotifications.map(formatNotification);
        
// // // //         // Sort notifications to ensure newest are at the top
// // // //         formattedNotifications.sort((a, b) => {
// // // //           // First sort by read status (unread first)
// // // //           if (!a.read && b.read) return -1;
// // // //           if (a.read && !b.read) return 1;
          
// // // //           // Then by timestamp (most recent first)
// // // //           // Use receivedAt as a fallback for consistent sorting
// // // //           const aTime = a.receivedAt || 0;
// // // //           const bTime = b.receivedAt || 0;
// // // //           return bTime - aTime;
// // // //         });
        
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

// // // //   // Show toast notification - Left-to-right animation (react-toastify v10.0.5)
// // // //   const showToastNotification = useCallback((notification) => {
// // // //     console.log('Showing toast notification:', notification);
    
// // // //     try {
// // // //       const NotificationContent = () => (
// // // //         <div className="flex items-start gap-3">
// // // //           <div 
// // // //             className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
// // // //             style={{ backgroundColor: notification.backgroundColor || '#E5E7EB' }}
// // // //           >
// // // //             {notification.initials}
// // // //           </div>
// // // //           <div>
// // // //             <p className="font-medium">{notification.title || 'New notification'}</p>
// // // //             <p className="text-sm">
// // // //               <span className="font-medium">{notification.name}</span>{' '}
// // // //               <span>{notification.action}</span>
// // // //               {notification.target && <span> {notification.target}</span>}
// // // //             </p>
// // // //           </div>
// // // //         </div>
// // // //       );
      
// // // //       // For react-toastify v10.0.5, use the correct API for transitions
// // // //       toast(<NotificationContent />, {
// // // //         position: "top-left",
// // // //         autoClose: 5000,
// // // //         hideProgressBar: false,
// // // //         closeOnClick: true,
// // // //         pauseOnHover: true,
// // // //         draggable: true,
// // // //         theme: "light",
// // // //         onClick: () => {
// // // //           // Open notification sidebar when toast is clicked
// // // //           setIsOpen(true);
// // // //         }
// // // //       });
// // // //     } catch (error) {
// // // //       console.error('Error showing toast notification:', error);
      
// // // //       // Try a basic toast as fallback
// // // //       try {
// // // //         toast.info(`${notification.title || 'New notification'}: ${notification.name} ${notification.action} ${notification.target || ''}`, {
// // // //           position: "top-left",
// // // //           autoClose: 5000
// // // //         });
// // // //       } catch (fallbackError) {
// // // //         console.error('Fallback toast also failed:', fallbackError);
// // // //       }
// // // //     }
// // // //   }, []);

// // // //   // Enhanced function to process notifications from Firestore and show toast notifications
// // // //   const loadAndProcessFirestoreNotifications = useCallback(() => {
// // // //     console.log('Loading and processing all Firestore notifications');
    
// // // //     // Clean up any existing subscription
// // // //     if (firestoreUnsubscribeRef.current) {
// // // //       firestoreUnsubscribeRef.current();
// // // //       firestoreUnsubscribeRef.current = null;
// // // //     }
    
// // // //     // Query for all notifications, including fallback ones
// // // //     const q = query(
// // // //       collection(db, 'notifications'),
// // // //       where('recipient', '==', 'dashboard'),
// // // //       orderBy('timestamp', 'desc'),
// // // //       limit(50)
// // // //     );
    
// // // //     try {
// // // //       const unsubscribe = onSnapshot(q, (snapshot) => {
// // // //         const newNotifications = [];
// // // //         const processedIds = new Set(); // Track IDs to prevent duplicates
        
// // // //         // Process all notifications
// // // //         snapshot.docChanges().forEach(async (change) => {
// // // //           // Only process new notifications
// // // //           if (change.type === 'added') {
// // // //             const notification = {
// // // //               id: change.doc.id,
// // // //               ...change.doc.data()
// // // //             };
            
// // // //             // Skip duplicates
// // // //             if (processedIds.has(notification.id)) return;
// // // //             processedIds.add(notification.id);
            
// // // //             // Process any new notification that hasn't been read yet
// // // //             if (!notification.read) {
// // // //               console.log('Found new unread notification:', notification.id);
              
// // // //               if (!isDuplicate(notification)) {
// // // //                 // Format and show toast
// // // //                 const formattedNotification = formatNotification(notification);
                
// // // //                 // Show toast notification for ALL unread notifications from Firestore
// // // //                 console.log('Showing toast for notification');
// // // //                 showToastNotification(formattedNotification);
                
// // // //                 // Play notification sound
// // // //                 try {
// // // //                   const audio = new Audio('/notification-sound.mp3');
// // // //                   audio.play().catch(e => console.error('Error playing sound:', e));
// // // //                 } catch (error) {
// // // //                   console.error('Error playing notification sound:', error);
// // // //                 }
                
// // // //                 // Mark as processed if it's a fallback notification
// // // //                 if (notification.sentVia === 'fallback' && notification.processed !== true) {
// // // //                   try {
// // // //                     await updateDoc(doc(db, 'notifications', notification.id), {
// // // //                       processed: true
// // // //                     });
// // // //                     console.log('Marked notification as processed:', notification.id);
// // // //                   } catch (error) {
// // // //                     console.error('Error marking notification as processed:', error);
// // // //                   }
// // // //                 }
// // // //               }
// // // //             }
            
// // // //             // Add to list for state update
// // // //             newNotifications.push(notification);
// // // //           }
// // // //         });
        
// // // //         // Format and update state - MAINTAIN ALL NOTIFICATIONS
// // // //         const formattedNotifications = newNotifications.map(formatNotification);
        
// // // //         // Update state with all notifications
// // // //         setNotifications(prevNotifications => {
// // // //           // Combine new notifications with existing ones
// // // //           const allNotificationIds = new Set([
// // // //             ...prevNotifications.map(n => n.id),
// // // //             ...formattedNotifications.map(n => n.id)
// // // //           ]);
          
// // // //           // Create combined array, prioritizing existing notifications
// // // //           // to preserve any UI state (like read status)
// // // //           const combinedNotifications = [...prevNotifications];
          
// // // //           // Add any new notifications that aren't already in the array
// // // //           formattedNotifications.forEach(notification => {
// // // //             if (!prevNotifications.some(n => n.id === notification.id)) {
// // // //               combinedNotifications.push(notification);
// // // //             }
// // // //           });
          
// // // //           console.log(`Total notifications after processing: ${combinedNotifications.length}`);
          
// // // //           // Sort notifications to ensure newest are at the top
// // // //           return combinedNotifications.sort((a, b) => {
// // // //             // First sort by read status (unread first)
// // // //             if (!a.read && b.read) return -1;
// // // //             if (a.read && !b.read) return 1;
            
// // // //             // Then by timestamp (most recent first)
// // // //             const aTime = a.receivedAt || 0;
// // // //             const bTime = b.receivedAt || 0;
// // // //             return bTime - aTime;
// // // //           });
// // // //         });
        
// // // //         // Update unread count
// // // //         setUnreadCount(prevCount => {
// // // //           const unreadCount = formattedNotifications.filter(n => !n.read).length;
// // // //           console.log(`Unread notifications count: ${unreadCount}`);
// // // //           return unreadCount;
// // // //         });
// // // //       }, (error) => {
// // // //         console.error('Error loading Firestore notifications:', error);
// // // //       });
      
// // // //       firestoreUnsubscribeRef.current = unsubscribe;
// // // //       return unsubscribe;
// // // //     } catch (error) {
// // // //       console.error('Error setting up Firestore listener:', error);
// // // //       return () => {};
// // // //     }
// // // //   }, [db, formatNotification, showToastNotification, isDuplicate]);

// // // //   // Initialize WebSocket connection
// // // //   useEffect(() => {
// // // //     let socketInitialized = false;
// // // //     let cleanup = null;
    
// // // //     const connectSocket = async () => {
// // // //       if (socketInitialized) return;
// // // //       socketInitialized = true;
      
// // // //       try {
// // // //         const auth = getAuth();
// // // //         const user = auth.currentUser;
        
// // // //         if (!user) {
// // // //           console.log('No user signed in, using Firestore fallback');
// // // //           const unsubscribe = loadAndProcessFirestoreNotifications();
// // // //           return () => unsubscribe();
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
            
// // // //             // Use Firestore as fallback
// // // //             loadAndProcessFirestoreNotifications();
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
          
// // // //           // Skip if it's a duplicate notification
// // // //           if (isDuplicate(notification)) {
// // // //             return;
// // // //           }
          
// // // //           // Save to Firestore to ensure persistence
// // // //           try {
// // // //             // Use the notification ID if available, otherwise Firestore will generate one
// // // //             const notificationRef = notification.id 
// // // //               ? doc(db, 'notifications', notification.id)
// // // //               : doc(collection(db, 'notifications'));
            
// // // //             // If notification has an ID, update the document
// // // //             if (notification.id) {
// // // //               updateDoc(notificationRef, {
// // // //                 ...notification,
// // // //                 recipient: 'dashboard',
// // // //                 receivedAt: new Date(),
// // // //                 processed: true
// // // //               }).catch(error => {
// // // //                 console.error('Error updating notification in Firestore:', error);
// // // //               });
// // // //             } 
// // // //             // Otherwise, create a new document
// // // //             else {
// // // //               const newNotificationId = notificationRef.id;
// // // //               notification.id = newNotificationId;
              
// // // //               // Use setDoc since we already have a reference with ID
// // // //               import('firebase/firestore').then(({ setDoc }) => {
// // // //                 setDoc(notificationRef, {
// // // //                   ...notification,
// // // //                   recipient: 'dashboard',
// // // //                   receivedAt: new Date(),
// // // //                   processed: true
// // // //                 }).catch(error => {
// // // //                   console.error('Error saving notification to Firestore:', error);
// // // //                 });
// // // //               });
// // // //             }
// // // //           } catch (error) {
// // // //             console.error('Error saving notification to Firestore:', error);
// // // //           }
          
// // // //           const formattedNotification = formatNotification(notification);
          
// // // //           // Add to notifications list
// // // //           setNotifications(prev => {
// // // //             // Check if notification already exists
// // // //             const exists = prev.some(n => n.id === formattedNotification.id);
// // // //             if (exists) return prev;
            
// // // //             // Add new notification at the top of the list
// // // //             const updatedNotifications = [formattedNotification, ...prev];
            
// // // //             // Sort notifications to ensure proper order
// // // //             return updatedNotifications.sort((a, b) => {
// // // //               // Unread notifications first
// // // //               if (!a.read && b.read) return -1;
// // // //               if (a.read && !b.read) return 1;
              
// // // //               // Then by timestamp
// // // //               const aTime = a.receivedAt || 0;
// // // //               const bTime = b.receivedAt || 0;
// // // //               return bTime - aTime;
// // // //             });
// // // //           });
          
// // // //           if (!notification.read) {
// // // //             setUnreadCount(prev => prev + 1);
            
// // // //             // Show toast notification
// // // //             showToastNotification(formattedNotification);
            
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
        
// // // //         return () => {
// // // //           newSocket.disconnect();
// // // //         };
// // // //       } catch (error) {
// // // //         console.error('Error setting up WebSocket:', error);
        
// // // //         // Use Firestore as fallback
// // // //         const unsubscribe = loadAndProcessFirestoreNotifications();
// // // //         return () => unsubscribe();
// // // //       }
// // // //     };
    
// // // //     cleanup = connectSocket();
    
// // // //     return () => {
// // // //       if (typeof cleanup === 'function') {
// // // //         cleanup();
// // // //       }
      
// // // //       if (socket) {
// // // //         socket.disconnect();
// // // //         setSocket(null);
// // // //       }
// // // //     };
// // // //   }, [loadAndProcessFirestoreNotifications, formatNotification, showToastNotification, isDuplicate]);
  
// // // //   // Also load fallback notifications specifically when component mounts
// // // //   useEffect(() => {
// // // //     console.log('Initial load of notifications, including fallback');
// // // //     const unsubscribe = loadAndProcessFirestoreNotifications();
    
// // // //     return () => {
// // // //       if (typeof unsubscribe === 'function') {
// // // //         unsubscribe();
// // // //       }
// // // //     };
// // // //   }, [loadAndProcessFirestoreNotifications]);
  
// // // //   // Use Firestore as fallback if WebSocket fails
// // // //   useEffect(() => {
// // // //     // If we've tried to connect and failed, or if we're not connected after attempting,
// // // //     // use Firestore as fallback
// // // //     if (connectionAttempts >= 2 || (!connected && connectionAttempts > 0)) {
// // // //       loadAndProcessFirestoreNotifications();
// // // //     }
    
// // // //     return () => {
// // // //       if (firestoreUnsubscribeRef.current) {
// // // //         firestoreUnsubscribeRef.current();
// // // //       }
// // // //     };
// // // //   }, [connectionAttempts, connected, loadAndProcessFirestoreNotifications]);
  
// // // //   // Mark notification as read
// // // //   const markAsRead = useCallback((notificationId) => {
// // // //     if (!notificationId) return;
    
// // // //     // Always update in Firestore to ensure persistence across page refreshes
// // // //     try {
// // // //       updateDoc(doc(db, 'notifications', notificationId), {
// // // //         read: true,
// // // //         lastReadAt: new Date() // Add timestamp when it was read
// // // //       });
// // // //       console.log('Marked notification as read in Firestore:', notificationId);
// // // //     } catch (error) {
// // // //       console.error('Error marking notification as read in Firestore:', error);
// // // //     }
    
// // // //     // Also update via WebSocket if connected
// // // //     if (connected && socket) {
// // // //       socket.emit('mark-read', { notificationId });
// // // //       console.log('Sent mark-read event to WebSocket for:', notificationId);
// // // //     }
    
// // // //     // Optimistically update UI - Don't remove the notification, just mark it as read
// // // //     setNotifications(prev => {
// // // //       const updated = prev.map(n => 
// // // //         n.id === notificationId ? { ...n, read: true } : n
// // // //       );
      
// // // //       // Re-sort to maintain order (unread first, then by time)
// // // //       return updated.sort((a, b) => {
// // // //         if (!a.read && b.read) return -1;
// // // //         if (a.read && !b.read) return 1;
// // // //         const aTime = a.receivedAt || 0;
// // // //         const bTime = b.receivedAt || 0;
// // // //         return bTime - aTime;
// // // //       });
// // // //     });
    
// // // //     setUnreadCount(prev => Math.max(0, prev - 1));
// // // //   }, [connected, socket, db]);
  
// // // //   // Mark all notifications as read
// // // //   const markAllAsRead = useCallback(() => {
// // // //     // Get all unread notification IDs
// // // //     const unreadIds = notifications
// // // //       .filter(n => !n.read)
// // // //       .map(n => n.id);
    
// // // //     if (unreadIds.length === 0) return;
    
// // // //     // Mark each as read in Firestore for persistence
// // // //     unreadIds.forEach(id => {
// // // //       try {
// // // //         updateDoc(doc(db, 'notifications', id), {
// // // //           read: true,
// // // //           lastReadAt: new Date()
// // // //         }).catch(error => {
// // // //           console.error('Error marking notification as read in Firestore:', error);
// // // //         });
        
// // // //         // Also update via WebSocket if connected
// // // //         if (connected && socket) {
// // // //           socket.emit('mark-read', { notificationId: id });
// // // //         }
// // // //       } catch (error) {
// // // //         console.error('Error marking notification as read:', error);
// // // //       }
// // // //     });
    
// // // //     // Optimistically update UI - Don't remove the notifications, just mark them as read
// // // //     const updatedNotifications = notifications.map(n => ({ 
// // // //       ...n, 
// // // //       read: true 
// // // //     }));
    
// // // //     // Set notifications without changing their order
// // // //     setNotifications(updatedNotifications);
// // // //     setUnreadCount(0);
    
// // // //     console.log('Marked all notifications as read. Total notifications still showing:', updatedNotifications.length);
// // // //   }, [notifications, connected, socket, db]);

// // // //   // Clear all notifications
// // // //   const clearAllNotifications = useCallback(async () => {
// // // //     if (notifications.length === 0) return;
    
// // // //     try {
// // // //       // Delete all notifications from Firestore
// // // //       const deletePromises = notifications.map(notification => 
// // // //         deleteDoc(doc(db, 'notifications', notification.id))
// // // //       );
      
// // // //       await Promise.all(deletePromises);
      
// // // //       // Clear notifications from state
// // // //       setNotifications([]);
// // // //       setUnreadCount(0);
// // // //     } catch (error) {
// // // //       console.error('Error clearing notifications:', error);
// // // //     }
// // // //   }, [notifications, db]);
  
// // // //   // Toggle sidebar
// // // //   const toggleSidebar = useCallback(() => {
// // // //     setIsOpen(prev => !prev);
// // // //   }, []);
  
// // // //   // Close sidebar
// // // //   const closeSidebar = useCallback(() => {
// // // //     setIsOpen(false);
// // // //   }, []);
  
// // // //   // Open sidebar
// // // //   const openSidebar = useCallback(() => {
// // // //     setIsOpen(true);
// // // //   }, []);
  
// // // //   // Context value
// // // //   const value = {
// // // //     notifications,
// // // //     unreadCount,
// // // //     isOpen,
// // // //     markAsRead,
// // // //     markAllAsRead,
// // // //     clearAllNotifications,
// // // //     toggleSidebar,
// // // //     closeSidebar,
// // // //     openSidebar,
// // // //     connected,
// // // //     showToastNotification // Expose for testing
// // // //   };
  
// // // //   return (
// // // //     <NotificationContext.Provider value={value}>
// // // //       {children}
// // // //       <ToastContainer
// // // //         position="top-left"
// // // //         // position="top-center"  // Change position to top-center
// // // //         autoClose={5000}
// // // //         hideProgressBar={false}
// // // //         newestOnTop
// // // //         closeOnClick
// // // //         rtl={false}
// // // //         pauseOnFocusLoss
// // // //         draggable
// // // //         pauseOnHover
// // // //         theme="light"
// // // //         style={{ zIndex: 9999 }} // Ensure high z-index
// // // //       />
// // // //     </NotificationContext.Provider>
// // // //   );
// // // // };

// // // // export default NotificationContext;

// // // import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
// // // import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, getFirestore, limit, deleteDoc } from 'firebase/firestore';
// // // import { getAuth } from 'firebase/auth';
// // // import io from 'socket.io-client';
// // // import { toast, ToastContainer } from 'react-toastify';
// // // import 'react-toastify/dist/ReactToastify.css';

// // // // Create the context
// // // const NotificationContext = createContext();

// // // // Server URLs for different environments
// // // const PRODUCTION_URL = 'https://puriserver.onrender.com';
// // // const DEVELOPMENT_URL = 'http://localhost:5000';
// // // const SERVER_URL = process.env.NODE_ENV === 'production' ? PRODUCTION_URL : DEVELOPMENT_URL;

// // // export const useNotifications = () => useContext(NotificationContext);

// // // export const NotificationProvider = ({ children }) => {
// // //   const [notifications, setNotifications] = useState([]);
// // //   const [unreadCount, setUnreadCount] = useState(0);
// // //   const [isOpen, setIsOpen] = useState(false);
// // //   const [socket, setSocket] = useState(null);
// // //   const [connected, setConnected] = useState(false);
// // //   const [connectionAttempts, setConnectionAttempts] = useState(0);
// // //   const db = getFirestore();
// // //   const firestoreUnsubscribeRef = useRef(null);
// // //   const recentNotificationsRef = useRef(new Map()); // Track recently processed notifications



// // //   useEffect(() => {
// // //   const unreadCount = notifications.filter(n => !n.read).length;
// // //   console.log(`Notifications changed, unread count: ${unreadCount}`);
// // //   setUnreadCount(unreadCount);
// // // }, [notifications]);

// // //   // Format notification data
// // //   const formatNotification = useCallback((notification) => {
// // //     let action = "has sent a notification";
// // //     let target = "";
// // //     let name = notification.senderName || "User";
// // //     let initials = name.split(' ').map(n => n[0]).join('');
// // //     let backgroundColor = '#E5E7EB'; // Default gray
    
// // //     // Handle different notification types
// // //     if (notification.type === 'support') {
// // //       action = "has raised a support ticket";
// // //       target = notification.data?.category ? `for ${notification.data.category}` : "";
// // //       backgroundColor = '#FEE2E2'; // Light red for support tickets
      
// // //       if (!notification.senderName && notification.data?.phoneNumber) {
// // //         name = notification.data.phoneNumber;
// // //         initials = 'U';
// // //       }
      
// // //       if (!notification.senderName && notification.senderPhone) {
// // //         name = notification.senderPhone;
// // //         initials = 'U';
// // //       }
// // //     } 
// // //     // Handle property listing notifications
// // //     else if (notification.type === 'putOnRent') {
// // //       action = "has requested to list a property";
// // //       target = notification.data?.flatId ? `for flat ID ${notification.data.flatId}` : "";
// // //       backgroundColor = '#DBEAFE'; // Light blue for property listing
      
// // //       if (!notification.senderName && notification.data?.phoneNumber) {
// // //         name = notification.data.phoneNumber;
// // //         initials = 'P';
// // //       }
      
// // //       if (!notification.senderName && notification.senderPhone) {
// // //         name = notification.senderPhone;
// // //         initials = 'P';
// // //       }
// // //     }
// // //     // Handle property search notifications
// // //     else if (notification.type === 'needOnRent') {
// // //       action = "has requested to find a property";
// // //       target = notification.data?.bhkType ? `(${notification.data.bhkType})` : "";
// // //       backgroundColor = '#D1FAE5'; // Light green for property search
      
// // //       if (!notification.senderName && notification.data?.phoneNumber) {
// // //         name = notification.data.phoneNumber;
// // //         initials = 'R';
// // //       }
      
// // //       if (!notification.senderName && notification.senderPhone) {
// // //         name = notification.senderPhone;
// // //         initials = 'R';
// // //       }
// // //     }
    
// // //     // Format time - Fixed to handle various timestamp formats
// // //     let time;
// // //     if (notification.timestamp) {
// // //       try {
// // //         // Handle Firebase timestamp object (has toDate method)
// // //         if (notification.timestamp.toDate) {
// // //           time = formatTimeAgo(notification.timestamp.toDate());
// // //         } 
// // //         // Handle ISO string timestamp
// // //         else if (typeof notification.timestamp === 'string') {
// // //           time = formatTimeAgo(new Date(notification.timestamp));
// // //         } 
// // //         // Handle timestamp number/seconds
// // //         else if (typeof notification.timestamp === 'number') {
// // //           // Check if this is seconds (Firebase timestamp) or milliseconds
// // //           const date = notification.timestamp > 9999999999
// // //             ? new Date(notification.timestamp) // milliseconds
// // //             : new Date(notification.timestamp * 1000); // seconds
// // //           time = formatTimeAgo(date);
// // //         }
// // //         // If none of these, fallback
// // //         else {
// // //           time = 'Recent';
// // //         }
// // //       } catch (err) {
// // //         console.error('Error formatting timestamp:', err, notification.timestamp);
// // //         time = 'Recent';
// // //       }
// // //     } else {
// // //       time = 'Recent';
// // //     }
    
// // //     return {
// // //       id: notification.id,
// // //       name,
// // //       action,
// // //       target,
// // //       time,
// // //       initials,
// // //       backgroundColor,
// // //       read: notification.read || false,
// // //       data: notification.data,
// // //       type: notification.type,
// // //       title: notification.title || `New ${notification.type || 'notification'}`,
// // //       receivedAt: Date.now() // Add timestamp when this notification was processed
// // //     };
// // //   }, []);

// // //   // Helper function to format time ago
// // //   const formatTimeAgo = (date) => {
// // //     if (!(date instanceof Date) || isNaN(date.getTime())) {
// // //       console.warn('Invalid date provided to formatTimeAgo', date);
// // //       return 'Recent';
// // //     }
    
// // //     const now = new Date();
// // //     const diffMs = now - date;
// // //     const diffMins = Math.floor(diffMs / 60000);
// // //     const diffHours = Math.floor(diffMins / 60);
// // //     const diffDays = Math.floor(diffHours / 24);
    
// // //     if (diffMins < 1) {
// // //       return 'Just now';
// // //     } else if (diffMins < 60) {
// // //       return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
// // //     } else if (diffHours < 24) {
// // //       return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
// // //     } else if (diffDays < 7) {
// // //       return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
// // //     } else {
// // //       return date.toLocaleDateString();
// // //     }
// // //   };

// // //   // Check if notification is a duplicate
// // //   const isDuplicate = useCallback((notification) => {
// // //     const signature = `${notification.type || ''}-${notification.senderName || ''}-${notification.data?.ticketId || ''}`;
// // //     const now = Date.now();
// // //     const DEDUPLICATION_WINDOW = 10000; // 10 seconds
    
// // //     if (recentNotificationsRef.current.has(signature)) {
// // //       const lastSeen = recentNotificationsRef.current.get(signature);
// // //       if (now - lastSeen < DEDUPLICATION_WINDOW) {
// // //         console.log('Duplicate notification prevented:', signature);
// // //         return true;
// // //       }
// // //     }
    
// // //     // Update record
// // //     recentNotificationsRef.current.set(signature, now);
    
// // //     // Clean up old entries
// // //     for (const [key, timestamp] of recentNotificationsRef.current.entries()) {
// // //       if (now - timestamp > DEDUPLICATION_WINDOW) {
// // //         recentNotificationsRef.current.delete(key);
// // //       }
// // //     }
    
// // //     return false;
// // //   }, []);

// // //   // Load notifications from Firestore
// // //   const loadFirestoreNotifications = useCallback(() => {
// // //     console.log('Loading notifications from Firestore');
    
// // //     // Clean up any existing subscription
// // //     if (firestoreUnsubscribeRef.current) {
// // //       firestoreUnsubscribeRef.current();
// // //       firestoreUnsubscribeRef.current = null;
// // //     }
    
// // //     const q = query(
// // //       collection(db, 'notifications'),
// // //       where('recipient', '==', 'dashboard'),
// // //       orderBy('timestamp', 'desc'), // Most recent notifications first
// // //       limit(50)
// // //     );
    
// // //     try {
// // //       const unsubscribe = onSnapshot(q, (snapshot) => {
// // //         const newNotifications = [];
// // //         const processedIds = new Set(); // Track IDs to prevent duplicates
        
// // //         snapshot.forEach(doc => {
// // //           const notificationId = doc.id;
          
// // //           // Skip if we've already processed this ID
// // //           if (processedIds.has(notificationId)) return;
          
// // //           // Add ID to processed set
// // //           processedIds.add(notificationId);
          
// // //           // Get notification data with the read status from Firestore
// // //           // to ensure we respect the persistent read status
// // //           const notificationData = doc.data();
          
// // //           newNotifications.push({
// // //             id: notificationId,
// // //             ...notificationData
// // //           });
// // //         });
        
// // //         const formattedNotifications = newNotifications.map(formatNotification);
        
// // //         // Sort notifications to ensure newest are at the top
// // //         formattedNotifications.sort((a, b) => {
// // //           // First sort by read status (unread first)
// // //           if (!a.read && b.read) return -1;
// // //           if (a.read && !b.read) return 1;
          
// // //           // Then by timestamp (most recent first)
// // //           // Use receivedAt as a fallback for consistent sorting
// // //           const aTime = a.receivedAt || 0;
// // //           const bTime = b.receivedAt || 0;
// // //           return bTime - aTime;
// // //         });
        
// // //         setNotifications(formattedNotifications);
// // //         setUnreadCount(formattedNotifications.filter(n => !n.read).length);
// // //       }, (error) => {
// // //         console.error('Error loading Firestore notifications:', error);
// // //       });
      
// // //       firestoreUnsubscribeRef.current = unsubscribe;
// // //       return unsubscribe;
// // //     } catch (error) {
// // //       console.error('Error setting up Firestore listener:', error);
// // //       return () => {};
// // //     }
// // //   }, [db, formatNotification]);

// // //   // Show toast notification - Left-to-right animation (react-toastify v10.0.5)
// // //   const showToastNotification = useCallback((notification) => {
// // //     console.log('Showing toast notification:', notification);
    
// // //     try {
// // //       const NotificationContent = () => (
// // //         <div className="flex items-start gap-3">
// // //           <div 
// // //             className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
// // //             style={{ backgroundColor: notification.backgroundColor || '#E5E7EB' }}
// // //           >
// // //             {notification.initials}
// // //           </div>
// // //           <div>
// // //             <p className="font-medium">{notification.title || 'New notification'}</p>
// // //             <p className="text-sm">
// // //               <span className="font-medium">{notification.name}</span>{' '}
// // //               <span>{notification.action}</span>
// // //               {notification.target && <span> {notification.target}</span>}
// // //             </p>
// // //           </div>
// // //         </div>
// // //       );
      
// // //       // For react-toastify v10.0.5, use the correct API for transitions
// // //       toast(<NotificationContent />, {
// // //         position: "top-left",
// // //         autoClose: 5000,
// // //         hideProgressBar: false,
// // //         closeOnClick: true,
// // //         pauseOnHover: true,
// // //         draggable: true,
// // //         theme: "light",
// // //         onClick: () => {
// // //           // Open notification sidebar when toast is clicked
// // //           setIsOpen(true);
// // //         }
// // //       });
// // //     } catch (error) {
// // //       console.error('Error showing toast notification:', error);
      
// // //       // Try a basic toast as fallback
// // //       try {
// // //         toast.info(`${notification.title || 'New notification'}: ${notification.name} ${notification.action} ${notification.target || ''}`, {
// // //           position: "top-left",
// // //           autoClose: 5000
// // //         });
// // //       } catch (fallbackError) {
// // //         console.error('Fallback toast also failed:', fallbackError);
// // //       }
// // //     }
// // //   }, []);

// // //   // Enhanced function to process notifications from Firestore and show toast notifications
// // //   // Enhanced function to process notifications from Firestore and show toast notifications
// // // const loadAndProcessFirestoreNotifications = useCallback(() => {
// // //     console.log('Loading and processing all Firestore notifications');
    
// // //     // Clean up any existing subscription
// // //     if (firestoreUnsubscribeRef.current) {
// // //       firestoreUnsubscribeRef.current();
// // //       firestoreUnsubscribeRef.current = null;
// // //     }
    
// // //     // Query for all notifications, including fallback ones
// // //     const q = query(
// // //       collection(db, 'notifications'),
// // //       where('recipient', '==', 'dashboard'),
// // //       orderBy('timestamp', 'desc'),
// // //       limit(50)
// // //     );
    
// // //     try {
// // //       const unsubscribe = onSnapshot(q, (snapshot) => {
// // //         const newNotifications = [];
// // //         const processedIds = new Set(); // Track IDs to prevent duplicates
// // //         let pendingIncrements = 0; // Track new unread notifications for badge count
        
// // //         // Process all notifications
// // //         snapshot.docChanges().forEach(async (change) => {
// // //           // Only process new notifications
// // //           if (change.type === 'added') {
// // //             const notification = {
// // //               id: change.doc.id,
// // //               ...change.doc.data()
// // //             };
            
// // //             // Skip duplicates
// // //             if (processedIds.has(notification.id)) return;
// // //             processedIds.add(notification.id);
            
// // //             // Process any new notification that hasn't been read yet
// // //             if (!notification.read) {
// // //               pendingIncrements++; // Count this unread notification
// // //               console.log('Found new unread notification:', notification.id);
              
// // //               if (!isDuplicate(notification)) {
// // //                 // Format and show toast
// // //                 const formattedNotification = formatNotification(notification);
                
// // //                 // Show toast notification for ALL unread notifications from Firestore
// // //                 console.log('Showing toast for notification');
// // //                 showToastNotification(formattedNotification);
                
// // //                 // Play notification sound
// // //                 try {
// // //                   const audio = new Audio('/notification-sound.mp3');
// // //                   audio.play().catch(e => console.error('Error playing sound:', e));
// // //                 } catch (error) {
// // //                   console.error('Error playing notification sound:', error);
// // //                 }
                
// // //                 // Mark as processed if it's a fallback notification
// // //                 if (notification.sentVia === 'fallback' && notification.processed !== true) {
// // //                   try {
// // //                     await updateDoc(doc(db, 'notifications', notification.id), {
// // //                       processed: true
// // //                     });
// // //                     console.log('Marked notification as processed:', notification.id);
// // //                   } catch (error) {
// // //                     console.error('Error marking notification as processed:', error);
// // //                   }
// // //                 }
// // //               }
// // //             }
            
// // //             // Add to list for state update
// // //             newNotifications.push(notification);
// // //           }
// // //         });
        
// // //         // Format and update state - MAINTAIN ALL NOTIFICATIONS
// // //         const formattedNotifications = newNotifications.map(formatNotification);
        
// // //         // Update state with all notifications
// // //         setNotifications(prevNotifications => {
// // //           // Combine new notifications with existing ones
// // //           const allNotificationIds = new Set([
// // //             ...prevNotifications.map(n => n.id),
// // //             ...formattedNotifications.map(n => n.id)
// // //           ]);
          
// // //           // Create combined array, prioritizing existing notifications
// // //           // to preserve any UI state (like read status)
// // //           const combinedNotifications = [...prevNotifications];
          
// // //           // Add any new notifications that aren't already in the array
// // //           formattedNotifications.forEach(notification => {
// // //             if (!prevNotifications.some(n => n.id === notification.id)) {
// // //               combinedNotifications.push(notification);
// // //             }
// // //           });
          
// // //           console.log(`Total notifications after processing: ${combinedNotifications.length}`);
          
// // //           // Sort notifications to ensure newest are at the top
// // //           return combinedNotifications.sort((a, b) => {
// // //             // First sort by read status (unread first)
// // //             if (!a.read && b.read) return -1;
// // //             if (a.read && !b.read) return 1;
            
// // //             // Then by timestamp (most recent first)
// // //             const aTime = a.receivedAt || 0;
// // //             const bTime = b.receivedAt || 0;
// // //             return bTime - aTime;
// // //           });
// // //         });
        
// // //         // Calculate total unread count from ALL notifications
// // //         const combinedNotifications = [...newNotifications];
// // //         const totalUnreadCount = combinedNotifications.filter(n => !n.read).length;
        
// // //         // Update unread count directly with the total, not incrementally
// // //         setUnreadCount(totalUnreadCount);
// // //         console.log(`Total unread notifications count: ${totalUnreadCount}`);
// // //       }, (error) => {
// // //         console.error('Error loading Firestore notifications:', error);
// // //       });
      
// // //       firestoreUnsubscribeRef.current = unsubscribe;
// // //       return unsubscribe;
// // //     } catch (error) {
// // //       console.error('Error setting up Firestore listener:', error);
// // //       return () => {};
// // //     }
// // //   }, [db, formatNotification, showToastNotification, isDuplicate]);

// // //   // Initialize WebSocket connection
// // //   useEffect(() => {
// // //     let socketInitialized = false;
// // //     let cleanup = null;
    
// // //     const connectSocket = async () => {
// // //       if (socketInitialized) return;
// // //       socketInitialized = true;
      
// // //       try {
// // //         const auth = getAuth();
// // //         const user = auth.currentUser;
        
// // //         if (!user) {
// // //           console.log('No user signed in, using Firestore fallback');
// // //           const unsubscribe = loadAndProcessFirestoreNotifications();
// // //           return () => unsubscribe();
// // //         }
        
// // //         // Get token for authentication
// // //         const token = await user.getIdToken();
        
// // //         // Initialize socket
// // //         console.log(`Connecting to notification server: ${SERVER_URL}`);
// // //         const newSocket = io(SERVER_URL, {
// // //           transports: ['websocket'],
// // //           timeout: 10000,
// // //           reconnection: true,
// // //           reconnectionAttempts: 5
// // //         });
        
// // //         setSocket(newSocket);
// // //         setConnectionAttempts(prev => prev + 1);
        
// // //         // Set up event listeners
// // //         newSocket.on('connect', () => {
// // //           console.log('Connected to notification server');
// // //           setConnected(true);
          
// // //           // Authenticate after connection
// // //           newSocket.emit('authenticate', {
// // //             token,
// // //             clientType: 'dashboard'
// // //           });
// // //         });
        
// // //         newSocket.on('disconnect', () => {
// // //           console.log('Disconnected from notification server');
// // //           setConnected(false);
// // //         });
        
// // //         newSocket.on('connect_error', (error) => {
// // //           console.error('Connection error:', error);
// // //           setConnected(false);
// // //           setConnectionAttempts(prev => prev + 1);
// // //         });
        
// // //         newSocket.on('authenticated', (response) => {
// // //           if (response.success) {
// // //             console.log('Successfully authenticated with notification server');
// // //             // Fetch existing notifications
// // //             newSocket.emit('get-notifications', {
// // //               clientType: 'dashboard'
// // //             });
// // //           } else {
// // //             console.error('Authentication failed:', response.error);
            
// // //             // Use Firestore as fallback
// // //             loadAndProcessFirestoreNotifications();
// // //           }
// // //         });
        
// // //         newSocket.on('notifications-list', (data) => {
// // //           if (data.notifications && Array.isArray(data.notifications)) {
// // //             const formattedNotifications = data.notifications.map(formatNotification);
// // //             setNotifications(formattedNotifications);
// // //             setUnreadCount(formattedNotifications.filter(n => !n.read).length);
// // //           }
// // //         });
        
// // //         newSocket.on('new-notification', (notification) => {
// // //             console.log('New notification received:', notification);
            
// // //             // Skip if it's a duplicate notification
// // //             if (isDuplicate(notification)) {
// // //               return;
// // //             }
            
// // //             // Save to Firestore to ensure persistence
// // //             try {
// // //               // Use the notification ID if available, otherwise Firestore will generate one
// // //               const notificationRef = notification.id 
// // //                 ? doc(db, 'notifications', notification.id)
// // //                 : doc(collection(db, 'notifications'));
              
// // //               // If notification has an ID, update the document
// // //               if (notification.id) {
// // //                 updateDoc(notificationRef, {
// // //                   ...notification,
// // //                   recipient: 'dashboard',
// // //                   receivedAt: new Date(),
// // //                   processed: true
// // //                 }).catch(error => {
// // //                   console.error('Error updating notification in Firestore:', error);
// // //                 });
// // //               } 
// // //               // Otherwise, create a new document
// // //               else {
// // //                 const newNotificationId = notificationRef.id;
// // //                 notification.id = newNotificationId;
                
// // //                 // Use setDoc since we already have a reference with ID
// // //                 import('firebase/firestore').then(({ setDoc }) => {
// // //                   setDoc(notificationRef, {
// // //                     ...notification,
// // //                     recipient: 'dashboard',
// // //                     receivedAt: new Date(),
// // //                     processed: true
// // //                   }).catch(error => {
// // //                     console.error('Error saving notification to Firestore:', error);
// // //                   });
// // //                 });
// // //               }
// // //             } catch (error) {
// // //               console.error('Error saving notification to Firestore:', error);
// // //             }
            
// // //             const formattedNotification = formatNotification(notification);
  
// // //             // Add to notifications list and recalculate unread count
// // //             setNotifications(prev => {
// // //               // Check if notification already exists
// // //               const exists = prev.some(n => n.id === formattedNotification.id);
// // //               if (exists) return prev;
              
// // //               // Add new notification at the top of the list
// // //               const updatedNotifications = [formattedNotification, ...prev];
              
// // //               // Sort notifications to ensure proper order
// // //               return updatedNotifications.sort((a, b) => {
// // //                 // Unread notifications first
// // //                 if (!a.read && b.read) return -1;
// // //                 if (a.read && !b.read) return 1;
                
// // //                 // Then by timestamp
// // //                 const aTime = a.receivedAt || 0;
// // //                 const bTime = b.receivedAt || 0;
// // //                 return bTime - aTime;
// // //               });
// // //             });
            
// // //             // Separate operation to recalculate the unread count
// // //             if (!notification.read) {
// // //               // Using setTimeout to ensure this happens after state updates
// // //               setTimeout(() => {
// // //                 setNotifications(currentNotifications => {
// // //                   // Calculate total unread correctly from current state
// // //                   const totalUnread = currentNotifications.filter(n => !n.read).length;
// // //                   console.log('Recalculating unread count, found:', totalUnread);
                  
// // //                   // Update the unread count directly
// // //                   setUnreadCount(totalUnread);
                  
// // //                   // Return unchanged notifications
// // //                   return currentNotifications;
// // //                 });
// // //               }, 100);
              
// // //               // Show toast notification
// // //               showToastNotification(formattedNotification);
              
// // //               // Play notification sound
// // //               try {
// // //                 const audio = new Audio('/notification-sound.mp3');
// // //                 audio.play().catch(e => console.error('Error playing sound:', e));
// // //               } catch (error) {
// // //                 console.error('Error playing notification sound:', error);
// // //               }
// // //             }
// // //           });
        
// // //         newSocket.on('notification-updated', (data) => {
// // //           if (data.success && data.id) {
// // //             setNotifications(prev => 
// // //               prev.map(n => 
// // //                 n.id === data.id ? { ...n, read: true } : n
// // //               )
// // //             );
// // //             setUnreadCount(prev => Math.max(0, prev - 1));
// // //           }
// // //         });
        
// // //         newSocket.on('error', (error) => {
// // //           console.error('Socket error:', error);
// // //         });
        
// // //         return () => {
// // //           newSocket.disconnect();
// // //         };
// // //       } catch (error) {
// // //         console.error('Error setting up WebSocket:', error);
        
// // //         // Use Firestore as fallback
// // //         const unsubscribe = loadAndProcessFirestoreNotifications();
// // //         return () => unsubscribe();
// // //       }
// // //     };
    
// // //     cleanup = connectSocket();
    
// // //     return () => {
// // //       if (typeof cleanup === 'function') {
// // //         cleanup();
// // //       }
      
// // //       if (socket) {
// // //         socket.disconnect();
// // //         setSocket(null);
// // //       }
// // //     };
// // //   }, [loadAndProcessFirestoreNotifications, formatNotification, showToastNotification, isDuplicate]);
  
// // //   // Also load fallback notifications specifically when component mounts
// // //   useEffect(() => {
// // //     console.log('Initial load of notifications, including fallback');
// // //     const unsubscribe = loadAndProcessFirestoreNotifications();
    
// // //     return () => {
// // //       if (typeof unsubscribe === 'function') {
// // //         unsubscribe();
// // //       }
// // //     };
// // //   }, [loadAndProcessFirestoreNotifications]);
  
// // //   // Use Firestore as fallback if WebSocket fails
// // //   useEffect(() => {
// // //     // If we've tried to connect and failed, or if we're not connected after attempting,
// // //     // use Firestore as fallback
// // //     if (connectionAttempts >= 2 || (!connected && connectionAttempts > 0)) {
// // //       loadAndProcessFirestoreNotifications();
// // //     }
    
// // //     return () => {
// // //       if (firestoreUnsubscribeRef.current) {
// // //         firestoreUnsubscribeRef.current();
// // //       }
// // //     };
// // //   }, [connectionAttempts, connected, loadAndProcessFirestoreNotifications]);
  
// // //   // Mark notification as read
// // //   const markAsRead = useCallback((notificationId) => {
// // //     if (!notificationId) return;
    
// // //     // Always update in Firestore to ensure persistence across page refreshes
// // //     try {
// // //       updateDoc(doc(db, 'notifications', notificationId), {
// // //         read: true,
// // //         lastReadAt: new Date() // Add timestamp when it was read
// // //       });
// // //       console.log('Marked notification as read in Firestore:', notificationId);
// // //     } catch (error) {
// // //       console.error('Error marking notification as read in Firestore:', error);
// // //     }
    
// // //     // Also update via WebSocket if connected
// // //     if (connected && socket) {
// // //       socket.emit('mark-read', { notificationId });
// // //       console.log('Sent mark-read event to WebSocket for:', notificationId);
// // //     }
    
// // //     // Optimistically update UI - Don't remove the notification, just mark it as read
// // //     setNotifications(prev => {
// // //       const updated = prev.map(n => 
// // //         n.id === notificationId ? { ...n, read: true } : n
// // //       );
      
// // //       // Re-sort to maintain order (unread first, then by time)
// // //       return updated.sort((a, b) => {
// // //         if (!a.read && b.read) return -1;
// // //         if (a.read && !b.read) return 1;
// // //         const aTime = a.receivedAt || 0;
// // //         const bTime = b.receivedAt || 0;
// // //         return bTime - aTime;
// // //       });
// // //     });
    
// // //     setUnreadCount(prev => Math.max(0, prev - 1));
// // //   }, [connected, socket, db]);
  
// // //   // Mark all notifications as read
// // //   const markAllAsRead = useCallback(() => {
// // //     // Get all unread notification IDs
// // //     const unreadIds = notifications
// // //       .filter(n => !n.read)
// // //       .map(n => n.id);
    
// // //     if (unreadIds.length === 0) return;
    
// // //     // Mark each as read in Firestore for persistence
// // //     unreadIds.forEach(id => {
// // //       try {
// // //         updateDoc(doc(db, 'notifications', id), {
// // //           read: true,
// // //           lastReadAt: new Date()
// // //         }).catch(error => {
// // //           console.error('Error marking notification as read in Firestore:', error);
// // //         });
        
// // //         // Also update via WebSocket if connected
// // //         if (connected && socket) {
// // //           socket.emit('mark-read', { notificationId: id });
// // //         }
// // //       } catch (error) {
// // //         console.error('Error marking notification as read:', error);
// // //       }
// // //     });
    
// // //     // Optimistically update UI - Don't remove the notifications, just mark them as read
// // //     const updatedNotifications = notifications.map(n => ({ 
// // //       ...n, 
// // //       read: true 
// // //     }));
    
// // //     // Set notifications without changing their order
// // //     setNotifications(updatedNotifications);
// // //     setUnreadCount(0);
    
// // //     console.log('Marked all notifications as read. Total notifications still showing:', updatedNotifications.length);
// // //   }, [notifications, connected, socket, db]);

// // //   // Clear all notifications
// // //   const clearAllNotifications = useCallback(async () => {
// // //     if (notifications.length === 0) return;
    
// // //     try {
// // //       // Delete all notifications from Firestore
// // //       const deletePromises = notifications.map(notification => 
// // //         deleteDoc(doc(db, 'notifications', notification.id))
// // //       );
      
// // //       await Promise.all(deletePromises);
      
// // //       // Clear notifications from state
// // //       setNotifications([]);
// // //       setUnreadCount(0);
// // //     } catch (error) {
// // //       console.error('Error clearing notifications:', error);
// // //     }
// // //   }, [notifications, db]);
  
// // //   // Toggle sidebar
// // //   const toggleSidebar = useCallback(() => {
// // //     setIsOpen(prev => !prev);
// // //   }, []);
  
// // //   // Close sidebar
// // //   const closeSidebar = useCallback(() => {
// // //     setIsOpen(false);
// // //   }, []);
  
// // //   // Open sidebar
// // //   const openSidebar = useCallback(() => {
// // //     setIsOpen(true);
// // //   }, []);
  
// // //   // Context value
// // //   const value = {
// // //     notifications,
// // //     unreadCount,
// // //     isOpen,
// // //     markAsRead,
// // //     markAllAsRead,
// // //     clearAllNotifications,
// // //     toggleSidebar,
// // //     closeSidebar,
// // //     openSidebar,
// // //     connected,
// // //     showToastNotification // Expose for testing
// // //   };
  
// // //   return (
// // //     <NotificationContext.Provider value={value}>
// // //       {children}
// // //       <ToastContainer
// // //         position="top-left"
// // //         autoClose={5000}
// // //         hideProgressBar={false}
// // //         newestOnTop
// // //         closeOnClick
// // //         rtl={false}
// // //         pauseOnFocusLoss
// // //         draggable
// // //         pauseOnHover
// // //         theme="light"
// // //         style={{ zIndex: 9999 }} // Ensure high z-index
// // //       />
// // //     </NotificationContext.Provider>
// // //   );
// // // };

// // // export default NotificationContext;

// // import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
// // import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, getFirestore, limit, deleteDoc } from 'firebase/firestore';
// // import { getAuth } from 'firebase/auth';
// // import io from 'socket.io-client';
// // import { toast, ToastContainer } from 'react-toastify';
// // import 'react-toastify/dist/ReactToastify.css';

// // // Define a safe toast function that handles version compatibility issues
// // // const safeToast = (content, options) => {
// // //   try {
// // //     // Check if we should show the toast based on session storage
// // //     if (sessionStorage.getItem('notificationsShown') === 'true') {
// // //       console.log('Toasts already shown in this session - skipping');
// // //       return null;
// // //     }
    
// // //     return toast(content, options);
// // //   } catch (error) {
// // //     console.error('Toast error:', error);
// // //     try {
// // //       // Fallback to simpler toast method if the component version has issues
// // //       return toast.info(typeof content === 'string' ? content : 'New notification');
// // //     } catch (innerError) {
// // //       console.error('Even simple toast failed:', innerError);
// // //     }
// // //   }
// // // };
// // const safeToast = (content, options) => {
// //   try {
// //     // REMOVE this check to allow toasts to display
// //     // We want toasts to show every time there are new unread notifications
// //     // if (sessionStorage.getItem('notificationsShown') === 'true') {
// //     //   console.log('Toasts already shown in this session - skipping');
// //     //   return null;
// //     // }
    
// //     return toast(content, options);
// //   } catch (error) {
// //     console.error('Toast error:', error);
// //     try {
// //       // Fallback to simpler toast method if the component version has issues
// //       return toast.info(typeof content === 'string' ? content : 'New notification');
// //     } catch (innerError) {
// //       console.error('Even simple toast failed:', innerError);
// //     }
// //   }
// // };


// // // Create the context
// // const NotificationContext = createContext();

// // // Server URLs for different environments
// // const PRODUCTION_URL = 'https://puriserver.onrender.com';
// // const DEVELOPMENT_URL = 'http://localhost:5000';
// // const SERVER_URL = process.env.NODE_ENV === 'production' ? PRODUCTION_URL : DEVELOPMENT_URL;

// // export const useNotifications = () => useContext(NotificationContext);

// // export const NotificationProvider = ({ children }) => {
// //   const [notifications, setNotifications] = useState([]);
// //   const [unreadCount, setUnreadCount] = useState(0);
// //   const [isOpen, setIsOpen] = useState(false);
// //   const [socket, setSocket] = useState(null);
// //   const [connected, setConnected] = useState(false);
// //   const [connectionAttempts, setConnectionAttempts] = useState(0);
// //   const db = getFirestore();
// //   const firestoreUnsubscribeRef = useRef(null);
// //   const recentNotificationsRef = useRef(new Map()); // Track recently processed notifications

// //   useEffect(() => {
// //     const unreadCount = notifications.filter(n => !n.read).length;
// //     console.log(`Notifications changed, unread count: ${unreadCount}`);
// //     setUnreadCount(unreadCount);
// //   }, [notifications]);

// //   // Format notification data
// //   const formatNotification = useCallback((notification) => {
// //     let action = "has sent a notification";
// //     let target = "";
// //     let name = notification.senderName || "User";
// //     let initials = name.split(' ').map(n => n[0]).join('');
// //     let backgroundColor = '#E5E7EB'; // Default gray
    
// //     // Handle different notification types
// //     if (notification.type === 'support') {
// //       action = "has raised a support ticket";
// //       target = notification.data?.category ? `for ${notification.data.category}` : "";
// //       backgroundColor = '#FEE2E2'; // Light red for support tickets
      
// //       if (!notification.senderName && notification.data?.phoneNumber) {
// //         name = notification.data.phoneNumber;
// //         initials = 'U';
// //       }
      
// //       if (!notification.senderName && notification.senderPhone) {
// //         name = notification.senderPhone;
// //         initials = 'U';
// //       }
// //     } 
// //     // Handle property listing notifications
// //     else if (notification.type === 'putOnRent') {
// //       action = "has requested to list a property";
// //       target = notification.data?.flatId ? `for flat ID ${notification.data.flatId}` : "";
// //       backgroundColor = '#DBEAFE'; // Light blue for property listing
      
// //       if (!notification.senderName && notification.data?.phoneNumber) {
// //         name = notification.data.phoneNumber;
// //         initials = 'P';
// //       }
      
// //       if (!notification.senderName && notification.senderPhone) {
// //         name = notification.senderPhone;
// //         initials = 'P';
// //       }
// //     }
// //     // Handle property search notifications
// //     else if (notification.type === 'needOnRent') {
// //       action = "has requested to find a property";
// //       target = notification.data?.bhkType ? `(${notification.data.bhkType})` : "";
// //       backgroundColor = '#D1FAE5'; // Light green for property search
      
// //       if (!notification.senderName && notification.data?.phoneNumber) {
// //         name = notification.data.phoneNumber;
// //         initials = 'R';
// //       }
      
// //       if (!notification.senderName && notification.senderPhone) {
// //         name = notification.senderPhone;
// //         initials = 'R';
// //       }
// //     }
    
// //     // Format time - Fixed to handle various timestamp formats
// //     let time;
// //     if (notification.timestamp) {
// //       try {
// //         // Handle Firebase timestamp object (has toDate method)
// //         if (notification.timestamp.toDate) {
// //           time = formatTimeAgo(notification.timestamp.toDate());
// //         } 
// //         // Handle ISO string timestamp
// //         else if (typeof notification.timestamp === 'string') {
// //           time = formatTimeAgo(new Date(notification.timestamp));
// //         } 
// //         // Handle timestamp number/seconds
// //         else if (typeof notification.timestamp === 'number') {
// //           // Check if this is seconds (Firebase timestamp) or milliseconds
// //           const date = notification.timestamp > 9999999999
// //             ? new Date(notification.timestamp) // milliseconds
// //             : new Date(notification.timestamp * 1000); // seconds
// //           time = formatTimeAgo(date);
// //         }
// //         // If none of these, fallback
// //         else {
// //           time = 'Recent';
// //         }
// //       } catch (err) {
// //         console.error('Error formatting timestamp:', err, notification.timestamp);
// //         time = 'Recent';
// //       }
// //     } else {
// //       time = 'Recent';
// //     }
    
// //     return {
// //       id: notification.id,
// //       name,
// //       action,
// //       target,
// //       time,
// //       initials,
// //       backgroundColor,
// //       read: notification.read || false,
// //       data: notification.data,
// //       type: notification.type,
// //       title: notification.title || `New ${notification.type || 'notification'}`,
// //       receivedAt: Date.now() // Add timestamp when this notification was processed
// //     };
// //   }, []);

// //   // Helper function to format time ago
// //   const formatTimeAgo = (date) => {
// //     if (!(date instanceof Date) || isNaN(date.getTime())) {
// //       console.warn('Invalid date provided to formatTimeAgo', date);
// //       return 'Recent';
// //     }
    
// //     const now = new Date();
// //     const diffMs = now - date;
// //     const diffMins = Math.floor(diffMs / 60000);
// //     const diffHours = Math.floor(diffMins / 60);
// //     const diffDays = Math.floor(diffHours / 24);
    
// //     if (diffMins < 1) {
// //       return 'Just now';
// //     } else if (diffMins < 60) {
// //       return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
// //     } else if (diffHours < 24) {
// //       return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
// //     } else if (diffDays < 7) {
// //       return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
// //     } else {
// //       return date.toLocaleDateString();
// //     }
// //   };

// //   // Check if notification is a duplicate
// //   const isDuplicate = useCallback((notification) => {
// //     const signature = `${notification.type || ''}-${notification.senderName || ''}-${notification.data?.ticketId || ''}`;
// //     const now = Date.now();
// //     const DEDUPLICATION_WINDOW = 10000; // 10 seconds
    
// //     if (recentNotificationsRef.current.has(signature)) {
// //       const lastSeen = recentNotificationsRef.current.get(signature);
// //       if (now - lastSeen < DEDUPLICATION_WINDOW) {
// //         console.log('Duplicate notification prevented:', signature);
// //         return true;
// //       }
// //     }
    
// //     // Update record
// //     recentNotificationsRef.current.set(signature, now);
    
// //     // Clean up old entries
// //     for (const [key, timestamp] of recentNotificationsRef.current.entries()) {
// //       if (now - timestamp > DEDUPLICATION_WINDOW) {
// //         recentNotificationsRef.current.delete(key);
// //       }
// //     }
    
// //     return false;
// //   }, []);

// //   // Load notifications from Firestore
// //   const loadFirestoreNotifications = useCallback(() => {
// //     console.log('Loading notifications from Firestore');
    
// //     // Clean up any existing subscription
// //     if (firestoreUnsubscribeRef.current) {
// //       firestoreUnsubscribeRef.current();
// //       firestoreUnsubscribeRef.current = null;
// //     }
    
// //     const q = query(
// //       collection(db, 'notifications'),
// //       where('recipient', '==', 'dashboard'),
// //       orderBy('timestamp', 'desc'), // Most recent notifications first
// //       limit(50)
// //     );
    
// //     try {
// //       const unsubscribe = onSnapshot(q, (snapshot) => {
// //         const newNotifications = [];
// //         const processedIds = new Set(); // Track IDs to prevent duplicates
        
// //         snapshot.forEach(doc => {
// //           const notificationId = doc.id;
          
// //           // Skip if we've already processed this ID
// //           if (processedIds.has(notificationId)) return;
          
// //           // Add ID to processed set
// //           processedIds.add(notificationId);
          
// //           // Get notification data with the read status from Firestore
// //           // to ensure we respect the persistent read status
// //           const notificationData = doc.data();
          
// //           newNotifications.push({
// //             id: notificationId,
// //             ...notificationData
// //           });
// //         });
        
// //         const formattedNotifications = newNotifications.map(formatNotification);
        
// //         // Sort notifications to ensure newest are at the top
// //         formattedNotifications.sort((a, b) => {
// //           // First sort by read status (unread first)
// //           if (!a.read && b.read) return -1;
// //           if (a.read && !b.read) return 1;
          
// //           // Then by timestamp (most recent first)
// //           // Use receivedAt as a fallback for consistent sorting
// //           const aTime = a.receivedAt || 0;
// //           const bTime = b.receivedAt || 0;
// //           return bTime - aTime;
// //         });
        
// //         setNotifications(formattedNotifications);
// //         setUnreadCount(formattedNotifications.filter(n => !n.read).length);
// //       }, (error) => {
// //         console.error('Error loading Firestore notifications:', error);
// //       });
      
// //       firestoreUnsubscribeRef.current = unsubscribe;
// //       return unsubscribe;
// //     } catch (error) {
// //       console.error('Error setting up Firestore listener:', error);
// //       return () => {};
// //     }
// //   }, [db, formatNotification]);

// //   // Show toast notification - Fixed to show only once per browser session
// //   const showToastNotification = useCallback((notification) => {
// //     // REMOVE the session storage check to allow toasts to display
// //     console.log('Showing toast notification:', notification);
    
// //     try {
// //       const NotificationContent = () => (
// //         <div className="flex items-start gap-3">
// //           <div 
// //             className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
// //             style={{ backgroundColor: notification.backgroundColor || '#E5E7EB' }}
// //           >
// //             {notification.initials}
// //           </div>
// //           <div>
// //             <p className="font-medium">{notification.title || 'New notification'}</p>
// //             <p className="text-sm">
// //               <span className="font-medium">{notification.name}</span>{' '}
// //               <span>{notification.action}</span>
// //               {notification.target && <span> {notification.target}</span>}
// //             </p>
// //           </div>
// //         </div>
// //       );
      
// //       // Fixed toast implementation for react-toastify compatibility
// //       // Add a setTimeout to ensure ToastContainer is fully mounted before showing toast
// //       setTimeout(() => {
// //         // Use a unique toastId based on notification ID to prevent duplicates
// //         const toastId = notification.id || `toast_${Date.now()}_${Math.random()}`;
        
// //         safeToast(<NotificationContent />, {
// //           position: "top-left",
// //           autoClose: 5000,
// //           hideProgressBar: false,
// //           closeOnClick: true,
// //           pauseOnHover: true,
// //           draggable: true,
// //           theme: "light",
// //           toastId: toastId, // Use toastId to prevent duplicates
// //           // Removed transition property that was causing issues
// //           onClick: () => {
// //             // Open notification sidebar when toast is clicked
// //             setIsOpen(true);
// //           }
// //         });
// //       }, 500); // Short delay to ensure component is ready
// //     } catch (error) {
// //       console.error('Error showing toast notification:', error);
      
// //       // Try a basic toast as fallback
// //       try {
// //         toast.info(`${notification.title || 'New notification'}: ${notification.name} ${notification.action} ${notification.target || ''}`, {
// //           position: "top-left",
// //           autoClose: 5000
// //         });
// //       } catch (fallbackError) {
// //         console.error('Fallback toast also failed:', fallbackError);
// //       }
// //     }
// //   }, []);

// //   // Enhanced function to process notifications from Firestore - show notification only once per session
// //   const loadAndProcessFirestoreNotifications = useCallback(() => {
// //     console.log('Loading and processing all Firestore notifications');
    
// //     // Clean up any existing subscription
// //     if (firestoreUnsubscribeRef.current) {
// //       firestoreUnsubscribeRef.current();
// //       firestoreUnsubscribeRef.current = null;
// //     }
    
// //     // REMOVE the session storage check to show toasts for new notifications
// //     // We'll implement a different tracking mechanism for new vs. existing notifications
    
// //     // Query for all notifications, including fallback ones
// //     const q = query(
// //       collection(db, 'notifications'),
// //       where('recipient', '==', 'dashboard'),
// //       orderBy('timestamp', 'desc'),
// //       limit(50)
// //     );
    
// //     try {
// //       // Track which notifications we've already shown in this component lifecycle
// //       const shownNotifications = new Set();
      
// //       const unsubscribe = onSnapshot(q, (snapshot) => {
// //         const newNotifications = [];
// //         const processedIds = new Set(); // Track IDs to prevent duplicates
        
// //         // Process all notifications
// //         snapshot.forEach(async (doc) => {
// //           const notification = {
// //             id: doc.id,
// //             ...doc.data()
// //           };
          
// //           // Skip duplicates
// //           if (processedIds.has(notification.id)) return;
// //           processedIds.add(notification.id);
          
// //           // Process any unread notification
// //           if (!notification.read) {
// //             console.log('Found unread notification:', notification.id);
            
// //             // Only show toast if we haven't shown it before during this component lifecycle
// //             if (!shownNotifications.has(notification.id)) {
// //               // Track that we've shown this notification
// //               shownNotifications.add(notification.id);
              
// //               // Format and show toast with delay to ensure UI is ready
// //               const formattedNotification = formatNotification(notification);
              
// //               setTimeout(() => {
// //                 showToastNotification(formattedNotification);
                
// //                 // Play notification sound
// //                 try {
// //                   const audio = new Audio('/notification-sound.mp3');
// //                   audio.play().catch(e => console.error('Error playing sound:', e));
// //                 } catch (error) {
// //                   console.error('Error playing notification sound:', error);
// //                 }
// //               }, 800);
              
// //               // Mark as processed if it's a fallback notification
// //               if (notification.sentVia === 'fallback' && notification.processed !== true) {
// //                 try {
// //                   await updateDoc(doc(db, 'notifications', notification.id), {
// //                     processed: true
// //                   });
// //                   console.log('Marked notification as processed:', notification.id);
// //                 } catch (error) {
// //                   console.error('Error marking notification as processed:', error);
// //                 }
// //               }
// //             }
// //           }
          
// //           // Add to list for state update
// //           newNotifications.push(notification);
// //         });
        
// //         // Rest of the function remains the same...
// //       });
      
// //       firestoreUnsubscribeRef.current = unsubscribe;
// //       return unsubscribe;
// //     } catch (error) {
// //       console.error('Error setting up Firestore listener:', error);
// //       return () => {};
// //     }
// //   }, [db, formatNotification, showToastNotification]);

// //   // Clear notification session flags on unmount - modified for session persistence
// //   useEffect(() => {
// //     return () => {
// //       // We no longer clear session storage on unmount to preserve the flag between refreshes
// //       // Only browser close/reopen will reset the notification shown status
      
// //       // Clean up any subscriptions
// //       if (firestoreUnsubscribeRef.current) {
// //         firestoreUnsubscribeRef.current();
// //       }
// //     };
// //   }, []);

// //   // Also load fallback notifications specifically when component mounts
// //   // Delay initial loading to ensure all components are properly initialized
// //   useEffect(() => {
// //     console.log('Initial load of notifications, including fallback');
    
// //     // REMOVE the session storage checks
    
// //     // Add a delay before loading notifications to avoid race conditions during page refresh
// //     const timeoutId = setTimeout(() => {
// //       try {
// //         const unsubscribe = loadAndProcessFirestoreNotifications();
        
// //         if (typeof unsubscribe !== 'function') {
// //           console.warn('Expected unsubscribe to be a function but got:', typeof unsubscribe);
// //         }
// //       } catch (error) {
// //         console.error('Error during initial notification load:', error);
        
// //         // Retry once more if initial load fails
// //         setTimeout(() => {
// //           try {
// //             loadAndProcessFirestoreNotifications();
// //           } catch (retryError) {
// //             console.error('Retry also failed:', retryError);
// //           }
// //         }, 2000);
// //       }
// //     }, 1000); // 1 second delay
    
// //     return () => {
// //       clearTimeout(timeoutId);
// //     };
// //   }, [loadAndProcessFirestoreNotifications]);
  
// //   // Use Firestore as fallback if WebSocket fails
// //   useEffect(() => {
// //     // If we've tried to connect and failed, or if we're not connected after attempting,
// //     // use Firestore as fallback
// //     if (connectionAttempts >= 2 || (!connected && connectionAttempts > 0)) {
// //       loadAndProcessFirestoreNotifications();
// //     }
    
// //     return () => {
// //       if (firestoreUnsubscribeRef.current) {
// //         firestoreUnsubscribeRef.current();
// //       }
// //     };
// //   }, [connectionAttempts, connected, loadAndProcessFirestoreNotifications]);

// //   // Initialize WebSocket connection
// //   useEffect(() => {
// //     // We no longer reset flags on component mount to maintain persistence between refreshes
    
// //     let socketInitialized = false;
// //     let cleanup = null;
    
// //     const connectSocket = async () => {
// //       if (socketInitialized) return;
// //       socketInitialized = true;
      
// //       try {
// //         const auth = getAuth();
// //         const user = auth.currentUser;
        
// //         if (!user) {
// //           console.log('No user signed in, using Firestore fallback');
// //           const unsubscribe = loadAndProcessFirestoreNotifications();
// //           return () => unsubscribe();
// //         }
        
// //         // Get token for authentication
// //         const token = await user.getIdToken();
        
// //         // Initialize socket
// //         console.log(`Connecting to notification server: ${SERVER_URL}`);
// //         const newSocket = io(SERVER_URL, {
// //           transports: ['websocket'],
// //           timeout: 10000,
// //           reconnection: true,
// //           reconnectionAttempts: 5
// //         });
        
// //         setSocket(newSocket);
// //         setConnectionAttempts(prev => prev + 1);
        
// //         // Set up event listeners
// //         newSocket.on('connect', () => {
// //           console.log('Connected to notification server');
// //           setConnected(true);
          
// //           // Authenticate after connection
// //           newSocket.emit('authenticate', {
// //             token,
// //             clientType: 'dashboard'
// //           });
// //         });
        
// //         newSocket.on('disconnect', () => {
// //           console.log('Disconnected from notification server');
// //           setConnected(false);
// //         });
        
// //         newSocket.on('connect_error', (error) => {
// //           console.error('Connection error:', error);
// //           setConnected(false);
// //           setConnectionAttempts(prev => prev + 1);
// //         });
        
// //         newSocket.on('authenticated', (response) => {
// //           if (response.success) {
// //             console.log('Successfully authenticated with notification server');
// //             // Fetch existing notifications
// //             newSocket.emit('get-notifications', {
// //               clientType: 'dashboard'
// //             });
// //           } else {
// //             console.error('Authentication failed:', response.error);
            
// //             // Use Firestore as fallback
// //             loadAndProcessFirestoreNotifications();
// //           }
// //         });
        
// //         newSocket.on('notifications-list', (data) => {
// //           if (data.notifications && Array.isArray(data.notifications)) {
// //             const formattedNotifications = data.notifications.map(formatNotification);
// //             setNotifications(formattedNotifications);
// //             setUnreadCount(formattedNotifications.filter(n => !n.read).length);
// //           }
// //         });
        
// //         newSocket.on('new-notification', (notification) => {
// //             console.log('New notification received:', notification);
            
// //             // Skip if it's a duplicate notification
// //             if (isDuplicate(notification)) {
// //               return;
// //             }
            
// //             // Save to Firestore to ensure persistence
// //             try {
// //               // Use the notification ID if available, otherwise Firestore will generate one
// //               const notificationRef = notification.id 
// //                 ? doc(db, 'notifications', notification.id)
// //                 : doc(collection(db, 'notifications'));
              
// //               // If notification has an ID, update the document
// //               if (notification.id) {
// //                 updateDoc(notificationRef, {
// //                   ...notification,
// //                   recipient: 'dashboard',
// //                   receivedAt: new Date(),
// //                   processed: true
// //                 }).catch(error => {
// //                   console.error('Error updating notification in Firestore:', error);
// //                 });
// //               } 
// //               // Otherwise, create a new document
// //               else {
// //                 const newNotificationId = notificationRef.id;
// //                 notification.id = newNotificationId;
                
// //                 // Use setDoc since we already have a reference with ID
// //                 import('firebase/firestore').then(({ setDoc }) => {
// //                   setDoc(notificationRef, {
// //                     ...notification,
// //                     recipient: 'dashboard',
// //                     receivedAt: new Date(),
// //                     processed: true
// //                   }).catch(error => {
// //                     console.error('Error saving notification to Firestore:', error);
// //                   });
// //                 });
// //               }
// //             } catch (error) {
// //               console.error('Error saving notification to Firestore:', error);
// //             }
            
// //             const formattedNotification = formatNotification(notification);
  
// //             // Add to notifications list and recalculate unread count
// //             setNotifications(prev => {
// //               // Check if notification already exists
// //               const exists = prev.some(n => n.id === formattedNotification.id);
// //               if (exists) return prev;
              
// //               // Add new notification at the top of the list
// //               const updatedNotifications = [formattedNotification, ...prev];
              
// //               // Sort notifications to ensure proper order
// //               return updatedNotifications.sort((a, b) => {
// //                 // Unread notifications first
// //                 if (!a.read && b.read) return -1;
// //                 if (a.read && !b.read) return 1;
                
// //                 // Then by timestamp
// //                 const aTime = a.receivedAt || 0;
// //                 const bTime = b.receivedAt || 0;
// //                 return bTime - aTime;
// //               });
// //             });
            
// //             // Separate operation to recalculate the unread count
// //             if (!notification.read) {
// //               // Using setTimeout to ensure this happens after state updates
// //               setTimeout(() => {
// //                 setNotifications(currentNotifications => {
// //                   // Calculate total unread correctly from current state
// //                   const totalUnread = currentNotifications.filter(n => !n.read).length;
// //                   console.log('Recalculating unread count, found:', totalUnread);
                  
// //                   // Update the unread count directly
// //                   setUnreadCount(totalUnread);
                  
// //                   // Return unchanged notifications
// //                   return currentNotifications;
// //                 });
// //               }, 100);
              
// //               // Show toast notification
// //               showToastNotification(formattedNotification);
              
// //               // Play notification sound
// //               try {
// //                 const audio = new Audio('/notification-sound.mp3');
// //                 audio.play().catch(e => console.error('Error playing sound:', e));
// //               } catch (error) {
// //                 console.error('Error playing notification sound:', error);
// //               }
// //             }
// //           });
        
// //         newSocket.on('notification-updated', (data) => {
// //           if (data.success && data.id) {
// //             setNotifications(prev => 
// //               prev.map(n => 
// //                 n.id === data.id ? { ...n, read: true } : n
// //               )
// //             );
// //             setUnreadCount(prev => Math.max(0, prev - 1));
// //           }
// //         });
        
// //         newSocket.on('error', (error) => {
// //           console.error('Socket error:', error);
// //         });
        
// //         return () => {
// //           newSocket.disconnect();
// //         };
// //       } catch (error) {
// //         console.error('Error setting up WebSocket:', error);
        
// //         // Use Firestore as fallback
// //         const unsubscribe = loadAndProcessFirestoreNotifications();
// //         return () => unsubscribe();
// //       }
// //     };
    
// //     cleanup = connectSocket();
    
// //     return () => {
// //       if (typeof cleanup === 'function') {
// //         cleanup();
// //       }
      
// //       if (socket) {
// //         socket.disconnect();
// //         setSocket(null);
// //       }
// //     };
// //   }, [loadAndProcessFirestoreNotifications, formatNotification, showToastNotification, isDuplicate]);
  
// //   // Mark notification as read
// //   const markAsRead = useCallback((notificationId) => {
// //     if (!notificationId) return;
    
// //     // Always update in Firestore to ensure persistence across page refreshes
// //     try {
// //       updateDoc(doc(db, 'notifications', notificationId), {
// //         read: true,
// //         lastReadAt: new Date() // Add timestamp when it was read
// //       });
// //       console.log('Marked notification as read in Firestore:', notificationId);
// //     } catch (error) {
// //       console.error('Error marking notification as read in Firestore:', error);
// //     }
    
// //     // Also update via WebSocket if connected
// //     if (connected && socket) {
// //       socket.emit('mark-read', { notificationId });
// //       console.log('Sent mark-read event to WebSocket for:', notificationId);
// //     }
    
// //     // Optimistically update UI - Don't remove the notification, just mark it as read
// //     setNotifications(prev => {
// //       const updated = prev.map(n => 
// //         n.id === notificationId ? { ...n, read: true } : n
// //       );
      
// //       // Re-sort to maintain order (unread first, then by time)
// //       return updated.sort((a, b) => {
// //         if (!a.read && b.read) return -1;
// //         if (a.read && !b.read) return 1;
// //         const aTime = a.receivedAt || 0;
// //         const bTime = b.receivedAt || 0;
// //         return bTime - aTime;
// //       });
// //     });
    
// //     setUnreadCount(prev => Math.max(0, prev - 1));
// //   }, [connected, socket, db]);
  
// //   // Mark all notifications as read
// //   const markAllAsRead = useCallback(() => {
// //     // Get all unread notification IDs
// //     const unreadIds = notifications
// //       .filter(n => !n.read)
// //       .map(n => n.id);
    
// //     if (unreadIds.length === 0) return;
    
// //     // Mark each as read in Firestore for persistence
// //     unreadIds.forEach(id => {
// //       try {
// //         updateDoc(doc(db, 'notifications', id), {
// //           read: true,
// //           lastReadAt: new Date()
// //         }).catch(error => {
// //           console.error('Error marking notification as read in Firestore:', error);
// //         });
        
// //         // Also update via WebSocket if connected
// //         if (connected && socket) {
// //           socket.emit('mark-read', { notificationId: id });
// //         }
// //       } catch (error) {
// //         console.error('Error marking notification as read:', error);
// //       }
// //     });
    
// //     // Optimistically update UI - Don't remove the notifications, just mark them as read
// //     const updatedNotifications = notifications.map(n => ({ 
// //       ...n, 
// //       read: true 
// //     }));
    
// //     // Set notifications without changing their order
// //     setNotifications(updatedNotifications);
// //     setUnreadCount(0);
    
// //     console.log('Marked all notifications as read. Total notifications still showing:', updatedNotifications.length);
// //   }, [notifications, connected, socket, db]);
  
// //   // Clear all notifications
// //   const clearAllNotifications = useCallback(async () => {
// //     if (notifications.length === 0) return;
    
// //     try {
// //       // Delete all notifications from Firestore
// //       const deletePromises = notifications.map(notification => 
// //         deleteDoc(doc(db, 'notifications', notification.id))
// //       );
      
// //       await Promise.all(deletePromises);
      
// //       // Clear notifications from state
// //       setNotifications([]);
// //       setUnreadCount(0);
// //     } catch (error) {
// //       console.error('Error clearing notifications:', error);
// //     }
// //   }, [notifications, db]);
  
// //   // Toggle sidebar
// //   const toggleSidebar = useCallback(() => {
// //     setIsOpen(prev => !prev);
// //   }, []);
  
// //   // Close sidebar
// //   const closeSidebar = useCallback(() => {
// //     setIsOpen(false);
// //   }, []);
  
// //   // Open sidebar
// //   const openSidebar = useCallback(() => {
// //     setIsOpen(true);
// //   }, []);
  
// //   // Context value
// //   const value = {
// //     notifications,
// //     unreadCount,
// //     isOpen,
// //     markAsRead,
// //     markAllAsRead,
// //     clearAllNotifications,
// //     toggleSidebar,
// //     closeSidebar,
// //     openSidebar,
// //     connected,
// //     showToastNotification // Expose for testing
// //   };
  
// //   // Render component with a safer ToastContainer configuration
// //   return (
// //     <NotificationContext.Provider value={value}>
// //       {children}
// //       <ToastContainer
// //         position="top-left"
// //         autoClose={5000}
// //         hideProgressBar={false}
// //         newestOnTop
// //         closeOnClick
// //         rtl={false}
// //         pauseOnFocusLoss
// //         draggable
// //         pauseOnHover
// //         theme="light"
// //         style={{ zIndex: 9999 }} // Ensure high z-index
// //         // Removed any potentially conflicting props
// //         // Specify limited transition settings to avoid conflicts
// //         transition={undefined} // Let react-toastify use its default transition
// //       />
// //     </NotificationContext.Provider>
// //   );
// // };

// // export default NotificationContext;
// import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
// import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, getFirestore, limit, deleteDoc } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';
// import io from 'socket.io-client';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // Create the context
// const NotificationContext = createContext();

// // Server URLs for different environments
// const PRODUCTION_URL = 'https://puriserver.onrender.com';
// const DEVELOPMENT_URL = 'http://localhost:5000';
// const SERVER_URL = process.env.NODE_ENV === 'production' ? PRODUCTION_URL : DEVELOPMENT_URL;

// export const useNotifications = () => useContext(NotificationContext);

// export const NotificationProvider = ({ children }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [isOpen, setIsOpen] = useState(false);
//   const [socket, setSocket] = useState(null);
//   const [connected, setConnected] = useState(false);
//   const [connectionAttempts, setConnectionAttempts] = useState(0);
//   const db = getFirestore();
//   const firestoreUnsubscribeRef = useRef(null);
//   const recentNotificationsRef = useRef(new Map()); // Track recently processed notifications
//   const shownNotificationsRef = useRef(new Set()); // Track notifications shown in this session

//   useEffect(() => {
//     const unreadCount = notifications.filter(n => !n.read).length;
//     console.log(`Notifications changed, unread count: ${unreadCount}`);
//     setUnreadCount(unreadCount);
//   }, [notifications]);

//   // Format notification data
//   const formatNotification = useCallback((notification) => {
//     let action = "has sent a notification";
//     let target = "";
//     let name = notification.senderName || "User";
//     let initials = name.split(' ').map(n => n[0]).join('');
//     let backgroundColor = '#E5E7EB'; // Default gray
    
//     // Handle different notification types
//     if (notification.type === 'support') {
//       action = "has raised a support ticket";
//       target = notification.data?.category ? `for ${notification.data.category}` : "";
//       backgroundColor = '#FEE2E2'; // Light red for support tickets
      
//       if (!notification.senderName && notification.data?.phoneNumber) {
//         name = notification.data.phoneNumber;
//         initials = 'U';
//       }
      
//       if (!notification.senderName && notification.senderPhone) {
//         name = notification.senderPhone;
//         initials = 'U';
//       }
//     } 
//     // Handle property listing notifications
//     else if (notification.type === 'putOnRent') {
//       action = "has requested to list a property";
//       target = notification.data?.flatId ? `for flat ID ${notification.data.flatId}` : "";
//       backgroundColor = '#DBEAFE'; // Light blue for property listing
      
//       if (!notification.senderName && notification.data?.phoneNumber) {
//         name = notification.data.phoneNumber;
//         initials = 'P';
//       }
      
//       if (!notification.senderName && notification.senderPhone) {
//         name = notification.senderPhone;
//         initials = 'P';
//       }
//     }
//     // Handle property search notifications
//     else if (notification.type === 'needOnRent') {
//       action = "has requested to find a property";
//       target = notification.data?.bhkType ? `(${notification.data.bhkType})` : "";
//       backgroundColor = '#D1FAE5'; // Light green for property search
      
//       if (!notification.senderName && notification.data?.phoneNumber) {
//         name = notification.data.phoneNumber;
//         initials = 'R';
//       }
      
//       if (!notification.senderName && notification.senderPhone) {
//         name = notification.senderPhone;
//         initials = 'R';
//       }
//     }
    
//     // Format time - Fixed to handle various timestamp formats
//     let time;
//     if (notification.timestamp) {
//       try {
//         // Handle Firebase timestamp object (has toDate method)
//         if (notification.timestamp.toDate) {
//           time = formatTimeAgo(notification.timestamp.toDate());
//         } 
//         // Handle ISO string timestamp
//         else if (typeof notification.timestamp === 'string') {
//           time = formatTimeAgo(new Date(notification.timestamp));
//         } 
//         // Handle timestamp number/seconds
//         else if (typeof notification.timestamp === 'number') {
//           // Check if this is seconds (Firebase timestamp) or milliseconds
//           const date = notification.timestamp > 9999999999
//             ? new Date(notification.timestamp) // milliseconds
//             : new Date(notification.timestamp * 1000); // seconds
//           time = formatTimeAgo(date);
//         }
//         // If none of these, fallback
//         else {
//           time = 'Recent';
//         }
//       } catch (err) {
//         console.error('Error formatting timestamp:', err, notification.timestamp);
//         time = 'Recent';
//       }
//     } else {
//       time = 'Recent';
//     }
    
//     return {
//       id: notification.id,
//       name,
//       action,
//       target,
//       time,
//       initials,
//       backgroundColor,
//       read: notification.read || false,
//       data: notification.data,
//       type: notification.type,
//       title: notification.title || `New ${notification.type || 'notification'}`,
//       receivedAt: Date.now() // Add timestamp when this notification was processed
//     };
//   }, []);

//   // Helper function to format time ago
//   const formatTimeAgo = (date) => {
//     if (!(date instanceof Date) || isNaN(date.getTime())) {
//       console.warn('Invalid date provided to formatTimeAgo', date);
//       return 'Recent';
//     }
    
//     const now = new Date();
//     const diffMs = now - date;
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMins / 60);
//     const diffDays = Math.floor(diffHours / 24);
    
//     if (diffMins < 1) {
//       return 'Just now';
//     } else if (diffMins < 60) {
//       return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
//     } else if (diffHours < 24) {
//       return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
//     } else if (diffDays < 7) {
//       return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
//     } else {
//       return date.toLocaleDateString();
//     }
//   };

//   // Check if notification is a duplicate
//   const isDuplicate = useCallback((notification) => {
//     const signature = `${notification.type || ''}-${notification.senderName || ''}-${notification.data?.ticketId || ''}`;
//     const now = Date.now();
//     const DEDUPLICATION_WINDOW = 10000; // 10 seconds
    
//     if (recentNotificationsRef.current.has(signature)) {
//       const lastSeen = recentNotificationsRef.current.get(signature);
//       if (now - lastSeen < DEDUPLICATION_WINDOW) {
//         console.log('Duplicate notification prevented:', signature);
//         return true;
//       }
//     }
    
//     // Update record
//     recentNotificationsRef.current.set(signature, now);
    
//     // Clean up old entries
//     for (const [key, timestamp] of recentNotificationsRef.current.entries()) {
//       if (now - timestamp > DEDUPLICATION_WINDOW) {
//         recentNotificationsRef.current.delete(key);
//       }
//     }
    
//     return false;
//   }, []);

//   // Show toast notification (fixed)
//   const showToastNotification = useCallback((notification) => {
//     console.log('Showing toast notification:', notification);
    
//     try {
//       // Create content directly as a JSX object, not as a component function
//       const content = (
//         <div className="flex items-start gap-3">
//           <div 
//             className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
//             style={{ backgroundColor: notification.backgroundColor || '#E5E7EB' }}
//           >
//             {notification.initials}
//           </div>
//           <div>
//             <p className="font-medium">{notification.title || 'New notification'}</p>
//             <p className="text-sm">
//               <span className="font-medium">{notification.name}</span>{' '}
//               <span>{notification.action}</span>
//               {notification.target && <span> {notification.target}</span>}
//             </p>
//           </div>
//         </div>
//       );
      
//       // Use plain toast instead of safeToast
//       toast(content, {
//         position: "top-left",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         theme: "light",
//         onClick: () => {
//           setIsOpen(true);
//         }
//       });
//     } catch (error) {
//       console.error('Error showing toast notification:', error);
//       // Use simple text toast as fallback
//       toast.info('New notification received', {
//         position: "top-left",
//         autoClose: 5000
//       });
//     }
//   }, []);

//   // Load notifications from Firestore
//   const loadFirestoreNotifications = useCallback(() => {
//     console.log('Loading notifications from Firestore');
    
//     // Clean up any existing subscription
//     if (firestoreUnsubscribeRef.current) {
//       firestoreUnsubscribeRef.current();
//       firestoreUnsubscribeRef.current = null;
//     }
    
//     const q = query(
//       collection(db, 'notifications'),
//       where('recipient', '==', 'dashboard'),
//       orderBy('timestamp', 'desc'), // Most recent notifications first
//       limit(50)
//     );
    
//     try {
//       const unsubscribe = onSnapshot(q, (snapshot) => {
//         const newNotifications = [];
//         const processedIds = new Set(); // Track IDs to prevent duplicates
        
//         snapshot.forEach(doc => {
//           const notificationId = doc.id;
          
//           // Skip if we've already processed this ID
//           if (processedIds.has(notificationId)) return;
          
//           // Add ID to processed set
//           processedIds.add(notificationId);
          
//           // Get notification data with the read status from Firestore
//           // to ensure we respect the persistent read status
//           const notificationData = doc.data();
          
//           newNotifications.push({
//             id: notificationId,
//             ...notificationData
//           });
//         });
        
//         const formattedNotifications = newNotifications.map(formatNotification);
        
//         // Sort notifications to ensure newest are at the top
//         formattedNotifications.sort((a, b) => {
//           // First sort by read status (unread first)
//           if (!a.read && b.read) return -1;
//           if (a.read && !b.read) return 1;
          
//           // Then by timestamp (most recent first)
//           // Use receivedAt as a fallback for consistent sorting
//           const aTime = a.receivedAt || 0;
//           const bTime = b.receivedAt || 0;
//           return bTime - aTime;
//         });
        
//         setNotifications(formattedNotifications);
//         setUnreadCount(formattedNotifications.filter(n => !n.read).length);
//       }, (error) => {
//         console.error('Error loading Firestore notifications:', error);
//       });
      
//       firestoreUnsubscribeRef.current = unsubscribe;
//       return unsubscribe;
//     } catch (error) {
//       console.error('Error setting up Firestore listener:', error);
//       return () => {};
//     }
//   }, [db, formatNotification]);

//   // Enhanced function to process notifications from Firestore and show toasts
//   const loadAndProcessFirestoreNotifications = useCallback(() => {
//     console.log('Loading and processing all Firestore notifications');
    
//     // Clean up any existing subscription
//     if (firestoreUnsubscribeRef.current) {
//       firestoreUnsubscribeRef.current();
//       firestoreUnsubscribeRef.current = null;
//     }
    
//     // Query for all notifications, including fallback ones
//     const q = query(
//       collection(db, 'notifications'),
//       where('recipient', '==', 'dashboard'),
//       orderBy('timestamp', 'desc'),
//       limit(50)
//     );
    
//     try {
//       const unsubscribe = onSnapshot(q, (snapshot) => {
//         const newNotifications = [];
//         const processedIds = new Set(); // Track IDs to prevent duplicates
        
//         // Process all notifications
//         snapshot.forEach(async (doc) => {
//           const notification = {
//             id: doc.id,
//             ...doc.data()
//           };
          
//           // Skip duplicates
//           if (processedIds.has(notification.id)) return;
//           processedIds.add(notification.id);
          
//           // Process any unread notification
//           if (!notification.read) {
//             console.log('Found unread notification:', notification.id);
            
//             // Only show toast if we haven't shown it before during this component lifecycle
//             if (!shownNotificationsRef.current.has(notification.id)) {
//               // Track that we've shown this notification
//               shownNotificationsRef.current.add(notification.id);
              
//               // Format and show toast with delay to ensure UI is ready
//               const formattedNotification = formatNotification(notification);
              
//               setTimeout(() => {
//                 showToastNotification(formattedNotification);
                
//                 // Play notification sound
//                 try {
//                   const audio = new Audio('/notification-sound.mp3');
//                   audio.play().catch(e => console.error('Error playing sound:', e));
//                 } catch (error) {
//                   console.error('Error playing notification sound:', error);
//                 }
//               }, 800);
              
//               // Mark as processed if it's a fallback notification
//               if (notification.sentVia === 'fallback' && notification.processed !== true) {
//                 try {
//                   await updateDoc(doc(db, 'notifications', notification.id), {
//                     processed: true
//                   });
//                   console.log('Marked notification as processed:', notification.id);
//                 } catch (error) {
//                   console.error('Error marking notification as processed:', error);
//                 }
//               }
//             }
//           }
          
//           // Add to list for state update
//           newNotifications.push(notification);
//         });
        
//         // Format and update state - MAINTAIN ALL NOTIFICATIONS
//         const formattedNotifications = newNotifications.map(formatNotification);
        
//         // Update state with all notifications
//         setNotifications(prevNotifications => {
//           // Create combined array, prioritizing existing notifications
//           // to preserve any UI state (like read status)
//           const combinedNotifications = [...prevNotifications];
          
//           // Add any new notifications that aren't already in the array
//           formattedNotifications.forEach(notification => {
//             if (!prevNotifications.some(n => n.id === notification.id)) {
//               combinedNotifications.push(notification);
//             }
//           });
          
//           console.log(`Total notifications after processing: ${combinedNotifications.length}`);
          
//           // Sort notifications to ensure newest are at the top
//           return combinedNotifications.sort((a, b) => {
//             // First sort by read status (unread first)
//             if (!a.read && b.read) return -1;
//             if (a.read && !b.read) return 1;
            
//             // Then by timestamp (most recent first)
//             const aTime = a.receivedAt || 0;
//             const bTime = b.receivedAt || 0;
//             return bTime - aTime;
//           });
//         });
        
//         // Calculate total unread count from ALL notifications
//         const totalUnreadCount = newNotifications.filter(n => !n.read).length;
        
//         // Update unread count directly with the total, not incrementally
//         setUnreadCount(totalUnreadCount);
//         console.log(`Total unread notifications count: ${totalUnreadCount}`);
//       }, (error) => {
//         console.error('Error loading Firestore notifications:', error);
//       });
      
//       firestoreUnsubscribeRef.current = unsubscribe;
//       return unsubscribe;
//     } catch (error) {
//       console.error('Error setting up Firestore listener:', error);
//       return () => {};
//     }
//   }, [db, formatNotification, showToastNotification]);

//   // Clear up resources when component unmounts
//   useEffect(() => {
//     return () => {
//       // Clean up any subscriptions
//       if (firestoreUnsubscribeRef.current) {
//         firestoreUnsubscribeRef.current();
//       }
//     };
//   }, []);

//   // Initial loading of notifications with delay to avoid race conditions
//   useEffect(() => {
//     console.log('Initial load of notifications, including fallback');
    
//     // Add a delay before loading notifications to avoid race conditions during page refresh
//     const timeoutId = setTimeout(() => {
//       try {
//         const unsubscribe = loadAndProcessFirestoreNotifications();
        
//         if (typeof unsubscribe !== 'function') {
//           console.warn('Expected unsubscribe to be a function but got:', typeof unsubscribe);
//         }
//       } catch (error) {
//         console.error('Error during initial notification load:', error);
        
//         // Retry once more if initial load fails
//         setTimeout(() => {
//           try {
//             loadAndProcessFirestoreNotifications();
//           } catch (retryError) {
//             console.error('Retry also failed:', retryError);
//           }
//         }, 2000);
//       }
//     }, 1000); // 1 second delay
    
//     return () => {
//       clearTimeout(timeoutId);
//     };
//   }, [loadAndProcessFirestoreNotifications]);
  
//   // Use Firestore as fallback if WebSocket fails
//   useEffect(() => {
//     // If we've tried to connect and failed, or if we're not connected after attempting,
//     // use Firestore as fallback
//     if (connectionAttempts >= 2 || (!connected && connectionAttempts > 0)) {
//       loadAndProcessFirestoreNotifications();
//     }
    
//     return () => {
//       if (firestoreUnsubscribeRef.current) {
//         firestoreUnsubscribeRef.current();
//       }
//     };
//   }, [connectionAttempts, connected, loadAndProcessFirestoreNotifications]);

//   // Initialize WebSocket connection
//   useEffect(() => {
//     let socketInitialized = false;
//     let cleanup = null;
    
//     const connectSocket = async () => {
//       if (socketInitialized) return;
//       socketInitialized = true;
      
//       try {
//         const auth = getAuth();
//         const user = auth.currentUser;
        
//         if (!user) {
//           console.log('No user signed in, using Firestore fallback');
//           const unsubscribe = loadAndProcessFirestoreNotifications();
//           return () => unsubscribe();
//         }
        
//         // Get token for authentication
//         const token = await user.getIdToken();
        
//         // Initialize socket
//         console.log(`Connecting to notification server: ${SERVER_URL}`);
//         const newSocket = io(SERVER_URL, {
//           transports: ['websocket'],
//           timeout: 10000,
//           reconnection: true,
//           reconnectionAttempts: 5
//         });
        
//         setSocket(newSocket);
//         setConnectionAttempts(prev => prev + 1);
        
//         // Set up event listeners
//         newSocket.on('connect', () => {
//           console.log('Connected to notification server');
//           setConnected(true);
          
//           // Authenticate after connection
//           newSocket.emit('authenticate', {
//             token,
//             clientType: 'dashboard'
//           });
//         });
        
//         newSocket.on('disconnect', () => {
//           console.log('Disconnected from notification server');
//           setConnected(false);
//         });
        
//         newSocket.on('connect_error', (error) => {
//           console.error('Connection error:', error);
//           setConnected(false);
//           setConnectionAttempts(prev => prev + 1);
//         });
        
//         newSocket.on('authenticated', (response) => {
//           if (response.success) {
//             console.log('Successfully authenticated with notification server');
//             // Fetch existing notifications
//             newSocket.emit('get-notifications', {
//               clientType: 'dashboard'
//             });
//           } else {
//             console.error('Authentication failed:', response.error);
            
//             // Use Firestore as fallback
//             loadAndProcessFirestoreNotifications();
//           }
//         });
        
//         newSocket.on('notifications-list', (data) => {
//           if (data.notifications && Array.isArray(data.notifications)) {
//             const formattedNotifications = data.notifications.map(formatNotification);
//             setNotifications(formattedNotifications);
//             setUnreadCount(formattedNotifications.filter(n => !n.read).length);
//           }
//         });
        
//         newSocket.on('new-notification', (notification) => {
//           console.log('New notification received:', notification);
          
//           // Skip if it's a duplicate notification
//           if (isDuplicate(notification)) {
//             return;
//           }
          
//           // Save to Firestore to ensure persistence
//           try {
//             // Use the notification ID if available, otherwise Firestore will generate one
//             const notificationRef = notification.id 
//               ? doc(db, 'notifications', notification.id)
//               : doc(collection(db, 'notifications'));
            
//             // If notification has an ID, update the document
//             if (notification.id) {
//               updateDoc(notificationRef, {
//                 ...notification,
//                 recipient: 'dashboard',
//                 receivedAt: new Date(),
//                 processed: true
//               }).catch(error => {
//                 console.error('Error updating notification in Firestore:', error);
//               });
//             } 
//             // Otherwise, create a new document
//             else {
//               const newNotificationId = notificationRef.id;
//               notification.id = newNotificationId;
              
//               // Use setDoc since we already have a reference with ID
//               import('firebase/firestore').then(({ setDoc }) => {
//                 setDoc(notificationRef, {
//                   ...notification,
//                   recipient: 'dashboard',
//                   receivedAt: new Date(),
//                   processed: true
//                 }).catch(error => {
//                   console.error('Error saving notification to Firestore:', error);
//                 });
//               });
//             }
//           } catch (error) {
//             console.error('Error saving notification to Firestore:', error);
//           }
          
//           const formattedNotification = formatNotification(notification);

//           // Add to notifications list and recalculate unread count
//           setNotifications(prev => {
//             // Check if notification already exists
//             const exists = prev.some(n => n.id === formattedNotification.id);
//             if (exists) return prev;
            
//             // Add new notification at the top of the list
//             const updatedNotifications = [formattedNotification, ...prev];
            
//             // Sort notifications to ensure proper order
//             return updatedNotifications.sort((a, b) => {
//               // Unread notifications first
//               if (!a.read && b.read) return -1;
//               if (a.read && !b.read) return 1;
              
//               // Then by timestamp
//               const aTime = a.receivedAt || 0;
//               const bTime = b.receivedAt || 0;
//               return bTime - aTime;
//             });
//           });
          
//           // Separate operation to recalculate the unread count
//           if (!notification.read) {
//             // Using setTimeout to ensure this happens after state updates
//             setTimeout(() => {
//               setNotifications(currentNotifications => {
//                 // Calculate total unread correctly from current state
//                 const totalUnread = currentNotifications.filter(n => !n.read).length;
//                 console.log('Recalculating unread count, found:', totalUnread);
                
//                 // Update the unread count directly
//                 setUnreadCount(totalUnread);
                
//                 // Return unchanged notifications
//                 return currentNotifications;
//               });
//             }, 100);
            
//             // Show toast notification
//             showToastNotification(formattedNotification);
            
//             // Play notification sound
//             try {
//               const audio = new Audio('/notification-sound.mp3');
//               audio.play().catch(e => console.error('Error playing sound:', e));
//             } catch (error) {
//               console.error('Error playing notification sound:', error);
//             }
//           }
//         });
        
//         newSocket.on('notification-updated', (data) => {
//           if (data.success && data.id) {
//             setNotifications(prev => 
//               prev.map(n => 
//                 n.id === data.id ? { ...n, read: true } : n
//               )
//             );
//             setUnreadCount(prev => Math.max(0, prev - 1));
//           }
//         });
        
//         newSocket.on('error', (error) => {
//           console.error('Socket error:', error);
//         });
        
//         return () => {
//           newSocket.disconnect();
//         };
//       } catch (error) {
//         console.error('Error setting up WebSocket:', error);
        
//         // Use Firestore as fallback
//         const unsubscribe = loadAndProcessFirestoreNotifications();
//         return () => unsubscribe();
//       }
//     };
    
//     cleanup = connectSocket();
    
//     return () => {
//       if (typeof cleanup === 'function') {
//         cleanup();
//       }
      
//       if (socket) {
//         socket.disconnect();
//         setSocket(null);
//       }
//     };
//   }, [loadAndProcessFirestoreNotifications, formatNotification, showToastNotification, isDuplicate]);
  
//   // Mark notification as read
//   const markAsRead = useCallback((notificationId) => {
//     if (!notificationId) return;
    
//     // Always update in Firestore to ensure persistence across page refreshes
//     try {
//       updateDoc(doc(db, 'notifications', notificationId), {
//         read: true,
//         lastReadAt: new Date() // Add timestamp when it was read
//       });
//       console.log('Marked notification as read in Firestore:', notificationId);
//     } catch (error) {
//       console.error('Error marking notification as read in Firestore:', error);
//     }
    
//     // Also update via WebSocket if connected
//     if (connected && socket) {
//       socket.emit('mark-read', { notificationId });
//       console.log('Sent mark-read event to WebSocket for:', notificationId);
//     }
    
//     // Optimistically update UI - Don't remove the notification, just mark it as read
//     setNotifications(prev => {
//       const updated = prev.map(n => 
//         n.id === notificationId ? { ...n, read: true } : n
//       );
      
//       // Re-sort to maintain order (unread first, then by time)
//       return updated.sort((a, b) => {
//         if (!a.read && b.read) return -1;
//         if (a.read && !b.read) return 1;
//         const aTime = a.receivedAt || 0;
//         const bTime = b.receivedAt || 0;
//         return bTime - aTime;
//       });
//     });
    
//     setUnreadCount(prev => Math.max(0, prev - 1));
//   }, [connected, socket, db]);
  
//   // Mark all notifications as read
//   const markAllAsRead = useCallback(() => {
//     // Get all unread notification IDs
//     const unreadIds = notifications
//       .filter(n => !n.read)
//       .map(n => n.id);
    
//     if (unreadIds.length === 0) return;
    
//     // Mark each as read in Firestore for persistence
//     unreadIds.forEach(id => {
//       try {
//         updateDoc(doc(db, 'notifications', id), {
//           read: true,
//           lastReadAt: new Date()
//         }).catch(error => {
//           console.error('Error marking notification as read in Firestore:', error);
//         });
        
//         // Also update via WebSocket if connected
//         if (connected && socket) {
//           socket.emit('mark-read', { notificationId: id });
//         }
//       } catch (error) {
//         console.error('Error marking notification as read:', error);
//       }
//     });
    
//     // Optimistically update UI - Don't remove the notifications, just mark them as read
//     const updatedNotifications = notifications.map(n => ({ 
//       ...n, 
//       read: true 
//     }));
    
//     // Set notifications without changing their order
//     setNotifications(updatedNotifications);
//     setUnreadCount(0);
    
//     console.log('Marked all notifications as read. Total notifications still showing:', updatedNotifications.length);
//   }, [notifications, connected, socket, db]);
  
//   // Clear all notifications
//   const clearAllNotifications = useCallback(async () => {
//     if (notifications.length === 0) return;
    
//     try {
//       // Delete all notifications from Firestore
//       const deletePromises = notifications.map(notification => 
//         deleteDoc(doc(db, 'notifications', notification.id))
//       );
      
//       await Promise.all(deletePromises);
      
//       // Clear notifications from state
//       setNotifications([]);
//       setUnreadCount(0);
//     } catch (error) {
//       console.error('Error clearing notifications:', error);
//     }
//   }, [notifications, db]);
  
//   // Toggle sidebar
//   const toggleSidebar = useCallback(() => {
//     setIsOpen(prev => !prev);
//   }, []);
  
//   // Close sidebar
//   const closeSidebar = useCallback(() => {
//     setIsOpen(false);
//   }, []);
  
//   // Open sidebar
//   const openSidebar = useCallback(() => {
//     setIsOpen(true);
//   }, []);
  
//   // Context value
//   const value = {
//     notifications,
//     unreadCount,
//     isOpen,
//     markAsRead,
//     markAllAsRead,
//     clearAllNotifications,
//     toggleSidebar,
//     closeSidebar,
//     openSidebar,
//     connected,
//     showToastNotification // Expose for testing
//   };
  
//   // Render component with a safer ToastContainer configuration
//   return (
//     <NotificationContext.Provider value={value}>
//       {children}
//       <ToastContainer 
//         position="top-left"
//         autoClose={2000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         // pauseOnHover
//         // draggable
//         // theme="light"
//       />
//     </NotificationContext.Provider>
//   );
// };

// export default NotificationContext;

import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, getFirestore, limit, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Modified import to handle the ToastContainer issue
// We'll create a wrapper component for ToastContainer
const SafeToastContainer = (props) => {
  // Using useEffect to safely mount the component
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Small delay to ensure the DOM is ready
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Only render the toast container when ready
  if (!mounted) return null;
  
  // Import the real ToastContainer dynamically to avoid the toggle error
  const { ToastContainer } = require('react-toastify');
  
  return (
    <ToastContainer
      position="top-left"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      style={{ zIndex: 9999 }}
      {...props}
    />
  );
};

// Create the context
const NotificationContext = createContext();

// Server URLs for different environments
const PRODUCTION_URL = 'https://puriserver.onrender.com';
const DEVELOPMENT_URL = 'http://localhost:5000';
const SERVER_URL = process.env.NODE_ENV === 'production' ? PRODUCTION_URL : DEVELOPMENT_URL;

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const db = getFirestore();
  const firestoreUnsubscribeRef = useRef(null);
  const recentNotificationsRef = useRef(new Map()); // Track recently processed notifications
  const shownNotificationsRef = useRef(new Set()); // Track notifications shown in this session

  useEffect(() => {
    const unreadCount = notifications.filter(n => !n.read).length;
    console.log(`Notifications changed, unread count: ${unreadCount}`);
    setUnreadCount(unreadCount);
  }, [notifications]);

  // Format notification data
  const formatNotification = useCallback((notification) => {
    let action = "has sent a notification";
    let target = "";
    let name = notification.senderName || "User";
    let initials = name.split(' ').map(n => n[0]).join('');
    let backgroundColor = '#E5E7EB'; // Default gray
    
    if (notification.type === 'emergency') {
      const emergencyType = notification.emergencyType || notification.data?.emergencyType;
      if (emergencyType) {
        action = `has sent an emergency: ${emergencyType}`;
        backgroundColor = '#FEE2E2'; // Light red for emergencies
      }
    }
    // Handle different notification types
    else if (notification.type === 'support') {
      action = "has raised a support ticket";
      target = notification.data?.category ? `for ${notification.data.category}` : "";
      backgroundColor = '#FEE2E2'; // Light red for support tickets
      
      if (!notification.senderName && notification.data?.phoneNumber) {
        name = notification.data.phoneNumber;
        initials = 'U';
      }
      
      if (!notification.senderName && notification.senderPhone) {
        name = notification.senderPhone;
        initials = 'U';
      }
    } 
    // Handle property listing notifications
    else if (notification.type === 'putOnRent') {
      action = "has requested to list a property";
      target = notification.data?.flatId ? `for flat ID ${notification.data.flatId}` : "";
      backgroundColor = '#DBEAFE'; // Light blue for property listing
      
      if (!notification.senderName && notification.data?.phoneNumber) {
        name = notification.data.phoneNumber;
        initials = 'P';
      }
      
      if (!notification.senderName && notification.senderPhone) {
        name = notification.senderPhone;
        initials = 'P';
      }
    }
    // Handle property search notifications
    else if (notification.type === 'needOnRent') {
      action = "has requested to find a property";
      target = notification.data?.bhkType ? `(${notification.data.bhkType})` : "";
      backgroundColor = '#D1FAE5'; // Light green for property search
      
      if (!notification.senderName && notification.data?.phoneNumber) {
        name = notification.data.phoneNumber;
        initials = 'R';
      }
      
      if (!notification.senderName && notification.senderPhone) {
        name = notification.senderPhone;
        initials = 'R';
      }
    }
    
    // Format time - Fixed to handle various timestamp formats
    let time;
    if (notification.timestamp) {
      try {
        // Handle Firebase timestamp object (has toDate method)
        if (notification.timestamp.toDate) {
          time = formatTimeAgo(notification.timestamp.toDate());
        } 
        // Handle ISO string timestamp
        else if (typeof notification.timestamp === 'string') {
          time = formatTimeAgo(new Date(notification.timestamp));
        } 
        // Handle timestamp number/seconds
        else if (typeof notification.timestamp === 'number') {
          // Check if this is seconds (Firebase timestamp) or milliseconds
          const date = notification.timestamp > 9999999999
            ? new Date(notification.timestamp) // milliseconds
            : new Date(notification.timestamp * 1000); // seconds
          time = formatTimeAgo(date);
        }
        // If none of these, fallback
        else {
          time = 'Recent';
        }
      } catch (err) {
        console.error('Error formatting timestamp:', err, notification.timestamp);
        time = 'Recent';
      }
    } else {
      time = 'Recent';
    }

    // Generate title based on notification type and data
  let title = notification.title || `New ${notification.type || 'notification'}`;
  
  // For emergency notifications, update the title
  if (notification.type === 'emergency' && notification.emergencyType) {
    title = `Emergency: ${notification.emergencyType}`;
  } else if (notification.type === 'emergency' && notification.data?.emergencyType) {
    title = `Emergency: ${notification.data.emergencyType}`;
  }
    
    return {
      id: notification.id,
      name,
      action,
      target,
      time,
      initials,
      backgroundColor,
      read: notification.read || false,
      data: notification.data,
      type: notification.type,
      // title: notification.title || `New ${notification.type || 'notification'}`,
      title,
      receivedAt: Date.now() // Add timestamp when this notification was processed
    };
  }, []);

  // Helper function to format time ago
  const formatTimeAgo = (date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.warn('Invalid date provided to formatTimeAgo', date);
      return 'Recent';
    }
    
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Check if notification is a duplicate
  const isDuplicate = useCallback((notification) => {
    const signature = `${notification.type || ''}-${notification.senderName || ''}-${notification.data?.ticketId || ''}`;
    const now = Date.now();
    const DEDUPLICATION_WINDOW = 10000; // 10 seconds
    
    if (recentNotificationsRef.current.has(signature)) {
      const lastSeen = recentNotificationsRef.current.get(signature);
      if (now - lastSeen < DEDUPLICATION_WINDOW) {
        console.log('Duplicate notification prevented:', signature);
        return true;
      }
    }
    
    // Update record
    recentNotificationsRef.current.set(signature, now);
    
    // Clean up old entries
    for (const [key, timestamp] of recentNotificationsRef.current.entries()) {
      if (now - timestamp > DEDUPLICATION_WINDOW) {
        recentNotificationsRef.current.delete(key);
      }
    }
    
    return false;
  }, []);

  // Show toast notification with simple implementation
  const showToastNotification = useCallback((notification) => {
    console.log('Showing toast notification:', notification);
    
    // Simple debounce mechanism to prevent too many toasts at once
    if (window.toastTimeout) {
      clearTimeout(window.toastTimeout);
    }
    
    window.toastTimeout = setTimeout(() => {
      try {
        // Create a simple toast with only necessary content
        toast(
          <div className="flex items-start gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
              style={{ backgroundColor: notification.backgroundColor || '#E5E7EB' }}
            >
              {notification.initials}
            </div>
            <div>
              <p className="font-medium">{notification.title || 'New notification'}</p>
              <p className="text-sm">
                <span className="font-medium">{notification.name}</span>{' '}
                <span>{notification.action}</span>
                {notification.target && <span> {notification.target}</span>}
              </p>
            </div>
          </div>,
          {
            position: "top-left",
            autoClose: 5000,
            onClick: () => setIsOpen(true)
          }
        );
      } catch (error) {
        console.error('Error showing toast notification:', error);
        // Simple fallback
        toast.info('New notification received');
      }
    }, 300);
  }, []);

  // Load notifications from Firestore
  const loadFirestoreNotifications = useCallback(() => {
    console.log('Loading notifications from Firestore');
    
    // Clean up any existing subscription
    if (firestoreUnsubscribeRef.current) {
      firestoreUnsubscribeRef.current();
      firestoreUnsubscribeRef.current = null;
    }
    
    const q = query(
      collection(db, 'notifications'),
      where('recipient', '==', 'dashboard'),
      orderBy('timestamp', 'desc'), // Most recent notifications first
      limit(50)
    );
    
    try {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newNotifications = [];
        const processedIds = new Set(); // Track IDs to prevent duplicates
        
        snapshot.forEach(doc => {
          const notificationId = doc.id;
          
          // Skip if we've already processed this ID
          if (processedIds.has(notificationId)) return;
          
          // Add ID to processed set
          processedIds.add(notificationId);
          
          // Get notification data with the read status from Firestore
          // to ensure we respect the persistent read status
          const notificationData = doc.data();
          
          newNotifications.push({
            id: notificationId,
            ...notificationData
          });
        });
        
        const formattedNotifications = newNotifications.map(formatNotification);
        
        // Sort notifications to ensure newest are at the top
        formattedNotifications.sort((a, b) => {
          // First sort by read status (unread first)
          if (!a.read && b.read) return -1;
          if (a.read && !b.read) return 1;
          
          // Then by timestamp (most recent first)
          // Use receivedAt as a fallback for consistent sorting
          const aTime = a.receivedAt || 0;
          const bTime = b.receivedAt || 0;
          return bTime - aTime;
        });
        
        setNotifications(formattedNotifications);
        setUnreadCount(formattedNotifications.filter(n => !n.read).length);
      }, (error) => {
        console.error('Error loading Firestore notifications:', error);
      });
      
      firestoreUnsubscribeRef.current = unsubscribe;
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up Firestore listener:', error);
      return () => {};
    }
  }, [db, formatNotification]);

  // Enhanced function to process notifications from Firestore
  const loadAndProcessFirestoreNotifications = useCallback(() => {
    console.log('Loading and processing all Firestore notifications');
    
    // Clean up any existing subscription
    if (firestoreUnsubscribeRef.current) {
      firestoreUnsubscribeRef.current();
      firestoreUnsubscribeRef.current = null;
    }
    
    // Query for all notifications, including fallback ones
    const q = query(
      collection(db, 'notifications'),
      where('recipient', '==', 'dashboard'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    
    try {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newNotifications = [];
        const processedIds = new Set(); // Track IDs to prevent duplicates
        
        // Process all notifications
        snapshot.forEach(async (doc) => {
          const notification = {
            id: doc.id,
            ...doc.data()
          };
          
          // Skip duplicates
          if (processedIds.has(notification.id)) return;
          processedIds.add(notification.id);
          
          // Process any unread notification
          if (!notification.read) {
            console.log('Found unread notification:', notification.id);
            
            // Only show toast if we haven't shown it before during this component lifecycle
            if (!shownNotificationsRef.current.has(notification.id)) {
              // Track that we've shown this notification
              shownNotificationsRef.current.add(notification.id);
              
              // Format and show toast with delay to ensure UI is ready
              const formattedNotification = formatNotification(notification);
              
              setTimeout(() => {
                showToastNotification(formattedNotification);
                
                // Play notification sound
                try {
                  const audio = new Audio('/notification-sound.mp3');
                  audio.play().catch(e => console.error('Error playing sound:', e));
                } catch (error) {
                  console.error('Error playing notification sound:', error);
                }
              }, 800);
              
              // Mark as processed if it's a fallback notification
              if (notification.sentVia === 'fallback' && notification.processed !== true) {
                try {
                  await updateDoc(doc(db, 'notifications', notification.id), {
                    processed: true
                  });
                  console.log('Marked notification as processed:', notification.id);
                } catch (error) {
                  console.error('Error marking notification as processed:', error);
                }
              }
            }
          }
          
          // Add to list for state update
          newNotifications.push(notification);
        });
        
        // Format and update state - MAINTAIN ALL NOTIFICATIONS
        const formattedNotifications = newNotifications.map(formatNotification);
        
        // Update state with all notifications
        setNotifications(prevNotifications => {
          // Create combined array, prioritizing existing notifications
          // to preserve any UI state (like read status)
          const combinedNotifications = [...prevNotifications];
          
          // Add any new notifications that aren't already in the array
          formattedNotifications.forEach(notification => {
            if (!prevNotifications.some(n => n.id === notification.id)) {
              combinedNotifications.push(notification);
            }
          });
          
          console.log(`Total notifications after processing: ${combinedNotifications.length}`);
          
          // Sort notifications to ensure newest are at the top
          return combinedNotifications.sort((a, b) => {
            // First sort by read status (unread first)
            if (!a.read && b.read) return -1;
            if (a.read && !b.read) return 1;
            
            // Then by timestamp (most recent first)
            const aTime = a.receivedAt || 0;
            const bTime = b.receivedAt || 0;
            return bTime - aTime;
          });
        });
        
        // Calculate total unread count from ALL notifications
        const totalUnreadCount = newNotifications.filter(n => !n.read).length;
        
        // Update unread count directly with the total, not incrementally
        setUnreadCount(totalUnreadCount);
        console.log(`Total unread notifications count: ${totalUnreadCount}`);
      }, (error) => {
        console.error('Error loading Firestore notifications:', error);
      });
      
      firestoreUnsubscribeRef.current = unsubscribe;
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up Firestore listener:', error);
      return () => {};
    }
  }, [db, formatNotification, showToastNotification]);

  // Clear up resources when component unmounts
  useEffect(() => {
    return () => {
      // Clean up any subscriptions
      if (firestoreUnsubscribeRef.current) {
        firestoreUnsubscribeRef.current();
      }
    };
  }, []);

  // Initial loading of notifications with delay to avoid race conditions
  useEffect(() => {
    console.log('Initial load of notifications, including fallback');
    
    // Add a delay before loading notifications to avoid race conditions during page refresh
    const timeoutId = setTimeout(() => {
      try {
        const unsubscribe = loadAndProcessFirestoreNotifications();
        
        if (typeof unsubscribe !== 'function') {
          console.warn('Expected unsubscribe to be a function but got:', typeof unsubscribe);
        }
      } catch (error) {
        console.error('Error during initial notification load:', error);
        
        // Retry once more if initial load fails
        setTimeout(() => {
          try {
            loadAndProcessFirestoreNotifications();
          } catch (retryError) {
            console.error('Retry also failed:', retryError);
          }
        }, 2000);
      }
    }, 1000); // 1 second delay
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [loadAndProcessFirestoreNotifications]);
  
  // Use Firestore as fallback if WebSocket fails
  useEffect(() => {
    // If we've tried to connect and failed, or if we're not connected after attempting,
    // use Firestore as fallback
    if (connectionAttempts >= 2 || (!connected && connectionAttempts > 0)) {
      loadAndProcessFirestoreNotifications();
    }
    
    return () => {
      if (firestoreUnsubscribeRef.current) {
        firestoreUnsubscribeRef.current();
      }
    };
  }, [connectionAttempts, connected, loadAndProcessFirestoreNotifications]);

  // Initialize WebSocket connection
  useEffect(() => {
    let socketInitialized = false;
    let cleanup = null;
    
    const connectSocket = async () => {
      if (socketInitialized) return;
      socketInitialized = true;
      
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) {
          console.log('No user signed in, using Firestore fallback');
          const unsubscribe = loadAndProcessFirestoreNotifications();
          return () => unsubscribe();
        }
        
        // Get token for authentication
        const token = await user.getIdToken();
        
        // Initialize socket
        console.log(`Connecting to notification server: ${SERVER_URL}`);
        const newSocket = io(SERVER_URL, {
          transports: ['websocket'],
          timeout: 10000,
          reconnection: true,
          reconnectionAttempts: 5
        });
        
        setSocket(newSocket);
        setConnectionAttempts(prev => prev + 1);
        
        // Set up event listeners
        newSocket.on('connect', () => {
          console.log('Connected to notification server');
          setConnected(true);
          
          // Authenticate after connection
          newSocket.emit('authenticate', {
            token,
            clientType: 'dashboard'
          });
        });
        
        newSocket.on('disconnect', () => {
          console.log('Disconnected from notification server');
          setConnected(false);
        });
        
        newSocket.on('connect_error', (error) => {
          console.error('Connection error:', error);
          setConnected(false);
          setConnectionAttempts(prev => prev + 1);
        });
        
        newSocket.on('authenticated', (response) => {
          if (response.success) {
            console.log('Successfully authenticated with notification server');
            // Fetch existing notifications
            newSocket.emit('get-notifications', {
              clientType: 'dashboard'
            });
          } else {
            console.error('Authentication failed:', response.error);
            
            // Use Firestore as fallback
            loadAndProcessFirestoreNotifications();
          }
        });
        
        newSocket.on('notifications-list', (data) => {
          if (data.notifications && Array.isArray(data.notifications)) {
            const formattedNotifications = data.notifications.map(formatNotification);
            setNotifications(formattedNotifications);
            setUnreadCount(formattedNotifications.filter(n => !n.read).length);
          }
        });
        
        newSocket.on('new-notification', (notification) => {
          console.log('New notification received:', notification);
          
          // Skip if it's a duplicate notification
          if (isDuplicate(notification)) {
            return;
          }
          
          // Save to Firestore to ensure persistence
          try {
            // Use the notification ID if available, otherwise Firestore will generate one
            const notificationRef = notification.id 
              ? doc(db, 'notifications', notification.id)
              : doc(collection(db, 'notifications'));
            
            // If notification has an ID, update the document
            if (notification.id) {
              updateDoc(notificationRef, {
                ...notification,
                recipient: 'dashboard',
                receivedAt: new Date(),
                processed: true
              }).catch(error => {
                console.error('Error updating notification in Firestore:', error);
              });
            } 
            // Otherwise, create a new document
            else {
              const newNotificationId = notificationRef.id;
              notification.id = newNotificationId;
              
              // Use setDoc since we already have a reference with ID
              import('firebase/firestore').then(({ setDoc }) => {
                setDoc(notificationRef, {
                  ...notification,
                  recipient: 'dashboard',
                  receivedAt: new Date(),
                  processed: true
                }).catch(error => {
                  console.error('Error saving notification to Firestore:', error);
                });
              });
            }
          } catch (error) {
            console.error('Error saving notification to Firestore:', error);
          }
          
          const formattedNotification = formatNotification(notification);

          // Add to notifications list and recalculate unread count
          setNotifications(prev => {
            // Check if notification already exists
            const exists = prev.some(n => n.id === formattedNotification.id);
            if (exists) return prev;
            
            // Add new notification at the top of the list
            const updatedNotifications = [formattedNotification, ...prev];
            
            // Sort notifications to ensure proper order
            return updatedNotifications.sort((a, b) => {
              // Unread notifications first
              if (!a.read && b.read) return -1;
              if (a.read && !b.read) return 1;
              
              // Then by timestamp
              const aTime = a.receivedAt || 0;
              const bTime = b.receivedAt || 0;
              return bTime - aTime;
            });
          });
          
          // Separate operation to recalculate the unread count
          if (!notification.read) {
            // Using setTimeout to ensure this happens after state updates
            setTimeout(() => {
              setNotifications(currentNotifications => {
                // Calculate total unread correctly from current state
                const totalUnread = currentNotifications.filter(n => !n.read).length;
                console.log('Recalculating unread count, found:', totalUnread);
                
                // Update the unread count directly
                setUnreadCount(totalUnread);
                
                // Return unchanged notifications
                return currentNotifications;
              });
            }, 100);
            
            // Show toast notification
            showToastNotification(formattedNotification);
            
            // Play notification sound
            try {
              const audio = new Audio('/notification-sound.mp3');
              audio.play().catch(e => console.error('Error playing sound:', e));
            } catch (error) {
              console.error('Error playing notification sound:', error);
            }
          }
        });
        
        newSocket.on('notification-updated', (data) => {
          if (data.success && data.id) {
            setNotifications(prev => 
              prev.map(n => 
                n.id === data.id ? { ...n, read: true } : n
              )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
          }
        });
        
        newSocket.on('error', (error) => {
          console.error('Socket error:', error);
        });
        
        return () => {
          newSocket.disconnect();
        };
      } catch (error) {
        console.error('Error setting up WebSocket:', error);
        
        // Use Firestore as fallback
        const unsubscribe = loadAndProcessFirestoreNotifications();
        return () => unsubscribe();
      }
    };
    
    cleanup = connectSocket();
    
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
      
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    };
  }, [loadAndProcessFirestoreNotifications, formatNotification, showToastNotification, isDuplicate]);
  
  // Mark notification as read
  const markAsRead = useCallback((notificationId) => {
    if (!notificationId) return;
    
    // Always update in Firestore to ensure persistence across page refreshes
    try {
      updateDoc(doc(db, 'notifications', notificationId), {
        read: true,
        lastReadAt: new Date() // Add timestamp when it was read
      });
      console.log('Marked notification as read in Firestore:', notificationId);
    } catch (error) {
      console.error('Error marking notification as read in Firestore:', error);
    }
    
    // Also update via WebSocket if connected
    if (connected && socket) {
      socket.emit('mark-read', { notificationId });
      console.log('Sent mark-read event to WebSocket for:', notificationId);
    }
    
    // Optimistically update UI - Don't remove the notification, just mark it as read
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      
      // Re-sort to maintain order (unread first, then by time)
      return updated.sort((a, b) => {
        if (!a.read && b.read) return -1;
        if (a.read && !b.read) return 1;
        const aTime = a.receivedAt || 0;
        const bTime = b.receivedAt || 0;
        return bTime - aTime;
      });
    });
    
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, [connected, socket, db]);
  
  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    // Get all unread notification IDs
    const unreadIds = notifications
      .filter(n => !n.read)
      .map(n => n.id);
    
    if (unreadIds.length === 0) return;
    
    // Mark each as read in Firestore for persistence
    unreadIds.forEach(id => {
      try {
        updateDoc(doc(db, 'notifications', id), {
          read: true,
          lastReadAt: new Date()
        }).catch(error => {
          console.error('Error marking notification as read in Firestore:', error);
        });
        
        // Also update via WebSocket if connected
        if (connected && socket) {
          socket.emit('mark-read', { notificationId: id });
        }
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    });
    
    // Optimistically update UI - Don't remove the notifications, just mark them as read
    const updatedNotifications = notifications.map(n => ({ 
      ...n, 
      read: true 
    }));
    
    // Set notifications without changing their order
    setNotifications(updatedNotifications);
    setUnreadCount(0);
    
    console.log('Marked all notifications as read. Total notifications still showing:', updatedNotifications.length);
  }, [notifications, connected, socket, db]);
  
  // Clear all notifications
  const clearAllNotifications = useCallback(async () => {
    if (notifications.length === 0) return;
    
    try {
      // Delete all notifications from Firestore
      const deletePromises = notifications.map(notification => 
        deleteDoc(doc(db, 'notifications', notification.id))
      );
      
      await Promise.all(deletePromises);
      
      // Clear notifications from state
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }, [notifications, db]);
  
  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  
  // Close sidebar
  const closeSidebar = useCallback(() => {
    setIsOpen(false);
  }, []);
  
  // Open sidebar
  const openSidebar = useCallback(() => {
    setIsOpen(true);
  }, []);
  
  // Context value
  const value = {
    notifications,
    unreadCount,
    isOpen,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    connected,
    showToastNotification // Expose for testing
  };
  
  // Render component with our SafeToastContainer wrapper
  return (
    <NotificationContext.Provider value={value}>
      {children}
      <SafeToastContainer />
    </NotificationContext.Provider>
  );
};