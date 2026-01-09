/**
 * Script para migrar el contenido del Home hardcodeado a PageContent
 * Ejecutar con: npm run migrate:home-content
 */

import PageContent from "../lib/models/PageContent";
import { connectToDB } from "../lib/mongoDB";

async function migrateHomeContent() {
  try {
    await connectToDB();
    console.log("✅ Connected to MongoDB");

    // Datos hardcodeados actuales del Home
    const homeContentData = {
      pageType: "home" as const,
      title: {
        part1: "Learn To Drive",
        part2: "Safely For Life",
        gradientFrom: "#4CAF50",
        gradientVia: "#43e97b",
        gradientTo: "#38f9d7",
      },
      description:
        "Affordable Driving School offers professional Behind the Wheel Driving Lessons and Traffic School Courses in Palm Beach County.",
      statistics: [
        {
          value: 9000,
          label: "Students",
          suffix: "+",
        },
        {
          value: 5000,
          label: "Lessons",
          suffix: "+",
        },
        {
          value: 30,
          label: "Years of Experience",
          suffix: "+",
        },
      ],
      ctaButtons: [
        {
          text: "Book Driving Lessons",
          link: "/lessons",
          actionType: "modal" as const,
          modalType: "service-selector" as const,
          order: 0,
        },
        {
          text: "Book a Traffic Ticket Class",
          link: "/classes",
          actionType: "link" as const,
          order: 1,
        },
      ],
      backgroundImage: {
        mobile:
          "https://res.cloudinary.com/dzi2p0pqa/image/upload/f_auto,q_auto,w_1080/v1761582232/p9kxi89spkqsfsjc2yfj.jpg",
        desktop:
          "https://res.cloudinary.com/dzi2p0pqa/image/upload/f_auto,q_auto,w_1920/v1761582177/rxcp45fmxz7e0uec2qyv.jpg",
      },
      isActive: true,
      order: 0,
    };

    // Verificar si ya existe contenido para el home
    const existingContent = await PageContent.findOne({ pageType: "home" });

    if (existingContent) {
      console.log("⚠️  Home content already exists:");
      console.log(existingContent);
      console.log("\n❓ To update, delete the existing content first or update manually.");
      return;
    }

    // Crear nuevo documento
    const newHomeContent = new PageContent(homeContentData);
    await newHomeContent.save();

    console.log("✅ Home content migrated successfully!");
    console.log("\n📄 Created document:");
    console.log(JSON.stringify(newHomeContent, null, 2));

    process.exit(0);
  } catch (error) {
    console.error("❌ Error migrating home content:", error);
    process.exit(1);
  }
}

// Ejecutar migración
migrateHomeContent();
