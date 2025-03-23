
import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { getFirestore, doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { sendNotificationToUser } from '../utils/notificationUtils'; // Import the notification utility

const RentalDetailsView = () => {
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

  // const handleStatus = async (newStatus) => {
  //   try {
  //     const docRef = doc(db, 'rentalRequest', id);
  //     const updates = {
  //       status: newStatus,
  //       approvedBy: {
  //         id: user.uid,
  //         name: `${user.firstName} ${user.lastName}`,
  //         email: user.email,
  //         timestamp: new Date()
  //       }
  //     };

  //     await updateDoc(docRef, updates);
      
  //     setRentalData(prev => ({
  //       ...prev,
  //       status: newStatus,
  //       approvedBy: updates.approvedBy
  //     }));

  //     toast.success(`Status updated to ${newStatus} successfully`);
  //   } catch (error) {
  //     console.error('Error updating status:', error);
  //     toast.error('Failed to update status');
  //   }
  // };
  
  

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

      // Update the document
      await updateDoc(docRef, updates);
      
      // Update local state
      setRentalData(prev => ({
        ...prev,
        status: newStatus,
        approvedBy: updates.approvedBy
      }));

      // Prepare notification details based on status
      let notificationTitle = '';
      let notificationBody = '';
      let notificationType = 'rental_request';

      // Check if phone number exists for sending notification
      if (rentalData.phoneNumber) {
        switch (newStatus) {
          case 'approved':
            notificationTitle = "Rental Request Approved";
            notificationBody = `Your rental request has been approved. We'll contact you soon with further details.`;
            break;
          case 'rejected':
            notificationTitle = "Rental Request Rejected";
            notificationBody = `We regret to inform you that your rental request has been rejected. Please contact support for more information.`;
            break;
          case 'pending':
            notificationTitle = "Rental Request Status Updated";
            notificationBody = `Your rental request status has been changed to Pending.`;
            break;
          default:
            notificationTitle = "Rental Request Status Update";
            notificationBody = `Your rental request status has been updated to ${newStatus}.`;
        }

        // Send notification to the user
        await sendNotificationToUser(
          rentalData.phoneNumber,
          notificationTitle,
          notificationBody,
          {
            type: notificationType,
            requestId: id,
            status: newStatus
          }
        );
      }

      // Show success toast
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
          <span className="text-[14px] font-medium">Back</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.8fr,0.8fr] gap-8">
        {/* Left Side - Request Details */}
        <div className="bg-white rounded-[12px] p-10" style={{
          border: '1px solid var(--Gray-100, #E5E7EB)'
        }}>
          {/* <h2 className="text-[16px] text-[#121212] font-medium mb-8">Request Details</h2> */}
          
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
              <h3 className="text-[12px] text-[#6B7280] mb-1.5">Expected Rent Amount</h3>
              <p className="text-[14px] text-[#111827] font-medium">₹ {rentalData.monthlyBudget || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-[12px] text-[#6B7280] mb-1.5">Security Deposit</h3>
              <p className="text-[14px] text-[#111827] font-medium">₹ {rentalData.securityDeposit || 'N/A'}</p>
            </div>

            {/* <div>
              <h3 className="text-[12px] text-[#6B7280] mb-1.5">Furnishing Type</h3>
              <p className="text-[16px] text-[#111827] font-medium">₹ {rentalData.furnishingType || 'N/A'}</p>
            </div> */}

            <div>
              <h3 className="text-[12px] text-[#6B7280] mb-1.5">Availability Date</h3>
              <p className="text-[14px] text-[#111827] font-medium">
                {rentalData.availabilityDate ? 
                  dayjs(rentalData.availabilityDate.toDate()).format('DD MMM, YYYY') : 
                  'N/A'}
              </p>
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
              <h3 className="text-[12px] text-[#6B7280] mb-1.5">Other Amenities</h3>
              <p className="text-[14px] text-[#111827] font-medium">
                {rentalData.otherAmenity ? rentalData.otherAmenity: 'N/A'}
              </p>
            </div>

            <div>
              <h3 className="text-[12px] text-[#6B7280] mb-1.5">If you have any additional requests or specific needs, please mention them here</h3>
              <p className="text-[14px] text-[#111827]">{rentalData.additionalRequests || 'N/A'}</p>
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

export default RentalDetailsView;