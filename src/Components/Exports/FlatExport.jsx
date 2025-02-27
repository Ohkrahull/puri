import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { CSVLink } from 'react-csv';
import SingleDatePicker from '../SingleDatePickerForBooking';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from "../../firebase/firebase";

const FlatExportModal = ({ onClose }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [flats, setFlats] = useState([]);
  const [authorizedUsers, setAuthorizedUsers] = useState({});
  const modalRef = useRef(null);

  useEffect(() => {
    // Fetch flats data
    const flatsRef = collection(db, 'flats');
    const flatsUnsubscribe = onSnapshot(query(flatsRef), (snapshot) => {
      const flatsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFlats(flatsData);
    });

    // Fetch authorized users data
    const usersRef = collection(db, 'authorizedUsers');
    const usersUnsubscribe = onSnapshot(query(usersRef), (snapshot) => {
      const users = {};
      snapshot.docs.forEach(doc => {
        users[doc.id] = doc.data();
      });
      setAuthorizedUsers(users);
    });

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      flatsUnsubscribe();
      usersUnsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const getUserDetails = (userId) => {
    const user = authorizedUsers[userId] || {};
    return {
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A',
      email: user.email || 'N/A',
      phone: user.phone || 'N/A'
    };
  };

  const getFlatUsers = (flat) => {
    const users = flat.users || [];
    const result = {
      primaryOwner: { name: 'N/A', email: 'N/A', phone: 'N/A', isResiding: false },
      owner: { name: 'N/A', email: 'N/A', phone: 'N/A', isResiding: false },
      primaryTenant: { name: 'N/A', email: 'N/A', phone: 'N/A', isResiding: false },
      tenant: { name: 'N/A', email: 'N/A', phone: 'N/A', isResiding: false }
    };

    users.forEach(user => {
      const userDetails = getUserDetails(user.userId);
      const userData = {
        ...userDetails,
        isResiding: user.isResiding || false
      };

      switch (user.role) {
        case 'primary_owner':
          result.primaryOwner = userData;
          break;
        case 'owner':
          result.owner = userData;
          break;
        case 'primary_tenant':
          result.primaryTenant = userData;
          break;
        case 'tenant':
          result.tenant = userData;
          break;
      }
    });

    return result;
  };

  const exportToCSV = () => {
    const headers = [
      { label: 'Flat ID', key: 'flatId' },
      { label: 'Wing', key: 'wing' },
      { label: 'Flat Number', key: 'flatNumber' },
      { label: 'Vacant Status', key: 'vacantStatus' },
      { label: 'Primary Owner Name', key: 'primaryOwnerName' },
      { label: 'Primary Owner Email', key: 'primaryOwnerEmail' },
      { label: 'Primary Owner Phone', key: 'primaryOwnerPhone' },
      { label: 'Primary Owner Residing', key: 'primaryOwnerResiding' },
      { label: 'Owner Name', key: 'ownerName' },
      { label: 'Owner Email', key: 'ownerEmail' },
      { label: 'Owner Phone', key: 'ownerPhone' },
      { label: 'Owner Residing', key: 'ownerResiding' },
      { label: 'Primary Tenant Name', key: 'primaryTenantName' },
      { label: 'Primary Tenant Email', key: 'primaryTenantEmail' },
      { label: 'Primary Tenant Phone', key: 'primaryTenantPhone' },
      { label: 'Primary Tenant Residing', key: 'primaryTenantResiding' },
      { label: 'Tenant Name', key: 'tenantName' },
      { label: 'Tenant Email', key: 'tenantEmail' },
      { label: 'Tenant Phone', key: 'tenantPhone' },
      { label: 'Tenant Residing', key: 'tenantResiding' },
      { label: 'Created At', key: 'createdAt' },
      { label: 'Updated At', key: 'updatedAt' }
    ];

    const from = fromDate ? new Date(fromDate) : new Date(0);
    const to = toDate ? new Date(toDate) : new Date();

    const filteredFlats = flats.filter(flat => {
      const flatDate = flat.createdAt?.seconds 
        ? new Date(flat.createdAt.seconds * 1000) 
        : new Date(0);
      return flatDate >= from && flatDate <= to;
    });

    const csvData = filteredFlats.map(flat => {
      const users = getFlatUsers(flat);
      
      return {
        flatId: flat.flatId || '',
        wing: flat.wing || '',
        flatNumber: flat.flatNumber || '',
        vacantStatus: flat.isVacant ? 'Vacant' : 'Occupied',
        primaryOwnerName: users.primaryOwner.name,
        primaryOwnerEmail: users.primaryOwner.email,
        primaryOwnerPhone: users.primaryOwner.phone,
        primaryOwnerResiding: users.primaryOwner.isResiding ? 'Yes' : 'No',
        ownerName: users.owner.name,
        ownerEmail: users.owner.email,
        ownerPhone: users.owner.phone,
        ownerResiding: users.owner.isResiding ? 'Yes' : 'No',
        primaryTenantName: users.primaryTenant.name,
        primaryTenantEmail: users.primaryTenant.email,
        primaryTenantPhone: users.primaryTenant.phone,
        primaryTenantResiding: users.primaryTenant.isResiding ? 'Yes' : 'No',
        tenantName: users.tenant.name,
        tenantEmail: users.tenant.email,
        tenantPhone: users.tenant.phone,
        tenantResiding: users.tenant.isResiding ? 'Yes' : 'No',
        createdAt: flat.createdAt?.seconds 
          ? new Date(flat.createdAt.seconds * 1000).toLocaleString()
          : 'N/A',
        updatedAt: flat.updatedAt?.seconds
          ? new Date(flat.updatedAt.seconds * 1000).toLocaleString()
          : 'N/A'
      };
    });

    return { headers, data: csvData };
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
    return `flats_detailed_${formattedFromDate}_to_${formattedToDate}.csv`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" style={{fontFamily: "Plus_Jakarta"}}>
      <div ref={modalRef} className="bg-white rounded-2xl shadow-xl w-[428px] relative" style={{fontFamily: "Plus_Jakarta"}}>
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <div className="flex-grow text-center text-gray-900 text-lg font-semibold leading-7">Export Detailed Flat Data</div>
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
                <div className="absolute top-[60px] left-0 bg-white shadow-lg rounded-lg z-10">
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
                <div className="absolute top-[60px] right-0 bg-white shadow-lg rounded-lg z-10">
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

export default FlatExportModal;