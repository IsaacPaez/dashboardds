import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import ImageUpload from "@/components/custom ui/ImageUpload";
import { SectionProps } from "../types";

export const HeroSection = ({ form, expandedSections, toggleSection }: SectionProps) => {
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
        </CardContent>
      )}
    </Card>
  );
};
