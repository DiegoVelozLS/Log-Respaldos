import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getLogs } from "@/lib/data";
import TasksToday from "@/components/dashboard/tasks-today";

export default async function HistoryPage() {
  const logs = (await getLogs()).sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Historial de Respaldos</h1>
        <p className="text-muted-foreground">Consulta todos los registros de respaldos realizados.</p>
      </div>
       <TasksToday logs={logs} title="Todos los registros" isAdmin={true} />
    </div>
  );
}
