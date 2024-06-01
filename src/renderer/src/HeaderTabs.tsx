import cx from 'clsx'
import { useState } from 'react'
import {
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
  IconChevronDown
} from '@tabler/icons-react'
import { MantineLogo } from '@mantinex/mantine-logo'
import classes from './HeaderTabs.module.css'
import { ChartDemo } from './ChartDemo'

const user = {
  name: 'Jane Gao',
  email: 'janspoon@fighter.dev',
  image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png'
}

const tabs = [
  {
    name: 'Home',
    component: () => ChartDemo()
  },
  {
    name: 'Orders',
    component: () => <h2>Orders</h2>
  },
  {
    name: 'Education',
    component: () => <h2>Education</h2>
  },
  {
    name: 'Community',
    component: () => <h2>Community</h2>
  },
  {
    name: 'Forums',
    component: () => <h2>Forums</h2>
  },
  {
    name: 'Support',
    component: () => <h2>Support</h2>
  },
  {
    name: 'Account',
    component: () => <h2>Account</h2>
  },
  {
    name: 'Helpdesk',
    component: () => <h2>Helpdesk</h2>
  }
]

export function HeaderTabs() {
  const [opened, { toggle }] = useDisclosure(false)
  const [userMenuOpened, setUserMenuOpened] = useState(false)

  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab.name} key={tab.name}>
      {tab.name}
    </Tabs.Tab>
  ))

  const panels = tabs.map((tab) => (
    <Tabs.Panel value={tab.name} key={tab.name}>
      <Container h={100} style={{ height: '100%' }}>
        {tab.component()}
      </Container>
    </Tabs.Panel>
  ))

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection} size="md">
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
              <Menu.Label>Settings</Menu.Label>
              <Menu.Item
                leftSection={
                  <IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
              >
                Account settings
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconSwitchHorizontal style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
              >
                Change account
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
              >
                Logout
              </Menu.Item>

              <Menu.Divider />
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Container>
      <Container size="md">
        <Tabs
          defaultValue="Home"
          variant="outline"
          visibleFrom="sm"
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
