import React from "react";
import RegisterPage from "@/components/pages/RegisterPage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = { title: "Register — Khulna Association" };

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <RegisterPage />
      </main>
      <Footer />
    </>
  );
}
