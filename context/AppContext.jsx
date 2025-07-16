import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [budgetCycle, setBudgetCycle] = useState('Monthly');
  const [currency, setCurrency] = useState('INR');

  return (
    <AppContext.Provider value={{
      budgetCycle,
      setBudgetCycle,
      currency,
      setCurrency
    }}>
      {children}
    </AppContext.Provider>
  );
};
