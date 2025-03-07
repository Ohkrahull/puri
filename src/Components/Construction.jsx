// import React, { useEffect, useState } from "react";
// import styles from './CustomScrollbar.module.css';
// import "../App.css";
// import "../index.css";
// import ConstructionUpdatetable from "./ConstructionUpdateTable";
// import { Link } from "react-router-dom";
// import ExportModal from "./constructionUpdateExport";
// import { saveTargetDate, getTargetDate } from '../firebase/services/constructionUpdate'
// import SingleDatePicker from "./SingleDatePickerForAddBooking";
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import SetTargetDateModal from "./SetTargetDateModal";
// import { ExportIcon, HighlightButton } from "./HighLightButton";

// const Construction = () => {
//     const [showExportModal, setShowExportModal] = useState(false);
//     const [showTargetDateModal, setShowTargetDateModal] = useState(false);
//     const [targetDate, setTargetDate] = useState("");

//     useEffect(() => {
//       const fetchTargetDate = async () => {
//         const date = await getTargetDate();
//         if (date) {
//           setTargetDate(formatDate(date.toDate()));
//         }
//       };
//       fetchTargetDate();
//     }, []);

//     const formatDate = (date) => {
//       return date.toLocaleDateString('en-GB', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric'
//       }).split('/').join('-');
//     };

//     const handleCloseModal = () => {
//       setShowExportModal(false);
//     };

    
 
//   return (
//     <div className="p-2 lg:p-0 lg:ml-10">
//       <div className="flex justify-between">
//         <div>
//           <h1
//             className={`${styles.customScrollbar} flex-1 text-gray-900`}
//             style={{
//               fontWeight: "bold",
//               fontSize: "24px",
//               lineHeight: "32px",
//               gap: "2px",
//             }}
//           >
//             Construction Update
//           </h1>
//           <p
//             className="gap-2"
//             style={{
//               fontSize: "17px",
//               color: "var(--Gray-400, #6B7280)",
//               fontStyle: "normal",
//               fontWeight: "500",
//               lineHeight: "28px",
//             }}
//           >
//             All your recent Construction update in one place.
//           </p>
//         </div>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             gap: "10px",
//             justifyItems: "flex-end",
//           }}
//         >
//          <button
//               onClick={() => setShowTargetDateModal(true)}
//               style={{
//                 display: "flex",
//                 padding: "12px 24px",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 borderRadius: "10px",
//                 fontSize: "16px",
//                 fontFamily: "Plus_Jakarta",
//                 backgroundColor: "#030712",
//                 color: "#fff",
//               }}
//             >
//               Set Target Date
//             </button>

//           {/* <button
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
//           </button> */}
//            <HighlightButton 
//   type="secondary" 
//   onClick={() => setShowExportModal(true)}
// >
//   <ExportIcon />
//   Export
// </HighlightButton>
//           <Link to='/constructionupdate'
//             style={{
//               display: "flex",
//               padding: "12px 24px",
//               justifyContent: "center",
//               alignItems: "center",
//               borderRadius: "10px",
//               fontSize: "16px",
//               fontFamily: "Plus_Jakarta",
//               backgroundColor: "#030712",
//               color: "#fff",
//             }}
//           >
//             <span>
//               <svg
//                 className="w-5 h-5 mr-3 text-white"
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="20"
//                 height="20"
//                 viewBox="0 0 20 20"
//                 fill="none"
//               >
//                 <path
//                   d="M17.5 10C17.5 10.1658 17.4342 10.3247 17.3169 10.4419C17.1997 10.5592 17.0408 10.625 16.875 10.625H10.625V16.875C10.625 17.0408 10.5592 17.1997 10.4419 17.3169C10.3247 17.4342 10.1658 17.5 10 17.5C9.83424 17.5 9.67527 17.4342 9.55806 17.3169C9.44085 17.1997 9.375 17.0408 9.375 16.875V10.625H3.125C2.95924 10.625 2.80027 10.5592 2.68306 10.4419C2.56585 10.3247 2.5 10.1658 2.5 10C2.5 9.83424 2.56585 9.67527 2.68306 9.55806C2.80027 9.44085 2.95924 9.375 3.125 9.375H9.375V3.125C9.375 2.95924 9.44085 2.80027 9.55806 2.68306C9.67527 2.56585 9.83424 2.5 10 2.5C10.1658 2.5 10.3247 2.56585 10.4419 2.68306C10.5592 2.80027 10.625 2.95924 10.625 3.125V9.375H16.875C17.0408 9.375 17.1997 9.44085 17.3169 9.55806C17.4342 9.67527 17.5 9.83424 17.5 10Z"
//                   fill="white"
//                 />
//               </svg>
//             </span>
//             Add Update
//           </Link>
//         </div>
//       </div>

//       <div className="mt-6 rounded-lg overflow-hidden">
//         <div className="overflow-x-auto">
//           <ConstructionUpdatetable/>
//         </div>
//       </div>

//       {showExportModal && (
//         <ExportModal
//           onClose={handleCloseModal}
//         />
//       )}
//  {showTargetDateModal && (
//           <SetTargetDateModal
//             onClose={() => setShowTargetDateModal(false)}
//           />
//         )}
//     </div>
//   );
// };

// export default Construction;
import React, { useEffect, useState } from "react";
import styles from './CustomScrollbar.module.css';
import "../App.css";
import "../index.css";
import ConstructionUpdatetable from "./ConstructionUpdateTable";
import { Link } from "react-router-dom";
import ExportModal from "./constructionUpdateExport";
import { saveTargetDate, getTargetDate } from '../firebase/services/constructionUpdate'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SetTargetDateModal from "./SetTargetDateModal";
import { ExportIcon, HighlightButton } from "./HighLightButton";

const Construction = () => {
    const [showExportModal, setShowExportModal] = useState(false);
    const [showTargetDateModal, setShowTargetDateModal] = useState(false);
    const [targetDate, setTargetDate] = useState("");
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

    useEffect(() => {
      const fetchTargetDate = async () => {
        const date = await getTargetDate();
        if (date) {
          setTargetDate(formatDate(date.toDate()));
        }
      };
      fetchTargetDate();
    }, []);

    const formatDate = (date) => {
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).split('/').join('-');
    };

    const handleCloseModal = () => {
      setShowExportModal(false);
    };

    return (
      <div className="p-2 lg:p-0 lg:ml-10">
        <div className={`${isMobile ? 'flex-col space-y-4' : 'flex justify-between items-center'}`}>
          <div className={isMobile ? 'mb-2 text-start' : ''}>
            <h1 
              className={`${styles.customScrollbar} text-gray-900`}
              style={{
                fontWeight: "bold",
                fontSize: isMobile ? "20px" : "24px",
                lineHeight: isMobile ? "28px" : "32px",
                gap: "2px"
              }}
            >
              Construction Update
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
              All your recent Construction update in one place.
            </p>
          </div>
          <div className={`
            ${isMobile 
              ? 'flex flex-col space-y-2 w-full' 
              : ' items-center justify-end'
            }
          `} >
<HighlightButton 
              type="primary"
              onClick={() => setShowTargetDateModal(true)}
              className={isMobile ? 'w-full' : ''}
            >
              Set Target Date
            </HighlightButton>
            </div>

          <div className={`
            ${isMobile 
              ? 'flex  w-full justify-between' 
              : 'flex items-center space-x-2'
            }
          `}>
            

            <HighlightButton 
              type="secondary" 
              onClick={() => setShowExportModal(true)}
              // className={isMobile ? 'w-full' : ''}
            >
              <ExportIcon />
              {isMobile ? 'Export' : 'Export'}
            </HighlightButton>

            {/* <Link 
              to='/constructionupdate'
              className={`
                flex items-center justify-center 
                px-6 py-3 
                bg-gray-900 
                rounded-lg 
                text-white 
                font-plus-jakarta 
                text-base
                ${isMobile ? 'w-full' : ''}
              `}
            >
              <svg 
                className="w-5 h-5 mr-3 text-white" 
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M17.5 10C17.5 10.1658 17.4342 10.3247 17.3169 10.4419C17.1997 10.5592 17.0408 10.625 16.875 10.625H10.625V16.875C10.625 17.0408 10.5592 17.1997 10.4419 17.3169C10.3247 17.4342 10.1658 17.5 10 17.5C9.83424 17.5 9.67527 17.4342 9.55806 17.3169C9.44085 17.1997 9.375 17.0408 9.375 16.875V10.625H3.125C2.95924 10.625 2.80027 10.5592 2.68306 10.4419C2.56585 10.3247 2.5 10.1658 2.5 10C2.5 9.83424 2.56585 9.67527 2.68306 9.55806C2.80027 9.44085 2.95924 9.375 3.125 9.375H9.375V3.125C9.375 2.95924 9.44085 2.80027 9.55806 2.68306C9.67527 2.56585 9.83424 2.5 10 2.5C10.1658 2.5 10.3247 2.56585 10.4419 2.68306C10.5592 2.80027 10.625 2.95924 10.625 3.125V9.375H16.875C17.0408 9.375 17.1997 9.44085 17.3169 9.55806C17.4342 9.67527 17.5 9.83424 17.5 10Z"
                  fill="white"
                />
              </svg>
              Add Update
            </Link> */}
          <Link to='/constructionupdate'
            style={{
              // display: "flex",
              // padding: "14px 24px",
              // justifyContent: "center",
              // alignItems: "center",
              // borderRadius: "10px",
              // fontSize: "16px",
              // fontFamily: "Plus_Jakarta",
              // backgroundColor: "#030712",
              // color: "#fff",
              display: "flex",
    padding: "12px 24px",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10px",
    fontSize: "16px",
    fontFamily: "Plus_Jakarta",
    backgroundColor: "#030712",
    color: "#fff",
    
            }}
            // className={`
            //     flex items-center justify-center 
            //     px-7 py-4 
            //     bg-gray-900 
            //     rounded-lg 
            //     text-white 
            //     font-plus-jakarta 
            //     text-base
                
            //   `}
          >
            <span>
              <svg
                className="w-5 h-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M17.5 10C17.5 10.1658 17.4342 10.3247 17.3169 10.4419C17.1997 10.5592 17.0408 10.625 16.875 10.625H10.625V16.875C10.625 17.0408 10.5592 17.1997 10.4419 17.3169C10.3247 17.4342 10.1658 17.5 10 17.5C9.83424 17.5 9.67527 17.4342 9.55806 17.3169C9.44085 17.1997 9.375 17.0408 9.375 16.875V10.625H3.125C2.95924 10.625 2.80027 10.5592 2.68306 10.4419C2.56585 10.3247 2.5 10.1658 2.5 10C2.5 9.83424 2.56585 9.67527 2.68306 9.55806C2.80027 9.44085 2.95924 9.375 3.125 9.375H9.375V3.125C9.375 2.95924 9.44085 2.80027 9.55806 2.68306C9.67527 2.56585 9.83424 2.5 10 2.5C10.1658 2.5 10.3247 2.56585 10.4419 2.68306C10.5592 2.80027 10.625 2.95924 10.625 3.125V9.375H16.875C17.0408 9.375 17.1997 9.44085 17.3169 9.55806C17.4342 9.67527 17.5 9.83424 17.5 10Z"
                  fill="white"
                />
              </svg>
            </span>
            Add Update
          </Link>
          </div>
        </div>

        <div className="mt-6 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <ConstructionUpdatetable isMobile={isMobile} />
          </div>
        </div>

        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className={`bg-white rounded-lg shadow-lg ${isMobile ? 'w-11/12' : ''}`}>
              <ExportModal
                onClose={handleCloseModal}
                isMobile={isMobile}
              />
            </div>
          </div>
        )}

        {showTargetDateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className={`bg-white rounded-lg shadow-lg ${isMobile ? 'w-11/12' : ''}`}>
              <SetTargetDateModal
                onClose={() => setShowTargetDateModal(false)}
                isMobile={isMobile}
              />
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    );
};

export default Construction;