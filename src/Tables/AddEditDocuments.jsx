import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
  collection, 
  getDocs, 
  addDoc,
  updateDoc,
  doc,
  getFirestore,
  serverTimestamp
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { CaretDown, Check, FolderOpen, MagnifyingGlass, X } from 'phosphor-react';

const AddEditDocumentsModal = ({ isOpen, onClose, documentToEdit = null, isEditMode = false }) => {
  const [name, setName] = useState('');
  const [documentType, setDocumentType] = useState('Demand letters');
  const [file, setFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [authorizedUsers, setAuthorizedUsers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFlatId, setSelectedFlatId] = useState(null);
  const [showFlatDropdown, setShowFlatDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [existingFileUrl, setExistingFileUrl] = useState(null);
  const [existingFileName, setExistingFileName] = useState(null);
  const dropdownRef = useRef(null);
  const flatDropdownRef = useRef(null);
  
  const db = getFirestore();
  const storage = getStorage();

  // Effect to handle prefilling form for edit mode
  useEffect(() => {
    if (isOpen) {
      setIsLoading(false);
      
      if (isEditMode && documentToEdit) {
        // Prefill form with existing document data
        setName(documentToEdit.name || '');
        setDocumentType(documentToEdit.documentType || 'Demand letters');
        setSelectedFlatId(documentToEdit.flatId || null);
        setExistingFileUrl(documentToEdit.fileUrl || null);
        setExistingFileName(documentToEdit.fileName || null);
        
        // Find and select the user
        if (documentToEdit.userId || documentToEdit.phoneNumber) {
          const userIdentifier = documentToEdit.userId || documentToEdit.phoneNumber;
          
          // Find user in authorized users
          const user = authorizedUsers.find(u => 
            u.id === userIdentifier || u.phoneNumber === userIdentifier
          );
          
          if (user) {
            setSelectedUser(user);
            setSearchTerm(`${user.firstName || ''} ${user.lastName || ''}`);
          }
        }
      } else {
        // Reset form for add mode
        resetForm();
      }
    }
  }, [isOpen, isEditMode, documentToEdit, authorizedUsers]);

  // Fetch users directly from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAuthorizedUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users. Please try again.');
      }
    };
    fetchUsers();
  }, [db]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (flatDropdownRef.current && !flatDropdownRef.current.contains(event.target)) {
        setShowFlatDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const resetForm = () => {
    setName('');
    setDocumentType('Demand letters');
    setFile(null);
    setSelectedUser(null);
    setSearchTerm('');
    setSelectedFlatId(null);
    setExistingFileUrl(null);
    setExistingFileName(null);
  };

  const searchUsers = (query) => {
    query = query.toLowerCase().trim();
    return authorizedUsers.filter(user => {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
      const firstName = (user.firstName || '').toLowerCase();
      const lastName = (user.lastName || '').toLowerCase();

      // Exact match
      if (fullName === query) return true;

      // Starts with query
      if (fullName.startsWith(query)) return true;
      if (firstName.startsWith(query)) return true;
      if (lastName.startsWith(query)) return true;

      // Contains query
      if (fullName.includes(query)) return true;

      // Initials match
      if (user.firstName && user.lastName) {
        const initials = user.firstName[0] + user.lastName[0];
        if (initials.toLowerCase() === query) return true;
      }

      return false;
    });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length > 0);
    
    if (value === '') {
      setFilteredUsers([]);
    } else {
      const filtered = searchUsers(value);
      setFilteredUsers(filtered);
    }
  };

  if (!isOpen) return null;

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

  const addButtonStyle = {
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
    cursor: isLoading ? 'not-allowed' : 'pointer',
    opacity: isLoading ? 0.7 : 1,
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSearchTerm(`${user.firstName || ''} ${user.lastName || ''}`);
    setShowDropdown(false);
    
    // Only reset selected flat when changing user in add mode
    if (!isEditMode) {
      setSelectedFlatId(null);
    }
  };

  const handleFlatSelect = (flatId) => {
    setSelectedFlatId(flatId);
    setShowFlatDropdown(false);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Modified to handle errors gracefully without throwing
  const sendUserNotification = async (title, body, additionalData = {}, phoneNumber) => {
    try {
      const response = await axios.post('https://puri-dashboard-server.onrender.com/api/send-user-notification', {
        title,
        body,
        additionalData,
        phoneNumber
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error sending user-specific notification:', error);
      // Just log the error but don't throw it
      return { error: 'Failed to send notification' };
    }
  };

  // Upload document directly to Firebase
  const uploadDocument = async (file, user, documentType, documentName, flatId) => {
    try {
      let fileUrl = existingFileUrl;
      let fileName = existingFileName;
      
      // Only upload a new file if one is selected
      if (file) {
        // Create a unique filename
        fileName = `${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `documents/${fileName}`);
        
        // Upload the file to Firebase Storage
        await uploadBytes(storageRef, file);
        
        // Get the download URL
        fileUrl = await getDownloadURL(storageRef);
      }
      
      // Create document metadata with only essential fields
      const documentData = {
        name: documentName,
        documentType: documentType,
        fileName: file ? file.name : fileName,
        fileUrl: fileUrl,
        status: isEditMode ? (documentToEdit.status || "Pending") : "Pending",
        uploadDate: isEditMode ? documentToEdit.uploadDate : serverTimestamp(),
        updatedAt: serverTimestamp(),
        phoneNumber: user.phoneNumber || '',
        flatId: flatId
      };
      
      if (isEditMode && documentToEdit.id) {
        // Update existing document
        const docRef = doc(db, 'documents', documentToEdit.id);
        await updateDoc(docRef, documentData);
        return documentToEdit.id;
      } else {
        // Add new document
        const docRef = await addDoc(collection(db, 'documents'), documentData);
        return docRef.id;
      }
    } catch (error) {
      console.error('Error handling document:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!selectedUser) {
      toast.error('Please select a user.');
      return;
    }

    if (!selectedFlatId) {
      toast.error('Please select a flat for this document.');
      return;
    }

    if (!file && !existingFileUrl && !isEditMode) {
      toast.error('Please select a file.');
      return;
    }

    setIsLoading(true);

    try {
      // Upload or update document with flatId
      const docId = await uploadDocument(file, selectedUser, documentType, name, selectedFlatId);
      console.log(`Document ${isEditMode ? 'updated' : 'uploaded'} with ID:`, docId);
      
      // Get flat info for notification
      const selectedFlat = selectedUser.flats?.approved?.find(flat => flat.flatId === selectedFlatId);
      const flatDisplay = selectedFlat ? `${selectedFlat.wing}-${selectedFlat.flatNumber}` : '';
      
      // Close modal first - this prevents the error from blocking the UI
      setIsLoading(false); // Reset loading state before closing
      onClose();
      
      // Show success toast
      toast.success(`Document ${isEditMode ? 'updated' : 'uploaded'} successfully!`);
      
      // Reset form state
      resetForm();
      
      // Send notification after modal is closed, with error handling
      if (!isEditMode) { // Only send notifications for new documents
        try {
          const notificationResult = await sendUserNotification(
            documentType,
            `New document: ${name} for flat ${flatDisplay}`,
            {
              documentId: docId,
              documentType: documentType,
              documentName: name,
              flatId: selectedFlatId
            },
            selectedUser.phoneNumber
          );
          
          if (!notificationResult.error) {
            // Only show success if no error
            toast.success('Notification sent successfully!');
          } else {
            // Show notification failure
            toast.info('Document uploaded but notification could not be sent.');
          }
        } catch (notificationError) {
          // Catch and handle any unexpected notification errors
          console.error('Notification error handled gracefully:', notificationError);
          toast.info('Document uploaded but notification could not be sent.');
        }
      }
    } 
    catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'uploading'} document:`, error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'upload'} document. Please try again.`);
      setIsLoading(false); // Only reset loading if there's an error
    }
  };

  const truncateText = (text, charLimit = 20) => {
    if (!text) return '';
    if (text.length <= charLimit) {
      return text;
    }
    
    // Find the last space within the character limit
    const lastSpace = text.lastIndexOf(' ', charLimit);
    
    // If there's a space within the limit, cut at that space
    if (lastSpace > 0) {
      return text.slice(0, lastSpace) + '...';
    }
    
    // If there's no space (it's one long word), just cut at the character limit
    return text.slice(0, charLimit) + '...';
  };

  // Find flat details for display
  const getSelectedFlatDisplay = () => {
    if (!selectedFlatId || !selectedUser || !selectedUser.flats || !selectedUser.flats.approved) {
      return "Select flat";
    }
    
    const selectedFlat = selectedUser.flats.approved.find(flat => flat.flatId === selectedFlatId);
    if (selectedFlat) {
      return `${selectedFlat.wing}-${selectedFlat.flatNumber}`;
    }
    
    return "Select flat";
  };
  
  return (
    <div className="fixed inset-0 z-50 justify-center bg-black bg-opacity-50 flex items-center p-4 sm:p-0" style={{fontFamily:'Plus_Jakarta'}}>
    <div className="bg-white justify-center rounded-2xl w-full max-w-[428px] flex flex-col" style={{fontFamily:'Plus_Jakarta', maxHeight: '600px'}}>
     
        <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10" style={{fontFamily:'Plus_Jakarta', borderTopLeftRadius:'20px', borderTopRightRadius:'20px'}}>
          <div style={{ width: '24px', height: '24px' }}></div>
          <h2 style={headerStyle}>{isEditMode ? 'Edit Document' : 'Add Document'}</h2>
          <button onClick={onClose} style={{ width: '24px', height: '24px' }}>
          <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 sm:px-6 py-4 flex-grow overflow-y-auto" style={{fontFamily:'Plus_Jakarta', maxHeight: 'calc(600px - 128px)'}}>
          <div className="flex flex-col gap-4">
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
            <MagnifyingGlass size={24} />
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
                        {truncateText(`${user.firstName || ''} ${user.lastName || ''}`, 20)}
                        <span>{user.flats?.approved?.[0]?.wing || ''} - {user.flats?.approved?.[0]?.flatNumber || ''}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Select Flat Dropdown */}
          {selectedUser && selectedUser.flats && selectedUser.flats.approved && selectedUser.flats.approved.length > 0 && (
            <div className='mb-3 relative' ref={flatDropdownRef}>
              <label style={{...labelStyle, fontFamily:'Plus_Jakarta' }}>Select Flat</label>
              <div 
                onClick={() => setShowFlatDropdown(!showFlatDropdown)}
                style={{
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
                  marginTop:'7px',
                  cursor: "pointer"
                }}
              >
                <span>{getSelectedFlatDisplay()}</span>
                <CaretDown size={24} />
              </div>

              {showFlatDropdown && selectedUser.flats.approved.length > 0 && (
                <div className="absolute w-full mt-3 bg-white border border-gray-200 rounded-md shadow-lg z-10" 
                    style={{
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}>
                  {selectedUser.flats.approved.map((flat, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                      style={{borderBottom: '1px solid var(--Gray-100, #E5E7EB)'}}
                      onClick={() => handleFlatSelect(flat.flatId)}
                    >
                      <div className="font-medium" style={{fontSize:'14px', color:'#6B7280'}}>
                        <div className='flex justify-between'>
                          <span>{flat.wing} - {flat.flatNumber}</span>
                          <span style={{color: flat.flatId === selectedFlatId ? '#4F46E5' : 'transparent'}}>✓</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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
               value={name}
               onChange={(e) => setName(e.target.value)}
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
                    checked={documentType === 'Demand letters'}
                    onChange={() => setDocumentType('Demand letters')}
                    className="sr-only"
                  />
                  {documentType === 'Demand letters' && (
                   <Check size={24} />
                  )}
                </div>
                <span style={{ ...labelStyle, marginLeft: '8px', fontSize:'13px', color: documentType === 'Demand letters' ? '#030712' : '#6B7280', fontFamily:'Plus_Jakarta' }}>Demand letters</span>
              </label>
              <label className="flex items-center">
                <div style={{
                  ...radioBoxStyle,
                  border: documentType === 'Agreement for sale' ? '1px solid var(--Gray-900, #030712)' : '1px solid var(--Gray-300, #9CA3AF)',
                  background: documentType === 'Agreement for sale' ? 'var(--Gray-50, #F3F4F6)' : 'var(--Base-White, #FFF)',
                }}>
                  <input
                    type="radio"
                    checked={documentType === 'Agreement for sale'}
                    onChange={() => setDocumentType('Agreement for sale')}
                    className="sr-only"
                  />
                  {documentType === 'Agreement for sale' && (
                    <Check size={24} />
                  )}
                </div>
                <span style={{ ...labelStyle, marginLeft: '8px', color: documentType === 'Agreement for sale' ? '#030712' : '#6B7280', fontFamily:'Plus_Jakarta' }}>Agreement for sale</span>
              </label>
            </div>
            </div>

          
<div style={{...uploadAreaStyle, marginTop:'13px'}} className='flex flex-col' onClick={() => document.getElementById('fileInput').click()}>
  <input
    id="fileInput"
    type="file"
    onChange={handleFileChange}
    style={{ display: 'none' }}
  />
 <FolderOpen color='grey' size={20} />
  <p style={{...clickToUploadStyle, fontFamily:'Plus_Jakarta'}}>
    {file ? file.name : existingFileName ? `Current file: ${existingFileName}` : 'Click to upload'}
  </p>
</div>
</div>
</div>

{/* Footer */}
<div className="px-6 py-6 border-t border-gray-100 flex justify-between items-center" style={{fontFamily:'Plus_Jakarta'}}>
<button 
  style={{...clearAllStyle,fontFamily:'Plus_Jakarta'}} 
  onClick={resetForm}
  disabled={isLoading}
>
  Clear all
</button>
<button 
  onClick={handleSubmit} 
  style={{...addButtonStyle, fontFamily:'Plus_Jakarta'}}
  disabled={isLoading}
>
  {isLoading ? (
    <div className="flex items-center">
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {isEditMode ? 'Updating...' : 'Uploading...'}
    </div>
  ) : (isEditMode ? "Update" : "Add")}
</button>
</div>
</div>
</div>
);
};

export default AddEditDocumentsModal;