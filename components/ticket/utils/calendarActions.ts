/**
 * Calendar action handlers (save, delete, update)
 */

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

export const deleteTicketClass = async (id: string): Promise<void> => {
  const res = await fetch(`/api/ticket/classes/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to delete class');
  }
};

export const saveTicketClass = async (data: TicketFormData): Promise<void> => {
  if (data.recurrence && data.recurrence !== 'none' && data.recurrenceEndDate) {
    await createRecurringClasses(data);
  } else {
    await createSingleClass(data);
  }
};

const createRecurringClasses = async (data: TicketFormData): Promise<void> => {
  const startDate = new Date(data.date);
  const endDate = new Date(data.recurrenceEndDate!);
  const payload: any[] = [];

  // Guardar el día de la semana original para recurrencia semanal
  const originalDayOfWeek = startDate.getDay();

  const d = new Date(startDate);
  while (d <= endDate) {
    payload.push({
      date: d.toISOString().split('T')[0],
      hour: data.hour,
      endHour: data.endHour,
      classId: data.classId,
      type: data.type,
      locationId: data.locationId,
      students: data.students,
      spots: data.spots,
      duration: data.duration,
      status: data.status || 'available',
      studentRequests: data.studentRequests || [],
    });

    // Avanzar a la siguiente fecha según el tipo de recurrencia
    if (data.recurrence === 'daily') {
      d.setDate(d.getDate() + 1);
    } else if (data.recurrence === 'weekly') {
      // Sumar 7 días
      d.setDate(d.getDate() + 7);

      // Verificar que sigue siendo el mismo día de la semana
      if (d.getDay() !== originalDayOfWeek) {
        const dayDifference = originalDayOfWeek - d.getDay();
        d.setDate(d.getDate() + dayDifference);
      }
    } else if (data.recurrence === 'monthly') {
      // Para mensual, usar setMonth en vez de sumar 30 días
      d.setMonth(d.getMonth() + 1);
    }
  }

  const response = await fetch('/api/ticket/classes/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.error || 'Failed to create recurring classes');
  }
};

const createSingleClass = async (data: TicketFormData): Promise<void> => {
  const response = await fetch('/api/ticket/classes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date: data.date,
      hour: data.hour,
      endHour: data.endHour,
      classId: data.classId,
      type: data.type,
      locationId: data.locationId,
      students: data.students,
      spots: data.spots,
      duration: data.duration,
      status: data.status || 'available',
      studentRequests: data.studentRequests || [],
    }),
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.error || 'Failed to create class');
  }
};
