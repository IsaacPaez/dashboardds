import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Resource from "@/lib/models/Resource";

export async function GET() {
  try {
    await connectToDB();
    const resources = await Resource.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(resources, { status: 200 });
  } catch (error) {
    console.error("[GET_RESOURCES_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();

    const newResource = new Resource({
      title: body.title,
      image: body.image,
      href: body.href || "",
      order: body.order ?? 0,
      isActive: body.isActive ?? true,
    });

    await newResource.save();
    return NextResponse.json(newResource, { status: 201 });
  } catch (error) {
    console.error("[POST_RESOURCE_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to create resource" },
      { status: 500 }
    );
  }
}
