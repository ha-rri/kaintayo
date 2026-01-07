import {
  formatDistanceToNow,
  format,
  isSameYear,
  differenceInHours,
} from "date-fns";
import { enUS } from "date-fns/locale";

/**
 * Formats a date string into a "Facebook-style" relative or absolute format.
 * - < 24 Hours: "Just now", "5 mins ago", "2 hours ago"
 * - > 24 Hours (Same Year): "December 13 at 9:30 AM"
 * - > 24 Hours (Diff Year): "December 13, 2024"
 *
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatRelativeTime = (date: string | Date | undefined): string => {
  if (!date) return "";
  const d = new Date(date);
  const now = new Date();

  const hoursDiff = differenceInHours(now, d);

  // Less than 24 hours: Relative time
  if (hoursDiff < 24) {
    return formatDistanceToNow(d, { addSuffix: true, locale: enUS })
      .replace("about ", "")
      .replace("less than a minute ago", "just now");
  }

  // More than 24 hours, Same Year: "December 13 at 9:30 AM"
  if (isSameYear(d, now)) {
    return format(d, "MMMM d 'at' h:mm a");
  }

  // Different Year: "December 13, 2024"
  return format(d, "MMMM d, yyyy");
};
