"use client";

import { Student } from "../columns";
import { useCallback } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import {
  getAdiFieldCoordinates,
  getAdiPositionCoordinates,
} from "@/lib/certificateAdiCoordinates";

/**
 * Generador específico para certificados ADI
 *
 * Este generador usa coordenadas exactas para cada campo en cada posición (1, 2, 3)
 * en lugar de dividir la página en filas iguales.
 *
 * Características:
 * - 1 estudiante: usa solo posición 1 (top)
 * - 2 estudiantes: usa posiciones 1 y 2 (top + middle)
 * - 3 estudiantes: usa posiciones 1, 2, y 3 (top + middle + bottom)
 */
export function useAdiCertificateGenerator() {
  /**
   * Genera un PDF con 1 estudiante en la posición 1
   */
  const generateSingleAdiCertificate = useCallback(
    async (student: Student, pdfTemplatePath: string) => {

      try {
        const pdfDoc = await PDFDocument.create();

        // Cargar el PDF template de fondo
        const templateBytes = await fetch(pdfTemplatePath).then((res) => {
          if (!res.ok) throw new Error(`Failed to load PDF: ${pdfTemplatePath}`);
          return res.arrayBuffer();
        });
        const templatePdf = await PDFDocument.load(templateBytes);
        const [templatePage] = await pdfDoc.copyPages(templatePdf, [0]);
        pdfDoc.addPage(templatePage);

        const page = pdfDoc.getPages()[0];
        const { height } = page.getSize();

        // Embed fonts
        const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);

        // Usar coordenadas de la posición 1
        const coordinates = getAdiPositionCoordinates(1);

        // Mapeo de nombres de campos (coordenadas -> base de datos)
        const fieldMapping: Record<string, string> = {
          firstName: 'first_name',
          lastName: 'last_name',
          middleName: 'midl',
          licenseNumber: 'licenseNumber',
          licenseNumber2: 'licenseNumber', // Segunda aparición del mismo número
          citationNumber: 'citationNumber',
          courseDate: 'courseDate',
          certn: 'certn', // Certificate number
          address: 'address',
          instructorSignature: 'instructorSignature'
        };

        // Dibujar cada campo en su posición
        for (const [fieldKey, coord] of Object.entries(coordinates)) {
          // Obtener el nombre del campo en la base de datos
          const dbFieldKey = fieldMapping[fieldKey] || fieldKey;
          let value = (student as any)[dbFieldKey];

          // Manejar firma del instructor como imagen
          if (fieldKey === "instructorSignature") {
            if (value && coord.x !== undefined && coord.y !== undefined) {
              try {
                const signatureBytes = await fetch(value).then((res) => res.arrayBuffer());
                let signatureImage;
                try {
                  signatureImage = await pdfDoc.embedPng(signatureBytes);
                } catch {
                  signatureImage = await pdfDoc.embedJpg(signatureBytes);
                }
                
                const signatureDims = signatureImage.scale(0.15);
                const pdfY = height - coord.y - signatureDims.height;
                
                page.drawImage(signatureImage, {
                  x: coord.x,
                  y: pdfY,
                  width: signatureDims.width,
                  height: signatureDims.height,
                });

              } catch (error) {
                console.error(`  ❌ Error loading signature image:`, error);
              }
            }
            continue;
          }

          // Transformaciones especiales
          if (fieldKey === "courseDate" && value) {
            const date = new Date(value);
            value = date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
          }

          // Si no hay valor, saltar este campo (no usar datos mock)
          if (!value || value === "") {

            continue;
          }

          // Validar que x e y existen (no son opcionales para campos de texto)
          if (coord.x === undefined || coord.y === undefined) {

            continue;
          }

          // Campo de texto normal - usar Helvetica
          const font = helvetica;
          const fontSize = coord.fontSize || 10;
          const textWidth = font.widthOfTextAtSize(String(value), fontSize);

          // Calcular X según alineación
          let finalX = coord.x;
          if (coord.align === "center") {
            finalX = coord.x - textWidth / 2;
          } else if (coord.align === "right") {
            finalX = coord.x - textWidth;
          }

          // PDF usa coordenadas bottom-up
          const pdfY = height - coord.y - fontSize;

          page.drawText(String(value), {
            x: finalX,
            y: pdfY,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
          });


        }

        const pdfBytes = await pdfDoc.save();
        return new Blob([pdfBytes as any], { type: "application/pdf" });
      } catch (error) {
        console.error("❌ Error generating single ADI certificate:", error);
        throw error;
      }
    },
    []
  );

  /**
   * Genera un PDF con múltiples estudiantes (hasta 3 por página)
   * Si hay más de 3, genera múltiples PDFs en un ZIP
   */
  const generateMultipleAdiCertificates = useCallback(
    async (students: Student[], pdfTemplatePath: string) => {

      const pdfs: Blob[] = [];

      try {
        // Procesar en chunks de 3
        for (let i = 0; i < students.length; i += 3) {
          const chunk = students.slice(i, Math.min(i + 3, students.length));

          const pdfDoc = await PDFDocument.create();

          // Cargar el PDF template de fondo
          const templateBytes = await fetch(pdfTemplatePath).then((res) => {
            if (!res.ok) throw new Error(`Failed to load PDF: ${pdfTemplatePath}`);
            return res.arrayBuffer();
          });
          const templatePdf = await PDFDocument.load(templateBytes);
          const [templatePage] = await pdfDoc.copyPages(templatePdf, [0]);
          pdfDoc.addPage(templatePage);

          const page = pdfDoc.getPages()[0];
          const { height } = page.getSize();

          // Embed fonts
          const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
          const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);

          // Mapeo de nombres de campos (coordenadas -> base de datos)
          const fieldMapping: Record<string, string> = {
            firstName: 'first_name',
            lastName: 'last_name',
            middleName: 'midl',
            licenseNumber: 'licenseNumber',
            licenseNumber2: 'licenseNumber', // Segunda aparición del mismo número
            citationNumber: 'citationNumber',
            courseDate: 'courseDate',
            certn: 'certn', // Certificate number
            address: 'address',
            instructorSignature: 'instructorSignature'
          };

          // Dibujar cada estudiante en su posición
          for (let index = 0; index < chunk.length; index++) {
            const student = chunk[index];
            const position = (index + 1) as 1 | 2 | 3;
            const coordinates = getAdiPositionCoordinates(position);


            for (const [fieldKey, coord] of Object.entries(coordinates)) {
              // Obtener el nombre del campo en la base de datos
              const dbFieldKey = fieldMapping[fieldKey] || fieldKey;
              let value = (student as any)[dbFieldKey];

              // Manejar firma del instructor como imagen
              if (fieldKey === "instructorSignature") {
                if (value && coord.x !== undefined && coord.y !== undefined) {
                  try {
                    const signatureBytes = await fetch(value).then((res) => res.arrayBuffer());
                    let signatureImage;
                    try {
                      signatureImage = await pdfDoc.embedPng(signatureBytes);
                    } catch {
                      signatureImage = await pdfDoc.embedJpg(signatureBytes);
                    }
                    
                    const signatureDims = signatureImage.scale(0.15);
                    const pdfY = height - coord.y - signatureDims.height;
                    
                    page.drawImage(signatureImage, {
                      x: coord.x,
                      y: pdfY,
                      width: signatureDims.width,
                      height: signatureDims.height,
                    });

                  } catch (error) {
                    console.error(`    ❌ Error loading signature image:`, error);
                  }
                }
                continue;
              }

              // Transformaciones especiales
              if (fieldKey === "courseDate" && value) {
                const date = new Date(value);
                value = date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
              }

              // Si no hay valor, saltar este campo (no usar datos mock)
              if (!value || value === "") {

                continue;
              }

              // Validar que x e y existen (no son opcionales para campos de texto)
              if (coord.x === undefined || coord.y === undefined) {

                continue;
              }

              // Campo de texto normal - usar Helvetica
              const font = helvetica;
              const fontSize = coord.fontSize || 10;
              const textWidth = font.widthOfTextAtSize(String(value), fontSize);

              // Calcular X según alineación
              let finalX = coord.x;
              if (coord.align === "center") {
                finalX = coord.x - textWidth / 2;
              } else if (coord.align === "right") {
                finalX = coord.x - textWidth;
              }

              // PDF usa coordenadas bottom-up
              const pdfY = height - coord.y - fontSize;

              page.drawText(String(value), {
                x: finalX,
                y: pdfY,
                size: fontSize,
                font,
                color: rgb(0, 0, 0),
              });
            }
          }

          // Si hay menos de 3 estudiantes, dibujar cuadros blancos en las posiciones vacías
          // ADI usa las mismas posiciones que BDI, pero ajustado para cuando es 1 estudiante
          if (chunk.length < 3) {
            const { width } = page.getSize();
            
            // Dibujar cuadro blanco para posición 2 si falta
            if (chunk.length === 1) {
              // Bajar un tris los cuadros cuando es 1 estudiante (aumentar Y)
              const POSITION_2_OFFSET = 273; // Aumentado desde 270 para bajar un tris
              const POSITION_3_OFFSET = 548; // Aumentado desde 545 para bajar un tris
              
              // Cubrir posición 2 (middle): desde Y=273 hasta Y=548 (top-down)
              // En coordenadas bottom-up: desde height-548 hasta height-273
              page.drawRectangle({
                x: 0,
                y: height - POSITION_3_OFFSET,
                width: width,
                height: POSITION_3_OFFSET - POSITION_2_OFFSET,
                color: rgb(1, 1, 1), // Blanco
              });
              
              // Cubrir posición 3 (bottom): desde Y=548 hasta Y=612 (top-down)
              // En coordenadas bottom-up: desde 0 hasta height-548
              page.drawRectangle({
                x: 0,
                y: 0,
                width: width,
                height: height - POSITION_3_OFFSET,
                color: rgb(1, 1, 1), // Blanco
              });
            } else if (chunk.length === 2) {
              // Solo cubrir posición 3 (bottom) - ajustado a 273
              const POSITION_3_OFFSET_2_STUDENTS = 273; // Ajustado a 273
              page.drawRectangle({
                x: 0,
                y: 0,
                width: width,
                height: height - POSITION_3_OFFSET_2_STUDENTS,
                color: rgb(1, 1, 1), // Blanco
              });
            }
          }

          const pdfBytes = await pdfDoc.save();
          pdfs.push(new Blob([pdfBytes as any], { type: "application/pdf" }));
        }

        // Si solo hay 1 PDF, retornarlo directamente
        if (pdfs.length === 1) {
          return pdfs[0];
        }

        // Si hay múltiples PDFs, retornar array para crear ZIP
        return pdfs;
      } catch (error) {
        console.error("❌ Error generating multiple ADI certificates:", error);
        throw error;
      }
    },
    []
  );

  return {
    generateSingleAdiCertificate,
    generateMultipleAdiCertificates,
  };
}