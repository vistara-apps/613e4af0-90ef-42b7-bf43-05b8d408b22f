'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Users, Zap, BarChart3, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { WalletConnect } from './WalletConnect';
import type { AppView } from '../app/page';

interface WelcomeScreenProps {
  onViewChange: (view: AppView) => void;
}

export function WelcomeScreen({ onViewChange }: WelcomeScreenProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const { address, isConnected } = useAccount();

  const handleGetStarted = async () => {
    setIsConnecting(true);
    try {
      // In a real app, you would handle authentication here
      // For now, we'll just navigate to create group
      setTimeout(() => {
        onViewChange('create-group');
        setIsConnecting(false);
      }, 1000);
    } catch (error) {
      console.error('Connection failed:', error);
      setIsConnecting(false);
    }
  };

  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Automated Splitting',
      description: 'Set up percentage splits and let the app handle the rest automatically.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Real-time Notifications',
      description: 'Get instant notifications when tips are received and distributed.',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Analytics Dashboard',
      description: 'Track your earnings and collaboration performance over time.',
    },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Hero Section */}
      <Card className="text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mx-auto flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome to TipSplitter
            </h2>
            <p className="text-gray-300">
              The easiest way to split crypto tips between collaborating streamers
            </p>
          </div>

          {!isConnected && (
            <div className="mt-4">
              <WalletConnect />
            </div>
          )}

          {isConnected && address && (
            <div className="bg-dark-bg rounded-lg p-3">
              <p className="text-sm text-gray-400">Wallet Connected</p>
              <p className="text-white font-medium">
                {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Features */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white text-center">
          Key Features
        </h3>
        
        <div className="space-y-3">
          {features.map((feature, index) => (
            <Card key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400">
                {feature.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1">
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-300">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="space-y-3">
        <Button
          onClick={handleGetStarted}
          disabled={isConnecting}
          className="w-full btn-primary flex items-center justify-center space-x-2"
        >
          {isConnecting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
        
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={() => onViewChange('tip')}
            className="flex-1"
          >
            Send Tip
          </Button>
          <Button
            variant="secondary"
            onClick={() => onViewChange('analytics')}
            className="flex-1"
          >
            View Analytics
          </Button>
        </div>
      </div>
    </div>
  );
}
