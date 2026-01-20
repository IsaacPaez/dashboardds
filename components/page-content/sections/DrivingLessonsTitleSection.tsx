import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SectionProps } from "../types";

export const DrivingLessonsTitleSection = ({ form, expandedSections, toggleSection }: SectionProps) => {
  return (
    <Card>
      <CardHeader>
        <div
          className="flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors -m-6 p-6 rounded-t-lg"
          onClick={() => toggleSection("drivingLessonsTitle")}
        >
          <CardTitle>Driving Lessons Title</CardTitle>
          {expandedSections.has("drivingLessonsTitle") ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </div>
      </CardHeader>
      {expandedSections.has("drivingLessonsTitle") && (
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <FormLabel>Section Title</FormLabel>
            <FormField
              control={form.control}
              name="drivingLessonsTitle.text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title Text</FormLabel>
                  <FormControl>
                    <Input placeholder="OUR DRIVING LESSONS" {...field} />
                  </FormControl>
                  <FormDescription>Main title for the driving lessons section</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="drivingLessonsTitle.gradientFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gradient From</FormLabel>
                    <FormControl>
                      <Input {...field} type="color" value={field.value || "#27ae60"} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="drivingLessonsTitle.gradientVia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gradient Via</FormLabel>
                    <FormControl>
                      <Input {...field} type="color" value={field.value || "#000000"} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="drivingLessonsTitle.gradientTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gradient To</FormLabel>
                    <FormControl>
                      <Input {...field} type="color" value={field.value || "#0056b3"} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
