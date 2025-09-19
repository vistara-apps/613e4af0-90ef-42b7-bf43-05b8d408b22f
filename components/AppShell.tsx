'use client';

import { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen gradient-bg">
      <div className="container max-w-xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            TipSplitter
          </h1>
          <p className="text-white/80 text-lg">
            Effortlessly split crypto tips between your collab streams
          </p>
        </header>
        
        <main className="space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
