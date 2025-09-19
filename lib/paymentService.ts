import { parseUnits, formatUnits, Address, createPublicClient, http } from 'viem';
import { WalletClient } from 'viem';
import { base } from 'viem/chains';
import { SUPPORTED_CURRENCIES } from './constants';

// Create a public client for reading contract data
const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

// USDC contract address on Base
const USDC_CONTRACT_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address;

// ERC20 ABI for USDC transfers
const ERC20_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

export interface PaymentSplit {
  collaboratorAddress: Address;
  amount: string;
  percentage: number;
}

export interface PaymentRequest {
  walletClient: WalletClient;
  amount: string;
  currency: {
    symbol: string;
    name: string;
    decimals: number;
    address: string;
  };
  splits: PaymentSplit[];
  senderAddress: Address;
}

export interface PaymentResult {
  success: boolean;
  transactionHashes: string[];
  error?: string;
  details?: {
    totalAmount: string;
    currency: string;
    splits: PaymentSplit[];
  };
}

export interface PaymentConfirmation {
  transactionHash: string;
  blockNumber: bigint;
  confirmations: number;
  status: 'pending' | 'confirmed' | 'failed';
}

/**
 * X402 Payment Service - Implements HTTP 402 Payment Required flow
 * for cryptocurrency payments with proper error handling and confirmations
 */
export class X402PaymentService {
  private readonly CONFIRMATION_BLOCKS = 3;
  private readonly MAX_RETRY_ATTEMPTS = 3;
  private readonly RETRY_DELAY = 2000; // 2 seconds

  /**
   * Process a tip payment with splits to multiple collaborators
   */
  async processTipPayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      // Validate request
      await this.validatePaymentRequest(request);

      const transactionHashes: string[] = [];

      // For ETH payments, send directly
      if (request.currency.symbol === 'ETH') {
        return await this.processETHPayments(request);
      }

      // For USDC payments, use ERC20 transfers
      if (request.currency.symbol === 'USDC') {
        return await this.processUSDCPayments(request);
      }

      throw new Error(`Unsupported currency: ${request.currency.symbol}`);

    } catch (error) {
      console.error('Payment processing failed:', error);
      return {
        success: false,
        transactionHashes: [],
        error: error instanceof Error ? error.message : 'Unknown payment error',
      };
    }
  }

  /**
   * Process ETH payments to multiple recipients
   */
  private async processETHPayments(request: PaymentRequest): Promise<PaymentResult> {
    const transactionHashes: string[] = [];

    try {
      for (const split of request.splits) {
        const amountWei = parseUnits(split.amount, request.currency.decimals);

        const hash = await request.walletClient.sendTransaction({
          account: request.senderAddress,
          to: split.collaboratorAddress,
          value: amountWei,
          chain: base,
        });

        transactionHashes.push(hash);
      }

      return {
        success: true,
        transactionHashes,
        details: {
          totalAmount: request.amount,
          currency: request.currency.symbol,
          splits: request.splits,
        },
      };
    } catch (error) {
      return {
        success: false,
        transactionHashes,
        error: error instanceof Error ? error.message : 'ETH payment failed',
      };
    }
  }

  /**
   * Process USDC payments to multiple recipients
   */
  private async processUSDCPayments(request: PaymentRequest): Promise<PaymentResult> {
    const transactionHashes: string[] = [];

    try {
      for (const split of request.splits) {
        const amountUsdc = parseUnits(split.amount, request.currency.decimals);

        const hash = await request.walletClient.writeContract({
          account: request.senderAddress,
          address: USDC_CONTRACT_ADDRESS,
          abi: ERC20_ABI,
          functionName: 'transfer',
          args: [split.collaboratorAddress, amountUsdc],
          chain: base,
        });

        transactionHashes.push(hash);
      }

      return {
        success: true,
        transactionHashes,
        details: {
          totalAmount: request.amount,
          currency: request.currency.symbol,
          splits: request.splits,
        },
      };
    } catch (error) {
      return {
        success: false,
        transactionHashes,
        error: error instanceof Error ? error.message : 'USDC payment failed',
      };
    }
  }

  /**
   * Check USDC balance for the sender
   */
  async checkUSDCBalance(walletClient: WalletClient, address: Address): Promise<string> {
    try {
      const balance = await publicClient.readContract({
        address: USDC_CONTRACT_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address],
      }) as bigint;

      return formatUnits(balance, 6); // USDC has 6 decimals
    } catch (error) {
      console.error('Failed to check USDC balance:', error);
      return '0';
    }
  }

  /**
   * Check ETH balance for the sender
   */
  async checkETHBalance(walletClient: WalletClient, address: Address): Promise<string> {
    try {
      const balance = await publicClient.getBalance({ address });
      return formatUnits(balance, 18); // ETH has 18 decimals
    } catch (error) {
      console.error('Failed to check ETH balance:', error);
      return '0';
    }
  }

  /**
   * Wait for transaction confirmations
   */
  async waitForConfirmations(
    walletClient: WalletClient,
    transactionHash: string
  ): Promise<PaymentConfirmation> {
    let attempts = 0;

    while (attempts < this.MAX_RETRY_ATTEMPTS) {
      try {
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: transactionHash as `0x${string}`,
        });

        const currentBlock = await publicClient.getBlockNumber();
        const confirmations = Number(currentBlock - receipt.blockNumber);

        return {
          transactionHash,
          blockNumber: receipt.blockNumber,
          confirmations,
          status: confirmations >= this.CONFIRMATION_BLOCKS ? 'confirmed' : 'pending',
        };
      } catch (error) {
        attempts++;
        console.warn(`Confirmation attempt ${attempts} failed:`, error);
        
        if (attempts >= this.MAX_RETRY_ATTEMPTS) {
          return {
            transactionHash,
            blockNumber: BigInt(0),
            confirmations: 0,
            status: 'failed',
          };
        }

        await this.delay(this.RETRY_DELAY);
      }
    }

    return {
      transactionHash,
      blockNumber: BigInt(0),
      confirmations: 0,
      status: 'failed',
    };
  }

  /**
   * Validate payment request before processing
   */
  private async validatePaymentRequest(request: PaymentRequest): Promise<void> {
    if (!request.walletClient) {
      throw new Error('Wallet client is required');
    }

    if (!request.senderAddress) {
      throw new Error('Sender address is required');
    }

    if (!request.amount || parseFloat(request.amount) <= 0) {
      throw new Error('Invalid payment amount');
    }

    if (!request.splits || request.splits.length === 0) {
      throw new Error('Payment splits are required');
    }

    // Validate splits add up to 100%
    const totalPercentage = request.splits.reduce((sum, split) => sum + split.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      throw new Error('Split percentages must add up to 100%');
    }

    // Check balance
    const balance = request.currency.symbol === 'ETH' 
      ? await this.checkETHBalance(request.walletClient, request.senderAddress)
      : await this.checkUSDCBalance(request.walletClient, request.senderAddress);

    if (parseFloat(balance) < parseFloat(request.amount)) {
      throw new Error(`Insufficient ${request.currency.symbol} balance`);
    }
  }

  /**
   * Utility function for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const paymentService = new X402PaymentService();