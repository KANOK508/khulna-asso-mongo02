"use client";

import React, { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { AdminRoute } from "@/components/ProtectedRoute";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Member {
  id: string; name: string; email: string; department: string; batch: string;
  district: string; role: string; status: string; photoUrl: string | null;
}

function AdminMembersContent() {
  const [members, setMembers] = useState<Member[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetch = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: page.toString(), limit: "20" });
    if (q) params.set("q", q);
    if (statusFilter) params.set("status", statusFilter);
    api.get<{data:Member[];total:number;totalPages:number}>(`/api/members?${params}`)
      .then((r) => { setMembers(r.data); setTotal(r.total); setTotalPages(r.totalPages); })
      .finally(() => setLoading(false));
  }, [page, q, statusFilter]);

  useEffect(() => { fetch(); }, [fetch]);

  const updateRole = async (id: string, role: string) => {
    try {
      await api.patch(`/api/admin/members/${id}`, { role });
      setMembers((prev) => prev.map((m) => m.id === id ? { ...m, role } : m));
      toast.success("Role updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update role");
    }
  };

  const deleteMember = async (id: string) => {
    if (!confirm("Delete this member? This cannot be undone.")) return;
    try {
      await api.delete(`/api/admin/members/${id}`);
      setMembers((prev) => prev.filter((m) => m.id !== id));
      setTotal((t) => t - 1);
      toast.success("Member deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete member");
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-4">
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Members</h1>
          <p className="text-muted-foreground">{total} total member{total !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search members…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Any Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Status</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      ) : (
        <div className="space-y-3">
          {members.map((m) => (
            <Card key={m.id}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={m.photoUrl ?? ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {m.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{m.name}</p>
                    <p className="text-sm text-muted-foreground">{m.email} · {m.department} · {m.district}</p>
                  </div>
                  <Badge variant={m.status === "approved" ? "default" : m.status === "pending" ? "secondary" : "destructive"} className="capitalize">{m.status}</Badge>
                  <Select value={m.role} onValueChange={(v) => updateRole(m.id, v)}>
                    <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">member</SelectItem>
                      <SelectItem value="batch_admin">batch_admin</SelectItem>
                      <SelectItem value="dept_admin">dept_admin</SelectItem>
                      <SelectItem value="superadmin">superadmin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="destructive" onClick={() => deleteMember(m.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
          <span className="text-sm text-muted-foreground self-center">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}

export default function AdminMembersPage() {
  return <AdminRoute><AdminMembersContent /></AdminRoute>;
}
