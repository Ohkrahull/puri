// import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
// import { loginUser, getStaffUser } from '../firebase/services/UserService';
// import { fetchAllBookings, deleteBooking as deleteBookingService, updateBooking as updateBookingService } from '../firebase/services/bookingsData';
// import { toast } from 'react-toastify';
// // import { sendPasswordResetEmail } from 'firebase/auth';

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [bookings, setBookings] = useState([]);

//   useEffect(() => {
//     const storedUserId = localStorage.getItem('userId');
//     if (storedUserId) {
//       getStaffUser(storedUserId).then(userData => {
//         if (userData) {
//           setUser(userData);
//         } else {
//           localStorage.removeItem('userId');
//         }
//         setLoading(false);
//       }).catch(error => {
//         console.error('Error fetching user data:', error);
//         localStorage.removeItem('userId');
//         setLoading(false);
//       });
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const login = async (email, password) => {
//     try {
//       const user = await loginUser(email, password);
//       setUser(user);
//       localStorage.setItem('userId', user.id);
//       return user;
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     setBookings([]);
//     localStorage.removeItem('userId');
//   };

//   // const sendPasswordReset = async (email) => {
//   //   try {
//   //     await sendPasswordResetEmail(email);
//   //     toast.success('Password reset link sent to your email.');
//   //     return true;
//   //   } catch (error) {
//   //     console.error('Password reset error:', error);
//   //     toast.error('Failed to send password reset link. Please try again.');
//   //     throw error;
//   //   }
//   // };

//   const fetchAllBookingsData = useCallback(() => {
//     return fetchAllBookings((fetchedBookings) => {
//       setBookings(fetchedBookings);
//     });
//   }, []);

//   const deleteBookingHandler = async (bookingId) => {
//     try {
//       await deleteBookingService(bookingId);
//       setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
//     } catch (error) {
//       console.error('Error deleting booking:', error);
//       throw error;
//     }
//   };

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

//   useEffect(() => {
//     if (user) {
//       const unsubscribe = fetchAllBookingsData();
//       return () => unsubscribe();
//     }
//   }, [user, fetchAllBookingsData]);

//   const value = {
//     user,
//     loading,
//     login,
//     logout,
//     bookings,
//     fetchAllBookings: fetchAllBookingsData,
//     deleteBooking: deleteBookingHandler,
//     updateBooking: updateBookingHandler,
//     // sendPasswordReset, // Add this new function to the context
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

import { signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { auth, db } from '../firebase/firebase';
import { fetchAllBookings, deleteBooking as deleteBookingService, updateBooking as updateBookingService, fetchAuthorizedUserDetails } from '../firebase/services/bookingsData';
import { fetchAllSpecialRequests } from '../firebase/services/SpecialRequests';
import { getAllAuthorizedUsers } from '../firebase/services/UserData';
import { getAllStaffUsers, getGuestUserData } from '../firebase/services/UserService';
import { fetchAllReferrals } from '../firebase/services/Referals';


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
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


  const getUserDataByEmail = async (email) => {
    const staffUsersRef = collection(db, 'staffUsers');
    const q = query(staffUsersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() };
    } else {
      throw new Error("User not found in staff database");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await getUserDataByEmail(firebaseUser.email);
          setUser({ ...firebaseUser, ...userData });
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []); // Empty dependency array ensures this effect runs only once

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userData = await getUserDataByEmail(email);
      const fullUserData = { ...userCredential.user, ...userData };
      setUser(fullUserData);
      return fullUserData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      // toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

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

  const fetchAllBookingsData = useCallback(() => {
    return fetchAllBookings((fetchedBookings) => {
      setBookings(fetchedBookings);
    });
  }, []);

  const deleteBookingHandler = async (bookingId) => {
    try {
      await deleteBookingService(bookingId);
      setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  };

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

  useEffect(() => {
    if (user) {
      const unsubscribe = fetchAllBookingsData();
      return () => unsubscribe();
    }
  }, [user, fetchAllBookingsData]);

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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;