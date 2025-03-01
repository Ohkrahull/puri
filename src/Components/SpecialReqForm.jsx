import React from "react";
import { useLocation, Link } from "react-router-dom";
import Special_req_Tell_us from "./Special_req_Tell_Us";
import PersonalInfoForm from "./PersonalInfoForm";
import SideBar from './SideBar';
import styles from "./CustomScrollbar.module.css";
import "../App.css";
import { ChevronLeft } from "lucide-react";

const SpecialReqForm = () => {
  const location = useLocation();
  const requestData = location.state?.requestData;
  console.log("reqData", requestData);

  if (!requestData) {
    return <div>Error: No request data available</div>;
  }

  return (
    <>
      <style>
        {`
          .hide-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div
        className="flex h-screen overflow-hidden font-plus-jakarta"
        style={{
          fontFamily: "Plus_Jakarta",
          background: "var(--Gray-25, #F9FAFB)",
        }}
      >
        {/* Left Sidebar (320px) */}
        {/* <div className="w-[320px] overflow-y-auto hide-scrollbar">
          <SideBar />
        </div> */}

        {/* Main Content Area */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto hide-scrollbar">
          <div className="p-2 lg:p-0 lg:ml-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
               <Link to="/special_request" className="flex items-center gap-2 text-[#6B7280] cursor-pointer"
          // onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-7 w-7 bg-[#F3F4F6] p-1.5 rounded" />
          <span className="text-[16px] font-medium">Back</span>
        </Link>
              {/* <div>
                <h1 className={`${styles.customScrollbar} text-gray-900 text-2xl font-bold mb-2`}>
                  Special Request
                </h1>
                <p className="text-base text-gray-400 font-medium">
                  Keep track of all your requests from one place.
                </p>
              </div> */}
              {/* <Link to='/special_request'
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
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="gap:'10px" fill="#000000" viewBox="0 0 256 256">
                <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
              </svg>
                </span>
                Back
              </Link> */}
            </div>

            <div className="w-full rounded-lg overflow-hidden">
              <div className="flex flex-col lg:flex-row justify-between gap-8">
                <div className="w-full lg:w-[calc(70%-16px)]">
                  <Special_req_Tell_us req={requestData} />
                </div>
                <div className="w-full lg:w-[calc(30%-16px)]">
                  <PersonalInfoForm userInfo={requestData.userInfo} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpecialReqForm;