import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatAmount(amount: string, decimals: number = 4): string {
  const num = parseFloat(amount);
  if (num === 0) return '0';
  if (num < 0.0001) return '< 0.0001';
  return num.toFixed(decimals);
}

export function validatePercentages(splits: { percentage: number }[]): boolean {
  const total = splits.reduce((sum, split) => sum + split.percentage, 0);
  return Math.abs(total - 100) < 0.01; // Allow for small floating point errors
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function calculateSplitAmounts(
  totalAmount: string,
  splits: { collaboratorWalletAddress: string; percentage: number }[]
): { collaboratorAddress: string; amount: string }[] {
  const total = parseFloat(totalAmount);
  
  return splits.map(split => ({
    collaboratorAddress: split.collaboratorWalletAddress,
    amount: ((total * split.percentage) / 100).toString(),
  }));
}
