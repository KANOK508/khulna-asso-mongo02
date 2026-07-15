"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { AdminRoute } from "@/components/ProtectedRoute";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, ShieldX, Users } from "lucide-react";
import { toast } from "sonner";

interface PendingUser {
  id: string; name: string; email: string; department: string; batch: string;
  admissionSession: string; district: string; bloodGroup: string | null;
  mobile: string; photoUrl: string | null; createdAt: string;
}

function ApprovalsContent() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchApprovals = () => {
    setLoading(true);
    api.get<{data:PendingUser[];total:number}>("/api/admin/approvals?limit=50")
      .then((r) => { setUsers(r.data); setTotal(r.total); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchApprovals(); }, []);

  const process = async (id: string, action: "approve" | "reject") => {
    setProcessingId(id);
    try {
      await api.patch("/api/admin/approvals", { id, action });
      toast.success(`Member ${action === "approve" ? "approved" : "rejected"}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setTotal((t) => t - 1);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Pending Approvals</h1>
        <p className="text-muted-foreground">{total} member{total !== 1 ? "s" : ""} awaiting approval</p>
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}</div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg">All caught up! No pending approvals.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <Card key={u.id}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-4 flex-wrap">
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarImage src={u.photoUrl ?? ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {u.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{u.name}</p>
                    <p className="text-sm text-muted-foreground">{u.email}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">{u.department}</Badge>
                      <Badge variant="outline">{u.district}</Badge>
                      <Badge variant="outline">Batch {u.batch}</Badge>
                      <Badge variant="outline">{u.admissionSession}</Badge>
                      {u.bloodGroup && <Badge variant="secondary">{u.bloodGroup}</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">📞 {u.mobile}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      onClick={() => process(u.id, "approve")}
                      disabled={processingId === u.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <ShieldCheck className="w-4 h-4 mr-1" />Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => process(u.id, "reject")}
                      disabled={processingId === u.id}
                    >
                      <ShieldX className="w-4 h-4 mr-1" />Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ApprovalsPage() {
  return <AdminRoute><ApprovalsContent /></AdminRoute>;
}
