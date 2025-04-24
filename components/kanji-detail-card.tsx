"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Brush } from "lucide-react"
import type { Kanji } from "@/lib/data"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"

interface KanjiDetailCardProps {
  kanji: Kanji
  showJlptLevel?: boolean
}

export function KanjiDetailCard({ kanji, showJlptLevel = true }: KanjiDetailCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  // Format readings to use commas instead of semicolons
  const formatReading = (reading: string) => {
    if (!reading) return ""
    return reading
      .split(";")
      .map((part) => part.trim())
      .join(", ")
  }

  // Parse romaji into ON and KUN groups
  const parseRomaji = () => {
    if (!kanji.romaji) return { onReadings: [], kunReadings: [] }

    const onReadings: string[] = []
    const kunReadings: string[] = []

    // Split by semicolons and process each part
    const parts = kanji.romaji.split(";").map((part) => part.trim())

    parts.forEach((part) => {
      // Extract the reading without the (ON) or (KUN) label
      if (part.includes("(ON)")) {
        const reading = part.substring(0, part.indexOf("(ON)")).trim()
        onReadings.push(reading)
      } else if (part.includes("(KUN)")) {
        const reading = part.substring(0, part.indexOf("(KUN)")).trim()
        kunReadings.push(reading)
      }
    })

    return { onReadings, kunReadings }
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

  const { onReadings, kunReadings } = parseRomaji()

  // Split readings into arrays
  const onReadingArray = kanji.on_reading ? kanji.on_reading.split(";").map((r) => r.trim()) : []
  const kunReadingArray = kanji.kun_reading ? kanji.kun_reading.split(";").map((r) => r.trim()) : []

  return (
    <>
      <div className="h-full w-full">
        <Card
          className="overflow-hidden h-full relative group cursor-pointer border bg-background shadow-sm hover:shadow-md transition-shadow"
          onClick={() => setDialogOpen(true)}
        >
          <CardContent className="p-0 h-full flex flex-col">
            {/* Top section with kanji and JLPT level */}
            <div className="flex-none text-center pt-6 pb-3 px-4 relative">
              {showJlptLevel && kanji.jlpt_level && (
                <Badge variant="outline" className="absolute top-2 left-2">
                  {kanji.jlpt_level}
                </Badge>
              )}

              <div className="text-7xl font-bold mb-2">{kanji.character}</div>

              <p className="text-xl font-medium line-clamp-1">{kanji.keyword || kanji.meaning}</p>
            </div>

            {/* Middle section with readings preview */}
            <div className="flex-1 px-4 pb-4">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* ON Reading preview */}
                {kanji.on_reading && (
                  <div className="border rounded-lg p-2 text-center">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">ON</h4>
                    <p className="text-base font-medium">
                      {onReadingArray[0]}
                      {onReadingArray.length > 1 && (
                        <span className="text-xs text-muted-foreground ml-1">+{onReadingArray.length - 1}</span>
                      )}
                    </p>
                  </div>
                )}

                {/* KUN Reading preview */}
                {kanji.kun_reading && (
                  <div className="border rounded-lg p-2 text-center">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">KUN</h4>
                    <p className="text-base font-medium">
                      {kunReadingArray[0]}
                      {kunReadingArray.length > 1 && (
                        <span className="text-xs text-muted-foreground ml-1">+{kunReadingArray.length - 1}</span>
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom section with stroke count and view details */}
              <div className="flex items-center justify-between">
                {kanji.stroke_count && (
                  <div className="flex items-center">
                    <Brush className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm">{kanji.stroke_count} strokes</span>
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground group-hover:text-foreground ml-auto"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDialogOpen(true)
                  }}
                >
                  <span className="flex items-center">
                    Details <ExternalLink className="ml-1 h-3 w-3" />
                  </span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full details dialog with scrollable content */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0">
          <div className="flex flex-col h-full max-h-[90vh]">
            {/* Fixed header with kanji and meaning */}
            <DialogHeader className="p-6 pb-4 border-b">
              <div className="flex items-center gap-4">
                <div className="text-6xl font-bold">{kanji.character}</div>
                <div>
                  <h2 className="text-2xl font-bold">{kanji.keyword || kanji.meaning}</h2>
                  {kanji.stroke_count && (
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <Brush className="h-4 w-4 mr-1" /> {kanji.stroke_count} strokes
                    </p>
                  )}
                </div>
              </div>
            </DialogHeader>

            {/* Scrollable content with all sections */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-8">
                {/* Meaning Section */}
                <section>
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b">Meaning</h3>
                  <p className="text-lg">{kanji.keyword || kanji.meaning}</p>
                </section>

                {/* Readings Section */}
                <section>
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b">Readings</h3>

                  {/* ON Reading */}
                  {kanji.on_reading && (
                    <div className="mb-6 border rounded-lg p-4">
                      <h4 className="text-lg font-medium mb-3 flex items-center">
                        <span>ON</span>
                        <span className="text-sm ml-2 text-muted-foreground">(Chinese Reading)</span>
                      </h4>
                      <div className="space-y-3 pl-2">
                        {onReadingArray.map((reading, i) => (
                          <div key={`on-${i}`} className="flex items-center">
                            <span className="text-lg font-medium">{reading}</span>
                            {onReadings[i] && (
                              <span className="text-sm text-muted-foreground ml-2 italic">({onReadings[i]})</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* KUN Reading */}
                  {kanji.kun_reading && (
                    <div className="border rounded-lg p-4">
                      <h4 className="text-lg font-medium mb-3 flex items-center">
                        <span>KUN</span>
                        <span className="text-sm ml-2 text-muted-foreground">(Japanese Reading)</span>
                      </h4>
                      <div className="space-y-3 pl-2">
                        {kunReadingArray.map((reading, i) => (
                          <div key={`kun-${i}`} className="flex items-center">
                            <span className="text-lg font-medium">{reading}</span>
                            {kunReadings[i] && (
                              <span className="text-sm text-muted-foreground ml-2 italic">({kunReadings[i]})</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                {/* Components Section */}
                {kanji.components && (
                  <section>
                    <h3 className="text-xl font-semibold mb-4 pb-2 border-b">Components</h3>
                    <div className="border rounded-lg p-4">
                      <div className="flex flex-wrap gap-2">
                        {kanji.components.split(";").map((component, index) => (
                          <Badge key={index} variant="outline" className="text-base py-1 px-3">
                            {component.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* Additional Info Section */}
                <section>
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b">Additional Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {kanji.stroke_count && (
                      <div className="border rounded-lg p-4">
                        <h4 className="text-lg font-medium mb-3 flex items-center">
                          <Brush className="h-5 w-5 mr-2" />
                          Strokes
                        </h4>
                        <p className="text-3xl font-bold text-center">{kanji.stroke_count}</p>
                      </div>
                    )}

                    {kanji.jlpt_level && (
                      <div className="border rounded-lg p-4">
                        <h4 className="text-lg font-medium mb-3">JLPT Level</h4>
                        <div className="text-center">
                          <Badge variant="outline" className="text-lg py-1 px-4">
                            {kanji.jlpt_level}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
