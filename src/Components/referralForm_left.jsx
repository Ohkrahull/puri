import React from 'react';
import '../App.css';

const FeedbackForm_Left = ({ feedback }) => {
  if (!feedback) return <div>No Support data available</div>;

  return (
    <div className="flex flex-col w-full  p-6 bg-white rounded-xl border border-gray-200">
      {/* Support Information Section */}
      <div className="flex flex-col gap-4">
        <h3 className="text-gray-900 text-lg font-semibold" style={{fontSize:'16px'}}>Prospect Information</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-gray-500 mb-1 font-medium text-sm" style={{fontSize:'12px'}}>Full Name</h4>
            <p className="text-sm text-gray-900" style={{fontSize:'14px',color:'#030712', fontWeight:'500'}}>
              {feedback.referredName || 'N/A'}
            </p>
          </div>
          <div>
            {/* <h4 className="text-gray-500 mb-1 font-medium text-sm" style={{fontSize:'12px'}}>Last Name</h4> */}
            <p className="text-sm text-gray-900" style={{fontSize:'14px',color:'#030712', fontWeight:'500'}}>
              {/* {feedback.userInfo?.lastName || 'N/A'} */}
            </p>
          </div>
          <div>
            <h4 className="text-gray-500 mb-1 font-medium text-sm" style={{fontSize:'12px'}}>Email</h4>
            <p className="text-sm text-gray-900" style={{fontSize:'14px',color:'#030712', fontWeight:'500'}}>
              {feedback.referredEmail || 'N/A'}
            </p>
          </div>
          <div>
            <h4 className="text-gray-500 font-medium mb-1 text-sm" style={{fontSize:'12px'}}>Phone</h4>
            <p className="text-sm text-gray-900" style={{fontSize:'14px',color:'#030712', fontWeight:'500'}}>
              {feedback.referredPhoneNumber || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Support Comment Section */}
      <div className="mt-6">
        <h4 className="text-gray-900 font-semibold mb-1 mt-5 text-sm" style={{fontSize:'16px'}}>Preferred contact method</h4>
        <p className="text-sm mt-3 text-gray-600" style={{fontSize:'14px', fontWeight:'500'}}>
          {feedback.comments || 'Phone'}
       
        </p>
      </div>

      {/* Created At Section */}
      <div className="mt-6">
        <h4 className="text-gray-900 mb-1 font-semibold text-sm" style={{fontSize:'16px'}}>Interest in specific unit types or sizes</h4>
        <p  className="text-sm  mt-3 text-gray-500" style={{fontSize:'14px', fontWeight:'500',wordWrap: 'break-word'}}>
          {/* {feedback.createdAt ? new Date(feedback.createdAt.seconds * 1000).toLocaleString() : 'N/A'} */}
          {feedback.interests || 'N/A'}
        </p>
      </div>

      {/* Status Section */}
      <div className="mt-6">
        <h4 className="text-gray-900 font-semibold mb-1 text-sm" style={{fontSize:'16px'}}>Relationship to the Prospective Homebuyer</h4>
        <p className="text-sm mt-3 text-gray-500" style={{fontSize:'14px', fontWeight:'500'}}>
          {feedback.relationship || ' '}
        </p>
      </div>
    </div>
  );
};

export default FeedbackForm_Left;