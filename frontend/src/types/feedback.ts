export interface SkillRating {
  name: string;
  rating: number;
}

export interface Feedback {
  id: string;
  taskId: string;
  fromUser: string | {
    id: string;
    name: string;
    avatar?: string;
  };
  toUser: string | {
    id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  skillRatings: SkillRating[];
  createdAt: string;
  updatedAt?: string;
}

export interface FeedbackStats {
  averageRating: number;
  totalFeedback: number;
  skillAverages: Record<string, number>;
  ratingDistribution: Record<number, number>;
}

export interface FeedbackResponse {
  feedback: Feedback[];
  totalFeedback: number;
  totalPages: number;
  currentPage: number;
  stats?: FeedbackStats;
} 