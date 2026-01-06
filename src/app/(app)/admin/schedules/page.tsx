import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getSchedules } from "@/lib/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function SchedulesPage() {
  const schedules = await getSchedules();

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Programación de Respaldos</h1>
        <p className="text-muted-foreground">Define y gestiona las tareas de respaldo recurrentes.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Programaciones Activas</CardTitle>
          <CardDescription>Tareas de respaldo que se generan automáticamente.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre de la Tarea</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Frecuencia</TableHead>
                <TableHead>Días</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map(schedule => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">{schedule.name}</TableCell>
                  <TableCell>{schedule.type}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{schedule.frequency}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {schedule.daysOfWeek.map(day => (
                        <Badge key={day} variant="secondary">{dayNames[day]}</Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
