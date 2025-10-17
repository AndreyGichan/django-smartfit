import { Header } from "@/components/header"
import { ExercisesSection } from "@/components/exercises-section"
import apiService from "@/services/apiService"
import { getUserId } from "@/lib/actions"

export default async function ExercisesPage() {
  const userId = await getUserId()
  const isLoggedIn = !!userId
  const data = await apiService.get("/api/exercises/")

  const grouped: Record<string, any[]> = {}
  data.forEach((ex: any) => {
    if (!grouped[ex.muscle_group]) grouped[ex.muscle_group] = []
    grouped[ex.muscle_group].push(ex)
  })

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute top-40 left-20 w-80 h-80 bg-green-500/15 rounded-full blur-3xl" />
      </div>

      <Header isLoggedIn={isLoggedIn} />
      <main className="relative py-12 md:py-16">
        <div className="container mx-auto px-4 mb-18">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-block">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 bg-clip-text text-transparent">
                Библиотека упражнений
              </h1>
              <div className="h-1 w-32 mx-auto bg-gradient-to-r from-emerald-400 to-green-500 rounded-full" />
            </div>
            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Изучите правильную технику выполнения упражнений с помощью анимаций и подробных инструкций
            </p>
          </div>
        </div>
        <ExercisesSection initialData={grouped} />
      </main>
    </div>
  )
}
