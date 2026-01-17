import { NextResponse, NextRequest } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import PageContent from "@/lib/models/PageContent";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const contentId = req.nextUrl.pathname.split("/").pop();
    if (!contentId) {
      return NextResponse.json(
        { message: "Content ID is required" },
        { status: 400 }
      );
    }

    const pageContent = await PageContent.findById(contentId);

    if (!pageContent) {
      return NextResponse.json(
        { message: "Page content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(pageContent, { status: 200 });
  } catch (error) {
    console.error("[GET_PAGE_CONTENT_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to fetch page content" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectToDB();
    const body = await req.json();

    const contentId = req.nextUrl.pathname.split("/").pop();
    if (!contentId) {
      return NextResponse.json(
        { message: "Content ID is required" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (body.pageType !== undefined) updateData.pageType = body.pageType;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.statistics !== undefined) updateData.statistics = body.statistics;
    if (body.ctaButtons !== undefined) updateData.ctaButtons = body.ctaButtons;
    if (body.backgroundImage !== undefined) updateData.backgroundImage = body.backgroundImage;
    if (body.featureSection !== undefined) updateData.featureSection = body.featureSection;
    if (body.benefitsSection !== undefined) updateData.benefitsSection = body.benefitsSection;
    if (body.drivingLessonsTitle !== undefined) updateData.drivingLessonsTitle = body.drivingLessonsTitle;
    if (body.trafficCoursesSection !== undefined) updateData.trafficCoursesSection = body.trafficCoursesSection;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.order !== undefined) updateData.order = body.order;

    const updatedPageContent = await PageContent.findByIdAndUpdate(
      contentId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPageContent) {
      return NextResponse.json(
        { message: "Page content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPageContent, { status: 200 });
  } catch (error) {
    console.error("[PATCH_PAGE_CONTENT_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to update page content" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDB();

    const contentId = req.nextUrl.pathname.split("/").pop();
    if (!contentId) {
      return NextResponse.json(
        { message: "Content ID is required" },
        { status: 400 }
      );
    }

    const deletedPageContent = await PageContent.findByIdAndDelete(contentId);

    if (!deletedPageContent) {
      return NextResponse.json(
        { message: "Page content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Page content deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DELETE_PAGE_CONTENT_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to delete page content" },
      { status: 500 }
    );
  }
}
