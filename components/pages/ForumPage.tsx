"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useSession } from "@/hooks/use-session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MessageSquare, Pin, Plus } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface Post {
  id: string; title: string; body: string; category: string; isPinned: boolean;
  createdAt: string; commentCount: number;
  author: { name: string; department?: string };
}

const CATEGORIES = ["general", "jobs", "guidance", "news"] as const;
const CATEGORY_COLORS: Record<string, string> = {
  general: "bg-gray-100 text-gray-800",
  jobs: "bg-blue-100 text-blue-800",
  guidance: "bg-purple-100 text-purple-800",
  news: "bg-green-100 text-green-800",
};

export default function ForumPage() {
  const { user } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", body: "", category: "general" });
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "20" });
    if (category) params.set("category", category);
    api.get<{data:Post[]}>(`/api/forum?${params}`)
      .then((r) => setPosts(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, [category]);

  const submitPost = async () => {
    if (!newPost.title || !newPost.body) { toast.error("Title and body are required"); return; }
    setSubmitting(true);
    try {
      await api.post("/api/forum", newPost);
      toast.success("Post created!");
      setDialogOpen(false);
      setNewPost({ title: "", body: "", category: "general" });
      fetchPosts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  const canPost = user?.status === "approved";

  return (
    <div className="container mx-auto max-w-4xl px-4">
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold mb-2">Community Forum</h1>
          <p className="text-muted-foreground">Discussions, jobs, and guidance for Khulna members</p>
        </div>
        {canPost && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />New Post</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader><DialogTitle>Create Forum Post</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input placeholder="Post title" value={newPost.title} onChange={(e) => setNewPost((p) => ({ ...p, title: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={newPost.category} onValueChange={(v) => setNewPost((p) => ({ ...p, category: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Body *</Label>
                  <Textarea rows={5} placeholder="Write your post…" value={newPost.body} onChange={(e) => setNewPost((p) => ({ ...p, body: e.target.value }))} />
                </div>
                <Button className="w-full" onClick={submitPost} disabled={submitting}>
                  {submitting ? "Posting…" : "Submit Post"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Button variant={category === "" ? "default" : "outline"} size="sm" onClick={() => setCategory("")}>All</Button>
        {CATEGORIES.map((c) => (
          <Button key={c} variant={category === c ? "default" : "outline"} size="sm" onClick={() => setCategory(c)} className="capitalize">{c}</Button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3,4].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No posts yet. Be the first to post!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <Card key={p.id} className={`hover:shadow-md transition-shadow ${p.isPinned ? "border-primary/30 bg-primary/5" : ""}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start gap-3">
                  {p.isPinned && <Pin className="w-4 h-4 text-primary shrink-0 mt-0.5" />}
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base font-semibold line-clamp-1">{p.title}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{p.body}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
                  <Badge className={`text-xs ${CATEGORY_COLORS[p.category] ?? ""}`}>{p.category}</Badge>
                  <span>by <span className="font-medium">{p.author.name}</span></span>
                  <span>{format(new Date(p.createdAt), "PP")}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{p.commentCount} comment{p.commentCount !== 1 ? "s" : ""}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
