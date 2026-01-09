import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import PageContent from "@/lib/models/PageContent";

export async function GET(req: Request) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(req.url);
    const pageType = searchParams.get("pageType");
    const activeOnly = searchParams.get("activeOnly") === "true";

    const query: Record<string, unknown> = {};
    
    if (pageType) {
      query.pageType = pageType;
    }
    
    if (activeOnly) {
      query.isActive = true;
    }

    const pageContents = await PageContent.find(query)
      .sort({ order: -1, createdAt: -1 });
    
    return NextResponse.json(pageContents, { status: 200 });
  } catch (error) {
    console.error("[GET_PAGE_CONTENTS_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to fetch page contents" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();

    // Validación de datos requeridos
    if (!body.pageType || !body.title || !body.description || !body.backgroundImage) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newPageContent = new PageContent({
      pageType: body.pageType,
      title: {
        part1: body.title.part1,
        part2: body.title.part2,
        gradientFrom: body.title.gradientFrom || "#4CAF50",
        gradientVia: body.title.gradientVia || "#43e97b",
        gradientTo: body.title.gradientTo || "#38f9d7",
      },
      description: body.description,
      statistics: body.statistics || [],
      ctaButtons: body.ctaButtons || [],
      backgroundImage: {
        mobile: body.backgroundImage.mobile,
        desktop: body.backgroundImage.desktop,
      },
      isActive: body.isActive ?? true,
      order: body.order ?? 0,
    });

    await newPageContent.save();
    return NextResponse.json(newPageContent, { status: 201 });
  } catch (error) {
    console.error("[POST_PAGE_CONTENT_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to create page content" },
      { status: 500 }
    );
  }
}
