import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Learning Mode | Japanese Learning App",
  description: "Learn Japanese characters and vocabulary with detailed explanations",
}

export default function LearnPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Learning Mode</h1>
        <p className="text-lg text-muted-foreground">Choose a category to start learning</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/learn/hiragana" className="block">
          <Card className="h-full transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle>Hiragana</CardTitle>
              <CardDescription>Basic Japanese phonetic alphabet</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="text-5xl font-bold">あ</div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Learn Hiragana</Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/learn/katakana" className="block">
          <Card className="h-full transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle>Katakana</CardTitle>
              <CardDescription>Used primarily for foreign words</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="text-5xl font-bold">ア</div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Learn Katakana</Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/learn/kanji" className="block">
          <Card className="h-full transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle>Kanji</CardTitle>
              <CardDescription>Chinese characters used in Japanese</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="text-5xl font-bold">漢</div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Learn Kanji</Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/learn/vocabulary" className="block">
          <Card className="h-full transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle>Vocabulary</CardTitle>
              <CardDescription>Common Japanese words and phrases</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="text-5xl font-bold">言葉</div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Learn Vocabulary</Button>
            </CardFooter>
          </Card>
        </Link>
      </div>
    </div>
  )
}
