"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle, BookOpen, GraduationCap, Eye, EyeOff } from "lucide-react"
import type { Vocabulary } from "@/lib/data"
import { Toggle } from "@/components/ui/toggle"

export default function VocabularyFlashcardsPage() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [jlptLevel, setJlptLevel] = useState("all")
  const [showRomanji, setShowRomanji] = useState(true)
  const [showKana, setShowKana] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/vocabulary")
        const data = await response.json()
        setVocabulary(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching vocabulary data:", error)
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

  const filteredVocabulary =
    jlptLevel === "all" ? vocabulary : vocabulary.filter((item) => item.jlpt_level === jlptLevel)

  const currentCard = filteredVocabulary[currentIndex]

  // Format string to use commas instead of semicolons
  const formatWithCommas = (text: string) => {
    if (!text) return ""
    return text
      .split(";")
      .map((part) => part.trim())
      .join(" / ")
  }

  const handleNext = () => {
    setFlipped(false)
    setCurrentIndex((prevIndex) => (prevIndex === filteredVocabulary.length - 1 ? 0 : prevIndex + 1))
  }

  const handlePrevious = () => {
    setFlipped(false)
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? filteredVocabulary.length - 1 : prevIndex - 1))
  }

  const handleShuffle = () => {
    setFlipped(false)
    const randomIndex = Math.floor(Math.random() * filteredVocabulary.length)
    setCurrentIndex(randomIndex)
  }

  const handleReset = () => {
    setFlipped(false)
    setCurrentIndex(0)
  }

  const toggleRomanji = () => {
    setShowRomanji(!showRomanji)
  }

  const toggleKana = () => {
    setShowKana(!showKana)
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
        <h1 className="text-3xl font-bold tracking-tight mb-4">Vocabulary Flashcards</h1>
        <p className="text-lg text-muted-foreground mb-6">Click on the card to flip it and see the answer</p>

        <Tabs defaultValue="all" value={jlptLevel} onValueChange={setJlptLevel} className="w-full max-w-md mx-auto">
          <TabsList className="flex flex-wrap justify-center gap-1">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="N5">JLPT N5</TabsTrigger>
            <TabsTrigger value="N4">JLPT N4</TabsTrigger>
            <TabsTrigger value="N3">JLPT N3</TabsTrigger>
            <TabsTrigger value="N2">JLPT N2</TabsTrigger>
            <TabsTrigger value="N1">JLPT N1</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="max-w-md mx-auto mb-4">
        <div className="flex justify-center gap-2 mb-4">
          <Toggle
            pressed={showKana}
            onPressedChange={toggleKana}
            aria-label="Toggle hiragana visibility"
            className="flex gap-1 items-center"
          >
            {showKana ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            Hiragana
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
          className="h-[400px] cursor-pointer transition-all duration-500 overflow-hidden rounded-xl border shadow-sm"
          onClick={() => setFlipped(!flipped)}
        >
          <CardContent className="p-0 h-full flex flex-col">
            {/* Top section with word, kana, and romanji - same in both states */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 pt-12">
              <div className="text-5xl font-bold mb-4">{currentCard.word}</div>

              {/* Conditionally show kana based on showKana state */}
              {showKana && <div className="text-2xl mb-2">{currentCard.kana}</div>}

              {/* Conditionally show romanji based on showRomanji state */}
              {showRomanji && currentCard.romanji && (
                <div className="text-xl text-muted-foreground">{formatWithCommas(currentCard.romanji)}</div>
              )}
            </div>

            {/* Bottom section - shows meaning when flipped */}
            <div className={`flex-1 border-t transition-all duration-300 ${flipped ? "opacity-100" : "opacity-0"}`}>
              {flipped && (
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <BookOpen className="h-6 w-6 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Meaning</h3>
                      <p className="text-xl font-medium">{currentCard.meaning}</p>
                    </div>
                  </div>

                  {jlptLevel === "all" && (
                    <div className="flex items-start gap-4 mt-4">
                      <GraduationCap className="h-6 w-6 text-muted-foreground mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">JLPT Level</h3>
                        <div
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getJlptColor(
                            currentCard.jlpt_level,
                          )}`}
                        >
                          {currentCard.jlpt_level}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground mt-4">
          Card {currentIndex + 1} of {filteredVocabulary.length}
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
