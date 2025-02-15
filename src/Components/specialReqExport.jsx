import React, { useState, useRef, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import SingleDatePicker from './SingleDatePicker';
import { useAuth } from '../context/AuthContext';

const ExportModal = ({ onClose }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [csvData, setCsvData] = useState({ headers: [], data: [] });
  const modalRef = useRef(null);
  const { fetchSpecialRequests } = useAuth();

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

  useEffect(() => {
    const loadSpecialRequests = async () => {
      try {
        const requestsWithUserInfo = await fetchSpecialRequests();
        const { headers, data } = exportToCSV(requestsWithUserInfo);
        setCsvData({ headers, data });
      } catch (error) {
        console.error("Error fetching special requests:", error);
      }
    };

    loadSpecialRequests();
  }, [fetchSpecialRequests]);

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

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      hour12: true 
    });
  };

  const exportToCSV = (requests) => {
    const headers = [
      { label: 'Name', key: 'name' },
      { label: 'Phone Number', key: 'phoneNumber' },
      { label: 'Email', key: 'email' },
      { label: 'Flat Number', key: 'flatNumber' },
      { label: 'Wing', key: 'wing' },
      { label: 'Request Type', key: 'requestType' },
      { label: 'Scope of Work', key: 'scopeOfWork' },
      { label: 'Materials', key: 'materials' },
      { label: 'Special Requirements', key: 'specialRequirements' },
      { label: 'Date', key: 'date' },
      { label: 'Time', key: 'time' },
      { label: 'File URL', key: 'fileUrl' },
      { label: 'Comment', key: 'comment' }
    ];

    const from = fromDate ? new Date(fromDate) : new Date(0);
    const to = toDate ? new Date(toDate) : new Date();

    const filteredRequests = requests.filter(request => {
      const timestamp = request.timestamp ? new Date(request.timestamp.seconds * 1000) : null;
      return timestamp && timestamp >= from && timestamp <= to;
    });

    const data = filteredRequests.map(request => ({
      name: `${request.userInfo?.firstName || ''} ${request.userInfo?.lastName || ''}`,
      phoneNumber: request.phoneNumber || '',
      email: request.userInfo?.email || '',
      flatNumber: request.userInfo?.flatNumber || '',
      wing: request.userInfo?.wing || '',
      requestType: request.requestType || '',
      scopeOfWork: request.scopeOfWork || '',
      materials: request.materials || '',
      specialRequirements: request.specialRequirements || '',
      date: formatDate(request.timestamp),
      time: formatTime(request.timestamp),
      fileUrl: request.fileUrl || '',
      comment: request.comment || ''
    }));

    return { headers, data };
  };

  const handleExport = () => {
    setTimeout(onClose, 100);
  };

  const generateFileName = () => {
    const formattedFromDate = fromDate ? new Date(fromDate).toLocaleDateString('en-GB').replace(/\//g, '-') : 'all';
    const formattedToDate = toDate ? new Date(toDate).toLocaleDateString('en-GB').replace(/\//g, '-') : 'all';
    return `special_requests_export_${formattedFromDate}_to_${formattedToDate}.csv`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" style={{fontFamily: "Plus_Jakarta"}}>
      <div ref={modalRef} className="bg-white rounded-2xl shadow-xl w-[428px] relative" style={{fontFamily: "Plus_Jakarta"}}>
        {/* Top section */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <div className="flex-grow text-center text-gray-900 text-lg font-semibold leading-7" style={{fontFamily: "Plus_Jakarta", fontSize:'18px'}}>Export Special Requests</div>
          <button className="text-gray-900" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19.2806 18.2193C19.3502 18.289 19.4055 18.3717 19.4432 18.4628C19.4809 18.5538 19.5003 18.6514 19.5003 18.7499C19.5003 18.8485 19.4809 18.9461 19.4432 19.0371C19.4055 19.1281 19.3502 19.2109 19.2806 19.2806C19.2109 19.3502 19.1281 19.4055 19.0371 19.4432C18.9461 19.4809 18.8485 19.5003 18.7499 19.5003C18.6514 19.5003 18.5538 19.4809 18.4628 19.4432C18.3717 19.4055 18.289 19.3502 18.2193 19.2806L11.9999 13.0602L5.78055 19.2806C5.63982 19.4213 5.44895 19.5003 5.24993 19.5003C5.05091 19.5003 4.86003 19.4213 4.7193 19.2806C4.57857 19.1398 4.49951 18.949 4.49951 18.7499C4.49951 18.5509 4.57857 18.36 4.7193 18.2193L10.9396 11.9999L4.7193 5.78055C4.57857 5.63982 4.49951 5.44895 4.49951 5.24993C4.49951 5.05091 4.57857 4.86003 4.7193 4.7193C4.86003 4.57857 5.05091 4.49951 5.24993 4.49951C5.44895 4.49951 5.63982 4.57857 5.78055 4.7193L11.9999 10.9396L18.2193 4.7193C18.36 4.57857 18.5509 4.49951 18.7499 4.49951C18.949 4.49951 19.1398 4.57857 19.2806 4.7193C19.4213 4.86003 19.5003 5.05091 19.5003 5.24993C19.5003 5.44895 19.4213 5.63982 19.2806 5.78055L13.0602 11.9999L19.2806 18.2193Z" fill="#030712"/>
            </svg>
          </button>
        </div>

        {/* Middle section */}
        <div className="px-6 py-5">
          <div className="flex justify-between gap-4">
            <div className="flex flex-col flex-1 relative">
              <label htmlFor="from" className="text-gray-900 text-sm font-medium mb-2" style={{fontFamily: "Plus_Jakarta", fontSize:'14px'}}>From</label>
              <input
                type="text"
                id="from"
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
                <div className="absolute top-[60px] left-0 bg-white shadow-lg rounded-lg z-10">
                  <SingleDatePicker onDateSelect={handleFromDateSelect} />
                </div>
              )}
            </div>
            <div className="flex flex-col flex-1 relative">
              <label htmlFor="to" className="text-gray-900 text-sm font-medium mb-2" style={{fontFamily: "Plus_Jakarta", fontSize:'14px'}}>To</label>
              <input
                type="text"
                id="to"
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
                <div className="absolute top-[60px] right-0 bg-white shadow-lg rounded-lg z-10">
                  <SingleDatePicker onDateSelect={handleToDateSelect} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex justify-between items-center px-6 py-6 mb-2 border-t border-gray-100" style={{padding:'10px 20px'}}>
          <button 
            className="text-gray-900 text-sm font-medium underline"
            onClick={handleClearAll}
            style={{fontFamily: "Plus_Jakarta", fontSize:'16px'}}
          >
            Clear all
          </button>
          <CSVLink
            data={csvData.data}
            headers={csvData.headers}
            filename={generateFileName()}
            className="bg-gray-900 text-white px-5 py-4 rounded-lg text-sm font-medium relative after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-white after:rounded-b-lg"
            onClick={handleExport}
            style={{fontFamily: "Plus_Jakarta", fontSize:'16px', width:'94px', height:'44px', textAlign:'center'}}
          >
            Export
          </CSVLink>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;