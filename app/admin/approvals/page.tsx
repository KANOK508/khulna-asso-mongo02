import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ApprovalsPage from "@/components/pages/ApprovalsPage";

export const metadata = { title: "Pending Approvals — Admin" };

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] py-8">
        <ApprovalsPage />
      </main>
      <Footer />
    </>
  );
}
