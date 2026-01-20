"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";

import Loader from "@/components/custom ui/Loader";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { DraggableProductTable, ProductType } from "@/components/products/DraggableProductTable";

const Products = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(false);

  const getProducts = async () => {
    try {
      const res = await fetch("/api/products");

      if (!res.ok) {
        throw new Error(`Error fetching products: ${res.status}`);
      }

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("[products_GET] Error:", err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = (reorderedProducts: ProductType[]) => {
    setProducts(reorderedProducts);
  };

  const handleInitializeOrder = async () => {
    if (initializing) return;
    
    setInitializing(true);
    try {
      const res = await fetch("/api/products/initialize-order", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error(`Error initializing order: ${res.status}`);
      }

      const data = await res.json();
      toast.success(data.message || "Order initialized successfully!");
      
      // Refresh products list
      await getProducts();
    } catch (err) {
      console.error("[initialize-order] Error:", err);
      toast.error("Failed to initialize order.");
    } finally {
      setInitializing(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="px-10 py-5">
      <DashboardHeader title="Driving Lessons">
        <p className="text-heading5 text-white">Total Driving Lessons: {products.length}</p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="bg-white text-blue-1 border-white hover:bg-blue-50"
            onClick={handleInitializeOrder}
            disabled={initializing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${initializing ? 'animate-spin' : ''}`} />
            {initializing ? 'Initializing...' : 'Initialize Order'}
          </Button>
          <Button className="bg-blue-1 text-white" onClick={() => router.push("/products/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Driving Lessons
          </Button>
        </div>
      </DashboardHeader>
      <div className="mt-6">
        <DraggableProductTable products={products} onReorder={handleReorder} />
      </div>
    </div>
  );
};

export default Products;


