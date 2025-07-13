import { Moon, Sun } from "lucide-react"
import { useTheme } from "./ThemeProvider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative w-12 h-6 rounded-full border border-border bg-muted hover:bg-muted/80 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
    >
      <div
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-primary transition-transform duration-300 flex items-center justify-center ${
          theme === "dark" ? "translate-x-6" : "translate-x-0.5"
        }`}
      >
        {theme === "dark" ? (
          <Moon className="w-3 h-3 text-primary-foreground" />
        ) : (
          <Sun className="w-3 h-3 text-primary-foreground" />
        )}
      </div>
    </button>
  )
}