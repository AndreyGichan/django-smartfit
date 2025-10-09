import { Header } from "@/components/header"
import { ExercisesSection } from "@/components/exercises-section"

export default function ExercisesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 md:py-16">
        <div className="container mx-auto px-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Библиотека упражнений</h1>
          <p className="text-muted-foreground text-lg max-w-3xl">
            Изучите правильную технику выполнения упражнений с помощью анимаций и подробных инструкций
          </p>
        </div>
        <ExercisesSection />
      </main>
    </div>
  )
}
