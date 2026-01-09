import dbConnect from "../lib/dbConnect";
import PageContent from "../lib/models/PageContent";

const migrateFeatureSection = async () => {
  try {
    await dbConnect();

    console.log("🔄 Starting Feature Section migration...");

    // Buscar el contenido de home
    const homeContent = await PageContent.findOne({ pageType: "home" });

    if (!homeContent) {
      console.log("❌ No home content found. Please create one first.");
      return;
    }

    // Verificar si ya tiene featureSection
    if (homeContent.featureSection && homeContent.featureSection.title) {
      console.log("✅ Feature Section already exists:");
      console.log("   Title:", homeContent.featureSection.title);
      console.log("   Subtitle:", homeContent.featureSection.subtitle);
      console.log("   Image:", homeContent.featureSection.image);
      return;
    }

    // Agregar featureSection con valores por defecto
    const defaultFeatureSection = {
      title: "Accredited Driving Traffic School",
      subtitle: "With A+ Rating",
      description:
        "Affordable Driving School is your leading Palm Beach provider for driving lessons and Florida state-approved Traffic courses. Affordable Driving Traffic School has been offering In-Person Traffic School Courses, Driving Lessons, Florida Online Traffic School Classes, and Now Zoom Traffic Classes to thousands of satisfied students in the Palm Beach County area since 1995. These courses are taught by Certified and Experienced Professional Instructors to help students improve their driving knowledge and safety.",
      image: "https://res.cloudinary.com/dzi2p0pqa/image/upload/v1761583171/kl2purqpuosna2pmkwbo.jpg",
    };

    homeContent.featureSection = defaultFeatureSection;
    await homeContent.save();

    console.log("✅ Feature Section migrated successfully!");
    console.log("\n📋 Updated content:");
    console.log("   Page Type:", homeContent.pageType);
    console.log("   Feature Title:", homeContent.featureSection.title);
    console.log("   Feature Subtitle:", homeContent.featureSection.subtitle);
    console.log("   Feature Image:", homeContent.featureSection.image);

  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

// Ejecutar la migración
migrateFeatureSection()
  .then(() => {
    console.log("\n✨ Migration completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });
