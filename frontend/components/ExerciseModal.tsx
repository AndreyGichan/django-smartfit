'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface Exercise {
  id?: string
  name: string
  description?: string
  image?: string | null
  video?: string | null
  technique?: string[] | null
  difficulty?: string
  equipment_needed?: string
}

interface ExerciseModalProps {
  exercise: Exercise | null
  onClose: () => void
}

const difficultyLabels: Record<string, string> = {
  beginner: "Начальный",
  medium: "Средний",
  advanced: "Продвинутый",
}

export default function ExerciseModal({ exercise, onClose }: ExerciseModalProps) {
  if (!exercise) return null

  const baseUrl = process.env.NEXT_PUBLIC_API_HOST || ""

  return (
    <Dialog open={!!exercise} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{exercise.name}</DialogTitle>
          <DialogDescription>{exercise.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Видео или изображение */}
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden bg-muted">
            {exercise.video ? (
              <video
                src={`${baseUrl}${exercise.video}`}
                controls
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <img
                src={exercise.image ? `${baseUrl}${exercise.image}` : "/placeholder.svg"}
                alt={exercise.name}
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>

          {/* Сложность и оборудование */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Сложность</p>
              <Badge variant="secondary">
                {exercise.difficulty ? difficultyLabels[exercise.difficulty] || exercise.difficulty : ""}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Оборудование</p>
              <p className="text-sm font-medium">{exercise.equipment_needed || "Без оборудования"}</p>
            </div>
          </div>

          {/* Техника */}
          <div>
            <h3 className="font-semibold mb-3">Правильная техника выполнения:</h3>
            {exercise.technique && exercise.technique.length > 0 ? (
              <ol className="space-y-2">
                {exercise.technique.map((step, index) => (
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
      </DialogContent>
    </Dialog>
  )
}
