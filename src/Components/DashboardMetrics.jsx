import React from 'react';
import { ChevronRight } from 'lucide-react';
import { CurrentVisitors } from './CurrentVisitor';
import { TotalFlats } from './TotalFlats';
import { PendingApproval } from './PendingApproval';



// const CurrentVisitors = () => {
//   const visitors = [
//     { type: 'Guest', count: '08' },
//     { type: 'Delivery', count: '12' },
//     { type: 'Cab', count: '09' },
//     { type: 'Other', count: '18' }
//   ];

//   return (
//     <DashboardCard>
//       <div className="space-y-6 ">
//         <h2 className="text-[16px] text-gray-900 font-medium">Current Visitors</h2>
        
//         <div className="flex items-end gap-9">
//           <div>
//             <div className="text-[36px] font-medium text-gray-900 leading-none">25</div>
//             <p className="text-[12px] text-gray-500 mt-2" style={{color: "var(--Puri-Grays-Gray---8, #333)"}}>In complex</p>
//           </div>

//           <div className="flex items-end gap-4 pb-1">
//             {visitors.map((visitor, index) => (
//               <div key={index} className="flex flex-col items-center">
//                 <div className="text-[15px] text-gray-500 mb-2">{visitor.count}</div>
//                 <div 
//                   className="w-12 bg-blue-500 rounded-md"
//                   style={{ height: `${parseInt(visitor.count) * 4}px` }}
//                 />
//                 <div className="text-[13px] text-gray-500 mt-2">{visitor.type}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </DashboardCard>
//   );
// };

// const TotalFlats = () => {
//   const flats = [
//     { type: 'Owner Residing', count: '04', color: 'bg-blue-100' },
//     { type: 'Tenant', count: '09', color: 'bg-blue-500' },
//     { type: 'Vacant', count: '04', color: 'bg-blue-700' }
//   ];

//   return (
//     <DashboardCard>
//       <div className="space-y-6">
//         <div className="flex justify-between items-start">
//           <h2 className="text-[16px] text-gray-900 font-medium">Total Flats</h2>
//           <span className="text-[16px] font-medium text-gray-900 leading-none">120</span>
//         </div>

//         <div className="flex w-full h-7 rounded-md overflow-hidden">
//           {flats.map((flat, index) => (
//             <div key={index} className={`flex-1 ${flat.color}`} />
//           ))}
//         </div>

//         <div className="space-y-4">
//           {flats.map((flat, index) => (
//             <div key={index} className="flex justify-between items-center">
//               <div className="flex items-center gap-2">
//                 <div className={`w-2.5 h-2.5 rounded-full ${flat.color}`} />
//                 <span className="text-[14px] text-gray-600" style={{color:'#333333'}}>{flat.type}</span>
//               </div>
//               <span className="text-[15px] font-medium text-gray-900">{flat.count}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </DashboardCard>
//   );
// };

// const PendingApproval = () => {
//   const items = [
//     { type: 'Helper', count: '10' },
//     { type: 'Rental Request', count: '' },
//     { type: 'Support Ticket', count: '32' }
//   ];

//   return (
//     <DashboardCard>
//       <div className="space-y-6">
//         <h2 className="text-[16px] text-gray-900 font-medium">Pending Approval</h2>

//         <div className="space-y-4">
//           {items.map((item, index) => (
//             <div key={index} 
//               className="flex justify-between items-center py-2 cursor-pointer">
//               <div className="flex items-center gap-2">
//                 <span className="text-[14px] text-gray-900" style={{color:'#333333'}}>{item.type}</span>
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

const DashboardMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <CurrentVisitors />
      <TotalFlats />
      <PendingApproval />
    </div>
  );
};

export default DashboardMetrics;