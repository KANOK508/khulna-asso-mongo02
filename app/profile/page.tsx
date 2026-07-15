import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfilePage from "@/components/pages/ProfilePage";

export const metadata = { title: "My Profile — Khulna Association" };

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] py-8">
        <ProfilePage />
      </main>
      <Footer />
    </>
  );
}
