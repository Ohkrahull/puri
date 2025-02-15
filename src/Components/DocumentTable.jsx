import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CustomScrollbar.module.css';
import FeedbackDashboard from '../Components/feedbackDashboard'; // Adjust the import path as needed
import SpecialReqDashboard from '../Components/specialReqDashboard'; // Adjust the import path as needed
import DocumentTableDashboard from '../Tables/DocumentTableDashboard'
import DemandLetterDashboard from '../Tables/DemandLetterDashboard';
const DocumentTable = () => {
  const [activeTab, setActiveTab] = useState('Agreement for sale');
  const navigate = useNavigate();

  const handleViewAll = () => {
    if (activeTab === 'Agreement for sale') {
      navigate('/document');
    } else {
      navigate('/document');
    }
  };

  return (
    <div className={`${styles.customScrollbar} relative border rounded-2xl overflow-hidden  w-auto bg-gray-200 h-[446px]`}>
      <div className="sticky top-0 bg-white z-20">
        <div className="p-4">
        <div className="mt-2 flex justify-between">
            <div className="inset-y-0 left-0 items-center pl-3 pointer-events-none text-gray-900">
              <h1 className="font-bold text-gray-900" style={{fontSize:'16px'}}>Documents</h1>
              <span className="text-gray-400" style={{fontSize:'12px'}}>View all your documents</span>
            </div>
            <div className="text-end flex justify-center mr-4 cursor-pointer" onClick={handleViewAll}>
              <span className="text-gray-700 font-bold underline text-end" style={{fontSize:'12px'}}>
                View all
              </span>
              <svg
                className="h-4 w-2 ml-2 mt-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
              </svg>
            </div>
          </div>

          <div className="flex mt-8 ml-4">
            <div className="flex flex-col cursor-pointer relative" onClick={() => setActiveTab('Agreement for sale')}>
              <span className={`font-bold ${activeTab === 'Agreement for sale' ? 'text-gray-900' : 'text-gray-400'}`}>Agreement for sale</span>
              {activeTab === 'Agreement for sale' && (
                <span className="border-b-2 border-gray-900 w-full"></span>
              )}
            </div>
            <div className="flex flex-col ml-7 cursor-pointer relative" onClick={() => setActiveTab('Demand Letter')}>
              <span className={`font-bold ${activeTab === 'Demand Letter' ? 'text-gray-900' : 'text-gray-400'}`}>Demand Letter</span>
              {activeTab === 'Demand Letter' && (
                <span className="border-b-2 border-gray-900 w-full"></span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden" style={{overflow: 'hidden'}}>
        {activeTab === 'Agreement for sale' ? <DocumentTableDashboard/> : <DemandLetterDashboard />}
      </div>
    </div>
  );
};

export default DocumentTable;
