import { User } from './user';

export type TaskStatus = 'open' | 'in_progress' | 'completed' | 'cancelled' | 'funded';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  requiredSkills: string[];
  price: number;
  deadline: string;
  status: TaskStatus;
  creator: string | {
    id: string;
    name: string;
    email?: string;
    reputation?: number;
  };
  assignedTo: string | {
    id: string;
    name: string;
    email?: string;
    reputation?: number;
  } | null;
  submissions?: TaskSubmission[];
  aiContributions?: AIContribution[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface TaskSubmission {
  id: string;
  task: string;
  user: string;
  submissionText: string;
  submissionLinks: string[];
  createdAt: string;
}

export interface TaskApplication {
  id: string;
  user: string;
  task: string;
  proposal: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface AIContribution {
  id: string;
  task: string;
  requestedBy: string;
  query: string;
  content: string;
  createdAt: string;
}

export interface TaskResponse {
  tasks: Task[];
  totalTasks: number;
  totalPages: number;
  currentPage: number;
} 