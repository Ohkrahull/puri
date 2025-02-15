import { getFirestore, collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getApp } from 'firebase/app';
// import admin from 'firebase-admin';

const db = getFirestore(getApp());
const storage = getStorage(getApp());

const DOCUMENTS_COLLECTION = 'documents';

export const uploadDocument = async (file, user, documentType, name) => {
  try {
    // Upload file to Firebase Storage
    const storageRef = ref(storage, `documents/${user.id}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Save document metadata and user info to Firestore
    const docRef = await addDoc(collection(db, DOCUMENTS_COLLECTION), {
      phoneNumber: user.phoneNumber,
      fileName: file.name,
      fileUrl: downloadURL,
      documentType,
      name,
      uploadDate: new Date(),
      status: 'Pending', // Initial status
     
    });

    console.log('Document uploaded successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

// export const uploadDocument = async (file, user, documentType, name) => {
//   try {
//     // Upload file to Firebase Storage
//     const storageRef = ref(storage, `documents/${user.id}/${file.name}`);
//     await uploadBytes(storageRef, file);
//     const downloadURL = await getDownloadURL(storageRef);

//     // Save document metadata and user info to Firestore
//     const docRef = await addDoc(collection(db, 'documents'), {
//       phoneNumber: user.phoneNumber,
//       fileName: file.name,
//       fileUrl: downloadURL,
//       documentType,
//       name,
//       uploadDate: new Date(),
//       status: 'Pending',
//     });

//     // Fetch user's FCM token from Firestore
//     const userDoc = await firestore().collection('authorizedUsers').doc(user.phoneNumber).get();
//     const fcmToken = userDoc.data()?.fcmToken;

//     if (fcmToken) {
//       const message = {
//         token: fcmToken,
//         notification: {
//           title: 'New Document Uploaded',
//           body: `A new document (${name}) has been added to your account.`,
//         },
//         data: {
//           documentId: docRef.id,
//           documentType,
//         },
//       };

//       // Send the notification via Firebase Admin SDK
//       admin.messaging().send(message)
//         .then(response => {
//           console.log('Notification sent successfully:', response);
//         })
//         .catch(error => {
//           console.error('Error sending notification:', error);
//         });
//     }
//   } catch (error) {
//     console.error('Error uploading document:', error);
//     throw error;
//   }
// };

export const fetchUserDocuments = async (userId) => {
  try {
    const q = query(collection(db, DOCUMENTS_COLLECTION), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const documents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return documents;
  } catch (error) {
    console.error('Error fetching user documents:', error);
    throw error;
  }
};

// New function to update a document
export const updateDocument = async (docId, updatedData) => {
  try {
    const docRef = doc(db, DOCUMENTS_COLLECTION, docId);
    
    // If there's a new file, upload it and get the new URL
    if (updatedData.file) {
      const storageRef = ref(storage, `documents/${updatedData.userId}/${updatedData.file.name}`);
      await uploadBytes(storageRef, updatedData.file);
      const downloadURL = await getDownloadURL(storageRef);
      updatedData.fileUrl = downloadURL;
      updatedData.fileName = updatedData.file.name;
    }

    // Remove the file object from updatedData as it's not needed in Firestore
    delete updatedData.file;

    // Update the document in Firestore
    await updateDoc(docRef, {
      ...updatedData,
      uploadDate: new Date() // Update the upload date
    });

    console.log('Document updated successfully');
    return docId;
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};