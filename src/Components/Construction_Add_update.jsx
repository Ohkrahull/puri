import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./CustomScrollbar.module.css";
import "../App.css";
import SideBar from "./SideBar";
import "../index.css";
import Construction_add_upd from "./Consttuction_add_updat";
import Construction_add_up_right from "./Construction_add_up_right";

const Construction_Add_update = () => {
  const [leftData, setLeftData] = useState({
    heading: "",
    subText: "",
    images: []
  });

  const [shouldReset, setShouldReset] = useState(false);
  const handleLeftDataChange = (newData) => {
    setLeftData(newData);
    console.log('Updated left data:', newData);
  };

  const handleFormReset = () => {
    setLeftData({
      heading: "",
      subText: "",
      images: []
    });
    setShouldReset(true);
    // Reset shouldReset after a short delay to allow components to react
    setTimeout(() => setShouldReset(false), 100);
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
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className={`${styles.customScrollbar} text-gray-900 text-2xl font-bold mb-2`}>
                  Add Update
                </h1>
                <p className="text-base text-gray-400 font-medium">
                  Manage all your construction updates in one place.
                </p>
              </div>
              <Link to='/construction' style={{fontSize:'18px', fontFamily: "Plus_Jakarta", gap:'7px'}} className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="gap:'10px" fill="#000000" viewBox="0 0 256 256">
                  <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                </svg>
                Back
              </Link>
            </div>

            <div className="w-full rounded-lg overflow-hidden">
              <div className="flex flex-col lg:flex-row justify-between gap-8">
                <div className="w-full lg:w-[calc(70%-16px)]">
                  {/* <Construction_add_upd onDataChange={handleLeftDataChange} /> */}
                  <Construction_add_upd onDataChange={handleLeftDataChange} data={leftData}  shouldReset={shouldReset}/>
                </div>
                <div className="w-full lg:w-[calc(30%-16px)]">
                <Construction_add_up_right leftData={leftData} onFormReset={handleFormReset} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Construction_Add_update;