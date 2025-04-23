import type { Metadata } from "next"
import { getVocabulary } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Learn Vocabulary | Japanese Learning App",
  description: "Learn Japanese vocabulary words with examples and meanings",
}

export default async function VocabularyPage() {
  const vocabulary = await getVocabulary()

  // Group by JLPT level
  const n5Vocabulary = vocabulary.filter((item) => item.jlpt_level === "N5")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Vocabulary</h1>
        <p className="text-lg text-muted-foreground">Learn common Japanese vocabulary words and phrases.</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="all">All Words</TabsTrigger>
          <TabsTrigger value="n5">JLPT N5</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vocabulary.map((item) => (
              <Card key={item.word} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="flex flex-col">
                    <span className="text-2xl">{item.word}</span>
                    <span className="text-lg font-normal">
                      {item.kana} ({item.romaji})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardDescription>
                    <p className="font-medium mb-1">Meaning: {item.meaning}</p>
                    <p className="text-sm mb-1">Part of speech: {item.part_of_speech}</p>
                    {item.example && (
                      <div className="mt-2 text-sm">
                        <p>Example:</p>
                        <p>{item.example}</p>
                        <p>{item.example_meaning}</p>
                      </div>
                    )}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="n5" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {n5Vocabulary.map((item) => (
              <Card key={item.word} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="flex flex-col">
                    <span className="text-2xl">{item.word}</span>
                    <span className="text-lg font-normal">
                      {item.kana} ({item.romaji})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardDescription>
                    <p className="font-medium mb-1">Meaning: {item.meaning}</p>
                    <p className="text-sm mb-1">Part of speech: {item.part_of_speech}</p>
                    {item.example && (
                      <div className="mt-2 text-sm">
                        <p>Example:</p>
                        <p>{item.example}</p>
                        <p>{item.example_meaning}</p>
                      </div>
                    )}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
