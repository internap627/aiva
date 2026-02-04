import React, { createContext, useState, useContext } from 'react';

const CompareContext = createContext();

export const useCompare = () => {
  return useContext(CompareContext);
};

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);

  const addToCompare = (device) => {
    setCompareList(prevList => {
      if (prevList.find(d => d.id === device.id)) {
        return prevList; // Already in list
      }
      if (prevList.length < 2) {
        return [...prevList, device];
      }
      return prevList; // List is full
    });
  };

  const removeFromCompare = (deviceId) => {
    setCompareList(prevList => prevList.filter(d => d.id !== deviceId));
  };

  const value = {
    compareList,
    addToCompare,
    removeFromCompare,
  };

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  );
};