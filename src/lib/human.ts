"use client";

// Singleton Human instance for the browser
let humanInstance: any = null;

// Minimal config optimized for face detection + embeddings + basic gestures
// Models are loaded from the official CDN for quick demo use
const humanConfig = {
  modelBasePath: "https://vladmandic.github.io/human/models",
  backend: "webgl",
  filter: { enabled: true },
  face: {
    enabled: true,
    detector: { rotation: true },
    mesh: { enabled: true },
    iris: { enabled: true },
    attention: { enabled: true },
    description: { enabled: true }, // enables face embeddings
  },
  gesture: { enabled: true },
};

export async function getHuman(): Promise<any> {
  if (humanInstance) return humanInstance;
  
  // Dynamic import to avoid server-side issues
  if (typeof window === 'undefined') {
    throw new Error('Human library can only be used in the browser');
  }
  
  // Check if we're in development mode
  const isDev = process.env.NODE_ENV === 'development';
  
  if (!isDev) {
    // In production, return a mock implementation
    return {
      detect: async () => ({ face: [] }),
      draw: () => {},
      load: async () => {},
      warmup: async () => {},
    };
  }
  
  // Use dynamic import with proper error handling
  try {
    // Try to import the human library
    const HumanModule = await import("@vladmandic/human");
    const Human = HumanModule.default;
    const human = new Human(humanConfig);
    await human.load();
    await human.warmup();
    humanInstance = human;
    return humanInstance;
  } catch (error) {
    console.error('Failed to load Human library:', error);
    // Return a mock implementation for development
    return {
      detect: async () => ({ face: [] }),
      draw: () => {},
      load: async () => {},
      warmup: async () => {},
    };
  }
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


