import { rem, Tabs } from '@mantine/core'
import { IconMessageCircle, IconPhoto, IconSettings } from '@tabler/icons-react'
import classes from './Home.module.css'
import { ChartDemo } from './ChartDemo'
import Versions from './components/Versions'

export function Home() {
  return (
    <Tabs
      variant="unstyled"
      defaultValue="settings"
      classNames={classes}
      orientation="vertical"
      style={{ marginTop: '20px' }}
    >
      <Tabs.List>
        <Tabs.Tab
          value="settings"
          leftSection={<IconSettings style={{ width: rem(16), height: rem(16) }} />}
        >
          Settings
        </Tabs.Tab>
        <Tabs.Tab
          value="messages"
          leftSection={<IconMessageCircle style={{ width: rem(16), height: rem(16) }} />}
        >
          Messages
        </Tabs.Tab>
        <Tabs.Tab
          value="gallery"
          leftSection={<IconPhoto style={{ width: rem(16), height: rem(16) }} />}
        >
          Gallery
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="settings">
        <ChartDemo />
      </Tabs.Panel>
      <Tabs.Panel value="gallery">
        <Versions />
      </Tabs.Panel>
      <Tabs.Panel value="messages">Messages tab content</Tabs.Panel>
    </Tabs>
  )
}
