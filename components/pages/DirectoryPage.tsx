"use client";

import React, { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin, GraduationCap, Phone } from "lucide-react";

interface Member {
  id: string; name: string; email: string; department: string; batch: string;
  admissionSession: string; district: string; bloodGroup: string | null;
  mobile: string; photoUrl: string | null; status: string;
}
interface PagedResponse { data: Member[]; total: number; totalPages: number; }

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function DirectoryPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [department, setDepartment] = useState("");
  const [district, setDistrict] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [departments, setDepartments] = useState<{id:string;name:string}[]>([]);
  const [districts, setDistricts] = useState<{id:string;name:string}[]>([]);

  useEffect(() => {
    Promise.all([
      api.get<{id:string;name:string}[]>("/api/departments"),
      api.get<{id:string;name:string}[]>("/api/districts"),
    ]).then(([d, di]) => { setDepartments(d); setDistricts(di); });
  }, []);

  const fetchMembers = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: page.toString(), limit: "12" });
    if (q) params.set("q", q);
    if (department) params.set("department", department);
    if (district) params.set("district", district);
    if (bloodGroup) params.set("bloodGroup", bloodGroup);
    api.get<PagedResponse>(`/api/members?${params}`)
      .then((r) => { setMembers(r.data); setTotal(r.total); setTotalPages(r.totalPages); })
      .finally(() => setLoading(false));
  }, [page, q, department, district, bloodGroup]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const resetFilters = () => { setQ(""); setDepartment(""); setDistrict(""); setBloodGroup(""); setPage(1); };

  return (
    <div className="container mx-auto max-w-7xl px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Member Directory</h1>
        <p className="text-muted-foreground">Find fellow members from Khulna Division</p>
      </div>

      {/* Filters */}
      <div className="bg-muted/40 rounded-lg p-4 mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search name, dept…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="pl-9" />
        </div>
        <Select value={department} onValueChange={(v) => { setDepartment(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger><SelectValue placeholder="All Departments" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((d) => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={district} onValueChange={(v) => { setDistrict(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger><SelectValue placeholder="All Districts" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Districts</SelectItem>
            {districts.map((d) => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={bloodGroup} onValueChange={(v) => { setBloodGroup(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger><SelectValue placeholder="Any Blood Group" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Blood Group</SelectItem>
            {BLOOD_GROUPS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={resetFilters} className="sm:col-span-2 lg:col-span-4">Reset Filters</Button>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{loading ? "Loading…" : `${total} member${total !== 1 ? "s" : ""} found`}</p>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-xl" />)}
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg">No members found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {members.map((m) => (
            <Card key={m.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={m.photoUrl ?? ""} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {m.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <GraduationCap className="w-3 h-3" /> {m.department}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3" /> {m.district}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap justify-center">
                  <Badge variant="outline" className="text-xs">{m.batch}</Badge>
                  {m.bloodGroup && <Badge variant="secondary" className="text-xs">{m.bloodGroup}</Badge>}
                </div>
                {m.mobile && (
                  <a href={`tel:${m.mobile}`} className="text-xs text-muted-foreground flex items-center gap-1 hover:text-primary">
                    <Phone className="w-3 h-3" /> {m.mobile}
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}
