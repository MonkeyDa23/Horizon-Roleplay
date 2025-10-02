
import { useContext } from 'react';
import { LocalizationContext } from '../contexts/LocalizationContext';
import type { LocalizationContextType } from '../types';

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
