"use client";

import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useGetDocumentsOverTime } from "@/lib/hooks/useAnalytics";

const CHART_COLORS = ["#4F46E5", "#06B6D4", "#84CC16", "#F97316", "#EF4444"];

export function DocumentsOverTimeChart({ period = "6months" }: { period?: "6months" | "12months" }) {
  const { data, isLoading, isError } = useGetDocumentsOverTime(period);

  if (isLoading) {
    return <div className="h-56 flex items-center justify-center">Loading chart...</div>;
  }

  if (isError || !data || !Array.isArray(data)) {
    return <div className="h-56 flex items-center justify-center text-sm text-red-600">Failed to load chart.</div>;
  }

  const chartData = data;

  return (
    <div className="p-4 bg-card border rounded-md">
      <h3 className="text-sm text-secondary mb-2">Documents Over Time</h3>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="col1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area type="monotone" dataKey="count" stroke={CHART_COLORS[0]} fillOpacity={1} fill="url(#col1)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
