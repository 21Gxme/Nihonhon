"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { HiraganaKatakana } from "@/lib/data"
import { CheckCircle2, XCircle } from "lucide-react"

export default function KatakanaQuizPage() {
  const [katakana, setKatakana] = useState<HiraganaKatakana[]>([])
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
    }[]
  >([])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/katakana")
        const data = await response.json()
        setKatakana(data)

        // Generate quiz questions
        if (data.length > 0) {
          const questions = generateQuizQuestions(data)
          setQuizQuestions(questions)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching katakana data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const generateQuizQuestions = (data: HiraganaKatakana[]) => {
    // Shuffle the data
    const shuffledData = [...data].sort(() => Math.random() - 0.5)

    // Take the first 10 items for the quiz
    const quizItems = shuffledData.slice(0, 10)

    return quizItems.map((item) => {
      // Get 3 random incorrect options
      const incorrectOptions = shuffledData
        .filter((h) => h.romaji !== item.romaji)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((h) => h.romaji)

      // Combine correct and incorrect options and shuffle
      const options = [item.romaji, ...incorrectOptions].sort(() => Math.random() - 0.5)

      return {
        character: item.character,
        options,
        correctAnswer: item.romaji,
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
    if (katakana.length > 0) {
      const questions = generateQuizQuestions(katakana)
      setQuizQuestions(questions)
    }

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
        <h1 className="text-3xl font-bold tracking-tight mb-4">Katakana Quiz</h1>
        <p className="text-lg text-muted-foreground">Select the correct reading for each katakana character</p>
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
            <div className="text-8xl font-bold">{currentQuiz.character}</div>
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
