import { Header } from "@/components/header"
import { DiarySection } from "@/components/diary-section"
import apiService from "@/services/apiService";

export default async function DiaryPage() {
  const profile = await apiService.get("/api/auth/profile/");
  const userId = profile.id;
    const isLoggedIn = !!userId

  const allPrograms = await apiService.get("/api/programs/");

  let selectedProgram = null;
  const selectedProgramId = profile.selected_program?.id || null;
  if (selectedProgramId) {
    try {
      selectedProgram = await apiService.get(`/api/programs/${selectedProgramId}/`);
    } catch (error) {
      console.error("Ошибка загрузки программы:", error);
    }
  }

  const allWorkouts = await apiService.get("/api/workouts/");
  // let workouts = allWorkouts.filter((w: any) => w.user === userId);
  // if (selectedProgram) {
  //   workouts = workouts.map((w: any) => ({
  //     ...w,
  //     program: w.program === selectedProgram.id ? selectedProgram.name : w.program,
  //     programId: w.program === selectedProgram.id ? selectedProgram.id : undefined,
  //     programDay: selectedProgram.program_workouts.find(
  //       (d: any) => d.id.toString() === w.program_workout?.toString()
  //     )?.name,

  //   }));
  // }
    let workouts = allWorkouts
    .filter((w: any) => w.user === userId)
    .map((w: any) => {
      // Находим объект программы для тренировки
      const programObj = allPrograms.find((p: any) => p.id === w.program);
      return {
        ...w,
        program: programObj?.name || "",         // Всегда имя программы
        programId: programObj?.id || null,       // Всегда id программы
        programDay: programObj?.program_workouts.find(
          (d: any) => d.id.toString() === w.program_workout?.toString()
        )?.name,
      };
    });
  return (
    <div className="min-h-screen">
      <Header isLoggedIn={isLoggedIn}/>
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
