"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useSession } from "@/hooks/use-session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, Users, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface Event {
  id: string; title: string; description: string; date: string;
  location: string; attendeeCount: number; attending?: boolean; isPublic: boolean;
}

export default function EventsPage() {
  const { user } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{data:Event[]}>("/api/events?upcoming=true&limit=20")
      .then((r) => setEvents(r.data))
      .finally(() => setLoading(false));
  }, []);

  const rsvp = async (id: string) => {
    if (!user) { toast.error("Please log in to RSVP"); return; }
    if (user.status !== "approved") { toast.error("Your account must be approved to RSVP"); return; }
    try {
      const result = await api.post<{attending:boolean;attendeeCount:number}>(`/api/events/${id}/rsvp`, {});
      setEvents((prev) => prev.map((e) => e.id === id ? { ...e, attending: result.attending, attendeeCount: result.attendeeCount } : e));
      toast.success(result.attending ? "RSVP confirmed!" : "RSVP cancelled");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to RSVP");
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Upcoming Events</h1>
        <p className="text-muted-foreground">Stay connected with association events</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map((i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg">No upcoming events</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((e) => (
            <Card key={e.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">{e.title}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">{e.description}</CardDescription>
                  </div>
                  {e.attending && <Badge className="bg-green-100 text-green-800 shrink-0"><CheckCircle className="w-3 h-3 mr-1" />Going</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{format(new Date(e.date), "PPP p")}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{e.location}</span>
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" />{e.attendeeCount} attending</span>
                </div>
                {user?.status === "approved" && (
                  <Button
                    size="sm"
                    variant={e.attending ? "outline" : "default"}
                    onClick={() => rsvp(e.id)}
                  >
                    {e.attending ? "Cancel RSVP" : "RSVP Now"}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
