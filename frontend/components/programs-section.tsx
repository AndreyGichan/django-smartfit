import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Target, Flame, Heart, Zap } from "lucide-react"
import Link from "next/link"


interface Program {
  id: string
  name: string
  description: string
  level: string
  goal?: string
  training_type?: string | null
  frequency?: string | null
}

interface ProgramsSectionProps {
  programs: Program[]
}

const iconMap: Record<string, any> = {
  weight_loss: Flame,
  muscle_gain: Target,
  endurance: Heart,
  maintenance: Zap,
}

const levelLabels: Record<string, string> = {
  beginner: "Начальный",
  medium: "Средний",
  advanced: "Продвинутый",
}

const goalLabels: Record<string, string> = {
  weight_loss: "Похудение",
  muscle_gain: "Набор массы",
  endurance: "Выносливость",
  maintenance: "Поддержание формы",
}

export function ProgramsSection({ programs }: ProgramsSectionProps) {
  if (!programs.length) {
    return <p className="text-center text-muted-foreground py-16">Нет доступных программ</p>
  }

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
            const Icon = iconMap[program.goal || ""] || Flame

            return (
              <Card key={program.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="relative h-48 md:h-56 overflow-hidden bg-muted">
                  {/* <img
                    src={program.image || "/placeholder.svg"}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  /> */}
                  <div className="absolute top-4 left-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary shadow-lg">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                    {program.level ? levelLabels[program.level] || program.level : ""}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">{program.name}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{program.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Цель</p>
                      <p className="text-sm font-semibold">{goalLabels[program.goal || ""] || program.goal}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Частота</p>
                      <p className="text-sm font-semibold">{program.frequency || "Не указано"}</p>
                    </div>
                  </div>
                 <Link href={`/programs/${program.id}`}>
                    <Button className="w-full">Подробнее</Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
