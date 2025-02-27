import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { CSVLink } from 'react-csv';
import SingleDatePicker from '../SingleDatePickerForBooking';
import { getFirestore, collection, query, onSnapshot, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

const SupportExportModal = ({ onClose }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [supportData, setSupportData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const supportQuery = query(collection(db, 'support'));

    const unsubscribe = onSnapshot(supportQuery, async (snapshot) => {
      console.log('Support Snapshot:', snapshot.size, 'documents');

      const supportPromises = snapshot.docs.map(async (doc) => {
        const data = doc.data();
        console.log('Support Data:', data);

        let userInfo = {
          firstName: 'N/A',
          lastName: '',
          wing: '-',
          flatNumber: '-',
          userType: 'N/A'
        };

        if (data.phoneNumber) {
          console.log('Fetching user details for phone:', data.phoneNumber);
          const userQuery = query(
            collection(db, 'authorizedUsers'),
            where('phoneNumber', '==', data.phoneNumber)
          );
          const userSnapshot = await getDocs(userQuery);

          if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            userInfo = {
              firstName: userData.firstName || 'N/A',
              lastName: userData.lastName || '',
              wing: userData.wing || '-',
              flatNumber: userData.flatNumber || '-',
              userType: userData.userType || 'N/A'
            };
          }
        }

        return {
          id: doc.id,
          ...data,
          userInfo
        };
      });

      const supportList = await Promise.all(supportPromises);
      console.log('Processed Support Data:', supportList);
      setSupportData(supportList);
    });

    return () => unsubscribe();
  }, []);

  const getHeaders = () => [
    { label: 'Ticket ID', key: 'ticketId' },
    { label: 'First Name', key: 'firstName' },
    { label: 'Last Name', key: 'lastName' },
    { label: 'Wing', key: 'wing' },
    { label: 'Flat Number', key: 'flatNumber' },
    { label: 'Phone Number', key: 'phoneNumber' },
    { label: 'Category', key: 'category' },
    { label: 'Subcategory', key: 'subcategory' },
    { label: 'Comment', key: 'comment' },
    { label: 'Status', key: 'status' },
    { label: 'Employee Name', key: 'employeeName' },
    { label: 'Employee ID', key: 'employeeId' },
    { label: 'Created At', key: 'createdAt' },
    { label: 'Last Updated', key: 'updatedAt' }
  ];

  const prepareExportData = () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both From and To dates");
      return false;
    }

    setIsExporting(true);

    const fromDateObj = fromDate ? dayjs(fromDate, "D MMM, YYYY").startOf('day').toDate() : new Date(0);
    const toDateObj = toDate ? dayjs(toDate, "D MMM, YYYY").endOf('day').toDate() : new Date();

    const filteredData = supportData.filter(support => {
      const createdAt = support.createdAt?.toDate() || new Date(0);
      return createdAt >= fromDateObj && createdAt <= toDateObj;
    });

    const formattedData = filteredData.map(support => ({
      ticketId: support.ticketId || 'N/A',
      firstName: support.userInfo.firstName || 'N/A',
      lastName: support.userInfo.lastName || '',
      wing: support.userInfo.wing || '-',
      flatNumber: support.userInfo.flatNumber || '-',
      phoneNumber: support.phoneNumber || 'N/A',
      category: support.category || 'N/A',
      subcategory: support.subcategory || 'N/A',
      comment: support.comment || 'N/A',
      status: support.status ? support.status.charAt(0).toUpperCase() + support.status.slice(1) : 'N/A',
      employeeName: support.employeeName || 'Not assigned',
      employeeId: support.employeeId || 'N/A',
      createdAt: support.createdAt 
        ? dayjs(support.createdAt.toDate()).format('D MMM, YYYY hh:mm A') 
        : 'N/A',
      updatedAt: support.updatedAt 
        ? dayjs(support.updatedAt.toDate()).format('D MMM, YYYY hh:mm A') 
        : 'N/A'
    }));

    if (formattedData.length === 0) {
      toast.info("No support tickets found in the selected date range");
    }

    setExportData(formattedData);
    setIsExporting(false);
    return true;
  };

  const handleExport = (event) => {
    if (!fromDate || !toDate) {
      event.preventDefault();
      toast.error("Please select both From and To dates");
      return;
    }
    const isDataReady = prepareExportData();
    if (!isDataReady) {
      event.preventDefault();
    }
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
    setExportData([]);
  };

  const generateFileName = () => {
    const formattedFromDate = fromDate ? dayjs(fromDate, "D MMM, YYYY").format('DD-MM-YYYY') : 'all';
    const formattedToDate = toDate ? dayjs(toDate, "D MMM, YYYY").format('DD-MM-YYYY') : 'all';
    return `support_tickets_${formattedFromDate}_to_${formattedToDate}.csv`;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div ref={modalRef} className="bg-white rounded-2xl shadow-xl w-[428px] relative">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <div className="flex-grow text-center text-gray-900 text-lg font-semibold leading-7">
            Export Support Tickets
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
                <div className="absolute top-0 left-[calc(100%+16px)] bg-white shadow-lg rounded-lg z-10">
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
                <div className="absolute top-0 left-[calc(100%+16px)] bg-white shadow-lg rounded-lg z-10">
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
            data={exportData}
            headers={getHeaders()}
            filename={generateFileName()}
            className={`bg-gray-900 text-white px-5 py-3 rounded-lg text-sm font-medium ${isExporting || !fromDate || !toDate ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleExport}
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </CSVLink>
        </div>
      </div>
    </div>
  );
};

export default SupportExportModal;