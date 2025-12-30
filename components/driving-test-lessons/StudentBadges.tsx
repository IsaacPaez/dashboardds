import React from "react";

interface StudentBadgesProps {
  isNew: boolean;
  isPaid: boolean;
  compact?: boolean; // For 15-min events
}

/**
 * Displays "NEW" and payment status badges for student bookings
 * Minimal inline badges that work well on colored backgrounds
 */
export default function StudentBadges({ isNew, isPaid, compact = false }: StudentBadgesProps) {
  if (!isNew && !isPaid) return null;

  return (
    <div className={`flex gap-0.5 ${compact ? 'flex-row' : 'flex-row'} items-center`}>
      {isNew && (
        <span className={`bg-yellow-400 text-black font-extrabold rounded ${compact ? 'text-[7px] px-1 py-0' : 'text-[8px] px-1.5 py-0.5'}`}>
          NEW
        </span>
      )}
      {isPaid && (
        <span className={`bg-green-500 text-white font-bold rounded ${compact ? 'text-[7px] px-1 py-0' : 'text-[8px] px-1.5 py-0.5'}`}>
          $
        </span>
      )}
    </div>
  );
}
