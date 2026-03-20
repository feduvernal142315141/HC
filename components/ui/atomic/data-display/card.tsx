import * as React from "react"
import { cn } from "@/lib/utils/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        // NeoGlass Card Style
        "relative flex flex-col gap-5 rounded-2xl border border-border bg-card p-6",
        "shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.03)]",
        "transition-all duration-200 ease-out",
        // Hover effect
        "hover:shadow-[0_8px_16px_-4px_rgba(0,0,0,0.06),0_4px_6px_-2px_rgba(0,0,0,0.03),0_0_0_1px_rgba(0,0,0,0.04)]",
        "hover:border-border/80",
        // Dark mode
        "dark:bg-card dark:border-border",
        "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_1px_3px_rgba(0,0,0,0.2)]",
        "dark:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_16px_-4px_rgba(0,0,0,0.3)]",
        "dark:hover:border-[oklch(0.32_0.018_265)]",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col gap-1.5",
        "[&:has([data-slot=card-action])]:flex-row [&:has([data-slot=card-action])]:items-start [&:has([data-slot=card-action])]:justify-between",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={cn(
        "text-base font-semibold leading-tight tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn(
        "text-sm text-muted-foreground leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("shrink-0", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center gap-3 pt-2",
        "[&:has(.border-t)]:pt-5 [&:has(.border-t)]:mt-auto",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
