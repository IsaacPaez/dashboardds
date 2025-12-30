import React from "react";
import Link from "next/link";
import StudentBadges from "./StudentBadges";
import { isNewStudent, formatAddress, truncateName } from "./utils/studentHelpers";

interface EventCardContentProps {
  event: any; // FullCalendar event object
  allEvents: any[]; // All calendar events for "NEW" determination
  studentData?: {
    clerkId: string;
    name: string;
    email: string;
    createdAt?: string;
  };
}

/**
 * Renders detailed event card content for driving test/lesson bookings
 * Adapts display based on event duration (15min, 30min, 60+min)
 * Shows student name, class type, address, NEW status, and payment status
 */
export default function EventCardContent({
  event,
  allEvents,
  studentData,
}: EventCardContentProps) {
  const extendedProps = event.extendedProps;
  const classType =
    extendedProps?.classType === "driving test" ? "Test" : "Lesson";
  const status = extendedProps?.status || "available";

  // Calculate event duration
  const startTime = new Date(event.start);
  const endTime = new Date(event.end);
  const durationMinutes =
    (endTime.getTime() - startTime.getTime()) / (1000 * 60);

  // Only show detailed info for booked/pending events
  const isBooked = status === "booked" || status === "pending";

  // Available event - simple display
  if (!isBooked) {
    return (
      <div className="w-full h-full flex flex-col justify-center px-2">
        {durationMinutes <= 30 ? (
          <>
            <div className="font-bold leading-tight text-center text-sm">{classType}</div>
            <div className="font-medium capitalize text-center text-xs opacity-90">{status}</div>
          </>
        ) : (
          <>
            <div className="font-bold leading-tight text-sm">{classType}</div>
            <div className="opacity-90 capitalize text-xs">{status}</div>
          </>
        )}
      </div>
    );
  }

  // Booked/Pending event - detailed info
  const studentName = extendedProps?.studentName || "Unknown";
  const studentId = extendedProps?.studentId;
  const isPaid = extendedProps?.paid || false;
  const pickupLocation = extendedProps?.pickupLocation;

  // Determine if student is NEW
  const isNew = isNewStudent(studentId, allEvents, studentData);

  // 15-minute events - ultra compact
  if (durationMinutes <= 15) {
    return (
      <div className="w-full h-full flex flex-col justify-center px-2 py-1">
        <div className="flex items-center justify-between gap-1">
          <Link
            href={`/customers/${studentId}`}
            className="font-bold text-[11px] leading-tight truncate flex-1 hover:underline cursor-pointer"
          >
            {truncateName(studentName, 12)}
          </Link>
          <StudentBadges isNew={isNew} isPaid={isPaid} compact={true} />
        </div>
      </div>
    );
  }

  // 30-minute events - compact with type
  if (durationMinutes <= 30) {
    return (
      <div className="w-full h-full flex flex-col justify-center px-2 py-1 gap-0.5">
        <div className="flex items-start justify-between gap-1">
          <div className="flex-1 min-w-0">
            <Link
              href={`/customers/${studentId}`}
              className="font-bold text-xs leading-tight truncate block hover:underline cursor-pointer"
            >
              {truncateName(studentName, 15)}
            </Link>
            <div className="text-[10px] opacity-80 leading-tight">{classType}</div>
          </div>
          <StudentBadges isNew={isNew} isPaid={isPaid} compact={false} />
        </div>
      </div>
    );
  }

  // 60+ minute events - full detailed display
  return (
    <div className="w-full h-full flex flex-col px-2 py-2 gap-1 relative">
      {/* Badges - fixed at top-right */}
      <div className="absolute top-1 right-1 z-10">
        <StudentBadges isNew={isNew} isPaid={isPaid} compact={false} />
      </div>

      {/* Student Name - with top padding to avoid badges */}
      <div className="pt-3">
        <Link
          href={`/customers/${studentId}`}
          className="font-bold text-sm leading-tight block hover:underline cursor-pointer pr-12"
        >
          {truncateName(studentName, 20)}
        </Link>
      </div>

      {/* Class Type */}
      <div className="text-xs font-semibold opacity-90">
        {classType}
      </div>

      {/* Address (for lessons only) - Clean text without emojis */}
      {classType === "Lesson" && pickupLocation && (
        <div className="text-[10px] opacity-75 leading-tight">
          <div className="truncate">
            {formatAddress(pickupLocation, 30)}
          </div>
        </div>
      )}

      {/* Amount (for tests) */}
      {classType === "Test" && extendedProps?.amount && (
        <div className="font-bold text-xs">
          ${extendedProps.amount}
        </div>
      )}

      {/* Status at bottom */}
      <div className="text-[9px] opacity-60 capitalize mt-auto">
        {status}
      </div>
    </div>
  );
}
