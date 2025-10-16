"use client"

import { useEffect, useState } from "react"
import apiService from "@/services/apiService"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Calendar, Dumbbell, Target, Activity, PieChart, Clock } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"


type MuscleGroup = {
  name: string;
  value: number;
  color: string;
};

const muscleGroupNames: Record<string, string> = {
  Chest: "Грудь",
  Back: "Спина",
  Legs: "Ноги",
  Shoulders: "Плечи",
  Arms: "Руки",
  Core: "Пресс",
};

const muscleColors: Record<string, string> = {
  Chest: "#10b981",
  Back: "#14b8a6",
  Legs: "#06b6d4",
  Shoulders: "#3b82f6",
  Arms: "#8b5cf6",
  Core: "#ec4899",
};

export function StatsSection() {
  const [workoutFrequency, setWorkoutFrequency] = useState([])
  const [weeklyWorkouts, setWeeklyWorkouts] = useState([]);
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  const [muscleGroupData, setMuscleGroupData] = useState<MuscleGroup[]>([]);
  const [exercises, setExercises] = useState<{ id: string, name: string }[]>([])
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null)
  const [exerciseProgress, setExerciseProgress] = useState<{ date: string, weight: number }[]>([])
  const [exerciseSearchQuery, setExerciseSearchQuery] = useState("")
  const [monthlyWorkouts, setMonthlyWorkouts] = useState<{ current: number; previous: number; diff: number }>({
    current: 0,
    previous: 0,
    diff: 0
  });
  const [monthlyWeight, setMonthlyWeight] = useState<{ current: number; previous: number; diff: number }>({
    current: 0,
    previous: 0,
    diff: 0
  });
  const [avgDuration, setAvgDuration] = useState<{
    current: number;
    previous: number;
    diff: number;
  }>({ current: 0, previous: 0, diff: 0 });
  const [avgSets, setAvgSets] = useState<{ current: number; previous: number; diff: number }>({
    current: 0,
    previous: 0,
    diff: 0
  });


  useEffect(() => {
    async function fetchMonthlyWorkouts() {
      try {
        const data = await apiService.get("/api/workouts/monthly/");
        setMonthlyWorkouts(data);
      } catch (error) {
        console.error("Ошибка загрузки месячных тренировок:", error);
      }
    }
    fetchMonthlyWorkouts();
  }, []);

  useEffect(() => {
    async function fetchMonthlyWeight() {
      try {
        const data = await apiService.get("/api/workouts/monthly-weight/");
        setMonthlyWeight(data);
      } catch (error) {
        console.error("Ошибка загрузки веса за месяц:", error);
      }
    }
    fetchMonthlyWeight();
  }, []);

  useEffect(() => {
    async function fetchExercises() {
      try {
        const data = await apiService.get("/api/exercises/")
        setExercises(data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchExercises()
  }, [])

  useEffect(() => {
    async function fetchAvgDuration() {
      try {
        const data = await apiService.get("/api/workouts/monthly-avg-duration/");
        const current = Math.round(data.current_month_avg_minutes);
        const previous = Math.round(data.prev_month_avg_minutes);

        setAvgDuration({
          current,
          previous,
          diff: current - previous,
        });
      } catch (error) {
        console.error(error);
      }
    }
    fetchAvgDuration();
  }, []);

  useEffect(() => {
    async function fetchAvgSets() {
      try {
        const data = await apiService.get("/api/workouts/avg-sets-per-workout/");
        setAvgSets(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchAvgSets();
  }, []);

  useEffect(() => {
    if (!selectedExercise) return
    async function fetchProgress() {
      try {
        const data = await apiService.get(`/api/workouts/exercise-progress/${selectedExercise}/`)
        setExerciseProgress(data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchProgress()
  }, [selectedExercise])

  useEffect(() => {
    async function fetchWorkoutActivity() {
      try {
        const data = await apiService.get("/api/workouts/activity/week/")
        setWorkoutFrequency(data)
      } catch (error) {
        console.error("Ошибка загрузки активности:", error)
      }
    }

    fetchWorkoutActivity()
  }, [])

  useEffect(() => {
    async function fetchWeeklyWorkouts() {
      try {
        const data = await apiService.get("/api/workouts/activity/weeks/?n_weeks=6");
        setWeeklyWorkouts(data);
      } catch (error) {
        console.error("Ошибка загрузки недельной активности:", error);
      }
    }

    fetchWeeklyWorkouts();
  }, []);

  useEffect(() => {
    async function fetchMuscleGroupData() {
      try {
        const data = await apiService.get("/api/workouts/muscle-distribution/");
        setMuscleGroupData(data);
      } catch (error) {
        console.error("Ошибка загрузки распределения по мышечным группам:", error);
      }
    }
    fetchMuscleGroupData();
  }, []);

  const coloredMuscleData = muscleGroupData
    .filter(group => group.value > 0)
    .map(group => ({
      ...group,
      color: muscleColors[group.name] || "#999999"
    }));


  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section id="stats" className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="relative group animate-in fade-in slide-in-from-bottom-3 duration-700 delay-100">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-xl opacity-20 group-hover:opacity-30 blur transition duration-500" />
            <Card className="relative bg-card/50 backdrop-blur-xl border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Всего тренировок</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{monthlyWorkouts.current}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {monthlyWorkouts.diff > 0 ? (
                    <span className="text-primary font-medium">+{monthlyWorkouts.diff}</span>
                  ) : monthlyWorkouts.diff < 0 ? (
                    <span className="text-red-500 font-medium">{monthlyWorkouts.diff}</span>
                  ) : (
                    <span className="text-muted-foreground font-medium">Нет изменений</span>
                  )}{" "}
                  vs прошлый месяц
                </p>
              </CardContent>

            </Card>
          </div>

          <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-xl opacity-20 group-hover:opacity-30 blur transition duration-500" />
            <Card className="relative bg-card/50 backdrop-blur-xl border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Суммарный поднятый вес</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Dumbbell className="h-5 w-5 text-accent" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{monthlyWeight.current} кг</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {monthlyWeight.diff > 0 ? (
                    <span className="text-primary font-medium">+{monthlyWeight.diff} кг</span>
                  ) : monthlyWeight.diff < 0 ? (
                    <span className="text-red-500 font-medium">{monthlyWeight.diff} кг</span>
                  ) : (
                    <span className="text-muted-foreground font-medium">Нет изменений</span>
                  )}{" "}
                  vs прошлый месяц
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-xl opacity-20 group-hover:opacity-30 blur transition duration-500" />
            <Card className="relative bg-card/50 backdrop-blur-xl border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Среднее время тренировки</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgDuration.current} мин</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {avgDuration.diff > 0 ? (
                    <span className="text-primary font-medium"> +{avgDuration.diff} мин</span>
                  ) : avgDuration.diff < 0 ? (
                    <span className="text-red-500 font-medium"> {avgDuration.diff} мин</span>
                  ) : (
                    <span className="text-muted-foreground font-medium">Нет изменений</span>
                  )}{" "}
                  vs прошлый месяц
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-xl opacity-20 group-hover:opacity-30 blur transition duration-500" />
            <Card className="relative bg-card/50 backdrop-blur-xl border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Среднее кол-во подходов за тренировку</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Target className="h-5 w-5 text-accent" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgSets.current}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {avgSets.diff > 0 ? (
                    <span className="text-primary font-medium">+{avgSets.diff}</span>
                  ) : avgSets.diff < 0 ? (
                    <span className="text-red-500 font-medium">{avgSets.diff}</span>
                  ) : (
                    <span className="text-muted-foreground font-medium">Нет изменений</span>
                  )}{" "}
                  vs прошлый месяц
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700 delay-600">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-500" />
            <Card className="relative bg-card/50 backdrop-blur-xl border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Calendar className="h-5 w-5 text-accent" />
                  Активность по дням
                </CardTitle>
                <CardDescription className="text-muted-foreground">Тренировки за последнюю неделю</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={workoutFrequency} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4ade80" stopOpacity={1} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4ade80" opacity={0.15} />
                    <XAxis dataKey="day" stroke="#4ade80" tick={{ fill: "#ffffff", fontSize: 13, fontWeight: 500 }} />
                    <YAxis
                      stroke="#4ade80"
                      domain={[0, "dataMax "]}
                      allowDecimals={false}
                      tick={{ fill: "#ffffff", fontSize: 13, fontWeight: 500 }}
                      label={{
                        value: "Тренировки",
                        angle: -90,
                        position: "insideLeft",
                        fill: "#ffffff",
                        fontWeight: 600,
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.9)",
                        border: "1px solid #4ade80",
                        borderRadius: "12px",
                        color: "#ffffff",
                        boxShadow: "0 4px 12px rgba(74, 222, 128, 0.3)",
                      }}
                      labelStyle={{ color: "#ffffff", fontWeight: 600 }}
                      itemStyle={{ color: "#4ade80", fontWeight: 500 }}
                      formatter={(value) => [`${value} тренировок`, "Количество"]}
                    />
                    <Legend
                      wrapperStyle={{ color: "#ffffff", fontWeight: 500 }}
                      formatter={(value) => (value === "workouts" ? "Тренировки" : value)}
                    />
                    <Bar dataKey="workouts" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-500" />
            <Card className="relative bg-card/50 backdrop-blur-xl border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Динамика рабочего веса
                </CardTitle>
                <CardDescription className="text-muted-foreground">Прогресс в упражнениях</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Select
                    onValueChange={(value) => setSelectedExercise(value)}
                    value={selectedExercise || undefined}
                    onOpenChange={(open) => {
                      if (!open) setExerciseSearchQuery("");
                    }}
                  >
                    <SelectTrigger className="bg-transparent border border-green-300 text-white">
                      <SelectValue placeholder="Выберите упражнение" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      <div className="px-3 py-2 sticky top-0 bg-background z-10">
                        <Input
                          placeholder="Поиск..."
                          value={exerciseSearchQuery}
                          onChange={(e) => setExerciseSearchQuery(e.target.value)}
                          autoFocus
                          onKeyDown={(e) => e.stopPropagation()}
                        />
                      </div>
                      {exercises
                        .filter((ex) =>
                          ex.name.toLowerCase().includes(exerciseSearchQuery.toLowerCase())
                        )
                        .map((ex) => (
                          <SelectItem key={ex.id} value={ex.id}>
                            {ex.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={exerciseProgress} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4ade80" opacity={0.15} />
                    <XAxis dataKey="date" stroke="#4ade80" tick={{ fill: "#ffffff", fontSize: 13, fontWeight: 500 }} />
                    <YAxis
                      stroke="#4ade80"
                      tick={{ fill: "#ffffff", fontSize: 13, fontWeight: 500 }}
                      label={{ value: "кг", angle: -90, position: "insideLeft", fill: "#ffffff", fontWeight: 600 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.9)",
                        border: "1px solid #4ade80",
                        borderRadius: "12px",
                        color: "#ffffff",
                        boxShadow: "0 4px 12px rgba(74, 222, 128, 0.3)",
                      }}
                      labelStyle={{ color: "#ffffff", fontWeight: 600 }}
                      itemStyle={{ color: "#4ade80", fontWeight: 500 }}
                    />
                    <Legend
                      wrapperStyle={{ color: "#ffffff", fontWeight: 500 }}
                      formatter={(value) => (value === "weight" ? "Вес (кг)" : value)}
                    />
                    <defs>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="50%" stopColor="#4ade80" />
                        <stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                    </defs>
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="url(#lineGradient)"
                      strokeWidth={4}
                      dot={{ fill: "#4ade80", r: 6, strokeWidth: 3, stroke: "#10b981" }}
                      activeDot={{ r: 8, fill: "#4ade80", stroke: "#10b981", strokeWidth: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700 delay-800">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-500" />
            <Card className="relative bg-card/50 backdrop-blur-xl border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <PieChart className="h-5 w-5 text-accent" />
                  Распределение по мышечным группам
                </CardTitle>
                <CardDescription className="text-muted-foreground">Процентное соотношение нагрузки</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={coloredMuscleData}
                      cx="50%"
                      cy="50%"
                      outerRadius={windowWidth && windowWidth < 640 ? 70 : 100}
                      innerRadius={0}
                      dataKey="value"
                      minAngle={5}
                      label={({ name, percent }) =>
                        windowWidth && windowWidth < 640
                          ? `${(percent * 100).toFixed(0)}%`
                          : `${muscleGroupNames[name] || name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={{ stroke: "#4ade80", strokeWidth: 1 }}
                      legendType="circle"
                    >
                      {coloredMuscleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.9)",
                        border: "1px solid #4ade80",
                        borderRadius: "12px",
                        color: "#ffffff",
                        boxShadow: "0 4px 12px rgba(74, 222, 128, 0.3)",
                      }}
                      itemStyle={{ color: "#ffffff", fontWeight: 500 }}
                      formatter={(value, name, props) => {
                        const total = coloredMuscleData.reduce((acc, cur) => acc + cur.value, 0)
                        const percent = ((Number(value) / total) * 100).toFixed(0)
                        return [`${percent}%`, muscleGroupNames[name] || name]
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-500" />
            <Card className="relative bg-card/50 backdrop-blur-xl border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Activity className="h-5 w-5 text-primary" />
                  Тренировки по неделям
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Количество тренировок за последние {weeklyWorkouts.length} {weeklyWorkouts.length === 1 ? "неделю" : "недели"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyWorkouts} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="weeklyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4ade80" opacity={0.15} />
                    <XAxis dataKey="week" stroke="#4ade80" tick={{ fill: "#ffffff", fontSize: 13, fontWeight: 500 }} />
                    <YAxis
                      stroke="#4ade80"
                      domain={[0, "dataMax "]}
                      allowDecimals={false}
                      tick={{ fill: "#ffffff", fontSize: 13, fontWeight: 500 }}
                      label={{
                        value: "Тренировки",
                        angle: -90,
                        position: "insideLeft",
                        fill: "#ffffff",
                        fontWeight: 600,
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.9)",
                        border: "1px solid #4ade80",
                        borderRadius: "12px",
                        color: "#ffffff",
                        boxShadow: "0 4px 12px rgba(74, 222, 128, 0.3)",
                      }}
                      labelStyle={{ color: "#ffffff", fontWeight: 600 }}
                      itemStyle={{ color: "#4ade80", fontWeight: 500 }}
                      formatter={(value) => [`${value} тренировок`, "Количество"]}
                    />
                    <Legend
                      wrapperStyle={{ color: "#ffffff", fontWeight: 500 }}
                      formatter={(value) => (value === "workouts" ? "Тренировки" : value)}
                    />
                    <Bar dataKey="workouts" fill="url(#weeklyGradient)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
