import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { CSVLink } from 'react-csv';
import SingleDatePicker from '../SingleDatePickerForBooking';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from "../../firebase/firebase";
import dayjs from 'dayjs';

const HelperExportModal = ({ onClose }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [helpers, setHelpers] = useState([]);
  const modalRef = useRef(null);

  useEffect(() => {
    const helpersQuery = query(collection(db, 'helpers'));
    const unsubscribe = onSnapshot(helpersQuery, (snapshot) => {
      const helpersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHelpers(helpersData);
    });

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const getHeaders = () => {
    return [
      { label: 'Employee ID', key: 'employeeId' },
      { label: 'First Name', key: 'firstName' },
      { label: 'Last Name', key: 'lastName' },
      { label: 'Phone Number', key: 'phoneNumber' },
      { label: 'Services', key: 'services' },
      { label: 'Status', key: 'status' },
      { label: 'Vehicle Number', key: 'vehicleNumber' },
      { label: 'Flat Numbers', key: 'flatNumbers' },
      { label: 'Document Type', key: 'documentType' },
      { label: 'Documents', key: 'documents' },
      { label: 'At Gate', key: 'atGate' },
      { label: 'Current Status', key: 'currentStatus' },
      { label: 'Check In Date', key: 'checkInDate' },
      { label: 'Check In Time', key: 'checkInTime' },
      { label: 'Check Out Date', key: 'checkOutDate' },
      { label: 'Check Out Time', key: 'checkOutTime' },
      { label: 'Created At', key: 'createdAt' },
      { label: 'Updated At', key: 'updatedAt' }
    ];
  };

  const filterHelpers = (helpers) => {
    const from = fromDate ? new Date(fromDate) : new Date(0);
    const to = toDate ? new Date(toDate) : new Date();

    return helpers.filter(helper => {
      const helperDate = helper.createdAt?.seconds 
        ? new Date(helper.createdAt.seconds * 1000) 
        : new Date(0);
      return helperDate >= from && helperDate <= to;
    });
  };

  const formatDocuments = (documents = []) => {
    return documents.map(doc => 
      `${doc.documentName}(${doc.documentType})`
    ).join(', ');
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return dayjs(timestamp.seconds * 1000).format('DD/MM/YYYY HH:mm:ss');
  };

  const formatData = (helpers) => {
    return helpers.map(helper => ({
      employeeId: helper.employeeId || 'N/A',
      firstName: helper.firstName || 'N/A',
      lastName: helper.lastName || 'N/A',
      phoneNumber: helper.phoneNumber || helper.visitorPhoneNumber || 'N/A',
      services: helper.services?.map(service => service.name).join(', ') || 'N/A',
      status: helper.status || 'N/A',
      vehicleNumber: helper.vehicleNumber || 'N/A',
      flatNumbers: (helper.flatNumbers || []).join(', '),
      documentType: helper.documentType || 'N/A',
      documents: formatDocuments(helper.documents),
      atGate: helper.atGate ? 'Yes' : 'No',
      currentStatus: helper.current ? 'Current' : 'Past',
      checkInDate: formatDate(helper.checkInDate),
      checkInTime: formatDate(helper.checkInTime),
      checkOutDate: formatDate(helper.checkOutDate),
      checkOutTime: formatDate(helper.checkOutTime),
      createdAt: formatDate(helper.createdAt),
      updatedAt: formatDate(helper.updatedAt)
    }));
  };

  const exportToCSV = () => {
    const filteredData = filterHelpers(helpers);
    const formattedData = formatData(filteredData);
    const headers = getHeaders();

    return { headers, data: formattedData };
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

  const { headers, data } = exportToCSV();

  const handleExport = () => {
    setTimeout(onClose, 100);
  };

  const generateFileName = () => {
    const formattedFromDate = fromDate ? new Date(fromDate).toLocaleDateString('en-GB').replace(/\//g, '-') : 'all';
    const formattedToDate = toDate ? new Date(toDate).toLocaleDateString('en-GB').replace(/\//g, '-') : 'all';
    return `helpers_${formattedFromDate}_to_${formattedToDate}.csv`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" style={{fontFamily: "Plus_Jakarta"}}>
      <div ref={modalRef} className="bg-white rounded-2xl shadow-xl w-[428px] relative" style={{fontFamily: "Plus_Jakarta"}}>
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <div className="flex-grow text-center text-gray-900 text-lg font-semibold leading-7">
            Export Helper Data
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

export default HelperExportModal;