"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle, Eye, EyeOff } from "lucide-react"
import type { Kanji } from "@/lib/data"
import { Toggle } from "@/components/ui/toggle"

export default function KanjiFlashcardsPage() {
  const [kanji, setKanji] = useState<Kanji[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [jlptLevel, setJlptLevel] = useState("all")
  const [showReading, setShowReading] = useState(true)
  const [showRomanji, setShowRomanji] = useState(true)

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

  const toggleReading = () => {
    setShowReading(!showReading)
  }

  const toggleRomanji = () => {
    setShowRomanji(!showRomanji)
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

  // Get JLPT level color
  const getJlptColor = (level: string) => {
    switch (level) {
      case "N1":
        return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
      case "N2":
        return "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300"
      case "N3":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300"
      case "N4":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
      case "N5":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

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

      <div className="max-w-md mx-auto mb-4">
        <div className="flex justify-center gap-2 mb-4">
          <Toggle
            pressed={showReading}
            onPressedChange={toggleReading}
            aria-label="Toggle reading visibility"
            className="flex gap-1 items-center"
          >
            {showReading ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            Reading
          </Toggle>
          <Toggle
            pressed={showRomanji}
            onPressedChange={toggleRomanji}
            aria-label="Toggle romanji visibility"
            className="flex gap-1 items-center"
          >
            {showRomanji ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            Romanji
          </Toggle>
        </div>

        <Card
          className="h-[400px] cursor-pointer transition-all duration-500 rounded-xl border shadow-sm"
          onClick={() => setFlipped(!flipped)}
        >
          <CardContent className="p-0 h-full">
            {!flipped ? (
              // Front of card - not flipped
              <div className="h-full flex flex-col">
                {/* Kanji character and JLPT level */}
                <div className="flex-none flex flex-col items-center justify-center pt-8 pb-4">
                  {/* JLPT Level Badge */}
                  {/* Kanji Character */}
                  <div className="text-7xl font-bold">{currentCard.character}</div>
                      {/* JLPT Level Badge */}
                    <div className="mt-2 mx-auto">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-sm font-medium ${getJlptColor(
                            currentCard.jlpt_level,
                          )}`}
                        >
                          {currentCard.jlpt_level}
                        </span>
                      </div>
                    </div>

                {/* Scrollable readings section */}
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                  {/* ON readings */}
                  {showReading && currentCard.on_reading && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium mb-2">ON Reading:</h3>
                      <div className="space-y-2">
                        {currentCard.on_reading.split(";").map((reading, i) => (
                          <div key={`on-${i}`} className="pl-2">
                            <span className="text-lg">{reading.trim()}</span>
                            {showRomanji && onReadings[i] && (
                              <span className="text-sm text-muted-foreground ml-2">({onReadings[i]})</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* KUN readings */}
                  {showReading && currentCard.kun_reading && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">KUN Reading:</h3>
                      <div className="space-y-2">
                        {currentCard.kun_reading.split(";").map((reading, i) => (
                          <div key={`kun-${i}`} className="pl-2">
                            <span className="text-lg">{reading.trim()}</span>
                            {showRomanji && kunReadings[i] && (
                              <span className="text-sm text-muted-foreground ml-2">({kunReadings[i]})</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Back of card - flipped
              <div className="h-full flex flex-col">
                {/* Kanji character and JLPT level */}
                <div className="flex-none flex flex-col items-center justify-center pt-8 pb-4">
                  {/* Kanji Character */}
                  <div className="text-5xl font-bold">{currentCard.character}</div>
                </div>

                {/* Scrollable content section */}
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                  {/* Meaning */}
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Meaning:</h3>
                    <p className="pl-2">{currentCard.keyword || currentCard.meaning}</p>
                  </div>

                  {/* Components */}
                  {currentCard.components && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Components:</h3>
                      <p className="pl-2">{formatReading(currentCard.components)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground mt-4">
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
