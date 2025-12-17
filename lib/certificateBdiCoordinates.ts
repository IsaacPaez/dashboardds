/**
 * Coordenadas específicas para certificados BDI
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

export interface FieldBdiCoordinate {
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
const POSITION_2_OFFSET = 204; // Offset para el segundo certificado (612 / 3)
const POSITION_3_OFFSET = 408; // Offset para el tercer certificado (204 * 2)

/**
 * Coordenadas para el PRIMER certificado BDI (parte superior del PDF)
 * Basado en la imagen del certificado BDI proporcionada
 */
export const POSITION_1_BDI_COORDINATES: Record<string, FieldBdiCoordinate> = {
  // Citation No (arriba a la izquierda después de "Citation No:")
  citationNumber: {
    x: 305  ,
    y: 101,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 200
  },

  // Certificate Number (arriba a la derecha después de "Certificate #:")
  certn: {
    x: 455,
    y: 118,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 100
  },

  // Driver License Number (línea 2 después de "Driver License Number:")
  licenseNumber: {
    x: 290,
    y: 112,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 200
  },

  // Driver License Number (abajo a la izquierda después de "LICENSE #")
  licenseNumber2: {
    x: 430,
    y: 209,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 200
  },

  // Course Completion Date (línea 3 después de "Course Completion Date:")
  courseDate: {
    x: 290,
    y: 123,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'left'
  },

  // Name - First Name (línea 4, parte izquierda después de "Name:")
  firstName: {
    x: 272,
    y: 136,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 120
  },

  // Last Name (línea 4, parte derecha)
  lastName: {
    x: 305,
    y: 136,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 150
  },

  // Course Location (línea 5 después de "Course Location:")
  address: {
    x: 290,
    y: 150,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 300
  },

  // Instructor Signature (abajo a la izquierda)
  instructorSignature: {
    x: 106,
    y: 198,
    fontSize: 7,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  }
};

/**
 * Coordenadas para el SEGUNDO certificado BDI (parte media del PDF)
 * Todas las Y aumentan en POSITION_2_OFFSET pixels desde position 1
 */
export const POSITION_2_BDI_COORDINATES: Record<string, FieldBdiCoordinate> = {
  citationNumber: {
    x: 305,
    y: 368,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  certn: {
    x: 457,
    y: 385,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 100
  },

  licenseNumber: {
    x: 300,
    y: 379,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  licenseNumber2: {
    x: 449,
    y: 478,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  courseDate: {
    x: 300  ,
    y: 392,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center'
  },

  firstName: {
    x: 305,
    y: 405,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'right',
    maxWidth: 120
  },

  lastName: {
    x: 315,
    y: 405,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 150
  },

  address: {
    x: 300,
    y: 418,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 300
  },

  // Instructor Signature
  instructorSignature: {
    x: 116,
    y: 470,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  }
};

/**
 * Coordenadas para el TERCER certificado BDI (parte inferior del PDF)
 * Todas las Y aumentan en POSITION_3_OFFSET pixels desde position 1
 */
export const POSITION_3_BDI_COORDINATES: Record<string, FieldBdiCoordinate> = {
  citationNumber: {
    x: 300,
    y: 635,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  certn: {
    x: 457,
    y: 653,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 100
  },

  licenseNumber: {
    x: 300,
    y: 647,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  licenseNumber2: {
    x: 449,
    y: 746,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  courseDate: {
    x: 300,
    y: 660,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center'
  },

  firstName: {
    x: 300,
    y: 672,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'right',
    maxWidth: 120
  },

  lastName: {
    x: 310,
    y: 672,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 150
  },

  address: {
    x: 300,
    y: 685,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 300
  },

  // Instructor Signature
  instructorSignature: {
    x: 130,
    y: 750,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  }
};

/**
 * Obtener coordenadas para un campo específico en una posición específica
 *
 * @param fieldKey - La clave del campo (ej: 'firstName', 'licenseNumber', etc.)
 * @param position - Número de posición: 1 (top), 2 (middle), o 3 (bottom)
 * @returns Las coordenadas del campo o undefined si no existe
 */
export function getBdiFieldCoordinates(
  fieldKey: string,
  position: 1 | 2 | 3
): FieldBdiCoordinate | undefined {
  switch (position) {
    case 1:
      return POSITION_1_BDI_COORDINATES[fieldKey];
    case 2:
      return POSITION_2_BDI_COORDINATES[fieldKey];
    case 3:
      return POSITION_3_BDI_COORDINATES[fieldKey];
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
export function getBdiPositionCoordinates(
  position: 1 | 2 | 3
): Record<string, FieldBdiCoordinate> {
  switch (position) {
    case 1:
      return POSITION_1_BDI_COORDINATES;
    case 2:
      return POSITION_2_BDI_COORDINATES;
    case 3:
      return POSITION_3_BDI_COORDINATES;
    default:
      return POSITION_1_BDI_COORDINATES;
  }
}
