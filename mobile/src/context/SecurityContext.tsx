import React, { createContext, useContext, useState, useEffect } from 'react';
import { offlineDb, SecuritySettings } from '../services/offlineDb';

interface SecurityContextType {
  isLocked: boolean;
  isPinEnabled: boolean;
  securitySettings: SecuritySettings | null;
  unlock: (pin: string) => boolean;
  updatePin: (newPin: string) => Promise<void>;
  togglePinProtection: (enabled: boolean) => Promise<void>;
  lockApp: () => void;
  updateProfileNames: (userName: string, businessName: string) => Promise<void>;
}

const SecurityContext = createContext<SecurityContextType>({} as SecurityContextType);

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const sec = await offlineDb.getSecurity();
    setSecuritySettings(sec);
    if (sec.isPinEnabled) {
      setIsLocked(true);
    } else {
      setIsLocked(false);
    }
  };

  const unlock = (enteredPin: string): boolean => {
    if (!securitySettings) return true;
    if (!securitySettings.isPinEnabled) {
      setIsLocked(false);
      return true;
    }
    if (enteredPin === securitySettings.pinCode) {
      setIsLocked(false);
      return true;
    }
    return false;
  };

  const updatePin = async (newPin: string) => {
    await offlineDb.setPin(newPin);
    const sec = await offlineDb.getSecurity();
    setSecuritySettings(sec);
  };

  const togglePinProtection = async (enabled: boolean) => {
    await offlineDb.togglePin(enabled);
    const sec = await offlineDb.getSecurity();
    setSecuritySettings(sec);
    if (!enabled) {
      setIsLocked(false);
    }
  };

  const lockApp = () => {
    if (securitySettings?.isPinEnabled) {
      setIsLocked(true);
    }
  };

  const updateProfileNames = async (userName: string, businessName: string) => {
    await offlineDb.updateProfile(userName, businessName);
    const sec = await offlineDb.getSecurity();
    setSecuritySettings(sec);
  };

  return (
    <SecurityContext.Provider
      value={{
        isLocked,
        isPinEnabled: securitySettings?.isPinEnabled || false,
        securitySettings,
        unlock,
        updatePin,
        togglePinProtection,
        lockApp,
        updateProfileNames,
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => useContext(SecurityContext);
