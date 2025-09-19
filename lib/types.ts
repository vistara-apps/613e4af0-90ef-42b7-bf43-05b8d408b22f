export interface Streamer {
  streamerId: string;
  displayName: string;
  walletAddress: string;
}

export interface CollaboratorGroup {
  groupId: string;
  groupName: string;
  ownerStreamerId: string;
  createdAt: Date;
  collaborators: CollaboratorSplit[];
}

export interface CollaboratorSplit {
  splitId: string;
  groupId: string;
  collaboratorWalletAddress: string;
  percentage: number;
  displayName: string;
}

export interface TipTransaction {
  transactionId: string;
  groupId: string;
  tipperWalletAddress: string;
  amount: string;
  currency: string;
  timestamp: Date;
  txHash: string;
  splits: {
    collaboratorAddress: string;
    amount: string;
  }[];
}

export interface NotificationData {
  type: 'tip_received' | 'tip_sent' | 'group_created';
  message: string;
  amount?: string;
  currency?: string;
  groupName?: string;
}

export interface AnalyticsData {
  totalTipsReceived: string;
  totalTransactions: number;
  topCollaborators: {
    address: string;
    displayName: string;
    totalAmount: string;
  }[];
  recentTransactions: TipTransaction[];
}
