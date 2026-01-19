import { useFieldArray } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { SectionProps } from "../types";

export const StatisticsSection = ({ form, expandedSections, toggleSection }: SectionProps) => {
  const { fields: statisticFields, append: appendStatistic, remove: removeStatistic } = useFieldArray({
    control: form.control,
    name: "statistics",
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Statistics Section (Optional)</CardTitle>
          <button
            type="button"
            onClick={() => toggleSection("statistics")}
            className="p-1"
          >
            {expandedSections.has("statistics") ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </CardHeader>
      {expandedSections.has("statistics") && (
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Statistics</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendStatistic({ value: 0, label: "", suffix: "+" })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Statistic
              </Button>
            </div>

            {statisticFields.map((field, index) => (
              <Card key={field.id}>
                <CardContent className="pt-6">
                  <div className="flex gap-4 items-start">
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name={`statistics.${index}.value`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Value</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} placeholder="9000" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`statistics.${index}.label`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Students" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`statistics.${index}.suffix`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Suffix</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="+" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="mt-8"
                      onClick={() => removeStatistic(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};
