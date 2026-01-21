import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();
    
    const { products }: { products: Array<{ _id: string; order: number }> } = await req.json();
    
    console.log("🔄 Reorder API received:", products);
    
    if (!products || !Array.isArray(products)) {
      return NextResponse.json(
        { message: "Invalid products array" },
        { status: 400 }
      );
    }

    // Update order for each product
    const updatePromises = products.map(async ({ _id, order }) => {
      console.log(`  Updating ${_id} to order ${order}`);
      const result = await Product.findByIdAndUpdate(_id, { order }, { new: true });
      console.log(`  ✓ Updated ${result?.title} - order: ${result?.order}`);
      return result;
    });

    await Promise.all(updatePromises);
    
    console.log("✅ All products reordered successfully");

    return NextResponse.json(
      { message: "Products reordered successfully", count: products.length },
      { status: 200 }
    );
  } catch (err) {
    console.error("[products_reorder_POST]", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
