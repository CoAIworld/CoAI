export type TransactionType = 'payment' | 'escrow' | 'platform_fee' | 'ai_contribution_fee';
export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface Transaction {
  id: string;
  from: string | {
    id: string;
    name: string;
    walletAddress: string;
  };
  to: string | {
    id: string;
    name: string;
    walletAddress: string;
  } | 'system' | 'platform';
  amount: number;
  task?: string | {
    id: string;
    title: string;
    description?: string;
    status?: string;
  };
  type: TransactionType;
  status: TransactionStatus;
  createdAt: string;
  transactionHash?: string;
  currency: 'SOL' | 'CoAI';
}

export interface TransactionResponse {
  transactions: Transaction[];
  totalTransactions: number;
  totalPages: number;
  currentPage: number;
}

export interface TransactionStatistics {
  totalTransactions: number;
  totalSpent: number;
  totalReceived: number;
  totalEscrow: number;
  totalPlatformFees: number;
  totalAiContributionFees: number;
  incomeByMonth: Record<string, number>;
  spendingByMonth: Record<string, number>;
  transactionsByType: Record<TransactionType, number>;
} 