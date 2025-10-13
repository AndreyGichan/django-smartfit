import { Header } from "@/components/header"
import { ProgramsSection } from "@/components/programs-section"
import apiService from "@/services/apiService"

export default async function ProgramsPage() {
  const programs = await apiService.get("/api/programs/")
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 md:py-16">
        <div className="container mx-auto px-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Программы тренировок</h1>
          <p className="text-muted-foreground text-lg max-w-3xl">
            Выберите программу, которая соответствует вашим целям и уровню подготовки
          </p>
        </div>
        <ProgramsSection programs={programs}/>
      </main>
    </div>
  )
}
