import firestore from '@react-native-firebase/firestore';

const fetchAllSpecialRequests = async () => {
  try {
    const specialRequestsSnapshot = await firestore()
      .collectionGroup('requests') // Use collectionGroup to get all documents from all subcollections named 'requests'
      .orderBy('timestamp', 'desc') // Order by timestamp if you want to sort
      .get();

    const specialRequests = specialRequestsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log('Fetched all special requests:', specialRequests);
    return specialRequests;
  } catch (error) {
    console.error('Error fetching all special requests:', error);
    throw error;
  }
};