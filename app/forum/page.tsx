import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ForumPage from "@/components/pages/ForumPage";

export const metadata = { title: "Community Forum — Khulna Association" };

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] py-8">
        <ForumPage />
      </main>
      <Footer />
    </>
  );
}
