import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Quiz | Japanese Learning App",
  description: "Test your Japanese knowledge with interactive quizzes",
}

export default function QuizPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Quiz Mode</h1>
        <p className="text-lg text-muted-foreground">Test your knowledge with these quizzes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/quiz/hiragana" className="block">
          <Card className="h-full transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle>Hiragana Quiz</CardTitle>
              <CardDescription>Test your hiragana recognition and reading</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="text-5xl font-bold">あ</div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Start Hiragana Quiz</Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/quiz/katakana" className="block">
          <Card className="h-full transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle>Katakana Quiz</CardTitle>
              <CardDescription>Test your katakana recognition and reading</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="text-5xl font-bold">ア</div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Start Katakana Quiz</Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/quiz/kanji" className="block">
          <Card className="h-full transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle>Kanji Quiz</CardTitle>
              <CardDescription>Test your kanji knowledge and readings</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="text-5xl font-bold">漢</div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Start Kanji Quiz</Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/quiz/vocabulary" className="block">
          <Card className="h-full transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle>Vocabulary Quiz</CardTitle>
              <CardDescription>Test your Japanese vocabulary knowledge</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="text-5xl font-bold">言葉</div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Start Vocabulary Quiz</Button>
            </CardFooter>
          </Card>
        </Link>
      </div>
    </div>
  )
}
