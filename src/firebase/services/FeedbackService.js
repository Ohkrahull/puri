import { getFirestore, collection, addDoc, serverTimestamp, query, where, onSnapshot, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { fetchAuthorizedUserDetails } from './bookingsData';

const FEEDBACK_COLLECTION = 'feedback';
const db = getFirestore(getApp());

// Function to save feedback
export const saveFeedback = async (feedbackData) => {
  try {
    if (!feedbackData.userId) {
      throw new Error('User ID is required for feedback');
    }

    const feedbackRef = await addDoc(collection(db, FEEDBACK_COLLECTION), {
      ...feedbackData,
      createdAt: serverTimestamp(),
    });
    
    console.log('Feedback saved successfully with ID:', feedbackRef.id);
    return feedbackRef.id;
  } catch (error) {
    console.error('Error saving feedback:', error);
    throw error;
  }
};

export const fetchAllFeedback = (callback) => {
  return onSnapshot(collection(db, FEEDBACK_COLLECTION),
    async (snapshot) => {
      try {
        const feedbackPromises = snapshot.docs.map(async (doc) => {
          const feedbackData = doc.data();
          const userDetails = await fetchAuthorizedUserDetails(feedbackData.phoneNumber);
          return {
            id: doc.id,
            ...feedbackData,
            createdAt: feedbackData.createdAt?.toDate() || new Date(),
            userInfo: userDetails
          };
        });

        const processedFeedback = await Promise.all(feedbackPromises);
        callback(processedFeedback);
      } catch (error) {
        console.error('Error processing feedback:', error);
        callback([], error);
      }
    },
    (error) => {
      console.error('Error fetching all feedback:', error);
      callback([], error);
    }
  );
};

export const fetchFeedbackById = async (feedbackId) => {
  if (!feedbackId) {
    console.error('Invalid feedbackId provided to fetchFeedbackById');
    return null;
  }

  try {
    const feedbackDocRef = doc(db, FEEDBACK_COLLECTION, feedbackId);
    const feedbackDoc = await getDoc(feedbackDocRef);
    
    if (feedbackDoc.exists()) {
      const feedbackData = feedbackDoc.data();
      const userDetails = await fetchAuthorizedUserDetails(feedbackData.phoneNumber);
      return {
        id: feedbackDoc.id,
        ...feedbackData,
        createdAt: feedbackData.createdAt?.toDate() || new Date(),
        userInfo: userDetails
      };
    } else {
      console.log('No feedback found with the given ID');
      return null;
    }
  } catch (error) {
    console.error("Error fetching feedback by ID:", error);
    throw error;
  }
};

// Function to fetch all feedback
// export const fetchAllFeedback = (callback) => {
//   return onSnapshot(collection(db, FEEDBACK_COLLECTION),
//     (snapshot) => {
//       const feedback = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       callback(feedback);
//     },
//     (error) => {
//       console.error('Error fetching all feedback:', error);
//     }
//   );
// };

// Function to fetch feedback for a specific user
// export const fetchUserFeedback = (userId, callback) => {
//   const q = query(collection(db, FEEDBACK_COLLECTION), where('userId', '==', userId));
//   return onSnapshot(q,
//     (snapshot) => {
//       const feedback = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       callback(feedback);
//     },
//     (error) => {
//       console.error('Error fetching user feedback:', error);
//     }
//   );
// };

export const fetchUserFeedback = async (uid) => {
  if (!uid) {
    console.error('Invalid userId provided to fetchUserFeedback');
    return [];
  }

  try {
    const feedbackRef = collection(db, 'feedback');
    const q = query(feedbackRef, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching user feedback:", error);
    throw error;
  }
};

// Example usage of saveFeedback function
// export const submitFeedback = async (userId, feedbackData) => {
//   const feedback = {
//     userId,
//     name: `${feedbackData.firstName} ${feedbackData.lastName}`,
//     firstName: feedbackData.firstName,
//     lastName: feedbackData.lastName,
//     email: feedbackData.email,
//     phoneNumber: feedbackData.phoneNumber,
//     wing: feedbackData.wing,
//     flatNumber: feedbackData.flatNumber,
//     feedbackText: feedbackData.feedbackText,
//     date: new Date(),
//     time: new Date().toLocaleTimeString(),
//   };

//   try {
//     const feedbackId = await saveFeedback(feedback);
//     console.log('Feedback submitted successfully with ID:', feedbackId);
//     return feedbackId;
//   } catch (error) {
//     console.error('Error submitting feedback:', error);
//     throw error;
//   }
// };

export const submitFeedback = async (userId, feedbackData) => {
  try {
    if (!userId || !feedbackData) {
      throw new Error('User ID and feedback data are required');
    }

    const feedbackRef = await addDoc(collection(db, FEEDBACK_COLLECTION), {
      ...feedbackData,
      userId,
      createdAt: serverTimestamp(),
    });
    
    console.log('Feedback saved successfully with ID:', feedbackRef.id);
    return feedbackRef.id;
  } catch (error) {
    console.error('Error saving feedback:', error);
    throw error;
  }
};



// Function to delete feedback by ID
export const deleteFeedback = async (feedbackId) => {
  if (!feedbackId) {
    console.error('A valid feedback ID is required for deletion.');
    return false;
  }

  try {
    const feedbackDocRef = doc(db, FEEDBACK_COLLECTION, feedbackId);
    await deleteDoc(feedbackDocRef);
    console.log('Feedback deleted successfully with ID:', feedbackId);
    return true; // Return true to indicate successful deletion
  } catch (error) {
    console.error('Error deleting feedback:', error);
    throw error; // Rethrow the error for further handling if needed
  }
};
