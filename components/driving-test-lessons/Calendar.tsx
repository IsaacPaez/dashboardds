"use client";

import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ScheduleModal from "./ScheduleModal";
import Loader from "@/components/custom ui/Loader";
import EventCardContent from "./EventCardContent";

interface CalendarProps {
  selectedInstructor?: any;
  targetDate?: string | null;
  targetType?: string | null;
  targetEventId?: string | null;
}

const Calendar: React.FC<CalendarProps> = ({ selectedInstructor, targetDate, targetType, targetEventId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const calendarRef = useRef<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedEventIds, setSelectedEventIds] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Clipboard para copiar/pegar eventos
  const clipboardKey = 'driving_schedule_clipboard';

  const fetchEvents = async () => {
    if (!selectedInstructor) {
      setEvents([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/driving-test-lessons/events?instructorId=${selectedInstructor._id}`);
      
      if (response.ok) {
        const data = await response.json();
        
        const formattedEvents = data.map((event: any) => ({
          ...event,
          title: formatEventTitle(event),
          backgroundColor: event.backgroundColor,
          borderColor: event.borderColor,
        }));
        
        setEvents(formattedEvents || []);
      } else {
        const errorData = await response.json();
        console.error("Failed to fetch events:", errorData);
        setError("Failed to load calendar events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Error loading calendar events");
    } finally {
      setLoading(false);
    }
  };

  const formatEventTitle = (event: any) => {
    const classType = event.classType === 'driving test' ? 'Driving Test' : 'Driving Lesson';
    const status = event.status;
    
    let title = `${classType} - ${status}`;
    
    if ((status === 'booked' || status === 'pending') && event.studentName) {
      title += ` (${event.studentName})`;
    }
    
    if (event.classType === 'driving test' && event.amount) {
      title += ` - $${event.amount}`;
    }
    
    return title;
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedInstructor?._id]);

  useEffect(() => {
    if (targetDate && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(targetDate);

      if (targetEventId) {
        setTimeout(() => {
          const targetEventElement = document.querySelector(`[data-event-id="${targetEventId}"]`) ||
                                  document.querySelector(`a[href*="${targetEventId}"]`) ||
                                  document.querySelector(`.fc-event[data-event-id="${targetEventId}"]`);

          if (targetEventElement) {
            targetEventElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetEventElement.classList.add('highlight-notification-event');

            setTimeout(() => {
              targetEventElement.classList.remove('highlight-notification-event');
            }, 5000);
          } else {
            const targetDateElement = document.querySelector(`[data-date="${targetDate}"]`);
            if (targetDateElement) {
              targetDateElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        }, 500);
      } else {
        setTimeout(() => {
          const targetDateElement = document.querySelector(`[data-date="${targetDate}"]`);
          if (targetDateElement) {
            targetDateElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  }, [targetDate, targetType, targetEventId, events]);
  useEffect(() => {
    function handlePaste(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === 'v' && isModalOpen && selectedDate && selectedTime) {
        const clipboard = window.localStorage.getItem(clipboardKey);
        if (!clipboard) return;
        try {
          // The modal will automatically detect pasted data
        } catch (err) {
          console.error('Error pasting event:', err);
          alert('Error pasting event.');
        }
      }
    }
    window.addEventListener('keydown', handlePaste);
    return () => window.removeEventListener('keydown', handlePaste);
  }, [isModalOpen, selectedDate, selectedTime, clipboardKey]);


  const handleDateSelect = (selectInfo: any) => {
    try {
      if (!selectInfo || !selectInfo.start) {
        console.error("Invalid select info");
        return;
      }

      const start = selectInfo.start;
      const dateStr = start.toISOString().split('T')[0];
      const timeStr = start.toTimeString().slice(0, 5);
      
      setSelectedDate(dateStr);
      setSelectedTime(timeStr);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error handling date select:", error);
      setError("Error selecting date");
    }
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
      } else {
        eventEl.style.outline = '';
        eventEl.style.outlineOffset = '';
      }
    }
  };

  const handleEventClick = (clickInfo: any) => {
    try {
      // Check if the event is in the past
      const eventStart = clickInfo.event.start;
      const now = new Date();
      const isPastEvent = eventStart < now;

      // Check if the click was on the checkbox
      const clickedElement = (clickInfo.jsEvent.target as HTMLElement);
      const isCheckboxClick = clickedElement.classList.contains('selection-checkbox') || 
                             clickedElement.closest('.selection-checkbox');

      // If clicking checkbox, toggle selection
      if (isCheckboxClick) {
        clickInfo.jsEvent.preventDefault();
        clickInfo.jsEvent.stopPropagation();
        
        const eventId = clickInfo.event.id;
        const newSelected = new Set(selectedEventIds);
        const isNowSelected = !newSelected.has(eventId);
        
        if (newSelected.has(eventId)) {
          newSelected.delete(eventId);
        } else {
          newSelected.add(eventId);
        }
        setSelectedEventIds(newSelected);
        
        // Update checkbox immediately
        updateCheckbox(eventId, isNowSelected);
        return;
      }

      const eventData = {
        _id: clickInfo.event.id,
        title: clickInfo.event.title,
        start: clickInfo.event.start.toISOString(),
        end: clickInfo.event.end.toISOString(),
        classType: clickInfo.event.extendedProps?.classType,
        isPast: isPastEvent, // Flag to indicate if event is in the past
        extendedProps: {
          classType: clickInfo.event.extendedProps?.classType,
          status: clickInfo.event.extendedProps?.status,
          amount: clickInfo.event.extendedProps?.amount,
          studentId: clickInfo.event.extendedProps?.studentId,
          studentName: clickInfo.event.extendedProps?.studentName,
          paid: clickInfo.event.extendedProps?.paid,
          pickupLocation: clickInfo.event.extendedProps?.pickupLocation,
          dropoffLocation: clickInfo.event.extendedProps?.dropoffLocation,
          selectedProduct: clickInfo.event.extendedProps?.selectedProduct
        }
      };
      
      setSelectedEvent(eventData);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Error handling event click:", error);
    }
  };

  const handleScheduleCreated = () => {
    try {
      fetchEvents();
    } catch (error) {
      console.error("Error refreshing events:", error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDate("");
    setSelectedTime("");
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedEvent(null);
  };

  const handleEventDelete = async (eventId: string) => {
    try {
      const response = await fetch(`/api/driving-test-lessons/delete-event`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId })
      });

      if (response.ok) {
        handleEditModalClose();
        fetchEvents();
      } else {
        const error = await response.json();
        console.error("Delete failed:", error);
        alert(`Error deleting event: ${error.message}`);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Error deleting event");
    }
  };

  const handleEventUpdate = async (eventData: any) => {
    try {
      const response = await fetch(`/api/driving-test-lessons/update-event`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData)
      });

      if (response.ok) {
        handleEditModalClose();
        fetchEvents();
      } else {
        const error = await response.json();
        console.error("Update failed:", error);
        alert(`Error updating event: ${error.message}`);
      }
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Error updating event");
    }
  };

  const handleEventCopy = async (eventData: any) => {
    try {
      const response = await fetch(`/api/driving-test-lessons/copy-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData)
      });

      if (response.ok) {
        handleEditModalClose();
        fetchEvents();
        alert("Event copied successfully!");
      } else {
        const error = await response.json();
        console.error("Copy failed:", error);
        alert(`Error copying event: ${error.message}`);
      }
    } catch (error) {
      console.error("Error copying event:", error);
      alert("Error copying event");
    }
  };

  const handleSelectAll = () => {
    const allIds = new Set(events.map(event => event.id).filter(Boolean) as string[]);
    setSelectedEventIds(allIds);
    
    // Update all checkboxes
    setTimeout(() => {
      allIds.forEach(id => updateCheckbox(id, true));
    }, 0);
  };

  const handleDeselectAll = () => {
    const previousIds = Array.from(selectedEventIds);
    setSelectedEventIds(new Set());
    
    // Update all checkboxes
    setTimeout(() => {
      previousIds.forEach(id => updateCheckbox(id, false));
    }, 0);
  };

  const handleDeleteSelected = async () => {
    setShowDeleteConfirm(false);
    try {
      // Delete all selected events
      await Promise.all(
        Array.from(selectedEventIds).map(id => 
          fetch(`/api/driving-test-lessons/delete-event`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ eventId: id })
          })
        )
      );

      setSelectedEventIds(new Set());
      await fetchEvents();
    } catch (error) {
      console.error('Error deleting selected events:', error);
      alert(`Error deleting events: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const renderEventContent = (eventInfo: any) => {
    return <EventCardContent event={eventInfo.event} allEvents={events} />;
  };



  if (!selectedInstructor) {
    return (
      <div className="text-center text-gray-500 py-8">
        No instructor selected
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-800">{error}</p>
        <button 
          onClick={fetchEvents}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <style jsx global>{`
        /* Estilos principales para eventos */
        .fc .fc-timegrid-event .fc-event-main {
          padding: 6px 8px !important;
          font-size: 13px !important;
          line-height: 1.4 !important;
          white-space: normal !important;
          overflow: visible !important;
          word-wrap: break-word !important;
          height: auto !important;
        }

        .fc .fc-timegrid-event {
          min-height: 35px !important;
          max-height: none !important;
          border-radius: 6px !important;
          overflow: visible !important;
        }

        .fc .fc-timegrid-event-harness {
          min-height: 35px !important;
          overflow: visible !important;
        }

        /* Eventos de 15 minutos - altura específica */
        .fc .fc-timegrid-event[data-duration="15"] {
          min-height: 25px !important;
          max-height: 30px !important;
        }

        .fc .fc-timegrid-event-harness[data-duration="15"] {
          min-height: 25px !important;
          max-height: 30px !important;
        }

        /* Eventos de 30 minutos - altura específica */
        .fc .fc-timegrid-event[data-duration="30"] {
          min-height: 40px !important;
          max-height: 45px !important;
        }

        .fc .fc-timegrid-event-harness[data-duration="30"] {
          min-height: 40px !important;
          max-height: 45px !important;
        }
        
        /* Eventos de 1+ horas - altura normal */
        .fc .fc-timegrid-event[data-duration="60"], 
        .fc .fc-timegrid-event[data-duration="120"] {
          min-height: 45px !important;
        }
        
        .fc .fc-timegrid-event-harness[data-duration="60"],
        .fc .fc-timegrid-event-harness[data-duration="120"] {
          min-height: 45px !important;
        }
        
        /* Texto para eventos de 15 minutos */
        .fc .fc-timegrid-event[data-duration="15"] .fc-event-main {
          padding: 2px 4px !important;
          font-size: 10px !important;
          line-height: 1.1 !important;
        }

        /* Texto para eventos de 30 minutos */
        .fc .fc-timegrid-event[data-duration="30"] .fc-event-main {
          padding: 4px 6px !important;
          font-size: 12px !important;
          line-height: 1.3 !important;
        }
        
        .fc .fc-event {
          cursor: pointer !important;
          border-width: 1px !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
        }
        
        .fc .fc-event-title {
          white-space: normal !important;
          overflow: visible !important;
          text-overflow: clip !important;
          word-wrap: break-word !important;
          line-height: 1.3 !important;
          font-weight: 500 !important;
        }
        
        /* Estilos específicos por estado */
        .fc .fc-event[data-status="booked"] .fc-event-main {
          padding: 8px 10px !important;
          min-height: 50px !important;
        }
        
        .fc .fc-event[data-status="booked"] {
          min-height: 50px !important;
        }
        
        .fc .fc-event[data-status="pending"] .fc-event-main {
          padding: 8px 10px !important;
          min-height: 50px !important;
        }
        
        .fc .fc-event[data-status="pending"] {
          min-height: 50px !important;
        }
        
        .fc .fc-event[data-status="cancelled"] .fc-event-main {
          padding: 6px 8px !important;
          min-height: 40px !important;
        }
        
        /* Hover effects */
        .fc .fc-event:hover {
          opacity: 0.9 !important;
          transform: scale(1.02) !important;
          z-index: 10 !important;
          box-shadow: 0 4px 8px rgba(0,0,0,0.15) !important;
          transition: all 0.2s ease !important;
        }
        
        /* Texto dentro de eventos */
        .fc .fc-event-main div {
          margin: 0 !important;
          padding: 0 !important;
        }
        
        .fc .fc-event-main .font-medium {
          font-weight: 600 !important;
          margin-bottom: 2px !important;
        }
        
        .fc .fc-event-main .font-semibold {
          font-weight: 700 !important;
          margin-top: 2px !important;
        }
        
        .fc .fc-event-main .truncate {
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          max-width: 100% !important;
        }
        
        /* Asegurar que los eventos largos se vean completos */
        .fc .fc-timegrid-event.fc-event-mirror {
          min-height: 45px !important;
        }
        
        .highlight-notification-event {
          animation: highlightPulse 2s ease-in-out 3;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.8) !important;
          border: 2px solid #3B82F6 !important;
          z-index: 1000 !important;
          position: relative !important;
        }
        
        @keyframes highlightPulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 30px rgba(59, 130, 246, 1);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
          }
        }

        /* Líneas divisorias - horas más marcadas que los 15 minutos */
        .fc .fc-timegrid-slot {
          border-color: #e5e7eb !important; /* Líneas de 15 min - gris claro */
          border-top-width: 1px !important;
        }

        /* Líneas ARRIBA de cada hora completa (6:00, 7:00, etc.) - MÁS MARCADAS */
        .fc .fc-timegrid-slot[data-time$=":00:00"] {
          border-top: 2px solid #9ca3af !important; /* Línea ARRIBA más gruesa y oscura */
        }

        .fc .fc-timegrid-slot-label {
          border-color: #d1d5db !important;
        }

        .fc .fc-timegrid-slot-lane {
          border-color: #e5e7eb !important; /* Líneas verticales de días */
        }

        /* Primera línea del calendario */
        .fc-timegrid-axis {
          border-top-width: 2px !important;
          border-top-color: #9ca3af !important;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .fc .fc-timegrid-event .fc-event-main {
            padding: 4px 6px !important;
            font-size: 11px !important;
          }

          .fc .fc-timegrid-event {
            min-height: 35px !important;
          }
        }

        /* Past days styling - grey out past dates */
        .fc .fc-day-past {
          background-color: #f3f4f6 !important;
        }

        .fc .fc-day-past .fc-col-header-cell-cushion {
          color: #9ca3af !important;
        }

        .fc .fc-day-past .fc-timegrid-slot {
          background-color: #f3f4f6 !important;
        }

        /* Events on past days should appear muted and non-clickable */
        .fc .fc-day-past .fc-timegrid-event {
          opacity: 0.6 !important;
          cursor: not-allowed !important;
        }

        /* Disable hover effect on past events */
        .fc .fc-day-past .fc-timegrid-event:hover {
          transform: none !important;
          box-shadow: none !important;
          opacity: 0.6 !important;
        }

        /* Past time slots on today */
        .fc .fc-day-today .fc-timegrid-slot.fc-timegrid-slot-lane {
          position: relative;
        }
      `}</style>

      <div className="relative" style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.3s' }}>
        <div className="border rounded-lg p-4">
          <FullCalendar
            ref={calendarRef}
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "timeGridWeek,timeGridDay",
            }}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            hiddenDays={[0]}
            events={events}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            eventDidMount={(info) => {
              if (info.event.id) {
                info.el.setAttribute('data-event-id', info.event.id);
              }

              // Set duration attribute for CSS styling
              if (info.event.start && info.event.end) {
                const startTime = new Date(info.event.start);
                const endTime = new Date(info.event.end);
                const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
                
                info.el.setAttribute('data-duration', durationMinutes.toString());
                
                const harness = info.el.closest('.fc-timegrid-event-harness');
                if (harness) {
                  harness.setAttribute('data-duration', durationMinutes.toString());
                }
              }

              // Add selection checkbox
              const eventId = info.event.id;
              const isSelected = eventId && selectedEventIds.has(eventId);

              if (!info.el.querySelector('.selection-checkbox')) {
                const checkbox = document.createElement('div');
                checkbox.className = 'selection-checkbox';
                checkbox.setAttribute('data-event-id', eventId || '');
                checkbox.style.cssText = `
                  position: absolute;
                  top: 4px;
                  left: 4px;
                  width: 20px;
                  height: 20px;
                  background: ${isSelected ? '#3b82f6' : 'white'};
                  border: 2px solid ${isSelected ? '#3b82f6' : '#9ca3af'};
                  border-radius: 4px;
                  z-index: 100;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 13px;
                  font-weight: bold;
                  color: white;
                  opacity: ${isSelected ? '1' : '0'};
                  transition: opacity 0.2s ease;
                  pointer-events: auto;
                `;
                if (isSelected) {
                  checkbox.innerHTML = '✓';
                }
                info.el.style.position = 'relative';
                info.el.appendChild(checkbox);
                
                // Show checkbox on hover
                info.el.addEventListener('mouseenter', () => {
                  const cb = info.el.querySelector('.selection-checkbox') as HTMLElement;
                  if (cb) {
                    cb.style.opacity = '1';
                  }
                });
                
                info.el.addEventListener('mouseleave', () => {
                  const cb = info.el.querySelector('.selection-checkbox') as HTMLElement;
                  if (cb && !isSelected) {
                    cb.style.opacity = '0';
                  }
                });
              }

              // Apply selection styles
              if (isSelected) {
                info.el.style.outline = '3px solid #3b82f6';
                info.el.style.outlineOffset = '-3px';
              }
            }}
            height="900px"
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            slotDuration="00:15:00"
            allDaySlot={false}
            slotLabelFormat={{
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }}
            eventTimeFormat={{
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }}
            eventClassNames="cursor-pointer"
            eventInteractive={true}
          />
        </div>

        {/* Selection Action Bar */}
        {selectedEventIds.size > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-white shadow-2xl rounded-lg border border-gray-200 px-6 py-4 flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              {selectedEventIds.size} {selectedEventIds.size === 1 ? 'event' : 'events'} selected
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
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Selected Events</h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete {selectedEventIds.size} selected {selectedEventIds.size === 1 ? 'event' : 'events'}?
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
        
        <ScheduleModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onScheduleCreated={handleScheduleCreated}
          selectedInstructor={selectedInstructor}
        />
        
        {/* Edit Event Modal */}
        <ScheduleModal
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          selectedInstructor={selectedInstructor}
          selectedDate={selectedEvent ? (selectedEvent.start instanceof Date 
            ? selectedEvent.start.toISOString().split('T')[0]
            : selectedEvent.start.split('T')[0]
          ) : undefined}
          selectedTime={selectedEvent ? (selectedEvent.start instanceof Date 
            ? selectedEvent.start.toTimeString().slice(0, 5)
            : selectedEvent.start.split('T')[1]?.slice(0, 5)
          ) : undefined}
          isEditMode={true}
          eventData={selectedEvent}
          onEventUpdate={handleEventUpdate}
          onEventDelete={handleEventDelete}
          onEventCopy={handleEventCopy}
        />
      </div>
    </div>
  );
};

export default Calendar; 