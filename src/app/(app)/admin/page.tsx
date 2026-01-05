import { getSession } from "@/auth";
import TasksToday from "@/components/dashboard/tasks-today";
import { getTodaysLogs } from "@/lib/data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session || session.user.role !== 'administrator') return null;

  const logs = await getTodaysLogs();
  const pendingCount = logs.filter(l => l.status === 'pending').length;
  const completedCount = logs.filter(l => l.status === 'completed').length;
  const issuesCount = logs.filter(l => l.status === 'with_issues').length;
  const failedCount = logs.filter(l => l.status === 'failed').length;
  const totalCount = logs.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Panel de Administrador</h1>
          <p className="text-muted-foreground">Vista general del estado de los respaldos del día.</p>
        </div>
      </div>
      
      {pendingCount > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Tareas Pendientes</AlertTitle>
          <AlertDescription>
            Hay {pendingCount} {pendingCount === 1 ? 'respaldo pendiente' : 'respaldos pendientes'} de registro para el día de hoy.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">de {totalCount} respaldos totales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground">Realizados correctamente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Con Novedades</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{issuesCount}</div>
            <p className="text-xs text-muted-foreground">Registrados con advertencias</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fallidos</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failedCount}</div>
            <p className="text-xs text-muted-foreground">No se pudieron realizar</p>
          </CardContent>
        </Card>
      </div>

      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <TasksToday logs={logs} title="Estado de Tareas de Hoy" isAdmin />
      </Suspense>
    </div>
  );
}
