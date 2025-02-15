import React, { useEffect, useState } from "react";
import styles from "./CustomScrollbar.module.css";
// import SearchInput from '../Buttons/SearchInput';
import SortButton from "../Buttons/Sortdate";

const SearchInput = ({ bookings, onSearch,onItemClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length > 0);
    onSearch(value);
  };

  const handleItemClick = (booking) => {
    setSearchTerm(booking.name);
    setShowDropdown(false);
    onItemClick(booking);
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.amenity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.Feedback.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <div
        style={{
          display: "flex",
          padding: "8px 16px",
          alignItems: "center",
          justifyContent: "space-between",
          alignSelf: "stretch",
          border: "1px solid #D1D5DB",
          borderRadius: "10px",
          color: "#6B7280",
          fontSize: "16px",
          fontFamily: "Plus Jakarta Sans, sans-serif",
          width: "300px",
        }}
      >
        <input
          type="text"
          placeholder="search"
          value={searchTerm}
          onChange={handleInputChange}
          style={{
            border: "none",
            outline: "none",
            width: "100%",
            background: "transparent",
            color: "inherit",
            fontSize: "inherit",
            fontFamily: "inherit",
          }}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M17.9419 17.0579L14.0302 13.1469C15.1639 11.7858 15.7293 10.0399 15.6086 8.2725C15.488 6.50512 14.6906 4.85229 13.3823 3.65785C12.074 2.46341 10.3557 1.81932 8.58462 1.85957C6.81357 1.89982 5.12622 2.62131 3.87358 3.87395C2.62094 5.12659 1.89945 6.81394 1.8592 8.58498C1.81895 10.356 2.46304 12.0744 3.65748 13.3827C4.85192 14.6909 6.50475 15.4883 8.27214 15.609C10.0395 15.7297 11.7854 15.1643 13.1466 14.0305L17.0575 17.9422C17.1156 18.0003 17.1845 18.0464 17.2604 18.0778C17.3363 18.1092 17.4176 18.1254 17.4997 18.1254C17.5818 18.1254 17.6631 18.1092 17.739 18.0778C17.8149 18.0464 17.8838 18.0003 17.9419 17.9422C17.9999 17.8842 18.046 17.8152 18.0774 17.7394C18.1089 17.6635 18.125 17.5822 18.125 17.5001C18.125 17.4179 18.1089 17.3366 18.0774 17.2607C18.046 17.1849 17.9999 17.1159 17.9419 17.0579ZM3.12469 8.75006C3.12469 7.63754 3.45459 6.55 4.07267 5.62497C4.69076 4.69995 5.56926 3.97898 6.5971 3.55323C7.62493 3.12749 8.75593 3.0161 9.84707 3.23314C10.9382 3.45018 11.9405 3.98591 12.7272 4.77258C13.5138 5.55925 14.0496 6.56153 14.2666 7.65267C14.4837 8.74382 14.3723 9.87482 13.9465 10.9027C13.5208 11.9305 12.7998 12.809 11.8748 13.4271C10.9497 14.0452 9.86221 14.3751 8.74969 14.3751C7.25836 14.3734 5.82858 13.7802 4.77404 12.7257C3.71951 11.6712 3.12634 10.2414 3.12469 8.75006Z"
            fill="#6B7280"
          />
        </svg>
      </div>

      {showDropdown && filteredBookings.length > 0 && (
        <div className="absolute w-full mt-3 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          {filteredBookings.map((booking, index) => (
            <div
              key={index}
              className="px-4 py-3  hover:bg-gray-100 cursor-pointer" style={{borderBottom: '1px solid var(--Gray-100, #E5E7EB)'}}
              onClick={()=> handleItemClick(booking)}
            >
              <div className="font-medium" style={{fontSize:'16px', color:'#6B7280'}}>{booking.name}</div>
              {/* <div className="text-sm text-gray-500">{booking.amenity}</div> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FeedBackTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const totalPages = 10; // This should be calculated based on your actual data


  
  useEffect(()=>{
    setFilteredBookings(bookings);
  },[]);

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
      slotTime: "08:20 am",
      slotDate: "8 Sep, 2020",
      amenity: "Swimming pool",
      Feedback: "Development in previous...",
    },
    {
      name: "Jane Cooper",
      slotTime: "08:20 pm",
      slotDate: "9 Sep, 2020",
      amenity: "Tennis court",
      Feedback: "The key to serviving this",
    },
    {
      name: "Robert Fox",
      slotTime: "08:20 pm",
      slotDate: "10 Sep, 2020",
      amenity: "Gym",
      Feedback: "The key to serviving this",
    },
    {
      name: "Jenny Wilson",
      slotTime: "08:20 pm",
      slotDate: "11 Sep, 2020",
      amenity: "Yoga studio",
      Feedback: "The key to serviving this",
    },
    {
      name: "Wade Warren",
      slotTime: "08:20am",
      slotDate: "12 Sep, 2020",
      amenity: "Swimming pool",
      Feedback: "The key to serviving this",
    },
    {
      name: "Esther Howard",
      slotTime: "08:20 pm",
      slotDate: "13 Sep, 2020",
      amenity: "Tennis court",
      Feedback: "The key to serviving this",
    },
    {
      name: "Cameron Williamson",
      slotTime: "08:20 pm",
      slotDate: "14 Sep, 2020",
      amenity: "Gym",
      Feedback: "Development in previous...",
    },
    {
      name: "Brooklyn Simmons",
      slotTime: "08:20 pm",
      slotDate: "15 Sep, 2020",
      amenity: "Yoga studio",
      Feedback: "Development in previous...",
    },
    {
      name: "Leslie Alexander",
      slotTime: "08:20 am",
      slotDate: "16 Sep, 2020",
      amenity: "Swimming pool",
      Feedback: "Development in previous...",
    },
    {
      name: "Guy Hawkins",
      slotTime: "08:20 pm",
      slotDate: "17 Sep, 2020",
      amenity: "Tennis court",
      Feedback: "Development in previous...",
    },
  ];

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredBookings(bookings); // Show all bookings if search term is empty
    } else {
      const filtered = bookings.filter(
        (booking) =>
          booking.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredBookings(filtered);
    }
  };

  const handleItemClick = (booking) => {
    setSearchTerm(booking.name);
    setFilteredBookings([booking]);
  };

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
    <div className="mt-1 bg-white border rounded-lg overflow-hidden">
      <div className="sticky top-0 z-30 bg-white">
        <div className="flex justify-between p-6 items-start">

        <div className="relative z-40">
            <SearchInput bookings={bookings} onSearch={handleSearch} onItemClick={handleItemClick} />
          </div>
         

          <div className="flex justify-end">
            <SortButton />

            <button
              className="flex text-end justify-end ml-[10px]"
              style={{
                display: "flex",
                padding: "8px 16px",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid #D1D5DB",
                borderRadius: "10px",
                color: "#6B7280",
                fontSize: "16px",
                fontFamily: "Plus_Jakarta",
              }}
            >
              Filter
            </button>
          </div>
        </div>

        <div className="border-y bg-gray-50">
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
                        marginLeft: "4px",
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
                <th scope="col" className="px-6 py-3 ">
                  <div
                    className="flex text-center items-center  "
                    style={{ justifyContent: "center" }}
                  >
                    Time
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
                  Date
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
                  Feedback
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Delete All
                </th>
              </tr>
            </thead>
          </table>
        </div>
      </div>

      
        <div
          className="max-h-[430px] overflow-y-auto"
          style={hideScrollbarStyle}
        >
          <table className="w-full text-sm text-gray-500">
            <tbody>
              {filteredBookings.length > 0 ? (
                 filteredBookings.map((booking, index) => (
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
                          fontSize: "14px",
                          color: "var(--Gray-500, #4B5563)",
                        }}
                      >
                        {booking.Feedback}
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
                          className="mr-6"
                          d="M17.5 11.25V16.25C17.5 16.4158 17.4342 16.5747 17.3169 16.6919C17.1997 16.8092 17.0408 16.875 16.875 16.875H3.125C2.95924 16.875 2.80027 16.8092 2.68306 16.6919C2.56585 16.5747 2.5 16.4158 2.5 16.25V11.25C2.5 11.0842 2.56585 10.9253 2.68306 10.8081C2.80027 10.6908 2.95924 10.625 3.125 10.625C3.29076 10.625 3.44973 10.6908 3.56694 10.8081C3.68415 10.9253 3.75 11.0842 3.75 11.25V15.625H16.25V11.25C16.25 11.0842 16.3158 10.9253 16.4331 10.8081C16.5503 10.6908 16.7092 10.625 16.875 10.625C17.0408 10.625 17.1997 10.6908 17.3169 10.8081C17.4342 10.9253 17.5 11.0842 17.5 11.25ZM9.55781 11.6922C9.61586 11.7503 9.68479 11.7964 9.76066 11.8279C9.83654 11.8593 9.91787 11.8755 10 11.8755C10.0821 11.8755 10.1635 11.8593 10.2393 11.8279C10.3152 11.7964 10.3841 11.7503 10.4422 11.6922L13.5672 8.56719C13.6253 8.50912 13.6713 8.44018 13.7027 8.36431C13.7342 8.28844 13.7503 8.20712 13.7503 8.125C13.7503 8.04288 13.7342 7.96156 13.7027 7.88569C13.6713 7.80982 13.6253 7.74088 13.5672 7.68281C13.5091 7.62474 13.4402 7.57868 13.3643 7.54725C13.2884 7.51583 13.2071 7.49965 13.125 7.49965C13.0429 7.49965 12.9616 7.51583 12.8857 7.54725C12.8098 7.57868 12.7409 7.62474 12.6828 7.68281L10.625 9.74141V2.5C10.625 2.33424 10.5592 2.17527 10.4419 2.05806C10.3247 1.94085 10.1658 1.875 10 1.875C9.83424 1.875 9.67527 1.94085 9.55806 2.05806C9.44085 2.17527 9.375 2.33424 9.375 2.5V9.74141L7.31719 7.68281C7.19991 7.56554 7.04085 7.49965 6.875 7.49965C6.70915 7.49965 6.55009 7.56554 6.43281 7.68281C6.31554 7.80009 6.24965 7.95915 6.24965 8.125C6.24965 8.29085 6.31554 8.44991 6.43281 8.56719L9.55781 11.6922Z"
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
                ))
              ):(
                <tr>
            <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
              <div className="flex flex-col items-center justify-center py-8">
                <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-lg font-semibold">No bookings found</p>
                <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
              </div>
            </td>
          </tr>
              
              )}
            </tbody>
          </table>
        </div>
        <div className="flex mt-[-2px] justify-between items-center px-6 py-3 border-t" >
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
      

      {/* <div className="flex mt-[-2px] justify-between items-center px-6 py-3 border-t">
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
      </div> */}
    </div>
  );
};

export default FeedBackTable;
