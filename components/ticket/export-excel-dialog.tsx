"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Calendar from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import * as XLSX from "xlsx";

interface ExportExcelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Definir todas las columnas disponibles para exportar
const AVAILABLE_COLUMNS = [
  { id: "date", label: "Date", category: "basic" },
  { id: "hour", label: "Start Time", category: "basic" },
  { id: "endHour", label: "End Time", category: "basic" },
  { id: "duration", label: "Duration", category: "basic" },
  { id: "licenseNumber", label: "License Number", category: "basic" },
  { id: "ticketNumber", label: "Ticket Number", category: "basic" },
  { id: "county", label: "County", category: "basic" },
  { id: "classReason", label: "Class Reason", category: "basic" },
  { id: "type", label: "Class Type", category: "class" },
  { id: "status", label: "Status", category: "class" },
  { id: "location", label: "Location", category: "class" },
  { id: "spots", label: "Total Spots", category: "class" },
  { id: "spotsOccupied", label: "Spots Occupied", category: "class" },
  { id: "spotsAvailable", label: "Spots Available", category: "class" },
  { id: "studentFirstName", label: "Student First Name", category: "student" },
  { id: "studentMiddleInitial", label: "Student Middle Initial", category: "student" },
  { id: "studentLastName", label: "Student Last Name", category: "student" },
  { id: "studentEmail", label: "Student Email", category: "student" },
  { id: "studentPhone", label: "Student Phone", category: "student" },
  { id: "studentAddress", label: "Student Address", category: "student" },
  { id: "studentCity", label: "Student City", category: "student" },
  { id: "studentState", label: "Student State", category: "student" },
  { id: "studentZip", label: "Student ZIP", category: "student" },
] as const;

export function ExportExcelDialog({ open, onOpenChange }: ExportExcelDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedClassTypes, setSelectedClassTypes] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "date",
    "hour",
    "endHour",
    "type",
    "status",
    "location",
    "studentFirstName",
    "studentLastName",
  ]); // Columnas seleccionadas por defecto
  const [availableClassTypes, setAvailableClassTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingClassTypes, setIsLoadingClassTypes] = useState(true);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Cargar tipos de clases disponibles al abrir el dialog
  useEffect(() => {
    if (open) {
      fetchClassTypes();
    }
  }, [open]);

  const fetchClassTypes = async () => {
    try {
      setIsLoadingClassTypes(true);
      const res = await fetch("/api/classtypes");
      const data = await res.json();
      const types = data.map((ct: any) => ct.name);
      setAvailableClassTypes(types);
      // Seleccionar todos por defecto
      setSelectedClassTypes(types);
    } catch (error) {
      console.error("Error fetching class types:", error);
    } finally {
      setIsLoadingClassTypes(false);
    }
  };

  const toggleClassType = (classType: string) => {
    setSelectedClassTypes((prev) =>
      prev.includes(classType)
        ? prev.filter((t) => t !== classType)
        : [...prev, classType]
    );
  };

  const toggleColumn = (columnId: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((c) => c !== columnId)
        : [...prev, columnId]
    );
  };

  const selectAllColumns = () => {
    setSelectedColumns(AVAILABLE_COLUMNS.map((col) => col.id));
  };

  const deselectAllColumns = () => {
    setSelectedColumns([]);
  };

  const handleExport = async () => {
    if (!selectedDate) {
      alert("Please select a date");
      return;
    }

    if (selectedClassTypes.length === 0) {
      alert("Please select at least one class type");
      return;
    }

    if (selectedColumns.length === 0) {
      alert("Please select at least one column");
      return;
    }

    setIsLoading(true);

    try {
      // Llamar al API para obtener los datos filtrados
      const params = new URLSearchParams({
        date: format(selectedDate, "yyyy-MM-dd"),
        classTypes: selectedClassTypes.join(","),
        columns: selectedColumns.join(","),
      });

      const response = await fetch(`/api/ticket/export?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      // Generar el archivo Excel
      generateExcel(data);

      // Cerrar el dialog
      onOpenChange(false);
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Error exporting data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateExcel = (data: any[]) => {
    // Crear el workbook
    const wb = XLSX.utils.book_new();

    // Crear los headers basados en las columnas seleccionadas
    const headers = selectedColumns.map((colId) => {
      const col = AVAILABLE_COLUMNS.find((c) => c.id === colId);
      return col?.label || colId;
    });

    // Crear las filas de datos
    const rows = data.map((row) => {
      return selectedColumns.map((colId) => row[colId] || "");
    });

    // Combinar headers y rows
    const wsData = [headers, ...rows];

    // Crear la hoja de cálculo
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Ajustar el ancho de las columnas
    const colWidths = selectedColumns.map(() => ({ wch: 20 }));
    ws["!cols"] = colWidths;

    // Agregar la hoja al workbook
    XLSX.utils.book_append_sheet(wb, ws, "Traffic School Classes");

    // Generar el archivo y descargarlo
    const fileName = `Traffic_School_${format(selectedDate!, "yyyy-MM-dd")}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Export Traffic School Data to Excel</DialogTitle>
          <DialogDescription>
            Select the date, class types, and columns you want to export.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date Selector */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Select Date</Label>
            <Popover modal={true} open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white shadow-lg border" align="start" sideOffset={5}>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setIsCalendarOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Class Types Selector */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Select Class Types</Label>
            {isLoadingClassTypes ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4 border rounded-md">
                {availableClassTypes.map((classType) => (
                  <div key={classType} className="flex items-center space-x-2">
                    <Checkbox
                      id={`class-${classType}`}
                      checked={selectedClassTypes.includes(classType)}
                      onCheckedChange={() => toggleClassType(classType)}
                    />
                    <Label
                      htmlFor={`class-${classType}`}
                      className="text-sm font-normal uppercase cursor-pointer"
                    >
                      {classType}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Columns Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Select Columns to Export</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAllColumns}
                  type="button"
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={deselectAllColumns}
                  type="button"
                >
                  Deselect All
                </Button>
              </div>
            </div>

            {/* Columns grouped by category */}
            <div className="space-y-4 p-4 border rounded-md">
              {/* Basic Info */}
              <div>
                <h4 className="font-medium text-sm mb-2 text-muted-foreground">Basic Info</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {AVAILABLE_COLUMNS.filter((col) => col.category === "basic").map((col) => (
                    <div key={col.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`col-${col.id}`}
                        checked={selectedColumns.includes(col.id)}
                        onCheckedChange={() => toggleColumn(col.id)}
                      />
                      <Label
                        htmlFor={`col-${col.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {col.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Class Info */}
              <div>
                <h4 className="font-medium text-sm mb-2 text-muted-foreground">Class Info</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {AVAILABLE_COLUMNS.filter((col) => col.category === "class").map((col) => (
                    <div key={col.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`col-${col.id}`}
                        checked={selectedColumns.includes(col.id)}
                        onCheckedChange={() => toggleColumn(col.id)}
                      />
                      <Label
                        htmlFor={`col-${col.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {col.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Info */}
              <div>
                <h4 className="font-medium text-sm mb-2 text-muted-foreground">Student Info</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {AVAILABLE_COLUMNS.filter((col) => col.category === "student").map((col) => (
                    <div key={col.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`col-${col.id}`}
                        checked={selectedColumns.includes(col.id)}
                        onCheckedChange={() => toggleColumn(col.id)}
                      />
                      <Label
                        htmlFor={`col-${col.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {col.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export to Excel
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
