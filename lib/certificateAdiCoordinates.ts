/**
 * Coordenadas específicas para certificados ADI
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

export interface FieldAdiCoordinate {
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
const POSITION_2_OFFSET = 276; // Offset para el segundo certificado
const POSITION_3_OFFSET = 552; // Offset para el tercer certificado

/**
 * Coordenadas para el PRIMER certificado ADI (parte superior del PDF)
 * Basado en la imagen del certificado ADI proporcionada
 */
export const POSITION_1_ADI_COORDINATES: Record<string, FieldAdiCoordinate> = {
  // Citation/Case No
  citationNumber: {
    x: 295,
    y: 103,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  // Certificate Number (al lado de "Certificate #:")
  certn: {
    x: 439,
    y: 110,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 100
  },

  // Driver License Number (primera posición)
  licenseNumber: {
    x: 290,
    y: 115,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  // Driver License Number (segunda posición)
  licenseNumber2: {
    x: 469,
    y: 208,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  // Course Completion Date
  courseDate: {
    x: 290,
    y:126,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center'
  },

  // Name (Full name)
  firstName: {
    x: 290,
    y: 139,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'right',
    maxWidth: 120
  },

  // Last Name
  lastName: {
    x: 296,
    y: 139,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 150
  },

  // Course Location
  address: {
    x: 290,
    y: 152,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 300
  },

  // Instructor Signature
  instructorSignature: {
    x: 130,
    y: 203,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  }
};

/**
 * Coordenadas para el SEGUNDO certificado ADI (parte media del PDF)
 * Todas las Y aumentan en POSITION_2_OFFSET pixels desde position 1
 */
export const POSITION_2_ADI_COORDINATES: Record<string, FieldAdiCoordinate> = {
  citationNumber: {
    x: 287,
    y: 371,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  certn: {
    x: 437,
    y: 381,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 100
  },

  licenseNumber: {
    x: 285,
    y: 383,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  licenseNumber2: {
    x: 467,
    y: 478,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  courseDate: {
    x: 285,
    y: 395,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center'
  },

  firstName: {
    x: 285,
    y: 407,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'right',
    maxWidth: 120
  },

  lastName: {
    x: 290,
    y: 407,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 150
  },

  address: {
    x: 285,
    y: 422,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 300
  },

  // Instructor Signature
  instructorSignature: {
    x: 116,
    y: 470,
    fontSize: 7,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  }
};

/**
 * Coordenadas para el TERCER certificado ADI (parte inferior del PDF)
 * Todas las Y aumentan en POSITION_3_OFFSET pixels desde position 1
 */
export const POSITION_3_ADI_COORDINATES: Record<string, FieldAdiCoordinate> = {
  citationNumber: {
    x: 295,
    y: 639,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  certn: {
    x: 439,
    y: 647,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 100
  },

  licenseNumber: {
    x: 285,
    y: 650,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  licenseNumber2: {
    x: 470,
    y: 747,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  courseDate: {
    x: 285,
    y: 662,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center'
  },

  firstName: {
    x: 285,
    y: 676,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'right',
    maxWidth: 120
  },

  lastName: {
    x: 290,
    y: 676,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 150
  },

  address: {
    x: 285,
    y: 688,
    fontSize: 8,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 300
  },

  // Instructor Signature
  instructorSignature: {
    x: 116,
    y: 743,
    fontSize: 7,
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
export function getAdiFieldCoordinates(
  fieldKey: string,
  position: 1 | 2 | 3
): FieldAdiCoordinate | undefined {
  switch (position) {
    case 1:
      return POSITION_1_ADI_COORDINATES[fieldKey];
    case 2:
      return POSITION_2_ADI_COORDINATES[fieldKey];
    case 3:
      return POSITION_3_ADI_COORDINATES[fieldKey];
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
export function getAdiPositionCoordinates(
  position: 1 | 2 | 3
): Record<string, FieldAdiCoordinate> {
  switch (position) {
    case 1:
      return POSITION_1_ADI_COORDINATES;
    case 2:
      return POSITION_2_ADI_COORDINATES;
    case 3:
      return POSITION_3_ADI_COORDINATES;
    default:
      return POSITION_1_ADI_COORDINATES;
  }
}
