import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils/utils"

const badgeVariants = cva(
  // Base styles - Premium capsule design
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-150 ease-out [&>svg]:size-3 [&>svg]:shrink-0 [&>svg]:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "bg-destructive/12 text-destructive border border-destructive/20 dark:bg-destructive/20 dark:border-destructive/30",
        success:
          "bg-success/12 text-success border border-success/20 dark:bg-success/20 dark:border-success/30",
        warning:
          "bg-warning/15 text-[oklch(0.45_0.12_75)] border border-warning/25 dark:bg-warning/20 dark:text-warning dark:border-warning/30",
        info:
          "bg-info/12 text-info border border-info/20 dark:bg-info/20 dark:border-info/30",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
        ghost:
          "bg-muted/60 text-muted-foreground hover:bg-muted",
      },
      size: {
        default: "h-6 text-xs px-2.5",
        sm: "h-5 text-[10px] px-2",
        lg: "h-7 text-sm px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
}

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
