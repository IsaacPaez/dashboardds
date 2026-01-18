import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import ImageUpload from "@/components/custom ui/ImageUpload";
import { SectionProps } from "../types";

export const CorporateProgramsSection = ({ form, expandedSections, toggleSection }: SectionProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Corporate Programs Section (Optional)</CardTitle>
          <button
            type="button"
            onClick={() => toggleSection("corporateProgramsSection")}
            className="p-1"
          >
            {expandedSections.has("corporateProgramsSection") ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </CardHeader>
      {expandedSections.has("corporateProgramsSection") && (
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="corporateProgramsSection.title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Corporate Programs" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="corporateProgramsSection.subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtitle</FormLabel>
                <FormControl>
                  <Input placeholder="Upskill Your Organization" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="corporateProgramsSection.description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your corporate programs... (Use double line breaks for paragraphs)"
                    rows={8}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>Maximum 2000 characters. Use double line breaks (Enter twice) for paragraph separation.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="corporateProgramsSection.ctaMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CTA Message</FormLabel>
                <FormControl>
                  <Input placeholder="Contact us for more information" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>Message shown before the button</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="corporateProgramsSection.ctaText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CTA Button Text</FormLabel>
                <FormControl>
                  <Input placeholder="Inquire Now" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="corporateProgramsSection.ctaLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CTA Button Link</FormLabel>
                <FormControl>
                  <Input placeholder="/contact" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>Internal link (e.g., /contact) or external URL</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="corporateProgramsSection.image"
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
                <FormDescription>Recommended: 1200x800px</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      )}
    </Card>
  );
};
