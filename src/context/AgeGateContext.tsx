import React, { createContext, useContext, useState, useEffect } from 'react';

interface AgeGateContextType {
  isAgeConfirmed: boolean;
  confirmAge: () => void;
  resetAgeConfirmation: () => void;
}

const AgeGateContext = createContext<AgeGateContextType | undefined>(undefined);

const AGE_GATE_STORAGE_KEY = 'kingsman_18plus_confirmed';

export const AgeGateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAgeConfirmed, setIsAgeConfirmed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AGE_GATE_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const confirmAge = () => {
    setIsAgeConfirmed(true);
    try {
      localStorage.setItem(AGE_GATE_STORAGE_KEY, 'true');
    } catch (e) {
      console.warn('Storage error saving age confirmation:', e);
    }
  };

  const resetAgeConfirmation = () => {
    setIsAgeConfirmed(false);
    try {
      localStorage.removeItem(AGE_GATE_STORAGE_KEY);
    } catch (e) {
      console.warn('Storage error clearing age confirmation:', e);
    }
  };

  return (
    <AgeGateContext.Provider value={{ isAgeConfirmed, confirmAge, resetAgeConfirmation }}>
      {children}
    </AgeGateContext.Provider>
  );
};

export const useAgeGate = () => {
  const ctx = useContext(AgeGateContext);
  if (!ctx) throw new Error('useAgeGate must be used within an AgeGateProvider');
  return ctx;
};
