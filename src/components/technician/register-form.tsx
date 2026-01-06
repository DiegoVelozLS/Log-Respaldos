'use client';

import { useActionState, useFormStatus } from 'react';
import { updateBackupLog, type RegisterState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import type { BackupLog, User } from '@/lib/definitions';
import { AlertTriangle, Check, Loader2, X } from 'lucide-react';
import { Badge } from '../ui/badge';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const initialState: RegisterState = { message: null, errors: {} };

const statusConfig = {
  completed: { label: 'Completado' },
  with_issues: { label: 'Con Novedades' },
  failed: { label: 'Fallido' },
  pending: { label: 'Pendiente' },
};


export default function RegisterForm({ log, user }: { log: BackupLog, user: User }) {
  const [state, dispatch] = useActionState(updateBackupLog, initialState);
  const isReadOnly = log.status !== 'pending';

  if (isReadOnly) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Estado del Respaldo</Label>
                <Badge variant={log.status === 'completed' ? 'default' : log.status === 'with_issues' ? 'default' : 'destructive'} 
                       className={log.status === 'completed' ? 'bg-green-100 text-green-800' : log.status === 'with_issues' ? 'bg-yellow-100 text-yellow-800' : ''}>
                    {statusConfig[log.status].label}
                </Badge>
            </div>
             {log.comments && (
                <div className="space-y-2">
                    <Label>Comentarios / Observaciones</Label>
                    <p className="text-sm p-3 bg-muted rounded-md">{log.comments}</p>
                </div>
            )}
             {log.completedBy && (
                <div className="space-y-2">
                    <Label>Registrado por</Label>
                    <p className="text-sm font-medium">{log.completedBy.name}</p>
                </div>
            )}
            {log.completedAt && (
                <div className="space-y-2">
                    <Label>Fecha y Hora de Registro</Label>
                    <p className="text-sm">{format(parseISO(log.completedAt), "PPPp", { locale: es })}</p>
                </div>
            )}
        </div>
    )
  }

  return (
    <form action={dispatch} className="space-y-6">
      <input type="hidden" name="logId" value={log.id} />
      <input type="hidden" name="user" value={JSON.stringify(user)} />
      
      <div className="space-y-3">
        <Label>Estado del Respaldo</Label>
        <RadioGroup name="status" required className="flex flex-col sm:flex-row gap-4" defaultValue={log.status}>
          <Label
            htmlFor="completed"
            className="flex flex-1 cursor-pointer items-center gap-3 rounded-md border p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
          >
            <RadioGroupItem value="completed" id="completed" />
            <Check className="h-5 w-5 text-green-500" />
            <span className="font-medium">Realizado Correctamente</span>
          </Label>
          <Label
            htmlFor="with_issues"
            className="flex flex-1 cursor-pointer items-center gap-3 rounded-md border p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
          >
            <RadioGroupItem value="with_issues" id="with_issues" />
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <span className="font-medium">Realizado con Novedades</span>
          </Label>
          <Label
            htmlFor="failed"
            className="flex flex-1 cursor-pointer items-center gap-3 rounded-md border p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
          >
            <RadioGroupItem value="failed" id="failed" />
            <X className="h-5 w-5 text-red-500" />
            <span className="font-medium">No se Realizó</span>
          </Label>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comments">Comentarios / Observaciones</Label>
        <Textarea
          id="comments"
          name="comments"
          placeholder="Añada cualquier observación relevante aquí..."
          rows={4}
          defaultValue={log.comments}
        />
      </div>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : 'Guardar Registro'}
    </Button>
  );
}
