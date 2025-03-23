import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronLeft, X, Upload } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, getFirestore, updateDoc, query, where, deleteDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import { DownloadSimple } from 'phosphor-react';
import { useHeader } from '../context/HeaderContext';
import { useAuth } from '../context/AuthContext';

const WING_DATA = [
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'C', value: 'C' },
  { label: 'D', value: 'D' },
];

const FLAT_DATA = {
  'A': ['101', '102', '103', '104', '105'],
  'B': ['101', '102', '103', '104', '105'],
  'C': ['101', '102', '103', '104', '105'],
  'D': ['101', '102', '103', '104', '105'],
};

const DOCUMENT_TYPES = [
  { name: 'Aadhar Card', type: 'Identification Proof' },
  { name: 'PAN Card', type: 'Identification Proof' },
  { name: 'Driving License', type: 'Identification Proof' },
  { name: 'Ration Card', type: 'Address Proof' },
];

const SERVICES = [
  'Maid',
  'Cook',
  'Driver',
  'Cleaner'
];

const HelperProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const db = getFirestore(getApp());
  const storage = getStorage(getApp());
  const { setFormDirty, startSave, endSave, setIsFormEditing, headerData } = useHeader();
const { setSelectedUser, setIsAddingNew } = headerData;
const dropdownRef = useRef(null);
const { user } = useAuth();
  

  const [selectedWings, setSelectedWings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDocumentDropdown, setShowDocumentDropdown] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  // const [selectedWing, setSelectedWing] = useState('A');
  const [selectedFlat, setSelectedFlat] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedFlats, setSelectedFlats] = useState([]);
  const [availableWings, setAvailableWings] = useState([]);
  const [availableFlats, setAvailableFlats] = useState({});
  const [flatsData, setFlatsData] = useState([]);
  const [selectedWing, setSelectedWing] = useState('');
  const [selectedFlatNumber, setSelectedFlatNumber] = useState('');


  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    documentType: '',
    service: '',
    imageUrl: '',
    documents: [],
    employeeId: ''
  });
  const [isDirty, setIsDirty] = useState(false);
  const [guardData, setGuardData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [dropdownPosition, setDropdownPosition] = useState('bottom');


   // Fetch flats data on component mount
   useEffect(() => {
    const fetchFlats = async () => {
      try {
        const flatsRef = collection(db, 'flats');
        const querySnapshot = await getDocs(flatsRef);
        
        const flats = [];
        const wings = new Set();
        const flatsByWing = {};
        
        querySnapshot.forEach((doc) => {
          const id = doc.id;
          const parts = id.split('_');
          
          if (parts.length >= 3 && parts[0] === 'flat') {
            const wing = parts[1]; // Get wing part (A, B, C, etc.)
            const flatNumber = parts[2]; // Get flat number (101, 102, etc.)
            
            wings.add(wing);
            
            if (!flatsByWing[wing]) {
              flatsByWing[wing] = [];
            }
            
            flatsByWing[wing].push({
              id: id,
              flatNumber: flatNumber,
              displayName: `${wing}-${flatNumber}`
            });
            
            flats.push({
              id: id,
              wing: wing,
              flatNumber: flatNumber,
              displayName: `${wing}-${flatNumber}`
            });
          }
        });
        
        setFlatsData(flats);
        setAvailableWings(Array.from(wings).sort());
        setAvailableFlats(flatsByWing);
        
        if (wings.size > 0) {
          setSelectedWing(Array.from(wings)[0]);
        }
      } catch (error) {
        console.error('Error fetching flats:', error);
        toast.error('Failed to load flats data');
      }
    };
    
    fetchFlats();
  }, [db]);

   // Handle resize events to detect mobile view
   useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const helperDoc = await getDoc(doc(db, 'helpers', id));
        
        if (helperDoc.exists()) {
          const helperData = helperDoc.data();
          setFormData({
            firstName: helperData.firstName || '',
            lastName: helperData.lastName || '',
            phone: helperData.visitorPhoneNumber || '',
            documentType: helperData.documentType || '',
            service: helperData.services?.[0]?.name || '',
            imageUrl: helperData.imageUrl || '',
            documents: helperData.documents || [],
            employeeId: helperData.employeeId || ''
          });

          // Process flat IDs and map to display values for UI
          const flatIds = helperData.flatNumbers || [];
          
          // For each flatId, find the corresponding flat in flatsData or create a display object
          const flatsToDisplay = flatIds.map(flatId => {
            // Try to find the flat in our flats data
            const foundFlat = flatsData.find(flat => flat.id === flatId);
            
            // If found, use that
            if (foundFlat) {
              return foundFlat;
            } 
            // Otherwise, try to parse the ID to create a display name
            else {
              const parts = flatId.split('_');
              if (parts.length >= 3 && parts[0] === 'flat') {
                const wing = parts[1];
                const flatNumber = parts[2];
                return {
                  id: flatId,
                  wing: wing,
                  flatNumber: flatNumber,
                  displayName: `${wing}-${flatNumber}`
                };
              }
              // If all else fails, just show the ID
              return {
                id: flatId,
                displayName: flatId
              };
            }
          });
          
          setSelectedFlats(flatsToDisplay);
  
          // First try to fetch guard data using employeeId
          if (helperData.employeeId) {
            const guardQuery = query(
              collection(db, 'guardUser'), 
              where('employeeId', '==', helperData.employeeId)
            );
            const guardSnapshot = await getDocs(guardQuery);
            
            if (!guardSnapshot.empty) {
              setGuardData(guardSnapshot.docs[0].data());
            }
          } 
          // If no employeeId or no guard found, try to fetch staff data using phoneNumber
          else if (helperData.phoneNumber) {
            const staffQuery = query(
              collection(db, 'staffUsers'),
              where('phoneNumber', '==', helperData.phoneNumber)
            );
            const staffSnapshot = await getDocs(staffQuery);
  
            if (!staffSnapshot.empty) {
              const staffData = staffSnapshot.docs[0].data();
              setGuardData({
                firstName: staffData.firstName || '',
                lastName: staffData.lastName || '',
                email: staffData.email || '',
                phoneNumber: staffData.phoneNumber || ''
              });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error loading profile data');
      } finally {
        setIsLoading(false);
      }
    };
  
    if (id) {
      fetchData();
    }
  }, [id, db, flatsData]);

  const handleDeleteProfile = async () => {
    try {
      await deleteDoc(doc(db, 'helpers', id));
      toast.success('Profile deleted successfully');
      navigate('/AddHelper');
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast.error('Error deleting profile');
    }
  };
  // useEffect(() => {
  //   setIsFormEditing(true);
  //   setSelectedUser(true); // Indicate we have a selected user
  //   setIsAddingNew(false); // Indicate we're not adding new
    
  //   return () => {
  //     setIsFormEditing(false);
  //     setFormDirty(false);
  //     setSelectedUser(false);
  //     setIsAddingNew(false);
  //   };
  // }, [setIsFormEditing, setFormDirty, setSelectedUser, setIsAddingNew]);

  const getDocumentByType = (documentType) => {
    return formData.documents.find(doc => doc.documentName === documentType);
  };

  const handleDeleteDocument = async (documentType) => {
    try {
      const updatedDocs = formData.documents.filter(doc => doc.documentName !== documentType);
      await updateDoc(doc(db, 'helpers', id), {
        documents: updatedDocs
      });
      setFormData(prev => ({ ...prev, documents: updatedDocs }));
      toast.success('Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Error deleting document');
    }
  };

  const handleDownloadDocument = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = async (file, documentType) => {
    try {
      setIsUploading(true);
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }

      const timestamp = new Date().getTime();
      const storageRef = ref(storage, `helpers/${id}/documents/${timestamp}_${file.name}`);
      
      const uploadTask = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadTask.ref);

      const newDocument = {
        documentName: documentType,
        documentType: DOCUMENT_TYPES.find(doc => doc.name === documentType)?.type || 'Other',
        fileName: file.name,
        fileUrl: downloadURL
      };

      // Remove any existing document of the same type
      const existingDocs = formData.documents.filter(doc => doc.documentName !== documentType);
      const updatedDocs = [...existingDocs, newDocument];
      
      setFormData(prev => ({ ...prev, documents: updatedDocs }));
      setIsDirty(true);

      await updateDoc(doc(db, 'helpers', id), {
        documents: updatedDocs
      });

      toast.success('Document uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading document');
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
    }
  };

  const handleDocumentTypeSelect = (type) => {
    setFormData(prev => ({ ...prev, documentType: type }));
    setShowDocumentDropdown(false);
    setIsDirty(true);
    setFormDirty(true); // Add this line
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({
  //     ...prev,
  //     [name]: value
  //   }));
  //   setIsDirty(true);
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for phone number
    if (name === 'phone') {
      // Remove any existing +91 and non-digit characters
      const cleanedPhone = value.replace(/\D/g, '');
      
      // Prepend +91 if not already present
      const formattedPhone = cleanedPhone.startsWith('91') 
        ? `+${cleanedPhone}` 
        : `+91${cleanedPhone}`;
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedPhone
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    setIsDirty(true);
    setFormDirty(true);
  };

  const formatPhoneForDisplay = (phone) => {
    if (!phone) return '';
    
    // Remove +91 and format the remaining 10 digits
    const cleanedPhone = phone.replace('+91', '');
    return cleanedPhone.length === 10 
      ? `${cleanedPhone.slice(0, 5)} ${cleanedPhone.slice(5)}` 
      : cleanedPhone;
  };
  // const handleRemoveWing = (wingToRemove) => {
  //   setSelectedWings(prev => prev.filter(wing => wing !== wingToRemove));
  //   setIsDirty(true);
  // };
  const handleRemoveFlat = (flatToRemove) => {
    setSelectedFlats(prev => prev.filter(flat => flat.id !== flatToRemove.id));
    setIsDirty(true);
    setFormDirty(true);
  };

  // const handleUpdateProfile = async () => {
  //   try {
  //     const updateData = {
  //       firstName: formData.firstName,
  //       lastName: formData.lastName,
  //       visitorPhoneNumber: formData.phone, // Changed from phoneNumber to visitorPhoneNumber
  //       documentType: formData.documentType,
  //       services: [{ name: formData.service, status: 'active' }],
  //       flatNumbers: selectedWings,
  //       updatedAt: new Date()
  //     };

  //     await updateDoc(doc(db, 'helpers', id), updateData);
  //     toast.success('Profile updated successfully');
  //     setIsDirty(false);
  //     setFormDirty(false); // Add this
  //   } catch (error) {
  //     console.error('Error updating profile:', error);
  //     toast.error('Error updating profile');
  //   }
  // };

  const handleUpdateProfile = async () => {
    try {
      const form = document.getElementById('owner-form');
      if (form) {
        const saveEvent = new CustomEvent('saveForm', {
          bubbles: true,
          detail: {
            successCallback: () => {
              setIsDirty(false);
              setFormDirty(false);
              navigate('/AddHelper');
            },
            errorCallback: () => {
              toast.error('Failed to save changes');
            }
          }
        });
        form.dispatchEvent(saveEvent);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    }
  };
  // const handleAddFlat = () => {
  //   if (selectedWing && selectedFlat) {
  //     const flatString = `${selectedWing}-${selectedFlat}`;
  //     if (!selectedWings.includes(flatString)) {
  //       setSelectedWings(prev => [...prev, flatString]);
  //       setIsDirty(true);
  //     }
  //     setIsModalOpen(false);
  //     setSelectedWing('A');
  //     setSelectedFlat('');
  //   }
  // };

  const handleAddFlat = () => {
    if (selectedWing && selectedFlatNumber) {
      const selectedFlat = availableFlats[selectedWing]?.find(flat => flat.flatNumber === selectedFlatNumber);
      
      if (selectedFlat && !selectedFlats.some(flat => flat.id === selectedFlat.id)) {
        setSelectedFlats(prev => [...prev, selectedFlat]);
        setIsDirty(true);
        setFormDirty(true);
      }
      
      setIsModalOpen(false);
      setSelectedFlatNumber('');
    }
  };

  // Add form save event listener
  useEffect(() => {
    const form = document.getElementById('owner-form');
    
    const handleSaveForm = async (event) => {
      const { successCallback, errorCallback } = event.detail;
      
      try {
        startSave();
        
        // Create update data from current form state
        const updateData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          visitorPhoneNumber: formData.phone, // Make sure we're using the current phone value
          documentType: formData.documentType,
          services: [{ name: formData.service, status: 'active' }],
          flatNumbers: selectedFlats.map(flat => flat.id),
          updatedAt: new Date()
        };
  
        await updateDoc(doc(db, 'helpers', id), updateData);
        
        successCallback();
        setIsDirty(false);
        setFormDirty(false);
        navigate('/AddHelper');
        
      } catch (error) {
        console.error('Error saving profile:', error);
        errorCallback();
        toast.error('Failed to save changes');
      }
    };
  
    if (form) {
      form.addEventListener('saveForm', handleSaveForm);
      return () => form.removeEventListener('saveForm', handleSaveForm);
    }
  }, [db, formData, id, navigate, selectedWings, setFormDirty, startSave]); // Add all dependencies

  const handleServiceSelect = (service) => {
    setFormData(prev => ({ ...prev, service }));
    setShowServiceDropdown(false);
    setIsDirty(true);
    setFormDirty(true); // Add this line
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch(extension) {
      case 'pdf':
        return 'PDF';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'IMG';
      default:
        return 'DOC';
    }
  };

  const renderDocumentInput = (documentType) => {
    const existingDoc = getDocumentByType(documentType);
    
    if (existingDoc) {
      return (
        <div key={documentType}
        style={{target:'Blank'}}
        onClick={() => handleDownloadDocument(existingDoc.fileUrl, existingDoc.fileName)} className="relative flex items-center gap-3 p-3 bg-white border border-[#E5E7EB] rounded-lg w-full md:w-[316px] cursor-pointer">
          <div className={`h-12 w-12 rounded flex items-center justify-center text-white font-medium
            ${getFileIcon(existingDoc.fileName) === 'PDF' ? 'bg-red-500' : 
              getFileIcon(existingDoc.fileName) === 'IMG' ? 'bg-blue-500' : 'bg-gray-500'}`}>
            {getFileIcon(existingDoc.fileName)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[#111827] text-sm">{existingDoc.documentName}</p>
            <p className="text-sm text-[#6B7280]">{existingDoc.fileName}</p>
          </div>
          <div className="flex gap-2">
            {/* <button
              onClick={() => handleDownloadDocument(existingDoc.fileUrl, existingDoc.fileName)}
              className="text-blue-600 hover:text-blue-700"
            >
             <DownloadSimple size={24} weight="fill" color='grey' />
            </button> */}
            <button
              onClick={() => handleDeleteDocument(documentType)}
              className="absolute top-1 right-2 text-gray-400 hover:text-red-500"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div key={documentType} className="flex items-center gap-3 p-3 bg-[#F9FAFB] border border-dashed border-[#E5E7EB] rounded-lg w-full">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFileUpload(file, documentType);
              }
            }}
            className="hidden"
            id={`file-${documentType}`}
          />
          <label
            htmlFor={`file-${documentType}`}
            className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-gray-700"
          >
            <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center">
              <Upload size={20} />
            </div>
            <div>
              <p className="text-sm font-medium">Upload {documentType}</p>
              <p className="text-xs text-gray-500">PDF, JPG, PNG up to 5MB</p>
            </div>
          </label>
        </div>
      );
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowDocumentDropdown(false);
        setShowServiceDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="p-2 lg:p-0 lg:ml-10">
      <form id="owner-form">
      {/* Back Button */}
      <div className="mb-4 md:mb-8" style={{
        // border:'1px solid red'
      }}>
        <div className="flex items-center gap-2 text-[#6B7280] cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-7 w-7 bg-[#F3F4F6] p-1.5 rounded" />
          <span className="text-base font-medium">Back</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.8fr,0.8fr] gap-4 md:gap-8">
        {/* Left Side - Helper Information */}
        <div className="bg-white rounded-[24px] p-10" style={{
            borderRadius: 12,
            border: '1px solid var(--Gray-100, #E5E7EB)'
        }}>
          <h2 className="text-[16px] text-[#121212] font-medium mb-8">Helper Information</h2>
          
          <div className="space-y-6 md:space-y-8">
            {/* Profile Image */}
            <div className="mb-8">
              <label className="text-[12px] text-[#454545] mb-2 block">Profile Image</label>
              <img 
                src={formData.imageUrl || "/Images/profile.png"}
                alt="Profile" 
                className="w-24 h-24 rounded-md object-cover"
              />
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-1.5">
                <label className="text-[12px] text-[#6B7280] block">First name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  style={{fontSize:16}}
                  className="w-full px-4 h-[45px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#4B5563] text-base outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] text-[#6B7280] block">Last name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  style={{fontSize:16}}
                  onChange={handleInputChange}
                  className="w-full px-4 h-[45px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#4B5563] text-base outline-none"
                />
              </div>
            </div>

            {/* Phone and Flat Fields */}
            {/* <div className="grid grid-cols-2 gap-6"> */}
              <div className="space-y-1.5">
                <label className="text-[12px] text-[#6B7280] block">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formatPhoneForDisplay(formData.phone)}
                  style={{fontSize:16}}
                  onChange={handleInputChange}
                  maxLength={10} // Limit to 10 digits for display
                  className="w-full px-4 h-[45px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#4B5563] text-base outline-none"
                />
              </div>
              <div className="space-y-1.5" ref={dropdownRef}>
              <label className="text-[12px] text-[#6B7280] block">Flat no.</label>
              <div className="flex gap-2 flex-wrap md:flex-nowrap">
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsModalOpen(true);
                  }}
                  style={{fontSize:16}}
                  className="px-4 h-[45px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg flex items-center gap-2 text-[#4B5563] min-w-[100px]"
                >
                  Wing <ChevronDown size={16} />
                </button>
                <input
                  type="text"
                  placeholder="Flat number"
                  readOnly
                  onClick={() => setIsModalOpen(true)}
                  style={{fontSize:16}}
                  className="flex-1 px-4 h-[45px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#4B5563] text-base outline-none cursor-pointer"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2 items-center">
                {selectedFlats.map((flat) => (
                  <div
                    key={flat.id}
                    style={{borderRadius:20, border:'1px solid #E5E5E5'}}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#F9FAFB] rounded text-sm border border-[#E5E7EB]"
                  >
                    {/* Show the user-friendly display name */}
                    {flat.displayName}
                    <X 
                      size={14} 
                      className="text-gray-400 cursor-pointer ml-1" 
                      onClick={() => handleRemoveFlat(flat)}
                    />
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsModalOpen(true);
                  }}
                  className="text-blue-500 text-end text-sm hover:text-blue-600"
                >
                  Add More
                </button>
              </div>
            </div>
            {/* </div> */}

            {/* Document Type and Service */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-1.5 dropdown-container relative">
                <label className="text-[12px] text-[#6B7280] block">Document Type</label>
                <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowDocumentDropdown(!showDocumentDropdown);
                }}
                  style={{fontSize:16}}
                  className="w-full px-4 h-[45px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg flex items-center justify-between text-[#4B5563]"
                >
                  {formData.documentType || 'Select Document Type'}
                  <ChevronDown size={16} />
                </button>
                {showDocumentDropdown && (
                  <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {DOCUMENT_TYPES.map((type) => (
                      <button
                        key={type.name}
                        type="button"
        onClick={(e) => {
          e.preventDefault();
          handleDocumentTypeSelect(type.name);
        }}
                       
                        // onClick={() => handleDocumentTypeSelect(type.name)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 text-[#4B5563]"
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-1.5 dropdown-container relative">
                <label className="text-[12px] text-[#6B7280] block">Service</label>
                <button 
                  type="button" // Add this
                  onClick={(e) => {
                    e.preventDefault(); // Add this
                    setShowServiceDropdown(!showServiceDropdown)
                  }}
                  style={{fontSize:16}}
                  className="w-full px-4 h-[45px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg flex items-center justify-between text-[#4B5563]"
                >
                  {formData.service || 'Select Service'}
                  <ChevronDown size={16} />
                </button>
                {showServiceDropdown && (
                  <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {SERVICES.map((service) => (
                      <button
                        key={service}
                        type="button" // Add this
                        onClick={(e) => {
                          e.preventDefault(); // Add this
                          handleServiceSelect(service)
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 text-[#4B5563]"
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Documents Display */}
            <div className="space-y-1.5 mt-6">
              <label className="text-[12px] text-[#6B7280] block">Uploaded Documents</label>
              <div className="space-y-3">
                {formData.documentType && renderDocumentInput(formData.documentType)}
                {isUploading && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent"></div>
                    Uploading document...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Guard Information */}
        <div className="space-y-4 max-w-md">
          <div className="bg-white rounded-[20px] p-6 shadow-sm" 
          style={{
            borderRadius: 12,
            border: '1px solid var(--Gray-100, #E5E7EB)'
        }}>
            <h2 className="text-[16px] font-medium text-[#111827] mb-6">Approver Information</h2>
            
            {guardData && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="text-[12px] text-[#6B7280] block">First Name</label>
                    <p className="text-[16px] text-[#111827] mt-1 font-medium">{guardData.firstName}</p>
                  </div>
                  <div>
                    <label className="text-[12px] text-[#6B7280] block">Last Name</label>
                    <p className="text-[16px] text-[#111827] mt-1 font-medium">{guardData.lastName}</p>
                  </div>
                </div>

                <div>
                  <label className="text-[12px] text-[#6B7280] block">Email</label>
                  <p className="text-[16px] text-[#111827] mt-1 font-medium">{guardData.email}</p>
                </div>

                <div>
                  <label className="text-[12px] text-[#6B7280] block">Phone</label>
                  <p className="text-[16px] text-[#111827] mt-1 font-medium">{guardData.phoneNumber}</p>
                </div>
              </div>
            )}
          </div>

          {/* <button 
            onClick={handleUpdateProfile}
            style={{fontSize:16, borderRadius:8}}
            className={`w-full py-4 rounded-2xl transition-colors  ${
              isDirty 
                ? 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-300' 
                : 'text-[#E23744] border border-red-300 hover:bg-red-100' 
            }`}
          >
            {isDirty ? 'Update Profile' : 'Delete Profile'}
          </button> */}
          {/* <button 
  type="button"
  onClick={(e) => {
    e.preventDefault();
    const form = document.getElementById('owner-form');
    if (form) {
      const saveEvent = new CustomEvent('saveForm', {
        bubbles: true,
        detail: {
          successCallback: () => {
            setIsDirty(false);
            setFormDirty(false);
            navigate('/AddHelper');
          },
          errorCallback: () => {
            toast.error('Failed to save changes');
          }
        }
      });
      form.dispatchEvent(saveEvent);
    }
  }}
  style={{fontSize:16, borderRadius:8}}
  className={`w-full py-4 rounded-2xl transition-colors  ${
    isDirty 
      ? 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-300' 
      : 'text-[#E23744] border border-red-300 hover:bg-red-100' 
  }`}
>
  {isDirty ? 'Update Profile' : 'Delete Profile'}
</button> */}
{/* <button 
  type="button"
  onClick={(e) => {
    e.preventDefault();
    if (isDirty) {
      // If dirty, use the normal update flow
      const form = document.getElementById('owner-form');
      if (form) {
        const saveEvent = new CustomEvent('saveForm', {
          bubbles: true,
          detail: {
            successCallback: () => {
              setIsDirty(false);
              setFormDirty(false);
              navigate('/AddHelper');
            },
            errorCallback: () => {
              toast.error('Failed to save changes');
            }
          }
        });
        form.dispatchEvent(saveEvent);
      }
    } else {
      // If not dirty, show delete confirmation
      setShowDeleteModal(true);
    }
  }}
  style={{fontSize:16, borderRadius:8}}
  className={`w-full py-4 rounded-2xl transition-colors  ${
    isDirty 
      ? 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-300' 
      : 'text-[#E23744] border border-red-300 hover:bg-red-100' 
  }`}
>
  {isDirty ? 'Update Profile' : 'Delete Profile'}
</button> */}
<button 
  type="button"
  onClick={(e) => {
    e.preventDefault();
    setShowDeleteModal(true);
  }}
  style={{fontSize:16, borderRadius:8}}
  className="w-full py-4 rounded-2xl transition-colors text-[#E23744] border border-red-300 hover:bg-red-100"
>
  Delete Profile
</button>
        </div>
      </div>

      {/* Flat Selector Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[90%] max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-[#111827]">Select Flat</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-base text-[#111827] font-medium">Select Flat No.</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <select 
                    value={selectedWing}
                    onChange={(e) => {
                      setSelectedWing(e.target.value);
                      setSelectedFlatNumber('');
                    }}
                    className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-[#4B5563] appearance-none"
                  >
                    <option value="" disabled>Wing</option>
                    {availableWings.map((wing) => (
                      <option key={wing} value={wing}>
                        {wing}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <select
                    value={selectedFlatNumber}
                    onChange={(e) => setSelectedFlatNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-[#4B5563] appearance-none"
                  >
                    <option value="" disabled>Flat No.</option>
                    {selectedWing && availableFlats[selectedWing]?.map((flat) => (
                      <option key={flat.id} value={flat.flatNumber}>
                        {flat.flatNumber}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedFlats.length > 0 && (
                <div className="mt-4 p-4 bg-[#F9FAFB] rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {selectedFlats.map((flat) => (
                      <div
                        key={flat.id}
                        className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-full text-sm border border-[#E5E7EB]"
                      >
                        {/* Display the wing-flat name but we'll store the full ID */}
                        {flat.displayName}
                        <X 
                          size={14} 
                          className="text-gray-400 cursor-pointer ml-1" 
                          onClick={() => handleRemoveFlat(flat)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleAddFlat}
                disabled={!selectedWing || !selectedFlatNumber}
                className="w-full mt-6 py-4 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
      </form>

      {/* Delete Confirmation Modal */}
{showDeleteModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg w-[100%] max-w-lg p-6">
      <div className="text-center">
        <h3 className="text-[16px] font-medium text-gray-900 mb-4">Delete Profile</h3>
        <p className="text-[14px] text-gray-500 mb-6">
          Are you sure you want to delete this helper profile? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeleteProfile}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
)}
      
    </div>
    

  );
};

export default HelperProfile;