import fs from "fs"
import path from "path"
import { parse } from "csv-parse/sync"

export type HiraganaKatakana = {
  character: string
  romaji: string
  example: string
  type: "hiragana" | "katakana"
  jlpt_level: string
  meaning: string
}

export type Kanji = {
  character: string
  id?: number
  keyword?: string
  components?: string
  on_reading: string
  kun_reading: string
  stroke_count?: number
  jlpt_level: string
  romaji?: string
  meaning?: string // Keep for backward compatibility
  example?: string // Keep for backward compatibility
  type: "kanji"
}

export type Vocabulary = {
  word: string
  kana: string
  romaji: string
  meaning: string
  part_of_speech: string
  example: string
  example_meaning: string
  jlpt_level: string
}

export type JapaneseItem = HiraganaKatakana | Kanji | Vocabulary

export async function getHiragana(): Promise<HiraganaKatakana[]> {
  try {
    const filePath = path.join(process.cwd(), "data", "hiragana.csv")
    const fileContent = fs.readFileSync(filePath, "utf8")

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    })

    return records.map((record: any) => ({
      ...record,
      type: "hiragana",
    }))
  } catch (error) {
    console.error("Error loading hiragana data:", error)
    return []
  }
}

export async function getKatakana(): Promise<HiraganaKatakana[]> {
  try {
    const filePath = path.join(process.cwd(), "data", "katakana.csv")
    const fileContent = fs.readFileSync(filePath, "utf8")

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    })

    return records.map((record: any) => ({
      ...record,
      type: "katakana",
    }))
  } catch (error) {
    console.error("Error loading katakana data:", error)
    return []
  }
}

export async function getKanji(): Promise<Kanji[]> {
  try {
    const filePath = path.join(process.cwd(), "data", "kanji.csv")
    const fileContent = fs.readFileSync(filePath, "utf8")

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
    })

    return records.map((record: any) => {
      // Handle the new CSV format
      return {
        character: record.kanji || record.character || "",
        id: record.id ? Number.parseInt(record.id) : undefined,
        keyword: record.keyword || record.meaning || "",
        components: record.components || "",
        on_reading: record.on_reading || "",
        kun_reading: record.kun_reading || "",
        stroke_count: record.stroke_count ? Number.parseInt(record.stroke_count) : undefined,
        jlpt_level: record.jlpt || record.jlpt_level || "",
        romaji: record.romaji || "",
        meaning: record.keyword || record.meaning || "", // For backward compatibility
        example: record.example || "",
        type: "kanji",
      }
    })
  } catch (error) {
    console.error("Error loading kanji data:", error)
    return []
  }
}

export async function getVocabulary(): Promise<Vocabulary[]> {
  try {
    const filePath = path.join(process.cwd(), "data", "vocabulary.csv")
    const fileContent = fs.readFileSync(filePath, "utf8")

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      // Set relax_column_count to true to handle inconsistent column counts
      relax_column_count: true,
    })

    return records.map((record: any) => {
      // Ensure all required fields exist with defaults if missing
      return {
        word: record.word || "",
        kana: record.kana || "",
        romaji: record.romaji || "",
        meaning: record.meaning || "",
        part_of_speech: record.part_of_speech || "",
        example: record.example || "",
        example_meaning: record.example_meaning || "",
        jlpt_level: record.jlpt_level || "N5",
      }
    })
  } catch (error) {
    console.error("Error loading vocabulary data:", error)
    return []
  }
}

export async function getAllData(): Promise<{
  hiragana: HiraganaKatakana[]
  katakana: HiraganaKatakana[]
  kanji: Kanji[]
  vocabulary: Vocabulary[]
}> {
  const hiragana = await getHiragana()
  const katakana = await getKatakana()
  const kanji = await getKanji()
  const vocabulary = await getVocabulary()

  return {
    hiragana,
    katakana,
    kanji,
    vocabulary,
  }
}

export function filterByJlptLevel<T extends { jlpt_level: string }>(items: T[], level: string): T[] {
  return items.filter((item) => item.jlpt_level === level)
}
