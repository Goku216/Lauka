"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/Admin/StatsCard";
import { Users, Package, FolderOpen, DollarSign } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { AdminLayout } from "@/components/Admin/AdminLayout";
import { useEffect, useState } from "react";
import { getAdminStats } from "@/service/api";
import { DashboardResponse } from "@/types";
export const COLORS = [
  "#4F6EF7", // Blue
  "#7A5AF8", // Indigo
  "#9B4DCA", // Purple
  "#38BDF8", // Cyan Blue
  "#6366F1", // Soft Indigo
  "#8B5CF6", // Violet
  "#0EA5E9", // Sky Blue
  "#A855F7", // Deep Purple
];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardResponse>();

  useEffect(() => {
    async function fetchDashboardStats() {
      const data = await getAdminStats();
      setStats(data);
    }

    fetchDashboardStats();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            value={stats?.stats.total_users}
            icon={<Users className="w-6 h-6 text-primary" />}
          />
          <StatsCard
            title="Total Products"
            value={stats?.stats.total_products}
            icon={<Package className="w-6 h-6 text-primary" />}
          />
          <StatsCard
            title="Categories"
            value={stats?.stats.total_categories}
            icon={<FolderOpen className="w-6 h-6 text-primary" />}
          />
          <StatsCard
            title="Total Sales"
            value={`Rs. ${stats?.stats.total_sales.toLocaleString()}`}
            icon={<DollarSign className="w-6 h-6 text-primary" />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Over Time */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Sales Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats?.sales_chart}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="date"
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      tickFormatter={(value) => `Rs. ${value} `}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number | undefined) => {
                        if (value === undefined) return ["N/A", "Sales"];
                        return [`Rs. ${value}`, "Sales"];
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Products by Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Products by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.products_by_category}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {stats?.products_by_category.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recent_activity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {activity.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.user_email}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {activity.time_ago}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
