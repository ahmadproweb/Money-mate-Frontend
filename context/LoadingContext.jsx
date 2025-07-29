import React, { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const showLoader = () => setLoadingSubmit(true);
  const hideLoader = () => setLoadingSubmit(false);

  return (
    <LoadingContext.Provider value={{ loadingSubmit, showLoader, hideLoader }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
