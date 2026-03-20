"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { cn } from "@/lib/utils/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui"
import { Button } from "@/components/ui"

type Theme = "light" | "dark" | "system"

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = React.useState<Theme>("light")
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme") as Theme | null
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme, systemPrefersDark)
    } else if (systemPrefersDark) {
      setTheme("system")
      applyTheme("system", systemPrefersDark)
    }
  }, [])

  const applyTheme = (newTheme: Theme, systemPrefersDark: boolean) => {
    const root = document.documentElement
    const isDark = newTheme === "dark" || (newTheme === "system" && systemPrefersDark)
    
    root.classList.remove("light", "dark")
    root.classList.add(isDark ? "dark" : "light")
  }

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    applyTheme(newTheme, systemPrefersDark)
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className={cn("h-8 w-8", className)}>
        <div className="h-4 w-4 bg-muted rounded animate-pulse" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("h-8 w-8", className)}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        <DropdownMenuItem 
          onClick={() => handleThemeChange("light")}
          className={cn("gap-2 cursor-pointer", theme === "light" && "bg-accent")}
        >
          <Sun className="h-4 w-4" />
          Claro
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange("dark")}
          className={cn("gap-2 cursor-pointer", theme === "dark" && "bg-accent")}
        >
          <Moon className="h-4 w-4" />
          Oscuro
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange("system")}
          className={cn("gap-2 cursor-pointer", theme === "system" && "bg-accent")}
        >
          <Monitor className="h-4 w-4" />
          Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
