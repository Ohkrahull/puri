import React, { useState } from "react";
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
    <div className="p-8 lg:p-12">
      <div style={{ position: 'relative' }}>
        <div className="flex justify-between" style={{ position: 'relative', zIndex: 1 }}>
          <div>
            <h1 className={`${styles.customScrollbar} flex-1 text-gray-900`} style={{fontWeight: "bold", fontSize: "24px", lineHeight: "32px", gap: "2px"}}>
              {activeTab === "Amenities" ? "Flats" : "Services"}
            </h1>
            <p className="gap-2" style={{fontSize: "17px", color: "var(--Gray-400, #6B7280)", fontStyle: "normal", fontWeight: "500", lineHeight: "28px"}}>
              {activeTab === "Amenities" 
                ? "Keep track of all your recent bookings in one place."
                : "Manage all your available services here."}
            </p>
          </div>
          <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", justifyItems: "flex-end", zIndex: '10'}}>
            
            <HighlightButton 
  type="secondary" 
  onClick={() => setShowExportModal(true)}
>
  <ExportIcon />
  Export
</HighlightButton>

<HighlightButton 
  type="primary"
  onClick={handleAddClick}
>
  <AddIcon />
  {activeTab === "Amenities" ? "Add Flat" : "Add Service"}
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
            <AddFlat 
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
       {/* <AddFlatHighlighter /> */}
    </div>
    
  );
};

export default Flatmain;