"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Kanji } from "@/lib/data"
import { CheckCircle2, XCircle } from "lucide-react"

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
      romaji: string
    }[]
  >([])
  const [quizType, setQuizType] = useState<"meaning" | "reading">("meaning")

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/kanji")
        const data = await response.json()
        setKanji(data)

        // Generate quiz questions
        if (data.length > 0) {
          const questions = generateQuizQuestions(data, quizType)
          setQuizQuestions(questions)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching kanji data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [quizType])

  const generateQuizQuestions = (data: Kanji[], type: "meaning" | "reading") => {
    // Shuffle the data
    const shuffledData = [...data].sort(() => Math.random() - 0.5)

    // Take the first 10 items for the quiz
    const quizItems = shuffledData.slice(0, 10)

    return quizItems.map((item) => {
      if (type === "meaning") {
        // Get 3 random incorrect options for meaning
        const incorrectOptions = shuffledData
          .filter((k) => k.meaning !== item.meaning)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((k) => k.meaning)

        // Combine correct and incorrect options and shuffle
        const options = [item.meaning, ...incorrectOptions].sort(() => Math.random() - 0.5)

        return {
          character: item.character,
          options,
          correctAnswer: item.meaning,
          questionType: "meaning" as const,
          romaji: item.romaji, // Add this line to include romaji
        }
      } else {
        // Get 3 random incorrect options for reading (using on_reading)
        const incorrectOptions = shuffledData
          .filter((k) => k.on_reading !== item.on_reading)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((k) => k.on_reading)

        // Combine correct and incorrect options and shuffle
        const options = [item.on_reading, ...incorrectOptions].sort(() => Math.random() - 0.5)

        return {
          character: item.character,
          options,
          correctAnswer: item.on_reading,
          questionType: "reading" as const,
          romaji: item.romaji, // Add this line to include romaji
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
      const questions = generateQuizQuestions(kanji, quizType)
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
        <p>No quiz questions available.</p>
      </div>
    )
  }

  if (showResult) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Quiz Results</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
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
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={restartQuiz}>Try Again</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const currentQuiz = quizQuestions[currentQuestion]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Kanji Quiz</h1>

        <Tabs defaultValue={quizType} onValueChange={handleQuizTypeChange} className="w-full max-w-md mx-auto mb-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="meaning">Meaning Quiz</TabsTrigger>
            <TabsTrigger value="reading">Reading Quiz</TabsTrigger>
          </TabsList>
        </Tabs>

        <p className="text-lg text-muted-foreground">
          {quizType === "meaning"
            ? "Select the correct meaning for each kanji"
            : "Select the correct reading for each kanji"}
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            Question {currentQuestion + 1} of {quizQuestions.length}
          </div>
          <div>Score: {score}</div>
        </div>

        <Progress value={(currentQuestion / quizQuestions.length) * 100} className="h-2 mb-6" />

        <Card className="mb-6">
          <CardContent className="flex items-center justify-center p-12">
            <div className="text-center">
              <div className="text-8xl font-bold mb-2">{currentQuiz.character}</div>
              {quizType === "meaning" && <div className="text-lg">{currentQuiz.romaji}</div>}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-3">
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
              className="h-12 text-lg justify-between"
              onClick={() => handleAnswerClick(option)}
              disabled={selectedAnswer !== null}
            >
              <span>{option}</span>
              {selectedAnswer === option && isCorrect && <CheckCircle2 className="h-5 w-5" />}
              {selectedAnswer === option && !isCorrect && <XCircle className="h-5 w-5" />}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
