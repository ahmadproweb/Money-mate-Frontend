import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

const symbolMap = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CAD: "CA$",
  AUD: "A$",
  CHF: "Fr",
  CNY: "¥",
  INR: "₹",
};

export const AppProvider = ({ children }) => {
  const [budgetCycle, setBudgetCycle] = useState('Monthly');
  const [currency, setCurrency] = useState('USD');
  const [currencySymbol, setCurrencySymbol] = useState(symbolMap['USD']); 

  useEffect(() => {
    setCurrencySymbol(symbolMap[currency] || "$"); 
  }, [currency]);

  return (
    <AppContext.Provider value={{
      budgetCycle,
      setBudgetCycle,
      currency,
      setCurrency,
      currencySymbol,
      setCurrencySymbol
    }}>
      {children}
    </AppContext.Provider>
  );
};
