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
      throw new Error('Face Detection API not supported');
    }

    const faceDetector = new window.FaceDetector({
      maxDetectedFaces: 1,
      fastMode: true
    });

    const faces = await faceDetector.detect(video);
    
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
    console.error('Face detection failed:', error);
    // Fallback to mock detection for demo
    return generateMockFaceDetection();
  }
}

// Generate a mock face embedding for demo purposes
function generateMockEmbedding(): number[] {
  const embedding = [];
  for (let i = 0; i < 128; i++) {
    embedding.push(Math.random() * 2 - 1); // Random values between -1 and 1
  }
  return embedding;
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

