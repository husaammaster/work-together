/**
 * Helper domain types
 */

export interface Helper {
  _id: string;
  _rev?: string;
  proj_id: string;
  nutzer: string;
}

export interface HelperListResponse {
  docs: Helper[];
}
