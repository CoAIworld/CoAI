export interface Skill {
  name: string;
  rating?: number;
  endorsements?: number;
}

export interface UserDocument {
  _id: string;
  name: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: string;
  walletAddress?: string;
  skills: Skill[];
  rating: number;
  taskStats: {
    posted: number;
    completed: number;
    cancelled: number;
    inProgress: number;
  };
  transactionStats: {
    sent: number;
    received: number;
    total: number;
  };
  isVerified: boolean;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface UserPublicProfile {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  walletAddress?: string;
  skills: Skill[];
  rating: number;
  taskStats: {
    posted: number;
    completed: number;
    inProgress: number;
  };
  isVerified: boolean;
  createdAt: Date;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
} 