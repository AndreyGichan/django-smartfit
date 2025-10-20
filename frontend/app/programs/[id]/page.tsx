'use client'

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Flame, Heart, Zap, Clock, TrendingUp, Calendar, ArrowLeft, Dumbbell, Timer, Play, CheckCircle } from "lucide-react"
import Link from "next/link"
import apiService from "@/services/apiService"
import ExerciseModal from "@/components/ExerciseModal"
import { getUserId } from "@/lib/actions"
import {
    CustomAlertDialog,
    CustomAlertDialogContent,
    CustomAlertDialogHeader,
    CustomAlertDialogFooter,
    CustomAlertDialogTitle,
    CustomAlertDialogDescription,
    CustomAlertDialogAction,
    CustomAlertDialogCancel,
} from "@/components/ui/custom-alert-dialog"
import { LoadingOverlay } from "@/components/LoadingOverlay"


interface Exercise {
    id: string
    name: string
    description?: string
    muscle_group?: string
    difficulty?: string
    technique?: string[] | null
    equipment_needed?: string
    sets: string
    rest: string
    image_url?: string
    video_url?: string | null
}

interface DaySchedule {
    day: string
    exercises: Exercise[]
}

interface Program {
    id: string
    name: string
    description: string
    goal?: string
    level: string
    frequency?: string
    training_type?: string
    schedule?: DaySchedule[]
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

const trainingTypeLabels: Record<string, string> = {
    home: "Дома",
    gym: "В зале",
}

export default function ProgramDetailPage() {
    const { id } = useParams()
    const [program, setProgram] = useState<Program | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
    const [selecting, setSelecting] = useState(false)
    const [selected, setSelected] = useState(false)
    const [currentProgramName, setCurrentProgramName] = useState<string | null>(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [alertMessage, setAlertMessage] = useState<string | null>(null)
    const [showAlert, setShowAlert] = useState(false)
    const [showLoginAlert, setShowLoginAlert] = useState(false)
    const [loadingDiary, setLoadingDiary] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    useEffect(() => {
        const fetchUser = async () => {
            const userId = await getUserId()
            setIsLoggedIn(!!userId)
        }
        fetchUser()
    }, [])

    useEffect(() => {
        if (!id) return
        setLoading(true)
        apiService
            .get(`/api/programs/${id}/`)
            .then((data) => {
                const schedule = data.program_workouts?.map((workout: any) => ({
                    day: workout.name || `День ${workout.order}`,
                    exercises: workout.exercises?.map((ex: any) => ({
                        id: ex.exercise.id,
                        name: ex.exercise.name,
                        description: ex.exercise.description,
                        muscle_group: ex.exercise.muscle_group,
                        difficulty: ex.exercise.difficulty,
                        technique: ex.exercise.technique,
                        equipment_needed: ex.exercise.equipment_needed,
                        sets: `${ex.sets} x ${ex.reps_min === ex.reps_max ? ex.reps_min : `${ex.reps_min}-${ex.reps_max}`}`,
                        rest: "-",
                        image_url: ex.exercise.image_url || "/placeholder.svg",
                        video_url: ex.exercise.video_url || null,
                    })) || [],
                })) || []

                setProgram({ ...data, schedule })
                setSelected(data.is_selected || false)
                setCurrentProgramName(data.current_program_name || null)
                setError(null)
            })
            .catch(() => setError("Не удалось загрузить программу"))
            .finally(() => setLoading(false))
    }, [id])

    const handleSelectProgram = async () => {
        if (!program) return

        if (!isLoggedIn) {
            setShowLoginAlert(true)
            return
        }

        if (currentProgramName && currentProgramName !== program.name) {
            setShowConfirm(true)
            return
        }

        await confirmProgramSelection()

    }
    const showCustomAlert = (message: string) => {
        setAlertMessage(message)
        setShowAlert(true)
    }

    const confirmProgramSelection = async () => {
        if (!program) return
        setSelecting(true)
        try {
            await apiService.post(`/api/programs/${program.id}/select/`, {})
            setSelected(true)
            showCustomAlert(`Вы выбрали программу "${program.name}"`)
        } catch (error) {
            console.error(error)
            showCustomAlert("Не удалось выбрать программу")
        } finally {
            setSelecting(false)
            setShowConfirm(false)
        }
    }

    const handleLinkClick = (href: string) => {
        setLoadingDiary(true)
        startTransition(() => {
            router.push(href)
            setLoadingDiary(false)
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-lg">Загрузка...</div>
        )
    }

    if (error || !program) {
        return (
            <div className="min-h-screen">
                <Header isLoggedIn={isLoggedIn} />
                <main className="py-12 container mx-auto px-4">
                    <p className="text-red-500">{error || "Программа не найдена"}</p>
                    <Link href="/programs">
                        <Button variant="outline" className="mt-4">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Назад
                        </Button>
                    </Link>
                </main>
            </div>
        )
    }

    const Icon = iconMap[program.goal || ""] || Dumbbell

    return (
        <>
            <div className="min-h-screen">
                <Header isLoggedIn={isLoggedIn} />
                <main className="py-8 md:py-12">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <Link href="/programs">
                            <Button variant="ghost" className="mb-6 group hover:bg-primary/10 transition-all">
                                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                                Назад к программам
                            </Button>
                        </Link>

                        <div className="relative rounded-3xl overflow-hidden mb-8 border border-primary/20 shadow-2xl shadow-primary/10">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
                            <div className="relative backdrop-blur-sm bg-black/40 p-8 md:p-12">

                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/50 animate-float">
                                        <Icon className="h-10 w-10 text-white" />
                                    </div>
                                    <div className="flex flex-col md:flex-1 gap-2">
                                        <h1 className="text-4xl md:text-5xl font-bold text-white">{program.name}</h1>
                                        <p className="text-white/80 text-lg md:text-xl">{program.description}</p>
                                    </div>

                                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                                        {selected ? (
                                            <Button size="lg" disabled className="gap-2 shadow-lg shadow-primary/30">
                                                <CheckCircle className="h-5 w-5" /> Программа выбрана
                                            </Button>
                                        ) : (
                                            <Button
                                                size="lg"
                                                className="gap-2 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
                                                onClick={handleSelectProgram}
                                                disabled={selecting}
                                            >
                                                <CheckCircle className="h-5 w-5" /> Выбрать программу
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                                    <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                        <Clock className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-xs text-white/60">Тип тренировки</p>
                                            <p className="font-bold text-white">{program.training_type ? trainingTypeLabels[program.training_type] || program.training_type : "Не указан"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                        <TrendingUp className="h-5 w-5 text-accent" />
                                        <div>
                                            <p className="text-xs text-white/60">Уровень</p>
                                            <p className="font-bold text-white">{levelLabels[program.level] || program.level}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                        <Calendar className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-xs text-white/60">Частота</p>
                                            <p className="font-bold text-white">{program.frequency}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                        <Target className="h-5 w-5 text-accent" />
                                        <div>
                                            <p className="text-xs text-white/60">Цель</p>
                                            <p className="font-bold text-white">{program.goal ? goalLabels[program.goal] || program.goal : "Цель не указана"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Dumbbell className="h-8 w-8 text-primary" />
                                <h2 className="text-3xl md:text-4xl font-bold">План тренировок</h2>
                            </div>

                            <div className="grid gap-6">
                                {program.schedule?.map((day, dayIndex) => (
                                    <Card
                                        key={dayIndex}
                                        className="glass-card overflow-hidden border-primary/20 hover:border-primary/40 transition-all duration-300 group"
                                    >
                                        <div className="relative bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 border-b border-primary/20 p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                                                        <span className="text-xl font-bold text-white">{dayIndex + 1}</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-foreground mb-1">{day.day}</h3>
                                                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                            <Dumbbell className="h-4 w-4" />
                                                            {day.exercises.length} упражнений
                                                        </p>
                                                    </div>
                                                </div>
                                                <Link
                                                    href="/diary"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        handleLinkClick("/diary")
                                                    }}
                                                >
                                                    <Button size="sm" className="flex gap-2">
                                                        <Play className="h-4 w-4" />
                                                        Начать
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>

                                        <CardContent className="p-6">
                                            <div className="grid gap-4">
                                                {day.exercises.map((exercise, exerciseIndex) => (
                                                    <div
                                                        key={exerciseIndex}
                                                        className="relative group/exercise overflow-hidden rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                                                        onClick={() => setSelectedExercise(exercise)}
                                                    >
                                                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-muted/30 to-transparent">
                                                            <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-muted border border-border/50 shadow-md">
                                                                <img
                                                                    src={exercise.image_url || "/placeholder.svg"}
                                                                    alt={exercise.name}
                                                                    className="w-full h-full object-cover group-hover/exercise:scale-110 transition-transform duration-500"
                                                                />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/exercise:opacity-100 transition-opacity" />
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-start justify-between gap-4 mb-3">
                                                                    <h4 className="font-bold text-lg text-foreground group-hover/exercise:text-primary transition-colors">
                                                                        {exercise.name}
                                                                    </h4>
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="bg-primary/10 text-primary border-primary/30 whitespace-nowrap"
                                                                    >
                                                                        #{exerciseIndex + 1}
                                                                    </Badge>
                                                                </div>

                                                                <div className="flex flex-wrap gap-2">
                                                                    <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-border/50">
                                                                        <Dumbbell className="h-4 w-4 text-primary" />
                                                                        <span className="text-sm font-semibold text-foreground">{exercise.sets}</span>
                                                                    </div>
                                                                    {exercise.rest !== "-" && (
                                                                        <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-border/50">
                                                                            <Timer className="h-4 w-4 text-accent" />
                                                                            <span className="text-sm text-muted-foreground">
                                                                                Отдых: <span className="font-semibold text-foreground">{exercise.rest}</span>
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        <Card className="glass-card border-primary/30 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
                            <CardContent className="relative p-8 md:p-12 text-center">
                                <div className="max-w-2xl mx-auto">
                                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30 mb-6 animate-float">
                                        <Zap className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-bold mb-4">Готовы начать?</h3>
                                    <p className="text-muted-foreground text-lg mb-8">
                                        Следуйте этой программе и отслеживайте свой прогресс в дневнике тренировок
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        {selected ? (
                                            <Button
                                                size="lg"
                                                className="w-full sm:w-auto gap-2 shadow-lg shadow-primary/30"
                                                disabled
                                            >
                                                <CheckCircle className="h-5 w-5" />
                                                Программа выбрана
                                            </Button>
                                        ) : (
                                            <Button
                                                size="lg"
                                                className="w-full sm:w-auto gap-2 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
                                                onClick={handleSelectProgram}
                                                disabled={selecting}
                                            >
                                                <CheckCircle className="h-5 w-5" />
                                                Выбрать программу
                                            </Button>
                                        )}

                                        <Link href="/programs">
                                            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent hover:bg-primary/10">
                                                Выбрать другую программу
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <ExerciseModal
                            exercise={selectedExercise}
                            onClose={() => setSelectedExercise(null)}
                        />

                        <CustomAlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                            <CustomAlertDialogContent variant="info">
                                <CustomAlertDialogHeader>
                                    <CustomAlertDialogTitle>Подтверждение выбора</CustomAlertDialogTitle>
                                    <CustomAlertDialogDescription>
                                        Вы уверены, что хотите выбрать программу "{program?.name}"? <br />
                                        Текущая программа "{currentProgramName}" будет отменена.
                                    </CustomAlertDialogDescription>
                                </CustomAlertDialogHeader>
                                <CustomAlertDialogFooter>
                                    <CustomAlertDialogCancel>Отмена</CustomAlertDialogCancel>
                                    <CustomAlertDialogAction onClick={confirmProgramSelection}>
                                        Подтвердить
                                    </CustomAlertDialogAction>
                                </CustomAlertDialogFooter>
                            </CustomAlertDialogContent>
                        </CustomAlertDialog>

                        <CustomAlertDialog open={showAlert} onOpenChange={setShowAlert}>
                            <CustomAlertDialogContent variant="success">
                                <CustomAlertDialogHeader>
                                    <CustomAlertDialogTitle>Сообщение</CustomAlertDialogTitle>
                                    <CustomAlertDialogDescription>
                                        {alertMessage}
                                    </CustomAlertDialogDescription>
                                </CustomAlertDialogHeader>
                                <CustomAlertDialogFooter>
                                    <CustomAlertDialogAction onClick={() => setShowAlert(false)}>
                                        Ок
                                    </CustomAlertDialogAction>
                                </CustomAlertDialogFooter>
                            </CustomAlertDialogContent>
                        </CustomAlertDialog>

                        <CustomAlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
                            <CustomAlertDialogContent variant="info">
                                <CustomAlertDialogHeader>
                                    <CustomAlertDialogTitle>Требуется вход</CustomAlertDialogTitle>
                                    <CustomAlertDialogDescription>
                                        Чтобы выбрать программу, необходимо войти в аккаунт
                                    </CustomAlertDialogDescription>
                                </CustomAlertDialogHeader>
                                <CustomAlertDialogFooter>
                                    <CustomAlertDialogCancel onClick={() => setShowLoginAlert(false)}>
                                        Отмена
                                    </CustomAlertDialogCancel>
                                    <Link href="/login">
                                        <CustomAlertDialogAction>
                                            Войти
                                        </CustomAlertDialogAction>
                                    </Link>
                                </CustomAlertDialogFooter>
                            </CustomAlertDialogContent>
                        </CustomAlertDialog>

                    </div>
                </main>
            </div>
            <LoadingOverlay show={loading || isPending} />
        </>
    )
}
