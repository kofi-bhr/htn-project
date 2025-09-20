"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  useEffect(() => {
    const authed = typeof window !== "undefined" && localStorage.getItem("demo-auth") === "true";
    if (!authed) router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            className="px-3 py-2 rounded-md bg-primary text-white hover:opacity-90"
            onClick={() => {
              localStorage.removeItem("demo-auth");
              router.push("/login");
            }}
          >
            Sign out
          </button>
        </div>
        <p className="mt-6 text-gray-400">You are logged in using face authentication.</p>
      </div>
    </div>
  );
}


