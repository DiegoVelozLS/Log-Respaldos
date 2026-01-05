'use client';

import { useActionState, useFormStatus } from 'react';
import { updateBackupLog, type RegisterState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import type { BackupLog, User } from '@/lib/definitions';
import { AlertTriangle, Check, Loader2, X } from 'lucide-react';

const initialState: RegisterState = { message: null, errors: {} };

export default function RegisterForm({ log, user }: { log: BackupLog, user: User }) {
  const [state, dispatch] = useActionState(updateBackupLog, initialState);

  return (
    <form action={dispatch} className="space-y-6">
      <input type="hidden" name="logId" value={log.id} />
      <input type="hidden" name="user" value={JSON.stringify(user)} />
      
      <div className="space-y-3">
        <Label>Estado del Respaldo</Label>
        <RadioGroup name="status" required className="flex flex-col sm:flex-row gap-4">
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
