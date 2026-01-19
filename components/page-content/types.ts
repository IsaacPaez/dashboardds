import { z } from "zod";

// Schema definitions for each section
export const titleSchema = z.object({
  part1: z.string().min(1, "Title part 1 is required").max(200),
  part2: z.string().min(1, "Title part 2 is required").max(200),
  gradientFrom: z.string().default("#4CAF50"),
  gradientVia: z.string().default("#43e97b"),
  gradientTo: z.string().default("#38f9d7"),
});

export const statisticSchema = z.object({
  value: z.coerce.number().min(0),
  label: z.string().min(1).max(50),
  suffix: z.string().max(5).default("+"),
});

export const ctaButtonSchema = z.object({
  text: z.string().min(1).max(100),
  link: z.string().min(1),
  actionType: z.enum(["link", "modal"]),
  modalType: z.enum(["service-selector", "custom"]).optional(),
  order: z.coerce.number().min(0).default(0),
});

export const backgroundImageSchema = z.object({
  mobile: z.string().url("Must be a valid URL"),
  desktop: z.string().url("Must be a valid URL"),
});

export const featureSectionSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  subtitle: z.string().min(1, "Subtitle is required").max(100),
  description: z.string().min(10, "Description is required").max(2000),
  image: z.string().url("Must be a valid URL"),
}).optional();

export const corporateProgramsSectionSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  subtitle: z.string().min(1, "Subtitle is required").max(200),
  description: z.string().min(10, "Description is required").max(2000),
  ctaMessage: z.string().min(1, "CTA Message is required").max(200),
  ctaText: z.string().min(1, "CTA Text is required").max(50),
  ctaLink: z.string().min(1, "CTA Link is required").max(500),
  image: z.string().url("Must be a valid URL"),
}).optional();

export const benefitsSectionSchema = z.object({
  title: z.object({
    text: z.string().min(1, "Title is required").max(200),
    gradientFrom: z.string().default("#27ae60"),
    gradientVia: z.string().default("#000000"),
    gradientTo: z.string().default("#0056b3"),
  }),
  items: z.array(
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
  ).max(10),
}).optional();

export const drivingLessonsTitleSchema = z.object({
  text: z.string().max(200).default("OUR DRIVING LESSONS"),
  gradientFrom: z.string().default("#27ae60"),
  gradientVia: z.string().default("#000000"),
  gradientTo: z.string().default("#0056b3"),
});

export const trafficCoursesSectionSchema = z.object({
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
}).optional();

export const areasWeServeSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(500),
}).optional();

// Main schema
export const pageContentSchema = z.object({
  pageType: z.enum(["home", "about", "services", "contact", "custom"]),
  title: titleSchema,
  description: z.string().min(10, "Description is required").max(1000),
  statistics: z.array(statisticSchema).max(10),
  ctaButtons: z.array(ctaButtonSchema).max(5),
  backgroundImage: backgroundImageSchema,
  featureSection: featureSectionSchema,
  corporateProgramsSection: corporateProgramsSectionSchema,
  benefitsSection: benefitsSectionSchema,
  drivingLessonsTitle: drivingLessonsTitleSchema,
  trafficCoursesSection: trafficCoursesSectionSchema,
  areasWeServe: areasWeServeSchema,
  isActive: z.boolean().default(true),
  order: z.coerce.number().int().min(0).default(0),
});

export type PageContentFormType = z.infer<typeof pageContentSchema>;

// Section prop types
export interface SectionProps {
  form: any; // UseFormReturn from react-hook-form
  expandedSections: Set<string>;
  toggleSection: (section: string) => void;
}
