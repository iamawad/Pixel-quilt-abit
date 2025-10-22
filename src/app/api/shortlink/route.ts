import { NextRequest, NextResponse } from "next/server";
const store = new Map<string, any>();
export async function POST(req: NextRequest) {
  const body = await req.json();
  const id = Math.random().toString(36).slice(2,8);
  store.set(id, body);
  return NextResponse.json({ id });
}
export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id || !store.has(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(store.get(id));
}
