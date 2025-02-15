import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { submitFeedback } from '../firebase/services/FeedbackService'; // Assuming you've created this service

const FeedbackEnter = ({ isOpen, onClose, onAdd, userId }) => {
    const initialFeedbackState = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        wing: 'Choose Wing',
        flatNumber: '',
        overallExperience: '',
        likeMost: '',
        areasForImprovement: '',
        facilitiesToImprove: '',
        maintenanceSatisfaction: '',
        additionalComments: ''
      };
  const [feedback, setFeedback] = useState(initialFeedbackState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      let numericValue = value.replace(/\D/g, '');
      if (numericValue.startsWith('91')) {
        numericValue = numericValue.slice(2);
      }
      numericValue = numericValue.slice(0, 10);
      const phoneWithPrefix = numericValue ? `+91${numericValue}` : '';
      setFeedback(prev => ({...prev, [name]: phoneWithPrefix}));
    } else {
      setFeedback(prev => ({...prev, [name]: value}));
    }
  };

  const resetForm = () => {
    setFeedback(initialFeedbackState);
  };

  const handleSubmitFeedback = async () => {
    if(!isFormValid()) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      const formattedFeedback = {
        ...feedback,
        phoneNumber: feedback.phone.trim(),
        createdAt: new Date().toISOString()
      };

      const userId = formattedFeedback.phoneNumber;
      
      await submitFeedback(userId, formattedFeedback);
      
      console.log("Feedback submitted successfully: ", formattedFeedback);
      toast.success('Feedback submitted successfully');
      onAdd(formattedFeedback);
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error submitting feedback: ", error);
      toast.error("Error submitting feedback. Please try again");
    }
  };


  const handleClearAll = () => {
    resetForm();
  };

  const [isWingDropdownOpen, setIsWingDropdownOpen] = useState(false);
  const wingOptions = ['Choose Wing','A Wing', 'B Wing', 'C Wing', 'D Wing'];
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleWingDropdown = () => setIsWingDropdownOpen(!isWingDropdownOpen);

  const handleWingSelect = (wing) => {
    setFeedback(prev => ({ ...prev, wing }));
    setIsWingDropdownOpen(false);
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
    return feedback.firstName && feedback.lastName && feedback.email && feedback.phone && 
           feedback.wing !== 'Choose Wing' && feedback.flatNumber && feedback.overallExperience &&
           feedback.maintenanceSatisfaction;
  };

  useEffect(() => {
    if(isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-8 m-4" style={{ width: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 className="text-2xl font-bold mb-6">Submit Feedback</h2>
        
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={feedback.firstName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={feedback.lastName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={feedback.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                value={feedback.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Wing</label>
              <select
                name="wing"
                value={feedback.wing}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="Choose Wing">Choose Wing</option>
                <option value="A Wing">A Wing</option>
                <option value="B Wing">B Wing</option>
                <option value="C Wing">C Wing</option>
                <option value="D Wing">D Wing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Flat Number</label>
              <input
                type="text"
                name="flatNumber"
                value={feedback.flatNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>

          {/* Feedback Questions */}
          <div>
            <label className="block text-sm font-medium text-gray-700">How would you rate your overall experience living in our community?</label>
            <select
              name="overallExperience"
              value={feedback.overallExperience}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Select an option</option>
              <option value="Very Poor">Very Poor</option>
              <option value="Poor">Poor</option>
              <option value="Average">Average</option>
              <option value="Good">Good</option>
              <option value="Excellent">Excellent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">What do you like most about our community?</label>
            <textarea
              name="likeMost"
              value={feedback.likeMost}
              onChange={handleInputChange}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">What areas do you think need improvement?</label>
            <textarea
              name="areasForImprovement"
              value={feedback.areasForImprovement}
              onChange={handleInputChange}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Are there any specific facilities or services you would like to see improved?</label>
            <textarea
              name="facilitiesToImprove"
              value={feedback.facilitiesToImprove}
              onChange={handleInputChange}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">How satisfied are you with the maintenance and upkeep of the property?</label>
            <select
              name="maintenanceSatisfaction"
              value={feedback.maintenanceSatisfaction}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Select an option</option>
              <option value="Very Poor">Very Poor</option>
              <option value="Poor">Poor</option>
              <option value="Average">Average</option>
              <option value="Good">Good</option>
              <option value="Excellent">Excellent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Additional Comments</label>
            <textarea
              name="additionalComments"
              value={feedback.additionalComments}
              onChange={handleInputChange}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={handleClearAll}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Clear All
          </button>
          <button
            onClick={handleSubmitFeedback}
            disabled={!isFormValid()}
            className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${!isFormValid() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackEnter;