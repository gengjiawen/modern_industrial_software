import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Divider,
  Flex,
  NavLink,
  Paper,
  ScrollArea,
  SegmentedControl,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineColorScheme
} from '@mantine/core'
import { IconAdjustments, IconInfoCircle, IconSearch } from '@tabler/icons-react'
import Versions from '../Versions'

type SettingsSectionId = 'general' | 'about'

const LANGUAGE_STORAGE_KEY = 'app.language'

export function SettingsPage() {
  const { t, i18n } = useTranslation()
  const { colorScheme, setColorScheme } = useMantineColorScheme()

  const isMac = window.electron?.process?.platform === 'darwin'

  const [activeSection, setActiveSection] = useState<SettingsSectionId>('general')
  const [query, setQuery] = useState('')

  const sections = useMemo(
    () =>
      [
        { id: 'general' as const, label: t('General'), icon: <IconAdjustments size={18} /> },
        { id: 'about' as const, label: t('About'), icon: <IconInfoCircle size={18} /> }
      ].filter((s) => s.label.toLowerCase().includes(query.trim().toLowerCase())),
    [query, t]
  )

  const languageValue = i18n.resolvedLanguage === 'zh-CN' ? 'zh-CN' : 'en-US'

  return (
    <Paper
      withBorder
      radius="md"
      p="md"
      h="100%"
      // On macOS with `titleBarStyle: 'hiddenInset'`, traffic lights can overlap the web contents.
      // Add extra top padding so the search field is not under the titlebar controls.
      style={isMac ? { paddingTop: 'calc(var(--mantine-spacing-md) + 28px)' } : undefined}
    >
      <Flex h="100%" gap="md" wrap="nowrap">
        <Stack w={280} gap="sm" style={{ flexShrink: 0 }}>
          <TextInput
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            placeholder={t('Search')}
            leftSection={<IconSearch size={16} />}
          />
          <ScrollArea type="auto" offsetScrollbars scrollbarSize={8} style={{ flex: 1 }}>
            <Stack gap={4}>
              {sections.map((section) => (
                <NavLink
                  key={section.id}
                  label={section.label}
                  leftSection={section.icon}
                  active={activeSection === section.id}
                  onClick={() => setActiveSection(section.id)}
                />
              ))}
            </Stack>
          </ScrollArea>
        </Stack>

        <Divider orientation="vertical" />

        <ScrollArea type="auto" offsetScrollbars scrollbarSize={8} style={{ flex: 1 }}>
          <Box pr="sm">
            {activeSection === 'general' && (
              <Stack gap="md">
                <Title order={2}>{t('General')}</Title>

                <Paper withBorder radius="md" p="md">
                  <Stack gap="sm">
                    <Text fw={600}>{t('Language')}</Text>
                    <Select
                      value={languageValue}
                      onChange={(value) => {
                        if (!value) return
                        try {
                          window.localStorage.setItem(LANGUAGE_STORAGE_KEY, value)
                        } catch {
                          // ignore persistence errors
                        }
                        void i18n.changeLanguage(value)
                      }}
                      data={[
                        { value: 'en-US', label: t('English (US)') },
                        { value: 'zh-CN', label: t('Chinese (Simplified)') }
                      ]}
                      allowDeselect={false}
                    />
                  </Stack>
                </Paper>

                <Paper withBorder radius="md" p="md">
                  <Stack gap="sm">
                    <Text fw={600}>{t('Theme')}</Text>
                    <SegmentedControl
                      value={colorScheme}
                      onChange={(value) => setColorScheme(value as 'light' | 'dark' | 'auto')}
                      data={[
                        { value: 'auto', label: t('Auto') },
                        { value: 'light', label: t('Light') },
                        { value: 'dark', label: t('Dark') }
                      ]}
                    />
                  </Stack>
                </Paper>
              </Stack>
            )}

            {activeSection === 'about' && (
              <Stack gap="md">
                <Title order={2}>{t('About')}</Title>

                <Paper withBorder radius="md" p="md">
                  <Stack gap="xs">
                    <Text fw={600}>{t('Version information')}</Text>
                    <Versions />
                  </Stack>
                </Paper>
              </Stack>
            )}
          </Box>
        </ScrollArea>
      </Flex>
    </Paper>
  )
}
