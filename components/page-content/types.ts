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
  mobile: z.string().default(""),
  desktop: z.string().default(""),
});

export const featureSectionSchema = z.object({
  title: z.string().max(200).default(""),
  subtitle: z.string().max(100).default(""),
  description: z.string().max(2000).default(""),
  image: z.string().default(""),
}).optional();

export const corporateProgramsSectionSchema = z.object({
  title: z.string().max(200).default(""),
  subtitle: z.string().max(200).default(""),
  description: z.string().max(2000).default(""),
  ctaMessage: z.string().max(200).default(""),
  ctaText: z.string().max(50).default(""),
  ctaLink: z.string().max(500).default(""),
  image: z.string().default(""),
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

export const lessonsPageSchema = z.object({
  title: z.object({
    part1: z.string().max(100).default(""),
    part2: z.string().max(100).default(""),
    part3: z.string().max(100).default(""),
  }),
  description: z.string().max(2000).default(""),
  mainImage: z.string().default(""),
  cards: z.array(
    z.object({
      title: z.string().min(1, "Title is required").max(100),
      description: z.string().min(1, "Description is required").max(500),
      buttonText: z.string().min(1, "Button text is required").max(50),
      buttonLink: z.string().min(1, "Button link is required"),
      buttonColor: z.enum(["blue", "green", "red", "yellow"]).default("blue"),
    })
  ).max(3, "Maximum 3 cards allowed").default([]),
}).optional();

export const classesPageSchema = z.object({
  title: z.string().max(200).default(""),
  description: z.string().max(2000).default(""),
}).optional();

export const onlineCoursesPageSchema = z.object({
  title: z.string().max(200).default(""),
  description: z.string().max(2000).default(""),
}).optional();

// Driving Test page schema
export const drivingTestInfoBoxSchema = z.object({
  title: z.string().min(1, "Title is required"),
  points: z.array(z.string().min(1, "Point cannot be empty")).min(1, "At least one point is required"),
});

export const drivingTestPageSchema = z.object({
  title: z.string().max(200).default(""),
  cta: z.object({
    text: z.string().max(50).default(""),
    link: z.string().max(500).default(""),
  }).default({ text: "", link: "" }),
  subtitle: z.string().max(200).default(""),
  description: z.string().max(2000).default(""),
  infoBoxes: z.array(drivingTestInfoBoxSchema).max(3, "Maximum 3 info boxes allowed").default([]),
  image: z.string().default(""),
}).optional();

// Main schema with conditional validation
export const pageContentSchema = z.object({
  pageType: z.enum(["home", "about", "services", "contact", "custom", "lessons", "classes", "onlineCourses", "drivingTest"]),
  title: titleSchema.optional(),
  description: z.string().max(1000).optional(),
  statistics: z.array(statisticSchema).max(10).optional(),
  ctaButtons: z.array(ctaButtonSchema).max(5).optional(),
  backgroundImage: backgroundImageSchema.optional(),
  featureSection: featureSectionSchema,
  corporateProgramsSection: corporateProgramsSectionSchema,
  benefitsSection: benefitsSectionSchema,
  drivingLessonsTitle: drivingLessonsTitleSchema.optional(),
  trafficCoursesSection: trafficCoursesSectionSchema,
  areasWeServe: areasWeServeSchema,
  lessonsPage: lessonsPageSchema,
  classesPage: classesPageSchema,
  onlineCoursesPage: onlineCoursesPageSchema,
  drivingTestPage: drivingTestPageSchema,
  isActive: z.boolean().default(true),
  order: z.coerce.number().int().min(0).default(0),
}).superRefine((data, ctx) => {
  // Validate lessons page fields when pageType is "lessons"
  if (data.pageType === "lessons") {
    console.log("🔍 Validating lessons page:", data.lessonsPage);
    
    if (!data.lessonsPage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Lessons page content is required",
        path: ["lessonsPage"],
      });
      return;
    }
    
    if (!data.lessonsPage.title?.part1 || data.lessonsPage.title.part1.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Part 1 is required",
        path: ["lessonsPage", "title", "part1"],
      });
    }
    
    if (!data.lessonsPage.title?.part2 || data.lessonsPage.title.part2.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Part 2 is required",
        path: ["lessonsPage", "title", "part2"],
      });
    }
    
    if (!data.lessonsPage.title?.part3 || data.lessonsPage.title.part3.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Part 3 is required",
        path: ["lessonsPage", "title", "part3"],
      });
    }
    
    if (!data.lessonsPage.description || data.lessonsPage.description.trim().length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Description is required (minimum 10 characters)",
        path: ["lessonsPage", "description"],
      });
    }
    
    if (!data.lessonsPage.mainImage || data.lessonsPage.mainImage.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Main image is required",
        path: ["lessonsPage", "mainImage"],
      });
    } else {
      // Validate URL format
      try {
        new URL(data.lessonsPage.mainImage);
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Must be a valid URL",
          path: ["lessonsPage", "mainImage"],
        });
      }
    }
    
    return; // Skip home validation for lessons
  }
  
  // Validate classes page fields when pageType is "classes"
  if (data.pageType === "classes") {
    console.log("🔍 Validating classes page:", data.classesPage);
    
    if (!data.classesPage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Classes page content is required",
        path: ["classesPage"],
      });
      return;
    }
    
    if (!data.classesPage.title || data.classesPage.title.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Title is required",
        path: ["classesPage", "title"],
      });
    }
    
    if (!data.classesPage.description || data.classesPage.description.trim() === "" || data.classesPage.description.trim().length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Description is required (minimum 10 characters)",
        path: ["classesPage", "description"],
      });
    }
    
    console.log("✅ Classes validation passed");
    return; // Skip home validation for classes
  }
  
  // Validate online courses page fields when pageType is "onlineCourses"
  if (data.pageType === "onlineCourses") {
    console.log("🔍 Validating online courses page:", data.onlineCoursesPage);
    
    if (!data.onlineCoursesPage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Online courses page content is required",
        path: ["onlineCoursesPage"],
      });
      return;
    }
    
    if (!data.onlineCoursesPage.title || data.onlineCoursesPage.title.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Title is required",
        path: ["onlineCoursesPage", "title"],
      });
    }
    
    if (!data.onlineCoursesPage.description || data.onlineCoursesPage.description.trim() === "" || data.onlineCoursesPage.description.trim().length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Description is required (minimum 10 characters)",
        path: ["onlineCoursesPage", "description"],
      });
    }
    
    console.log("✅ Online Courses validation passed");
    return; // Skip home validation for online courses
  }
  
  // Validate driving test page fields when pageType is "drivingTest"
  if (data.pageType === "drivingTest") {
    console.log("🔍 Validating driving test page:", data.drivingTestPage);
    
    if (!data.drivingTestPage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Driving test page content is required",
        path: ["drivingTestPage"],
      });
      return;
    }
    
    if (!data.drivingTestPage.title || data.drivingTestPage.title.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Title is required",
        path: ["drivingTestPage", "title"],
      });
    }
    
    if (!data.drivingTestPage.cta?.text || data.drivingTestPage.cta.text.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CTA text is required",
        path: ["drivingTestPage", "cta", "text"],
      });
    }
    
    if (!data.drivingTestPage.cta?.link || data.drivingTestPage.cta.link.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CTA link is required",
        path: ["drivingTestPage", "cta", "link"],
      });
    }
    
    if (!data.drivingTestPage.subtitle || data.drivingTestPage.subtitle.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Subtitle is required",
        path: ["drivingTestPage", "subtitle"],
      });
    }
    
    if (!data.drivingTestPage.description || data.drivingTestPage.description.trim() === "" || data.drivingTestPage.description.trim().length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Description is required (minimum 10 characters)",
        path: ["drivingTestPage", "description"],
      });
    }
    
    if (!data.drivingTestPage.image || data.drivingTestPage.image.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Image is required",
        path: ["drivingTestPage", "image"],
      });
    } else {
      try {
        new URL(data.drivingTestPage.image);
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Image must be a valid URL",
          path: ["drivingTestPage", "image"],
        });
      }
    }
    
    if (!data.drivingTestPage.infoBoxes || data.drivingTestPage.infoBoxes.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one info box is required",
        path: ["drivingTestPage", "infoBoxes"],
      });
    }
    
    console.log("✅ Driving Test validation passed");
    return; // Skip home validation for driving test
  }
  
  // Validate home page fields when pageType is NOT "lessons", "classes", "onlineCourses", or "drivingTest"
  if (!data.description || data.description.trim().length < 10) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Description is required (minimum 10 characters)",
      path: ["description"],
    });
  }
  
  // Validate backgroundImage URLs for non-lessons pages
  if (!data.backgroundImage?.mobile || data.backgroundImage.mobile.trim() === "") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Mobile background image is required",
      path: ["backgroundImage", "mobile"],
    });
  } else {
    try {
      new URL(data.backgroundImage.mobile);
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Must be a valid URL",
        path: ["backgroundImage", "mobile"],
      });
    }
  }
  
  if (!data.backgroundImage?.desktop || data.backgroundImage.desktop.trim() === "") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Desktop background image is required",
      path: ["backgroundImage", "desktop"],
    });
  } else {
    try {
      new URL(data.backgroundImage.desktop);
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Must be a valid URL",
        path: ["backgroundImage", "desktop"],
      });
    }
  }
});

export type PageContentFormType = z.infer<typeof pageContentSchema>;

// Section prop types
export interface SectionProps {
  form: any; // UseFormReturn from react-hook-form
  expandedSections: Set<string>;
  toggleSection: (section: string) => void;
}
