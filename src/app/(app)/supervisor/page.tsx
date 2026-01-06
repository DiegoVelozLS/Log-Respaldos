import { getSession } from "@/auth";
import TasksToday from "@/components/dashboard/tasks-today";
import { getTodaysLogs } from "@/lib/data";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function SupervisorDashboardPage() {
  const session = await getSession();
  if (!session || (session.user.role !== 'supervisor' && session.user.role !== 'administrator')) return null;

  const logs = await getTodaysLogs();
  
  return (
    <div className="flex flex-col gap-6">
       <div>
        <h1 className="font-headline text-3xl font-bold">Panel de Supervisor</h1>
        <p className="text-muted-foreground">Supervisa el estado de los respaldos del día.</p>
      </div>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <TasksToday logs={logs} title="Estado de Tareas de Hoy" isAdmin />
      </Suspense>
    </div>
  );
}
