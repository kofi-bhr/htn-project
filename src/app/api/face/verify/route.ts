import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "embeddings.json");

function cosineSimilarity(a: number[], b: number[]): number {
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const embedding: number[] | undefined = body?.embedding;
    if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
      return NextResponse.json({ error: "Invalid embedding" }, { status: 400 });
    }
    const json = await fs.readFile(FILE, "utf-8").catch(() => "");
    if (!json) return NextResponse.json({ match: false }, { status: 401 });
    const data = JSON.parse(json) as { users: { id: string; embedding: number[] }[] };
    const threshold = 0.9; // demo threshold, adjust as needed
    for (const u of data.users) {
      const sim = cosineSimilarity(embedding, u.embedding);
      if (sim >= threshold) return NextResponse.json({ match: true, userId: u.id });
    }
    return NextResponse.json({ match: false }, { status: 401 });
  } catch (error) {
    console.error('Verification failed:', error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}


