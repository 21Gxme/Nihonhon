import type { Metadata } from "next"
import { getHiragana } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Learn Hiragana | Japanese Learning App",
  description: "Learn the Japanese hiragana alphabet with examples and pronunciation",
}

export default async function HiraganaPage() {
  const hiragana = await getHiragana()

  // Group by JLPT level
  const n5Hiragana = hiragana.filter((item) => item.jlpt_level === "N5")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Hiragana</h1>
        <p className="text-lg text-muted-foreground">
          Hiragana is a Japanese syllabary, one component of the Japanese writing system.
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="all">All Characters</TabsTrigger>
          <TabsTrigger value="n5">JLPT N5</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {hiragana.map((item) => (
              <Card key={item.character} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-center text-4xl">{item.character}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardDescription className="text-center">
                    <p className="font-medium">{item.romaji}</p>
                    {item.example && <p className="mt-2 text-sm">Example: {item.example}</p>}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="n5" className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {n5Hiragana.map((item) => (
              <Card key={item.character} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-center text-4xl">{item.character}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardDescription className="text-center">
                    <p className="font-medium">{item.romaji}</p>
                    {item.example && <p className="mt-2 text-sm">Example: {item.example}</p>}
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
