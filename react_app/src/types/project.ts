/**
 * Project domain types
 */

export interface Project {
  _id: string;
  _rev?: string;
  nutzer: string;
  proj_name: string;
  description: string;
  maxHelpers: number;
  items: string[];
  /** Live counts attached by the backend (and kept in sync over WebSocket). */
  helperCount?: number;
  commentCount?: number;
}

export interface ProjectListResponse {
  docs: Project[];
}

export interface ProjectDetailResponse {
  _id: string;
  _rev?: string;
  nutzer: string;
  proj_name: string;
  description: string;
  maxHelpers: number;
  items: string[];
}
