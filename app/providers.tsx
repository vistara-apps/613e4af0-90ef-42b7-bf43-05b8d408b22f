'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';
import { createContext, useContext, useState, ReactNode } from 'react';

// Mock MiniKit context since the package doesn't exist
interface MiniKitContextType {
  user: any;
  context: { user?: { displayName?: string } };
}

const MiniKitContext = createContext<MiniKitContextType>({
  user: null,
  context: {}
});

export function MiniKitProvider({ children }: { children: ReactNode }) {
  const [user] = useState(null);
  const [context] = useState({ user: { displayName: 'Demo User' } });

  return (
    <MiniKitContext.Provider value={{ user, context }}>
      {children}
    </MiniKitContext.Provider>
  );
}

export function useMiniKit() {
  return useContext(MiniKitContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MiniKitProvider>
      <OnchainKitProvider
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || ''}
        chain={base as any}
      >
        {children}
      </OnchainKitProvider>
    </MiniKitProvider>
  );
}
