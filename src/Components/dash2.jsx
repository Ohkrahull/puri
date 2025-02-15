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

const Dashboard = () => {
  const { bookings, updateBooking, deleteBooking } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  const handleEditClick = (booking) => {
    setEditingBooking(booking);
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-8 lg:p-12 ml-5" >
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

      <div className="mt-6">
        <DashboardMetrics />
      </div>

      <div className="mt-6 rounded-lg overflow-hidden flex justify-around">
        {/* <div>
          <GuestTable/>
        </div> */}
        <div className="overflow-x-auto flex justify-around gap-[40px]">
        <GuestDashTable/>
        {/* <VisitorsComponent/> */}
          <Dashboardbooking bookings={bookings} onEditClick={handleEditClick} onDeleteClick={deleteBooking} />
        </div>
      </div>

      {/* Bottom Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-lg overflow-hidden">
          <MessagesTable/>
        </div>
        <div className="bg-white rounded-lg overflow-hidden">
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