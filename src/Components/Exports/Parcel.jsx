import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { CSVLink } from 'react-csv';
import SingleDatePicker from '../SingleDatePickerForBooking';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from "../../firebase/firebase";
import dayjs from 'dayjs';

const ParcelExportModal = ({ onClose }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [parcels, setParcels] = useState([]);
  const modalRef = useRef(null);

  useEffect(() => {
    const parcelQuery = query(collection(db, 'visitors'));
    const unsubscribe = onSnapshot(parcelQuery, (snapshot) => {
      const parcelData = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(visitor => visitor.purpose?.toLowerCase() === 'delivery');
      setParcels(parcelData);
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
      { label: 'Name', key: 'name' },
      { label: 'Phone Number', key: 'phoneNumber' },
      { label: 'Flat Number', key: 'flatNumber' },
      { label: 'Company Name', key: 'companyName' },
      { label: 'Current Status', key: 'currentStatus' },
      { label: 'Approval Status', key: 'approvalStatus' },
      { label: 'Approved By', key: 'approvedBy' },
      { label: 'Check In Date', key: 'checkInDate' },
      { label: 'Check In Time', key: 'checkInTime' },
      { label: 'Created At', key: 'createdAt' }
    ];
  };

  const filterParcels = (parcels) => {
    const from = fromDate ? new Date(fromDate) : new Date(0);
    const to = toDate ? new Date(toDate) : new Date();

    return parcels.filter(parcel => {
      const parcelDate = parcel.createdAt?.seconds 
        ? new Date(parcel.createdAt.seconds * 1000) 
        : new Date(0);
      return parcelDate >= from && parcelDate <= to;
    });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return dayjs(timestamp.seconds * 1000).format('DD/MM/YYYY HH:mm:ss');
  };

  const formatData = (parcels) => {
    return parcels.map(parcel => {
      const checkInDate = parcel.checkInDate?.seconds ? dayjs(parcel.checkInDate.seconds * 1000) : null;
      const checkInTime = parcel.checkInTime?.seconds ? dayjs(parcel.checkInTime.seconds * 1000) : null;

      return {
        name: `${parcel.firstName || ''} ${parcel.lastName || ''}`.trim() || 'N/A',
        phoneNumber: parcel.visitorPhoneNumber || 'N/A',
        flatNumber: `${parcel.wing || ''}-${parcel.flatNumber || ''}`,
        companyName: parcel.company || 'N/A',
        currentStatus: parcel.current ? 'Current' : 'Past',
        approvalStatus: parcel.status || 'N/A',
        approvedBy: parcel.approvedBy?.name || 'N/A',
        checkInDate: checkInDate ? checkInDate.format('D MMM, YYYY') : 'N/A',
        checkInTime: checkInTime ? checkInTime.format('hh:mm A') : 'N/A',
        createdAt: formatDate(parcel.createdAt)
      };
    });
  };

  const exportToCSV = () => {
    const filteredData = filterParcels(parcels);
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
    return `parcels_${formattedFromDate}_to_${formattedToDate}.csv`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" style={{fontFamily: "Plus_Jakarta"}}>
      <div ref={modalRef} className="bg-white rounded-2xl shadow-xl w-[428px] relative" style={{fontFamily: "Plus_Jakarta"}}>
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <div className="flex-grow text-center text-gray-900 text-lg font-semibold leading-7">
            Export Parcel Data
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

export default ParcelExportModal;