// services/amenityService.js
import { collection, addDoc, updateDoc, doc, getDoc, getDocs, deleteDoc, serverTimestamp, getFirestore } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';
// import {  storage } from '../firebase/config';

const db = getFirestore();
const storage = getStorage();


// Helper function to upload image and get URL
const uploadImageToStorage = async (file, amenityId) => {
  const imageRef = ref(storage, `amenities/${amenityId}/${file.name}`);
  await uploadBytes(imageRef, file);
  return getDownloadURL(imageRef);
};

// Create new amenity
// services/amenityService.js

// Create new amenity
export const createAmenity = async (amenityData, imageFiles) => {
    try {
      // Validate timeSlots data
      if (!amenityData.timeSlots?.startTime || !amenityData.timeSlots?.endTime || !amenityData.timeSlots?.slotDuration) {
        throw new Error('Invalid time slots configuration');
      }
  
      // First, create amenity document without images
      const docRef = await addDoc(collection(db, 'amenities'), {
        heading: amenityData.heading,
        location: amenityData.location,
        about: amenityData.about,
        timeSlots: {
          startTime: amenityData.timeSlots.startTime,
          endTime: amenityData.timeSlots.endTime,
          slotDuration: amenityData.timeSlots.slotDuration // in hours
        },
        isDisabled: amenityData.isDisabled,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'ACTIVE',
        imageUrls: [],
        bookingEnabled: !amenityData.isDisabled
      });
  
      // Upload images and get URLs
      const imageUrls = await Promise.all(
        imageFiles.map(async (imageFile) => {
          if (!imageFile.file) return imageFile; // If it's an existing image
          const url = await uploadImageToStorage(imageFile.file, docRef.id);
          return {
            url,
            fileName: imageFile.file.name,
            uploadedAt: new Date().toISOString()
          };
        })
      );
  
      // Update document with image URLs
      await updateDoc(docRef, {
        imageUrls
      });
  
      return {
        success: true,
        data: {
          id: docRef.id,
          ...amenityData,
          imageUrls
        }
      };
  
    } catch (error) {
      console.error('Error creating amenity:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };
  
  // Update existing amenity
  export const updateAmenity = async (amenityId, amenityData, imageFiles) => {
    try {
      const amenityRef = doc(db, 'amenities', amenityId);
      
      // Handle image updates
      let imageUrls = [...(amenityData.existingImages || [])];
      
      // Upload new images
      if (imageFiles && imageFiles.length > 0) {
        const newImageUrls = await Promise.all(
          imageFiles.map(async (imageFile) => {
            if (!imageFile.file) return imageFile; // If it's an existing image
            const url = await uploadImageToStorage(imageFile.file, amenityId);
            return {
              url,
              fileName: imageFile.file.name,
              uploadedAt: new Date().toISOString()
            };
          })
        );
        imageUrls = [...imageUrls, ...newImageUrls];
      }
  
      // Update document
      const updateData = {
        heading: amenityData.heading,
        location: amenityData.location,
        about: amenityData.about,
        timeSlots: {
          startTime: amenityData.timeSlots.startTime,
          endTime: amenityData.timeSlots.endTime,
          slotDuration: amenityData.timeSlots.slotDuration
        },
        isDisabled: amenityData.isDisabled,
        updatedAt: serverTimestamp(),
        imageUrls,
        bookingEnabled: !amenityData.isDisabled
      };
  
      await updateDoc(amenityRef, updateData);
  
      return {
        success: true,
        data: {
          id: amenityId,
          ...updateData,
          imageUrls
        }
      };
  
    } catch (error) {
      console.error('Error updating amenity:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };

// Get amenity by ID
export const getAmenity = async (amenityId) => {
  try {
    const docRef = doc(db, 'amenities', amenityId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        success: true,
        data: {
          id: docSnap.id,
          ...docSnap.data()
        }
      };
    } else {
      return {
        success: false,
        error: 'Amenity not found'
      };
    }
  } catch (error) {
    console.error('Error getting amenity:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get all amenities
export const getAllAmenities = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'amenities'));
    const amenities = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return {
      success: true,
      data: amenities
    };
  } catch (error) {
    console.error('Error getting amenities:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Delete amenity
export const deleteAmenity = async (amenityId) => {
  try {
    await deleteDoc(doc(db, 'amenities', amenityId));
    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting amenity:', error);
    return {
      success: false,
      error: error.message
    };
  }
};