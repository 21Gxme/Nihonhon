import type { Metadata } from "next"
import { getVocabulary } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export const metadata: Metadata = {
  title: "Learn Vocabulary | Japanese Learning App",
  description: "Learn Japanese vocabulary words with examples and meanings",
}

export default async function VocabularyPage({
  searchParams,
}: {
  searchParams: { page?: string; level?: string; search?: string }
}) {
  // Get current page from query params or default to 1
  const currentPage = Number(searchParams.page) || 1
  const selectedLevel = searchParams.level || "all"
  const searchQuery = searchParams.search || ""

  const itemsPerPage = 50
  // Get all vocabulary
  const allVocabulary = await getVocabulary()

  // Filter by JLPT level if needed
  let filteredVocabulary =
    selectedLevel === "all" ? allVocabulary : allVocabulary.filter((item) => item.jlpt_level === selectedLevel)

  // Apply search filter if search query exists
  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    filteredVocabulary = filteredVocabulary.filter((vocab) => {
      return (
        vocab.word.toLowerCase().includes(query) ||
        vocab.kana.toLowerCase().includes(query) ||
        (vocab.romaji || "").toLowerCase().includes(query) ||
        vocab.meaning.toLowerCase().includes(query) ||
        (vocab.part_of_speech || "").toLowerCase().includes(query) ||
        (vocab.example || "").toLowerCase().includes(query) ||
        (vocab.example_meaning || "").toLowerCase().includes(query)
      )
    })
  }

  // Calculate total pages
  const totalPages = Math.ceil(filteredVocabulary.length / itemsPerPage)

  // Get current page items
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredVocabulary.slice(startIndex, endIndex)

  // Generate page numbers for pagination
  const pageNumbers = []
  const maxPageButtons = 5
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2))
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1)

  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Vocabulary</h1>
        <p className="text-lg text-muted-foreground mb-6">Learn common Japanese vocabulary words and phrases.</p>

        {/* Search form */}
        <form action="/learn/vocabulary" method="get" className="max-w-md mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              name="search"
              placeholder="Search word, meaning, or reading..."
              className="pl-9"
              defaultValue={searchQuery}
            />
            <input type="hidden" name="level" value={selectedLevel} />
            <input type="hidden" name="page" value="1" />
          </div>
        </form>
      </div>

      <Tabs defaultValue={selectedLevel} className="w-full mb-8">
        <TabsList className="flex flex-wrap justify-center gap-1 mb-4">
          <TabsTrigger value="all" asChild>
            <a href={`/learn/vocabulary?level=all&page=1${searchQuery ? `&search=${searchQuery}` : ""}`}>All Levels</a>
          </TabsTrigger>
          <TabsTrigger value="N5" asChild>
            <a href={`/learn/vocabulary?level=N5&page=1${searchQuery ? `&search=${searchQuery}` : ""}`}>N5</a>
          </TabsTrigger>
          <TabsTrigger value="N4" asChild>
            <a href={`/learn/vocabulary?level=N4&page=1${searchQuery ? `&search=${searchQuery}` : ""}`}>N4</a>
          </TabsTrigger>
          <TabsTrigger value="N3" asChild>
            <a href={`/learn/vocabulary?level=N3&page=1${searchQuery ? `&search=${searchQuery}` : ""}`}>N3</a>
          </TabsTrigger>
          <TabsTrigger value="N2" asChild>
            <a href={`/learn/vocabulary?level=N2&page=1${searchQuery ? `&search=${searchQuery}` : ""}`}>N2</a>
          </TabsTrigger>
          <TabsTrigger value="N1" asChild>
            <a href={`/learn/vocabulary?level=N1&page=1${searchQuery ? `&search=${searchQuery}` : ""}`}>N1</a>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedLevel} className="mt-6">
          {searchQuery && (
            <div className="mb-6 text-center">
              <p className="text-lg">
                Search results for <span className="font-medium">"{searchQuery}"</span>:{" "}
                <span className="font-medium">{filteredVocabulary.length}</span> words found
              </p>
              <a
                href={`/learn/vocabulary?level=${selectedLevel}&page=1`}
                className="text-sm text-blue-500 hover:underline"
              >
                Clear search
              </a>
            </div>
          )}

          {currentItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentItems.map((item, index) => (
                <Card key={`${item.word}-${index}`} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="flex flex-col">
                      <span className="text-2xl">{item.word}</span>
                      <span className="text-lg font-normal">
                        {item.kana} {item.romaji && `(${item.romaji})`}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <CardDescription>
                      <p className="font-medium mb-1">Meaning: {item.meaning}</p>
                      {item.part_of_speech && <p className="text-sm mb-1">Part of speech: {item.part_of_speech}</p>}
                      {item.jlpt_level && <p className="text-sm mb-1">JLPT Level: {item.jlpt_level}</p>}
                      {item.example && (
                        <div className="mt-2 text-sm">
                          <p>Example:</p>
                          <p>{item.example}</p>
                          {item.example_meaning && <p>{item.example_meaning}</p>}
                        </div>
                      )}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg mb-4">No vocabulary found matching your search criteria.</p>
              <a href={`/learn/vocabulary?level=${selectedLevel}&page=1`} className="text-blue-500 hover:underline">
                Clear search and show all vocabulary
              </a>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href={`/learn/vocabulary?level=${selectedLevel}&page=${currentPage - 1}${
                        searchQuery ? `&search=${searchQuery}` : ""
                      }`}
                    />
                  </PaginationItem>
                )}

                {startPage > 1 && (
                  <>
                    <PaginationItem>
                      <PaginationLink
                        href={`/learn/vocabulary?level=${selectedLevel}&page=1${
                          searchQuery ? `&search=${searchQuery}` : ""
                        }`}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    {startPage > 2 && (
                      <PaginationItem>
                        <span className="px-4 py-2">...</span>
                      </PaginationItem>
                    )}
                  </>
                )}

                {pageNumbers.map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href={`/learn/vocabulary?level=${selectedLevel}&page=${page}${
                        searchQuery ? `&search=${searchQuery}` : ""
                      }`}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {endPage < totalPages && (
                  <>
                    {endPage < totalPages - 1 && (
                      <PaginationItem>
                        <span className="px-4 py-2">...</span>
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        href={`/learn/vocabulary?level=${selectedLevel}&page=${totalPages}${
                          searchQuery ? `&search=${searchQuery}` : ""
                        }`}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext
                      href={`/learn/vocabulary?level=${selectedLevel}&page=${currentPage + 1}${
                        searchQuery ? `&search=${searchQuery}` : ""
                      }`}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}

          <div className="text-center text-sm text-muted-foreground mt-4">
            {filteredVocabulary.length > 0 ? (
              <>
                Showing {startIndex + 1}-{Math.min(endIndex, filteredVocabulary.length)} of {filteredVocabulary.length}{" "}
                words
              </>
            ) : (
              <>No vocabulary found</>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
