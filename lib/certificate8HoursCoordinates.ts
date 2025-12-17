/**
 * Coordenadas específicas para certificados de 8 horas
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

export interface Field8HoursCoordinate {
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

/**
 * Coordenadas para el PRIMER certificado (parte superior del PDF)
 * Y: entre 100 y 201
 * X: entre 140 y 520
 */
export const POSITION_1_COORDINATES: Record<string, Field8HoursCoordinate> = {
  // COURSE TIME - Checkboxes (4hr, 8hr IDI, 8hr Aggressive, 8hr Suspension)
  courseTime: {
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    isCheckbox: true,
    checkboxOptions: [
      { value: '4hr', x: 199, y: 77 },
      { value: '8hr (IDI)', x: 257, y: 77 },
      { value: '8hr (Aggressive)', x: 320, y: 77 },
      { value: '8hr (Suspension)', x: 408, y: 77 }
    ]
  },

  // Citation/Case No
  citationNumber: {
    x: 195,
    y: 98,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 180
  },

  // Circuit Court No
  circuitCourtNo: {
    x: 387,
    y: 96,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 100
  },  

  // County
  county: {
    x: 500,
    y: 96,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 80
  },

  // ATTENDANCE - Checkboxes (Court Order / Volunteer)
  attendance: {
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    isCheckbox: true,
    checkboxOptions: [
      { value: 'Court Order', x: 288, y: 119 },
      { value: 'Volunteer', x: 356, y: 119 }
    ]
  },

  // NAME - First
  firstName: {
    x: 116,
    y: 135,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 120
  },

  // NAME - MI (Middle Initial)
  middleName: {
    x: 175,
    y: 135,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 25
  },

  // NAME - Last
  lastName: {
    x:276,
    y: 135,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 150
  },

  // Drivers License No
  licenseNumber: {
    x: 170,
    y: 167,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 180
  },

  // Completion Date (Mo, Day, Yr)
  courseDate: {
    x: 338,
    y: 167,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center'
  },

  // Instructor's Signature (imagen)
  instructorSignature: {
    x: 460,
    y: 210,
    fontSize: 0, // Es una imagen, no texto
    align: 'center',
    maxWidth: 150
  },

  // School Official
  schoolOfficial: {
    x:140,
    y: 190,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 150
  },

  // Certificate Number (campo existente: certn)
  certn: {
    x: 546,
    y: 67,
    fontSize: 12,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 100
  },

  // School Address (nuevo campo)
  schoolAddress: {
    x: 140,
    y: 202,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 300
  },

  // School Phone (nuevo campo)
  schoolPhone: {
    x: 140  ,
    y: 212,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 150
  }
};

/**
 * Coordenadas para el SEGUNDO certificado (parte media del PDF)
 * Todas las Y aumentan en 204 pixels (612 / 3)
 */
export const POSITION_2_COORDINATES: Record<string, Field8HoursCoordinate> = {
  courseTime: {
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    isCheckbox: true,
    checkboxOptions: [
      { value: '4hr', x: 195, y: 342 },
      { value: '8hr (IDI)', x: 252, y: 342 },
      { value: '8hr (Aggressive)', x: 316, y: 342 },
      { value: '8hr (Suspension)', x: 408, y: 342 }
    ]
  },

  citationNumber: {
    x: 195,
    y: 362,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 180
  },

  circuitCourtNo: {
    x: 390,
    y: 362,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 100
  },

  county: {
    x: 505,
    y: 362,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 80
  },

  attendance: {
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    isCheckbox: true,
    checkboxOptions: [
      { value: 'Court Order', x: 286, y: 384 },
      { value: 'Volunteer', x: 355, y: 383 }
    ]
  },

  firstName: {
    x: 120,
    y: 399,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 120
  },

  middleName: {
    x: 182,
    y: 399,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 25
  },

  lastName: {
    x: 276,
    y: 399,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 150
  },

  licenseNumber: {
    x: 170,
    y: 432,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 180
  },

  courseDate: {
    x: 340,
    y: 432,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center'
  },

  instructorSignature: {
    x: 470,
    y: 465,
    fontSize: 0,
    align: 'center',
    maxWidth: 150
  },

  schoolOfficial: {
    x: 136 ,
    y: 455,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 150
  },

  // Certificate Number (campo existente: certn)
  certn: {
    x: 542,
    y: 332,
    fontSize: 12,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 100
  },

  // School Address (nuevo campo)
  schoolAddress: {
    x: 136,
    y: 466,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 300
  },

  // School Phone (nuevo campo)
  schoolPhone: {
    x: 136,
    y: 478,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 150
  }
};

/**
 * Coordenadas para el TERCER certificado (parte inferior del PDF)
 * Todas las Y aumentan en 408 pixels (204 * 2)
 */
export const POSITION_3_COORDINATES: Record<string, Field8HoursCoordinate> = {
  courseTime: {
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    isCheckbox: true,
    checkboxOptions: [
      { value: '4hr', x: 200, y: 606 },
      { value: '8hr (IDI)', x: 255, y: 606 },
      { value: '8hr (Aggressive)', x: 315, y: 606 },
      { value: '8hr (Suspension)', x: 408, y: 606  }
    ]
  },

  citationNumber: {
    x: 195,
    y: 627,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 180
  },

  circuitCourtNo: {
    x: 390,
    y: 626,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 100
  },

  county: {
    x: 500,
    y: 625,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 80
  },

  attendance: {
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    isCheckbox: true,
    checkboxOptions: [
      { value: 'Court Order', x: 288, y: 648 },
      { value: 'Volunteer', x: 357, y: 648 }
    ]
  },

  firstName: {
    x: 115,
    y: 662,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 120
  },

  middleName: {
    x: 215,
    y: 662,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 25
  },

  lastName: {
    x: 300,
    y: 662,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 150
  },

  licenseNumber: {
    x: 170,
    y: 695,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 180
  },

  courseDate: {
    x: 342,
    y: 695,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center'
  },

  instructorSignature: {
    x: 465,
    y: 731,
    fontSize: 0,
    align: 'center',
    maxWidth: 150
  },

  schoolOfficial: {
    x: 145,
    y: 720,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 150
  },

  // Certificate Number (campo existente: certn)
  certn: {
    x: 545,
    y: 595,
    fontSize: 12,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 100
  },

  // School Address (nuevo campo)
  schoolAddress: {
    x: 145,
    y: 732,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 300
  },

  // School Phone (nuevo campo)
  schoolPhone: {
    x: 145,
    y: 744,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 150
  }
};

/**
 * Obtener coordenadas para un campo específico en una posición específica
 *
 * @param fieldKey - La clave del campo (ej: 'firstName', 'county', etc.)
 * @param position - Número de posición: 1 (top), 2 (middle), o 3 (bottom)
 * @returns Las coordenadas del campo o undefined si no existe
 */
export function get8HoursFieldCoordinates(
  fieldKey: string,
  position: 1 | 2 | 3
): Field8HoursCoordinate | undefined {
  switch (position) {
    case 1:
      return POSITION_1_COORDINATES[fieldKey];
    case 2:
      return POSITION_2_COORDINATES[fieldKey];
    case 3:
      return POSITION_3_COORDINATES[fieldKey];
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
export function get8HoursPositionCoordinates(
  position: 1 | 2 | 3
): Record<string, Field8HoursCoordinate> {
  switch (position) {
    case 1:
      return POSITION_1_COORDINATES;
    case 2:
      return POSITION_2_COORDINATES;
    case 3:
      return POSITION_3_COORDINATES;
    default:
      return POSITION_1_COORDINATES;
  }
}
