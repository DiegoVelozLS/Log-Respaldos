'use client';

import type { UserRole } from '@/lib/definitions';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  History,
  AreaChart,
  Calendar,
  ClipboardCheck,
} from 'lucide-react';
import Link from 'next/link';

type NavLink = {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: UserRole[];
};

const navLinks: NavLink[] = [
  { href: '/dashboard', label: 'Panel Principal', icon: LayoutDashboard, roles: ['administrator', 'supervisor', 'technician'] },
  { href: '/technician/calendar', label: 'Calendario', icon: Calendar, roles: ['technician'] },
  { href: '/supervisor/reports', label: 'Reportes', icon: AreaChart, roles: ['supervisor'] },
  { href: '/supervisor/calendar', label: 'Calendario General', icon: Calendar, roles: ['supervisor', 'administrator'] },
  { href: '/admin/users', label: 'Usuarios', icon: Users, roles: ['administrator'] },
  { href: '/admin/schedules', label: 'Programación', icon: CalendarClock, roles: ['administrator'] },
  { href: '/admin/history', label: 'Historial', icon: History, roles: ['administrator'] },
];

export function MainNav({ role }: { role: UserRole }) {
  const pathname = usePathname();

  const getDashboardPath = () => {
    if (role === 'administrator') return '/admin';
    if (role === 'supervisor') return '/supervisor';
    return '/technician';
  }

  return (
    <SidebarMenu>
      {navLinks
        .filter(link => {
            if (link.href === '/dashboard') return true;
            return link.roles.includes(role)
        })
        .map(link => {
            const href = link.href === '/dashboard' ? getDashboardPath() : link.href;
            return (
                <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                    asChild
                    isActive={pathname === href}
                    tooltip={link.label}
                    >
                    <Link href={href}>
                        <link.icon />
                        <span>{link.label}</span>
                    </Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
            )
        })}
    </SidebarMenu>
  );
}
