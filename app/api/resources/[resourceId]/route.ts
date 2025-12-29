import { NextResponse, NextRequest } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Resource from "@/lib/models/Resource";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const resourceId = req.nextUrl.pathname.split("/").pop();
    if (!resourceId) {
      return NextResponse.json(
        { message: "Resource ID is required" },
        { status: 400 }
      );
    }

    const resource = await Resource.findById(resourceId);

    if (!resource) {
      return NextResponse.json(
        { message: "Resource not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(resource, { status: 200 });
  } catch (error) {
    console.error("[GET_RESOURCE_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to fetch resource" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectToDB();
    const body = await req.json();

    const resourceId = req.nextUrl.pathname.split("/").pop();
    if (!resourceId) {
      return NextResponse.json(
        { message: "Resource ID is required" },
        { status: 400 }
      );
    }

    const updateData: Record<string, string | number | boolean> = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.href !== undefined) updateData.href = body.href;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const updatedResource = await Resource.findByIdAndUpdate(
      resourceId,
      updateData,
      { new: true }
    );

    if (!updatedResource) {
      return NextResponse.json(
        { message: "Resource not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedResource, { status: 200 });
  } catch (error) {
    console.error("[PATCH_RESOURCE_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to update resource" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDB();

    const resourceId = req.nextUrl.pathname.split("/").pop();
    if (!resourceId) {
      return NextResponse.json(
        { message: "Resource ID is required" },
        { status: 400 }
      );
    }

    const deletedResource = await Resource.findByIdAndDelete(resourceId);

    if (!deletedResource) {
      return NextResponse.json(
        { message: "Resource not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Resource deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DELETE_RESOURCE_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to delete resource" },
      { status: 500 }
    );
  }
}
