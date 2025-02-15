// import { getFirestore, collection, getDocs, getDoc, doc, query, where, deleteDoc } from 'firebase/firestore';
// import { getApp } from 'firebase/app';

// const REFERRALS_COLLECTION = 'referrals';
// const db = getFirestore(getApp());

// export const fetchAllReferrals = async () => {
//   try {
//     const referralsCollectionRef = collection(db, REFERRALS_COLLECTION);
//     const querySnapshot = await getDocs(referralsCollectionRef);
    
//     const referrals = querySnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));

//     return referrals;
//   } catch (error) {
//     console.error('Error fetching all referrals:', error);
//     throw error;
//   }
// };

// // Keeping the original function for backwards compatibility
// export const fetchReferralById = async (referralId) => {
//   if (!referralId) {
//     throw new Error('Referral ID is required');
//   }

//   try {
//     const referralDocRef = doc(db, REFERRALS_COLLECTION, referralId);
//     const referralSnapshot = await getDoc(referralDocRef);

//     if (referralSnapshot.exists()) {
//       return {
//         id: referralSnapshot.id,
//         ...referralSnapshot.data()
//       };
//     } else {
//       console.log('No referral found with ID:', referralId);
//       return null;
//     }
//   } catch (error) {
//     console.error('Error fetching referral:', error);
//     throw error;
//   }
// };

// export const fetchReferralsByUserId = async (userId) => {
//     if (!userId) {
//       console.error('Invalid userId provided to fetchReferralsByUserId');
//       return [];
//     }
  
//     try {
//       const referralsRef = collection(db, 'referrals');
//       const q = query(referralsRef, where('userId', '==', userId));
//       const querySnapshot = await getDocs(q);
      
//       return querySnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//     } catch (error) {
//       console.error("Error fetching referrals:", error);
//       throw error;
//     }
//   };

// // Example usage:
// // const allReferrals = await fetchAllReferrals();
// // console.log(allReferrals);
// export const deleteReferral = async (referralId) => {
//   if (!referralId) {
//     throw new Error('Referral ID is required');
//   }

//   try {
//     const referralDocRef = doc(db, REFERRALS_COLLECTION, referralId);
//     await deleteDoc(referralDocRef);
//     console.log('Referral successfully deleted');
//   } catch (error) {
//     console.error('Error deleting referral:', error);
//     throw error;
//   }
// };

import { getFirestore, collection, getDocs, getDoc, doc, query, where, deleteDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { fetchAuthorizedUserDetails } from './bookingsData'; // Ensure this import path is correct

const REFERRALS_COLLECTION = 'referrals';
const db = getFirestore(getApp());

export const fetchAllReferrals = async () => {
  try {
    const referralsCollectionRef = collection(db, REFERRALS_COLLECTION);
    const querySnapshot = await getDocs(referralsCollectionRef);
    
    const referralsPromises = querySnapshot.docs.map(async (doc) => {
      const referralData = doc.data();
      const userInfo = await fetchAuthorizedUserDetails(referralData.phoneNumber);
      return {
        id: doc.id,
        ...referralData,
        userInfo
      };
    });

    const referrals = await Promise.all(referralsPromises);
    return referrals;
  } catch (error) {
    console.error('Error fetching all referrals:', error);
    throw error;
  }
};

export const fetchReferralById = async (referralId) => {
  if (!referralId) {
    throw new Error('Referral ID is required');
  }

  try {
    const referralDocRef = doc(db, REFERRALS_COLLECTION, referralId);
    const referralSnapshot = await getDoc(referralDocRef);

    if (referralSnapshot.exists()) {
      const referralData = referralSnapshot.data();
      const userInfo = await fetchAuthorizedUserDetails(referralData.phoneNumber);
      return {
        id: referralSnapshot.id,
        ...referralData,
        userInfo
      };
    } else {
      console.log('No referral found with ID:', referralId);
      return null;
    }
  } catch (error) {
    console.error('Error fetching referral:', error);
    throw error;
  }
};

export const fetchReferralsByUserId = async (userId) => {
  if (!userId) {
    console.error('Invalid userId provided to fetchReferralsByUserId');
    return [];
  }

  try {
    const referralsRef = collection(db, 'referrals');
    const q = query(referralsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const referralsPromises = querySnapshot.docs.map(async (doc) => {
      const referralData = doc.data();
      const userInfo = await fetchAuthorizedUserDetails(referralData.phoneNumber);
      return {
        id: doc.id,
        ...referralData,
        userInfo
      };
    });

    const referrals = await Promise.all(referralsPromises);
    return referrals;
  } catch (error) {
    console.error("Error fetching referrals:", error);
    throw error;
  }
};

export const deleteReferral = async (referralId) => {
  if (!referralId) {
    throw new Error('Referral ID is required');
  }

  try {
    const referralDocRef = doc(db, REFERRALS_COLLECTION, referralId);
    await deleteDoc(referralDocRef);
    console.log('Referral successfully deleted');
  } catch (error) {
    console.error('Error deleting referral:', error);
    throw error;
  }
};