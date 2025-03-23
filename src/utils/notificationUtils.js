// src/utils/notificationUtils.js
import axios from 'axios';

const API_BASE_URL = 'https://puri-dashboard-server.onrender.com';

/**
 * Send notification to all users
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {Object} additionalData - Additional data to include in the notification
 * @returns {Promise<Object>} - Response from the notification service
 */
export const sendNotificationToAllUsers = async (title, body, additionalData = {}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/send-notification`, {
      title,
      body,
      additionalData
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Notification sending result:', response.data);
    
    if (response.data.failureCount > 0) {
      console.warn(`Failed to send ${response.data.failureCount} notifications`);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error sending notification:', error);
    if (error.response) {
      console.error('Server responded with error:', error.response.data);
      // Don't throw to avoid breaking UI flows
    } else if (error.request) {
      console.error('No response received from notification server');
    } else {
      console.error(`Error setting up notification request: ${error.message}`);
    }
    return { success: false, error: error.message };
  }
};

/**
 * Send notification to a specific user by phone number
 * @param {string} phoneNumber - User's phone number
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {Object} additionalData - Additional data to include in the notification
 * @returns {Promise<Object>} - Response from the notification service
 */
export const sendNotificationToUser = async (phoneNumber, title, body, additionalData = {}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/send-user-notification`, {
      phoneNumber,
      title,
      body,
      additionalData
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Notification sent to user ${phoneNumber}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error sending notification to user ${phoneNumber}:`, error);
    if (error.response) {
      console.error('Server responded with error:', error.response.data);
      // Don't throw to avoid breaking UI flows
    } else if (error.request) {
      console.error('No response received from notification server');
    } else {
      console.error(`Error setting up notification request: ${error.message}`);
    }
    return { success: false, error: error.message };
  }
};

/**
 * Send notification to users with specific role or topic
 * @param {string} topic - Topic to send to (e.g., 'admin', 'security', etc.)
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {Object} additionalData - Additional data to include in the notification
 * @returns {Promise<Object>} - Response from the notification service
 */
export const sendNotificationToTopic = async (topic, title, body, additionalData = {}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/send-notification`, {
      title,
      body,
      topic,
      additionalData
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Notification sent to topic ${topic}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error sending notification to topic ${topic}:`, error);
    if (error.response) {
      console.error('Server responded with error:', error.response.data);
    } else if (error.request) {
      console.error('No response received from notification server');
    } else {
      console.error(`Error setting up notification request: ${error.message}`);
    }
    return { success: false, error: error.message };
  }
};