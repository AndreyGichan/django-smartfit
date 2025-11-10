"use client"

import { Dumbbell, Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useTransition } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LoadingOverlay } from "./loading-overlay"

interface HeaderProps {
  isLoggedIn: boolean;
}

export function Header({ isLoggedIn }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(false)

  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "/programs", label: "Программы" },
    { href: "/exercises", label: "Упражнения" },
    { href: "/diary", label: "Дневник" },
    { href: "/stats", label: "Статистика" },
  ]

  useEffect(() => {
    setLoading(false)
  }, [pathname])

  const handleLinkClick = (href: string) => {
    setLoading(true)
    startTransition(() => {
      router.push(href)
    })
  }

  const isLoading = loading || isPending

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-lg"
          : "bg-background/60 backdrop-blur-md border-b border-border/20"
          }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault()
                handleLinkClick("/")
              }}
              className="flex items-center gap-2 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Dumbbell className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                SmartFit
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleLinkClick(item.href)
                  }}
                  className={`relative text-sm font-medium transition-colors group ${pathname === item.href ? "text-primary" : "text-foreground/80 hover:text-foreground"
                    }`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 ${pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                  />
                </Link>
              ))}

              <div className="flex items-center gap-3 ml-4">
                {isLoggedIn ? (
                  <Link
                    href="/profile"
                    onClick={(e) => {
                      e.preventDefault()
                      handleLinkClick("/profile")
                    }}
                    className={`relative text-sm font-medium transition-colors group flex items-center gap-2 ${pathname === "/profile" ? "text-primary" : "text-foreground/80 hover:text-foreground"
                      }`}
                  >
                    <User className="h-4 w-4" />
                    Профиль
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 ${pathname === "/profile" ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                    />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={(e) => {
                        e.preventDefault()
                        handleLinkClick("/login")
                      }}
                    >
                      <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary">
                        Вход
                      </Button>
                    </Link>

                    <Link
                      href="/programs"
                      onClick={(e) => {
                        e.preventDefault()
                        handleLinkClick("/programs")
                      }}
                    >
                      <Button size="sm" className=" group relative overflow-hidden">
                        <span className="relative z-10">Начать</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>



            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-primary/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden py-4 space-y-3 border-t border-border/40 animate-in slide-in-from-top-2 duration-300">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    setMobileMenuOpen(false)
                    handleLinkClick(item.href)
                  }}
                  className={`block py-2 text-sm font-medium transition-all hover:translate-x-2 ${pathname === item.href ? "text-primary" : "text-foreground/80"
                    }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4">
                {isLoggedIn ? (
                  <Link href="/profile">
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault()
                        setMobileMenuOpen(false)
                        handleLinkClick("/profile")
                      }}
                    >
                      Профиль
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={(e) => {
                        e.preventDefault()
                        setMobileMenuOpen(false)
                        handleLinkClick("/login")
                      }}
                    >
                      <Button className="w-full" variant="outline">
                        Вход
                      </Button>
                    </Link>
                    <Link href="/programs">
                      <Button
                        className="w-full"
                        onClick={(e) => {
                          e.preventDefault()
                          setMobileMenuOpen(false)
                          handleLinkClick("/programs")
                        }}
                      >
                        Начать</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>

      <LoadingOverlay show={isLoading} />
    </>
  )
}
