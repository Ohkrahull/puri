// src/firebase/services/SpecialRequests.js

import { getFirestore, collection, getDocs, doc, getDoc, Firestore, collectionGroup, deleteDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';

const db = getFirestore(getApp());

// export const fetchAllSpecialRequests = async () => {
//   try {
//     console.log("Fetching special requests...");

//     const specialRequestsRef = collection(db, 'specialRequests');
//     console.log("Special requests collection reference:", specialRequestsRef);

//     const specialRequestsSnapshot = await getDocs(specialRequestsRef);
//     console.log("Number of documents in specialRequests:", specialRequestsSnapshot.size);

//     if (specialRequestsSnapshot.empty) {
//       console.log("The specialRequests collection is empty.");
//       return [];
//     }

//     let allRequests = [];

//     for (const userDoc of specialRequestsSnapshot.docs) {
//       const userId = userDoc.id;
//       console.log("Processing user document:", userId);
//       console.log("User document data:", userDoc.data());

//       const userRequestsRef = collection(db, 'specialRequests', userId, 'requests');
//       const userRequestsSnapshot = await getDocs(userRequestsRef);
//       console.log(`Number of requests for user ${userId}:`, userRequestsSnapshot.size);

//       for (const requestDoc of userRequestsSnapshot.docs) {
//         const requestData = requestDoc.data();
//         console.log("Request document data:", requestData);

//         allRequests.push({
//           id: requestDoc.id,
//           userId: userId,
//           ...requestData
//         });
//       }
//     }

//     console.log('Fetched all special requests:', allRequests);
//     return allRequests;
//   } catch (error) {
//     console.error('Error fetching all special requests:', error);
//     console.error('Error details:', error.code, error.message);
//     throw error;
//   }
// };

// // Helper function to get a single special request
// export const getSpecialRequest = async (userId, requestId) => {
//   try {
//     const requestDocRef = doc(db, 'specialRequests', userId, 'requests', requestId);
//     const requestDocSnap = await getDoc(requestDocRef);

//     if (requestDocSnap.exists()) {
//       console.log("Special request data:", requestDocSnap.data());
//       return { id: requestDocSnap.id, ...requestDocSnap.data() };
//     } else {
//       console.log("No such special request!");
//       return null;
//     }
//   } catch (error) {
//     console.error('Error getting special request:', error);
//     throw error;
//   }
// };

// export const fetchAllSpecialRequests = async () => {
//   try {
//     const specialRequestsSnapshot = await Firestore()
//       .collectionGroup('requests')
//       .get(); // No orderBy used here

//     const specialRequests = specialRequestsSnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     console.log('Fetched all special requests:', specialRequests);
//     return specialRequests;
//   } catch (error) {
//     console.error('Error fetching all special requests:', error);
//     throw error;
//   }
// };


export const fetchAllSpecialRequests = async () => {
  try {
    // Fetch documents from all 'requests' subcollections using collectionGroup
    const specialRequestsSnapshot = await getDocs(collectionGroup(db, 'requests'));

    // Map over the snapshot to extract the request data
    const specialRequests = specialRequestsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // console.log('Fetched all special requests:', specialRequests);
    return specialRequests;
  } catch (error) {
    console.error('Error fetching all special requests:', error);
    throw error;
  }
};

export const getSpecialRequest = async (requestId) => {
  try {
    const requestDoc = await getDoc(doc(db, 'specialRequests', requestId));
    if (requestDoc.exists()) {
      return { id: requestDoc.id, ...requestDoc.data() };
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error getting special request:', error);
    throw error;
  }
};


// New function to delete a special request
export const deleteSpecialRequest = async (requestId) => {
  try {
    // First, we need to find the parent document that contains this request
    const specialRequestsSnapshot = await getDocs(collectionGroup(db, 'requests'));
    const requestDoc = specialRequestsSnapshot.docs.find(doc => doc.id === requestId);

    if (requestDoc) {
      const parentPath = requestDoc.ref.parent.parent;
      if (parentPath) {
        await deleteDoc(doc(parentPath, 'requests', requestId));
        console.log(`Special request deleted: ${requestId}`);
      } else {
        console.error('Could not determine parent path for the request');
        throw new Error('Could not determine parent path for the request');
      }
    } else {
      console.log('No such special request!');
      throw new Error('No such special request!');
    }
  } catch (error) {
    console.error('Error deleting special request:', error);
    throw error;
  }
};