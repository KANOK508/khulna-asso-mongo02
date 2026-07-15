"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, Calendar, MessageSquare, Shield, ArrowRight, BookOpen, Globe, Award } from "lucide-react";

const FADE_UP: Variants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
const STAGGER: Variants = { visible: { transition: { staggerChildren: 0.1 } } };

interface Stats { totalMembers: number; totalEvents: number; totalForumPosts: number; }

export default function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.get<Stats>("/api/stats").then(setStats).catch(() => {});
  }, []);

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--primary))] via-[hsl(var(--primary))]/80 to-[hsl(var(--primary))]/40 z-0" />
        <div className="container relative z-10 px-4 py-20 md:py-32 flex flex-col items-center text-center max-w-6xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={FADE_UP}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--secondary))]/20 text-[hsl(var(--secondary))] border border-[hsl(var(--secondary))]/30 mb-6 text-sm font-medium">
            <MapPin className="w-4 h-4" />
            <span>Netrokona University</span>
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={FADE_UP}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 max-w-4xl leading-tight">
            The Digital Home for{" "}
            <span className="text-[hsl(var(--secondary))]">Khulna Division</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={FADE_UP}
            className="text-lg md:text-xl opacity-80 mb-10 max-w-2xl">
            Connecting students and alumni, celebrating heritage, and fostering lifelong networks for the Khulna community at Netrokona University.
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={STAGGER} className="flex flex-col sm:flex-row gap-4">
            <motion.div variants={FADE_UP}>
              <Button size="lg" className="bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--secondary))]/90 text-base px-8 h-14" asChild>
                <Link href="/register">Join the Network</Link>
              </Button>
            </motion.div>
            <motion.div variants={FADE_UP}>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8 h-14" asChild>
                <Link href="/directory">Browse Directory</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      {stats && (
        <section className="bg-[hsl(var(--primary))]/5 border-y py-10">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="grid grid-cols-3 gap-8 text-center">
              {[
                { label: "Members", value: stats.totalMembers, icon: Users },
                { label: "Events", value: stats.totalEvents, icon: Calendar },
                { label: "Forum Posts", value: stats.totalForumPosts, icon: MessageSquare },
              ].map((s) => (
                <div key={s.label}>
                  <s.icon className="w-6 h-6 text-[hsl(var(--primary))] mx-auto mb-1" />
                  <p className="text-3xl font-bold text-[hsl(var(--primary))]">{s.value}+</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mission */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={FADE_UP}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission & Vision</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                We are a community of students and alumni from the Khulna Division studying at Netrokona University. Our mission is to create a strong network that supports each member — academically, professionally, and personally.
              </p>
              <ul className="space-y-3">
                {[
                  { icon: BookOpen, text: "Academic support and peer mentoring" },
                  { icon: Globe, text: "Professional networking across districts" },
                  { icon: Award, text: "Cultural events celebrating Khulna heritage" },
                  { icon: Shield, text: "Welfare and crisis support for members" },
                ].map((item) => (
                  <li key={item.text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-[hsl(var(--primary))]" />
                    </div>
                    <span className="text-muted-foreground">{item.text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={FADE_UP}
              className="rounded-2xl overflow-hidden shadow-lg aspect-video bg-[hsl(var(--primary))]/10 flex items-center justify-center">
              <div className="text-center p-8">
                <MapPin className="w-16 h-16 text-[hsl(var(--primary))]/40 mx-auto mb-4" />
                <p className="text-muted-foreground">Khulna Division, Bangladesh</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground text-lg">A complete platform for the Khulna Association community</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { href: "/directory", icon: Users, title: "Member Directory", desc: "Find and connect with fellow Khulna members across departments and batches" },
              { href: "/events", icon: Calendar, title: "Events & RSVP", desc: "Stay updated on association events and confirm your attendance" },
              { href: "/forum", icon: MessageSquare, title: "Community Forum", desc: "Share job opportunities, seek guidance, and discuss news" },
              { href: "/committee", icon: Shield, title: "Committee", desc: "Meet the elected leadership and see historical committee records" },
            ].map((f) => (
              <motion.div key={f.href} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP}>
                <Link href={f.href}>
                  <Card className="h-full hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
                    <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[hsl(var(--primary))]/10 flex items-center justify-center">
                        <f.icon className="w-6 h-6 text-[hsl(var(--primary))]" />
                      </div>
                      <h3 className="font-bold">{f.title}</h3>
                      <p className="text-sm text-muted-foreground">{f.desc}</p>
                      <span className="text-xs text-[hsl(var(--primary))] flex items-center gap-1 mt-auto">
                        Explore <ArrowRight className="w-3 h-3" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP}
          className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Connect?</h2>
          <p className="text-[hsl(var(--primary-foreground))]/80 text-lg mb-8">
            Join hundreds of Khulna Division students and alumni building a stronger community together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--secondary))]/90" asChild>
              <Link href="/register">Create Your Account</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link href="/login">Log In</Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}