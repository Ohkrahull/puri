import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchReferralById } from '../firebase/services/Referals';
import styles from "./CustomScrollbar.module.css";
import SideBar from './SideBar';
import ReferalsForm_Left from './referralForm_left';
import PersonalInfoForm from "./PersonalInfoFormSP";
import Loader from './Loader';
import { ChevronLeft } from 'lucide-react';

const ReferalNext = () => {
  const { id } = useParams(); // Extract referralId from URL
  const [referral, setReferral] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadReferral = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!id) {
          throw new Error('No referral ID provided');
        }
        const fetchedReferral = await fetchReferralById(id);
        console.log('Fetched referral:', fetchedReferral);
        if (fetchedReferral) {
          setReferral(fetchedReferral);
        } else {
          throw new Error('Referral not found');
        }
      } catch (error) {
        console.error('Error fetching referral:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadReferral();
  }, [id]);

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
            <Link to="/referrals" className="flex items-center gap-2 text-[#6B7280] cursor-pointer"
          // onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-7 w-7 bg-[#F3F4F6] p-1.5 rounded" />
          <span className="text-base font-medium">Back</span>
        </Link>
              {/* <div>
                <h1 className={`${styles.customScrollbar} text-gray-900 text-2xl font-bold mb-2`} style={{fontSize:'25px'}}>
                  Referrals
                </h1>
                <p className="text-base text-gray-400 font-medium" style={{fontSize:'16px'}}>
                  User referral details
                </p>
              </div> */}
              {/* <Link to='/referrals'
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
                  marginRight:'30px'
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
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                <Loader />
              </div>
              ) : error ? (
                <div className="text-red-500 text-center">
                  <p>Error: {error}</p>
                  <button onClick={() => navigate('/referrals')} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                    Go back to referrals list
                  </button>
                </div>
              ) : referral ? (
                <div className="flex flex-col lg:flex-row justify-between gap-8">
                  <div className="w-full lg:w-[calc(70%-16px)]">
                    <ReferalsForm_Left feedback={referral} />
                  </div>
                  <div className="w-full lg:w-[calc(30%-16px)]">
                    <PersonalInfoForm userInfo={referral.userInfo} />
                  </div>
                </div>
              ) : (
                <div className="text-center">No referral data available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReferalNext;