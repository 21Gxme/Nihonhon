"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle } from "lucide-react"
import type { Kanji } from "@/lib/data"

export default function KanjiFlashcardsPage() {
  const [kanji, setKanji] = useState<Kanji[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [jlptLevel, setJlptLevel] = useState("all")

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/kanji")
        const data = await response.json()
        setKanji(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching kanji data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    // Reset state when changing JLPT level
    setCurrentIndex(0)
    setFlipped(false)
  }, [jlptLevel])

  const filteredKanji = jlptLevel === "all" ? kanji : kanji.filter((item) => item.jlpt_level === jlptLevel)

  const currentCard = filteredKanji[currentIndex]

  // Format readings to use commas instead of semicolons
  const formatReading = (reading: string) => {
    if (!reading) return ""
    return reading
      .split(";")
      .map((part) => part.trim())
      .join(", ")
  }

  // Parse romaji into ON and KUN groups
  const parseRomaji = (romaji: string) => {
    if (!romaji) return { onReadings: [], kunReadings: [] }

    const onReadings: string[] = []
    const kunReadings: string[] = []

    // Split by semicolons and process each part
    const parts = romaji.split(";").map((part) => part.trim())

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

  const handleNext = () => {
    setFlipped(false)
    setCurrentIndex((prevIndex) => (prevIndex === filteredKanji.length - 1 ? 0 : prevIndex + 1))
  }

  const handlePrevious = () => {
    setFlipped(false)
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? filteredKanji.length - 1 : prevIndex - 1))
  }

  const handleShuffle = () => {
    setFlipped(false)
    const randomIndex = Math.floor(Math.random() * filteredKanji.length)
    setCurrentIndex(randomIndex)
  }

  const handleReset = () => {
    setFlipped(false)
    setCurrentIndex(0)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading flashcards...</p>
      </div>
    )
  }

  if (!currentCard) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>No flashcards available for this selection.</p>
      </div>
    )
  }

  const { onReadings, kunReadings } = parseRomaji(currentCard.romaji || "")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Kanji Flashcards</h1>
        <p className="text-lg text-muted-foreground mb-6">Click on the card to flip it and see the answer</p>

        <Tabs defaultValue="all" value={jlptLevel} onValueChange={setJlptLevel} className="w-full max-w-md mx-auto">
          <TabsList className="flex flex-wrap justify-center gap-1">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="N5">N5</TabsTrigger>
            <TabsTrigger value="N4">N4</TabsTrigger>
            <TabsTrigger value="N3">N3</TabsTrigger>
            <TabsTrigger value="N2">N2</TabsTrigger>
            <TabsTrigger value="N1">N1</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="max-w-md mx-auto mb-8">
        <Card
          className="h-[400px] cursor-pointer transition-all duration-500 overflow-auto"
          onClick={() => setFlipped(!flipped)}
        >
          <CardContent className="flex items-center justify-center h-full p-6">
            <div className="text-center w-full">
              {!flipped ? (
                <div className="text-7xl font-bold flex items-center justify-center h-full">
                  {currentCard.character}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-6xl font-bold mb-4">{currentCard.character}</div>
                  <div className="text-2xl font-medium mb-6">{currentCard.keyword || currentCard.meaning}</div>

                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                      <h4 className="font-medium text-sm">On Reading:</h4>
                      <p>{formatReading(currentCard.on_reading)}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm">Kun Reading:</h4>
                      <p>{formatReading(currentCard.kun_reading)}</p>
                    </div>
                  </div>

                  {(onReadings.length > 0 || kunReadings.length > 0) && (
                    <div className="text-left">
                      <h4 className="font-medium text-sm">Romaji:</h4>
                      <div className="pl-2 space-y-1">
                        {onReadings.length > 0 && (
                          <p>
                            <span className="font-medium">ON:</span> {onReadings.join(", ")}
                          </p>
                        )}
                        {kunReadings.length > 0 && (
                          <p>
                            <span className="font-medium">KUN:</span> {kunReadings.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-left">
                    {jlptLevel === "all" && currentCard.jlpt_level && (
                      <div>
                        <h4 className="font-medium text-sm">JLPT Level:</h4>
                        <p>{currentCard.jlpt_level}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground mt-2">
          Card {currentIndex + 1} of {filteredKanji.length}
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" size="icon" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleShuffle}>
              <Shuffle className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="outline" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
