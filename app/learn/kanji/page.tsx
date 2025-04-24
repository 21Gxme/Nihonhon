import type { Metadata } from "next"
import { getKanji } from "@/lib/data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { KanjiDetailCard } from "@/components/kanji-detail-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export const metadata: Metadata = {
  title: "Learn Kanji | Japanese Learning App",
  description: "Learn Japanese kanji characters with readings and meanings",
}

export default async function KanjiPage({
  params,
  searchParams,
}: {
  params: Promise<{}>
  searchParams: Promise<{ page?: string; level?: string; search?: string }>
}) {
  // Await the searchParams Promise to get the actual values
  const { page, level, search } = await searchParams

  // Use the values
  const currentPage = Number(page) || 1
  const selectedLevel = level || "all"
  const searchQuery = search || ""

  // Items per page
  const itemsPerPage = 48

  // Get all kanji
  const allKanji = await getKanji()

  // Filter by JLPT level if needed
  let filteredKanji = selectedLevel === "all" ? allKanji : allKanji.filter((item) => item.jlpt_level === selectedLevel)

  // Apply search filter if search query exists
  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    filteredKanji = filteredKanji.filter((kanji) => {
      return (
        kanji.character.toLowerCase().includes(query) ||
        (kanji.keyword || kanji.meaning || "").toLowerCase().includes(query) ||
        kanji.on_reading.toLowerCase().includes(query) ||
        kanji.kun_reading.toLowerCase().includes(query) ||
        (kanji.romaji || "").toLowerCase().includes(query)
      )
    })
  }

  // Calculate total pages
  const totalPages = Math.ceil(filteredKanji.length / itemsPerPage)

  // Get current page items
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredKanji.slice(startIndex, endIndex)

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
        <h1 className="text-3xl font-bold tracking-tight mb-4">Kanji</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Kanji are Chinese characters used in the Japanese writing system.
        </p>

        {/* Search form */}
        <form action="/learn/kanji" method="get" className="max-w-md mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              name="search"
              placeholder="Search kanji, meaning, or reading..."
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
            <a href={`/learn/kanji?level=all&page=1${searchQuery ? `&search=${searchQuery}` : ""}`}>All Levels</a>
          </TabsTrigger>
          <TabsTrigger value="N5" asChild>
            <a href={`/learn/kanji?level=N5&page=1${searchQuery ? `&search=${searchQuery}` : ""}`}>N5</a>
          </TabsTrigger>
          <TabsTrigger value="N4" asChild>
            <a href={`/learn/kanji?level=N4&page=1${searchQuery ? `&search=${searchQuery}` : ""}`}>N4</a>
          </TabsTrigger>
          <TabsTrigger value="N3" asChild>
            <a href={`/learn/kanji?level=N3&page=1${searchQuery ? `&search=${searchQuery}` : ""}`}>N3</a>
          </TabsTrigger>
          <TabsTrigger value="N2" asChild>
            <a href={`/learn/kanji?level=N2&page=1${searchQuery ? `&search=${searchQuery}` : ""}`}>N2</a>
          </TabsTrigger>
          <TabsTrigger value="N1" asChild>
            <a href={`/learn/kanji?level=N1&page=1${searchQuery ? `&search=${searchQuery}` : ""}`}>N1</a>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedLevel} className="mt-6">
          {searchQuery && (
            <div className="mb-6 text-center">
              <p className="text-lg">
                Search results for <span className="font-medium">"{searchQuery}"</span>:{" "}
                <span className="font-medium">{filteredKanji.length}</span> kanji found
              </p>
              <a href={`/learn/kanji?level=${selectedLevel}&page=1`} className="text-sm text-blue-500 hover:underline">
                Clear search
              </a>
            </div>
          )}

          {currentItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentItems.map((item) => (
                <KanjiDetailCard key={item.character} kanji={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg mb-4">No kanji found matching your search criteria.</p>
              <a href={`/learn/kanji?level=${selectedLevel}&page=1`} className="text-blue-500 hover:underline">
                Clear search and show all kanji
              </a>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href={`/learn/kanji?level=${selectedLevel}&page=${currentPage - 1}${
                        searchQuery ? `&search=${searchQuery}` : ""
                      }`}
                    />
                  </PaginationItem>
                )}

                {startPage > 1 && (
                  <>
                    <PaginationItem>
                      <PaginationLink
                        href={`/learn/kanji?level=${selectedLevel}&page=1${
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
                      href={`/learn/kanji?level=${selectedLevel}&page=${page}${
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
                        href={`/learn/kanji?level=${selectedLevel}&page=${totalPages}${
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
                      href={`/learn/kanji?level=${selectedLevel}&page=${currentPage + 1}${
                        searchQuery ? `&search=${searchQuery}` : ""
                      }`}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}

          <div className="text-center text-sm text-muted-foreground mt-4">
            {filteredKanji.length > 0 ? (
              <>
                Showing {startIndex + 1}-{Math.min(endIndex, filteredKanji.length)} of {filteredKanji.length} kanji
              </>
            ) : (
              <>No kanji found</>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
