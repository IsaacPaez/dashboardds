/**
 * Utility functions for determining student status in driving test/lesson bookings
 */

interface StudentData {
  clerkId: string;
  name: string;
  email: string;
  createdAt?: string;
}

interface BookingEvent {
  studentId: string;
  status: string;
  date: string;
  classType?: string;
}

/**
 * Determines if a student should be marked as "NEW"
 * A student is NEW if:
 * - They have only 1 booking (current one), OR
 * - Account created <30 days ago AND <3 total bookings
 *
 * @param studentId - The student's ID
 * @param allEvents - All calendar events (lessons + tests)
 * @param studentData - Optional student account data
 * @returns true if student should display "NEW" badge
 */
export function isNewStudent(
  studentId: string,
  allEvents: BookingEvent[],
  studentData?: StudentData
): boolean {
  if (!studentId) return false;

  // Count total bookings for this student (booked or pending status)
  const studentBookings = allEvents.filter(
    (event) =>
      event.studentId === studentId &&
      (event.status === "booked" || event.status === "pending")
  );

  const totalBookings = studentBookings.length;

  // First booking ever = NEW
  if (totalBookings <= 1) {
    return true;
  }

  // Check account age if data available
  if (studentData?.createdAt) {
    const accountCreatedAt = new Date(studentData.createdAt);
    const daysSinceCreation = Math.floor(
      (Date.now() - accountCreatedAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Account <30 days old AND <3 bookings = NEW
    if (daysSinceCreation < 30 && totalBookings < 3) {
      return true;
    }
  }

  return false;
}

/**
 * Formats an address string for display in compact spaces
 * Extracts the street address and city from Google Maps formatted address
 *
 * @param fullAddress - Full Google Maps formatted address
 * @param maxLength - Maximum character length (default 40)
 * @returns Shortened address string
 */
export function formatAddress(fullAddress: string, maxLength: number = 40): string {
  if (!fullAddress) return "";

  // Google Maps format: "123 Main St, City, State ZIP, Country"
  // We want: "123 Main St, City"
  const parts = fullAddress.split(",").map((part) => part.trim());

  if (parts.length >= 2) {
    const shortAddress = `${parts[0]}, ${parts[1]}`;
    return shortAddress.length > maxLength
      ? shortAddress.substring(0, maxLength - 3) + "..."
      : shortAddress;
  }

  // Fallback: truncate full address
  return fullAddress.length > maxLength
    ? fullAddress.substring(0, maxLength - 3) + "..."
    : fullAddress;
}

/**
 * Truncates student name for compact display
 *
 * @param fullName - Student's full name
 * @param maxLength - Maximum character length
 * @returns Truncated name
 */
export function truncateName(fullName: string, maxLength: number = 20): string {
  if (!fullName) return "Unknown";

  return fullName.length > maxLength
    ? fullName.substring(0, maxLength - 3) + "..."
    : fullName;
}
