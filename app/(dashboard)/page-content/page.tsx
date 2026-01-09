"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { columns } from "@/components/page-content/PageContentColumns";
import { DataTable } from "@/components/custom ui/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/custom ui/Loader";
import { PageContentType } from "@/types/pageContent";

const PageContentDashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [pageContents, setPageContents] = useState<PageContentType[]>([]);

  const fetchPageContents = async () => {
    try {
      const res = await fetch("/api/page-content");
      const data = await res.json();
      setPageContents(data);
    } catch (err) {
      console.error("[GET_PAGE_CONTENTS_ERROR]", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageContents();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Page Content</p>
        <Button
          className="bg-blue-1 text-white"
          onClick={() => router.push("/page-content/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Page Content
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={pageContents} searchKey="pageType" />
    </div>
  );
};

export default PageContentDashboard;
