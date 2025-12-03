"use client";

import { Student } from "../columns";
import { useCallback } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { getDatePositionCoordinates } from "@/lib/certificateDateCoordinates";

export interface DateCertificateData {
  studentName: string;
  birthDate: string;
  certificateNumber: string;
  courseDate: string;
}

export function useDateCertificateGenerator() {
  const generateDateCertificate = useCallback(async (data: DateCertificateData) => {
    try {
      const pdfTemplatePath = '/templates_certificates/date.pdf';

      // Cargar el template PDF
      const templateResponse = await fetch(pdfTemplatePath);
      if (!templateResponse.ok) {
        throw new Error(`Failed to load PDF template: ${pdfTemplatePath}`);
      }

      const templateBytes = await templateResponse.arrayBuffer();
      const pdfDoc = await PDFDocument.load(templateBytes);

      // Obtener la primera página
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { height } = firstPage.getSize();

      // Cargar fuente Times-Roman
      const timesFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

      // Helper para dibujar texto centrado/izquierda/derecha con color opcional
      const drawText = (
        text: string,
        x: number,
        y: number,
        fontSize: number,
        align: 'left' | 'center' | 'right' = 'left',
        color = rgb(0, 0, 0)
      ) => {
        const textWidth = timesFont.widthOfTextAtSize(text, fontSize);
        const textHeight = timesFont.heightAtSize(fontSize);

        let finalX = x;
        if (align === 'center') {
          finalX = x - (textWidth / 2);
        } else if (align === 'right') {
          finalX = x - textWidth;
        }

        const pdfY = height - y - (textHeight / 2);

        firstPage.drawText(text, {
          x: finalX,
          y: pdfY,
          size: fontSize,
          font: timesFont,
          color,
        });
      };

      // Dibujar datos en el certificado - SOLO en posición 1 (individual)
      // Usar coordenadas de posición 1
      const coordinates = getDatePositionCoordinates(1);
      
      // studentName (centrado) - solo posición 1
      if (coordinates.studentName) {
        drawText(data.studentName, coordinates.studentName.x, coordinates.studentName.y, 14, 'center');
      }

      // birthDate (centrado) - solo posición 1
      if (data.birthDate && coordinates.birthDate) {
        drawText(data.birthDate, coordinates.birthDate.x, coordinates.birthDate.y, 14, 'center');
      }

      // certn - Certificate Number (centrado) - usar color personalizado y un poco más grande - solo posición 1
      if (data.certificateNumber && coordinates.certificateNumber) {
        // color #8e855f
        const certColor = rgb(142 / 255, 133 / 255, 95 / 255);
        drawText(data.certificateNumber, coordinates.certificateNumber.x, coordinates.certificateNumber.y, 12, 'center', certColor);
      }

      // courseDate (centrado) - solo posición 1
      if (data.courseDate && coordinates.courseDate) {
        drawText(data.courseDate, coordinates.courseDate.x, coordinates.courseDate.y, 12, 'center');
      }

      // Dibujar cuadros blancos en las posiciones 2 y 3 para tapar los certificados vacíos
      // IMPORTANTE: Dibujar los cuadros DESPUÉS del contenido para que queden encima y tapen el template
      const { width } = firstPage.getSize();
      
      // Basado en las coordenadas y el template: Posición 1 termina alrededor de Y=250
      // Necesitamos cubrir completamente desde después de posición 1 hasta el final del PDF (Y=612)
      // Usar un solo rectángulo grande que cubra todo desde Y=250 hasta Y=612
      const POSITION_1_END = 250; // Fin aproximado de posición 1
      
      // Cubrir todo desde posición 1 hasta el final del PDF (top-down: desde Y=250 hasta Y=612)
      // En coordenadas bottom-up: desde 0 hasta height-250
      firstPage.drawRectangle({
        x: 0,
        y: 0,
        width: width,
        height: height - POSITION_1_END,
        color: rgb(1, 1, 1), // Blanco
      });

      // Generar el PDF
      const pdfBytes = await pdfDoc.save();
      return new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
    } catch (error) {
      console.error('Error generating DATE certificate PDF:', error);
      throw error;
    }
  }, []);

  const generateMultipleDateCertificates = useCallback(
    async (students: Student[]) => {
      try {
        const pdfs: Blob[] = [];
        const studentsPerPage = 3;

        // Procesar estudiantes en grupos de 3
        for (let i = 0; i < students.length; i += studentsPerPage) {
          const studentsGroup = students.slice(i, i + studentsPerPage);

          // Cargar el template PDF
          const pdfTemplatePath = '/templates_certificates/date.pdf';
          const templateResponse = await fetch(pdfTemplatePath);
          if (!templateResponse.ok) {
            throw new Error(`Failed to load PDF template: ${pdfTemplatePath}`);
          }

          const templateBytes = await templateResponse.arrayBuffer();
          const pdfDoc = await PDFDocument.load(templateBytes);

          // Obtener la primera página
          const pages = pdfDoc.getPages();
          const firstPage = pages[0];
          const { height } = firstPage.getSize();

          // Cargar fuente Times-Roman
          const timesFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

          // Helper para dibujar texto centrado/izquierda/derecha con color opcional
          const drawText = (
            text: string,
            x: number,
            y: number,
            fontSize: number,
            align: 'left' | 'center' | 'right' = 'left',
            color = rgb(0, 0, 0)
          ) => {
            const textWidth = timesFont.widthOfTextAtSize(text, fontSize);
            const textHeight = timesFont.heightAtSize(fontSize);

            let finalX = x;
            if (align === 'center') {
              finalX = x - (textWidth / 2);
            } else if (align === 'right') {
              finalX = x - textWidth;
            }

            const pdfY = height - y - (textHeight / 2);

            firstPage.drawText(text, {
              x: finalX,
              y: pdfY,
              size: fontSize,
              font: timesFont,
              color,
            });
          };

          // Dibujar cada estudiante en su posición correspondiente (1, 2, o 3)
          for (let studentIndex = 0; studentIndex < studentsGroup.length; studentIndex++) {
            const student = studentsGroup[studentIndex];
            const position = (studentIndex + 1) as 1 | 2 | 3;

            // Obtener coordenadas para esta posición
            const coordinates = getDatePositionCoordinates(position);

            // Preparar datos del estudiante
            const studentName = `${student.first_name.toUpperCase()} ${student.last_name.toUpperCase()}`;
            const birthDate = student.birthDate 
              ? new Date(student.birthDate).toLocaleDateString('en-US')
              : '';
            const certificateNumber = student.certn !== null && student.certn !== undefined 
              ? String(student.certn)
              : '';
            const courseDate = student.courseDate
              ? new Date(student.courseDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  timeZone: 'UTC'
                })
              : '';

            // Dibujar cada campo en su posición
            if (coordinates.studentName) {
              drawText(studentName, coordinates.studentName.x, coordinates.studentName.y, 10, 'left');
            }

            if (coordinates.birthDate && birthDate) {
              drawText(birthDate, coordinates.birthDate.x, coordinates.birthDate.y, 9, 'left');
            }

            if (coordinates.certificateNumber && certificateNumber) {
              // Slightly larger font and custom color for certificate number (#8e855f)
              const certColor = rgb(142 / 255, 133 / 255, 95 / 255);
              drawText(certificateNumber, coordinates.certificateNumber.x, coordinates.certificateNumber.y, 12, 'left', certColor);
            }

            if (coordinates.courseDate && courseDate) {
              drawText(courseDate, coordinates.courseDate.x, coordinates.courseDate.y, 9, 'left');
            }
          }

          // Si hay menos de 3 estudiantes, dibujar cuadros blancos en las posiciones vacías
          // DATE usa coordenadas desde arriba
          // Basado en el código: Posición 1 (Y=125-210), Posición 2 (Y=405-490), Posición 3 (Y=680+)
          // El PDF tiene altura 612 (landscape)
          // Aumentar los valores para cubrir más área
          if (studentsGroup.length < 3) {
            const { width } = firstPage.getSize();
            // Ajustar los valores: bajar un poco más (aumentar Y para empezar más abajo)
            // Posición 1 termina alrededor de Y=210, Posición 2 empieza en Y=405
            // Posición 2 termina alrededor de Y=490, Posición 3 empieza en Y=680 (ajustado para PDF de 612)
            const POSITION_2_START = 270; // Bajado un poco más (aumentado Y)
            const POSITION_2_END = 545;    // Bajado un poco más (aumentado Y)
            const POSITION_3_START = 545; // Bajado un poco más (aumentado Y)
            
            // Dibujar cuadro blanco para posición 2 si falta
            if (studentsGroup.length === 1) {
              // Cubrir posición 2 (middle): desde Y=200 hasta Y=550 (top-down)
              // En coordenadas bottom-up: desde height-550 hasta height-200
              firstPage.drawRectangle({
                x: 0,
                y: height - POSITION_2_END,
                width: width,
                height: POSITION_2_END - POSITION_2_START,
                color: rgb(1, 1, 1), // Blanco
              });
              
              // Cubrir posición 3 (bottom): desde Y=550 hasta Y=612 (top-down)
              // En coordenadas bottom-up: desde 0 hasta height-550
              firstPage.drawRectangle({
                x: 0,
                y: 0,
                width: width,
                height: height - POSITION_3_START,
                color: rgb(1, 1, 1), // Blanco
              });
            } else if (studentsGroup.length === 2) {
              // Solo cubrir posición 3 (bottom): desde Y=550 hasta Y=612
              firstPage.drawRectangle({
                x: 0,
                y: 0,
                width: width,
                height: height - POSITION_3_START,
                color: rgb(1, 1, 1), // Blanco
              });
            }
          }

          // Guardar el PDF con los 3 estudiantes (o menos si es el último grupo)
          const pdfBytes = await pdfDoc.save();
          pdfs.push(new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' }));
        }

        return pdfs;
      } catch (error) {
        console.error('Error generating multiple DATE certificates:', error);
        throw error;
      }
    },
    []
  );

  return {
    generateDateCertificate,
    generateMultipleDateCertificates,
  };
}
