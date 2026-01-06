import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { BackupLog } from '@/lib/definitions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle2, ChevronRight, Clock, Eye, XCircle } from 'lucide-react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

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


export default function TasksToday({ logs, title, isAdmin = false }: { logs: BackupLog[], title: string, isAdmin?: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Lista de respaldos programados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Estado</TableHead>
              <TableHead>Nombre del Respaldo</TableHead>
              <TableHead>Tipo</TableHead>
              {isAdmin && <TableHead>Fecha</TableHead>}
              {isAdmin && <TableHead>Registrado por</TableHead>}
              <TableHead>Hora de Registro</TableHead>
              <TableHead className="text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={isAdmin ? 7 : 5} className="text-center h-24">No hay respaldos para mostrar.</TableCell>
                </TableRow>
            ) : logs.map(log => {
              const config = statusConfig[log.status];
              return (
                <TableRow key={log.id}>
                  <TableCell>
                    <Badge variant={config.badgeVariant as any} className={config.badgeClassName}>
                        <div className="flex items-center gap-2">
                        {config.icon}
                        <span>{config.label}</span>
                        </div>
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{log.backupName}</TableCell>
                  <TableCell>{log.backupType}</TableCell>
                  {isAdmin && <TableCell>{log.scheduledDate}</TableCell>}
                  {isAdmin && <TableCell>{log.completedBy?.name || 'N/A'}</TableCell>}
                  <TableCell>
                    {log.completedAt ? format(parseISO(log.completedAt), 'HH:mm:ss', { locale: es }) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    {log.status === 'pending' && !isAdmin ? (
                        <Button asChild variant="outline" size="sm">
                            <Link href={`/technician/register/${log.id}`}>
                                Registrar
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    ) : (log.status !== 'pending' || isAdmin) ? (
                        <Button asChild variant="outline" size="sm">
                            <Link href={`/technician/register/${log.id}`}>
                                Ver Detalles
                                <Eye className="h-4 w-4" />
                            </Link>
                        </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
