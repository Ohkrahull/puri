import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { updateAuthorizedUser } from '../firebase/services/UserData';

const EditingUserModal = ({ isOpen, onClose, onSave, user }) => {
  const initialUserState = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    wing: 'Choose Wing',
    flatNumber: ''
  };

  const [editedUser, setEditedUser] = useState(initialUserState);
  const [isWingDropdownOpen, setIsWingDropdownOpen] = useState(false);
  const wingOptions = ['Choose Wing', 'A', 'B', 'C', 'D'];
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // useEffect(() => {
  //   if (user) {
  //     setEditedUser({
  //       firstName: user.firstName || '',
  //       lastName: user.lastName || '',
  //       email: user.email || '',
  //       phoneNumber: user.phoneNumber || '',
  //       wing: user.wing || 'Choose Wing',
  //       flatNumber: user.flatNumber || ''
  //     });
  //   }
  // }, [user]);

  useEffect(() => {
    if (user) {
      setEditedUser({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber ? user.phoneNumber.replace(/^\+91/, '') : '',
        wing: user.wing || 'Choose Wing',
        flatNumber: user.flatNumber || ''
      });
    }
  }, [user]);

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   if (name === 'phoneNumber') {
  //     const numericValue = value.replace(/\D/g, '').slice(0, 10);
  //     setEditedUser(prev => ({ ...prev, [name]: numericValue }));
  //   } else {
  //     setEditedUser(prev => ({ ...prev, [name]: value }));
  //   }
  // };
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   if (name === 'phoneNumber') {
  //     // Remove any non-digit characters
  //     let numericValue = value.replace(/\D/g, '');
      
  //     // Remove the +91 prefix if it exists
  //     if (numericValue.startsWith('91')) {
  //       numericValue = numericValue.slice(2);
  //     }
      
  //     // Limit to 10 digits
  //     numericValue = numericValue.slice(0, 10);
      
  //     // Add the +91 prefix
  //     const phoneWithPrefix = numericValue ? `+91${numericValue}` : '';
      
  //     setEditedUser(prev => ({...prev, [name]: phoneWithPrefix}));
  //   } else {
  //     setEditedUser(prev => ({...prev, [name]: value}));
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber') {
      // Remove any non-digit characters
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setEditedUser(prev => ({...prev, [name]: numericValue}));
    } else {
      setEditedUser(prev => ({...prev, [name]: value}));
    }
  };

  const resetForm = () => {
    setEditedUser(initialUserState);
  };

  const toggleWingDropdown = () => setIsWingDropdownOpen(!isWingDropdownOpen);

  const handleWingSelect = (wing) => {
    setEditedUser(prev => ({ ...prev, wing }));
    setIsWingDropdownOpen(false);
  };

  // const handleSaveEdit = async () => {
  //   if (!editedUser.firstName || !editedUser.lastName || !editedUser.email || !editedUser.phoneNumber || editedUser.wing === 'Choose Wing' || !editedUser.flatNumber) {
  //     toast.error('Please fill in all fields');
  //     return;
  //   }
  //   try {
  //     const updatedUser = await updateAuthorizedUser(editedUser.phoneNumber, editedUser);
  //     toast.success('User updated successfully');
  //     onSave(updatedUser);
  //     onClose();
  //   } catch (error) {
  //     console.error("Error updating user: ", error);
  //     toast.error("Error updating user. Please try again");
  //   }
  // };
  const handleSaveEdit = async () => {
    if (!editedUser.firstName || !editedUser.lastName || !editedUser.email || !editedUser.phoneNumber || editedUser.wing === 'Choose Wing' || !editedUser.flatNumber) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      const formattedPhoneNumber = editedUser.phoneNumber.startsWith('+91') 
        ? editedUser.phoneNumber 
        : `+91${editedUser.phoneNumber}`;

      const updatedUserData = {
        ...editedUser,
        phoneNumber: formattedPhoneNumber
      };

      const updatedUser = await updateAuthorizedUser(user.phoneNumber, updatedUserData);
      toast.success('User updated successfully');
      onSave(updatedUser);
      onClose();
    } catch (error) {
      console.error("Error updating user: ", error);
      toast.error("Error updating user. Please try again");
    }
  };

  const handleClearAll = () => {
    resetForm();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsWingDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isFormValid = () => {
    return editedUser.firstName && editedUser.lastName && editedUser.email && editedUser.phoneNumber && editedUser.wing !== 'Choose Wing' && editedUser.flatNumber;
  };

  if (!isOpen) return null;

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
          }}>Edit Member</h2>
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
                value={editedUser.firstName}
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
                value={editedUser.lastName}
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
              value={editedUser.email}
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

          {/* Phone */}
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
            }}>Phone</label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}>
              <span style={{
                position: 'absolute',
                left: '14px',
                color: 'var(--Gray-500, #4B5563)',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '16px',
                fontWeight: 500,
              }}>
                +91
              </span>
              <input
                type="tel"
                name="phoneNumber"
                value={editedUser.phoneNumber}
                onChange={handleInputChange}
                style={{
                  display: 'flex',
                  height: '44px',
                  padding: '10px 14px 10px 44px',
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
                placeholder="8097218943"
              />
            </div>
          </div>

          {/* Unit/Apartment Number */}
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
            }}>Unit/Apartment Number</label>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <button 
                  ref={buttonRef}
                  onClick={toggleWingDropdown}
                  style={{
                    display: 'flex',
                    width: '100%',
                    padding: '10px 14px',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--Gray-200, #D1D5DB)',
                    background: 'white',
                    cursor: 'pointer',
                    color: '#6B7280',
                    fontSize: '16px',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{editedUser.wing}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
                    <path d="M13.5675 1.31705L7.31754 7.56705C7.25949 7.62516 7.19056 7.67126 7.11469 7.70271C7.03881 7.73416 6.95748 7.75035 6.87535 7.75035C6.79321 7.75035 6.71188 7.73416 6.63601 7.70271C6.56014 7.67126 6.49121 7.62516 6.43316 7.56705L0.18316 1.31705C0.0658846 1.19977 0 1.04071 0 0.874859C0 0.709007 0.0658846 0.549947 0.18316 0.432671C0.300435 0.315396 0.459495 0.249512 0.625347 0.249512C0.7912 0.249512 0.95026 0.315396 1.06753 0.432671L6.87535 6.24127L12.6832 0.432671C12.7412 0.374603 12.8102 0.32854 12.886 0.297113C12.9619 0.265687 13.0432 0.249512 13.1253 0.249512C13.2075 0.249512 13.2888 0.265687 13.3647 0.297113C13.4405 0.32854 13.5095 0.374603 13.5675 0.432671C13.6256 0.49074 13.6717 0.559678 13.7031 0.635549C13.7345 0.71142 13.7507 0.792737 13.7507 0.874859C13.7507 0.956981 13.7345 1.0383 13.7031 1.11417C13.6717 1.19004 13.6256 1.25898 13.5675 1.31705Z" fill="#6B7280"/>
                  </svg>
                </button>
                {isWingDropdownOpen && (
                  <div 
                    ref={dropdownRef}
                    style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: 0,
                      zIndex: 1000,
                      marginTop: '4px',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      width: '100%',
                      border: '1px solid #D1D5DB',
                      color: '#6B7280'
                    }}
                  >
                    {wingOptions.map((wing, index) => (
                      <div
                        key={index}
                        onClick={() => handleWingSelect(wing)}
                        style={{
                          padding: '8px 16px',
                          cursor: 'pointer',
                          color: 'var(--Gray-400, #6B7280)',
                          fontSize: '14px',
                          borderBottom: index === wingOptions.length - 1 ? 'none' : '1px solid var(--Gray-100, #E5E7EB)',
                          '&:hover': {
                            backgroundColor: '#F3F4F6',
                          }
                        }}
                      >
                        {wing}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="text"
                name="flatNumber"
                value={editedUser.flatNumber}
                onChange={handleInputChange}
                placeholder="Flat number"
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
                  lineHeight: '24px',
                  flex: 1
                }}
              />
            </div>
          </div>
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
          <button onClick={handleSaveEdit} disabled={!isFormValid()} style={{
            display: 'flex',
            padding: '10px 20px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '8px',
            background: isFormValid() ? 'var(--Gray-900, #030712)' : '#D1D5DB',
            color: 'var(--Gray-25, #F9FAFB)',
            textAlign: 'center',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: '24px',
            border: 'none',
            cursor: isFormValid() ? 'pointer' : 'not-allowed'
          }}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditingUserModal;