import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import PageContent from "@/lib/models/PageContent";

/**
 * API Pública para obtener contenido de páginas
 * Endpoint: /api/public/page-content
 * 
 * Query params:
 * - pageType: tipo de página (home, about, services, contact, custom)
 * 
 * Solo devuelve contenido activo y ordenado por prioridad
 */
export async function GET(req: Request) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(req.url);
    const pageType = searchParams.get("pageType");

    if (!pageType) {
      return NextResponse.json(
        { message: "pageType query parameter is required" },
        { status: 400 }
      );
    }

    // Solo devolver contenido activo, ordenado por order descendente
    const pageContent = await PageContent.findOne({ 
      pageType, 
      isActive: true 
    }).sort({ order: -1 });

    if (!pageContent) {
      return NextResponse.json(
        { message: `No active content found for page type: ${pageType}` },
        { status: 404 }
      );
    }

    // Headers para caching
    const response = NextResponse.json(pageContent, { status: 200 });
    
    // Cache por 5 minutos
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600"
    );

    return response;
  } catch (error) {
    console.error("[GET_PUBLIC_PAGE_CONTENT_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to fetch page content" },
      { status: 500 }
    );
  }
}
