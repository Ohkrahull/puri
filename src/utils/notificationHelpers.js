// src/utils/notificationHelpers.js
import { fcmService } from '../services/fcmServices';

/**
 * Creates and sends a notification for a specific event
 * @param {Object} options - Notification options
 * @param {string} options.token - FCM token of the recipient
 * @param {string} options.type - Type of notification (guest, sos, support, etc.)
 * @param {Object} options.data - Data specific to the notification type
 * @returns {Promise<Object>} - Response from notification service
 */
export const createNotification = async ({ token, type, data }) => {
  if (!token) {
    console.error('No token provided for notification');
    return null;
  }

  // Default notification details
  let title = 'Notification';
  let body = 'You have a new notification';
  let additionalData = {};

  // Configure notification based on type
  switch (type) {
    case 'guest':
      title = `${data.guestName || 'Guest'} has arrived`;
      body = `Visitor at ${data.location || 'the gate'} ${data.purpose ? `for ${data.purpose}` : ''}`;
      additionalData = {
        guestId: data.guestId,
        flatNumber: data.flatNumber,
        target: 'Guest',
      };
      break;

    case 'sos':
      title = `SOS Alert from ${data.flatNumber || 'a resident'}`;
      body = `Emergency alert raised by ${data.residentName || 'a resident'}`;
      additionalData = {
        flatNumber: data.flatNumber,
        residentPhone: data.residentPhone,
        target: 'SOS',
        priority: 'high',
      };
      break;

    case 'support':
      title = 'New Support Request';
      body = `${data.title || 'A new support request has been created'}`;
      additionalData = {
        ticketId: data.ticketId,
        priority: data.priority || 'medium',
        target: 'Support',
      };
      break;

    case 'delivery':
      title = 'Delivery Arrived';
      body = `${data.type || 'Package'} delivery for ${data.flatNumber || 'your flat'}`;
      additionalData = {
        deliveryId: data.deliveryId,
        flatNumber: data.flatNumber,
        target: 'Delivery',
      };
      break;

    case 'notice':
      title = 'New Notice';
      body = data.title || 'A new notice has been published';
      additionalData = {
        noticeId: data.noticeId,
        category: data.category || 'general',
        target: 'Notice',
      };
      break;

    default:
      // Use defaults for unknown types
      additionalData = { ...data, target: type };
  }

  try {
    return await fcmService.sendNotification({
      token,
      title,
      body,
      data: additionalData,
    });
  } catch (error) {
    console.error(`Error sending ${type} notification:`, error);
    return null;
  }
};

/**
 * Sends a notification to a specific flat
 * @param {string} flatNumber - Flat number to send notification to
 * @param {string} type - Type of notification
 * @param {Object} data - Notification data
 * @returns {Promise<Object>}
 */
export const sendFlatNotification = async (flatNumber, type, data) => {
  try {
    // This is a placeholder - in a real app, you would lookup the token for this flat
    // from your database or auth system
    const token = await getFlatToken(flatNumber);
    
    if (token) {
      return await createNotification({ token, type, data });
    }
    return null;
  } catch (error) {
    console.error(`Error sending notification to flat ${flatNumber}:`, error);
    return null;
  }
};

/**
 * Sends a notification to all admin users
 * @param {string} type - Type of notification
 * @param {Object} data - Notification data
 * @returns {Promise<Array>} Array of responses
 */
export const sendAdminNotification = async (type, data) => {
  try {
    // This is a placeholder - in a real app, you would get all admin tokens
    // from your database
    const adminTokens = await getAdminTokens();
    
    const responses = [];
    for (const token of adminTokens) {
      const response = await createNotification({ token, type, data });
      responses.push(response);
    }
    
    return responses;
  } catch (error) {
    console.error(`Error sending admin notifications:`, error);
    return [];
  }
};

// Mock functions - replace these with actual implementations in your app
const getFlatToken = async (flatNumber) => {
  // In a real app, you would query your database for this flat's FCM token
  console.log(`Getting token for flat ${flatNumber}`);
  return localStorage.getItem('fcmToken'); // For testing, use the current user's token
};

const getAdminTokens = async () => {
  // In a real app, you would query your database for all admin tokens
  console.log('Getting admin tokens');
  const token = localStorage.getItem('fcmToken');
  return token ? [token] : []; // For testing, use the current user's token
};