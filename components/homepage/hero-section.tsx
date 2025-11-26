"use client";

import { Waitlist, SignIn, SignUp, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HeroSection() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const waitlistEnabled =
    process.env.NEXT_PUBLIC_CLERK_WAITLIST_ENABLED === "true";
  const signupEnabled = process.env.NEXT_PUBLIC_CLERK_SIGNUP_ENABLED === "true";

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Redirect to main dashboard which will route based on role
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  // Don't render anything while checking auth status or if already signed in
  if (!isLoaded || isSignedIn) {
    return null;
  }

  return (
    <section className="w-full max-w-2xl mx-auto px-6 py-20">
      <div className="text-center space-y-8">
        <div className="pt-8 flex justify-center">
          {waitlistEnabled ? (
            <Waitlist />
          ) : signupEnabled ? (
            <SignUp />
          ) : (
            <SignIn />
          )}
        </div>
      </div>
    </section>
  );
}
