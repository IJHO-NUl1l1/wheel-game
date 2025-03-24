'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSpin } from '@/hooks/useSpin';

const SpinContext = createContext<ReturnType<typeof useSpin> | null>(null);

export function SpinProvider({ children }: { children: ReactNode }) {
  const spinState = useSpin();
  
  return (
    <SpinContext.Provider value={spinState}>
      {children}
    </SpinContext.Provider>
  );
}

export function useSpinContext() {
  const context = useContext(SpinContext);
  if (!context) {
    throw new Error('useSpinContext must be used within a SpinProvider');
  }
  return context;
} 