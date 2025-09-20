"use client";

// Singleton Human instance for the browser
let humanInstance: any = null;

// Minimal config optimized for face detection + embeddings + basic gestures
// Models are loaded from the official CDN for quick demo use
const humanConfig: any = {
  modelBasePath: "https://vladmandic.github.io/human/models",
  backend: "", // let Human pick the best available backend (webgl/wasm/cpu)
  filter: { enabled: true },
  face: {
    enabled: true,
    detector: { rotation: true, maxDetected: 1, skipFrames: 1, skipTime: 100, minConfidence: 0.2 },
    mesh: { enabled: true },
    iris: { enabled: true },
    attention: { enabled: false },
    description: { enabled: true, skipFrames: 1, skipTime: 100, minConfidence: 0.1 }, // enables face embeddings
    liveness: { enabled: true, skipFrames: 1, skipTime: 200 },
  },
  gesture: { enabled: true },
};

export async function getHuman(): Promise<any> {
  if (humanInstance) return humanInstance;
  if (typeof window === 'undefined') throw new Error('Human can only run in the browser');
  // Always dynamically import ESM/browser build
  const HumanModule = await import("@vladmandic/human");
  const Human = HumanModule.default;
  const human = new Human(humanConfig);
  console.log('[Human] init config', humanConfig);
  await human.load();
  console.log('[Human] models loaded');
  await human.warmup();
  console.log('[Human] warmup complete');
  humanInstance = human;
  return humanInstance;
}

export type FaceDetectionResult = any;

// Simple cosine similarity util for embeddings (client-side preview/QA)
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return -1;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}


