import React from 'react';

const PersonalInfoForm = ({ userInfo }) => {
  const defaultText = 'N/A';

  return (
    <div className="bg-white rounded-xl border shadow-sm p-5 max-w-sm" >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label style={{fontSize:'12px',color:'#6B7280', border:'none'}} className="block text-sm font-medium text-gray-500 mb-0">First Name</label>
            <input style={{fontSize: "16px",color:'#030712', fontWeight:'500',border:'none', textAlign:'left'}} type="text" value={userInfo?.firstName || defaultText} readOnly className="w-full ml-[-8px] border-gray-300 rounded-md text-gray-900 text-base" />
          </div>
          <div>
            <label style={{fontSize:'12px',color:'#6B7280'}} className="block text-sm font-medium text-gray-500 mb-0">Last Name</label>
            <input style={{fontSize: "16px",color:'#030712', fontWeight:'500',border:'none',}} type="text" value={userInfo?.lastName || defaultText} readOnly className="w-full ml-[-8px] border-gray-300 rounded-md text-gray-900 text-base" />
          </div>
        </div>
        <div>
          <label style={{fontSize:'12px',color:'#6B7280'}} className="block text-sm font-medium text-gray-500 mb-0">Email</label>
          <input style={{fontSize: "16px",color:'#030712', fontWeight:'500',border:'none'}} type="email" value={userInfo?.email || defaultText} readOnly className="w-full ml-[-8px] border-gray-300 rounded-md text-gray-900 text-base" />
        </div>
        <div>
          <label style={{fontSize:'12px',color:'#6B7280'}} className="block text-sm font-medium text-gray-500 mb-0">Phone</label>
          <input style={{fontSize: "16px",color:'#030712', fontWeight:'500',border:'none',}} type="tel" value={userInfo?.phoneNumber || defaultText} readOnly className="w-full ml-[-8px] border-gray-300 rounded-md text-gray-900 text-base" />
        </div>
        <div>
          <label style={{fontSize:'12px',color:'#6B7280'}} className="block text-sm font-medium text-gray-500 mb-0">Unit/Apartment Number</label>
          <input style={{fontSize: "16px",color:'#030712', fontWeight:'500',border:'none',}} type="text" value={userInfo ? `${userInfo.wing || ''} - ${userInfo.flatNumber || ''}` : defaultText} readOnly className="w-full ml-[-8px] border-gray-300 rounded-md text-gray-900 text-base" />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;