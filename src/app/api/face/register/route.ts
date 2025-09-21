import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "embeddings.json");

async function ensureDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {}
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const embedding: number[] | undefined = body?.embedding;
    if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
      return NextResponse.json({ error: "Invalid embedding" }, { status: 400 });
    }
    await ensureDir();
    await fs.writeFile(FILE, JSON.stringify({ users: [{ id: "demo-user", embedding }] }, null, 2), "utf-8");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to save embedding:', error);
    return NextResponse.json({ error: "Failed to save embedding" }, { status: 500 });
  }
}


