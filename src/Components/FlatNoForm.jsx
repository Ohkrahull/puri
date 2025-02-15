
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronDown } from "lucide-react";
import India from "../Images/indiaflag.png";
import { useLocation, useNavigate } from "react-router-dom";
import { TrashSimple } from "phosphor-react";
import { toast } from 'react-toastify';
import { createRegistration, getRegistration, uploadDocuments, updatePrimaryStatus, updateRegistration } from "../firebase/services/userProfile";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useHeader } from "../context/HeaderContext";

const OwnerInformationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { wing, flatNumber, fullFlatNumber } = location.state || {};
  const { setFormDirty,isFormEditing,setHeaderData   } = useHeader();  // Use HeaderContext
  const [isSaving, setIsSaving] = useState(false);
  
  // Form states
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  
  // UI states
  const [showTabs, setShowTabs] = useState(false);
  const [ownersList, setOwnersList] = useState([]);
  const [tenantsList, setTenantsList] = useState([]);
  const [activeTab, setActiveTab] = useState('owner');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  // Empty form data template
  const emptyFormData = {
    phone: "",
    email: "",
    firstName: "",
    lastName: "",
    isResiding: true,
    isPrimaryStatus: false,
    notificationsEnabled: false,
    ownershipStatus: 'self-occupied'
  };

  // Form data
  const [formData, setFormData] = useState(emptyFormData);

  // Documents state
  const [documents, setDocuments] = useState([
    {
      name: 'Identification Proof',
      type: 'select',
      selectedType: 'Aadhar Card',
      file: null,
      options: ['Aadhar Card', 'PAN Card', 'Driving License', 'Voter ID']
    },
    {
      name: 'Address Proof',
      type: 'select',
      selectedType: 'Ration Card',
      file: null,
      options: ['Ration Card', 'Electricity Bill', 'Gas Bill']
    },
    {
      name: 'Society Approval',
      type: 'text',
      selectedType: 'NOC',
      file: null
    },
    {
      name: 'Photograph',
      type: 'text',
      selectedType: 'Photo',
      file: null
    }
  ]);
  useEffect(() => {
    const fetchRegistration = async () => {
      if (wing && flatNumber) {
        try {
          const result = await getRegistration(wing, flatNumber);
          if (result.success) {
            const owners = result.data.owners || [];
            const tenants = result.data.tenants || [];
            setOwnersList(owners);
            setTenantsList(tenants);
            
            setShowTabs(owners.length > 0 || tenants.length > 0);
            
            // Determine current list based on active tab
            const currentList = activeTab === 'owner' ? owners : tenants;
            const primaryPerson = currentList.find(p => p.isPrimaryStatus) || currentList[0];
    
            if (primaryPerson) {
              setSelectedUser(primaryPerson);
              setFormData(primaryPerson);
              setOriginalData(primaryPerson);
              setHasChanges(false);
              
              // Detailed document mapping
              const updatedDocuments = documents.map(doc => {
                const matchingDoc = primaryPerson.documents?.find(
                  pd => pd.documentType === doc.name
                );
                
                // If matching document exists, update the file information
                if (matchingDoc) {
                  return {
                    ...doc,
                    selectedType: matchingDoc.documentName || doc.selectedType,
                    file: matchingDoc.fileName ? {
                      name: matchingDoc.fileName,
                      size: 'Uploaded',
                      type: matchingDoc.fileName.toLowerCase().endsWith('.pdf') ? 'PDF' : 'IMG',
                      url: matchingDoc.fileUrl
                    } : null
                  };
                }
                
                // If no matching document, reset the file
                return {
                  ...doc,
                  file: null
                };
              });
              
              console.log('Updated Documents:', updatedDocuments);
              setDocuments(updatedDocuments);
            }
          }
        } catch (error) {
          console.error('Error fetching registration:', error);
        }
      }
    };
    
    fetchRegistration();
  }, [wing, flatNumber, activeTab]);

  useEffect(() => {
    const initializeEditMode = async () => {
      if ((location.state?.isEditing || wing) && flatNumber) {  // Modified condition
        try {
          const result = await getRegistration(wing, flatNumber);
          if (result.success) {
            const owners = result.data.owners || [];
            const tenants = result.data.tenants || [];
            setOwnersList(owners);
            setTenantsList(tenants);
            
            setShowTabs(true);
            setIsAddingNew(false);
            
            // Set active tab based on the first available list
            if (owners.length > 0) {
              setActiveTab('owner');
              const primaryOwner = owners.find(o => o.isPrimaryStatus) || owners[0];
              setSelectedUser(primaryOwner);
              setFormData(primaryOwner);
              setOriginalData(primaryOwner);
            } else if (tenants.length > 0) {
              setActiveTab('tenant');
              const primaryTenant = tenants.find(t => t.isPrimaryStatus) || tenants[0];
              setSelectedUser(primaryTenant);
              setFormData(primaryTenant);
              setOriginalData(primaryTenant);
            }
            
            // Initialize documents if available
            if (selectedUser?.documents) {
              const updatedDocuments = documents.map(doc => {
                const matchingDoc = selectedUser.documents.find(
                  d => d.documentType === doc.name
                );
                return matchingDoc ? {
                  ...doc,
                  selectedType: matchingDoc.documentName,
                  file: matchingDoc.fileName ? {
                    name: matchingDoc.fileName,
                    size: 'Uploaded',
                    type: matchingDoc.fileName.toLowerCase().endsWith('.pdf') ? 'PDF' : 'IMG',
                    url: matchingDoc.fileUrl
                  } : null
                } : doc;
              });
              setDocuments(updatedDocuments);
            }
          }
        } catch (error) {
          console.error('Error initializing edit mode:', error);
          toast.error('Failed to load registration data');
        }
      }
    };
  
    initializeEditMode();
  }, [location.state, wing, flatNumber]);


  useEffect(() => {
    // Update header data whenever relevant states change
    setHeaderData({
      getCurrentList: () => activeTab === 'owner' ? ownersList : tenantsList,
      hasChanges,
      selectedUser,
      isAddingNew
    });
  }, [ownersList, tenantsList, activeTab, hasChanges, selectedUser, isAddingNew]);

  // Helper functions
  const getModeText = (text) => {
    const textMap = {
      title: activeTab === 'owner' ? 'Owner Information' : 'Tenant Information',
      status: activeTab === 'owner' ? 'Ownership status' : 'Tenant status',
      primary: activeTab === 'owner' ? 'Primary Owner' : 'Primary Tenant',
      regular: activeTab === 'owner' ? 'Owner' : 'Tenant',
      add: activeTab === 'owner' ? 'Add Owner' : 'Add Tenant'
    };
    return textMap[text];
  };

  const getCurrentList = () => activeTab === 'owner' ? ownersList : tenantsList;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const currentList = tab === 'owner' ? ownersList : tenantsList;
    const primaryOrFirstPerson = currentList.find(p => p.isPrimaryStatus) || currentList[0];
    
    setIsAddingNew(currentList.length === 0);  // Set to adding new if no entries exist
    
    if (primaryOrFirstPerson) {
      setSelectedUser(primaryOrFirstPerson);
      setFormData(primaryOrFirstPerson);
      setOriginalData(primaryOrFirstPerson);
      setHasChanges(false);
  
      // Update documents for the selected user
      const updatedDocuments = documents.map(doc => {
        const matchingDoc = primaryOrFirstPerson.documents?.find(
          pd => pd.documentType === doc.name
        );
        
        if (matchingDoc) {
          return {
            ...doc,
            selectedType: matchingDoc.documentName || doc.selectedType,
            file: matchingDoc.fileName ? {
              name: matchingDoc.fileName,
              size: 'Uploaded',
              type: matchingDoc.fileName.toLowerCase().endsWith('.pdf') ? 'PDF' : 'IMG',
              url: matchingDoc.fileUrl
            } : null
          };
        }
        
        return {
          ...doc,
          file: null
        };
      });
  
      setDocuments(updatedDocuments);
    } else {
      setSelectedUser(null);
      setFormData(emptyFormData);
      // Reset documents when no user is selected
      setDocuments(documents.map(doc => ({
        ...doc,
        file: null
      })));
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (originalData) {
      // Restore form data
      setFormData(originalData);
      
      // Restore documents state
      if (originalData.documents) {
        const restoredDocuments = documents.map(doc => {
          const originalDoc = originalData.documents.find(
            d => d.documentType === doc.name
          );
          
          if (originalDoc) {
            return {
              ...doc,
              selectedType: originalDoc.documentName,
              file: originalDoc.fileName ? {
                name: originalDoc.fileName,
                size: 'Uploaded',
                type: originalDoc.fileName.toLowerCase().endsWith('.pdf') ? 'PDF' : 'IMG',
                url: originalDoc.fileUrl
              } : null
            };
          }
          return doc;
        });
        
        setDocuments(restoredDocuments);
      }
      
      setHasChanges(false);
    }
  };

  // Validation
  const validateField = (name, value) => {
    switch (name) {
      case 'phone':
        return !value ? 'Phone number is required' : 
               value.length !== 10 ? 'Phone number must be 10 digits' : '';
      case 'email':
        return !value ? 'Email is required' : 
               !/\S+@\S+\.\S+/.test(value) ? 'Invalid email format' : '';
      case 'firstName':
        return !value ? 'First name is required' : '';
      case 'lastName':
        return !value ? 'Last name is required' : '';
      default:
        return '';
    }
  };

  // do not remove thie validate form so activate this when u want to req all inputs 
  // const validateForm = () => {
  //   const newErrors = {};
  //   Object.keys(formData).forEach(key => {
  //     const error = validateField(key, formData[key]);
  //     if (error) newErrors[key] = error;
  //   });

  //   if (!documents.every(doc => doc.file)) {
  //     newErrors.documents = 'All documents are required';
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    // Documents are now optional - removed document validation

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Input Change Handler
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({ ...prev, [name]: value }));
  //   setTouched(prev => ({ ...prev, [name]: true }));
  //   const error = validateField(name, value);
  //   setErrors(prev => ({ ...prev, [name]: error }));
    
  //   checkForChanges({
  //     ...formData,
  //     [name]: value
  //   });
  // };
   // 5. Update handleInputChange to trigger form dirty state
   const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
    
    // Set form as dirty to show save bar
    setFormDirty(true);
    checkForChanges({
      ...formData,
      [name]: value
    });
  };

  // const handleAddNew = () => {
  //   setIsAddingNew(true);
  //   setSelectedUser(null);
  //   setFormData({
  //     ...emptyFormData,
  //     isPrimaryStatus: getCurrentList().length === 0  // Set primary if first entry
  //   });
  //   setDocuments(docs => docs.map(doc => ({
  //     ...doc,
  //     file: null
  //   })));
  //   setHasChanges(false);  // Reset changes flag
  // };
  const handleAddNew = () => {
    setIsAddingNew(true);
    setSelectedUser(null);
    
    // Create new form data while preserving wing and flat number
    setFormData({
      ...emptyFormData,
      wing: wing,
      flatNumber: flatNumber,
      fullFlatNumber: fullFlatNumber, // Add this to preserve the display
      isPrimaryStatus: getCurrentList().length === 0,  // Set primary if first entry
      ownershipStatus: 'self-occupied' // Set default ownership status
    });
    
    // Preserve document types while resetting files
    setDocuments(docs => docs.map(doc => ({
      ...doc,
      file: null,
      // Preserve the selectedType if it exists, otherwise use the default
      selectedType: doc.selectedType || doc.options?.[0] || doc.selectedType
    })));
    
    setHasChanges(false);
    setFormDirty(true); // Mark form as dirty to show save bar
  };

  const checkForChanges = (newData) => {
    if (!originalData) return;
  
    const hasFieldChanges = 
      newData.phone !== originalData.phone ||
      newData.email !== originalData.email ||
      newData.firstName !== originalData.firstName ||
      newData.lastName !== originalData.lastName ||
      newData.isResiding !== originalData.isResiding ||
      newData.isPrimaryStatus !== originalData.isPrimaryStatus ||
      newData.notificationsEnabled !== originalData.notificationsEnabled;
  
    // Check for document changes
    const hasDocumentChanges = documents.some((doc, index) => {
      const originalDoc = originalData.documents?.[index];
      return (
        doc.selectedType !== originalDoc?.documentName ||
        doc.file?.name !== originalDoc?.fileName
      );
    });
  
    setHasChanges(hasFieldChanges || hasDocumentChanges);
  };

  // Handle radio button changes
  const handleResidingChange = (value) => {
    setFormData(prev => ({ ...prev, isResiding: value }));
    checkForChanges({ ...formData, isResiding: value });
    setFormDirty(true);
  };

  // const handlePrimaryStatusChange = (value) => {
  //   // If trying to set to primary, first check and update existing primary
  //   if (value) {
  //     // Determine the current list based on active tab
  //     const currentList = activeTab === 'owner' ? ownersList : tenantsList;
      
  //     // Create a new list where only the current user is primary
  //     const updatedList = currentList.map(person => ({
  //       ...person,
  //       isPrimaryStatus: person.id === selectedUser.id
  //     }));
  
  //     // Update the appropriate list
  //     if (activeTab === 'owner') {
  //       setOwnersList(updatedList);
  //     } else {
  //       setTenantsList(updatedList);
  //     }
  //   }
  
  //   // Update the current user's primary status
  //   setFormData(prev => ({ 
  //     ...prev, 
  //     isPrimaryStatus: value 
  //   }));
  
  //   // Check for changes
  //   checkForChanges({ 
  //     ...formData, 
  //     isPrimaryStatus: value 
  //   });
  // };
  const handlePrimaryStatusChange = (value) => {
    // If trying to set to primary, first check and update existing primary
    if (value) {
      // Determine the current list based on active tab
      const currentList = activeTab === 'owner' ? ownersList : tenantsList;
      
      // Create a new list where only the current user is primary
      const updatedList = currentList.map(person => ({
        ...person,
        isPrimaryStatus: selectedUser ? person.id === selectedUser.id : false
      }));
  
      // Update the appropriate list
      if (activeTab === 'owner') {
        setOwnersList(updatedList);
      } else {
        setTenantsList(updatedList);
      }
    }
  
    // Update the form data's primary status
    setFormData(prev => ({ 
      ...prev, 
      isPrimaryStatus: value 
    }));
  
    // Check for changes
    checkForChanges({ 
      ...formData, 
      isPrimaryStatus: value 
    });

    setFormDirty(true);
  };
  const handleNotificationsChange = (value) => {
    setFormData(prev => ({ ...prev, notificationsEnabled: value }));
    checkForChanges({ ...formData, notificationsEnabled: value });
    setFormDirty(true);
  };

  // File Upload Handler
  const handleFileUpload = (index, event) => {
    const file = event.target.files[0];
    if (!file) return;

    
    
    // Log file details for debugging
    console.log('Selected file:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    const newDocuments = [...documents];
    newDocuments[index].file = {
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'IMG',
      data: file,  // Store the actual file object
      isNew: true,  // Explicitly mark as new file
      url: null     // Clear any existing URL
    };
    
    setDocuments(newDocuments);
    checkForChanges(formData);
    setFormDirty(true); // Show save bar when document is uploaded
  };
  
  // Delete File Handler
  const handleDeleteFile = (index) => {
    const newDocuments = [...documents];
    newDocuments[index].file = null;
    setDocuments(newDocuments);
    checkForChanges(formData);
  };

  // Submit Handler
  // const handleSubmit = async () => {
  //   setHasAttemptedSubmit(true);
  //   setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
  
  //   if (!validateForm()) {
  //     toast.error('Please fill in all required fields correctly');
  //     return;
  //   }
  
  //   setIsLoading(true);
  
  //   try {
  //     const newPerson = {
  //       ...formData,
  //       type: activeTab,
  //       id: `${Date.now()}_${activeTab}`,
  //       addedAt: new Date().toISOString()
  //     };
  
  //     // Create registration
  //     const result = await createRegistration(
  //       newPerson,
  //       { wing, flatNumber, isVacant: false },
  //       documents
  //     );
  
  //     if (result.success) {
  //       // Create person object with documents
  //       const personWithDocuments = {
  //         ...newPerson,
  //         documents: documents.map(doc => ({
  //           documentType: doc.name,
  //           documentName: doc.selectedType,
  //           fileName: doc.file ? doc.file.name : null,
  //           fileUrl: doc.file ? doc.file.url : null
  //         }))
  //       };
  
  //       // Update local lists based on active tab
  //       if (activeTab === 'owner') {
  //         setOwnersList(prev => [...prev, personWithDocuments]);
  //       } else {
  //         setTenantsList(prev => [...prev, personWithDocuments]);
  //       }
  
  //       // Update UI state
  //       setShowTabs(true);
  //       setIsAddingNew(false);
  //       setSelectedUser(personWithDocuments);
  //       setOriginalData(personWithDocuments);
  //       setHasChanges(false);
  
  //       // Clear form state
  //       setFormData({
  //         phone: "",
  //         email: "",
  //         firstName: "",
  //         lastName: "",
  //         isResiding: true,
  //         isPrimaryStatus: false,
  //         notificationsEnabled: true,
  //       });
  
  //       // Clear documents
  //       setDocuments(docs => docs.map(doc => ({
  //         ...doc,
  //         file: null
  //       })));
  
  //       toast.success(`${getModeText('regular')} added successfully!`);
  
  //       // If it's the first person added, trigger refetch of registration data
  //       if (getCurrentList().length === 0) {
  //         const refreshResult = await getRegistration(wing, flatNumber);
  //         if (refreshResult.success) {
  //           const owners = refreshResult.data.owners || [];
  //           const tenants = refreshResult.data.tenants || [];
  //           setOwnersList(owners);
  //           setTenantsList(tenants);
  //         }
  //       }
  
  //     } else {
  //       toast.error(result.error || 'Failed to add person');
  //     }
  //   } catch (error) {
  //     console.error('Error submitting form:', error);
  //     toast.error('An unexpected error occurred');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // const handleSubmit = async () => {
  //   setHasAttemptedSubmit(true);
  //   setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
  
  //   if (!validateForm()) {
  //     toast.error('Please fill in all required fields correctly');
  //     return;
  //   }
  
  //   setIsLoading(true);
  
  //   try {
  //     // If editing existing user
  //     if (selectedUser && !isAddingNew) {
  //       // Get registration data for the flat
  //       const registrationResult = await getRegistration(wing, flatNumber);
  //       if (!registrationResult.success) {
  //         throw new Error('Could not find registration');
  //       }
  
  //       const registrationId = registrationResult.data.id;
  
  //       // Update existing registration
  //       const result = await updateRegistration(
  //         registrationId,
  //         selectedUser.id,
  //         {
  //           ...formData,
  //           type: activeTab,
  //         },
  //         documents,
  //         activeTab
  //       );
  
  //       if (!result.success) {
  //         throw new Error(result.error || 'Failed to update registration');
  //       }
  
  //       toast.success('Changes updated successfully!');
  //     } else {
  //       // Create new registration
  //       const result = await createRegistration(
  //         {
  //           ...formData,
  //           type: activeTab,
  //         },
  //         { wing, flatNumber, isVacant: false },
  //         documents
  //       );
  
  //       if (!result.success) {
  //         throw new Error(result.error || 'Failed to create registration');
  //       }
  
  //       toast.success(`${getModeText('regular')} added successfully!`);
  //     }
  
  //     // Refresh registration data
  //     const refreshResult = await getRegistration(wing, flatNumber);
  //     if (refreshResult.success) {
  //       const owners = refreshResult.data.owners || [];
  //       const tenants = refreshResult.data.tenants || [];
  //       setOwnersList(owners);
  //       setTenantsList(tenants);
  
  //       // Find the updated/created person
  //       const currentList = activeTab === 'owner' ? owners : tenants;
  //       const updatedPerson = selectedUser 
  //         ? currentList.find(p => p.id === selectedUser.id)
  //         : currentList[currentList.length - 1];
  
  //       if (updatedPerson) {
  //         setSelectedUser(updatedPerson);
  //         setFormData(updatedPerson);
  //         setOriginalData(updatedPerson);
  //         setShowTabs(true);
  //         setIsAddingNew(false);
  //         setHasChanges(false);
  //       }
  //     }
  
  //   } catch (error) {
  //     console.error('Error in submit handler:', error);
  //     toast.error(error.message || 'An unexpected error occurred');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
 // Submit Handler - Now triggered via header save button
  // 6. Submit handler for the header save button
  const handleSubmit = async (successCallback, errorCallback, validationErrorCallback) => {
    setHasAttemptedSubmit(true);
    setIsSaving(true);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      validationErrorCallback();
      setIsSaving(false);
      return;
    }

    try {
      if (selectedUser && !isAddingNew) {
        const registrationResult = await getRegistration(wing, flatNumber);
        if (!registrationResult.success) {
          throw new Error('Could not find registration');
        }

        const registrationId = registrationResult.data.id;
        const result = await updateRegistration(
          registrationId,
          selectedUser.id,
          {
            ...formData,
            type: activeTab,
          },
          documents,
          activeTab
        );

        if (!result.success) {
          throw new Error(result.error || 'Failed to update registration');
        }
      } else {
        const result = await createRegistration(
          {
            ...formData,
            type: activeTab,
          },
          { wing, flatNumber, isVacant: false },
          documents
        );

        if (!result.success) {
          throw new Error(result.error || 'Failed to create registration');
        }
      }

      const refreshResult = await getRegistration(wing, flatNumber);
      if (refreshResult.success) {
        const owners = refreshResult.data.owners || [];
        const tenants = refreshResult.data.tenants || [];
        
        setOwnersList(owners);
        setTenantsList(tenants);

        const currentList = activeTab === 'owner' ? owners : tenants;
        const updatedPerson = selectedUser 
          ? currentList.find(p => p.id === selectedUser.id)
          : currentList[currentList.length - 1];

        if (updatedPerson) {
          setSelectedUser(updatedPerson);
          setFormData(updatedPerson);
          setOriginalData(updatedPerson);
          setShowTabs(true);
          setIsAddingNew(false);
          setHasChanges(false);
        }
      }

      toast.success('Changes saved successfully!');
      successCallback();
      setFormDirty(false);
      navigate('/flatmain');
    } catch (error) {
      console.error('Error in submit handler:', error);
      toast.error(error.message || 'An unexpected error occurred');
      errorCallback();
    } finally {
      setIsLoading(false);
      setIsSaving(false);
    }
  };

// 7. Add event listener for header save button
useEffect(() => {
  const form = document.getElementById('owner-form');
  
  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (isSaving) return; // Prevent multiple submissions
    const { successCallback, errorCallback, validationErrorCallback } = event.detail;
    handleSubmit(successCallback, errorCallback, validationErrorCallback);
  };

  form?.addEventListener('saveForm', handleFormSubmit);
  
  return () => {
    form?.removeEventListener('saveForm', handleFormSubmit);
  };
}, [handleSubmit, isSaving]);

  const handleSaveChanges = async () => {
    setIsLoading(true);
    
    try {
      // Get current registration
      const result = await getRegistration(wing, flatNumber);
      if (!result.success) {
        throw new Error('Could not find registration');
      }
  
      const registrationId = result.data.id;
      
      // Find current user's documents
      const currentList = activeTab === 'owner' ? result.data.owners : result.data.tenants;
      const personArray = activeTab === 'owner' ? 'owners' : 'tenants';
      
      // Prepare document uploads
      const documentsToUpload = documents.filter(doc => doc.file && doc.file.isNew);
      
      const uploadPromises = documentsToUpload.map(async (doc) => {
        if (doc.file && doc.file.data) {
          try {
            const uploadResult = await uploadDocuments(
              [doc],  // Wrap in array as the function expects an array
              `${wing}-${flatNumber}`
            );
            
            return uploadResult[0];  // Return the first (and only) uploaded document
          } catch (uploadError) {
            console.error(`Upload error for ${doc.name}:`, uploadError);
            toast.error(`Failed to upload ${doc.name}`);
            return null;
          }
        }
        return null;
      });
  
      const uploadedDocs = await Promise.all(uploadPromises);
      const validDocs = uploadedDocs.filter(doc => doc !== null);
  
      // Prepare final documents list (new uploads + existing)
      const finalDocuments = documents.map(doc => {
        const uploadedDoc = validDocs.find(uploaded => 
          uploaded.documentType === doc.name
        );
        
        return uploadedDoc || (doc.file && doc.file.url 
          ? {
              fileName: doc.file.name,
              fileUrl: doc.file.url,
              documentType: doc.name,
              documentName: doc.selectedType
            } 
          : null
        );
      }).filter(doc => doc !== null);
  
      // Prepare updated persons list
      const updatedPersons = currentList.map(person => {
        // If this is the current user being edited
        if (person.id === selectedUser.id) {
          return {
            ...formData,
            documents: finalDocuments,
            updatedAt: new Date().toISOString()
          };
        }
        
        // If the current user is setting themselves as primary, update other users
        if (formData.isPrimaryStatus && person.id !== selectedUser.id) {
          return {
            ...person,
            isPrimaryStatus: false
          };
        }
        
        return person;
      });
  
      // Update registration
      const registrationRef = doc(db, 'registrations', registrationId);
      await updateDoc(registrationRef, {
        [personArray]: updatedPersons,
        updatedAt: serverTimestamp()
      });
  
      // Update local state
      if (activeTab === 'owner') {
        setOwnersList(updatedPersons);
      } else {
        setTenantsList(updatedPersons);
      }
  
      // Find the updated person
      const updatedPerson = updatedPersons.find(p => p.id === selectedUser.id);
  
      // Update form and UI
      setOriginalData(updatedPerson);
      setSelectedUser(updatedPerson);
      
      // Refresh documents in the form
      const refreshedDocs = documents.map(doc => {
        const savedDoc = finalDocuments.find(saved => saved.documentType === doc.name);
        return savedDoc ? {
          ...doc,
          file: {
            name: savedDoc.fileName,
            url: savedDoc.fileUrl,
            type: savedDoc.fileName.toLowerCase().endsWith('.pdf') ? 'PDF' : 'IMG',
            size: 'Uploaded'
          }
        } : doc;
      });
  
      setDocuments(refreshedDocs);
      setHasChanges(false);
      toast.success('Changes saved successfully!');
    } catch (error) {
      console.error('Comprehensive error in save changes:', error);
      toast.error('Failed to save changes');
    } finally {
      setIsLoading(false);
    }
  };

  // Styles
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

  return (
    <div className="container mx-auto p-2 ml-6">
      {/* Back Button */}
      <form id="owner-form">
      <div className="mb-8">
        <div
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 mb-6 cursor-pointer"
        >
          <ChevronLeft
            size={30}
            style={{ backgroundColor: "#F3F3F3", borderRadius: 4 }}
            className="p-2"
          />
          <span className="ml-2" style={{ fontSize: 16, color: "#6B7280" }}>
            Back
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-[16px] font-medium text-gray-900 mb-6">
              {getModeText('title')}
            </h2>

            {/* Phone and Email Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label style={labelStyle}>Phone</label>
                <div style={{ position: "relative", display: "flex" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "12px 16px",
                      backgroundColor: "var(--Gray-50, #F9FAFB)",
                      borderRadius: "8px 0 0 8px",
                      border: "1px solid var(--Gray-200, #E5E7EB)",
                      borderRight: "none",
                    }}
                  >
                    <img src={India} alt="India" width={24} />
                    <span style={{ color: "#4B5563", fontSize: "14px" }}>
                      +91
                    </span>
                  </div>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={{
                      ...inputStyle,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      paddingLeft: "16px",
                      marginLeft: "-1px",
                      flex: 1,
                    }}
                    placeholder="Enter phone number"
                  />
                </div>
                {touched.phone && errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  name="email"
                  style={inputStyle}
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {touched.email && errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label style={labelStyle}>First name</label>
                <input
                  type="text"
                  name="firstName"
                  style={inputStyle}
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                {touched.firstName && errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label style={labelStyle}>Last name</label>
                <input
                  type="text"
                  name="lastName"
                  style={inputStyle}
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
                {touched.lastName && errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Status Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Residing Status */}
              <div>
                <label style={labelStyle}>Residing status</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer">
                    <input 
                      type="radio" 
                      name="residing"
                      className="w-4 h-4 cursor-pointer appearance-none border-2 rounded-full checked:border-[#36D7FE] border-gray-300"
                      checked={formData.isResiding}
                      onChange={() => handleResidingChange(true)}
                      style={{
                        backgroundColor: formData.isResiding ? '#36D7FE' : 'white'
                      }}
                    />
                    <span className="text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer">
                    <input 
                      type="radio" 
                      name="residing"
                      className="w-4 h-4 cursor-pointer appearance-none border-2 rounded-full checked:border-[#36D7FE] border-gray-300"
                      checked={!formData.isResiding}
                      onChange={() => handleResidingChange(false)}
                      style={{
                        backgroundColor: !formData.isResiding ? '#36D7FE' : 'white'
                      }}
                    />
                    <span className="text-gray-700">No</span>
                  </label>
                </div>
              </div>

              <div>
                <label style={labelStyle}>{getModeText('status')}</label>
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => handlePrimaryStatusChange(!formData.isPrimaryStatus)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out 
                      ${formData.isPrimaryStatus ? "bg-blue-500" : "bg-gray-200"}`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out 
                        ${formData.isPrimaryStatus ? "translate-x-6" : "translate-x-0"}`}
                    />
                  </button>
                  <span className="ml-2 text-sm text-gray-600">
                    {formData.isPrimaryStatus ? getModeText('primary') : getModeText('regular')}
                  </span>
                </div>
              </div>
            </div>

            {/* Notifications Toggle */}
            <div className="mb-8">
              <label style={labelStyle}>
                <span>Disable Notifications</span>
              </label>
              <button
                type="button"
                onClick={() => handleNotificationsChange(!formData.notificationsEnabled)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out mt-3 
                  ${formData.notificationsEnabled ? "bg-blue-500" : "bg-gray-200"}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out 
                    ${formData.notificationsEnabled ? "translate-x-6" : "translate-x-0"}`}
                />
              </button>
            </div>

            {/* Document Upload Section */}
            <div>
              <h3 className="text-[16px] font-medium text-gray-900 mb-6">Upload Documents</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-4 px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="font-medium text-[#4B5563]" style={{ fontSize: 12 }}>Name</div>
                  <div className="font-medium text-[#4B5563]" style={{ fontSize: 12 }}>Document Name</div>
                  <div className="font-medium text-[#4B5563]" style={{ fontSize: 12 }}>Upload</div>
                  <div></div>
                </div>

                {/* Document Rows */}
                {documents.map((doc, index) => (
                  <div key={index} className="grid grid-cols-4 px-4 py-3 border-b border-gray-200 items-center">
                    {/* Name */}
                    <div className="text-[14px] font-medium text-gray-900">
                      {doc.name}
                    </div>

                    {/* Document Type */}
                    <div className="relative">
                      {doc.type === 'select' ? (
                        <>
                          <button 
                           type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveDropdown(activeDropdown === index ? null : index);
                          }}
                            // onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
                            className="flex items-center text-gray-700 text-[14px]"
                          >
                            {doc.selectedType}
                            <ChevronDown size={16} className="ml-2" />
                          </button>
                          
                          {activeDropdown === index && (
                            <div className="absolute z-50 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                              {doc.options.map((option) => (
                                <button
                                  type="button"
                                  key={option}
                                  className="w-full px-4 py-2 text-left hover:bg-gray-50 text-[14px] text-gray-700"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const newDocs = [...documents];
                                    newDocs[index].selectedType = option;
                                    setDocuments(newDocs);
                                    setActiveDropdown(null);
                                    setFormDirty(true);
                                    checkForChanges(formData);
                                  }}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-[14px] text-gray-500">{doc.selectedType}</span>
                      )}
                    </div>

                    {/* Upload/File Display */}
                    <div>
                      {doc.file ? (
                        <div className="border border-gray-200 rounded-lg py-3 px-3 flex items-center gap-4 w-[198px] bg-gray-50">
                          <div className={`w-10 h-9 rounded flex items-center justify-center text-white 
                            ${doc.file.type === 'PDF' ? 'bg-red-600' : 'bg-blue-600'}`}>
                            <span className="text-[12px] font-medium">{doc.file.type}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 max-w-[130px] truncate">
                              {doc.file.name}
                            </div>
                            <div className="text-xs text-gray-500">{doc.file.size}</div>
                          </div>
                        </div>
                      ) : (
                        <label className="px-3 py-2 bg-gray-50 border border-gray-200 rounded cursor-pointer inline-block text-[14px] text-gray-900 font-medium">
                          Choose File
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleFileUpload(index, e)}
                            accept={doc.name === 'Photograph' ? 'image/*' : '.pdf'}
                          />
                        </label>
                      )}
                    </div>

                    {/* Delete Button */}
                    <div className="flex justify-end mr-4">
                      {doc.file && (
                        <button
                          onClick={() => handleDeleteFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <TrashSimple size={24} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Flat Info and Lists */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            {/* Flat Number Display */}
            <div className="mb-6">
              <h3 className="text-[16px] font-medium text-gray-900 mb-2">
                Flat Number
              </h3>
              <p className="text-[32px] font-semibold text-gray-900">
                {fullFlatNumber}
              </p>
            </div>

            {/* Tabs Section */}
            <div>
              <div className="bg-gray-50 rounded-lg p-1 mb-4 flex">
                <button 
                  type="button"
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200
                    ${activeTab === 'owner' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => handleTabChange('owner')}
                >
                  Owner
                </button>
                <button 
                  type="button"
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200
                    ${activeTab === 'tenant' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => handleTabChange('tenant')}
                >
                  Tenant
                </button>
              </div>

             
              <div className="space-y-3">
              {activeTab === 'owner' ? (

  [...ownersList].sort((a, b) => b.isPrimaryStatus - a.isPrimaryStatus).map((person, index) => (
    <div 
      key={index} 
      onClick={() => {
        setSelectedUser(person);
        setFormData(person);
        setOriginalData(person);
        setHasChanges(false);
        setIsAddingNew(false);

        const updatedDocuments = documents.map(doc => {
          const matchingDoc = person.documents?.find(
            pd => pd.documentType === doc.name
          );
          
          if (matchingDoc) {
            return {
              ...doc,
              selectedType: matchingDoc.documentName || doc.selectedType,
              file: matchingDoc.fileName ? {
                name: matchingDoc.fileName,
                size: 'Uploaded',
                type: matchingDoc.fileName.toLowerCase().endsWith('.pdf') ? 'PDF' : 'IMG',
                url: matchingDoc.fileUrl
              } : null
            };
          }
          
          return {
            ...doc,
            file: null
          };
        });

        console.log('User Selection Documents:', updatedDocuments);
        setDocuments(updatedDocuments);
      }}
      className={`flex justify-between items-center p-2 rounded-lg cursor-pointer transition-colors duration-200
        ${selectedUser?.id === person.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
    >
      <span className={`text-[14px] ${selectedUser?.id === person.id ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
        {person.firstName} {person.lastName}
      </span>
      <span className="text-[14px] text-gray-500">
        {person.isPrimaryStatus ? getModeText('primary') : getModeText('regular')}
      </span>
    </div>
  ))
) : (
  
  [...tenantsList].sort((a, b) => b.isPrimaryStatus - a.isPrimaryStatus).map((person, index) => (
    <div 
      key={index} 
      onClick={() => {
        setSelectedUser(person);
        setFormData(person);
        setOriginalData(person);
        setHasChanges(false);

        const updatedDocuments = documents.map(doc => {
          const matchingDoc = person.documents?.find(
            pd => pd.documentType === doc.name
          );
          
          if (matchingDoc) {
            return {
              ...doc,
              selectedType: matchingDoc.documentName || doc.selectedType,
              file: matchingDoc.fileName ? {
                name: matchingDoc.fileName,
                size: 'Uploaded',
                type: matchingDoc.fileName.toLowerCase().endsWith('.pdf') ? 'PDF' : 'IMG',
                url: matchingDoc.fileUrl
              } : null
            };
          }
          
          return {
            ...doc,
            file: null
          };
        });

        console.log('User Selection Documents:', updatedDocuments);
        setDocuments(updatedDocuments);
      }}
      className={`flex justify-between items-center p-2 rounded-lg cursor-pointer transition-colors duration-200
        ${selectedUser?.id === person.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
    >
      <span className={`text-[14px] ${selectedUser?.id === person.id ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
        {person.firstName} {person.lastName}
      </span>
      <span className="text-[14px] text-gray-500">
        {person.isPrimaryStatus ? getModeText('primary') : getModeText('regular')}
      </span>
    </div>
  ))
)}

                {getCurrentList().length > 0 && !isAddingNew && (
                  <button 
                    type="button"
                    // onClick={() => {
                    //   setIsAddingNew(true);
                    //   setSelectedUser(null);
                    //   setFormData(emptyFormData);
                    //   setDocuments(docs => docs.map(doc => ({
                    //     ...doc,
                    //     file: null
                    //   })));
                    // }}
                    onClick={handleAddNew}  // Using the handleAddNew function directly
                    className="flex items-center text-[14px] font-medium text-blue-500 hover:text-blue-600 mt-4"
                  >
                    <span className="mr-1 text-lg">+</span>
                    {getModeText('add')}
                  </button>
                )}
              </div>
            </div>
          </div>

          
{/* <div className="mt-6">
  {isAddingNew ? (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className={`flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} font-medium`}
      >
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
      {getCurrentList().length > 0 && (
        <button
          type="button"
          onClick={() => {
            setIsAddingNew(false);
            setSelectedUser(null);
            setFormData(emptyFormData);
          }}
          className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
        >
          Cancel
        </button>
      )}
    </div>
  ) : (
    hasChanges && (
      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleSaveChanges}
          disabled={isLoading}
          className={`flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} font-medium`}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
        >
          Cancel
        </button>
      </div>
    )
  )}
</div> */}
{/* <div className="mt-6">
  <div className="flex gap-4">
    <button
      type="button"
      onClick={handleSubmit}
      disabled={isLoading}
      className={`flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} font-medium`}
    >
      {isLoading ? 
        (selectedUser ? 'Updating...' : 'Submitting...') : 
        (selectedUser && !isAddingNew ? 'Update' : 'Submit')
      }
    </button>
    {(getCurrentList().length > 0 || hasChanges) && (
      <button
        type="button"
        onClick={handleCancel}
        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
      >
        Cancel
      </button>
    )}
  </div>
</div> */}
        </div>
      </div>
      </form>
    </div>
  );
};

export default OwnerInformationForm;