import { useFieldArray } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import ImageUpload from "@/components/custom ui/ImageUpload";
import { SectionProps } from "../types";

export const HeroSection = ({ form, expandedSections, toggleSection }: SectionProps) => {
  const { fields: statisticFields, append: appendStatistic, remove: removeStatistic } = useFieldArray({
    control: form.control,
    name: "statistics",
  });

  const { fields: ctaFields, append: appendCta, remove: removeCta } = useFieldArray({
    control: form.control,
    name: "ctaButtons",
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Hero Section</CardTitle>
          <button
            type="button"
            onClick={() => toggleSection("hero")}
            className="p-1"
          >
            {expandedSections.has("hero") ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </CardHeader>
      {expandedSections.has("hero") && (
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="title.part1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title Part 1 (Colored)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Learn To Drive" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title.part2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title Part 2 (White)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Safely For Life" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="title.gradientFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gradient From</FormLabel>
                  <FormControl>
                    <Input {...field} type="color" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title.gradientVia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gradient Via</FormLabel>
                  <FormControl>
                    <Input {...field} type="color" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title.gradientTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gradient To</FormLabel>
                  <FormControl>
                    <Input {...field} type="color" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Affordable Driving School offers professional..."
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormLabel>Background Images</FormLabel>
            <FormField
              control={form.control}
              name="backgroundImage.mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Background</FormLabel>
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
              name="backgroundImage.desktop"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desktop Background</FormLabel>
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
          </div>

          {/* Statistics Section */}
          <div className="space-y-4 mt-8 border-t pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Statistics (Optional)</h3>
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

          {/* CTA Buttons Section */}
          <div className="space-y-4 mt-8 border-t pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">CTA Buttons (Optional)</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendCta({ text: "", link: "", actionType: "link", order: 0 })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Button
              </Button>
            </div>

            {ctaFields.map((field, index) => (
              <Card key={field.id}>
                <CardContent className="pt-6">
                  <div className="flex gap-4 items-start">
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`ctaButtons.${index}.text`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Button Text</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Book Driving Lessons" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`ctaButtons.${index}.link`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Link</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="/services" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name={`ctaButtons.${index}.actionType`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Action Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select action type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="link">Link</SelectItem>
                                  <SelectItem value="modal">Modal</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {form.watch(`ctaButtons.${index}.actionType`) === "modal" && (
                          <FormField
                            control={form.control}
                            name={`ctaButtons.${index}.modalType`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Modal Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select modal type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="service-selector">Service Selector</SelectItem>
                                    <SelectItem value="custom">Custom</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        <FormField
                          control={form.control}
                          name={`ctaButtons.${index}.order`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Order</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} placeholder="0" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="mt-8"
                      onClick={() => removeCta(index)}
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
