"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Vocabulary } from "@/lib/data"
import { CheckCircle2, XCircle } from "lucide-react"

export default function VocabularyQuizPage() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([])
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [quizQuestions, setQuizQuestions] = useState<
    {
      word: string
      kana: string
      options: string[]
      correctAnswer: string
      questionType: "meaning" | "reading"
      jlptLevel: string
    }[]
  >([])
  const [quizType, setQuizType] = useState<"meaning" | "reading">("meaning")
  const [jlptLevel, setJlptLevel] = useState<string>("all")

  // Format string to replace semicolons with commas
  const formatWithCommas = (text: string) => {
    if (!text) return ""
    return text
      .split(";")
      .map((part) => part.trim())
      .join(", ")
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/vocabulary")
        const data = await response.json()
        setVocabulary(data)

        // Generate quiz questions
        if (data.length > 0) {
          const questions = generateQuizQuestions(data, quizType, jlptLevel)
          setQuizQuestions(questions)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching vocabulary data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [quizType, jlptLevel])

  const generateQuizQuestions = (data: Vocabulary[], type: "meaning" | "reading", level: string) => {
    // Filter by JLPT level if needed
    const filteredData = level === "all" ? data : data.filter((item) => item.jlpt_level === level)

    // Shuffle the data
    const shuffledData = [...filteredData].sort(() => Math.random() - 0.5)

    // Take the first 10 items for the quiz (or less if not enough data)
    const quizItems = shuffledData.slice(0, Math.min(10, shuffledData.length))

    return quizItems.map((item) => {
      if (type === "meaning") {
        // Format meaning with commas instead of semicolons
        const formattedMeaning = formatWithCommas(item.meaning)

        // Get 3 random incorrect options for meaning
        const incorrectOptions = shuffledData
          .filter((v) => v.meaning !== item.meaning)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((v) => formatWithCommas(v.meaning))

        // Combine correct and incorrect options and shuffle
        const options = [formattedMeaning, ...incorrectOptions].sort(() => Math.random() - 0.5)

        return {
          word: item.word,
          kana: item.kana,
          options,
          correctAnswer: formattedMeaning,
          questionType: "meaning" as const,
          jlptLevel: item.jlpt_level,
        }
      } else {
        // Format kana with commas instead of semicolons
        const formattedKana = formatWithCommas(item.kana)

        // Get 3 random incorrect options for reading (using kana)
        const incorrectOptions = shuffledData
          .filter((v) => v.kana !== item.kana)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((v) => formatWithCommas(v.kana))

        // Combine correct and incorrect options and shuffle
        const options = [formattedKana, ...incorrectOptions].sort(() => Math.random() - 0.5)

        return {
          word: item.word,
          kana: item.kana,
          options,
          correctAnswer: formattedKana,
          questionType: "reading" as const,
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
    if (vocabulary.length > 0) {
      const questions = generateQuizQuestions(vocabulary, quizType, jlptLevel)
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
        <h1 className="text-3xl font-bold tracking-tight mb-4">Vocabulary Quiz</h1>

        <div className="flex flex-col gap-4 max-w-md mx-auto mb-4">
          <Tabs defaultValue={quizType} onValueChange={handleQuizTypeChange} className="w-full">
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

        <p className="text-lg text-muted-foreground">
          {quizType === "meaning"
            ? "Select the correct meaning for each word"
            : "Select the correct reading for each word"}
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
              <div className="text-4xl font-bold mb-2">{currentQuiz.word}</div>
              <div className="flex flex-col gap-1">
                {quizType === "meaning" && <div className="text-xl">{currentQuiz.kana}</div>}
                {jlptLevel === "all" && (
                  <div className="text-sm text-muted-foreground">JLPT Level: {currentQuiz.jlptLevel}</div>
                )}
              </div>
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
              className="h-auto min-h-12 text-lg justify-between py-2"
              onClick={() => handleAnswerClick(option)}
              disabled={selectedAnswer !== null}
            >
              <span className="text-left truncate max-w-[90%]">{option}</span>
              {selectedAnswer === option && isCorrect && <CheckCircle2 className="h-5 w-5 flex-shrink-0 ml-2" />}
              {selectedAnswer === option && !isCorrect && <XCircle className="h-5 w-5 flex-shrink-0 ml-2" />}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
