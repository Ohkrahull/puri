// import React, { useCallback, useState } from 'react';
// import { ChevronLeft } from 'lucide-react';
// import { Link, useNavigate } from 'react-router-dom';
// import { collection, addDoc, getFirestore, serverTimestamp } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';
// import { toast } from 'react-toastify';
// import { getApp } from 'firebase/app';

// const NoticeForm = () => {
//   const db = getFirestore(getApp());
//   const storage = getStorage();
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     heading: '',
//     description: '',
//     category: '',
//     isPinned: false,
//     attachmentUrl: '',
//     attachmentName: ''
//   });
//   const [images, setImages] = useState([]);
//   const categories = ['Security', 'Maintenance', 'Services', 'Event'];

//   const inputStyle = {
//     width: "100%",
//     padding: "14px",
//     border: "1px solid var(--Gray-200, #E5E7EB)",
//     borderRadius: "8px",
//     backgroundColor: "var(--Gray-50, #F9FAFB)",
//     color: "var(--Gray-500, #4B5563)",
//     fontSize: "14px",
//     fontFamily: "Plus_Jakarta",
//     height: "48px",
//     outline: "none",
//   };

//   const labelStyle = {
//     color: "var(--Gray-900, #030712)",
//     fontSize: "14px",
//     fontWeight: "500",
//     lineHeight: "20px",
//     marginBottom: "6px",
//     display: "block",
//     fontFamily: "Plus_Jakarta",
//   };

//   const handleImageUpload = useCallback((event) => {
//     const file = event.target.files[0];
//     if (file && file.size <= 5 * 1024 * 1024) {
//       const newImage = {
//         id: Date.now().toString(),
//         file,
//         preview: URL.createObjectURL(file)
//       };
//       setImages(prev => [...prev, newImage]);
//     } else {
//       toast.error('File size should be less than 5MB');
//     }
//   }, []);

//   const handleImageDelete = useCallback((index) => {
//     setImages(prev => prev.filter((_, i) => i !== index));
//   }, []);

//   const handleFileUpload = async (event) => {
//     const file = event.target.files[0];
//     if (file && file.size <= 5 * 1024 * 1024) {
//       setFormData(prev => ({
//         ...prev,
//         attachmentName: file.name
//       }));
      
//       try {
//         const storageRef = ref(storage, `attachments/${Date.now()}_${file.name}`);
//         await uploadBytes(storageRef, file);
//         const downloadURL = await getDownloadURL(storageRef);
        
//         setFormData(prev => ({
//           ...prev,
//           attachmentUrl: downloadURL
//         }));
        
//         toast.success('File uploaded successfully');
//       } catch (error) {
//         console.error('Error uploading file:', error);
//         toast.error('Failed to upload file');
//       }
//     } else {
//       toast.error('File size should be less than 5MB');
//     }
//   };

//   const handleSubmit = async (isPinned = false) => {
//     if (!formData.heading || !formData.description || !formData.category) {
//       toast.error('Please fill in all required fields');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const imageUrls = await Promise.all(
//         images.map(async (image) => {
//           const storageRef = ref(storage, `notices/${Date.now()}_${image.file.name}`);
//           await uploadBytes(storageRef, image.file);
//           const url = await getDownloadURL(storageRef);
//           return {
//             url,
//             fileName: image.file.name,
//             uploadedAt: new Date().toISOString()
//           };
//         })
//       );

//       const noticeData = {
//         ...formData,
//         isPinned,
//         imageUrls,
//         createdAt: serverTimestamp()
//       };

//       await addDoc(collection(db, 'notices'), noticeData);
//       toast.success('Notice created successfully');
//       navigate('/notices');
//     } catch (error) {
//       console.error('Error creating notice:', error);
//       toast.error('Failed to create notice');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <div className="mb-8">
//         <Link to="/notices" className="flex items-center text-gray-600 mb-6">
//           <ChevronLeft
//             size={30}
//             style={{ backgroundColor: "#F3F3F3", borderRadius: 4 }}
//             className="p-2"
//           />
//           <span className="ml-2" style={{ fontSize: 16, color: "#6B7280" }}>
//             Back
//           </span>
//         </Link>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//             <div className="mb-6">
//               <label style={labelStyle}>Heading</label>
//               <input
//                 type="text"
//                 name="heading"
//                 style={inputStyle}
//                 value={formData.heading}
//                 onChange={(e) => setFormData(prev => ({...prev, heading: e.target.value}))}
//                 placeholder="Enter heading"
//               />
//             </div>

//             <div className="mb-6">
//               <label style={labelStyle}>Sub Text</label>
//               <textarea
//                 name="description"
//                 style={{...inputStyle, height: '120px', resize: 'none'}}
//                 value={formData.description}
//                 onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
//                 placeholder="Enter description"
//               />
//             </div>

//             <div className="mb-6">
//               <label style={labelStyle}>Media</label>
//               <div className="flex flex-wrap gap-4">
//                 {images.map((image, index) => (
//                   <div key={image.id} className="relative w-24 h-24">
//                     <img
//                       src={image.preview}
//                       alt="Upload preview"
//                       className="w-full h-full object-cover rounded-lg"
//                     />
//                     <button
//                       onClick={() => handleImageDelete(index)}
//                       className="absolute top-1 right-1 bg-white rounded-full p-1"
//                     >
//                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                         <path d="M18 6L6 18M6 6L18 18" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
//                       </svg>
//                     </button>
//                   </div>
//                 ))}
//                 <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer">
//                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//                     <path d="M12 5V19M5 12H19" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
//                   </svg>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                     className="hidden"
//                   />
//                 </label>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="lg:col-span-1">
//           <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
//             <label style={labelStyle}>Choose Category</label>
//             <select
//               name="category"
//               value={formData.category}
//               onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
//               style={inputStyle}
//               className="appearance-none w-full"
//             >
//               <option value="">Select Category</option>
//               {categories.map(category => (
//                 <option key={category} value={category}>{category}</option>
//               ))}
//             </select>
//           </div>

//           <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
//             <label style={labelStyle}>Upload (option)</label>
//             <label className="block">
//               <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer">
//                 <div className="flex justify-center mb-2">
//                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//                     <path d="M12 5V19M5 12H19" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
//                   </svg>
//                 </div>
//                 <p className="text-sm font-medium">
//                   {formData.attachmentName || 'Upload a file or drag and drop'}
//                 </p>
//                 <p className="text-xs text-gray-500">PNG, JPG, PDF upto 5MB</p>
//                 <input
//                   type="file"
//                   accept=".png,.jpg,.jpeg,.pdf"
//                   onChange={handleFileUpload}
//                   className="hidden"
//                 />
//               </div>
//             </label>
//           </div>

//           <button 
//             onClick={() => handleSubmit(false)}
//             disabled={isLoading}
//             className="w-full bg-[#0F172A] text-white h-12 rounded-lg hover:bg-[#1E293B] transition-colors font-medium mb-4 disabled:bg-gray-400"
//           >
//             {isLoading ? 'Processing...' : 'Send Notice'}
//           </button>

//           <button
//             onClick={() => handleSubmit(true)}
//             disabled={isLoading}
//             className="w-full bg-white text-[#0F172A] h-12 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors font-medium disabled:bg-gray-100"
//           >
//             Pin Notice
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NoticeForm;

import React, { useCallback, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { collection, addDoc, getFirestore, serverTimestamp, doc, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';
import { toast } from 'react-toastify';
import { getApp } from 'firebase/app';

const NoticeForm = () => {
  const db = getFirestore(getApp());
  const storage = getStorage();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const isEditing = Boolean(state?.noticeData);
  const noticeData = state?.noticeData || {};

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    heading: noticeData?.heading || '',
    description: noticeData?.description || '',
    category: noticeData?.category || '',
    isPinned: noticeData?.isPinned || false,
    attachmentUrl: noticeData?.attachmentUrl || '',
    attachmentName: noticeData?.attachmentName || ''
  });
  const [images, setImages] = useState(
    isEditing && noticeData?.imageUrls ? 
    noticeData.imageUrls.map((imageData, index) => ({
      id: index,
      preview: imageData.url,
      file: null,
      fileName: imageData.fileName,
      uploadedAt: imageData.uploadedAt,
      isExisting: true
    })) : []
  );

  const categories = ['Security', 'Maintenance', 'Services', 'Event','Emergency','Other'];

  const inputStyle = {
    width: "100%",
    padding: "14px",
    border: "1px solid var(--Gray-200, #E5E7EB)",
    borderRadius: "8px",
    backgroundColor: "var(--Gray-50, #F9FAFB)",
    color: "var(--Gray-500, #4B5563)",
    fontSize: "14px",
    fontFamily: "Plus_Jakarta",
    height: "48px",
    outline: "none",
  };

  const labelStyle = {
    color: "var(--Gray-900, #030712)",
    fontSize: "14px",
    fontWeight: "500",
    lineHeight: "20px",
    marginBottom: "6px",
    display: "block",
    fontFamily: "Plus_Jakarta",
  };

  // const handleImageUpload = useCallback((event) => {
  //   const file = event.target.files[0];
  //   if (file && file.size <= 5 * 1024 * 1024) {
  //     const newImage = {
  //       id: Date.now().toString(),
  //       file,
  //       preview: URL.createObjectURL(file),
  //       fileName: file.name,
  //       uploadedAt: new Date().toISOString(),
  //       isNew: true
  //     };
  //     setImages(prev => [...prev, newImage]);
  //   } else {
  //     toast.error('File size should be less than 5MB');
  //   }
  // }, []);
  const handleImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    
    // Check if maximum image limit is reached
    if (images.length >= 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
  
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file?.type)) {
      toast.error('Only JPG, JPEG and PNG files are allowed');
      return;
    }
  
    if (file && file.size <= 5 * 1024 * 1024) {
      const newImage = {
        id: Date.now().toString(),
        file,
        preview: URL.createObjectURL(file),
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        isNew: true
      };
      setImages(prev => [...prev, newImage]);
    } else {
      toast.error('File size should be less than 5MB');
    }
  }, [images]);

  const handleImageDelete = useCallback((index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setFormData(prev => ({
        ...prev,
        attachmentName: file.name
      }));
      
      try {
        const storageRef = ref(storage, `attachments/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        
        setFormData(prev => ({
          ...prev,
          attachmentUrl: downloadURL
        }));
        
        toast.success('File uploaded successfully');
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error('Failed to upload file');
      }
    } else {
      toast.error('File size should be less than 5MB');
    }
  };

  const handleSubmit = async (isPinned = formData.isPinned) => {
    if (!formData.heading || !formData.description || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }
  
    setIsLoading(true);
    try {
      const processedImages = await Promise.all(
        images.map(async (image) => {
          if (image.isExisting) {
            return {
              url: image.preview,
              fileName: image.fileName,
              uploadedAt: image.uploadedAt
            };
          }
          const storageRef = ref(storage, `notices/${Date.now()}_${image.file.name}`);
          await uploadBytes(storageRef, image.file);
          const url = await getDownloadURL(storageRef);
          return {
            url,
            fileName: image.file.name,
            uploadedAt: new Date().toISOString()
          };
        })
      );
  
      // If trying to pin this notice, unpin all others first
      if (isPinned) {
        const noticesRef = collection(db, "notices");
        const pinnedNotices = await getDocs(query(noticesRef, where("isPinned", "==", true)));
        
        // Unpin all existing pinned notices
        const unpinPromises = pinnedNotices.docs.map(doc => 
          updateDoc(doc.ref, { isPinned: false })
        );
        await Promise.all(unpinPromises);
      }
  
      const noticeFormData = {
        ...formData,
        isPinned,
        imageUrls: processedImages,
        createdAt: serverTimestamp()
      };
  
      if (isEditing) {
        await updateDoc(doc(db, "notices", noticeData.id), noticeFormData);
        toast.success('Notice updated successfully');
      } else {
        await addDoc(collection(db, 'notices'), noticeFormData);
        toast.success('Notice created successfully');
      }
      
      navigate('/notices');
    } catch (error) {
      console.error('Error submitting notice:', error);
      toast.error('Failed to submit notice');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto lg:ml-4 lg:p-4">
      <div className="mb-8">
        <Link to="/notices" className="flex items-center text-gray-600 mb-6">
          <ChevronLeft
            size={30}
            style={{ backgroundColor: "#F3F3F3", borderRadius: 4 }}
            className="p-2"
          />
          <span className="ml-2" style={{ fontSize: 16, color: "#6B7280" }}>
            Back
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="mb-6">
              <label style={labelStyle}>Heading</label>
              <input
                type="text"
                name="heading"
                style={inputStyle}
                value={formData.heading}
                onChange={(e) => setFormData(prev => ({...prev, heading: e.target.value}))}
                placeholder="Enter heading"
              />
            </div>

            <div className="mb-6">
              <label style={labelStyle}>Sub Text</label>
              <textarea
                name="description"
                style={{...inputStyle, height: '120px', resize: 'none'}}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                placeholder="Enter description"
              />
            </div>

            {/* <div className="mb-6">
              <label style={labelStyle}>Media</label>
              <div className="flex flex-wrap gap-4">
                {images.map((image, index) => (
                  <div key={image.id} className="relative w-24 h-24">
                    <img
                      src={image.preview}
                      alt="Upload preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleImageDelete(index)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                ))}
                <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19M5 12H19" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div> */}
            <div className="mb-6">
  <label style={labelStyle}>Media</label>
  <div className="flex flex-wrap gap-4">
    {images.map((image, index) => (
      <div key={image.id} className="relative w-24 h-24">
        <img
          src={image.preview}
          alt="Upload preview"
          className="w-full h-full object-cover rounded-lg"
        />
        <button
          onClick={() => handleImageDelete(index)}
          className="absolute top-1 right-1 bg-white rounded-full p-1"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    ))}
    {images.length < 5 && (
      <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5V19M5 12H19" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        {/* <div className="mt-2 text-center">
          <p className="text-xs text-gray-500">
            {`${5 - images.length} remaining`}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            JPG, PNG
          </p>
          <p className="text-xs text-gray-500">
            Max 5MB
          </p>
        </div> */}
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleImageUpload}
          className="hidden"
        />
      </label>
    )}
  </div>
  <p className="text-sm  text-gray-500 mt-6">
    Upload up to 5 images (JPG, PNG - max 5MB each)
  </p>
</div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <label style={labelStyle}>Choose Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
              style={inputStyle}
              className="appearance-none w-full"
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <label style={labelStyle}>Upload (option)</label>
            <label className="block">
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer">
                <div className="flex justify-center mb-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19M5 12H19" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className="text-sm font-medium">
                  {formData.attachmentName || 'Upload a file or drag and drop'}
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, PDF upto 5MB</p>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </label>
          </div>

          <button 
            onClick={() => handleSubmit(formData.isPinned)}
            disabled={isLoading}
            className="w-full bg-[#0F172A] text-white h-12 rounded-lg hover:bg-[#1E293B] transition-colors font-medium mb-4 disabled:bg-gray-400"
          >
            {isLoading ? 'Processing...' : (isEditing ? 'Update Notice' : 'Send Notice')}
          </button>

          <button
            onClick={() => handleSubmit(!formData.isPinned)}
            disabled={isLoading}
            className="w-full bg-white text-[#0F172A] h-12 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors font-medium disabled:bg-gray-100"
          >
            {isEditing ? (formData.isPinned ? 'Unpin Notice' : 'Pin Notice') : 'Pin Notice'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticeForm;