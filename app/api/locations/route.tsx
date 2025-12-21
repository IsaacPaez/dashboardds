import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import Location from "@/lib/models/Locations";

// Forzamos dynamic para evitar problemas de caché en estas rutas:
export const dynamic = "force-dynamic";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();

    const requestData = await req.json();
    const { title, zone, locationImage, instructors, content } = requestData;

    if (!title || !zone) {
      return new NextResponse("Title and zone are required", { status: 400 });
    }

    // Crear el documento en MongoDB
    const newLocation = await Location.create({
      title,
      zone,
      locationImage,
      instructors,
      content: content || "",
    });

    await newLocation.save();

    return NextResponse.json(newLocation, { status: 200 });
  } catch (err) {

    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async () => {
  try {
    await connectToDB();
    const locations = await Location.find().sort({ createdAt: "desc" });

    return NextResponse.json(locations, { status: 200 });
  } catch (err) {

    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
