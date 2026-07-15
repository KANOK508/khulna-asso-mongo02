import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DirectoryPage from "@/components/pages/DirectoryPage";

export const metadata = { title: "Member Directory — Khulna Association" };

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] py-8">
        <DirectoryPage />
      </main>
      <Footer />
    </>
  );
}
