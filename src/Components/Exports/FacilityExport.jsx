import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { CSVLink } from 'react-csv';
import SingleDatePicker from '../SingleDatePickerForBooking';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from "../../firebase/firebase";
import dayjs from 'dayjs';

const AmenityFacilityExportModal = ({ onClose, type = 'amenities' }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [data, setData] = useState([]);
  const modalRef = useRef(null);

  useEffect(() => {
    // Fetch amenities/facilities data
    const collectionRef = collection(db, type);
    const unsubscribe = onSnapshot(query(collectionRef), (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setData(items);
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
  }, [type]);

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

  const exportToCSV = () => {
    const headers = [
      { label: 'Name', key: 'heading' },
      { label: 'Location', key: 'location' },
      { label: 'About', key: 'about' },
      { label: 'Start Time', key: 'startTime' },
      { label: 'End Time', key: 'endTime' },
      { label: 'Slot Duration (hours)', key: 'slotDuration' },
      { label: 'Status', key: 'status' },
      { label: 'Booking Enabled', key: 'bookingEnabled' },
      { label: 'Is Disabled', key: 'isDisabled' },
      { label: 'Images', key: 'images' },
      { label: 'Created At', key: 'createdAt' },
      { label: 'Updated At', key: 'updatedAt' }
    ];

    const from = fromDate ? new Date(fromDate) : new Date(0);
    const to = toDate ? new Date(toDate) : new Date();

    const filteredData = data.filter(item => {
      const itemDate = item.createdAt?.seconds 
        ? new Date(item.createdAt.seconds * 1000) 
        : new Date(0);
      return itemDate >= from && itemDate <= to;
    });

    const csvData = filteredData.map(item => ({
      heading: item.heading || 'N/A',
      location: item.location || 'N/A',
      about: item.about || 'N/A',
      startTime: item.timeSlots?.startTime || 'N/A',
      endTime: item.timeSlots?.endTime || 'N/A',
      slotDuration: item.timeSlots?.slotDuration || 'N/A',
      status: item.status || 'N/A',
      bookingEnabled: item.bookingEnabled ? 'Yes' : 'No',
      isDisabled: item.isDisabled ? 'Yes' : 'No',
      images: item.imageUrls?.map(img => img.url).join(', ') || 'N/A',
      createdAt: item.createdAt?.seconds 
        ? dayjs(item.createdAt.seconds * 1000).format('DD/MM/YYYY HH:mm:ss')
        : 'N/A',
      updatedAt: item.updatedAt?.seconds
        ? dayjs(item.updatedAt.seconds * 1000).format('DD/MM/YYYY HH:mm:ss')
        : 'N/A'
    }));

    return { headers, data: csvData };
  };

  const { headers, data: csvData } = exportToCSV();

  const handleExport = () => {
    setTimeout(onClose, 100);
  };

  const generateFileName = () => {
    const formattedFromDate = fromDate ? new Date(fromDate).toLocaleDateString('en-GB').replace(/\//g, '-') : 'all';
    const formattedToDate = toDate ? new Date(toDate).toLocaleDateString('en-GB').replace(/\//g, '-') : 'all';
    return `${type}_${formattedFromDate}_to_${formattedToDate}.csv`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" style={{fontFamily: "Plus_Jakarta"}}>
      <div ref={modalRef} className="bg-white rounded-2xl shadow-xl w-[428px] relative" style={{fontFamily: "Plus_Jakarta"}}>
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <div className="flex-grow text-center text-gray-900 text-lg font-semibold leading-7">
            Export {type.charAt(0).toUpperCase() + type.slice(1)}
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
            data={csvData}
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

export default AmenityFacilityExportModal;