import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from "./CustomScrollbar.module.css";
import "../App.css";
import SideBar from "./SideBar";
import "../index.css";
import ConstrcutionLeft from "./constrcutionLeft";
import ConstructionrightEdit from "./constrcutionRightEdit";
import { toast } from 'react-toastify';
import { fetchConstructionUpdates, editConstructionUpdate } from '../firebase/services/constructionUpdate';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ConstructionEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  const [leftData, setLeftData] = useState({
    heading: "",
    subText: "",
    images: [],
    isValid: false
  });
  const [rightData, setRightData] = useState({
    selectedWings: [],
    certificateFile: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

 const fetchData = useCallback(async () => {
    try {
      const updates = await fetchConstructionUpdates();
      const data = updates.find(update => update.id === id);
      if (data) {
        setLeftData({
          heading: data.heading,
          subText: data.subText,
          images: data.images.map(url => ({ id: Date.now(), preview: url })),
          isValid: true
        });
        setRightData({
          selectedWings: data.selectedWings,
          certificateFile: data.certificateFile
        });
      } else {
        setError("Construction update not found");
      }
    } catch (error) {
      console.error("Error fetching construction update:", error);
      setError("Failed to load construction update");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLeftDataChange = (newData) => {
    setLeftData(newData);
  };

  const handleRightDataChange = useCallback((newData) => {
    setRightData(prevData => ({...prevData, ...newData}));
  }, []);

//   const handleFormSubmit = async () => {
//     try {
//       const updatedData = {
//         id,
//         ...leftData,
//         ...rightData,
//         // Add any other fields that need to be updated
//       };
//       await editConstructionUpdate(updatedData);
//       console.log("Construction data updated successfully");
//       // Redirect to the construction list page or show a success message
//     } catch (error) {
//       console.error("Error updating construction data:", error);
//       // Handle the error (e.g., show an error message to the user)
//     }
//   };
const handleFormSubmit = async () => {
    try {
      setIsLoading(true);
      
      let certificateFileUrl = rightData.certificateFile;

      // If there's a new file, upload it
      if (rightData.file) {
        const storage = getStorage();
        const storageRef = ref(storage, `certificates/${rightData.file.name}`);
        await uploadBytes(storageRef, rightData.file);
        certificateFileUrl = await getDownloadURL(storageRef);
      }

      // Prepare the updated data
      const updatedData = {
        id,
        heading: leftData.heading,
        subText: leftData.subText,
        images: leftData.images.map(img => img.preview), // Assuming preview contains the URL
        selectedWings: rightData.selectedWings,
        certificateFile: certificateFileUrl,
        // Add any other fields that need to be updated
      };

      // Update the construction data
      await editConstructionUpdate(updatedData);

      toast.success("Construction data updated successfully");
      navigateRef.current('/construction');
    } catch (error) {
      console.error("Error updating construction data:", error);
      toast.error("Failed to update construction data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-full">
          <div className="animate-pulse flex justify-center items-center mt-[100px]">
            <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-4 bg-gray-200 rounded-full mx-2"></div>
            <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-red-500 mb-4">{error}</p>
          <Link to="/construction" className="text-blue-500 hover:underline">Back to Construction Updates</Link>
        </div>
      );
    }

    return (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className={`${styles.customScrollbar} text-gray-900 text-2xl font-bold mb-2`}>
                Edit Update
              </h1>
              <p className="text-base text-gray-400 font-medium">
                Modify your construction update details.
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
                <ConstrcutionLeft onDataChange={handleLeftDataChange} data={leftData} />
              </div>
              <div className="w-full lg:w-[calc(30%-16px)]">
                <ConstructionrightEdit 
                  leftData={leftData} 
                  rightData={rightData}
                  onRightDataChange={handleRightDataChange}
                  onSubmit={handleFormSubmit}
                  shouldReset={false}
                />
              </div>
            </div>
          </div>
        </>
      );
    };
  
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
        <div className="flex h-screen overflow-hidden font-plus-jakarta" style={{
          fontFamily: "Plus_Jakarta",
          background: "var(--Gray-25, #F9FAFB)",
        }}>
          {/* <div className="w-[320px] overflow-y-auto hide-scrollbar">
            <SideBar />
          </div> */}
  
          <div className="flex-1 overflow-x-hidden overflow-y-auto hide-scrollbar">
            <div className="p-4 sm:p-6 lg:p-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </>
    );
  };

export default ConstructionEdit;