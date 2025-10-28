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
