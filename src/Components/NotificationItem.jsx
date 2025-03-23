import React from 'react';

const NotificationItem = ({ avatar, name, action, target, time, initials, backgroundColor, isRead }) => {
  return (
    <div className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${isRead ? '' : 'bg-blue-50'}`}>
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
      {!isRead && (
        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
      )}
    </div>
  );
};

export default NotificationItem;