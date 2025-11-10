"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Info } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ExerciseModal from "./exercise-modal"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const muscleLabels: Record<string, string> = {
  chest: "Грудь",
  back: "Спина",
  legs: "Ноги",
  arms: "Руки",
  shoulders: "Плечи",
  core: "Пресс",
}

const difficultyLabels: Record<string, string> = {
  beginner: "Начальный",
  medium: "Средний",
  advanced: "Продвинутый",
}

interface Exercise {
  id: string
  name: string
  description: string
  muscle_group: string
  equipment_needed?: string
  image_url?: string | null
  video_url?: string | null
  technique?: string[] | null
  difficulty?: string
}

export function ExercisesSection({ initialData }: { initialData: Record<string, Exercise[]> }) {
  const [exercises] = useState(initialData)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  if (!Object.keys(exercises).length) {
    return (
      <section className="py-16 text-center">
        <p className="text-muted-foreground">Нет доступных упражнений</p>
      </section>
    )
  }

  const filteredExercises = Object.fromEntries(
    Object.entries(exercises).map(([group, list]) => [
      group,
      list.filter((ex) =>
        ex.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    ])
  )

  return (
    <section id="exercises" className="py-6 md:py-6 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <div className="mt-6 flex justify-center items-center gap-2 w-full mx-auto">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Поиск упражнений..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <Tabs defaultValue={Object.keys(exercises)[0] || "chest"} className="w-full">
          <TabsList className="flex flex-wrap justify-center gap-2 w-full max-w-2xl mx-auto mb-8 h-auto p-2">

            {Object.keys(exercises).map((group) => (
              <TabsTrigger key={group} value={group}>
                {muscleLabels[group] || group}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(filteredExercises).map(([group, list]) => (
            <TabsContent key={group} value={group}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {list.map((exercise) => (
                  <Card key={exercise.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="relative h-48 overflow-hidden bg-muted">
                      <img
                        src={exercise.image_url || "/placeholder.svg"}
                        alt={exercise.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                        {exercise.difficulty ? difficultyLabels[exercise.difficulty] || exercise.difficulty : ""}
                      </Badge>
                      <Button
                        size="icon"
                        className="absolute bottom-3 right-3 rounded-full"
                        onClick={() => setSelectedExercise(exercise)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl">{exercise.name}</CardTitle>
                      <CardDescription>{exercise.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{exercise.equipment_needed || "Без оборудования"}</span>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedExercise(exercise)}>
                          <Info className="h-4 w-4 mr-2" />
                          Техника
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        <ExerciseModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
      </div>
    </section>
  )
}
