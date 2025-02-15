import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronLeft, X, Upload } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, getFirestore, updateDoc, query, where } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import { DownloadSimple } from 'phosphor-react';

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

  const [selectedWings, setSelectedWings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDocumentDropdown, setShowDocumentDropdown] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [selectedWing, setSelectedWing] = useState('A');
  const [selectedFlat, setSelectedFlat] = useState('');
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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setIsLoading(true);
  //       const helperDoc = await getDoc(doc(db, 'helpers', id));
  //       if (helperDoc.exists()) {
  //         const helperData = helperDoc.data();
  //         setFormData({
  //           firstName: helperData.firstName || '',
  //           lastName: helperData.lastName || '',
  //           phone: helperData.phoneNumber || '',
  //           documentType: helperData.documentType || '',
  //           service: helperData.services?.[0]?.name || '',
  //           imageUrl: helperData.imageUrl || '',
  //           documents: helperData.documents || [],
  //           employeeId: helperData.employeeId || ''
  //         });
  //         setSelectedWings(helperData.flatNumbers || []);

  //         if (helperData.employeeId) {
  //           const guardQuery = query(
  //             collection(db, 'guardUser'), 
  //             where('employeeId', '==', helperData.employeeId)
  //           );
  //           const guardSnapshot = await getDocs(guardQuery);
  //           if (!guardSnapshot.empty) {
  //             setGuardData(guardSnapshot.docs[0].data());
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //       toast.error('Error loading profile data');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   if (id) {
  //     fetchData();
  //   }
  // }, [id, db]);
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
            phone: helperData.phoneNumber || '',
            documentType: helperData.documentType || '',
            service: helperData.services?.[0]?.name || '',
            imageUrl: helperData.imageUrl || '',
            documents: helperData.documents || [],
            employeeId: helperData.employeeId || ''
          });
          setSelectedWings(helperData.flatNumbers || []);
  
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
  }, [id, db]);

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
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsDirty(true);
  };

  const handleRemoveWing = (wingToRemove) => {
    setSelectedWings(prev => prev.filter(wing => wing !== wingToRemove));
    setIsDirty(true);
  };

  const handleUpdateProfile = async () => {
    try {
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phone,
        documentType: formData.documentType,
        services: [{ name: formData.service, status: 'active' }],
        flatNumbers: selectedWings,
        updatedAt: new Date()
      };

      await updateDoc(doc(db, 'helpers', id), updateData);
      toast.success('Profile updated successfully');
      setIsDirty(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    }
  };

  const handleAddFlat = () => {
    if (selectedWing && selectedFlat) {
      const flatString = `${selectedWing}-${selectedFlat}`;
      if (!selectedWings.includes(flatString)) {
        setSelectedWings(prev => [...prev, flatString]);
        setIsDirty(true);
      }
      setIsModalOpen(false);
      setSelectedWing('A');
      setSelectedFlat('');
    }
  };

  const handleServiceSelect = (service) => {
    setFormData(prev => ({ ...prev, service }));
    setShowServiceDropdown(false);
    setIsDirty(true);
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
        onClick={() => handleDownloadDocument(existingDoc.fileUrl, existingDoc.fileName)} className="relative flex items-center gap-3 p-3 bg-white border border-[#E5E7EB] rounded-lg w-[316px] cursor-pointer">
          <div className={`h-12 w-12 rounded flex items-center justify-center text-white font-medium
            ${getFileIcon(existingDoc.fileName) === 'PDF' ? 'bg-red-500' : 
              getFileIcon(existingDoc.fileName) === 'IMG' ? 'bg-blue-500' : 'bg-gray-500'}`}>
            {getFileIcon(existingDoc.fileName)}
          </div>
          <div className="flex-1">
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
    <div className="p-8 ml-6">
      {/* Back Button */}
      <div className="mb-8 w-[80px]" style={{
        // border:'1px solid red'
      }}>
        <div className="flex items-center gap-2 text-[#6B7280] cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-7 w-7 bg-[#F3F4F6] p-1.5 rounded" />
          <span className="text-base font-medium">Back</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.8fr,0.8fr] gap-8">
        {/* Left Side - Helper Information */}
        <div className="bg-white rounded-[24px] p-10" style={{
            borderRadius: 12,
            border: '1px solid var(--Gray-100, #E5E7EB)'
        }}>
          <h2 className="text-[16px] text-[#121212] font-medium mb-8">Helper Information</h2>
          
          <div className="space-y-8">
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
            <div className="grid grid-cols-2 gap-6">
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
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[12px] text-[#6B7280] block">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  style={{fontSize:16}}
                  onChange={handleInputChange}
                  className="w-full px-4 h-[45px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#4B5563] text-base outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] text-[#6B7280] block">Flat no.</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsModalOpen(true)}
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
                  {selectedWings.map((wing) => (
                    <div
                      key={wing}
                      style={{borderRadius:20, border:'1px solid #E5E5E5'}}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#F9FAFB] rounded text-sm border border-[#E5E7EB]"
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
                    className="text-blue-500 text-end text-sm hover:text-blue-600"
                  >
                    Add More
                  </button>
                </div>
              </div>
            </div>

            {/* Document Type and Service */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5 dropdown-container relative">
                <label className="text-[12px] text-[#6B7280] block">Document Type</label>
                <button 
                  onClick={() => setShowDocumentDropdown(!showDocumentDropdown)}
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
                       
                        onClick={() => handleDocumentTypeSelect(type.name)}
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
                  onClick={() => setShowServiceDropdown(!showServiceDropdown)}
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
                        onClick={() => handleServiceSelect(service)}
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

          <button 
            onClick={handleUpdateProfile}
            style={{fontSize:16, borderRadius:8}}
            className={`w-full py-4 rounded-2xl transition-colors  ${
              isDirty 
                ? 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-300' 
                : 'text-[#E23744] border border-red-300 hover:bg-red-100' 
            }`}
          >
            {isDirty ? 'Update Profile' : 'Delete Profile'}
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
                    onChange={(e) => setSelectedWing(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-[#4B5563] appearance-none"
                  >
                    <option value="" disabled>Wing</option>
                    {WING_DATA.map((wing) => (
                      <option key={wing.value} value={wing.value}>
                        {wing.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <select
                    value={selectedFlat}
                    onChange={(e) => setSelectedFlat(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-[#4B5563] appearance-none"
                  >
                    <option value="" disabled>Flat No.</option>
                    {selectedWing && FLAT_DATA[selectedWing].map((flat) => (
                      <option key={flat} value={flat}>
                        {flat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedWings.length > 0 && (
                <div className="mt-4 p-4 bg-[#F9FAFB] rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {selectedWings.map((wing) => (
                      <div
                        key={wing}
                        className="flex items-center gap-1 px-3 py-1.5 bg-white rounded text-sm border border-[#E5E7EB]"
                      >
                        {wing}
                        <X 
                          size={14} 
                          className="text-gray-400 cursor-pointer ml-1" 
                          onClick={() => handleRemoveWing(wing)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleAddFlat}
                disabled={!selectedWing || !selectedFlat}
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

export default HelperProfile;