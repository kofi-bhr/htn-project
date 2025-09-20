"use client";

import { useRouter } from "next/navigation";
import FaceAuth from "@/components/FaceAuth";

export default function RegisterPage() {
  const router = useRouter();

  async function handleRegister(embedding: number[]) {
    const res = await fetch("/api/face/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embedding }),
    });
    if (res.ok) {
      localStorage.setItem("demo-auth", "true");
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Register Your Face</h1>
        <p className="text-gray-400 mb-6">We&apos;ll store only an embedding, not your raw photo.</p>
        <FaceAuth mode="register" onEmbedding={handleRegister} />
        <div className="mt-6 text-sm text-gray-400">
          Already registered? <a className="underline" href="/login">Login with your face</a>
        </div>
      </div>
    </div>
  );
}


