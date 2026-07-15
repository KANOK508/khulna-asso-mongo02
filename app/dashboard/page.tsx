import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardPage from "@/components/pages/DashboardPage";

export const metadata = { title: "Dashboard — Khulna Association" };

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] py-8">
        <DashboardPage />
      </main>
      <Footer />
    </>
  );
}
