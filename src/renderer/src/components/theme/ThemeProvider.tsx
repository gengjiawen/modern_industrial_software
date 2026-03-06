import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

type ThemeMode = 'light' | 'dark' | 'auto'
type ResolvedTheme = 'light' | 'dark'

type ThemeContextValue = {
  theme: ThemeMode
  resolvedTheme: ResolvedTheme
  setTheme: (theme: ThemeMode) => void
}

const THEME_STORAGE_KEY = 'app.theme'
const ThemeContext = createContext<ThemeContextValue | null>(null)

function getStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'auto'

  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (value === 'light' || value === 'dark' || value === 'auto') {
      return value
    }
  } catch {
    return 'auto'
  }

  return 'auto'
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<ThemeMode>(() => getStoredTheme())
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    const storedTheme = getStoredTheme()
    return storedTheme === 'auto' ? getSystemTheme() : storedTheme
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = () => {
      const nextResolvedTheme = theme === 'auto' ? getSystemTheme() : theme
      setResolvedTheme(nextResolvedTheme)
      document.documentElement.classList.toggle('dark', nextResolvedTheme === 'dark')
      document.documentElement.style.colorScheme = nextResolvedTheme
    }

    applyTheme()

    const handleMediaChange = () => {
      if (theme === 'auto') {
        applyTheme()
      }
    }

    mediaQuery.addEventListener('change', handleMediaChange)

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Ignore persistence issues.
    }

    return () => mediaQuery.removeEventListener('change', handleMediaChange)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme
    }),
    [resolvedTheme, theme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }

  return context
}
