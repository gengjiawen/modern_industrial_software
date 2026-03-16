import { Outlet, useLocation, useMatchRoute } from '@tanstack/react-router'
import { ChevronDown, Globe, LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { AppSidebar } from '@/components/app/AppSidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

const user = {
  name: 'Jane Gao',
  email: 'janspoon@fighter.dev',
  image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png'
}

export function AppShell() {
  const { t } = useTranslation()
  const matchRoute = useMatchRoute()
  const pathname = useLocation({
    select: (location) => location.pathname
  })
  const isStandaloneSettings = Boolean(
    matchRoute({
      includeSearch: true,
      search: { standalone: '1' },
      to: '/settings'
    })
  )

  if (isStandaloneSettings) {
    return (
      <main className="min-h-svh bg-background">
        <Outlet />
      </main>
    )
  }

  const titleMap: Record<string, string> = {
    '/': t('Home'),
    '/community': t('Community'),
    '/forums': t('Forums'),
    '/messages': t('Messages'),
    '/settings': t('Settings'),
    '/support': t('Support'),
    '/upload': t('Upload')
  }
  const activeLabel = titleMap[pathname] ?? t('Page not found')
  const contentClassName =
    pathname === '/settings' ? 'flex-1 overflow-y-auto' : 'flex-1 overflow-y-auto p-4 lg:p-6'

  return (
    <SidebarProvider>
      <AppSidebar />
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

        <main className={contentClassName}>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
