import mongoose, { Schema, Document, Model } from "mongoose";

// Tipos para el contenido de la página
export interface IStatistic {
  value: number;
  label: string;
  suffix: string;
}

export interface ICtaButton {
  text: string;
  link: string;
  actionType: "link" | "modal";
  modalType?: "service-selector" | "custom";
  order: number;
}

export interface ITitleConfig {
  part1: string;
  part2: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
}

export interface IBenefitsTitleConfig {
  text: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
}

export interface IDrivingLessonsTitleConfig {
  text: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
}

export interface ITrafficCourseCard {
  title: string;
  items: string[];
  ctaText: string;
  ctaLink: string;
  order: number;
}

export interface ITrafficCoursesSection {
  title: {
    text: string;
    gradientFrom: string;
    gradientTo: string;
  };
  backgroundImage: string;
  cards: ITrafficCourseCard[];
}

export interface IAreasWeServeConfig {
  title: string;
  description: string;
}

export interface IBackgroundImage {
  mobile: string;
  desktop: string;
}

export interface IFeatureSection {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

export interface ICorporateProgramsSection {
  title: string;
  subtitle: string;
  description: string;
  ctaMessage: string;
  ctaText: string;
  ctaLink: string;
  image: string;
}

export interface IBenefitItem {
  image: string;
  title: string;
  description: string;
  link?: string;
  order: number;
}

export interface IBenefitsSection {
  title: IBenefitsTitleConfig;
  items: IBenefitItem[];
}

export interface ILessonsCard {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  buttonColor: string; // e.g., "blue" or "green"
}

export interface ILessonsPageContent {
  title: {
    part1: string; // "LEARN"
    part2: string; // "ROAD SKILLS"
    part3: string; // "FOR LIFE"
  };
  description: string;
  mainImage: string;
  cards: ILessonsCard[];
}

export interface IClassesPageContent {
  title: string;
  description: string;
}

export interface IOnlineCoursesPageContent {
  title: string;
  description: string;
}
export interface IDrivingTestInfoBox {
  title: string;
  points: string[];
}

export interface IDrivingTestPageContent {
  title?: string;
  cta?: {
    text: string;
    link: string;
  };
  subtitle?: string;
  description?: string;
  infoBoxes?: IDrivingTestInfoBox[];
  image?: string;
}
export interface IPageContent extends Document {
  pageType: "home" | "about" | "services" | "contact" | "custom" | "lessons" | "classes" | "onlineCourses" | "drivingTest";
  title: ITitleConfig;
  description: string;
  statistics: IStatistic[];
  ctaButtons: ICtaButton[];
  backgroundImage: IBackgroundImage;
  featureSection?: IFeatureSection;
  benefitsSection?: IBenefitsSection;
  drivingLessonsTitle?: IDrivingLessonsTitleConfig;
  trafficCoursesSection?: ITrafficCoursesSection;
  corporateProgramsSection?: ICorporateProgramsSection;
  areasWeServe?: IAreasWeServeConfig;
  lessonsPage?: ILessonsPageContent;
  classesPage?: IClassesPageContent;
  onlineCoursesPage?: IOnlineCoursesPageContent;
  drivingTestPage?: IDrivingTestPageContent;
  sectionOrder?: { id: string; order: number }[];
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const StatisticSchema = new Schema<IStatistic>(
  {
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    label: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    suffix: {
      type: String,
      default: "+",
      maxlength: 5,
    },
  },
  { _id: false }
);

const CtaButtonSchema = new Schema<ICtaButton>(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    link: {
      type: String,
      required: true,
      trim: true,
    },
    actionType: {
      type: String,
      enum: ["link", "modal"],
      default: "link",
    },
    modalType: {
      type: String,
      enum: ["service-selector", "custom"],
      required: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const TitleConfigSchema = new Schema<ITitleConfig>(
  {
    part1: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    part2: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    gradientFrom: {
      type: String,
      default: "#4CAF50",
    },
    gradientVia: {
      type: String,
      default: "#43e97b",
    },
    gradientTo: {
      type: String,
      default: "#38f9d7",
    },
  },
  { _id: false }
);

const BenefitsTitleConfigSchema = new Schema<IBenefitsTitleConfig>(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    gradientFrom: {
      type: String,
      default: "#27ae60",
    },
    gradientVia: {
      type: String,
      default: "#000000",
    },
    gradientTo: {
      type: String,
      default: "#0056b3",
    },
  },
  { _id: false }
);

const DrivingLessonsTitleConfigSchema = new Schema<IDrivingLessonsTitleConfig>(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    gradientFrom: {
      type: String,
      default: "#27ae60",
    },
    gradientVia: {
      type: String,
      default: "#000000",
    },
    gradientTo: {
      type: String,
      default: "#0056b3",
    },
  },
  { _id: false }
);

const TrafficCourseCardSchema = new Schema<ITrafficCourseCard>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    items: {
      type: [String],
      default: [],
      validate: {
        validator: function(arr: string[]) {
          return arr.length <= 10;
        },
        message: "Cannot have more than 10 items per card"
      }
    },
    ctaText: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    ctaLink: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

const TrafficCoursesSectionSchema = new Schema<ITrafficCoursesSection>(
  {
    title: {
      text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },
      gradientFrom: {
        type: String,
        default: "#27ae60",
      },
      gradientTo: {
        type: String,
        default: "#ffffff",
      },
    },
    backgroundImage: {
      type: String,
      required: true,
    },
    cards: {
      type: [TrafficCourseCardSchema],
      default: [],
      validate: {
        validator: function(arr: ITrafficCourseCard[]) {
          return arr.length <= 4;
        },
        message: "Cannot have more than 4 cards"
      }
    },
  },
  { _id: false }
);

const AreasWeServeConfigSchema = new Schema<IAreasWeServeConfig>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  { _id: false }
);

const BackgroundImageSchema = new Schema<IBackgroundImage>(
  {
    mobile: {
      type: String,
      required: true,
    },
    desktop: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const FeatureSectionSchema = new Schema<IFeatureSection>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const CorporateProgramsSectionSchema = new Schema<ICorporateProgramsSection>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    ctaMessage: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    ctaText: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    ctaLink: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const BenefitItemSchema = new Schema<IBenefitItem>(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    link: {
      type: String,
      required: false,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const BenefitsSectionSchema = new Schema<IBenefitsSection>(
  {
    title: {
      type: BenefitsTitleConfigSchema,
      required: true,
    },
    items: {
      type: [BenefitItemSchema],
      default: [],
      validate: {
        validator: (arr: IBenefitItem[]) => arr.length <= 10,
        message: "Maximum 10 benefit items allowed",
      },
    },
  },
  { _id: false }
);

const PageContentSchema: Schema = new Schema(
  {
    pageType: {
      type: String,
      enum: ["home", "about", "services", "contact", "custom", "lessons", "classes", "onlineCourses", "drivingTest"],
      required: true,
      index: true,
    },
    title: {
      type: TitleConfigSchema,
      required: false,
    },
    description: {
      type: String,
      required: false,
      trim: true,
      maxlength: 1000,
    },
    statistics: {
      type: [StatisticSchema],
      required: false,
      validate: {
        validator: (arr: IStatistic[]) => arr.length <= 10,
        message: "Maximum 10 statistics allowed",
      },
    },
    ctaButtons: {
      type: [CtaButtonSchema],
      required: false,
      validate: {
        validator: (arr: ICtaButton[]) => arr.length <= 5,
        message: "Maximum 5 CTA buttons allowed",
      },
    },
    backgroundImage: {
      type: BackgroundImageSchema,
      required: false,
    },
    featureSection: {
      type: FeatureSectionSchema,
      required: false,
    },
    benefitsSection: {
      type: BenefitsSectionSchema,
      required: false,
    },
    drivingLessonsTitle: {
      type: DrivingLessonsTitleConfigSchema,
      required: false,
    },
    trafficCoursesSection: {
      type: TrafficCoursesSectionSchema,
      required: false,
    },
    corporateProgramsSection: {
      type: CorporateProgramsSectionSchema,
      required: false,
    },
    areasWeServe: {
      type: AreasWeServeConfigSchema,
      required: false,
    },
    lessonsPage: {
      type: new Schema({
        title: {
          part1: { type: String, required: true },
          part2: { type: String, required: true },
          part3: { type: String, required: true },
        },
        description: { type: String, required: true },
        mainImage: { type: String, required: true },
        cards: {
          type: [
            {
              title: { type: String, required: true },
              description: { type: String, required: true },
              buttonText: { type: String, required: true },
              buttonLink: { type: String, required: true },
              buttonColor: { type: String, required: true },
            },
          ],
          required: false,
          validate: {
            validator: (arr: any[]) => arr.length <= 3,
            message: "Maximum 3 cards allowed",
          },
        },
      }),
      required: false,
    },
    classesPage: {
      type: new Schema({
        title: { type: String, required: false },
        description: { type: String, required: false },
      }),
      required: false,
    },
    onlineCoursesPage: {
      type: new Schema({
        title: { type: String, required: false },
        description: { type: String, required: false },
      }),
      required: false,
    },
    drivingTestPage: {
      type: new Schema({
        title: { type: String, required: false },
        cta: {
          type: new Schema({
            text: { type: String, required: false },
            link: { type: String, required: false },
          }),
          required: false,
        },
        subtitle: { type: String, required: false },
        description: { type: String, required: false },
        infoBoxes: {
          type: [
            {
              title: { type: String, required: true },
              points: { type: [String], required: true },
            },
          ],
          required: false,
          validate: {
            validator: (arr: any[]) => arr.length <= 3,
            message: "Maximum 3 info boxes allowed",
          },
        },
        image: { type: String, required: false },
      }),
      required: false,
    },
    sectionOrder: {
      type: [
        {
          id: { type: String, required: true },
          order: { type: Number, required: true },
        },
      ],
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Índices compuestos para búsqueda eficiente
PageContentSchema.index({ pageType: 1, isActive: 1, order: 1 });

// Método estático para obtener contenido activo de una página
PageContentSchema.statics.getActiveContent = function (
  pageType: string
): Promise<IPageContent | null> {
  return this.findOne({ pageType, isActive: true }).sort({ order: -1 });
};

// Use existing model if available, otherwise create new one
const PageContent: Model<IPageContent> =
  mongoose.models.PageContent || 
  mongoose.model<IPageContent>("PageContent", PageContentSchema);

export default PageContent;
