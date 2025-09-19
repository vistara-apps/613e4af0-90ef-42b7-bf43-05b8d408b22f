'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { AppShell } from '../components/AppShell';
import { CreateGroupForm } from '../components/CreateGroupForm';
import { TipInterface } from '../components/TipInterface';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { WelcomeScreen } from '../components/WelcomeScreen';

export type AppView = 'welcome' | 'create-group' | 'tip' | 'analytics';

export default function HomePage() {
  const [currentView, setCurrentView] = useState<AppView>('welcome');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const { address, isConnected } = useAccount();

  const handleViewChange = (view: AppView, groupId?: string) => {
    setCurrentView(view);
    if (groupId) {
      setSelectedGroupId(groupId);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'welcome':
        return <WelcomeScreen onViewChange={handleViewChange} />;
      case 'create-group':
        return <CreateGroupForm onViewChange={handleViewChange} />;
      case 'tip':
        return (
          <TipInterface 
            groupId={selectedGroupId} 
            onViewChange={handleViewChange} 
          />
        );
      case 'analytics':
        return <AnalyticsDashboard onViewChange={handleViewChange} />;
      default:
        return <WelcomeScreen onViewChange={handleViewChange} />;
    }
  };

  return (
    <AppShell>
      <div className="animate-fade-in">
        {renderCurrentView()}
      </div>
    </AppShell>
  );
}
