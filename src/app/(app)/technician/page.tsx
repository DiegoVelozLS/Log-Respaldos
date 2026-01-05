import { getSession } from "@/auth";
import TasksToday from "@/components/dashboard/tasks-today";
import { getTodaysLogs } from "@/lib/data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function TechnicianDashboardPage() {
  const session = await getSession();
  if (!session) return null;

  const logs = await getTodaysLogs();
  const pendingCount = logs.filter(log => log.status === 'pending').length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Hola, {session.user.firstName}</h1>
        <p className="text-muted-foreground">Estas son tus tareas de respaldo para hoy.</p>
      </div>
      
      {pendingCount > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Tareas Pendientes</AlertTitle>
          <AlertDescription>
            Tienes {pendingCount} {pendingCount === 1 ? 'respaldo pendiente' : 'respaldos pendientes'} de registrar.
          </AlertDescription>
        </Alert>
      )}

      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <TasksToday logs={logs} title="Tareas de Hoy" />
      </Suspense>
    </div>
  );
}
