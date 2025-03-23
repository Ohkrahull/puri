import React, { useState } from "react";
import styles from "./CustomScrollbar.module.css";
import MessagesTable from "./MessageTable";
import DocumentsTable from "./DocumentTable";
import Dashboardbooking from './DashboardBooking';
import { useAuth } from "../context/AuthContext";
import DashboardMetrics from "./DashboardMetrics";
import GuestTable from "./GuestTable";
import Support from "./Support";
import SupportTable from "../Tables/Support";
import GuestDashTable from "./GuestDashTable";
import VisitorsComponent from "./Visitor";
import SupportDashTable from "../Tables/SupportDashTable";
import RentalReqMain from './RentalReqMain'
import { useSOS } from "../context/SosContext";
import Dashbd from "./Dashbd";

const Dashboard = () => {
  const { bookings, updateBooking, deleteBooking } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  const { showSOS } = useSOS();

  const testSOS = () => {
    showSOS({
      flatNumber: "A-201",
      time:"10 08 AM",
      residentName: "Aakash Bagve",
      residentPhone: "8952625499",
      guardName: "Sahil Toraskar",
      guardPhone: "9254658845",
      status:"Guard Responding"
      // status:{"Guard Responding"}
    });
  };

  const handleEditClick = (booking) => {
    setEditingBooking(booking);
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-2 ml-15 lg:p-0 lg:ml-10" >
      <h1 className={`${styles.customScrollbar} flex-1 text-gray-900`}
          style={{
            fontWeight: "bold",
            fontSize: "24px",
            lineHeight: "32px",
            gap: "2px",
          }}
      >
        Dashboard
      </h1>
      <p className="gap-2  " style={{fontSize:'17px',color: 'var(--Gray-400, #6B7280)', fontStyle:'normal',fontWeight:'500',lineHeight:'28px'}}>
        All your recent activities in one place
      </p>

      <button onClick={testSOS}>Test SOS Alert</button>
      {/* <div>
        <Dashbd/>
      </div> */}

      <div className="mt-6">
        <DashboardMetrics />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* <div>
          <GuestTable/>
        </div> */}
        <div className=" rounded-lg overflow-hidden">
        <GuestDashTable/>
        </div>
        <div className=" rounded-lg overflow-hidden">
        
        {/* <VisitorsComponent/> */}
          <Dashboardbooking bookings={bookings} onEditClick={handleEditClick} onDeleteClick={deleteBooking} />
        </div>
      </div>

      {/* Bottom Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className=" rounded-lg overflow-hidden">
          {/* <MessagesTable/> */}
          <RentalReqMain/>
        </div>
        <div className=" rounded-lg overflow-hidden">
          {/* <DocumentsTable/> */}
          {/* <Support/> */}
          {/* <SupportTable/> */}
          <SupportDashTable/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;