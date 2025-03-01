import { db,auth } from '../firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, getDocs, getDoc, serverTimestamp, query, where } from 'firebase/firestore';
import bcrypt from 'bcryptjs';
// import admin from "firebase-admin";
import axios from 'axios';
import { deleteUser, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';

// Staff Users

const COLLECTION_NAME = 'staffUsers';
const MEMBER_COLLECTION = 'users'; 



// export const addStaffUser = async (userData) => {
//   console.log('Creating user:', userData);
//   const { email, password, role, firstName, lastName } = userData;

  
//   try {
//     // Check if email already exists in either collection
//     const emailExists = await checkIfEmailExists(email);
    
//     if (emailExists) {
//       // throw new Error("This email is already registered. Please use a different email address.");
//       toast.error("This email is already registered. Please use a different email address.");
//     }
    
//     // Create user in Firebase Authentication
//     const response = await axios.post('https://puri-dashboard-server.onrender.com/api/create-user', {
//       email,
//       password,
//       firstName,
//       lastName,
//       role
//     });

  

//     const authUID = response.data.userId; // Get the auth UID from the response

//     // Prepare user data for Firestore
//     const userRef = doc(collection(db, COLLECTION_NAME));
//     const firestoreData = {
//       email,
//       firstName,
//       lastName,
//       authUID, // Store the Auth UID in Firestore
//       roles: {
//         admin: role === 'Admin',
//         booking: role === 'Booking Manager',
//         documents: role === 'Legal Documents',
//         constructionUpdate: role === 'Construction Update'
//       },
//       addedAt: serverTimestamp(),
//       lastLogin: null
//     };

//     // Add user to Firestore
//     await setDoc(userRef, firestoreData);

//     console.log('User created:', { firestoreId: userRef.id, authUID });

//     return { 
//       firestoreId: userRef.id, 
//       authUID,
//       ...firestoreData
//     };
//   } catch (error) {
//     console.error('Error creating user:', error);
//     if (error.response) {
//       // The request was made and the server responded with a status code
//       // that falls out of the range of 2xx
//       console.error('Server responded with error:', error.response.data);
//       toast.error(error.response.data.details || 'Failed to add staff user');
//       // throw new Error(error.response.data.details || 'Failed to add staff user');
//     } else if (error.request) {
//       // The request was made but no response was received
//       console.error('No response received:', error.request);
//       toast.error('No response from server')
//       // throw new Error('No response from server');
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       console.error('Error setting up request:', error.message);
//       toast.error('Error setting up request');
//       // throw new Error('Error setting up request');
//     }
//   }
// };

// export const addStaffUser = async (userData) => {
//   console.log('Creating user:', userData);
//   const { email, password, role, firstName, lastName, phoneNumber, employeeId } = userData;
//   console.log(userData);
  

//   try {
//     // Check if email already exists in either collection
//     const emailExists = await checkIfEmailExists(email);
    
//     if (emailExists) {
//       console.log("This email is already registered. Please use a different email address.");
      
//       throw new Error("This email is already registered. Please use a different email address.");
//     }
    
//     // Create user in Firebase Authentication
//     const response = await axios.post('https://puri-dashboard-server.onrender.com/api/create-user', {
//       email,
//       password,
//       firstName,
//       lastName,
//       role,
//       phoneNumber,
//       employeeId
//     });

//     const authUID = response.data.userId; // Get the auth UID from the response

//     // Prepare user data for Firestore
//     const userRef = doc(collection(db, COLLECTION_NAME));
//     const firestoreData = {
//       email,
//       phoneNumber,
//       employeeId,
//       firstName,
//       lastName,
//       authUID,
//       roles: {
//         admin: role === 'Admin',
//         booking: role === 'Booking Manager',
//         documents: role === 'Legal Documents',
//         constructionUpdate: role === 'Construction Update'
//       },
//       addedAt: serverTimestamp(),
//       lastLogin: null
//     };

//     // Add user to Firestore
//     await setDoc(userRef, firestoreData);

//     console.log('User created:', { firestoreId: userRef.id, authUID });

//     return { 
//       firestoreId: userRef.id, 
//       authUID,
//       ...firestoreData
//     };
//   } catch (error) {
//     console.error('Error creating user:', error);
//     if (error.response && error.response.data) {
//       throw new Error(error.response.data.details || 'Failed to add staff user');
//     } else {
//       throw error;
//     }
//   }
// };

export const addStaffUser = async (userData) => {
  console.log('Creating user:', userData);
  const { email, password, roles, firstName, lastName, phoneNumber, employeeId } = userData;

  try {
    // Check if email already exists in either collection
    const emailExists = await checkIfEmailExists(email);
    
    if (emailExists) {
      console.log("This email is already registered. Please use a different email address.");
      throw new Error("This email is already registered. Please use a different email address.");
    }
    
    // Determine primary role for the API call (needed because the API expects a single role)
    let primaryRole = 'Staff';
    if (roles.admin) {
      primaryRole = 'Admin';
    } else if (roles.bookings) {
      primaryRole = 'Booking Manager';
    } else if (roles.documents) {
      primaryRole = 'Legal Documents';
    } else if (roles.constructionUpdate) {
      primaryRole = 'Construction Update';
    }
    
    // Create user in Firebase Authentication via API
    const response = await axios.post('https://puri-dashboard-server.onrender.com/api/create-user', {
      email,
      password,
      firstName,
      lastName,
      role: primaryRole, // API still expects a single role
      phoneNumber,
      employeeId
    });

    const authUID = response.data.userId; // Get the auth UID from the response

    // Prepare user data for Firestore with the complete roles object
    const userRef = doc(collection(db, COLLECTION_NAME));
    const firestoreData = {
      email,
      phoneNumber,
      employeeId,
      firstName,
      lastName,
      authUID,
      // Store the full roles object with all permissions
      roles: {
        admin: roles.admin || false,
        dashboard: roles.dashboard || false,
        flatManagement: roles.flatManagement || false,
        userRequests: roles.userRequests || false,
        facility: roles.facility || false,
        bookings: roles.bookings || false,
        visitors: roles.visitors || false,
        parcels: roles.parcels || false,
        notices: roles.notices || false,
        sosHistory: roles.sosHistory || false,
        feedback: roles.feedback || false,
        specialRequest: roles.specialRequest || false,
        rentalRequest: roles.rentalRequest || false,
        documents: roles.documents || false,
        constructionUpdate: roles.constructionUpdate || false,
        users: roles.users || false,
        referrals: roles.referrals || false,
        support: roles.support || false
      },
      addedAt: serverTimestamp(),
      lastLogin: null
    };

    // Add user to Firestore
    await setDoc(userRef, firestoreData);

    console.log('User created:', { firestoreId: userRef.id, authUID });

    return { 
      firestoreId: userRef.id, 
      authUID,
      ...firestoreData
    };
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.details || 'Failed to add staff user');
    } else {
      throw error;
    }
  }
};

export const checkIfEmailExists = async (email) => {
  const staffQuery = query(collection(db, COLLECTION_NAME), where("email", "==", email));
  const memberQuery = query(collection(db, MEMBER_COLLECTION), where("email", "==", email));
  
  const [staffSnapshot, memberSnapshot] = await Promise.all([
    getDocs(staffQuery),
    getDocs(memberQuery)
  ]);

  return !staffSnapshot.empty || !memberSnapshot.empty;
};

export const checkIfPhoneExists = async (phone) => {
  const staffQuery = query(collection(db, COLLECTION_NAME), where("phone", "==", phone));
  const memberQuery = query(collection(db, MEMBER_COLLECTION), where("phone", "==", phone));
  
  const [staffSnapshot, memberSnapshot] = await Promise.all([
    getDocs(staffQuery),
    getDocs(memberQuery)
  ]);

  return !staffSnapshot.empty || !memberSnapshot.empty;
};

export const updateStaffUser = async (uid, updates) => {
  if (!uid || typeof uid !== 'string' || uid.length > 128) {
    throw new Error('Invalid user UID provided');
  }

  let authUpdateSuccess = false;
  let firestoreUpdateSuccess = false;

  try {
    // Update Authentication
    const authUpdates = {};
    if (updates.email) authUpdates.email = updates.email;
    if (updates.password) authUpdates.password = updates.password;

    if (Object.keys(authUpdates).length > 0) {
      const response = await axios.post('https://puri-dashboard-server.onrender.com/api/update-auth', {
        uid,
        ...authUpdates
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 200) {
        authUpdateSuccess = true;
        
        console.log('Authentication updated successfully');
      } else {
        
        throw new Error(response.data.error || 'Failed to update auth credentials');
      }
    } else {
      authUpdateSuccess = true; // No auth updates needed
    }

    // Update Firestore
    const userQuery = query(collection(db, COLLECTION_NAME), where("authUID", "==", uid));
    const userSnapshot = await getDocs(userQuery);

    let userRef;
    if (userSnapshot.empty) {
      console.warn('User not found in Firestore, creating new document');
      userRef = doc(collection(db, COLLECTION_NAME));
    } else {
      userRef = doc(db, COLLECTION_NAME, userSnapshot.docs[0].id);
    }
    
    const dbUpdates = { ...updates, authUID: uid };
    delete dbUpdates.password; // Don't store password in Firestore
    
    if (dbUpdates.roles) {
      dbUpdates.roles = {
        admin: dbUpdates.roles.includes('admin'),
        booking: dbUpdates.roles.includes('booking'),
        documents: dbUpdates.roles.includes('documents'),
        constructionUpdate: dbUpdates.roles.includes('constructionUpdate')
      };
    }

    await setDoc(userRef, dbUpdates, { merge: true });
    firestoreUpdateSuccess = true;
    console.log('Firestore updated successfully');

    return { 
      message: 'Staff user updated successfully',
      authUpdateSuccess,
      firestoreUpdateSuccess
    };
  } catch (error) {
    console.error('Error updating staff user:', error);
    return {
      error: error.message,
      authUpdateSuccess,
      firestoreUpdateSuccess
    };
  }
};

// export const removeStaffUser = async (userId) => {
//   await deleteDoc(doc(db, COLLECTION_NAME, userId));
// };

// export const removeStaffUser = async (userId) => {
//   try {
//     // First, get the user document from Firestore
//     const userDoc = await getDoc(doc(db, COLLECTION_NAME, userId));
    
//     if (!userDoc.exists()) {
//       throw new Error('User not found in Firestore');
//     }

//     const userData = userDoc.data();
//     const authUID = userData.authUID;

//     if (!authUID) {
//       throw new Error('Auth UID not found for user');
//     }

//     // Delete user from Firebase Authentication
//     const response = await axios.post('https://puri-dashboard-server.onrender.com/api/delete-user', {
//       uid: authUID
//     });

//     if (response.status !== 200) {
//       throw new Error('Failed to delete user from Firebase Authentication');
//     }

//     // If successful, delete from Firestore
//     await deleteDoc(doc(db, COLLECTION_NAME, userId));

//     console.log('User successfully deleted from both Auth and Firestore');
//     toast.success('Staff member successfully deleted');
//   } catch (error) {
//     console.error('Error removing staff user:', error);
//     toast.error(`Failed to delete staff member: ${error.message}`);
//     throw error;
//   }
// };

export const removeStaffUser = async (userId, authUID) => {
  try {
    // Delete from Firestore
    await deleteDoc(doc(db, COLLECTION_NAME, userId));
    console.log('User deleted from Firestore');

    // Delete from Authentication
    const user = auth.currentUser;
    if (user && user.uid === authUID) {
      await deleteUser(user);
      console.log('User deleted from Authentication');
    } else {
      console.log('Current user does not match the user to be deleted. Skipping Authentication deletion.');
    }

    toast.success('Staff member successfully deleted');
  } catch (error) {
    console.error('Error removing staff user:', error);
    toast.error(`Failed to delete staff member: ${error.message}`);
    throw error;
  }
};

export const getStaffUser = async (userId) => {
  const docSnap = await getDoc(doc(db, COLLECTION_NAME, userId));
  if (docSnap.exists()) {
    const userData = docSnap.data();
    delete userData.password; // Don't send password to client
    return { id: docSnap.id, ...userData };
  }
  return null;
};

export const getAllStaffUsers = async () => {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  return snapshot.docs.map(doc => {
    const userData = doc.data();
    delete userData.password; // Don't send password to client
    return { id: doc.id, ...userData };
  });
};

export const getUsersByRole = async (role) => {
  const q = query(collection(db, COLLECTION_NAME), where(`roles.${role}`, "==", true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const userData = doc.data();
    delete userData.password; // Don't send password to client
    return { id: doc.id, ...userData };
  });
};





export const loginUser = async (email, password) => {
  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Query Firestore to find the document with matching authUID
    const q = query(collection(db, 'staffUsers'), where("authUID", "==", user.uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      
      // Update last login
      await updateDoc(doc(db, 'staffUsers', userDoc.id), {
        lastLogin: serverTimestamp()
      });

      // Combine Auth user data with Firestore data
      const combinedUserData = {
        id: userDoc.id,
        authUID: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        ...userData
      };

      // Ensure password is not included in the returned data
      delete combinedUserData.password;

      return combinedUserData;
    } else {
      console.warn('User document does not exist in Firestore');
      throw new Error('User data not found');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
// Authorized Users
const AUTHORIZED_USERS_COLLECTION = 'users';

export const addAuthorizedUser = async (userData) => {
  const { email, firstName, lastName, phoneNumber } = userData;

  const userRef = doc(collection(db, AUTHORIZED_USERS_COLLECTION));
  
  await setDoc(userRef, {
    email,
    firstName,
    lastName,
    phoneNumber,
    authorized: true,
    addedAt: serverTimestamp(),
    lastLogin: serverTimestamp() // Set to current time as per your schema
  });

  return userRef.id;
};

export const getAuthorizedUserData = async (phoneNumber) => {
    try {
      const userRef = doc(db, 'users', phoneNumber);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          phoneNumber: data.phoneNumber,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          authorized: data.authorized,
          addedAt: data.addedAt,
          lastLogin: data.lastLogin,
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting authorized user data:', error);
      throw error;
    }
};

export const deleteAuthorizedUser = async (phoneNumber) => {
    try {
      const userRef = doc(db, 'users', phoneNumber);
      await deleteDoc(userRef);
      console.log(`Authorized user with phone number ${phoneNumber} has been deleted successfully.`);
    } catch (error) {
      console.error('Error deleting authorized user:', error);
      throw error;
    }
  };

// GuestUsers
export const getGuestUserData = async (phoneNumber) => {
    try {
      const userRef = doc(db, 'guestUsers', phoneNumber);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          phoneNumber: data.phoneNumber,
          firstName: data.firstName, // Assuming 'name' in guestUsers corresponds to 'firstName'
          email: data.email,
          lastLogin: data.lastLogin,
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting guest user data:', error);
      throw error;
    }
};

export const getAllGuestUsers = async () => {
  try {
    const guestUsersSnapshot = await getDocs(collection(db, 'guestUsers'));
    const guestUsers = guestUsersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return guestUsers;
  } catch (error) {
    console.error('Error fetching guest users:', error);
    throw error;
  }
};

export const deleteGuestUser = async (phoneNumber) => {
    try {
      const userRef = doc(db, 'guestUsers', phoneNumber);
      await deleteDoc(userRef);
      console.log(`Guest user with phone number ${phoneNumber} has been deleted successfully.`);
    } catch (error) {
      console.error('Error deleting guest user:', error);
      throw error;
    }
  };



  try {
    
  } catch (error) {
    
  }