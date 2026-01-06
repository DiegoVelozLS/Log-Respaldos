import { getLogById } from "@/lib/data";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/auth";
import RegisterForm from "@/components/technician/register-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function RegisterBackupPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  const log = await getLogById(params.id);

  if (!log || !session) {
    notFound();
  }
  
  const canEdit = session.user.role === 'administrator' || session.user.role === 'supervisor';

  if (log.status !== 'pending' && !canEdit) {
    redirect('/technician');
  }

  const statusConfig = {
    pending: { label: 'Pendiente', variant: 'secondary' },
    completed: { label: 'Completado', variant: 'default', className: 'bg-green-100 text-green-800' },
    with_issues: { label: 'Con Novedades', variant: 'default', className: 'bg-yellow-100 text-yellow-800' },
    failed: { label: 'Fallido', variant: 'destructive' },
  } as const;

  const currentStatus = statusConfig[log.status];

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>
                {log.status === 'pending' ? 'Registrar Estado de Respaldo' : 'Detalles del Registro'}
              </CardTitle>
              <CardDescription>
                {log.backupName} - {log.scheduledDate}
              </CardDescription>
            </div>
            <Badge variant={currentStatus.variant as any} className={currentStatus.className}>
                {currentStatus.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
            <RegisterForm log={log} user={session.user} />
        </CardContent>
      </Card>
    </div>
  );
}
