"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { BookOpen, FlaskConical, Home, ScrollText } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      active: pathname === "/",
    },
    {
      href: "/learn",
      label: "Learn",
      icon: BookOpen,
      active: pathname === "/learn" || pathname.startsWith("/learn/"),
    },
    {
      href: "/flashcards",
      label: "Flashcards",
      icon: ScrollText,
      active: pathname === "/flashcards" || pathname.startsWith("/flashcards/"),
    },
    {
      href: "/quiz",
      label: "Quiz",
      icon: FlaskConical,
      active: pathname === "/quiz" || pathname.startsWith("/quiz/"),
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold ml-3">日本本</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-1">
            {routes.map((route) => (
              <Button key={route.href} variant={route.active ? "default" : "ghost"} asChild className="h-9">
                <Link href={route.href} className="flex items-center gap-1">
                  <route.icon className="h-4 w-4" />
                  <span className="hidden sm:inline-block">{route.label}</span>
                </Link>
              </Button>
            ))}
          </nav>
          <div className="flex items-center">
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
