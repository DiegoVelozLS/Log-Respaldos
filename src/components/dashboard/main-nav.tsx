'use client';

import type { UserRole } from '@/lib/definitions';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  History,
  AreaChart,
  Calendar,
  Settings,
} from 'lucide-react';
import Link from 'next/link';

type NavLink = {
  href?: string;
  label: string;
  icon: React.ElementType;
  roles: UserRole[];
  subItems?: NavLink[];
};

const navLinks: NavLink[] = [
  { href: '/dashboard', label: 'Panel Principal', icon: LayoutDashboard, roles: ['administrator', 'supervisor', 'technician'] },
  { href: '/technician/calendar', label: 'Calendario', icon: Calendar, roles: ['technician'] },
  { href: '/supervisor/reports', label: 'Reportes', icon: AreaChart, roles: ['supervisor'] },
  { href: '/supervisor/calendar', label: 'Calendario General', icon: Calendar, roles: ['supervisor', 'administrator'] },
  { 
    label: 'Administración', 
    icon: Settings, 
    roles: ['administrator'],
    subItems: [
        { href: '/admin/users', label: 'Usuarios', icon: Users, roles: ['administrator'] },
        { href: '/admin/schedules', label: 'Programación', icon: CalendarClock, roles: ['administrator'] },
        { href: '/admin/history', label: 'Historial', icon: History, roles: ['administrator'] },
    ]
  },
];

export function MainNav({ role }: { role: UserRole }) {
  const pathname = usePathname();

  const getDashboardPath = () => {
    if (role === 'administrator') return '/admin';
    if (role === 'supervisor') return '/supervisor';
    return '/technician';
  }

  const renderLink = (link: NavLink) => {
    const href = link.href === '/dashboard' ? getDashboardPath() : link.href;

    if (link.subItems && link.subItems.length > 0) {
      const isSubItemActive = link.subItems.some(sub => pathname === sub.href);
      return (
        <SidebarMenuItem>
          <SidebarMenuButton
            isActive={isSubItemActive}
            tooltip={link.label}
          >
            <link.icon />
            <span>{link.label}</span>
          </SidebarMenuButton>
          <SidebarMenuSub>
            {link.subItems.map(subItem => (
              <SidebarMenuSubButton key={subItem.href} asChild isActive={pathname === subItem.href}>
                 <Link href={subItem.href!}>
                  <subItem.icon />
                  <span>{subItem.label}</span>
                </Link>
              </SidebarMenuSubButton>
            ))}
          </SidebarMenuSub>
        </SidebarMenuItem>
      )
    }

    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={pathname === href}
          tooltip={link.label}
        >
          <Link href={href!}>
            <link.icon />
            <span>{link.label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenu>
      {navLinks
        .filter(link => link.roles.includes(role))
        .map(link => (
            <React.Fragment key={link.label}>
                {renderLink(link)}
            </React.Fragment>
        ))}
    </SidebarMenu>
  );
}
