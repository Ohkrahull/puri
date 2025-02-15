import React, { useState, useCallback } from "react";
import styles from './CustomScrollbar.module.css';
import "../App.css";
import "../index.css";
import MemberTable from "./MemberTable";
import GuestTable from "../Tables/GuestTable";
import AddMemberModal from './AddmemberModal';
import AddStaffModal from "./AddStaffModal";
import { toast } from "react-toastify";
import StaffTable from "../Tables/StaffTable";
import ExportModal from './exportUser';

const Users = () => {
    const [activeTab, setActiveTab] = useState("Members");
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
    const [refreshStaffTable, setRefreshStaffTable] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showExportModal, setShowExportModal] = useState(false);

    const handleCloseModal = () => {
      setShowExportModal(false);
    };

    const renderAddButton = () => {
        if (activeTab === "Guests") return null;
        return (
            <button
                onClick={() => {
                    if (activeTab === "Members") {
                        setIsAddMemberModalOpen(true);
                    } else {
                        setIsAddStaffModalOpen(true);
                    }
                }}
                style={{
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
                Add {activeTab === "Members" ? "Member" : "Staff"}
            </button>
        );
    };

    const renderTable = () => {
        switch(activeTab) {
            case "Members":
                return <MemberTable refreshTrigger={refreshTrigger} />;
            case "Staff":
                return <StaffTable refreshTrigger={refreshStaffTable} />;
            case "Guests":
                return <GuestTable />;
            default:
                return null;
        }
    };

    const handleAddMember = useCallback(async (newMember) => {
        try {
            console.log("New member added : ", newMember);
            setIsAddMemberModalOpen(false);
            setRefreshTrigger(prev => prev + 1);
            toast.success("Member added successfully");
        } catch (error) {
            console.error("Error adding new Member : ", error);
            toast.error('Error adding member. Please try again.');
        }
    }, []);

    const handleAddStaff = useCallback((newStaff) => {
        console.log('New staff:', newStaff);
        setIsAddStaffModalOpen(false);
        setRefreshStaffTable(prev => !prev);
        toast.success("New staff member added successfully");
    }, []);

    return (
        <>
            <div className="p-8 lg:p-12">
                <div className="flex justify-between">
                    <div>
                        <h1 className={`${styles.customScrollbar} flex-1 text-gray-900`} style={{ fontWeight: "bold", fontSize: "24px", lineHeight: "32px", gap: "2px", fontFamily:'Plus_Jakarta' }}>
                            Users
                        </h1>
                        <p className="gap-2" style={{ fontSize: "17px", color: "var(--Gray-400, #6B7280)", fontStyle: "normal", fontWeight: "500", lineHeight: "28px", fontFamily:'Plus_Jakarta' }}>
                            Manage all your users from one place.
                        </p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", justifyItems: "flex-end" }}>
                        <button
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
                        </button>
                        {renderAddButton()}
                    </div>
                </div>

                <div className="flex mt-8 relative justify-start text-left" style={{ gap: '24px', borderBottom: '1px solid var(--Gray-200, #D1D5DB)', fontFamily:'Plus_Jakarta' }}>
                    {["Members", "Staff", "Guests"].map((tab) => (
                        <div
                            key={tab}
                            className={`pb-2 cursor-pointer ${activeTab === tab ? "text-gray-900 font-semibold border-b-2 border-gray-900" : "text-gray-400"}`}
                            onClick={() => setActiveTab(tab)}
                            style={{ fontSize: "16px", fontFamily:'Plus_Jakarta', fontStyle: "normal", fontWeight: 500, lineHeight: "24px" }}
                        >
                            {tab}
                        </div>
                    ))}
                </div>
                <div className="mt-6 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        {renderTable()}
                    </div>
                </div>
            </div>
            <AddMemberModal
                isOpen={isAddMemberModalOpen}
                onClose={() => setIsAddMemberModalOpen(false)}
                onAdd={handleAddMember}
            />
            <AddStaffModal
                isOpen={isAddStaffModalOpen}
                onClose={() => setIsAddStaffModalOpen(false)}
                onAdd={handleAddStaff}
            />
            {showExportModal && (
                <ExportModal
                    activeTab={activeTab}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default Users;