"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";

interface CommitteeMember {
  id: string; title: string; year: string; isCurrent: boolean;
  member: { name: string; department?: string; photoUrl?: string | null; district?: string } | null;
}
interface CommitteeResponse { current: CommitteeMember[]; history: CommitteeMember[]; years: string[]; }

export default function CommitteePage() {
  const [data, setData] = useState<CommitteeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<CommitteeResponse>("/api/committee?current=true")
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto max-w-5xl px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Committee</h1>
        <p className="text-muted-foreground">Current executive committee of the Khulna Association</p>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map((i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
        </div>
      ) : !data?.current.length ? (
        <div className="text-center py-20 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No committee positions defined yet</p>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">Current Committee {data.years[0] ? `(${data.years[0]})` : ""}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.current.map((pos) => (
              <Card key={pos.id} className="hover:shadow-md transition-shadow text-center">
                <CardContent className="pt-6 flex flex-col items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={pos.member?.photoUrl ?? ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {pos.member?.name?.slice(0, 2).toUpperCase() ?? "??"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold">{pos.member?.name ?? "Unknown"}</p>
                    <Badge className="mt-1 bg-primary/10 text-primary border-primary/20">{pos.title}</Badge>
                    {pos.member?.department && <p className="text-xs text-muted-foreground mt-1">{pos.member.department}</p>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
