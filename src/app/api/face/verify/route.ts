import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { supabase } from "@/lib/supabaseClient";

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
    const threshold = 0.1; // 10% similarity threshold

    // 1) Try Supabase first (expects a table with embeddings)
    try {
      // Assumes a table `face_embeddings` with columns: id (uuid), user_id (uuid/text), embedding (float8[])
      const { data: rows, error } = await supabase
        .from("face_embeddings")
        .select("user_id, embedding");

      let maxSimSupabase = -Infinity;
      let comparedSupabase = 0;
      if (!error && Array.isArray(rows) && rows.length > 0) {
        for (const row of rows as Array<{ user_id: string; embedding: number[] }>) {
          if (!Array.isArray(row.embedding)) continue;
          const sim = cosineSimilarity(embedding, row.embedding);
          if (sim > maxSimSupabase) maxSimSupabase = sim;
          comparedSupabase += 1;
          if (sim >= threshold) {
            return NextResponse.json({ match: true, userId: row.user_id, source: "supabase" });
          }
        }
        console.log("[verify] no supabase match", { comparedSupabase, maxSimSupabase, inputDim: embedding.length, firstRowDim: Array.isArray(rows[0]?.embedding) ? (rows[0] as any).embedding.length : null });
      }
    } catch (e) {
      // Ignore and fall back to local file
      console.warn("Supabase verification failed, falling back to local file:", e);
    }

    // 2) Fallback: local JSON file used by demo registration
    const json = await fs.readFile(FILE, "utf-8").catch(() => "");
    let maxSimFile = -Infinity;
    let comparedFile = 0;
    if (json) {
      const data = JSON.parse(json) as { users: { id: string; embedding: number[] }[] };
      for (const u of data.users) {
        const sim = cosineSimilarity(embedding, u.embedding);
        if (sim > maxSimFile) maxSimFile = sim;
        comparedFile += 1;
        if (sim >= threshold) return NextResponse.json({ match: true, userId: u.id, source: "file" });
      }
      console.log("[verify] no file match", { comparedFile, maxSimFile, inputDim: embedding.length, firstFileDim: data.users[0]?.embedding?.length ?? null });
    }

    return NextResponse.json({ match: false, debug: { inputDim: embedding.length, maxSimSupabase: Number.isFinite(maxSimSupabase) ? maxSimSupabase : null, maxSimFile: Number.isFinite(maxSimFile) ? maxSimFile : null } }, { status: 401 });
  } catch (error) {
    console.error('Verification failed:', error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}


