"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toggle } from "@/components/ui/toggle"
import type { Vocabulary } from "@/lib/data"
import { CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react"

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
      romanji: string
    }[]
  >([])
  const [quizType, setQuizType] = useState<"meaning" | "reading">("meaning")
  const [jlptLevel, setJlptLevel] = useState<string>("all")
  const [showKana, setShowKana] = useState(true)
  const [showRomanji, setShowRomanji] = useState(true)

  const getJlptLevelCounts = () => {
    const counts = {
      N5: 0,
      N4: 0,
      N3: 0,
      N2: 0,
      N1: 0,
    }
    vocabulary.forEach((item) => {
      if (counts.hasOwnProperty(item.jlpt_level)) {
        counts[item.jlpt_level as keyof typeof counts]++
      }
    })
    return counts
  }

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
    const filteredData = level === "all" ? data : data.filter((item) => item.jlpt_level === level)

    const shuffledData = [...filteredData].sort(() => Math.random() - 0.5)

    const quizItems = shuffledData.slice(0, Math.min(10, shuffledData.length))

    return quizItems.map((item) => {
      if (type === "meaning") {
        const formattedMeaning = formatWithCommas(item.meaning)

        const incorrectOptions = shuffledData
          .filter((v) => v.meaning !== item.meaning)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((v) => formatWithCommas(v.meaning))

        const options = [formattedMeaning, ...incorrectOptions].sort(() => Math.random() - 0.5)

        return {
          word: item.word,
          kana: item.kana,
          romanji: item.romanji || "",
          options,
          correctAnswer: formattedMeaning,
          questionType: "meaning" as const,
          jlptLevel: item.jlpt_level,
        }
      } else {
        const formattedKana = formatWithCommas(item.kana)

        const incorrectOptions = shuffledData
          .filter((v) => v.kana !== item.kana)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((v) => formatWithCommas(v.kana))

        const options = [formattedKana, ...incorrectOptions].sort(() => Math.random() - 0.5)

        return {
          word: item.word,
          kana: item.kana,
          romanji: item.romanji || "",
          options,
          correctAnswer: formattedKana,
          questionType: "reading" as const,
          jlptLevel: item.jlpt_level,
        }
      }
    })
  }

  const handleAnswerClick = (answer: string) => {
    if (selectedAnswer !== null) return

    const currentQuiz = quizQuestions[currentQuestion]
    const correct = answer === currentQuiz.correctAnswer

    setSelectedAnswer(answer)
    setIsCorrect(correct)

    if (correct) {
      setScore(score + 1)
    }

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

  const toggleKana = () => {
    setShowKana(!showKana)
  }

  const toggleRomanji = () => {
    setShowRomanji(!showRomanji)
  }

  const getJlptColor = (level: string) => {
    switch (level) {
      case "N5":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
      case "N4":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
      case "N3":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300"
      case "N2":
        return "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300"
      case "N1":
        return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
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
            <TabsList className="grid grid-cols-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="N5" disabled={getJlptLevelCounts().N5 === 0}>
                N5
              </TabsTrigger>
              <TabsTrigger value="N4" disabled={getJlptLevelCounts().N4 === 0}>
                N4
              </TabsTrigger>
              <TabsTrigger value="N3" disabled={getJlptLevelCounts().N3 === 0}>
                N3
              </TabsTrigger>
              <TabsTrigger value="N2" disabled={getJlptLevelCounts().N2 === 0}>
                N2
              </TabsTrigger>
              <TabsTrigger value="N1" disabled={getJlptLevelCounts().N1 === 0}>
                N1
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <p className="text-lg text-muted-foreground mb-4">
          {quizType === "meaning"
            ? "Select the correct meaning for each word"
            : "Select the correct reading for each word"}
        </p>

        {quizType === "meaning" && (
          <div className="flex justify-center gap-2 mb-4 max-w-md mx-auto">
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
        )}
      </div>

      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            Question {currentQuestion + 1} of {quizQuestions.length}
          </div>
          <div>Score: {score}</div>
        </div>

        <Progress value={(currentQuestion / quizQuestions.length) * 100} className="h-2 mb-6" />

        <Card className="mb-6 overflow-hidden rounded-xl border shadow-sm">
          <CardContent className="p-0">
            <div className="flex flex-col h-[250px]">
              <div className="flex-none flex flex-col items-center justify-center pt-8 pb-4">
                <div className="text-4xl font-bold mb-2">{currentQuiz.word}</div>
                <div className="flex flex-col items-center">
                  {quizType === "meaning" && showKana && <div className="text-xl mb-1">{currentQuiz.kana}</div>}
                  {quizType === "meaning" && showRomanji && currentQuiz.romanji && (
                    <div className="text-lg text-muted-foreground max-w-full px-4 text-center break-words">
                      {formatWithCommas(currentQuiz.romanji)}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 pt-2">
                <div className="flex items-center gap-2 justify-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-sm font-medium ${getJlptColor(
                      currentQuiz.jlptLevel,
                    )}`}
                  >
                    {currentQuiz.jlptLevel}
                  </span>
                </div>
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
              className="h-auto min-h-12 text-lg justify-between py-3 px-4 rounded-lg"
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
    </div>
  )
}
