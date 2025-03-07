
// // import React, { useState, useEffect } from 'react';
// // import { collection, query, onSnapshot, getFirestore, orderBy } from 'firebase/firestore';
// // import { getApp } from 'firebase/app';

// // const DashboardCard = ({ children }) => (
// //   <div className="space-y-6 bg-white rounded-lg p-6">
// //     {children}
// //   </div>
// // );

// // export const CurrentVisitors = () => {
// //   const [visitorStats, setVisitorStats] = useState({
// //     total: 0,
// //     guest: 0,
// //     delivery: 0,
// //     cab: 0,
// //     other: 0
// //   });

// //   useEffect(() => {
// //     const db = getFirestore(getApp());
// //     const visitorQuery = query(collection(db, 'visitors'), orderBy('createdAt', 'desc'));
    
// //     const unsubscribe = onSnapshot(visitorQuery, (snapshot) => {
// //       const counts = {
// //         guest: 0,
// //         delivery: 0,
// //         cab: 0,
// //         other: 0
// //       };

// //       snapshot.docs.forEach(doc => {
// //         const visitor = doc.data();
// //         if (visitor.current === true && visitor.status?.toLowerCase() === 'approved') {
// //           const purpose = visitor.purpose?.toLowerCase();
// //           if (purpose in counts) {
// //             counts[purpose]++;
// //           } else {
// //             counts.other++;
// //           }
// //         }
// //       });

// //       const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
      
// //       setVisitorStats({
// //         ...counts,
// //         total
// //       });
// //     });

// //     return () => unsubscribe();
// //   }, []);

// //   const visitors = [
// //     { type: 'Guest', count: String(visitorStats.guest).padStart(2, '0') },
// //     { type: 'Delivery', count: String(visitorStats.delivery).padStart(2, '0') },
// //     { type: 'Cab', count: String(visitorStats.cab).padStart(2, '0') },
// //     { type: 'Other', count: String(visitorStats.other).padStart(2, '0') }
// //   ];

// //   return (
// //     <DashboardCard>
// //       <h2 className="text-[16px] text-gray-900 font-medium">Current Visitors</h2>
      
// //       <div className="flex items-end gap-8">
// //         <div>
// //           <div className="text-[36px] font-medium text-gray-900 leading-none">
// //             {visitorStats.total}
// //           </div>
// //           <p className="text-[12px] text-gray-500 mt-2" style={{color: "var(--Puri-Grays-Gray---8, #333)"}}>
// //             In complex
// //           </p>
// //         </div>
        
// //         <div className="flex items-end gap-4 pb-1">
// //           {visitors.map((visitor, index) => (
// //             <div key={index} className="flex flex-col items-center">
// //               <div className="text-[15px] text-gray-500 mb-2">
// //                 {visitor.count}
// //               </div>
// //               <div
// //                 className="w-12 bg-blue-500 rounded-md"
// //                 style={{ height: `${parseInt(visitor.count) * 4}px` }}
// //               />
// //               <div className="text-[13px] text-gray-500 mt-2">
// //                 {visitor.type}
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </DashboardCard>
// //   );
// // };

// // export default CurrentVisitors;

// import React, { useState, useEffect } from 'react';
// import { collection, query, onSnapshot, getFirestore, orderBy } from 'firebase/firestore';
// import { getApp } from 'firebase/app';

// const DashboardCard = ({ children }) => (
//   <div className="space-y-6 bg-white rounded-lg p-6 border  border-gray-200">
//     {children}
//   </div>
// );

// export const CurrentVisitors = () => {
//   const [visitorStats, setVisitorStats] = useState({
//     total: 0,
//     guest: 0,
//     delivery: 0,
//     cab: 0,
//     other: 0
//   });

//   useEffect(() => {
//     const db = getFirestore(getApp());
//     const visitorQuery = query(collection(db, 'visitors'), orderBy('createdAt', 'desc'));
    
//     const unsubscribe = onSnapshot(visitorQuery, (snapshot) => {
//       const counts = {
//         guest: 0,
//         delivery: 0,
//         cab: 0,
//         other: 0
//       };

//       snapshot.docs.forEach(doc => {
//         const visitor = doc.data();
//         if (visitor.current === true && visitor.status?.toLowerCase() === 'approved') {
//           const purpose = visitor.purpose?.toLowerCase();
//           if (purpose in counts) {
//             counts[purpose]++;
//           } else {
//             counts.other++;
//           }
//         }
//       });

//       const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
      
//       setVisitorStats({
//         ...counts,
//         total
//       });
//     });

//     return () => unsubscribe();
//   }, []);

//   const visitors = [
//     { type: 'Guest', count: String(visitorStats.guest).padStart(2, '0') },
//     { type: 'Delivery', count: String(visitorStats.delivery).padStart(2, '0') },
//     { type: 'Cab', count: String(visitorStats.cab).padStart(2, '0') },
//     { type: 'Other', count: String(visitorStats.other).padStart(2, '0') }
//   ];

//   // Find the maximum count to calculate relative heights
//   const maxCount = Math.max(...visitors.map(v => parseInt(v.count)), 1);
//   const maxHeight = 100; // Fixed maximum height in pixels

//   return (
//     <DashboardCard>
//       <h2 className="text-[16px] text-gray-900 font-medium">Current Visitors</h2>
      
//       <div className="flex justify-between items-end   gap-8">
//         <div className=''>
//           <div className="text-[36px] font-medium text-gray-900 leading-none">
//             {visitorStats.total}
//           </div>
//           <p className="text-[12px] text-gray-500 mt-2" style={{color: "var(--Puri-Grays-Gray---8, #333)"}}>
//             In complex
//           </p>
//         </div>
        
//         <div className="flex  gap-4 ">
//           {visitors.map((visitor, index) => (
//             <div key={index} className="flex flex-col items-center">
//               <div className="text-[15px] text-gray-500 mb-2">
//                 {visitor.count}
//               </div>
//               <div className="relative h-[100px] flex items-end">
//                 <div
//                   className="w-12 bg-blue-500 rounded-md transition-all duration-300"
//                   style={{ 
//                     height: `${Math.max((parseInt(visitor.count) / maxCount) * maxHeight, 4)}px`
//                   }}
//                 />
//               </div>
//               <div className="text-[13px] text-gray-500 mt-2">
//                 {visitor.type}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </DashboardCard>
//   );
// };

// export default CurrentVisitors;
import React, { useState, useEffect, useRef } from 'react';
import { collection, query, onSnapshot, getFirestore, orderBy } from 'firebase/firestore';
import { getApp } from 'firebase/app';

const DashboardCard = ({ children }) => (
  <div className="space-y-6 bg-white rounded-lg p-6 border border-gray-200">
    {children}
  </div>
);

export const CurrentVisitors = () => {
  const [visitorStats, setVisitorStats] = useState({
    total: 0,
    guest: 0,
    delivery: 0,
    cab: 0,
    other: 0
  });
  
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Update container width on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    // Initial width calculation
    updateWidth();

    // Update on resize
    const handleResize = () => {
      updateWidth();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const db = getFirestore(getApp());
    const visitorQuery = query(collection(db, 'visitors'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(visitorQuery, (snapshot) => {
      const counts = {
        guest: 0,
        delivery: 0,
        cab: 0,
        other: 0
      };

      snapshot.docs.forEach(doc => {
        const visitor = doc.data();
        if (visitor.current === true && visitor.status?.toLowerCase() === 'approved') {
          const purpose = visitor.purpose?.toLowerCase();
          if (purpose in counts) {
            counts[purpose]++;
          } else {
            counts.other++;
          }
        }
      });

      const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
      
      setVisitorStats({
        ...counts,
        total
      });
    });

    return () => unsubscribe();
  }, []);

  const visitors = [
    { type: 'Guest', count: String(visitorStats.guest).padStart(2, '0') },
    { type: 'Delivery', count: String(visitorStats.delivery).padStart(2, '0') },
    { type: 'Cab', count: String(visitorStats.cab).padStart(2, '0') },
    { type: 'Other', count: String(visitorStats.other).padStart(2, '0') }
  ];

  // Find the maximum count to calculate relative heights
  const maxCount = Math.max(...visitors.map(v => parseInt(v.count)), 1);
  
  // Determine if we need to switch to stacked layout
  // This threshold can be adjusted based on your content size requirements
  const isSmallScreen = containerWidth < 250;
  
  // Responsive adjustments based on container width
  const getResponsiveValues = () => {
    if (isSmallScreen) {
      return {
        maxHeight: 80,
        barWidth: 'w-8',
        countSize: 'text-[12px]',
        typeSize: 'text-[11px]',
        totalSize: 'text-[32px]',
        complexSize: 'text-[12px]',
        barGap: 'gap-1',
      };
    } else {
      return {
        maxHeight: 100,
        barWidth: 'w-10',
        countSize: 'text-[15px]',
        typeSize: 'text-[12px]',
        totalSize: 'text-[36px]',
        complexSize: 'text-[12px]',
        barGap: 'gap-4',
      };
    }
  };

  const {
    maxHeight,
    barWidth,
    countSize,
    typeSize,
    totalSize,
    complexSize,
    barGap
  } = getResponsiveValues();

  return (
    <DashboardCard>
      <div ref={containerRef} className="w-full">
        <h2 className="text-[16px] text-gray-900 font-medium">Current Visitors</h2>
        
        <div className={`${isSmallScreen ? 'flex flex-col space-y-6' : 'flex justify-between items-end'}`}>
          <div className={isSmallScreen ? '' : ''}>
            <div className={`${totalSize} font-medium text-gray-900 leading-none`}>
              {visitorStats.total}
            </div>
            <p className={`${complexSize} text-gray-500 mt-2`} style={{color: "var(--Puri-Grays-Gray---8, #333)"}}>
              In complex
            </p>
          </div>
          
          <div className={`flex ${isSmallScreen ? 'justify-between' : ''} ${barGap}`}>
            {visitors.map((visitor, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`${countSize} text-gray-500 mb-2`}>
                  {visitor.count}
                </div>
                <div className={`relative h-[${maxHeight}px] flex items-end`}>
                  <div
                    className={`${barWidth} bg-blue-500 rounded-md transition-all duration-300`}
                    style={{ 
                      height: `${Math.max((parseInt(visitor.count) / maxCount) * maxHeight, 4)}px`
                    }}
                  />
                </div>
                <div className={`${typeSize} text-gray-500 mt-2`}>
                  {visitor.type}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default CurrentVisitors;