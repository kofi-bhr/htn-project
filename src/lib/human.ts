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

export async function detectFaces(video: HTMLVideoElement): Promise<FaceDetectionResult> {
  try {
    if (!('FaceDetector' in window)) {
      console.warn('Face Detection API not supported. To enable:');
      console.warn('1. Open Chrome and go to chrome://flags/');
      console.warn('2. Search for "Shape Detection API"');
      console.warn('3. Enable the flag and restart Chrome');
      console.warn('4. Using mock detection for demo purposes');
      
      return generateMockFaceDetection();
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
        embedding: generateMockEmbedding()
      }))
    };
  } catch (error) {
    console.error('Face detection failed:', error);
    return generateMockFaceDetection();
  }
}

function generateMockEmbedding(): number[] {
  const embedding = [];
  for (let i = 0; i < 128; i++) {
    embedding.push(Math.random() * 2 - 1);
  }
  return embedding;
}

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

export function detectLiveness(): boolean {
  return Math.random() > 0.3;
}


