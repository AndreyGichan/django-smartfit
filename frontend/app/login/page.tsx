'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dumbbell } from "lucide-react"
import { handleLogin } from "@/lib/actions"
import apiService from "@/services/apiService"

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const submitLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors([]);

        console.log("Submitting login", { email, password });

        try {
            const response = await apiService.postWithoutToken(
                '/api/auth/login/',
                { email, password }
            );

            console.log("API response:", response);

            if (response.access) {
                await handleLogin(response.user.pk, response.access, response.refresh);
                console.log("Login successful, cookies set");
                router.push('/');
                return;
            }

            if (response.non_field_errors) {
                const translated = response.non_field_errors.map((msg: string) => {
                    if (msg.includes("Unable to log in")) return "Неверный email или пароль";
                    if (msg.includes("Must include")) return "Укажите email и пароль";
                    return msg;
                });
                setErrors(translated);
            } else if (response.email) {
                setErrors(response.email);
            } else if (response.password) {
                setErrors(response.password);
            } else {
                setErrors(["Ошибка входа"]);
            }
        } catch (err: any) {
            console.error("Login error:", err);

            const messages: string[] = [];

            if (err.non_field_errors) {
                messages.push(...err.non_field_errors.map((msg: string) =>
                    msg.includes("Unable to log in") ? "Неверный email или пароль" : msg
                ));
            }
            if (err.email) messages.push(...err.email);
            if (err.password) messages.push(...err.password);

            setErrors(messages.length > 0 ? messages : ["Ошибка при входе. Попробуйте снова."]);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
            <Card className="w-full max-w-md p-8 bg-card border-border">
                <div className="flex flex-col items-center mb-8">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Dumbbell className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-balance">Вход в SmartFit</h1>
                    <p className="text-muted-foreground mt-2 text-center text-pretty">
                        Войди в свой аккаунт, чтобы продолжить тренировки
                    </p>
                </div>

                <form className="space-y-6" onSubmit={submitLogin}>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            className="bg-background border-border"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Пароль</Label>
                            {/* <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                                Забыли пароль?
                            </Link> */}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="bg-background border-border"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {errors.length > 0 && (
                        <div className="space-y-2">
                            {errors.map((err, idx) => (
                                <div key={idx} className="p-2 bg-red-500 text-white rounded">{err}</div>
                            ))}
                        </div>
                    )}

                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                        {loading ? "Вход..." : "Войти"}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        Нет аккаунта?{" "}
                        <Link href="/register" className="text-primary hover:underline font-medium">
                            Зарегистрироваться
                        </Link>
                    </p>
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                    <Link
                        href="/"
                        className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-2"
                    >
                        ← Вернуться на главную
                    </Link>
                </div>
            </Card>
        </div>
    )
}
