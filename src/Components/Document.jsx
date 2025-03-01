
import React, { useState, useEffect } from "react";
import styles from './CustomScrollbar.module.css';
import "../App.css";
import "../index.css";
import DocumentTable from "../Tables/DocumentsTable";
import AddDocumentsModal from "./Modal_for_Document";
import { fetchUserDocuments } from '../firebase/services/documents';
import ExportModal from "./DocumentExport";
import { AddIcon, ExportIcon, HighlightButton } from "./HighLightButton";

const Document = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [currentTab, setCurrentTab] = useState("Agreement");
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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Get header content based on current tab
  const getHeaderContent = () => {
    return currentTab === "Agreement" 
      ? { title: "Documents", subtitle: "Keep track of all your documents in one place." }
      : { title: "Demand Letters", subtitle: "Manage and track all your demand letters efficiently." };
  };

  const { title, subtitle } = getHeaderContent();

  // Handle tab change from DocumentTable
  const handleTabChange = (newTab) => {
    setCurrentTab(newTab);
  };

  const handleCloseModal = () => {
    setShowExportModal(false);
  };

  return (
    <div className={`p-2 lg:p-0 lg:ml-10 ${isModalOpen ? 'bg-opacity-50' : ''}`}>
      <div className={`${isMobile ? 'flex-col space-y-4' : 'flex justify-between items-center'}`}>
        <div className={isMobile ? 'mb-2 text-start' : ''}>
          <h1 
            className={`${styles.customScrollbar} text-gray-900 font-bold`}
            style={{
              fontSize: isMobile ? "20px" : "24px",
              lineHeight: isMobile ? "28px" : "32px"
            }}
          >
            {title}
          </h1>
          <p 
            className="gap-2"
            style={{
              fontSize: isMobile ? "15px" : "17px",
              color: "var(--Gray-400, #6B7280)",
              fontStyle: "normal",
              fontWeight: "500",
              lineHeight: isMobile ? "24px" : "28px"
            }}
          >
            {subtitle}
          </p>
        </div>
        <div className={`
          ${isMobile 
            ? 'flex   w-full justify-between' 
            : 'flex items-center space-x-2'
          }
        `}>
          <HighlightButton 
            type="secondary" 
            onClick={() => setShowExportModal(true)}
            className={isMobile ? 'w-full' : ''}
          >
            <ExportIcon />
            {isMobile ? 'Export' : 'Export'}
          </HighlightButton>

          <HighlightButton 
            type="primary"
            onClick={openModal}
            className={isMobile ? 'w-full' : ''}
          >
            <AddIcon />
            {currentTab === "Agreement" ? "Add Document" : "Add Demand"}
          </HighlightButton>
        </div>
      </div>

      <div className="mt-6 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <DocumentTable 
            onTabChange={handleTabChange} 
            isMobile={isMobile}
          />
        </div>
      </div>

      <AddDocumentsModal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        documentType={currentTab === "Agreement" ? "Agreement for sale" : "Demand letters"}
        isMobile={isMobile}
      />

      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className={`bg-white rounded-lg shadow-lg ${isMobile ? 'w-11/12' : ''}`}>
            <ExportModal
              documentType={currentTab === "Agreement" ? "Agreement for sale" : "Demand letters"}
              onClose={handleCloseModal}
              isMobile={isMobile}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Document;