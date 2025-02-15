import React, { useState } from 'react'

const TopBottm = () => {
    const [activeTab, setActiveTab] = useState("Feedback");
  return (
    <div>

<div className="flex  mt-8 relative justify-start text-left">
            <div
              className={`flex-1 text-start pb-2 cursor-pointer ${
                activeTab === "Feedback"
                  ? "text-gray-900 font-semibold"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("Feedback")}
            >
              <span style={{ fontSize: "16px" }}>Amenities</span>
              <span
                style={{
                  fontSize: "16px",
                  marginLeft: "20px",
                  color: "#4B5563",
                }}
              >
                Services
              </span>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-200">
              <div
                className="h-full bg-gray-900 transition-all duration-300 ease-in-out"
                style={{
                  width: "7%",
                  transform: `translateX(${
                    activeTab === "Feedback" ? "0%" : "0%"
                  })`,
                }}
              ></div>
            </div>
          </div>
    </div>
  )
}

export default TopBottm