import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChevronDown,
  Factory,
  Globe,
  Home,
  LogOut,
  MessageSquareText,
  PanelsTopLeft,
  Settings,
  ShieldCheck,
  Upload,
  Users
} from 'lucide-react'

import { ChartDemo } from '@/ChartDemo'
import { UploadPage } from '@/UploadPage'
import { SettingsPage } from '@/components/settings/SettingsPage'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger
} from '@/components/ui/sidebar'

type MainViewId = 'home' | 'upload' | 'messages' | 'community' | 'forums' | 'support' | 'settings'

type PlaceholderPanelProps = {
  icon: ReactNode
  title: string
  description: string
}

type SidebarItem = {
  id: MainViewId
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const SETTINGS_HASHES = new Set(['#settings', '#/settings'])

const user = {
  name: 'Jane Gao',
  email: 'janspoon@fighter.dev',
  image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png'
}

const quickStats = [
  { key: 'Pipeline lanes', value: '04' },
  { key: 'Signal groups', value: '12' },
  { key: 'Open datasets', value: '06' }
] as const

function isSettingsRoute(hash: string) {
  return (
    SETTINGS_HASHES.has(hash) || hash.startsWith('#settings?') || hash.startsWith('#/settings?')
  )
}

function PlaceholderPanel({ icon, title, description }: PlaceholderPanelProps) {
  return (
    <Card>
      <CardContent className="flex min-h-[360px] flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="rounded-md border p-3 text-muted-foreground">{icon}</div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="max-w-xl text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function HomePanel({
  onOpenUpload,
  onOpenMessages
}: {
  onOpenUpload: () => void
  onOpenMessages: () => void
}) {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="space-y-4">
          <div>
            <CardTitle>{t('Operations deck')}</CardTitle>
            <CardDescription>{t('Operations deck description')}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={onOpenUpload}>
              <Upload className="size-4" />
              {t('Upload')}
            </Button>
            <Button size="sm" variant="outline" onClick={onOpenMessages}>
              <MessageSquareText className="size-4" />
              {t('Messages')}
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {quickStats.map((stat) => (
              <div key={stat.key} className="rounded-lg border px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {t(stat.key)}
                </p>
                <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
              </div>
            ))}
          </div>
        </CardHeader>
      </Card>

      <ChartDemo />
    </div>
  )
}

function AppSidebar({
  activeView,
  onSelect
}: {
  activeView: MainViewId
  onSelect: (id: MainViewId) => void
}) {
  const { t } = useTranslation()

  const primaryItems = useMemo(
    () => [
      { id: 'home' as const, label: t('Home'), icon: Home },
      { id: 'upload' as const, label: t('Upload'), icon: Upload },
      { id: 'messages' as const, label: t('Messages'), icon: MessageSquareText }
    ],
    [t]
  )

  const secondaryItems = useMemo(
    () => [
      { id: 'community' as const, label: t('Community'), icon: Users },
      { id: 'forums' as const, label: t('Forums'), icon: PanelsTopLeft },
      { id: 'support' as const, label: t('Support'), icon: ShieldCheck }
    ],
    [t]
  )

  const renderItems = (items: SidebarItem[]) =>
    items.map((item) => {
      const Icon = item.icon

      return (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton
            tooltip={item.label}
            isActive={activeView === item.id}
            onClick={() => onSelect(item.id)}
          >
            <Icon />
            <span>{item.label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )
    })

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#" onClick={(e) => { e.preventDefault(); onSelect('home') }}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Factory className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{t('App title')}</span>
                  <span className="text-xs">{t('Workspace label')}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('Operations deck')}</SidebarGroupLabel>
          <SidebarMenu>{renderItems(primaryItems)}</SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>{t('Sections')}</SidebarGroupLabel>
          <SidebarMenu>{renderItems(secondaryItems)}</SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={activeView === 'settings'}
              onClick={() => onSelect('settings')}
            >
              <Settings />
              <span>{t('Settings')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function MainWorkspace() {
  const { t } = useTranslation()
  const [activeView, setActiveView] = useState<MainViewId>('home')

  const activeLabel = useMemo(() => {
    const map: Record<MainViewId, string> = {
      home: t('Home'),
      upload: t('Upload'),
      messages: t('Messages'),
      community: t('Community'),
      forums: t('Forums'),
      support: t('Support'),
      settings: t('Settings')
    }

    return map[activeView]
  }, [activeView, t])

  return (
    <SidebarProvider>
      <AppSidebar activeView={activeView} onSelect={setActiveView} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center justify-between border-b px-4 lg:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div>
              <p className="text-sm font-medium">{activeLabel}</p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                {t('Workspace label')}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 gap-2 px-2">
                <Avatar className="size-7">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <ChevronDown className="size-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {t('Signed in as')}
                  </p>
                  <p>{user.name}</p>
                  <p className="text-xs font-normal text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                <Globe className="size-4" />
                {t('Change account')}
              </DropdownMenuItem>
              <DropdownMenuItem disabled variant="destructive">
                <LogOut className="size-4" />
                {t('Logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className={activeView === 'settings' ? 'flex-1 overflow-y-auto' : 'flex-1 overflow-y-auto p-4 lg:p-6'}>
          {activeView === 'home' ? (
            <HomePanel
              onOpenUpload={() => setActiveView('upload')}
              onOpenMessages={() => setActiveView('messages')}
            />
          ) : null}
          {activeView === 'upload' ? <UploadPage /> : null}
          {activeView === 'messages' ? <ChartDemo /> : null}
          {activeView === 'settings' ? <SettingsPage /> : null}
          {activeView === 'community' ? (
            <PlaceholderPanel
              icon={<Users className="size-6" />}
              title={t('Community')}
              description={t('Community description')}
            />
          ) : null}
          {activeView === 'forums' ? (
            <PlaceholderPanel
              icon={<PanelsTopLeft className="size-6" />}
              title={t('Forums')}
              description={t('Forums description')}
            />
          ) : null}
          {activeView === 'support' ? (
            <PlaceholderPanel
              icon={<ShieldCheck className="size-6" />}
              title={t('Support')}
              description={t('Support description')}
            />
          ) : null}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function App() {
  const [settingsRoute, setSettingsRoute] = useState(() =>
    typeof window !== 'undefined' ? isSettingsRoute(window.location.hash) : false
  )

  useEffect(() => {
    const updateRoute = () => setSettingsRoute(isSettingsRoute(window.location.hash))

    updateRoute()
    window.addEventListener('hashchange', updateRoute)

    return () => window.removeEventListener('hashchange', updateRoute)
  }, [])

  return settingsRoute ? <SettingsPage /> : <MainWorkspace />
}
