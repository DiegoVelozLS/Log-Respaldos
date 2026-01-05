'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logout } from '@/lib/actions';
import type { User } from '@/lib/definitions';
import { ChevronsLeftRight, LogOut } from 'lucide-react';
import {
  useSidebar,
} from "@/components/ui/sidebar"

export function UserNav({ user }: { user: User }) {
  const { state } = useSidebar();
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  }
  
  const fullName = `${user.firstName} ${user.lastName}`;

  if (state === 'collapsed') {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} alt={fullName} />
                    <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                    </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <form action={logout}>
                    <DropdownMenuItem asChild>
                    <button type="submit" className="w-full">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Cerrar sesión</span>
                    </button>
                    </DropdownMenuItem>
                </form>
            </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="flex w-full items-center justify-between rounded-md p-2 hover:bg-sidebar-accent">
        <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9">
                <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} alt={fullName} />
                <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="text-sm font-medium leading-none text-sidebar-foreground">{fullName}</span>
                <span className="text-xs leading-none text-muted-foreground">{user.email}</span>
            </div>
        </div>
        <form action={logout}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-sidebar-accent-foreground" type="submit">
                <LogOut className="h-4 w-4" />
            </Button>
        </form>
    </div>
  );
}
