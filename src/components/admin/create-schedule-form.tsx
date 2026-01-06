'use client';

import { useActionState, useEffect, useState } from 'react';
import { createSchedule, type ScheduleState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const initialState: ScheduleState = { message: null, errors: {} };

const dayNames = [
    { id: 1, label: 'Lunes' },
    { id: 2, label: 'Martes' },
    { id: 3, label: 'Miércoles' },
    { id: 4, label: 'Jueves' },
    { id: 5, label: 'Viernes' },
    { id: 6, label: 'Sábado' },
    { id: 0, label: 'Domingo' },
];

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
        {isPending ? <Loader2 className="animate-spin" /> : 'Crear Programación'}
      </Button>
    );
}

export default function CreateScheduleForm() {
  const [state, dispatch] = useActionState(createSchedule, initialState);
  const [frequency, setFrequency] = useState('specific_days');
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
            <AlertTitle>Error al crear</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
            </Alert>
        )}
        <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Programación</Label>
            <Input id="name" name="name" placeholder="Ej: Servidor de archivos" required />
            {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="type">Tipo de Respaldo</Label>
                <Input id="type" name="type" placeholder="Ej: Completo, Incremental" required />
                {state.errors?.type && <p className="text-sm text-destructive">{state.errors.type[0]}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="frequency">Frecuencia</Label>
                <Select name="frequency" required onValueChange={setFrequency} defaultValue="specific_days">
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccione frecuencia" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="specific_days">Días específicos</SelectItem>
                        <SelectItem value="daily">Diario</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                    </SelectContent>
                </Select>
                 {state.errors?.frequency && <p className="text-sm text-destructive">{state.errors.frequency[0]}</p>}
            </div>
        </div>

        {frequency !== 'daily' && (
             <div className="space-y-2">
                <Label>Días de la Semana</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 rounded-lg border p-4">
                    {dayNames.map(day => (
                        <div key={day.id} className="flex items-center space-x-2">
                            <Checkbox id={`day-${day.id}`} name="daysOfWeek" value={day.id.toString()} />
                            <Label htmlFor={`day-${day.id}`} className="font-normal">{day.label}</Label>
                        </div>
                    ))}
                </div>
                {state.errors?.daysOfWeek && <p className="text-sm text-destructive">{state.errors.daysOfWeek[0]}</p>}
            </div>
        )}

      <SubmitButton />
    </form>
  );
}
