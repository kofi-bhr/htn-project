// Type definitions for browser APIs
interface FaceDetectorOptions {
  maxDetectedFaces?: number;
  fastMode?: boolean;
}

interface DetectedFace {
  boundingBox: DOMRectReadOnly;
  landmarks?: number[][];
}

interface FaceDetector {
  detect(image: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement): Promise<DetectedFace[]>;
}

declare global {
  interface Window {
    FaceDetector: new (options?: FaceDetectorOptions) => FaceDetector;
  }
}

export interface FaceDetectionResult {
  faces: Array<{
    boundingBox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    landmarks?: number[][];
    embedding?: number[];
  }>;
}

// Simple face detection using MediaPipe
export async function detectFaces(video: HTMLVideoElement): Promise<FaceDetectionResult> {
  try {
    // Check if MediaPipe Face Detection is available
    if (!('FaceDetector' in window)) {
      console.warn('Face Detection API not supported; using mock detection');
      return generateMockFaceDetection();
    }

    const faceDetector = new window.FaceDetector({
      maxDetectedFaces: 1,
      fastMode: true
    });
    // Guard: video must be ready with dimensions
    if (
      video.readyState < 2 ||
      video.paused ||
      (video as any).ended ||
      !video.videoWidth ||
      !video.videoHeight
    ) {
      return { faces: [] };
    }

    // Use an offscreen canvas for broader compatibility
    const offscreen = document.createElement('canvas');
    offscreen.width = video.videoWidth;
    offscreen.height = video.videoHeight;
    const offctx = offscreen.getContext('2d');
    if (!offctx) return { faces: [] };
    offctx.drawImage(video, 0, 0, offscreen.width, offscreen.height);

    let faces: DetectedFace[] = [];
    try {
      faces = await faceDetector.detect(offscreen);
    } catch (err: any) {
      if (err?.name === 'InvalidStateError') {
        console.warn('FaceDetector invalid state; skipping frame');
        return { faces: [] };
      }
      throw err;
    }
    
    return {
      faces: faces.map((face: DetectedFace) => ({
        boundingBox: {
          x: face.boundingBox.x,
          y: face.boundingBox.y,
          width: face.boundingBox.width,
          height: face.boundingBox.height
        },
        landmarks: face.landmarks,
        embedding: generateMockEmbedding() // Mock embedding for demo
      }))
    };
  } catch (error) {
    const name = (error as any)?.name;
    if (name === 'InvalidStateError') {
      console.warn('Face detection skipped due to invalid video state');
      return { faces: [] };
    }
    console.warn('Face detection failed:', error);
    return generateMockFaceDetection();
  }
}

// Generate a mock face embedding for demo purposes
function generateMockEmbedding(): number[] {
  // Use a stable seeded PRNG so demo embeddings are consistent across frames/sessions
  const seed = getStableSeed();
  const rand = mulberry32(seed);
  const embedding: number[] = [];
  for (let i = 0; i < 128; i++) {
    embedding.push(rand() * 2 - 1);
  }
  return embedding;
}

// Stable seed stored in localStorage (client-only); falls back to constant on server
function getStableSeed(): number {
  try {
    if (typeof window === 'undefined') return 123456789;
    const key = 'mock-embedding-seed';
    let value = window.localStorage.getItem(key);
    if (!value) {
      value = String(Math.floor(Math.random() * 0x7fffffff));
      window.localStorage.setItem(key, value);
    }
    const parsed = parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : 123456789;
  } catch {
    return 123456789;
  }
}

// Simple deterministic PRNG
function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Generate mock face detection for demo
function generateMockFaceDetection(): FaceDetectionResult {
  return {
    faces: [{
      boundingBox: {
        x: 100,
        y: 100,
        width: 200,
        height: 200
      },
      embedding: generateMockEmbedding()
    }]
  };
}

// Simple cosine similarity util for embeddings
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

// Mock liveness detection
export function detectLiveness(): boolean {
  // For demo purposes, randomly return true after a delay
  return Math.random() > 0.3; // 70% success rate for demo
}

