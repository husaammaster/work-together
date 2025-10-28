/**
 * Comment domain types
 */

export interface Comment {
  _id: string;
  _rev?: string;
  proj_id: string;
  user: string;
  comment: string;
  timestamp?: number;
}

export interface CommentListResponse {
  docs: Comment[];
}
