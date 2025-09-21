"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { detectFaces, detectLiveness, cosineSimilarity } from "@/lib/human";
import { supabase } from "@/lib/supabaseClient";

type Mode = "login" | "register";

export interface FaceAuthProps {
  mode: Mode; // whether we are verifying or registering
  onEmbedding: (embedding: number[]) => Promise<void>; // called after liveness success
  onDebug?: (info: { blink: number; turnLeft: number; turnRight: number; elapsedMs: number }) => void;
  onTimeout?: () => void; // optional: called if login mode exceeds time limit
}

export default function FaceAuth({ mode, onEmbedding, onDebug, onTimeout }: FaceAuthProps) {
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
  const [referenceEmbedding, setReferenceEmbedding] = useState<number[] | null>(null);
  const [liveSimilarity, setLiveSimilarity] = useState<number | null>(null);
  const lastSimCheckRef = useRef<number>(0);
  const timeoutFiredRef = useRef<boolean>(false);

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
          } catch (err: unknown) {
            if ((err as Error)?.name !== 'AbortError') console.warn('video.play() failed', err);
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
  const detectLoop = useCallback(async () => {
    setRunning(true);
    runningRef.current = true;
    
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

      // Login timeout: after 1.4s without success, trigger onTimeout once
      const elapsed = nowStart - startTimeRef.current;
      if (mode === "login" && !timeoutFiredRef.current && elapsed > 1400) {
        timeoutFiredRef.current = true;
        setRunning(false);
        runningRef.current = false;
        try { onTimeout?.(); } catch (e) { console.warn('[FaceAuth] onTimeout error', e); }
        return;
      }
      
      let result;
      try {
        result = await detectFaces(video);
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
      
      frameCountRef.current += 1;

      // Draw overlay
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw face bounding boxes
      if (result.faces && result.faces.length > 0) {
        const face = result.faces[0];
        const { x, y, width, height } = face.boundingBox;
        
        // Draw face bounding box
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        
        // Draw face center circle
        ctx.beginPath();
        ctx.arc(x + width/2, y + height/2, 20, 0, 2 * Math.PI);
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        const embedding = face.embedding;
        const blink = Math.random() * 0.5; // Mock blink detection
        const turnLeft = Math.random() * 0.5; // Mock head turn detection
        const turnRight = Math.random() * 0.5; // Mock head turn detection
        
        // Mock liveness detection
        const passedLiveness = detectLiveness() || blink > 0.15 || turnLeft > 0.3 || turnRight > 0.3;
        setDebug({ blink, turnLeft, turnRight });
        onDebug?.({ blink, turnLeft, turnRight, elapsedMs: Date.now() - startTimeRef.current });

        // TEMP DEBUG: update and log live similarity every 1000ms
        const nowSim = Date.now();
        if (
          embedding &&
          referenceEmbedding &&
          embedding.length === referenceEmbedding.length &&
          nowSim - lastSimCheckRef.current >= 1000
        ) {
          lastSimCheckRef.current = nowSim;
          const sim = cosineSimilarity(embedding, referenceEmbedding);
          setLiveSimilarity(sim);
          console.log("[FaceAuth] similarity:", `${Math.round(sim * 100)}%`);
        }

        // Throttled console diagnostics
        const now = Date.now();
        if (now - lastLogRef.current > 500) {
          lastLogRef.current = now;
          log("frame", frameCountRef.current, {
            faces: result.faces.length,
            box: { w: Math.round(width), h: Math.round(height) },
            blink: blink.toFixed(2),
            turnLeft: turnLeft.toFixed(2),
            turnRight: turnRight.toFixed(2),
            embeddingLen: embedding?.length ?? 0,
            liveSim: liveSimilarity != null ? `${Math.round(liveSimilarity * 100)}%` : 'N/A',
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

  // Auto-start scanning when in login mode (after detectLoop is defined)
  useEffect(() => {
    if (mode === "login" && !running && !runningRef.current) {
      // Defer to ensure video element is mounted
      const id = requestAnimationFrame(() => {
        detectLoop();
      });
      return () => cancelAnimationFrame(id);
    }
  }, [mode, running, detectLoop]);

  // TEMP DEBUG: fetch most recent embedding from Supabase on mount
  useEffect(() => {
    const fetchLatestEmbedding = async () => {
      try {
        const { data, error } = await supabase
          .from('face_embeddings')
          .select('embedding, created_at')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (!error && data?.embedding && Array.isArray(data.embedding)) {
          setReferenceEmbedding(data.embedding as number[]);
        } else if (error) {
          console.warn('[FaceAuth] failed to fetch latest embedding from supabase:', error);
        }
      } catch (e) {
        console.warn('[FaceAuth] supabase fetch error:', e);
      }
    };
    fetchLatestEmbedding();
  }, []);
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <div className="absolute left-2 top-2 bg-black/60 text-white text-xs rounded px-2 py-1 space-x-2">
          <span>blink: {debug.blink.toFixed(2)}</span>
          <span>L: {debug.turnLeft.toFixed(2)}</span>
          <span>R: {debug.turnRight.toFixed(2)}</span>
          <span>match: {liveSimilarity != null ? `${Math.round(liveSimilarity * 100)}%` : 'N/A'}</span>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4">
        {mode === "register" && (
          <button
            className="px-4 py-2 rounded-md bg-primary text-white hover:opacity-90"
            onClick={() => {
              if (!running) detectLoop();
            }}
          >
            {running ? "Scanning..." : "Start Registration"}
          </button>
        )}
        <p className="text-sm text-gray-400">{status}</p>
      </div>
    </div>
  );
}


