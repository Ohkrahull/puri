import React, { useState, useRef, useEffect } from 'react';
import { saveConstructionUpdate } from '../firebase/services/constructionUpdate';
import { toast } from 'react-toastify';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from 'axios';

const Construction_add_up_right = ({leftData,onFormReset,shouldReset}) => {
  const [selectedWings, setSelectedWings] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [file, setFile] = useState(null);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const wings = ['A Wing', 'B Wing', 'C Wing', 'D Wing'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (shouldReset) {
      setSelectedWings([]);
      setFile(null);
      setIsDropdownOpen(false);
    }
  }, [shouldReset]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleWingSelection = (wing) => {
    setSelectedWings(prev => 
      prev.includes(wing) ? prev.filter(w => w !== wing) : [...prev, wing]
    );
  };
  

  const containerStyle = {
    width: '100%',
    padding: '24px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    marginBottom: '20px'
  };

  const labelStyle = {
    fontWeight: '500',
    fontSize: '16px',
    marginBottom: '8px',
    display: 'block',
    color: '#374151'
  };

  const dropdownButtonStyle = {
    display: 'flex',
    width: '100%',
    padding: '8px 16px',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: '1px solid #D1D5DB',
    borderRadius: '10px',
    color: '#6B7280',
    fontSize: '16px',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    background: 'white',
    cursor: 'pointer',
  };

  const dropdownContentStyle = {
    position: 'absolute',
    top: '100%',
    left: '0',
    zIndex: 1000,
    marginTop: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
    borderRadius: '8px',
    width: '100%',
    border: '1px solid #D1D5DB',
    color: '#6B7280'
  };

  const dropdownItemStyle = {
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    borderBottom: '1px solid #E5E7EB',
    display: 'flex',
    alignItems: 'center',
  };

  const uploadAreaStyle = {
    width: '100%',
    height: '100px',
    border: '2px dashed #E5E7EB',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#030712',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px'
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation(); // Prevent triggering the file input click
    setFile(null);
  };

  // const handleSendUpdate = async () => {
  //   if (!leftData.heading || !leftData.subText || selectedWings.length === 0) {
  //     toast.error('Please fill in the heading, subtext, and select at least one wing.');
  //     return;
  //   }
  
  //   try {
  //     const storage = getStorage();
  //     let fileUrl = null;
  
  //     if (file) {
  //       const storageRef = ref(storage, `certificates/${file.name}`);
  //       await uploadBytes(storageRef, file);
  //       fileUrl = await getDownloadURL(storageRef);
  //     }
  
  //     const imageUrls = await Promise.all(
  //       (leftData.images || []).map(async (image) => {
  //         if (image.file) {
  //           const storageRef = ref(storage, `images/${image.file.name}`);
  //           await uploadBytes(storageRef, image.file);
  //           return await getDownloadURL(storageRef);
  //         }
  //         return image.preview;
  //       })
  //     );
  
  //     const updateData = {
  //       heading: leftData.heading,
  //       subText: leftData.subText,
  //       images: imageUrls,
  //       selectedWings,
  //       certificateFile: fileUrl,
  //     };
  
      
  //   console.log('Sending construction update data:', JSON.stringify(updateData, null, 2));
  //   const updateId = await saveConstructionUpdate(updateData);
  //   console.log('Construction update saved with ID:', updateId);

  //   console.log('Preparing to send notification for the update...');
  //   const notificationHeading = 'Construction Update';
  //   const notificationBody = updateData.heading;
  //   const notificationResult = await sendNotificationToAllUsers(notificationHeading, notificationBody);
  //   console.log('Notification sending completed. Result:', JSON.stringify(notificationResult, null, 2));
    
  //   onFormReset();
  //   setFile(null);
  //   setSelectedWings([]);
  //   toast.success('Update sent successfully and notifications delivered!');
  //   } catch (error) {
  //     console.error('Error in handleSendUpdate:', error);
  //     toast.error('Error sending update or notification. Please try again.');
  //   }
  // };

  // const handleSendUpdate = async () => {
  //   if (!leftData.heading || !leftData.subText || selectedWings.length === 0) {
  //     toast.error('Please fill in the heading, subtext, and select at least one wing.');
  //     return;
  //   }
  
  //   try {
  //     const storage = getStorage();
  //     let fileUrl = null;
  
  //     if (file) {
  //       const storageRef = ref(storage, `certificates/${file.name}`);
  //       await uploadBytes(storageRef, file);
  //       fileUrl = await getDownloadURL(storageRef);
  //     }
  
  //     const imageUrls = await Promise.all(
  //       (leftData.images || []).map(async (image) => {
  //         if (image.file) {
  //           const storageRef = ref(storage, `images/${image.file.name}`);
  //           await uploadBytes(storageRef, image.file);
  //           return await getDownloadURL(storageRef);
  //         }
  //         return image.preview;
  //       })
  //     );
  
  //     const updateData = {
  //       heading: leftData.heading,
  //       subText: leftData.subText,
  //       images: imageUrls,
  //       selectedWings,
  //       certificateFile: fileUrl,
  //     };
  
  //     // console.log('Sending construction update data:', JSON.stringify(updateData, null, 2));
  //     const updateId = await saveConstructionUpdate(updateData);
  //     console.log('Construction update saved with ID:', updateId);

  //     // Show success toast immediately after update is saved
  //     toast.success('Construction update sent successfully!');

  //     // Reset form
  //     onFormReset();
  //     setFile(null);
  //     setSelectedWings([]);
  //     // toast.success('Update sent successfully and notifications delivered!');
  //   } catch (error) {
  //     // console.error('Error in handleSendUpdate:', error);
  //     // toast.error('Error sending update or notification. Please try again.');
  //   }
  // };

  const handleSendUpdate = async () => {
    if (!leftData.heading || !leftData.subText || selectedWings.length === 0) {
      toast.error('Please fill in the heading, subtext, and select at least one wing.');
      return;
    }
  
    try {
      const storage = getStorage();
      let fileUrl = null;
  
      if (file) {
        const storageRef = ref(storage, `certificates/${file.name}`);
        await uploadBytes(storageRef, file);
        fileUrl = await getDownloadURL(storageRef);
      }
  
      const imageUrls = await Promise.all(
        (leftData.images || []).map(async (image) => {
          if (image.file) {
            const storageRef = ref(storage, `images/${image.file.name}`);
            await uploadBytes(storageRef, image.file);
            return await getDownloadURL(storageRef);
          }
          return image.preview;
        })
      );
  
      const updateData = {
        heading: leftData.heading,
        subText: leftData.subText,
        images: imageUrls,
        selectedWings,
        certificateFile: fileUrl,
      };
  
      // console.log('Sending construction update data:', JSON.stringify(updateData, null, 2));
      const updateId = await saveConstructionUpdate(updateData);
      console.log('Construction update saved with ID:', updateId);

      // Show success toast immediately after update is saved
      toast.success('Construction update sent successfully!');

      // Reset form
      onFormReset();
      setFile(null);
      setSelectedWings([]);

      // Send notification after update is saved
      try {
        console.log('Preparing to send notification for the update...');
        const notificationHeading = 'Construction Update';
        const notificationBody = updateData.heading;
        const notificationResult = await sendNotificationToAllUsers(notificationHeading, notificationBody);
        console.log('Notification sent successfully. Result:', JSON.stringify(notificationResult, null, 2));
      } catch (notificationError) {
        console.error('Error sending notification:', notificationError);
      }

    } catch (error) {
      console.error('Error in handleSendUpdate:', error);
      toast.error('Error sending update. Please try again.');
    }
  };

  const sendNotificationToAllUsers = async (title, body) => {
    try {
      const response = await axios.post('https://puri-dashboard-server.onrender.com/api/send-notification', {
        title,
        body
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      console.log('Notification sending result:', response.data);
      
      if (response.data.failureCount > 0) {
        // console.warn(`Failed to send ${response.data.failureCount} notifications`);
      }
  
      return response.data;
    } catch (error) {
      console.error('Error sending notification:', error);
      if (error.response) {
        // throw new Error(`Failed to send notification: ${error.response.data.error || 'Unknown error'}`);
      } else if (error.request) {
        throw new Error('No response received from notification server');
      } else {
        throw new Error(`Error setting up notification request: ${error.message}`);
      }
    }
  };
  
  // const isFormValid = leftData.isValid && selectedWings.length > 0 && file;
  const isFormValid = leftData.heading && leftData.subText && selectedWings.length > 0;

  return (
    <div>
      <div style={containerStyle}>
        <label style={labelStyle}>Choose Wing</label>
        <div style={{ position: 'relative' }}>
          <button 
            ref={buttonRef}
            onClick={toggleDropdown}
            style={dropdownButtonStyle}
            
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {selectedWings.length > 0 ? selectedWings.join(', ') : 'Select Wing'}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M16.2345 7.06754L9.98453 13.3175C9.92648 13.3756 9.85755 13.4217 9.78168 13.4532C9.7058 13.4847 9.62447 13.5008 9.54234 13.5008C9.46021 13.5008 9.37888 13.4847 9.303 13.4532C9.22713 13.4217 9.1582 13.3756 9.10015 13.3175L2.85015 7.06754C2.73288 6.95026 2.66699 6.7912 2.66699 6.62535C2.66699 6.4595 2.73288 6.30044 2.85015 6.18316C2.96743 6.06588 3.12649 6 3.29234 6C3.45819 6 3.61725 6.06588 3.73453 6.18316L9.54234 11.9918L15.3502 6.18316C15.4082 6.12509 15.4772 6.07903 15.553 6.0476C15.6289 6.01617 15.7102 6 15.7923 6C15.8745 6 15.9558 6.01617 16.0317 6.0476C16.1075 6.07903 16.1765 6.12509 16.2345 6.18316C16.2926 6.24123 16.3387 6.31017 16.3701 6.38604C16.4015 6.46191 16.4177 6.54323 16.4177 6.62535C16.4177 6.70747 16.4015 6.78879 16.3701 6.86466C16.3387 6.94053 16.2926 7.00947 16.2345 7.06754Z" fill="#6B7280"/>
            </svg>
          </button>
          {isDropdownOpen && (
            <div ref={dropdownRef} style={dropdownContentStyle}>
              {wings.map((wing, index) => (
                <div
                  key={index}
                  onClick={() => handleWingSelection(wing)}
                  style={{
                    ...dropdownItemStyle,
                    color: selectedWings.includes(wing) ? '#4F46E5' : '#6B7280',
                    fontWeight: selectedWings.includes(wing) ? 'bold' : 'normal',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedWings.includes(wing)}
                    onChange={() => {}}
                    required
                    style={{ marginRight: '8px' }}
                  />
                  {wing}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={containerStyle}>
        <label style={labelStyle}>Upload Certificate</label>
        <div 
          style={{...uploadAreaStyle, position: 'relative'}} 
          onClick={() => document.getElementById('fileInput').click()}
        >
          {file ? (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16H15M9 12H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{color: '#4B5563', marginTop: '8px', maxWidth: '80%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                {file.name}
              </span>
              <button 
                onClick={handleRemoveFile}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'white',
                  border: '1px solid #D1D5DB',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.64 2.36C9.84667 2.15333 9.84667 1.82 9.64 1.61333C9.43333 1.40667 9.1 1.40667 8.89333 1.61333L6 4.50667L3.10667 1.61333C2.9 1.40667 2.56667 1.40667 2.36 1.61333C2.15333 1.82 2.15333 2.15333 2.36 2.36L5.25333 5.25333L2.36 8.14667C2.15333 8.35333 2.15333 8.68667 2.36 8.89333C2.56667 9.1 2.9 9.1 3.10667 8.89333L6 6L8.89333 8.89333C9.1 9.1 9.43333 9.1 9.64 8.89333C9.84667 8.68667 9.84667 8.35333 9.64 8.14667L6.74667 5.25333L9.64 2.36Z" fill="#6B7280"/>
                </svg>
              </button>
            </>
          ) : (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="#9CA3AF"/>
              </svg>
              <span style={{color: '#9CA3AF', marginTop: '8px'}}>
                Click to upload
              </span>
            </>
          )}
        </div>
        <input
          id="fileInput"
          type="file"
          
          onChange={handleFileChange}
          style={{display: 'none'}}
        />
      </div>

      <button style={{...buttonStyle,
        backgroundColor: isFormValid ? '#030712' : '#D1D5DB',
        cursor: isFormValid ? 'pointer' : 'not-allowed',
      }} onClick={handleSendUpdate}
      disabled={!isFormValid}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 3L1 9L10 15L19 9L10 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1 9V17L10 21L19 17V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Send Update
      </button>
    </div>
  );
};

export default Construction_add_up_right;