"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/hooks/use-session";
import { api } from "@/lib/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Profile {
  currentJob: string | null; company: string | null; location: string | null;
  bio: string | null; activities: string[]; skills: string[];
  linkedinUrl: string | null; facebookUrl: string | null; websiteUrl: string | null;
}

function ProfileContent() {
  const { user } = useSession();
  const [profile, setProfile] = useState<Profile>({
    currentJob: "", company: "", location: "", bio: "",
    activities: [], skills: [], linkedinUrl: "", facebookUrl: "", websiteUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      api.get<Profile & { id: string }>(`/api/members/${user.id}`)
        .then((data) => setProfile({
          currentJob: data.currentJob ?? "",
          company: data.company ?? "",
          location: data.location ?? "",
          bio: data.bio ?? "",
          activities: data.activities ?? [],
          skills: data.skills ?? [],
          linkedinUrl: data.linkedinUrl ?? "",
          facebookUrl: data.facebookUrl ?? "",
          websiteUrl: data.websiteUrl ?? "",
        }))
        .finally(() => setLoading(false));
    }
  }, [user?.id]);

  const save = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      await api.patch(`/api/members/${user.id}`, profile);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const set = (k: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setProfile((p) => ({ ...p, [k]: e.target.value }));

  if (!user) return null;

  return (
    <div className="container mx-auto max-w-3xl px-4">
      <div className="mb-8 flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.photoUrl ?? ""} />
          <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
            {user.name?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.department} · {user.batch}</p>
          <Badge variant={user.status === "approved" ? "default" : "secondary"} className="mt-1 capitalize">{user.status}</Badge>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Edit Profile</CardTitle></CardHeader>
        <CardContent>
          {loading ? <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div> : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Current Job</Label>
                  <Input value={profile.currentJob ?? ""} onChange={set("currentJob")} placeholder="e.g. Software Engineer" />
                </div>
                <div className="space-y-2">
                  <Label>Company / Organization</Label>
                  <Input value={profile.company ?? ""} onChange={set("company")} placeholder="e.g. BRAC" />
                </div>
                <div className="space-y-2">
                  <Label>Current Location</Label>
                  <Input value={profile.location ?? ""} onChange={set("location")} placeholder="e.g. Dhaka, Bangladesh" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea rows={3} value={profile.bio ?? ""} onChange={set("bio")} placeholder="Tell fellow members about yourself…" />
              </div>
              <div className="space-y-2">
                <Label>Skills (comma-separated)</Label>
                <Input value={profile.skills.join(", ")} onChange={(e) => setProfile((p) => ({ ...p, skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))} placeholder="e.g. React, Python, Teaching" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>LinkedIn URL</Label>
                  <Input value={profile.linkedinUrl ?? ""} onChange={set("linkedinUrl")} placeholder="https://linkedin.com/in/…" />
                </div>
                <div className="space-y-2">
                  <Label>Facebook URL</Label>
                  <Input value={profile.facebookUrl ?? ""} onChange={set("facebookUrl")} placeholder="https://facebook.com/…" />
                </div>
                <div className="space-y-2">
                  <Label>Website URL</Label>
                  <Input value={profile.websiteUrl ?? ""} onChange={set("websiteUrl")} placeholder="https://…" />
                </div>
              </div>
              <Button onClick={save} disabled={saving}>
                {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : "Save Profile"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  return <ProtectedRoute><ProfileContent /></ProtectedRoute>;
}
