// import React, { useEffect, useState } from "react";
// import styles from './CustomScrollbar.module.css';
// import "../App.css";
// import "../index.css";
// import DocumentTable from "../Tables/DocumentsTable";
// import AddDocumentsModal from "./Modal_for_Document";
// import DemandLetterTable from "../Tables/DemandLetterTable";
// import { fetchUserDocuments } from '../firebase/services/documents';
// import ExportModal from "./DocumentExport";

// const Document = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("Agreement");
//   const [agreementDocuments, setAgreementDocuments] = useState([]);
//   const [demandLetterDocuments, setDemandLetterDocuments] = useState([]);
//   const [showExportModal, setShowExportModal] = useState(false);

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   const getHeaderContent = () => {
//     return activeTab === "Agreement" 
//       ? { title: "Documents", subtitle: "Keep track of all your documents in one place." }
//       : { title: "Demand Letters", subtitle: "Manage and track all your demand letters efficiently." };
//   };

//   const { title, subtitle } = getHeaderContent();

//   const loadDocuments = async () => {
//     try {
//       const userId = '2352032552'; // Replace with actual user ID from your auth system
//       const docs = await fetchUserDocuments(userId);
//       console.log("All docs", docs);
      
//       // Separate documents based on type
//       const agreements = docs.filter(doc => doc.documentType === 'Agreement for sale');
//       const demandLetters = docs.filter(doc => doc.documentType === 'Demand letters');
      
//       setAgreementDocuments(agreements);
//       setDemandLetterDocuments(demandLetters);
//     } catch (error) {
//       console.error('Error fetching documents:', error);
//     }
//   };

//   useEffect(() => {
//     loadDocuments();
//   }, []);

//   const handleDocumentAdded = () => {
//     loadDocuments();
//   };

//   const getCurrentDocuments = () => {
//     return activeTab === "Agreement" ? agreementDocuments : demandLetterDocuments;
//   };

//   const handleCloseModal = () => {
//     setShowExportModal(false);
//   };

//   return (
//     <div className={`p-8 lg:p-12 ${isModalOpen ? 'bg-opacity-50' : ''}`}>
//       <div className="flex justify-between">
//         <div>
//           <h1 className={`${styles.customScrollbar} flex-1 text-gray-900 font-bold text-3xl leading-8`}>
//             {title}
//           </h1>
//           <p className="gap-2" style={{fontSize: "17px", color: "var(--Gray-400, #6B7280)", fontStyle: "normal", fontWeight: "500", lineHeight: "28px"}}>
//             {subtitle}
//           </p>
//         </div>
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => setShowExportModal(true)}
//             style={{
//               display: "flex",
//               padding: "12px 24px",
//               justifyContent: "center",
//               alignItems: "center",
//               border: "1px solid #D1D5DB",
//               borderRadius: "10px",
//               color: "#6B7280",
//               fontSize: "16px",
//               fontFamily: "Plus_Jakarta",
//             }}
//           >
//             <span>
//               <svg className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
//                 <path d="M16.875 8.75V16.25C16.875 16.5815 16.7433 16.8995 16.5089 17.1339C16.2745 17.3683 15.9565 17.5 15.625 17.5H4.375C4.04348 17.5 3.72554 17.3683 3.49112 17.1339C3.2567 16.8995 3.125 16.5815 3.125 16.25V8.75C3.125 8.41848 3.2567 8.10054 3.49112 7.86612C3.72554 7.6317 4.04348 7.5 4.375 7.5H6.25C6.41576 7.5 6.57473 7.56585 6.69194 7.68306C6.80915 7.80027 6.875 7.95924 6.875 8.125C6.875 8.29076 6.80915 8.44974 6.69194 8.56695C6.57473 8.68416 6.41576 8.75 6.25 8.75H4.375V16.25H15.625V8.75H13.75C13.5842 8.75 13.4253 8.68416 13.3081 8.56695C13.1908 8.44974 13.125 8.29076 13.125 8.125C13.125 7.95924 13.1908 7.80027 13.3081 7.68306C13.4253 7.56585 13.5842 7.5 13.75 7.5H15.625C15.9565 7.5 16.2745 7.6317 16.5089 7.86612C16.7433 8.10054 16.875 8.41848 16.875 8.75ZM7.31719 5.44219L9.375 3.3836V10.625C9.375 10.7908 9.44085 10.9497 9.55806 11.0669C9.67527 11.1842 9.83424 11.25 10 11.25C10.1658 11.25 10.3247 11.1842 10.4419 11.0669C10.5592 10.9497 10.625 10.7908 10.625 10.625V3.3836L12.6828 5.44219C12.8001 5.55947 12.9591 5.62535 13.125 5.62535C13.2909 5.62535 13.4499 5.55947 13.5672 5.44219C13.6845 5.32492 13.7503 5.16586 13.7503 5C13.7503 4.83415 13.6845 4.67509 13.5672 4.55782L10.4422 1.43282C10.3841 1.37471 10.3152 1.32861 10.2393 1.29715C10.1635 1.2657 10.0821 1.24951 10 1.24951C9.91787 1.24951 9.83654 1.2657 9.76066 1.29715C9.68479 1.32861 9.61586 1.37471 9.55781 1.43282L6.43281 4.55782C6.31554 4.67509 6.24965 4.83415 6.24965 5C6.24965 5.16586 6.31554 5.32492 6.43281 5.44219C6.55009 5.55947 6.70915 5.62535 6.875 5.62535C7.04085 5.62535 7.19991 5.55947 7.31719 5.44219Z" fill="#6B7280"/>
//               </svg>
//             </span>
//             Export 
//           </button>
//           <button 
//             style={{fontSize:'18px',fontFamily: "Plus_Jakarta",}}
//             onClick={openModal}
//             className="flex items-center px-6 py-3 bg-gray-900 rounded-lg text-white"
//           >
//             <svg className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
//             </svg>
//             Add {activeTab === "Agreement" ? "Document" : "Demand Letter"}
//           </button>
//         </div>
//       </div>

//       {/* <div className="flex mt-8 relative">
//         <div className="flex gap-6 border-b border-gray-200 w-full">
//           <button
//             style={{fontSize:'14px',fontFamily: "Plus_Jakarta",}}
//             className={`pb-2 font-semibold relative ${
//               activeTab === "Agreement" ? "text-gray-900" : "text-gray-400"
//             }`}
//             onClick={() => setActiveTab("Agreement")}
//           >
//             Agreement for sale
//             {activeTab === "Agreement" && (
//               <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900"></div>
//             )}
//           </button>
//           <button
//             style={{fontSize:'14px',fontFamily: "Plus_Jakarta",}}
//             className={`pb-2 font-semibold relative ${
//               activeTab === "DemandLetter" ? "text-gray-900" : "text-gray-400"
//             }`}
//             onClick={() => setActiveTab("DemandLetter")}
//           >
//             Demand letters
//             {activeTab === "DemandLetter" && (
//               <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900"></div>
//             )}
//           </button>
//         </div>
//       </div> */}

//       <div className="mt-6 rounded-lg overflow-hidden">
//         <div className="overflow-x-auto">
//           {activeTab === "Agreement" ? <DocumentTable /> : <DemandLetterTable />}
//         </div>
//       </div>

//       <AddDocumentsModal isOpen={isModalOpen} onClose={closeModal} onDocumentAdded={handleDocumentAdded} />

//       {showExportModal && (
//         <ExportModal
//           documents={getCurrentDocuments()}
//           documentType={activeTab === "Agreement" ? "Agreement for sale" : "Demand letters"}
//           onClose={handleCloseModal}
//         />
//       )}
//     </div>
//   );
// };

// export default Document;
import React, { useEffect, useState } from "react";
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
  const [currentTab, setCurrentTab] = useState("Agreement"); // Track the current active tab

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
    <div className={`p-8 lg:p-12 ${isModalOpen ? 'bg-opacity-50' : ''}`}>
      <div className="flex justify-between">
        <div>
          <h1 className={`${styles.customScrollbar} flex-1 text-gray-900 font-bold text-3xl leading-8`}>
            {title}
          </h1>
          <p className="gap-2" style={{fontSize: "17px", color: "var(--Gray-400, #6B7280)", fontStyle: "normal", fontWeight: "500", lineHeight: "28px"}}>
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* <button
            onClick={() => setShowExportModal(true)}
            style={{
              display: "flex",
              padding: "12px 24px",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid #D1D5DB",
              borderRadius: "10px",
              color: "#6B7280",
              fontSize: "16px",
              fontFamily: "Plus_Jakarta",
            }}
          >
            <span>
              <svg className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.875 8.75V16.25C16.875 16.5815 16.7433 16.8995 16.5089 17.1339C16.2745 17.3683 15.9565 17.5 15.625 17.5H4.375C4.04348 17.5 3.72554 17.3683 3.49112 17.1339C3.2567 16.8995 3.125 16.5815 3.125 16.25V8.75C3.125 8.41848 3.2567 8.10054 3.49112 7.86612C3.72554 7.6317 4.04348 7.5 4.375 7.5H6.25C6.41576 7.5 6.57473 7.56585 6.69194 7.68306C6.80915 7.80027 6.875 7.95924 6.875 8.125C6.875 8.29076 6.80915 8.44974 6.69194 8.56695C6.57473 8.68416 6.41576 8.75 6.25 8.75H4.375V16.25H15.625V8.75H13.75C13.5842 8.75 13.4253 8.68416 13.3081 8.56695C13.1908 8.44974 13.125 8.29076 13.125 8.125C13.125 7.95924 13.1908 7.80027 13.3081 7.68306C13.4253 7.56585 13.5842 7.5 13.75 7.5H15.625C15.9565 7.5 16.2745 7.6317 16.5089 7.86612C16.7433 8.10054 16.875 8.41848 16.875 8.75ZM7.31719 5.44219L9.375 3.3836V10.625C9.375 10.7908 9.44085 10.9497 9.55806 11.0669C9.67527 11.1842 9.83424 11.25 10 11.25C10.1658 11.25 10.3247 11.1842 10.4419 11.0669C10.5592 10.9497 10.625 10.7908 10.625 10.625V3.3836L12.6828 5.44219C12.8001 5.55947 12.9591 5.62535 13.125 5.62535C13.2909 5.62535 13.4499 5.55947 13.5672 5.44219C13.6845 5.32492 13.7503 5.16586 13.7503 5C13.7503 4.83415 13.6845 4.67509 13.5672 4.55782L10.4422 1.43282C10.3841 1.37471 10.3152 1.32861 10.2393 1.29715C10.1635 1.2657 10.0821 1.24951 10 1.24951C9.91787 1.24951 9.83654 1.2657 9.76066 1.29715C9.68479 1.32861 9.61586 1.37471 9.55781 1.43282L6.43281 4.55782C6.31554 4.67509 6.24965 4.83415 6.24965 5C6.24965 5.16586 6.31554 5.32492 6.43281 5.44219C6.55009 5.55947 6.70915 5.62535 6.875 5.62535C7.04085 5.62535 7.19991 5.55947 7.31719 5.44219Z" fill="#6B7280"/>
              </svg>
            </span>
            Export 
          </button> */}
          <HighlightButton 
  type="secondary" 
  onClick={() => setShowExportModal(true)}
>
  <ExportIcon />
  Export
</HighlightButton>

<HighlightButton 
  type="primary"
  onClick={openModal}
>
  <AddIcon />
  {currentTab === "Agreement" ? "Add Document" : " Add Demand Letter"}
</HighlightButton>
          {/* <button 
            style={{fontSize:'18px', fontFamily: "Plus_Jakarta"}}
            onClick={openModal}
            className="flex items-center px-6 py-3 bg-gray-900 rounded-lg text-white"
          >
            <svg className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add {currentTab === "Agreement" ? "Document" : "Demand Letter"}
          </button> */}
        </div>
      </div>

      <div className="mt-6 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <DocumentTable onTabChange={handleTabChange} />
        </div>
      </div>

      <AddDocumentsModal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        documentType={currentTab === "Agreement" ? "Agreement for sale" : "Demand letters"}
      />

      {showExportModal && (
        <ExportModal
          documentType={currentTab === "Agreement" ? "Agreement for sale" : "Demand letters"}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Document;