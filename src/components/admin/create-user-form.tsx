'use client';

import { useActionState, useEffect, useState } from 'react';
import { createUser, type UserState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '@/hooks/use-toast';

const initialState: UserState = { message: null, errors: {} };

function SubmitButton() {
  const [isPending, setIsPending] = useState(false);
  // This is a bit of a hack to get the pending state from the form
  useEffect(() => {
    const form = document.querySelector('form');
    if (!form) return;
    const handleFormSubmit = () => setIsPending(true);
    form.addEventListener('submit', handleFormSubmit);
    return () => form.removeEventListener('submit', handleFormSubmit);
  }, []);

  return (
    <Button type="submit" className="w-full" disabled={isPending}>
      {isPending ? <Loader2 className="animate-spin" /> : 'Crear Usuario'}
    </Button>
  );
}

export default function CreateUserForm() {
  const [state, dispatch] = useActionState(createUser, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && !state.errors) {
        toast({
            title: "Éxito",
            description: state.message,
        });
    }
  }, [state, toast]);

  return (
    <form action={dispatch} className="space-y-4">
        {state.message && state.errors && Object.keys(state.errors).length > 0 && (
            <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error de creación</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
            </Alert>
        )}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="firstName">Nombre</Label>
            <Input id="firstName" name="firstName" required />
            {state.errors?.firstName && <p className="text-sm text-destructive">{state.errors.firstName[0]}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="lastName">Apellido</Label>
            <Input id="lastName" name="lastName" required />
            {state.errors?.lastName && <p className="text-sm text-destructive">{state.errors.lastName[0]}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Correo Electrónico</Label>
        <Input id="email" type="email" name="email" required />
        {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" type="password" name="password" required />
        {state.errors?.password && <p className="text-sm text-destructive">{state.errors.password[0]}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Rol</Label>
        <Select name="role" required>
            <SelectTrigger>
                <SelectValue placeholder="Seleccione un rol" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="technician">Técnico</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
                <SelectItem value="administrator">Administrador</SelectItem>
            </SelectContent>
        </Select>
        {state.errors?.role && <p className="text-sm text-destructive">{state.errors.role[0]}</p>}
      </div>
      <SubmitButton />
    </form>
  );
}
