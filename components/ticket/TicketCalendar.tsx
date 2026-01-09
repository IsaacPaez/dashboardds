/**
 * Simplified and Responsive TicketCalendar Component
 * Refactored to be under 250 lines with better mobile support
 */

import { Card, CardContent } from "@/components/ui/card";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { useState, useEffect } from "react";
import ScheduleModal from "./ScheduleModal";
import { TicketCalendarHeader } from "./TicketCalendarHeader";
import { TicketCalendarContent } from "./TicketCalendarContent";
import { useTicketCalendarData } from "./hooks/useTicketCalendarData";
import { highlightEventById } from "./utils/eventHighlighter";
import { deleteTicketClass, saveTicketClass } from "./utils/calendarActions";
import type { TicketClassResponse } from "./utils/calendarHelpers";

interface TicketFormData {
  _id?: string;
  date: string;
  hour: string;
  endHour: string;
  type: string;
  status: string;
  students: string[];
  spots: number;
  classId?: string;
  duration?: string;
  locationId?: string;
  studentRequests?: string[];
  recurrence?: string;
  recurrenceEndDate?: string;
}

interface TicketCalendarProps {
  className?: string;
  refreshKey?: number;
  classType?: string;
  focusClassId?: string | null;
  focusWeek?: number;
  focusYear?: number;
  highlightEventId?: string | null;
}

const TicketCalendar = ({
  className,
  refreshKey = 0,
  classType: propClassType,
  focusClassId,
  focusWeek,
  focusYear,
  highlightEventId
}: TicketCalendarProps) => {
  const classType = propClassType || "date";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TicketFormData | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [selectedClassIds, setSelectedClassIds] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    calendarEvents,
    classes,
    students,
    locations,
    isLoading,
    refreshCalendar
  } = useTicketCalendarData(classType, refreshKey);

  // Set default location
  useEffect(() => {
    if (locations.length > 0 && !selectedLocationId) {
      setSelectedLocationId(locations[0]._id);
    }
  }, [locations]);

  // Handle event highlighting from notifications
  useEffect(() => {
    const targetId = highlightEventId || focusClassId;
    if (targetId && calendarEvents.length > 0) {
      highlightEventById(targetId);
    }
  }, [highlightEventId, focusClassId, calendarEvents]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const startDate = selectInfo.start;
    const endDate = selectInfo.end;

    setSelectedSlot({
      date: startDate.toISOString().split('T')[0],
      hour: startDate.toTimeString().slice(0, 5),
      endHour: endDate.toTimeString().slice(0, 5),
      type: classType,
      status: "available",
      students: [],
      spots: 30,
      classId: focusClassId || "",
      duration: "2h",
      locationId: selectedLocationId,
      studentRequests: [],
    });
    setIsModalOpen(true);
  };

  /**
   * Updates the visual state of a checkbox when selection changes
   */
  const updateCheckbox = (eventId: string, isSelected: boolean) => {
    const eventElement = document.querySelector(`[data-event-id="${eventId}"]`);
    if (eventElement) {
      const checkbox = eventElement.querySelector('.selection-checkbox') as HTMLElement;
      if (checkbox) {
        checkbox.style.background = isSelected ? '#3b82f6' : 'white';
        checkbox.style.borderColor = isSelected ? '#3b82f6' : '#9ca3af';
        checkbox.style.opacity = '1';
        checkbox.innerHTML = isSelected ? '✓' : '';
      }
      
      // Update outline
      const eventEl = eventElement as HTMLElement;
      if (isSelected) {
        eventEl.style.outline = '3px solid #3b82f6';
        eventEl.style.outlineOffset = '-3px';
        eventEl.style.opacity = '0.9';
      } else {
        eventEl.style.outline = '';
        eventEl.style.outlineOffset = '';
        eventEl.style.opacity = '1';
      }
    }
  };

  const handleEventClick = (eventInfo: EventClickArg) => {
    const ticketClass = eventInfo.event.extendedProps.ticketClass as TicketClassResponse;
    if (!ticketClass) return;

    // Check if the click was on the checkbox
    const clickedElement = (eventInfo.jsEvent.target as HTMLElement);
    const isCheckboxClick = clickedElement.classList.contains('selection-checkbox') || 
                           clickedElement.closest('.selection-checkbox');

    // If clicking checkbox, toggle selection
    if (isCheckboxClick) {
      eventInfo.jsEvent.preventDefault();
      eventInfo.jsEvent.stopPropagation();
      
      const newSelected = new Set(selectedClassIds);
      const isNowSelected = !newSelected.has(ticketClass._id);
      
      if (newSelected.has(ticketClass._id)) {
        newSelected.delete(ticketClass._id);
      } else {
        newSelected.add(ticketClass._id);
      }
      setSelectedClassIds(newSelected);
      
      // Update checkbox immediately
      updateCheckbox(ticketClass._id, isNowSelected);
      return;
    }

    // Normal click: open modal
    setSelectedSlot({
      _id: ticketClass._id,
      date: ticketClass.date?.slice(0, 10) || "",
      hour: ticketClass.hour || "",
      endHour: ticketClass.endHour || "",
      type: ticketClass.type || "date",
      status: ticketClass.status || "available",
      students: ticketClass.students || [],
      spots: ticketClass.spots || 30,
      classId: typeof ticketClass.classId === 'string'
        ? ticketClass.classId
        : ticketClass.classId?._id || "",
      duration: ticketClass.duration || "2h",
      locationId: typeof ticketClass.locationId === 'string'
        ? ticketClass.locationId
        : ticketClass.locationId?._id || "",
      studentRequests: ticketClass.studentRequests || [],
    });
    setIsModalOpen(true);
  };

  const handleModalDelete = async (id: string) => {
    try {
      await deleteTicketClass(id);
      setIsModalOpen(false);
      await refreshCalendar();
    } catch (error) {
      console.error('Error deleting class:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleModalSave = async (data: TicketFormData) => {
    try {
      await saveTicketClass(data);
      // Small delay to ensure API processing is complete
      setTimeout(async () => {
        await refreshCalendar();
      }, 100);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving class:', error);
      throw error;
    }
  };

  const handleSelectAll = () => {
    const allIds = new Set(calendarEvents.map(event => event.extendedProps?.ticketClass?._id).filter(Boolean) as string[]);
    setSelectedClassIds(allIds);
    
    // Update all checkboxes
    setTimeout(() => {
      allIds.forEach(id => updateCheckbox(id, true));
    }, 0);
  };

  const handleDeselectAll = () => {
    const previousIds = Array.from(selectedClassIds);
    setSelectedClassIds(new Set());
    
    // Update all checkboxes
    setTimeout(() => {
      previousIds.forEach(id => updateCheckbox(id, false));
    }, 0);
  };

  const handleDeleteSelected = async () => {
    setShowDeleteConfirm(false);
    try {
      // Delete all selected classes
      await Promise.all(
        Array.from(selectedClassIds).map(id => deleteTicketClass(id))
      );

      setSelectedClassIds(new Set());
      await refreshCalendar();
    } catch (error) {
      console.error('Error deleting selected classes:', error);
      alert(`Error deleting classes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <>
      <Card className={className}>
        <TicketCalendarHeader
          classType={classType}
          eventsCount={calendarEvents.length}
          locations={locations}
          selectedLocationId={selectedLocationId}
          onLocationChange={setSelectedLocationId}
        />

        <CardContent className="p-3 sm:p-6">
          <TicketCalendarContent
            events={calendarEvents}
            isLoading={isLoading}
            onDateSelect={handleDateSelect}
            onEventClick={handleEventClick}
            focusWeek={focusWeek}
            focusYear={focusYear}
            focusClassId={focusClassId}
            selectedClassIds={selectedClassIds}
          />
        </CardContent>
      </Card>

      {/* Selection Action Bar */}
      {selectedClassIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-white shadow-2xl rounded-lg border border-gray-200 px-6 py-4 flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">
            {selectedClassIds.size} {selectedClassIds.size === 1 ? 'class' : 'classes'} selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleSelectAll}
              className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md transition-colors"
            >
              Select All
            </button>
            <button
              onClick={handleDeselectAll}
              className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
            >
              Deselect All
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-3 py-1.5 text-sm bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Selected Classes</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete {selectedClassIds.size} selected {selectedClassIds.size === 1 ? 'class' : 'classes'}?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSelected}
                className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && selectedSlot && (
        <ScheduleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleModalSave}
          onDelete={handleModalDelete}
          onUpdate={refreshCalendar}
          initialData={selectedSlot}
          locations={locations}
          classes={classes}
          students={students}
          selectedLocationId={selectedLocationId}
        />
      )}
    </>
  );
};

export default TicketCalendar;
