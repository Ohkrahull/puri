// import React, { useState, useEffect } from "react";
// import dayjs from "dayjs";
// import { fetchAllBookings } from "../firebase/services/bookingsData";

// const BookingsTable = ({ onTabChange }) => {
//   const [activeTab, setActiveTab] = useState("Amenities");
//   const [bookings, setBookings] = useState([]);
//   const [visibleBookings, setVisibleBookings] = useState([]);

//   useEffect(() => {
//     fetchAllBookings((fetchedBookings) => {
//       setBookings(fetchedBookings);
//       // Take only first 10 items
//       setVisibleBookings(fetchedBookings.slice(0, 10));
//     });
//   }, []);

//   const handleTabClick = (tab) => {
//     const newTab = tab === "Amenities" ? "Amenities" : "Services";
//     setActiveTab(newTab);
//     onTabChange?.(newTab);
//   };

//   // CSS to hide scrollbar but keep functionality
//   const hideScrollbarStyle = {
//     scrollbarWidth: "none" /* Firefox */,
//     msOverflowStyle: "none" /* Internet Explorer 10+ */,
//     "&::-webkit-scrollbar": {
//       width: "0",
//       height: "0",
//       display: "none",
//     },
//   };

//   const getAmenityStyle = (amenity) => {
//     switch (amenity?.toLowerCase()) {
//       case "gym":
//         return { backgroundColor: "#FFF1F2", color: "#9F1239" };
//       case "multi purpose court":
//         return { backgroundColor: "#F0FDF4", color: "#166534" };
//       case "banquet hall":
//         return { backgroundColor: "#FAF5FF", color: "#6B21A8" };
//       case "party hall":
//         return { backgroundColor: "#F7FEE7", color: "#65A30D" };
      
//         case 'jacuzzi & spa':
//           return { backgroundColor: '#ECFEFF', color: '#155E75' };

//           case 'indoor theatre':
//             return { backgroundColor: '#FDF2F8', color: '#9D174D' };

//             case 'movie lawn':
//               return { backgroundColor: '#F0FDF4', color: '#9A3412' };

//               case 'table tennis room':
//                 return { backgroundColor: '#FEFCE8', color: '#854D0E' };

//       case "swimming pool":
//         return { backgroundColor: "#EFF6FF", color: "#1E40AF" };
//       case "tennis court":
//         return { backgroundColor: "#F0FDF4", color: "#166534" };
//       case "mini theater":
//         return { backgroundColor: "#FFF1F2", color: "#9F1239" };
//       default:
//         return { backgroundColor: "#F3F4F6", color: "#4B5563" };
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg  flex flex-col h-[500px] border  border-gray-200">
//       {/* Header */}
//       <div className="px-6 pt-6 pb-4">
//         <h2 className="text-[16px] font-semibold mb-1">Recent Bookings</h2>
//         <p className="text-[12px] text-gray-500 mb-3 underline">
//           View all your recent bookings
//         </p>

//         {/* Tabs */}
//         <div className="flex gap-6 mt-6">
//           {["Amenities", "Services"].map((tab) => (
//             <span
//               key={tab}
//               onClick={() => handleTabClick(tab)}
//               className={`relative cursor-pointer  pb-2 text-[12px] font-medium mb-1 ${
//                 activeTab === tab
//                   ? "text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5  after:bg-gray-900 "
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               {tab}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* Table with scroll */}
//       <div className="flex-1 relative" style={hideScrollbarStyle}>
//         <table className="w-full border-collapse ">
//           <thead className="bg-gray-50 sticky top-0">
//             <tr className="border-y  border-gray-200">
//               <th
//                 className="text-left px-6 py-3 whitespace-nowrap text-md text-gray-500 font-medium"
//                 style={{ fontSize: "12px" }}
//               >
//                 Name
//               </th>
//               <th
//                 className="text-left px-6 py-3 whitespace-nowrap text-md text-gray-500 font-medium"
//                 style={{ fontSize: "12px" }}
//               >
//                 Flat Number
//               </th>
//               <th
//                 className="text-left px-6 py-3 whitespace-nowrap text-md text-gray-500 font-medium"
//                 style={{ fontSize: "12px" }}
//               >
//                 Date
//               </th>
//               <th
//                 className="text-left px-6 py-3 whitespace-nowrap text-md text-gray-500 font-medium"
//                 style={{ fontSize: "12px" }}
//               >
//                 Amenities
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {bookings.map((booking, index) => {
//               const fullName =
//                 `${booking.userDetails?.firstName || ""} ${
//                   booking.userDetails?.lastName || ""
//                 }`.trim() || "N/A";
//               return (
//                 <tr
//                   key={index}
//                   className="border-b border-gray-200 hover:bg-gray-50 h-4"
//                 >
//                   <td
//                     className="px-6  whitespace-nowrap py-4 text-md font-medium text-gray-900"
//                     style={{ fontSize: "14px" }}
//                   >
//                     {fullName}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">
//                     {`${booking.userDetails?.wing || "N/A"} - ${
//                       booking.userDetails?.flatNumber || "N/A"
//                     }`}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">
//                     {booking.date
//                       ? dayjs(booking.date.toDate()).format("D MMM, YYYY")
//                       : "N/A"}
//                   </td>
//                   <td className="px-6 py-4">
//                     <span
//                       className="inline-flex px-3 py-1 whitespace-nowrap text-medium font-medium rounded-xl"
//                       style={getAmenityStyle(booking.amenityName)}
//                     >
//                       {booking.amenityName || "N/A"}
//                     </span>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default BookingsTable;

import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { fetchAllBookings } from "../firebase/services/bookingsData";

const BookingsTable = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState("Amenities");
  const [bookings, setBookings] = useState([]);
  const [visibleBookings, setVisibleBookings] = useState([]);

  useEffect(() => {
    fetchAllBookings((fetchedBookings) => {
      setBookings(fetchedBookings);
      // Take only first 10 items
      setVisibleBookings(fetchedBookings.slice(0, 10));
    });
  }, []);

  const handleTabClick = (tab) => {
    const newTab = tab === "Amenities" ? "Amenities" : "Services";
    setActiveTab(newTab);
    onTabChange?.(newTab);
  };

  // CSS to hide scrollbar but keep functionality
  const hideScrollbarStyle = {
    scrollbarWidth: "none" /* Firefox */,
    msOverflowStyle: "none" /* Internet Explorer 10+ */,
    "&::-webkit-scrollbar": {
      width: "0",
      height: "0",
      display: "none",
    },
  };

  const getAmenityStyle = (amenity) => {
    switch (amenity?.toLowerCase()) {
      case "gym":
        return { backgroundColor: "#FFF1F2", color: "#9F1239" };
      case "multi purpose court":
        return { backgroundColor: "#F0FDF4", color: "#166534" };
      case "banquet hall":
        return { backgroundColor: "#FAF5FF", color: "#6B21A8" };
      case "party hall":
        return { backgroundColor: "#F7FEE7", color: "#65A30D" };
      case 'jacuzzi & spa':
        return { backgroundColor: '#ECFEFF', color: '#155E75' };
      case 'indoor theatre':
        return { backgroundColor: '#FDF2F8', color: '#9D174D' };
      case 'movie lawn':
        return { backgroundColor: '#F0FDF4', color: '#9A3412' };
      case 'table tennis room':
        return { backgroundColor: '#FEFCE8', color: '#854D0E' };
      case "swimming pool":
        return { backgroundColor: "#EFF6FF", color: "#1E40AF" };
      case "tennis court":
        return { backgroundColor: "#F0FDF4", color: "#166534" };
      case "mini theater":
        return { backgroundColor: "#FFF1F2", color: "#9F1239" };
      default:
        return { backgroundColor: "#F3F4F6", color: "#4B5563" };
    }
  };

  const getFlatInfo = (booking) => {
    // If the booking has specific flat info
    if (booking.userDetails?.currentFlat) {
      return `${booking.userDetails.currentFlat.wing || ""}-${booking.userDetails.currentFlat.flatNumber || ""}`;
    }
    
    // If booking.userDetails has flats.approved array
    if (booking.userDetails?.flats && Array.isArray(booking.userDetails.flats)) {
      // Get all flats from the approved array
      return booking.userDetails.flats.map(flat => 
        `${flat.wing || ""}-${flat.flatNumber || ""}`
      ).join(", ");
    }
    
    // Fallback to traditional way if structured data isn't available
    return `${booking.userDetails?.wing || "N/A"}-${booking.userDetails?.flatNumber || "N/A"}`;
  };

  return (
    <div className="bg-white rounded-lg flex flex-col h-[500px] border border-gray-200">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-[16px] font-semibold mb-1">Recent Bookings</h2>
        <p className="text-[12px] text-gray-500 mb-3 underline">
          View all your recent bookings
        </p>

        {/* Tabs */}
        <div className="flex gap-6 mt-6">
          {["Amenities", "Services"].map((tab) => (
            <span
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`relative cursor-pointer pb-2 text-[12px] font-medium mb-1 ${
                activeTab === tab
                  ? "text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>

      {/* Table with horizontal scroll on small screens */}
      <div className="flex-1 overflow-hidden">
        <div className="overflow-x-auto w-full h-full" style={hideScrollbarStyle}>
          <table className="w-full min-w-[640px] border-collapse">
            <thead className="bg-gray-50 sticky top-0">
              <tr className="border-y border-gray-200">
                <th
                  className="text-left px-6 py-3 whitespace-nowrap text-md text-gray-500 font-medium"
                  style={{ fontSize: "12px" }}
                >
                  Name
                </th>
                <th
                  className="text-left px-6 py-3 whitespace-nowrap text-md text-gray-500 font-medium"
                  style={{ fontSize: "12px" }}
                >
                  Flat Number
                </th>
                <th
                  className="text-left px-6 py-3 whitespace-nowrap text-md text-gray-500 font-medium"
                  style={{ fontSize: "12px" }}
                >
                  Date
                </th>
                <th
                  className="text-left px-6 py-3 whitespace-nowrap text-md text-gray-500 font-medium"
                  style={{ fontSize: "12px" }}
                >
                  Amenities
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => {
                const fullName =
                  `${booking.userDetails?.firstName || ""} ${
                    booking.userDetails?.lastName || ""
                  }`.trim() || "N/A";
                return (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50 h-4"
                  >
                    <td
                      className="px-6 whitespace-nowrap py-4 text-md font-medium text-gray-900"
                      style={{ fontSize: "14px" }}
                    >
                      {fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">
                    {getFlatInfo(booking)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">
                      {booking.date
                        ? dayjs(booking.date.toDate()).format("D MMM, YYYY")
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex px-3 py-1 whitespace-nowrap text-medium font-medium rounded-xl"
                        style={getAmenityStyle(booking.amenityName)}
                      >
                        {booking.amenityName || "N/A"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingsTable;