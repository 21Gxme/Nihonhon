import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Flashcards | Japanese Learning App",
  description: "Practice Japanese with interactive flashcards",
}

export default function FlashcardsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Flashcards</h1>
        <p className="text-lg text-muted-foreground">Choose a category to practice with flashcards</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/flashcards/hiragana" className="block">
          <Card className="h-full transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle>Hiragana</CardTitle>
              <CardDescription>Practice Hiragana characters.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="text-5xl font-bold">あ</div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Hiragana Flashcards</Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/flashcards/katakana" className="block">
          <Card className="h-full transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle>Katakana</CardTitle>
              <CardDescription>Practice the katakana characters</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="text-5xl font-bold">ア</div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Katakana Flashcards</Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/flashcards/kanji" className="block">
          <Card className="h-full transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle>Kanji</CardTitle>
              <CardDescription>Practice kanji characters and their readings</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="text-5xl font-bold">漢</div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Kanji Flashcards</Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/flashcards/vocabulary" className="block">
          <Card className="h-full transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle>Vocabulary</CardTitle>
              <CardDescription>Practice Japanese vocabulary words</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="text-5xl font-bold">言葉</div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Vocabulary Flashcards</Button>
            </CardFooter>
          </Card>
        </Link>
      </div>
    </div>
  )
}
