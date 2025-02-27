// import React, { useState } from 'react'
// import SOSAlertCard from './SosAlert';

// const SosALertMain = () => {
//     const [showSOS, setShowSOS] = useState(false);

//     return (
//        <>
//         {showSOS && (
//           <SOSAlertCard
//             onClose={() => setShowSOS(false)}
//             flatNumber="A2102"
//             time="10 08 AM"
//             residentName="Aakash Bagve"
//             residentPhone="5094169462"
//             guardName="Sahil Toraskar"
//             guardPhone="9254658845"
//             status="Awaiting Guard's Response" // or "Guard Responding" or "SOS Resolved"
//           />
//         )}
//        </>
//       )
//     }


// export default SosALertMain
import React, { useState } from 'react';

const SOSAlertCard = ({ 
  onClose, 
  flatNumber,
  time,
  residentName,
  residentPhone,
  guardName,
  guardPhone,
  status 
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'Awaiting Guard\'s Response':
        return 'text-blue-500';
      case 'Guard Responding':
        return 'text-[#F59E0B]';
      case 'SOS Resolved':
        return 'text-[#22C55E]';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-[400px] rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-red-50 flex justify-between items-center px-6 py-4">
          <h2 className="text-xl font-medium">SOS Alert</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Alert Type Card */}
        <div className="bg-gray-50 mx-6 mt-6 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-500 text-2xl font-medium">+</span>
            </div>
            <span className="text-xl font-medium">Medical Emergency Alert</span>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <div className="text-gray-500 text-sm mb-1">Flat Number</div>
              <div className="font-medium text-lg">{flatNumber}</div>
            </div>
            <div className="flex gap-2">
              {time.split(' ').map((part, index) => (
                <div key={index} className="bg-white px-3 py-1 rounded font-medium">
                  {part}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resident Details */}
        <div className="px-6 py-4">
          <h3 className="font-medium mb-4">Resident Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-gray-500 text-sm mb-1">SOS Triggered by</div>
              <div className="font-medium">{residentName}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Resident Phone Number</div>
              <div className="font-medium">{residentPhone}</div>
            </div>
          </div>
        </div>

        {/* Guard Details - Only show if status is not awaiting response */}
        {status !== 'Awaiting Guard\'s Response' && (
          <div className="px-6 py-4 border-t">
            <h3 className="font-medium mb-4">Guard Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-500 text-sm mb-1">
                  {status === 'SOS Resolved' ? 'SOS Resolved by' : 'SOS Acknowledged by'}
                </div>
                <div className="font-medium">{guardName}</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm mb-1">Guard Phone Number</div>
                <div className="font-medium">{guardPhone}</div>
              </div>
            </div>
          </div>
        )}

        {/* Status */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Status:</span>
            <span className={`font-medium ${getStatusStyles()}`}>{status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SOSAlertDemo = () => {
  const [showSOS, setShowSOS] = useState(false);
  const [alertStatus, setAlertStatus] = useState('Awaiting Guard\'s Response');

  const handleShowAlert = (status) => {
    setAlertStatus(status);
    setShowSOS(true);
  };

  return (
    <div className="p-4 space-y-4">
      <button
        onClick={() => handleShowAlert('Awaiting Guard\'s Response')}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Show Pending Alert
      </button>
      
      <button
        onClick={() => handleShowAlert('Guard Responding')}
        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 ml-4"
      >
        Show Acknowledged Alert
      </button>
      
      <button
        onClick={() => handleShowAlert('SOS Resolved')}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-4"
      >
        Show Resolved Alert
      </button>

      {showSOS && (
        <SOSAlertCard
          onClose={() => setShowSOS(false)}
          flatNumber="A2102"
          time="10 08 AM"
          residentName="Aakash Bagve"
          residentPhone="5094169462"
          guardName="Sahil Toraskar"
          guardPhone="9254658845"
          status={alertStatus}
        />
      )}
    </div>
  );
};

export default SOSAlertDemo;