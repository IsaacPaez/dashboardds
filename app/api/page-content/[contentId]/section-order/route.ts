import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import PageContent from "@/lib/models/PageContent";

const DEFAULT_SECTION_ORDER = [
  { id: "hero", order: 0 },
  { id: "featureSection", order: 1 },
  { id: "corporateProgramsSection", order: 2 },
  { id: "benefitsSection", order: 3 },
  { id: "drivingLessonsTitle", order: 4 },
  { id: "areasWeServe", order: 5 },
  { id: "resources", order: 6 },
];

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ contentId: string }> }
) {
  try {
    await dbConnect();

    const { contentId } = await params;
    const pageContent = await PageContent.findById(contentId);

    if (!pageContent) {
      return NextResponse.json(
        { error: "Page content not found" },
        { status: 404 }
      );
    }

    // If no section order is saved, return default order
    const sectionOrder = pageContent.sectionOrder || DEFAULT_SECTION_ORDER;

    console.log("📤 GET section order for", contentId, ":", sectionOrder);

    return NextResponse.json(sectionOrder, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching section order:", error);
    return NextResponse.json(
      { error: "Failed to fetch section order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ contentId: string }> }
) {
  try {
    await dbConnect();

    const { contentId } = await params;
    const body = await req.json();
    const { sectionOrder } = body;

    console.log("📥 PATCH received - contentId:", contentId);
    console.log("📥 PATCH received - sectionOrder:", sectionOrder);

    if (!Array.isArray(sectionOrder)) {
      return NextResponse.json(
        { error: "Section order must be an array" },
        { status: 400 }
      );
    }

    // Validate section order structure
    const isValid = sectionOrder.every(
      (item) =>
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.order === "number"
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid section order structure" },
        { status: 400 }
      );
    }

    const updatedPageContent = await PageContent.findByIdAndUpdate(
      contentId,
      { sectionOrder },
      { new: true, runValidators: true }
    );

    if (!updatedPageContent) {
      return NextResponse.json(
        { error: "Page content not found" },
        { status: 404 }
      );
    }

    console.log("✅ Section order saved to DB:", updatedPageContent.sectionOrder);

    return NextResponse.json(
      {
        message: "Section order updated successfully",
        sectionOrder: updatedPageContent.sectionOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating section order:", error);
    return NextResponse.json(
      { error: "Failed to update section order" },
      { status: 500 }
    );
  }
}
