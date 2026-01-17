import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import TicketClass from "@/lib/models/TicketClass";
import Location from "@/lib/models/Locations";
import User from "@/lib/models/User";
import Certificate from "@/lib/models/Certificate";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    // Obtener parámetros de la URL
    const searchParams = req.nextUrl.searchParams;
    const dateParam = searchParams.get("date");
    const classTypesParam = searchParams.get("classTypes");
    const columnsParam = searchParams.get("columns");

    if (!dateParam || !classTypesParam || !columnsParam) {
      return new NextResponse("Missing required parameters", { status: 400 });
    }

    // Parsear parámetros
    const selectedDate = new Date(dateParam);
    const selectedClassTypes = classTypesParam.split(",");
    const selectedColumns = columnsParam.split(",");

    // Construir query para obtener las clases
    const query: any = {
      date: {
        $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(selectedDate.setHours(23, 59, 59, 999)),
      },
      type: { $in: selectedClassTypes },
    };

    // Obtener las clases
    const classes = await TicketClass.find(query)
      .populate("locationId")
      .populate("students")
      .sort({ date: 1, hour: 1 })
      .lean();

    // Procesar los datos para el Excel
    const exportData: any[] = [];

    for (const ticketClass of classes) {
      const location = ticketClass.locationId as any;
      const students = ticketClass.students as any[];

      // Si la clase tiene estudiantes, crear una fila por estudiante
      if (students && students.length > 0) {
        for (const student of students) {
          // Obtener información completa del estudiante
          const studentDetails = await User.findById(student).lean();

          // Obtener información del certificado para este estudiante y clase
          const certificate = await Certificate.findOne({
            studentId: student,
            classId: ticketClass.classId,
          }).lean();

          const row: any = {};

          // Agregar columnas según la selección del usuario
          if (selectedColumns.includes("date")) {
            row.date = new Date(ticketClass.date).toLocaleDateString();
          }
          if (selectedColumns.includes("hour")) {
            row.hour = ticketClass.hour || "";
          }
          if (selectedColumns.includes("endHour")) {
            row.endHour = ticketClass.endHour || "";
          }
          if (selectedColumns.includes("duration")) {
            row.duration = ticketClass.duration || "";
          }
          if (selectedColumns.includes("type")) {
            row.type = ticketClass.type?.toUpperCase() || "";
          }
          if (selectedColumns.includes("status")) {
            row.status = ticketClass.status || "";
          }
          if (selectedColumns.includes("location")) {
            row.location = location?.name || "";
          }
          if (selectedColumns.includes("spots")) {
            row.spots = ticketClass.spots || 0;
          }
          if (selectedColumns.includes("spotsOccupied")) {
            row.spotsOccupied = students.length;
          }
          if (selectedColumns.includes("spotsAvailable")) {
            row.spotsAvailable = (ticketClass.spots || 0) - students.length;
          }

          // Información del estudiante
          if (studentDetails) {
            if (selectedColumns.includes("studentFirstName")) {
              row.studentFirstName = studentDetails.firstName || "";
            }
            if (selectedColumns.includes("studentMiddleInitial")) {
              row.studentMiddleInitial = studentDetails.middleName || "";
            }
            if (selectedColumns.includes("studentLastName")) {
              row.studentLastName = studentDetails.lastName || "";
            }
            if (selectedColumns.includes("studentEmail")) {
              row.studentEmail = studentDetails.email || "";
            }
            if (selectedColumns.includes("studentPhone")) {
              row.studentPhone = studentDetails.phoneNumber || "";
            }
            if (selectedColumns.includes("studentAddress")) {
              row.studentAddress = studentDetails.streetAddress || "";
            }
            if (selectedColumns.includes("studentCity")) {
              row.studentCity = studentDetails.city || "";
            }
            if (selectedColumns.includes("studentState")) {
              row.studentState = studentDetails.state || "";
            }
            if (selectedColumns.includes("studentZip")) {
              row.studentZip = studentDetails.zipCode || "";
            }
            if (selectedColumns.includes("licenseNumber")) {
              row.licenseNumber = studentDetails.licenseNumber || "";
            }
          }

          // Información del certificado
          if (certificate) {
            if (selectedColumns.includes("ticketNumber")) {
              row.ticketNumber = certificate.citation_number || "";
            }
            if (selectedColumns.includes("county")) {
              row.county = certificate.country_ticket || "";
            }
            if (selectedColumns.includes("classReason")) {
              row.classReason = certificate.reason || "";
            }
          } else {
            // Si no hay certificado, dejar los campos vacíos
            if (selectedColumns.includes("ticketNumber")) {
              row.ticketNumber = "";
            }
            if (selectedColumns.includes("county")) {
              row.county = "";
            }
            if (selectedColumns.includes("classReason")) {
              row.classReason = "";
            }
          }

          exportData.push(row);
        }
      } else {
        // Si la clase no tiene estudiantes, crear una fila sin datos de estudiante
        const row: any = {};

        if (selectedColumns.includes("date")) {
          row.date = new Date(ticketClass.date).toLocaleDateString();
        }
        if (selectedColumns.includes("hour")) {
          row.hour = ticketClass.hour || "";
        }
        if (selectedColumns.includes("endHour")) {
          row.endHour = ticketClass.endHour || "";
        }
        if (selectedColumns.includes("duration")) {
          row.duration = ticketClass.duration || "";
        }
        if (selectedColumns.includes("type")) {
          row.type = ticketClass.type?.toUpperCase() || "";
        }
        if (selectedColumns.includes("status")) {
          row.status = ticketClass.status || "";
        }
        if (selectedColumns.includes("location")) {
          row.location = location?.name || "";
        }
        if (selectedColumns.includes("spots")) {
          row.spots = ticketClass.spots || 0;
        }
        if (selectedColumns.includes("spotsOccupied")) {
          row.spotsOccupied = 0;
        }
        if (selectedColumns.includes("spotsAvailable")) {
          row.spotsAvailable = ticketClass.spots || 0;
        }

        // Dejar vacías las columnas de estudiante
        if (selectedColumns.includes("studentFirstName")) row.studentFirstName = "";
        if (selectedColumns.includes("studentMiddleInitial")) row.studentMiddleInitial = "";
        if (selectedColumns.includes("studentLastName")) row.studentLastName = "";
        if (selectedColumns.includes("studentEmail")) row.studentEmail = "";
        if (selectedColumns.includes("studentPhone")) row.studentPhone = "";
        if (selectedColumns.includes("studentAddress")) row.studentAddress = "";
        if (selectedColumns.includes("studentCity")) row.studentCity = "";
        if (selectedColumns.includes("studentState")) row.studentState = "";
        if (selectedColumns.includes("studentZip")) row.studentZip = "";
        if (selectedColumns.includes("licenseNumber")) row.licenseNumber = "";
        if (selectedColumns.includes("ticketNumber")) row.ticketNumber = "";
        if (selectedColumns.includes("county")) row.county = "";
        if (selectedColumns.includes("classReason")) row.classReason = "";

        exportData.push(row);
      }
    }

    return NextResponse.json(exportData, { status: 200 });
  } catch (error) {
    console.error("[TICKET_EXPORT_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
