import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();
    
    // Get all products
    const products = await Product.find().sort({ createdAt: 1 });
    
    // Assign order values based on current position
    const updatePromises = products.map((product, index) =>
      Product.findByIdAndUpdate(product._id, { order: index }, { new: true })
    );

    await Promise.all(updatePromises);

    return NextResponse.json(
      { 
        message: "Products order initialized successfully",
        count: products.length 
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[products_initialize_order_POST]", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
