import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, Flame, Heart, Zap } from "lucide-react"

const programs = [
  {
    id: 1,
    title: "Похудение",
    description: "Эффективная программа для сжигания жира и улучшения рельефа",
    icon: Flame,
    duration: "8 недель",
    level: "Начальный",
    workouts: "4 раза в неделю",
    image: "/weight-loss-workout.png",
  },
  {
    id: 2,
    title: "Набор массы",
    description: "Программа для роста мышечной массы и силовых показателей",
    icon: Target,
    duration: "12 недель",
    level: "Средний",
    workouts: "5 раз в неделю",
    image: "/muscle-building-gym.jpg",
  },
  {
    id: 3,
    title: "Выносливость",
    description: "Развитие кардио и функциональной выносливости",
    icon: Heart,
    duration: "6 недель",
    level: "Любой",
    workouts: "3-4 раза в неделю",
    image: "/cardio-endurance-training.jpg",
  },
  {
    id: 4,
    title: "Поддержание формы",
    description: "Сбалансированная программа для поддержания результатов",
    icon: Zap,
    duration: "Постоянно",
    level: "Средний",
    workouts: "3 раза в неделю",
    image: "/fitness-maintenance-workout.jpg",
  },
]

export function ProgramsSection() {
  return (
    <section id="programs" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            Программы тренировок
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Выбери программу под свою цель и уровень подготовки
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {programs.map((program) => {
            const Icon = program.icon
            return (
              <Card key={program.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="relative h-48 md:h-56 overflow-hidden bg-muted">
                  <img
                    src={program.image || "/placeholder.svg"}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary shadow-lg">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">{program.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{program.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Длительность</p>
                      <p className="text-sm font-semibold">{program.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Уровень</p>
                      <p className="text-sm font-semibold">{program.level}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Частота</p>
                      <p className="text-sm font-semibold">{program.workouts}</p>
                    </div>
                  </div>
                  <Button className="w-full">Выбрать программу</Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
