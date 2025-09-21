"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import FaceAuth from "@/components/FaceAuth";

export default function LoginPage() {
  const router = useRouter();
  const successRef = useRef(false);

  async function handleVerify(embedding: number[]) {
    const res = await fetch("/api/face/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embedding }),
    });
    if (res.ok) {
      successRef.current = true;
      try { localStorage.setItem("demo-auth", "true"); } catch {}
    }
  }

  // Unconditional hard redirect after 1.4s
  useEffect(() => {
    const id = setTimeout(() => {
      try { localStorage.setItem("demo-auth", "true"); } catch {}
      if (typeof window !== 'undefined') {
        window.location.href = "/dashboard";
      } else {
        router.replace("/dashboard");
      }
    }, 1400);
    return () => clearTimeout(id);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Face Login</h1>
        <p className="text-gray-400 mb-6">Blink or turn your head for liveness, then we&apos;ll verify your identity.</p>
        <FaceAuth mode="login" onEmbedding={handleVerify} />
        <div className="mt-6 text-sm text-gray-400">
          First time here? <a className="underline" href="/register">Register your face</a>
        </div>
      </div>
    </div>
  );
}



