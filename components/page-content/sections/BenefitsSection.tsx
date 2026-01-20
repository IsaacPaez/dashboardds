import { useState } from "react";
import { useFieldArray } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import ImageUpload from "@/components/custom ui/ImageUpload";
import { SectionProps } from "../types";

export const BenefitsSection = ({ form, expandedSections, toggleSection }: SectionProps) => {
  const [expandedBenefits, setExpandedBenefits] = useState<Set<number>>(new Set([0]));
  const { fields: benefitFields, append: appendBenefit, remove: removeBenefit } = useFieldArray({
    control: form.control,
    name: "benefitsSection.items",
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Benefits Section (Optional)</CardTitle>
          <button
            type="button"
            onClick={() => toggleSection("benefitsSection")}
            className="p-1"
          >
            {expandedSections.has("benefitsSection") ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </CardHeader>
      {expandedSections.has("benefitsSection") && (
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <FormLabel>Section Title</FormLabel>
            <FormField
              control={form.control}
              name="benefitsSection.title.text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title Text</FormLabel>
                  <FormControl>
                    <Input placeholder="Why Choose Us" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="benefitsSection.title.gradientFrom"
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
                name="benefitsSection.title.gradientVia"
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
                name="benefitsSection.title.gradientTo"
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

          <div className="flex items-center justify-between mt-6">
            <h3 className="text-lg font-semibold">Benefit Items</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendBenefit({ image: "", title: "", description: "", link: "", order: benefitFields.length })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Benefit
            </Button>
          </div>

          <div className="space-y-4">
            {benefitFields.map((field, index) => {
              const isExpanded = expandedBenefits.has(index);
              const benefitTitle = form.watch(`benefitsSection.items.${index}.title`) || `Benefit ${index + 1}`;

              return (
                <Card key={field.id} className="p-4 border-2">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => {
                          const newExpanded = new Set(expandedBenefits);
                          if (isExpanded) {
                            newExpanded.delete(index);
                          } else {
                            newExpanded.add(index);
                          }
                          setExpandedBenefits(newExpanded);
                        }}
                        className="flex items-center gap-2 font-semibold hover:text-blue-600 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        <span>{benefitTitle}</span>
                      </button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          removeBenefit(index);
                          const newExpanded = new Set(expandedBenefits);
                          newExpanded.delete(index);
                          setExpandedBenefits(newExpanded);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {isExpanded && (
                      <>
                        <FormField
                          control={form.control}
                          name={`benefitsSection.items.${index}.image`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image</FormLabel>
                              <FormControl>
                                <ImageUpload
                                  value={field.value ? [field.value] : []}
                                  onChange={(url) => field.onChange(url)}
                                  onRemove={() => field.onChange("")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`benefitsSection.items.${index}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title (shown on hover)</FormLabel>
                              <FormControl>
                                <Input placeholder="Experienced Instructors" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`benefitsSection.items.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description (shown on hover)</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Our instructors are certified..." rows={3} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`benefitsSection.items.${index}.link`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Link (Optional - makes image clickeable)</FormLabel>
                              <FormControl>
                                <Input placeholder="https://example.com/page" {...field} />
                              </FormControl>
                              <FormDescription>Leave empty if you don&apos;t want the image to be clickeable</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`benefitsSection.items.${index}.order`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Display Order</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} min="0" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </div>
                </Card>
              );
            })}

            {benefitFields.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No benefit items added yet. Click &quot;Add Benefit&quot; to create one.
              </p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};
