import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { CSVLink } from 'react-csv';
import SingleDatePicker from '../SingleDatePickerForBooking';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from "../../firebase/firebase";
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

const SOSExportModal = ({ onClose }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [guardUsers, setGuardUsers] = useState({});
  const modalRef = useRef(null);

  useEffect(() => {
    // Fetch SOS Alerts
    const sosQuery = query(
      collection(db, "sosAlerts"),
      orderBy("createdAt", "desc")
    );

    const unsubscribeSOS = onSnapshot(sosQuery, (snapshot) => {
      const sosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAlerts(sosData);
    }, (error) => {
      console.error("Error fetching SOS alerts:", error);
      toast.error("Failed to fetch SOS alerts");
    });

    // Fetch Guard Users
    const guardQuery = query(collection(db, "guardUser"));
    const unsubscribeGuards = onSnapshot(guardQuery, (snapshot) => {
      const guards = {};
      snapshot.docs.forEach(doc => {
        guards[doc.data().employeeId] = {
          firstName: doc.data().firstName,
          lastName: doc.data().lastName
        };
      });
      setGuardUsers(guards);
    }, (error) => {
      console.error("Error fetching guard users:", error);
      toast.error("Failed to fetch guard users");
    });

    // Click outside handler
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      unsubscribeSOS();
      unsubscribeGuards();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const getHeaders = () => {
    return [
      { label: 'Name', key: 'name' },
      { label: 'Wing & Flat Number', key: 'flatDetails' },
      { label: 'Date', key: 'date' },
      { label: 'Time', key: 'time' },
      { label: 'SOS Type', key: 'sosType' },
      { label: 'Acknowledged By', key: 'acknowledgedBy' },
      { label: 'Acknowledge Time', key: 'acknowledgeTime' },
      { label: 'Resolved Time', key: 'resolvedTime' },
      { label: 'Status', key: 'status' }
    ];
  };

  const filterAlerts = (alerts) => {
    const from = fromDate ? new Date(fromDate) : new Date(0);
    const to = toDate ? new Date(toDate) : new Date();

    return alerts.filter(alert => {
      const alertDate = alert.createdAt?.toDate() || new Date(0);
      return alertDate >= from && alertDate <= to;
    });
  };

  const formatData = (alerts) => {
    return alerts.map(alert => {
      const fullName = `${alert.userDetails?.firstName || ''} ${alert.userDetails?.lastName || ''}`.trim() || 'N/A';
      const acknowledgedBy = alert.employeeId 
        ? `${guardUsers[alert.employeeId]?.firstName || ''} ${guardUsers[alert.employeeId]?.lastName || ''}`.trim()
        : 'Not assigned';

      return {
        name: fullName,
        flatDetails: `${alert.wing || ''}-${alert.flatNumber || ''}`,
        date: alert.createdAt ? dayjs(alert.createdAt.toDate()).format('D MMM, YYYY') : 'N/A',
        time: alert.createdAt ? dayjs(alert.createdAt.toDate()).format('hh:mm A') : 'N/A',
        sosType: alert.type || 'N/A',
        acknowledgedBy,
        acknowledgeTime: alert.acknowledgedAt ? dayjs(alert.acknowledgedAt.toDate()).format('hh:mm A') : 'N/A',
        resolvedTime: alert.resolved ? dayjs(alert.cancelledAt.toDate()).format('hh:mm A') : 'Pending',
        status: alert.resolved ? 'Resolved' : 'Ongoing'
      };
    });
  };

  const exportToCSV = () => {
    const filteredData = filterAlerts(alerts);
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
    return `sos_alerts_${formattedFromDate}_to_${formattedToDate}.csv`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" style={{fontFamily: "Plus_Jakarta"}}>
      <div ref={modalRef} className="bg-white rounded-2xl shadow-xl w-[428px] relative" style={{fontFamily: "Plus_Jakarta"}}>
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <div className="flex-grow text-center text-gray-900 text-lg font-semibold leading-7">
            Export SOS Alerts
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

export default SOSExportModal;