import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import NotificationSidebar from './NotificationSidebar';
import FCMTokenDisplay from './FcmTokenDisplay';
import { fcmService } from '../services/fcmServices';

// Example Dashboard component
const Dashboard = () => {
  const [isNotificationSidebarOpen, setIsNotificationSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  

  // Add this in your Dashboard component
useEffect(() => {
    // Debug FCM
    const debugHandler = (payload) => {
      console.log('FCM Debug: Received notification payload:', payload);
      
      // Manually create a notification
      new Notification(payload.notification?.title || 'Default Title', {
        body: payload.notification?.body || 'Default Body',
        icon: '/logo192.png'
      });
    };
    
    // Register the debug handler
    const unregister = fcmService.registerNotificationHandler(debugHandler);
    
    return () => {
      unregister();
    };
  }, []);
  
  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const count = await fcmService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };
  
  useEffect(() => {
    // Fetch initial unread count
    fetchUnreadCount();
    
    // Register notification handler to update unread count
    const unregister = fcmService.registerNotificationHandler(() => {
      fetchUnreadCount();
    });
    
    // Set up interval to refresh unread count
    const interval = setInterval(fetchUnreadCount, 60000); // Every minute
    
    // Cleanup
    return () => {
      unregister();
      clearInterval(interval);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            
            <div className="flex items-center">
              {/* Notification Bell */}
              <button 
                onClick={() => setIsNotificationSidebarOpen(true)}
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 relative"
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1 -translate-y-1">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* FCM Token Display (in development mode only) */}
          {process.env.NODE_ENV === 'development' && (
            <FCMTokenDisplay />
          )}
          
          {/* Dashboard Content */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Welcome to the Dashboard</h2>
            <p className="text-gray-600">
              This dashboard is now ready to receive notifications from your React Native app.
              All notifications sent to this dashboard will appear in the notification sidebar.
            </p>
          </div>
        </div>
      </main>
      
      {/* Notification Sidebar */}
      <NotificationSidebar 
        isOpen={isNotificationSidebarOpen}
        onClose={() => setIsNotificationSidebarOpen(false)}
      />
    </div>
  );
};

export default Dashboard;