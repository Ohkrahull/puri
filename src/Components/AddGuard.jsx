// import React, { useState, useEffect, useRef } from 'react';
// import { ChevronDown, ChevronLeft, X, Upload, EyeOff } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { collection, addDoc, getFirestore, query, where, getDocs } from 'firebase/firestore';
// import { getApp } from 'firebase/app';
// import { toast } from 'react-toastify';
// import { Eye, FolderOpen, Image } from 'phosphor-react';
// import { useAuth } from '../context/AuthContext';

// const DOCUMENT_TYPES = [
//   { name: 'Aadhar Card', type: 'Identification Proof' },
//   { name: 'PAN Card', type: 'Identification Proof' },
//   { name: 'Driving License', type: 'Identification Proof' },
//   { name: 'Ration Card', type: 'Address Proof' },
// ];

// const generateEmployeeId = () => {
//   return Math.floor(1000 + Math.random() * 9000).toString();
// };

// const checkEmployeeIdExists = async (db, employeeId) => {
//   const guardsRef = collection(db, 'guardUser');
//   const q = query(guardsRef, where('employeeId', '==', employeeId));
//   const querySnapshot = await getDocs(q);
//   return !querySnapshot.empty;
// };

// const generateUniqueEmployeeId = async (db) => {
//   let employeeId;
//   let exists = true;
  
//   while (exists) {
//     employeeId = generateEmployeeId();
//     exists = await checkEmployeeIdExists(db, employeeId);
//   }
  
//   return employeeId;
// };

// const GuardRegistrationForm = () => {
//   const navigate = useNavigate();
//   const storage = getStorage(getApp());
//   const db = getFirestore(getApp());
//   const { user, loading } = useAuth();
//   const dropdownRef = useRef(null);

//   const [showDocumentDropdown, setShowDocumentDropdown] = useState(false);
//   const [dropdownPosition, setDropdownPosition] = useState('bottom');
//   const [isUploading, setIsUploading] = useState(false);
//   const [documentFile, setDocumentFile] = useState(null);
//   const [isDocumentUploading, setIsDocumentUploading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [passwordsMatch, setPasswordsMatch] = useState(true);

//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     guardPhoneNumber: '',
//     password: '',
//     confirmPassword: '',
//     documentType: 'Aadhar Card',
//     imageUrl: '',
//     documents: []
//   });

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDocumentDropdown(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleDropdownToggle = (dropdownSetter, currentState) => {
//     const rect = dropdownRef.current?.getBoundingClientRect();
//     if (rect) {
//       const spaceBelow = window.innerHeight - rect.bottom;
//       const spaceAbove = rect.top;
//       setDropdownPosition(spaceBelow < 200 && spaceAbove > 200 ? 'top' : 'bottom');
//     }
//     dropdownSetter(!currentState);
//   };

//   useEffect(() => {
//     if (formData.confirmPassword) {
//       setPasswordsMatch(formData.password === formData.confirmPassword);
//     }
//   }, [formData.password, formData.confirmPassword]);

//   const handleProfileImageUpload = async (event) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     try {
//       setIsUploading(true);
//       const timestamp = new Date().getTime();
//       const storageRef = ref(storage, `guards/profiles/${timestamp}_${file.name}`);
//       const uploadTask = await uploadBytes(storageRef, file);
//       const downloadURL = await getDownloadURL(uploadTask.ref);
      
//       setFormData(prev => ({ ...prev, imageUrl: downloadURL }));
//       toast.success('Profile image uploaded successfully');
//     } catch (error) {
//       console.error('Error uploading profile image:', error);
//       toast.error('Failed to upload profile image');
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleDocumentUpload = async (file) => {
//     if (!file || !formData.documentType) return;

//     try {
//       setIsDocumentUploading(true);
//       const timestamp = new Date().getTime();
//       const storageRef = ref(storage, `guards/documents/${timestamp}_${file.name}`);
//       const uploadTask = await uploadBytes(storageRef, file);
//       const downloadURL = await getDownloadURL(uploadTask.ref);

//       const newDocument = {
//         documentName: formData.documentType,
//         documentType: DOCUMENT_TYPES.find(doc => doc.name === formData.documentType)?.type || 'Other',
//         fileName: file.name,
//         fileUrl: downloadURL
//       };

//       setFormData(prev => ({
//         ...prev,
//         documents: [...prev.documents.filter(doc => doc.documentName !== formData.documentType), newDocument]
//       }));
//       setDocumentFile(file);
//       toast.success('Document uploaded successfully');
//     } catch (error) {
//       console.error('Error uploading document:', error);
//       toast.error('Failed to upload document');
//     } finally {
//       setIsDocumentUploading(false);
//     }
//   };

//  const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     // Check password match when either password field changes
//     if (name === 'password' || name === 'confirmPassword') {
//       const otherPassword = name === 'password' ? formData.confirmPassword : formData.password;
//       setPasswordsMatch(value === otherPassword);
//     }
//   };

//   const validateForm = () => {
//     if (!formData.firstName || !formData.lastName || !formData.email || 
//         !formData.guardPhoneNumber || !formData.password || !formData.confirmPassword) {
//       toast.error('Please fill in all required fields');
//       return false;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       toast.error('Passwords do not match');
//       return false;
//     }

//     if (formData.password.length < 6) {
//       toast.error('Password must be at least 6 characters long');
//       return false;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       toast.error('Please enter a valid email address');
//       return false;
//     }

//     return true;
//   };

//   const handleCreateGuard = async () => {
//     try {
//       if (!validateForm()) return;

//       if (!user) {
//         toast.error('User authentication required');
//         return;
//       }

//       const employeeId = await generateUniqueEmployeeId(db);

//       const guardData = {
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         email: formData.email,
//         phoneNumber: user.phoneNumber || "",
//         guardPhoneNumber: formData.guardPhoneNumber,
//         password: formData.password,
//         employeeId: employeeId,
//         imageUrl: formData.imageUrl,
//         documentType: formData.documentType,
//         documents: formData.documents,
//         createdAt: new Date(),
//         status: 'approved'
//       };

//       await addDoc(collection(db, 'guardUser'), guardData);
//       toast.success('Guard registered successfully');
//       navigate(-1);
//     } catch (error) {
//       console.error('Error registering guard:', error);
//       toast.error('Failed to register guard');
//     }
//   };

//   const getFileIcon = (fileName) => {
//     const extension = fileName?.split('.').pop().toLowerCase();
//     switch(extension) {
//       case 'pdf': return 'PDF';
//       case 'jpg':
//       case 'jpeg':
//       case 'png': return 'IMG';
//       default: return 'DOC';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent"></div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="p-8 text-center">
//         <p className="text-red-500">Please log in to register guards</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-8 ml-6">
//       {/* Back Button */}
//       <div className="mb-8">
//         <div 
//           className="flex items-center gap-2 text-[#6B7280] cursor-pointer w-fit"
//           onClick={() => navigate(-1)}
//         >
//           <ChevronLeft className="h-7 w-7 bg-[#F3F4F6] p-1.5 rounded" />
//           <span className="text-base font-medium">Back</span>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-[1.8fr,0.8fr] gap-8">
//         {/* Left Side - Guard Information */}
//         <div className="bg-white rounded-[12px] p-10 border border-[#E5E7EB]">
//           <h2 className="text-[16px] text-[#121212] font-medium mb-8">Guard Information</h2>
          
//           <div className="space-y-8">
//             {/* Profile Image */}
//             <div className="mb-8">
//               <label className="text-[12px] text-[#454545] mb-2 block">Profile Image</label>
//               <div className="relative w-24 h-24">
//                 <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
//                   {formData.imageUrl ? (
//                     <img 
//                       src={formData.imageUrl}
//                       alt="Profile" 
//                       className="w-full h-full rounded-lg object-cover"
//                     />
//                   ) : (
//                     <div className="w-8 h-8 flex items-center justify-center">
//                       <Image color='#808080' size={24} weight="fill" className='opacity-1 inset-0' />
//                     </div>
//                   )}
//                 </div>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleProfileImageUpload}
//                   className="absolute inset-0 opacity-0 cursor-pointer"
//                 />
//                 {isUploading && (
//                   <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
//                     <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Name Fields */}
//             <div className="grid grid-cols-2 gap-6">
//               <div className="space-y-1.5">
//                 <label className="text-[12px] text-[#6B7280] block">First name</label>
//                 <input
//                   type="text"
//                   name="firstName"
//                   value={formData.firstName}
//                   onChange={handleInputChange}
//                   className="w-full px-4 h-[45px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#4B5563] text-base outline-none"
//                   style={{fontSize: 16}}
//                 />
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-[12px] text-[#6B7280] block">Last name</label>
//                 <input
//                   type="text"
//                   name="lastName"
//                   value={formData.lastName}
//                   onChange={handleInputChange}
//                   className="w-full px-4 h-[45px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#4B5563] text-base outline-none"
//                   style={{fontSize: 16}}
//                 />
//               </div>
//             </div>

//             {/* Email and Phone Fields */}
//             <div className="grid grid-cols-2 gap-6">
//               <div className="space-y-1.5">
//                 <label className="text-[12px] text-[#6B7280] block">Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   className="w-full px-4 h-[45px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#4B5563] text-base outline-none"
//                   style={{fontSize: 16}}
//                 />
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-[12px] text-[#6B7280] block">Phone</label>
//                 <input
//                   type="tel"
//                   name="guardPhoneNumber"
//                   value={formData.guardPhoneNumber}
//                   onChange={handleInputChange}
//                   className="w-full px-4 h-[45px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#4B5563] text-base outline-none"
//                   style={{fontSize: 16}}
//                 />
//               </div>
//             </div>

//             {/* Password Fields */}
//             <div className="grid grid-cols-2 gap-6">
//       <div className="space-y-1.5">
//         <label className="text-[12px] text-[#6B7280] block">Password</label>
//         <div className="relative">
//           <input
//             type={showPassword ? "text" : "password"}
//             name="password"
//             value={formData.password}
//             onChange={handleInputChange}
//             className="w-full px-4 h-[45px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#4B5563] text-base outline-none pr-10"
//             style={{fontSize: 16}}
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//           >
//             {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//           </button>
//         </div>
//       </div>
//       <div className="space-y-1.5">
//         <label className="text-[12px] text-[#6B7280] block">Confirm Password</label>
//         <div className="relative">
//           <input
//             type={showConfirmPassword ? "text" : "password"}
//             name="confirmPassword"
//             value={formData.confirmPassword}
//             onChange={handleInputChange}
//             className={`w-full px-4 h-[45px] bg-[#F9FAFB] border rounded-lg text-[#4B5563] text-base outline-none pr-10 ${
//               formData.confirmPassword 
//                 ? passwordsMatch 
//                   ? 'border-green-500' 
//                   : 'border-red-500'
//                 : 'border-[#E5E7EB]'
//             }`}
//             style={{fontSize: 16}}
//           />
//           <button
//             type="button"
//             onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//             className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//           >
//             {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//           </button>
//         </div>
//         {formData.confirmPassword && (
//           <p className={`text-xs ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
//             {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
//           </p>
//         )}
//       </div>
//     </div>

//             {/* Document Type Dropdown */}
//             <div ref={dropdownRef}>
//               <div className="space-y-1.5 relative">
//                 <label className="text-[12px] text-[#6B7280] block">Document Type</label>
//                 <button 
//                   onClick={() => handleDropdownToggle(setShowDocumentDropdown, showDocumentDropdown)}
//                   className="w-full px-4 h-[45px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg flex items-center justify-between text-[#4B5563]"
//                   style={{fontSize: 16}}
//                 >
//                   {formData.documentType || 'Select Document Type'}
//                   <ChevronDown size={16} />
//                 </button>
//                 {showDocumentDropdown && (
//                   <div 
//                     className={`absolute ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'} left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10`}
//                   >
//                     {DOCUMENT_TYPES.map((type) => (
//                       <button
//                         key={type.name}
//                         className="w-full px-4 py-3 text-left hover:bg-gray-50 text-[#4B5563]"
//                         onClick={() => {
//                           setFormData(prev => ({ ...prev, documentType: type.name }));
//                           setShowDocumentDropdown(false);
//                         }}
//                       >
//                         {type.name}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Document Upload */}
//         <div className="space-y-4">
//           <div className="bg-white rounded-[12px] p-6 border border-[#E5E7EB]">
//             <div className="space-y-6">
//               {formData.documentType && (
//                 <>
//                   <h3 className="text-[14px] font-medium text-[#111827]">Upload ID Proof</h3>
//                   {documentFile ? (
//                     <div className="relative flex items-center gap-3 p-3 bg-white border border-[#E5E7EB] rounded-lg w-full">
//                       <div className={`h-12 w-12 rounded flex items-center justify-center text-white font-medium
//                         ${getFileIcon(documentFile.name) === 'PDF' ? 'bg-red-500' : 'bg-blue-500'}`}
//                       >
//                         {getFileIcon(documentFile.name)}
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-[#111827] text-sm font-medium">{formData.documentType}</p>
//                         <p className="text-sm text-[#6B7280]">{documentFile.name}</p>
//                       </div>
//                       <button
//                         onClick={() => setDocumentFile(null)}
//                         className="absolute top-1 right-2 text-gray-400 hover:text-red-500"
//                       >
//                         <X size={16} />
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="bg-[#F9FAFB] rounded-lg p-7 border-2 border-dashed border-[#D1D5DB] relative">
//                       <div className="flex flex-col items-center justify-center rounded-lg">
//                         <input
//                           type="file"
//                           accept=".pdf,.jpg,.jpeg,.png"
//                           onChange={(e) => {
//                             const file = e.target.files?.[0];
//                             if (file) handleDocumentUpload(file);
//                           }}
//                           className="hidden"
//                           id="document-upload"
//                         />
//                         <label
//                           htmlFor="document-upload"
//                           className="flex flex-col items-center justify-center gap-4 cursor-pointer w-full h-full"
//                         >
//                           <div className="flex items-center justify-center">
//                             <FolderOpen className="w-6 h-6 text-gray-400" />
//                           </div>
//                           <div className="text-center">
//                             <p className="text-[14px] text-[#111827] font-medium mb-1">
//                               Upload a file or drag and drop
//                             </p>
//                             <p className="text-[14px] text-[#6B7280]">
//                               PNG, JPG, PDF upto 5MB
//                             </p>
//                           </div>
//                         </label>
//                       </div>
//                       {isDocumentUploading && (
//                         <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
//                           <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>
//           <button
//             onClick={handleCreateGuard}
//             className="w-full bg-black text-white rounded-lg py-4 text-base font-medium hover:bg-gray-900"
//           >
//             Register Guard
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GuardRegistrationForm;

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronLeft, X, Upload, EyeOff } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getFirestore, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { toast } from 'react-toastify';
import { Eye, FolderOpen, Image } from 'phosphor-react';
import { useAuth } from '../context/AuthContext';

const DOCUMENT_TYPES = [
  { name: 'Aadhar Card', type: 'Identification Proof' },
  { name: 'PAN Card', type: 'Identification Proof' },
  { name: 'Driving License', type: 'Identification Proof' },
  { name: 'Ration Card', type: 'Address Proof' },
];

const generateEmployeeId = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const checkEmployeeIdExists = async (db, employeeId) => {
  const guardsRef = collection(db, 'guardUser');
  const q = query(guardsRef, where('employeeId', '==', employeeId));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

const generateUniqueEmployeeId = async (db) => {
  let employeeId;
  let exists = true;
  
  while (exists) {
    employeeId = generateEmployeeId();
    exists = await checkEmployeeIdExists(db, employeeId);
  }
  
  return employeeId;
};

const GuardRegistrationForm = () => {
  const { id } = useParams(); // Get ID from URL if it exists
  const navigate = useNavigate();
  const storage = getStorage(getApp());
  const db = getFirestore(getApp());
  const { user, loading } = useAuth();
  const dropdownRef = useRef(null);

  const [showDocumentDropdown, setShowDocumentDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState('bottom');
  const [isUploading, setIsUploading] = useState(false);
  const [documentFile, setDocumentFile] = useState(null);
  const [isDocumentUploading, setIsDocumentUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    guardPhoneNumber: '',
    password: '',
    confirmPassword: '',
    documentType: 'Aadhar Card',
    imageUrl: '',
    documents: []
  });

  // Fetch existing guard data if ID is present
  useEffect(() => {
    const fetchGuardData = async () => {
      if (id) {
        try {
          const guardRef = doc(db, 'guardUser', id);
          const guardDoc = await getDoc(guardRef);
          
          if (guardDoc.exists()) {
            const data = guardDoc.data();
            setFormData({
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              email: data.email || '',
              guardPhoneNumber: data.guardPhoneNumber || '',
              password: data.password || '',
              confirmPassword: data.password || '',
              documentType: data.documentType || 'Aadhar Card',
              imageUrl: data.imageUrl || '',
              documents: data.documents || []
            });
            if (data.documents && data.documents.length > 0) {
              const currentDoc = data.documents[0];
              setDocumentFile({ name: currentDoc.fileName });
            }
          }
        } catch (error) {
          console.error('Error fetching guard data:', error);
          toast.error('Failed to load guard data');
        }
      }
    };

    fetchGuardData();
  }, [id, db]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDocumentDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (formData.confirmPassword) {
      setPasswordsMatch(formData.password === formData.confirmPassword);
    }
  }, [formData.password, formData.confirmPassword]);

  const handleDropdownToggle = (dropdownSetter, currentState) => {
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
      const storageRef = ref(storage, `guards/profiles/${timestamp}_${file.name}`);
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

  const handleDocumentUpload = async (file) => {
    if (!file || !formData.documentType) return;

    try {
      setIsDocumentUploading(true);
      const timestamp = new Date().getTime();
      const storageRef = ref(storage, `guards/documents/${timestamp}_${file.name}`);
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
      setIsDocumentUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password' || name === 'confirmPassword') {
      const otherPassword = name === 'password' ? formData.confirmPassword : formData.password;
      setPasswordsMatch(value === otherPassword);
    }
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.guardPhoneNumber || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all required fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;

      if (!user) {
        toast.error('User authentication required');
        return;
      }

      const guardData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: user.phoneNumber || "",
        guardPhoneNumber: formData.guardPhoneNumber,
        password: formData.password,
        imageUrl: formData.imageUrl,
        documentType: formData.documentType,
        documents: formData.documents,
        createdAt: new Date(),
        status: 'approved'
      };

      if (id) {
        // Update existing guard
        await updateDoc(doc(db, 'guardUser', id), guardData);
        toast.success('Guard updated successfully');
      } else {
        // Create new guard
        const employeeId = await generateUniqueEmployeeId(db);
        guardData.employeeId = employeeId;
        await addDoc(collection(db, 'guardUser'), guardData);
        toast.success('Guard registered successfully');
      }
      navigate(-1);
    } catch (error) {
      console.error(id ? 'Error updating guard:' : 'Error registering guard:', error);
      toast.error(id ? 'Failed to update guard' : 'Failed to register guard');
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Please log in to register guards</p>
      </div>
    );
  }
  return (
    <div className="p-2 lg:p-0 lg:ml-10">
      {/* Back Button */}
      <div className="mb-8">
        <div 
          className="flex items-center gap-2 text-[#6B7280] cursor-pointer w-fit"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-7 w-7 bg-[#F3F4F6] p-1.5 rounded" />
          <span className="text-base font-medium">Back</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.8fr,0.8fr] gap-8">
        {/* Left Side - Guard Information */}
        <div className="bg-white rounded-[12px] p-4 border border-[#E5E7EB]">
          <h2 className="text-[16px] text-[#121212] font-medium mb-8">
            {id ? 'Edit Guard Information' : 'Guard Information'}
          </h2>
          
          <div className="space-y-8">
            {/* Profile Image */}
            <div className="mb-8">
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
            <div className="grid grid-cols-2 gap-6">
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

            {/* Email and Phone Fields */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[12px] text-[#6B7280] block">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 h-[45px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#4B5563] text-base outline-none"
                  style={{fontSize: 16}}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] text-[#6B7280] block">Phone</label>
                <input
                  type="tel"
                  name="guardPhoneNumber"
                  value={formData.guardPhoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 h-[45px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#4B5563] text-base outline-none"
                  style={{fontSize: 16}}
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[12px] text-[#6B7280] block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 h-[45px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#4B5563] text-base outline-none pr-10"
                    style={{fontSize: 16}}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] text-[#6B7280] block">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 h-[45px] bg-[#F9FAFB] border rounded-lg text-[#4B5563] text-base outline-none pr-10 ${
                      formData.confirmPassword 
                        ? passwordsMatch 
                          ? 'border-green-500' 
                          : 'border-red-500'
                        : 'border-[#E5E7EB]'
                    }`}
                    style={{fontSize: 16}}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <p className={`text-xs ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
                    {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                  </p>
                )}
              </div>
            </div>

            {/* Document Type Dropdown */}
            <div ref={dropdownRef}>
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
            onClick={handleSubmit}
            className="w-full bg-black text-white rounded-lg py-4 text-base font-medium hover:bg-gray-900"
          >
            {id ? 'Update Guard' : 'Register Guard'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuardRegistrationForm;