import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Code, Group, Stack, Text } from '@mantine/core'

export default function Versions() {
  const { t } = useTranslation()

  const versions = window.electron?.process?.versions

  const items = useMemo(() => {
    if (!versions) return []
    return [
      { label: t('Electron'), value: versions.electron },
      { label: t('Chromium'), value: versions.chrome },
      { label: t('Node'), value: versions.node }
    ]
  }, [t, versions])

  if (!versions) {
    return <Text c="dimmed">{t('Version info unavailable')}</Text>
  }

  return (
    <Stack gap={6}>
      {items.map((item) => (
        <Group key={item.label} justify="space-between">
          <Text size="sm" c="dimmed">
            {item.label}
          </Text>
          <Code>{item.value}</Code>
        </Group>
      ))}
    </Stack>
  )
}
