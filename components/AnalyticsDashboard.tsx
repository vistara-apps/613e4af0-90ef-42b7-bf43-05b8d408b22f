'use client';

import { useState } from 'react';
import { ArrowLeft, TrendingUp, Users, DollarSign, Clock } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { formatAmount, formatAddress } from '../lib/utils';
import type { AppView } from '../app/page';

interface AnalyticsDashboardProps {
  onViewChange: (view: AppView) => void;
}

// Mock analytics data
const mockAnalytics = {
  totalTipsReceived: '12.45',
  totalTransactions: 28,
  topCollaborators: [
    { address: '0x1234567890123456789012345678901234567890', displayName: 'Alice', totalAmount: '7.47' },
    { address: '0x0987654321098765432109876543210987654321', displayName: 'Bob', totalAmount: '4.98' },
  ],
  recentTransactions: [
    {
      transactionId: 'tx-1',
      groupId: 'group-1',
      tipperWalletAddress: '0x1111111111111111111111111111111111111111',
      amount: '0.5',
      currency: 'ETH',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      txHash: '0xabc123...',
      splits: [
        { collaboratorAddress: '0x1234567890123456789012345678901234567890', amount: '0.3' },
        { collaboratorAddress: '0x0987654321098765432109876543210987654321', amount: '0.2' },
      ],
    },
    {
      transactionId: 'tx-2',
      groupId: 'group-1',
      tipperWalletAddress: '0x2222222222222222222222222222222222222222',
      amount: '1.0',
      currency: 'ETH',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      txHash: '0xdef456...',
      splits: [
        { collaboratorAddress: '0x1234567890123456789012345678901234567890', amount: '0.6' },
        { collaboratorAddress: '0x0987654321098765432109876543210987654321', amount: '0.4' },
      ],
    },
  ],
};

export function AnalyticsDashboard({ onViewChange }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');
  
  const analytics = mockAnalytics;

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onViewChange('welcome')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>
        <h2 className="text-xl font-bold text-white">Analytics Dashboard</h2>
      </div>

      {/* Time Range Selector */}
      <div className="flex space-x-2">
        {(['24h', '7d', '30d'] as const).map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setTimeRange(range)}
          >
            {range}
          </Button>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Earned</p>
              <p className="text-lg font-bold text-white">
                {formatAmount(analytics.totalTipsReceived)} ETH
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Transactions</p>
              <p className="text-lg font-bold text-white">
                {analytics.totalTransactions}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Collaborators */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Top Collaborators</span>
          </h3>

          <div className="space-y-3">
            {analytics.topCollaborators.map((collaborator, index) => (
              <div key={collaborator.address} className="flex items-center justify-between bg-dark-bg rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-white">{collaborator.displayName}</p>
                    <p className="text-xs text-gray-400">
                      {formatAddress(collaborator.address)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">
                    {formatAmount(collaborator.totalAmount)} ETH
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Recent Transactions</span>
          </h3>

          <div className="space-y-3">
            {analytics.recentTransactions.map((transaction) => (
              <div key={transaction.transactionId} className="bg-dark-bg rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-white">
                      {formatAmount(transaction.amount)} {transaction.currency}
                    </p>
                    <p className="text-xs text-gray-400">
                      From {formatAddress(transaction.tipperWalletAddress)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">
                      {formatTimeAgo(transaction.timestamp)}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-400 mb-2">Split distribution:</p>
                  {transaction.splits.map((split, index) => {
                    const collaborator = analytics.topCollaborators.find(
                      c => c.address === split.collaboratorAddress
                    );
                    return (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">
                          {collaborator?.displayName || formatAddress(split.collaboratorAddress)}
                        </span>
                        <span className="text-white">
                          {formatAmount(split.amount)} {transaction.currency}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
