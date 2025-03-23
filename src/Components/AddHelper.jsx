import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronLeft, X, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getFirestore, query, where, getDocs } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { toast } from 'react-toastify';
import { FolderOpen, Image } from 'phosphor-react';
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

const generateEmployeeId = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  const checkEmployeeIdExists = async (db, ticketId) => {
    const helpersRef = collection(db, 'helpers');
    const q = query(helpersRef, where('ticketId', '==', ticketId));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };
  
  const generateUniqueEmployeeId = async (db) => {
    let ticketId;
    let exists = true;
    
    while (exists) {
        ticketId = generateEmployeeId();
      exists = await checkEmployeeIdExists(db, ticketId);
    }
    
    return ticketId;
  };
  

const AddHelperForm = () => {
  const navigate = useNavigate();
  const storage = getStorage(getApp());
  const db = getFirestore(getApp());
  const { user, loading } = useAuth();
  console.log(user);
  
  const dropdownRef = useRef(null);

  const [selectedWings, setSelectedWings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDocumentDropdown, setShowDocumentDropdown] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  // const [selectedWing, setSelectedWing] = useState('A');
  const [selectedFlats, setSelectedFlats] = useState([]);
  const [dropdownPosition, setDropdownPosition] = useState('bottom');
  const [isUploading, setIsUploading] = useState(false);
  const [documentFile, setDocumentFile] = useState(null);
  const [isDocumentUploading, setIsDocumentUploading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // New state for available flats from Firestore
  const [availableWings, setAvailableWings] = useState([]);
  const [availableFlats, setAvailableFlats] = useState({});
  const [flatsData, setFlatsData] = useState([]);
  const [selectedWing, setSelectedWing] = useState('');
  const [selectedFlatNumber, setSelectedFlatNumber] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    documentType: 'Aadhar Card',  // Set default document type
    service: '',
    imageUrl: '',
    documents: []
  });

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


  // Add resize listener for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDocumentDropdown(false);
        setShowServiceDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



  

  const handleDropdownToggle = (dropdownSetter, currentState) => {
    // Get the position of the dropdown trigger
    const rect = dropdownRef.current?.getBoundingClientRect();
    if (rect) {
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setDropdownPosition(spaceBelow < 200 && spaceAbove > 200 ? 'top' : 'bottom');
    }
    dropdownSetter(!currentState);
  };

  const handleProfileImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const timestamp = new Date().getTime();
      const storageRef = ref(storage, `helpers/profiles/${timestamp}_${file.name}`);
      const uploadTask = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadTask.ref);
      
      setFormData(prev => ({ ...prev, imageUrl: downloadURL }));
      toast.success('Profile image uploaded successfully');
    } catch (error) {
      console.error('Error uploading profile image:', error);
      toast.error('Failed to upload profile image');
    } finally {
      setIsUploading(false);
    }
  };

  // Update the handleDocumentUpload function
const handleDocumentUpload = async (file) => {
  if (!file || !formData.documentType) return;

  try {
    setIsDocumentUploading(true); // Use the new state
    const timestamp = new Date().getTime();
    const storageRef = ref(storage, `helpers/documents/${timestamp}_${file.name}`);
    const uploadTask = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(uploadTask.ref);

    const newDocument = {
      documentName: formData.documentType,
      documentType: DOCUMENT_TYPES.find(doc => doc.name === formData.documentType)?.type || 'Other',
      fileName: file.name,
      fileUrl: downloadURL
    };

    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents.filter(doc => doc.documentName !== formData.documentType), newDocument]
    }));
    setDocumentFile(file);
    toast.success('Document uploaded successfully');
  } catch (error) {
    console.error('Error uploading document:', error);
    toast.error('Failed to upload document');
  } finally {
    setIsDocumentUploading(false); // Clear the loading state
  }
};

const handleInputChange = (e) => {
  const { name, value } = e.target;
  
  // Special handling for phone number
  if (name === 'phone') {
    // Remove any non-digit characters and limit to 10 digits
    const cleanedPhone = value.replace(/\D/g, '').slice(0, 10);
    
    // Prepend +91 if not already present
    const formattedPhone = `+91${cleanedPhone}`;
    
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
};

const formatPhoneForDisplay = (phone) => {
  if (!phone) return '';
  
  // Remove +91 and truncate to 10 digits
  const cleanedPhone = phone.replace('+91', '').slice(0, 10);
  return cleanedPhone.length === 10 
    ? `${cleanedPhone.slice(0, 5)} ${cleanedPhone.slice(5)}` 
    : cleanedPhone;
};

   const handleRemoveFlat = (flatToRemove) => {
    setSelectedFlats(prev => prev.filter(flat => flat.id !== flatToRemove.id));
  };

  const handleAddFlat = () => {
    if (selectedWing && selectedFlatNumber) {
      const selectedFlat = availableFlats[selectedWing]?.find(flat => flat.flatNumber === selectedFlatNumber);
      
      if (selectedFlat && !selectedFlats.some(flat => flat.id === selectedFlat.id)) {
        setSelectedFlats(prev => [...prev, selectedFlat]);
      }
      
      setIsModalOpen(false);
      setSelectedFlatNumber('');
    }
  };


  const handleCreateHelper = async () => {
    try {
      // Validation
      if (!formData.firstName || !formData.lastName || !formData.phone || !formData.service) {
        toast.error('Please fill in all required fields');
        return;
      }

      if (selectedFlats.length === 0) {
        toast.error('Please add at least one flat');
        return;
      }

      if (!user) {
        toast.error('User authentication required');
        return;
      }

       // Generate unique employee ID
       const ticketId = await generateUniqueEmployeeId(db);

      const helperData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: user.phoneNumber || "",
        imageUrl: formData.imageUrl,
        documentType: formData.documentType,
        documents: formData.documents,
        services: [{ name: formData.service, status: 'active' }],
        flatNumbers: selectedFlats.map(flat => flat.id), // Store flat IDs directly in flatNumbers
        createdAt: new Date(),
        status: 'approved',
        current:"",
        checkInTime:"",
        checkInDate:"",
        checkOutTime:"",
        checkOutDate:"",
        ticketId:ticketId,
        visitorPhoneNumber:formData.phone
      };

      await addDoc(collection(db, 'helpers'), helperData);
      toast.success('Helper added successfully');
      navigate(-1);
    } catch (error) {
      console.error('Error creating helper:', error);
      toast.error('Failed to create helper');
    }
  };

   // If authentication is loading, show loading state
   if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent"></div>
      </div>
    );
  }

   // If no user is logged in, redirect or show message
   if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Please log in to add helpers</p>
      </div>
    );
  }

  const getFileIcon = (fileName) => {
    const extension = fileName?.split('.').pop().toLowerCase();
    switch(extension) {
      case 'pdf': return 'PDF';
      case 'jpg':
      case 'jpeg':
      case 'png': return 'IMG';
      default: return 'DOC';
    }
  };

  return (
    <div className="p-4 md:p-6 lg:ml-10">
      {/* Back Button */}
      <div className="mb-6 md:mb-8">
        <div 
          className="flex items-center gap-2 text-[#6B7280] cursor-pointer w-fit"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-7 w-7 bg-[#F3F4F6] p-1.5 rounded" />
          <span className="text-base font-medium">Back</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.8fr,0.8fr] gap-4 md:gap-8">
        {/* Left Side - Helper Information */}
        <div className="bg-white rounded-[12px] p-5 md:p-10 border border-[#E5E7EB]">
          <h2 className="text-[16px] text-[#121212] font-medium mb-6 md:mb-8">Helper Information</h2>
          
          <div className="space-y-6 md:space-y-8">
            {/* Profile Image */}
            <div className="mb-6 md:mb-8">
              <label className="text-[12px] text-[#454545] mb-2 block">Profile Image</label>
              <div className="relative w-24 h-24">
  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
    {formData.imageUrl ? (
      <img 
        src={formData.imageUrl}
        alt="Profile" 
        className="w-full h-full rounded-lg object-cover"
      />
    ) : (
      <div className="w-8 h-8 flex items-center justify-center">
        <Image color='#808080' size={24} weight="fill" className='opacity-1 inset-0' />
      </div>
    )}
  </div>
  <input
    type="file"
    accept="image/*"
    onChange={handleProfileImageUpload}
    className="absolute inset-0 opacity-0 cursor-pointer"
  />
  {isUploading && (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
    </div>
  )}
</div>
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
                  className="w-full px-4 h-[45px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#4B5563] text-base outline-none"
                  style={{fontSize: 16}}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] text-[#6B7280] block">Last name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 h-[45px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#4B5563] text-base outline-none"
                  style={{fontSize: 16}}
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
                  onChange={handleInputChange}
                  maxLength={10} // Limit input to 10 digits in UI
                  className="w-full px-4 h-[45px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#4B5563] text-base outline-none"
                  style={{fontSize: 16}}
                />
              </div>
              {/* <div className="space-y-1.5">
                <label className="text-[12px] text-[#6B7280] block">Flat no.</label>
                <div className="flex gap-2 flex-wrap md:flex-nowrap">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 h-[45px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg flex items-center gap-2 text-[#4B5563] min-w-[100px]"
                    style={{fontSize: 16}}
                  >
                    Wing <ChevronDown size={16} />
                  </button>
                  <input
                    type="text"
                    placeholder="Flat number"
                    readOnly
                    onClick={() => setIsModalOpen(true)}
                    className="flex-1 px-4 h-[45px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#4B5563] text-base outline-none cursor-pointer"
                    style={{fontSize: 16}}
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-2 items-center">
                  {selectedWings.map((wing) => (
                    <div
                      key={wing}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#F9FAFB] rounded-full text-sm border border-[#E5E7EB]"
                    >
                      {wing}
                      <X 
                        size={14} 
                        className="text-gray-400 cursor-pointer ml-1" 
                        onClick={() => handleRemoveWing(wing)}
                      />
                    </div>
                  ))}
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="text-blue-500 text-sm hover:text-blue-600"
                  >
                    Add More
                  </button>
                </div>
              </div> */}
               <div className="space-y-1.5">
              <label className="text-[12px] text-[#6B7280] block">Flat no.</label>
              <div className="flex gap-2 flex-wrap md:flex-nowrap">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 h-[45px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg flex items-center gap-2 text-[#4B5563] min-w-[100px]"
                  style={{fontSize: 16}}
                >
                  Wing <ChevronDown size={16} />
                </button>
                <input
                  type="text"
                  placeholder="Flat number"
                  readOnly
                  onClick={() => setIsModalOpen(true)}
                  className="flex-1 px-4 h-[45px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#4B5563] text-base outline-none cursor-pointer"
                  style={{fontSize: 16}}
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2 items-center">
                {selectedFlats.map((flat) => (
                  <div
                    key={flat.id}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#F9FAFB] rounded-full text-sm border border-[#E5E7EB]"
                  >
                    {/* Show the wing-flat display name for UI, but we'll store the ID */}
                    {flat.displayName}
                    <X 
                      size={14} 
                      className="text-gray-400 cursor-pointer ml-1" 
                      onClick={() => handleRemoveFlat(flat)}
                    />
                  </div>
                ))}
                {selectedFlats.length > 0 && (
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="text-blue-500 text-sm hover:text-blue-600"
                  >
                    Add More
                  </button>
                )}
              </div>
            </div>
            {/* </div> */}

            {/* Document Type and Service */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6" ref={dropdownRef}>
              <div className="space-y-1.5 relative">
                <label className="text-[12px] text-[#6B7280] block">Document Type</label>
                <button 
                  onClick={() => handleDropdownToggle(setShowDocumentDropdown, showDocumentDropdown)}
                  className="w-full px-4 h-[45px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg flex items-center justify-between text-[#4B5563]"
                  style={{fontSize: 16}}
                >
                  {formData.documentType || 'Select Document Type'}
                  <ChevronDown size={16} />
                </button>
                {showDocumentDropdown && (
                  <div 
                                    
                    className={`absolute ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'} left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10`}
                  >
                    {DOCUMENT_TYPES.map((type) => (
                      <button
                        key={type.name}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 text-[#4B5563]"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, documentType: type.name }));
                          setShowDocumentDropdown(false);
                        }}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-1.5 relative">
                <label className="text-[12px] text-[#6B7280] block">Service</label>
                <button 
                  onClick={() => handleDropdownToggle(setShowServiceDropdown, showServiceDropdown)}
                  className="w-full px-4 h-[45px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg flex items-center justify-between text-[#4B5563]"
                  style={{fontSize: 16}}
                >
                  {formData.service || 'Select Service'}
                  <ChevronDown size={16} />
                </button>
                {showServiceDropdown && (
                  <div 
                    className={`absolute ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'} left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10`}
                  >
                    {SERVICES.map((service) => (
                      <button
                        key={service}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 text-[#4B5563]"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, service }));
                          setShowServiceDropdown(false);
                        }}
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Document Upload */}
        <div className="space-y-4">
          <div className="bg-white rounded-[12px] p-6 border border-[#E5E7EB]">
            <div className="space-y-6">
              {formData.documentType && (
                <>
                  <h3 className="text-[14px] font-medium text-[#111827]">Upload ID Proof</h3>
                  {documentFile ? (
  <div className="relative flex items-center gap-3 p-3 bg-white border border-[#E5E7EB] rounded-lg w-full">
    <div className={`h-12 w-12 rounded flex items-center justify-center text-white font-medium
      ${getFileIcon(documentFile.name) === 'PDF' ? 'bg-red-500' : 'bg-blue-500'}`}
    >
      {getFileIcon(documentFile.name)}
    </div>
    <div className="flex-1">
      <p className="text-[#111827] text-sm font-medium">{formData.documentType}</p>
      <p className="text-sm text-[#6B7280]">{documentFile.name}</p>
    </div>
    <button
      onClick={() => setDocumentFile(null)}
      className="absolute top-1 right-2 text-gray-400 hover:text-red-500"
    >
      <X size={16} />
    </button>
  </div>
) : (
  <div className="bg-[#F9FAFB] rounded-lg p-7 border-2 border-dashed border-[#D1D5DB] relative">
    <div className="flex flex-col items-center justify-center rounded-lg">
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleDocumentUpload(file);
        }}
        className="hidden"
        id="document-upload"
      />
      <label
        htmlFor="document-upload"
        className="flex flex-col items-center justify-center gap-4 cursor-pointer w-full h-full"
      >
        <div className="flex items-center justify-center">
          <FolderOpen className="w-6 h-6 text-gray-400" />
        </div>
        <div className="text-center">
          <p className="text-[14px] text-[#111827] font-medium mb-1">
            Upload a file or drag and drop
          </p>
          <p className="text-[14px] text-[#6B7280]">
            PNG, JPG, PDF upto 5MB
          </p>
        </div>
      </label>
    </div>
    {isDocumentUploading && (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
      </div>
    )}
  </div>
)}
                </>
              )}
            </div>
          </div>
          <button
            onClick={handleCreateHelper}
            className="w-full bg-black text-white rounded-lg py-4 text-base font-medium hover:bg-gray-900"
          >
            Add Helper
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
    </div>
  );
};

export default AddHelperForm;