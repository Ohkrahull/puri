import React, { useState, useEffect, useRef, useCallback } from 'react';
import { updateDocument, fetchUserDocuments } from '../firebase/services/documents';
import { getAllAuthorizedUsers } from '../firebase/services/UserData';
import { toast } from 'react-toastify';
import SingleDatePicker from '../Components/SingleDatePicker';

const EditingDocumentModal = ({ isOpen, onClose, document, onSave }) => {
  const [editingDocument, setEditingDocument] = useState({});
  const [documentType, setDocumentType] = useState('Agreement for sale');
  const [file, setFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [authorizedUsers, setAuthorizedUsers] = useState([]);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllAuthorizedUsers();
        setAuthorizedUsers(users);
      } catch (error) {
        console.error('Error fetching authorized users:', error);
        toast.error('Failed to fetch users. Please try again.');
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (document) {
      setEditingDocument(document);
      setDocumentType(document.documentType || 'Agreement for sale');
      setSearchTerm(`${document.userInfo?.firstName || ''} ${document.userInfo?.lastName || ''}`.trim());
      setFile(document.file || null);
      setSelectedUser(document.userInfo || null);
    }
  }, [document]);

  const handleFileClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setShowDropdown(false);
  //     }
  //   };

  //   if (isOpen) {
  //     document.addEventListener('mousedown', handleClickOutside);
  //   }

  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [isOpen]);

  const searchUsers = (query) => {
    query = query.toLowerCase().trim();
    return authorizedUsers.filter(user => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const firstName = user.firstName.toLowerCase();
      const lastName = user.lastName.toLowerCase();

      // Exact match
      if (fullName === query) return true;

      // Starts with query
      if (fullName.startsWith(query)) return true;
      if (firstName.startsWith(query)) return true;
      if (lastName.startsWith(query)) return true;

      // Contains query
      if (fullName.includes(query)) return true;

      // Initials match
      const initials = user.firstName[0] + user.lastName[0];
      if (initials.toLowerCase() === query) return true;

      return false;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'searchTerm') {
      setSearchTerm(value);
      setShowDropdown(value.length > 0);
      const filtered = searchUsers(value);
      setFilteredUsers(filtered);
    } else {
      setEditingDocument(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSearchTerm(`${user.firstName} ${user.lastName}`);
    setShowDropdown(false);
    setEditingDocument(prev => ({
      ...prev,
      userInfo: user,
      userId: user.id
    }));
  };

  const handleFileChange = useCallback((event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setEditingDocument(prev => ({ ...prev, fileName: selectedFile.name }));
    }
  }, []);

  const handleRemoveFile = () => {
    setFile(null);
    setEditingDocument(prev => ({ ...prev, fileName: '', fileUrl: '' }));
  };

  const handleSubmit = async () => {
    if (!selectedUser) {
      toast.error('Please select a user.');
      return;
    }

    if (!editingDocument.name) {
      toast.error('Please enter a document name.');
      return;
    }

    try {
      const updatedDocument = {
        ...editingDocument,
        documentType,
        file,
        userInfo: selectedUser
      };

      await updateDocument(updatedDocument.id, updatedDocument);
      toast.success('Document updated successfully!');
      onSave(updatedDocument);
      onClose();
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('Failed to update document. Please try again.');
    }
  };

  if (!isOpen) return null;

  // Styles (using styles from AddDocumentsModal)
  const headerStyle = {
    color: 'var(--Gray-900, #030712)',
    fontFamily: 'Plus_Jakarta',
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '28px',
  };

  const labelStyle = {
    color: 'var(--Gray-900, #030712)',
    fontFamily: '"Plus Jakarta Sans"',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '20px',
  };

  const radioBoxStyle = {
    display: 'flex',
    padding: '2px',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    borderRadius: '6px',
    border: '1px solid var(--Gray-900, #030712)',
    background: 'var(--Gray-50, #F3F4F6)',
    width: '20px',
    height: '20px',
  };

  const uploadAreaStyle = {
    display: 'flex',
    padding: '32px 12px 48px 12px',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    alignSelf: 'stretch',
    borderRadius: '8px',
    border: '1.5px dashed var(--Gray-900, #030712)',
    background: 'var(--Gray-25, #F9FAFB)',
  };

  const clickToUploadStyle = {
    color: 'var(--Gray-400, #6B7280)',
    fontFamily: 'Manrope',
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '100%',
  };

  const clearAllStyle = {
    color: 'var(--Gray-900, #030712)',
    fontFamily: '"Plus Jakarta Sans"',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '24px',
    textDecorationLine: 'underline',
  };

  const saveButtonStyle = {
    display: 'flex',
    padding: '10px 20px',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--Gray-25, #F9FAFB)',
    textAlign: 'center',
    fontFamily: '"Plus Jakarta Sans"',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '24px',
    borderRadius: '8px',
    background: 'var(--Gray-900, #030712)',
  };

  return (
    <div className="fixed inset-0 z-50 justify-center bg-black bg-opacity-50 flex items-center" style={{fontFamily:'Plus_Jakarta'}}>
      <div className="bg-white justify-center rounded-2xl w-[428px] flex flex-col ml-[200px]" style={{fontFamily:'Plus_Jakarta', height: '600px'}}>
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200" style={{fontFamily:'Plus_Jakarta'}}>
          <div style={{ width: '24px', height: '24px' }}></div>
          <h2 style={headerStyle}>Edit Document</h2>
          <button onClick={onClose} style={{ width: '24px', height: '24px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19.281 18.7194C19.3507 18.789 19.406 18.8718 19.4437 18.9628C19.4814 19.0539 19.5008 19.1514 19.5008 19.25C19.5008 19.3485 19.4814 19.4461 19.4437 19.5372C19.406 19.6282 19.3507 19.7109 19.281 19.7806C19.2114 19.8503 19.1286 19.9056 19.0376 19.9433C18.9465 19.981 18.849 20.0004 18.7504 20.0004C18.6519 20.0004 18.5543 19.981 18.4632 19.9433C18.3722 19.9056 18.2895 19.8503 18.2198 19.7806L12.0004 13.5603L5.78104 19.7806C5.64031 19.9213 5.44944 20.0004 5.25042 20.0004C5.05139 20.0004 4.86052 19.9213 4.71979 19.7806C4.57906 19.6399 4.5 19.449 4.5 19.25C4.5 19.051 4.57906 18.8601 4.71979 18.7194L10.9401 12.5L4.71979 6.28061C4.57906 6.13988 4.5 5.94901 4.5 5.74999C4.5 5.55097 4.57906 5.3601 4.71979 5.21936C4.86052 5.07863 5.05139 4.99957 5.25042 4.99957C5.44944 4.99957 5.64031 5.07863 5.78104 5.21936L12.0004 11.4397L18.2198 5.21936C18.3605 5.07863 18.5514 4.99957 18.7504 4.99957C18.9494 4.99957 19.1403 5.07863 19.281 5.21936C19.4218 5.3601 19.5008 5.55097 19.5008 5.74999C19.5008 5.94901 19.4218 6.13988 19.281 6.28061L13.0607 12.5L19.281 18.7194Z" fill="#030712"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 mb-5 py-4 mt-3 flex flex-col gap-4" style={{fontFamily:'Plus_Jakarta'}}>
          <div className='mb-3 relative' ref={dropdownRef}>
            <label style={{...labelStyle, fontFamily:'Plus_Jakarta' }}>Search User </label>
            <div style={{
              display: "flex",
              padding: "6px 12px",
              alignItems: "center",
              justifyContent: "space-between",
              alignSelf: "stretch",
              border: "1px solid #D1D5DB",
              borderRadius: "10px",
              color: "#6B7280",
              fontSize: "16px",
              fontFamily: "Plus Jakarta Sans, sans-serif",
              width: "100%",
              marginTop:'7px'
            }}>
              <input
                type="text"
                name="searchTerm"
                placeholder="Search"
                value={searchTerm}
                onChange={handleInputChange}
                style={{
                  border: 'white',
                  outline: "none",
                  boxShadow: 'none',
                  width: "100%",
                  background: "transparent",
                  color: "inherit",
                  fontSize: "inherit",
                  fontFamily: "inherit",
                }}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M17.9419 17.0579L14.0302 13.1469C15.1639 11.7858 15.7293 10.0399 15.6086 8.2725C15.488 6.50512 14.6906 4.85229 13.3823 3.65785C12.074 2.46341 10.3557 1.81932 8.58462 1.85957C6.81357 1.89982 5.12622 2.62131 3.87358 3.87395C2.62094 5.12659 1.89945 6.81394 1.8592 8.58498C1.81895 10.356 2.46304 12.0744 3.65748 13.3827C4.85192 14.6909 6.50475 15.4883 8.27214 15.609C10.0395 15.7297 11.7854 15.1643 13.1466 14.0305L17.0575 17.9422C17.1156 18.0003 17.1845 18.0464 17.2604 18.0778C17.3363 18.1092 17.4176 18.1254 17.4997 18.1254C17.5818 18.1254 17.6631 18.1092 17.739 18.0778C17.8149 18.0464 17.8838 18.0003 17.9419 17.9422C17.9999 17.8842 18.046 17.8152 18.0774 17.7394C18.1089 17.6635 18.125 17.5822 18.125 17.5001C18.125 17.4179 18.1089 17.3366 18.0774 17.2607C18.046 17.1849 17.9999 17.1159 17.9419 17.0579ZM3.12469 8.75006C3.12469 7.63754 3.45459 6.55 4.07267 5.62497C4.69076 4.69995 5.56926 3.97898 6.5971 3.55323C7.62493 3.12749 8.75593 3.0161 9.84707 3.23314C10.9382 3.45018 11.9405 3.98591 12.7272 4.77258C13.5138 5.55925 14.0496 6.56153 14.2666 7.65267C14.4837 8.74382 14.3723 9.87482 13.9465 10.9027C13.5208 11.9305 12.7998 12.809 11.8748 13.4271C10.9497 14.0452 9.86221 14.3751 8.74969 14.3751C7.25836 14.3734 5.82858 13.7802 4.77404 12.7257C3.71951 11.6712 3.12634 10.2414 3.12469 8.75006Z" fill="#6B7280"/>
              </svg>
            </div>

            {showDropdown && filteredUsers.length > 0 && (
              <div className="absolute w-full mt-3 bg-white border border-gray-200 rounded-md shadow-lg z-10" 
                   style={{
                     maxHeight: filteredUsers.length > 4 ? '200px' : 'auto',
                     overflowY: filteredUsers.length > 4 ? 'scroll' : 'visible'
                   }}>
                {filteredUsers.map((user, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                    style={{borderBottom: '1px solid var(--Gray-100, #E5E7EB)'}}
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className="font-medium" style={{fontSize:'14px', color:'#6B7280'}}>
                    <div className='flex justify-between'>
                        <span>{user.firstName} {user.lastName}</span>
                        {/* <span>{user.wing}</span> */}
                        <span>{user.wing} - {user.flatNumber}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className='mb-3'>
            <label style={{...labelStyle, fontFamily:'Plus_Jakarta'}}>Document Name</label>
            <div style={{
              display: "flex",
              padding: "6px 12px",
              alignItems: "center",
              justifyContent: "space-between",
              alignSelf: "stretch",
              border: "1px solid #D1D5DB",
              borderRadius: "10px",
              color: "#6B7280",
              fontSize: "16px",
              width: "100%",
              marginTop:'7px'
            }}>
              <input
                type="text"
                name="name"
                value={editingDocument.name || ''}
                onChange={handleInputChange}
                placeholder="Name of the document"
                style={{
                  border: 'white',
                  outline: "none",
                  boxShadow: 'none',
                  width: "100%",
                  background: "transparent",
                  color: "inherit",
                  fontSize: "inherit",
                  fontFamily: "inherit",
                }}
              />
            </div>
          </div>
          
          <div>
            <label className='mt-4' style={{...labelStyle, fontFamily:'Plus_Jakarta'}}>Document type</label>
            <div className="flex gap-4 mt-3 justify-between">
              <label className="flex items-center">
                <div style={{...radioBoxStyle, fontFamily:'Plus_Jakarta'}}>
                  <input
                    type="radio"
                    checked={documentType === 'Agreement for sale'}
                    onChange={() => setDocumentType('Agreement for sale')}
                    className="sr-only"
                  />
                  {documentType === 'Agreement for sale' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3.33331 8.66663L5.99998 11.3333L12.6666 4.66663" stroke="#030712" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span style={{ ...labelStyle, marginLeft: '8px', fontSize:'13px', color: documentType === 'Agreement for sale' ? '#030712' : '#6B7280', fontFamily:'Plus_Jakarta' }}>Agreement for sale</span>
              </label>
              <label className="flex items-center">
                <div style={{
                  ...radioBoxStyle,
                  border: documentType === 'Demand letters' ? '1px solid var(--Gray-900, #030712)' : '1px solid var(--Gray-300, #9CA3AF)',
                  background: documentType === 'Demand letters' ? 'var(--Gray-50, #F3F4F6)' : 'var(--Base-White, #FFF)',
                }}>
                  <input
                    type="radio"
                    checked={documentType === 'Demand letters'}
                    onChange={() => setDocumentType('Demand letters')}
                    className="sr-only"
                  />
                  {documentType === 'Demand letters' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3.33331 8.66663L5.99998 11.3333L12.6666 4.66663" stroke="#030712" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span style={{ ...labelStyle, marginLeft: '8px', color: documentType === 'Demand letters' ? '#030712' : '#6B7280', fontFamily:'Plus_Jakarta' }}>Demand letters</span>
              </label>
            </div>
          </div>
          <div 
      style={{...uploadAreaStyle, marginTop:'13px', position: 'relative'}} 
      className='flex flex-col' 
      onClick={handleFileClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 25 25" fill="none">
        <path d="M23.4688 10.8725C23.3295 10.6795 23.1464 10.5224 22.9345 10.4142C22.7226 10.3059 22.488 10.2497 22.25 10.25H20.75V8.75C20.75 8.35218 20.592 7.97064 20.3107 7.68934C20.0294 7.40804 19.6478 7.25 19.25 7.25H12.7503L10.1506 5.3C9.89054 5.10611 9.57503 5.00094 9.25062 5H4.25C3.85218 5 3.47064 5.15804 3.18934 5.43934C2.90804 5.72064 2.75 6.10218 2.75 6.5V20C2.75 20.1989 2.82902 20.3897 2.96967 20.5303C3.11032 20.671 3.30109 20.75 3.5 20.75H20.2906C20.448 20.75 20.6015 20.7005 20.7292 20.6085C20.8569 20.5164 20.9524 20.3865 21.0022 20.2372L23.6731 12.2244C23.7482 11.9989 23.7689 11.7589 23.7334 11.5239C23.6978 11.2889 23.6072 11.0657 23.4688 10.8725ZM9.25062 6.5L12.05 8.6C12.1798 8.69737 12.3377 8.75 12.5 8.75H19.25V10.25H7.04094C6.7261 10.25 6.41924 10.349 6.16382 10.5331C5.9084 10.7172 5.71738 10.9769 5.61781 11.2756L4.25 15.3781V6.5H9.25062ZM19.7506 19.25H4.54062L7.04094 11.75H22.25L19.7506 19.25Z" fill="#6B7280"/>
      </svg>
      <p style={{...clickToUploadStyle, fontFamily:'Plus_Jakarta'}}>
        {file ? file.name : editingDocument.fileName || 'Click to upload'}
      </p>
      {(file || editingDocument.fileName) && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveFile();
          }}
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
      )}
    </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-6 border-t border-gray-100 flex justify-between items-center" style={{fontFamily:'Plus_Jakarta'}}>
          <button 
            style={{...clearAllStyle,fontFamily:'Plus_Jakarta'}} 
            onClick={() => {
              setEditingDocument({});
              setDocumentType('Agreement for sale');
              setFile(null);
              setSearchTerm('');
              setSelectedUser(null);
            }}
          >
            Clear all
          </button>
          <button onClick={handleSubmit} style={{...saveButtonStyle, fontFamily:'Plus_Jakarta'}}>Save changes</button>
        </div>
      </div>
    </div>
  );
};

export default EditingDocumentModal;