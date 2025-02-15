// // // // registrationService.js
// // // import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
// // // import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// // // import { getApp } from 'firebase/app';

// // // const db = getFirestore(getApp());
// // // const storage = getStorage(getApp());

// // // const REGISTRATIONS_COLLECTION = 'registrations';

// // // export const createRegistration = async (userData, flatData, documents) => {
// // //   try {
// // //     // Handle document uploads first
// // //     const uploadedDocuments = [];
    
// // //     if (documents && documents.length > 0) {
// // //       for (const doc of documents) {
// // //         if (doc.file) {
// // //           // Create storage reference
// // //           const storageRef = ref(storage, `registrations/${Date.now()}_${doc.file.name}`);
          
// // //           // Upload file
// // //           await uploadBytes(storageRef, doc.file);
          
// // //           // Get download URL
// // //           const downloadURL = await getDownloadURL(storageRef);
          
// // //           uploadedDocuments.push({
// // //             fileName: doc.file.name,
// // //             fileUrl: downloadURL,
// // //             documentType: doc.name,
// // //             documentName: doc.selectedType,
// // //             fileSize: doc.file.size,
// // //           });
// // //         }
// // //       }
// // //     }

// // //     // Create registration document
// // //     const registrationData = {
// // //       // Personal Information
// // //       firstName: userData.firstName,
// // //       lastName: userData.lastName,
// // //       phone: userData.phone,
// // //       email: userData.email,
      
// // //       // Flat Details
// // //       wing: flatData.wing,
// // //       flatNumber: flatData.flatNumber,
// // //       fullFlatNumber: `${flatData.wing}-${flatData.flatNumber}`,
// // //       isVacant: flatData.isVacant,
      
// // //       // Status and Settings
// // //       isPrimaryOwner: userData.isPrimaryOwner,
// // //       isResiding: userData.isResiding,
// // //       notificationsEnabled: userData.notificationsEnabled,
      
// // //       // Documents
// // //       documents: uploadedDocuments,
      
// // //       // Metadata
// // //       createdAt: serverTimestamp(),
// // //       updatedAt: serverTimestamp(),

// // //     };

// // //     const registrationRef = await addDoc(collection(db, REGISTRATIONS_COLLECTION), registrationData);

// // //     return {
// // //       success: true,
// // //       data: {
// // //         registrationId: registrationRef.id,
// // //         fullFlatNumber: registrationData.fullFlatNumber
// // //       }
// // //     };

// // //   } catch (error) {
// // //     console.error('Error in registration:', error);
// // //     return {
// // //       success: false,
// // //       error: error.message
// // //     };
// // //   }
// // // };

// // // registrationService.js


// // import { 
// //     getFirestore, 
// //     collection, 
// //     addDoc, 
// //     serverTimestamp,
// //     query,
// //     where,
// //     getDocs, 
// //     updateDoc,
// //     doc
// //   } from 'firebase/firestore';
// //   import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// //   import { getApp } from 'firebase/app';
  
// //   const db = getFirestore(getApp());
// //   const storage = getStorage(getApp());
  
// //   const REGISTRATIONS_COLLECTION = 'registrations';
  
// //   // Check if flat exists
// //   export const checkFlatExists = async (wing, flatNumber) => {
// //     try {
// //       const q = query(
// //         collection(db, REGISTRATIONS_COLLECTION),
// //         where('wing', '==', wing),
// //         where('flatNumber', '==', flatNumber)
// //       );
// //       const querySnapshot = await getDocs(q);
// //       return !querySnapshot.empty;
// //     } catch (error) {
// //       console.error('Error checking flat existence:', error);
// //       throw error;
// //     }
// //   };
  
// //   // Create vacant flat registration
// //   export const createVacantRegistration = async (wing, flatNumber) => {
// //     try {
// //       // Check if flat exists first
// //       const exists = await checkFlatExists(wing, flatNumber);
// //       if (exists) {
// //         return {
// //           success: false,
// //           error: `Flat ${wing}-${flatNumber} is already registered`
// //         };
// //       }
  
// //       const registrationData = {
// //         wing,
// //         flatNumber,
// //         fullFlatNumber: `${wing}-${flatNumber}`,
// //         isVacant: true,
// //         createdAt: serverTimestamp(),
        
// //       };
  
// //       const registrationRef = await addDoc(
// //         collection(db, REGISTRATIONS_COLLECTION), 
// //         registrationData
// //       );
  
// //       return {
// //         success: true,
// //         data: {
// //           registrationId: registrationRef.id,
// //           fullFlatNumber: registrationData.fullFlatNumber
// //         }
// //       };
// //     } catch (error) {
// //       console.error('Error in vacant registration:', error);
// //       return {
// //         success: false,
// //         error: error.message
// //       };
// //     }
// //   };
  
// //   // Create full registration with owner details
// //   export const createRegistration = async (userData, flatData, documents) => {
// //     try {
// //       // Check if flat exists first
// //       const exists = await checkFlatExists(flatData.wing, flatData.flatNumber);
// //       if (exists) {
// //         return {
// //           success: false,
// //           error: `Flat ${flatData.wing}-${flatData.flatNumber} is already registered`
// //         };
// //       }
  
// //       // Handle document uploads
// //       const uploadedDocuments = [];
      
// //       if (documents && documents.length > 0) {
// //         for (const doc of documents) {
// //           if (doc.file) {
// //             // Create storage reference with unique filename
// //             const timestamp = Date.now();
// //             const storageRef = ref(
// //               storage, 
// //               `registrations/${flatData.wing}-${flatData.flatNumber}/${timestamp}_${doc.file.name}`
// //             );
            
// //             // Upload file
// //             await uploadBytes(storageRef, doc.file);
            
// //             // Get download URL
// //             const downloadURL = await getDownloadURL(storageRef);
            
// //             uploadedDocuments.push({
// //               fileName: doc.file.name,
// //               fileUrl: downloadURL,
// //               documentType: doc.name,
// //               documentName: doc.selectedType,
// //             //   fileSize: doc.file.size,
// //             //   uploadedAt: timestamp,
// //             //   filePath: storageRef.fullPath
// //             });
// //           }
// //         }
// //       }
  
// //       // Create registration document
// //       const registrationData = {
// //         // Personal Information
// //         firstName: userData.firstName,
// //         lastName: userData.lastName,
// //         phone: userData.phone,
// //         email: userData.email,
        
// //         // Flat Details
// //         wing: flatData.wing,
// //         flatNumber: flatData.flatNumber,
// //         fullFlatNumber: `${flatData.wing}-${flatData.flatNumber}`,
// //         isVacant: flatData.isVacant,
        
// //         // Status and Settings
// //         isPrimaryOwner: userData.isPrimaryOwner,
// //         isResiding: userData.isResiding,
// //         notificationsEnabled: userData.notificationsEnabled,
        
// //         // Documents
// //         documents: uploadedDocuments,
        
// //         // Metadata
// //         createdAt: serverTimestamp(),

// //       };
  
// //       const registrationRef = await addDoc(
// //         collection(db, REGISTRATIONS_COLLECTION), 
// //         registrationData
// //       );
  
// //       return {
// //         success: true,
// //         data: {
// //           registrationId: registrationRef.id,
// //           fullFlatNumber: registrationData.fullFlatNumber
// //         }
// //       };
// //     } catch (error) {
// //       console.error('Error in registration:', error);
// //       return {
// //         success: false,
// //         error: error.message
// //       };
// //     }
// //   };
  
// //   // Get registration by wing and flat number
// //   export const getRegistration = async (wing, flatNumber) => {
// //     try {
// //       const q = query(
// //         collection(db, REGISTRATIONS_COLLECTION),
// //         where('wing', '==', wing),
// //         where('flatNumber', '==', flatNumber)
// //       );
// //       const querySnapshot = await getDocs(q);
      
// //       if (querySnapshot.empty) {
// //         return {
// //           success: false,
// //           error: 'Registration not found'
// //         };
// //       }
  
// //       const registration = querySnapshot.docs[0].data();
// //       return {
// //         success: true,
// //         data: {
// //           id: querySnapshot.docs[0].id,
// //           ...registration
// //         }
// //       };
// //     } catch (error) {
// //       console.error('Error getting registration:', error);
// //       return {
// //         success: false,
// //         error: error.message
// //       };
// //     }
// //   };

// //   export const updateRegistration = async (registrationId, userData, flatData, documents) => {
// //     try {
// //       // Update logic here similar to createRegistration
// //       // but using document update instead of create
// //       const registrationRef = doc(db, 'registrations', registrationId);
// //       await updateDoc(registrationRef, {
// //         // Update fields
// //         firstName: userData.firstName,
// //         lastName: userData.lastName,
// //         phone: userData.phone,
// //         email: userData.email,
// //         isPrimaryOwner: userData.isPrimaryOwner,
// //         isResiding: userData.isResiding,
// //         notificationsEnabled: userData.notificationsEnabled,
// //         documents: documents,
// //         updatedAt: serverTimestamp()
// //       });
  
// //       return {
// //         success: true,
// //         data: {
// //           registrationId,
// //           fullFlatNumber: flatData.fullFlatNumber
// //         }
// //       };
// //     } catch (error) {
// //       console.error('Error updating registration:', error);
// //       return {
// //         success: false,
// //         error: error.message
// //       };
// //     }
// //   };

// import { 
//     getFirestore, 
//     collection, 
//     addDoc, 
//     serverTimestamp,
//     query,
//     where,
//     getDocs, 
//     updateDoc,
//     doc
//   } from 'firebase/firestore';
//   import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
//   import { getApp } from 'firebase/app';
  
//   const db = getFirestore(getApp());
//   const storage = getStorage(getApp());
  
//   const REGISTRATIONS_COLLECTION = 'registrations';
  
//   // Check if flat exists
//   export const checkFlatExists = async (wing, flatNumber) => {
//     try {
//       const q = query(
//         collection(db, REGISTRATIONS_COLLECTION),
//         where('wing', '==', wing),
//         where('flatNumber', '==', flatNumber)
//       );
//       const querySnapshot = await getDocs(q);
//       return !querySnapshot.empty; // Just return boolean as in your working code
//     } catch (error) {
//       console.error('Error checking flat existence:', error);
//       throw error;
//     }
//   };
  
//   // Create vacant flat registration
// export const createVacantRegistration = async (wing, flatNumber) => {
//     try {
//       const flatStatus = await checkFlatExists(wing, flatNumber);
//       if (flatStatus.exists && !flatStatus.isVacant) {
//         return {
//           success: false,
//           error: `Flat ${wing}-${flatNumber} is already registered`
//         };
//       }
  
//       const registrationData = {
//         wing,
//         flatNumber,
//         fullFlatNumber: `${wing}-${flatNumber}`,
//         isVacant: true,
//         createdAt: serverTimestamp(),
//       };
  
//       const registrationRef = await addDoc(
//         collection(db, REGISTRATIONS_COLLECTION), 
//         registrationData
//       );
  
//       return {
//         success: true,
//         data: {
//           registrationId: registrationRef.id,
//           fullFlatNumber: registrationData.fullFlatNumber
//         }
//       };
//     } catch (error) {
//       console.error('Error in vacant registration:', error);
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   };
  
//   // Upload documents helper function
//   const uploadDocuments = async (documents, wingFlatNumber) => {
//     const uploadedDocuments = [];
//     if (documents && documents.length > 0) {
//       for (const doc of documents) {
//         if (doc.file && !doc.file.url) {
//           const timestamp = Date.now();
//           const storageRef = ref(
//             storage, 
//             `registrations/${wingFlatNumber}/${timestamp}_${doc.file.name}`
//           );
          
//           await uploadBytes(storageRef, doc.file);
//           const downloadURL = await getDownloadURL(storageRef);
          
//           uploadedDocuments.push({
//             fileName: doc.file.name,
//             fileUrl: downloadURL,
//             documentType: doc.name,
//             documentName: doc.selectedType,
//           });
//         } else if (doc.file && doc.file.url) {
//           uploadedDocuments.push({
//             fileName: doc.file.name,
//             fileUrl: doc.file.url,
//             documentType: doc.name,
//             documentName: doc.selectedType
//           });
//         }
//       }
//     }
//     return uploadedDocuments;
//   };
  
//   // Create or update registration
// //   export const createRegistration = async (userData, flatData, documents) => {
// //     try {
// //       // Check if this is an update operation
// //       if (flatData.registrationId) {
// //         const uploadedDocuments = await uploadDocuments(documents, `${flatData.wing}-${flatData.flatNumber}`);
        
// //         const registrationRef = doc(db, REGISTRATIONS_COLLECTION, flatData.registrationId);
// //         const updateData = {
// //           firstName: userData.firstName,
// //           lastName: userData.lastName,
// //           phone: userData.phone,
// //           email: userData.email,
// //           isPrimaryOwner: userData.isPrimaryOwner,
// //           isResiding: userData.isResiding,
// //           notificationsEnabled: userData.notificationsEnabled,
// //           documents: uploadedDocuments,
// //           updatedAt: serverTimestamp()
// //         };
  
// //         await updateDoc(registrationRef, updateData);
  
// //         return {
// //           success: true,
// //           data: {
// //             registrationId: flatData.registrationId,
// //             fullFlatNumber: `${flatData.wing}-${flatData.flatNumber}`
// //           }
// //         };
// //       }
  
// //       // For new registrations, check if flat exists and its status
// //       const flatStatus = await checkFlatExists(flatData.wing, flatData.flatNumber);
// //       if (flatStatus.exists && !flatStatus.isVacant) {
// //         return {
// //           success: false,
// //           error: `Flat ${flatData.wing}-${flatData.flatNumber} is already registered`
// //         };
// //       }
  
// //       const uploadedDocuments = await uploadDocuments(documents, `${flatData.wing}-${flatData.flatNumber}`);
      
// //       const registrationData = {
// //         firstName: userData.firstName,
// //         lastName: userData.lastName,
// //         phone: userData.phone,
// //         email: userData.email,
// //         wing: flatData.wing,
// //         flatNumber: flatData.flatNumber,
// //         fullFlatNumber: `${flatData.wing}-${flatData.flatNumber}`,
// //         isVacant: false,
// //         isPrimaryOwner: userData.isPrimaryOwner,
// //         isResiding: userData.isResiding,
// //         notificationsEnabled: userData.notificationsEnabled,
// //         documents: uploadedDocuments,
// //         createdAt: serverTimestamp(),
// //       };
  
// //       // Update existing vacant registration or create new
// //       if (flatStatus.exists && flatStatus.isVacant) {
// //         const registrationRef = doc(db, REGISTRATIONS_COLLECTION, flatStatus.registrationId);
// //         await updateDoc(registrationRef, {
// //           ...registrationData,
// //           updatedAt: serverTimestamp()
// //         });
  
// //         return {
// //           success: true,
// //           data: {
// //             registrationId: flatStatus.registrationId,
// //             fullFlatNumber: registrationData.fullFlatNumber
// //           }
// //         };
// //       } else {
// //         const registrationRef = await addDoc(
// //           collection(db, REGISTRATIONS_COLLECTION), 
// //           registrationData
// //         );
  
// //         return {
// //           success: true,
// //           data: {
// //             registrationId: registrationRef.id,
// //             fullFlatNumber: registrationData.fullFlatNumber
// //           }
// //         };
// //       }
// //     } catch (error) {
// //       console.error('Error in registration:', error);
// //       return {
// //         success: false,
// //         error: error.message
// //       };
// //     }
// //   };
// export const createRegistration = async (userData, flatData, documents) => {
//     try {
//       // First check if flat exists and get its ID
//       const q = query(
//         collection(db, REGISTRATIONS_COLLECTION),
//         where('wing', '==', flatData.wing),
//         where('flatNumber', '==', flatData.flatNumber)
//       );
//       const querySnapshot = await getDocs(q);
      
//       let existingRegistration = null;
//       if (!querySnapshot.empty) {
//         existingRegistration = {
//           id: querySnapshot.docs[0].id,
//           ...querySnapshot.docs[0].data()
//         };
//       }
  
//       // Handle document uploads
//       const uploadedDocuments = [];
//       if (documents && documents.length > 0) {
//         for (const doc of documents) {
//           if (doc.file && !doc.file.url) {
//             const timestamp = Date.now();
//             const storageRef = ref(
//               storage, 
//               `registrations/${flatData.wing}-${flatData.flatNumber}/${timestamp}_${doc.file.name}`
//             );
            
//             await uploadBytes(storageRef, doc.file);
//             const downloadURL = await getDownloadURL(storageRef);
            
//             uploadedDocuments.push({
//               fileName: doc.file.name,
//               fileUrl: downloadURL,
//               documentType: doc.name,
//               documentName: doc.selectedType,
//             });
//           } else if (doc.file && doc.file.url) {
//             uploadedDocuments.push({
//               fileName: doc.file.name,
//               fileUrl: doc.file.url,
//               documentType: doc.name,
//               documentName: doc.selectedType
//             });
//           }
//         }
//       }
  
//       const registrationData = {
//         firstName: userData.firstName,
//         lastName: userData.lastName,
//         phone: userData.phone,
//         email: userData.email,
//         wing: flatData.wing,
//         flatNumber: flatData.flatNumber,
//         fullFlatNumber: `${flatData.wing}-${flatData.flatNumber}`,
//         isVacant: false,
//         isPrimaryOwner: userData.isPrimaryOwner,
//         isResiding: userData.isResiding,
//         notificationsEnabled: userData.notificationsEnabled,
//         documents: uploadedDocuments,
//         updatedAt: serverTimestamp()
//       };
  
//       // If registration exists (vacant or not)
//       if (existingRegistration) {
//         // If not vacant and not editing, return error
//         if (!existingRegistration.isVacant && !flatData.registrationId) {
//           return {
//             success: false,
//             error: `Flat ${flatData.wing}-${flatData.flatNumber} is already registered`
//           };
//         }
  
//         // Update existing registration
//         const registrationRef = doc(db, REGISTRATIONS_COLLECTION, existingRegistration.id);
//         await updateDoc(registrationRef, registrationData);
  
//         return {
//           success: true,
//           data: {
//             registrationId: existingRegistration.id,
//             fullFlatNumber: registrationData.fullFlatNumber
//           }
//         };
//       }
  
//       // If no existing registration, create new
//       registrationData.createdAt = serverTimestamp();
//       const registrationRef = await addDoc(
//         collection(db, REGISTRATIONS_COLLECTION), 
//         registrationData
//       );
  
//       return {
//         success: true,
//         data: {
//           registrationId: registrationRef.id,
//           fullFlatNumber: registrationData.fullFlatNumber
//         }
//       };
//     } catch (error) {
//       console.error('Error in registration:', error);
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   };
  
//   // Get registration by wing and flat number
//   export const getRegistration = async (wing, flatNumber) => {
//     try {
//       const q = query(
//         collection(db, REGISTRATIONS_COLLECTION),
//         where('wing', '==', wing),
//         where('flatNumber', '==', flatNumber)
//       );
//       const querySnapshot = await getDocs(q);
      
//       if (querySnapshot.empty) {
//         return {
//           success: false,
//           error: 'Registration not found'
//         };
//       }
  
//       const registration = querySnapshot.docs[0].data();
//       return {
//         success: true,
//         data: {
//           id: querySnapshot.docs[0].id,
//           ...registration
//         }
//       };
//     } catch (error) {
//       console.error('Error getting registration:', error);
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   };
// //   export const updateRegistration = async (registrationId, userData, flatData, documents) => {

// //     try {
// //       const registrationRef = doc(db, REGISTRATIONS_COLLECTION, registrationId);
// //       await updateDoc(registrationRef, {
// //         firstName: userData.firstName,
// //         lastName: userData.lastName,
// //         phone: userData.phone,
// //         email: userData.email,
// //         isPrimaryOwner: userData.isPrimaryOwner,
// //         isResiding: userData.isResiding,
// //         notificationsEnabled: userData.notificationsEnabled,
// //         documents: documents,
// //         updatedAt: serverTimestamp()
// //       });
  
// //       return {
// //         success: true,
// //         data: {
// //           registrationId,
// //           fullFlatNumber: flatData.fullFlatNumber
// //         }
// //       };
// //     } catch (error) {
// //       console.error('Error updating registration:', error);
// //       return {
// //         success: false,
// //         error: error.message
// //       };
// //     }
// //   };

// export const updateRegistration = async (registrationId, userData, flatData, documents) => {
//     try {
//       console.log('Updating registration with ID:', registrationId);
  
//       // Handle document uploads
//       const uploadedDocuments = [];
//       if (documents && documents.length > 0) {
//         for (const doc of documents) {
//           if (doc.file && !doc.file.url) {
//             // Only upload new documents
//             const timestamp = Date.now();
//             const storageRef = ref(
//               storage, 
//               `registrations/${flatData.wing}-${flatData.flatNumber}/${timestamp}_${doc.file.name}`
//             );
            
//             await uploadBytes(storageRef, doc.file);
//             const downloadURL = await getDownloadURL(storageRef);
            
//             uploadedDocuments.push({
//               fileName: doc.file.name,
//               fileUrl: downloadURL,
//               documentType: doc.name,
//               documentName: doc.selectedType,
//             });
//           } else if (doc.file && doc.file.url) {
//             // Keep existing documents
//             uploadedDocuments.push({
//               fileName: doc.file.name,
//               fileUrl: doc.file.url,
//               documentType: doc.name,
//               documentName: doc.selectedType
//             });
//           }
//         }
//       }
  
//       // Update registration
//       const registrationRef = doc(db, REGISTRATIONS_COLLECTION, registrationId);
//       const updateData = {
//         firstName: userData.firstName,
//         lastName: userData.lastName,
//         phone: userData.phone,
//         email: userData.email,
//         isPrimaryOwner: userData.isPrimaryOwner,
//         isResiding: userData.isResiding,
//         notificationsEnabled: userData.notificationsEnabled,
//         documents: uploadedDocuments,
//         isVacant: false, // Always set to false when updating with user details
//         updatedAt: serverTimestamp()
//       };
  
//       await updateDoc(registrationRef, updateData);
  
//       return {
//         success: true,
//         data: {
//           registrationId,
//           fullFlatNumber: flatData.fullFlatNumber
//         }
//       };
//     } catch (error) {
//       console.error('Error updating registration:', error);
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   };


import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp,
  query,
  where,
  getDocs, 
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  getDoc
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getApp } from 'firebase/app';

const db = getFirestore(getApp());
const storage = getStorage(getApp());

const REGISTRATIONS_COLLECTION = 'registrations';

// Create a new vacant registration
export const createVacantRegistration = async (wing, flatNumber) => {
try {
  // Check if flat already exists
  const q = query(
    collection(db, REGISTRATIONS_COLLECTION),
    where('wing', '==', wing),
    where('flatNumber', '==', flatNumber)
  );
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    // If flat exists, update it to vacant
    const existingRegistration = {
      id: querySnapshot.docs[0].id,
      ...querySnapshot.docs[0].data()
    };

    const registrationRef = doc(db, REGISTRATIONS_COLLECTION, existingRegistration.id);
    await updateDoc(registrationRef, {
      isVacant: true,
      owners: [],
      tenants: [],
      updatedAt: serverTimestamp()
    });

    return {
      success: true,
      data: {
        registrationId: existingRegistration.id,
        fullFlatNumber: `${wing}-${flatNumber}`
      }
    };
  }

  // Create new vacant registration
  const registrationData = {
    wing,
    flatNumber,
    fullFlatNumber: `${wing}-${flatNumber}`,
    isVacant: true,
    owners: [],
    tenants: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const registrationRef = await addDoc(
    collection(db, REGISTRATIONS_COLLECTION), 
    registrationData
  );

  return {
    success: true,
    data: {
      registrationId: registrationRef.id,
      fullFlatNumber: registrationData.fullFlatNumber
    }
  };
} catch (error) {
  console.error('Error in vacant registration:', error);
  return {
    success: false,
    error: error.message
  };
}
};

// Helper function to handle document uploads
export const uploadDocuments = async (documents, wingFlatNumber) => {
const uploadedDocuments = [];
if (documents && documents.length > 0) {
  for (const doc of documents) {
    if (doc.file && !doc.file.url) {
      const timestamp = Date.now();
      const storageRef = ref(
        storage, 
        `registrations/${wingFlatNumber}/${timestamp}_${doc.file.name}`
      );
      
      await uploadBytes(storageRef, doc.file);
      const downloadURL = await getDownloadURL(storageRef);
      
      uploadedDocuments.push({
        fileName: doc.file.name,
        fileUrl: downloadURL,
        documentType: doc.name,
        documentName: doc.selectedType,
      });
    } else if (doc.file && doc.file.url) {
      uploadedDocuments.push({
        fileName: doc.file.name,
        fileUrl: doc.file.url,
        documentType: doc.name,
        documentName: doc.selectedType
      });
    }
  }
}
return uploadedDocuments;
};

// Create or update registration with owner/tenant
// export const createRegistration = async (userData, flatData, documents) => {
// try {
//   const q = query(
//     collection(db, REGISTRATIONS_COLLECTION),
//     where('wing', '==', flatData.wing),
//     where('flatNumber', '==', flatData.flatNumber)
//   );
//   const querySnapshot = await getDocs(q);

//   const uploadedDocuments = await uploadDocuments(documents, `${flatData.wing}-${flatData.flatNumber}`);
  
//   const personData = {
//     firstName: userData.firstName,
//     lastName: userData.lastName,
//     phone: userData.phone,
//     email: userData.email,
//     isResiding: userData.isResiding,
//     notificationsEnabled: userData.notificationsEnabled,
//     isPrimaryStatus: userData.isPrimaryStatus,
//     documents: uploadedDocuments,
//     addedAt: new Date().toISOString()
//   };

//   // If registration doesn't exist, create new
//   if (querySnapshot.empty) {
//     const registrationData = {
//       wing: flatData.wing,
//       flatNumber: flatData.flatNumber,
//       fullFlatNumber: `${flatData.wing}-${flatData.flatNumber}`,
//       isVacant: false,
//       owners: [],
//       tenants: [],
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp()
//     };
    
//     const personArray = userData.type === 'owner' ? 'owners' : 'tenants';
//     registrationData[personArray] = [personData];

//     const registrationRef = await addDoc(
//       collection(db, REGISTRATIONS_COLLECTION), 
//       registrationData
//     );

//     return {
//       success: true,
//       data: {
//         registrationId: registrationRef.id,
//         fullFlatNumber: registrationData.fullFlatNumber
//       }
//     };
//   }

//   // Registration exists, update it
//   const existingRegistration = {
//     id: querySnapshot.docs[0].id,
//     ...querySnapshot.docs[0].data()
//   };

//   const registrationRef = doc(db, REGISTRATIONS_COLLECTION, existingRegistration.id);
//   const personArray = userData.type === 'owner' ? 'owners' : 'tenants';
//   const currentPersons = existingRegistration[personArray] || [];

//   // If this is a new primary person, update existing primary to non-primary
//   if (userData.isPrimaryStatus) {
//     const updatedPersons = currentPersons.map(person => ({
//       ...person,
//       isPrimaryStatus: false
//     }));
    
//     await updateDoc(registrationRef, {
//       isVacant: false, // Ensure flat is marked as not vacant when adding person
//       [personArray]: [...updatedPersons, personData],
//       updatedAt: serverTimestamp()
//     });
//   } else {
//     // Just add the new person
//     await updateDoc(registrationRef, {
//       isVacant: false, // Ensure flat is marked as not vacant when adding person
//       [personArray]: arrayUnion(personData),
//       updatedAt: serverTimestamp()
//     });
//   }

//   return {
//     success: true,
//     data: {
//       registrationId: existingRegistration.id,
//       fullFlatNumber: existingRegistration.fullFlatNumber
//     }
//   };
// } catch (error) {
//   console.error('Error in registration:', error);
//   return {
//     success: false,
//     error: error.message
//   };
// }
// };
export const createRegistration = async (userData, flatData, documents) => {
  try {
    const q = query(
      collection(db, REGISTRATIONS_COLLECTION),
      where('wing', '==', flatData.wing),
      where('flatNumber', '==', flatData.flatNumber)
    );
    const querySnapshot = await getDocs(q);

    const uploadedDocuments = await uploadDocuments(documents, `${flatData.wing}-${flatData.flatNumber}`);
    
    // Add unique ID for each person
    const personData = {
      id: `${Date.now()}_${userData.type}`, // Add unique ID
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      email: userData.email,
      isResiding: userData.isResiding,
      notificationsEnabled: userData.notificationsEnabled,
      isPrimaryStatus: userData.isPrimaryStatus,
      documents: uploadedDocuments,
      addedAt: new Date().toISOString()
    };

    // If registration doesn't exist, create new
    if (querySnapshot.empty) {
      const registrationData = {
        wing: flatData.wing,
        flatNumber: flatData.flatNumber,
        fullFlatNumber: `${flatData.wing}-${flatData.flatNumber}`,
        isVacant: false,
        owners: [],
        tenants: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const personArray = userData.type === 'owner' ? 'owners' : 'tenants';
      registrationData[personArray] = [personData];

      const registrationRef = await addDoc(
        collection(db, REGISTRATIONS_COLLECTION), 
        registrationData
      );

      return {
        success: true,
        data: {
          registrationId: registrationRef.id,
          personId: personData.id,  // Return the person ID
          fullFlatNumber: registrationData.fullFlatNumber
        }
      };
    }

    // Registration exists, update it
    const existingRegistration = {
      id: querySnapshot.docs[0].id,
      ...querySnapshot.docs[0].data()
    };

    const registrationRef = doc(db, REGISTRATIONS_COLLECTION, existingRegistration.id);
    const personArray = userData.type === 'owner' ? 'owners' : 'tenants';
    const currentPersons = existingRegistration[personArray] || [];

    // Always update entire array to maintain consistency
    const updatedPersons = [...currentPersons];
    
    if (userData.isPrimaryStatus) {
      // Update all existing to non-primary
      updatedPersons.forEach(person => {
        person.isPrimaryStatus = false;
      });
    }
    
    // Add new person
    updatedPersons.push(personData);

    await updateDoc(registrationRef, {
      isVacant: false,
      [personArray]: updatedPersons,
      updatedAt: serverTimestamp()
    });

    return {
      success: true,
      data: {
        registrationId: existingRegistration.id,
        personId: personData.id,  // Return the person ID
        fullFlatNumber: existingRegistration.fullFlatNumber
      }
    };
  } catch (error) {
    console.error('Error in registration:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const updateRegistration = async (registrationId, personId, personData, documents, type) => {
  try {
    const registrationRef = doc(db, REGISTRATIONS_COLLECTION, registrationId);
    const registration = (await getDoc(registrationRef)).data();

    // Upload any new documents
    const uploadedDocuments = await uploadDocuments(
      documents, 
      `${registration.wing}-${registration.flatNumber}`
    );

    // Prepare updated person data
    const updatedPersonData = {
      ...personData,
      documents: uploadedDocuments,
      updatedAt: new Date().toISOString()
    };

    // Get correct array (owners or tenants)
    const personArray = type === 'owner' ? 'owners' : 'tenants';
    const currentPersons = registration[personArray] || [];

    // Update person in array
    const updatedPersons = currentPersons.map(person => {
      if (person.id === personId) {
        return updatedPersonData;
      }
      // If setting new primary, update others
      if (updatedPersonData.isPrimaryStatus && person.isPrimaryStatus) {
        return { ...person, isPrimaryStatus: false };
      }
      return person;
    });

    // Update registration
    await updateDoc(registrationRef, {
      [personArray]: updatedPersons,
      updatedAt: serverTimestamp()
    });

    return {
      success: true,
      data: {
        registrationId,
        personId,
        fullFlatNumber: registration.fullFlatNumber
      }
    };
  } catch (error) {
    console.error('Error updating registration:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const updatePersonDocuments = async (registrationId, personId, documents) => {
  try {
    const registrationRef = doc(db, REGISTRATIONS_COLLECTION, registrationId);
    const registration = (await registrationRef.get()).data();

    // Find person in owners or tenants array
    let personArray = 'owners';
    let person = registration.owners?.find(p => p.id === personId);
    
    if (!person) {
      personArray = 'tenants';
      person = registration.tenants?.find(p => p.id === personId);
    }

    if (!person) {
      throw new Error('Person not found');
    }

    // Upload new documents
    const uploadedDocuments = await uploadDocuments(documents, `${registration.wing}-${registration.flatNumber}`);

    // Update person's documents
    const updatedPersons = registration[personArray].map(p => {
      if (p.id === personId) {
        return {
          ...p,
          documents: uploadedDocuments
        };
      }
      return p;
    });

    await updateDoc(registrationRef, {
      [personArray]: updatedPersons,
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating documents:', error);
    return { success: false, error: error.message };
  }
};

// Get registration details
export const getRegistration = async (wing, flatNumber) => {
try {
  const q = query(
    collection(db, REGISTRATIONS_COLLECTION),
    where('wing', '==', wing),
    where('flatNumber', '==', flatNumber)
  );
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return {
      success: false,
      error: 'Registration not found'
    };
  }

  const registration = querySnapshot.docs[0].data();
  return {
    success: true,
    data: {
      id: querySnapshot.docs[0].id,
      ...registration,
      owners: registration.owners || [],
      tenants: registration.tenants || []
    }
  };
} catch (error) {
  console.error('Error getting registration:', error);
  return {
    success: false,
    error: error.message
  };
}
};

// Check if flat exists and its status
export const checkFlatStatus = async (wing, flatNumber) => {
try {
  const q = query(
    collection(db, REGISTRATIONS_COLLECTION),
    where('wing', '==', wing),
    where('flatNumber', '==', flatNumber)
  );
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return {
      exists: false,
      isVacant: false,
      registrationId: null
    };
  }

  const registration = querySnapshot.docs[0].data();
  return {
    exists: true,
    isVacant: registration.isVacant,
    registrationId: querySnapshot.docs[0].id
  };
} catch (error) {
  console.error('Error checking flat status:', error);
  throw error;
}
};

// Update person's primary status
export const updatePrimaryStatus = async (registrationId, type, newPrimaryId) => {
try {
  const registrationRef = doc(db, REGISTRATIONS_COLLECTION, registrationId);
  const registration = (await registrationRef.get()).data();
  
  const personArray = type === 'owner' ? 'owners' : 'tenants';
  const persons = registration[personArray];

  // Update previous primary and new primary
  const updatedPersons = persons.map(person => ({
    ...person,
    isPrimaryStatus: person.id === newPrimaryId
  }));

  await updateDoc(registrationRef, {
    [personArray]: updatedPersons,
    updatedAt: serverTimestamp()
  });

  return {
    success: true
  };
} catch (error) {
  console.error('Error updating primary status:', error);
  return {
    success: false,
    error: error.message
  };
}
};