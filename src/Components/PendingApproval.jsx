


// import { useState, useEffect } from 'react';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { db } from '../firebase/firebase';
// import { useNavigate } from 'react-router-dom';
// const { ChevronRight } = require("lucide-react");
// const { default: DashboardCard } = require("./Dashboardcard");


// export const PendingApproval = () => {
//     const navigate = useNavigate();
//   const [counts, setCounts] = useState({
//     helpers: '',
//     rental: '',
//     support: ''
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Helper count
//         const helpersQuery = query(
//           collection(db, 'helpers'),
//           where('status', '==', 'pending')
//         );
//         const helpersSnapshot = await getDocs(helpersQuery);
//         const helpersCount = helpersSnapshot.docs.length;

//         // Support count
//         const supportQuery = query(
//           collection(db, 'support'),
//           where('status', '==', 'pending')
//         );
//         const supportSnapshot = await getDocs(supportQuery);
//         const supportCount = supportSnapshot.docs.length;

//         // Owner count
//         const ownerQuery = query(
//           collection(db, 'owner'),
//           where('status', '==', 'pending')
//         );
//         const ownerSnapshot = await getDocs(ownerQuery);
//         const ownerCount = ownerSnapshot.docs.length;

//         // Tenant count
//         const tenantQuery = query(
//           collection(db, 'tenant'),
//           where('status', '==', 'pending')
//         );
//         const tenantSnapshot = await getDocs(tenantQuery);
//         const tenantCount = tenantSnapshot.docs.length;

//         // Update counts
//         setCounts({
//           helpers: helpersCount > 0 ? helpersCount.toString() : '',
//           support: supportCount > 0 ? supportCount.toString() : '',
//           rental: (ownerCount + tenantCount) > 0 ? (ownerCount + tenantCount).toString() : ''
//         });

//         console.log('Fetched counts:', {
//           helpers: helpersCount,
//           support: supportCount,
//           owner: ownerCount,
//           tenant: tenantCount
//         });
//       } catch (error) {
//         console.error('Error in fetchData:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   const items = [
//     { type: 'Helper', count: counts.helpers, route:'/AddHelper' },
//     { type: 'Rental Request', count: counts.rental, route:'/Owner' },
//     { type: 'Support Ticket', count: counts.support, route:'/support' }
//   ];

//   const handleItemClick = (route) =>{
//     navigate(route)
//   }
//   return (
//     <DashboardCard>
//       <div className="space-y-6">
//         <h2 className="text-[16px] text-gray-900 font-medium">Pending Approval</h2>
        
//         <div className="space-y-4">
//           {items.map((item, index) => (
//             <div key={index}
//             onClick={()=> handleItemClick(item.route)}
//                  className="flex justify-between items-center py-2 cursor-pointer">
//               <div className="flex items-center gap-2">
//                 <span className="text-[14px] text-gray-900" 
//                       style={{color:'#333333'}}>
//                   {item.type}
//                 </span>
//                 {item.count && (
//                   <span className="px-2.5 py-0.5 bg-blue-500 text-white text-sm rounded-full">
//                     {item.count}
//                   </span>
//                 )}
//               </div>
//               <ChevronRight className="text-gray-400" size={18} />
//             </div>
//           ))}
//         </div>
//       </div>
//     </DashboardCard>
//   );
// };

// export default PendingApproval;
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from "lucide-react";
import DashboardCard from "./Dashboardcard";

export const PendingApproval = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    helpers: '',
    rental: '',
    support: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Helper count
        const helpersQuery = query(
          collection(db, 'helpers'),
          where('status', '==', 'pending')
        );
        const helpersSnapshot = await getDocs(helpersQuery);
        const helpersCount = helpersSnapshot.docs.length;

        // Support count
        const supportQuery = query(
          collection(db, 'support'),
          where('status', '==', 'pending')
        );
        const supportSnapshot = await getDocs(supportQuery);
        const supportCount = supportSnapshot.docs.length;

        // Rental Request count
        const rentalQuery = query(
          collection(db, 'rentalRequest'),
          where('status', '==', 'pending')
        );
        const rentalSnapshot = await getDocs(rentalQuery);
        const rentalCount = rentalSnapshot.docs.length;

        // Update counts
        setCounts({
          helpers: helpersCount > 0 ? helpersCount.toString() : '',
          support: supportCount > 0 ? supportCount.toString() : '',
          rental: rentalCount > 0 ? rentalCount.toString() : ''
        });

        console.log('Fetched counts:', {
          helpers: helpersCount,
          support: supportCount,
          rental: rentalCount
        });
      } catch (error) {
        console.error('Error in fetchData:', error);
      }
    };

    fetchData();
  }, []);

  const items = [
    { type: 'Helper', count: counts.helpers, route: '/AddHelper' },
    { type: 'Rental Request', count: counts.rental, route: '/Owner' },
    { type: 'Support Ticket', count: counts.support, route: '/support' }
  ];

  const handleItemClick = (route) => {
    navigate(route);
  };

  return (
    <DashboardCard>
      <div className="space-y-6">
        <h2 className="text-[16px] text-gray-900 font-medium">Pending Approval</h2>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => handleItemClick(item.route)}
              className="flex justify-between items-center py-2 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span
                  className="text-[14px] text-gray-900"
                  style={{ color: '#333333' }}
                >
                  {item.type}
                </span>
                {item.count && (
                  <span className="px-2.5 py-0.5 bg-blue-500 text-white text-sm rounded-full">
                    {item.count}
                  </span>
                )}
              </div>
              <ChevronRight className="text-gray-400" size={18} />
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
};

export default PendingApproval;