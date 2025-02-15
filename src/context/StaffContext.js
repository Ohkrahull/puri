// import React, { createContext, useContext, useState } from 'react';
// import { addStaffUser } from '../firebase/services/UserService';
// import { toast } from 'react-toastify';

// const StaffContext = createContext();

// export const useStaff = () => useContext(StaffContext);

// export const StaffProvider = ({ children }) => {
//   const [isAddingStaff, setIsAddingStaff] = useState(false);

//   const addStaffMember = async (staffData) => {
//     setIsAddingStaff(true);
//     try {
//       // Use the existing addStaffUser function from services
//       const result = await addStaffUser({
//         email: staffData.email,
//         phoneNumber: staffData.phoneNumber,
//         password: staffData.password,
//         firstName: staffData.firstName,
//         lastName: staffData.lastName,
//         role: staffData.role,
//         employeeId:staffData.employeeId,
//       });

//       console.log('Staff addition result:', result);
//       // toast.success('Staff member added successfully');
//       if (result && result.firestoreId) {
//         toast.success('Staff member added successfully');
//         return result;
//       } else {
//         throw new Error('Failed to add staff member');
//       }
//       // return result;
//     } catch (error) {
//       console.error('Error adding staff member:', error);
//       if (error.response && error.response.status === 500) {
//         toast.error('Server error occurred. Please try again later.');
//       } else if (error.message === "This email is already registered. Please use a different email address.") {
//         toast.error(error.message);
//       } else {
//         toast.error(`Failed to add staff member: ${error.message}`);
//       }
//       throw error; // Re-throw the error so the modal can handle it
//     } finally {
//       setIsAddingStaff(false);
//     }
//   };

//   return (
//     <StaffContext.Provider value={{ addStaffMember, isAddingStaff }}>
//       {children}
//     </StaffContext.Provider>
//   );
// };

import React, { createContext, useContext, useState } from 'react';
import { addStaffUser } from '../firebase/services/UserService';
import { toast } from 'react-toastify';
import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore';
import { getApp } from 'firebase/app';

const StaffContext = createContext();

export const useStaff = () => useContext(StaffContext);

const generateEmployeeId = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const checkEmployeeIdExists = async (db, employeeId) => {
  const staffRef = collection(db, 'staffUsers');
  const q = query(staffRef, where('employeeId', '==', employeeId));
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

export const StaffProvider = ({ children }) => {
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const db = getFirestore(getApp());

  const addStaffMember = async (staffData) => {
    setIsAddingStaff(true);
    try {
      // Generate unique employee ID
      const employeeId = await generateUniqueEmployeeId(db);

      // Add employeeId to staff data
      const staffWithId = {
        ...staffData,
        employeeId,
        createdAt: new Date(),
      };

      // Use the existing addStaffUser function from services
      const result = await addStaffUser(staffWithId);

      console.log('Staff addition result:', result);
      
      if (result && result.firestoreId) {
        toast.success('Staff member added successfully');
        return { ...result, employeeId };
      } else {
        throw new Error('Failed to add staff member');
      }
    } catch (error) {
      console.error('Error adding staff member:', error);
      if (error.response && error.response.status === 500) {
        toast.error('Server error occurred. Please try again later.');
      } else if (error.message === "This email is already registered. Please use a different email address.") {
        toast.error(error.message);
      } else {
        toast.error(`Failed to add staff member: ${error.message}`);
      }
      throw error;
    } finally {
      setIsAddingStaff(false);
    }
  };

  return (
    <StaffContext.Provider value={{ addStaffMember, isAddingStaff }}>
      {children}
    </StaffContext.Provider>
  );
};