export type AIModelType = 'text-generation' | 'image-generation' | 'code-generation' | 'translation' | 'summarization';

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  type: AIModelType;
  description: string;
  costPerRequest: number;
  available: boolean;
  parameters?: Record<string, any>;
}

export interface AIRequest {
  modelId: string;
  prompt: string;
  parameters?: Record<string, any>;
  taskId?: string;
}

export interface AIResponse {
  id: string;
  requestId: string;
  modelId: string;
  userId: string;
  content: string;
  createdAt: string;
  cost: number;
  taskId?: string;
  parameters?: Record<string, any>;
}

export interface AIContribution {
  id: string;
  taskId: string;
  requestId: string;
  modelId: string;
  cost: number;
  content: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  rejection?: {
    reason: string;
    rejectedBy: string;
    rejectedAt: string;
  };
}

export interface AIStatistics {
  totalRequests: number;
  totalCost: number;
  requestsByModel: Record<string, number>;
  costByModel: Record<string, number>;
  requestsOverTime: Record<string, number>;
} 