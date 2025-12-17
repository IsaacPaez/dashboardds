/**
 * Coordenadas específicas para certificados Youthful Offender Class
 *
 * IMPORTANTE: Todas las coordenadas Y en este archivo son medidas DESDE ARRIBA
 * (como lo muestra la herramienta pdf-coordinate-tool.html).
 * 
 * El generador convierte automáticamente estas coordenadas a bottom-up
 * usando: pdfY = height - y (porque pdf-lib usa coordenadas bottom-up)
 *
 * Este PDF permite hasta 3 certificados por página (landscape: 792 x 612)
 * Cada certificado ocupa aproximadamente 204 pixels de altura (612 / 3)
 *
 * Para usar este sistema:
 * 1. Si hay 1 estudiante -> usar solo position1
 * 2. Si hay 2 estudiantes -> usar position1 y position2
 * 3. Si hay 3 estudiantes -> usar position1, position2 y position3
 */

export interface FieldYouthfulOffenderCoordinate {
  x?: number; // Opcional para checkboxes que solo usan checkboxOptions
  y?: number; // Opcional para checkboxes que solo usan checkboxOptions
  fontSize?: number;
  fontFamily?: 'Times-Roman' | 'Helvetica' | 'Courier' | 'Montserrat';
  align?: 'left' | 'center' | 'right';
  maxWidth?: number; // Para truncar texto largo
  isCheckbox?: boolean; // Si es un checkbox
  checkboxOptions?: Array<{
    value: string;
    x: number;
    y: number;
  }>; // Opciones del checkbox con sus coordenadas
}

// Offsets configurables para las diferentes posiciones
// Puedes modificar estos valores para ajustar el espaciado entre certificados
// Cada certificado ocupa 204 pixels (612 / 3)
const POSITION_2_OFFSET = 204; // Offset para el segundo certificado
const POSITION_3_OFFSET = 408; // Offset para el tercer certificado (204 * 2)

/**
 * Coordenadas para el PRIMER certificado Youthful Offender (parte superior del PDF)
 */
export const POSITION_1_YOUTHFUL_OFFENDER_COORDINATES: Record<string, FieldYouthfulOffenderCoordinate> = {
  // COURSE TIME - Checkboxes (4hr, 6hr, 8hr)
  courseTime: {
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    isCheckbox: true,
    checkboxOptions: [
      { value: '4 hr', x: 248, y: 81 },
      { value: '6 hr', x: 295, y: 81 },
      { value: '8 hr', x: 336, y: 81 }
    ]
  },

  // Citation/Case No
  citationNumber: {
    x: 140,
    y: 97,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  // Court
  court: {
    x: 251,
    y: 97,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 100
  },

  // County
  county: {
    x: 377  ,
    y: 97,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  // NAME - First
  firstName: {
    x: 140,
    y: 133,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 120
  },

  // NAME - MI (Middle Initial)
  middleName: {
    x: 280,
    y: 133,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 30
  },

  // NAME - Last
  lastName: {
    x: 420,
    y: 133,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 150
  },

  // Driver License Number
  licenseNumber: {
    x: 178,
    y: 161,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  // Course Completion Date
  courseDate: {
    x: 372,
    y: 161,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center'
  },

  // Instructor's Signature (imagen)
  instructorSignature: {
    x: 120,
    y: 172,
    fontSize: 0, // Es una imagen, no texto
    align: 'center',
    maxWidth: 150
  },

  // Instructor's School Name
  instructorSchoolName: {
    x: 450,
    y: 174,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 150
  },

  // ATTENDANCE - Checkboxes (Court Order / Volunteer / Ticket)
  attendanceReason: {
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    isCheckbox: true,
    checkboxOptions: [
      { value: 'Court Order', x:296, y: 116 },
      { value: 'Volunteer', x: 364, y: 116 },
      { value: 'Ticket/Citation', x: 448, y: 116 }
    ]
  },

  // Certificate Number
  certn: {
    x: 545,
    y: 85,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 100
  }
};

/**
 * Coordenadas para el SEGUNDO certificado Youthful Offender (parte media del PDF)
 * Todas las Y aumentan en POSITION_2_OFFSET pixels desde position 1
 */
export const POSITION_2_YOUTHFUL_OFFENDER_COORDINATES: Record<string, FieldYouthfulOffenderCoordinate> = {
  courseTime: {
    fontSize: POSITION_1_YOUTHFUL_OFFENDER_COORDINATES.courseTime.fontSize,
    fontFamily: POSITION_1_YOUTHFUL_OFFENDER_COORDINATES.courseTime.fontFamily,
    align: POSITION_1_YOUTHFUL_OFFENDER_COORDINATES.courseTime.align,
    isCheckbox: true,
    checkboxOptions: [
      { value: '4 hr', x: 248, y: 142 + POSITION_2_OFFSET },
      { value: '6 hr', x: 295, y: 142 + POSITION_2_OFFSET },
      { value: '8 hr', x: 336, y: 142 + POSITION_2_OFFSET }
    ]
  },

  citationNumber: {
    x: 140,
    y: 157 + POSITION_2_OFFSET,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  court: {
    x: 251,
    y: 156 + POSITION_2_OFFSET,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 100
  },

  county: {
    x: 377,
    y: 156 + POSITION_2_OFFSET,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  firstName: {
    x: 140,
    y: 192 + POSITION_2_OFFSET,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 120
  },

  middleName: {
    x: 280,
    y: 192 + POSITION_2_OFFSET,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 30
  },

  lastName: {
    x: 420,
    y: 192 + POSITION_2_OFFSET,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 150
  },

  licenseNumber: {
    x: 178,
    y: 221 + POSITION_2_OFFSET,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  courseDate: {
    x: 372,
    y: 221 + POSITION_2_OFFSET,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center'
  },

  instructorSignature: {
    x: 120,
    y: 229 + POSITION_2_OFFSET,
    fontSize: 0,
    align: 'center',
    maxWidth: 150
  },

  instructorSchoolName: {
    x: 450,
    y: 233 + POSITION_2_OFFSET,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 150
  },

  attendanceReason: {
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    isCheckbox: true,
    checkboxOptions: [
      { value: 'Court Order', x: 296, y: 176 + POSITION_2_OFFSET },
      { value: 'Volunteer', x: 364, y: 176 + POSITION_2_OFFSET },
      { value: 'Ticket/Citation', x: 448, y: 176 + POSITION_2_OFFSET }
    ]
  },

  certn: {
    x: 545,
    y: 156 + POSITION_2_OFFSET,
    fontSize: 10,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 100
  }
};

/**
 * Coordenadas para el TERCER certificado Youthful Offender (parte inferior del PDF)
 * Todas las Y aumentan en POSITION_3_OFFSET pixels desde position 1
 */
export const POSITION_3_YOUTHFUL_OFFENDER_COORDINATES: Record<string, FieldYouthfulOffenderCoordinate> = {
  courseTime: {
    fontSize: POSITION_1_YOUTHFUL_OFFENDER_COORDINATES.courseTime.fontSize,
    fontFamily: POSITION_1_YOUTHFUL_OFFENDER_COORDINATES.courseTime.fontFamily,
    align: POSITION_1_YOUTHFUL_OFFENDER_COORDINATES.courseTime.align,
    isCheckbox: true,
    checkboxOptions: [
      { value: '4 hr', x: 248, y: 203 + POSITION_3_OFFSET },
      { value: '6 hr', x: 295, y: 203 + POSITION_3_OFFSET },
      { value: '8 hr', x: 336, y: 203 + POSITION_3_OFFSET }
    ]
  },

  citationNumber: {
    x: 140,
    y: 216 + POSITION_3_OFFSET,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  court: {
    x: 251,
    y: 216 + POSITION_3_OFFSET,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 100
  },

  county: {
    x: 377,
    y: 216 + POSITION_3_OFFSET,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  firstName: {
    x: 140,
    y: 252+ POSITION_3_OFFSET,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 120
  },

  middleName: {
    x: 280,
    y: 252 + POSITION_3_OFFSET,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 30
  },

  lastName: {
    x: 420,
    y: 252 + POSITION_3_OFFSET,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 150
  },

  licenseNumber: {
    x: 178,
    y: 286 + POSITION_3_OFFSET,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  courseDate: {
    x: 372,
    y: 286 + POSITION_3_OFFSET,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center'
  },

  instructorSignature: {
    x: 120,
    y: 292 + POSITION_3_OFFSET,
    fontSize: 0,
    align: 'center',
    maxWidth: 150
  },

  instructorSchoolName: {
    x: 450,
    y: 294 + POSITION_3_OFFSET,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 150
  },

  attendanceReason: {
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    isCheckbox: true,
    checkboxOptions: [
      { value: 'Court Order', x: 296, y: 116 + POSITION_3_OFFSET },
      { value: 'Volunteer', x: 364, y: 116 + POSITION_3_OFFSET },
      { value: 'Ticket/Citation', x: 448, y: 250 + POSITION_3_OFFSET }
    ]
  },

  certn: {
    x: 545,
    y: 208 + POSITION_3_OFFSET,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 100
  }
};

/**
 * Obtener coordenadas para un campo específico en una posición específica
 *
 * @param fieldKey - La clave del campo (ej: 'firstName', 'licenseNumber', etc.)
 * @param position - Número de posición: 1 (top), 2 (middle), o 3 (bottom)
 * @returns Las coordenadas del campo o undefined si no existe
 */
export function getYouthfulOffenderFieldCoordinates(
  fieldKey: string,
  position: 1 | 2 | 3
): FieldYouthfulOffenderCoordinate | undefined {
  switch (position) {
    case 1:
      return POSITION_1_YOUTHFUL_OFFENDER_COORDINATES[fieldKey];
    case 2:
      return POSITION_2_YOUTHFUL_OFFENDER_COORDINATES[fieldKey];
    case 3:
      return POSITION_3_YOUTHFUL_OFFENDER_COORDINATES[fieldKey];
    default:
      return undefined;
  }
}

/**
 * Obtener todas las coordenadas para una posición específica
 *
 * @param position - Número de posición: 1 (top), 2 (middle), o 3 (bottom)
 * @returns Objeto con todas las coordenadas de esa posición
 */
export function getYouthfulOffenderPositionCoordinates(
  position: 1 | 2 | 3
): Record<string, FieldYouthfulOffenderCoordinate> {
  switch (position) {
    case 1:
      return POSITION_1_YOUTHFUL_OFFENDER_COORDINATES;
    case 2:
      return POSITION_2_YOUTHFUL_OFFENDER_COORDINATES;
    case 3:
      return POSITION_3_YOUTHFUL_OFFENDER_COORDINATES;
    default:
      return POSITION_1_YOUTHFUL_OFFENDER_COORDINATES;
  }
}
