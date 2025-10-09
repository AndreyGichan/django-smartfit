import { Header } from "@/components/header"
import { DiarySection } from "@/components/diary-section"

export default function DiaryPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 md:py-16">
        <div className="container mx-auto px-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Дневник тренировок</h1>
          <p className="text-muted-foreground text-lg max-w-3xl">Записывайте свои тренировки и отслеживайте прогресс</p>
        </div>
        <DiarySection />
      </main>
    </div>
  )
}
