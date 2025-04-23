import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, FlaskConical, ScrollText } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">日本語を学ぼう</h1>
        <p className="text-xl text-muted-foreground">Learn Japanese with interactive tools</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/learn" className="block">
          <Card className="h-full transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Learning Mode
              </CardTitle>
              <CardDescription>
                Study hiragana, katakana, kanji, and vocabulary with detailed explanations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 flex items-center justify-center bg-muted rounded-md">
                <span className="text-4xl font-bold">あ ア 漢</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Start Learning</Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/flashcards" className="block">
          <Card className="h-full transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ScrollText className="h-5 w-5" />
                Flashcards
              </CardTitle>
              <CardDescription>
                Practice with interactive flashcards to memorize characters and vocabulary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 flex items-center justify-center bg-muted rounded-md">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">話す</div>
                  <div className="text-lg">はなす (hanasu)</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Start Flashcards</Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/quiz" className="block">
          <Card className="h-full transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                Quiz Mode
              </CardTitle>
              <CardDescription>Test your knowledge with quizzes on different Japanese writing systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 flex items-center justify-center bg-muted rounded-md">
                <div className="text-center">
                  <div className="text-2xl mb-2">What is the reading for 一?</div>
                  <div className="grid grid-cols-2 gap-2 text-lg">
                    <div className="bg-background p-2 rounded">いち</div>
                    <div className="bg-background p-2 rounded">に</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Start Quiz</Button>
            </CardFooter>
          </Card>
        </Link>
      </div>
    </div>
  )
}
