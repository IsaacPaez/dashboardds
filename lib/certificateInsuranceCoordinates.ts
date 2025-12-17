/**
 * Coordenadas específicas para certificados Insurance Discount Class
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

export interface FieldInsuranceCoordinate {
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
const POSITION_2_OFFSET = 273; // Offset para el segundo certificado
const POSITION_3_OFFSET = 548; // Offset para el tercer certificado

/**
 * Coordenadas para el PRIMER certificado Insurance (parte superior del PDF)
 * Usa las mismas coordenadas que BDI
 */
export const POSITION_1_INSURANCE_COORDINATES: Record<string, FieldInsuranceCoordinate> = {
  // Citation No
  citationNumber: {
    x: 295,
    y: 97,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  // Certificate Number (al lado de "Certificate #:")
  certn: {
    x: 456,
    y: 107,
    fontSize:9,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 100
  },

  // Driver License Number (primera posición - donde estaba Certificate #)
  licenseNumber: {
    x: 295,
    y: 109,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  // Driver License Number (segunda posición - donde dice Driver License Number)
  licenseNumber2: {
    x: 457,
    y: 203,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  // Course Completion Date
  courseDate: {
    x: 295,
    y: 122,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center'
  },

  // Name (Full name)
  firstName: {
    x: 285,
    y: 135,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'right',
    maxWidth: 120
  },

  // Last Name
  lastName: {
    x: 295,
    y: 135,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 150
  },

  // Course Location
  address: {
    x: 295,
    y: 147,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 300
  },

  // Instructor Signature
  instructorSignature: {
    x: 155,
    y: 202,
    fontSize: 12,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  }
};

/**
 * Coordenadas para el SEGUNDO certificado Insurance (parte media del PDF)
 * Todas las Y aumentan en POSITION_2_OFFSET pixels desde position 1
 */
export const POSITION_2_INSURANCE_COORDINATES: Record<string, FieldInsuranceCoordinate> = {
  citationNumber: {
    x: 295,
    y: 364,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  certn: {
    x: 453,
    y: 372,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 100
  },

  licenseNumber: {
    x: 295,
    y: 375,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  licenseNumber2: {
    x: 456,
    y: 474,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  courseDate: {
    x: 295,
    y: 387,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center'
  },

  firstName: {
    x: 285,
    y: 401,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'right',
    maxWidth: 120
  },

  lastName: {
    x: 295,
    y: 401,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 150
  },

  address: {
    x: 295,
    y: 412,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 300
  },

  instructorSignature: {
    x: 140,
    y: 471,
    fontSize: 12,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  }
};

/**
 * Coordenadas para el TERCER certificado Insurance (parte inferior del PDF)
 * Todas las Y aumentan en POSITION_3_OFFSET pixels desde position 1
 */
export const POSITION_3_INSURANCE_COORDINATES: Record<string, FieldInsuranceCoordinate> = {
  citationNumber: {
    x: 295,
    y: 630,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  certn: {
    x: 450,
    y: 639,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 100
  },

  licenseNumber: {
    x: 295,
    y: 641,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  licenseNumber2: {
    x: 450,
    y: 738,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 200
  },

  courseDate: {
    x: 295,
    y: 654,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center'
  },

  firstName: {
    x: 285,
    y: 668,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'right',
    maxWidth: 120
  },

  lastName: {
    x: 295,
    y: 668,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'left',
    maxWidth: 150
  },

  address: {
    x: 295,
    y: 679,
    fontSize: 9,
    fontFamily: 'Montserrat',
    align: 'center',
    maxWidth: 300
  },

  instructorSignature: {
    x: 145,
    y: 732,
    fontSize: 12,
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
export function getInsuranceFieldCoordinates(
  fieldKey: string,
  position: 1 | 2 | 3
): FieldInsuranceCoordinate | undefined {
  switch (position) {
    case 1:
      return POSITION_1_INSURANCE_COORDINATES[fieldKey];
    case 2:
      return POSITION_2_INSURANCE_COORDINATES[fieldKey];
    case 3:
      return POSITION_3_INSURANCE_COORDINATES[fieldKey];
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
export function getInsurancePositionCoordinates(
  position: 1 | 2 | 3
): Record<string, FieldInsuranceCoordinate> {
  switch (position) {
    case 1:
      return POSITION_1_INSURANCE_COORDINATES;
    case 2:
      return POSITION_2_INSURANCE_COORDINATES;
    case 3:
      return POSITION_3_INSURANCE_COORDINATES;
    default:
      return POSITION_1_INSURANCE_COORDINATES;
  }
}
