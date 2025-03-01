// import React, { useEffect, useState } from "react";
// import "../App.css";
// import "../index.css";
// import styles from '../Components/CustomScrollbar.module.css';
// import AddBooking from '../Components/AddBooking';
// import AddService from '../Components/AddService';
// import ScrollableAdminBookingTable from "./AdminBookingTable";
// import BookingServiceTable from "./BookingServiceTable";
// import { useAuth } from "../context/AuthContext";
// import ExportModal from './Exports/FlatExport';
// import EditingBookingModal from "./EditingModal";
// import FlatTable from "./Tables/FlatTable";
// import AddFlat from "./AddFlat";
// import AddFlatHighlighter from './AddFlatHighlighter';
// import { AddIcon, ExportIcon, HighlightButton } from "./HighLightButton";

// const Flatmain = () => {
//   const [activeTab, setActiveTab] = useState("Amenities");
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [editingBooking, setEditingBooking] = useState(null);
//   const [showExportModal, setShowExportModal] = useState(false);
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
//       <div className={`flex ${isMobile ? 'flex-col gap-4' : 'justify-between items-center'}`} style={{ position: 'relative', zIndex: 1 }}>
//           <div>
//             <h1 className={`${styles.customScrollbar} flex-1 text-gray-900`} style={{fontWeight: "bold", fontSize: "24px", lineHeight: "32px", gap: "2px"}}>
//               {activeTab === "Amenities" ? "Flats" : "Services"}
//             </h1>
//             <p className="gap-2" style={{fontSize: "17px", color: "var(--Gray-400, #6B7280)", fontStyle: "normal", fontWeight: "500", lineHeight: "28px"}}>
//               {activeTab === "Amenities" 
//                 ? "Keep track of all your recent bookings in one place."
//                 : "Manage all your available services here."}
//             </p>
//           </div>
//           <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", justifyItems: "flex-end", zIndex: '10'}}>
            
//             <HighlightButton 
//   type="secondary" 
//   onClick={() => setShowExportModal(true)}
// >
//   <ExportIcon />
//   Export
// </HighlightButton>

// <HighlightButton 
//   type="primary"
//   onClick={handleAddClick}
// >
//   <AddIcon />
//   {activeTab === "Amenities" ? "Add Flat" : "Add Service"}
// </HighlightButton>
//           </div>
//         </div>
//       </div>

//       <div className="mt-6 rounded-lg overflow-hidden">
//         <div className="overflow-x-auto">
//           {activeTab === "Amenities" ? (
//             <FlatTable bookings={bookings} onEditClick={handleEditClick} onDeleteClick={deleteBooking} />
//           ) : (
//             <BookingServiceTable />
//           )}
//         </div>
//       </div>

//       {/* {/* {(isAddModalOpen || isEditModalOpen || showExportModal) && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-lg shadow-lg">
//             {isAddModalOpen && (
//               <AddBooking 
//                 onClose={handleCloseModal} 
//                 onSave={handleSaveBook
//             {isEditModalOpen && (
//               <AddBooking 
//                 onClose={handleCloseModal} 
//                 booking={editingBooking} 
//                 onSave={handleSaveEdit} 
//               />
//             )}
//             {showExportModal && (
//               <ExportModal
//                 bookings={bookings}
//                 onClose={handleCloseModal}
//               />
//             )}
//           </div>
//         </div>
//       )} */}
//       {isAddModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-lg shadow-lg">
//             <AddFlat 
//               onClose={handleCloseModal} 
//               onSave={handleSaveBooking} 
//             />
//           </div>
//         </div>
//       )}
//       <div>
        
//       </div>

// {isEditModalOpen && (
//         <EditingBookingModal 
//           isOpen={isEditModalOpen}
//           onClose={handleCloseModal}
//           booking={editingBooking}
//           onSave={handleSaveEdit}
//         />
        
//       )}

//       {showExportModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-lg shadow-lg">
//             <ExportModal
//               bookings={bookings}
//               onClose={handleCloseModal}
//             />
//           </div>
//         </div>
//       )}
//        {/* <AddFlatHighlighter /> */}
//     </div>
    
//   );
// };

// export default Flatmain;
import React, { useState, useEffect } from "react";
import "../App.css";
import "../index.css";
import styles from '../Components/CustomScrollbar.module.css';
import AddBooking from '../Components/AddBooking';
import AddService from '../Components/AddService';
import ScrollableAdminBookingTable from "./AdminBookingTable";
import BookingServiceTable from "./BookingServiceTable";
import { useAuth } from "../context/AuthContext";
import ExportModal from './Exports/FlatExport';
import EditingBookingModal from "./EditingModal";
import FlatTable from "./Tables/FlatTable";
import AddFlat from "./AddFlat";
import AddFlatHighlighter from './AddFlatHighlighter';
import { AddIcon, ExportIcon, HighlightButton } from "./HighLightButton";

const Flatmain = () => {
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
    <div className="p-2 lg:p-0 lg:ml-10">
      <div style={{ position: 'relative' }}>
        <div className={`flex ${isMobile ? 'flex-col gap-4' : 'justify-between items-center'}`} style={{ position: 'relative', zIndex: 1 }}>
          <div className={isMobile ? 'w-full' : ''}>
            <h1 className={`${styles.customScrollbar} flex-1 text-gray-900`} style={{fontWeight: "bold", fontSize: isMobile ? "20px" : "24px", lineHeight: "32px", gap: "2px"}}>
              {activeTab === "Amenities" ? "Flats" : "Services"}
            </h1>
            <p className="gap-2" style={{fontSize: isMobile ? "15px" : "17px", color: "var(--Gray-400, #6B7280)", fontStyle: "normal", fontWeight: "500", lineHeight: "28px"}}>
              {activeTab === "Amenities" 
                ? "Keep track of all your recent bookings in one place."
                : "Manage all your available services here."}
            </p>
          </div>
          <div className={`flex ${isMobile ? 'w-full' : ''} ${isMobile ? 'justify-between' : 'gap-1'} items-center z-10`}>
            <HighlightButton 
              type="secondary" 
              onClick={() => setShowExportModal(true)}
              className={isMobile ? 'flex-1 justify-center' : ''}
            >
              <ExportIcon />
              Export
              {/* {!isMobile && "Export"} */}
            </HighlightButton>

            <HighlightButton 
              type="primary"
              onClick={handleAddClick}
              className={isMobile ? 'flex-1 justify-center' : ''}
            >
              <AddIcon />
              {isMobile ? "Add Flat" : (activeTab === "Amenities" ? "Add Flat" : "Add Service")}
            </HighlightButton>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === "Amenities" ? (
            <FlatTable bookings={bookings} onEditClick={handleEditClick} onDeleteClick={deleteBooking} />
          ) : (
            <BookingServiceTable />
          )}
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className={`bg-white rounded-lg shadow-lg ${isMobile ? 'w-[95%]' : ''}`}>
            <AddFlat 
              onClose={handleCloseModal} 
              onSave={handleSaveBooking} 
            />
          </div>
        </div>
      )}

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
          <div className={`bg-white rounded-lg shadow-lg ${isMobile ? 'w-[95%]' : ''}`}>
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

export default Flatmain;