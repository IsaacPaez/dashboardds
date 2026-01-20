// Tipos para el contenido de páginas
export interface Statistic {
  value: number;
  label: string;
  suffix: string;
}

export interface CtaButton {
  text: string;
  link: string;
  actionType: "link" | "modal";
  modalType?: "service-selector" | "custom";
  order: number;
}

export interface TitleConfig {
  part1: string;
  part2: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
}

export interface BenefitsTitleConfig {
  text: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
}

export interface BackgroundImage {
  mobile: string;
  desktop: string;
}

export interface FeatureSection {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

export interface CorporateProgramsSection {
  title: string;
  subtitle: string;
  description: string;
  ctaMessage: string;
  ctaText: string;
  ctaLink: string;
  image: string;
}

export interface BenefitItem {
  image: string;
  title: string;
  description: string;
  link?: string;
  order: number;
}

export interface BenefitsSection {
  title: BenefitsTitleConfig;
  items: BenefitItem[];
}

export interface LessonsCard {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  buttonColor: string;
}

export interface LessonsPageContent {
  title: {
    part1: string;
    part2: string;
    part3: string;
  };
  description: string;
  mainImage: string;
  cards: LessonsCard[];
}

export interface ClassesPageContent {
  title: string;
  description: string;
}

export type PageType = "home" | "about" | "services" | "contact" | "lessons" | "classes" | "custom";

export interface PageContentType {
  _id: string;
  pageType: PageType;
  title: TitleConfig;
  description: string;
  statistics: Statistic[];
  ctaButtons: CtaButton[];
  backgroundImage: BackgroundImage;
  featureSection?: FeatureSection;
  benefitsSection?: BenefitsSection;
  corporateProgramsSection?: CorporateProgramsSection;
  lessonsPage?: LessonsPageContent;
  classesPage?: ClassesPageContent;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface PageContentFormData {
  pageType: PageType;
  title: TitleConfig;
  description: string;
  statistics: Statistic[];
  ctaButtons: CtaButton[];
  backgroundImage: BackgroundImage;
  featureSection?: FeatureSection;
  benefitsSection?: BenefitsSection;
  corporateProgramsSection?: CorporateProgramsSection;
  lessonsPage?: LessonsPageContent;
  classesPage?: ClassesPageContent;
  isActive: boolean;
  order: number;
}
