import { getFirestore, collection, addDoc, serverTimestamp, query, where, onSnapshot, updateDoc, doc, getDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { getApp } from 'firebase/app';

const BOOKINGS_COLLECTION = 'bookings';
const AUTHORIZED_USERS_COLLECTION = 'authorizedUsers';
const GUEST_USERS_COLLECTION = 'guestUsers';
const db = getFirestore(getApp());



export const getBookedSlots = async (date, amenity) => {
  const q = query(
    collection(db, BOOKINGS_COLLECTION),
    where('date', '==', new Date(date)),
    where('amenityName', '==', amenity)
  );

  const querySnapshot = await getDocs(q);
  // Return both start and end times
  return querySnapshot.docs.map(doc => ({
    timeSlotStart: doc.data().timeSlotStart,
    timeSlotEnd: doc.data().timeSlotEnd
  }));
};

// export const saveBooking = async (bookingData) => {
//   try {
//     console.log('Attempting to save booking:', bookingData); // Debugging log
    
//     if (!bookingData.phoneNumber) {
//       throw new Error('User ID is required for booking');
//     }

//     const bookingRef = await addDoc(collection(db, BOOKINGS_COLLECTION), {
//       ...bookingData,
//       createdAt: serverTimestamp(),
//       type: bookingData.type,
//     });
    
//     console.log('Booking saved successfully with ID:', bookingRef.id);
//     return bookingRef.id;
//   } catch (error) {
//     console.error('Error saving booking:', error);
//     throw error;
//   }
// };

// Update this function to handle both creation and updates
export const saveBooking = async (bookingData, isUpdate = false) => {
  try {
    console.log('Saving booking:', { bookingData, isUpdate });
    
    if (!bookingData.phoneNumber) {
      throw new Error('User ID is required for booking');
    }

    if (isUpdate && bookingData.id) {
      // If updating an existing booking
      const bookingRef = doc(db, BOOKINGS_COLLECTION, bookingData.id);
      const { id, ...updateData } = bookingData;
      
      await updateDoc(bookingRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
      
      console.log('Booking updated successfully with ID:', bookingData.id);
      return bookingData.id;
    } else {
      // If creating a new booking
      const bookingRef = await addDoc(collection(db, BOOKINGS_COLLECTION), {
        ...bookingData,
        createdAt: serverTimestamp(),
        type: bookingData.type,
      });
      
      console.log('New booking saved successfully with ID:', bookingRef.id);
      return bookingRef.id;
    }
  } catch (error) {
    console.error('Error saving/updating booking:', error);
    throw error;
  }
};

// Update the updateBooking function to use document reference directly
export const updateBooking = async (bookingId, updatedBooking) => {
  try {
    const bookingRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    // Remove id from the update data if it exists
    const { id, ...updateData } = updatedBooking;
    
    await updateDoc(bookingRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
    
    console.log('Booking updated successfully with ID:', bookingId);
    return bookingId;
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};

export const fetchBookings = (userId, callback) => {
  const q = query(collection(db, BOOKINGS_COLLECTION), where('userId', '==', userId));
  return onSnapshot(q,
    (snapshot) => {
      const bookings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(bookings);
    },
    (error) => {
      console.error('Error fetching bookings:', error);
    }
  );
};

// export const fetchAllBookings = (callback) => {
//   return onSnapshot(collection(db, BOOKINGS_COLLECTION),
//     (snapshot) => {
//       const bookings = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       callback(bookings);
//     },
//     (error) => {
//       console.error('Error fetching all bookings:', error);
//     }
//   );
// };

// export const fetchAllBookings = (callback) => {
//   return onSnapshot(collection(db, BOOKINGS_COLLECTION),
//     (snapshot) => {
//       const bookings = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       // Sort bookings by createdAt in descending order (most recent first)
//       bookings.sort((a, b) => {
//         if (a.createdAt && b.createdAt) {
//           return b.createdAt.toMillis() - a.createdAt.toMillis();
//         }
//         return 0; // In case createdAt is missing, maintain order
//       });

//       callback(bookings);
//     },
//     (error) => {
//       console.error('Error fetching all bookings:', error);
//     }
//   );
// };

// New function to fetch authorized user details
export const fetchAuthorizedUserDetails = async (phoneNumber) => {
  try {
    const userDoc = await getDoc(doc(db, AUTHORIZED_USERS_COLLECTION, phoneNumber));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log(`No authorized user found for phone number: ${phoneNumber}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching authorized user details:', error);
    return null;
  }
};

export const fetchUserDetails = async (phoneNumber) => {
  if (!phoneNumber) {
    throw new Error('Phone number is required');
  }

  try {
    // Check in guestUsers collection first
    const guestUserDoc = await getDoc(doc(db, GUEST_USERS_COLLECTION, phoneNumber));
    if (guestUserDoc.exists()) {
      const guestData = guestUserDoc.data();
      return {
        ...guestData,
        userType: 'Guest'
      };
    }

    // If not found in guestUsers, check in authorizedUsers collection
    const authorizedUserQuery = query(collection(db, AUTHORIZED_USERS_COLLECTION), where('phoneNumber', '==', phoneNumber));
    const authorizedUserSnapshot = await getDocs(authorizedUserQuery);
    
    if (!authorizedUserSnapshot.empty) {
      const authorizedUserData = authorizedUserSnapshot.docs[0].data();
      return {
        ...authorizedUserData,
        userType: 'Member'
      };
    }

    // If not found in either collection
    console.log(`No user found for phone number: ${phoneNumber}`);
    return null;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
};
// Updated fetchAllBookings function
export const fetchAllBookings = (callback) => {
  return onSnapshot(collection(db, BOOKINGS_COLLECTION),
    async (snapshot) => {
      const bookingsPromises = snapshot.docs.map(async (doc) => {
        const bookingData = {
          id: doc.id,
          ...doc.data()
        };
        
        // Fetch user details for each booking
        const userDetails = await fetchAuthorizedUserDetails(bookingData.phoneNumber);
        
        return {
          ...bookingData,
          userDetails
        };
      });

      const bookings = await Promise.all(bookingsPromises);

      // Sort bookings by createdAt in descending order (most recent first)
      bookings.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.toMillis() - a.createdAt.toMillis();
        }
        return 0; // In case createdAt is missing, maintain order
      });

      callback(bookings);
    },
    (error) => {
      console.error('Error fetching all bookings:', error);
    }
  );
};


// export const editBooking = async (bookingData) => {
//   try {
//     const { id, ...updateData } = bookingData;
//     await updateDoc(doc(db, BOOKINGS_COLLECTION, id), {
//       ...updateData,
//       updatedAt: serverTimestamp(),
//     });
//     console.log('Booking updated successfully with ID:', id);
//   } catch (error) {
//     console.error('Error updating booking:', error);
//     throw error;
//   }
// };


// export const editBooking = async (bookingData) => {
//   try {
//     const { id, ...updateData } = bookingData;
    
//     // Remove any fields that shouldn't be in the database
//     delete updateData.slotDate;
//     delete updateData.slotTime;

//     // Convert the date to a Firestore timestamp
//     if (updateData.date instanceof Date) {
//       updateData.date = serverTimestamp();
//     }

//     await updateDoc(doc(db, BOOKINGS_COLLECTION, id), updateData);
//     console.log('Booking updated successfully with ID:', id);
//   } catch (error) {
//     console.error('Error updating booking:', error);
//     throw error;
//   }
// };

export const editBooking = async (bookingData) => {
  try {
    const { id, ...updateData } = bookingData;
    
    // Prepare the update object
    const updatedFields = {
      amenityName: updateData.amenityName,
      phoneNumber: updateData.phoneNumber,
      timeSlot: updateData.timeSlot,
      type: updateData.type || 'amenities', // Default to 'amenities' if not provided
      updatedAt: serverTimestamp(),
    };

    // Only update the date if it's provided and different
    if (updateData.date instanceof Date) {
      updatedFields.date = updateData.date;
    }

    // Remove any undefined fields
    Object.keys(updatedFields).forEach(key => 
      updatedFields[key] === undefined && delete updatedFields[key]
    );

    // Update the document
    await updateDoc(doc(db, BOOKINGS_COLLECTION, id), updatedFields);
    console.log('Booking updated successfully with ID:', id);
    return { id, ...updatedFields };
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};


export const cancelBooking = async (bookingId) => {
  if (!bookingId) {
    throw new Error('Booking ID is required to cancel a booking');
  }
  try {
    const bookingDoc = await getDoc(doc(db, BOOKINGS_COLLECTION, bookingId));
    if (!bookingDoc.exists()) {
      console.log(`Booking with ID ${bookingId} does not exist.`);
      throw new Error(`Booking with ID ${bookingId} not found`);
    }
    await deleteDoc(doc(db, BOOKINGS_COLLECTION, bookingId));
    console.log(`Booking with ID ${bookingId} has been successfully cancelled.`);
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw new Error(`Failed to cancel booking with ID ${bookingId}: ${error}`);
  }
};

// Add these new functions

export const deleteBooking = async (bookingId) => {
  try {
    await deleteDoc(doc(db, BOOKINGS_COLLECTION, bookingId));
    console.log(`Booking with ID ${bookingId} has been successfully deleted.`);
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};

// export const updateBooking = async (bookingId, updatedBooking) => {
//   try {
//     await updateDoc(doc(db, BOOKINGS_COLLECTION, bookingId), {
//       ...updatedBooking,
//       updatedAt: serverTimestamp(),
//     });
//     console.log('Booking updated successfully with ID:', bookingId);
//   } catch (error) {
//     console.error('Error updating booking:', error);
//     throw error;
//   }
// };