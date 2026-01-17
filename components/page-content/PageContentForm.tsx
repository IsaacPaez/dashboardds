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
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
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
  benefitsSection: z
    .object({
      title: z.object({
        text: z.string().min(1, "Title is required").max(200),
        gradientFrom: z.string().default("#27ae60"),
        gradientVia: z.string().default("#000000"),
        gradientTo: z.string().default("#0056b3"),
      }),
      items: z
        .array(
          z.object({
            image: z.string().url("Must be a valid URL"),
            title: z.string().min(1, "Title is required").max(100),
            description: z.string().min(1, "Description is required").max(500),
            link: z.union([
              z.string().url("Must be a valid URL"),
              z.literal(""),
            ]).optional(),
            order: z.coerce.number().min(0).default(0),
          })
        )
        .max(10),
    })
    .optional(),
  drivingLessonsTitle: z.object({
    text: z.string().max(200).default("OUR DRIVING LESSONS"),
    gradientFrom: z.string().default("#27ae60"),
    gradientVia: z.string().default("#000000"),
    gradientTo: z.string().default("#0056b3"),
  }),
  trafficCoursesSection: z.object({
    title: z.object({
      text: z.string().min(1, "Title is required").max(100),
      gradientFrom: z.string().default("#27ae60"),
      gradientTo: z.string().default("#ffffff"),
    }),
    backgroundImage: z.string().url("Must be a valid URL"),
    cards: z.array(
      z.object({
        title: z.string().min(1, "Title is required").max(100),
        items: z.array(z.string()).max(10),
        ctaText: z.string().min(1, "CTA text is required").max(50),
        ctaLink: z.string().min(1, "CTA link is required"),
        order: z.coerce.number().min(0).default(0),
      })
    ).max(4),
  }).optional(),
  areasWeServe: z.object({
    title: z.string().min(1, "Title is required").max(200),
    description: z.string().min(1, "Description is required").max(500),
  }).optional(),
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
  const [expandedBenefits, setExpandedBenefits] = useState<Set<number>>(new Set([0]));
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["hero", "statistics", "ctaButtons"])
  );
  const isEditing = !!contentId;

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

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
      benefitsSection: {
        title: {
          text: "WHY LEARN WITH US?",
          gradientFrom: "#27ae60",
          gradientVia: "#000000",
          gradientTo: "#0056b3",
        },
        items: [],
      },
      drivingLessonsTitle: {
        text: "OUR DRIVING LESSONS",
        gradientFrom: "#27ae60",
        gradientVia: "#000000",
        gradientTo: "#0056b3",
      },
      areasWeServe: {
        title: "Areas We Serve",
        description: "We are dedicated to providing world-class driving school services throughout Palm Beach County and surrounding areas.",
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

  const {
    fields: benefitFields,
    append: appendBenefit,
    remove: removeBenefit,
  } = useFieldArray({
    control: form.control,
    name: "benefitsSection.items",
  });

  const {
    fields: trafficCourseCardFields,
    append: appendTrafficCourseCard,
    remove: removeTrafficCourseCard,
  } = useFieldArray({
    control: form.control,
    name: "trafficCoursesSection.cards",
  });

  useEffect(() => {
    if (contentId) {
      const fetchContent = async () => {
        try {
          const res = await fetch(`/api/page-content/${contentId}`);
          if (res.ok) {
            const data = await res.json();
            
            // Convertir título de benefitsSection si es string a objeto
            let benefitsSection = data.benefitsSection || {
              title: {
                text: "",
                gradientFrom: "#27ae60",
                gradientVia: "#000000",
                gradientTo: "#0056b3"
              },
              items: [],
            };
            
            // Si title es string, convertirlo a objeto
            if (benefitsSection.title && typeof benefitsSection.title === "string") {
              benefitsSection = {
                ...benefitsSection,
                title: {
                  text: benefitsSection.title,
                  gradientFrom: "#27ae60",
                  gradientVia: "#000000",
                  gradientTo: "#0056b3"
                }
              };
            } else if (!benefitsSection.title) {
              // Si no hay title, usar objeto por defecto
              benefitsSection = {
                ...benefitsSection,
                title: {
                  text: "",
                  gradientFrom: "#27ae60",
                  gradientVia: "#000000",
                  gradientTo: "#0056b3"
                }
              };
            } else {
              // Si title ya es objeto, asegurar que todos los campos existan
              benefitsSection = {
                ...benefitsSection,
                title: {
                  text: benefitsSection.title.text || "",
                  gradientFrom: benefitsSection.title.gradientFrom || "#27ae60",
                  gradientVia: benefitsSection.title.gradientVia || "#000000",
                  gradientTo: benefitsSection.title.gradientTo || "#0056b3"
                }
              };
            }
            
            // Asegurar que drivingLessonsTitle tenga valores por defecto
            let drivingLessonsTitle = data.drivingLessonsTitle || {
              text: "OUR DRIVING LESSONS",
              gradientFrom: "#27ae60",
              gradientVia: "#000000",
              gradientTo: "#0056b3"
            };
            
            // Asegurar que todos los campos existan
            drivingLessonsTitle = {
              text: drivingLessonsTitle.text || "OUR DRIVING LESSONS",
              gradientFrom: drivingLessonsTitle.gradientFrom || "#27ae60",
              gradientVia: drivingLessonsTitle.gradientVia || "#000000",
              gradientTo: drivingLessonsTitle.gradientTo || "#0056b3"
            };
            
            console.log("Loading drivingLessonsTitle:", drivingLessonsTitle);
            
            // Asegurar que trafficCoursesSection tenga valores por defecto
            const trafficCoursesSection = data.trafficCoursesSection;
            
            // Asegurar que areasWeServe tenga valores por defecto
            const areasWeServe = data.areasWeServe || {
              title: "Areas We Serve",
              description: "We are dedicated to providing world-class driving school services throughout Palm Beach County and surrounding areas.",
            };
            
            // Asegurar que featureSection siempre tenga valores definidos
            form.reset({
              ...data,
              featureSection: data.featureSection || {
                title: "",
                subtitle: "",
                description: "",
                image: "",
              },
              benefitsSection,
              drivingLessonsTitle,
              trafficCoursesSection,
              areasWeServe,
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

      // Si benefitsSection no tiene título o items, no lo enviamos
      if (
        !payload.benefitsSection ||
        !payload.benefitsSection.title ||
        !payload.benefitsSection.title.text ||
        payload.benefitsSection.items.length === 0
      ) {
        delete payload.benefitsSection;
      }

      console.log("Full payload being sent:", JSON.stringify(payload, null, 2));

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

              {/* Background Images */}
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
              </div>
            </CardContent>
            )}
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Statistics (Optional)</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      appendStatistic({ value: 0, label: "", suffix: "+" })
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
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
              </div>
            </CardHeader>
            {expandedSections.has("statistics") && (
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
            )}
          </Card>

          {/* CTA Buttons */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>CTA Buttons (Optional)</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      appendCta({ text: "", link: "", actionType: "link", order: 0 })
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                  <button
                    type="button"
                    onClick={() => toggleSection("ctaButtons")}
                    className="p-1"
                  >
                    {expandedSections.has("ctaButtons") ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </CardHeader>
            {expandedSections.has("ctaButtons") && (
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
            )}
          </Card>

          {/* Feature Section */}
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
            )}
          </Card>

          {/* Benefits Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Benefits Section (Optional)</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      appendBenefit({
                        image: "",
                        title: "",
                        description: "",
                        link: "",
                        order: benefitFields.length,
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Benefit
                  </Button>
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
                        <Input
                          placeholder="WHY LEARN WITH US?"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Main title for the benefits carousel section
                      </FormDescription>
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
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                            <span>{benefitTitle}</span>
                          </button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              removeBenefit(index);
                              // Remover del estado de expandidos también
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
                                    <Input
                                      placeholder="Experienced Instructors"
                                      {...field}
                                    />
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
                                    <Textarea
                                      placeholder="Our instructors are certified..."
                                      rows={3}
                                      {...field}
                                    />
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
                                    <Input
                                      placeholder="https://example.com/page"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Leave empty if you don&apos;t want the image to be clickeable
                                  </FormDescription>
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

          {/* Driving Lessons Title Section */}
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
                        <Input
                          placeholder="OUR DRIVING LESSONS"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Main title for the driving lessons section
                      </FormDescription>
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

          {/* Traffic Courses Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Traffic Courses Section (Optional)</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      appendTrafficCourseCard({
                        title: "",
                        items: [""],
                        ctaText: "",
                        ctaLink: "",
                        order: trafficCourseCardFields.length,
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Card
                  </Button>
                  <button
                    type="button"
                    onClick={() => toggleSection("trafficCoursesSection")}
                    className="p-1"
                  >
                    {expandedSections.has("trafficCoursesSection") ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </CardHeader>
            {expandedSections.has("trafficCoursesSection") && (
              <CardContent className="space-y-6">
                {/* Title */}
                <div className="space-y-4">
                  <FormLabel>Section Title</FormLabel>
                  <FormField
                    control={form.control}
                    name="trafficCoursesSection.title.text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title Text</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="TRAFFIC COURSES"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="trafficCoursesSection.title.gradientFrom"
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
                      name="trafficCoursesSection.title.gradientTo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gradient To (usually white)</FormLabel>
                          <FormControl>
                            <Input {...field} type="color" value={field.value || "#ffffff"} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Background Image */}
                <FormField
                  control={form.control}
                  name="trafficCoursesSection.backgroundImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Background Image</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value ? [field.value] : []}
                          onChange={(url) => field.onChange(url)}
                          onRemove={() => field.onChange("")}
                        />
                      </FormControl>
                      <FormDescription>Recommended: 1920x600px</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Cards */}
                <div className="space-y-4">
                  <FormLabel>Course Cards (Max 4)</FormLabel>
                  {trafficCourseCardFields.map((field, cardIndex) => (
                    <Card key={field.id} className="p-4 border-2">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold">Card {cardIndex + 1}</h4>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeTrafficCourseCard(cardIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <FormField
                          control={form.control}
                          name={`trafficCoursesSection.cards.${cardIndex}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card Title</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Live Classroom"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-2">
                          <FormLabel>List Items</FormLabel>
                          {form.watch(`trafficCoursesSection.cards.${cardIndex}.items`)?.map((_, itemIndex) => (
                            <div key={itemIndex} className="flex gap-2">
                              <FormField
                                control={form.control}
                                name={`trafficCoursesSection.cards.${cardIndex}.items.${itemIndex}`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input
                                        placeholder="Enter item text"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  const currentItems = form.getValues(`trafficCoursesSection.cards.${cardIndex}.items`) || [];
                                  const newItems = currentItems.filter((_, i) => i !== itemIndex);
                                  form.setValue(`trafficCoursesSection.cards.${cardIndex}.items`, newItems);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const currentItems = form.getValues(`trafficCoursesSection.cards.${cardIndex}.items`) || [];
                              if (currentItems.length < 10) {
                                form.setValue(`trafficCoursesSection.cards.${cardIndex}.items`, [...currentItems, ""]);
                              }
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Item
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`trafficCoursesSection.cards.${cardIndex}.ctaText`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CTA Button Text</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="View Courses"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`trafficCoursesSection.cards.${cardIndex}.ctaLink`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CTA Link</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="/traffic-courses"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name={`trafficCoursesSection.cards.${cardIndex}.order`}
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
                      </div>
                    </Card>
                  ))}

                  {trafficCourseCardFields.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No cards added yet. Click &quot;Add Card&quot; to create one.
                    </p>
                  )}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Areas We Serve Section */}
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
                      <FormDescription>
                        Maximum 500 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            )}
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
