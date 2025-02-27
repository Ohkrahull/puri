
// import React, { useState, useEffect } from 'react';
// import { collection, query, onSnapshot, getFirestore } from 'firebase/firestore';
// import { getApp } from 'firebase/app';

// const DashboardCard = ({ children }) => (
//   <div className="bg-white rounded-lg p-6 border  border-gray-200">
//     {children}
//   </div>
// );

// export const TotalFlats = () => {
//   const [flatStats, setFlatStats] = useState({
//     total: 0,
//     ownerResiding: 0,
//     tenant: 0,
//     vacant: 0
//   });

//   useEffect(() => {
//     const db = getFirestore(getApp());
//     const registrationsQuery = query(collection(db, 'registrations'));
    
//     const unsubscribe = onSnapshot(registrationsQuery, (snapshot) => {
//       let stats = {
//         total: snapshot.docs.length,
//         ownerResiding: 0,
//         tenant: 0,
//         vacant: 0
//       };

//       snapshot.docs.forEach(doc => {
//         const registration = doc.data();
//         const owners = registration.owners || [];
//         const tenants = registration.tenants || [];

//         const hasResidingOwner = owners.some(owner => owner.isResiding === true);
//         const hasResidingTenant = tenants.some(tenant => tenant.isResiding === true);

//         if (hasResidingOwner) {
//           stats.ownerResiding++;
//         } else if (hasResidingTenant) {
//           stats.tenant++;
//         } else {
//           stats.vacant++;
//         }
//       });

//       setFlatStats(stats);
//     });

//     return () => unsubscribe();
//   }, []);

//   const flats = [
//     { type: 'Owner Residing', count: String(flatStats.ownerResiding).padStart(2, '0'), color: 'bg-[#EEF2FF]' },
//     { type: 'Tenant', count: String(flatStats.tenant).padStart(2, '0'), color: 'bg-[#3B82F6]' },
//     { type: 'Vacant', count: String(flatStats.vacant).padStart(2, '0'), color: 'bg-[#1D4ED8]' }
//   ];

//   return (
//     <DashboardCard>
//       <div className="space-y-6">
//         <div className="flex justify-between items-start">
//           <h2 className="text-[16px] text-gray-900 font-medium">Total Flats</h2>
//           <span className="text-[16px] font-medium text-gray-900 leading-none">
//             {flatStats.total}
//           </span>
//         </div>
        
//         {/* Updated graph section */}
//         <div className="relative h-7">
//           <div className="absolute left-0 w-[45%] h-full rounded-md bg-[#EEF2FF]" />
//           <div className="absolute left-[48%] w-[35%] h-full rounded-md bg-[#3B82F6]" />
//           <div className="absolute left-[86%] w-[14%] h-full rounded-md bg-[#1D4ED8]" />
//         </div>
        
//         <div className="space-y-4">
//           {flats.map((flat, index) => (
//             <div key={index} className="flex justify-between items-center">
//               <div className="flex items-center gap-2">
//                 <div className={`w-2.5 h-2.5 rounded-full ${flat.color}`} />
//                 <span className="text-[14px] text-gray-600" style={{color:'#333333'}}>
//                   {flat.type}
//                 </span>
//               </div>
//               <span className="text-[15px] font-medium text-gray-900">
//                 {flat.count}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </DashboardCard>
//   );
// };

// export default TotalFlats;
import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, getFirestore } from 'firebase/firestore';
import { getApp } from 'firebase/app';

const DashboardCard = ({ children }) => (
  <div className="bg-white rounded-lg p-6 border border-gray-200">
    {children}
  </div>
);

export const TotalFlats = () => {
  const [flatStats, setFlatStats] = useState({
    total: 0,
    ownerResiding: 0,
    tenant: 0,
    vacant: 0
  });

  useEffect(() => {
    const db = getFirestore(getApp());
    const flatsQuery = query(collection(db, 'flats'));

    const unsubscribe = onSnapshot(flatsQuery, (snapshot) => {
      let stats = {
        total: snapshot.docs.length,
        ownerResiding: 0,
        tenant: 0,
        vacant: 0
      };

      snapshot.docs.forEach(doc => {
        const flatData = doc.data();
        const users = flatData.users || [];

        // Check flat's vacancy status
        if (flatData.isVacant) {
          stats.vacant++;
        } else {
          // Check for residing status in users
          const hasResidingOwner = users.some(user => 
            user.isResiding && (user.role === 'owner' || user.role === 'primary_owner')
          );

          const hasResidingTenant = users.some(user => 
            user.isResiding && (user.role === 'tenant' || user.role === 'primary_tenant')
          );

          if (hasResidingOwner) {
            stats.ownerResiding++;
          } else if (hasResidingTenant) {
            stats.tenant++;
          }
        }
      });

      setFlatStats(stats);
    });

    return () => unsubscribe();
  }, []);

  const flats = [
    { type: 'Owner Residing', count: String(flatStats.ownerResiding).padStart(2, '0'), color: 'bg-[#EEF2FF]' },
    { type: 'Tenant', count: String(flatStats.tenant).padStart(2, '0'), color: 'bg-[#3B82F6]' },
    { type: 'Vacant', count: String(flatStats.vacant).padStart(2, '0'), color: 'bg-[#1D4ED8]' }
  ];

  return (
    <DashboardCard>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <h2 className="text-[16px] text-gray-900 font-medium">Total Flats</h2>
          <span className="text-[16px] font-medium text-gray-900 leading-none">
            {flatStats.total}
          </span>
        </div>

        <div className="relative h-7">
          <div className="absolute left-0 w-[45%] h-full rounded-md bg-[#EEF2FF]" />
          <div className="absolute left-[48%] w-[35%] h-full rounded-md bg-[#3B82F6]" />
          <div className="absolute left-[86%] w-[14%] h-full rounded-md bg-[#1D4ED8]" />
        </div>

        <div className="space-y-4">
          {flats.map((flat, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${flat.color}`} />
                <span className="text-[14px] text-gray-600" style={{color:'#333333'}}>
                  {flat.type}
                </span>
              </div>
              <span className="text-[15px] font-medium text-gray-900">
                {flat.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
};

export default TotalFlats;