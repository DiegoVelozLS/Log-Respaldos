'use server';

import { z } from 'zod';
import { signIn, signOut } from '@/auth';
import { getUserByEmail, createUser as dbCreateUser, updateBackupLog as dbUpdateBackupLog, createSchedule as dbCreateSchedule } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { BackupLog, User, UserRole } from './definitions';

// --- Auth Actions ---
export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const user = await getUserByEmail(email);

    if (!user || user.password !== password) {
      return 'Credenciales incorrectas. Inténtelo de nuevo.';
    }

    await signIn(email);
  } catch (error: any) {
    if (error.type === 'CredentialsSignin') {
      return 'Credenciales incorrectas.';
    }
    console.error(error);
    return 'Se produjo un error inesperado.';
  }
  redirect('/dashboard');
}

export async function logout() {
  await signOut();
}

// --- Admin Actions ---

const UserFormSchema = z.object({
    id: z.string(),
    firstName: z.string().min(1, 'El nombre es requerido.'),
    lastName: z.string().min(1, 'El apellido es requerido.'),
    email: z.string().email('Correo electrónico no válido.'),
    password: z.string().min(5, 'La contraseña debe tener al menos 5 caracteres.'),
    role: z.enum(['administrator', 'supervisor', 'technician']),
});
const CreateUser = UserFormSchema.omit({ id: true });
export type UserState = {
  errors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    password?: string[];
    role?: string[];
  };
  message?: string | null;
};
export async function createUser(prevState: UserState, formData: FormData) {
    const validatedFields = CreateUser.safeParse({
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Faltan campos. No se pudo crear el usuario.',
        };
    }

    const { firstName, lastName, email, password, role } = validatedFields.data;
    
    try {
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return { message: 'El correo electrónico ya está en uso.' };
        }
        await dbCreateUser({ firstName, lastName, email, password, role: role as UserRole });
    } catch (error) {
        return { message: 'Error de base de datos: No se pudo crear el usuario.' };
    }

    revalidatePath('/admin/users');
    return { message: 'Usuario creado exitosamente.', errors: {} };
}


const ScheduleFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido.'),
  type: z.string().min(1, 'El tipo es requerido.'),
  frequency: z.enum(['daily', 'weekly', 'specific_days']),
  daysOfWeek: z.array(z.coerce.number()).min(1, 'Seleccione al menos un día.'),
});
export type ScheduleState = {
    errors?: {
        name?: string[];
        type?: string[];
        frequency?: string[];
        daysOfWeek?: string[];
    };
    message?: string | null;
};
export async function createSchedule(prevState: ScheduleState, formData: FormData) {
    const rawData = {
        name: formData.get('name'),
        type: formData.get('type'),
        frequency: formData.get('frequency'),
        daysOfWeek: formData.getAll('daysOfWeek'),
    };

    if (rawData.frequency === 'daily') {
        rawData.daysOfWeek = ['0', '1', '2', '3', '4', '5', '6'];
    } else if (rawData.frequency === 'weekly') {
        // Assume first day is the weekly day
        rawData.daysOfWeek = [rawData.daysOfWeek[0]];
    }

    const validatedFields = ScheduleFormSchema.safeParse(rawData);
    
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Faltan campos. No se pudo crear la programación.',
        };
    }

    try {
        await dbCreateSchedule(validatedFields.data);
    } catch (error) {
        return { message: 'Error de base de datos: No se pudo crear la programación.' };
    }
    
    revalidatePath('/admin/schedules');
    return { message: 'Programación creada exitosamente.', errors: {} };
}


// --- Technician Actions ---

const RegisterLogSchema = z.object({
    logId: z.string(),
    status: z.enum(['completed', 'failed', 'with_issues']),
    comments: z.string().optional(),
    user: z.custom<User>()
});

export type RegisterState = {
    errors?: {
        status?: string[];
        comments?: string[];
    };
    message?: string | null;
};

export async function updateBackupLog(prevState: RegisterState, formData: FormData) {
    const rawData = {
        logId: formData.get('logId'),
        status: formData.get('status'),
        comments: formData.get('comments'),
        user: JSON.parse(formData.get('user') as string)
    };
    
    const validatedFields = RegisterLogSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Faltan campos. No se pudo registrar el respaldo.',
        };
    }

    const { logId, status, comments, user } = validatedFields.data;
    
    try {
        await dbUpdateBackupLog(logId, status as BackupLog['status'], comments || '', user);
    } catch (error) {
        return { message: 'Error de base de datos: No se pudo registrar el respaldo.' };
    }

    revalidatePath('/technician');
    revalidatePath('/technician/calendar');
    revalidatePath('/admin');
    revalidatePath('/supervisor');
    redirect('/technician');
}
