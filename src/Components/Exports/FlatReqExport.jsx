import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { CSVLink } from 'react-csv';
import SingleDatePicker from '../SingleDatePickerForBooking';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from "../../firebase/firebase";
import dayjs from 'dayjs';

const FlatRequestExportModal = ({ onClose }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [requests, setRequests] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const modalRef = useRef(null);

  useEffect(() => {
    // Fetch flat requests data
    const requestsRef = collection(db, 'flatRequests');
    const requestsUnsubscribe = onSnapshot(query(requestsRef), (snapshot) => {
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRequests(requestsData);
    });

    // Fetch user details
    const usersRef = collection(db, 'authorizedUsers');
    const usersUnsubscribe = onSnapshot(query(usersRef), (snapshot) => {
      const users = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.phoneNumber) {
          users[data.phoneNumber] = {
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || ''
          };
        }
      });
      setUserDetails(users);
    });

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      requestsUnsubscribe();
      usersUnsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleFromDateSelect = (date) => {
    setFromDate(date);
    setShowFromCalendar(false);
  };

  const handleToDateSelect = (date) => {
    setToDate(date);
    setShowToCalendar(false);
  };

  const handleClearAll = () => {
    setFromDate('');
    setToDate('');
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    return phone.startsWith('+91') ? phone.slice(3) : phone;
  };

  const exportToCSV = () => {
    const headers = [
      { label: 'Name', key: 'name' },
      { label: 'Phone Number', key: 'phoneNumber' },
      { label: 'Email', key: 'email' },
      { label: 'Wing', key: 'wing' },
      { label: 'Flat Number', key: 'flatNumber' },
      { label: 'Flat ID', key: 'flatId' },
      { label: 'Residence Type', key: 'residenceType' },
      { label: 'Relationship', key: 'relationship' },
      { label: 'Status', key: 'status' },
      { label: 'Created At', key: 'createdAt' },
      { label: 'Profile Image URL', key: 'profileImageUrl' },
      { label: 'Front Document URL', key: 'frontDocUrl' },
      { label: 'Back Document URL', key: 'backDocUrl' }
    ];

    const from = fromDate ? new Date(fromDate) : new Date(0);
    const to = toDate ? new Date(toDate) : new Date();

    const filteredRequests = requests.filter(request => {
      const requestDate = request.createdAt?.toDate();
      return requestDate >= from && requestDate <= to;
    });

    const csvData = filteredRequests.map(request => {
      const user = userDetails[request.phoneNumber] || {};
      return {
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A',
        phoneNumber: formatPhoneNumber(request.phoneNumber),
        email: user.email || 'N/A',
        wing: request.wing || 'N/A',
        flatNumber: request.flatNumber || 'N/A',
        flatId: request.flatId || 'N/A',
        residenceType: request.residenceType || 'N/A',
        relationship: request.relationship || 'N/A',
        status: request.status || 'N/A',
        createdAt: request.createdAt ? dayjs(request.createdAt.toDate()).format('D MMM, YYYY HH:mm:ss') : 'N/A',
        profileImageUrl: request.profileImageUrl || 'N/A',
        frontDocUrl: request.documents?.front || 'N/A',
        backDocUrl: request.documents?.back || 'N/A'
      };
    });

    return { headers, data: csvData };
  };

  const { headers, data } = exportToCSV();

  const handleExport = () => {
    setTimeout(onClose, 100);
  };

  const generateFileName = () => {
    const formattedFromDate = fromDate ? new Date(fromDate).toLocaleDateString('en-GB').replace(/\//g, '-') : 'all';
    const formattedToDate = toDate ? new Date(toDate).toLocaleDateString('en-GB').replace(/\//g, '-') : 'all';
    return `flat_requests_${formattedFromDate}_to_${formattedToDate}.csv`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" style={{fontFamily: "Plus_Jakarta"}}>
      <div ref={modalRef} className="bg-white rounded-2xl shadow-xl w-[428px] relative" style={{fontFamily: "Plus_Jakarta"}}>
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <div className="flex-grow text-center text-gray-900 text-lg font-semibold leading-7">Export Flat Requests</div>
          <button className="text-gray-900" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Date Selection */}
        <div className="px-6 py-5">
          <div className="flex justify-between gap-4">
            <div className="flex flex-col flex-1 relative">
              <label className="text-gray-900 text-sm font-medium mb-2">From</label>
              <input
                type="text"
                placeholder="DD/MM/YYYY"
                className="p-2.5 border border-gray-200 rounded-lg text-gray-500 text-sm w-full cursor-pointer"
                value={fromDate}
                onClick={() => {
                  setShowFromCalendar(!showFromCalendar);
                  setShowToCalendar(false);
                }}
                readOnly
              />
              {showFromCalendar && (
                <div className="absolute top-0 left-[calc(100%+1rem)] bg-white shadow-lg rounded-lg z-10">
                  <SingleDatePicker onDateSelect={handleFromDateSelect} />
                </div>
              )}
            </div>
            <div className="flex flex-col flex-1 relative">
              <label className="text-gray-900 text-sm font-medium mb-2">To</label>
              <input
                type="text"
                placeholder="DD/MM/YYYY"
                className="p-2.5 border border-gray-200 rounded-lg text-gray-500 text-sm w-full cursor-pointer"
                value={toDate}
                onClick={() => {
                  setShowToCalendar(!showToCalendar);
                  setShowFromCalendar(false);
                }}
                readOnly
              />
              {showToCalendar && (
                <div className="absolute top-0 left-[calc(100%+1rem)] bg-white shadow-lg rounded-lg z-10">
                  <SingleDatePicker onDateSelect={handleToDateSelect} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-6 border-t border-gray-100">
          <button 
            className="text-gray-900 text-sm font-medium underline"
            onClick={handleClearAll}
          >
            Clear all
          </button>
          <CSVLink
            data={data}
            headers={headers}
            filename={generateFileName()}
            className="bg-gray-900 text-white px-5 py-3 rounded-lg text-sm font-medium"
            onClick={handleExport}
          >
            Export
          </CSVLink>
        </div>
      </div>
    </div>
  );
};

export default FlatRequestExportModal;