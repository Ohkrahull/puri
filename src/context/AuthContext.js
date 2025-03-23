// // // // import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
// // // // import { loginUser, getStaffUser } from '../firebase/services/UserService';
// // // // import { fetchAllBookings, deleteBooking as deleteBookingService, updateBooking as updateBookingService } from '../firebase/services/bookingsData';
// // // // import { toast } from 'react-toastify';
// // // // // import { sendPasswordResetEmail } from 'firebase/auth';

// // // // const AuthContext = createContext();

// // // // export const useAuth = () => useContext(AuthContext);

// // // // export const AuthProvider = ({ children }) => {
// // // //   const [user, setUser] = useState(null);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [bookings, setBookings] = useState([]);

// // // //   useEffect(() => {
// // // //     const storedUserId = localStorage.getItem('userId');
// // // //     if (storedUserId) {
// // // //       getStaffUser(storedUserId).then(userData => {
// // // //         if (userData) {
// // // //           setUser(userData);
// // // //         } else {
// // // //           localStorage.removeItem('userId');
// // // //         }
// // // //         setLoading(false);
// // // //       }).catch(error => {
// // // //         console.error('Error fetching user data:', error);
// // // //         localStorage.removeItem('userId');
// // // //         setLoading(false);
// // // //       });
// // // //     } else {
// // // //       setLoading(false);
// // // //     }
// // // //   }, []);

// // // //   const login = async (email, password) => {
// // // //     try {
// // // //       const user = await loginUser(email, password);
// // // //       setUser(user);
// // // //       localStorage.setItem('userId', user.id);
// // // //       return user;
// // // //     } catch (error) {
// // // //       console.error('Login error:', error);
// // // //       throw error;
// // // //     }
// // // //   };

// // // //   const logout = () => {
// // // //     setUser(null);
// // // //     setBookings([]);
// // // //     localStorage.removeItem('userId');
// // // //   };

// // // //   // const sendPasswordReset = async (email) => {
// // // //   //   try {
// // // //   //     await sendPasswordResetEmail(email);
// // // //   //     toast.success('Password reset link sent to your email.');
// // // //   //     return true;
// // // //   //   } catch (error) {
// // // //   //     console.error('Password reset error:', error);
// // // //   //     toast.error('Failed to send password reset link. Please try again.');
// // // //   //     throw error;
// // // //   //   }
// // // //   // };

// // // //   const fetchAllBookingsData = useCallback(() => {
// // // //     return fetchAllBookings((fetchedBookings) => {
// // // //       setBookings(fetchedBookings);
// // // //     });
// // // //   }, []);

// // // //   const deleteBookingHandler = async (bookingId) => {
// // // //     try {
// // // //       await deleteBookingService(bookingId);
// // // //       setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
// // // //     } catch (error) {
// // // //       console.error('Error deleting booking:', error);
// // // //       throw error;
// // // //     }
// // // //   };

// // // //   const updateBookingHandler = async (bookingId, updatedBooking) => {
// // // //     try {
// // // //       await updateBookingService(bookingId, updatedBooking);
// // // //       setBookings(prevBookings => prevBookings.map(booking => 
// // // //         booking.id === bookingId ? { ...booking, ...updatedBooking } : booking
// // // //       ));
// // // //     } catch (error) {
// // // //       console.error('Error updating booking:', error);
// // // //       throw error;
// // // //     }
// // // //   };

// // // //   useEffect(() => {
// // // //     if (user) {
// // // //       const unsubscribe = fetchAllBookingsData();
// // // //       return () => unsubscribe();
// // // //     }
// // // //   }, [user, fetchAllBookingsData]);

// // // //   const value = {
// // // //     user,
// // // //     loading,
// // // //     login,
// // // //     logout,
// // // //     bookings,
// // // //     fetchAllBookings: fetchAllBookingsData,
// // // //     deleteBooking: deleteBookingHandler,
// // // //     updateBooking: updateBookingHandler,
// // // //     // sendPasswordReset, // Add this new function to the context
// // // //   };

// // // //   return (
// // // //     <AuthContext.Provider value={value}>
// // // //       {children}
// // // //     </AuthContext.Provider>
// // // //   );
// // // // };

// // // // export default AuthProvider;import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

// // // import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

// // // import { signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
// // // import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
// // // import { toast } from 'react-toastify';
// // // import { auth, db } from '../firebase/firebase';
// // // import { fetchAllBookings, deleteBooking as deleteBookingService, updateBooking as updateBookingService, fetchAuthorizedUserDetails } from '../firebase/services/bookingsData';
// // // import { fetchAllSpecialRequests } from '../firebase/services/SpecialRequests';
// // // import { getAllAuthorizedUsers } from '../firebase/services/UserData';
// // // import { getAllStaffUsers, getGuestUserData } from '../firebase/services/UserService';
// // // import { fetchAllReferrals } from '../firebase/services/Referals';
// // // import { getToken, onMessage } from 'firebase/messaging';
// // // import {messaging} from '../firebase/firebase'

// // // const AuthContext = createContext();

// // // export const useAuth = () => useContext(AuthContext);

// // // export const AuthProvider = ({ children }) => {
// // //   const [user, setUser] = useState(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [bookings, setBookings] = useState([]);
// // //   const [documents, setDocuments] = useState([]);
// // //   const [constructionUpdates, setConstructionUpdates] = useState([]);
// // //   const [feedbackData, setFeedbackData] = useState([]);
// // //   const [specialRequests, setSpecialRequests] = useState([]);
// // //   const [authorizedUsers, setAuthorizedUsers] = useState([]);
// // //   const [staffUsers, setStaffUsers] = useState([]);
// // //   const [guestUsers, setGuestUsers] = useState([]);
// // //   const [referrals, setReferrals] = useState([]);
// // //   const [fcmToken, setFcmToken] = useState(null);
// // //   const [notificationPermission, setNotificationPermission] = useState('default');


  
// // // // Add useEffect for permission status
// // // // useEffect(() => {
// // // //   // Check notification permission status on component mount
// // // //   if ('Notification' in window) {
// // // //     setNotificationPermission(Notification.permission);
// // // //   }
// // // // }, []);

// // // // // Add useEffect for permission status
// // // // useEffect(() => {
// // // //   // Check notification permission status on component mount
// // // //   if ('Notification' in window) {
// // // //     setNotificationPermission(Notification.permission);
// // // //   }
// // // // }, []);




// // // const saveTokenToServer = async (phoneNumber, token) => {
// // //   try {
// // //     // Make sure you have the API endpoint correct
// // //     const response = await fetch('http://localhost:5000/api/save-token', {
// // //       method: 'POST',
// // //       headers: {
// // //         'Content-Type': 'application/json',
// // //       },
// // //       body: JSON.stringify({
// // //         phoneNumber,
// // //         token,
// // //         userType: 'dashboard', // This identifies it's a dashboard user
// // //         deviceType: detectDeviceType()
// // //       }),
// // //     });

// // //     const data = await response.json();
    
// // //     if (data.success) {
// // //       console.log('Token saved to server successfully');
// // //       return true;
// // //     } else {
// // //       console.error('Server responded with error:', data.error);
// // //       return false;
// // //     }
// // //   } catch (error) {
// // //     console.error('Error saving token to server:', error);
// // //     return false;
// // //   }
// // // };

// // // const setupNotifications = useCallback(async () => {
// // //   try {
// // //     if (!('serviceWorker' in navigator)) {
// // //       console.error('Service Worker not supported in this browser');
// // //       return null;
// // //     }

// // //     // First, check if we have a cached token in localStorage
// // //     const cachedToken = localStorage.getItem('fcmToken');
// // //     const tokenTimestamp = localStorage.getItem('fcmTokenTimestamp');
// // //     const currentTime = new Date().getTime();
    
// // //     // If we have a valid cached token that's less than 24 hours old, use it
// // //     if (cachedToken && tokenTimestamp && 
// // //         (currentTime - parseInt(tokenTimestamp) < 24 * 60 * 60 * 1000)) {
// // //       console.log('Using cached FCM token');
// // //       setFcmToken(cachedToken);
      
// // //       // Still try to save the token to the server if user data is available
// // //       if (user && (user.phoneNumber || user.id)) {
// // //         saveTokenToServer(user.phoneNumber || user.id, cachedToken)
// // //           .catch(err => console.error('Error saving cached token:', err));
// // //       }
      
// // //       // Set up message listener for the cached token
// // //       setupMessageListener();
      
// // //       return cachedToken;
// // //     }

// // //     // If no valid cached token, continue with normal flow
// // //     // Request notification permission first
// // //     const permission = await Notification.requestPermission();
// // //     setNotificationPermission(permission);
    
// // //     if (permission !== 'granted') {
// // //       console.log('Notification permission denied');
// // //       return null;
// // //     }

// // //     // Register service worker
// // //     try {
// // //       const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
// // //       console.log('Service Worker registered', registration);

// // //       // The VAPID key for Firebase messaging
// // //       const VAPID_KEY = 'BMETtHPaVBg0SmHdlRbtbOsCzECXq7BlCK3SaicLkTF79sr0f7pNu1ixiPlbTnV8oaymZocLOoSAir6Qff4hl';

// // //       // Implement exponential backoff for token generation
// // //       let retries = 0;
// // //       const maxRetries = 3;
// // //       const getTokenWithRetry = async () => {
// // //         try {
// // //           // Attempt to get the token
// // //           const token = await getToken(messaging, {
// // //             vapidKey: VAPID_KEY,
// // //             serviceWorkerRegistration: registration
// // //           });
          
// // //           if (token) {
// // //             // Cache the token in localStorage
// // //             localStorage.setItem('fcmToken', token);
// // //             localStorage.setItem('fcmTokenTimestamp', new Date().getTime().toString());
            
// // //             console.log('FCM Token obtained:', token);
// // //             setFcmToken(token);
            
// // //             // Save to server if user data is available
// // //             if (user && (user.phoneNumber || user.id)) {
// // //               await saveTokenToServer(user.phoneNumber || user.id, token);
// // //             }
            
// // //             // Set up message listener
// // //             setupMessageListener();
            
// // //             return token;
// // //           } else {
// // //             console.error('No FCM token received');
// // //             return null;
// // //           }
// // //         } catch (error) {
// // //           // Check if it's a quota error
// // //           if (error.code === 'messaging/token-subscribe-failed' && retries < maxRetries) {
// // //             // Increment retry counter
// // //             retries++;
            
// // //             // Calculate delay with exponential backoff (1s, 2s, 4s, etc.)
// // //             const delay = Math.pow(2, retries) * 1000;
// // //             console.log(`FCM token request failed. Retrying in ${delay/1000} seconds...`);
            
// // //             // Wait and retry
// // //             await new Promise(resolve => setTimeout(resolve, delay));
// // //             return getTokenWithRetry();
// // //           }
          
// // //           // If not a quota error or max retries reached, try to use the cached token as fallback
// // //           if (cachedToken) {
// // //             console.warn('Using cached token as fallback after error:', error);
// // //             setFcmToken(cachedToken);
// // //             setupMessageListener();
// // //             return cachedToken;
// // //           }
          
// // //           // Otherwise, propagate the error
// // //           throw error;
// // //         }
// // //       };
      
// // //       return await getTokenWithRetry();
// // //     } catch (error) {
// // //       console.error('Error getting FCM token:', error);
      
// // //       // If service worker or token generation fails, still try to use cached token as last resort
// // //       if (cachedToken) {
// // //         console.warn('Using cached token after service worker error');
// // //         setFcmToken(cachedToken);
// // //         setupMessageListener();
// // //         return cachedToken;
// // //       }
      
// // //       return null;
// // //     }
// // //   } catch (error) {
// // //     console.error('Error setting up notifications:', error);
// // //     return null;
// // //   }
// // // }, [user, saveTokenToServer]);

// // // const setupMessageListener = () => {
// // //   if (!messaging) return;
  
// // //   onMessage(messaging, (payload) => {
// // //     console.log('Message received in foreground:', payload);
// // //     // Display the notification
// // //     if (payload.notification) {
// // //       new Notification(payload.notification.title, {
// // //         body: payload.notification.body,
// // //         icon: '/logo192.png'
// // //       });
// // //     }
// // //   });
// // // };
// // // // const setupNotifications = useCallback(async (uid) => {
// // // //   try {
// // // //     if (!('serviceWorker' in navigator)) {
// // // //       console.error('Service Worker not supported in this browser');
// // // //       return null;
// // // //     }

// // // //     // Ensure the service worker is registered
// // // //     const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
// // // //     console.log('Service Worker registered', registration);

// // // //     // Request notification permission
// // // //     const permission = await Notification.requestPermission();
// // // //     if (permission !== 'granted') {
// // // //       console.log('Notification permission denied');
// // // //       return null;
// // // //     }

// // // //     // The VAPID key should match the one in your server
// // // //     const VAPID_KEY = 'BMETtHPaVBg0SmHdlRbtbOsCzECXq7BlCK3SaicLkTF79sr0f7pNu1ixiPlbTnV8oaymZocLOoSAir6Qff4hl';

// // // //     try {
// // // //       // Get the token directly with the getToken function
// // // //       const currentToken = await getToken(messaging, {
// // // //         vapidKey: VAPID_KEY,
// // // //         serviceWorkerRegistration: registration
// // // //       });

// // // //       if (currentToken) {
// // // //         console.log('FCM Token obtained:', currentToken);
// // // //         setFcmToken(currentToken);
        
// // // //         // We need to get the user's phone number
// // // //         if (user && user.phoneNumber) {
// // // //           // Save token to server using the phone number as ID
// // // //           await saveTokenToServer(user.phoneNumber, currentToken);
// // // //         } else if (user && user.id) {
// // // //           // If no phone number is available, use the user ID
// // // //           console.log('No phone number available, using user ID instead');
// // // //           await saveTokenToServer(user.id, currentToken);
// // // //         } else {
// // // //           console.error('No user ID or phone number available to save token');
// // // //         }
        
// // // //         // Set up the message listener for foreground notifications
// // // //         onMessage(messaging, (payload) => {
// // // //           console.log('Message received in foreground:', payload);
// // // //           // You can handle the notification display here
// // // //           new Notification(payload.notification.title, {
// // // //             body: payload.notification.body,
// // // //             icon: '/logo192.png'
// // // //           });
// // // //         });
        
// // // //         return currentToken;
// // // //       } else {
// // // //         console.error('No FCM token received');
// // // //         return null;
// // // //       }
// // // //     } catch (tokenError) {
// // // //       console.error('Error getting FCM token:', tokenError);
// // // //       return null;
// // // //     }
// // // //   } catch (error) {
// // // //     console.error('Error setting up notifications:', error);
// // // //     return null;
// // // //   }
// // // // }, [user]); // Add user to dependencies
// // // // Modified auth state observer
// // // // useEffect(() => {
// // // //   const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
// // // //     if (firebaseUser) {
// // // //       try {
// // // //         const userData = await getUserDataByEmail(firebaseUser.email);
// // // //         const fullUserData = { ...firebaseUser, ...userData };
// // // //         setUser(fullUserData);
        
// // // //         // Wait a moment to ensure user data is fully loaded before setting up notifications
// // // //         setTimeout(async () => {
// // // //           // Set up FCM notifications after user authentication
// // // //           if (fullUserData && fullUserData.phoneNumber) {
// // // //             const token = await setupNotifications();
// // // //             console.log('Notification setup complete for user:', fullUserData.phoneNumber);
// // // //           } else {
// // // //             console.log('User has no phone number, using user ID for token storage');
// // // //             await setupNotifications();
// // // //           }
// // // //         }, 1000);
// // // //       } catch (error) {
// // // //         console.error("Error fetching user data:", error);
// // // //         setUser(null);
// // // //       }
// // // //     } else {
// // // //       setUser(null);
// // // //       setFcmToken(null);
// // // //     }
// // // //     setLoading(false);
// // // //   });

// // // //   return () => unsubscribe();
// // // // }, [setupNotifications]);

// // // // Add a function to request notification permissions explicitly
// // // const requestNotificationPermission = async () => {
// // //   try {
// // //     if (!('Notification' in window)) {
// // //       console.log('This browser does not support notifications');
// // //       return false;
// // //     }
    
// // //     const permission = await Notification.requestPermission();
// // //     setNotificationPermission(permission);
    
// // //     if (permission === 'granted') {
// // //       const token = await setupNotifications();
// // //       return !!token;
// // //     }
    
// // //     return false;
// // //   } catch (error) {
// // //     console.error('Error requesting notification permission:', error);
// // //     return false;
// // //   }
// // // };

  
  
// // //   // Helper function to detect device type
// // //   const detectDeviceType = () => {
// // //     const ua = navigator.userAgent;
// // //     if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
// // //       return 'tablet';
// // //     }
// // //     if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
// // //       return 'mobile';
// // //     }
// // //     return 'desktop';
// // //   };
// // //   // Update your setupNotifications function

  
// // //   // const setupNotifications = useCallback(async (uid) => {
// // //   //   try {
// // //   //     if (!('serviceWorker' in navigator)) {
// // //   //       console.error('Service Worker not supported in this browser');
// // //   //       return null;
// // //   //     }
  
// // //   //     // Ensure the service worker is registered
// // //   //     const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
// // //   //     console.log('Service Worker registered', registration);
  
// // //   //     // Request notification permission
// // //   //     const permission = await Notification.requestPermission();
// // //   //     if (permission !== 'granted') {
// // //   //       console.log('Notification permission denied');
// // //   //       return null;
// // //   //     }
  
// // //   //     // The VAPID key MUST be hardcoded here for testing
// // //   //     const VAPID_KEY = 'BMETtHPaVBg0SmHdlRbtbOsCzECXq7BlCK3SaicLkTF79sr0f7pNu1ixiPlbTnV8oaymZocLOoSAir6Qff4hl';
  
// // //   //     try {
// // //   //       // Get the token directly with the getToken function
// // //   //       const currentToken = await getToken(messaging, {
// // //   //         vapidKey: VAPID_KEY,
// // //   //         serviceWorkerRegistration: registration
// // //   //       });
  
// // //   //       if (currentToken) {
// // //   //         console.log('FCM Token obtained:', currentToken);
// // //   //         setFcmToken(currentToken);
          
// // //   //         // Set up the message listener for foreground notifications
// // //   //         onMessage(messaging, (payload) => {
// // //   //           console.log('Message received in foreground:', payload);
// // //   //           // You can handle the notification display here
// // //   //           new Notification(payload.notification.title, {
// // //   //             body: payload.notification.body,
// // //   //             icon: '/logo192.png'
// // //   //           });
// // //   //         });
          
// // //   //         return currentToken;
// // //   //       } else {
// // //   //         console.error('No FCM token received');
// // //   //         return null;
// // //   //       }
// // //   //     } catch (tokenError) {
// // //   //       console.error('Error getting FCM token:', tokenError);
// // //   //       return null;
// // //   //     }
// // //   //   } catch (error) {
// // //   //     console.error('Error setting up notifications:', error);
// // //   //     return null;
// // //   //   }
// // //   // }, []);

// // //   const getUserDataByEmail = async (email) => {
// // //     const staffUsersRef = collection(db, 'staffUsers');
// // //     const q = query(staffUsersRef, where("email", "==", email));
// // //     const querySnapshot = await getDocs(q);

// // //     if (!querySnapshot.empty) {
// // //       const userDoc = querySnapshot.docs[0];
// // //       return { id: userDoc.id, ...userDoc.data() };
// // //     } else {
// // //       throw new Error("User not found in staff database");
// // //     }
// // //   };

// // //   // useEffect(() => {
// // //   //   const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
// // //   //     if (firebaseUser) {
// // //   //       try {
// // //   //         const userData = await getUserDataByEmail(firebaseUser.email);
// // //   //         setUser({ ...firebaseUser, ...userData });
// // //   //       } catch (error) {
// // //   //         console.error("Error fetching user data:", error);
// // //   //         setUser(null);
// // //   //       }
// // //   //     } else {
// // //   //       setUser(null);
// // //   //     }
// // //   //     setLoading(false);
// // //   //   });

// // //   //   return () => unsubscribe();
// // //   // }, []); // Empty dependency array ensures this effect runs only once
// // //   useEffect(() => {
// // //     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
// // //       if (firebaseUser) {
// // //         try {
// // //           const userData = await getUserDataByEmail(firebaseUser.email);
// // //           setUser({ ...firebaseUser, ...userData });
          
// // //           // Set up FCM notifications after user authentication
// // //           await setupNotifications(firebaseUser.uid);
// // //         } catch (error) {
// // //           console.error("Error fetching user data:", error);
// // //           setUser(null);
// // //         }
// // //       } else {
// // //         setUser(null);
// // //       }
// // //       setLoading(false);
// // //     });
  
// // //     return () => unsubscribe();
// // //   }, [setupNotifications]); // Add setupNotifications to dependencies

// // //   const login = async (email, password) => {
// // //     try {
// // //       const userCredential = await signInWithEmailAndPassword(auth, email, password);
// // //       const userData = await getUserDataByEmail(email);
// // //       const fullUserData = { ...userCredential.user, ...userData };
// // //       setUser(fullUserData);
// // //       return fullUserData;
// // //     } catch (error) {
// // //       console.error('Login error:', error);
// // //       throw error;
// // //     }
// // //   };

// // //   const logout = async () => {
// // //     try {
// // //       await signOut(auth);
// // //       setUser(null);
// // //       // toast.success('Logged out successfully');
// // //     } catch (error) {
// // //       console.error('Logout error:', error);
// // //       toast.error('Failed to logout');
// // //     }
// // //   };

// // //   const sendPasswordReset = async (email) => {
// // //     try {
// // //       await sendPasswordResetEmail(auth, email);
// // //       toast.success('Password reset link sent to your email.');
// // //       return true;
// // //     } catch (error) {
// // //       console.error('Password reset error:', error);
// // //       toast.error('Failed to send password reset link. Please try again.');
// // //       throw error;
// // //     }
// // //   };

// // //   const fetchAllBookingsData = useCallback(() => {
// // //     return fetchAllBookings((fetchedBookings) => {
// // //       setBookings(fetchedBookings);
// // //     });
// // //   }, []);

// // //   const deleteBookingHandler = async (bookingId) => {
// // //     try {
// // //       await deleteBookingService(bookingId);
// // //       setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
// // //     } catch (error) {
// // //       console.error('Error deleting booking:', error);
// // //       throw error;
// // //     }
// // //   };

// // //   const updateBookingHandler = async (bookingId, updatedBooking) => {
// // //     try {
// // //       await updateBookingService(bookingId, updatedBooking);
// // //       setBookings(prevBookings => prevBookings.map(booking => 
// // //         booking.id === bookingId ? { ...booking, ...updatedBooking } : booking
// // //       ));
// // //     } catch (error) {
// // //       console.error('Error updating booking:', error);
// // //       throw error;
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     if (user) {
// // //       const unsubscribe = fetchAllBookingsData();
// // //       return () => unsubscribe();
// // //     }
// // //   }, [user, fetchAllBookingsData]);

// // //   const fetchDocuments = useCallback(async (documentType) => {
// // //     try {
// // //       const q = query(
// // //         collection(db, 'documents'),
// // //         where('documentType', '==', documentType)
// // //       );
// // //       const querySnapshot = await getDocs(q);
// // //       const fetchedDocumentsPromises = querySnapshot.docs.map(async doc => {
// // //         const documentData = {
// // //           id: doc.id,
// // //           ...doc.data()
// // //         };
        
// // //         // Fetch user details for each document
// // //         const userDetails = await fetchAuthorizedUserDetails(documentData.phoneNumber);
        
// // //         return {
// // //           ...documentData,
// // //           userInfo: userDetails
// // //         };
// // //       });

// // //       const fetchedDocuments = await Promise.all(fetchedDocumentsPromises);
      
// // //       // Sort documents by uploadDate in descending order
// // //       const sortedDocuments = fetchedDocuments.sort((a, b) => 
// // //         b.uploadDate.toDate() - a.uploadDate.toDate()
// // //       );

// // //       setDocuments(sortedDocuments);
// // //       return sortedDocuments;
// // //     } catch (error) {
// // //       console.error("Error fetching documents:", error);
// // //       throw error;
// // //     }
// // //   }, []);

// // //   const fetchConstructionUpdates = useCallback(async () => {
// // //     try {
// // //       const q = query(collection(db, 'constructionUpdates'));
// // //       const querySnapshot = await getDocs(q);
// // //       const fetchedUpdates = querySnapshot.docs.map(doc => ({
// // //         id: doc.id,
// // //         ...doc.data()
// // //       }));
// // //       setConstructionUpdates(fetchedUpdates);
// // //       return fetchedUpdates;
// // //     } catch (error) {
// // //       console.error("Error fetching construction updates:", error);
// // //       throw error;
// // //     }
// // //   }, []);

// // //   const fetchFeedback = useCallback(async () => {
// // //     try {
// // //       const q = query(collection(db, 'feedback'));
// // //       const querySnapshot = await getDocs(q);
// // //       const fetchedFeedbackPromises = querySnapshot.docs.map(async doc => {
// // //         const feedbackData = {
// // //           id: doc.id,
// // //           ...doc.data()
// // //         };
        
// // //         // Fetch user details for each feedback entry
// // //         const userDetails = await fetchAuthorizedUserDetails(feedbackData.phoneNumber);
        
// // //         return {
// // //           ...feedbackData,
// // //           userInfo: userDetails
// // //         };
// // //       });

// // //       const fetchedFeedback = await Promise.all(fetchedFeedbackPromises);
      
// // //       // Sort feedback by createdAt in descending order (assuming there's a createdAt field)
// // //       const sortedFeedback = fetchedFeedback.sort((a, b) => 
// // //         b.createdAt.toDate() - a.createdAt.toDate()
// // //       );

// // //       setFeedbackData(sortedFeedback);
// // //       return sortedFeedback;
// // //     } catch (error) {
// // //       console.error("Error fetching feedback:", error);
// // //       throw error;
// // //     }
// // //   }, []);

// // //   const fetchSpecialRequests = useCallback(async () => {
// // //     try {
// // //       const fetchedRequests = await fetchAllSpecialRequests();
// // //       const users = await getAllAuthorizedUsers();
// // //       setAuthorizedUsers(users);
      
// // //       const requestsWithUserInfo = fetchedRequests.map(request => {
// // //         const authorizedUser = users.find(user => user.phoneNumber === request.phoneNumber);
// // //         return {
// // //           ...request,
// // //           userInfo: authorizedUser || null
// // //         };
// // //       });
      
// // //       setSpecialRequests(requestsWithUserInfo);
// // //       return requestsWithUserInfo;
// // //     } catch (error) {
// // //       console.error("Error fetching special requests:", error);
// // //       throw error;
// // //     }
// // //   }, []);

// // //   const fetchMembers = useCallback(async () => {
// // //     try {
// // //       const members = await getAllAuthorizedUsers();
// // //       setAuthorizedUsers(members);
// // //       return members;
// // //     } catch (error) {
// // //       console.error("Error fetching members:", error);
// // //       throw error;
// // //     }
// // //   }, []);

// // //   const fetchStaff = useCallback(async () => {
// // //     try {
// // //       const staff = await getAllStaffUsers();
// // //       setStaffUsers(staff);
// // //       return staff;
// // //     } catch (error) {
// // //       console.error("Error fetching staff:", error);
// // //       throw error;
// // //     }
// // //   }, []);

// // //   const fetchGuests = useCallback(async () => {
// // //     try {
// // //       const guestUsersSnapshot = await getDocs(collection(db, 'guestUsers'));
// // //       const guests = await Promise.all(
// // //         guestUsersSnapshot.docs.map(async (doc) => {
// // //           const userData = await getGuestUserData(doc.id);
// // //           return { id: doc.id, ...userData };
// // //         })
// // //       );
// // //       setGuestUsers(guests);
// // //       return guests;
// // //     } catch (error) {
// // //       console.error("Error fetching guests:", error);
// // //       throw error;
// // //     }
// // //   }, []);

// // //   const fetchReferrals = useCallback(async () => {
// // //     try {
// // //       const fetchedReferrals = await fetchAllReferrals();
// // //       setReferrals(fetchedReferrals);
// // //       return fetchedReferrals;
// // //     } catch (error) {
// // //       console.error("Error fetching referrals:", error);
// // //       throw error;
// // //     }
// // //   }, []);


// // //   const value = {
// // //     user,
// // //     loading,
// // //     login,
// // //     logout,
// // //     bookings,
// // //     fetchAllBookings: fetchAllBookingsData,
// // //     deleteBooking: deleteBookingHandler,
// // //     updateBooking: updateBookingHandler,
// // //     sendPasswordReset,
// // //     documents,
// // //     fetchDocuments,
// // //     constructionUpdates,
// // //     fetchConstructionUpdates,
// // //     feedbackData,
// // //     fetchFeedback,
// // //     specialRequests,
// // //     fetchSpecialRequests,
// // //     authorizedUsers,
// // //     fetchMembers,
// // //     staffUsers,
// // //     fetchStaff,
// // //     guestUsers,
// // //     fetchGuests,
// // //     referrals,
// // //     fetchReferrals,
// // //     fcmToken, // Expose the FCM token
// // //     notificationPermission,
// // //     requestNotificationPermission,
// // //   setupNotifications, // Expose the setup function
// // //   };

// // //   return (
// // //     <AuthContext.Provider value={value}>
// // //       {children}
// // //     </AuthContext.Provider>
// // //   );
// // // };

// // // export default AuthProvider;
// // import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';

// // import { signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
// // import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
// // import { toast } from 'react-toastify';
// // import { auth, db } from '../firebase/firebase';
// // import { fetchAllBookings, deleteBooking as deleteBookingService, updateBooking as updateBookingService, fetchAuthorizedUserDetails } from '../firebase/services/bookingsData';
// // import { fetchAllSpecialRequests } from '../firebase/services/SpecialRequests';
// // import { getAllAuthorizedUsers } from '../firebase/services/UserData';
// // import { getAllStaffUsers, getGuestUserData } from '../firebase/services/UserService';
// // import { fetchAllReferrals } from '../firebase/services/Referals';
// // import { getToken, onMessage } from 'firebase/messaging';
// // import { messaging } from '../firebase/firebase';

// // const AuthContext = createContext();

// // export const useAuth = () => useContext(AuthContext);

// // export const AuthProvider = ({ children }) => {
// //   // State variables
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [bookings, setBookings] = useState([]);
// //   const [documents, setDocuments] = useState([]);
// //   const [constructionUpdates, setConstructionUpdates] = useState([]);
// //   const [feedbackData, setFeedbackData] = useState([]);
// //   const [specialRequests, setSpecialRequests] = useState([]);
// //   const [authorizedUsers, setAuthorizedUsers] = useState([]);
// //   const [staffUsers, setStaffUsers] = useState([]);
// //   const [guestUsers, setGuestUsers] = useState([]);
// //   const [referrals, setReferrals] = useState([]);
// //   const [fcmToken, setFcmToken] = useState(null);
// //   const [notificationPermission, setNotificationPermission] = useState('default');
  
// //   // Refs to prevent multiple initialization/execution
// //   const fcmInitialized = useRef(false);
// //   const messageListenerSet = useRef(false);
// //   const notificationSetupInProgress = useRef(false);

// //   // Check notification permission on mount
// //   useEffect(() => {
// //     if ('Notification' in window) {
// //       setNotificationPermission(Notification.permission);
// //     }
// //   }, []);

// //   // Helper function to detect device type
// //   const detectDeviceType = () => {
// //     const ua = navigator.userAgent;
// //     if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
// //       return 'tablet';
// //     }
// //     if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
// //       return 'mobile';
// //     }
// //     return 'desktop';
// //   };

// //   // Save token to server
// //   const saveTokenToServer = useCallback(async (phoneNumber, token) => {
// //     if (!phoneNumber || !token) {
// //       console.error('Missing phoneNumber or token for server save');
// //       return false;
// //     }

// //     try {
// //       console.log(`Saving token for user: ${phoneNumber}`);
// //       const response = await fetch('http://localhost:5000/api/save-token', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           phoneNumber,
// //           token,
// //           userType: 'dashboard',
// //           deviceType: detectDeviceType()
// //         }),
// //       });

// //       if (!response.ok) {
// //         const errorText = await response.text();
// //         console.error('Server error:', errorText);
// //         return false;
// //       }

// //       const data = await response.json();
      
// //       if (data.success) {
// //         console.log('Token saved to server successfully');
// //         return true;
// //       } else {
// //         console.error('Server responded with error:', data.error);
// //         return false;
// //       }
// //     } catch (error) {
// //       console.error('Error saving token to server:', error);
// //       return false;
// //     }
// //   }, []);

// //   // Setup message listener
// //   const setupMessageListener = useCallback(() => {
// //     if (!messaging || messageListenerSet.current) return;
    
// //     console.log('Setting up FCM message listener');
// //     messageListenerSet.current = true;
    
// //     onMessage(messaging, (payload) => {
// //       console.log('Message received in foreground:', payload);
// //       if (payload.notification) {
// //         new Notification(payload.notification.title, {
// //           body: payload.notification.body,
// //           icon: '/logo192.png'
// //         });
// //       }
// //     });
// //   }, []);

// //   // Setup notifications with proper caching and error handling
// //   const setupNotifications = useCallback(async () => {
// //     // Prevent multiple concurrent setup attempts
// //     if (notificationSetupInProgress.current) {
// //       console.log('Notification setup already in progress, skipping');
// //       return null;
// //     }
    
// //     // Check if we've already initialized FCM during this session
// //     if (fcmInitialized.current && fcmToken) {
// //       console.log('FCM already initialized with token:', fcmToken);
// //       return fcmToken;
// //     }
    
// //     notificationSetupInProgress.current = true;
    
// //     try {
// //       if (!('serviceWorker' in navigator)) {
// //         console.error('Service Worker not supported in this browser');
// //         notificationSetupInProgress.current = false;
// //         return null;
// //       }

// //       // First, check if we have a cached token in localStorage
// //       const cachedToken = localStorage.getItem('fcmToken');
// //       const tokenTimestamp = localStorage.getItem('fcmTokenTimestamp');
// //       const currentTime = new Date().getTime();
      
// //       // If we have a valid cached token that's less than 24 hours old, use it
// //       if (cachedToken && tokenTimestamp && 
// //           (currentTime - parseInt(tokenTimestamp) < 24 * 60 * 60 * 1000)) {
// //         console.log('Using cached FCM token');
// //         setFcmToken(cachedToken);
// //         fcmInitialized.current = true;
        
// //         // Still try to save the token to the server if user data is available
// //         if (user && (user.phoneNumber || user.id)) {
// //           saveTokenToServer(user.phoneNumber || user.id, cachedToken)
// //             .catch(err => console.error('Error saving cached token:', err));
// //         }
        
// //         // Set up message listener for the cached token
// //         setupMessageListener();
// //         notificationSetupInProgress.current = false;
// //         return cachedToken;
// //       }

// //       // If no valid cached token, continue with normal flow
// //       // Request notification permission first
// //       if (Notification.permission !== 'granted') {
// //         const permission = await Notification.requestPermission();
// //         setNotificationPermission(permission);
        
// //         if (permission !== 'granted') {
// //           console.log('Notification permission denied');
// //           notificationSetupInProgress.current = false;
// //           return null;
// //         }
// //       }

// //       // Register service worker
// //       try {
// //         let registration;
        
// //         // Try to get existing registration first
// //         const existingReg = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
// //         if (existingReg) {
// //           console.log('Using existing service worker registration');
// //           registration = existingReg;
// //         } else {
// //           console.log('Registering new service worker');
// //           registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          
// //           // Wait for the service worker to be ready
// //           if (registration.installing) {
// //             console.log('Waiting for service worker to be activated...');
// //             await new Promise((resolve) => {
// //               registration.installing.addEventListener('statechange', (e) => {
// //                 if (e.target.state === 'activated') {
// //                   console.log('Service worker activated');
// //                   resolve();
// //                 }
// //               });
// //             });
// //           }
// //         }

// //         // The VAPID key for Firebase messaging
// //         const VAPID_KEY = 'BMETtHPaVBg0SmHdlRbtbOsCzECXq7BlCK3SaicLkTF79sr0f7pNu1ixiPlbTnV8oaymZocLOoSAir6Qff4hl';

// //         // Implement exponential backoff for token generation
// //         let retries = 0;
// //         const maxRetries = 3;
// //         const getTokenWithRetry = async () => {
// //           try {
// //             // Use timestamp to prevent many requests within same interval
// //             const lastTokenRequest = localStorage.getItem('lastTokenRequest');
// //             const now = Date.now();
            
// //             if (lastTokenRequest && (now - parseInt(lastTokenRequest) < 60000)) {
// //               console.log('Rate limiting token request - too soon since last attempt');
              
// //               if (cachedToken) {
// //                 console.log('Using existing cached token due to rate limiting');
// //                 return cachedToken;
// //               }
              
// //               // Wait a bit before trying
// //               await new Promise(resolve => setTimeout(resolve, 5000));
// //             }
            
// //             localStorage.setItem('lastTokenRequest', now.toString());
            
// //             // Attempt to get the token
// //             console.log('Requesting FCM token with VAPID key...');
// //             const token = await getToken(messaging, {
// //               vapidKey: VAPID_KEY,
// //               serviceWorkerRegistration: registration
// //             });
            
// //             if (token) {
// //               // Cache the token in localStorage
// //               localStorage.setItem('fcmToken', token);
// //               localStorage.setItem('fcmTokenTimestamp', new Date().getTime().toString());
              
// //               console.log('FCM Token obtained and cached');
// //               setFcmToken(token);
// //               fcmInitialized.current = true;
              
// //               // Save to server if user data is available
// //               if (user && (user.phoneNumber || user.id)) {
// //                 await saveTokenToServer(user.phoneNumber || user.id, token);
// //               }
              
// //               // Set up message listener
// //               setupMessageListener();
              
// //               return token;
// //             } else {
// //               console.error('No FCM token received');
// //               return null;
// //             }
// //           } catch (error) {
// //             // Track quota errors
// //             if (error.code === 'messaging/token-subscribe-failed') {
// //               // Increment quota error counter
// //               const currentCount = parseInt(localStorage.getItem('fcmQuotaErrorCount') || '0');
// //               localStorage.setItem('fcmQuotaErrorCount', (currentCount + 1).toString());
              
// //               if (retries < maxRetries) {
// //                 // Increment retry counter
// //                 retries++;
                
// //                 // Calculate delay with exponential backoff (1s, 2s, 4s, etc.)
// //                 const delay = Math.pow(2, retries) * 1000;
// //                 console.log(`FCM token request failed. Retrying in ${delay/1000} seconds...`);
                
// //                 // Wait and retry
// //                 await new Promise(resolve => setTimeout(resolve, delay));
// //                 return getTokenWithRetry();
// //               }
// //             }
            
// //             console.error('Error getting FCM token:', error);
            
// //             // If not a quota error or max retries reached, try to use the cached token as fallback
// //             if (cachedToken) {
// //               console.warn('Using cached token as fallback after error');
// //               setFcmToken(cachedToken);
// //               fcmInitialized.current = true;
// //               setupMessageListener();
// //               return cachedToken;
// //             }
            
// //             throw error;
// //           }
// //         };
        
// //         const token = await getTokenWithRetry();
// //         notificationSetupInProgress.current = false;
// //         return token;
// //       } catch (error) {
// //         console.error('Error setting up FCM:', error);
        
// //         // If service worker or token generation fails, still try to use cached token as last resort
// //         if (cachedToken) {
// //           console.warn('Using cached token after service worker error');
// //           setFcmToken(cachedToken);
// //           fcmInitialized.current = true;
// //           setupMessageListener();
// //           notificationSetupInProgress.current = false;
// //           return cachedToken;
// //         }
        
// //         notificationSetupInProgress.current = false;
// //         return null;
// //       }
// //     } catch (error) {
// //       console.error('Error setting up notifications:', error);
// //       notificationSetupInProgress.current = false;
// //       return null;
// //     }
// //   }, [user, fcmToken, saveTokenToServer, setupMessageListener]);

// //   // Request notification permission explicitly 
// //   const requestNotificationPermission = useCallback(async () => {
// //     try {
// //       if (!('Notification' in window)) {
// //         console.log('This browser does not support notifications');
// //         return false;
// //       }
      
// //       const permission = await Notification.requestPermission();
// //       setNotificationPermission(permission);
      
// //       if (permission === 'granted') {
// //         const token = await setupNotifications();
// //         return !!token;
// //       }
      
// //       return false;
// //     } catch (error) {
// //       console.error('Error requesting notification permission:', error);
// //       return false;
// //     }
// //   }, [setupNotifications]);

// //   // Get user data by email
// //   const getUserDataByEmail = async (email) => {
// //     try {
// //       const staffUsersRef = collection(db, 'staffUsers');
// //       const q = query(staffUsersRef, where("email", "==", email));
// //       const querySnapshot = await getDocs(q);

// //       if (!querySnapshot.empty) {
// //         const userDoc = querySnapshot.docs[0];
// //         return { id: userDoc.id, ...userDoc.data() };
// //       } else {
// //         throw new Error("User not found in staff database");
// //       }
// //     } catch (error) {
// //       console.error("Error in getUserDataByEmail:", error);
// //       throw error;
// //     }
// //   };

// //   // Auth state change listener - with initialization protection
// //   useEffect(() => {
// //     let setupInitiated = false;
    
// //     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
// //       console.log('Auth state changed:', firebaseUser ? 'User logged in' : 'User logged out');
      
// //       if (firebaseUser) {
// //         try {
// //           const userData = await getUserDataByEmail(firebaseUser.email);
// //           const fullUserData = { ...firebaseUser, ...userData };
// //           setUser(fullUserData);
          
// //           // Only attempt to set up notifications once per auth change
// //           if (!setupInitiated) {
// //             setupInitiated = true;
// //             console.log('Initiating notification setup after login');
            
// //             // Small delay to ensure everything is ready
// //             setTimeout(async () => {
// //               await setupNotifications();
// //             }, 1500);
// //           }
// //         } catch (error) {
// //           console.error("Error fetching user data:", error);
// //           setUser(null);
// //         }
// //       } else {
// //         // User logged out
// //         setUser(null);
// //         fcmInitialized.current = false;
// //         messageListenerSet.current = false;
// //       }
      
// //       setLoading(false);
// //     });
    
// //     // Cleanup
// //     return () => {
// //       unsubscribe();
// //     };
// //   }, [setupNotifications]); 

// //   // Login function
// //   const login = async (email, password) => {
// //     try {
// //       const userCredential = await signInWithEmailAndPassword(auth, email, password);
// //       const userData = await getUserDataByEmail(email);
// //       const fullUserData = { ...userCredential.user, ...userData };
// //       setUser(fullUserData);
// //       return fullUserData;
// //     } catch (error) {
// //       console.error('Login error:', error);
// //       throw error;
// //     }
// //   };

// //   // Logout function
// //   const logout = async () => {
// //     try {
// //       await signOut(auth);
// //       setUser(null);
// //       fcmInitialized.current = false;
// //       messageListenerSet.current = false;
// //     } catch (error) {
// //       console.error('Logout error:', error);
// //       toast.error('Failed to logout');
// //     }
// //   };

// //   // Password reset function
// //   const sendPasswordReset = async (email) => {
// //     try {
// //       await sendPasswordResetEmail(auth, email);
// //       toast.success('Password reset link sent to your email.');
// //       return true;
// //     } catch (error) {
// //       console.error('Password reset error:', error);
// //       toast.error('Failed to send password reset link. Please try again.');
// //       throw error;
// //     }
// //   };

// //   // Fetch all bookings
// //   const fetchAllBookingsData = useCallback(() => {
// //     return fetchAllBookings((fetchedBookings) => {
// //       setBookings(fetchedBookings);
// //     });
// //   }, []);

// //   // Delete booking
// //   const deleteBookingHandler = async (bookingId) => {
// //     try {
// //       await deleteBookingService(bookingId);
// //       setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
// //     } catch (error) {
// //       console.error('Error deleting booking:', error);
// //       throw error;
// //     }
// //   };

// //   // Update booking
// //   const updateBookingHandler = async (bookingId, updatedBooking) => {
// //     try {
// //       await updateBookingService(bookingId, updatedBooking);
// //       setBookings(prevBookings => prevBookings.map(booking => 
// //         booking.id === bookingId ? { ...booking, ...updatedBooking } : booking
// //       ));
// //     } catch (error) {
// //       console.error('Error updating booking:', error);
// //       throw error;
// //     }
// //   };

// //   // Fetch bookings when user changes
// //   useEffect(() => {
// //     if (user) {
// //       const unsubscribe = fetchAllBookingsData();
// //       return () => unsubscribe();
// //     }
// //   }, [user, fetchAllBookingsData]);

// //   // Fetch documents by type
// //   const fetchDocuments = useCallback(async (documentType) => {
// //     try {
// //       const q = query(
// //         collection(db, 'documents'),
// //         where('documentType', '==', documentType)
// //       );
// //       const querySnapshot = await getDocs(q);
// //       const fetchedDocumentsPromises = querySnapshot.docs.map(async doc => {
// //         const documentData = {
// //           id: doc.id,
// //           ...doc.data()
// //         };
        
// //         // Fetch user details for each document
// //         const userDetails = await fetchAuthorizedUserDetails(documentData.phoneNumber);
        
// //         return {
// //           ...documentData,
// //           userInfo: userDetails
// //         };
// //       });

// //       const fetchedDocuments = await Promise.all(fetchedDocumentsPromises);
      
// //       // Sort documents by uploadDate in descending order
// //       const sortedDocuments = fetchedDocuments.sort((a, b) => 
// //         b.uploadDate.toDate() - a.uploadDate.toDate()
// //       );

// //       setDocuments(sortedDocuments);
// //       return sortedDocuments;
// //     } catch (error) {
// //       console.error("Error fetching documents:", error);
// //       throw error;
// //     }
// //   }, []);

// //   // Fetch construction updates
// //   const fetchConstructionUpdates = useCallback(async () => {
// //     try {
// //       const q = query(collection(db, 'constructionUpdates'));
// //       const querySnapshot = await getDocs(q);
// //       const fetchedUpdates = querySnapshot.docs.map(doc => ({
// //         id: doc.id,
// //         ...doc.data()
// //       }));
// //       setConstructionUpdates(fetchedUpdates);
// //       return fetchedUpdates;
// //     } catch (error) {
// //       console.error("Error fetching construction updates:", error);
// //       throw error;
// //     }
// //   }, []);

// //   // Fetch feedback
// //   const fetchFeedback = useCallback(async () => {
// //     try {
// //       const q = query(collection(db, 'feedback'));
// //       const querySnapshot = await getDocs(q);
// //       const fetchedFeedbackPromises = querySnapshot.docs.map(async doc => {
// //         const feedbackData = {
// //           id: doc.id,
// //           ...doc.data()
// //         };
        
// //         // Fetch user details for each feedback entry
// //         const userDetails = await fetchAuthorizedUserDetails(feedbackData.phoneNumber);
        
// //         return {
// //           ...feedbackData,
// //           userInfo: userDetails
// //         };
// //       });

// //       const fetchedFeedback = await Promise.all(fetchedFeedbackPromises);
      
// //       // Sort feedback by createdAt in descending order (assuming there's a createdAt field)
// //       const sortedFeedback = fetchedFeedback.sort((a, b) => 
// //         b.createdAt.toDate() - a.createdAt.toDate()
// //       );

// //       setFeedbackData(sortedFeedback);
// //       return sortedFeedback;
// //     } catch (error) {
// //       console.error("Error fetching feedback:", error);
// //       throw error;
// //     }
// //   }, []);

// //   // Fetch special requests
// //   const fetchSpecialRequests = useCallback(async () => {
// //     try {
// //       const fetchedRequests = await fetchAllSpecialRequests();
// //       const users = await getAllAuthorizedUsers();
// //       setAuthorizedUsers(users);
      
// //       const requestsWithUserInfo = fetchedRequests.map(request => {
// //         const authorizedUser = users.find(user => user.phoneNumber === request.phoneNumber);
// //         return {
// //           ...request,
// //           userInfo: authorizedUser || null
// //         };
// //       });
      
// //       setSpecialRequests(requestsWithUserInfo);
// //       return requestsWithUserInfo;
// //     } catch (error) {
// //       console.error("Error fetching special requests:", error);
// //       throw error;
// //     }
// //   }, []);

// //   // Fetch members
// //   const fetchMembers = useCallback(async () => {
// //     try {
// //       const members = await getAllAuthorizedUsers();
// //       setAuthorizedUsers(members);
// //       return members;
// //     } catch (error) {
// //       console.error("Error fetching members:", error);
// //       throw error;
// //     }
// //   }, []);

// //   // Fetch staff
// //   const fetchStaff = useCallback(async () => {
// //     try {
// //       const staff = await getAllStaffUsers();
// //       setStaffUsers(staff);
// //       return staff;
// //     } catch (error) {
// //       console.error("Error fetching staff:", error);
// //       throw error;
// //     }
// //   }, []);

// //   // Fetch guests
// //   const fetchGuests = useCallback(async () => {
// //     try {
// //       const guestUsersSnapshot = await getDocs(collection(db, 'guestUsers'));
// //       const guests = await Promise.all(
// //         guestUsersSnapshot.docs.map(async (doc) => {
// //           const userData = await getGuestUserData(doc.id);
// //           return { id: doc.id, ...userData };
// //         })
// //       );
// //       setGuestUsers(guests);
// //       return guests;
// //     } catch (error) {
// //       console.error("Error fetching guests:", error);
// //       throw error;
// //     }
// //   }, []);

// //   // Fetch referrals
// //   const fetchReferrals = useCallback(async () => {
// //     try {
// //       const fetchedReferrals = await fetchAllReferrals();
// //       setReferrals(fetchedReferrals);
// //       return fetchedReferrals;
// //     } catch (error) {
// //       console.error("Error fetching referrals:", error);
// //       throw error;
// //     }
// //   }, []);

// //   // Reset FCM state - useful for troubleshooting
// //   const resetFCMState = useCallback(() => {
// //     localStorage.removeItem('fcmToken');
// //     localStorage.removeItem('fcmTokenTimestamp');
// //     localStorage.removeItem('fcmQuotaErrorCount');
// //     localStorage.removeItem('lastTokenRequest');
// //     fcmInitialized.current = false;
// //     messageListenerSet.current = false;
// //     setFcmToken(null);
// //     return true;
// //   }, []);

// //   // Provide all values to the context
// //   const value = {
// //     user,
// //     loading,
// //     login,
// //     logout,
// //     bookings,
// //     fetchAllBookings: fetchAllBookingsData,
// //     deleteBooking: deleteBookingHandler,
// //     updateBooking: updateBookingHandler,
// //     sendPasswordReset,
// //     documents,
// //     fetchDocuments,
// //     constructionUpdates,
// //     fetchConstructionUpdates,
// //     feedbackData,
// //     fetchFeedback,
// //     specialRequests,
// //     fetchSpecialRequests,
// //     authorizedUsers,
// //     fetchMembers,
// //     staffUsers,
// //     fetchStaff,
// //     guestUsers,
// //     fetchGuests,
// //     referrals,
// //     fetchReferrals,
// //     fcmToken,
// //     notificationPermission,
// //     requestNotificationPermission,
// //     setupNotifications,
// //     resetFCMState,
// //   };

// //   return (
// //     <AuthContext.Provider value={value}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };

// // export default AuthProvider;

// import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';

// import { signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
// import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
// import { toast } from 'react-toastify';
// import { auth, db } from '../firebase/firebase';
// import { fetchAllBookings, deleteBooking as deleteBookingService, updateBooking as updateBookingService, fetchAuthorizedUserDetails } from '../firebase/services/bookingsData';
// import { fetchAllSpecialRequests } from '../firebase/services/SpecialRequests';
// import { getAllAuthorizedUsers } from '../firebase/services/UserData';
// import { getAllStaffUsers, getGuestUserData } from '../firebase/services/UserService';
// import { fetchAllReferrals } from '../firebase/services/Referals';
// import { getToken, onMessage } from 'firebase/messaging';
// import { messaging } from '../firebase/firebase';

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   // State variables
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [bookings, setBookings] = useState([]);
//   const [documents, setDocuments] = useState([]);
//   const [constructionUpdates, setConstructionUpdates] = useState([]);
//   const [feedbackData, setFeedbackData] = useState([]);
//   const [specialRequests, setSpecialRequests] = useState([]);
//   const [authorizedUsers, setAuthorizedUsers] = useState([]);
//   const [staffUsers, setStaffUsers] = useState([]);
//   const [guestUsers, setGuestUsers] = useState([]);
//   const [referrals, setReferrals] = useState([]);
//   const [fcmToken, setFcmToken] = useState(null);
//   const [notificationPermission, setNotificationPermission] = useState('default');
  
//   // Refs to prevent multiple initialization/execution
//   const fcmInitialized = useRef(false);
//   const messageListenerSet = useRef(false);
//   const notificationSetupInProgress = useRef(false);
//   const authStateListenerAdded = useRef(false);
//   const authListenerCleanup = useRef(null);
//   const lastAuthUserId = useRef(null);

//   // Check notification permission on mount
//   useEffect(() => {
//     if ('Notification' in window) {
//       setNotificationPermission(Notification.permission);
//     }

//     // Check for cached token
//     const cachedToken = localStorage.getItem('fcmToken');
//     if (cachedToken) {
//       setFcmToken(cachedToken);
//     }
//   }, []);

//   // Helper function to detect device type
//   const detectDeviceType = () => {
//     const ua = navigator.userAgent;
//     if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
//       return 'tablet';
//     }
//     if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
//       return 'mobile';
//     }
//     return 'desktop';
//   };

//   // Save token to server
//   const saveTokenToServer = useCallback(async (phoneNumber, token) => {
//     if (!phoneNumber || !token) {
//       console.error('Missing phoneNumber or token for server save');
//       return false;
//     }

//     try {
//       console.log(`Saving token for user: ${phoneNumber}`);
//       const response = await fetch('http://localhost:5000/api/save-token', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           phoneNumber,
//           token,
//           userType: 'dashboard',
//           deviceType: detectDeviceType()
//         }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Server error:', errorText);
//         return false;
//       }

//       const data = await response.json();
      
//       if (data.success) {
//         console.log('Token saved to server successfully');
//         return true;
//       } else {
//         console.error('Server responded with error:', data.error);
//         return false;
//       }
//     } catch (error) {
//       console.error('Error saving token to server:', error);
//       return false;
//     }
//   }, []);

//   // Setup message listener
//   const setupMessageListener = useCallback(() => {
//     if (!messaging || messageListenerSet.current) return;
    
//     console.log('Setting up FCM message listener');
//     messageListenerSet.current = true;
    
//     onMessage(messaging, (payload) => {
//       console.log('Message received in foreground:', payload);
//       if (payload.notification) {
//         new Notification(payload.notification.title, {
//           body: payload.notification.body,
//           icon: '/logo192.png'
//         });
//       }
//     });
//   }, []);

//   // Setup notifications with proper caching and error handling
//   const setupNotifications = useCallback(async () => {
//     // Prevent multiple concurrent setup attempts
//     if (notificationSetupInProgress.current) {
//       console.log('Notification setup already in progress, skipping');
//       return null;
//     }
    
//     // Check if we've already initialized FCM during this session
//     if (fcmInitialized.current && fcmToken) {
//       console.log('FCM already initialized with token:', fcmToken);
//       return fcmToken;
//     }
    
//     notificationSetupInProgress.current = true;
//     console.log('Starting notification setup process');
    
//     try {
//       if (!('serviceWorker' in navigator)) {
//         console.error('Service Worker not supported in this browser');
//         notificationSetupInProgress.current = false;
//         return null;
//       }

//       // First, check if we have a cached token in localStorage
//       const cachedToken = localStorage.getItem('fcmToken');
//       const tokenTimestamp = localStorage.getItem('fcmTokenTimestamp');
//       const currentTime = new Date().getTime();
      
//       // If we have a valid cached token that's less than 24 hours old, use it
//       if (cachedToken && tokenTimestamp && 
//           (currentTime - parseInt(tokenTimestamp) < 24 * 60 * 60 * 1000)) {
//         console.log('Using cached FCM token');
//         setFcmToken(cachedToken);
//         fcmInitialized.current = true;
        
//         // Still try to save the token to the server if user data is available
//         if (user && (user.phoneNumber || user.id)) {
//           saveTokenToServer(user.phoneNumber || user.id, cachedToken)
//             .catch(err => console.error('Error saving cached token:', err));
//         }
        
//         // Set up message listener for the cached token
//         setupMessageListener();
//         notificationSetupInProgress.current = false;
//         return cachedToken;
//       }

//       // If no valid cached token, continue with normal flow
//       // Request notification permission first
//       if (Notification.permission !== 'granted') {
//         const permission = await Notification.requestPermission();
//         setNotificationPermission(permission);
        
//         if (permission !== 'granted') {
//           console.log('Notification permission denied');
//           notificationSetupInProgress.current = false;
//           return null;
//         }
//       }

//       // Register service worker
//       try {
//         let registration;
        
//         // Try to get existing registration first
//         const existingReg = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
//         if (existingReg) {
//           console.log('Using existing service worker registration');
//           registration = existingReg;
//         } else {
//           console.log('Registering new service worker');
//           registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          
//           // Wait for the service worker to be ready
//           if (registration.installing) {
//             console.log('Waiting for service worker to be activated...');
//             await new Promise((resolve) => {
//               registration.installing.addEventListener('statechange', (e) => {
//                 if (e.target.state === 'activated') {
//                   console.log('Service worker activated');
//                   resolve();
//                 }
//               });
//             });
//           }
//         }

//         // The VAPID key for Firebase messaging
//         const VAPID_KEY = 'BMETtHPaVBg0SmHdlRbtbOsCzECXq7BlCK3SaicLkTF79sr0f7pNu1ixiPlbTnV8oaymZocLOoSAir6Qff4hl';

//         // Get token with one retry
//         try {
//           // Use timestamp to prevent many requests within same interval
//           const lastTokenRequest = localStorage.getItem('lastTokenRequest');
//           const now = Date.now();
          
//           if (lastTokenRequest && (now - parseInt(lastTokenRequest) < 60000)) {
//             console.log('Rate limiting token request - too soon since last attempt');
            
//             if (cachedToken) {
//               console.log('Using existing cached token due to rate limiting');
//               setFcmToken(cachedToken);
//               notificationSetupInProgress.current = false;
//               return cachedToken;
//             }
            
//             // Wait a bit before trying
//             await new Promise(resolve => setTimeout(resolve, 5000));
//           }
          
//           localStorage.setItem('lastTokenRequest', now.toString());
          
//           // Attempt to get the token
//           console.log('Requesting FCM token with VAPID key...');
//           const token = await getToken(messaging, {
//             vapidKey: VAPID_KEY,
//             serviceWorkerRegistration: registration
//           });
          
//           if (token) {
//             // Cache the token in localStorage
//             localStorage.setItem('fcmToken', token);
//             localStorage.setItem('fcmTokenTimestamp', new Date().getTime().toString());
            
//             console.log('FCM Token obtained and cached');
//             setFcmToken(token);
//             fcmInitialized.current = true;
            
//             // Save to server if user data is available
//             if (user && (user.phoneNumber || user.id)) {
//               await saveTokenToServer(user.phoneNumber || user.id, token);
//             }
            
//             // Set up message listener
//             setupMessageListener();
            
//             notificationSetupInProgress.current = false;
//             return token;
//           } else {
//             console.error('No FCM token received');
//             notificationSetupInProgress.current = false;
//             return null;
//           }
//         } catch (error) {
//           console.error('Error getting FCM token:', error);
          
//           // Track quota errors
//           if (error.code === 'messaging/token-subscribe-failed') {
//             // Increment quota error counter
//             const currentCount = parseInt(localStorage.getItem('fcmQuotaErrorCount') || '0');
//             localStorage.setItem('fcmQuotaErrorCount', (currentCount + 1).toString());
//           }
          
//           // Try to use the cached token as fallback
//           if (cachedToken) {
//             console.warn('Using cached token as fallback after error');
//             setFcmToken(cachedToken);
//             fcmInitialized.current = true;
//             setupMessageListener();
//             notificationSetupInProgress.current = false;
//             return cachedToken;
//           }
          
//           notificationSetupInProgress.current = false;
//           throw error;
//         }
//       } catch (error) {
//         console.error('Error setting up FCM:', error);
        
//         // If service worker or token generation fails, still try to use cached token as last resort
//         if (cachedToken) {
//           console.warn('Using cached token after service worker error');
//           setFcmToken(cachedToken);
//           fcmInitialized.current = true;
//           setupMessageListener();
//           notificationSetupInProgress.current = false;
//           return cachedToken;
//         }
        
//         notificationSetupInProgress.current = false;
//         return null;
//       }
//     } catch (error) {
//       console.error('Error setting up notifications:', error);
//       notificationSetupInProgress.current = false;
//       return null;
//     }
//   }, [user, fcmToken, saveTokenToServer, setupMessageListener]);

//   // Request notification permission explicitly 
//   const requestNotificationPermission = useCallback(async () => {
//     try {
//       if (!('Notification' in window)) {
//         console.log('This browser does not support notifications');
//         return false;
//       }
      
//       const permission = await Notification.requestPermission();
//       setNotificationPermission(permission);
      
//       if (permission === 'granted') {
//         const token = await setupNotifications();
//         return !!token;
//       }
      
//       return false;
//     } catch (error) {
//       console.error('Error requesting notification permission:', error);
//       return false;
//     }
//   }, [setupNotifications]);

//   // Get user data by email
//   const getUserDataByEmail = async (email) => {
//     try {
//       const staffUsersRef = collection(db, 'staffUsers');
//       const q = query(staffUsersRef, where("email", "==", email));
//       const querySnapshot = await getDocs(q);

//       if (!querySnapshot.empty) {
//         const userDoc = querySnapshot.docs[0];
//         return { id: userDoc.id, ...userDoc.data() };
//       } else {
//         throw new Error("User not found in staff database");
//       }
//     } catch (error) {
//       console.error("Error in getUserDataByEmail:", error);
//       throw error;
//     }
//   };

//   // Setup auth state listener only once at component mount
//   useEffect(() => {
//     // Prevent multiple listeners
//     if (authStateListenerAdded.current) {
//       return;
//     }
    
//     console.log('Setting up auth state listener (ONE TIME ONLY)');
//     authStateListenerAdded.current = true;
    
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       console.log('Auth state changed:', firebaseUser ? 'User logged in' : 'User logged out');
      
//       // If same user, don't process again
//       if (firebaseUser && lastAuthUserId.current === firebaseUser.uid) {
//         console.log('Same user auth state change - ignoring');
//         return;
//       }
      
//       if (firebaseUser) {
//         lastAuthUserId.current = firebaseUser.uid;
        
//         try {
//           const userData = await getUserDataByEmail(firebaseUser.email);
//           const fullUserData = { ...firebaseUser, ...userData };
//           setUser(fullUserData);
          
//           // Setup notifications with a delay
//           setTimeout(async () => {
//             try {
//               await setupNotifications();
//             } catch (error) {
//               console.error('Error in delayed notification setup:', error);
//             }
//           }, 2000);
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//           setUser(null);
//         }
//       } else {
//         // User logged out
//         lastAuthUserId.current = null;
//         setUser(null);
//         fcmInitialized.current = false;
//         messageListenerSet.current = false;
//       }
      
//       setLoading(false);
//     });
    
//     // Store the unsubscribe function
//     authListenerCleanup.current = unsubscribe;
    
//     // Cleanup
//     return () => {
//       if (authListenerCleanup.current) {
//         authListenerCleanup.current();
//         authStateListenerAdded.current = false;
//       }
//     };
//   }, []); // Empty dependency array - only run once on mount

//   // Login function
//   const login = async (email, password) => {
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const userData = await getUserDataByEmail(email);
//       const fullUserData = { ...userCredential.user, ...userData };
//       setUser(fullUserData);
//       return fullUserData;
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   };

//   // Logout function
//   const logout = async () => {
//     try {
//       await signOut(auth);
//       setUser(null);
//       fcmInitialized.current = false;
//       messageListenerSet.current = false;
//     } catch (error) {
//       console.error('Logout error:', error);
//       toast.error('Failed to logout');
//     }
//   };

//   // Password reset function
//   const sendPasswordReset = async (email) => {
//     try {
//       await sendPasswordResetEmail(auth, email);
//       toast.success('Password reset link sent to your email.');
//       return true;
//     } catch (error) {
//       console.error('Password reset error:', error);
//       toast.error('Failed to send password reset link. Please try again.');
//       throw error;
//     }
//   };

//   // Fetch all bookings
//   const fetchAllBookingsData = useCallback(() => {
//     return fetchAllBookings((fetchedBookings) => {
//       setBookings(fetchedBookings);
//     });
//   }, []);

//   // Delete booking
//   const deleteBookingHandler = async (bookingId) => {
//     try {
//       await deleteBookingService(bookingId);
//       setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
//     } catch (error) {
//       console.error('Error deleting booking:', error);
//       throw error;
//     }
//   };

//   // Update booking
//   const updateBookingHandler = async (bookingId, updatedBooking) => {
//     try {
//       await updateBookingService(bookingId, updatedBooking);
//       setBookings(prevBookings => prevBookings.map(booking => 
//         booking.id === bookingId ? { ...booking, ...updatedBooking } : booking
//       ));
//     } catch (error) {
//       console.error('Error updating booking:', error);
//       throw error;
//     }
//   };

//   // Fetch bookings when user changes
//   useEffect(() => {
//     if (user) {
//       const unsubscribe = fetchAllBookingsData();
//       return () => unsubscribe();
//     }
//   }, [user, fetchAllBookingsData]);

//   // Fetch documents by type
//   const fetchDocuments = useCallback(async (documentType) => {
//     try {
//       const q = query(
//         collection(db, 'documents'),
//         where('documentType', '==', documentType)
//       );
//       const querySnapshot = await getDocs(q);
//       const fetchedDocumentsPromises = querySnapshot.docs.map(async doc => {
//         const documentData = {
//           id: doc.id,
//           ...doc.data()
//         };
        
//         // Fetch user details for each document
//         const userDetails = await fetchAuthorizedUserDetails(documentData.phoneNumber);
        
//         return {
//           ...documentData,
//           userInfo: userDetails
//         };
//       });

//       const fetchedDocuments = await Promise.all(fetchedDocumentsPromises);
      
//       // Sort documents by uploadDate in descending order
//       const sortedDocuments = fetchedDocuments.sort((a, b) => 
//         b.uploadDate.toDate() - a.uploadDate.toDate()
//       );

//       setDocuments(sortedDocuments);
//       return sortedDocuments;
//     } catch (error) {
//       console.error("Error fetching documents:", error);
//       throw error;
//     }
//   }, []);

//   // Fetch construction updates
//   const fetchConstructionUpdates = useCallback(async () => {
//     try {
//       const q = query(collection(db, 'constructionUpdates'));
//       const querySnapshot = await getDocs(q);
//       const fetchedUpdates = querySnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       setConstructionUpdates(fetchedUpdates);
//       return fetchedUpdates;
//     } catch (error) {
//       console.error("Error fetching construction updates:", error);
//       throw error;
//     }
//   }, []);

//   // Fetch feedback
//   const fetchFeedback = useCallback(async () => {
//     try {
//       const q = query(collection(db, 'feedback'));
//       const querySnapshot = await getDocs(q);
//       const fetchedFeedbackPromises = querySnapshot.docs.map(async doc => {
//         const feedbackData = {
//           id: doc.id,
//           ...doc.data()
//         };
        
//         // Fetch user details for each feedback entry
//         const userDetails = await fetchAuthorizedUserDetails(feedbackData.phoneNumber);
        
//         return {
//           ...feedbackData,
//           userInfo: userDetails
//         };
//       });

//       const fetchedFeedback = await Promise.all(fetchedFeedbackPromises);
      
//       // Sort feedback by createdAt in descending order (assuming there's a createdAt field)
//       const sortedFeedback = fetchedFeedback.sort((a, b) => 
//         b.createdAt.toDate() - a.createdAt.toDate()
//       );

//       setFeedbackData(sortedFeedback);
//       return sortedFeedback;
//     } catch (error) {
//       console.error("Error fetching feedback:", error);
//       throw error;
//     }
//   }, []);

//   // Fetch special requests
//   const fetchSpecialRequests = useCallback(async () => {
//     try {
//       const fetchedRequests = await fetchAllSpecialRequests();
//       const users = await getAllAuthorizedUsers();
//       setAuthorizedUsers(users);
      
//       const requestsWithUserInfo = fetchedRequests.map(request => {
//         const authorizedUser = users.find(user => user.phoneNumber === request.phoneNumber);
//         return {
//           ...request,
//           userInfo: authorizedUser || null
//         };
//       });
      
//       setSpecialRequests(requestsWithUserInfo);
//       return requestsWithUserInfo;
//     } catch (error) {
//       console.error("Error fetching special requests:", error);
//       throw error;
//     }
//   }, []);

//   // Fetch members
//   const fetchMembers = useCallback(async () => {
//     try {
//       const members = await getAllAuthorizedUsers();
//       setAuthorizedUsers(members);
//       return members;
//     } catch (error) {
//       console.error("Error fetching members:", error);
//       throw error;
//     }
//   }, []);

//   // Fetch staff
//   const fetchStaff = useCallback(async () => {
//     try {
//       const staff = await getAllStaffUsers();
//       setStaffUsers(staff);
//       return staff;
//     } catch (error) {
//       console.error("Error fetching staff:", error);
//       throw error;
//     }
//   }, []);

//   // Fetch guests
//   const fetchGuests = useCallback(async () => {
//     try {
//       const guestUsersSnapshot = await getDocs(collection(db, 'guestUsers'));
//       const guests = await Promise.all(
//         guestUsersSnapshot.docs.map(async (doc) => {
//           const userData = await getGuestUserData(doc.id);
//           return { id: doc.id, ...userData };
//         })
//       );
//       setGuestUsers(guests);
//       return guests;
//     } catch (error) {
//       console.error("Error fetching guests:", error);
//       throw error;
//     }
//   }, []);

//   // Fetch referrals
//   const fetchReferrals = useCallback(async () => {
//     try {
//       const fetchedReferrals = await fetchAllReferrals();
//       setReferrals(fetchedReferrals);
//       return fetchedReferrals;
//     } catch (error) {
//       console.error("Error fetching referrals:", error);
//       throw error;
//     }
//   }, []);

//   // Reset FCM state - useful for troubleshooting
//   const resetFCMState = useCallback(() => {
//     localStorage.removeItem('fcmToken');
//     localStorage.removeItem('fcmTokenTimestamp');
//     localStorage.removeItem('fcmQuotaErrorCount');
//     localStorage.removeItem('lastTokenRequest');
//     fcmInitialized.current = false;
//     messageListenerSet.current = false;
//     notificationSetupInProgress.current = false;
//     setFcmToken(null);
//     return true;
//   }, []);

//   // Provide all values to the context
//   const value = {
//     user,
//     loading,
//     login,
//     logout,
//     bookings,
//     fetchAllBookings: fetchAllBookingsData,
//     deleteBooking: deleteBookingHandler,
//     updateBooking: updateBookingHandler,
//     sendPasswordReset,
//     documents,
//     fetchDocuments,
//     constructionUpdates,
//     fetchConstructionUpdates,
//     feedbackData,
//     fetchFeedback,
//     specialRequests,
//     fetchSpecialRequests,
//     authorizedUsers,
//     fetchMembers,
//     staffUsers,
//     fetchStaff,
//     guestUsers,
//     fetchGuests,
//     referrals,
//     fetchReferrals,
//     fcmToken,
//     notificationPermission,
//     requestNotificationPermission,
//     setupNotifications,
//     resetFCMState,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;

import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';

import { signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { auth, db } from '../firebase/firebase';
import { fetchAllBookings, deleteBooking as deleteBookingService, updateBooking as updateBookingService, fetchAuthorizedUserDetails } from '../firebase/services/bookingsData';
import { fetchAllSpecialRequests } from '../firebase/services/SpecialRequests';
import { getAllAuthorizedUsers } from '../firebase/services/UserData';
import { getAllStaffUsers, getGuestUserData } from '../firebase/services/UserService';
import { fetchAllReferrals } from '../firebase/services/Referals';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../firebase/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // State variables
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [constructionUpdates, setConstructionUpdates] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [specialRequests, setSpecialRequests] = useState([]);
  const [authorizedUsers, setAuthorizedUsers] = useState([]);
  const [staffUsers, setStaffUsers] = useState([]);
  const [guestUsers, setGuestUsers] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [fcmToken, setFcmToken] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState('default');
  
  // Refs to prevent multiple initialization/execution
  const fcmInitialized = useRef(false);
  const messageListenerSet = useRef(false);
  const notificationSetupInProgress = useRef(false);
  const authStateListenerAdded = useRef(false);
  const authListenerCleanup = useRef(null);
  const lastAuthUserId = useRef(null);

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Check for cached token
    const cachedToken = localStorage.getItem('fcmToken');
    if (cachedToken) {
      setFcmToken(cachedToken);
    }
  }, []);

  // Helper function to detect device type
  const detectDeviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  };

  // Save token directly to Firestore (more reliable than server API)
  const saveTokenToFirestore = useCallback(async (userId, token) => {
    if (!userId || !token) {
      console.error('Missing userId or token for Firestore save');
      return false;
    }

    try {
      console.log(`Saving FCM token to Firestore. User ID: ${userId}, Token: ${token}`);
      
      // Create the document in dashboardTokens collection
      await setDoc(doc(db, "dashboardTokens", userId), {
        token: token,
        userId: userId,
        device: detectDeviceType(),
        lastUpdated: serverTimestamp()
      }, { merge: true });
      
      console.log('Token successfully saved to Firestore dashboardTokens collection');
      return true;
    } catch (error) {
      console.error('Error saving token to Firestore:', error);
      return false;
    }
  }, []);

  // Save token to server (fallback method)
  const saveTokenToServer = useCallback(async (phoneNumber, token) => {
    if (!phoneNumber || !token) {
      console.error('Missing phoneNumber or token for server save');
      return false;
    }

    try {
      console.log(`Saving token to server API. Phone: ${phoneNumber}, Token: ${token}`);
      const response = await fetch('http://localhost:5000/api/save-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          token,
          userType: 'dashboard',
          deviceType: detectDeviceType()
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        return false;
      }

      const data = await response.json();
      
      if (data.success) {
        console.log('Token saved to server successfully');
        return true;
      } else {
        console.error('Server responded with error:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error saving token to server:', error);
      return false;
    }
  }, []);

  // Combined function to save token to both Firestore and server
  const saveToken = useCallback(async (user, token) => {
    if (!user || !token) {
      console.error('Missing user or token in saveToken');
      return false;
    }

    let success = false;
    
    // First try to save to Firestore (primary storage)
    if (user.id) {
      success = await saveTokenToFirestore(user.id, token);
    }
    
    // Also try to save to server API if there's a phone number
    if (user.phoneNumber) {
      try {
        await saveTokenToServer(user.phoneNumber, token);
      } catch (error) {
        console.error('Error saving to server (secondary storage):', error);
        // Continue even if this fails since we have Firestore
      }
    }
    
    return success;
  }, [saveTokenToFirestore, saveTokenToServer]);

  // Setup message listener
  const setupMessageListener = useCallback(() => {
    if (!messaging || messageListenerSet.current) return;
    
    console.log('Setting up FCM message listener');
    messageListenerSet.current = true;
    
    onMessage(messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      if (payload.notification) {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: '/logo192.png'
        });
      }
    });
  }, []);

  // Use dummy token approach when FCM fails
  const generateDummyToken = useCallback(() => {
    // Create a unique, but consistent token for this user
    const userId = user?.id || user?.uid || 'anonymous';
    const timestamp = new Date().toISOString().split('T')[0]; // Use date only for some stability
    const randomPart = Math.random().toString(36).substring(2, 10);
    
    // Include device info to make it more unique
    const device = detectDeviceType();
    const browserInfo = navigator.userAgent.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
    
    // Construct a dummy token format similar to FCM tokens
    const dummyToken = `dummy_${userId}_${device}_${browserInfo}_${timestamp}_${randomPart}`;
    console.log('Generated dummy token:', dummyToken);
    
    return dummyToken;
  }, [user]);

  // Setup notifications with proper caching and error handling
  const setupNotifications = useCallback(async (bypassCache = false) => {
    // Prevent multiple concurrent setup attempts
    if (notificationSetupInProgress.current) {
      console.log('Notification setup already in progress, skipping');
      return null;
    }
    
    // Check if we've already initialized FCM during this session
  if (!bypassCache && fcmInitialized.current && fcmToken) {
    console.log('FCM already initialized with token:', fcmToken);
    return fcmToken;
  }
    
   // Clear token cache if bypassing
   if (bypassCache) {
    localStorage.removeItem('fcmToken');
    localStorage.removeItem('fcmTokenTimestamp');
  }
    notificationSetupInProgress.current = true;
    console.log('Starting notification setup process');
    
    try {
      if (!('serviceWorker' in navigator)) {
        console.error('Service Worker not supported in this browser');
        notificationSetupInProgress.current = false;
        return null;
      }

      // First, check if we have a cached token in localStorage
      const cachedToken = localStorage.getItem('fcmToken');
      const tokenTimestamp = localStorage.getItem('fcmTokenTimestamp');
      const currentTime = new Date().getTime();
      
      // If we have a valid cached token that's less than 24 hours old, use it
      if (cachedToken && tokenTimestamp && 
          (currentTime - parseInt(tokenTimestamp) < 24 * 60 * 60 * 1000)) {
        console.log('Using cached FCM token');
        setFcmToken(cachedToken);
        fcmInitialized.current = true;
        
        // Still try to save the token to storage if user data is available
        if (user) {
          await saveToken(user, cachedToken);
        }
        
        // Set up message listener for the cached token
        setupMessageListener();
        notificationSetupInProgress.current = false;
        return cachedToken;
      }

      // If no valid cached token, continue with normal flow
      // Request notification permission first
      if (Notification.permission !== 'granted') {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        
        if (permission !== 'granted') {
          console.log('Notification permission denied');
          notificationSetupInProgress.current = false;
          return null;
        }
      }

      // Register service worker
      try {
        let registration;
        
        // Try to get existing registration first
        try {
          const existingReg = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
          if (existingReg) {
            console.log('Using existing service worker registration');
            registration = existingReg;
          } else {
            console.log('Registering new service worker');
            registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          }
        } catch (swError) {
          console.error('Error with service worker:', swError);
          // Generate dummy token as fallback
          if (user) {
            const dummyToken = generateDummyToken();
            console.log('Using dummy token due to service worker error');
            setFcmToken(dummyToken);
            localStorage.setItem('fcmToken', dummyToken);
            localStorage.setItem('fcmTokenTimestamp', currentTime.toString());
            fcmInitialized.current = true;
            await saveToken(user, dummyToken);
            notificationSetupInProgress.current = false;
            return dummyToken;
          }
          throw swError;
        }

        // The VAPID key for Firebase messaging
        // const VAPID_KEY = 'BMETtHPaVBg0SmHdlRbtbOsCzECXq7BlCK3SaicLkTF79sr0f7pNu1ixiPlbTnV8oaymZocLOoSAir6Qff4hl';
        const VAPID_KEY = 'BMETtHPaVBg0SmHdIRbtbOsCzECXq7BICK3SaicLkTF79sr0f7pNu1ixiPlbTnV8oaymZocLOoSAlr6Qff4hl';

        // Get token with fallback to dummy token
        try {
          // Use timestamp to prevent many requests within same interval
          const lastTokenRequest = localStorage.getItem('lastTokenRequest');
          const now = Date.now();
          
          if (lastTokenRequest && (now - parseInt(lastTokenRequest) < 60000)) {
            console.log('Rate limiting token request - too soon since last attempt');
            
            if (cachedToken) {
              console.log('Using existing cached token due to rate limiting');
              setFcmToken(cachedToken);
              notificationSetupInProgress.current = false;
              return cachedToken;
            }
          } else {
            localStorage.setItem('lastTokenRequest', now.toString());
          }
          
          // Attempt to get the token
          console.log('Requesting FCM token with VAPID key...');
          try {
            const token = await getToken(messaging, {
              vapidKey: VAPID_KEY,
              serviceWorkerRegistration: registration
            });
            
            if (token) {
              // Cache the token in localStorage
              localStorage.setItem('fcmToken', token);
              localStorage.setItem('fcmTokenTimestamp', new Date().getTime().toString());
              
              console.log('FCM Token obtained and cached:', token);
              setFcmToken(token);
              fcmInitialized.current = true;
              
              // Save to Firestore and server if user data is available
              if (user) {
                await saveToken(user, token);
              }
              
              // Set up message listener
              setupMessageListener();
              
              notificationSetupInProgress.current = false;
              return token;
            } else {
              throw new Error('No token received from FCM');
            }
          } catch (tokenError) {
            console.error('FCM token error:', tokenError);
            
            // For authentication errors, use dummy token approach
            if (tokenError.code === 'messaging/token-subscribe-failed' && user) {
              const dummyToken = generateDummyToken();
              console.log('Using dummy token due to FCM auth error');
              setFcmToken(dummyToken);
              localStorage.setItem('fcmToken', dummyToken);
              localStorage.setItem('fcmTokenTimestamp', new Date().getTime().toString());
              fcmInitialized.current = true;
              await saveToken(user, dummyToken);
              notificationSetupInProgress.current = false;
              return dummyToken;
            }
            
            throw tokenError;
          }
        } catch (error) {
          console.error('Error getting FCM token:', error);
          
          // Track quota errors
          if (error.code === 'messaging/token-subscribe-failed') {
            // Increment quota error counter
            const currentCount = parseInt(localStorage.getItem('fcmQuotaErrorCount') || '0');
            localStorage.setItem('fcmQuotaErrorCount', (currentCount + 1).toString());
          }
          
          // Try to use the cached token as fallback
          if (cachedToken) {
            console.warn('Using cached token as fallback after error');
            setFcmToken(cachedToken);
            fcmInitialized.current = true;
            setupMessageListener();
            notificationSetupInProgress.current = false;
            return cachedToken;
          }
          
          // Last resort: use dummy token for this user
          if (user) {
            const dummyToken = generateDummyToken();
            console.log('Using dummy token as last resort');
            setFcmToken(dummyToken);
            localStorage.setItem('fcmToken', dummyToken);
            localStorage.setItem('fcmTokenTimestamp', new Date().getTime().toString());
            fcmInitialized.current = true;
            await saveToken(user, dummyToken);
            notificationSetupInProgress.current = false;
            return dummyToken;
          }
          
          notificationSetupInProgress.current = false;
          throw error;
        }
      } catch (error) {
        console.error('Error setting up FCM:', error);
        
        // If service worker or token generation fails, still try to use cached token as last resort
        if (cachedToken) {
          console.warn('Using cached token after service worker error');
          setFcmToken(cachedToken);
          fcmInitialized.current = true;
          setupMessageListener();
          notificationSetupInProgress.current = false;
          return cachedToken;
        }
        
        notificationSetupInProgress.current = false;
        return null;
      }
    } catch (error) {
      console.error('Error setting up notifications:', error);
      notificationSetupInProgress.current = false;
      return null;
    }
  }, [user, fcmToken, setupMessageListener, saveToken, generateDummyToken]);

  // Request notification permission explicitly 
  const requestNotificationPermission = useCallback(async () => {
    try {
      if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return false;
      }
      
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        const token = await setupNotifications();
        return !!token;
      }
      
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [setupNotifications]);

  // Get user data by email
  const getUserDataByEmail = async (email) => {
    try {
      const staffUsersRef = collection(db, 'staffUsers');
      const q = query(staffUsersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() };
      } else {
        throw new Error("User not found in staff database");
      }
    } catch (error) {
      console.error("Error in getUserDataByEmail:", error);
      throw error;
    }
  };

  // Setup auth state listener only once at component mount
  useEffect(() => {
    // Prevent multiple listeners
    if (authStateListenerAdded.current) {
      return;
    }
    
    console.log('Setting up auth state listener (ONE TIME ONLY)');
    authStateListenerAdded.current = true;
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser ? 'User logged in' : 'User logged out');
      
      // If same user, don't process again
      if (firebaseUser && lastAuthUserId.current === firebaseUser.uid) {
        console.log('Same user auth state change - ignoring');
        return;
      }
      
      if (firebaseUser) {
        lastAuthUserId.current = firebaseUser.uid;
        
        try {
          const userData = await getUserDataByEmail(firebaseUser.email);
          const fullUserData = { ...firebaseUser, ...userData };
          setUser(fullUserData);
          
          // Setup notifications with a delay
          setTimeout(async () => {
            try {
              const token = await setupNotifications();
              if (token) {
                console.log(`FCM Token for user ${fullUserData.id}:`, token);
              }
            } catch (error) {
              console.error('Error in delayed notification setup:', error);
            }
          }, 2000);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        // User logged out
        lastAuthUserId.current = null;
        setUser(null);
        fcmInitialized.current = false;
        messageListenerSet.current = false;
      }
      
      setLoading(false);
    });
    
    // Store the unsubscribe function
    authListenerCleanup.current = unsubscribe;
    
    // Cleanup
    return () => {
      if (authListenerCleanup.current) {
        authListenerCleanup.current();
        authStateListenerAdded.current = false;
      }
    };
  }, []); // Empty dependency array - only run once on mount

  // Login function
  // const login = async (email, password) => {
  //   try {
  //     // Clear any existing FCM state before login
  //     fcmInitialized.current = false;
      
  //     const userCredential = await signInWithEmailAndPassword(auth, email, password);
  //     const userData = await getUserDataByEmail(email);
  //     const fullUserData = { ...userCredential.user, ...userData };
  //     setUser(fullUserData);
      
  //     // After successful login, manually setup notifications
  //     setTimeout(async () => {
  //       try {
  //         const token = await setupNotifications();
  //         if (token) {
  //           console.log(`Manual FCM setup after login. User: ${fullUserData.id}, Token:`, token);
  //         }
  //       } catch (error) {
  //         console.error('Error in post-login notification setup:', error);
  //       }
  //     }, 2000);
      
  //     return fullUserData;
  //   } catch (error) {
  //     console.error('Login error:', error);
  //     throw error;
  //   }
  // };
  const login = async (email, password) => {
    try {
      // COMPLETELY clear FCM state before login
      localStorage.removeItem('fcmToken');
      localStorage.removeItem('fcmTokenTimestamp'); 
      localStorage.removeItem('fcmQuotaErrorCount');
      localStorage.removeItem('lastTokenRequest');
      fcmInitialized.current = false;
      messageListenerSet.current = false;
      notificationSetupInProgress.current = false;
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userData = await getUserDataByEmail(email);
      const fullUserData = { ...userCredential.user, ...userData };
      setUser(fullUserData);
      
      // After successful login, manually setup notifications
      setTimeout(async () => {
        try {
          // FORCE new token generation instead of using cached
          localStorage.removeItem('fcmToken');
          const token = await setupNotifications();
          
          // Log more info about the token for debugging
          if (token) {
            if (token.startsWith('dummy_')) {
              console.error('STILL USING DUMMY TOKEN - FCM FAILED!');
            } else {
              console.log('SUCCESS: Real FCM token obtained:', token);
            }
          }
        } catch (error) {
          console.error('Error in post-login notification setup:', error);
        }
      }, 2000);
      
      return fullUserData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      fcmInitialized.current = false;
      messageListenerSet.current = false;
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  // Password reset function
  const sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset link sent to your email.');
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Failed to send password reset link. Please try again.');
      throw error;
    }
  };

  // Fetch all bookings
  const fetchAllBookingsData = useCallback(() => {
    return fetchAllBookings((fetchedBookings) => {
      setBookings(fetchedBookings);
    });
  }, []);

  // Delete booking
  const deleteBookingHandler = async (bookingId) => {
    try {
      await deleteBookingService(bookingId);
      setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  };

  // Update booking
  const updateBookingHandler = async (bookingId, updatedBooking) => {
    try {
      await updateBookingService(bookingId, updatedBooking);
      setBookings(prevBookings => prevBookings.map(booking => 
        booking.id === bookingId ? { ...booking, ...updatedBooking } : booking
      ));
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  };

  // Fetch bookings when user changes
  useEffect(() => {
    if (user) {
      const unsubscribe = fetchAllBookingsData();
      return () => unsubscribe();
    }
  }, [user, fetchAllBookingsData]);

  // Fetch documents by type
  const fetchDocuments = useCallback(async (documentType) => {
    try {
      const q = query(
        collection(db, 'documents'),
        where('documentType', '==', documentType)
      );
      const querySnapshot = await getDocs(q);
      const fetchedDocumentsPromises = querySnapshot.docs.map(async doc => {
        const documentData = {
          id: doc.id,
          ...doc.data()
        };
        
        // Fetch user details for each document
        const userDetails = await fetchAuthorizedUserDetails(documentData.phoneNumber);
        
        return {
          ...documentData,
          userInfo: userDetails
        };
      });

      const fetchedDocuments = await Promise.all(fetchedDocumentsPromises);
      
      // Sort documents by uploadDate in descending order
      const sortedDocuments = fetchedDocuments.sort((a, b) => 
        b.uploadDate.toDate() - a.uploadDate.toDate()
      );

      setDocuments(sortedDocuments);
      return sortedDocuments;
    } catch (error) {
      console.error("Error fetching documents:", error);
      throw error;
    }
  }, []);

  // Fetch construction updates
  const fetchConstructionUpdates = useCallback(async () => {
    try {
      const q = query(collection(db, 'constructionUpdates'));
      const querySnapshot = await getDocs(q);
      const fetchedUpdates = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setConstructionUpdates(fetchedUpdates);
      return fetchedUpdates;
    } catch (error) {
      console.error("Error fetching construction updates:", error);
      throw error;
    }
  }, []);

  // Fetch feedback
  const fetchFeedback = useCallback(async () => {
    try {
      const q = query(collection(db, 'feedback'));
      const querySnapshot = await getDocs(q);
      const fetchedFeedbackPromises = querySnapshot.docs.map(async doc => {
        const feedbackData = {
          id: doc.id,
          ...doc.data()
        };
        
        // Fetch user details for each feedback entry
        const userDetails = await fetchAuthorizedUserDetails(feedbackData.phoneNumber);
        
        return {
          ...feedbackData,
          userInfo: userDetails
        };
      });

      const fetchedFeedback = await Promise.all(fetchedFeedbackPromises);
      
      // Sort feedback by createdAt in descending order (assuming there's a createdAt field)
      const sortedFeedback = fetchedFeedback.sort((a, b) => 
        b.createdAt.toDate() - a.createdAt.toDate()
      );

      setFeedbackData(sortedFeedback);
      return sortedFeedback;
    } catch (error) {
      console.error("Error fetching feedback:", error);
      throw error;
    }
  }, []);

  // Fetch special requests
  const fetchSpecialRequests = useCallback(async () => {
    try {
      const fetchedRequests = await fetchAllSpecialRequests();
      const users = await getAllAuthorizedUsers();
      setAuthorizedUsers(users);
      
      const requestsWithUserInfo = fetchedRequests.map(request => {
        const authorizedUser = users.find(user => user.phoneNumber === request.phoneNumber);
        return {
          ...request,
          userInfo: authorizedUser || null
        };
      });
      
      setSpecialRequests(requestsWithUserInfo);
      return requestsWithUserInfo;
    } catch (error) {
      console.error("Error fetching special requests:", error);
      throw error;
    }
  }, []);

  // Fetch members
  const fetchMembers = useCallback(async () => {
    try {
      const members = await getAllAuthorizedUsers();
      setAuthorizedUsers(members);
      return members;
    } catch (error) {
      console.error("Error fetching members:", error);
      throw error;
    }
  }, []);

  // Fetch staff
  const fetchStaff = useCallback(async () => {
    try {
      const staff = await getAllStaffUsers();
      setStaffUsers(staff);
      return staff;
    } catch (error) {
      console.error("Error fetching staff:", error);
      throw error;
    }
  }, []);

  // Fetch guests
  const fetchGuests = useCallback(async () => {
    try {
      const guestUsersSnapshot = await getDocs(collection(db, 'guestUsers'));
      const guests = await Promise.all(
        guestUsersSnapshot.docs.map(async (doc) => {
          const userData = await getGuestUserData(doc.id);
          return { id: doc.id, ...userData };
        })
      );
      setGuestUsers(guests);
      return guests;
    } catch (error) {
      console.error("Error fetching guests:", error);
      throw error;
    }
  }, []);

  // Fetch referrals
  const fetchReferrals = useCallback(async () => {
    try {
      const fetchedReferrals = await fetchAllReferrals();
      setReferrals(fetchedReferrals);
      return fetchedReferrals;
    } catch (error) {
      console.error("Error fetching referrals:", error);
      throw error;
    }
  }, []);

  // Reset FCM state - useful for troubleshooting
  const resetFCMState = useCallback(() => {
    localStorage.removeItem('fcmToken');
    localStorage.removeItem('fcmTokenTimestamp');
    localStorage.removeItem('fcmQuotaErrorCount');
    localStorage.removeItem('lastTokenRequest');
    fcmInitialized.current = false;
    messageListenerSet.current = false;
    notificationSetupInProgress.current = false;
    setFcmToken(null);
    return true;
  }, []);

  // Force token update - useful for admin panel
  const forceTokenUpdate = useCallback(async () => {
    resetFCMState();
    if (user) {
      try {
        const token = await setupNotifications();
        console.log('Forced token update:', token);
        return token;
      } catch (error) {
        console.error('Error in forced token update:', error);
        return null;
      }
    }
    return null;
  }, [user, resetFCMState, setupNotifications]);

  // Debugging: Check token storage
  const checkTokenStorage = useCallback(async () => {
    if (!user?.id) {
      console.log('No user ID available to check token storage');
      return null;
    }
    
    try {
      const docRef = doc(db, "dashboardTokens", user.id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        console.log('Token found in Firestore:', docSnap.data());
        return docSnap.data();
      } else {
        console.log('No token found in dashboardTokens collection for user', user.id);
        return null;
      }
    } catch (error) {
      console.error('Error checking token storage:', error);
      return null;
    }
  }, [user]);

  // Provide all values to the context
  const value = {
    user,
    loading,
    login,
    logout,
    bookings,
    fetchAllBookings: fetchAllBookingsData,
    deleteBooking: deleteBookingHandler,
    updateBooking: updateBookingHandler,
    sendPasswordReset,
    documents,
    fetchDocuments,
    constructionUpdates,
    fetchConstructionUpdates,
    feedbackData,
    fetchFeedback,
    specialRequests,
    fetchSpecialRequests,
    authorizedUsers,
    fetchMembers,
    staffUsers,
    fetchStaff,
    guestUsers,
    fetchGuests,
    referrals,
    fetchReferrals,
    fcmToken,
    notificationPermission,
    requestNotificationPermission,
    setupNotifications,
    resetFCMState,
    forceTokenUpdate,
    checkTokenStorage,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
export default AuthProvider;