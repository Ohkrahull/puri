import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './context/AuthContext'; // Make sure this path is correct
import styled from 'styled-components';

// Import your components here
import Dashboard from './Components/dash2';
import Admin from './Components/Admin';
import AddBooking from './Components/AddBooking';
import FeedBack from './Components/FeedBAck';
import FedBackForm from './Components/FeedBackForm';
import NotFoundFeedback from './Components/NotFoundFeedback';
import SpecialRequest from './Components/SpecialReq';
import SpecialReqForm from './Components/SpecialReqForm';
import Document from './Components/Document';
import Construction from './Components/Construction';
import ConstructionEdit from './Components/constructionEdit';
import Construction_Add_update from './Components/Construction_Add_update';
import User from './Components/Users';
import Referrals from './Components/Refrel';
import ReferalNext from './Components/RefrelNext';
import Support from './Components/Support';
import Login1 from './Components/Login1';
import Forgot from './Components/Forgot'
import ChangePassword from './Components/chnagePass';
import ExportModal from './Components/expotCustomeDateBooking';
import SupportView from './Components/SupportView';
import Layout from './Components/Layout';
import Flatmain from './Components/FlatMain';
import FlatNoform from './Components/FlatNoForm';
import SosMain from './Components/SosMain';
import Facility from './Components/Facility';
import AmenityDetailsForm from './Components/Addamenity';
import ParcelsMain from './Components/ParcelsMain';
import HelperMain from './Components/HelperMain';
import GuestMain from './Components/GuestMain';
import NoticesMain from './Components/NoticesMain';
import NoticeForm from './Components/NoticeForm';
import { fcmService } from '../src/services/fcmServices';
import DeliveryMain from './Components/DeliveryMain';
import CabMain from './Components/CabMain';
import OtherMain from './Components/OtherMain';
import HelperProfile from './Components/HelperProfile';
import UserRequestMain from './Components/UserRequestMain';
import ResidentMain from './Components/Resident';
import GuestLogin from './Components/GuestLogin';
import HelperUser from './Components/HelperUser';
import AddHelperForm from './Components/AddHelper';
import GuardUser from './Components/GuardUser';
import AddGuardForm from './Components/AddGuard';

// Custom Loader component
const Loader = () => {
  return (
    <StyledWrapper>
      <div className="ui-loader loader-blk">
        <svg viewBox="22 22 44 44" className="multiColor-loader">
          <circle
            cx="44"
            cy="44"
            r="20.2"
            fill="none"
            strokeWidth={3.6}
            className="loader-circle loader-circle-animation"
          />
        </svg>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .ui-loader {
    display: inline-block;
    width: 50px;
    height: 50px;
  }

  .loader-blk {
    color: #3f51b5;
    animation: rotate-outer08 1.4s linear infinite;
  }

  .multiColor-loader {
    display: block;
    animation: color-anim08 1.4s infinite;
  }

  .loader-circle {
    stroke: currentColor;
  }

  .MuiCircularProgress-circleStatic {
    transition: stroke-dashoffset 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0s;
  }

  .loader-circle-animation {
    animation: rotate-inner08 1.4s ease-in-out infinite;
    stroke-dasharray: 80px, 200px;
    stroke-dashoffset: 0;
  }

  @keyframes rotate-outer08 {
    0% {
      transform-origin: 50% 50%;
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes rotate-inner08 {
    0% {
      stroke-dasharray: 1px, 200px;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 100px, 200px;
      stroke-dashoffset: -15px;
    }
    100% {
      stroke-dasharray: 100px, 200px;
      stroke-dashoffset: -125px;
    }
  }

  @keyframes color-anim08 {
    0% {
      color: #4285f4;
    }
    25% {
      color: #ea4335;
    }
    50% {
      color: #f9bb2d;
    }
    75% {
      color: #34a853;
    }
  }
`;
// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Loader /></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route component (for login page)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();


  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Loader /></div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};



function App() {


 

  useEffect(() => {
    const initFCM = async () => {
      try {
        const token = await fcmService.init(process.env.REACT_APP_FIREBASE_VAPID_KEY);
        console.log('FCM Token:', token);
      } catch (error) {
        console.error('FCM Init Error:', error);
      }
    };
    
    initFCM();
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Login1 />
          </PublicRoute>
        } />
        
       {/* Use the Layout component as a parent route */}
       <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<Dashboard />} />

          <Route path="/booking" element={<Admin />} />
          <Route path="/flatmain" element={<Flatmain />} />
          <Route path="/FlatNoform" element={<FlatNoform />} />
          <Route path="/FlatNoForm/:flatId" element={<FlatNoform />} />
          <Route path="/sosHistory" element={<SosMain />} />
          <Route path="/Facility" element={<Facility />} />
          <Route path="/Amenityform" element={<AmenityDetailsForm />} />
          <Route path="/Amenityform/:id" element={<AmenityDetailsForm />} />
          <Route path="/Parcels" element={<ParcelsMain />} />
          <Route path="/Helper" element={<HelperMain />} />
          <Route path="/Helperprofile/:id" element={<HelperProfile />} />
          <Route path="/Guest" element={<GuestMain />} />
          <Route path="/Delivery" element={<DeliveryMain />} />
          <Route path="/Cab" element={<CabMain />} />
          <Route path="/Other" element={<OtherMain />} />
          <Route path="/Notices" element={<NoticesMain />} />
          <Route path="/Noticeform" element={<NoticeForm />} />
          <Route path="/UserRequests" element={<UserRequestMain />} />
          <Route path="/Resident" element={<ResidentMain />} />
          <Route path="/GuestLogin" element={<GuestLogin />} />
          <Route path="/AddHelper" element={<HelperUser />} />
          <Route path="/AddNewHelper" element={<AddHelperForm />} />
          <Route path="/AddGuard" element={<GuardUser />} />
          <Route path="/AddNewGuard" element={<AddGuardForm />} />
          <Route path="/AddNewGuard/:id" element={<AddGuardForm />} />


          <Route path="/booking1" element={<AddBooking />} />
          <Route path="/feedback" element={<FeedBack />} />
          <Route path="/feedbackForm" element={<FedBackForm />} />
          <Route path="/feedbackForm/:id" element={<FedBackForm />} />
          <Route path="/notFoundFeedback" element={<NotFoundFeedback />} />
          <Route path="/special_request" element={<SpecialRequest />} />
          <Route path="/special_requestNext/:requestId" element={<SpecialReqForm />} />
          <Route path="/document" element={<Document />} />
          <Route path="/construction" element={<Construction />} />
          <Route path="/construction/edit/:id" element={<ConstructionEdit />} />
          <Route path="/constructionupdate" element={<Construction_Add_update />} />
          <Route path="/user" element={<User />} />
          <Route path="/referrals" element={<Referrals />} />
          <Route path="/referalNext" element={<ReferalNext />} />
          <Route path="/referalNext/:id" element={<ReferalNext />} />
          <Route path="/support" element={<Support />} />
          <Route path="/support_view/:id" element={<SupportView />} />
          {/* <Route path="/Flatmain" element={<Flatmain} /> */}
        </Route>

        <Route path='/forgot' element={<Forgot/>} />
        <Route path='/change-password' element={<ChangePassword />} />
        <Route path='/export' element={<ExportModal />} />

        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
