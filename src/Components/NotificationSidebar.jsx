// import React from 'react';
// import { X } from 'lucide-react';

// const NotificationItem = ({ avatar, name, action, target, time }) => {
//   // If avatar is a string, it's a URL. If not, show initials
//   const getInitials = (name) => {
//     return name
//       .split(' ')
//       .map(word => word[0])
//       .join('')
//       .toUpperCase();
//   };

//   return (
//     <div className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors">
//       {typeof avatar === 'string' ? (
//         <img 
//           src={avatar} 
//           alt={name} 
//           className="w-10 h-10 rounded-full object-cover"
//           onError={(e) => {
//             e.target.outerHTML = `<div class="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-medium">${getInitials(name)}</div>`;
//           }}
//         />
//       ) : (
//         <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-medium">
//           {getInitials(name)}
//         </div>
//       )}
//       <div className="flex-1 min-w-0">
//         <p className="text-sm text-gray-900">
//           <span className="font-medium">{name}</span> {action}
//           {target && <span className="font-medium"> {target}</span>}
//         </p>
//         <p className="text-xs text-gray-500 mt-1">{time}</p>
//       </div>
//     </div>
//   );
// };

// const NotificationSidebar = ({ isOpen, onClose }) => {
//   // Sample notifications data
//   const notifications = [
//     {
//       name: 'Sonal Jain',
//       action: 'has listed their flat',
//       target: 'Tower C-105 for rent',
//       time: '2 hours ago',
//       avatar: '/path/to/avatar1.jpg'
//     },
//     {
//       name: 'Harsh Dhanmer',
//       action: 'has raised a support ticket.',
//       time: '3 hours ago',
//       avatar: 'HD'
//     },
//     {
//       name: 'Ramesh Kumar',
//       action: 'has added a new helper,',
//       target: 'Anita Devi',
//       time: 'Yesterday',
//       avatar: '/path/to/avatar2.jpg'
//     },
//     {
//       name: 'Kirti Das',
//       action: 'has raised a support ticket.',
//       time: '3 hours ago',
//       avatar: 'KD'
//     },
//     {
//       name: 'Anuj Kumar',
//       action: 'has added a new helper,',
//       target: 'Madhuri Ghadge',
//       time: 'Yesterday',
//       avatar: '/path/to/avatar3.jpg'
//     },
//     {
//       name: 'Suyash Pal',
//       action: 'has added a new helper,',
//       target: 'Aarti Patel',
//       time: 'Yesterday',
//       avatar: '/path/to/avatar4.jpg'
//     }
//   ];

//   return (
//     <>
//       {/* Backdrop */}
//       {isOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-50"
//           onClick={onClose}
//         />
//       )}

//       {/* Sidebar */}
//       <div 
//         className={`fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
//           isOpen ? 'translate-x-0' : 'translate-x-full'
//         }`}
//       >
//         {/* Header */}
//         <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//           <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
//           <button 
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <X className="h-5 w-5 text-gray-500" />
//           </button>
//         </div>

//         {/* Notifications List */}
//         <div className="overflow-y-auto h-[calc(100vh-180px)]">
//           {notifications.map((notification, index) => (
//             <NotificationItem 
//               key={index}
//               {...notification}
//             />
//           ))}
//         </div>

//         {/* Footer */}
//         <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white flex justify-between">
//           <button 
//             onClick={onClose}
//             className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
//           >
//             Close
//           </button>
//           <button 
//             className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
//           >
//             <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//             Mark as all read
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default NotificationSidebar;

import React from 'react';
import { X } from 'lucide-react';

const NotificationItem = ({ avatar, name, action, target, time, initials, backgroundColor }) => {
  return (
    <div className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
      {avatar ? (
        <img 
          src={avatar} 
          alt={name} 
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
          style={{ backgroundColor: backgroundColor || '#E5E7EB' }}
        >
          {initials}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] text-gray-900 leading-snug">
          <span className="font-medium">{name}</span>{' '}
          <span className="font-normal">{action}</span>
          {target && <span className="font-medium"> {target}</span>}
        </p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
};

const NotificationSidebar = ({ isOpen, onClose }) => {
  const notifications = [
    {
      name: 'Sonal Jain',
      action: 'has listed their flat',
      target: 'Tower C-105 for rent.',
      time: '2 hours ago',
    //   avatar: '/path/to/avatar1.jpg'
    initials: 'SJ',
    },
    {
      name: 'Harsh Dhanmer',
      action: 'has raised a support ticket.',
      time: '3 hours ago',
      initials: 'HD',
      backgroundColor: '#FEE2E2' // Light red background
    },
    {
      name: 'Ramesh Kumar',
      action: 'has added a new helper,',
      target: 'Anita Devi',
      time: 'Yesterday',
      initials: 'RK',
    //   avatar: '/path/to/avatar2.jpg'
    },
    {
      name: 'Kirti Das',
      action: 'has raised a support ticket.',
      time: '3 hours ago',
      initials: 'KD',
      backgroundColor: '#E0E7FF' // Light purple background
    },
    {
      name: 'Anuj Kumar',
      action: 'has added a new helper,',
      target: 'Madhuri Ghadge',
      time: 'Yesterday',
      backgroundColor: '#FEE2E2', // Light red background,
    //   avatar: '/path/to/avatar3.jpg'
    initials: 'AK',
    },
    {
      name: 'Suyash Pal',
      action: 'has added a new helper,',
      target: 'Aarti Patel',
      time: 'Yesterday',
      initials: 'SP',
    //   avatar: '/path/to/avatar4.jpg',
    backgroundColor: '#FEE2E2' // Light red background
    }
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity z-50"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 right-0 w-[350px] bg-white transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
          {notifications.map((notification, index) => (
            <NotificationItem 
              key={index}
              {...notification}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white flex justify-between">
          <button 
            onClick={onClose}
            className="px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
          >
            Close
          </button>
          <button 
            className="px-4 py-2 text-white bg-[#3B82F6] hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M16.667 5L7.50033 14.1667L3.33366 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Mark as all read
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationSidebar;