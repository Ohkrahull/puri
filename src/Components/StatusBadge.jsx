import { getFirestore, doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { ConfirmationDialog } from './confirmationDialog';
import RejectionModal from './RejectedModal';


// Status Badge Component
const StatusBadge = ({ status, helper }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [pendingStatus, setPendingStatus] = useState(null);
    const db = getFirestore(getApp());
  
    // Helper function for generating unique ticket ID
    const generateTicketId = async () => {
      const generateId = () => Math.floor(100000 + Math.random() * 900000).toString();
      
      const checkTicketExists = async (ticketId) => {
        const helpersRef = collection(db, 'helpers');
        const q = query(helpersRef, where('ticketId', '==', ticketId));
        const snapshot = await getDocs(q);
        return !snapshot.empty;
      };
  
      let ticketId;
      let exists = true;
      
      while (exists) {
        ticketId = generateId();
        exists = await checkTicketExists(ticketId);
      }
      
      return ticketId;
    };
  
    const getStatusStyle = () => {
      switch(status?.toLowerCase()) {
        case 'approved':
          return 'bg-green-50 text-green-700';
        case 'pending':
          return 'bg-yellow-50 text-yellow-700';
        case 'rejected':
          return 'bg-red-50 text-red-700';
        default:
          return 'bg-gray-50 text-gray-700';
      }
    };
  
    const getDotColor = () => {
      switch(status?.toLowerCase()) {
        case 'approved':
          return 'bg-green-600';
        case 'pending':
          return 'bg-yellow-600';
        case 'rejected':
          return 'bg-red-600';
        default:
          return 'bg-gray-600';
      }
    };
  
    const getAvailableStatuses = () => {
      switch(status?.toLowerCase()) {
        case 'pending':
          return ['approved', 'rejected'];
        case 'approved':
          return ['pending', 'rejected'];
        case 'rejected':
          return ['pending', 'approved'];
        default:
          return [];
      }
    };
  
    const getConfirmationMessage = (newStatus) => {
      const name = `${helper.firstName} ${helper.lastName}`;
      switch(newStatus) {
        case 'approved':
          return {
            title: 'Approve Helper',
            message: `Are you sure you want to approve ${name}? This will generate a new ticket ID.`
          };
        case 'rejected':
          return {
            title: 'Reject Helper',
            message: `Are you sure you want to reject ${name}? This will remove their ticket ID.`
          };
        case 'pending':
          return {
            title: 'Move to Pending',
            message: `Are you sure you want to move ${name} to pending status? ${
              status === 'approved' ? 'This will remove their ticket ID.' : ''
            }`
          };
        default:
          return {
            title: 'Change Status',
            message: `Are you sure you want to change the status for ${name}?`
          };
      }
    };
  
    const handleStatusClick = (e) => {
      e.stopPropagation();
      if (getAvailableStatuses().length > 0) {
        setIsOpen(!isOpen);
      }
    };
  
    // const initiateStatusChange = (newStatus) => {
    //   setIsOpen(false);
    //   setPendingStatus(newStatus);
    //   setShowConfirmation(true);
    // };
    const initiateStatusChange = (newStatus) => {
      setIsOpen(false);
      setPendingStatus(newStatus);
      
      if (newStatus === 'rejected') {
        setShowRejectionModal(true);
      } else {
        setShowConfirmation(true);
      }
    };
  
    const handleStatusChange = async (newStatus) => {
      try {
        const helperRef = doc(db, "helpers", helper.id);
        let updateData = { status: newStatus };
  
        // Handle ticketId based on status transition
        if (newStatus === 'approved') {
          if (status === 'pending' || !helper.ticketId) {
            const ticketId = await generateTicketId();
            updateData.ticketId = ticketId;
          }
        } else if (newStatus === 'pending' && status === 'approved') {
          updateData.ticketId = '';
        } else if (newStatus === 'rejected') {
          updateData.ticketId = '';
        }
  
        await updateDoc(helperRef, updateData);
        toast.success(`Status updated to ${newStatus}`);
        
        if (updateData.ticketId) {
          toast.success(`New ticket ID generated: ${updateData.ticketId}`);
        }
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error("Failed to update status");
      }
      setShowConfirmation(false);
    };
  
    return (
      <>
        <div className="relative">
          <div 
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full w-fit ${getStatusStyle()} cursor-pointer`}
            onClick={handleStatusClick}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${getDotColor()}`} />
            <span className="text-sm font-medium">
              {status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase()}
            </span>
            {getAvailableStatuses().length > 0 && (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={`transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            )}
          </div>
          
          {isOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1 min-w-[100px]"
            onClick={(e) => e.stopPropagation()} // Stop event bubbling
            >
              {getAvailableStatuses().map((newStatus) => (
                <div
                  key={newStatus}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm capitalize"
                  onClick={() => initiateStatusChange(newStatus)}
                >
                  {newStatus}
                </div>
              ))}
            </div>
          )}
        </div>
  
        {showConfirmation && pendingStatus && (
          <ConfirmationDialog
            isOpen={showConfirmation}
            onClose={() => setShowConfirmation(false)}
            onConfirm={() => handleStatusChange(pendingStatus)}
            {...getConfirmationMessage(pendingStatus)}
          />
        )}

{showRejectionModal && (
        <RejectionModal
          isOpen={showRejectionModal}
          onClose={() => setShowRejectionModal(false)}
          helper={helper}
          onConfirm={() => {
            toast.success('Helper rejected successfully');
            setShowRejectionModal(false);
          }}
        />
      )}
      </>
    );
  };
  
  export default StatusBadge;