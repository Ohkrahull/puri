import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { CSVLink } from 'react-csv';
import SingleDatePicker from '../SingleDatePickerForBooking';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from "../../firebase/firebase";
import dayjs from 'dayjs';

const DeliveryExportModal = ({ onClose }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const modalRef = useRef(null);

  useEffect(() => {
    const deliveryQuery = query(collection(db, 'visitors'));
    const unsubscribe = onSnapshot(deliveryQuery, (snapshot) => {
      const deliveryData = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(delivery => delivery.purpose?.toLowerCase() === 'delivery');
      setDeliveries(deliveryData);
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
      { label: 'Company Name', key: 'companyName' },
      { label: 'Flat Number', key: 'flatNumber' },
      { label: 'Vehicle Number', key: 'vehicleNumber' },
      { label: 'Status', key: 'status' },
      { label: 'Current State', key: 'currentState' },
      { label: 'Leave at Gate', key: 'atGate' },
      { label: 'Approved By', key: 'approvedBy' },
      { label: 'Check In Date', key: 'checkInDate' },
      { label: 'Check In Time', key: 'checkInTime' },
      { label: 'Check Out Date', key: 'checkOutDate' },
      { label: 'Check Out Time', key: 'checkOutTime' },
      { label: 'Created At', key: 'createdAt' },
      { label: 'Updated At', key: 'updatedAt' }
    ];
  };

  const filterDeliveries = (deliveries) => {
    const from = fromDate ? new Date(fromDate) : new Date(0);
    const to = toDate ? new Date(toDate) : new Date();

    return deliveries.filter(delivery => {
      const deliveryDate = delivery.createdAt?.seconds 
        ? new Date(delivery.createdAt.seconds * 1000) 
        : new Date(0);
      return deliveryDate >= from && deliveryDate <= to;
    });
  };

  const getDeliveryStatus = (delivery) => {
    const status = delivery.status?.toLowerCase();
    const current = delivery.current;

    if (status === 'preapproved') return 'Expected';
    if (status === 'rejected') return 'Rejected';
    if (status === 'wrongentry' || current === 'wrongEntry') return 'Wrong Entry';
    if (current === true && status === 'approved') return 'Current';
    if (current === false && status === 'approved') return 'Visited';
    return 'N/A';
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return dayjs(timestamp.seconds * 1000).format('DD/MM/YYYY HH:mm:ss');
  };

  const formatData = (deliveries) => {
    return deliveries.map(delivery => ({
      name: `${delivery.firstName || ''} ${delivery.lastName || ''}`.trim() || 'N/A',
      phoneNumber: delivery.visitorPhoneNumber || delivery.phoneNumber || 'N/A',
      companyName: delivery.company || 'N/A',
      flatNumber: `${delivery.wing || ''}-${delivery.flatNumber || ''}`,
      vehicleNumber: delivery.vehicleNumber || 'N/A',
      status: delivery.status || 'N/A',
      currentState: getDeliveryStatus(delivery),
      atGate: delivery.atGate ? 'Yes' : 'No',
      approvedBy: delivery.approvedBy?.name || 'N/A',
      checkInDate: formatDate(delivery.checkInDate),
      checkInTime: formatDate(delivery.checkInTime),
      checkOutDate: formatDate(delivery.checkOutDate),
      checkOutTime: formatDate(delivery.checkOutTime),
      createdAt: formatDate(delivery.createdAt),
      updatedAt: formatDate(delivery.updatedAt)
    }));
  };

  const exportToCSV = () => {
    const filteredData = filterDeliveries(deliveries);
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
    return `delivery_data_${formattedFromDate}_to_${formattedToDate}.csv`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" style={{fontFamily: "Plus_Jakarta"}}>
      <div ref={modalRef} className="bg-white rounded-2xl shadow-xl w-[428px] relative" style={{fontFamily: "Plus_Jakarta"}}>
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <div className="flex-grow text-center text-gray-900 text-lg font-semibold leading-7">
            Export Delivery Data
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

export default DeliveryExportModal;