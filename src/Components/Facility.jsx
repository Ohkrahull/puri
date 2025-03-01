import React, { useEffect, useState } from "react";
import "../App.css";
import "../index.css";
import styles from '../Components/CustomScrollbar.module.css';
import AddBooking from '../Components/AddBooking';
import AddService from '../Components/AddService';
import ScrollableAdminBookingTable from "./AdminBookingTable";
import BookingServiceTable from "./BookingServiceTable";
import { useAuth } from "../context/AuthContext";
import ExportModal from './Exports/FacilityExport';
import EditingBookingModal from "./EditingModal";
import FlatTable from "./Tables/FlatTable";
import AddFlat from "./AddFlat";
import SOSTable from "./SosTable";
import AmenityDetailsForm from "./Addamenity";
import { Link } from "react-router-dom";
import AmenityTable from "./AmenityTable";
import { AddIcon, ExportIcon, HighlightButton } from "./HighLightButton";

const Facility = () => {
  const [activeTab, setActiveTab] = useState("Amenities");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Track window size for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

   // Determine if we're on mobile or tablet
   const isMobile = windowWidth < 640;
   const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const { bookings, updateBooking, deleteBooking, addBooking } = useAuth();

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleEditClick = (booking) => {
    setEditingBooking(booking);
    setIsEditModalOpen(true);
  };

  const handleSaveBooking = async (newBooking) => {
    try {
      await addBooking(newBooking);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding booking:", error);
    }
  };

  const handleSaveEdit = async (updatedBooking) => {
    try {
      await updateBooking(updatedBooking.id, updatedBooking);
      setIsEditModalOpen(false);
      setEditingBooking(null);
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setEditingBooking(null);
    setShowExportModal(false);
  };

  return (
    <div className="p-2 lg:p-0 lg:ml-10" style={{}}>
      <div style={{ position: 'relative' }}>
      <div className={`flex ${isMobile ? 'flex-col gap-4' : 'justify-between items-center'}`} style={{ position: 'relative', zIndex: 1 }}>
          <div>
            <h1 className={`${styles.customScrollbar} flex-1 text-gray-900`} style={{fontWeight: "bold", fontSize: "24px", lineHeight: "32px", gap: "2px"}}>
              {activeTab === "Amenities" ? "Facility" : "Services"}
            </h1>
            <p className="gap-2" style={{fontSize: "17px", color: "var(--Gray-400, #6B7280)", fontStyle: "normal", fontWeight: "500", lineHeight: "28px"}}>
              {activeTab === "Amenities" 
                ? "Manage all your facility from one place."
                : "Manage all your available services here."}
            </p>
          </div>
          {/* <div className="justify-between" style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", justifyItems: "flex-end", zIndex: '10'}}>
            
            <HighlightButton 
  type="secondary" 
  onClick={() => setShowExportModal(true)}
>
  <ExportIcon />
  Export
</HighlightButton>


            <Link to="/Amenityform"  style={{display: "flex", padding: "12px 24px", justifyContent: "center", alignItems: "center", borderRadius: "10px", fontSize: "16px", fontFamily: "Plus_Jakarta", backgroundColor: "#030712", color: "#fff"}}>
              <span>
                <svg className="w-5 h-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M17.5 10C17.5 10.1658 17.4342 10.3247 17.3169 10.4419C17.1997 10.5592 17.0408 10.625 16.875 10.625H10.625V16.875C10.625 17.0408 10.5592 17.1997 10.4419 17.3169C10.3247 17.4342 10.1658 17.5 10 17.5C9.83424 17.5 9.67527 17.4342 9.55806 17.3169C9.44085 17.1997 9.375 17.0408 9.375 16.875V10.625H3.125C2.95924 10.625 2.80027 10.5592 2.68306 10.4419C2.56585 10.3247 2.5 10.1658 2.5 10C2.5 9.83424 2.56585 9.67527 2.68306 9.55806C2.80027 9.44085 2.95924 9.375 3.125 9.375H9.375V3.125C9.375 2.95924 9.44085 2.80027 9.55806 2.68306C9.67527 2.56585 9.83424 2.5 10 2.5C10.1658 2.5 10.3247 2.56585 10.4419 2.68306C10.5592 2.80027 10.625 2.95924 10.625 3.125V9.375H16.875C17.0408 9.375 17.1997 9.44085 17.3169 9.55806C17.4342 9.67527 17.5 9.83424 17.5 10Z" fill="white"/>
                </svg>
              </span>
              {activeTab === "Amenities" ? "Add Amenities" : "Add Service"}
            </Link>
          </div> */}
                     <div className={`${isMobile ? 'flex flex-row w-full gap-2' : 'flex space-x-2'} items-center justify-between`}>
             <HighlightButton 
              type="secondary" 
              onClick={() => setShowExportModal(true)}
              // style={{ fontSize: isMobile ? "15px" : "17px",}}
              // className={isMobile ? 'w-1/2 justify-center' : ''}
            >
              <ExportIcon />
              {/* Export */}
              {isMobile ? 'Export' : 'Export'}
            </HighlightButton>

            {/* <Link 
              to="/Amenityform" 
              // style={{ fontSize: isMobile ? "15px" : "17px",}}
              className={`flex items-center justify-center px-2 py-5 gap-1 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors 
                `}
            >
              <svg  xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M17.5 10C17.5 10.1658 17.4342 10.3247 17.3169 10.4419C17.1997 10.5592 17.0408 10.625 16.875 10.625H10.625V16.875C10.625 17.0408 10.5592 17.1997 10.4419 17.3169C10.3247 17.4342 10.1658 17.5 10 17.5C9.83424 17.5 9.67527 17.4342 9.55806 17.3169C9.44085 17.1997 9.375 17.0408 9.375 16.875V10.625H3.125C2.95924 10.625 2.80027 10.5592 2.68306 10.4419C2.56585 10.3247 2.5 10.1658 2.5 10C2.5 9.83424 2.56585 9.67527 2.68306 9.55806C2.80027 9.44085 2.95924 9.375 3.125 9.375H9.375V3.125C9.375 2.95924 9.44085 2.80027 9.55806 2.68306C9.67527 2.56585 9.83424 2.5 10 2.5C10.1658 2.5 10.3247 2.56585 10.4419 2.68306C10.5592 2.80027 10.625 2.95924 10.625 3.125V9.375H16.875C17.0408 9.375 17.1997 9.44085 17.3169 9.55806C17.4342 9.67527 17.5 9.83424 17.5 10Z" fill="white"/>
              </svg>
              {isMobile ? "Add Amenities" : (activeTab === "Amenities" ? "Add Amenities" : "Add Service")}
            </Link> */}
             <Link to="/Amenityform"  style={{display: "flex", padding: "12px 24px", justifyContent: "center", alignItems: "center", borderRadius: "10px", fontSize: "16px", fontFamily: "Plus_Jakarta", backgroundColor: "#030712", color: "#fff"}}>
              <span>
                <svg className="w-5 h-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M17.5 10C17.5 10.1658 17.4342 10.3247 17.3169 10.4419C17.1997 10.5592 17.0408 10.625 16.875 10.625H10.625V16.875C10.625 17.0408 10.5592 17.1997 10.4419 17.3169C10.3247 17.4342 10.1658 17.5 10 17.5C9.83424 17.5 9.67527 17.4342 9.55806 17.3169C9.44085 17.1997 9.375 17.0408 9.375 16.875V10.625H3.125C2.95924 10.625 2.80027 10.5592 2.68306 10.4419C2.56585 10.3247 2.5 10.1658 2.5 10C2.5 9.83424 2.56585 9.67527 2.68306 9.55806C2.80027 9.44085 2.95924 9.375 3.125 9.375H9.375V3.125C9.375 2.95924 9.44085 2.80027 9.55806 2.68306C9.67527 2.56585 9.83424 2.5 10 2.5C10.1658 2.5 10.3247 2.56585 10.4419 2.68306C10.5592 2.80027 10.625 2.95924 10.625 3.125V9.375H16.875C17.0408 9.375 17.1997 9.44085 17.3169 9.55806C17.4342 9.67527 17.5 9.83424 17.5 10Z" fill="white"/>
                </svg>
              </span>
              {activeTab === "Amenities" ? "Add Amenity" : "Add Service"}
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === "Amenities" ? (
            <AmenityTable bookings={bookings} onEditClick={handleEditClick} onDeleteClick={deleteBooking} />
            // <BookingServiceTable />
          ) : (
            <BookingServiceTable />
          )}
        </div>
      </div>

      {/* {/* {(isAddModalOpen || isEditModalOpen || showExportModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg">
            {isAddModalOpen && (
              <AddBooking 
                onClose={handleCloseModal} 
                onSave={handleSaveBook
            {isEditModalOpen && (
              <AddBooking 
                onClose={handleCloseModal} 
                booking={editingBooking} 
                onSave={handleSaveEdit} 
              />
            )}
            {showExportModal && (
              <ExportModal
                bookings={bookings}
                onClose={handleCloseModal}
              />
            )}
          </div>
        </div>
      )} */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg">
            <AmenityDetailsForm 
              onClose={handleCloseModal} 
              onSave={handleSaveBooking} 
            />
          </div>
        </div>
      )}
      <div>
        
      </div>

{isEditModalOpen && (
        <EditingBookingModal 
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          booking={editingBooking}
          onSave={handleSaveEdit}
        />
        
      )}

      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg">
            <ExportModal
              bookings={bookings}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Facility;
// import React, { useEffect, useState } from "react";
// import "../App.css";
// import "../index.css";
// import styles from '../Components/CustomScrollbar.module.css';
// import AddBooking from '../Components/AddBooking';
// import AddService from '../Components/AddService';
// import ScrollableAdminBookingTable from "./AdminBookingTable";
// import BookingServiceTable from "./BookingServiceTable";
// import { useAuth } from "../context/AuthContext";
// import ExportModal from './Exports/FacilityExport';
// import EditingBookingModal from "./EditingModal";
// import FlatTable from "./Tables/FlatTable";
// import AddFlat from "./AddFlat";
// import SOSTable from "./SosTable";
// import AmenityDetailsForm from "./Addamenity";
// import { Link } from "react-router-dom";
// import AmenityTable from "./AmenityTable";
// import { AddIcon, ExportIcon, HighlightButton } from "./HighLightButton";

// const Facility = () => {
//   const [activeTab, setActiveTab] = useState("Amenities");
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [editingBooking, setEditingBooking] = useState(null);
//   const [showExportModal, setShowExportModal] = useState(false);
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);

//   // Track window size for responsive design
//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };
    
//     window.addEventListener('resize', handleResize);
//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);

//   // Determine if we're on mobile or tablet
//   const isMobile = windowWidth < 640;
//   const isTablet = windowWidth >= 640 && windowWidth < 1024;

//   const { bookings, updateBooking, deleteBooking, addBooking } = useAuth();

//   const handleAddClick = () => {
//     setIsAddModalOpen(true);
//   };

//   const handleEditClick = (booking) => {
//     setEditingBooking(booking);
//     setIsEditModalOpen(true);
//   };

//   const handleSaveBooking = async (newBooking) => {
//     try {
//       await addBooking(newBooking);
//       setIsAddModalOpen(false);
//     } catch (error) {
//       console.error("Error adding booking:", error);
//     }
//   };

//   const handleSaveEdit = async (updatedBooking) => {
//     try {
//       await updateBooking(updatedBooking.id, updatedBooking);
//       setIsEditModalOpen(false);
//       setEditingBooking(null);
//     } catch (error) {
//       console.error("Error updating booking:", error);
//     }
//   };

//   const handleCloseModal = () => {
//     setIsAddModalOpen(false);
//     setIsEditModalOpen(false);
//     setEditingBooking(null);
//     setShowExportModal(false);
//   };

//   return (
//     <div className="p-2 lg:p-0 lg:ml-10">
//       <div style={{ position: 'relative' }}>
//         <div className={`${isMobile ? 'flex-col space-y-4' : 'flex justify-between items-center'}`} style={{ position: 'relative', zIndex: 1 }}>
//           <div className={isMobile ? 'mb-2' : ''}>
//             <h1 className={`${styles.customScrollbar} flex-1 text-gray-900`} 
//                style={{
//                  fontWeight: "bold", 
//                  fontSize: isMobile ? "20px" : "24px", 
//                  lineHeight: isMobile ? "28px" : "32px", 
//                  gap: "2px"
//                }}>
//               {activeTab === "Amenities" ? "Facility" : "Services"}
//             </h1>
//             <p className="gap-2" 
//                style={{
//                  fontSize: isMobile ? "15px" : "17px", 
//                  color: "var(--Gray-400, #6B7280)", 
//                  fontStyle: "normal", 
//                  fontWeight: "500", 
//                  lineHeight: isMobile ? "24px" : "28px"
//                }}>
//               {activeTab === "Amenities" 
//                 ? "Manage all your facility from one place."
//                 : "Manage all your available services here."}
//             </p>
//           </div>
//           <div className={`${isMobile ? 'flex flex-row w-full gap-2' : 'flex space-x-2'} items-center justify-between`}>
//             <HighlightButton 
//               type="secondary" 
//               onClick={() => setShowExportModal(true)}
//               style={{ fontSize: isMobile ? "15px" : "17px",}}
//               className={isMobile ? 'w-1/2 justify-center' : ''}
//             >
//               <ExportIcon />
//               {/* Export */}
//               {isMobile ? 'Export' : 'Export'}
//             </HighlightButton>

//             <Link 
//               to="/Amenityform" 
//               // style={{ fontSize: isMobile ? "15px" : "17px",}}
//               className={`flex items-center justify-center px-2 py-5 gap-1 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors ${
//                 isMobile ? 'w-1/2 justify-center ' : ''
                
//               }`}
//             >
//               <svg className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
//                 <path d="M17.5 10C17.5 10.1658 17.4342 10.3247 17.3169 10.4419C17.1997 10.5592 17.0408 10.625 16.875 10.625H10.625V16.875C10.625 17.0408 10.5592 17.1997 10.4419 17.3169C10.3247 17.4342 10.1658 17.5 10 17.5C9.83424 17.5 9.67527 17.4342 9.55806 17.3169C9.44085 17.1997 9.375 17.0408 9.375 16.875V10.625H3.125C2.95924 10.625 2.80027 10.5592 2.68306 10.4419C2.56585 10.3247 2.5 10.1658 2.5 10C2.5 9.83424 2.56585 9.67527 2.68306 9.55806C2.80027 9.44085 2.95924 9.375 3.125 9.375H9.375V3.125C9.375 2.95924 9.44085 2.80027 9.55806 2.68306C9.67527 2.56585 9.83424 2.5 10 2.5C10.1658 2.5 10.3247 2.56585 10.4419 2.68306C10.5592 2.80027 10.625 2.95924 10.625 3.125V9.375H16.875C17.0408 9.375 17.1997 9.44085 17.3169 9.55806C17.4342 9.67527 17.5 9.83424 17.5 10Z" fill="white"/>
//               </svg>
//               {isMobile ? "Add Amenities" : (activeTab === "Amenities" ? "Add Amenities" : "Add Service")}
//             </Link>
//           </div>
//         </div>
//       </div>

//       <div className="mt-6 rounded-lg overflow-hidden">
//         <div className="overflow-x-auto">
//           {activeTab === "Amenities" ? (
//             <AmenityTable bookings={bookings} onEditClick={handleEditClick} onDeleteClick={deleteBooking} />
//           ) : (
//             <BookingServiceTable />
//           )}
//         </div>
//       </div>

//       {isAddModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className={`bg-white rounded-lg shadow-lg ${isMobile ? 'w-11/12 max-h-[90vh] overflow-y-auto' : ''}`}>
//             <AmenityDetailsForm 
//               onClose={handleCloseModal} 
//               onSave={handleSaveBooking} 
//             />
//           </div>
//         </div>
//       )}

//       {isEditModalOpen && (
//         <EditingBookingModal 
//           isOpen={isEditModalOpen}
//           onClose={handleCloseModal}
//           booking={editingBooking}
//           onSave={handleSaveEdit}
//         />
//       )}

//       {showExportModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className={`bg-white rounded-lg shadow-lg ${isMobile ? 'w-11/12' : ''}`}>
//             <ExportModal
//               bookings={bookings}
//               onClose={handleCloseModal}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Facility;