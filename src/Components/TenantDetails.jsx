
// import React, { useState, useEffect } from 'react';
// import { ChevronLeft } from 'lucide-react';
// import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
// import { getApp } from 'firebase/app';
// import { useAuth } from '../context/AuthContext';
// import { useParams, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import dayjs from 'dayjs';

// const TenantDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [ownerData, setOwnerData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const db = getFirestore(getApp());

//   useEffect(() => {
//     const fetchOwnerData = async () => {
//       try {
//         const docRef = doc(db, 'tenant', id);
//         const docSnap = await getDoc(docRef);
        
//         if (docSnap.exists()) {
//           const data = docSnap.data();
//           setOwnerData({
//             id: docSnap.id,
//             ...data
//           });
//         }
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching owner data:', error);
//         setLoading(false);
//       }
//     };

//     fetchOwnerData();
//   }, [id, db]);

//   const handleStatus = async (newStatus) => {
//     try {
//       const docRef = doc(db, 'tenant', id);
//       const updates = {
//         status: newStatus,
//         approvedBy: {
//           id: user.uid,
//           name: `${user.firstName} ${user.lastName}`,
//           email: user.email,
//           timestamp: new Date()
//         }
//       };

//       await updateDoc(docRef, updates);
      
//       // Update local state
//       setOwnerData(prev => ({
//         ...prev,
//         status: newStatus,
//         approvedBy: updates.approvedBy
//       }));

//       toast.success(`Status updated to ${newStatus} successfully`);
//     } catch (error) {
//       console.error('Error updating status:', error);
//       toast.error('Failed to update status');
//     }
//   };

//   if (loading) {
//     return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
//   }

//   if (!ownerData) {
//     return <div className="flex items-center justify-center min-h-screen">Owner not found</div>;
//   }

//   const getStatusButton = () => {
//     switch (ownerData.status) {
//       case 'approved':
//         return (
//           <button 
//             className="w-full py-4 bg-[#111827] text-white font-medium rounded-lg text-[16px] hover:bg-black transition-colors"
//             onClick={() => handleStatus('pending')}
//           >
//             Mark as Pending
//           </button>
//         );
//       case 'rejected':
//         return (
//           <button 
//             className="w-full py-4 bg-[#111827] text-white font-medium rounded-lg text-[16px] hover:bg-black transition-colors"
//             onClick={() => handleStatus('pending')}
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
//               onClick={() => handleStatus('approved')}
//             >
//               Approve
//             </button>
//             <button 
//               className="w-full py-4 bg-white text-[#111827] font-medium border border-[#E5E7EB] rounded-lg text-[16px] hover:bg-gray-50 transition-colors"
//               onClick={() => handleStatus('rejected')}
//             >
//               Reject
//             </button>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="p-8 ml-6">
//       {/* Back Button */}
//       <div className="mb-8 w-[80px]">
//         <div 
//           className="flex items-center gap-2 text-[#6B7280] cursor-pointer"
//           onClick={() => navigate(-1)}
//         >
//           <ChevronLeft className="h-7 w-7 bg-[#F3F4F6] p-1.5 rounded" />
//           <span className="text-base font-medium">Back</span>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-[1.8fr,0.8fr] gap-8">
//         {/* Left Side - Professional Details */}
//         <div className="bg-white rounded-[12px] p-10" style={{
//           border: '1px solid var(--Gray-100, #E5E7EB)'
//         }}>
//           <h2 className="text-[16px] text-[#121212] font-medium mb-8">Professional Details</h2>
          
//           <div className="space-y-8">
//             <div>
//               <h3 className="text-[12px] text-[#6B7280] mb-1.5">Professional Details</h3>
//               <p className="text-[16px] text-[#111827] font-medium">{ownerData.profession || 'Businessman'}</p>
//             </div>

//             <div>
//               <h3 className="text-[12px] text-[#6B7280] mb-1.5">Monthly Budget</h3>
//               <p className="text-[16px] text-[#111827] font-medium">₹ {ownerData.rentalBudget || 'N/A'}</p>
//             </div>

//             <div>
//               <h3 className="text-[12px] text-[#6B7280] mb-1.5">Move In Date</h3>
//               <p className="text-[16px] text-[#111827] font-medium">
//                 {ownerData.moveInDate ? 
//                   dayjs(ownerData.moveInDate.toDate()).format('DD-MM-YYYY') : 
//                   'N/A'}
//               </p>
//             </div>

//             {/* <div>
//               <h3 className="text-[12px] text-[#6B7280] mb-1.5">Availability Date</h3>
//               <p className="text-[16px] text-[#111827] font-medium">
//                 {ownerData.moveInDate ? 
//                   dayjs(ownerData.availabilityDate.toDate()).format('DD-MM-YYYY') : 
//                   'N/A'}
//               </p>
//             </div> */}
//             <div>
//               <h3 className="text-[12px] text-[#6B7280] mb-1.5">BHK Type</h3>
//               <p className="text-[16px] text-[#111827] font-medium"> {ownerData.bhkType || 'N/A'}</p>
//             </div>

//             <div>
//               <h3 className="text-[12px] text-[#6B7280] mb-1.5">Lease Tenure</h3>
//               <p className="text-[16px] text-[#111827] font-medium"> {ownerData.leaseTenure || 'N/A'}</p>
//             </div>

//             <div>
//               <h3 className="text-[12px] text-[#6B7280] mb-1.5">Furnishing Type</h3>
//               <p className="text-[16px] text-[#111827] font-medium">{ownerData.furnishingType || 'N/A'}</p>
//             </div>

//             <div>
//               <h3 className="text-[12px] text-[#6B7280] mb-1.5">Amenities</h3>
//               <p className="text-[16px] text-[#111827] font-medium">
//                 {ownerData.amenities || "Gym, Swimming Pool, Clubhouse, Community Garden."}
//               </p>
//             </div>

//             <div>
//               <h3 className="text-[12px] text-[#6B7280] mb-1.5">Preferred Time For Callback</h3>
//               <p className="text-[16px] text-[#111827] font-medium">{ownerData.preferredTime || "12:00pm"}</p>
//             </div>

//             <div>
//               <h3 className="text-[12px] text-[#6B7280] mb-1.5">Phone Number</h3>
//               <p className="text-[16px] text-[#111827] font-medium">{ownerData.phoneNumber || 'N/A'}</p>
//             </div>

//             <div>
//               <h3 className="text-[12px] text-[#6B7280] mb-1.5">If you have any additional requests or specific needs, please mention them here</h3>
//               <p className="text-[16px] text-[#111827]">
//                 {ownerData.additionalRequests || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1992."}
//               </p>
//             </div>

//             {/* <div>
//               <h3 className="text-[12px] text-[#6B7280] mb-1.5">Current Status</h3>
//               <div className="flex items-center gap-2">
//                 <span className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                   ownerData.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                   ownerData.status === 'approved' ? 'bg-green-100 text-green-800' :
//                   ownerData.status === 'rejected' ? 'bg-red-100 text-red-800' :
//                   'bg-gray-100 text-gray-800'
//                 }`}>
//                   <div className={`w-2 h-2 rounded-full mr-1 ${
//                     ownerData.status === 'pending' ? 'bg-yellow-500' :
//                     ownerData.status === 'approved' ? 'bg-green-500' :
//                     ownerData.status === 'rejected' ? 'bg-red-500' :
//                     'bg-gray-500'
//                   }`}></div>
//                   {ownerData.status ? ownerData.status.charAt(0).toUpperCase() + ownerData.status.slice(1) : 'N/A'}
//                 </span>
//               </div>
//             </div> */}
//           </div>
//         </div>

//         {/* Right Side - Personal Information */}
//         <div className="space-y-4">
//           <div className="bg-white rounded-[12px] p-6" style={{
//             border: '1px solid var(--Gray-100, #E5E7EB)'
//           }}>
//             <h2 className="text-[16px] text-[#121212] font-medium mb-6">Personal Information</h2>
            
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-8">
//                 <div>
//                   <label className="text-[12px] text-[#6B7280] block">First Name</label>
//                   <p className="text-[16px] text-[#111827] mt-1 font-medium">{ownerData.firstName || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <label className="text-[12px] text-[#6B7280] block">Last Name</label>
//                   <p className="text-[16px] text-[#111827] mt-1 font-medium">{ownerData.lastName || 'N/A'}</p>
//                 </div>
//               </div>

//               <div>
//                 <label className="text-[12px] text-[#6B7280] block">Email</label>
//                 <p className="text-[16px] text-[#111827] mt-1 font-medium">
//                   {ownerData.email || 'harsh.dhanmer@gmail.com'}
//                 </p>
//               </div>

//               <div>
//                 <label className="text-[12px] text-[#6B7280] block">Phone</label>
//                 <p className="text-[16px] text-[#111827] mt-1 font-medium">{ownerData.phoneNumber || 'N/A'}</p>
//               </div>

//               <div>
//                 <label className="text-[12px] text-[#6B7280] block">Unit/Apartment Number</label>
//                 <p className="text-[16px] text-[#111827] mt-1 font-medium">
//                   {ownerData.flatNumber || 'A30'}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {getStatusButton()}
//         </div>
//       </div>
//     </div>
//   );
// };


// export default TenantDetails;

import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { getFirestore, doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const RentalRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rentalData, setRentalData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(getApp());

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch rental request data
        const rentalRef = doc(db, 'rentalRequest', id);
        const rentalSnap = await getDoc(rentalRef);
        
        if (rentalSnap.exists()) {
          const data = rentalSnap.data();
          setRentalData({
            id: rentalSnap.id,
            ...data
          });

          // Fetch user data if phone number exists
          if (data.phoneNumber) {
            const userQuery = query(
              collection(db, 'authorizedUsers'),
              where('phoneNumber', '==', data.phoneNumber)
            );
            const userSnap = await getDocs(userQuery);
            if (!userSnap.empty) {
              setUserData(userSnap.docs[0].data());
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
      const docRef = doc(db, 'rentalRequest', id);
      const updates = {
        status: newStatus,
        approvedBy: {
          id: user.uid,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          timestamp: new Date()
        }
      };

      await updateDoc(docRef, updates);
      
      setRentalData(prev => ({
        ...prev,
        status: newStatus,
        approvedBy: updates.approvedBy
      }));

      toast.success(`Status updated to ${newStatus} successfully`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!rentalData) {
    return <div className="flex items-center justify-center min-h-screen">Request not found</div>;
  }

  const getStatusButton = () => {
    switch (rentalData.status) {
      case 'approved':
        return (
          <button 
            className="w-full py-4 bg-[#3571f2] text-white font-medium rounded-lg text-[16px] hover:bg-[#2356c4] transition-colors"
            onClick={() => handleStatus('pending')}
          >
            Mark as Pending
          </button>
        );
      case 'rejected':
        return (
          <button 
            className="w-full py-4 bg-[#111827] text-white font-medium rounded-lg text-[16px] hover:bg-black transition-colors"
            onClick={() => handleStatus('pending')}
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
              onClick={() => handleStatus('approved')}
            >
              Approve
            </button>
            <button 
              className="w-full py-4 bg-white text-[#111827] font-medium border border-[#E5E7EB] rounded-lg text-[16px] hover:bg-gray-50 transition-colors"
              onClick={() => handleStatus('rejected')}
            >
              Reject
            </button>
          </div>
        );
    }
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
          <span className="text-base font-medium">Back</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.8fr,0.8fr] gap-8">
        {/* Left Side - Request Details */}
        <div className="bg-white rounded-[12px] p-10" style={{
          border: '1px solid var(--Gray-100, #E5E7EB)'
        }}>
          {/* <h2 className="text-[16px] text-[#121212] font-medium mb-8">Request Details</h2> */}
          {/* <div className="space-y-8"> */}
           

          <div className="space-y-4">
          <div>
              <h3 className="text-[12px] text-[#6B7280] mb-1.5">Professional Details</h3>
              <p className="text-[14px] text-[#111827] font-medium">{rentalData.profession || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-[12px] text-[#6B7280] mb-1.5">Ticket ID</h3>
              <p className="text-[14px] text-[#111827] font-medium">{rentalData.ticketId || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-[12px] text-[#6B7280] mb-1.5">Monthly Budget</h3>
              <p className="text-[14px] text-[#111827] font-medium">₹ {rentalData.monthlyBudget || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-[12px] text-[#6B7280] mb-1.5">Move In Date</h3>
              <p className="text-[14px] text-[#111827] font-medium">
                {rentalData.moveInDate ? 
                  dayjs(rentalData.moveInDate.toDate()).format('DD MMM, YYYY') : 
                  'N/A'}
              </p>
            </div>

            <div>
              <h3 className="text-[12px] text-[#6B7280] mb-1.5">BHK Type</h3>
              <p className="text-[14px] text-[#111827] font-medium">{rentalData.bhkType || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-[12px] text-[#6B7280] mb-1.5">Lease Tenure</h3>
              <p className="text-[14px] text-[#111827] font-medium">
                {rentalData.leaseTenure ? `${Math.round(rentalData.leaseTenure)} Months` : 'N/A'}
              </p>
            </div>

            <div>
              <h3 className="text-[12px] text-[#6B7280] mb-1.5">Furnishing Type</h3>
              <p className="text-[14px] text-[#111827] font-medium">{rentalData.furnishingType || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-[12px] text-[#6B7280] mb-1.5">Amenities</h3>
              <p className="text-[14px] text-[#111827] font-medium">
                {rentalData.amenities ? rentalData.amenities.join(', ') : 'N/A'}
              </p>
            </div>

            <div>
              <h3 className="text-[12px] text-[#6B7280] mb-1.5">Other Amenity</h3>
              <p className="text-[14px] text-[#111827] font-medium">{rentalData.otherAmenity || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-[12px] text-[#6B7280] mb-1.5">Preferred Time For Callback</h3>
              <p className="text-[14px] text-[#111827] font-medium">
                {rentalData.callbackTime ? 
                  dayjs(rentalData.callbackTime.toDate()).format('DD MMM, YYYY hh:mm A') : 
                  'N/A'}
              </p>
            </div>

            <div>
              <h3 className="text-[12px] text-[#6B7280] mb-1.5">If you have any additional requests or specific needs, please mention them here</h3>
              <p className="text-[16px] text-[#111827]">{rentalData.additionalRequests || 'N/A'}</p>
            </div>

            {/* <div>
              <h3 className="text-[12px] text-[#6B7280] mb-1.5">Current Status</h3>
              <div className="flex items-center gap-2">
                <span className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  rentalData.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  rentalData.status === 'approved' ? 'bg-green-100 text-green-800' :
                  rentalData.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-1 ${
                    rentalData.status === 'pending' ? 'bg-yellow-500' :
                    rentalData.status === 'approved' ? 'bg-green-500' :
                    rentalData.status === 'rejected' ? 'bg-red-500' :
                    'bg-gray-500'
                  }`}></div>
                  {rentalData.status ? rentalData.status.charAt(0).toUpperCase() + rentalData.status.slice(1) : 'N/A'}
                </span>
              </div>
            </div> */}
          </div>
        </div>

        {/* Right Side - User Information */}
        <div className="space-y-4">
          <div className="bg-white rounded-[12px] p-6" style={{
            border: '1px solid var(--Gray-100, #E5E7EB)'
          }}>
            {/* <h2 className="text-[16px] text-[#121212] font-medium mb-6">User Information</h2> */}
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="text-[12px] text-[#6B7280] block">First Name</label>
                  <p className="text-[16px] text-[#111827] mt-1 font-medium">{userData?.firstName || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-[12px] text-[#6B7280] block">Last Name</label>
                  <p className="text-[16px] text-[#111827] mt-1 font-medium">{userData?.lastName || 'N/A'}</p>
                </div>
              </div>

              <div>
                <label className="text-[12px] text-[#6B7280] block">Email</label>
                <p className="text-[16px] text-[#111827] mt-1 font-medium">{userData?.email || 'N/A'}</p>
              </div>

              <div>
                <label className="text-[12px] text-[#6B7280] block">Phone</label>
                <p className="text-[16px] text-[#111827] mt-1 font-medium">{userData?.phoneNumber || 'N/A'}</p>
              </div>

              <div>
                <label className="text-[12px] text-[#6B7280] block">Wing</label>
                <p className="text-[16px] text-[#111827] mt-1 font-medium">{userData?.wing || 'N/A'}</p>
              </div>
            </div>
          </div>

          {getStatusButton()}
        </div>
      </div>
    </div>
  );
};

export default RentalRequestDetails;