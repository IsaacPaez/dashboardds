"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { columns } from "@/components/resources/ResourceColumns";
import { DataTable } from "@/components/custom ui/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/custom ui/Loader";

interface Resource {
  _id: string;
  title: string;
  image: string;
  href?: string;
  order: number;
  isActive: boolean;
}

const ResourcesDashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<Resource[]>([]);

  const fetchResources = async () => {
    try {
      const res = await fetch("/api/resources");
      const data = await res.json();
      setResources(data);
    } catch (err) {
      console.error("[GET_RESOURCES_ERROR]", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Resources</p>
        <Button
          className="bg-blue-1 text-white"
          onClick={() => router.push("/resources/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Resource
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={resources} searchKey="title" />
    </div>
  );
};

export default ResourcesDashboard;
