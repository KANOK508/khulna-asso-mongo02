"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/hooks/use-session";
import { api } from "@/lib/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Users, AlertCircle, Calendar, MessageSquare, ShieldAlert, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#1B5E20", "#C9A227", "#2E7D32", "#4CAF50", "#81C784", "#A5D6A7", "#D1C4E9", "#E8F5E9"];

interface Stats {
  totalMembers: number;
  pendingApprovals: number;
  totalEvents: number;
  totalForumPosts: number;
  upcomingEvents: number;
  byDepartment: { department: string; count: number }[];
  byDistrict: { district: string; count: number }[];
}

function DashboardContent() {
  const { user, isAdmin } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      setLoading(true);
      api.get<Stats>("/api/stats").then(setStats).finally(() => setLoading(false));
    }
  }, [isAdmin]);

  if (!user) return null;

  return (
    <div className="container mx-auto max-w-7xl px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Welcome back, {user.name.split(" ")[0]}!</h1>
        <p className="text-muted-foreground">
          {isAdmin ? "Association overview and management." : "Your membership portal."}
        </p>
      </div>

      {user.status === "pending" && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-800">Account Pending Approval</h4>
            <p className="text-amber-700/80 text-sm mt-1">
              Your account is under review. You will have full access once an admin approves it.
            </p>
          </div>
        </div>
      )}

      {user.status === "rejected" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-800">Account Rejected</h4>
            <p className="text-red-700/80 text-sm mt-1">Your account was not approved. Please contact an administrator.</p>
          </div>
        </div>
      )}

      {isAdmin && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Members", value: stats?.totalMembers, icon: Users, color: "text-primary" },
              { label: "Pending Approvals", value: stats?.pendingApprovals, icon: ShieldAlert, color: stats?.pendingApprovals ? "text-amber-500" : "text-primary", urgent: !!stats?.pendingApprovals },
              { label: "Total Events", value: stats?.totalEvents, icon: Calendar, color: "text-primary" },
              { label: "Forum Posts", value: stats?.totalForumPosts, icon: MessageSquare, color: "text-primary" },
            ].map((item) => (
              <Card key={item.label} className={item.urgent ? "border-amber-400/50 bg-amber-50/30" : ""}>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </CardHeader>
                <CardContent>
                  {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{item.value ?? 0}</div>}
                  {item.label === "Pending Approvals" && !!stats?.pendingApprovals && (
                    <Button variant="link" className="px-0 text-amber-600 h-auto py-0 text-xs" asChild>
                      <Link href="/admin/approvals">Review Now</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Members by Department</CardTitle>
                <CardDescription>Approved member distribution</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-64" /> : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={stats?.byDepartment?.slice(0, 8) ?? []}>
                      <XAxis dataKey="department" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#1B5E20" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Members by District</CardTitle>
                <CardDescription>Geographic distribution</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-64" /> : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={stats?.byDistrict ?? []}
                        dataKey="count"
                        nameKey="district"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={(props: unknown) => (props as { district?: string }).district}
                      >
                        {(stats?.byDistrict ?? []).map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v, n) => [v, n]} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-4">
            <Button asChild><Link href="/admin/approvals">Manage Approvals</Link></Button>
            <Button variant="outline" asChild><Link href="/admin/members">All Members</Link></Button>
          </div>
        </>
      )}

      {!isAdmin && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: "/directory", label: "Browse Directory", desc: "Find fellow members from Khulna Division", icon: Users },
            { href: "/events", label: "Upcoming Events", desc: "See and RSVP to association events", icon: Calendar },
            { href: "/forum", label: "Community Forum", desc: "Discuss jobs, news, and guidance", icon: MessageSquare },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <item.icon className="w-6 h-6 text-primary mb-2" />
                  <CardTitle className="text-lg">{item.label}</CardTitle>
                  <CardDescription>{item.desc}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Your Account</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-muted-foreground">Name</dt><dd className="font-medium">{user.name}</dd></div>
              <div><dt className="text-muted-foreground">Department</dt><dd className="font-medium">{user.department}</dd></div>
              <div><dt className="text-muted-foreground">Batch</dt><dd className="font-medium">{user.batch}</dd></div>
              <div><dt className="text-muted-foreground">Status</dt><dd className="font-medium capitalize">{user.status}</dd></div>
              <div><dt className="text-muted-foreground">Role</dt><dd className="font-medium capitalize">{user.role?.replace("_", " ")}</dd></div>
              <div><dt className="text-muted-foreground">District</dt><dd className="font-medium">{user.district}</dd></div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}