"use client";

import { ColumnDef } from "@tanstack/react-table";
import Delete from "../custom ui/Delete";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import toast from "react-hot-toast";

export type ResourceType = {
  _id: string;
  title: string;
  image: string;
  href?: string;
  order: number;
  isActive: boolean;
};

const toggleResourceStatus = async (
  resourceId: string,
  currentStatus: boolean
) => {
  try {
    const res = await fetch(`/api/resources/${resourceId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !currentStatus }),
    });

    if (res.ok) {
      toast.success(
        `Resource ${!currentStatus ? "activated" : "deactivated"} successfully`
      );
      window.location.reload();
    } else {
      throw new Error("Failed to update status");
    }
  } catch (error) {
    console.error("[TOGGLE_RESOURCE_STATUS_ERROR]", error);
    toast.error("Failed to update resource status");
  }
};

export const columns: ColumnDef<ResourceType>[] = [
  {
    accessorKey: "order",
    header: "Order",
    cell: ({ row }) => (
      <p className="font-medium text-gray-700 text-center">{row.original.order}</p>
    ),
  },
  {
    accessorKey: "image",
    header: "Preview",
    cell: ({ row }) => (
      <Image
        src={row.original.image}
        alt={row.original.title}
        width={80}
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
        href={`/resources/${row.original._id}`}
        className="flex items-center gap-2 font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200"
      >
        {row.original.title}
        <ArrowUpRight size={16} className="opacity-75" />
      </Link>
    ),
  },
  {
    accessorKey: "href",
    header: "URL",
    cell: ({ row }) =>
      row.original.href ? (
        <a
          href={row.original.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-gray-600 hover:text-blue-600 text-sm truncate max-w-[200px]"
        >
          <ExternalLink size={14} />
          <span className="truncate">{row.original.href}</span>
        </a>
      ) : (
        <span className="text-gray-400 text-sm">No URL</span>
      ),
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Switch
          checked={row.original.isActive}
          onCheckedChange={() =>
            toggleResourceStatus(row.original._id, row.original.isActive)
          }
        />
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Delete item="resources" id={row.original._id} />
      </div>
    ),
  },
];
