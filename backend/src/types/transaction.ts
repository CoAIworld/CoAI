export type TransactionType = 'payment' | 'escrow' | 'platform_fee' | 'ai_contribution_fee';
export type TransactionStatus = 'pending' | 'completed' | 'failed';
export type Currency = 'SOL' | 'CoAI';

export interface TransactionDocument {
  _id: string;
  from: string; // User ID reference
  to: string; // User ID reference or 'system' | 'platform'
  amount: number;
  task?: string; // Task ID reference
  type: TransactionType;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
  transactionHash?: string;
  currency: Currency;
  metadata?: Record<string, any>;
}

export interface TransactionCreateInput {
  from: string;
  to: string;
  amount: number;
  task?: string;
  type: TransactionType;
  currency: Currency;
  transactionHash?: string;
  metadata?: Record<string, any>;
}

export interface TransactionFilterOptions {
  userId?: string;
  taskId?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  currency?: Currency;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  skip?: number;
} 