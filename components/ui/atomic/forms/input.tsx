import * as React from "react"
import { cn } from "@/lib/utils/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        data-slot="input"
        className={cn(
          // Base styles - Premium NeoGlass input
          "flex h-10 w-full min-w-0 rounded-xl border bg-input px-4 py-2.5 text-sm text-foreground",
          "placeholder:text-muted-foreground/60",
          "transition-all duration-150 ease-out",
          // Border styles
          "border-border",
          "hover:border-border/80 hover:bg-input/80",
          // Focus styles with glow
          "focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-ring",
          // Selection
          "selection:bg-primary/20 selection:text-foreground",
          // File input
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "file:mr-4 file:py-1 file:px-3 file:rounded-lg file:bg-muted file:cursor-pointer",
          "file:hover:bg-muted/80",
          // Disabled state
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/50",
          // Invalid state
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/30",
          // Dark mode
          "dark:bg-input dark:border-border",
          "dark:hover:border-border/60 dark:hover:bg-input/60",
          "dark:focus:border-primary dark:focus:ring-ring",
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }
