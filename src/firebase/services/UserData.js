import { getFirestore, collection, doc, setDoc, updateDoc, deleteDoc, getDoc, getDocs,serverTimestamp, orderBy, query } from 'firebase/firestore';
import { getApp } from 'firebase/app';


const AUTHORIZED_USERS_COLLECTION = 'authorizedUsers';

// Firestore reference
const db = getFirestore(getApp());
const COLLECTION_NAME = 'authorizedUsers';

export const addAuthorizedUser = async (userData) => {
  try {
    await setDoc(doc(db, COLLECTION_NAME, userData.phoneNumber), userData);
    console.log(`Authorized user added successfully: ${userData.phoneNumber}`);
  } catch (error) {
    console.error('Error adding authorized user:', error);
    throw error;
  }
};

export const confirmAuthorizedUser = async (userData) => {
  try {
    await updateDoc(doc(db, COLLECTION_NAME, userData.phoneNumber), {
      ...userData,
      authorized: true,
    });
    console.log(`Authorized user confirmed: ${userData.phoneNumber}`);
  } catch (error) {
    console.error('Error confirming authorized user:', error);
    throw error;
  }
};

export const removeAuthorizedUser = async (phoneNumber) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, phoneNumber));
    console.log(`Authorized user removed: ${phoneNumber}`);
  } catch (error) {
    console.error('Error removing authorized user:', error);
    throw error;
  }
};

export const isAuthorizedUser = async (phoneNumber) => {
  try {
    const userDoc = await getDoc(doc(db, COLLECTION_NAME, phoneNumber));
    return userDoc.exists() && userDoc.data().authorized === true;
  } catch (error) {
    console.error('Error checking if user is authorized:', error);
    throw error;
  }
};

// export const getAllAuthorizedUsers = async () => {
//   try {
//     const snapshot = await getDocs(collection(db, COLLECTION_NAME));
//     return snapshot.docs.map((doc) => ({
//       id: doc.id, // This is the phone number
//       ...doc.data()
//     }));
//   } catch (error) {
//     console.error('Error getting all authorized users:', error);
//     throw error;
//   }
// };

// export const updateAuthorizedUser = async (phoneNumber, updates) => {
//   try {
//     await updateDoc(doc(db, COLLECTION_NAME, phoneNumber), updates);
//     console.log(`Authorized user updated: ${phoneNumber}`);
//   } catch (error) {
//     console.error('Error updating authorized user:', error);
//     throw error;
//   }
// };

// export const updateAuthorizedUser = async (phoneNumber, updates) => {
//   try {
//     const userRef = doc(db, COLLECTION_NAME, phoneNumber);
//     const updatedData = {
//       ...updates,
//       lastUpdated: serverTimestamp()
//     };
//     await updateDoc(userRef, updatedData);
//     console.log(`Authorized user updated: ${phoneNumber}`);
//     return updatedData;
//   } catch (error) {
//     console.error('Error updating authorized user:', error);
//     throw error;
//   }
// };

// export const addNewAuthorizedUser = async (phoneNumber, firstName, lastName, email) => {
//   if (!phoneNumber) {
//     throw new Error('Phone number is required');
//   }

//   const userData = {
//     phoneNumber,
//     firstName,
//     lastName,
//     email,
//     authorized: true,
//     addedAt: new Date(), // For server timestamp, you'd need to use `firebase.firestore.FieldValue.serverTimestamp()` in Firebase Web SDK
//   };

//   try {
//     await addAuthorizedUser(userData);
//     console.log(`Authorized user added successfully: ${phoneNumber}`);
//   } catch (error) {
//     console.error('Error adding authorized user:', error);
//     throw error;
//   }
// };
// export const addNewAuthorizedUser = async (phoneNumber, firstName, lastName, email, wing, flatNumber) => {
//   if (!phoneNumber) {
//     throw new Error('Phone number is required');
//   }

//   const userData = {
//     phoneNumber,
//     firstName,
//     lastName,
//     email,
//     wing,
//     flatNumber,
//     authorized: true,
//     addedAt: serverTimestamp(),
//     lastLogin: serverTimestamp()
//   };

//   try {
//     const userRef = doc(collection(db, AUTHORIZED_USERS_COLLECTION), phoneNumber);
//     await setDoc(userRef, userData);
//     console.log(`Authorized user added successfully: ${phoneNumber}`);
//   } catch (error) {
//     console.error('Error adding authorized user:', error);
//     throw error;
//   }
// };



export const addNewAuthorizedUser = async (phoneNumber, firstName, lastName, email, wing, flatNumber) => {
  if (!phoneNumber) {
    throw new Error('Phone number is required');
  }

   // Ensure the phone number always starts with +91
   const formattedPhoneNumber = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;


  const userData = {
    phoneNumber: formattedPhoneNumber,
    firstName,
    lastName,
    email,
    wing,
    flatNumber,
    addedAt: serverTimestamp(),
    lastLogin: serverTimestamp()
  };

  try {
    const userRef = doc(collection(db, AUTHORIZED_USERS_COLLECTION), formattedPhoneNumber);
    await setDoc(userRef, userData);
    console.log(`Authorized user added successfully: ${formattedPhoneNumber}`);
    return userData;
  } catch (error) {
    console.error('Error adding authorized user:', error);
    throw error;
  }
};

export const getAllAuthorizedUsers = async () => {
  try {
    const usersRef = collection(db, AUTHORIZED_USERS_COLLECTION);
    const q = query(usersRef, orderBy('addedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      addedAt: doc.data().addedAt?.toDate() // Convert Firestore Timestamp to JavaScript Date
    }));
  } catch (error) {
    console.error('Error getting all authorized users:', error);
    throw error;
  }
};

// export const updateAuthorizedUser = async (phoneNumber, updates) => {
//   try {
//     const userRef = doc(db, AUTHORIZED_USERS_COLLECTION, phoneNumber);
//     const updatedData = {
//       ...updates,
//       lastUpdated: serverTimestamp()
//     };
//     await updateDoc(userRef, updatedData);
//     console.log(`Authorized user updated: ${phoneNumber}`);
//     return updatedData;
//   } catch (error) {
//     console.error('Error updating authorized user:', error);
//     throw error;
//   }
// };

export const updateAuthorizedUser = async (oldPhoneNumber, updates) => {
  try {
    const userRef = doc(db, AUTHORIZED_USERS_COLLECTION, oldPhoneNumber);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error(`User with phone number ${oldPhoneNumber} not found`);
    }

    const currentData = userDoc.data();
    const newPhoneNumber = updates.phoneNumber;

    const updatedData = {
      ...currentData,
      ...updates,
      lastUpdated: serverTimestamp()
    };

    if (newPhoneNumber && newPhoneNumber !== oldPhoneNumber) {
      // Create a new document with the new phone number
      const newUserRef = doc(db, AUTHORIZED_USERS_COLLECTION, newPhoneNumber);
      await setDoc(newUserRef, updatedData);

      // Delete the old document
      await deleteDoc(userRef);

      console.log(`User updated and moved to new phone number: ${newPhoneNumber}`);
    } else {
      // Update the existing document
      await updateDoc(userRef, updatedData);
      console.log(`User updated: ${oldPhoneNumber}`);
    }

    return updatedData;
  } catch (error) {
    console.error('Error updating authorized user:', error);
    throw error;
  }
};