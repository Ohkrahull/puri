import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { CSVLink } from 'react-csv';
import SingleDatePicker from '../SingleDatePickerForBooking';
import { getFirestore,collection, query, onSnapshot, where, getDocs } from 'firebase/firestore';
import {  getApp } from 'firebase/app';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

const RentalRequestExportModal = ({ onClose }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [requests, setRequests] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const modalRef = useRef(null);
  const db = getFirestore(getApp());

  useEffect(() => {
    const rentalQuery = query(
      collection(db, 'rentalRequest'),
      where('requestType', '==', 'propertyList')
    );
    
    const unsubscribe = onSnapshot(rentalQuery, async (snapshot) => {
      console.log('Rental Requests Snapshot:', snapshot.size, 'documents');
      
      const requestsData = await Promise.all(snapshot.docs.map(async (doc) => {
        const data = doc.data();
        console.log('Rental Request Data:', data);
        
        let userDetails = { firstName: '', lastName: '' };
        
        if (data.phoneNumber) {
          console.log('Fetching user details for phone:', data.phoneNumber);
          userDetails = await fetchUserDetails(db, data.phoneNumber);
          console.log('Fetched User Details:', userDetails);
        } else {
          console.log('No phone number found for this request');
        }
        
        return {
          id: doc.id,
          ...data,
          firstName: userDetails.firstName,
          lastName: userDetails.lastName
        };
      }));
      
      console.log('Processed Requests Data:', requestsData);
      setRequests(requestsData);
    });
  
    return () => unsubscribe();
  }, []);

  const fetchUserDetails = async (db, phoneNumber) => {
    try {
      console.log('Searching for user with phone number:', phoneNumber);
      
      const userQuery = query(
        collection(db, 'authorizedUsers'),
        where('phoneNumber', '==', phoneNumber)
      );
      
      const userSnapshot = await getDocs(userQuery);
      
      console.log('User Snapshot Size:', userSnapshot.size);
      
      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        console.log('Found User Data:', userData);
        
        return {
          firstName: userData.firstName || '',
          lastName: userData.lastName || ''
        };
      }
      
      console.log('No user found for phone number:', phoneNumber);
      return { firstName: '', lastName: '' };
    } catch (error) {
      console.error('Error fetching user details:', error);
      return { firstName: '', lastName: '' };
    }
  };
  const getHeaders = () => {
    return [
      { label: 'First Name', key: 'firstName' },
      { label: 'Last Name', key: 'lastName' },
      { label: 'Ticket ID', key: 'ticketId' },
      { label: 'Phone Number', key: 'phoneNumber' },
      { label: 'Monthly Budget', key: 'monthlyBudget' },
      { label: 'Security Deposit', key: 'securityDeposit' },
      { label: 'Availability Date', key: 'availabilityDate' },
      { label: 'Profession', key: 'profession' },
      { label: 'Status', key: 'status' },
      { label: 'Additional Requests', key: 'additionalRequests' },
      { label: 'Amenities', key: 'amenities' },
      { label: 'Furnishing Type', key: 'furnishingType' },
      { label: 'Other Amenity', key: 'otherAmenity' },
      { label: 'Created At', key: 'createdAt' },
      { label: 'Callback Time', key: 'callbackTime' }
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
    const filteredData = requests.filter(request => {
      const createdAt = request.createdAt?.toDate() || new Date(0);
      return createdAt >= fromDateObj && createdAt <= toDateObj;
    });

    const formattedData = filteredData.map(request => {
      console.log('Formatting Request:', request);
      console.log('First Name:', request.firstName);
      console.log('Last Name:', request.lastName);
      return {
        firstName: request.firstName || 'N/A',
        lastName: request.lastName || 'N/A',
        ticketId: request.ticketId || 'N/A',
        phoneNumber: request.phoneNumber || 'N/A',
        monthlyBudget: request.monthlyBudget ? `₹${request.monthlyBudget}` : 'N/A',
        securityDeposit: request.securityDeposit ? `₹${request.securityDeposit}` : 'N/A',
        availabilityDate: request.availabilityDate 
          ? dayjs(request.availabilityDate.toDate()).format('D MMM, YYYY') 
          : 'N/A',
        profession: request.profession || 'N/A',
        status: request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : 'N/A',
        additionalRequests: request.additionalRequests || 'N/A',
        amenities: request.amenities ? request.amenities.join(', ') : 'N/A',
        furnishingType: request.furnishingType || 'N/A',
        otherAmenity: request.otherAmenity || 'N/A',
        createdAt: request.createdAt 
          ? dayjs(request.createdAt.toDate()).format('D MMM, YYYY hh:mm A') 
          : 'N/A',
        callbackTime: request.callbackTime 
          ? dayjs(request.callbackTime.toDate()).format('D MMM, YYYY hh:mm A') 
          : 'N/A'
      }
    });

    console.log('Formatted Export Data:', formattedData);

    // If no data, show a toast
    if (formattedData.length === 0) {
      toast.info("No rental requests found in the selected date range");
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
    return `rental_requests_${formattedFromDate}_to_${formattedToDate}.csv`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" style={{fontFamily: "Plus_Jakarta"}}>
      <div ref={modalRef} className="bg-white rounded-2xl shadow-xl w-[428px] relative" style={{fontFamily: "Plus_Jakarta"}}>
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <div className="flex-grow text-center text-gray-900 text-lg font-semibold leading-7">
            Export Rental Requests
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
            data={requests}
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

export default RentalRequestExportModal;