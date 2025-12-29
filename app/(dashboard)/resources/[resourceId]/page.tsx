"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ResourceForm from "@/components/resources/ResourceForm";
import Loader from "@/components/custom ui/Loader";

interface ResourceFormType {
  _id: string;
  title: string;
  image: string;
  href?: string;
  order: number;
  isActive: boolean;
}

const EditResource = () => {
  const { resourceId } = useParams();
  const [loading, setLoading] = useState(true);
  const [resourceData, setResourceData] = useState<ResourceFormType | null>(
    null
  );

  useEffect(() => {
    if (!resourceId || resourceId === "undefined") {
      console.error("❌ No resourceId provided, skipping fetch.");
      setLoading(false);
      return;
    }

    const fetchResourceDetails = async () => {
      try {
        const res = await fetch(`/api/resources/${resourceId}`, {
          method: "GET",
        });
        if (!res.ok) throw new Error("Failed to fetch resource");
        const data = await res.json();
        setResourceData(data);
      } catch (err) {
        console.error("[GET_RESOURCE_DETAILS_ERROR]", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResourceDetails();
  }, [resourceId]);

  if (loading) return <Loader />;
  if (!resourceData) {
    return <p className="text-center text-red-500">❌ Resource not found</p>;
  }

  return <ResourceForm initialData={resourceData} />;
};

export default EditResource;
