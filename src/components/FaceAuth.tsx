"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getHuman } from "@/lib/human";

type Mode = "login" | "register";

export interface FaceAuthProps {
  mode: Mode; // whether we are verifying or registering
  onEmbedding: (embedding: number[]) => Promise<void>; // called after liveness success
}

export default function FaceAuth({ mode, onEmbedding }: FaceAuthProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = useState<string>("Initializing camera...");
  const [running, setRunning] = useState<boolean>(false);

  // Start webcam
  useEffect(() => {
    let stream: MediaStream | null = null;
    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setStatus("Camera ready. Align your face in the frame.");
      } catch (e) {
        console.error(e);
        setStatus("Failed to access camera.");
      }
    };
    start();
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const detectLoop = useCallback(async () => {
    setRunning(true);
    const human = await getHuman();
    const video = videoRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tick = async () => {
      if (!running) return;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const result = await human.detect(video);

      // Draw overlay
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      await human.draw.canvas(video, canvas);
      await human.draw.face(canvas, result.face);

      if (result.face.length > 0) {
        const face = result.face[0] as any;
        const gestures = face.gesture || {};
        const embedding = face.embedding as number[] | undefined;

        // Basic liveness: require blink OR head turn left/right
        const blink = gestures.blink || gestures.eyeBlink || 0; // different models expose slightly different keys
        const turnLeft = gestures.turnLeft || 0;
        const turnRight = gestures.turnRight || 0;

        const passedLiveness = (blink > 0.5) || (turnLeft > 0.5) || (turnRight > 0.5);
        if (passedLiveness && embedding && embedding.length) {
          setStatus("Liveness passed. Capturing embedding...");
          setRunning(false);
          try {
            await onEmbedding(Array.from(embedding));
          } catch (err) {
            console.error(err);
            setStatus("Submission failed. Try again.");
            setRunning(true);
            requestAnimationFrame(tick);
            return;
          }
          return; // stop loop after success
        } else {
          setStatus(mode === "register" ? "Blink or turn your head, then hold still" : "Blink/turn for liveness, then hold still to login");
        }
      } else {
        setStatus("No face detected. Center your face in the frame.");
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [running, mode, onEmbedding]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>
      <div className="mt-4 flex items-center gap-4">
        <button
          className="px-4 py-2 rounded-md bg-primary text-white hover:opacity-90"
          onClick={() => {
            if (!running) detectLoop();
          }}
        >
          {running ? "Scanning..." : mode === "register" ? "Start Registration" : "Start Login"}
        </button>
        <p className="text-sm text-gray-400">{status}</p>
      </div>
    </div>
  );
}


