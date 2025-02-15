import { getFirestore, collection, addDoc, serverTimestamp, query, onSnapshot, updateDoc, doc, deleteDoc, getDocs, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { getApp } from 'firebase/app';

const CONSTRUCTION_UPDATES_COLLECTION = 'constructionUpdates';
const TARGET_DATE_COLLECTION = 'targetDates';
const TARGET_DATE_DOC_ID = 'constructionTargetDate';
const db = getFirestore(getApp());



export const saveConstructionUpdate = async (updateData) => {
  try {
    console.log('Attempting to save construction update:', updateData);
    
    const updateRef = await addDoc(collection(db, CONSTRUCTION_UPDATES_COLLECTION), {
      ...updateData,
      createdAt: serverTimestamp(),
    });
    
    console.log('Construction update saved successfully with ID:', updateRef.id);
    return updateRef.id;
  } catch (error) {
    console.error('Error saving construction update:', error);
    throw error;
  }
};

export const fetchConstructionUpdates = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, CONSTRUCTION_UPDATES_COLLECTION));
     
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

    } catch (error) {
      console.error('Error fetching construction updates:', error);
      throw error;
    }
  };

export const editConstructionUpdate = async (updateData) => {
  try {
    const { id, ...updateFields } = updateData;
    await updateDoc(doc(db, CONSTRUCTION_UPDATES_COLLECTION, id), {
      ...updateFields,
      updatedAt: serverTimestamp(),
    });
    console.log('Construction update edited successfully with ID:', id);
  } catch (error) {
    console.error('Error editing construction update:', error);
    throw error;
  }
};

export const deleteConstructionUpdate = async (updateId) => {
  try {
    await deleteDoc(doc(db, CONSTRUCTION_UPDATES_COLLECTION, updateId));
    console.log(`Construction update with ID ${updateId} has been successfully deleted.`);
  } catch (error) {
    console.error('Error deleting construction update:', error);
    throw error;
  }
};


// New functions for target date

export const saveTargetDate = async (targetDate) => {
  try {
    if (!(targetDate instanceof Date) || isNaN(targetDate.getTime())) {
      throw new Error('Invalid date object');
    }

    await setDoc(doc(db, TARGET_DATE_COLLECTION, TARGET_DATE_DOC_ID), {
      targetDate: Timestamp.fromDate(targetDate),
      updatedAt: serverTimestamp(),
    });
    console.log('Target date saved successfully');
  } catch (error) {
    console.error('Error saving target date:', error);
    throw error;
  }
};

export const getTargetDate = async () => {
  try {
    const docRef = doc(db, TARGET_DATE_COLLECTION, TARGET_DATE_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().targetDate;
    } else {
      console.log('No target date found');
      return null;
    }
  } catch (error) {
    console.error('Error getting target date:', error);
    throw error;
  }
};