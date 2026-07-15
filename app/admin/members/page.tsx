import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminMembersPage from "@/components/pages/AdminMembersPage";

export const metadata = { title: "Manage Members — Admin" };

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] py-8">
        <AdminMembersPage />
      </main>
      <Footer />
    </>
  );
}
