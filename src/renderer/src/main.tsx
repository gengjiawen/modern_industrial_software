import React from 'react'
import ReactDOM from 'react-dom/client'
import '@mantine/core/styles.css'
import './i18n'
import '@mantine/charts/styles.css'
import cx from 'clsx'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  MantineProvider,
  Container,
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  Tabs,
  Burger,
  rem
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  IconLogout,
  IconSettings,
  IconSwitchHorizontal,
  IconChevronDown,
  IconMessageCircle,
  IconPhoto
} from '@tabler/icons-react'
import { MantineLogo } from '@mantinex/mantine-logo'
import classes from './MainTabs.module.css'
// Home styles merged into HeaderTabs.module.css as .homeTab
import { ChartDemo } from './ChartDemo'
import Versions from './components/Versions'
import { UploadPage } from './UploadPage'
import { theme } from './theme'

const user = {
  name: 'Jane Gao',
  email: 'janspoon@fighter.dev',
  image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png'
}

function Home() {
  const { t } = useTranslation()
  return (
    <Tabs
      variant="unstyled"
      defaultValue="settings"
      classNames={{ tab: classes.homeTab }}
      orientation="vertical"
      style={{ marginTop: '20px' }}
    >
      <Tabs.List>
        <Tabs.Tab
          value="settings"
          leftSection={<IconSettings style={{ width: rem(16), height: rem(16) }} />}
        >
          {t('Settings')}
        </Tabs.Tab>
        <Tabs.Tab
          value="messages"
          leftSection={<IconMessageCircle style={{ width: rem(16), height: rem(16) }} />}
        >
          {t('Messages')}
        </Tabs.Tab>
        <Tabs.Tab
          value="gallery"
          leftSection={<IconPhoto style={{ width: rem(16), height: rem(16) }} />}
        >
          {t('Gallery')}
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="settings" className="w100">
        <UploadPage />
      </Tabs.Panel>
      <Tabs.Panel value="gallery">
        <Versions />
      </Tabs.Panel>
      <Tabs.Panel value="messages">
        <ChartDemo />
      </Tabs.Panel>
    </Tabs>
  )
}

const Community = () => {
  const { t } = useTranslation()
  return <h2>{t('Community')}</h2>
}

const Forums = () => {
  const { t } = useTranslation()
  return <h2>{t('Forums')}</h2>
}

const Support = () => {
  const { t } = useTranslation()
  return <h2>{t('Support')}</h2>
}

const tabs = [
  {
    name: 'Home',
    component: () => <Home />
  },
  {
    name: 'Community',
    component: () => <Community />
  },
  {
    name: 'Forums',
    component: () => <Forums />
  },
  {
    name: 'Support',
    component: () => <Support />
  }
]

function MainTabs() {
  const { t } = useTranslation()
  const [opened, { toggle }] = useDisclosure(false)
  const [userMenuOpened, setUserMenuOpened] = useState(false)

  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab.name} key={tab.name}>
      {t(tab.name)}
    </Tabs.Tab>
  ))

  const panels = tabs.map((tab) => (
    <Tabs.Panel value={tab.name} key={tab.name}>
      <Container h={100} style={{ height: '100%', maxWidth: 'none' }}>
        {tab.component()}
      </Container>
    </Tabs.Panel>
  ))

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection} size="xl">
        <Group justify="space-between">
          <MantineLogo size={28} />

          <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />

          <Menu
            width={260}
            position="bottom-end"
            transitionProps={{ transition: 'pop-top-right' }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
          >
            <Menu.Target>
              <UnstyledButton
                className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
              >
                <Group gap={7}>
                  <Avatar src={user.image} alt={user.name} radius="xl" size={20} />
                  <Text fw={500} size="sm" lh={1} mr={3}>
                    {user.name}
                  </Text>
                  <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>{t('Settings')}</Menu.Label>
              <Menu.Item
                leftSection={
                  <IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
              >
                {t('Account settings')}
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconSwitchHorizontal style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
              >
                {t('Change account')}
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
              >
                {t('Logout')}
              </Menu.Item>

              <Menu.Divider />
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Container>
      <Container size="xl">
        <Tabs
          defaultValue="Home"
          variant="outline"
          classNames={{
            root: classes.tabs,
            list: classes.tabsList,
            tab: classes.tab
          }}
        >
          <Tabs.List>{items}</Tabs.List>
          {panels}
        </Tabs>
      </Container>
    </div>
  )
}

function App(): JSX.Element {
  return (
    <MantineProvider theme={theme}>
      <MainTabs />
    </MantineProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
