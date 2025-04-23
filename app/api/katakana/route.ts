import { NextResponse } from "next/server"
import { getKatakana } from "@/lib/data"

export async function GET() {
  try {
    const katakana = await getKatakana()
    return NextResponse.json(katakana)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch katakana data" }, { status: 500 })
  }
}
