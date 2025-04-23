import type { Metadata } from "next"
import { getKanji } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Learn Kanji | Japanese Learning App",
  description: "Learn Japanese kanji characters with readings and meanings",
}

export default async function KanjiPage() {
  const kanji = await getKanji()

  // Group by JLPT level
  const n5Kanji = kanji.filter((item) => item.jlpt_level === "N5")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Kanji</h1>
        <p className="text-lg text-muted-foreground">
          Kanji are Chinese characters used in the Japanese writing system.
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="all">All Characters</TabsTrigger>
          <TabsTrigger value="n5">JLPT N5</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {kanji.map((item) => (
              <Card key={item.character} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-center text-4xl">{item.character}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardDescription>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <p className="text-xs font-medium">On Reading</p>
                        <p>{item.on_reading}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium">Kun Reading</p>
                        <p>{item.kun_reading}</p>
                      </div>
                    </div>
                    <p className="font-medium">Meaning: {item.meaning}</p>
                    {item.example && <p className="mt-2 text-sm">Example: {item.example}</p>}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="n5" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {n5Kanji.map((item) => (
              <Card key={item.character} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-center text-4xl">{item.character}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardDescription>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <p className="text-xs font-medium">On Reading</p>
                        <p>{item.on_reading}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium">Kun Reading</p>
                        <p>{item.kun_reading}</p>
                      </div>
                    </div>
                    <p className="font-medium">Meaning: {item.meaning}</p>
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
