"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Calendar, Zap, Sparkles } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative overflow-hidden py-20 md:py-32 bg-black">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="container relative mx-auto px-4">
        <div
          className={`mx-auto max-w-4xl text-center transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-pulse-glow">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Новое поколение фитнес-приложений</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance">
            Достигай своих{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
              фитнес-целей
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 text-pretty leading-relaxed max-w-2xl mx-auto">
            Персональные программы тренировок, дневник прогресса и библиотека упражнений с правильной техникой
            выполнения
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/programs">
              <Button size="lg" className="text-base group relative overflow-hidden">
                <span className="relative z-10 flex items-center">
                  Начать тренировки
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
            <Link href="/exercises">
              <Button
                size="lg"
                variant="outline"
                className="text-base group glass-effect hover:scale-105 transition-all bg-transparent"
              >
                Узнать больше
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            <div className="group relative p-6 rounded-2xl glass-effect hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent mb-4 mx-auto group-hover:rotate-12 transition-transform">
                  <TrendingUp className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-lg mb-2">Отслеживай прогресс</h3>
                <p className="text-sm text-muted-foreground">Визуализация результатов в реальном времени</p>
              </div>
            </div>

            <div
              className="group relative p-6 rounded-2xl glass-effect hover:scale-105 transition-all duration-300 cursor-pointer"
              style={{ transitionDelay: "100ms" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-primary mb-4 mx-auto group-hover:rotate-12 transition-transform">
                  <Calendar className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="font-bold text-lg mb-2">Веди дневник</h3>
                <p className="text-sm text-muted-foreground">Полная история всех тренировок</p>
              </div>
            </div>

            <div
              className="group relative p-6 rounded-2xl glass-effect hover:scale-105 transition-all duration-300 cursor-pointer"
              style={{ transitionDelay: "200ms" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent mb-4 mx-auto group-hover:rotate-12 transition-transform">
                  <Zap className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-lg mb-2">Персональные программы</h3>
                <p className="text-sm text-muted-foreground">Адаптированы под твои цели</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
