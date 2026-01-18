import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SectionProps } from "../types";

export const AreasWeServeSection = ({ form, expandedSections, toggleSection }: SectionProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Areas We Serve Section (Optional)</CardTitle>
          <button
            type="button"
            onClick={() => toggleSection("areasWeServe")}
            className="p-1"
          >
            {expandedSections.has("areasWeServe") ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </CardHeader>
      {expandedSections.has("areasWeServe") && (
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="areasWeServe.title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Areas We Serve" maxLength={200} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="areasWeServe.description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="We are dedicated to providing world-class driving school services..."
                    maxLength={500}
                    rows={4}
                  />
                </FormControl>
                <FormDescription>Maximum 500 characters</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      )}
    </Card>
  );
};
