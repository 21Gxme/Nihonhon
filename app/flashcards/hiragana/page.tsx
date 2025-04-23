"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle } from "lucide-react"
import type { HiraganaKatakana } from "@/lib/data"

export default function HiraganaFlashcardsPage() {
  const [hiragana, setHiragana] = useState<HiraganaKatakana[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [jlptLevel, setJlptLevel] = useState("all")

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/hiragana")
        const data = await response.json()
        setHiragana(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching hiragana data:", error)
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

  const filteredHiragana = jlptLevel === "all" ? hiragana : hiragana.filter((item) => item.jlpt_level === jlptLevel)

  const currentCard = filteredHiragana[currentIndex]

  const handleNext = () => {
    setFlipped(false)
    setCurrentIndex((prevIndex) => (prevIndex === filteredHiragana.length - 1 ? 0 : prevIndex + 1))
  }

  const handlePrevious = () => {
    setFlipped(false)
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? filteredHiragana.length - 1 : prevIndex - 1))
  }

  const handleShuffle = () => {
    setFlipped(false)
    const randomIndex = Math.floor(Math.random() * filteredHiragana.length)
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
        <h1 className="text-3xl font-bold tracking-tight mb-4">Hiragana Flashcards</h1>
        <p className="text-lg text-muted-foreground mb-6">Click on the card to flip it and see the answer</p>
      </div>

      <div className="max-w-md mx-auto mb-8">
        <Card
          className={`h-64 cursor-pointer transition-all duration-500 ${flipped ? "bg-muted" : ""}`}
          onClick={() => setFlipped(!flipped)}
        >
          <CardContent className="flex items-center justify-center h-full p-6">
            <div className="text-center">
              {!flipped ? (
                <div className="text-7xl font-bold">{currentCard.character}</div>
              ) : (
                <div>
                  <p className="text-2xl font-medium mb-4">{currentCard.romaji}</p>
                  {currentCard.example && <p className="text-lg">Example: {currentCard.example}</p>}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground mt-2">
          Card {currentIndex + 1} of {filteredHiragana.length}
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
