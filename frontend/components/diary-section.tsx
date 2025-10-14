"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Plus, Edit2, Trash2, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import apiService from "@/services/apiService"
import Link from "next/link";


type ExerciseEntry = {
  id: string
  name: string
  sets: number
  reps: number
  weight?: number
  exercise?: { name: string }
}

type WorkoutEntry = {
  id: string
  date: string
  notes: string
  duration?: string
  program?: string
  programId?: string
  programDay?: string
  programWorkoutId?: string
  exercises: ExerciseEntry[]
}

type ExerciseFormData = {
  id: string
  name: string
  sets: string
  reps: string
  weight: string
}

interface DiarySectionProps {
  initialWorkouts: WorkoutEntry[];
  selectedProgram?: { id: string; name: string; program_workouts: { id: string; name: string }[] }
}

export function DiarySection({ initialWorkouts, selectedProgram }: DiarySectionProps) {
  const [entries, setEntries] = useState<WorkoutEntry[]>(() =>
    initialWorkouts.map(w => ({
      ...w,
      exercises: w.exercises.map(ex => ({
        id: ex.id,
        name: ex.exercise ? ex.exercise.name : ex.name,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight
      }))
    }))
  )


  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isExerciseDialogOpen, setIsExerciseDialogOpen] = useState(false)
  const [mode, setMode] = useState<"manual" | "program" | "">("")
  const [selectedProgramDay, setSelectedProgramDay] = useState<string | null>(null)
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    notes: "",
    duration: "",
  })
  const [exerciseData, setExerciseData] = useState<ExerciseFormData>({
    id: "",
    name: "",
    sets: "",
    reps: "",
    weight: "",
  })
  const [exerciseType, setExerciseType] = useState<"custom" | "existing">("custom")
  const [availableExercises, setAvailableExercises] = useState<{ id: string; name: string }[]>([])
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [isEditExerciseMode, setIsEditExerciseMode] = useState(false);


  useEffect(() => {
    async function fetchExercises() {
      try {
        const data = await apiService.get("/api/exercises/")
        const exercises = data.map((ex: any) => ({ id: ex.id, name: ex.name }))
        setAvailableExercises(exercises)
      } catch (error) {
        console.error("Ошибка загрузки упражнений:", error)
      }
    }
    fetchExercises()
  }, [])

  const handleSaveWorkout = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload: any = {
        date: formData.date,
        notes: formData.notes,
        duration: formData.duration || "",
      }

      if (mode === "program" && selectedProgramDay) {
        payload.program = selectedProgram?.id;
        payload.program_workout = selectedProgramDay;
      }


      let savedWorkout;
      if (isEditMode && selectedWorkoutId) {
        savedWorkout = await apiService.put(`/api/workouts/${selectedWorkoutId}/update/`, payload);
      } else {
        savedWorkout = await apiService.post("/api/workouts/add/", payload);
      }

      const workoutWithProgram = {
        ...savedWorkout,
        duration: savedWorkout.duration || formData.duration || "",
        program: mode === "program" ? selectedProgram?.name : undefined,
        programId: mode === "program" ? selectedProgram?.id : undefined,
        programDay: mode === "program" && selectedProgramDay
          ? selectedProgram?.program_workouts.find(d => d.id.toString() === selectedProgramDay)?.name
          : undefined

      }

      if (isEditMode) {
        setEntries((prev) =>
          prev.map((entry) => (entry.id === selectedWorkoutId ? workoutWithProgram : entry))
        );
      } else {
        setEntries([workoutWithProgram, ...entries]);
      }

      setFormData({ date: new Date().toISOString().split("T")[0], notes: "", duration: "" });
      setMode("");
      setSelectedProgramDay(null);
      setSelectedWorkoutId(null);
      setIsDialogOpen(false);
      setIsEditMode(false);
    } catch (error) {
      console.error("Ошибка добавления тренировки:", error);
    }
  }

  const handleAddExercise = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedWorkoutId) return

    try {
      const data = exerciseType === "custom"
        ? {
          custom_exercise: exerciseData.name,
          sets: Number(exerciseData.sets),
          reps: Number(exerciseData.reps),
          weight: exerciseData.weight === "" ? undefined : Number(exerciseData.weight),
        }
        : {
          exercise_id: exerciseData.id,
          sets: Number(exerciseData.sets),
          reps: Number(exerciseData.reps),
          weight: exerciseData.weight === "" ? undefined : Number(exerciseData.weight),
        }

      const newExercise = await apiService.post(`/api/workouts/${selectedWorkoutId}/exercises/`, data);

      const formattedExercise = {
        id: newExercise.id,
        name: newExercise.exercise ? newExercise.exercise.name : newExercise.name,
        sets: newExercise.sets,
        reps: newExercise.reps,
        weight: newExercise.weight,
      }

      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === selectedWorkoutId
            ? { ...entry, exercises: [...entry.exercises, formattedExercise] }
            : entry
        )
      );

      setExerciseData({ id: "", name: "", sets: "", reps: "", weight: "" });
      setIsExerciseDialogOpen(false);
    } catch (error) {
      console.error("Ошибка добавления упражнения:", error);
    }

  }

  const handleEditExercise = (exercise: ExerciseEntry, workoutId: string) => {
    setSelectedWorkoutId(workoutId);
    setSelectedExerciseId(exercise.id);
    setExerciseData({
      id: exercise.id,
      name: exercise.name,
      sets: exercise.sets.toString(),
      reps: exercise.reps.toString(),
      weight: exercise.weight?.toString() || ""
    });
    setExerciseType("custom"); // или "existing", если есть привязка
    setIsExerciseDialogOpen(true);
    setIsEditExerciseMode(true);
  };

  const handleSaveExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkoutId) return;

    const data: any = exerciseType === "custom"
      ? {
        name: exerciseData.name,
        sets: Number(exerciseData.sets),
        reps: Number(exerciseData.reps),
        weight: exerciseData.weight === "" ? undefined : Number(exerciseData.weight),
      }
      : {
        exercise_id: exerciseData.id,
        sets: Number(exerciseData.sets),
        reps: Number(exerciseData.reps),
        weight: exerciseData.weight === "" ? undefined : Number(exerciseData.weight),
      };

    try {
      let savedExercise: ExerciseEntry;
      if (isEditExerciseMode && selectedExerciseId) {
        savedExercise = await apiService.put(
          `/api/workouts/${selectedWorkoutId}/exercises/${selectedExerciseId}/update/`,
          data
        );
        setEntries(prev =>
          prev.map(entry =>
            entry.id === selectedWorkoutId
              ? {
                ...entry,
                exercises: entry.exercises.map(ex =>
                  ex.id === selectedExerciseId ? savedExercise : ex
                )
              }
              : entry
          )
        );
      } else {
        savedExercise = await apiService.post(`/api/workouts/${selectedWorkoutId}/exercises/`, data);
        setEntries(prev =>
          prev.map(entry =>
            entry.id === selectedWorkoutId
              ? { ...entry, exercises: [...entry.exercises, savedExercise] }
              : entry
          )
        );
      }

      setExerciseData({ id: "", name: "", sets: "", reps: "", weight: "" });
      setIsExerciseDialogOpen(false);
      setIsEditExerciseMode(false);
      setSelectedExerciseId(null);
    } catch (error) {
      console.error("Ошибка сохранения упражнения:", error);
    }
  };



  const filteredEntries = entries.filter((entry) => {
    const query = searchQuery.toLowerCase();
    const combinedText = [
      entry.program?.toLowerCase() || "",
      entry.programDay?.toLowerCase() || "",
      entry.notes?.toLowerCase() || "",
      new Date(entry.date).toLocaleDateString("ru-RU").toLowerCase(),
      ...entry.exercises.map(ex =>
        `${ex.name} ${ex.sets}x${ex.reps} ${ex.weight ?? ""}`.toLowerCase()
      )
    ].join(" ");

    return combinedText.includes(query);
  });


  const handleEditWorkout = (entry: WorkoutEntry) => {
    setSelectedWorkoutId(entry.id);
    setFormData({
      date: entry.date,
      notes: entry.notes || "",
      duration: entry.duration || "",
    });
    setMode(entry.program ? "program" : "manual");
    setSelectedProgramDay(entry.programWorkoutId || null);
    setIsDialogOpen(true);
    setIsEditMode(true);
  };

  const deleteEntry = async (id: string) => {
    const confirmed = window.confirm("Вы уверены, что хотите удалить эту тренировку?");
    if (!confirmed) return;
    try {
      await apiService.delete(`/api/workouts/${id}/delete/`);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Ошибка при удалении тренировки:", error);
      alert("Не удалось удалить тренировку");
    }
  }

  const formatDuration = (durationStr?: string) => {
    if (!durationStr) return "";
    const parts = durationStr.split(":").map(Number);
    let hours = parts[0];
    let minutes = parts[1];
    if (hours === 0) return `${minutes}:${parts[2]} ч`;
    return `${hours}:${minutes.toString().padStart(2, "0")} ч`;
  };

  return (
    <section id="diary" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Заголовок и кнопка */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Дневник тренировок
            </h2>
            <p className="text-lg text-muted-foreground">
              Записывай свои тренировки и добавляй упражнения постепенно
            </p>
          </div>

          {/* Диалог добавления тренировки */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" /> Добавить тренировку
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Новая тренировка</DialogTitle>
                <DialogDescription>
                  Сначала создай тренировку, потом добавь в неё упражнения
                </DialogDescription>
              </DialogHeader>



              {!mode ? (
                <div className="mt-4 flex flex-col gap-3">
                  <Button variant="outline" className="w-full" onClick={() => setMode("program")}>
                    Выбрать день из программы
                  </Button>
                  <Button className="w-full" onClick={() => setMode("manual")}>
                    Свободная тренировка
                  </Button>
                  {/* {selectedProgram && (
                    <Button variant="outline" className="w-full" onClick={() => setMode("program")}>
                      Выбрать день из программы "{selectedProgram.name}"
                    </Button>
                  )} */}
                </div>
              ) : (
                <form onSubmit={handleSaveWorkout} className="space-y-4 mt-4">
                  {mode === "program" && (
                    <div className="space-y-2">
                      <Label>День программы</Label>
                      <Select onValueChange={(value) => setSelectedProgramDay(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выбери день" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedProgram?.program_workouts?.map((day) => (
                            <SelectItem key={day.id} value={day.id}>
                              {day.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="date">Дата</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Заметки</Label>
                    <Textarea
                      id="notes"
                      placeholder="Как прошла тренировка?"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Длительность (мин)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="0"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="Например, 60"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button type="button" variant="outline" onClick={() => setMode("")}>
                      ← Назад
                    </Button>
                    <Button type="submit" className="w-full">
                      {isEditMode ? "Сохранить изменения" : "Сохранить тренировку"}
                    </Button>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>


        <div className="mb-8 flex items-center gap-2">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Поиск по тренировкам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>


        {/* Список тренировок */}
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <Card key={entry.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">
                      Тренировка {new Date(entry.date).toLocaleDateString("ru-RU")}
                      {entry.duration ? ` — ${formatDuration(entry.duration)}` : ""}
                    </CardTitle>
                    {/* <CardDescription>
                      {entry.program
                        ? `По программе "${entry.program}" (${entry.programDay})`
                        : "Свободная тренировка"}
                    </CardDescription> */}
                    <CardDescription>
                      {entry.program ? (
                        <Link
                          href={`/programs/${entry.programId}`}
                          className="text-primary hover:text-accent"
                        >
                          По программе "{entry.program}" ({entry.programDay})
                        </Link>
                      ) : (
                        "Свободная тренировка"
                      )}
                    </CardDescription>

                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditWorkout(entry)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => deleteEntry(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {entry.exercises.length > 0 ? (
                  <div className="space-y-2 mb-3">
                    {entry.exercises.map((ex) => (
                      <div
                        key={ex.id}
                        className="flex items-center justify-between border-b pb-1 text-sm"
                      >
                        <span>{ex.name}</span>
                        <span>
                          {ex.sets}x{ex.reps}
                          {ex.weight !== undefined ? ` — ${ex.weight} кг` : ""}
                          <Button size="icon" variant="ghost" onClick={() => handleEditExercise(ex, entry.id)}>
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={async () => {
                            await apiService.delete(`/api/workouts/${entry.id}/exercises/${ex.id}/delete/`);
                            setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, exercises: e.exercises.filter(ex2 => ex2.id !== ex.id) } : e));
                          }}>
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm mb-3 italic">
                    Упражнения пока не добавлены
                  </p>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedWorkoutId(entry.id)
                    setIsExerciseDialogOpen(true)
                  }}
                >
                  <Plus className="mr-1 h-4 w-4" /> Добавить упражнение
                </Button>

                {entry.notes && (
                  <p className="text-sm text-muted-foreground italic border-l-2 border-primary pl-3 mt-3">
                    {entry.notes}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Диалог добавления упражнения */}
      <Dialog open={isExerciseDialogOpen} onOpenChange={setIsExerciseDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditExerciseMode ? "Редактировать упражнение" : "Добавить упражнение"}
            </DialogTitle>
            <DialogDescription>Введи данные упражнения</DialogDescription>
          </DialogHeader>

          {/* <form onSubmit={handleAddExercise} className="space-y-4 mt-4"> */}
          <form onSubmit={isEditExerciseMode ? handleSaveExercise : handleAddExercise} className="space-y-4 mt-4">

            <div className="space-y-2">
              <Label>Тип упражнения</Label>
              <Select onValueChange={(value) => setExerciseType(value as "custom" | "existing")}>
                <SelectTrigger>
                  <SelectValue placeholder="Выбери тип" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Своё упражнение</SelectItem>
                  <SelectItem value="existing">Из списка</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {exerciseType === "existing" ? (
              <div className="space-y-2">
                <Label>Выбери упражнение</Label>
                <Select onValueChange={(value) => setExerciseData({ ...exerciseData, id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выбери упражнение" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableExercises.map((ex) => (
                      <SelectItem key={ex.id} value={ex.id}>
                        {ex.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Название</Label>
                <Input
                  placeholder="Жим лёжа"
                  value={exerciseData.name}
                  onChange={(e) => setExerciseData({ ...exerciseData, name: e.target.value })}
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Подходы</Label>
                <Input
                  type="number"
                  min="1"
                  value={exerciseData.sets}
                  onChange={(e) => setExerciseData({ ...exerciseData, sets: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Повторы</Label>
                <Input
                  type="number"
                  min="1"
                  value={exerciseData.reps}
                  onChange={(e) => setExerciseData({ ...exerciseData, reps: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Вес (кг)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={exerciseData.weight}
                  onChange={(e) => setExerciseData({ ...exerciseData, weight: e.target.value })}
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Сохранить упражнение
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}

