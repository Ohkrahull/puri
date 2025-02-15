import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { updateStaffUser,addStaffUser } from '../firebase/services/UserService';

const EditStaffModal = ({ isOpen, onClose, onSave, user, onStaffAdded }) => {
  const initialStaffState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roles: {
      admin: false,
      booking: false,
      documents: false,
      constructionUpdate: false
    },
  };
  const [staff, setStaff] = useState(initialStaffState);
  const [showPassword, setShowPassword] = useState(false)
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const roleDropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      setStaff({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        password: '', // initialize password as empty
        roles: user.roles || initialStaffState.roles,
      });
    } else {
      setStaff(initialStaffState);
    }
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target)) {
        setIsRoleDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStaff(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setStaff(initialStaffState);
  };

  // const handleSave = async () => {
  //   if (!staff.firstName || !staff.lastName || !staff.email || !Object.values(staff.roles).some(Boolean)) {
  //     toast.error("Please fill in all required fields and select a role.");
  //     return;
  //   }

  //   try {
  //     const updatedUserData = {
  //       firstName: staff.firstName,
  //       lastName: staff.lastName,
  //       email: staff.email,
  //       role: getCurrentRole(), // Make sure this function returns the correct role string
  //       password: staff.password // Only for new users
  //     };
  
  //     if (user && user.id && user.authUID) {
  //       // Updating existing user
  //       console.log("Updating existing user", user.id, user.authUID, updatedUserData);
  //       await updateStaffUser(user.id, user.authUID, updatedUserData);
  //       toast.success('Staff updated successfully');
  //       onSave(updatedUserData);
  //     } else {
  //       // Adding new user
  //       const newUser = await addStaffUser(updatedUserData);
  //       toast.success('Staff added successfully');
  //       onStaffAdded(newUser); // This now includes firestoreId and authUID
  //     }
      
  //     onClose();
  //   } catch (error) {
  //     console.error("Error updating/adding staff: ", error);
  //     toast.error(error.message || "Error updating/adding staff. Please try again.");
  //   }
  // };


  // const handleClearAll = () => {
  //   resetForm();
  // };


  // const handleSave = async () => {
  //   if (!staff.firstName || !staff.lastName || !staff.email || !Object.values(staff.roles).some(Boolean)) {
  //     toast.error("Please fill in all required fields and select a role.");
  //     return;
  //   }

  //   try {
  //     // Convert roles object to array of role names
  //     const rolesArray = Object.entries(staff.roles)
  //       .filter(([_, value]) => value)
  //       .map(([key, _]) => key);

  //     const updatedUserData = {
  //       firstName: staff.firstName,
  //       lastName: staff.lastName,
  //       email: staff.email,
  //       roles: rolesArray
  //     };

  //     if (staff.password) {
  //       updatedUserData.password = staff.password;
  //     }

  //     console.log("User object:", user);
  //     console.log("User UID:", user?.authUID);

  //     if (user && user.authUID) {
  //       // Updating existing user
  //       console.log("Updating existing user from EditStaffModal", user.uid, updatedUserData);
  //       await updateStaffUser(user.authUID, updatedUserData);
  //       toast.success('Staff updated successfully');
  //       onSave({ ...user, ...updatedUserData });
  //     }
  //     else{
  //       throw new Error("User not found");
  //     }
      
  //     onClose();
  //   } catch (error) {
  //     console.error("Error updating/adding staff: ", error);
  //     toast.error("Error updating/adding staff. Please try again.");
  //   }
  // };

  // const handleSave = async () => {
  //   if (!staff.firstName || !staff.lastName || !staff.email || !Object.values(staff.roles).some(Boolean)) {
  //     toast.error("Please fill in all required fields and select a role.");
  //     return;
  //   }
  
  //   try {
  //     // Convert roles object to array of role names
  //     const rolesArray = Object.entries(staff.roles)
  //       .filter(([_, value]) => value)
  //       .map(([key, _]) => key);
  
  //     const updatedUserData = {
  //       firstName: staff.firstName,
  //       lastName: staff.lastName,
  //       email: staff.email,
  //       roles: rolesArray
  //     };
  
  //     if (staff.password) {
  //       updatedUserData.password = staff.password;
  //     }
  
  //     console.log("User object:", user);
  //     console.log("User authUID:", user?.authUID);
  
  //     if (user && user.authUID) {
  //       // Updating existing user
  //       console.log("Updating existing user from EditStaffModal", user.authUID, updatedUserData);
        
  //       try {
  //         await updateStaffUser(user.authUID, updatedUserData);
  //         console.log("Server-side update successful");
  //         toast.success('Staff updated successfully');
          
  //         // Update local state
  //         const updatedUser = { ...user, ...updatedUserData };
  //         onSave(updatedUser);
  //         console.log("Updated user state:", updatedUser);
  //       } catch (updateError) {
  //         console.error("Error from updateStaffUser:", updateError);
  //         throw updateError; // Re-throw to be caught by outer catch block
  //       }
  //     } else {
  //       throw new Error("User not found");
  //     }
      
  //     onClose();
  //   } catch (error) {
  //     console.error("Error updating/adding staff: ", error);
      
  //     // Check if the error is from the server or client-side
  //     if (error.response) {
  //       // The request was made and the server responded with a status code
  //       // that falls out of the range of 2xx
  //       console.error("Server responded with error:", error.response.data);
  //       console.error("Status code:", error.response.status);
  //       toast.error(`Server error: ${error.response.data.message || "Unknown error occurred"}`);
  //     } else if (error.request) {
  //       // The request was made but no response was received
  //       console.error("No response received from server");
  //       toast.error("No response from server. Please try again later.");
  //     } else {
  //       // Something happened in setting up the request that triggered an Error
  //       console.error("Error setting up the request:", error.message);
  //       toast.error("Error updating staff. Please try again.");
  //     }
  //   }
  // };

  const handleSave = async () => {
    if (!staff.firstName || !staff.lastName || !staff.email || !Object.values(staff.roles).some(Boolean)) {
      toast.error("Please fill in all required fields and select a role.");
      return;
    }
  
    try {
      const rolesArray = Object.entries(staff.roles)
        .filter(([_, value]) => value)
        .map(([key, _]) => key);
  
      const updatedUserData = {
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email,
        roles: rolesArray
      };
  
      if (staff.password) {
        updatedUserData.password = staff.password;
      }
  
      console.log("User object:", user);
      console.log("User authUID:", user?.authUID);
  
      if (user && user.authUID) {
        console.log("Updating existing user from EditStaffModal", user.authUID, updatedUserData);
        
        const result = await updateStaffUser(user.authUID, updatedUserData);
        
        if (result.authUpdateSuccess && result.firestoreUpdateSuccess) {
          console.log("Both Authentication and Firestore updated successfully");
          toast.success('Staff updated successfully');
          onSave({ ...user, ...updatedUserData });
        } else if (result.authUpdateSuccess) {
          console.warn("Authentication updated, but Firestore update failed");
          toast.warning('Partial update: User credentials updated, but profile update failed. Please try again.');
        } else if (result.firestoreUpdateSuccess) {
          console.warn("Firestore updated, but Authentication update failed");
          toast.warning('Partial update: User profile updated, but credential update failed. Please try again.');
        } else {
          console.error("Both Authentication and Firestore updates failed");
          toast.error('Update failed. Please try again.');
        }
      } else {
        throw new Error("User not found");
      }
      
      onClose();
    } catch (error) {
      console.error("Error updating/adding staff: ", error);
      toast.error(`Error updating staff: ${error.message}`);
    }
  };
  
  const handleClearAll = () => {
    resetForm();
  };

  if (!isOpen) return null;

  const handleRoleChange = (role) => {
    setStaff(prev => ({
      ...prev,
      roles: {
        ...initialStaffState.roles,
        [role]: true
      }
    }));
    setIsRoleDropdownOpen(false);
  };


  const sortRoleButtonStyle = {
    display: 'flex',
    width: '100%',
    padding: '10px 14px',
    alignItems: 'center',
    gap: '6px',
    alignSelf: 'stretch',
    borderRadius: '8px',
    border: '1px solid var(--Gray-300, #D1D5DB)',
    color: '#6B7280',
    fontSize: '16px',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    cursor: 'pointer',
    backgroundColor: 'white',
    
  };

  const dropdownContentStyle = {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    zIndex: 1000,
    marginBottom: '4px',
    // marginTop: '8px',
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
    '&:hover': {
      backgroundColor: '#F3F4F6',
    },
    color: 'var(--Gray-400, #6B7280)',
    fontSize: '14px',
    borderBottom: '1px solid var(--Gray-100, #E5E7EB)'
  };

  const roleOptions = [
    { key: 'admin', label: 'Admin' },
    { key: 'booking', label: 'Booking Manager' },
    { key: 'documents', label: 'Legal Documents' },
    { key: 'constructionUpdate', label: 'Construction Update' }
  ];
  const getCurrentRole = () => {
    const activeRole = Object.entries(staff.roles).find(([_, value]) => value);
    return activeRole ? roleOptions.find(role => role.key === activeRole[0])?.label : 'Select role';
  };
  const handleRoleSelect = (role) => {
    setStaff(prev => ({ ...prev, role }));
    setIsRoleDropdownOpen(false);
  };

//   const leftSideSvg = (
//     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
//       <path d="M6.19254 10.3078C6.25065 10.3659 6.29674 10.4348 6.3282 10.5107C6.35965 10.5865 6.37584 10.6679 6.37584 10.75C6.37584 10.8321 6.35965 10.9135 6.3282 10.9893C6.29674 11.0652 6.25065 11.1341 6.19254 11.1922L3.69254 13.6922C3.63449 13.7503 3.56556 13.7964 3.48969 13.8279C3.41381 13.8593 3.33248 13.8755 3.25035 13.8755C3.16821 13.8755 3.08688 13.8593 3.01101 13.8279C2.93514 13.7964 2.86621 13.7503 2.80816 13.6922L0.30816 11.1922C0.250091 11.1341 0.204028 11.0652 0.172602 10.9893C0.141175 10.9134 0.125 10.8321 0.125 10.75C0.125 10.6679 0.141175 10.5866 0.172602 10.5107C0.204028 10.4348 0.250091 10.3659 0.30816 10.3078C0.425435 10.1905 0.584495 10.1247 0.750347 10.1247C0.832469 10.1247 0.913787 10.1408 0.989658 10.1723C1.06553 10.2037 1.13447 10.2497 1.19253 10.3078L2.62535 11.7414V0.750003C2.62535 0.584243 2.6912 0.425272 2.80841 0.308062C2.92562 0.190852 3.08459 0.125003 3.25035 0.125003C3.41611 0.125003 3.57508 0.190852 3.69229 0.308062C3.8095 0.425272 3.87535 0.584243 3.87535 0.750003V11.7414L5.30816 10.3078C5.36621 10.2497 5.43514 10.2036 5.51101 10.1722C5.58688 10.1407 5.66821 10.1245 5.75035 10.1245C5.83248 10.1245 5.91381 10.1407 5.98969 10.1722C6.06556 10.2036 6.13449 10.2497 6.19254 10.3078ZM13.6925 2.80782L11.1925 0.307816C11.1345 0.249706 11.0656 0.203606 10.9897 0.172154C10.9138 0.140701 10.8325 0.124512 10.7503 0.124512C10.6682 0.124512 10.5869 0.140701 10.511 0.172154C10.4351 0.203606 10.3662 0.249706 10.3082 0.307816L7.80816 2.80782C7.69088 2.92509 7.625 3.08415 7.625 3.25C7.625 3.41586 7.69088 3.57492 7.80816 3.69219C7.92544 3.80947 8.0845 3.87535 8.25035 3.87535C8.4162 3.87535 8.57526 3.80947 8.69254 3.69219L10.1253 2.2586V13.25C10.1253 13.4158 10.1912 13.5747 10.3084 13.6919C10.4256 13.8092 10.5846 13.875 10.7503 13.875C10.9161 13.875 11.0751 13.8092 11.1923 13.6919C11.3095 13.5747 11.3753 13.4158 11.3753 13.25V2.2586L12.8082 3.69219C12.9254 3.80947 13.0845 3.87535 13.2503 3.87535C13.4162 3.87535 13.5753 3.80947 13.6925 3.69219C13.8098 3.57492 13.8757 3.41586 13.8757 3.25C13.8757 3.08415 13.8098 2.92509 13.6925 2.80782Z" fill="#6B7280"/>
//     </svg>
//   );

  const dropdownSvg = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M16.2345 7.06754L9.98453 13.3175C9.92648 13.3756 9.85755 13.4217 9.78168 13.4532C9.7058 13.4847 9.62447 13.5008 9.54234 13.5008C9.46021 13.5008 9.37888 13.4847 9.303 13.4532C9.22713 13.4217 9.1582 13.3756 9.10015 13.3175L2.85015 7.06754C2.73288 6.95026 2.66699 6.7912 2.66699 6.62535C2.66699 6.4595 2.73288 6.30044 2.85015 6.18316C2.96743 6.06588 3.12649 6 3.29234 6C3.45819 6 3.61725 6.06588 3.73453 6.18316L9.54234 11.9918L15.3502 6.18316C15.4082 6.12509 15.4772 6.07903 15.553 6.0476C15.6289 6.01617 15.7102 6 15.7923 6C15.8745 6 15.9558 6.01617 16.0317 6.0476C16.1075 6.07903 16.1765 6.12509 16.2345 6.18316C16.2926 6.24123 16.3387 6.31017 16.3701 6.38604C16.4015 6.46191 16.4177 6.54323 16.4177 6.62535C16.4177 6.70747 16.4015 6.78879 16.3701 6.86466C16.3387 6.94053 16.2926 7.00947 16.2345 7.06754Z" fill="#6B7280"/>
    </svg>
  );

  









  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderRadius: '16px',
        background: '#FFF',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        width: '428px',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignSelf: 'stretch',
          padding: '20px 24px',
          borderBottom: '1px solid var(--Gray-200, #E5E7EB)',
          width: '100%',
        }}>
          <div style={{ width: '24px' }}></div>
          <h2 style={{
            color: 'var(--Gray-900, #030712)',
            textAlign: 'center',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '18px',
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: '28px',
          }}>Edit Staff</h2>
          <button onClick={onClose} style={{ width: '24px', height: '24px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19.2806 18.2194C19.3502 18.2891 19.4055 18.3718 19.4432 18.4629C19.4809 18.5539 19.5003 18.6515 19.5003 18.7501C19.5003 18.8486 19.4809 18.9462 19.4432 19.0372C19.4055 19.1283 19.3502 19.211 19.2806 19.2807C19.2109 19.3504 19.1281 19.4056 19.0371 19.4433C18.9461 19.4811 18.8485 19.5005 18.7499 19.5005C18.6514 19.5005 18.5538 19.4811 18.4628 19.4433C18.3717 19.4056 18.289 19.3504 18.2193 19.2807L11.9999 13.0604L5.78055 19.2807C5.63982 19.4214 5.44895 19.5005 5.24993 19.5005C5.05091 19.5005 4.86003 19.4214 4.7193 19.2807C4.57857 19.1399 4.49951 18.9491 4.49951 18.7501C4.49951 18.551 4.57857 18.3602 4.7193 18.2194L10.9396 12.0001L4.7193 5.78068C4.57857 5.63995 4.49951 5.44907 4.49951 5.25005C4.49951 5.05103 4.57857 4.86016 4.7193 4.71943C4.86003 4.5787 5.05091 4.49963 5.24993 4.49963C5.44895 4.49963 5.63982 4.5787 5.78055 4.71943L11.9999 10.9397L18.2193 4.71943C18.36 4.5787 18.5509 4.49963 18.7499 4.49963C18.949 4.49963 19.1398 4.5787 19.2806 4.71943C19.4213 4.86016 19.5003 5.05103 19.5003 5.25005C19.5003 5.44907 19.4213 5.63995 19.2806 5.78068L13.0602 12.0001L19.2806 18.2194Z" fill="#030712"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div style={{
          display: 'flex',
          padding: '24px',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '20px',
          alignSelf: 'stretch'
        }}>
          {/* First name and Last name */}
          <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
            <div style={{ flex: 1 }}>
              <label style={{
                color: 'var(--Gray-900, #030712)',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '20px',
                marginBottom: '4px',
                display: 'block'
              }}>First name</label>
              <input
                type="text"
                name="firstName"
                value={staff.firstName}
                onChange={handleInputChange}
                style={{
                  display: 'flex',
                  height: '44px',
                  padding: '10px 14px',
                  alignItems: 'center',
                  gap: '8px',
                  alignSelf: 'stretch',
                  borderRadius: '8px',
                  border: '1px solid var(--Gray-300, #D1D5DB)',
                  background: 'var(--White, #FFF)',
                  width: '100%',
                  color: 'var(--Gray-500, #4B5563)',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: '24px'
                }}
                placeholder="John"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{
                color: 'var(--Gray-900, #030712)',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '20px',
                marginBottom: '4px',
                display: 'block'
              }}>Last name</label>
              <input
                type="text"
                name="lastName"
                value={staff.lastName}
                onChange={handleInputChange}
                style={{
                  display: 'flex',
                  height: '44px',
                  padding: '10px 14px',
                  alignItems: 'center',
                  gap: '8px',
                  alignSelf: 'stretch',
                  borderRadius: '8px',
                  border: '1px solid var(--Gray-300, #D1D5DB)',
                  background: 'var(--White, #FFF)',
                  width: '100%',
                  color: 'var(--Gray-500, #4B5563)',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: '24px'
                }}
                placeholder="Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ width: '100%' }}>
            <label style={{
              color: 'var(--Gray-900, #030712)',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '14px',
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: '20px',
              marginBottom: '4px',
              display: 'block'
            }}>Email</label>
            <input
              type="email"
              name="email"
              value={staff.email}
              onChange={handleInputChange}
              style={{
                display: 'flex',
                height: '44px',
                padding: '10px 14px',
                alignItems: 'center',
                gap: '8px',
                alignSelf: 'stretch',
                borderRadius: '8px',
                border: '1px solid var(--Gray-300, #D1D5DB)',
                background: 'var(--White, #FFF)',
                width: '100%',
                color: 'var(--Gray-500, #4B5563)',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '24px'
              }}
              placeholder="john.doe@gmail.com"
            />
          </div>

           {/* Password */}
           <div style={{ width: '100%', position: 'relative' }}>
            <label style={{
              color: 'var(--Gray-900, #030712)',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '14px',
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: '20px',
              marginBottom: '4px',
              display: 'block'
            }}>Password (leave blank to keep current password)</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={staff.password}
              onChange={handleInputChange}
              style={{
                display: 'flex',
                height: '44px',
                padding: '10px 14px',
                alignItems: 'center',
                gap: '8px',
                alignSelf: 'stretch',
                borderRadius: '8px',
                border: '1px solid var(--Gray-300, #D1D5DB)',
                background: 'var(--White, #FFF)',
                width: '100%',
                color: 'var(--Gray-500, #4B5563)',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '24px'
              }}
              placeholder="Enter new password"
            />
            <button 
              onClick={() => setShowPassword(!showPassword)} 
              style={{
                position: 'absolute',
                right: '10px',
                top: '70%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {showPassword ? (
                <svg className='' xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#000000" viewBox="0 0 256 256"><path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#000000" viewBox="0 0 256 256"><path d="M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76Zm47.33,75.84,41.67,45.85a32,32,0,0,1-41.67-45.85ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.16,133.16,0,0,1,25,128c4.69-8.79,19.66-33.39,47.35-49.38l18,19.75a48,48,0,0,0,63.66,70l14.73,16.2A112,112,0,0,1,128,192Zm6-95.43a8,8,0,0,1,3-15.72,48.16,48.16,0,0,1,38.77,42.64,8,8,0,0,1-7.22,8.71,6.39,6.39,0,0,1-.75,0,8,8,0,0,1-8-7.26A32.09,32.09,0,0,0,134,96.57Zm113.28,34.69c-.42.94-10.55,23.37-33.36,43.8a8,8,0,1,1-10.67-11.92A132.77,132.77,0,0,0,231.05,128a133.15,133.15,0,0,0-23.12-30.77C185.67,75.19,158.78,64,128,64a118.37,118.37,0,0,0-19.36,1.57A8,8,0,1,1,106,49.79,134,134,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.83,27.3,37.62,27.65,38.41A8,8,0,0,1,247.31,131.26Z"></path></svg>
              )}
            </button>
          </div>

          {/* Assign role */}
           {/* Role Dropdown */}
          <div style={{ width: '100%', position: 'relative' }}>
            <label style={{
              color: 'var(--Gray-900, #030712)',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '14px',
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: '20px',
              marginBottom: '4px',
              
              display: 'block'
            }}>Assign role</label>
            <div className="relative" ref={roleDropdownRef} style={{ width: '100%' }}>
              <button 
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                style={sortRoleButtonStyle}
              >
                {/* {leftSideSvg} */}
                <span style={{ flexGrow: 1, textAlign: 'left' }}>{getCurrentRole()}</span>
                {dropdownSvg}
              </button>
              {isRoleDropdownOpen && (
                <div style={dropdownContentStyle}>
                  {roleOptions.map((role, index) => (
                    <div
                      key={index}
                      onClick={() => handleRoleChange(role.key)}
                      style={{
                        ...dropdownItemStyle,
                        borderBottom: index === roleOptions.length - 1 ? 'none' : '1px solid var(--Gray-100, #E5E7EB)'
                      }}
                    >
                      {role.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        {/* </div> */}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          width: '100%',
          padding: '20px 24px',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--Gray-100, #E5E7EB)'
        }}>
          <button onClick={handleClearAll} style={{
            color: 'var(--Gray-900, #030712)',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: '24px',
            textDecorationLine: 'underline',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}>
            Clear all
          </button>
          <button 
            onClick={handleSave} 
            disabled={!staff.firstName || !staff.lastName || !staff.email || staff.role === 'Select role'}
            style={{
              display: 'flex',
              padding: '10px 20px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '8px',
              background: (staff.firstName && staff.lastName && staff.email && staff.role !== 'Select role') 
                ? 'var(--Gray-900, #030712)' 
                : 'var(--Gray-300, #D1D5DB)',
              color: 'var(--Gray-25, #F9FAFB)',
              textAlign: 'center',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '16px',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: '24px',
              border: 'none',
              cursor: (staff.firstName && staff.lastName && staff.email && staff.role !== 'Select role') 
                ? 'pointer' 
                : 'not-allowed'
          }}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStaffModal;

