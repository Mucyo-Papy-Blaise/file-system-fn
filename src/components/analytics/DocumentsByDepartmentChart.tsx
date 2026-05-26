"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { useGetDocumentsByDepartment } from "@/lib/hooks/useAnalytics";

const CHART_COLORS = ["#06B6D4"];

export function DocumentsByDepartmentChart() {
  const { data, isLoading, isError } = useGetDocumentsByDepartment();

  if (isLoading) {
    return <div className="h-48 flex items-center justify-center">Loading...</div>;
  }

  if (isError || !data) {
    return <div className="h-48 flex items-center justify-center text-sm text-red-600">Failed to load chart.</div>;
  }

  return (
    <div className="p-4 bg-card border rounded-md">
      <h3 className="text-sm text-secondary mb-2">By Department</h3>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="department" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Bar dataKey="count" fill={CHART_COLORS[0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
