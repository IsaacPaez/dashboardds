import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import ImageUpload from "@/components/custom ui/ImageUpload";
import { SectionProps } from "../types";

export const FeatureSection = ({ form, expandedSections, toggleSection }: SectionProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Feature Section (Optional)</CardTitle>
          <button
            type="button"
            onClick={() => toggleSection("featureSection")}
            className="p-1"
          >
            {expandedSections.has("featureSection") ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </CardHeader>
      {expandedSections.has("featureSection") && (
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="featureSection.title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feature Title</FormLabel>
                <FormControl>
                  <Input placeholder="BBB Accredited Driving Traffic School" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="featureSection.subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feature Subtitle</FormLabel>
                <FormControl>
                  <Input placeholder="With A+ Rating" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="featureSection.description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feature Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe your feature..." rows={6} {...field} />
                </FormControl>
                <FormDescription>Maximum 2000 characters</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="featureSection.image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feature Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormDescription>Recommended: 800x600px</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      )}
    </Card>
  );
};
