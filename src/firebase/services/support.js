import { db } from '../firebase';
import { collection, getDocs, doc, deleteDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { fetchAuthorizedUserDetails, fetchUserDetails } from '../services/bookingsData'; // Import the function from bookingData.js

// Updated function to fetch all support documents with user info
// export const getAllSupportDocuments = async () => {
//   try {
//     const supportCollection = collection(db, 'support');
//     const supportSnapshot = await getDocs(supportCollection);
//     const supportPromises = supportSnapshot.docs.map(async (doc) => {
//       const supportData = doc.data();
//       const userInfo = await fetchAuthorizedUserDetails(supportData.phoneNumber);
//       return {
//         id: doc.id,
//         ...supportData,
//         userInfo: userInfo || {} // Include user info or an empty object if not found
//       };
//     });
//     const supportList = await Promise.all(supportPromises);
//     return supportList;
//   } catch (error) {
//     console.error('Error fetching support documents:', error);
//     throw error;
//   }
// };

// Updated function to fetch all support documents with user info
// Updated function to fetch all support documents with user info
export const getAllSupportDocuments = async () => {
  try {
    const supportCollection = collection(db, 'support');
    const supportSnapshot = await getDocs(supportCollection);
    const supportPromises = supportSnapshot.docs.map(async (doc) => {
      const supportData = doc.data();
      const userInfo = await fetchUserDetails(supportData.phoneNumber);
      return {
        id: doc.id,
        ...supportData,
        userInfo: userInfo || {} // Include user info or an empty object if not found
      };
    });
    const supportList = await Promise.all(supportPromises);
    return supportList;
  } catch (error) {
    console.error('Error fetching support documents:', error);
    throw error;
  }
};

// Function to delete a support document (unchanged)
export const deleteSupportDocument = async (documentId) => {
  try {
    const docRef = doc(db, 'support', documentId);
    await deleteDoc(docRef);
    console.log('Support document successfully deleted');
  } catch (error) {
    console.error('Error deleting support document:', error);
    throw error;
  }
};

// In firebase/services/support.js
export const updateSupportStatus = async (supportId, newStatus) => {
  try {
    const supportRef = doc(db, 'support', supportId);
    await updateDoc(supportRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating support status:', error);
    throw error;
  }
};

// Updated function to fetch a support document by ID
export const fetchSupportById = async (supportId) => {
  if (!supportId) {
    throw new Error('Support ID is required');
  }

  try {
    const supportDocRef = doc(db, 'support', supportId);
    const supportSnapshot = await getDoc(supportDocRef);

    if (supportSnapshot.exists()) {
      const supportData = supportSnapshot.data();
      const userInfo = await fetchUserDetails(supportData.phoneNumber);
      return {
        id: supportSnapshot.id,
        ...supportData,
        userInfo: userInfo || {}
      };
    } else {
      console.log('No support document found with ID:', supportId);
      return null;
    }
  } catch (error) {
    console.error('Error fetching support document:', error);
    throw error;
  }
};