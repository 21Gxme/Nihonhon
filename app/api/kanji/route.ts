import { NextResponse } from "next/server"
import { getKanji } from "@/lib/data"

export async function GET() {
  try {
    const kanji = await getKanji()
    return NextResponse.json(kanji)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch kanji data" }, { status: 500 })
  }
}
