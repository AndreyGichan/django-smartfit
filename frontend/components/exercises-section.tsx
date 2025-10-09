"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Info } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const exercises = {
  chest: [
    {
      id: 1,
      name: "Жим штанги лежа",
      description: "Базовое упражнение для развития грудных мышц",
      difficulty: "Средний",
      muscleGroup: "Грудь",
      equipment: "Штанга, скамья",
      image: "/bench-press-exercise.png",
      animation: "/bench-press-animation.png",
      technique: [
        "Лягте на скамью, ноги упираются в пол",
        "Возьмите штангу хватом чуть шире плеч",
        "Опустите штангу к груди, локти под углом 45°",
        "Выжмите штангу вверх, не отрывая лопатки",
      ],
    },
    {
      id: 2,
      name: "Отжимания",
      description: "Классическое упражнение с собственным весом",
      difficulty: "Начальный",
      muscleGroup: "Грудь",
      equipment: "Нет",
      image: "/push-ups-exercise.png",
      animation: "/push-ups-animation.jpg",
      technique: [
        "Примите упор лежа, руки на ширине плеч",
        "Тело образует прямую линию",
        "Опуститесь вниз, сгибая локти",
        "Вернитесь в исходное положение",
      ],
    },
  ],
  back: [
    {
      id: 3,
      name: "Подтягивания",
      description: "Лучшее упражнение для спины",
      difficulty: "Средний",
      muscleGroup: "Спина",
      equipment: "Турник",
      image: "/pull-ups-exercise.png",
      animation: "/pull-ups-animation.jpg",
      technique: [
        "Возьмитесь за перекладину хватом сверху",
        "Подтянитесь, сводя лопатки",
        "Подбородок выше перекладины",
        "Плавно опуститесь вниз",
      ],
    },
    {
      id: 4,
      name: "Тяга штанги в наклоне",
      description: "Базовое упражнение для толщины спины",
      difficulty: "Средний",
      muscleGroup: "Спина",
      equipment: "Штанга",
      image: "/barbell-row.png",
      animation: "/barbell-row-animation.jpg",
      technique: [
        "Наклонитесь вперед, спина прямая",
        "Возьмите штангу хватом сверху",
        "Подтяните штангу к поясу",
        "Сведите лопатки в верхней точке",
      ],
    },
  ],
  legs: [
    {
      id: 5,
      name: "Приседания со штангой",
      description: "Король упражнений для ног",
      difficulty: "Средний",
      muscleGroup: "Ноги",
      equipment: "Штанга",
      image: "/barbell-squat.png",
      animation: "/barbell-squat-animation.jpg",
      technique: [
        "Штанга на верхней части спины",
        "Ноги на ширине плеч",
        "Присядьте до параллели с полом",
        "Вернитесь в исходное положение",
      ],
    },
  ],
}

export function ExercisesSection() {
  const [selectedExercise, setSelectedExercise] = useState<any>(null)

  return (
    <section id="exercises" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            Библиотека упражнений
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Изучай правильную технику выполнения с анимациями и подробными инструкциями
          </p>
        </div>

        <Tabs defaultValue="chest" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="chest">Грудь</TabsTrigger>
            <TabsTrigger value="back">Спина</TabsTrigger>
            <TabsTrigger value="legs">Ноги</TabsTrigger>
          </TabsList>

          {Object.entries(exercises).map(([category, exerciseList]) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exerciseList.map((exercise) => (
                  <Card key={exercise.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="relative h-48 overflow-hidden bg-muted">
                      <img
                        src={exercise.image || "/placeholder.svg"}
                        alt={exercise.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                        {exercise.difficulty}
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
                        <span className="text-sm text-muted-foreground">{exercise.equipment}</span>
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

        <Dialog open={!!selectedExercise} onOpenChange={() => setSelectedExercise(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedExercise?.name}</DialogTitle>
              <DialogDescription>{selectedExercise?.description}</DialogDescription>
            </DialogHeader>

            {selectedExercise && (
              <div className="space-y-6">
                <div className="relative h-64 md:h-80 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={selectedExercise.animation || "/placeholder.svg"}
                    alt={`${selectedExercise.name} animation`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Сложность</p>
                    <Badge variant="secondary">{selectedExercise.difficulty}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Оборудование</p>
                    <p className="text-sm font-medium">{selectedExercise.equipment}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Правильная техника выполнения:</h3>
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
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
