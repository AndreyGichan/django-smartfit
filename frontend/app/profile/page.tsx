"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { User, Mail, Calendar, Ruler, Weight, Users, Target, Dumbbell, Save, ArrowRight, Edit2, LogOut, Clock } from "lucide-react"
import apiService from "@/services/apiService"
import Link from "next/link"
import { getUserId, resetAuthCookies } from "@/lib/actions"
import {
  CustomAlertDialog,
  CustomAlertDialogContent,
  CustomAlertDialogHeader,
  CustomAlertDialogTitle,
  CustomAlertDialogDescription,
  CustomAlertDialogFooter,
  CustomAlertDialogAction,
  CustomAlertDialogCancel,
} from "@/components/ui/custom-alert-dialog"


export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [totalWorkouts, setTotalWorkouts] = useState<number>(0);
  const [totalHours, setTotalHours] = useState<number>(0);
  const [constants, setConstants] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const userId = await getUserId()
        setIsLoggedIn(!!userId)

        const data = await apiService.get("/api/auth/profile/")
        setProfile(data)
      } catch (err) {
        console.error("Ошибка при загрузке профиля:", err)
      }
    }
    fetchProfile()
  }, [])

  const handleSave = async () => {
    if (!profile) return
    setIsSaving(true)
    try {
      await apiService.put(`/api/auth/profile/`, profile)
      setIsEditing(false)
      console.log("Профиль сохранён:", profile)
    } catch (err) {
      console.error("Ошибка при сохранении профиля:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await resetAuthCookies()
      setIsLoggedIn(false)
      setProfile(null)
      console.log("Выход выполнен")
      router.push('/login');
    } catch (err) {
      console.error("Ошибка при выходе:", err)
    }
  }

  useEffect(() => {
    async function fetchConstants() {
      try {
        const data = await apiService.get("/api/auth/constants/");
        setConstants(data);
      } catch (err) {
        console.error("Ошибка при загрузке констант:", err);
      }
    }
    fetchConstants();
  }, []);

  useEffect(() => {
    async function fetchTotalWorkouts() {
      try {
        const data = await apiService.get("/api/workouts/total/");
        setTotalWorkouts(data.total_workouts);
      } catch (err) {
        console.error("Ошибка при получении общего числа тренировок:", err);
      }
    }
    fetchTotalWorkouts();
  }, []);

  useEffect(() => {
    async function fetchTotalHours() {
      try {
        const data = await apiService.get("/api/workouts/total-hours/");
        setTotalHours(data.total_hours);
      } catch (err) {
        console.error("Ошибка при получении общего времени тренировок:", err);
      }
    }
    fetchTotalHours();
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Загрузка ...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={isLoggedIn} />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Профиль
            </h1>
            <p className="text-muted-foreground text-lg">Управляйте своей информацией и настройками</p>
          </div>

          {/* Profile Card */}
          <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-500" />
            <div className="relative bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl">
              {/* Avatar Section */}
              <div className="flex flex-col md:flex-row items-center gap-6 mb-8 pb-8 border-b border-border/50">
                <div className="relative group/avatar">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full opacity-75 group-hover/avatar:opacity-100 blur transition duration-300" />
                  <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-primary/50">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <div className="text-center md:text-left flex-1">
                  <h2 className="text-2xl font-bold mb-1">{profile.name}</h2>
                  <p className="text-muted-foreground">{profile.email}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant={isEditing ? "outline" : "default"}
                    className="group/btn relative overflow-hidden"
                  >
                    <Edit2 className="h-4 w-4 relative z-10" />
                    <span className="relative z-10">{isEditing ? "Отменить" : "Редактировать"}</span>
                    {!isEditing && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    )}
                  </Button>

                  <Button
                    onClick={() => setShowLogoutConfirm(true)}
                    variant="destructive"
                    className="group/logout relative overflow-hidden flex items-center gap-1"
                  >
                    <LogOut className="h-4 w-4 relative z-10" />
                    <span className="relative z-10">Выйти</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover/logout:opacity-30 transition-opacity rounded-lg" />
                  </Button>
                </div>
              </div>

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group/field">
                  <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                    <User className="h-4 w-4 text-primary" />
                    Имя
                  </Label>
                  <Input
                    id="name"
                    value={profile.name || ""}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    disabled={!isEditing}
                    className="bg-background/50 border-border/50 focus:border-primary transition-all duration-300 disabled:opacity-60"
                  />
                </div>

                <div className="space-y-2 group/field">
                  <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="h-4 w-4 text-primary" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email || ""}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing}
                    className="bg-background/50 border-border/50 focus:border-primary transition-all duration-300 disabled:opacity-60"
                  />
                </div>

                <div className="space-y-2 group/field">
                  <Label htmlFor="age" className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="h-4 w-4 text-primary" />
                    Возраст
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={profile.age || ""}
                    onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                    disabled={!isEditing}
                    className="bg-background/50 border-border/50 focus:border-primary transition-all duration-300 disabled:opacity-60"
                  />
                </div>

                <div className="space-y-2 group/field">
                  <Label htmlFor="height" className="flex items-center gap-2 text-sm font-medium">
                    <Ruler className="h-4 w-4 text-primary" />
                    Рост (см)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    value={profile.height || ""}
                    onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                    disabled={!isEditing}
                    className="bg-background/50 border-border/50 focus:border-primary transition-all duration-300 disabled:opacity-60"
                  />
                </div>

                <div className="space-y-2 group/field">
                  <Label htmlFor="weight" className="flex items-center gap-2 text-sm font-medium">
                    <Weight className="h-4 w-4 text-primary" />
                    Вес (кг)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    value={profile.weight || ""}
                    onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                    disabled={!isEditing}
                    className="bg-background/50 border-border/50 focus:border-primary transition-all duration-300 disabled:opacity-60"
                  />
                </div>

                <div className="space-y-2 group/field">
                  <Label htmlFor="gender" className="flex items-center gap-2 text-sm font-medium">
                    <Users className="h-4 w-4 text-primary" />
                    Пол
                  </Label>
                  <Select
                    value={profile.gender || ""}
                    onValueChange={(value) => setProfile({ ...profile, gender: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary transition-all duration-300 disabled:opacity-60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {/* <SelectItem value="male">Мужской</SelectItem>
                      <SelectItem value="female">Женский</SelectItem>
                      <SelectItem value="other">Другой</SelectItem> */}
                      {constants?.gender.map((item: any) => (
                        <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 group/field">
                  <Label htmlFor="level" className="flex items-center gap-2 text-sm font-medium">
                    <Target className="h-4 w-4 text-primary" />
                    Уровень подготовки
                  </Label>
                  <Select
                    value={profile.level}
                    onValueChange={(value) => setProfile({ ...profile, level: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary transition-all duration-300 disabled:opacity-60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {constants?.level.map((item: any) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 group/field">
                  <Label htmlFor="goal" className="flex items-center gap-2 text-sm font-medium">
                    <Target className="h-4 w-4 text-primary" />
                    Цель
                  </Label>
                  <Select
                    value={profile.goal}
                    onValueChange={(value) => setProfile({ ...profile, goal: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary transition-all duration-300 disabled:opacity-60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {constants?.goal.map((item: any) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 group/field md:col-span-2">
                  <Label htmlFor="selectedProgram" className="flex items-center gap-2 text-sm font-medium">
                    <Dumbbell className="h-4 w-4 text-primary" />
                    Выбранная программа
                  </Label>
                  {profile.selected_program ? (
                    <Link href={`/programs/${profile.selected_program.id}`}>
                      <div className="flex items-center justify-between text-muted-foreground bg-background/50 border border-border/50 rounded-lg px-4 py-2 cursor-pointer hover:bg-primary/10 transition-colors">
                        <span>{profile.selected_program.name}</span>
                        <ArrowRight className="h-4 w-4 text-primary" />
                      </div>
                    </Link>
                  ) : (
                    <p className="text-muted-foreground bg-background/50 border border-border/50 rounded-lg px-4 py-2">
                      Не выбрана
                    </p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-8 pt-6 border-t border-border/50 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <Button
                    onClick={handleSave}
                    className="w-full md:w-auto group/save relative overflow-hidden"
                    size="lg"
                    disabled={isSaving}
                  >
                    <Save className="h-4 w-4 mr-2 relative z-10" />
                    <span className="relative z-10">{isSaving ? "Сохранение..." : "Сохранить изменения"}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover/save:opacity-100 transition-opacity" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-xl opacity-20 group-hover:opacity-30 blur transition duration-500" />
              <div className="relative bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ИМТ</p>
                    <p className="text-2xl font-bold">
                      {(Number(profile.weight) / Math.pow(Number(profile.height) / 100, 2)).toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-xl opacity-20 group-hover:opacity-30 blur transition duration-500" />
              <div className="relative bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Dumbbell className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Всего тренировок</p>
                    <p className="text-2xl font-bold">{totalWorkouts}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-xl opacity-20 group-hover:opacity-30 blur transition duration-500" />
              <div className="relative bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Всего часов тренировок</p>
                    <p className="text-2xl font-bold">{totalHours}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CustomAlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <CustomAlertDialogContent variant="warning">
          <CustomAlertDialogHeader>
            <CustomAlertDialogTitle>Вы уверены?</CustomAlertDialogTitle>
            <CustomAlertDialogDescription>
              Вы действительно хотите выйти из профиля?
            </CustomAlertDialogDescription>
          </CustomAlertDialogHeader>
          <CustomAlertDialogFooter>
            <CustomAlertDialogCancel onClick={() => setShowLogoutConfirm(false)}>
              Отмена
            </CustomAlertDialogCancel>
            <CustomAlertDialogAction onClick={handleLogout}>
              Выйти
            </CustomAlertDialogAction>
          </CustomAlertDialogFooter>
        </CustomAlertDialogContent>
      </CustomAlertDialog>
    </div>
  )
}
