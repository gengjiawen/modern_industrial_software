import type React from 'react'
import { Link, useMatchRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  Factory,
  Home,
  MessageSquareText,
  PanelsTopLeft,
  Settings,
  ShieldCheck,
  Upload,
  Users
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar'

type NavItem = {
  icon: React.ComponentType<{ className?: string }>
  label: string
  to: '/' | '/upload' | '/messages' | '/community' | '/forums' | '/support' | '/settings'
}

export function AppSidebar() {
  const { t } = useTranslation()
  const matchRoute = useMatchRoute()

  const primaryItems: NavItem[] = [
    { icon: Home, label: t('Home'), to: '/' },
    { icon: Upload, label: t('Upload'), to: '/upload' },
    { icon: MessageSquareText, label: t('Messages'), to: '/messages' }
  ]

  const secondaryItems: NavItem[] = [
    { icon: Users, label: t('Community'), to: '/community' },
    { icon: PanelsTopLeft, label: t('Forums'), to: '/forums' },
    { icon: ShieldCheck, label: t('Support'), to: '/support' }
  ]

  function renderItems(items: NavItem[]) {
    return items.map((item) => {
      const Icon = item.icon
      const isActive = Boolean(matchRoute({ to: item.to }))

      return (
        <SidebarMenuItem key={item.to}>
          <SidebarMenuButton tooltip={item.label} isActive={isActive} asChild>
            <Link to={item.to}>
              <Icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )
    })
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Factory className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{t('App title')}</span>
                  <span className="text-xs">{t('Workspace label')}</span>
                </div>
              </Link>
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
            <SidebarMenuButton isActive={Boolean(matchRoute({ to: '/settings' }))} asChild>
              <Link to="/settings">
                <Settings />
                <span>{t('Settings')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
