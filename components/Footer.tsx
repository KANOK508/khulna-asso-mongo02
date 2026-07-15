import React from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-3">
              <MapPin className="w-5 h-5 text-secondary" />
              <span>Khulna Association</span>
            </div>
            <p className="text-sm text-primary-foreground/70">
              The digital home for the Khulna Division community at Netrokona University.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              {[
                { href: "/directory", label: "Member Directory" },
                { href: "/events", label: "Events" },
                { href: "/forum", label: "Community Forum" },
                { href: "/committee", label: "Committee" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-secondary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Account</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link href="/login" className="hover:text-secondary transition-colors">Log In</Link></li>
              <li><Link href="/register" className="hover:text-secondary transition-colors">Register</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Khulna Association — Netrokona University. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
