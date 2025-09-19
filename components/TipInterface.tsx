'use client';

import { useState } from 'react';
import { ArrowLeft, Send, Users, DollarSign } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { TipInput } from './TipInput';
import { Notification } from './ui/Notification';
import { formatAmount, calculateSplitAmounts } from '../lib/utils';
import { SUPPORTED_CURRENCIES } from '../lib/constants';
import type { AppView } from '../app/page';

interface TipInterfaceProps {
  groupId: string | null;
  onViewChange: (view: AppView) => void;
}

// Mock data for demonstration
const mockGroup = {
  groupId: 'group-1',
  groupName: 'Gaming Stream Duo',
  collaborators: [
    { displayName: 'Alice', walletAddress: '0x1234...5678', percentage: 60 },
    { displayName: 'Bob', walletAddress: '0x8765...4321', percentage: 40 },
  ],
};

export function TipInterface({ groupId, onViewChange }: TipInterfaceProps) {
  const [tipAmount, setTipAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState(SUPPORTED_CURRENCIES[0]);
  const [isSending, setIsSending] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const group = mockGroup; // In real app, fetch by groupId

  const handleSendTip = async () => {
    if (!tipAmount || parseFloat(tipAmount) <= 0) {
      setNotification({
        type: 'error',
        message: 'Please enter a valid tip amount',
      });
      return;
    }

    setIsSending(true);
    try {
      // Calculate splits
      const splits = calculateSplitAmounts(tipAmount, group.collaborators);
      
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setNotification({
        type: 'success',
        message: `Successfully sent ${formatAmount(tipAmount)} ${selectedCurrency.symbol} tip!`,
      });
      
      setTipAmount('');
    } catch (error) {
      console.error('Failed to send tip:', error);
      setNotification({
        type: 'error',
        message: 'Failed to send tip. Please try again.',
      });
    } finally {
      setIsSending(false);
    }
  };

  const splits = tipAmount ? calculateSplitAmounts(tipAmount, group.collaborators) : [];

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
        <div>
          <h2 className="text-xl font-bold text-white">Send Tip</h2>
          {group && (
            <p className="text-sm text-gray-400">{group.groupName}</p>
          )}
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Group Info */}
      {group && (
        <Card>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{group.groupName}</h3>
                <p className="text-sm text-gray-400">
                  {group.collaborators.length} collaborators
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {group.collaborators.map((collaborator, index) => (
                <div key={index} className="flex items-center justify-between bg-dark-bg rounded-lg p-3">
                  <div>
                    <p className="font-medium text-white">{collaborator.displayName}</p>
                    <p className="text-xs text-gray-400">
                      {collaborator.walletAddress.slice(0, 6)}...{collaborator.walletAddress.slice(-4)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-cyan-400">{collaborator.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Tip Input */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Tip Amount</span>
          </h3>

          <TipInput
            amount={tipAmount}
            onAmountChange={setTipAmount}
            currency={selectedCurrency}
            onCurrencyChange={setSelectedCurrency}
            currencies={SUPPORTED_CURRENCIES}
          />

          {/* Split Preview */}
          {tipAmount && parseFloat(tipAmount) > 0 && (
            <div className="bg-dark-bg rounded-lg p-4">
              <h4 className="font-medium text-white mb-3">Split Preview</h4>
              <div className="space-y-2">
                {splits.map((split, index) => {
                  const collaborator = group.collaborators.find(
                    c => c.walletAddress === split.collaboratorAddress
                  );
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        {collaborator?.displayName}
                      </span>
                      <span className="font-medium text-white">
                        {formatAmount(split.amount)} {selectedCurrency.symbol}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Send Button */}
      <Button
        onClick={handleSendTip}
        disabled={isSending || !tipAmount || parseFloat(tipAmount) <= 0}
        className="w-full btn-primary flex items-center justify-center space-x-2"
      >
        {isSending ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Sending Tip...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Send Tip</span>
          </>
        )}
      </Button>
    </div>
  );
}
