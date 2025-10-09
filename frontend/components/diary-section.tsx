"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Plus, Edit2, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type WorkoutEntry = {
  id: number
  date: string
  exercise: string
  sets: number
  reps: number
  weight: number
  notes: string
}

export function DiarySection() {
  const [entries, setEntries] = useState<WorkoutEntry[]>([
    {
      id: 1,
      date: "2025-01-08",
      exercise: "Жим штанги лежа",
      sets: 4,
      reps: 10,
      weight: 80,
      notes: "Хорошая тренировка, чувствую прогресс",
    },
    {
      id: 2,
      date: "2025-01-08",
      exercise: "Приседания",
      sets: 3,
      reps: 12,
      weight: 100,
      notes: "",
    },
    {
      id: 3,
      date: "2025-01-06",
      exercise: "Подтягивания",
      sets: 4,
      reps: 8,
      weight: 0,
      notes: "С собственным весом",
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    exercise: "",
    sets: "",
    reps: "",
    weight: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newEntry: WorkoutEntry = {
      id: Date.now(),
      date: formData.date,
      exercise: formData.exercise,
      sets: Number(formData.sets),
      reps: Number(formData.reps),
      weight: Number(formData.weight),
      notes: formData.notes,
    }
    setEntries([newEntry, ...entries])
    setFormData({
      date: new Date().toISOString().split("T")[0],
      exercise: "",
      sets: "",
      reps: "",
      weight: "",
      notes: "",
    })
    setIsDialogOpen(false)
  }

  const deleteEntry = (id: number) => {
    setEntries(entries.filter((entry) => entry.id !== id))
  }

  return (
    <section id="diary" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
              Дневник тренировок
            </h2>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              Записывай свои тренировки и отслеживай прогресс
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="shrink-0">
                <Plus className="mr-2 h-5 w-5" />
                Добавить запись
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Новая запись тренировки</DialogTitle>
                <DialogDescription>Добавь информацию о выполненном упражнении</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Дата</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exercise">Упражнение</Label>
                  <Input
                    id="exercise"
                    placeholder="Например: Жим штанги лежа"
                    value={formData.exercise}
                    onChange={(e) => setFormData({ ...formData, exercise: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sets">Подходы</Label>
                    <Input
                      id="sets"
                      type="number"
                      min="1"
                      placeholder="4"
                      value={formData.sets}
                      onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reps">Повторы</Label>
                    <Input
                      id="reps"
                      type="number"
                      min="1"
                      placeholder="10"
                      value={formData.reps}
                      onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Вес (кг)</Label>
                    <Input
                      id="weight"
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="80"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Заметки (опционально)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Как прошла тренировка?"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Сохранить запись
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {entries.map((entry) => (
            <Card key={entry.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{entry.exercise}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(entry.date).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
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
                <div className="flex flex-wrap gap-6 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Подходы</p>
                    <p className="text-lg font-semibold">{entry.sets}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Повторы</p>
                    <p className="text-lg font-semibold">{entry.reps}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Вес</p>
                    <p className="text-lg font-semibold">{entry.weight} кг</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Объем</p>
                    <p className="text-lg font-semibold">{entry.sets * entry.reps * entry.weight} кг</p>
                  </div>
                </div>
                {entry.notes && (
                  <p className="text-sm text-muted-foreground italic border-l-2 border-primary pl-3">{entry.notes}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
