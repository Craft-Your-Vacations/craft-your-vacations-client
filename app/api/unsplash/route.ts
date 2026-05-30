import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");
  if (!query)
    return NextResponse.json({ error: "query required" }, { status: 400 });

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey)
    return NextResponse.json(
      { error: "Unsplash not configured" },
      { status: 500 }
    );

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&orientation=landscape`;
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${accessKey}` },
    next: { revalidate: 86400 }, // cache 24 hours
  });

  if (!res.ok)
    return NextResponse.json({ error: "Unsplash error" }, { status: res.status });

  const data = await res.json();
  return NextResponse.json(data.results);
}
