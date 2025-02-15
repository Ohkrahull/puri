import React, { useState } from "react";
import styles from "./CustomScrollbar.module.css";
import SearchInput from "../Buttons/SearchInput";
import SortButton from "../Buttons/Sortdate";

const AdminBookingTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // This should be calculated based on your actual data

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  const hideScrollbarStyle = {
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  };

  const bookings = [
    {
      name: "Marvin McKinney",
      slotTime: "9:00-10:00 am",
      slotDate: "8 Sep, 2020",
      amenity: "Swimming pool",
    },
    {
      name: "Jane Cooper",
      slotTime: "11:00-12:00 pm",
      slotDate: "9 Sep, 2020",
      amenity: "Tennis court",
    },
    {
      name: "Robert Fox",
      slotTime: "2:00-3:00 pm",
      slotDate: "10 Sep, 2020",
      amenity: "Gym",
    },
    {
      name: "Jenny Wilson",
      slotTime: "4:00-5:00 pm",
      slotDate: "11 Sep, 2020",
      amenity: "Yoga studio",
    },
    {
      name: "Wade Warren",
      slotTime: "10:00-11:00 am",
      slotDate: "12 Sep, 2020",
      amenity: "Swimming pool",
    },
    {
      name: "Esther Howard",
      slotTime: "1:00-2:00 pm",
      slotDate: "13 Sep, 2020",
      amenity: "Tennis court",
    },
    {
      name: "Cameron Williamson",
      slotTime: "3:00-4:00 pm",
      slotDate: "14 Sep, 2020",
      amenity: "Gym",
    },
    {
      name: "Brooklyn Simmons",
      slotTime: "5:00-6:00 pm",
      slotDate: "15 Sep, 2020",
      amenity: "Yoga studio",
    },
    {
      name: "Leslie Alexander",
      slotTime: "9:30-10:30 am",
      slotDate: "16 Sep, 2020",
      amenity: "Swimming pool",
    },
    {
      name: "Guy Hawkins",
      slotTime: "11:30-12:30 pm",
      slotDate: "17 Sep, 2020",
      amenity: "Tennis court",
    },
  ];

  const getAmenityStyle = (amenity) => {
    switch (amenity) {
      case "Swimming pool":
        return {
          backgroundColor: "var(--Blue-25, #EFF6FF)",
          color: "var(--Blue-700, #1E40AF)",
        };
      case "Tennis court":
        return {
          backgroundColor: "var(--Emerald-25, #F0FDF4)",
          color: "var(--Emerald-700, #166534)",
        };
      case "Mini theater":
        return {
          backgroundColor: "var(--Rose-25, #FFF1F2)",
          color: "var(--Rose-700, #9F1239)",
        };
      default:
        return { backgroundColor: "#F3F4F6", color: "#4B5563" }; // Default gray styling
    }
  };

  return (
    <div className="mt-1 bg-white border rounded-lg overflow-hidden flex flex-col">
      <div className="sticky top-0 z-10 bg-white">
      <div className="flex justify-between p-6">
          <div>
            <SearchInput/>
          </div>
          <div className='flex justify-end'>
            <button className='ml-[120px]' style={{display:'flex',padding:'8px 16px', justifyContent:'center', alignItems:'center', border:'1px solid #D1D5DB',borderRadius:'10px', color:'#6B7280', fontSize:'16px', fontFamily:'Plus_Jakarta'}}>
              <span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M9.19254 13.3078C9.25065 13.3659 9.29674 13.4348 9.3282 13.5107C9.35965 13.5865 9.37584 13.6679 9.37584 13.75C9.37584 13.8321 9.35965 13.9135 9.3282 13.9893C9.29674 14.0652 9.25065 14.1341 9.19254 14.1922L6.69254 16.6922C6.63449 16.7503 6.56556 16.7964 6.48969 16.8279C6.41381 16.8593 6.33248 16.8755 6.25035 16.8755C6.16821 16.8755 6.08688 16.8593 6.01101 16.8279C5.93514 16.7964 5.86621 16.7503 5.80816 16.6922L3.30816 14.1922C3.25009 14.1341 3.20403 14.0652 3.1726 13.9893C3.14118 13.9134 3.125 13.8321 3.125 13.75C3.125 13.6679 3.14118 13.5866 3.1726 13.5107C3.20403 13.4348 3.25009 13.3659 3.30816 13.3078C3.42544 13.1905 3.5845 13.1247 3.75035 13.1247C3.83247 13.1247 3.91379 13.1408 3.98966 13.1723C4.06553 13.2037 4.13447 13.2497 4.19253 13.3078L5.62535 14.7414V3.75C5.62535 3.58424 5.6912 3.42527 5.80841 3.30806C5.92562 3.19085 6.08459 3.125 6.25035 3.125C6.41611 3.125 6.57508 3.19085 6.69229 3.30806C6.8095 3.42527 6.87535 3.58424 6.87535 3.75V14.7414L8.30816 13.3078C8.36621 13.2497 8.43514 13.2036 8.51101 13.1722C8.58688 13.1407 8.66821 13.1245 8.75035 13.1245C8.83248 13.1245 8.91381 13.1407 8.98969 13.1722C9.06556 13.2036 9.13449 13.2497 9.19254 13.3078Z" fill="#6B7280"/>
              </svg></span>
              Sort Amentities 
              <span>
                <svg className='w-5 h-5 ml-6' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.2345 7.06754L9.98453 13.3175C9.92648 13.3756 9.85755 13.4217 9.78168 13.4532C9.7058 13.4847 9.62447 13.5008 9.54234 13.5008C9.46021 13.5008 9.37888 13.4847 9.303 13.4532C9.22713 13.4217 9.1582 13.3756 9.10015 13.3175L2.85015 7.06754C2.73288 6.95026 2.66699 6.7912 2.66699 6.62535C2.66699 6.4595 2.73288 6.30044 2.85015 6.18316C2.96743 6.06588 3.12649 6 3.29234 6C3.45819 6 3.61725 6.06588 3.73453 6.18316L9.54234 11.9918L15.3502 6.18316C15.4082 6.12509 15.4772 6.07903 15.553 6.0476C15.6289 6.01617 15.7102 6 15.7923 6C15.8745 6 15.9558 6.01617 16.0317 6.0476C16.1075 6.07903 16.1765 6.12509 16.2345 6.18316C16.2926 6.24123 16.3387 6.31017 16.3701 6.38604C16.4015 6.46191 16.4177 6.54323 16.4177 6.62535C16.4177 6.70747 16.4015 6.78879 16.3701 6.86466C16.3387 6.94053 16.2926 7.00947 16.2345 7.06754Z" fill="#6B7280"/>
                </svg>
              </span>
            </button>
            <SortButton/>
            <button className='flex text-end justify-end ml-[10px]' style={{display:'flex',padding:'8px 16px', justifyContent:'center', alignItems:'center', border:'1px solid #D1D5DB',borderRadius:'10px', color:'#6B7280', fontSize:'16px', fontFamily:'Plus_Jakarta'}}>
              Filter
            </button>
          </div>
        </div>
         <table className="w-full text-sm text-gray-500">
          <thead className="text-xs text-gray-500 bg-gray-50" style={{fontSize:'12px'}}>
            <tr className="border-y">
              <th scope="col" className="p-4 w-4">
                <div className="flex items-center justify-center">
                  <span style={{width:'20px', height:'20px', padding:'1px', border:'1px solid #6B7280', borderRadius:'6px'}}></span>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left" style={{fontSize:'12px'}}>
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left">
                <div className="flex items-center">
                  Slot time
                  <svg className="ml-2" xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                    <path d="M8.66699 3.66667V12M8.66699 12L4.66699 8M8.66699 12L12.667 8" stroke="#4B5563" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left">
                <div className="flex items-center">
                  Slot date
                  <svg className="ml-2" xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                    <path d="M8.66699 3.66667V12M8.66699 12L4.66699 8M8.66699 12L12.667 8" stroke="#4B5563" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left">
                Amenities
              </th>
              <th scope="col" className="px-6 py-3 text-right">
                Delete All
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div className="overflow-x-auto flex-grow">
      <div className="max-h-[430px] overflow-y-auto" style={hideScrollbarStyle}>
      <table className="w-full text-sm text-gray-500">
      <tbody>
              {bookings.map((booking, index) => (
                <tr
                  key={index}
                  className="bg-white border-b hover:bg-gray-50"
                  style={{ fontSize: "14px" }}
                >
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <span
                        style={{
                          width: "20px",
                          height: "20px",
                          padding: "1px",
                          marginLeft: "10px",
                          border: "1px solid #6B7280",
                          gap: "8px",
                          alignItems: "center",
                          borderRadius: "6px",
                        }}
                      ></span>
                    </div>
                  </td>
                  <th
                    scope="row"
                    className="px-6 flex text-start py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {booking.name}
                  </th>
                  <td className="px-6 py-4">{booking.slotTime}</td>
                  <td className="px-6 py-4">{booking.slotDate}</td>
                  <td className="px-6 py-4">
                    <span
                      className="text-center align-baseline inline-flex px-4 py-3 mr-auto items-center font-semibold text-[.95rem] leading-none rounded-lg"
                      style={{
                        padding: "4px 12px",
                        fontSize: "12px",
                        ...getAmenityStyle(booking.amenity),
                      }}
                    >
                      {booking.amenity}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-end mt-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.7586 5.73201L14.268 2.24061C14.1519 2.1245 14.0141 2.0324 13.8624 1.96957C13.7107 1.90673 13.5482 1.87439 13.384 1.87439C13.2198 1.87439 13.0572 1.90673 12.9056 1.96957C12.7539 2.0324 12.6161 2.1245 12.5 2.24061L2.86641 11.875C2.74983 11.9906 2.65741 12.1283 2.59451 12.28C2.5316 12.4317 2.49948 12.5944 2.50001 12.7586V16.25C2.50001 16.5815 2.6317 16.8994 2.86612 17.1339C3.10054 17.3683 3.41849 17.5 3.75001 17.5H7.24141C7.40563 17.5005 7.5683 17.4684 7.71999 17.4055C7.87168 17.3426 8.00935 17.2502 8.12501 17.1336L17.7586 7.49998C17.8747 7.3839 17.9668 7.24609 18.0296 7.09442C18.0925 6.94274 18.1248 6.78017 18.1248 6.616C18.1248 6.45182 18.0925 6.28925 18.0296 6.13758C17.9668 5.9859 17.8747 5.84809 17.7586 5.73201ZM7.24141 16.25H3.75001V12.7586L10.625 5.88358L14.1164 9.37498L7.24141 16.25ZM15 8.49061L11.5086 4.99998L13.3836 3.12498L16.875 6.61561L15 8.49061Z"
                        fill="#6B7280"
                      />
                    </svg>
                    <svg
                      className="ml-6"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.875 3.75H3.125C2.95924 3.75 2.80027 3.81585 2.68306 3.93306C2.56585 4.05027 2.5 4.20924 2.5 4.375C2.5 4.54076 2.56585 4.69973 2.68306 4.81694C2.80027 4.93415 2.95924 5 3.125 5H3.75V16.25C3.75 16.5815 3.8817 16.8995 4.11612 17.1339C4.35054 17.3683 4.66848 17.5 5 17.5H15C15.3315 17.5 15.6495 17.3683 15.8839 17.1339C16.1183 16.8995 16.25 16.5815 16.25 16.25V5H16.875C17.0408 5 17.1997 4.93415 17.3169 4.81694C17.4342 4.69973 17.5 4.54076 17.5 4.375C17.5 4.20924 17.4342 4.05027 17.3169 3.93306C17.1997 3.81585 17.0408 3.75 16.875 3.75ZM15 16.25H5V5H15V16.25ZM6.25 1.875C6.25 1.70924 6.31585 1.55027 6.43306 1.43306C6.55027 1.31585 6.70924 1.25 6.875 1.25H13.125C13.2908 1.25 13.4497 1.31585 13.5669 1.43306C13.6842 1.55027 13.75 1.70924 13.75 1.875C13.75 2.04076 13.6842 2.19973 13.5669 2.31694C13.4497 2.43415 13.2908 2.5 13.125 2.5H6.875C6.70924 2.5 6.55027 2.43415 6.43306 2.31694C6.31585 2.19973 6.25 2.04076 6.25 1.875Z"
                        fill="#EF4444"
                      />
                    </svg>
                  </td>
                </tr>
              ))}
            </tbody>
      </table>
      </div>
      {/* <div className="overflow-x-auto">
        <div
          className="max-h-[430px] overflow-y-auto"
          style={hideScrollbarStyle}
        >
          <table className="w-full text-sm text-gray-500">
            <thead
              className="text-xs text-gray-500 bg-gray-50 sticky top-0 z-10"
              style={{ fontSize: "12px" }}
            >
              <tr className="border-y">
                <th scope="col" className="justify-center text-center">
                  <div className="flex items-center justify-center text-center mt-1">
                    <span
                      style={{
                        width: "20px",
                        height: "20px",
                        padding: "1px",
                        marginLeft: "10px",
                        border: "1px solid #6B7280",
                        gap: "8px",
                        alignItems: "center",
                        borderRadius: "6px",
                      }}
                    ></span>
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-start"
                  style={{ fontSize: "12px" }}
                >
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className="flex text-center items-center">
                    Slot time
                    <svg
                      className="ml-2"
                      xmlns="http://www.w3.org/2000/svg"
                      width="17"
                      height="16"
                      viewBox="0 0 17 16"
                      fill="none"
                    >
                      <path
                        d="M8.66699 3.66667V12M8.66699 12L4.66699 8M8.66699 12L12.667 8"
                        stroke="#4B5563"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 flex text-center items-center"
                >
                  Slot date
                  <svg
                    className="ml-2"
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                  >
                    <path
                      d="M8.66699 3.66667V12M8.66699 12L4.66699 8M8.66699 12L12.667 8"
                      stroke="#4B5563"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </th>
                <th scope="col" className="px-6 py-3 text-left">
                  Amenities
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Delete All
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr
                  key={index}
                  className="bg-white border-b hover:bg-gray-50"
                  style={{ fontSize: "14px" }}
                >
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <span
                        style={{
                          width: "20px",
                          height: "20px",
                          padding: "1px",
                          marginLeft: "10px",
                          border: "1px solid #6B7280",
                          gap: "8px",
                          alignItems: "center",
                          borderRadius: "6px",
                        }}
                      ></span>
                    </div>
                  </td>
                  <th
                    scope="row"
                    className="px-6 flex text-start py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {booking.name}
                  </th>
                  <td className="px-6 py-4">{booking.slotTime}</td>
                  <td className="px-6 py-4">{booking.slotDate}</td>
                  <td className="px-6 py-4">
                    <span
                      className="text-center align-baseline inline-flex px-4 py-3 mr-auto items-center font-semibold text-[.95rem] leading-none rounded-lg"
                      style={{
                        padding: "4px 12px",
                        fontSize: "12px",
                        ...getAmenityStyle(booking.amenity),
                      }}
                    >
                      {booking.amenity}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-end mt-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.7586 5.73201L14.268 2.24061C14.1519 2.1245 14.0141 2.0324 13.8624 1.96957C13.7107 1.90673 13.5482 1.87439 13.384 1.87439C13.2198 1.87439 13.0572 1.90673 12.9056 1.96957C12.7539 2.0324 12.6161 2.1245 12.5 2.24061L2.86641 11.875C2.74983 11.9906 2.65741 12.1283 2.59451 12.28C2.5316 12.4317 2.49948 12.5944 2.50001 12.7586V16.25C2.50001 16.5815 2.6317 16.8994 2.86612 17.1339C3.10054 17.3683 3.41849 17.5 3.75001 17.5H7.24141C7.40563 17.5005 7.5683 17.4684 7.71999 17.4055C7.87168 17.3426 8.00935 17.2502 8.12501 17.1336L17.7586 7.49998C17.8747 7.3839 17.9668 7.24609 18.0296 7.09442C18.0925 6.94274 18.1248 6.78017 18.1248 6.616C18.1248 6.45182 18.0925 6.28925 18.0296 6.13758C17.9668 5.9859 17.8747 5.84809 17.7586 5.73201ZM7.24141 16.25H3.75001V12.7586L10.625 5.88358L14.1164 9.37498L7.24141 16.25ZM15 8.49061L11.5086 4.99998L13.3836 3.12498L16.875 6.61561L15 8.49061Z"
                        fill="#6B7280"
                      />
                    </svg>
                    <svg
                      className="ml-6"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.875 3.75H3.125C2.95924 3.75 2.80027 3.81585 2.68306 3.93306C2.56585 4.05027 2.5 4.20924 2.5 4.375C2.5 4.54076 2.56585 4.69973 2.68306 4.81694C2.80027 4.93415 2.95924 5 3.125 5H3.75V16.25C3.75 16.5815 3.8817 16.8995 4.11612 17.1339C4.35054 17.3683 4.66848 17.5 5 17.5H15C15.3315 17.5 15.6495 17.3683 15.8839 17.1339C16.1183 16.8995 16.25 16.5815 16.25 16.25V5H16.875C17.0408 5 17.1997 4.93415 17.3169 4.81694C17.4342 4.69973 17.5 4.54076 17.5 4.375C17.5 4.20924 17.4342 4.05027 17.3169 3.93306C17.1997 3.81585 17.0408 3.75 16.875 3.75ZM15 16.25H5V5H15V16.25ZM6.25 1.875C6.25 1.70924 6.31585 1.55027 6.43306 1.43306C6.55027 1.31585 6.70924 1.25 6.875 1.25H13.125C13.2908 1.25 13.4497 1.31585 13.5669 1.43306C13.6842 1.55027 13.75 1.70924 13.75 1.875C13.75 2.04076 13.6842 2.19973 13.5669 2.31694C13.4497 2.43415 13.2908 2.5 13.125 2.5H6.875C6.70924 2.5 6.55027 2.43415 6.43306 2.31694C6.31585 2.19973 6.25 2.04076 6.25 1.875Z"
                        fill="#EF4444"
                      />
                    </svg>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}

      {/* Pagination */}
      <div className="flex mt-[-2px] justify-between items-center px-6 py-3 border-t">
        <div
          className="text-sm text-gray-700"
          style={{
            color: "var(--Gray-700, #1F2937)",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-3 py-1 border rounded ${
              currentPage === 1
                ? "bg-gray-100 #6B7280"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            style={{ fontSize: "14px", border: "1px solid #D1D5DB" }}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border rounded ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            style={{ fontSize: "14px", border: "1px solid #D1D5DB" }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
    </div>
    
  );
};

export default AdminBookingTable;
