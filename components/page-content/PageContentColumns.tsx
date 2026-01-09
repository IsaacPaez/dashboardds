"use client";

import { ColumnDef } from "@tanstack/react-table";
import Delete from "../custom ui/Delete";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import toast from "react-hot-toast";
import { PageContentType } from "@/types/pageContent";

const toggleContentStatus = async (
  contentId: string,
  currentStatus: boolean
) => {
  try {
    const res = await fetch(`/api/page-content/${contentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !currentStatus }),
    });

    if (res.ok) {
      toast.success(
        `Page content ${!currentStatus ? "activated" : "deactivated"} successfully`
      );
      window.location.reload();
    } else {
      throw new Error("Failed to update status");
    }
  } catch (error) {
    console.error("[TOGGLE_CONTENT_STATUS_ERROR]", error);
    toast.error("Failed to update page content status");
  }
};

export const columns: ColumnDef<PageContentType>[] = [
  {
    accessorKey: "order",
    header: "Order",
    cell: ({ row }) => (
      <p className="font-medium text-gray-700 text-center">{row.original.order}</p>
    ),
  },
  {
    accessorKey: "pageType",
    header: "Page Type",
    cell: ({ row }) => (
      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm capitalize">
        {row.original.pageType}
      </span>
    ),
  },
  {
    accessorKey: "backgroundImage",
    header: "Preview",
    cell: ({ row }) => (
      <Image
        src={row.original.backgroundImage.desktop}
        alt={`${row.original.pageType} background`}
        width={120}
        height={80}
        className="rounded-lg object-cover border border-gray-300 shadow-md"
      />
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link
        href={`/page-content/${row.original._id}`}
        className="flex items-center gap-2 hover:text-blue-700 transition-colors duration-200"
      >
        <div className="flex flex-col">
          <span className="font-semibold text-blue-500">{row.original.title.part1}</span>
          <span className="text-gray-700">{row.original.title.part2}</span>
        </div>
        <ArrowUpRight size={16} className="opacity-75" />
      </Link>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <p className="text-sm text-gray-600 max-w-xs truncate">
        {row.original.description}
      </p>
    ),
  },
  {
    accessorKey: "statistics",
    header: "Stats",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-gray-700">
        {row.original.statistics.length} items
      </span>
    ),
  },
  {
    accessorKey: "ctaButtons",
    header: "CTA Buttons",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-gray-700">
        {row.original.ctaButtons.length} buttons
      </span>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => (
      <Switch
        checked={row.original.isActive}
        onCheckedChange={() =>
          toggleContentStatus(row.original._id, row.original.isActive)
        }
      />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Delete 
        item="page-content" 
        id={row.original._id} 
      />
    ),
  },
];
