'use client';

import { useActionState, useFormStatus } from 'react';
import { authenticate } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';

export default function LoginForm() {
  const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined);

  return (
    <form action={dispatch} className="w-full">
      <Card className="w-full">
        <CardHeader>
          {errorMessage && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error de inicio de sesión</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="nombre@ejemplo.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" name="password" required />
          </div>
        </CardContent>
        <CardFooter>
          <LoginButton isPending={isPending} />
        </CardFooter>
      </Card>
    </form>
  );
}

function LoginButton({ isPending }: { isPending: boolean }) {
  return (
    <Button type="submit" className="w-full" aria-disabled={isPending}>
      {isPending ? <Loader2 className="animate-spin" /> : 'Ingresar'}
    </Button>
  );
}
