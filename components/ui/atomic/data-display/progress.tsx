"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils/utils"

interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  variant?: "default" | "success" | "warning" | "destructive"
  showValue?: boolean
}

function Progress({
  className,
  value,
  variant = "default",
  showValue = false,
  ...props
}: ProgressProps) {
  const variantStyles = {
    default: "bg-gradient-to-r from-primary to-[oklch(0.60_0.16_210)]",
    success: "bg-gradient-to-r from-success to-[oklch(0.70_0.16_145)]",
    warning: "bg-gradient-to-r from-warning to-[oklch(0.78_0.14_65)]",
    destructive: "bg-gradient-to-r from-destructive to-[oklch(0.62_0.20_15)]",
  }

  return (
    <div className="relative">
      <ProgressPrimitive.Root
        data-slot="progress"
        className={cn(
          "relative h-2.5 w-full overflow-hidden rounded-full",
          "bg-muted",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className={cn(
            "h-full w-full flex-1 rounded-full transition-all duration-500 ease-out",
            variantStyles[variant]
          )}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
      {showValue && (
        <span className="absolute right-0 -top-5 text-xs font-medium text-muted-foreground">
          {Math.round(value || 0)}%
        </span>
      )}
    </div>
  )
}

export { Progress }
