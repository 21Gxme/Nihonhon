import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Kanji } from "@/lib/data"

interface KanjiDetailCardProps {
  kanji: Kanji
  showJlptLevel?: boolean
}

export function KanjiDetailCard({ kanji, showJlptLevel = true }: KanjiDetailCardProps) {
  // Format readings to use commas instead of semicolons
  const formatReading = (reading: string) => {
    if (!reading) return ""

    return reading
      .split(";")
      .map((part) => part.trim())
      .join(", ")
  }

  // Parse and format romaji into ON and KUN groups if available
  const formatRomaji = () => {
    if (!kanji.romaji) return null

    const onReadings: string[] = []
    const kunReadings: string[] = []

    // Split by semicolons and process each part
    const parts = kanji.romaji.split(";").map((part) => part.trim())

    parts.forEach((part) => {
      // Simple string manipulation to remove the labels
      let reading = part
      if (part.includes("(ON)")) {
        reading = part.substring(0, part.indexOf("(ON)")).trim()
        onReadings.push(reading)
      } else if (part.includes("(KUN)")) {
        reading = part.substring(0, part.indexOf("(KUN)")).trim()
        kunReadings.push(reading)
      }
    })

    return (
      <div className="space-y-2">
        {onReadings.length > 0 && (
          <div>
            <span className="font-medium">ON:</span> {onReadings.join(", ")}
          </div>
        )}
        {kunReadings.length > 0 && (
          <div>
            <span className="font-medium">KUN:</span> {kunReadings.join(", ")}
          </div>
        )}
      </div>
    )
  }

  // Format components to use commas instead of semicolons
  const formatComponents = () => {
    if (!kanji.components) return null

    // Replace semicolons with commas
    return kanji.components
      .split(";")
      .map((comp) => comp.trim())
      .join(", ")
  }

  return (
    <Card className="overflow-hidden bg-muted/20">
      <CardHeader className="p-4 pb-2 text-center">
        <CardTitle className="text-6xl mb-2">{kanji.character}</CardTitle>
        <p className="text-xl font-medium">{kanji.keyword || kanji.meaning}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-sm">On Reading:</h4>
            <p>{formatReading(kanji.on_reading)}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm">Kun Reading:</h4>
            <p>{formatReading(kanji.kun_reading)}</p>
          </div>
        </div>

        {kanji.romaji && (
          <div>
            <h4 className="font-medium text-sm">Romaji:</h4>
            {formatRomaji()}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {kanji.stroke_count && (
            <div>
              <h4 className="font-bold text-sm inline">Strokes:</h4> <p className="inline">{kanji.stroke_count}</p>
            </div>
          )}
          {showJlptLevel && kanji.jlpt_level && (
            <div>
              <h4 className="font-bold text-sm inline">JLPT Level:</h4> <p className="inline">{kanji.jlpt_level}</p>
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  )
}
