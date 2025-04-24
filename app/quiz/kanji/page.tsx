"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toggle } from "@/components/ui/toggle"
import type { Kanji } from "@/lib/data"
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react"

export default function KanjiQuizPage() {
  const [kanji, setKanji] = useState<Kanji[]>([])
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [quizQuestions, setQuizQuestions] = useState<
    {
      character: string
      options: string[]
      correctAnswer: string
      questionType: "meaning" | "reading"
      onReadings: string[]
      kunReadings: string[]
      jlptLevel: string
    }[]
  >([])
  const [quizType, setQuizType] = useState<"meaning" | "reading">("meaning")
  const [jlptLevel, setJlptLevel] = useState<string>("all")
  const [showReading, setShowReading] = useState(true)
  const [showRomanji, setShowRomanji] = useState(true)

  // Format string to use commas instead of semicolons
  const formatWithCommas = (text: string) => {
    if (!text) return ""
    return text
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

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/kanji")
        const data = await response.json()
        setKanji(data)

        // Generate quiz questions
        if (data.length > 0) {
          const questions = generateQuizQuestions(data, quizType, jlptLevel)
          setQuizQuestions(questions)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching kanji data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [quizType, jlptLevel])

  const generateQuizQuestions = (data: Kanji[], type: "meaning" | "reading", level: string) => {
    // Filter by JLPT level if needed
    const filteredData = level === "all" ? data : data.filter((item) => item.jlpt_level === level)

    // Shuffle the data
    const shuffledData = [...filteredData].sort(() => Math.random() - 0.5)

    // Take the first 10 items for the quiz (or less if not enough data)
    const quizItems = shuffledData.slice(0, Math.min(10, shuffledData.length))

    return quizItems.map((item) => {
      // Parse romaji into ON and KUN readings
      const { onReadings, kunReadings } = parseRomaji(item.romaji || "")

      if (type === "meaning") {
        // Format meaning with commas instead of semicolons
        const meaning = formatWithCommas(item.keyword || item.meaning || "")

        // Get 3 random incorrect options for meaning
        const incorrectOptions = shuffledData
          .filter((k) => (k.keyword || k.meaning) !== (item.keyword || item.meaning))
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((k) => formatWithCommas(k.keyword || k.meaning || ""))

        // Combine correct and incorrect options and shuffle
        const options = [meaning, ...incorrectOptions].sort(() => Math.random() - 0.5)

        return {
          character: item.character,
          options,
          correctAnswer: meaning,
          questionType: "meaning" as const,
          onReadings,
          kunReadings,
          jlptLevel: item.jlpt_level,
        }
      } else {
        // Just use the on_reading with commas for reading quiz
        const formattedReading = formatWithCommas(item.on_reading)

        // Get 3 random incorrect options for reading
        const incorrectOptions = shuffledData
          .filter((k) => k.on_reading !== item.on_reading)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((k) => formatWithCommas(k.on_reading))

        // Combine correct and incorrect options and shuffle
        const options = [formattedReading, ...incorrectOptions].sort(() => Math.random() - 0.5)

        return {
          character: item.character,
          options,
          correctAnswer: formattedReading,
          questionType: "reading" as const,
          onReadings,
          kunReadings,
          jlptLevel: item.jlpt_level,
        }
      }
    })
  }

  const handleAnswerClick = (answer: string) => {
    if (selectedAnswer !== null) return // Prevent multiple selections

    const currentQuiz = quizQuestions[currentQuestion]
    const correct = answer === currentQuiz.correctAnswer

    setSelectedAnswer(answer)
    setIsCorrect(correct)

    if (correct) {
      setScore(score + 1)
    }

    // Move to next question after a delay
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setIsCorrect(null)
      } else {
        setShowResult(true)
      }
    }, 1500)
  }

  const restartQuiz = () => {
    // Generate new questions
    if (kanji.length > 0) {
      const questions = generateQuizQuestions(kanji, quizType, jlptLevel)
      setQuizQuestions(questions)
    }

    setCurrentQuestion(0)
    setScore(0)
    setShowResult(false)
    setSelectedAnswer(null)
    setIsCorrect(null)
  }

  const handleQuizTypeChange = (value: string) => {
    setQuizType(value as "meaning" | "reading")
    setCurrentQuestion(0)
    setScore(0)
    setShowResult(false)
    setSelectedAnswer(null)
    setIsCorrect(null)
  }

  const handleJlptLevelChange = (value: string) => {
    setJlptLevel(value)
    setCurrentQuestion(0)
    setScore(0)
    setShowResult(false)
    setSelectedAnswer(null)
    setIsCorrect(null)
  }

  const toggleReading = () => {
    setShowReading(!showReading)
  }

  const toggleRomanji = () => {
    setShowRomanji(!showRomanji)
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
    }
  }

  // Format Japanese reading with smaller romanji in parentheses
  const formatReadingWithRomanji = (japanese: string, romanji: string) => {
    if (!japanese || !romanji) return japanese || romanji || ""
    return (
      <span>
        {japanese} <span className="text-sm text-muted-foreground">({romanji})</span>
      </span>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading quiz...</p>
      </div>
    )
  }

  if (quizQuestions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>No quiz questions available for the selected JLPT level. Please try another level.</p>
      </div>
    )
  }

  if (showResult) {
    return (
      <div className="container max-w-md mx-auto px-4 py-8">
        <Card className="overflow-hidden">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
            <div className="text-4xl font-bold mb-4">
              {score} / {quizQuestions.length}
            </div>
            <Progress value={(score / quizQuestions.length) * 100} className="h-2 mb-6" />
            <p className="mb-6">
              {score === quizQuestions.length
                ? "Perfect score! Excellent work!"
                : score >= quizQuestions.length / 2
                  ? "Good job! Keep practicing to improve."
                  : "Keep practicing to improve your score."}
            </p>
            <Button onClick={restartQuiz} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuiz = quizQuestions[currentQuestion]
  const currentKanji = kanji.find((k) => k.character === currentQuiz.character) || kanji[currentQuestion]

  // Parse ON and KUN readings with their romanji
  const parseReadings = () => {
    const onReadings: { japanese: string; romanji: string }[] = []
    const kunReadings: { japanese: string; romanji: string }[] = []

    // Parse ON readings
    if (currentKanji?.on_reading) {
      const japaneseReadings = currentKanji.on_reading.split(";").map((r) => r.trim())
      const romanjiReadings = currentQuiz.onReadings

      // Match them up if possible
      for (let i = 0; i < japaneseReadings.length; i++) {
        onReadings.push({
          japanese: japaneseReadings[i],
          romanji: romanjiReadings[i] || "",
        })
      }
    }

    // Parse KUN readings
    if (currentKanji?.kun_reading) {
      const japaneseReadings = currentKanji.kun_reading.split(";").map((r) => r.trim())
      const romanjiReadings = currentQuiz.kunReadings

      // Match them up if possible
      for (let i = 0; i < japaneseReadings.length; i++) {
        kunReadings.push({
          japanese: japaneseReadings[i],
          romanji: romanjiReadings[i] || "",
        })
      }
    }

    return { onReadings, kunReadings }
  }

  const { onReadings, kunReadings } = parseReadings()

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      {/* Quiz type and level selectors */}
      <div className="mb-8">
        <Tabs defaultValue={quizType} onValueChange={handleQuizTypeChange} className="w-full mb-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="meaning">Meaning Quiz</TabsTrigger>
            <TabsTrigger value="reading">Reading Quiz</TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs defaultValue={jlptLevel} onValueChange={handleJlptLevelChange} className="w-full">
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

      {/* Toggle buttons for reading and romanji */}
      <div className="flex justify-center gap-2 mb-6">
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

      {/* Question header and progress */}
      <div className="flex justify-between items-center mb-2">
        <div className="text-lg font-medium">
          Question {currentQuestion + 1} of {quizQuestions.length}
        </div>
        <div className="text-lg font-medium">Score: {score}</div>
      </div>
      <Progress
        value={(currentQuestion / quizQuestions.length) * 100}
        className="h-2 mb-6 bg-gray-200 dark:bg-gray-700"
      />

      {/* Kanji card */}
      <Card className="mb-6 overflow-hidden rounded-xl border shadow-sm">
        <CardContent className="p-0">
          <div className="flex flex-col h-[300px]">
            {/* Kanji character */}
            <div className="flex-none flex flex-col items-center justify-center pt-8 pb-4">
              <div className="text-8xl font-bold mb-2">{currentQuiz.character}</div>

              {/* JLPT Level Badge */}
              {jlptLevel === "all" && (
                <div className="mt-2">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-sm font-medium ${getJlptColor(
                      currentQuiz.jlptLevel,
                    )}`}
                  >
                    {currentQuiz.jlptLevel}
                  </span>
                </div>
              )}
            </div>

            {/* Readings section - scrollable if needed */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {/* ON readings */}
              {showReading && onReadings.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">ON Reading:</h3>
                  <div className="space-y-1">
                    {onReadings.map((reading, index) => (
                      <div key={`on-${index}`} className="text-lg">
                        {reading.japanese}{" "}
                        {showRomanji && reading.romanji && (
                          <span className="text-sm text-muted-foreground">({reading.romanji})</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* KUN readings */}
              {showReading && kunReadings.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">KUN Reading:</h3>
                  <div className="space-y-1">
                    {kunReadings.map((reading, index) => (
                      <div key={`kun-${index}`} className="text-lg">
                        {reading.japanese}{" "}
                        {showRomanji && reading.romanji && (
                          <span className="text-sm text-muted-foreground">({reading.romanji})</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answer options */}
      <div className="space-y-3">
        {currentQuiz.options.map((option, index) => (
          <Button
            key={index}
            variant={
              selectedAnswer === option
                ? isCorrect
                  ? "default"
                  : "destructive"
                : selectedAnswer !== null && option === currentQuiz.correctAnswer
                  ? "default"
                  : "outline"
            }
            className="h-auto min-h-12 text-lg justify-between py-3 px-4 rounded-lg w-full"
            onClick={() => handleAnswerClick(option)}
            disabled={selectedAnswer !== null}
          >
            <span className="text-left break-words mr-2">{option}</span>
            {selectedAnswer === option && isCorrect && <CheckCircle2 className="h-5 w-5 flex-shrink-0" />}
            {selectedAnswer === option && !isCorrect && <XCircle className="h-5 w-5 flex-shrink-0" />}
          </Button>
        ))}
      </div>
    </div>
  )
}
