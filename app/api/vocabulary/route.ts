import { NextResponse } from "next/server"
import { getVocabulary } from "@/lib/data"

export async function GET() {
  try {
    const vocabulary = await getVocabulary()
    return NextResponse.json(vocabulary)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vocabulary data" }, { status: 500 })
  }
}
