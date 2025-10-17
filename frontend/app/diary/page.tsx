import { Header } from "@/components/header"
import { DiarySection } from "@/components/diary-section"
import apiService from "@/services/apiService";
import { DiaryAccessDialog } from "@/components/diary-access-dialog"

export default async function DiaryPage() {
  let profile = null
  let isLoggedIn = false
  let workouts: any[] = []
  let selectedProgram: any = null

  try {
    profile = await apiService.get("/api/auth/profile/");
    isLoggedIn = !!profile.id
  } catch {
    isLoggedIn = false
  }

  if (isLoggedIn) {
    const allPrograms = await apiService.get("/api/programs/");

    const selectedProgramId = profile.selected_program?.id || null;
    if (selectedProgramId) {
      try {
        selectedProgram = await apiService.get(`/api/programs/${selectedProgramId}/`);
      } catch (error) {
        console.error("Ошибка загрузки программы:", error);
      }
    }

    const allWorkouts = await apiService.get("/api/workouts/");
    workouts = allWorkouts
      .filter((w: any) => w.user === profile.id)
      .map((w: any) => {
        const programObj = allPrograms.find((p: any) => p.id === w.program);
        return {
          ...w,
          program: programObj?.name || "",
          programId: programObj?.id || null,
          programDay: programObj?.program_workouts.find(
            (d: any) => d.id.toString() === w.program_workout?.toString()
          )?.name,
        };
      });
  }
  return (
    <div className="min-h-screen">
      <Header isLoggedIn={isLoggedIn} />
      {isLoggedIn ? (
        <main className="py-12 md:py-16">
          <DiarySection initialWorkouts={workouts} selectedProgram={selectedProgram} />
        </main>
      ) : (
        <DiaryAccessDialog />
      )}
    </div>
  )
}
