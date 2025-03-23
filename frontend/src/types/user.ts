export interface Skill {
  name: string;
  level: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  bio?: string;
  skills: Skill[];
  reputation: number;
  tasksCompleted: number;
  tasksCreated: number;
  joinedAt: string;
  updatedAt?: string;
}

export interface UserProfile extends User {
  // Additional fields for the profile view
  averageRating?: number;
  completionRate?: number;
  totalEarned?: number;
  totalSpent?: number;
}

export interface UserStatistics {
  tasksCompleted: number;
  tasksCreated: number;
  totalEarned: number;
  totalSpent: number;
  averageRating: number;
  completionRate: number;
  averageCompletionTime: number; // in days
  mostUsedSkills: {
    name: string;
    count: number;
  }[];
  tasksByCategory: Record<string, number>;
  earningsByMonth: Record<string, number>;
  reputationHistory: Record<string, number>;
} 