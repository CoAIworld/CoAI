export type TaskStatus = 'open' | 'assigned' | 'in_progress' | 'under_review' | 'completed' | 'cancelled';

export interface TaskDocument {
  _id: string;
  title: string;
  description: string;
  category: string;
  requiredSkills: string[];
  price: number;
  deadline: Date;
  status: TaskStatus;
  creator: string; // User ID reference
  assignedTo?: string; // User ID reference
  applicants: {
    userId: string;
    proposal: string;
    proposedPrice: number;
    status: 'pending' | 'accepted' | 'rejected';
    appliedAt: Date;
  }[];
  submissions: {
    content: string;
    submittedAt: Date;
    feedback?: string;
    status: 'pending' | 'accepted' | 'rejected';
  }[];
  completedAt?: Date;
  aiContributions?: {
    modelId: string;
    content: string;
    cost: number;
    createdAt: Date;
  }[];
  escrowId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskCreateInput {
  title: string;
  description: string;
  category: string;
  requiredSkills: string[];
  price: number;
  deadline: Date;
}

export interface TaskUpdateInput {
  title?: string;
  description?: string;
  category?: string;
  requiredSkills?: string[];
  price?: number;
  deadline?: Date;
  status?: TaskStatus;
}

export interface TaskApplicationInput {
  proposal: string;
  proposedPrice: number;
}

export interface TaskSubmissionInput {
  content: string;
} 