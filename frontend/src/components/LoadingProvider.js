import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext({
  loading: false,
  setLoading: () => {}
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
};
