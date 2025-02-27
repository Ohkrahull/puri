import React from 'react';
import { FirstAid } from 'phosphor-react';

const FloatingSosAlert = ({
  flatNumber,
  time,
  sentBy,
  contactDetails,
  onClick,
}) => {
  return (
    <div 
      onClick={onClick}
      style={{fontFamily:'Plus_Jakarta',}}
      className="fixed bottom-4 right-4 bg-red-50 rounded-xl overflow-hidden cursor-pointer shadow-lg z-50 w-[300px]"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{backgroundColor:'rgba(226, 55, 68, 0.3)'}}>
              <FirstAid size={12} weight="fill" color='#E23744' />
            </div>
            <span className="text-gray-900 font-semibold">Medical Emergency Alert</span>
          </div>
          <span className="text-red-500 font-medium">{time}</span>
        </div>
        <div className="h-[1px] bg-white w-full my-6"></div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Flat Number</span>
            <span className="font-medium">{flatNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Sent By</span>
            <span className="font-medium">{sentBy}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Contact Details</span>
            <span className="font-medium">{contactDetails}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingSosAlert;