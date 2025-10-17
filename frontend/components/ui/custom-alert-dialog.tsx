"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import { cn } from "@/lib/utils"
import { CheckCircle2, AlertCircle, Info, XCircle } from "lucide-react"

const CustomAlertDialog = AlertDialogPrimitive.Root

const CustomAlertDialogTrigger = AlertDialogPrimitive.Trigger

const CustomAlertDialogPortal = AlertDialogPrimitive.Portal

const CustomAlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
    ref={ref}
  />
))
CustomAlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

interface CustomAlertDialogContentProps extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> {
  variant?: "success" | "warning" | "info" | "error"
}

const CustomAlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  CustomAlertDialogContentProps
>(({ className, variant = "info", children, ...props }, ref) => {
  const icons = {
    success: CheckCircle2,
    warning: AlertCircle,
    info: Info,
    error: XCircle,
  }

  const gradients = {
    success: "from-green-500/20 via-emerald-500/20 to-teal-500/20",
    warning: "from-yellow-500/20 via-orange-500/20 to-amber-500/20",
    info: "from-primary/20 via-accent/20 to-primary/20",
    error: "from-red-500/20 via-rose-500/20 to-pink-500/20",
  }

  const iconColors = {
    success: "text-green-500",
    warning: "text-yellow-500",
    info: "text-primary",
    error: "text-red-500",
  }

  const Icon = icons[variant]

  return (
    <CustomAlertDialogPortal>
      <CustomAlertDialogOverlay />
      <AlertDialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 w-[90%] max-w-lg translate-x-[-50%] translate-y-[-50%]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
          "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          "duration-300",
          className,
        )}
        {...props}
      >
        <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-background/95 backdrop-blur-xl shadow-2xl shadow-primary/20">
          {/* Gradient background */}
          <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", gradients[variant])} />

          {/* Decorative blurs */}
          <div className="absolute -top-24 -right-24 w-36 h-36 sm:w-48 sm:h-48 bg-primary/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-36 h-36 sm:w-48 sm:h-48 bg-accent/30 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative p-4 sm:p-8">
            {/* Icon */}
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="relative">
                <div className={cn("absolute inset-0 rounded-full blur-xl opacity-50", iconColors[variant])} />
                <div className="relative flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-background/50 backdrop-blur-sm border border-primary/20">
                  <Icon className={cn("h-6 w-6 sm:h-8 sm:w-8", iconColors[variant])} />
                </div>
              </div>
            </div>

            {children}
          </div>
        </div>
      </AlertDialogPrimitive.Content>
    </CustomAlertDialogPortal>
  )
})
CustomAlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const CustomAlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-2 text-center", className)} {...props} />
)
CustomAlertDialogHeader.displayName = "CustomAlertDialogHeader"

const CustomAlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse gap-3 sm:flex-row sm:justify-center mt-6", className)} {...props} />
)
CustomAlertDialogFooter.displayName = "CustomAlertDialogFooter"

const CustomAlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title ref={ref} className={cn("text-2xl font-bold text-foreground", className)} {...props} />
))
CustomAlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const CustomAlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-base text-muted-foreground leading-relaxed", className)}
    {...props}
  />
))
CustomAlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName

const CustomAlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(
      "w-full sm:w-auto inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold",
      "bg-gradient-to-r from-primary to-accent text-white",
      "hover:shadow-lg hover:shadow-primary/50 hover:scale-105",
      "transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
      "disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
))
CustomAlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const CustomAlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      "w-full sm:w-auto inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold",
      "bg-background/50 backdrop-blur-sm border border-border",
      "hover:bg-muted hover:border-primary/30",
      "transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
      className,
    )}
    {...props}
  />
))
CustomAlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  CustomAlertDialog,
  CustomAlertDialogPortal,
  CustomAlertDialogOverlay,
  CustomAlertDialogTrigger,
  CustomAlertDialogContent,
  CustomAlertDialogHeader,
  CustomAlertDialogFooter,
  CustomAlertDialogTitle,
  CustomAlertDialogDescription,
  CustomAlertDialogAction,
  CustomAlertDialogCancel,
}
