"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { ProgramsSection } from "@/components/programs-section"
import apiService from "@/services/apiService"
import { getUserId } from "@/lib/actions"
import { Wand } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProgramsPage() {
  // const userId = await getUserId()
  // const isLoggedIn = !!userId
  // const programs = await apiService.get("/api/programs/")

  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRecommendedApplied, setIsRecommendedApplied] = useState(false);

  const loadAllPrograms = async () => {
    setLoading(true)
    try {
      const data = await apiService.get("/api/programs/")
      setPrograms(data)
      setIsRecommendedApplied(false)
    } catch (error) {
      console.error("Ошибка при получении всех программ:", error)
    }
    setLoading(false)
  }

  // Загрузка рекомендованных программ
  const fetchRecommendedPrograms = async () => {
    setLoading(true)
    try {
      const data = await apiService.get("/api/programs/recommended/")
      setPrograms(data)
      setIsRecommendedApplied(true)
    } catch (error) {
      console.error("Ошибка при получении рекомендованных программ:", error)
    }
    setLoading(false)
  }

  useEffect(() => {
    const init = async () => {
      const userId = await getUserId()
      setIsLoggedIn(!!userId)
      await loadAllPrograms()
    }
    init()
  }, [])

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-80 h-80 bg-green-500/15 rounded-full blur-3xl" />
      </div>

      <Header isLoggedIn={isLoggedIn} />

      {/* <main className="py-12 md:py-16">
        <div className="container mx-auto px-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Программы тренировок</h1>
            <p className="text-muted-foreground text-lg max-w-3xl">
              Выберите программу под свою цель и уровень подготовки
            </p>
          </div>
          {isLoggedIn && (
            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={fetchRecommendedPrograms}
                className={`relative transition-all duration-200 ${isRecommendedApplied
                    ? "bg-primary/80 shadow-inner scale-95 cursor-default"
                    : "hover:scale-105 hover:shadow-md active:scale-95"
                  }`}
              >
                <Wand className="mr-2 h-5 w-5" />
                {isRecommendedApplied ? "Подбор применен" : "Подбор на основе профиля"}
              </Button>
              <Button size="lg" variant="outline" onClick={loadAllPrograms}>
                Сбросить
              </Button>
            </div>
          )}
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground py-16">Загрузка...</p>
        ) : (
          <ProgramsSection programs={programs} />
        )}
      </main> */}
      <main className="relative py-12 md:py-16">
        <div className="container mx-auto px-4 mb-12">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-block">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 bg-clip-text text-transparent">
                Программы тренировок
              </h1>
              <div className="h-1 w-32 mx-auto bg-gradient-to-r from-emerald-400 to-green-500 rounded-full" />
            </div>
            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Выберите программу под свою цель и уровень подготовки. Каждая программа разработана профессиональными тренерами.
            </p>
          </div>

          {isLoggedIn && (
            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <Button
                size="lg"
                onClick={fetchRecommendedPrograms}
                className={`relative transition-all duration-200 ${isRecommendedApplied
                    ? "bg-primary/80 shadow-inner scale-95 cursor-default"
                    : "hover:scale-105 hover:shadow-md active:scale-95"
                  }`}
              >
                <Wand className="mr-2 h-5 w-5" />
                {isRecommendedApplied ? "Подбор применен" : "Подбор на основе профиля"}
              </Button>
              <Button size="lg" variant="outline" onClick={loadAllPrograms}>
                Сбросить
              </Button>
            </div>
          )}
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground py-16">Загрузка...</p>
        ) : (
          <ProgramsSection programs={programs} />
        )}
      </main>
    </div>
  )
}
