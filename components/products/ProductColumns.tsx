"use client";

import { ColumnDef } from "@tanstack/react-table";
import Delete from "../custom ui/Delete";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react"; // Ícono para indicar navegación

export const columns: ColumnDef<ProductType>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link
        href={`/products/${row.original._id}`}
        className="flex items-center gap-2 font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200"
      >
        {row.original.title}
        <ArrowUpRight size={16} className="opacity-75" />
      </Link>
    ),
  },
  {
    accessorKey: "price",
    header: "Price ($)",
    cell: ({ row }) => <p className="font-medium text-gray-700">${row.original.price.toFixed(2)}</p>,
  },
  {
    accessorKey: "duration",
    header: "Duration (hrs)",
    cell: ({ row }) => <p className="font-medium text-gray-700">{row.original.duration} hrs</p>,
  },
  {
    accessorKey: "media",
    header: "Image",
    cell: ({ row }) =>
      row.original.media.length > 0 ? (
        <Image
          src={row.original.media[0]} // Toma la primera imagen del array
          alt={row.original.title}
          width={100} // Optimización del tamaño
          height={100}
          className="rounded-md object-cover border border-gray-300 shadow-md hover:scale-105 transition-transform duration-200"
        />
      ) : (
        <p className="text-gray-500 italic text-sm">No Image</p>
      ),
  },
  {
    accessorKey: "tag",
    header: "Tag",
    cell: ({ row }) =>
      row.original.tag && row.original.tag.trim() !== "" ? (
        <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full uppercase">
          {row.original.tag}
        </span>
      ) : (
        <p className="text-gray-400 italic text-sm">No tag</p>
      ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <p className="font-medium text-gray-600">{row.original.type || "N/A"}</p>,
  },
  {
    id: "actions",
    cell: ({ row }) => <Delete item="products" id={row.original._id} />,
  },
];
