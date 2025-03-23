import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { fcmService } from '../services/fcmServices';

const FCMTokenDisplay = () => {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchToken = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use the VAPID key from environment variables
      const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY;
      
      // Initialize FCM and get token
      const fcmToken = await fcmService.init(vapidKey);
      setToken(fcmToken);
    } catch (error) {
      console.error('Error fetching FCM token:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopyToken = () => {
    if (!token) return;
    
    navigator.clipboard.writeText(token)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(err => {
        console.error('Failed to copy token:', err);
        alert('Failed to copy token. Please try again.');
      });
  };
  
  useEffect(() => {
    fetchToken();
  }, []);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-900">Dashboard FCM Token</h2>
        <button
          onClick={fetchToken}
          disabled={isLoading}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-md"
          title="Refresh token"
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>
      
      {error ? (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm mb-2">
          <p className="font-medium">Error retrieving FCM token:</p>
          <p>{error}</p>
        </div>
      ) : null}
      
      <div className="flex items-center mb-2">
        <input
          type="text"
          value={isLoading ? "Loading token..." : token}
          readOnly
          className="block w-full p-2.5 text-sm text-gray-700 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={handleCopyToken}
          disabled={isLoading || !token}
          className={`ml-2 p-2.5 text-white ${copied ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'} rounded-md flex items-center justify-center transition-colors`}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      
      <p className="text-xs text-gray-500 mt-1">
        This token is needed in your React Native app to send notifications to this dashboard.
        Make sure to update your mobile app code with this token.
      </p>
      
      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm text-yellow-800">
          <strong>Developer Info:</strong> Use this token as the <code>dashboardFcmToken</code> in your 
          React Native notification service to send notifications to this dashboard.
        </p>
      </div>
    </div>
  );
};

export default FCMTokenDisplay;