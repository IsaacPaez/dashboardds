"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import ImageUpload from "../custom ui/ImageUpload";
import toast from "react-hot-toast";
import Loader from "../custom ui/Loader";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const pageContentSchema = z.object({
  pageType: z.enum(["home", "about", "services", "contact", "custom"]),
  title: z.object({
    part1: z.string().min(1, "Title part 1 is required").max(200),
    part2: z.string().min(1, "Title part 2 is required").max(200),
    gradientFrom: z.string().default("#4CAF50"),
    gradientVia: z.string().default("#43e97b"),
    gradientTo: z.string().default("#38f9d7"),
  }),
  description: z.string().min(10, "Description is required").max(1000),
  statistics: z
    .array(
      z.object({
        value: z.coerce.number().min(0),
        label: z.string().min(1).max(50),
        suffix: z.string().max(5).default("+"),
      })
    )
    .max(10),
  ctaButtons: z
    .array(
      z.object({
        text: z.string().min(1).max(100),
        link: z.string().min(1),
        actionType: z.enum(["link", "modal"]),
        modalType: z.enum(["service-selector", "custom"]).optional(),
        order: z.coerce.number().min(0).default(0),
      })
    )
    .max(5),
  backgroundImage: z.object({
    mobile: z.string().url("Must be a valid URL"),
    desktop: z.string().url("Must be a valid URL"),
  }),
  featureSection: z
    .object({
      title: z.string().min(1, "Title is required").max(200),
      subtitle: z.string().min(1, "Subtitle is required").max(100),
      description: z.string().min(10, "Description is required").max(2000),
      image: z.string().url("Must be a valid URL"),
    })
    .optional(),
  isActive: z.boolean().default(true),
  order: z.coerce.number().int().min(0).default(0),
});

export type PageContentFormType = z.infer<typeof pageContentSchema>;

interface PageContentFormProps {
  contentId?: string;
}

const PageContentForm: React.FC<PageContentFormProps> = ({ contentId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(!!contentId);
  const isEditing = !!contentId;

  const form = useForm<PageContentFormType>({
    resolver: zodResolver(pageContentSchema),
    defaultValues: {
      pageType: "home",
      title: {
        part1: "Learn To Drive",
        part2: "Safely For Life",
        gradientFrom: "#4CAF50",
        gradientVia: "#43e97b",
        gradientTo: "#38f9d7",
      },
      description: "",
      statistics: [],
      ctaButtons: [],
      backgroundImage: {
        mobile: "",
        desktop: "",
      },
      featureSection: {
        title: "",
        subtitle: "",
        description: "",
        image: "",
      },
      isActive: true,
      order: 0,
    },
  });

  const {
    fields: statisticFields,
    append: appendStatistic,
    remove: removeStatistic,
  } = useFieldArray({
    control: form.control,
    name: "statistics",
  });

  const {
    fields: ctaFields,
    append: appendCta,
    remove: removeCta,
  } = useFieldArray({
    control: form.control,
    name: "ctaButtons",
  });

  useEffect(() => {
    if (contentId) {
      const fetchContent = async () => {
        try {
          const res = await fetch(`/api/page-content/${contentId}`);
          if (res.ok) {
            const data = await res.json();
            // Asegurar que featureSection siempre tenga valores definidos
            form.reset({
              ...data,
              featureSection: data.featureSection || {
                title: "",
                subtitle: "",
                description: "",
                image: "",
              },
            });
          } else {
            toast.error("Failed to fetch page content");
            router.push("/page-content");
          }
        } catch (error) {
          console.error("[FETCH_CONTENT_ERROR]", error);
          toast.error("Error loading page content");
        } finally {
          setLoading(false);
        }
      };
      fetchContent();
    }
  }, [contentId, form, router]);

  const onSubmit = async (values: PageContentFormType) => {
    try {
      // Si featureSection está vacío, no lo enviamos
      const payload = { ...values };
      if (
        payload.featureSection &&
        (!payload.featureSection.title ||
          !payload.featureSection.subtitle ||
          !payload.featureSection.description ||
          !payload.featureSection.image)
      ) {
        delete payload.featureSection;
      }

      const url = isEditing
        ? `/api/page-content/${contentId}`
        : "/api/page-content";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(
          `Page content ${isEditing ? "updated" : "created"} successfully`
        );
        router.push("/page-content");
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to submit form");
      }
    } catch (error) {
      console.error("[SUBMIT_ERROR]", error);
      toast.error("Something went wrong!");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-10 mx-auto bg-white rounded-lg shadow-md max-w-7xl">
      <h1 className="text-2xl font-semibold">
        {isEditing ? "Edit Page Content" : "Create New Page Content"}
      </h1>
      <Separator className="bg-gray-300 my-4" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Page Type */}
          <FormField
            control={form.control}
            name="pageType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Page Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select page type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="about">About</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="contact">Contact</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Title Section */}
          <Card>
            <CardHeader>
              <CardTitle>Title Configuration</CardTitle>
            </CardHeader>
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
            </CardContent>
          </Card>

          {/* Description */}
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

          {/* Statistics */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Statistics</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendStatistic({ value: 0, label: "", suffix: "+" })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Statistic
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
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
                                <Input
                                  type="number"
                                  {...field}
                                  placeholder="9000"
                                />
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
            </CardContent>
          </Card>

          {/* CTA Buttons */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>CTA Buttons</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendCta({ text: "", link: "", actionType: "link", order: 0 })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Button
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
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
                                  <Input
                                    {...field}
                                    placeholder="Book Driving Lessons"
                                  />
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
                                  <Input {...field} placeholder="/lessons" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`ctaButtons.${index}.actionType`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Action Type</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
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

                          <FormField
                            control={form.control}
                            name={`ctaButtons.${index}.order`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Order</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} min="0" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Modal Type - Solo visible si actionType es "modal" */}
                        {form.watch(`ctaButtons.${index}.actionType`) === "modal" && (
                          <FormField
                            control={form.control}
                            name={`ctaButtons.${index}.modalType`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Modal Type</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select modal type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="service-selector">
                                      Service Selector (3 options)
                                    </SelectItem>
                                    <SelectItem value="custom">
                                      Custom Modal
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  Service Selector: Shows Driving Test, Driving Lessons, Traffic School options
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
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
            </CardContent>
          </Card>

          {/* Feature Section */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Section (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="featureSection.title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feature Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="BBB Accredited Driving Traffic School"
                        {...field}
                      />
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
                      <Textarea
                        placeholder="Describe your feature..."
                        rows={6}
                        {...field}
                      />
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
          </Card>

          {/* Background Images */}
          <Card>
            <CardHeader>
              <CardTitle>Background Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
                    <FormDescription>Recommended: 1080x1920px</FormDescription>
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
                    <FormDescription>Recommended: 1920x1080px</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Settings */}
          <div className="flex gap-6">
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Display Order</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min="0" />
                  </FormControl>
                  <FormDescription>Higher numbers appear first</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4 flex-1">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Enable to show this on the website
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
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/page-content")}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 text-white">
              {isEditing ? "Update" : "Create"} Page Content
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PageContentForm;
