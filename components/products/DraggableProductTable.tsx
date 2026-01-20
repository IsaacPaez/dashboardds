"use client";

import { useState } from "react";
import { GripVertical } from "lucide-react";
import Delete from "../custom ui/Delete";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import toast from "react-hot-toast";

export type ProductType = {
  _id: string;
  title: string;
  media: string[];
  price: number;
  duration: number;
  tag?: string;
  order?: number;
};

interface DraggableProductTableProps {
  products: ProductType[];
  onReorder: (products: ProductType[]) => void;
}

export const DraggableProductTable = ({ products: initialProducts, onReorder }: DraggableProductTableProps) => {
  const [products, setProducts] = useState(initialProducts);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === index) return;

    const newProducts = [...products];
    const draggedProduct = newProducts[draggedIndex];
    
    // Remove from old position
    newProducts.splice(draggedIndex, 1);
    // Insert at new position
    newProducts.splice(index, 0, draggedProduct);
    
    setProducts(newProducts);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex === null) return;
    
    setDraggedIndex(null);
    
    // Update order values
    const updatedProducts = products.map((product, index) => ({
      ...product,
      order: index,
    }));
    
    console.log("📦 Saving order to database:", updatedProducts.map(p => ({ 
      title: p.title, 
      order: p.order 
    })));
    
    setProducts(updatedProducts);
    onReorder(updatedProducts);
    
    // Save to backend
    try {
      const payload = {
        products: updatedProducts.map(p => ({ _id: p._id, order: p.order }))
      };
      
      console.log("📤 Sending to API:", payload);
      
      const response = await fetch("/api/products/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ API Error:", errorData);
        throw new Error("Failed to save order");
      }
      
      const result = await response.json();
      console.log("✅ API Response:", result);
      
      toast.success("Order saved successfully");
    } catch (error) {
      console.error("❌ Error saving order:", error);
      toast.error("Failed to save order");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="w-10 px-4 py-3"></th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Image</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tag</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Duration</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
            <th className="w-20 px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product, index) => (
            <tr
              key={product._id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`
                transition-all duration-200
                ${draggedIndex === index ? 'opacity-50 bg-blue-50' : 'hover:bg-gray-50'}
                cursor-move
              `}
            >
              <td className="px-4 py-3">
                <GripVertical className="h-5 w-5 text-gray-400" />
              </td>
              <td className="px-4 py-3">
                {product.media && product.media[0] ? (
                  <Image
                    src={product.media[0]}
                    alt={product.title}
                    width={60}
                    height={60}
                    className="rounded object-cover"
                  />
                ) : (
                  <div className="w-[60px] h-[60px] rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                    No Image
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/products/${product._id}`}
                  className="flex items-center gap-2 font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  {product.title}
                  <ArrowUpRight size={16} className="opacity-75" />
                </Link>
              </td>
              <td className="px-4 py-3">
                {product.tag && (
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                    {product.tag}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-gray-700">
                {product.duration} {product.duration === 1 ? 'hour' : 'hours'}
              </td>
              <td className="px-4 py-3 font-semibold text-gray-900">
                ${product.price.toFixed(2)}
              </td>
              <td className="px-4 py-3 text-center">
                <div onClick={(e) => e.stopPropagation()}>
                  <Delete item="product" id={product._id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No driving lessons found
        </div>
      )}
    </div>
  );
};
