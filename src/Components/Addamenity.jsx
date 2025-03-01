import React, { useCallback, useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { createAmenity, updateAmenity } from '../firebase/services/amenityService';
import { toast } from 'react-toastify';
// import { useState, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const AmenityDetailsForm = () => {
 

  // Validation state
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
const navigate = useNavigate();
const location = useLocation();
const { state } = location;
const isEditing = Boolean(state?.amenityData);
const {  amenityId } = location.state || {};
const amenityData = state?.amenityData || {};



 // Form state
 // Form state initialized with existing data if editing
 const [formData, setFormData] = useState({
    heading: amenityData?.heading || '',
    location: amenityData?.location || '',
    about: amenityData?.about || '',
    startTime: amenityData?.timeSlots?.startTime || '09:00', // Default to 9 AM
    endTime: amenityData?.timeSlots?.endTime || '17:00', // Default to 5 PM
    isDisabled: amenityData?.isDisabled || false,
    timeSlot: amenityData?.timeSlots?.slotDuration || '',  // Changed from timeSlots.slotDuration
    media: null
  });

 // Initialize images from amenityData if editing
 useEffect(() => {
    if (isEditing && amenityData?.imageUrls) {
      setImages(amenityData.imageUrls.map((imageData, index) => ({
        id: index,
        preview: imageData.url,
        file: null,
        fileName: imageData.fileName,
        uploadedAt: imageData.uploadedAt
      })));
    }
  }, [isEditing, amenityData]);

  const handleImageUpload = useCallback((event, index = null) => {
    const file = event.target.files[0];
    if (file) {
      const newImage = {
        id: Date.now().toString(),
        file: file,
        preview: URL.createObjectURL(file),
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        isNew: true
      };
      
      setImages(prevImages => {
        if (index !== null) {
          const updatedImages = [...prevImages];
          updatedImages[index] = newImage;
          return updatedImages;
        } else {
          return [...prevImages, newImage];
        }
      });
    }
  }, []);


   // Generate time options in 30-minute intervals
  // Generate time options in 30-minute intervals
  const generateTimeOptions = (startTime = null) => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Skip times before or equal to startTime if it's provided
        if (startTime && time24 <= startTime) {
          continue;
        }
        
        const hour12 = hour % 12 || 12;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const label = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
        options.push({ value: time24, label });
      }
    }
    return options;
  };

   // Generate all time options for start time
   const startTimeOptions = generateTimeOptions();
  
   // Generate end time options based on selected start time
   const endTimeOptions = generateTimeOptions(formData.startTime);
 

   // Function to convert 24-hour format to 12-hour format with AM/PM
   const formatTimeWithAMPM = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Function to get display time for labels
  const getTimeDisplay = (time24) => {
    return formatTimeWithAMPM(time24);
  };

   // Time slot options with additional durations
   const timeSlotOptions = [
    { value: "1", label: "1 hour" },
    { value: "1.5", label: "1.5 hours" },
    { value: "2", label: "2 hours" },
    { value: "3", label: "3 hours" },
    { value: "4", label: "4 hours" },
    { value: "5", label: "5 hours" }
  ];

   // Add styles for the select options
   const getSelectClassName = () => `
   select {
     height: 48px;
   }
   select option {
     padding: 8px;
     font-size: 14px;
   }
   /* This targets Webkit browsers (Chrome, Safari) */
   select::-webkit-scrollbar {
     width: 8px;
   }
   select::-webkit-scrollbar-track {
     background: #f1f1f1;
   }
   select::-webkit-scrollbar-thumb {
     background: #888;
     border-radius: 4px;
   }
   /* This limits the height of the dropdown */
   select[multiple], select[size] {
     max-height: 200px;
   }
 `;

  const handleImageDelete = useCallback((index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  }, []);

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text'));
    const newImages = [...images];
    const [removed] = newImages.splice(dragIndex, 1);
    newImages.splice(dropIndex, 0, removed);
    setImages(newImages);
  };

   // Updated Time Card JSX
   const TimeCard = () => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 style={sectionTitleStyle}>Operating Hours</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Opening Time</label>
          <div className="relative">
            <select
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              style={selectStyle}
              className="appearance-none cursor-pointer pr-10"
            >
              {startTimeOptions.map(({ value, label }) => (
                <option key={`start-${value}`} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label style={labelStyle}>Closing Time</label>
          <div className="relative">
            <select
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              style={inputStyle}
              className="appearance-none cursor-pointer pr-10"
              disabled={!formData.startTime}
            >
              <option value="">Select end time</option>
              {endTimeOptions.map(({ value, label }) => (
                <option key={`end-${value}`} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Updated Time Slots Card JSX
  const TimeSlotsCard = () => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 style={sectionTitleStyle}>Select time slots</h2>
      <div className="relative">
        <select
          name="timeSlot"
          value={formData.timeSlot}
          onChange={handleInputChange}
          style={inputStyle}
          className="appearance-none cursor-pointer"
        >
          <option value="">Select slot duration</option>
          {timeSlotOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
          <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );



  // Styles from your construction component
  const imageContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    marginTop: '16px'
  };

  const imageWrapperStyle = {
    position: 'relative',
    width: '100px',
    height: '100px',
    borderRadius: '8px',
    overflow: 'hidden'
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    cursor: 'pointer'
  };

  const deleteIconStyle = {
    position: 'absolute',
    top: '4px',
    right: '4px',
    background: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '50%',
    padding: '2px',
    cursor: 'pointer'
  };

  const addImageStyle = {
    width: '100px',
    height: '100px',
    borderRadius: '8px',
    background: '#F3F4F6',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    border: '1px dashed #D1D5DB'
  };

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

  const sectionTitleStyle = {
    color: "var(--Gray-900, #030712)",
    fontSize: "16px",
    fontWeight: "500",
    lineHeight: "28px",
    marginBottom: "24px",
    fontFamily: "Plus_Jakarta",
  };
  const selectStyle = {
    ...inputStyle,
    WebkitAppearance: "none",
    MozAppearance: "none",
    appearance: "none",
  };

  // Handle input changes with time validation
  // Handle input changes with time validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'startTime') {
      // When start time changes, reset end time if it's now invalid
      const updatedFormData = {
        ...formData,
        [name]: value
      };
      
      // If end time is now before or equal to start time, reset it
      if (formData.endTime <= value) {
        updatedFormData.endTime = '';
      }
      
      setFormData(updatedFormData);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, value);
  };


  // Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        media: file
      }));
    }
  };

  // Validation
  const validateField = (name, value) => {
    let newErrors = { ...errors };
    switch (name) {
      case 'heading':
        if (!value) newErrors.heading = 'Heading is required';
        else delete newErrors.heading;
        break;
      case 'location':
        if (!value) newErrors.location = 'Location is required';
        else delete newErrors.location;
        break;
      case 'about':
        if (!value) newErrors.about = 'Description is required';
        else delete newErrors.about;
        break;
      case 'timeSlot':
        if (!value) newErrors.timeSlot = 'Time slot is required';
        else delete newErrors.timeSlot;
        break;
      case 'startTime':
        if (!value) newErrors.startTime = 'Start time is required';
        else delete newErrors.startTime;
        break;
      case 'endTime':
        if (!value) newErrors.endTime = 'End time is required';
        else delete newErrors.endTime;
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  // Form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Touch all fields for validation
//     const allFields = ['heading', 'location', 'about', 'timeSlot'];
//     const touchedFields = allFields.reduce((acc, field) => ({
//       ...acc,
//       [field]: true
//     }), {});
//     setTouched(touchedFields);

//     // Validate all fields
//     allFields.forEach(field => validateField(field, formData[field]));

//     // Additional validation for images
//     if (images.length === 0) {
//       setErrors(prev => ({
//         ...prev,
//         images: 'At least one image is required'
//       }));
//       toast.error('Please add at least one image');
//       return;
//     }

//     if (Object.keys(errors).length > 0) {
//       toast.error('Please fill in all required fields correctly');
//       return;
//     }

//     try {
//       setIsLoading(true);

//       const amenityData = {
//         heading: formData.heading,
//         location: formData.location,
//         about: formData.about,
//         startTime: formData.startTime,
//         endTime: formData.endTime,
//         timeSlot: formData.timeSlot,
//         isDisabled: formData.isDisabled
//       };

//       let result;
//       if (isEditing && amenityId) {
//         result = await updateAmenity(amenityId, amenityData, images);
//       } else {
//         result = await createAmenity(amenityData, images);
//       }

//       if (result.success) {
//         toast.success(`Amenity ${isEditing ? 'updated' : 'created'} successfully`);
//         navigate('/Facility'); // Make sure this route exists in your router
//       } else {
//         throw new Error(result.error || 'Operation failed');
//       }
//     } catch (error) {
//       console.error('Error submitting amenity:', error);
//       toast.error(error.message || 'Failed to submit amenity');
//     } finally {
//       setIsLoading(false);
//     }
//   };
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate all required fields
  if (!formData.startTime || !formData.endTime || !formData.timeSlot) {
    toast.error('Please complete all time slot fields');
    return;
  }

  if (!formData.heading || !formData.location || !formData.about) {
    toast.error('Please fill in all required fields');
    return;
  }

  if (images.length === 0) {
    toast.error('Please add at least one image');
    return;
  }

  try {
    setIsLoading(true);

    const amenityData = {
      heading: formData.heading.trim(),
      location: formData.location.trim(),
      about: formData.about.trim(),
      timeSlots: {
        startTime: formData.startTime,
        endTime: formData.endTime,
        slotDuration: formData.timeSlot
      },
      isDisabled: formData.isDisabled
    };

    const processedImages = images.map(image => {
      if (image.isNew) {
        return {
          file: image.file,
          fileName: image.fileName,
          uploadedAt: image.uploadedAt
        };
      } else {
        return {
          url: image.preview || image.url,
          fileName: image.fileName,
          uploadedAt: image.uploadedAt
        };
      }
    });

    let result;
    if (isEditing) {
      result = await updateAmenity(state.amenityData.id, amenityData, processedImages);
    } else {
      result = await createAmenity(amenityData, processedImages);
    }

    if (result.success) {
      toast.success(`Amenity ${isEditing ? 'updated' : 'created'} successfully`);
      navigate('/Facility');
    } else {
      throw new Error(result.error || 'Operation failed');
    }
  } catch (error) {
    console.error('Error submitting amenity:', error);
    toast.error(error.message || 'Failed to submit amenity');
  } finally {
    setIsLoading(false);
  }
};
  const submitButton = (
    <button 
      type="submit"
      disabled={isLoading}
      className={`w-full ${isLoading ? 'bg-gray-400' : 'bg-[#0F172A] hover:bg-[#1E293B]'} 
        text-white h-12 rounded-lg transition-colors font-medium`}
      style={{ fontFamily: "Plus_Jakarta" }}
    >
      {isLoading ? 'Processing...' : isEditing ? 'Update Amenity' : 'Add Amenity'}
    </button>
  );

  return (
    <div className="container mx-auto p-2 lg:ml-6">
      {/* Header with Back Button */}
      <style>{getSelectClassName()}</style>
      <div className="mb-8">
        <Link to="/Facility" className="flex items-center text-gray-600 mb-6 cursor-pointer">
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

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            {/* Heading Input */}
            <div className="mb-6">
              <label style={labelStyle}>Heading</label>
              <input
                type="text"
                name="heading"
                style={inputStyle}
                value={formData.heading}
                onChange={handleInputChange}
                placeholder="Enter amenity name"
              />
              {touched.heading && errors.heading && (
                <p className="text-red-500 text-xs mt-1">{errors.heading}</p>
              )}
            </div>

            {/* Location Input */}
            <div className="mb-6">
              <label style={labelStyle}>Location</label>
              <input
                type="text"
                name="location"
                style={inputStyle}
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter location"
              />
              {touched.location && errors.location && (
                <p className="text-red-500 text-xs mt-1">{errors.location}</p>
              )}
            </div>

            {/* About Input */}
            <div className="mb-6">
              <label style={labelStyle}>About</label>
              <textarea
                name="about"
                style={{...inputStyle, height: '120px', resize: 'none'}}
                value={formData.about}
                onChange={handleInputChange}
                placeholder="Enter description"
              />
              {touched.about && errors.about && (
                <p className="text-red-500 text-xs mt-1">{errors.about}</p>
              )}
            </div>

            {/* Media Upload */}
            <div>
                <h2 className="text-base font-medium text-gray-900 mb-4">Media</h2>
                <div style={imageContainerStyle}>
                  {images.map((image, index) => (
                    <div
                      key={image.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      style={imageWrapperStyle}
                    >
                      <img 
                        src={image.preview} 
                        alt={`Uploaded ${index}`} 
                        style={imageStyle}
                        onClick={() => document.getElementById(`changeImage-${index}`).click()}
                      />
                      <svg
                        style={deleteIconStyle}
                        onClick={() => handleImageDelete(index)}
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M18 6L6 18" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6 6L18 18" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <input
                        id={`changeImage-${index}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, index)}
                        style={{ display: 'none' }}
                      />
                    </div>
                  ))}
                  
                  {/* Add Image Button */}
                  <label htmlFor="imageUpload" style={addImageStyle}>
                    <svg 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        d="M12 5V19M5 12H19" 
                        stroke="#6B7280" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </label>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e)}
                    style={{ display: 'none' }}
                  />
                </div>
          </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:col-span-1 space-y-6">
          {/* Time Card */}
          {/* <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 style={sectionTitleStyle}>Time</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  style={inputStyle}
                  value={formData.startTime}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label style={labelStyle}>End Time</label>
                <input
                  type="time"
                  name="endTime"
                  style={inputStyle}
                  value={formData.endTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div> */}
           <TimeCard />
          

          {/* Disable Booking Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <span style={labelStyle}>Disable Booking</span>
              <div 
                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${formData.isDisabled ? 'bg-blue-500' : 'bg-gray-200'}`}
                onClick={() => setFormData(prev => ({ ...prev, isDisabled: !prev.isDisabled }))}
              >
                <div 
                  className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${formData.isDisabled ? 'transform translate-x-6' : ''}`}
                />
              </div>
            </div>
          </div>

          {/* Time Slots Card */}
          {/* <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 style={sectionTitleStyle}>Select time slots</h2>
            <div className="relative">
              <select
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleInputChange}
                style={inputStyle}
                className="appearance-none cursor-pointer"
              >
                <option value="">Select slot</option>
                <option value="1">1 hour</option>
                <option value="2">2 hours</option>
                <option value="3">3 hours</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              {touched.timeSlot && errors.timeSlot && (
                <p className="text-red-500 text-xs mt-1">{errors.timeSlot}</p>
              )}
            </div>
          </div> */}
           <TimeSlotsCard />

          {/* Submit Button */}
          {/* <button 
            type="submit"
            className="w-full bg-[#0F172A] text-white h-12 rounded-lg hover:bg-[#1E293B] transition-colors font-medium"
            style={{ fontFamily: "Plus_Jakarta" }}
          >
            Add Amenity
          </button> */}
           {submitButton}
        </div>
      </form>
    </div>
  );
};

export default AmenityDetailsForm;