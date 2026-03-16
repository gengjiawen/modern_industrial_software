import { useAtom } from 'jotai'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Info, Search, Settings2 } from 'lucide-react'

import { useTheme } from '@/components/theme/ThemeProvider'
import { isSupportedLanguage, languageAtom } from '@/i18n/language'
import Versions from '@/components/Versions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

type SettingsSectionId = 'general' | 'about'

type SettingsPageProps = {
  standalone?: boolean
}

export function SettingsPage({ standalone = false }: SettingsPageProps) {
  const { t } = useTranslation()
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [languageValue, setLanguageValue] = useAtom(languageAtom)
  const [activeSection, setActiveSection] = useState<SettingsSectionId>('general')
  const [query, setQuery] = useState('')

  const sections = useMemo(
    () => [
      { id: 'general' as const, label: t('General'), icon: Settings2 },
      { id: 'about' as const, label: t('About'), icon: Info }
    ],
    [t]
  )

  const visibleSections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return sections

    return sections.filter((section) => section.label.toLowerCase().includes(normalizedQuery))
  }, [query, sections])
  return (
    <div className="space-y-4 p-4">
      {standalone ? (
        <div>
          <h1 className="text-lg font-semibold">{t('Settings')}</h1>
          <p className="text-xs text-muted-foreground">{t('Settings description')}</p>
        </div>
      ) : null}
      <div className="grid gap-3 lg:grid-cols-[200px_minmax(0,1fr)]">
        <Card className="h-fit py-2">
          <CardHeader className="px-3 pb-2 pt-0">
            <CardTitle className="text-sm">{t('Sections')}</CardTitle>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                placeholder={t('Search')}
                className="h-7 pl-7 text-xs"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-0.5 px-3 pt-0">
            {visibleSections.length ? (
              visibleSections.map((section) => {
                const Icon = section.icon
                const active = activeSection === section.id

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors',
                      active
                        ? 'bg-secondary text-secondary-foreground'
                        : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                    )}
                  >
                    <Icon className="size-3.5" />
                    <span>{section.label}</span>
                  </button>
                )
              })
            ) : (
              <div className="rounded-md border px-2.5 py-3 text-xs text-muted-foreground">
                {t('No matching sections')}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="py-2">
          <CardContent className="space-y-3 px-4 pt-0">
            {activeSection === 'general' ? (
              <div className="space-y-3">
                <div>
                  <h2 className="text-sm font-semibold">{t('General')}</h2>
                  <p className="text-xs text-muted-foreground">{t('General description')}</p>
                </div>

                <div className="space-y-1.5">
                  <div>
                    <label className="text-xs font-medium">{t('Language')}</label>
                    <p className="text-[11px] text-muted-foreground">{t('Language description')}</p>
                  </div>
                  <Select
                    value={languageValue}
                    onValueChange={(value) => {
                      if (isSupportedLanguage(value)) {
                        setLanguageValue(value)
                      }
                    }}
                  >
                    <SelectTrigger className="h-8 w-full text-xs sm:max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-US">{t('English (US)')}</SelectItem>
                      <SelectItem value="zh-CN">{t('Chinese (Simplified)')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-1.5">
                  <div>
                    <label className="text-xs font-medium">{t('Theme')}</label>
                    <p className="text-[11px] text-muted-foreground">{t('Theme description')}</p>
                  </div>
                  <div className="flex gap-1.5">
                    {[
                      { value: 'auto' as const, label: t('Auto') },
                      { value: 'light' as const, label: t('Light') },
                      { value: 'dark' as const, label: t('Dark') }
                    ].map((option) => (
                      <Button
                        key={option.value}
                        variant={theme === option.value ? 'default' : 'outline'}
                        size="sm"
                        className="h-7 px-3 text-xs"
                        onClick={() => setTheme(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {activeSection === 'about' ? (
              <div className="space-y-3">
                <div>
                  <h2 className="text-sm font-semibold">{t('About')}</h2>
                  <p className="text-xs text-muted-foreground">{t('About description')}</p>
                </div>

                <div className="space-y-1.5">
                  <div>
                    <label className="text-xs font-medium">{t('Version information')}</label>
                    <p className="text-[11px] text-muted-foreground">
                      {t('Version information description')}
                    </p>
                  </div>
                  <Versions />
                </div>
              </div>
            ) : null}

            <Separator />

            <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
              <span>
                {t('Resolved theme')}: {resolvedTheme}
              </span>
              <span>•</span>
              <span>
                {t('Language')}: {languageValue}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
