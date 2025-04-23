import { NextResponse } from "next/server"
import { getHiragana } from "@/lib/data"

export async function GET() {
  try {
    const hiragana = await getHiragana()
    return NextResponse.json(hiragana)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch hiragana data" }, { status: 500 })
  }
}
