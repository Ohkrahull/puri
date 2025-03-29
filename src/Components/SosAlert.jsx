// import React from 'react';
// import { X } from 'lucide-react';
// import { FirstAid } from 'phosphor-react';

// const SOSAlertCard = ({ 
//   onClose, 
//   flatNumber,
//   time,
//   residentName,
//   residentPhone,
//   guardName,
//   guardPhone,
//   status ,
//   onMinimize 
// }) => {
//   const getStatusStyles = () => {
//     switch (status) {
//       case 'Awaiting Guard\'s Response':
//         return 'text-blue-500';
//       case 'Guard Responding':
//         return 'text-orange-500';
//       case 'SOS Resolved':
//         return 'text-green-500';
//       default:
//         return 'text-blue-500';
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" style={{fontFamily:'Plus_Jakarta',}}>
//       <div className="bg-white  rounded-3xl overflow-hidden">
//         {/* Header */}
//         <div className="flex justify-between items-center px-6 py-6" style={{backgroundColor:'#E237441A', borderBottom:'1px solid #CCCCCC'}}>
//             <span></span>
//           <h2 className="text-2xl font-bold">SOS Alert</h2>
//           <button onClick={onMinimize}  className="text-gray-500 hover:text-gray-700">
//             <X size={24} color='black' />
//           </button>
//         </div>

//         {/* Alert Type Card */}
//         <div className=" mx-6 mt-6 rounded-xl p-6" style={{backgroundColor:'#F3F3F3'}} >
//           <div className="flex items-center gap-3 mb-6">
//             <div className="w-10 h-10  rounded-full flex items-center justify-center"style={{backgroundColor:'rgba(226, 55, 68, 0.3)'}}>
//               {/* <span className="text-red-500 text-2xl">+</span> */}
//               <FirstAid size={18} weight="fill" color='#E23744' />
//             </div>
//             <span className="text-3xl font-bold">Medical Emergency Alert</span>
            
//           </div>
//           {/* <span  style={{borderBottom: '1px solid #FFF', width:'100%', height:'5px'}}></span> */}

//           <div className="h-[1px] bg-white w-full my-6"></div>
//           <div className="flex justify-between items-center">
//             <div>
//               <div className="text-gray-500 text-sm mb-1">Flat Number</div>
//               <div className="font-medium text-xl">{flatNumber}</div>
//             </div>
            
//             <div className="flex gap-2">
//               {time.split(' ').map((part, index) => (
//                 <div key={index} className="bg-white px-3 py-3 rounded font-semibold " style={{fontSize:'18px'}}>
//                   {part}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Resident Details */}
//         <div className="px-6 py-4">
//           <h3 className="font-medium mb-5" style={{fontSize:'14px'}}>Resident Details</h3>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <div className="text-gray-500 text-sm mb-2"  style={{fontSize:'14px'}}>SOS Triggered by</div>
//               <div className="font-medium"  style={{fontSize:'16px'}}>{residentName}</div>
//             </div>
//             <div>
//               <div className="text-gray-500 text-sm mb-2 "  style={{fontSize:'14px'}}>Resident Phone Number</div>
//               <div className="font-medium"  style={{fontSize:'16px'}}>{residentPhone}</div>
//             </div>
//           </div>
//         </div>

//         {/* Guard Details - Only show if status is not awaiting response */}
//         {status !== 'Awaiting Guard\'s Response' && (
//           <div className="px-6 py-4">
//             <h3 className="font-medium mb-4"  style={{fontSize:'14px'}}>Guard Details</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <div className="text-gray-500 text-sm mb-2"  style={{fontSize:'14px'}}>
//                   {status === 'SOS Resolved' ? 'SOS Resolved by' : 'SOS Acknowledged by'}
//                 </div>
//                 <div className="font-medium"  style={{fontSize:'16px'}}>{guardName}</div>
//               </div>
//               <div>
//                 <div className="text-gray-500 text-sm mb-2"  style={{fontSize:'14px'}}>Guard Phone Number</div>
//                 <div className="font-medium"  style={{fontSize:'16px'}}>{guardPhone}</div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Status */}
//         <div className="px-6 py-4">
//           <div className="flex items-center gap-2">
//             <span className="text-gray-500"  style={{fontSize:'16px'}}>Status:</span>
//             <span className={`font-medium ${getStatusStyles()}`}  style={{fontSize:'16px'}}>{status}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SOSAlertCard;
import React from 'react';
import { X } from 'lucide-react';
import { FirstAid } from 'phosphor-react';

const SOSAlertCard = ({ 
  onMinimize, 
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
        return 'text-orange-500';
      case 'SOS Resolved':
        return 'text-green-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" style={{fontFamily:'Plus_Jakarta'}}>
      <div className="bg-white rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-6" style={{backgroundColor:'#E237441A', borderBottom:'1px solid #CCCCCC'}}>
          <span></span>
          <h2 className="text-2xl font-bold">SOS Alert</h2>
          <button onClick={onMinimize} className="text-gray-500 hover:text-gray-700">
            <X size={24} color='black' />
          </button>
        </div>

        {/* Alert Type Card */}
        <div className="mx-6 mt-6 rounded-xl p-6" style={{backgroundColor:'#F3F3F3'}}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor:'rgba(226, 55, 68, 0.3)'}}>
              <FirstAid size={18} weight="fill" color='#E23744' />
            </div>
            <span className="text-3xl font-bold">Medical Emergency Alert</span>
          </div>

          <div className="h-[1px] bg-white w-full my-6"></div>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-gray-500 text-sm mb-1">Flat Number</div>
              <div className="font-medium text-xl">{flatNumber}</div>
            </div>
            
            <div className="flex gap-2">
              {time.split(' ').map((part, index) => (
                <div key={index} className="bg-white px-3 py-3 rounded font-semibold" style={{fontSize:'18px'}}>
                  {part}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resident Details */}
        <div className="px-6 py-4">
          <h3 className="font-medium mb-5" style={{fontSize:'14px'}}>Resident Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-gray-500 text-sm mb-2" style={{fontSize:'14px'}}>SOS Triggered by</div>
              <div className="font-medium" style={{fontSize:'16px'}}>{residentName}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-2" style={{fontSize:'14px'}}>Resident Phone Number</div>
              <div className="font-medium" style={{fontSize:'16px'}}>{residentPhone}</div>
            </div>
          </div>
        </div>

        {/* Guard Details - Only show if status is not awaiting response */}
        {status !== 'Awaiting Guard\'s Response' && (
          <div className="px-6 py-4">
            <h3 className="font-medium mb-4" style={{fontSize:'14px'}}>Guard Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-500 text-sm mb-2" style={{fontSize:'14px'}}>
                  {status === 'SOS Resolved' ? 'SOS Resolved by' : 'SOS Acknowledged by'}
                </div>
                <div className="font-medium" style={{fontSize:'16px'}}>{guardName}</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm mb-2" style={{fontSize:'14px'}}>Guard Phone Number</div>
                <div className="font-medium" style={{fontSize:'16px'}}>{guardPhone}</div>
              </div>
            </div>
          </div>
        )}

        {/* Status */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-500" style={{fontSize:'16px'}}>Status:</span>
            <span className={`font-medium ${getStatusStyles()}`} style={{fontSize:'16px'}}>{status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOSAlertCard;