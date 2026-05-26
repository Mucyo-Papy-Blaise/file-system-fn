"use client";

import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useGetMemberActivity } from "@/lib/hooks/useAnalytics";

export function MemberActivityChart() {
  const { data, isLoading, isError } = useGetMemberActivity();

  if (isLoading) {
    return <div className="h-48 flex items-center justify-center">Loading...</div>;
  }

  if (isError || !data) {
    return <div className="h-48 flex items-center justify-center text-sm text-red-600">Failed to load chart.</div>;
  }

  // Map to simple series by name
  const chartData = data.map((d) => ({ name: d.name, count: d.count }));

  return (
    <div className="p-4 bg-card border rounded-md">
      <h3 className="text-sm text-secondary mb-2">Member Activity</h3>
      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#4F46E5" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
