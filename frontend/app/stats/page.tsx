import { Header } from "@/components/header"
import { StatsSection } from "@/components/stats-section"

export default function StatsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 md:py-16">
        <div className="container mx-auto px-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Статистика и прогресс</h1>
          <p className="text-muted-foreground text-lg max-w-3xl">
            Анализируйте свои результаты и отслеживайте достижения
          </p>
        </div>
        <StatsSection />
      </main>
    </div>
  )
}
