// // // // src/components/NotificationBadge.js
// // // import React from 'react';
// // // import { Bell } from 'lucide-react';
// import { useNotifications } from '../context/NotificationContext';

// const { useNotifications } = require("@/context/NotificationContext");
// const { Bell } = require("phosphor-react");
// const { useEffect, useState } = require("react");

// // // const NotificationBadge = () => {
// // //   const { unreadCount, toggleSidebar } = useNotifications();
  
// // //   return (
// // //     <button
// // //       onClick={toggleSidebar}
// // //       className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
// // //       aria-label="Notifications"
// // //     >
// // //       <Bell className="h-6 w-6 text-gray-700" />
// // //       {unreadCount > 0 && (
// // //         <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
// // //           {unreadCount > 99 ? '99+' : unreadCount}
// // //         </span>
// // //       )}
// // //     </button>
// // //   );
// // // };

// // // export default NotificationBadge;
// // // src/components/NotificationBadge.js

// // // import React from 'react';
// // // // import { Bell } from 'lucide-react';
// // // import { useNotifications } from '../context/NotificationContext';
// // // import { Bell } from 'phosphor-react';

// // // const NotificationBadge = () => {
// // //   const { unreadCount, toggleSidebar } = useNotifications();
  
// // //   return (
// // //     <button
// // //       onClick={toggleSidebar}
// // //       className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
// // //       aria-label="Notifications"
// // //     >
// // //       <Bell className="h-6 w-6 text-gray-700" />
// // //       {unreadCount > 0 && (
// // //         <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
// // //           {unreadCount > 99 ? '99+' : unreadCount}
// // //         </span>
// // //       )}
// // //     </button>
// // //   );
// // // };

// // // export default NotificationBadge;
// // import React, { useEffect } from 'react';  // Add useEffect
// // import { useNotifications } from '../context/NotificationContext';
// // import { Bell } from 'phosphor-react';

// // const NotificationBadge = () => {
// //   const { unreadCount, toggleSidebar } = useNotifications();
  
// //   // Add this for debugging
// //   useEffect(() => {
// //     console.log('Current unread count:', unreadCount);
// //   }, [unreadCount]);
  
// //   return (
// //     <button
// //       onClick={toggleSidebar}
// //       className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
// //       aria-label="Notifications"
// //     >
// //       <Bell className="h-6 w-6 text-gray-700" />
// //       {unreadCount > 0 && (
// //         <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
// //           {unreadCount > 99 ? '99+' : unreadCount}
// //         </span>
// //       )}
// //     </button>
// //   );
// // };

// // export default NotificationBadge;

// import React, { useEffect } from 'react';
// import { useNotifications } from '../context/NotificationContext';
// import { Bell } from 'phosphor-react';

// const NotificationBadge = () => {
//   const { unreadCount, toggleSidebar } = useNotifications();
  
//   // Debug log
//   useEffect(() => {
//     console.log('NotificationBadge rendering with unreadCount:', unreadCount);
//   }, [unreadCount]);
  
//   return (
//     <button
//       onClick={toggleSidebar}
//       className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
//       aria-label="Notifications"
//     >
//       <Bell className="h-6 w-6 text-gray-700" />
//       {unreadCount > 0 && (
//         <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
//           {unreadCount > 99 ? '99+' : unreadCount}
//         </span>
//       )}
//     </button>
//   );
// };

// export default React.memo(NotificationBadge);

import React, { useEffect, useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell } from 'phosphor-react';

const NotificationBadge = () => {
    const { unreadCount, toggleSidebar } = useNotifications();
    
    // Debug log
    useEffect(() => {
      console.log('NotificationBadge rendering with unreadCount:', unreadCount);
    }, [unreadCount]);
    
    // Force re-render when unreadCount changes
    const [, forceUpdate] = useState({});
    useEffect(() => {
      forceUpdate({});
    }, [unreadCount]);
    
    return (
      <button
        onClick={toggleSidebar}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
    );
  };

  export default NotificationBadge;