// PageContentFormRefactored.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowUpDown, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Loader from "../custom ui/Loader";
import ImageUpload from "@/components/custom ui/ImageUpload";
import { SectionOrderModal } from "../modals/SectionOrderModal";

// Import modular sections
import {
  HeroSection,
  FeatureSection,
  CorporateProgramsSection,
  BenefitsSection,
  DrivingLessonsTitleSection,
  AreasWeServeSection
} from "./sections";

// Import types and schemas
import { pageContentSchema, PageContentFormType } from "./types";

interface PageContentFormProps {
  contentId?: string;
}

const PageContentFormRefactored: React.FC<PageContentFormProps> = ({ contentId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set([])
  );
  const [sectionOrderModalOpen, setSectionOrderModalOpen] = useState(false);
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
    mode: "onSubmit", // Validate only on submit
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
      corporateProgramsSection: {
        title: "",
        subtitle: "",
        description: "",
        ctaMessage: "",
        ctaText: "",
        ctaLink: "",
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
      lessonsPage: {
        title: {
          part1: "",
          part2: "",
          part3: "",
        },
        description: "",
        mainImage: "",
        cards: [],
      },
      classesPage: {
        title: "",
        description: "",
      },
      isActive: true,
      order: 0,
    },
  });

  // Load existing content if editing
  useEffect(() => {
    if (contentId) {
      const fetchContent = async () => {
        try {
          setLoading(true);
          const res = await fetch(`/api/page-content/${contentId}`);
          
          if (res.ok) {
            const data = await res.json();
            // Handle benefitsSection title migration (string to object)
            let benefitsSection = data.benefitsSection;
            if (benefitsSection && typeof benefitsSection.title === "string") {
              benefitsSection = {
                ...benefitsSection,
                title: {
                  text: benefitsSection.title || "",
                  gradientFrom: "#27ae60",
                  gradientVia: "#000000",
                  gradientTo: "#0056b3",
                },
              };
            } else if (benefitsSection) {
              benefitsSection = {
                ...benefitsSection,
                title: {
                  text: benefitsSection.title.text || "",
                  gradientFrom: benefitsSection.title.gradientFrom || "#27ae60",
                  gradientVia: benefitsSection.title.gradientVia || "#000000",
                  gradientTo: benefitsSection.title.gradientTo || "#0056b3",
                },
              };
            }

            // Handle drivingLessonsTitle defaults
            let drivingLessonsTitle = data.drivingLessonsTitle || {
              text: "OUR DRIVING LESSONS",
              gradientFrom: "#27ae60",
              gradientVia: "#000000",
              gradientTo: "#0056b3",
            };

            drivingLessonsTitle = {
              text: drivingLessonsTitle.text || "OUR DRIVING LESSONS",
              gradientFrom: drivingLessonsTitle.gradientFrom || "#27ae60",
              gradientVia: drivingLessonsTitle.gradientVia || "#000000",
              gradientTo: drivingLessonsTitle.gradientTo || "#0056b3",
            };

            const trafficCoursesSection = data.trafficCoursesSection;
            const areasWeServe = data.areasWeServe || {
              title: "Areas We Serve",
              description: "We are dedicated to providing world-class driving school services throughout Palm Beach County and surrounding areas.",
            };

            // Handle lessonsPage defaults
            const lessonsPage = data.lessonsPage || {
              title: {
                part1: "",
                part2: "",
                part3: "",
              },
              description: "",
              mainImage: "",
              cards: [],
            };

            // Handle classesPage defaults
            const classesPage = data.classesPage || {
              title: "",
              description: "",
            };

            form.reset({
              ...data,
              featureSection: data.featureSection || {
                title: "",
                subtitle: "",
                description: "",
                image: "",
              },
              corporateProgramsSection: data.corporateProgramsSection || {
                title: "",
                subtitle: "",
                description: "",
                ctaMessage: "",
                ctaText: "",
                ctaLink: "",
                image: "",
              },
              benefitsSection,
              drivingLessonsTitle,
              trafficCoursesSection,
              areasWeServe,
              lessonsPage,
              classesPage,
            });
          } else {
            const errorData = await res.json();
            toast.error(errorData.message || "Failed to fetch page content");
            router.push("/page-content");
          }
        } catch (error) {
          console.error("[FETCH_CONTENT_ERROR]", error);
          toast.error("Error loading page content");
          router.push("/page-content");
        } finally {
          setLoading(false);
        }
      };
      fetchContent();
    }
  }, [contentId, form, router]);

  const onSubmit = async (values: PageContentFormType) => {
    console.log("� onSubmit called");
    console.log("�🚀 Form submitted with values:", values);
    console.log("📋 Form errors:", form.formState.errors);
    
    try {
      let payload: any;
      
      // For lessons page, only send lessons-specific data
      if (values.pageType === "lessons") {
        payload = {
          pageType: values.pageType,
          lessonsPage: values.lessonsPage,
          isActive: values.isActive,
          order: values.order,
        };
        console.log("📦 Lessons payload:", payload);
      } else if (values.pageType === "classes") {
        // For classes page, only send classes-specific data
        payload = {
          pageType: values.pageType,
          classesPage: values.classesPage,
          isActive: values.isActive,
          order: values.order,
        };
        console.log("📦 Classes payload:", payload);
      } else {
        // For other pages, use the original cleanup logic
        payload = { ...values };
        console.log("📦 Payload before cleanup:", payload);
        
        // Clean up empty optional sections
        if (
          payload.featureSection &&
          (!payload.featureSection.title ||
            !payload.featureSection.subtitle ||
            !payload.featureSection.description ||
            !payload.featureSection.image)
        ) {
          delete payload.featureSection;
        }

        if (
          payload.corporateProgramsSection &&
          (!payload.corporateProgramsSection.title ||
            !payload.corporateProgramsSection.subtitle ||
            !payload.corporateProgramsSection.description ||
            !payload.corporateProgramsSection.ctaMessage ||
            !payload.corporateProgramsSection.ctaText ||
            !payload.corporateProgramsSection.ctaLink ||
            !payload.corporateProgramsSection.image)
        ) {
          delete payload.corporateProgramsSection;
        }

        if (
          !payload.benefitsSection ||
          !payload.benefitsSection.title ||
          !payload.benefitsSection.title.text ||
          payload.benefitsSection.items.length === 0
        ) {
          delete payload.benefitsSection;
        }
      }

      const url = isEditing ? `/api/page-content/${contentId}` : "/api/page-content";
      const method = isEditing ? "PATCH" : "POST";

      console.log("🌐 Making request to:", url, "Method:", method);
      console.log("📤 Final payload:", JSON.stringify(payload, null, 2));

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("📥 Response status:", res.status);

      if (res.ok) {
        const data = await res.json();
        console.log("✅ Success response:", data);
        toast.success(`Page content ${isEditing ? "updated" : "created"} successfully`);
        router.push("/page-content");
      } else {
        const error = await res.json();
        console.error("❌ Error response:", error);
        toast.error(error.message || "Failed to submit form");
      }
    } catch (error) {
      console.error("[SUBMIT_ERROR]", error);
      toast.error("Something went wrong!");
    }
  };

  const { fields: cardFields, append: appendCard, remove: removeCard } = useFieldArray({
    control: form.control,
    name: "lessonsPage.cards",
  });

  if (loading) return <Loader />;

  const sectionProps = { form, expandedSections, toggleSection };
  const pageType = form.watch("pageType");

  return (
    <div className="p-10 mx-auto bg-white rounded-lg shadow-md max-w-7xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {isEditing ? "Edit Page Content" : "Create New Page Content"}
        </h1>
        {isEditing && pageType === "home" && contentId && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setSectionOrderModalOpen(true)}
            className="flex items-center gap-2"
          >
            <ArrowUpDown className="w-4 h-4" />
            Reorder Sections
          </Button>
        )}
      </div>
      <Separator className="bg-gray-300 my-4" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(
          onSubmit, 
          (errors) => {
            console.error("❌❌❌ VALIDATION ERRORS:", errors);
            console.error("❌ All form errors:", form.formState.errors);
            console.error("❌ Form values:", form.getValues());
            toast.error("Please fix the validation errors");
          }
        )} className="space-y-8">
          {/* Page Type */}
          <FormField
            control={form.control}
            name="pageType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Page Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <SelectItem value="lessons">Lessons</SelectItem>
                    <SelectItem value="classes">Classes</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Modular Sections - Show based on pageType */}
          {form.watch("pageType") !== "lessons" && form.watch("pageType") !== "classes" && (
            <>
              <HeroSection {...sectionProps} />
              <FeatureSection {...sectionProps} />
              <CorporateProgramsSection {...sectionProps} />
              <BenefitsSection {...sectionProps} />
              <DrivingLessonsTitleSection {...sectionProps} />
              {/* Traffic Courses Section - Note: This one needs special handling due to cards */}
              <AreasWeServeSection {...sectionProps} />
            </>
          )}

          {/* Classes Page Section */}
          {form.watch("pageType") === "classes" && (
            <Card>
              <CardHeader>
                <CardTitle>Classes Page Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <FormField
                  control={form.control}
                  name="classesPage.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Title</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="e.g., Driving Classes" />
                      </FormControl>
                      <FormDescription>Main heading for the classes page</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="classesPage.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field}
                          value={field.value || ""}
                          placeholder="Enter description for classes page" 
                          rows={5}
                          className="resize-none"
                        />
                      </FormControl>
                      <FormDescription>Brief description that appears below the title</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Lessons Page Section */}
          {form.watch("pageType") === "lessons" && (
            <Card>
              <CardHeader>
                <CardTitle>Lessons Page Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title Configuration */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Title (3 parts with gradient)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="lessonsPage.title.part1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Part 1</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="LEARN" />
                          </FormControl>
                          <FormDescription>First part (blue)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lessonsPage.title.part2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Part 2</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="ROAD SKILLS" />
                          </FormControl>
                          <FormDescription>Second part (black)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lessonsPage.title.part3"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Part 3</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="FOR LIFE" />
                          </FormControl>
                          <FormDescription>Third part (green)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Description */}
                <FormField
                  control={form.control}
                  name="lessonsPage.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Enter description for lessons page" 
                          rows={5}
                          className="resize-none"
                        />
                      </FormControl>
                      <FormDescription>Use Enter to create line breaks</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Main Image */}
                <FormField
                  control={form.control}
                  name="lessonsPage.mainImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Image</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value ? [field.value] : []}
                          onChange={(url) => field.onChange(url)}
                          onRemove={() => field.onChange("")}
                        />
                      </FormControl>
                      <FormDescription>Main hero image for the lessons page</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Cards Section */}
                <div className="space-y-4 mt-8 border-t pt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Information Cards (Optional, max 3)</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (cardFields.length >= 3) {
                          toast.error("Maximum 3 cards allowed");
                          return;
                        }
                        appendCard({
                          title: "",
                          description: "",
                          buttonText: "",
                          buttonLink: "",
                          buttonColor: "blue",
                        });
                      }}
                      disabled={cardFields.length >= 3}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Card
                    </Button>
                  </div>

                  {cardFields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-4">
                          <FormField
                            control={form.control}
                            name={`lessonsPage.cards.${index}.title`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Card Title</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="e.g., Nervous Driver or Parent?" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`lessonsPage.cards.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    placeholder="Brief description"
                                    rows={3}
                                    className="resize-none"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`lessonsPage.cards.${index}.buttonText`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Button Text</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="e.g., Read More" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`lessonsPage.cards.${index}.buttonColor`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Button Color</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="blue">Blue</SelectItem>
                                      <SelectItem value="green">Green</SelectItem>
                                      <SelectItem value="red">Red</SelectItem>
                                      <SelectItem value="yellow">Yellow</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name={`lessonsPage.cards.${index}.buttonLink`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Button Link</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="/nervous-driver or https://..." />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCard(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

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
                    <FormDescription>Enable to show this on the website</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/page-content")}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 text-white"
              onClick={(e) => {
                console.log("🔵 Button clicked!");
                console.log("📊 Form state:", {
                  isValid: form.formState.isValid,
                  isSubmitting: form.formState.isSubmitting,
                  errors: form.formState.errors,
                  values: form.getValues(),
                });
              }}
            >
              {isEditing ? "Update" : "Create"} Page Content
            </Button>
          </div>
        </form>
      </Form>

      {/* Section Order Modal */}
      {contentId && (
        <SectionOrderModal
          isOpen={sectionOrderModalOpen}
          onClose={() => setSectionOrderModalOpen(false)}
          contentId={contentId}
        />
      )}
    </div>
  );
};

export default PageContentFormRefactored;
