import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { CSVLink } from 'react-csv';
import SingleDatePicker from '../SingleDatePickerForBooking';
import {getFirestore, collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import {  getApp } from 'firebase/app';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { getAllStaffUsers } from '../../firebase/services/UserService';


const StaffExportModal = ({ onClose }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [users, setUsers] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const modalRef = useRef(null);
  const db = getFirestore(getApp());

  // Helper function to get role display
  const getRoleDisplay = (roles) => {
    if (!roles) return "No Role Assigned";
    const roleMap = {
      admin: "Admin",
      booking: "Booking Manager",
      constructionUpdate: "Construction Update",
      documents: "Legal Documents"
    };
    
    const activeRoles = Object.entries(roles)
      .filter(([key, value]) => value === true && roleMap[key])
      .map(([key]) => roleMap[key]);
    
    return activeRoles.length > 0 ? activeRoles.join(' | ') : "No Role Assigned";
  };

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const staffUsers = await getAllStaffUsers();
        
        // Sort users by addedAt timestamp, most recent first
        const sortedUsers = staffUsers.sort((a, b) => {
          return b.addedAt?.toDate?.() - a.addedAt?.toDate?.() || 0;
        });

        setUsers(sortedUsers);
      } catch (error) {
        console.error("Error fetching staff users:", error);
        toast.error("Failed to fetch staff users");
      }
    };

    fetchUsers();
  }, []);

  const getHeaders = () => {
    return [
      { label: 'First Name', key: 'firstName' },
      { label: 'Last Name', key: 'lastName' },
      { label: 'Employee ID', key: 'employeeId' },
      { label: 'Phone Number', key: 'phoneNumber' },
      { label: 'Email', key: 'email' },
      { label: 'Roles', key: 'rolesDisplay' },
      { label: 'Added At', key: 'addedAt' }
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
    const filteredData = users.filter(user => {
      const addedAt = user.addedAt?.toDate() || new Date(0);
      return addedAt >= fromDateObj && addedAt <= toDateObj;
    });

    const formattedData = filteredData.map(user => ({
      firstName: user.firstName || 'N/A',
      lastName: user.lastName || 'N/A',
      employeeId: user.employeeId || 'N/A',
      phoneNumber: user.phoneNumber || 'N/A',
      email: user.email || 'N/A',
      rolesDisplay: getRoleDisplay(user.roles),
      addedAt: user.addedAt 
        ? dayjs(user.addedAt.toDate()).format('D MMM, YYYY hh:mm A') 
        : 'N/A'
    }));

    console.log('Formatted Export Data:', formattedData);

    // If no data, show a toast
    if (formattedData.length === 0) {
      toast.info("No staff members found in the selected date range");
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
    return `staff_members_${formattedFromDate}_to_${formattedToDate}.csv`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" style={{fontFamily: "Plus_Jakarta"}}>
      <div ref={modalRef} className="bg-white rounded-2xl shadow-xl w-[428px] relative" style={{fontFamily: "Plus_Jakarta"}}>
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <div className="flex-grow text-center text-gray-900 text-lg font-semibold leading-7">
            Export Staff Members
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
            data={users}
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

export default StaffExportModal;