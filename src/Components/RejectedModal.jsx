// import React, { useState } from 'react';
// import { getFirestore, doc, updateDoc } from 'firebase/firestore';
// import { getApp } from 'firebase/app';

// const RejectionModal = ({ isOpen, onClose, helper, onConfirm }) => {
//   const [selectedReason, setSelectedReason] = useState('');
//   const [comment, setComment] = useState('');
//   const db = getFirestore(getApp());

//   if (!isOpen) return null;

//   const reasons = [
//     'Invalid Documentation',
//     'Incomplete Information',
//     'Image not found',
//     'Background Check Failed',
//     'Invalid Contact Details',
//     'Previous Violations',
//     'Other'
//   ];

//   const handleSubmit = async () => {
//     if (!selectedReason) {
//       return;
//     }

//     try {
//       const helperRef = doc(db, "helpers", helper.id);
      
//       // Create the rejection reason object
//       const rejectionReason = {
//         name: selectedReason,
//         reason: comment || ''
//       };

//       // Update the helper document
//       await updateDoc(helperRef, {
//         status: 'rejected',
//         ticketId: '',
//         rejectedReason: helper.rejectedReason 
//           ? [...helper.rejectedReason, rejectionReason]
//           : [rejectionReason]
//       });

//       onConfirm();
//       onClose();
//     } catch (error) {
//       console.error("Error updating rejection reason:", error);
//     }
//   };

//   const handleOverlayClick = (e) => {
//     if (e.target === e.currentTarget) {
//       onClose();
//     }
//   };

//   return (
//     <div 
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//       onClick={handleOverlayClick}
//     >
//       <div className="bg-white rounded-lg p-6 w-96 max-w-md" onClick={e => e.stopPropagation()}>
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold">Reason for Rejecting</h2>
//           <button 
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Select Reason
//           </label>
//           <select
//             value={selectedReason}
//             onChange={(e) => setSelectedReason(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">Select ---</option>
//             {reasons.map((reason) => (
//               <option key={reason} value={reason}>
//                 {reason}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Comment (optional)
//           </label>
//           <textarea
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
//             placeholder="Enter additional details about the rejection reason..."
//           />
//         </div>

//         <div className="flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
//           >
//             Clear all
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={!selectedReason}
//             className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
//               selectedReason 
//                 ? 'bg-black hover:bg-gray-800' 
//                 : 'bg-gray-300 cursor-not-allowed'
//             }`}
//           >
//             Submit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RejectionModal;
import React, { useState } from 'react';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { toast } from 'react-toastify';

const RejectionModal = ({ isOpen, onClose, helper, onConfirm }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [comment, setComment] = useState('');
  const db = getFirestore(getApp());

  if (!isOpen) return null;

  const reasons = [
    'Invalid Documentation',
    'Incomplete Information',
    'Image not found',
    'Background Check Failed',
    'Invalid Contact Details',
    'Previous Violations',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedReason) {
      return;
    }

    try {
      const helperRef = doc(db, "helpers", helper.id);
      
      const rejectionReason = {
        name: selectedReason,
        reason: comment || ''
      };

      await updateDoc(helperRef, {
        status: 'rejected',
        ticketId: '',
        rejectedReason: helper.rejectedReason 
          ? [...helper.rejectedReason, rejectionReason]
          : [rejectionReason]
      });

      onConfirm();
      onClose();
    } catch (error) {
      console.error("Error updating rejection reason:", error);
    }
  };

  const handleClearAll = () => {
    setSelectedReason('');
    setComment('');
  };
  const handleOverlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleModalClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleInputClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
    onClick={handleOverlayClick}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
    >
      <div className="bg-white rounded-2xl w-[400px]" 
      onClick={handleModalClick}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-6 border-b">
            <span></span>
          <h2 className="text-xl font-semibold" style={{color:'#030712', fontSize:18}}>Reason for Rejecting</h2>
          <button 
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="#98A2B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="#98A2B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Select Reason
            </label>
            <div className="relative">
              <select
              
                value={selectedReason}
                onChange={(e) => {
                    e.stopPropagation();
                    setSelectedReason(e.target.value);
                  }}
                  onClick={handleInputClick}
                // onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg appearance-none text-gray-500"
              >
                <option value="">Select ---</option>
                {reasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                {/* <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                </svg> */}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Comment <span className="text-gray-500">(optional)</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => {
                e.stopPropagation();
                setComment(e.target.value);
              }}
              onClick={handleInputClick}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg resize-none h-32"
              placeholder="Enter your comment here..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
          <button
             onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedReason('');
                setComment('');
              }}
            className="text-gray-600 underline text-sm font-medium hover:text-gray-800"
          >
            Clear all
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedReason}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium ${
              selectedReason 
                ? 'bg-black text-white hover:bg-gray-800' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectionModal;