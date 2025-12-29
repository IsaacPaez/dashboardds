"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ImageUpload from "../custom ui/ImageUpload";
import toast from "react-hot-toast";
import { Switch } from "@/components/ui/switch";

const resourceSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(100),
  image: z.string().url("Must be a valid URL"),
  href: z.string().optional(),
  order: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export type ResourceFormType = z.infer<typeof resourceSchema>;

interface ResourceFormProps {
  initialData?: (ResourceFormType & { _id: string }) | null;
}

const ResourceForm: React.FC<ResourceFormProps> = ({ initialData }) => {
  const router = useRouter();
  const form = useForm<ResourceFormType>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: initialData?.title || "",
      image: initialData?.image || "",
      href: initialData?.href || "",
      order: initialData?.order ?? 0,
      isActive: initialData?.isActive ?? true,
    },
  });

  const onSubmit = async (values: ResourceFormType) => {
    try {
      const url = initialData
        ? `/api/resources/${initialData._id}`
        : "/api/resources";
      const method = initialData ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        toast.success(
          `Resource ${initialData ? "updated" : "created"} successfully`
        );
        router.push("/resources");
      } else {
        toast.error("Failed to submit form");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="p-10 mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold">
        {initialData ? "Edit Resource" : "Create New Resource"}
      </h1>
      <Separator className="bg-gray-300 my-4" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., FAQ, DMV Handbook" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
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
            name="href"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL (Optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="https://example.com or /internal-page"
                  />
                </FormControl>
                <FormDescription>
                  Leave empty if no link is needed. Can be internal or external.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    placeholder="0"
                    min="0"
                  />
                </FormControl>
                <FormDescription>
                  Lower numbers appear first (0, 1, 2...)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Status</FormLabel>
                  <FormDescription>
                    Enable to show this resource on the website
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="bg-blue-600 text-white">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ResourceForm;
