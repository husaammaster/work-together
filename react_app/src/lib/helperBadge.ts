/**
 * Colour for the helper-count badge, relative to the project's required helpers:
 *   - no helpers yet        → red    (badge-error)
 *   - some, but not full     → orange (badge-warning)
 *   - full or over-subscribed → green (badge-success)
 */
export function helperBadgeColor(count: number, maxHelpers: number): string {
  if (count <= 0) return "badge-error";
  if (count >= maxHelpers) return "badge-success";
  return "badge-warning";
}
