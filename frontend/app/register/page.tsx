'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dumbbell } from "lucide-react"
import apiService from "@/services/apiService";
import { handleLogin } from "@/lib/actions";

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors([]);

        if (password1 !== password2) {
            setErrors(['Пароли не совпадают']);
            setLoading(false);
            return;
        }

        const formData = {
            name,
            email,
            password1,
            password2,
        };

        try {
            const response = await apiService.postWithoutToken('/api/auth/register/', formData);

            if (response.access) {
                handleLogin(response.user.pk, response.access, response.refresh);
                router.push('/');
            } else {
                const allErrors: string[] = [];
                for (const key in response) {
                    if (Array.isArray(response[key])) {
                        response[key].forEach((errMsg: string) => allErrors.push(`${key}: ${errMsg}`));
                    } else {
                        allErrors.push(`${key}: ${response[key]}`);
                    }
                }
                setErrors(allErrors.length ? allErrors : ['Произошла ошибка регистрации']);
            }

        } catch (err: any) {
            console.error('Register error:', err);
            setErrors([JSON.stringify(err)]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-accent/5">
            <Card className="w-full max-w-md p-8 bg-card border-border">
                <div className="flex flex-col items-center mb-8">
                    <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                        <Dumbbell className="h-8 w-8 text-accent" />
                    </div>
                    <h1 className="text-3xl font-bold text-balance">Регистрация</h1>
                    <p className="text-muted-foreground mt-2 text-center text-pretty">
                        Создай аккаунт и начни свой путь к лучшей форме
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleRegister}>
                    <div className="space-y-2">
                        <Label htmlFor="name">Имя (необязательно)</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Имя"
                            className="bg-background border-border"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

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
                        <Label htmlFor="password">Пароль</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="bg-background border-border"
                            value={password1}
                            onChange={(e) => setPassword1(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Подтверждение пароля</Label>
                        <Input
                            id="confirm-password"
                            type="password"
                            placeholder="••••••••"
                            className="bg-background border-border"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-background" disabled={loading}>
                        {loading ? "Регистрация..." : "Зарегистрироваться"}
                    </Button>

                    {errors.length > 0 && (
                        <div className="space-y-2 mt-4">
                            {errors.map((err, idx) => (
                                <div key={idx} className="p-3 bg-red-600 text-white rounded">
                                    {err}
                                </div>
                            ))}
                        </div>
                    )}


                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        Уже есть аккаунт?{" "}
                        <Link href="/login" className="text-accent hover:underline font-medium">
                            Войти
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
