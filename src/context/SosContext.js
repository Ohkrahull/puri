// src/context/SOSContext.js
import React, { createContext, useContext, useState } from 'react';
import SOSAlertCard from '../Components/SosAlert';
import FloatingSosAlert from '../Components/FloatingSosAlert';

const SOSContext = createContext();

export const SOSProvider = ({ children }) => {
  const [showFullAlert, setShowFullAlert] = useState(false);
  const [showMinimized, setShowMinimized] = useState(false);
  const [sosData, setSOSData] = useState(null);
  const [status, setStatus] = useState('Awaiting Guard\'s Response');

  const showSOS = (data) => {
    setSOSData(data);
    setShowFullAlert(true);
    setShowMinimized(false);
  };

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

  const updateSOSStatus = (newStatus) => {
    setStatus(newStatus);
    if (newStatus === 'SOS Resolved') {
      setShowFullAlert(false);
      setShowMinimized(false);
    }
  };

  return (
    <SOSContext.Provider 
      value={{ 
        showSOS, 
        updateSOSStatus 
      }}
    >
      {children}

      {/* SOS Alert Components */}
      {(showFullAlert || showMinimized) && sosData && (
        <>
          {showFullAlert && (
            <SOSAlertCard
              onMinimize={handleMinimize}
              flatNumber={sosData.flatNumber}
              time={sosData.time}
              residentName={sosData.residentName}
              residentPhone={sosData.residentPhone}
              guardName={sosData.guardName}
              guardPhone={sosData.guardPhone}
              status={status}
            />
          )}

          {showMinimized && !showFullAlert && (
            <FloatingSosAlert
              flatNumber={sosData.flatNumber}
              time={sosData.time}
              sentBy={sosData.residentName}
              contactDetails={sosData.residentPhone}
              onClick={handleMaximize}
            />
          )}
        </>
      )}
    </SOSContext.Provider>
  );
};

export const useSOS = () => {
  const context = useContext(SOSContext);
  if (!context) {
    throw new Error('useSOS must be used within an SOSProvider');
  }
  return context;
};