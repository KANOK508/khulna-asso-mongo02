import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CommitteePage from "@/components/pages/CommitteePage";

export const metadata = { title: "Committee — Khulna Association" };

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] py-8">
        <CommitteePage />
      </main>
      <Footer />
    </>
  );
}
