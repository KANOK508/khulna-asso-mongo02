"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const ADMISSION_SESSIONS = Array.from({ length: 20 }, (_, i) => `${2005 + i}-${2006 + i}`);

interface ReferenceItem { id: string; name: string; }

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<ReferenceItem[]>([]);
  const [districts, setDistricts] = useState<ReferenceItem[]>([]);

  const [form, setForm] = useState({
    name: "", email: "", password: "", mobile: "",
    department: "", batch: "", admissionSession: "",
    district: "", bloodGroup: "", photoUrl: "",
  });

  useEffect(() => {
    Promise.all([
      api.get<ReferenceItem[]>("/api/departments"),
      api.get<ReferenceItem[]>("/api/districts"),
    ]).then(([depts, dists]) => {
      setDepartments(depts);
      setDistricts(dists);
    }).catch(() => {});
  }, []);

  const set = (k: string) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  const setInput = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.department || !form.district || !form.admissionSession) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    const { error } = await signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
      mobile: form.mobile,
      department: form.department,
      batch: form.batch,
      admissionSession: form.admissionSession,
      district: form.district,
      bloodGroup: form.bloodGroup || undefined,
      photoUrl: form.photoUrl || undefined,
    } as Parameters<typeof signUp.email>[0]);

    if (error) {
      toast.error(error.message ?? "Registration failed");
      setLoading(false);
      return;
    }
    toast.success("Account created! Please wait for admin approval before full access.");
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Join Khulna Association</CardTitle>
        <CardDescription>Create your account — an admin will approve you shortly.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input placeholder="Md. Rahim Uddin" value={form.name} onChange={setInput("name")} required />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" placeholder="rahim@example.com" value={form.email} onChange={setInput("email")} required />
            </div>
            <div className="space-y-2">
              <Label>Password *</Label>
              <Input type="password" placeholder="Min. 8 characters" value={form.password} onChange={setInput("password")} required minLength={8} />
            </div>
            <div className="space-y-2">
              <Label>Mobile *</Label>
              <Input placeholder="01XXXXXXXXX" value={form.mobile} onChange={setInput("mobile")} required />
            </div>
            <div className="space-y-2">
              <Label>Department *</Label>
              <Select onValueChange={set("department")} value={form.department}>
                <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>
                  {departments.map((d) => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>District (Khulna Division) *</Label>
              <Select onValueChange={set("district")} value={form.district}>
                <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                <SelectContent>
                  {districts.map((d) => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Batch *</Label>
              <Input placeholder="e.g. 12th" value={form.batch} onChange={setInput("batch")} required />
            </div>
            <div className="space-y-2">
              <Label>Admission Session *</Label>
              <Select onValueChange={set("admissionSession")} value={form.admissionSession}>
                <SelectTrigger><SelectValue placeholder="Select session" /></SelectTrigger>
                <SelectContent>
                  {ADMISSION_SESSIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Blood Group (Optional)</Label>
              <Select onValueChange={set("bloodGroup")} value={form.bloodGroup}>
                <SelectTrigger><SelectValue placeholder="Select blood group" /></SelectTrigger>
                <SelectContent>
                  {BLOOD_GROUPS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Photo URL (Optional)</Label>
              <Input placeholder="https://..." value={form.photoUrl} onChange={setInput("photoUrl")} type="url" />
            </div>
          </div>
          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...</> : "Create Account"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">Log In</Link>
        </p>
      </CardContent>
    </Card>
  );
}
