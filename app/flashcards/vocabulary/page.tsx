"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle } from "lucide-react"
import type { Vocabulary } from "@/lib/data"

export default function VocabularyFlashcardsPage() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [jlptLevel, setJlptLevel] = useState("all")

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Vocabulary Flashcards</h1>
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
          className={`h-64 cursor-pointer transition-all duration-500 ${flipped ? "bg-muted" : ""}`}
          onClick={() => setFlipped(!flipped)}
        >
          <CardContent className="flex items-center justify-center h-full p-6">
            <div className="text-center">
              {!flipped ? (
                <div>
                  <div className="text-4xl font-bold mb-2">{currentCard.word}</div>
                  <div className="text-xl">{currentCard.kana}</div>
                </div>
              ) : (
                <div>
                  <p className="text-2xl font-medium mb-2">{currentCard.meaning}</p>
                  {currentCard.romaji && <p className="text-lg mb-2">{currentCard.romaji}</p>}
                  {currentCard.part_of_speech && (
                    <p className="text-sm mb-2">Part of speech: {currentCard.part_of_speech}</p>
                  )}
                  {jlptLevel === "all" && <p className="text-sm mb-2">JLPT Level: {currentCard.jlpt_level}</p>}
                  {currentCard.example && (
                    <div className="mt-2 text-sm">
                      <p>{currentCard.example}</p>
                      {currentCard.example_meaning && <p>{currentCard.example_meaning}</p>}
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground mt-2">
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
