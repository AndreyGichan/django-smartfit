"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Info } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ExerciseModal from "./ExerciseModal"

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
  image?: string | null
  video?: string | null
  technique?: string[] | null
  difficulty?: string
}

export function ExercisesSection({ initialData }: { initialData: Record<string, Exercise[]> }) {
  const [exercises] = useState(initialData)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)

  if (!Object.keys(exercises).length) {
    return (
      <section className="py-16 text-center">
        <p className="text-muted-foreground">Нет доступных упражнений</p>
      </section>
    )
  }

  return (
    <section id="exercises" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            Библиотека упражнений
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Изучай правильную технику выполнения упражнений
          </p>
        </div>

        <Tabs defaultValue={Object.keys(exercises)[0] || "chest"} className="w-full">
          {/* <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8"> */}
          <TabsList className="grid w-full mx-auto grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2 mb-8">

            {Object.keys(exercises).map((group) => (
              <TabsTrigger key={group} value={group}>
                {muscleLabels[group] || group}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(exercises).map(([group, list]) => (
            <TabsContent key={group} value={group}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {list.map((exercise) => (
                  <Card key={exercise.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="relative h-48 overflow-hidden bg-muted">
                      <img
                        src={
                          exercise.image
                            ? `${process.env.NEXT_PUBLIC_API_HOST}${exercise.image}`
                            : "/placeholder.svg"
                        }
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
        {/* <Dialog open={!!selectedExercise} onOpenChange={() => setSelectedExercise(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedExercise?.name}</DialogTitle>
              <DialogDescription>{selectedExercise?.description}</DialogDescription>
            </DialogHeader>

            {selectedExercise && (
              <div className="space-y-6">
                <div className="relative h-64 md:h-80 rounded-lg overflow-hidden bg-muted">
                  {selectedExercise.video ? (
                    <video
                      src={`${process.env.NEXT_PUBLIC_API_HOST}${selectedExercise.video}`}
                      controls
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <img
                      src={selectedExercise.image ? `${process.env.NEXT_PUBLIC_API_HOST}${selectedExercise.image}` : "/placeholder.svg"}
                      alt={selectedExercise.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Сложность</p>
                    <Badge variant="secondary">
                      {selectedExercise.difficulty ? difficultyLabels[selectedExercise.difficulty] || selectedExercise.difficulty : ""}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Оборудование</p>
                    <p className="text-sm font-medium">
                      {selectedExercise.equipment_needed || "Без оборудования"}
                    </p>
                  </div>
                </div>



                <div>
                  <h3 className="font-semibold mb-3">Правильная техника выполнения:</h3>
                  {selectedExercise.technique && selectedExercise.technique.length > 0 ? (
                    <ol className="space-y-2">
                      {selectedExercise.technique.map((step: string, index: number) => (
                        <li key={index} className="flex gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                            {index + 1}
                          </span>
                          <span className="text-sm leading-relaxed pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-sm text-muted-foreground">Техника пока не добавлена</p>
                  )}

                </div>
              </div>
            )}
          </DialogContent>
        </Dialog> */}
      </div>
    </section>
  )
}
