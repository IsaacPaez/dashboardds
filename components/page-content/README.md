# Page Content Form - Modular Structure

This document explains the new modular structure of the PageContentForm component.

## 📁 File Structure

```
components/page-content/
├── PageContentForm.tsx              # Original file (1824 lines)
├── PageContentFormRefactored.tsx    # New modular version (~400 lines)
├── types.ts                         # Shared types and Zod schemas
└── sections/                        # Modular section components
    ├── index.ts                     # Central export file
    ├── HeroSection.tsx
    ├── StatisticsSection.tsx
    ├── CTAButtonsSection.tsx
    ├── FeatureSection.tsx
    ├── CorporateProgramsSection.tsx
    ├── BenefitsSection.tsx
    ├── DrivingLessonsTitleSection.tsx
    └── AreasWeServeSection.tsx
```

## 🎯 Benefits

### 1. **Maintainability**
- Each section is isolated in its own file
- Easy to find and edit specific sections
- Reduced file size (400 lines vs 1824 lines)

### 2. **Reusability**
- Sections can be reused in other forms
- Shared types and schemas in one place
- Consistent patterns across all sections

### 3. **Scalability**
- Easy to add new sections without bloating main file
- Simple to modify individual sections
- Better code organization

### 4. **Testing**
- Each section can be tested independently
- Easier to write unit tests
- Better isolation of bugs

## 📝 How to Use

### Using the Refactored Form

Replace the import in your page file:

```tsx
// Before
import PageContentForm from "@/components/page-content/PageContentForm";

// After
import PageContentForm from "@/components/page-content/PageContentFormRefactored";
```

### Creating a New Section

1. Create a new file in `sections/` directory:

```tsx
// sections/MyNewSection.tsx
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SectionProps } from "../types";

export const MyNewSection = ({ form, expandedSections, toggleSection }: SectionProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>My New Section</CardTitle>
          <button
            type="button"
            onClick={() => toggleSection("myNewSection")}
            className="p-1"
          >
            {expandedSections.has("myNewSection") ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </CardHeader>
      {expandedSections.has("myNewSection") && (
        <CardContent className="space-y-4">
          {/* Your form fields here */}
        </CardContent>
      )}
    </Card>
  );
};
```

2. Add the schema to `types.ts`:

```tsx
export const myNewSectionSchema = z.object({
  field1: z.string().min(1),
  field2: z.string().optional(),
});

// Add to main schema
export const pageContentSchema = z.object({
  // ... existing fields
  myNewSection: myNewSectionSchema.optional(),
});
```

3. Export from `sections/index.ts`:

```tsx
export { MyNewSection } from "./MyNewSection";
```

4. Add to PageContentFormRefactored.tsx:

```tsx
import { MyNewSection } from "./sections";

// In the form JSX:
<MyNewSection {...sectionProps} />
```

## 🔧 Section Props Interface

All sections receive the same props via `SectionProps`:

```tsx
interface SectionProps {
  form: any; // UseFormReturn from react-hook-form
  expandedSections: Set<string>;
  toggleSection: (section: string) => void;
}
```

## 🚀 Migration Path

To migrate from old to new:

1. **Test the refactored version** with existing data
2. **Update the import** in the page that uses it
3. **Remove the old file** once confirmed working
4. **Rename** `PageContentFormRefactored.tsx` to `PageContentForm.tsx`

## ⚠️ Notes

- The Traffic Courses Section is complex and may need special handling
- Both old and new files coexist during migration
- All functionality is preserved in the refactored version
- Schemas are shared between both versions via `types.ts`

## 📚 Component Breakdown

| Component | Lines | Responsibility |
|-----------|-------|----------------|
| HeroSection | ~150 | Hero banner with title, description, and background |
| StatisticsSection | ~100 | Dynamic statistics with add/remove |
| CTAButtonsSection | ~150 | Call-to-action buttons configuration |
| FeatureSection | ~90 | Feature highlight section |
| CorporateProgramsSection | ~130 | Corporate programs info |
| BenefitsSection | ~220 | Benefits with collapsible items |
| DrivingLessonsTitleSection | ~80 | Driving lessons section title |
| AreasWeServeSection | ~70 | Areas served information |

**Total: ~990 lines** across 8 modular components vs **1824 lines** in single file

## 🎨 Best Practices

1. **Keep sections independent** - Each should work standalone
2. **Use consistent patterns** - Follow the existing section structure
3. **Handle optional sections** - Always check for undefined values
4. **Maintain type safety** - Use TypeScript strictly
5. **Document changes** - Update this README when adding sections
