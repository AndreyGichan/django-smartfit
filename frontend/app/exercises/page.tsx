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
    <div className="min-h-screen">
      <Header isLoggedIn={isLoggedIn} />
      <main className="py-12 md:py-16">
        <div className="container mx-auto px-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Библиотека упражнений</h1>
          <p className="text-muted-foreground text-lg max-w-3xl">
            Изучите правильную технику выполнения упражнений с помощью анимаций и подробных инструкций
          </p>
        </div>
        <ExercisesSection initialData={grouped} />
      </main>
    </div>
  )
}
