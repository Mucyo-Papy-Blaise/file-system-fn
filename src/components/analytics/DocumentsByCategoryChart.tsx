"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useGetDocumentsByCategory } from "@/lib/hooks/useAnalytics";

const CHART_COLORS = ["#4F46E5", "#06B6D4", "#84CC16", "#F97316", "#EF4444", "#8B5CF6"];

export function DocumentsByCategoryChart() {
  const { data, isLoading, isError } = useGetDocumentsByCategory();

  if (isLoading) {
    return <div className="h-48 flex items-center justify-center">Loading...</div>;
  }

  if (isError || !data) {
    return <div className="h-48 flex items-center justify-center text-sm text-red-600">Failed to load chart.</div>;
  }

  return (
    <div className="p-4 bg-card border rounded-md">
      <h3 className="text-sm text-secondary mb-2">By Category</h3>
      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="category" innerRadius={40} outerRadius={80} paddingAngle={4}>
              {data.map((_, idx) => (
                <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
