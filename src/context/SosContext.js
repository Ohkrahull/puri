// // // // // src/context/SOSContext.js
// // // // import React, { createContext, useContext, useState } from 'react';
// // // // import SOSAlertCard from '../Components/SosAlert';
// // // // import FloatingSosAlert from '../Components/FloatingSosAlert';

// // // // const SOSContext = createContext();

// // // // export const SOSProvider = ({ children }) => {
// // // //   const [showFullAlert, setShowFullAlert] = useState(false);
// // // //   const [showMinimized, setShowMinimized] = useState(false);
// // // //   const [sosData, setSOSData] = useState(null);
// // // //   const [status, setStatus] = useState('Awaiting Guard\'s Response');

// // // //   const showSOS = (data) => {
// // // //     setSOSData(data);
// // // //     setShowFullAlert(true);
// // // //     setShowMinimized(false);
// // // //   };

// // // //   const handleMinimize = () => {
// // // //     setShowFullAlert(false);
// // // //     if (status !== 'SOS Resolved') {
// // // //       setShowMinimized(true);
// // // //     }
// // // //   };

// // // //   const handleMaximize = () => {
// // // //     setShowMinimized(false);
// // // //     setShowFullAlert(true);
// // // //   };

// // // //   const updateSOSStatus = (newStatus) => {
// // // //     setStatus(newStatus);
// // // //     if (newStatus === 'SOS Resolved') {
// // // //       setShowFullAlert(false);
// // // //       setShowMinimized(false);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <SOSContext.Provider 
// // // //       value={{ 
// // // //         showSOS, 
// // // //         updateSOSStatus 
// // // //       }}
// // // //     >
// // // //       {children}

// // // //       {/* SOS Alert Components */}
// // // //       {(showFullAlert || showMinimized) && sosData && (
// // // //         <>
// // // //           {showFullAlert && (
// // // //             <SOSAlertCard
// // // //               onMinimize={handleMinimize}
// // // //               flatNumber={sosData.flatNumber}
// // // //               time={sosData.time}
// // // //               residentName={sosData.residentName}
// // // //               residentPhone={sosData.residentPhone}
// // // //               guardName={sosData.guardName}
// // // //               guardPhone={sosData.guardPhone}
// // // //               status={status}
// // // //             />
// // // //           )}

// // // //           {showMinimized && !showFullAlert && (
// // // //             <FloatingSosAlert
// // // //               flatNumber={sosData.flatNumber}
// // // //               time={sosData.time}
// // // //               sentBy={sosData.residentName}
// // // //               contactDetails={sosData.residentPhone}
// // // //               onClick={handleMaximize}
// // // //             />
// // // //           )}
// // // //         </>
// // // //       )}
// // // //     </SOSContext.Provider>
// // // //   );
// // // // };

// // // // export const useSOS = () => {
// // // //   const context = useContext(SOSContext);
// // // //   if (!context) {
// // // //     throw new Error('useSOS must be used within an SOSProvider');
// // // //   }
// // // //   return context;
// // // // };
// // // import React, { createContext, useContext, useState, useEffect } from 'react';
// // // import { 
// // //   collection, 
// // //   query, 
// // //   where, 
// // //   onSnapshot, 
// // //   getDoc, 
// // //   doc,
// // //   getDocs
// // // } from 'firebase/firestore';
// // // import { db } from '../firebase/firebase'; // Adjust the import path to your Firebase config
// // // import SOSAlertCard from '../Components/SosAlert';
// // // import FloatingSosAlert from '../Components/FloatingSosAlert';

// // // const SOSContext = createContext();

// // // export const SOSProvider = ({ children }) => {
// // //   const [showFullAlert, setShowFullAlert] = useState(false);
// // //   const [showMinimized, setShowMinimized] = useState(false);
// // //   const [sosData, setSOSData] = useState(null);
// // //   const [status, setStatus] = useState('Awaiting Guard\'s Response');

// // //   useEffect(() => {
// // //     // Query for pending SOS alerts
// // //     const sosQuery = query(
// // //       collection(db, 'sosAlerts'), 
// // //       where('status', '==', 'PENDING')
// // //     );

// // //     // Set up real-time listener
// // //     const unsubscribe = onSnapshot(sosQuery, async (snapshot) => {
// // //       if (!snapshot.empty) {
// // //         // Take the first pending alert
// // //         const firstPendingAlert = snapshot.docs[0].data();
        
// // //         // Fetch user details
// // //         let userDetails = {};
// // //         try {
// // //           const userQuery = query(
// // //             collection(db, 'users'), 
// // //             where('phoneNumber', '==', firstPendingAlert.phoneNumber)
// // //           );
          
// // //           const userSnapshot = await getDocs(userQuery);
// // //           if (!userSnapshot.empty) {
// // //             userDetails = userSnapshot.docs[0].data();
// // //           }
// // //         } catch (error) {
// // //           console.error("Error fetching user details:", error);
// // //         }

// // //         // Prepare guard details object
// // //         let guardDetails = {};
// // //         if (firstPendingAlert.employeeId) {
// // //           try {
// // //             const guardQuery = query(
// // //               collection(db, 'guardUsers'), 
// // //               where('employeeId', '==', firstPendingAlert.employeeId)
// // //             );
            
// // //             const guardSnapshot = await getDocs(guardQuery);
// // //             if (!guardSnapshot.empty) {
// // //               guardDetails = guardSnapshot.docs[0].data();
// // //             }
// // //           } catch (error) {
// // //             console.error("Error fetching guard details:", error);
// // //           }
// // //         }
        
// // //         // Transform Firestore data to match expected format
// // //         const formattedSOSData = {
// // //           flatNumber: `${firstPendingAlert.wing}-${firstPendingAlert.flatNumber}`, // Combine wing and flat number
// // //           time: new Date(firstPendingAlert.createdAt?.seconds * 1000).toLocaleString() || '',
// // //           residentName: userDetails.firstName 
// // //             ? `${userDetails.firstName} ${userDetails.lastName || ''}`.trim() 
// // //             : firstPendingAlert.userName || '',
// // //           residentPhone: firstPendingAlert.phoneNumber || '',
// // //           guardName: guardDetails.firstName 
// // //             ? `${guardDetails.firstName} ${guardDetails.lastName || ''}`.trim() 
// // //             : '',
// // //           guardPhone: guardDetails.phoneNumber || '',
// // //           type: firstPendingAlert.type || '',
// // //           status: firstPendingAlert.status || 'PENDING',
// // //           wing: firstPendingAlert.wing || '',
// // //           employeeId: firstPendingAlert.employeeId || ''
// // //         };

// // //         // Automatically show SOS alert if there's a pending alert
// // //         showSOS(formattedSOSData);
// // //       }
// // //     }, (error) => {
// // //       console.error("Error fetching SOS alerts:", error);
// // //     });

// // //     // Cleanup subscription on unmount
// // //     return () => unsubscribe();
// // //   }, []);

// // //   const showSOS = (data) => {
// // //     setSOSData(data);
// // //     setShowFullAlert(true);
// // //     setShowMinimized(false);
// // //   };

// // //   const handleMinimize = () => {
// // //     setShowFullAlert(false);
// // //     if (status !== 'SOS Resolved') {
// // //       setShowMinimized(true);
// // //     }
// // //   };

// // //   const handleMaximize = () => {
// // //     setShowMinimized(false);
// // //     setShowFullAlert(true);
// // //   };

// // //   const updateSOSStatus = (newStatus) => {
// // //     setStatus(newStatus);
// // //     if (newStatus === 'SOS Resolved') {
// // //       setShowFullAlert(false);
// // //       setShowMinimized(false);
// // //     }
// // //   };

// // //   return (
// // //     <SOSContext.Provider
// // //       value={{
// // //         showSOS,
// // //         updateSOSStatus
// // //       }}
// // //     >
// // //       {children}
// // //       {/* SOS Alert Components */}
// // //       {(showFullAlert || showMinimized) && sosData && (
// // //         <>
// // //           {showFullAlert && (
// // //             <SOSAlertCard
// // //               onMinimize={handleMinimize}
// // //               flatNumber={sosData.flatNumber}
// // //               time={sosData.time}
// // //               residentName={sosData.residentName}
// // //               residentPhone={sosData.residentPhone}
// // //               guardName={sosData.guardName}
// // //               guardPhone={sosData.guardPhone}
// // //               status={sosData.status}
// // //               type={sosData.type}
// // //               wing={sosData.wing}
// // //               employeeId={sosData.employeeId}
// // //             />
// // //           )}

// // //           {showMinimized && !showFullAlert && (
// // //             <FloatingSosAlert
// // //               flatNumber={sosData.flatNumber}
// // //               time={sosData.time}
// // //               sentBy={sosData.residentName}
// // //               contactDetails={sosData.residentPhone}
// // //               onClick={handleMaximize}
// // //               type={sosData.type}
// // //               wing={sosData.wing}
// // //               employeeId={sosData.employeeId}
// // //             />
// // //           )}
// // //         </>
// // //       )}
// // //     </SOSContext.Provider>
// // //   );
// // // };

// // // export const useSOS = () => {
// // //   const context = useContext(SOSContext);
// // //   if (!context) {
// // //     throw new Error('useSOS must be used within an SOSProvider');
// // //   }
// // //   return context;
// // // };
// // import React, { createContext, useContext, useState, useEffect } from 'react';
// // import { 
// //   collection, 
// //   query, 
// //   where, 
// //   onSnapshot, 
// //   getDocs
// // } from 'firebase/firestore';
// // import { db } from '../firebase/firebase'; // Adjust the import path to your Firebase config
// // import SOSAlertCard from '../Components/SosAlert';
// // import FloatingSosAlert from '../Components/FloatingSosAlert';

// // const SOSContext = createContext();

// // export const SOSProvider = ({ children }) => {
// //   const [showFullAlert, setShowFullAlert] = useState(false);
// //   const [showMinimized, setShowMinimized] = useState(false);
// //   const [sosData, setSOSData] = useState(null);

// //   useEffect(() => {
// //     // Query for pending or acknowledged SOS alerts
// //     const sosQuery = query(
// //       collection(db, 'sosAlerts'), 
// //       where('status', 'in', ['PENDING', 'ACKNOWLEDGED'])
// //     );

// //     // Set up real-time listener
// //     const unsubscribe = onSnapshot(sosQuery, async (snapshot) => {
// //       if (!snapshot.empty) {
// //         // Take the first pending or acknowledged alert
// //         const firstSOSAlert = snapshot.docs[0].data();
        
// //         // Fetch user details
// //         let userDetails = {};
// //         try {
// //           const userQuery = query(
// //             collection(db, 'users'), 
// //             where('phoneNumber', '==', firstSOSAlert.phoneNumber)
// //           );
          
// //           const userSnapshot = await getDocs(userQuery);
// //           if (!userSnapshot.empty) {
// //             userDetails = userSnapshot.docs[0].data();
// //           }
// //         } catch (error) {
// //           console.error("Error fetching user details:", error);
// //         }

// //         // Prepare guard details object
// //         let guardDetails = {};
// //         if (firstSOSAlert.employeeId && firstSOSAlert.status === 'ACKNOWLEDGED') {
// //           try {
// //             const guardQuery = query(
// //               collection(db, 'guardUser'), 
// //               where('employeeId', '==', firstSOSAlert.employeeId)
// //             );
            
// //             const guardSnapshot = await getDocs(guardQuery);
// //             if (!guardSnapshot.empty) {
// //               guardDetails = guardSnapshot.docs[0].data();
// //             }
// //           } catch (error) {
// //             console.error("Error fetching guard details:", error);
// //           }
// //         }
        
// //         // Transform Firestore data to match expected format
// //         const formattedSOSData = {
// //           flatNumber: `${firstSOSAlert.wing}-${firstSOSAlert.flatNumber}`, // Combine wing and flat number
// //           time: formatTime(firstSOSAlert.createdAt?.seconds * 1000),
// //           residentName: userDetails.firstName 
// //             ? `${userDetails.firstName} ${userDetails.lastName || ''}`.trim() 
// //             : firstSOSAlert.userName || '',
// //           residentPhone: firstSOSAlert.phoneNumber || '',
// //           guardName: guardDetails.firstName 
// //             ? `${guardDetails.firstName} ${guardDetails.lastName || ''}`.trim() 
// //             : '',
// //           guardPhone: guardDetails.phoneNumber || '',
// //           type: firstSOSAlert.type || '',
// //           status: mapStatusToDisplay(firstSOSAlert.status),
// //           wing: firstSOSAlert.wing || '',
// //           employeeId: firstSOSAlert.employeeId || ''
// //         };

// //         console.log("formattedSOSData : ",formattedSOSData);
        
// //         // Automatically show SOS alert
// //         showSOS(formattedSOSData);
// //       }
// //     }, (error) => {
// //       console.error("Error fetching SOS alerts:", error);
// //     });

// //     // Cleanup subscription on unmount
// //     return () => unsubscribe();
// //   }, []);

// //   // Helper function to format time like in the UI
// //   const formatTime = (timestamp) => {
// //     if (!timestamp) return '';
// //     const date = new Date(timestamp);
// //     const hours = date.getHours() % 12 || 12; // convert to 12-hour format
// //     const minutes = date.getMinutes().toString().padStart(2, '0');
// //     const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    
// //     return `${hours} ${minutes} ${ampm}`;
// //   };

// //   // Map Firestore status to display status
// //   const mapStatusToDisplay = (status) => {
// //     switch(status) {
// //       case 'PENDING':
// //         return 'Awaiting Guard\'s Response';
// //       case 'ACKNOWLEDGED':
// //         return 'Guard Responding';
// //       case 'RESOLVED':
// //         return 'SOS Resolved';
// //       default:
// //         return status;
// //     }
// //   };

// //   const showSOS = (data) => {
// //     setSOSData(data);
// //     setShowFullAlert(true);
// //     setShowMinimized(false);
// //   };

// //   const handleMinimize = () => {
// //     setShowFullAlert(false);
// //     if (sosData.status !== 'SOS Resolved') {
// //       setShowMinimized(true);
// //     }
// //   };

// //   const handleMaximize = () => {
// //     setShowMinimized(false);
// //     setShowFullAlert(true);
// //   };

// //   return (
// //     <SOSContext.Provider
// //       value={{
// //         showSOS,
// //         updateSOSStatus: () => {} // Placeholder for potential future implementation
// //       }}
// //     >
// //       {children}
// //       {/* SOS Alert Components */}
// //       {(showFullAlert || showMinimized) && sosData && (
// //         <>
// //           {showFullAlert && (
// //             <SOSAlertCard
// //               onMinimize={handleMinimize}
// //               flatNumber={sosData.flatNumber}
// //               time={sosData.time}
// //               residentName={sosData.residentName}
// //               residentPhone={sosData.residentPhone}
// //               guardName={sosData.guardName}
// //               guardPhone={sosData.guardPhone}
// //               status={sosData.status}
// //               type={sosData.type}
// //               wing={sosData.wing}
// //             />
// //           )}

// //           {showMinimized && !showFullAlert && (
// //             <FloatingSosAlert
// //               flatNumber={sosData.flatNumber}
// //               time={sosData.time}
// //               sentBy={sosData.residentName}
// //               contactDetails={sosData.residentPhone}
// //               onClick={handleMaximize}
// //             />
// //           )}
// //         </>
// //       )}
// //     </SOSContext.Provider>
// //   );
// // };

// // export const useSOS = () => {
// //   const context = useContext(SOSContext);
// //   if (!context) {
// //     throw new Error('useSOS must be used within an SOSProvider');
// //   }
// //   return context;
// // };

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { 
//   collection, 
//   query, 
//   where, 
//   onSnapshot, 
//   getDocs
// } from 'firebase/firestore';
// import { db } from '../firebase/firebase'; // Adjust the import path to your Firebase config
// import SOSAlertCard from '../Components/SosAlert';
// import FloatingSosAlert from '../Components/FloatingSosAlert';

// const SOSContext = createContext();

// export const SOSProvider = ({ children }) => {
//   const [showFullAlert, setShowFullAlert] = useState(false);
//   const [showMinimized, setShowMinimized] = useState(false);
//   const [sosData, setSOSData] = useState(null);

//   useEffect(() => {
//     // Query for non-resolved SOS alerts (current active alerts)
//     const sosQuery = query(
//       collection(db, 'sosAlerts'), 
//       where('resolved', '==', false)
//     );

//     // Set up real-time listener
//     const unsubscribe = onSnapshot(sosQuery, async (snapshot) => {
//       if (!snapshot.empty) {
//         // Take the first active alert
//         const firstSOSAlert = snapshot.docs[0].data();
        
//         // Fetch user details
//         let userDetails = {};
//         // try {
//         //   const userQuery = query(
//         //     collection(db, 'users'), 
//         //     where('phoneNumber', '==', firstSOSAlert.phoneNumber)
//         //   );
          
//         //   const userSnapshot = await getDocs(userQuery);
//         //   if (!userSnapshot.empty) {
//         //     userDetails = userSnapshot.docs[0].data();
//         //   }
//         // } catch (error) {
//         //   console.error("Error fetching user details:", error);
//         // }
//         if (firstSOSAlert.phoneNumber && firstSOSAlert.status === 'PENDING') {
//           try {
//             const userQuery = query(
//               collection(db, 'users'), 
//               where('phoneNumber', '==', firstSOSAlert.phoneNumber)
//             );
            
//                const userSnapshot = await getDocs(userQuery);
//           if (!userSnapshot.empty) {
//             userDetails = userSnapshot.docs[0].data();
//           }
//         } catch (error) {
//           console.error("Error fetching user details:", error);
//         }
//         }

//         // Prepare guard details object
//         let guardDetails = {};
//         if (firstSOSAlert.employeeId && firstSOSAlert.status === 'ACKNOWLEDGED') {
//           try {
//             const guardQuery = query(
//               collection(db, 'guardUser'), 
//               where('employeeId', '==', firstSOSAlert.employeeId)
//             );
            
//             const guardSnapshot = await getDocs(guardQuery);
//             if (!guardSnapshot.empty) {
//               guardDetails = guardSnapshot.docs[0].data();
//             }
//           } catch (error) {
//             console.error("Error fetching guard details:", error);
//           }
//         }
        
//         // Transform Firestore data to match expected format
//         const formattedSOSData = {
//           flatNumber: `${firstSOSAlert.wing}-${firstSOSAlert.flatNumber}`, // Combine wing and flat number
//           time: formatTime(firstSOSAlert.createdAt?.seconds * 1000),
//           resolvedTime: firstSOSAlert.resolvedAt 
//             ? formatTime(firstSOSAlert.resolvedAt.seconds * 1000) 
//             : null,
//           residentName: userDetails.firstName 
//             ? `${userDetails.firstName} ${userDetails.lastName || ''}`.trim() 
//             : firstSOSAlert.userName || '',
//           residentPhone: firstSOSAlert.phoneNumber || '',
//           guardName: guardDetails.firstName 
//             ? `${guardDetails.firstName} ${guardDetails.lastName || ''}`.trim() 
//             : '',
//           guardPhone: guardDetails.phoneNumber || '',
//           type: firstSOSAlert.type || '',
//           status: mapStatusToDisplay(firstSOSAlert.status, firstSOSAlert.resolved),
//           wing: firstSOSAlert.wing || '',
//           employeeId: firstSOSAlert.employeeId || '',
//           resolved: firstSOSAlert.resolved || false
//         };

//         // Automatically show SOS alert if not resolved
//         if (!formattedSOSData.resolved) {
//           showSOS(formattedSOSData);
//         } else {
//           // Close any open alerts if resolved
//           setShowFullAlert(false);
//           setShowMinimized(false);
//           setSOSData(null);
//         }
//       } else {
//         // No active alerts
//         setShowFullAlert(false);
//         setShowMinimized(false);
//         setSOSData(null);
//       }
//     }, (error) => {
//       console.error("Error fetching SOS alerts:", error);
//     });

//     // Cleanup subscription on unmount
//     return () => unsubscribe();
//   }, []);

//   // Helper function to format time like in the UI
//   const formatTime = (timestamp) => {
//     if (!timestamp) return '';
//     const date = new Date(timestamp);
//     const hours = date.getHours() % 12 || 12; // convert to 12-hour format
//     const minutes = date.getMinutes().toString().padStart(2, '0');
//     const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    
//     return `${hours} ${minutes} ${ampm}`;
//   };

//   // Map Firestore status to display status
//   const mapStatusToDisplay = (status, resolved) => {
//     if (resolved) return 'SOS Resolved';
    
//     switch(status) {
//       case 'PENDING':
//         return 'Awaiting Guard\'s Response';
//       case 'ACKNOWLEDGED':
//         return 'Guard Responding';
//       default:
//         return status;
//     }
//   };

//   const showSOS = (data) => {
//     setSOSData(data);
//     setShowFullAlert(true);
//     setShowMinimized(false);
//   };

//   const handleMinimize = () => {
//     setShowFullAlert(false);
//     if (sosData && sosData.status !== 'SOS Resolved') {
//       setShowMinimized(true);
//     }
//   };

//   const handleMaximize = () => {
//     setShowMinimized(false);
//     setShowFullAlert(true);
//   };

//   return (
//     <SOSContext.Provider
//       value={{
//         showSOS,
//         updateSOSStatus: () => {} // Placeholder for potential future implementation
//       }}
//     >
//       {children}
//       {/* SOS Alert Components */}
//       {(showFullAlert || showMinimized) && sosData && !sosData.resolved && (
//         <>
//           {showFullAlert && (
//             <SOSAlertCard
//               onMinimize={handleMinimize}
//               flatNumber={sosData.flatNumber}
//               time={sosData.time}
//               residentName={sosData.residentName}
//               residentPhone={sosData.residentPhone}
//               guardName={sosData.guardName}
//               guardPhone={sosData.guardPhone}
//               status={sosData.status}
//               type={sosData.type}
//               wing={sosData.wing}
//             />
//           )}

//           {showMinimized && !showFullAlert && (
//             <FloatingSosAlert
//               flatNumber={sosData.flatNumber}
//               time={sosData.time}
//               sentBy={sosData.residentName}
//               contactDetails={sosData.residentPhone}
//               onClick={handleMaximize}
//             />
//           )}
//         </>
//       )}
//     </SOSContext.Provider>
//   );
// };

// export const useSOS = () => {
//   const context = useContext(SOSContext);
//   if (!context) {
//     throw new Error('useSOS must be used within an SOSProvider');
//   }
//   return context;
// };
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  getDocs,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import SOSAlertCard from '../Components/SosAlert';
import FloatingSosAlert from '../Components/FloatingSosAlert';

const SOSContext = createContext();

export const SOSProvider = ({ children }) => {
  const [showFullAlert, setShowFullAlert] = useState(false);
  const [showMinimized, setShowMinimized] = useState(false);
  const [sosData, setSOSData] = useState(null);
  const statusCheckIntervalRef = useRef(null);

  // Function to check alert status periodically
  const startPeriodicStatusCheck = (alertDocId) => {
    // Clear any existing interval
    if (statusCheckIntervalRef.current) {
      clearInterval(statusCheckIntervalRef.current);
    }

    // Set up new interval to check status every 5 seconds
    statusCheckIntervalRef.current = setInterval(async () => {
      try {
        const alertDocRef = doc(db, 'sosAlerts', alertDocId);
        const alertSnapshot = await getDoc(alertDocRef);
        
        if (alertSnapshot.exists()) {
          const alertData = alertSnapshot.data();
          console.log('Periodic status check:', alertData);

          // If resolved, close the modal
          if (alertData.resolved) {
            setShowFullAlert(false);
            setShowMinimized(false);
            setSOSData(null);
            
            // Clear the interval
            if (statusCheckIntervalRef.current) {
              clearInterval(statusCheckIntervalRef.current);
            }
          }
        }
      } catch (error) {
        console.error('Error checking alert status:', error);
      }
    }, 5000); // 5 seconds
  };

  useEffect(() => {
    // Cleanup interval on component unmount
    return () => {
      if (statusCheckIntervalRef.current) {
        clearInterval(statusCheckIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Query for active SOS alerts (not resolved)
    const sosQuery = query(
      collection(db, 'sosAlerts'), 
      where('status', 'in', ['PENDING', 'ACKNOWLEDGED'])
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(sosQuery, async (snapshot) => {
      console.log("SOS Alerts Snapshot:", snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
      
      if (!snapshot.empty) {
        // Take the first active alert
        const firstSOSAlert = snapshot.docs[0].data();
        const alertDocId = snapshot.docs[0].id;

        // Check if the alert is truly resolved
        if (firstSOSAlert.resolved) {
          console.log("Alert is marked as resolved, closing modal");
          setShowFullAlert(false);
          setShowMinimized(false);
          setSOSData(null);
          return;
        }

        // Fetch user details
        let userDetails = {};
        try {
          const userQuery = query(
            collection(db, 'users'), 
            where('phoneNumber', '==', firstSOSAlert.phoneNumber)
          );
          
          const userSnapshot = await getDocs(userQuery);
          if (!userSnapshot.empty) {
            userDetails = userSnapshot.docs[0].data();
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }

        // Prepare guard details object
        let guardDetails = {};
        if (firstSOSAlert.employeeId && firstSOSAlert.status === 'ACKNOWLEDGED') {
          try {
            const guardQuery = query(
              collection(db, 'guardUser'), 
              where('employeeId', '==', firstSOSAlert.employeeId)
            );
            
            const guardSnapshot = await getDocs(guardQuery);
            if (!guardSnapshot.empty) {
              guardDetails = guardSnapshot.docs[0].data();
            }
          } catch (error) {
            console.error("Error fetching guard details:", error);
          }
        }
        
        // Transform Firestore data to match expected format
        const formattedSOSData = {
          id: alertDocId,
          flatNumber: `${firstSOSAlert.wing}-${firstSOSAlert.flatNumber}`,
          time: formatTime(firstSOSAlert.createdAt?.seconds * 1000),
          resolvedTime: firstSOSAlert.resolvedAt 
            ? formatTime(firstSOSAlert.resolvedAt.seconds * 1000) 
            : null,
          residentName: userDetails.firstName 
            ? `${userDetails.firstName} ${userDetails.lastName || ''}`.trim() 
            : firstSOSAlert.userName || '',
          residentPhone: firstSOSAlert.phoneNumber || '',
          guardName: guardDetails.firstName 
            ? `${guardDetails.firstName} ${guardDetails.lastName || ''}`.trim() 
            : '',
          guardPhone: guardDetails.phoneNumber || '',
          type: firstSOSAlert.type || '',
          status: mapStatusToDisplay(firstSOSAlert.status),
          wing: firstSOSAlert.wing || '',
          employeeId: firstSOSAlert.employeeId || '',
          resolved: firstSOSAlert.resolved || false,
          originalStatus: firstSOSAlert.status
        };

        // Show SOS alert 
        showSOS(formattedSOSData);
        
        // Start periodic status check for acknowledged alerts
        if (firstSOSAlert.status === 'ACKNOWLEDGED') {
          startPeriodicStatusCheck(alertDocId);
        }
      } else {
        // No active alerts
        setShowFullAlert(false);
        setShowMinimized(false);
        setSOSData(null);
        
        // Clear any existing interval
        if (statusCheckIntervalRef.current) {
          clearInterval(statusCheckIntervalRef.current);
        }
      }
    }, (error) => {
      console.error("Error fetching SOS alerts:", error);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
      if (statusCheckIntervalRef.current) {
        clearInterval(statusCheckIntervalRef.current);
      }
    };
  }, []);

  // Helper function to format time like in the UI
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const hours = date.getHours() % 12 || 12; // convert to 12-hour format
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    
    return `${hours} ${minutes} ${ampm}`;
  };

  // Map Firestore status to display status
  const mapStatusToDisplay = (status) => {
    switch(status) {
      case 'PENDING':
        return 'Awaiting Guard\'s Response';
      case 'ACKNOWLEDGED':
        return 'Guard Responding';
      default:
        return status;
    }
  };

  const showSOS = (data) => {
    setSOSData(data);
    setShowFullAlert(true);
    setShowMinimized(false);
  };

  const handleMinimize = () => {
    setShowFullAlert(false);
    if (sosData && sosData.originalStatus !== 'RESOLVED') {
      setShowMinimized(true);
    }
  };

  const handleMaximize = () => {
    setShowMinimized(false);
    setShowFullAlert(true);
  };

  return (
    <SOSContext.Provider
      value={{
        showSOS,
        updateSOSStatus: () => {} // Placeholder for potential future implementation
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
              status={sosData.status}
              type={sosData.type}
              wing={sosData.wing}
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