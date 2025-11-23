"use client";

import { Waitlist } from "@clerk/nextjs";

export default function HeroSection() {
  return (
    <section className="w-full max-w-2xl mx-auto px-6 py-20">
      <div className="text-center space-y-8">
        <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
          Student Management
          <span className="block text-primary mt-2">System</span>
        </h1>

        <p className="text-xl text-muted-foreground">
          A modern platform for managing student data, attendance, and academic
          performance.
        </p>

        <div className="pt-8">
          <Waitlist />
        </div>
      </div>
    </section>
  );
}
