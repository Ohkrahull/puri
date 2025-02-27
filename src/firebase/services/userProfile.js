


// // import { 
// //   getFirestore, 
// //   collection, 
// //   addDoc, 
// //   serverTimestamp,
// //   query,
// //   where,
// //   getDocs, 
// //   updateDoc,
// //   doc,
// //   arrayUnion,
// //   arrayRemove,
// //   getDoc
// // } from 'firebase/firestore';
// // import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// // import { getApp } from 'firebase/app';

// // const db = getFirestore(getApp());
// // const storage = getStorage(getApp());

// // const REGISTRATIONS_COLLECTION = 'registrations';

// // // Create a new vacant registration
// // export const createVacantRegistration = async (wing, flatNumber) => {
// // try {
// //   // Check if flat already exists
// //   const q = query(
// //     collection(db, REGISTRATIONS_COLLECTION),
// //     where('wing', '==', wing),
// //     where('flatNumber', '==', flatNumber)
// //   );
// //   const querySnapshot = await getDocs(q);
  
// //   if (!querySnapshot.empty) {
// //     // If flat exists, update it to vacant
// //     const existingRegistration = {
// //       id: querySnapshot.docs[0].id,
// //       ...querySnapshot.docs[0].data()
// //     };

// //     const registrationRef = doc(db, REGISTRATIONS_COLLECTION, existingRegistration.id);
// //     await updateDoc(registrationRef, {
// //       isVacant: true,
// //       owners: [],
// //       tenants: [],
// //       updatedAt: serverTimestamp()
// //     });

// //     return {
// //       success: true,
// //       data: {
// //         registrationId: existingRegistration.id,
// //         fullFlatNumber: `${wing}-${flatNumber}`
// //       }
// //     };
// //   }

// //   // Create new vacant registration
// //   const registrationData = {
// //     wing,
// //     flatNumber,
// //     fullFlatNumber: `${wing}-${flatNumber}`,
// //     isVacant: true,
// //     owners: [],
// //     tenants: [],
// //     createdAt: serverTimestamp(),
// //     updatedAt: serverTimestamp()
// //   };

// //   const registrationRef = await addDoc(
// //     collection(db, REGISTRATIONS_COLLECTION), 
// //     registrationData
// //   );

// //   return {
// //     success: true,
// //     data: {
// //       registrationId: registrationRef.id,
// //       fullFlatNumber: registrationData.fullFlatNumber
// //     }
// //   };
// // } catch (error) {
// //   console.error('Error in vacant registration:', error);
// //   return {
// //     success: false,
// //     error: error.message
// //   };
// // }
// // };

// // // Helper function to handle document uploads
// // export const uploadDocuments = async (documents, wingFlatNumber) => {
// // const uploadedDocuments = [];
// // if (documents && documents.length > 0) {
// //   for (const doc of documents) {
// //     if (doc.file && !doc.file.url) {
// //       const timestamp = Date.now();
// //       const storageRef = ref(
// //         storage, 
// //         `registrations/${wingFlatNumber}/${timestamp}_${doc.file.name}`
// //       );
      
// //       await uploadBytes(storageRef, doc.file);
// //       const downloadURL = await getDownloadURL(storageRef);
      
// //       uploadedDocuments.push({
// //         fileName: doc.file.name,
// //         fileUrl: downloadURL,
// //         documentType: doc.name,
// //         documentName: doc.selectedType,
// //       });
// //     } else if (doc.file && doc.file.url) {
// //       uploadedDocuments.push({
// //         fileName: doc.file.name,
// //         fileUrl: doc.file.url,
// //         documentType: doc.name,
// //         documentName: doc.selectedType
// //       });
// //     }
// //   }
// // }
// // return uploadedDocuments;
// // };

// // // Create or update registration with owner/tenant
// // // export const createRegistration = async (userData, flatData, documents) => {
// // // try {
// // //   const q = query(
// // //     collection(db, REGISTRATIONS_COLLECTION),
// // //     where('wing', '==', flatData.wing),
// // //     where('flatNumber', '==', flatData.flatNumber)
// // //   );
// // //   const querySnapshot = await getDocs(q);

// // //   const uploadedDocuments = await uploadDocuments(documents, `${flatData.wing}-${flatData.flatNumber}`);
  
// // //   const personData = {
// // //     firstName: userData.firstName,
// // //     lastName: userData.lastName,
// // //     phone: userData.phone,
// // //     email: userData.email,
// // //     isResiding: userData.isResiding,
// // //     notificationsEnabled: userData.notificationsEnabled,
// // //     isPrimaryStatus: userData.isPrimaryStatus,
// // //     documents: uploadedDocuments,
// // //     addedAt: new Date().toISOString()
// // //   };

// // //   // If registration doesn't exist, create new
// // //   if (querySnapshot.empty) {
// // //     const registrationData = {
// // //       wing: flatData.wing,
// // //       flatNumber: flatData.flatNumber,
// // //       fullFlatNumber: `${flatData.wing}-${flatData.flatNumber}`,
// // //       isVacant: false,
// // //       owners: [],
// // //       tenants: [],
// // //       createdAt: serverTimestamp(),
// // //       updatedAt: serverTimestamp()
// // //     };
    
// // //     const personArray = userData.type === 'owner' ? 'owners' : 'tenants';
// // //     registrationData[personArray] = [personData];

// // //     const registrationRef = await addDoc(
// // //       collection(db, REGISTRATIONS_COLLECTION), 
// // //       registrationData
// // //     );

// // //     return {
// // //       success: true,
// // //       data: {
// // //         registrationId: registrationRef.id,
// // //         fullFlatNumber: registrationData.fullFlatNumber
// // //       }
// // //     };
// // //   }

// // //   // Registration exists, update it
// // //   const existingRegistration = {
// // //     id: querySnapshot.docs[0].id,
// // //     ...querySnapshot.docs[0].data()
// // //   };

// // //   const registrationRef = doc(db, REGISTRATIONS_COLLECTION, existingRegistration.id);
// // //   const personArray = userData.type === 'owner' ? 'owners' : 'tenants';
// // //   const currentPersons = existingRegistration[personArray] || [];

// // //   // If this is a new primary person, update existing primary to non-primary
// // //   if (userData.isPrimaryStatus) {
// // //     const updatedPersons = currentPersons.map(person => ({
// // //       ...person,
// // //       isPrimaryStatus: false
// // //     }));
    
// // //     await updateDoc(registrationRef, {
// // //       isVacant: false, // Ensure flat is marked as not vacant when adding person
// // //       [personArray]: [...updatedPersons, personData],
// // //       updatedAt: serverTimestamp()
// // //     });
// // //   } else {
// // //     // Just add the new person
// // //     await updateDoc(registrationRef, {
// // //       isVacant: false, // Ensure flat is marked as not vacant when adding person
// // //       [personArray]: arrayUnion(personData),
// // //       updatedAt: serverTimestamp()
// // //     });
// // //   }

// // //   return {
// // //     success: true,
// // //     data: {
// // //       registrationId: existingRegistration.id,
// // //       fullFlatNumber: existingRegistration.fullFlatNumber
// // //     }
// // //   };
// // // } catch (error) {
// // //   console.error('Error in registration:', error);
// // //   return {
// // //     success: false,
// // //     error: error.message
// // //   };
// // // }
// // // };
// // export const createRegistration = async (userData, flatData, documents) => {
// //   try {
// //     const q = query(
// //       collection(db, REGISTRATIONS_COLLECTION),
// //       where('wing', '==', flatData.wing),
// //       where('flatNumber', '==', flatData.flatNumber)
// //     );
// //     const querySnapshot = await getDocs(q);

// //     const uploadedDocuments = await uploadDocuments(documents, `${flatData.wing}-${flatData.flatNumber}`);
    
// //     // Add unique ID for each person
// //     const personData = {
// //       id: `${Date.now()}_${userData.type}`, // Add unique ID
// //       firstName: userData.firstName,
// //       lastName: userData.lastName,
// //       phone: userData.phone,
// //       email: userData.email,
// //       isResiding: userData.isResiding,
// //       notificationsEnabled: userData.notificationsEnabled,
// //       isPrimaryStatus: userData.isPrimaryStatus,
// //       documents: uploadedDocuments,
// //       addedAt: new Date().toISOString()
// //     };

// //     // If registration doesn't exist, create new
// //     if (querySnapshot.empty) {
// //       const registrationData = {
// //         wing: flatData.wing,
// //         flatNumber: flatData.flatNumber,
// //         fullFlatNumber: `${flatData.wing}-${flatData.flatNumber}`,
// //         isVacant: false,
// //         owners: [],
// //         tenants: [],
// //         createdAt: serverTimestamp(),
// //         updatedAt: serverTimestamp()
// //       };
      
// //       const personArray = userData.type === 'owner' ? 'owners' : 'tenants';
// //       registrationData[personArray] = [personData];

// //       const registrationRef = await addDoc(
// //         collection(db, REGISTRATIONS_COLLECTION), 
// //         registrationData
// //       );

// //       return {
// //         success: true,
// //         data: {
// //           registrationId: registrationRef.id,
// //           personId: personData.id,  // Return the person ID
// //           fullFlatNumber: registrationData.fullFlatNumber
// //         }
// //       };
// //     }

// //     // Registration exists, update it
// //     const existingRegistration = {
// //       id: querySnapshot.docs[0].id,
// //       ...querySnapshot.docs[0].data()
// //     };

// //     const registrationRef = doc(db, REGISTRATIONS_COLLECTION, existingRegistration.id);
// //     const personArray = userData.type === 'owner' ? 'owners' : 'tenants';
// //     const currentPersons = existingRegistration[personArray] || [];

// //     // Always update entire array to maintain consistency
// //     const updatedPersons = [...currentPersons];
    
// //     if (userData.isPrimaryStatus) {
// //       // Update all existing to non-primary
// //       updatedPersons.forEach(person => {
// //         person.isPrimaryStatus = false;
// //       });
// //     }
    
// //     // Add new person
// //     updatedPersons.push(personData);

// //     await updateDoc(registrationRef, {
// //       isVacant: false,
// //       [personArray]: updatedPersons,
// //       updatedAt: serverTimestamp()
// //     });

// //     return {
// //       success: true,
// //       data: {
// //         registrationId: existingRegistration.id,
// //         personId: personData.id,  // Return the person ID
// //         fullFlatNumber: existingRegistration.fullFlatNumber
// //       }
// //     };
// //   } catch (error) {
// //     console.error('Error in registration:', error);
// //     return {
// //       success: false,
// //       error: error.message
// //     };
// //   }
// // };

// // export const updateRegistration = async (registrationId, personId, personData, documents, type) => {
// //   try {
// //     const registrationRef = doc(db, REGISTRATIONS_COLLECTION, registrationId);
// //     const registration = (await getDoc(registrationRef)).data();

// //     // Upload any new documents
// //     const uploadedDocuments = await uploadDocuments(
// //       documents, 
// //       `${registration.wing}-${registration.flatNumber}`
// //     );

// //     // Prepare updated person data
// //     const updatedPersonData = {
// //       ...personData,
// //       documents: uploadedDocuments,
// //       updatedAt: new Date().toISOString()
// //     };

// //     // Get correct array (owners or tenants)
// //     const personArray = type === 'owner' ? 'owners' : 'tenants';
// //     const currentPersons = registration[personArray] || [];

// //     // Update person in array
// //     const updatedPersons = currentPersons.map(person => {
// //       if (person.id === personId) {
// //         return updatedPersonData;
// //       }
// //       // If setting new primary, update others
// //       if (updatedPersonData.isPrimaryStatus && person.isPrimaryStatus) {
// //         return { ...person, isPrimaryStatus: false };
// //       }
// //       return person;
// //     });

// //     // Update registration
// //     await updateDoc(registrationRef, {
// //       [personArray]: updatedPersons,
// //       updatedAt: serverTimestamp()
// //     });

// //     return {
// //       success: true,
// //       data: {
// //         registrationId,
// //         personId,
// //         fullFlatNumber: registration.fullFlatNumber
// //       }
// //     };
// //   } catch (error) {
// //     console.error('Error updating registration:', error);
// //     return {
// //       success: false,
// //       error: error.message
// //     };
// //   }
// // };

// // export const updatePersonDocuments = async (registrationId, personId, documents) => {
// //   try {
// //     const registrationRef = doc(db, REGISTRATIONS_COLLECTION, registrationId);
// //     const registration = (await registrationRef.get()).data();

// //     // Find person in owners or tenants array
// //     let personArray = 'owners';
// //     let person = registration.owners?.find(p => p.id === personId);
    
// //     if (!person) {
// //       personArray = 'tenants';
// //       person = registration.tenants?.find(p => p.id === personId);
// //     }

// //     if (!person) {
// //       throw new Error('Person not found');
// //     }

// //     // Upload new documents
// //     const uploadedDocuments = await uploadDocuments(documents, `${registration.wing}-${registration.flatNumber}`);

// //     // Update person's documents
// //     const updatedPersons = registration[personArray].map(p => {
// //       if (p.id === personId) {
// //         return {
// //           ...p,
// //           documents: uploadedDocuments
// //         };
// //       }
// //       return p;
// //     });

// //     await updateDoc(registrationRef, {
// //       [personArray]: updatedPersons,
// //       updatedAt: serverTimestamp()
// //     });

// //     return { success: true };
// //   } catch (error) {
// //     console.error('Error updating documents:', error);
// //     return { success: false, error: error.message };
// //   }
// // };

// // // Get registration details
// // export const getRegistration = async (wing, flatNumber) => {
// // try {
// //   const q = query(
// //     collection(db, REGISTRATIONS_COLLECTION),
// //     where('wing', '==', wing),
// //     where('flatNumber', '==', flatNumber)
// //   );
// //   const querySnapshot = await getDocs(q);
  
// //   if (querySnapshot.empty) {
// //     return {
// //       success: false,
// //       error: 'Registration not found'
// //     };
// //   }

// //   const registration = querySnapshot.docs[0].data();
// //   return {
// //     success: true,
// //     data: {
// //       id: querySnapshot.docs[0].id,
// //       ...registration,
// //       owners: registration.owners || [],
// //       tenants: registration.tenants || []
// //     }
// //   };
// // } catch (error) {
// //   console.error('Error getting registration:', error);
// //   return {
// //     success: false,
// //     error: error.message
// //   };
// // }
// // };

// // // Check if flat exists and its status
// // export const checkFlatStatus = async (wing, flatNumber) => {
// // try {
// //   const q = query(
// //     collection(db, REGISTRATIONS_COLLECTION),
// //     where('wing', '==', wing),
// //     where('flatNumber', '==', flatNumber)
// //   );
// //   const querySnapshot = await getDocs(q);
  
// //   if (querySnapshot.empty) {
// //     return {
// //       exists: false,
// //       isVacant: false,
// //       registrationId: null
// //     };
// //   }

// //   const registration = querySnapshot.docs[0].data();
// //   return {
// //     exists: true,
// //     isVacant: registration.isVacant,
// //     registrationId: querySnapshot.docs[0].id
// //   };
// // } catch (error) {
// //   console.error('Error checking flat status:', error);
// //   throw error;
// // }
// // };

// // // Update person's primary status
// // export const updatePrimaryStatus = async (registrationId, type, newPrimaryId) => {
// // try {
// //   const registrationRef = doc(db, REGISTRATIONS_COLLECTION, registrationId);
// //   const registration = (await registrationRef.get()).data();
  
// //   const personArray = type === 'owner' ? 'owners' : 'tenants';
// //   const persons = registration[personArray];

// //   // Update previous primary and new primary
// //   const updatedPersons = persons.map(person => ({
// //     ...person,
// //     isPrimaryStatus: person.id === newPrimaryId
// //   }));

// //   await updateDoc(registrationRef, {
// //     [personArray]: updatedPersons,
// //     updatedAt: serverTimestamp()
// //   });

// //   return {
// //     success: true
// //   };
// // } catch (error) {
// //   console.error('Error updating primary status:', error);
// //   return {
// //     success: false,
// //     error: error.message
// //   };
// // }
// // };
// import { 
//   getFirestore, 
//   collection, 
//   setDoc,
//   doc,
//   serverTimestamp,
//   query,
//   where,
//   getDocs,
//   updateDoc,
//   getDoc
// } from 'firebase/firestore';
// import { getApp } from 'firebase/app';

// const db = getFirestore(getApp());

// const FLATS_COLLECTION = 'flats';
// const USERS_COLLECTION = 'users';

// // Create or update a user using phone number as ID
// export const createOrUpdateUser = async (userData) => {
//   try {
//     // Use phone number as document ID
//     const userRef = doc(db, USERS_COLLECTION, userData.phone);
    
//     const userDoc = {
//       firstName: userData.firstName,
//       lastName: userData.lastName,
//       phone: userData.phone, // This is also the document ID
//       email: userData.email,
//       updatedAt: serverTimestamp()
//     };

//     // Check if user exists
//     const userSnapshot = await getDoc(userRef);
//     if (!userSnapshot.exists()) {
//       userDoc.createdAt = serverTimestamp();
//     }

//     // Set or update user document
//     await setDoc(userRef, userDoc, { merge: true });

//     return { 
//       success: true, 
//       userId: userData.phone // Return phone number as userId
//     };
//   } catch (error) {
//     console.error('Error in createOrUpdateUser:', error);
//     return { success: false, error: error.message };
//   }
// };

// // Create or update a flat
// export const createOrUpdateFlat = async (flatData, userRole) => {
//   try {
//     const flatsRef = collection(db, FLATS_COLLECTION);
//     const flatQuery = query(
//       flatsRef, 
//       where('wing', '==', flatData.wing),
//       where('flatNumber', '==', flatData.flatNumber)
//     );
//     const flatSnapshot = await getDocs(flatQuery);

//     const flatDoc = {
//       flatId: `flat_${flatData.wing}_${flatData.flatNumber}`,
//       wing: flatData.wing,
//       flatNumber: flatData.flatNumber,
//       isVacant: flatData.isVacant || false,
//       users: [] // Array of {userId: phoneNumber, role: string}
//     };

//     let flatId;

//     if (flatSnapshot.empty) {
//       // Create new flat
//       if (userRole) {
//         flatDoc.users = [{
//           userId: userRole.phone, // Use phone number instead of generated ID
//           role: userRole.role
//         }];
//       }
//       flatDoc.createdAt = serverTimestamp();
//       flatDoc.updatedAt = serverTimestamp();

//       // Use flatId as document ID
//       flatId = flatDoc.flatId;
//       await setDoc(doc(flatsRef, flatId), flatDoc);
//     } else {
//       // Update existing flat
//       flatId = flatSnapshot.docs[0].id;
//       const existingFlat = flatSnapshot.docs[0].data();
      
//       if (userRole) {
//         // Add new user if not exists
//         const userExists = existingFlat.users.some(user => 
//           user.userId === userRole.phone && user.role === userRole.role
//         );
        
//         if (!userExists) {
//           flatDoc.users = [
//             ...existingFlat.users,
//             {
//               userId: userRole.phone,
//               role: userRole.role
//             }
//           ];
//         } else {
//           flatDoc.users = existingFlat.users;
//         }
//       }

//       flatDoc.updatedAt = serverTimestamp();
//       const flatRef = doc(db, FLATS_COLLECTION, flatId);
//       await updateDoc(flatRef, flatDoc);
//     }

//     return { 
//       success: true, 
//       flatId,
//       flatData: flatDoc
//     };
//   } catch (error) {
//     console.error('Error in createOrUpdateFlat:', error);
//     return { success: false, error: error.message };
//   }
// };

// // Check flat status
// export const checkFlatStatus = async (wing, flatNumber) => {
//   try {
//     const flatId = `flat_${wing}_${flatNumber}`;
//     const flatRef = doc(db, FLATS_COLLECTION, flatId);
//     const flatDoc = await getDoc(flatRef);

//     if (!flatDoc.exists()) {
//       return {
//         exists: false,
//         isVacant: false,
//         registrationId: null
//       };
//     }

//     const flatData = flatDoc.data();
//     return {
//       exists: true,
//       isVacant: flatData.isVacant,
//       registrationId: flatId,
//       users: flatData.users || []
//     };
//   } catch (error) {
//     console.error('Error checking flat status:', error);
//     throw error;
//   }
// };

// // Create vacant registration
// export const createVacantRegistration = async (wing, flatNumber) => {
//   try {
//     const result = await createOrUpdateFlat({
//       wing,
//       flatNumber,
//       isVacant: true
//     });

//     if (!result.success) {
//       throw new Error(result.error);
//     }

//     return {
//       success: true,
//       data: {
//         flatId: result.flatId,
//         fullFlatNumber: `${wing}-${flatNumber}`
//       }
//     };
//   } catch (error) {
//     console.error('Error in vacant registration:', error);
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// };

// // Get flat details with user information
// export const getFlatDetails = async (wing, flatNumber) => {
//   try {
//     const flatId = `flat_${wing}_${flatNumber}`;
//     const flatRef = doc(db, FLATS_COLLECTION, flatId);
//     const flatDoc = await getDoc(flatRef);

//     if (!flatDoc.exists()) {
//       return { success: false, error: 'Flat not found' };
//     }

//     const flatData = flatDoc.data();
//     const users = [];

//     // Fetch user details for each user reference
//     for (const userRef of flatData.users) {
//       const userDoc = await getDoc(doc(db, USERS_COLLECTION, userRef.userId));
//       if (userDoc.exists()) {
//         users.push({
//           ...userDoc.data(),
//           role: userRef.role
//         });
//       }
//     }

//     return {
//       success: true,
//       data: {
//         ...flatData,
//         id: flatId,
//         users
//       }
//     };
//   } catch (error) {
//     console.error('Error getting flat details:', error);
//     return { success: false, error: error.message };
//   }
// };


import { 
  getFirestore, 
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore();
const USERS_COLLECTION = 'authorizedUsers';
const FLATS_COLLECTION = 'flats';

// Ensure phone number always has +91 prefix
const formatPhoneNumber = (phone) => {
  // Remove any existing +91 or whitespace
  const cleanPhone = phone.replace(/\s+/g, '').replace(/^\+91/, '');
  
  // Add +91 prefix
  return `+91${cleanPhone}`;
};

// Create or update authorized user
// export const createAuthorizedUser = async (userData) => {
//   try {
//     const formattedPhone = formatPhoneNumber(userData.phone);
//     const userRef = doc(db, USERS_COLLECTION, formattedPhone);
    
//     // Basic user info
//     const userDoc = {
//       firstName: userData.firstName,
//       lastName: userData.lastName,
//       phone: formattedPhone,
//       email: userData.email,
//       addedAt: serverTimestamp(),
//       updatedAt: serverTimestamp()
//     };

//     await setDoc(userRef, userDoc, { merge: true });
    
//     return { success: true, userId: userData.phone };
//   } catch (error) {
//     console.error('Error in createAuthorizedUser:', error);
//     return { success: false, error: error.message };
//   }
// };
export const createAuthorizedUser = async (userData) => {
  try {
    const formattedPhone = formatPhoneNumber(userData.phone);
    const userRef = doc(db, USERS_COLLECTION, formattedPhone);
    
    // Get existing user data if it exists
    const existingUserDoc = await getDoc(userRef);
    
    // Initialize flats structure if creating new user
    let flats = {
      approved: [],
      pending: []
    };
    
    // If user exists, preserve existing flats data
    if (existingUserDoc.exists()) {
      flats = existingUserDoc.data().flats || flats;
    }
    
    // Basic user info
    const userDoc = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: formattedPhone, // For consistency with your schema
      email: userData.email,
      flats: flats,
      updatedAt: serverTimestamp()
    };
    
    // Store wing and flatNumber if provided
    if (userData.wing) {
      userDoc.wing = userData.wing;
    }
    
    if (userData.flatNumber) {
      userDoc.flatNumber = userData.flatNumber;
    }
    
    // If this is a new user, add createdAt timestamp
    if (!existingUserDoc.exists()) {
      userDoc.createdAt = serverTimestamp();
      userDoc.addedAt = serverTimestamp(); // Based on your schema
      userDoc.lastLogin = serverTimestamp(); // Initialize lastLogin
    }

    await setDoc(userRef, userDoc, { merge: true });
    
    return { success: true, userId: formattedPhone };
  } catch (error) {
    console.error('Error in createAuthorizedUser:', error);
    return { success: false, error: error.message };
  }
};

// export const createOrUpdateFlat = async (flatData, userData) => {
//   try {
//     const flatId = `flat_${flatData.wing}_${flatData.flatNumber}`;
//     const flatRef = doc(db, FLATS_COLLECTION, flatId);
//     const flatDoc = await getDoc(flatRef);

//     // Ensure phone number has +91 prefix
//     const formattedPhone = formatPhoneNumber(userData.phone);

//     // Get current users array if flat exists
//     let currentUsers = [];
//     if (flatDoc.exists()) {
//       currentUsers = flatDoc.data().users || [];
//     }

//     // Determine the new user's role
//     const userRole = userData.isPrimaryStatus ? 
//       (userData.type === 'owner' ? 'primary_owner' : 'primary_tenant') :
//       (userData.type === 'owner' ? 'owner' : 'tenant');

//     // If setting a new primary user, update existing primary of the same type
//     if (userData.isPrimaryStatus) {
//       currentUsers = currentUsers.map(user => {
//         // Only modify users of the same type (owner or tenant)
//         if ((userData.type === 'owner' && user.role.includes('owner')) ||
//             (userData.type === 'tenant' && user.role.includes('tenant'))) {
//           // If this is a primary user, demote them to regular
//           if (user.role.includes('primary_')) {
//             return {
//               ...user,
//               role: user.role.replace('primary_', '')
//             };
//           }
//         }
//         return user;
//       });
//     }

//     // Check if user already exists in flat
//     const userIndex = currentUsers.findIndex(user => user.userId === formattedPhone);

//     if (userIndex !== -1) {
//       // Update existing user
//       currentUsers[userIndex] = {
//         ...currentUsers[userIndex],
//         userId: formattedPhone,
//         role: userRole,
//         isResiding: userData.isResiding
//       };
//     } else {
//       // Add new user
//       currentUsers.push({
//         userId: formattedPhone,
//         role: userRole,
//         isResiding: userData.isResiding
//       });
//     }

//     // Flat document structure
//     const newFlatDoc = {
//       flatId,
//       wing: flatData.wing,
//       flatNumber: flatData.flatNumber,
//       isVacant: false,
//       users: currentUsers,
//       flatSpecificData: {
//         notificationsEnabled: userData.notificationsEnabled,
//         documents: userData.documents || [],
//         ownershipStatus: userData.ownershipStatus || 'self-occupied'
//       },
//       updatedAt: serverTimestamp()
//     };

//     if (!flatDoc.exists()) {
//       newFlatDoc.createdAt = serverTimestamp();
//     }

//     await setDoc(flatRef, newFlatDoc, { merge: true });

//     return {
//       success: true,
//       flatId,
//       userData: {
//         userId: formattedPhone,
//         role: userRole
//       }
//     };
//   } catch (error) {
//     console.error('Error in createOrUpdateFlat:', error);
//     return { success: false, error: error.message };
//   }
// };


// Check flat status

export const createOrUpdateFlat = async (flatData, userData) => {
  try {
    const flatId = `flat_${flatData.wing}_${flatData.flatNumber}`;
    const flatRef = doc(db, FLATS_COLLECTION, flatId);
    const flatDoc = await getDoc(flatRef);

    // Ensure phone number has +91 prefix
    const formattedPhone = formatPhoneNumber(userData.phone);
    
    // Get user reference to update their flats list
    const userRef = doc(db, USERS_COLLECTION, formattedPhone);
    const userDoc = await getDoc(userRef);

    // Get current users array if flat exists
    let currentUsers = [];
    if (flatDoc.exists()) {
      currentUsers = flatDoc.data().users || [];
    }

    // Determine the new user's role
    const userRole = userData.isPrimaryStatus ? 
      (userData.type === 'owner' ? 'primary_owner' : 'primary_tenant') :
      (userData.type === 'owner' ? 'owner' : 'tenant');

    // If setting a new primary user, update existing primary of the same type
    if (userData.isPrimaryStatus) {
      currentUsers = currentUsers.map(user => {
        // Only modify users of the same type (owner or tenant)
        if ((userData.type === 'owner' && user.role.includes('owner')) ||
            (userData.type === 'tenant' && user.role.includes('tenant'))) {
          // If this is a primary user, demote them to regular
          if (user.role.includes('primary_')) {
            return {
              ...user,
              role: user.role.replace('primary_', '')
            };
          }
        }
        return user;
      });
    }

    // Check if user already exists in flat
    const userIndex = currentUsers.findIndex(user => user.userId === formattedPhone);

    if (userIndex !== -1) {
      // Update existing user
      currentUsers[userIndex] = {
        ...currentUsers[userIndex],
        userId: formattedPhone,
        role: userRole,
        isResiding: userData.isResiding
      };
    } else {
      // Add new user
      currentUsers.push({
        userId: formattedPhone,
        role: userRole,
        isResiding: userData.isResiding
      });
    }

    // Flat document structure
    const newFlatDoc = {
      flatId,
      wing: flatData.wing,
      flatNumber: flatData.flatNumber,
      isVacant: false,
      users: currentUsers,
      flatSpecificData: {
        notificationsEnabled: userData.notificationsEnabled,
        documents: userData.documents || [],
        ownershipStatus: userData.ownershipStatus || 'self-occupied'
      },
      updatedAt: serverTimestamp()
    };

    if (!flatDoc.exists()) {
      newFlatDoc.createdAt = serverTimestamp();
    }

    await setDoc(flatRef, newFlatDoc, { merge: true });
    
    // Now update the user's flat records
    if (userDoc.exists()) {
      // Get existing flats data or initialize if not present
      const userFlats = userDoc.data().flats || { approved: [], pending: [] };
      
      // Create the flat entry for the user's document
      const flatEntry = {
        flatId,
        wing: flatData.wing,
        flatNumber: flatData.flatNumber
      };
      
      // Check if this flat is already in the approved list
      const existingIndex = userFlats.approved.findIndex(f => f.flatId === flatId);
      if (existingIndex === -1) {
        // Not found, so add it to the approved list
        userFlats.approved.push(flatEntry);
      }
      
      // Update the user document with the new flats data
      await updateDoc(userRef, {
        flats: userFlats,
        updatedAt: serverTimestamp()
      });
    }

    return {
      success: true,
      flatId,
      userData: {
        userId: formattedPhone,
        role: userRole
      }
    };
  } catch (error) {
    console.error('Error in createOrUpdateFlat:', error);
    return { success: false, error: error.message };
  }
};



export const checkFlatStatus = async (wing, flatNumber) => {
  try {
    const flatId = `flat_${wing}_${flatNumber}`;
    const flatRef = doc(db, FLATS_COLLECTION, flatId);
    const flatDoc = await getDoc(flatRef);

    if (!flatDoc.exists()) {
      return {
        exists: false,
        isVacant: false,
        users: []
      };
    }

    const flatData = flatDoc.data();

    // Get user details for each user in the flat
    const userPromises = flatData.users.map(async (user) => {
      const userRef = doc(db, USERS_COLLECTION, user.userId);
      const userDoc = await getDoc(userRef);
      return {
        ...user,
        ...userDoc.data(),
        isPrimaryStatus: user.role.includes('primary_')
      };
    });

    const users = await Promise.all(userPromises);

    return {
      exists: true,
      isVacant: flatData.isVacant,
      users,
      flatSpecificData: flatData.flatSpecificData || {}
    };

  } catch (error) {
    console.error('Error checking flat status:', error);
    throw error;
  }
};

// Create vacant registration
export const createVacantRegistration = async (wing, flatNumber) => {
  try {
    const flatId = `flat_${wing}_${flatNumber}`;
    const flatRef = doc(db, FLATS_COLLECTION, flatId);

    const flatDoc = {
      flatId,
      wing,
      flatNumber,
      isVacant: true,
      users: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(flatRef, flatDoc);

    return {
      success: true,
      data: {
        flatId,
        fullFlatNumber: `${wing}-${flatNumber}`
      }
    };
  } catch (error) {
    console.error('Error in vacant registration:', error);
    return { success: false, error: error.message };
  }
};