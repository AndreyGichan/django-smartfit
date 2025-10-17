"use client"

import Link from "next/link"
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

export function DiaryAccessDialog() {
    return (
        <CustomAlertDialog open={true}>
            <CustomAlertDialogContent variant="info">
                <CustomAlertDialogHeader>
                    <CustomAlertDialogTitle>Необходим вход</CustomAlertDialogTitle>
                    <CustomAlertDialogDescription>
                        Чтобы просматривать дневник, необходимо войти в аккаунт.
                    </CustomAlertDialogDescription>
                </CustomAlertDialogHeader>
                <CustomAlertDialogFooter>
                    <CustomAlertDialogCancel onClick={() => window.history.back()}>Отмена</CustomAlertDialogCancel>
                    <Link href="/login">
                        <CustomAlertDialogAction>Войти</CustomAlertDialogAction>
                    </Link>
                </CustomAlertDialogFooter>
            </CustomAlertDialogContent>
        </CustomAlertDialog>
    )
}
