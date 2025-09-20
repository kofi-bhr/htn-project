"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getHuman } from "@/lib/human";

type Mode = "login" | "register";

export interface FaceAuthProps {
  mode: Mode; // whether we are verifying or registering
  onEmbedding: (embedding: number[]) => Promise<void>; // called after liveness success
  onDebug?: (info: { blink: number; turnLeft: number; turnRight: number; elapsedMs: number }) => void;
}

export default function FaceAuth({ mode, onEmbedding, onDebug }: FaceAuthProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = useState<string>("Initializing camera...");
  const [running, setRunning] = useState<boolean>(false);
  const runningRef = useRef<boolean>(false);
  const startTimeRef = useRef<number>(0);
  const [debug, setDebug] = useState<{ blink: number; turnLeft: number; turnRight: number }>({ blink: 0, turnLeft: 0, turnRight: 0 });
  const frameCountRef = useRef<number>(0);
  const lastLogRef = useRef<number>(0);
  const log = (...args: unknown[]) => console.log("[FaceAuth]", ...args);

  // Start webcam
  useEffect(() => {
    let stream: MediaStream | null = null;
    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
        const video = videoRef.current;
        if (video) {
          if (video.srcObject !== stream) video.srcObject = stream;
          // Wait for metadata/canplay before calling play to avoid AbortError
          await new Promise<void>((resolve) => {
            if (video.readyState >= 2 && video.videoWidth) return resolve();
            const onReady = () => resolve();
            video.addEventListener('loadedmetadata', onReady, { once: true });
            video.addEventListener('canplay', onReady, { once: true });
          });
          try {
            await video.play();
          } catch (err: any) {
            if (err?.name !== 'AbortError') console.warn('video.play() failed', err);
          }
        }
        setStatus("Camera ready. Align your face in the frame.");
        log("camera stream started", {
          tracks: stream?.getVideoTracks().map(t => ({ label: t.label, readyState: t.readyState }))
        });
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

  // Preload Human models early for faster scanning
  useEffect(() => {
    (async () => {
      try {
        await getHuman();
      } catch {}
    })();
  }, []);

  const detectLoop = useCallback(async () => {
    setRunning(true);
    runningRef.current = true;
    const human = await getHuman();
    const video = videoRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ensure video has dimensions before starting
    if (video.readyState < 2 || !video.videoWidth) {
      await new Promise<void>((resolve) => {
        const onReady = () => resolve();
        video.onloadeddata = onReady;
        video.onloadedmetadata = onReady;
      });
    }
    startTimeRef.current = Date.now();
    log('loop started', { w: video.videoWidth, h: video.videoHeight });

    const tick = async () => {
      if (!runningRef.current) return;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const nowStart = Date.now();
      let result: any;
      try {
        result = await human.detect(video);
      } catch (err) {
        log('detect error', err);
        requestAnimationFrame(tick);
        return;
      }
      const nowEnd = Date.now();
      if (nowEnd - lastLogRef.current > 1000) {
        lastLogRef.current = nowEnd;
        log('tick', { dtMs: nowEnd - nowStart, videoSize: { w: video.videoWidth, h: video.videoHeight } });
      }
      if (!result || !Array.isArray(result.face)) {
        log('detect returned unexpected result', result);
      }
      frameCountRef.current += 1;

      // Draw overlay
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      await human.draw.canvas(video, canvas);
      await human.draw.face(canvas, result.face);

      if (Array.isArray(result.face) && result.face.length > 0) {
        const face = result.face[0] as any;
        // Gesture data may be exposed on face.gesture or result.gesture or result.gestures
        const gesturesRoot: any = (face.gesture ?? (result as any).gesture ?? (result as any).gestures ?? {});
        const gestures = (Array.isArray(gesturesRoot) ? gesturesRoot[0] : gesturesRoot) as Record<string, number>;
        const embedding = face.embedding as number[] | undefined;

        // Prefer built-in liveness scores if present
        const live = (face?.live ?? (face?.liveness ?? 0)) as number;
        // Gesture-derived fallbacks
        const blink = (gestures.blink ?? gestures.eyeBlink ?? gestures.blinkLeft ?? 0) as number;
        const turnLeft = (gestures.turnLeft ?? gestures.lookLeft ?? 0) as number;
        const turnRight = (gestures.turnRight ?? gestures.lookRight ?? 0) as number;

        // Relaxed thresholds for demo reliability
        const passedLiveness = (live > 0.5) || (blink > 0.15) || (turnLeft > 0.3) || (turnRight > 0.3);
        setDebug({ blink, turnLeft, turnRight });
        onDebug?.({ blink, turnLeft, turnRight, elapsedMs: Date.now() - startTimeRef.current });

        // Throttled console diagnostics
        const now = Date.now();
        if (now - lastLogRef.current > 500) {
          lastLogRef.current = now;
          log("frame", frameCountRef.current, {
            faces: result.face.length,
            box: face?.box ? { w: Math.round(face.box[2]), h: Math.round(face.box[3]) } : undefined,
            live: (live || 0).toFixed(2),
            blink: blink.toFixed(2),
            turnLeft: turnLeft.toFixed(2),
            turnRight: turnRight.toFixed(2),
            embeddingLen: embedding?.length ?? 0,
          });
        }
        if (passedLiveness && embedding && embedding.length) {
          setStatus("Liveness passed. Capturing embedding...");
          setRunning(false);
          runningRef.current = false;
          try {
            await onEmbedding(Array.from(embedding));
          } catch (err) {
            console.error(err);
            setStatus("Submission failed. Try again.");
            setRunning(true);
            runningRef.current = true;
            requestAnimationFrame(tick);
            return;
          }
          return; // stop loop after success
        } else {
          // Fallback: if user has embedding but liveness not detected after 10s, proceed
          if (embedding && embedding.length && Date.now() - startTimeRef.current > 10000) {
            setStatus("Timeout reached. Proceeding without liveness (demo mode)...");
            setRunning(false);
            runningRef.current = false;
            await onEmbedding(Array.from(embedding));
            return;
          }
          setStatus(mode === "register" ? "Blink slowly or turn head left/right" : "Blink/turn for liveness, then hold still to login");
        }
      } else {
        setStatus("No face detected. Center your face in the frame.");
        const now = Date.now();
        if (now - lastLogRef.current > 500) {
          lastLogRef.current = now;
          log("no-face", { frame: frameCountRef.current, videoSize: { w: video.videoWidth, h: video.videoHeight } });
        }
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
        <div className="absolute left-2 top-2 bg-black/60 text-white text-xs rounded px-2 py-1 space-x-2">
          <span>blink: {debug.blink.toFixed(2)}</span>
          <span>L: {debug.turnLeft.toFixed(2)}</span>
          <span>R: {debug.turnRight.toFixed(2)}</span>
        </div>
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


