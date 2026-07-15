import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventsPage from "@/components/pages/EventsPage";

export const metadata = { title: "Events — Khulna Association" };

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] py-8">
        <EventsPage />
      </main>
      <Footer />
    </>
  );
}
