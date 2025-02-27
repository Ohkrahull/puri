import React, { useState } from 'react';
import SOSAlertCard from './SosAlert';
import FloatingSosAlert from './FloatingSosAlert';

const SOSAlertManager = () => {
  const [showFullAlert, setShowFullAlert] = useState(true);
  const [showMinimized, setShowMinimized] = useState(false);
  const [status, setStatus] = useState('Awaiting Guard\'s Response');
  
  const handleMinimize = () => {
    setShowFullAlert(false);
    if (status !== 'SOS Resolved') {
      setShowMinimized(true);
    }
  };

  const handleMaximize = () => {
    setShowMinimized(false);
    setShowFullAlert(true);
  };

  // Only show either full alert or minimized version if not resolved
  if (status === 'SOS Resolved') {
    return null;
  }

  return (
    <>
      {showFullAlert && (
        <SOSAlertCard
          onMinimize={handleMinimize}
          flatNumber="A-201"
          time="02:40"
          residentName="Aakash Bagve"
          residentPhone="8952625499"
          guardName="Sahil Toraskar"
          guardPhone="9254658845"
          status={status}
        />
      )}

      {showMinimized && !showFullAlert && (
        <FloatingSosAlert
          flatNumber="A-201"
          time="02:40"
          sentBy="Aakash Bagve"
          contactDetails="8952625499"
          onClick={handleMaximize}
        />
      )}
    </>
  );
};

export default SOSAlertManager;