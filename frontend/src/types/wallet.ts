export interface Wallet {
  address: string;
  balance: {
    sol: number;
    coai: number;
  };
  isConnected: boolean;
}

export interface WalletTransaction {
  signature: string;
  timestamp: number;
  slot: number;
  fee: number;
  amount: number;
  status: 'success' | 'failure';
  description?: string;
  type: 'incoming' | 'outgoing';
  currency: 'SOL' | 'CoAI';
}

export interface TokenPrice {
  sol: {
    usd: number;
    change24h: number;
  };
  coai: {
    usd: number;
    sol: number;
    change24h: number;
  };
}

export interface WalletState {
  wallet: Wallet | null;
  isConnecting: boolean;
  error: string | null;
  transactions: WalletTransaction[];
  isLoadingTransactions: boolean;
  transactionsError: string | null;
  tokenPrices: TokenPrice | null;
}

export interface WalletContextType {
  wallet: Wallet | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  sendSol: (recipient: string, amount: number) => Promise<string>;
  sendCoAI: (recipient: string, amount: number) => Promise<string>;
  transactions: WalletTransaction[];
  isLoadingTransactions: boolean;
  fetchTransactions: () => Promise<void>;
  tokenPrices: TokenPrice | null;
} 