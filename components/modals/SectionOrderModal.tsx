// Modal para ordenar secciones del home page con drag & drop
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GripVertical, Save } from "lucide-react";
import toast from "react-hot-toast";

interface Section {
  id: string;
  label: string;
  order: number;
  locked?: boolean;
}

interface SectionOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  onSave?: () => void; // Callback to refresh parent component
}

const SECTION_LABELS: Record<string, string> = {
  hero: "🏠 Hero Section",
  featureSection: "⭐ Feature Section (Body)",
  corporateProgramsSection: "🏢 Corporate Programs",
  benefitsSection: "✨ Benefits (Learn)",
  drivingLessonsTitle: "🚗 Driving Lessons",
  trafficCoursesSection: "🚦 Traffic Courses",
  resources: "📚 Resources",
  areasWeServe: "📍 Areas We Serve",
};

const getDefaultSections = (): Section[] => {
  return [
    { id: "hero", label: SECTION_LABELS.hero, order: 0, locked: true },
    { id: "featureSection", label: SECTION_LABELS.featureSection, order: 1 },
    { id: "corporateProgramsSection", label: SECTION_LABELS.corporateProgramsSection, order: 2 },
    { id: "benefitsSection", label: SECTION_LABELS.benefitsSection, order: 3 },
    { id: "drivingLessonsTitle", label: SECTION_LABELS.drivingLessonsTitle, order: 4 },
    { id: "trafficCoursesSection", label: SECTION_LABELS.trafficCoursesSection, order: 5 },
    { id: "resources", label: SECTION_LABELS.resources, order: 6 },
    { id: "areasWeServe", label: SECTION_LABELS.areasWeServe, order: 7 },
  ];
};

export const SectionOrderModal = ({ isOpen, onClose, contentId, onSave }: SectionOrderModalProps) => {
  const [sections, setSections] = useState<Section[]>(getDefaultSections());
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && contentId) {
      fetchSectionOrder();
    }
  }, [isOpen, contentId]);

  const fetchSectionOrder = async () => {
    try {
      setFetching(true);
      console.log("🔍 Fetching section order for contentId:", contentId);
      const res = await fetch(`/api/page-content/${contentId}/section-order`);
      if (res.ok) {
        const data = await res.json();
        console.log("📥 Fetched section order:", data);
        
        // If data is empty or not an array, use defaults
        if (!Array.isArray(data) || data.length === 0) {
          console.log("⚠️ Empty or invalid data, using defaults");
          const defaults = getDefaultSections();
          console.log("📋 Using default sections:", defaults);
          setSections(defaults);
          return;
        }
        
        // Convert API response to Section format with labels
        const sectionsWithLabels = data.map((item: { id: string; order: number }) => ({
          id: item.id,
          label: SECTION_LABELS[item.id] || item.id,
          order: item.order,
          locked: item.id === "hero",
        }));
        console.log("✨ Sections with labels:", sectionsWithLabels);
        setSections(sectionsWithLabels);
      } else {
        console.log("⚠️ No section order found, using defaults");
        const defaults = getDefaultSections();
        console.log("📋 Using default sections:", defaults);
        setSections(defaults);
      }
    } catch (error) {
      console.error("❌ Error fetching section order:", error);
      const defaults = getDefaultSections();
      console.log("📋 Using default sections after error:", defaults);
      setSections(defaults);
    } finally {
      setFetching(false);
      console.log("✅ Fetching complete, fetching state:", false);
    }
  };

  const handleDragStart = (index: number) => {
    if (sections[index].locked) return;
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || sections[index].locked) return;
    
    const newSections = [...sections];
    const draggedItem = newSections[draggedIndex];
    
    // Remove from old position
    newSections.splice(draggedIndex, 1);
    // Insert at new position
    newSections.splice(index, 0, draggedItem);
    
    // Update orders
    newSections.forEach((section, idx) => {
      section.order = idx;
    });
    
    setSections(newSections);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Convert sections to API format (only id and order)
      const sectionOrder = sections.map(({ id, order }) => ({ id, order }));
      console.log("💾 Saving section order:", sectionOrder);
      
      const res = await fetch(`/api/page-content/${contentId}/section-order`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionOrder }),
      });

      if (res.ok) {
        const result = await res.json();
        console.log("✅ Section order saved:", result);
        toast.success("Section order saved successfully!");
        onSave?.(); // Trigger parent refresh
        onClose();
      } else {
        const errorData = await res.json();
        console.error("❌ Save failed:", errorData);
        toast.error(errorData.error || "Failed to save section order");
      }
    } catch (error) {
      console.error("❌ Error saving section order:", error);
      toast.error("Error saving section order");
    } finally {
      setLoading(false);
    }
  };

  console.log("🎨 Rendering modal - sections:", sections.length, "fetching:", fetching, "loading:", loading);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reorder Home Page Sections</DialogTitle>
          <DialogDescription>
            Drag and drop to reorder sections. Hero section is locked and will always appear first.
          </DialogDescription>
        </DialogHeader>

        {fetching ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading sections...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2 mt-4">
            {sections.map((section, index) => (
              <div
                key={section.id}
                draggable={!section.locked}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`
                  flex items-center gap-3 p-4 rounded-lg border-2 transition-all
                  ${section.locked 
                    ? "bg-gray-100 border-gray-300 cursor-not-allowed" 
                    : "bg-white border-gray-200 cursor-move hover:border-blue-400 hover:shadow-md"
                  }
                  ${draggedIndex === index ? "opacity-50" : ""}
                `}
              >
                <div className={`${section.locked ? "text-gray-400" : "text-gray-600"}`}>
                  <GripVertical className="w-5 h-5" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{section.label}</span>
                    {section.locked && (
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                        Fixed Position
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">Order: {section.order + 1}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading} className="bg-blue-600 text-white">
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Saving..." : "Save Order"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
