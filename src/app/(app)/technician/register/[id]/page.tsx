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

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>
            {log.status === 'pending' ? 'Registrar Estado de Respaldo' : 'Detalles del Registro'}
          </CardTitle>
          <CardDescription>
            {log.status === 'pending'
                ? 'Selecciona el estado del respaldo y añade comentarios si es necesario.'
                : 'Información detallada del registro de respaldo.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4 mb-6 p-4 border rounded-lg bg-secondary/30">
                <h3 className="font-semibold">{log.backupName}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Tipo: <Badge variant="secondary">{log.backupType}</Badge></span>
                    <span>Fecha programada: {log.scheduledDate}</span>
                </div>
            </div>
            <RegisterForm log={log} user={session.user} />
        </CardContent>
      </Card>
    </div>
  );
}
