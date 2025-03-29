// import React from 'react';

// const PersonalInfoForm = ({ userInfo }) => {

//   console.log("Userinfo: ", userInfo);
  
  
//   const defaultText = 'N/A';
//   const getFlatDisplay = (userInfo) => {
//     if (!userInfo) return defaultText;
    
//     // Check for flats.approved array first
//     if (userInfo.flats?.approved && Array.isArray(userInfo.flats.approved) && userInfo.flats.approved.length > 0) {
//       const flat = userInfo.flats.approved[0]; // Display first approved flat
//       return `${flat.wing || ''} - ${flat.flatNumber || ''}`;
//     }
    
//     // Fallback to wing and flatNumber directly on userInfo
//     if (userInfo.wing && userInfo.flatNumber) {
//       return `${userInfo.wing} - ${userInfo.flatNumber}`;
//     }
    
//     return defaultText;
//   };

//   return (
//     <div className="bg-white rounded-xl border shadow-sm p-5 " >
//       <div className="space-y-4 ml-2 justify-center">
//         <div className="grid grid-cols-2 gap-5">
//           <div>
//             <label style={{fontSize:'12px',color:'#6B7280', border:'none'}} className="block text-sm font-medium text-gray-500 mb-0">First Name</label>
//             <input style={{fontSize: "16px",color:'#030712', fontWeight:'500',border:'none', textAlign:'left'}} type="text" value={userInfo?.firstName || defaultText} readOnly className="w-full ml-[-8px] border-gray-300 rounded-md text-gray-900 text-base" />
//           </div>
//           <div>
//             <label style={{fontSize:'12px',color:'#6B7280'}} className="block text-sm font-medium text-gray-500 mb-0">Last Name</label>
//             <input style={{fontSize: "16px",color:'#030712', fontWeight:'500',border:'none',}} type="text" value={userInfo?.lastName || defaultText} readOnly className="w-full ml-[-8px] border-gray-300 rounded-md text-gray-900 text-base" />
//           </div>
//         </div>
//         <div>
//           <label style={{fontSize:'12px',color:'#6B7280'}} className="block text-sm font-medium text-gray-500 mb-0">Email</label>
//           <input style={{fontSize: "16px",color:'#030712', fontWeight:'500',border:'none'}} type="email" value={userInfo?.email || defaultText} readOnly className="w-full ml-[-8px] border-gray-300 rounded-md text-gray-900 text-base" />
//         </div>
//         <div>
//           <label style={{fontSize:'12px',color:'#6B7280'}} className="block text-sm font-medium text-gray-500 mb-0">Phone</label>
//           <input style={{fontSize: "16px",color:'#030712', fontWeight:'500',border:'none',}} type="tel" value={userInfo?.phoneNumber || defaultText} readOnly className="w-full ml-[-8px] border-gray-300 rounded-md text-gray-900 text-base" />
//         </div>
//         <div>
//           <label style={{fontSize:'12px',color:'#6B7280'}} className="block text-sm font-medium text-gray-500 mb-0">Unit/Apartment Number</label>
//           <input 
//             style={{fontSize: "16px",color:'#030712', fontWeight:'500',border:'none',}} 
//             type="text" 
//             value={getFlatDisplay(userInfo)} 
            
//             readOnly 
//             className="w-full ml-[-8px] border-gray-300 rounded-md text-gray-900 text-base" 
//           />
//           {/* <input style={{fontSize: "16px",color:'#030712', fontWeight:'500',border:'none',}} type="text" value={userInfo ? `${userInfo.wing || ''} - ${userInfo.flatNumber || ''}` : defaultText} readOnly className="w-full ml-[-8px] border-gray-300 rounded-md text-gray-900 text-base" /> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PersonalInfoForm;
import React from 'react';

const PersonalInfoForm = ({ userInfo, feedback }) => {

  console.log("Userinfo: ", userInfo);
  
  
  const defaultText = 'N/A';
  const getFlatDisplay = (feedback) => {
    // First try to use flatId directly from feedback
    if (feedback.flatId) {
      // If flatId is in format "flat_Wing_Number" (e.g., "flat_D_102")
      const matches = feedback.flatId.match(/flat_([A-Z])_(\d+)/);
      if (matches && matches.length === 3) {
        return `${matches[1]} - ${matches[2]}`;
      }
    }
    
    // Fallback to userInfo if flatId parsing fails
    const userInfo = feedback.userInfo;
    if (!userInfo) return 'N/A';
    
    // Check for flats.approved array first
    if (userInfo.flats?.approved && Array.isArray(userInfo.flats.approved) && userInfo.flats.approved.length > 0) {
      const flat = userInfo.flats.approved[0]; // Display first approved flat
      return `${flat.wing || ''} - ${flat.flatNumber || ''}`;
    }
    
    // Fallback to wing and flatNumber directly on userInfo
    if (userInfo.wing && userInfo.flatNumber) {
      return `${userInfo.wing} - ${userInfo.flatNumber}`;
    }
    
    return 'N/A';
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-5 " >
      <div className="space-y-4 ml-2 justify-center">
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
          <input 
            style={{fontSize: "16px",color:'#030712', fontWeight:'500',border:'none',}} 
            type="text" 
            value={getFlatDisplay(feedback)} 
            
            readOnly 
            className="w-full ml-[-8px] border-gray-300 rounded-md text-gray-900 text-base" 
          />
          {/* <input style={{fontSize: "16px",color:'#030712', fontWeight:'500',border:'none',}} type="text" value={userInfo ? `${userInfo.wing || ''} - ${userInfo.flatNumber || ''}` : defaultText} readOnly className="w-full ml-[-8px] border-gray-300 rounded-md text-gray-900 text-base" /> */}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;