import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { CSVLink } from 'react-csv';
import SingleDatePicker from '../SingleDatePickerForBooking';
import { getFirestore,collection, query, onSnapshot, orderBy, getDoc, doc } from 'firebase/firestore';
import {  getApp } from 'firebase/app';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

const ResidentExportModal = ({ onClose }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [residents, setResidents] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const modalRef = useRef(null);
  const db = getFirestore(getApp());

  // Helper function to format role
  const formatRole = (role) => {
    switch(role) {
      case 'primary_owner': return 'Primary Owner';
      case 'primary_tenant': return 'Primary Tenant';
      case 'owner': return 'Owner';
      case 'tenant': return 'Tenant';
      default: return role || 'N/A';
    }
  };

  // Helper function to format phone number
  const formatPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    return phone.startsWith('+91') ? phone.slice(3) : phone;
  };

  useEffect(() => {
    const fetchUserData = async (userId) => {
      try {
        const userDoc = await getDoc(doc(db, 'authorizedUsers', userId));
        if (userDoc.exists()) {
          return userDoc.data();
        }
        return null;
      } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
      }
    };

    const flatsQuery = query(
      collection(db, 'flats'),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(flatsQuery, async (snapshot) => {
      const processedResidents = [];

      for (const flatDoc of snapshot.docs) {
        const flatData = flatDoc.data();
        const flatDetails = {
          id: flatDoc.id,
          wing: flatData.wing,
          flatNumber: flatData.flatNumber,
          createdAt: flatData.createdAt
        };

        if (flatData.users && Array.isArray(flatData.users)) {
          for (const user of flatData.users) {
            const userData = await fetchUserData(user.userId);
            if (userData) {
              processedResidents.push({
                ...userData,
                ...flatDetails,
                role: user.role,
                isResiding: user.isResiding,
                userId: user.userId
              });
            }
          }
        }
      }

      // Sort by `createdAt` to ensure new entries always appear first
      processedResidents.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
 
      setResidents(processedResidents);
    });

    return () => unsubscribe();
  }, []);

  const getHeaders = () => {
    return [
      // Resident Personal Details
      { label: 'First Name', key: 'firstName' },
      { label: 'Last Name', key: 'lastName' },
      { label: 'Phone Number', key: 'phone' },
      { label: 'Email', key: 'email' },
      { label: 'Role', key: 'formattedRole' },
      { label: 'Is Residing', key: 'isResiding' },

      // Flat Details
      { label: 'Wing', key: 'wing' },
      { label: 'Flat Number', key: 'flatNumber' },

      // Additional Documents and Verification
      { label: 'Aadhaar Number', key: 'aadhaarNumber' },
      { label: 'PAN Number', key: 'panNumber' },
      { label: 'Verification Status', key: 'verificationStatus' },

      // Timestamp Details
      { label: 'Created At', key: 'createdAt' },
      { label: 'Updated At', key: 'updatedAt' }
    ];
  };

  const handleExport = () => {
    // Validate date selection
    if (!fromDate || !toDate) {
      toast.error("Please select both From and To dates");
      return;
    }

    setIsExporting(true);

    // Convert input dates to Date objects for comparison
    const fromDateObj = fromDate ? dayjs(fromDate, "D MMM, YYYY").startOf('day').toDate() : new Date(0);
    const toDateObj = toDate ? dayjs(toDate, "D MMM, YYYY").endOf('day').toDate() : new Date();

    // Filter and format data
    const filteredData = residents.filter(resident => {
      const createdAt = resident.createdAt?.toDate() || new Date(0);
      return createdAt >= fromDateObj && createdAt <= toDateObj;
    });

    const formattedData = filteredData.map(resident => ({
      firstName: resident.firstName || 'N/A',
      lastName: resident.lastName || 'N/A',
      phone: formatPhoneNumber(resident.phone),
      email: resident.email || 'N/A',
      formattedRole: formatRole(resident.role),
      isResiding: resident.isResiding ? 'Yes' : 'No',
      wing: resident.wing || 'N/A',
      flatNumber: resident.flatNumber || 'N/A',
      aadhaarNumber: resident.aadhaarNumber || 'N/A',
      panNumber: resident.panNumber || 'N/A',
      verificationStatus: resident.verificationStatus || 'N/A',
      createdAt: resident.createdAt 
        ? dayjs(resident.createdAt.toDate()).format('D MMM, YYYY hh:mm A') 
        : 'N/A',
      updatedAt: resident.updatedAt 
        ? dayjs(resident.updatedAt.toDate()).format('D MMM, YYYY hh:mm A') 
        : 'N/A'
    }));

    console.log('Formatted Export Data:', formattedData);

    // If no data, show a toast
    if (formattedData.length === 0) {
      toast.info("No residents found in the selected date range");
    }

    setIsExporting(false);

    return formattedData;
  };

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

  const generateFileName = () => {
    const formattedFromDate = fromDate ? dayjs(fromDate, "D MMM, YYYY").format('DD-MM-YYYY') : 'all';
    const formattedToDate = toDate ? dayjs(toDate, "D MMM, YYYY").format('DD-MM-YYYY') : 'all';
    return `residents_${formattedFromDate}_to_${formattedToDate}.csv`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" style={{fontFamily: "Plus_Jakarta"}}>
      <div ref={modalRef} className="bg-white rounded-2xl shadow-xl w-[428px] relative" style={{fontFamily: "Plus_Jakarta"}}>
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <div className="flex-grow text-center text-gray-900 text-lg font-semibold leading-7">
            Export Residents
          </div>
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
                <div className="absolute top-[0px] left-[20px] bg-white shadow-lg rounded-lg z-10">
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
                <div className="absolute top-[0px] right-0 bg-white shadow-lg rounded-lg z-10">
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
            data={residents}
            headers={getHeaders()}
            filename={generateFileName()}
            className={`bg-gray-900 text-white px-5 py-3 rounded-lg text-sm font-medium ${isExporting || !fromDate || !toDate ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleExport}
            disabled={isExporting || !fromDate || !toDate}
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </CSVLink>
        </div>
      </div>
    </div>
  );
};

export default ResidentExportModal;