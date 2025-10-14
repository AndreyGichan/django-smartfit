import { Header } from "@/components/header"
import { DiarySection } from "@/components/diary-section"
import apiService from "@/services/apiService";

export default async function DiaryPage() {
  const profile = await apiService.get("/api/auth/profile/");
  const userId = profile.id;

  const selectedProgramId = profile.selected_program?.id || null;
  let selectedProgram = null;
  if (selectedProgramId) {
    try {
      selectedProgram = await apiService.get(`/api/programs/${selectedProgramId}/`);
    } catch (error) {
      console.error("Ошибка загрузки программы:", error);
    }
  }

  const allWorkouts = await apiService.get("/api/workouts/");
  let workouts = allWorkouts.filter((w: any) => w.user === userId);
  if (selectedProgram) {
    workouts = workouts.map((w: any) => ({
      ...w,
      program: w.program === selectedProgram.id ? selectedProgram.name : w.program,
      programId: w.program === selectedProgram.id ? selectedProgram.id : undefined,
      programDay: selectedProgram.program_workouts.find(
        (d: any) => d.id.toString() === w.program_workout?.toString()
      )?.name,

    }));
  }
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 md:py-16">
        <div className="container mx-auto px-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Дневник тренировок</h1>
          <p className="text-muted-foreground text-lg max-w-3xl">Записывайте свои тренировки и отслеживайте прогресс</p>
        </div>
        <DiarySection initialWorkouts={workouts} selectedProgram={selectedProgram} />
      </main>
    </div>
  )
}
