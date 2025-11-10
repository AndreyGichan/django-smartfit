'use client'

import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Button } from "@/components/ui/button"
import { Dumbbell, BookOpen, Calendar, TrendingUp, ArrowRight, Target, CheckCircle2, Zap } from "lucide-react"
import Link from "next/link"
import { getUserId } from "@/lib/actions"
import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { LoadingOverlay } from "@/components/loading-overlay"

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // const userId = await getUserId()
  // const isLoggedIn = !!userId

  useEffect(() => {
    const fetchUser = async () => {
      const userId = await getUserId()
      setIsLoggedIn(!!userId)
    }
    fetchUser()
  }, [])

  const handleLinkClick = (href: string) => {
    setLoading(true)
    startTransition(() => {
      router.push(href)
      setLoading(false)
    })
  }

  return (
    <>
      <div className="min-h-screen bg-black">
        <Header isLoggedIn={isLoggedIn} />
        <main>
          <Hero />

          <section className="py-20 md:py-32 relative overflow-hidden bg-black">
            <div className="absolute top-50 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl" />

            <div className="container relative mx-auto px-4">

              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                  Как это работает
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                  Три простых шага к достижению ваших фитнес-целей
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
                  <div className="relative p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all duration-300">
                    <div className="absolute -top-6 -left-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold shadow-lg shadow-primary/50">
                      1
                    </div>
                    <div className="mt-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Target className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Выбери программу</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Подбери программу тренировок под свои цели: набор массы, похудение или поддержание формы
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative group md:mt-12">
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent to-primary rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
                  <div className="relative p-8 rounded-3xl bg-card border border-border hover:border-accent/50 transition-all duration-300">
                    <div className="absolute -top-6 -left-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center text-2xl font-bold shadow-lg shadow-accent/50">
                      2
                    </div>
                    <div className="mt-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Zap className="w-8 h-8 text-accent" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Тренируйся</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Следуй программе, изучай технику упражнений и записывай результаты в дневник тренировок
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
                  <div className="relative p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all duration-300">
                    <div className="absolute -top-6 -left-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold shadow-lg shadow-primary/50">
                      3
                    </div>
                    <div className="mt-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <TrendingUp className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Отслеживай прогресс</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Анализируй статистику, смотри графики роста и достигай новых результатов каждую неделю
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 md:py-32 relative overflow-hidden bg-black">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl" />

            <div className="container relative mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                      Всё для твоего успеха
                    </h2>
                    <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                      SmartFit — это не просто приложение для тренировок. Это твой персональный тренер, который всегда с
                      тобой.
                    </p>

                    <div className="space-y-4">
                      {[
                        "Персонализированные программы тренировок",
                        "Подробные видео и анимации упражнений",
                        "Дневник с историей прогресса",
                        "Детальная статистика и аналитика",
                        "Отслеживание нагрузки по группам мышц",
                        "Графики роста силовых показателей",
                      ].map((benefit, index) => (
                        <div key={index} className="flex items-start gap-3 group">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                          </div>
                          <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-10">
                      <Link
                        href="/programs"
                        onClick={(e) => {
                          e.preventDefault()
                          handleLinkClick("/programs")
                        }}
                      >
                        <Button size="lg" className="text-lg px-8 py-6 group relative overflow-hidden">
                          <span className="relative z-10 flex items-center">
                            Попробовать сейчас
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
                    <div className="relative grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all hover:scale-105 cursor-pointer">
                          <Dumbbell className="w-10 h-10 text-primary mb-3" />
                          <div className="text-2xl font-bold mb-1">50+</div>
                          <div className="text-sm text-muted-foreground">Программ</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all hover:scale-105 cursor-pointer">
                          <Calendar className="w-10 h-10 text-accent mb-3" />
                          <div className="text-2xl font-bold mb-1">24/7</div>
                          <div className="text-sm text-muted-foreground">Доступ</div>
                        </div>
                      </div>
                      <div className="space-y-4 mt-8">
                        <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all hover:scale-105 cursor-pointer">
                          <BookOpen className="w-10 h-10 text-primary mb-3" />
                          <div className="text-2xl font-bold mb-1">100+</div>
                          <div className="text-sm text-muted-foreground">Упражнений</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all hover:scale-105 cursor-pointer">
                          <TrendingUp className="w-10 h-10 text-accent mb-3" />
                          <div className="text-2xl font-bold mb-1">100%</div>
                          <div className="text-sm text-muted-foreground">Результат</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24 relative overflow-hidden bg-black">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

            <div className="container relative mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                  Возможности SmartFit
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                  Все инструменты для достижения ваших фитнес-целей в одном приложении
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link
                  href="/programs"
                  onClick={(e) => {
                    e.preventDefault()
                    handleLinkClick("/programs")
                  }}
                  className="group"
                >
                  <div className="relative h-full p-8 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <Dumbbell className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Программы</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Готовые программы тренировок для разных целей и уровней подготовки
                      </p>
                      <div className="flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Перейти <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/exercises"
                  onClick={(e) => {
                    e.preventDefault()
                    handleLinkClick("/exercises")
                  }}
                  className="group"
                >
                  <div className="relative h-full p-8 rounded-2xl border border-border bg-card hover:border-accent/50 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-2 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-primary mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <BookOpen className="h-8 w-8 text-accent-foreground" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors">Упражнения</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Библиотека упражнений с анимациями и подробной техникой выполнения
                      </p>
                      <div className="flex items-center text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Перейти <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/diary"
                  onClick={(e) => {
                    e.preventDefault()
                    handleLinkClick("/diary")
                  }}
                  className="group"
                >
                  <div className="relative h-full p-8 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <Calendar className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Дневник</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Записывайте тренировки и отслеживайте свой прогресс каждый день
                      </p>
                      <div className="flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Перейти <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/stats"
                  onClick={(e) => {
                    e.preventDefault()
                    handleLinkClick("/stats")
                  }}
                  className="group"
                >
                  <div className="relative h-full p-8 rounded-2xl border border-border bg-card hover:border-accent/50 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-2 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-primary mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <TrendingUp className="h-8 w-8 text-accent-foreground" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors">Статистика</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Анализируйте результаты и визуализируйте свои достижения
                      </p>
                      <div className="flex items-center text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Перейти <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="text-center mt-16">
                <Link
                  href="/programs"
                  onClick={(e) => {
                    e.preventDefault()
                    handleLinkClick("/programs")
                  }}
                >
                  <Button size="lg" className="text-lg px-10 py-6 group relative overflow-hidden">
                    <span className="relative z-10 flex items-center">
                      Начать тренировки
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
      <LoadingOverlay show={loading || isPending} />
    </>
  )
}
