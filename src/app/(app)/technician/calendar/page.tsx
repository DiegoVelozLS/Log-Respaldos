'use client';

import { useEffect, useState, useMemo } from "react";
import { getLogs } from "@/lib/data";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { BackupLog } from "@/lib/definitions";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const statusConfig = {
  pending: {
    label: 'Pendiente',
    icon: <Clock className="h-4 w-4" />,
    badgeVariant: 'secondary',
  },
  completed: {
    label: 'Completado',
    icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    badgeVariant: 'default',
    badgeClassName: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  },
  with_issues: {
    label: 'Con Novedades',
    icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
    badgeVariant: 'default',
    badgeClassName: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  },
  failed: {
    label: 'Fallido',
    icon: <XCircle className="h-4 w-4 text-red-500" />,
    badgeVariant: 'destructive',
  },
} as const;


function LogItem({ log }: { log: BackupLog }) {
    const config = statusConfig[log.status];
    return (
        <div className="flex items-center justify-between gap-4 rounded-lg p-3 hover:bg-muted/50">
            <div className="flex items-center gap-3">
                {config.icon}
                <div className="flex flex-col">
                    <span className="font-medium">{log.backupName}</span>
                    <span className="text-sm text-muted-foreground">{log.backupType}</span>
                </div>
            </div>
            {log.status === 'pending' ? (
                 <Button asChild variant="outline" size="sm">
                    <Link href={`/technician/register/${log.id}`}>
                        Registrar
                    </Link>
                </Button>
            ) : (
                <Badge variant={config.badgeVariant as any} className={config.badgeClassName}>
                    {config.label}
                </Badge>
            )}
        </div>
    )
}


export default function CalendarPage() {
  const [logs, setLogs] = useState<BackupLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      const allLogs = await getLogs();
      setLogs(allLogs);
      setLoading(false);
    }
    fetchLogs();
  }, []);

  const logsByDate = useMemo(() => {
    return logs.reduce((acc, log) => {
      const date = log.scheduledDate;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(log);
      return acc;
    }, {} as Record<string, BackupLog[]>);
  }, [logs]);

  const modifiers = {
    scheduled: (date: Date) => {
      const dateString = date.toISOString().split('T')[0];
      return !!logsByDate[dateString];
    }
  };

  const modifiersStyles = {
    scheduled: {
      fontWeight: 'bold',
      backgroundColor: 'hsl(var(--accent))',
      borderRadius: '9999px',
    }
  };
  
  if (loading) {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-4 w-3/4 mt-2" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardContent className="p-2 sm:p-4">
                        <Skeleton className="h-[300px] w-full" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
       <div>
        <h1 className="font-headline text-3xl font-bold">Calendario de Tareas</h1>
        <p className="text-muted-foreground">Visualiza tus tareas de respaldo pasadas y futuras.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
            <CardContent className="p-2 sm:p-4">
                <Calendar
                mode="single"
                locale={es}
                className="w-full"
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Agenda</CardTitle>
                <CardDescription>Resumen de tareas.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-2">
                {Object.entries(logsByDate).slice(-5).reverse().map(([date, dateLogs]) => (
                    <div key={date}>
                        <h3 className="font-semibold text-lg mb-2">{new Date(date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                        <div className="flex flex-col gap-2">
                            {dateLogs.map(log => <LogItem key={log.id} log={log} />)}
                        </div>
                    </div>
                ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
