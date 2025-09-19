import { useState, useCallback } from 'react';
import { useWalletClient, useAccount } from 'wagmi';
import { Address } from 'viem';
import { paymentService, PaymentResult, PaymentConfirmation } from '../paymentService';
import { calculateSplitAmounts } from '../utils';
import { SUPPORTED_CURRENCIES } from '../constants';

interface PaymentHookState {
  isProcessing: boolean;
  error: string | null;
  lastPayment: PaymentResult | null;
  confirmations: Map<string, PaymentConfirmation>;
}

interface CollaboratorSplit {
  displayName: string;
  walletAddress: string;
  percentage: number;
}

export function usePayments() {
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  
  const [state, setState] = useState<PaymentHookState>({
    isProcessing: false,
    error: null,
    lastPayment: null,
    confirmations: new Map(),
  });

  const processTipPayment = useCallback(async (
    amount: string,
    currency: typeof SUPPORTED_CURRENCIES[number],
    collaborators: CollaboratorSplit[]
  ): Promise<PaymentResult> => {
    if (!walletClient || !address) {
      const error = 'Wallet not connected';
      setState(prev => ({ ...prev, error }));
      return { success: false, transactionHashes: [], error };
    }

    setState(prev => ({ 
      ...prev, 
      isProcessing: true, 
      error: null,
      confirmations: new Map()
    }));

    try {
      // Calculate splits
      const splits = calculateSplitAmounts(amount, collaborators);
      
      // Convert to payment splits format
      const paymentSplits = splits.map(split => ({
        collaboratorAddress: split.collaboratorAddress as Address,
        amount: split.amount,
        percentage: collaborators.find(c => c.walletAddress === split.collaboratorAddress)?.percentage || 0,
      }));

      // Process payment
      const result = await paymentService.processTipPayment({
        walletClient,
        amount,
        currency,
        splits: paymentSplits,
        senderAddress: address as Address,
      });

      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        lastPayment: result,
        error: result.error || null
      }));

      // Start monitoring confirmations for successful transactions
      if (result.success && result.transactionHashes.length > 0) {
        monitorConfirmations(result.transactionHashes);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: errorMessage 
      }));
      
      return { 
        success: false, 
        transactionHashes: [], 
        error: errorMessage 
      };
    }
  }, [walletClient, address]);

  const monitorConfirmations = useCallback(async (transactionHashes: string[]) => {
    if (!walletClient) return;

    for (const hash of transactionHashes) {
      try {
        const confirmation = await paymentService.waitForConfirmations(walletClient, hash);
        setState(prev => ({
          ...prev,
          confirmations: new Map(prev.confirmations.set(hash, confirmation))
        }));
      } catch (error) {
        console.error(`Failed to monitor confirmation for ${hash}:`, error);
      }
    }
  }, [walletClient]);

  const checkBalance = useCallback(async (currency: typeof SUPPORTED_CURRENCIES[number]): Promise<string> => {
    if (!walletClient || !address) return '0';

    try {
      if (currency.symbol === 'ETH') {
        return await paymentService.checkETHBalance(walletClient, address as Address);
      } else if (currency.symbol === 'USDC') {
        return await paymentService.checkUSDCBalance(walletClient, address as Address);
      }
      return '0';
    } catch (error) {
      console.error('Failed to check balance:', error);
      return '0';
    }
  }, [walletClient, address]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const resetPayment = useCallback(() => {
    setState({
      isProcessing: false,
      error: null,
      lastPayment: null,
      confirmations: new Map(),
    });
  }, []);

  return {
    // State
    isProcessing: state.isProcessing,
    error: state.error,
    lastPayment: state.lastPayment,
    confirmations: state.confirmations,
    
    // Actions
    processTipPayment,
    checkBalance,
    clearError,
    resetPayment,
    
    // Wallet state
    isConnected: !!walletClient && !!address,
    address,
  };
}