import React, { useState } from 'react';
import GuestTable from './GuestTable';
import DeliveryTable from './DeliveryTable';
// Import other table components
// import HelperTable from './HelperTable';
// import CabTable from './CabTable';
// import OthersTable from './OthersTable';

const VisitorsComponent = () => {
  const [activeTab, setActiveTab] = useState('Guest');
  const [activeFilter, setActiveFilter] = useState('Current');
  
  const tabs = ['Guest', 'Helper', 'Delivery', 'Cab', 'Others'];
  const filters = ['Current', 'Expected', 'Visited'];

  // Function to render the appropriate table based on active tab
  const renderTable = () => {
    switch(activeTab) {
      case 'Guest':
        return <GuestTable />;
      case 'Delivery':
        return <DeliveryTable />;
      case 'Helper':
        // return <HelperTable />;
        return <div>Helper Table Component</div>;
      case 'Cab':
        // return <CabTable />;
        return <div>Cab Table Component</div>;
      case 'Others':
        // return <OthersTable />;
        return <div>Others Table Component</div>;
      default:
        return <GuestTable />;
    }
  };

  return (
    <div className="bg-white rounded-3xl">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-[22px] font-medium text-gray-900 mb-1">Visitors</h2>
            <a href="#" className="text-[15px] text-gray-500 hover:underline">
              View all your visitors
            </a>
          </div>
          
          <div className="flex gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-[15px] font-medium ${
                  activeFilter === filter
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-6 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[15px] font-medium relative ${
                activeTab === tab
                  ? 'text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {renderTable()}
        </div>
      </div>
    </div>
  );
};

export default VisitorsComponent;