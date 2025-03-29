// src/utils/firestoreUtils.js
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

const db = getFirestore();

/**
 * Fetch user information by phone number
 * @param {string} phoneNumber - User's phone number
 * @returns {Promise<Object|null>} - User data or null if not found
 */
export const getUserByPhone = async (phoneNumber) => {
  try {
    if (!phoneNumber) return null;
    
    const userQuery = query(
      collection(db, 'users'),
      where('phoneNumber', '==', phoneNumber)
    );
    
    const userSnapshot = await getDocs(userQuery);
    if (userSnapshot.empty) return null;
    
    return {
      id: userSnapshot.docs[0].id,
      ...userSnapshot.docs[0].data()
    };
  } catch (error) {
    console.error('Error fetching user by phone:', error);
    return null;
  }
};

/**
 * Fetch guard information by employee ID
 * @param {string} employeeId - Guard's employee ID
 * @returns {Promise<Object|null>} - Guard data or null if not found
 */
export const getGuardByEmployeeId = async (employeeId) => {
  try {
    if (!employeeId) return null;
    
    const guardQuery = query(
      collection(db, 'guardUsers'),
      where('employeeId', '==', employeeId)
    );
    
    const guardSnapshot = await getDocs(guardQuery);
    if (guardSnapshot.empty) return null;
    
    return {
      id: guardSnapshot.docs[0].id,
      ...guardSnapshot.docs[0].data()
    };
  } catch (error) {
    console.error('Error fetching guard by employee ID:', error);
    return null;
  }
};

/**
 * Format flat ID for display
 * @param {Object} data - Object containing flatId, wing, flatNumber
 * @returns {string} - Formatted flat number
 */
export const formatFlatNumber = (data) => {
  if (data.wing && data.flatNumber) {
    return `${data.wing}-${data.flatNumber}`;
  }
  
  if (data.flatId) {
    // Convert "flat_A_101" to "A-101"
    return data.flatId.replace('flat_', '').replace(/_/g, '-');
  }
  
  return 'Unknown';
};

/**
 * Update SOS alert status
 * @param {string} alertId - Alert document ID
 * @param {string} status - New status (ACKNOWLEDGED, RESOLVED)
 * @param {string} employeeId - Guard's employee ID who updated the status
 * @returns {Promise<boolean>} - Success or failure
 */
export const updateSOSAlertStatus = async (alertId, status, employeeId) => {
  try {
    if (!alertId) return false;
    
    const updateData = {
      status,
      lastUpdatedAt: new Date()
    };
    
    if (status === 'ACKNOWLEDGED') {
      updateData.acknowledgedBy = employeeId;
      updateData.acknowledgedAt = new Date();
    } else if (status === 'RESOLVED') {
      updateData.resolvedBy = employeeId;
      updateData.resolvedAt = new Date();
      updateData.resolved = true;
      updateData.current = false;
    }
    
    const alertRef = doc(db, 'sosAlerts', alertId);
    await updateDoc(alertRef, updateData);
    
    return true;
  } catch (error) {
    console.error('Error updating SOS alert status:', error);
    return false;
  }
};

/**
 * Get active SOS alert 
 * @returns {Promise<Object|null>} - Active SOS alert or null
 */
export const getActiveSOSAlert = async () => {
  try {
    const sosQuery = query(
      collection(db, 'sosAlerts'),
      where('current', '==', true)
    );
    
    const sosSnapshot = await getDocs(sosQuery);
    if (sosSnapshot.empty) return null;
    
    // Get the most recent one if there are multiple
    let mostRecent = null;
    let mostRecentTimestamp = 0;
    
    sosSnapshot.forEach(doc => {
      const data = doc.data();
      const timestamp = data.createdAt?.toMillis() || 0;
      
      if (timestamp > mostRecentTimestamp) {
        mostRecent = {
          id: doc.id,
          ...data
        };
        mostRecentTimestamp = timestamp;
      }
    });
    
    return mostRecent;
  } catch (error) {
    console.error('Error fetching active SOS alert:', error);
    return null;
  }
};