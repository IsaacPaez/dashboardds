"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface ReasonsManagerProps {
  reasons: string[];
  onChange: (reasons: string[]) => void;
}

const ReasonsManager: React.FC<ReasonsManagerProps> = ({ reasons, onChange }) => {
  const [newReason, setNewReason] = useState("");

  const handleAddReason = () => {
    const trimmedReason = newReason.trim();
    if (trimmedReason && !reasons.includes(trimmedReason)) {
      onChange([...reasons, trimmedReason]);
      setNewReason("");
    }
  };

  const handleRemoveReason = (reasonToRemove: string) => {
    onChange(reasons.filter((reason) => reason !== reasonToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddReason();
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Enrollment Reasons
      </label>
      <p className="text-sm text-gray-500">
        Add reasons that students can select when enrolling in this class. If no reasons are configured, students won&apos;t be asked to select one.
      </p>

      {/* Input para agregar nueva razón */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter a reason (e.g., Court Requirement)"
          value={newReason}
          onChange={(e) => setNewReason(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={handleAddReason}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={!newReason.trim()}
        >
          + Add
        </Button>
      </div>

      {/* Lista de razones como chips/tags */}
      {reasons.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-full text-sm text-gray-700"
            >
              <span>{reason}</span>
              <button
                type="button"
                onClick={() => handleRemoveReason(reason)}
                className="ml-1 text-gray-500 hover:text-red-600 focus:outline-none"
                aria-label={`Remove ${reason}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {reasons.length === 0 && (
        <p className="text-sm text-gray-400 italic">
          No enrollment reasons configured yet.
        </p>
      )}
    </div>
  );
};

export default ReasonsManager;
