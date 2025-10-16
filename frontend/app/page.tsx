import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Button } from "@/components/ui/button"
import { Dumbbell, BookOpen, Calendar, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"
import { getUserId } from "@/lib/actions"

export default async function HomePage() {
  const userId = await getUserId()
  const isLoggedIn = !!userId

  return (
    <div className="min-h-screen bg-black">
      <Header isLoggedIn={isLoggedIn}/>
      <main>
        <Hero />

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
              <Link href="/programs" className="group">
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

              <Link href="/exercises" className="group">
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

              <Link href="/diary" className="group">
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

              <Link href="/stats" className="group">
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
              <Link href="/programs">
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
  )
}
