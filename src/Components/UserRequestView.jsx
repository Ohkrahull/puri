
// // import React, { useState, useEffect } from 'react';
// // import { ChevronLeft } from 'lucide-react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import { getFirestore, doc, getDoc, updateDoc, collection, query, where, getDocs, arrayUnion, arrayRemove } from 'firebase/firestore';
// // import { getApp } from 'firebase/app';
// // import { toast } from 'react-toastify';
// // import dayjs from 'dayjs';

// // const UserRequestView = () => {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const [requestData, setRequestData] = useState(null);
// //   const [userDetails, setUserDetails] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const db = getFirestore(getApp());

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const requestRef = doc(db, 'flatRequests', id);
// //         const requestSnap = await getDoc(requestRef);
        
// //         if (requestSnap.exists()) {
// //           const data = requestSnap.data();
// //           setRequestData({
// //             id: requestSnap.id,
// //             ...data
// //           });
          
// //           if (data.phoneNumber) {
// //             const userQuery = query(
// //               collection(db, 'authorizedUsers'),
// //               where('phoneNumber', '==', data.phoneNumber)
// //             );
// //             const userSnap = await getDocs(userQuery);
// //             if (!userSnap.empty) {
// //               setUserDetails(userSnap.docs[0].data());
// //             }
// //           }
// //         }
// //         setLoading(false);
// //       } catch (error) {
// //         console.error('Error fetching data:', error);
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, [id, db]);

// //   const handleStatus = async (newStatus) => {
// //     try {
// //       // Reference to the flat request document
// //       const requestRef = doc(db, 'flatRequests', id);
      
// //       // Find the user document
// //       const userQuery = query(
// //         collection(db, 'authorizedUsers'),
// //         where('phoneNumber', '==', requestData.phoneNumber)
// //       );
// //       const userSnap = await getDocs(userQuery);

// //       if (!userSnap.empty) {
// //         const userDoc = userSnap.docs[0];
// //         const userData = userDoc.data();
// //         const userRef = doc(db, 'authorizedUsers', userDoc.id);

// //         // Prepare the flat request details
// //         const flatRequestDetails = {
// //           flatId: requestData.flatId,
// //           flatNumber: requestData.flatNumber,
// //           wing: requestData.wing
// //         };

// //         if (newStatus === 'Approved') {
// //           // Ensure flats and its sub-fields exist
// //           const currentFlats = userData.flats || {};
// //           const currentPending = currentFlats.pending || [];
// //           const currentApproved = currentFlats.approved || [];

// //           // Remove the specific flat from pending
// //           const updatedPending = currentPending.filter(
// //             flat => flat.flatId !== flatRequestDetails.flatId
// //           );

// //           // Add the flat to approved
// //           const updatedApproved = [...currentApproved, flatRequestDetails];

// //           // Update the entire flats structure
// //           await updateDoc(userRef, {
// //             flats: {
// //               ...currentFlats,
// //               pending: updatedPending,
// //               approved: updatedApproved
// //             }
// //           });

// //           // Update the flat request status
// //           await updateDoc(requestRef, {
// //             status: newStatus
// //           });
          
// //           // Update local state
// //           setRequestData(prev => ({
// //             ...prev,
// //             status: newStatus
// //           }));

// //           toast.success(`Request ${newStatus.toLowerCase()} successfully`);
// //         } else {
// //           // Handle other status changes (Rejected, Pending)
// //           await updateDoc(requestRef, {
// //             status: newStatus
// //           });
          
// //           setRequestData(prev => ({
// //             ...prev,
// //             status: newStatus
// //           }));

// //           toast.success(`Request ${newStatus.toLowerCase()} successfully`);
// //         }
// //       } else {
// //         toast.error('User not found');
// //       }
// //     } catch (error) {
// //       console.error('Error updating status:', error);
// //       toast.error('Failed to update status');
// //     }
// //   };

// //   if (loading) {
// //     return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
// //   }

// //   if (!requestData) {
// //     return <div className="flex items-center justify-center min-h-screen">Request not found</div>;
// //   }

// //   const getStatusButton = () => {
// //     const status = requestData.status ? requestData.status.toLowerCase() : '';
// //     switch (status) {
// //       case 'approved':
// //         return (
// //           <button 
// //             className="w-full py-4 bg-[#3571f2] text-white font-medium rounded-lg text-[16px] hover:bg-[#2356c4] transition-colors"
// //             onClick={() => handleStatus('Pending')}
// //           >
// //             Mark as Pending
// //           </button>
// //         );
// //       case 'rejected':
// //         return (
// //           <button 
// //             className="w-full py-4 bg-[#111827] text-white font-medium rounded-lg text-[16px] hover:bg-black transition-colors"
// //             onClick={() => handleStatus('Pending')}
// //           >
// //             Mark as Pending
// //           </button>
// //         );
// //       case 'pending':
// //       default:
// //         return (
// //           <div className="space-y-3">
// //             <button 
// //               className="w-full py-4 bg-[#111827] text-white font-medium rounded-lg text-[16px] hover:bg-black transition-colors"
// //               onClick={() => handleStatus('Approved')}
// //             >
// //               Approve
// //             </button>
// //             <button 
// //               className="w-full py-4 bg-white text-[#111827] font-medium border border-[#E5E7EB] rounded-lg text-[16px] hover:bg-gray-50 transition-colors"
// //               onClick={() => handleStatus('Rejected')}
// //             >
// //               Reject
// //             </button>
// //           </div>
// //         );
// //     }
// //   };

// //   const StatusBadge = ({ status }) => (
// //     <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
// //       <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1"></div>
// //       {status}
// //     </div>
// //   );

// //   return (
// //     <div className="p-8 ml-6">
// //       {/* Back Button */}
// //       <div className="mb-8 w-[80px]">
// //         <div 
// //           className="flex items-center gap-2 text-[#6B7280] cursor-pointer"
// //           onClick={() => navigate(-1)}
// //         >
// //           <ChevronLeft className="h-7 w-7 bg-[#F3F4F6] p-1.5 rounded" />
// //           <span className="text-[14px] font-medium">Back</span>
// //         </div>
// //       </div>

// //       <div className="grid grid-cols-1 lg:grid-cols-[1.8fr,0.8fr] gap-8">
// //         {/* Left Section - User Information */}
// //         <div className="bg-white rounded-[12px] p-10" style={{
// //           border: '1px solid var(--Gray-100, #E5E7EB)'
// //         }}>
// //           <div className="flex items-center justify-between mb-6">
// //             <h2 className="text-lg font-medium">User Information</h2>
// //             <StatusBadge status={requestData.status || 'Pending'} />
// //           </div>

// //           <div className="mb-6">
// //             <h3 className="text-[12px] text-[#6B7280] mb-2">Profile Image</h3>
// //             {requestData.profileImageUrl && (
// //               <img 
// //                 src={requestData.profileImageUrl}
// //                 alt="Profile"
// //                 className="w-24 h-24 rounded-lg object-cover"
// //               />
// //             )}
// //           </div>

// //           <div className="grid grid-cols-2 gap-x-6 gap-y-4">
// //             <div>
// //               <h3 className="text-[12px] text-[#6B7280]">Relationship</h3>
// //               <p className="text-[16px] text-[#111827] mt-1 font-medium">{requestData.relationship || 'N/A'}</p>
// //             </div>
// //             <div>
// //               <h3 className="text-[12px] text-[#6B7280]">Residence Type</h3>
// //               <p className="text-[16px] text-[#111827] mt-1 font-medium">{requestData.residenceType || 'N/A'}</p>
// //             </div>
// //             <div>
// //               <h3 className="text-[12px] text-[#6B7280]">Phone</h3>
// //               <p className="text-[16px] text-[#111827] mt-1 font-medium">{requestData.phoneNumber || 'N/A'}</p>
// //             </div>
// //             <div>
// //               <h3 className="text-[12px] text-[#6B7280]">Wing</h3>
// //               <p className="text-[16px] text-[#111827] mt-1 font-medium">{requestData.wing || 'N/A'}</p>
// //             </div>
// //             <div>
// //               <h3 className="text-[12px] text-[#6B7280]">Flat Number</h3>
// //               <p className="text-[16px] text-[#111827] mt-1 font-medium">{requestData.flatNumber || 'N/A'}</p>
// //             </div>
// //           </div>

// //           <div className="mt-6">
// //             <h3 className="text-[12px] text-[#6B7280] mb-3">Documents</h3>
// //             <div className="grid grid-cols-2 gap-4">
// //               <div>
// //                 <p className="text-xs text-gray-500 mb-2">Front</p>
// //                 {requestData.documents?.front && (
// //                   <img 
// //                     src={requestData.documents.front} 
// //                     alt="Front Document" 
// //                     className="w-full h-48 object-cover rounded-lg"
// //                   />
// //                 )}
// //               </div>
// //               <div>
// //                 <p className="text-xs text-gray-500 mb-2">Back</p>
// //                 {requestData.documents?.back && (
// //                   <img 
// //                     src={requestData.documents.back} 
// //                     alt="Back Document" 
// //                     className="w-full h-48 object-cover rounded-lg"
// //                   />
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Right Section - Owner Information */}
// //         <div className="space-y-4">
// //           <div className="bg-white rounded-[12px] p-8" style={{
// //             border: '1px solid var(--Gray-100, #E5E7EB)'
// //           }}>
// //             <h2 className="text-lg font-medium mb-6">Owner Information</h2>
// //             <div className="space-y-4">
// //               <div className="grid grid-cols-2 gap-8">
// //                 <div>
// //                   <label className="text-[12px] text-[#6B7280] block">First Name</label>
// //                   <p className="text-[16px] text-[#111827] mt-1 font-medium">{requestData.ownerFirstName || 'Harsh'}</p>
// //                 </div>
// //                 <div>
// //                   <label className="text-[12px] text-[#6B7280] block">Last Name</label>
// //                   <p className="text-[16px] text-[#111827] mt-1 font-medium">{requestData.ownerLastName || 'Dhanmer'}</p>
// //                 </div>
// //               </div>
// //               <div>
// //                 <label className="text-[12px] text-[#6B7280] block">Email</label>
// //                 <p className="text-[16px] text-[#111827] mt-1 font-medium">{requestData.ownerEmail || 'harsh.dhanmer@gmail.com'}</p>
// //               </div>
// //               <div>
// //                 <label className="text-[12px] text-[#6B7280] block">Phone</label>
// //                 <p className="text-[16px] text-[#111827] mt-1 font-medium">{requestData.ownerPhone || '8097218943'}</p>
// //               </div>
// //               <div>
// //                 <label className="text-[12px] text-[#6B7280] block">Flat no.</label>
// //                 <p className="text-[16px] text-[#111827] mt-1 font-medium">{requestData.flatNumber || 'A-203'}</p>
// //               </div>
// //             </div>
// //           </div>

// //           {requestData.status && requestData.status.toLowerCase() === 'pending' && getStatusButton()}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default UserRequestView;
// import React, { useState, useEffect } from 'react';
// import { ChevronLeft } from 'lucide-react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getFirestore, doc, getDoc, updateDoc, collection, query, where, getDocs, arrayUnion, arrayRemove } from 'firebase/firestore';
// import { getApp } from 'firebase/app';
// import { toast } from 'react-toastify';
// import dayjs from 'dayjs';

// const UserRequestView = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [requestData, setRequestData] = useState(null);
//   const [userDetails, setUserDetails] = useState(null);
//   const [ownerDetails, setOwnerDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const db = getFirestore(getApp());

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const requestRef = doc(db, 'flatRequests', id);
//         const requestSnap = await getDoc(requestRef);
        
//         if (requestSnap.exists()) {
//           const data = requestSnap.data();
//           setRequestData({
//             id: requestSnap.id,
//             ...data
//           });
          
//           // Get user details from the phone number
//           if (data.phoneNumber) {
//             const userQuery = query(
//               collection(db, 'authorizedUsers'),
//               where('phoneNumber', '==', data.phoneNumber)
//             );
//             const userSnap = await getDocs(userQuery);
//             if (!userSnap.empty) {
//               setUserDetails(userSnap.docs[0].data());
//             }
//           }
          
//           // Get flat details and primary owner
//           if (data.flatId) {
//             const flatRef = doc(db, 'flats', data.flatId);
//             const flatSnap = await getDoc(flatRef);
            
//             if (flatSnap.exists()) {
//               const flatData = flatSnap.data();
              
//               // Find primary owner within the users array - strictly looking for primary_owner role
//               if (flatData.users && Array.isArray(flatData.users)) {
//                 const primaryOwner = flatData.users.find(user => 
//                   user.role === 'primary_owner'
//                 );
                
//                 if (primaryOwner && primaryOwner.userId) {
//                   // Get owner details
//                   const ownerRef = doc(db, 'authorizedUsers', primaryOwner.userId);
//                   const ownerSnap = await getDoc(ownerRef);
                  
//                   if (ownerSnap.exists()) {
//                     setOwnerDetails(ownerSnap.data());
//                   }
//                 }
//               }
//             }
//           }
//         }
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id, db]);

//   const handleStatus = async (newStatus) => {
//     try {
//       // Reference to the flat request document
//       const requestRef = doc(db, 'flatRequests', id);
      
//       // Find the user document
//       const userQuery = query(
//         collection(db, 'authorizedUsers'),
//         where('phoneNumber', '==', requestData.phoneNumber)
//       );
//       const userSnap = await getDocs(userQuery);

//       if (!userSnap.empty) {
//         const userDoc = userSnap.docs[0];
//         const userData = userDoc.data();
//         const userRef = doc(db, 'authorizedUsers', userDoc.id);

//         // Prepare the flat request details
//         const flatRequestDetails = {
//           flatId: requestData.flatId,
//           flatNumber: requestData.flatNumber,
//           wing: requestData.wing
//         };

//         if (newStatus === 'Approved') {
//           // Ensure flats and its sub-fields exist
//           const currentFlats = userData.flats || {};
//           const currentPending = currentFlats.pending || [];
//           const currentApproved = currentFlats.approved || [];

//           // Remove the specific flat from pending
//           const updatedPending = currentPending.filter(
//             flat => flat.flatId !== flatRequestDetails.flatId
//           );

//           // Add the flat to approved
//           const updatedApproved = [...currentApproved, flatRequestDetails];

//           // Update the entire flats structure
//           await updateDoc(userRef, {
//             flats: {
//               ...currentFlats,
//               pending: updatedPending,
//               approved: updatedApproved
//             }
//           });

//           // Update the flat request status
//           await updateDoc(requestRef, {
//             status: newStatus
//           });
          
//           // Update local state
//           setRequestData(prev => ({
//             ...prev,
//             status: newStatus
//           }));

//           toast.success(`Request ${newStatus.toLowerCase()} successfully`);
//         } else {
//           // Handle other status changes (Rejected, Pending)
//           await updateDoc(requestRef, {
//             status: newStatus
//           });
          
//           setRequestData(prev => ({
//             ...prev,
//             status: newStatus
//           }));

//           toast.success(`Request ${newStatus.toLowerCase()} successfully`);
//         }
//       } else {
//         toast.error('User not found');
//       }
//     } catch (error) {
//       console.error('Error updating status:', error);
//       toast.error('Failed to update status');
//     }
//   };

//   if (loading) {
//     return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
//   }

//   if (!requestData) {
//     return <div className="flex items-center justify-center min-h-screen">Request not found</div>;
//   }

//   const getStatusButton = () => {
//     const status = requestData.status ? requestData.status.toLowerCase() : '';
//     switch (status) {
//       case 'approved':
//         return (
//           <button 
//             className="w-full py-4 bg-[#3571f2] text-white font-medium rounded-lg text-[16px] hover:bg-[#2356c4] transition-colors"
//             onClick={() => handleStatus('Pending')}
//           >
//             Mark as Pending
//           </button>
//         );
//       case 'rejected':
//         return (
//           <button 
//             className="w-full py-4 bg-[#111827] text-white font-medium rounded-lg text-[16px] hover:bg-black transition-colors"
//             onClick={() => handleStatus('Pending')}
//           >
//             Mark as Pending
//           </button>
//         );
//       case 'pending':
//       default:
//         return (
//           <div className="space-y-3">
//             <button 
//               className="w-full py-4 bg-[#111827] text-white font-medium rounded-lg text-[16px] hover:bg-black transition-colors"
//               onClick={() => handleStatus('Approved')}
//             >
//               Approve
//             </button>
//             <button 
//               className="w-full py-4 bg-white text-[#111827] font-medium border border-[#E5E7EB] rounded-lg text-[16px] hover:bg-gray-50 transition-colors"
//               onClick={() => handleStatus('Rejected')}
//             >
//               Reject
//             </button>
//           </div>
//         );
//     }
//   };

//   const StatusBadge = ({ status }) => (
//     <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//       <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1"></div>
//       {status}
//     </div>
//   );

//   return (
//     <div className="p-8 ml-6">
//       {/* Back Button */}
//       <div className="mb-8 w-[80px]">
//         <div 
//           className="flex items-center gap-2 text-[#6B7280] cursor-pointer"
//           onClick={() => navigate(-1)}
//         >
//           <ChevronLeft className="h-7 w-7 bg-[#F3F4F6] p-1.5 rounded" />
//           <span className="text-[14px] font-medium">Back</span>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-[1.8fr,0.8fr] gap-8">
//         {/* Left Section - User Information */}
//         <div className="bg-white rounded-[12px] p-10" style={{
//           border: '1px solid var(--Gray-100, #E5E7EB)'
//         }}>
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-medium">User Information</h2>
//             <StatusBadge status={requestData.status || 'Pending'} />
//           </div>

//           <div className="mb-6">
//             <h3 className="text-[12px] text-[#6B7280] mb-2">Profile Image</h3>
//             {requestData.profileImageUrl && (
//               <img 
//                 src={requestData.profileImageUrl}
//                 alt="Profile"
//                 className="w-24 h-24 rounded-lg object-cover"
//               />
//             )}
//           </div>

//           <div className="grid grid-cols-2 gap-x-6 gap-y-4">
//             <div>
//               <h3 className="text-[12px] text-[#6B7280]">Relationship</h3>
//               <p className="text-[16px] text-[#111827] mt-1 font-medium">{requestData.relationship || 'N/A'}</p>
//             </div>
//             <div>
//               <h3 className="text-[12px] text-[#6B7280]">Residence Type</h3>
//               <p className="text-[16px] text-[#111827] mt-1 font-medium">{requestData.residenceType || 'N/A'}</p>
//             </div>
//             <div>
//               <h3 className="text-[12px] text-[#6B7280]">Phone</h3>
//               <p className="text-[16px] text-[#111827] mt-1 font-medium">{requestData.phoneNumber || 'N/A'}</p>
//             </div>
//             <div>
//               <h3 className="text-[12px] text-[#6B7280]">Wing</h3>
//               <p className="text-[16px] text-[#111827] mt-1 font-medium">{requestData.wing || 'N/A'}</p>
//             </div>
//             <div>
//               <h3 className="text-[12px] text-[#6B7280]">Flat Number</h3>
//               <p className="text-[16px] text-[#111827] mt-1 font-medium">{requestData.flatNumber || 'N/A'}</p>
//             </div>
//           </div>

//           <div className="mt-6">
//             <h3 className="text-[12px] text-[#6B7280] mb-3">Documents</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <p className="text-xs text-gray-500 mb-2">Front</p>
//                 {requestData.documents?.front && (
//                   <img 
//                     src={requestData.documents.front} 
//                     alt="Front Document" 
//                     className="w-full h-48 object-cover rounded-lg"
//                   />
//                 )}
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500 mb-2">Back</p>
//                 {requestData.documents?.back && (
//                   <img 
//                     src={requestData.documents.back} 
//                     alt="Back Document" 
//                     className="w-full h-48 object-cover rounded-lg"
//                   />
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Section - Owner Information */}
//         <div className="space-y-4">
//           <div className="bg-white rounded-[12px] p-8" style={{
//             border: '1px solid var(--Gray-100, #E5E7EB)'
//           }}>
//             <h2 className="text-lg font-medium mb-6">Owner Information</h2>
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-8">
//                 <div>
//                   <label className="text-[12px] text-[#6B7280] block">First Name</label>
//                   <p className="text-[16px] text-[#111827] mt-1 font-medium">{ownerDetails?.firstName || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <label className="text-[12px] text-[#6B7280] block">Last Name</label>
//                   <p className="text-[16px] text-[#111827] mt-1 font-medium">{ownerDetails?.lastName || 'N/A'}</p>
//                 </div>
//               </div>
//               <div>
//                 <label className="text-[12px] text-[#6B7280] block">Email</label>
//                 <p className="text-[16px] text-[#111827] mt-1 font-medium">{ownerDetails?.email || 'N/A'}</p>
//               </div>
//               <div>
//                 <label className="text-[12px] text-[#6B7280] block">Phone</label>
//                 <p className="text-[16px] text-[#111827] mt-1 font-medium">{ownerDetails?.phoneNumber || 'N/A'}</p>
//               </div>
//               <div>
//                 <label className="text-[12px] text-[#6B7280] block">Flat no.</label>
//                 <p className="text-[16px] text-[#111827] mt-1 font-medium">{`${requestData.wing || ''}-${requestData.flatNumber || 'N/A'}`}</p>
//               </div>
//             </div>
//           </div>

//           {requestData.status && requestData.status.toLowerCase() === 'pending' && getStatusButton()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserRequestView;

import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc, collection, query, where, getDocs, arrayUnion } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { toast } from 'react-toastify';

const UserRequestView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [requestData, setRequestData] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(getApp());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestRef = doc(db, 'flatRequests', id);
        const requestSnap = await getDoc(requestRef);
        
        if (requestSnap.exists()) {
          const data = requestSnap.data();
          setRequestData({
            id: requestSnap.id,
            ...data
          });
          
          // Get user details from the phone number
          if (data.phoneNumber) {
            const userQuery = query(
              collection(db, 'authorizedUsers'),
              where('phoneNumber', '==', data.phoneNumber)
            );
            const userSnap = await getDocs(userQuery);
            if (!userSnap.empty) {
              setUserDetails(userSnap.docs[0].data());
            }
          }
          
          // Get flat details and primary owner
          if (data.flatId) {
            const flatRef = doc(db, 'flats', data.flatId);
            const flatSnap = await getDoc(flatRef);
            
            if (flatSnap.exists()) {
              const flatData = flatSnap.data();
              
              // Find primary owner within the users array - strictly looking for primary_owner role
              if (flatData.users && Array.isArray(flatData.users)) {
                const primaryOwner = flatData.users.find(user => 
                  user.role === 'primary_owner'
                );
                
                if (primaryOwner && primaryOwner.userId) {
                  // Get owner details
                  const ownerRef = doc(db, 'authorizedUsers', primaryOwner.userId);
                  const ownerSnap = await getDoc(ownerRef);
                  
                  if (ownerSnap.exists()) {
                    setOwnerDetails(ownerSnap.data());
                  }
                }
              }
            }
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id, db]);

  const handleStatus = async (newStatus) => {
    try {
      // Reference to the flat request document
      const requestRef = doc(db, 'flatRequests', id);
      
      // Find the user document
      const userQuery = query(
        collection(db, 'authorizedUsers'),
        where('phoneNumber', '==', requestData.phoneNumber)
      );
      const userSnap = await getDocs(userQuery);

      if (!userSnap.empty) {
        const userDoc = userSnap.docs[0];
        const userData = userDoc.data();
        const userRef = doc(db, 'authorizedUsers', userDoc.id);

        // Prepare the flat request details
        const flatRequestDetails = {
          flatId: requestData.flatId,
          flatNumber: requestData.flatNumber,
          wing: requestData.wing
        };

        if (newStatus === 'Approved') {
          // 1. Update user's authorizedUsers document
          // Ensure flats and its sub-fields exist
          const currentFlats = userData.flats || {};
          const currentPending = currentFlats.pending || [];
          const currentApproved = currentFlats.approved || [];

          // Remove the specific flat from pending
          const updatedPending = currentPending.filter(
            flat => flat.flatId !== flatRequestDetails.flatId
          );

          // Add the flat to approved
          const updatedApproved = [...currentApproved, flatRequestDetails];

          // Update the entire flats structure in authorizedUsers
          await updateDoc(userRef, {
            flats: {
              ...currentFlats,
              pending: updatedPending,
              approved: updatedApproved
            }
          });
          
          // If documents exist, add them to the user's document
          if (requestData.documents) {
            await updateDoc(userRef, {
              documents: requestData.documents
            });
          }

          // 2. Update the flats document to add this user
          const flatRef = doc(db, 'flats', requestData.flatId);
          
          // Determine isResiding based on residenceType (assuming owners are residing unless specified)
          const isResiding = requestData.residenceType === 'tenant' ? false : true;
          
          // Create the new user entry for the flat
          const newUserEntry = {
            userId: requestData.phoneNumber,
            role: requestData.residenceType || 'owner', // Use residenceType as role
            isResiding: isResiding
          };
          
          // Add the user to the flat's users array
          await updateDoc(flatRef, {
            users: arrayUnion(newUserEntry),
            updatedAt: new Date()
          });

          // 3. Update the flat request status
          await updateDoc(requestRef, {
            status: newStatus
          });
          
          // Update local state
          setRequestData(prev => ({
            ...prev,
            status: newStatus
          }));

          toast.success(`Request ${newStatus.toLowerCase()} successfully`);
        } else {
          // Handle other status changes (Rejected, Pending)
          await updateDoc(requestRef, {
            status: newStatus
          });
          
          setRequestData(prev => ({
            ...prev,
            status: newStatus
          }));

          toast.success(`Request ${newStatus.toLowerCase()} successfully`);
        }
      } else {
        toast.error('User not found');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!requestData) {
    return <div className="flex items-center justify-center min-h-screen">Request not found</div>;
  }

  const getStatusButton = () => {
    const status = requestData.status ? requestData.status.toLowerCase() : '';
    switch (status) {
      case 'approved':
        return (
          <button 
            className="w-full py-4 bg-[#3571f2] text-white font-medium rounded-lg text-[16px] hover:bg-[#2356c4] transition-colors"
            onClick={() => handleStatus('Pending')}
          >
            Mark as Pending
          </button>
        );
      case 'rejected':
        return (
          <button 
            className="w-full py-4 bg-[#111827] text-white font-medium rounded-lg text-[16px] hover:bg-black transition-colors"
            onClick={() => handleStatus('Pending')}
          >
            Mark as Pending
          </button>
        );
      case 'pending':
      default:
        return (
          <div className="space-y-3">
            <button 
              className="w-full py-4 bg-[#111827] text-white font-medium rounded-lg text-[16px] hover:bg-black transition-colors"
              onClick={() => handleStatus('Approved')}
            >
              Approve
            </button>
            <button 
              className="w-full py-4 bg-white text-[#111827] font-medium border border-[#E5E7EB] rounded-lg text-[16px] hover:bg-gray-50 transition-colors"
              onClick={() => handleStatus('Rejected')}
            >
              Reject
            </button>
          </div>
        );
    }
  };

  const StatusBadge = ({ status }) => {
    let bgColor = 'bg-yellow-100';
    let textColor = 'text-yellow-800';
    let dotColor = 'bg-yellow-500';
    
    switch(status?.toLowerCase()) {
      case 'approved':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        dotColor = 'bg-green-500';
        break;
      case 'rejected':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        dotColor = 'bg-red-500';
        break;
      default:
        // Keep yellow for pending or any other status
        break;
    }
    
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${dotColor} mr-1`}></div>
        {status}
      </div>
    );
  };

  return (
    <div className="p-8 ml-6">
      {/* Back Button */}
      <div className="mb-8 w-[80px]">
        <div 
          className="flex items-center gap-2 text-[#6B7280] cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-7 w-7 bg-[#F3F4F6] p-1.5 rounded" />
          <span className="text-[14px] font-medium">Back</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.8fr,0.8fr] gap-8">
        {/* Left Section - User Information */}
        <div className="bg-white rounded-[12px] p-10" style={{
          border: '1px solid var(--Gray-100, #E5E7EB)'
        }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">User Information</h2>
            <StatusBadge status={requestData.status || 'Pending'} />
          </div>

          <div className="mb-6">
            <h3 className="text-[12px] text-[#6B7280] mb-2">Profile Image</h3>
            {requestData.profileImageUrl && (
              <img 
                src={requestData.profileImageUrl}
                alt="Profile"
                className="w-24 h-24 rounded-lg object-cover"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <h3 className="text-[12px] text-[#6B7280]">Relationship</h3>
              <p className="text-[16px] text-[#111827] mt-1 font-medium">{requestData.relationship || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-[12px] text-[#6B7280]">Residence Type</h3>
              <p className="text-[16px] text-[#111827] mt-1 font-medium">{requestData.residenceType || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-[12px] text-[#6B7280]">Phone</h3>
              <p className="text-[16px] text-[#111827] mt-1 font-medium">{requestData.phoneNumber || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-[12px] text-[#6B7280]">Wing</h3>
              <p className="text-[16px] text-[#111827] mt-1 font-medium">{requestData.wing || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-[12px] text-[#6B7280]">Flat Number</h3>
              <p className="text-[16px] text-[#111827] mt-1 font-medium">{requestData.flatNumber || 'N/A'}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-[12px] text-[#6B7280] mb-3">Documents</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-2">Front</p>
                {requestData.documents?.front && (
                  <img 
                    src={requestData.documents.front} 
                    alt="Front Document" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Back</p>
                {requestData.documents?.back && (
                  <img 
                    src={requestData.documents.back} 
                    alt="Back Document" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Owner Information */}
        <div className="space-y-4">
          <div className="bg-white rounded-[12px] p-8" style={{
            border: '1px solid var(--Gray-100, #E5E7EB)'
          }}>
            <h2 className="text-lg font-medium mb-6">Owner Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="text-[12px] text-[#6B7280] block">First Name</label>
                  <p className="text-[16px] text-[#111827] mt-1 font-medium">{ownerDetails?.firstName || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-[12px] text-[#6B7280] block">Last Name</label>
                  <p className="text-[16px] text-[#111827] mt-1 font-medium">{ownerDetails?.lastName || 'N/A'}</p>
                </div>
              </div>
              <div>
                <label className="text-[12px] text-[#6B7280] block">Email</label>
                <p className="text-[16px] text-[#111827] mt-1 font-medium">{ownerDetails?.email || 'N/A'}</p>
              </div>
              <div>
                <label className="text-[12px] text-[#6B7280] block">Phone</label>
                <p className="text-[16px] text-[#111827] mt-1 font-medium">{ownerDetails?.phoneNumber || 'N/A'}</p>
              </div>
              <div>
                <label className="text-[12px] text-[#6B7280] block">Flat no.</label>
                <p className="text-[16px] text-[#111827] mt-1 font-medium">{`${requestData.wing || ''}-${requestData.flatNumber || 'N/A'}`}</p>
              </div>
            </div>
          </div>

          {requestData.status && requestData.status.toLowerCase() === 'pending' && getStatusButton()}
        </div>
      </div>
    </div>
  );
};

export default UserRequestView;