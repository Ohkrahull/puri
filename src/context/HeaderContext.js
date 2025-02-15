// src/context/HeaderContext.js
import React, { createContext, useContext, useState } from 'react';

const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
  const [formDirty, setFormDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [headerData, setHeaderData] = useState({
    getCurrentList: () => [],
    hasChanges: false,
    selectedUser: null,
    isAddingNew: true
  });

  const startSave = () => setIsSaving(true);
  const endSave = () => setIsSaving(false);

  return (
    <HeaderContext.Provider value={{
      formDirty,
      setFormDirty,
      isSaving,
      startSave,
      endSave,
      headerData,
      setHeaderData
    }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => useContext(HeaderContext);