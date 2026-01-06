'use client';

import { useActionState } from 'react';
import { updateBackupLog, type RegisterState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import type { BackupLog, User } from '@/lib/definitions';
import { AlertTriangle, Check, Loader2, Undo2, X } from 'lucide-react';
import { useFormStatus } from 'react-dom';


const initialState: RegisterState = { message: null, errors: {} };

const statusOptions = [
  { value: 'completed', label: 'Éxito', icon: <Check className="h-5 w-5 text-green-500" /> },
  { value: 'with_issues', label: 'Novedad', icon: <AlertTriangle className="h-5 w-5 text-yellow-500" /> },
  { value: 'failed', label: 'Fallo', icon: <X className="h-5 w-5 text-red-500" /> },
];

export default function RegisterForm({ log, user }: { log: BackupLog, user: User }) {
  const [state, dispatch] = useActionState(updateBackupLog, initialState);
  const isReadOnly = log.status !== 'pending';

  return (
    <form action={dispatch} className="space-y-6">
      <input type="hidden" name="logId" value={log.id} />
      <input type="hidden" name="user" value={JSON.stringify(user)} />
      
      <div className="space-y-3">
        <Label htmlFor='status'>Resultado de la ejecución</Label>
        <RadioGroup 
          name="status" 
          id="status"
          required 
          className="grid grid-cols-1 sm:grid-cols-3 gap-4" 
          defaultValue={isReadOnly ? log.status : undefined}
          disabled={isReadOnly}
        >
          {statusOptions.map(option => (
             <Label
              key={option.value}
              htmlFor={option.value}
              className="flex flex-1 cursor-pointer items-center gap-3 rounded-md border p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem value={option.value} id={option.value} />
              {option.icon}
              <span className="font-medium">{option.label}</span>
            </Label>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comments">Notas</Label>
        <Textarea
          id="comments"
          name="comments"
          placeholder="Añada cualquier observación relevante aquí..."
          rows={4}
          defaultValue={log.comments}
          readOnly={isReadOnly}
        />
      </div>

      <div className="flex justify-end gap-2">
        {isReadOnly && (
            <Button variant="outline" disabled>
                <Undo2 />
                Deshacer Registro
            </Button>
        )}
        <SubmitButton isReadOnly={isReadOnly} />
      </div>
    </form>
  );
}

function SubmitButton({ isReadOnly }: { isReadOnly: boolean }) {
  const { pending } = useFormStatus();
  if (isReadOnly) {
    return null;
  }
  return (
    <Button type="submit" aria-disabled={pending} disabled={isReadOnly}>
      {pending ? <Loader2 className="animate-spin" /> : 'Registrar Respaldo'}
    </Button>
  );
}
