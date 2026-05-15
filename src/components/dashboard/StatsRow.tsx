 "use client";

import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  Folder,
  Tag,
  Users,
} from "lucide-react";
import { categoryApi } from "@/api/category.api";
import { StatsCard } from "@/components/ui/StatsCard";
import {
  mockDocuments,
  mockFolders,
  mockMembers,
} from "@/lib/mockData";

export function StatsRow() {
  const categoriesQuery = useQuery({
    queryKey: ["categories", "stats"],
    queryFn: () => categoryApi.getCategories({ page: 1, limit: 1 }),
  });

  const stats = [
    {
      title: "Total Documents",
      value: mockDocuments.length,
      icon: <FileText className="h-5 w-5" />,
      color: "var(--color-primary)",
    },
    {
      title: "Total Folders",
      value: mockFolders.length,
      icon: <Folder className="h-5 w-5" />,
      color: "var(--color-info)",
    },
    {
      title: "Categories",
      value: categoriesQuery.data?.pagination.total ?? 0,
      icon: <Tag className="h-5 w-5" />,
      color: "var(--color-warning)",
    },
    {
      title: "Members",
      value: mockMembers.length,
      icon: <Users className="h-5 w-5" />,
      color: "var(--color-success)",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </section>
  );
}
