import type { User, BackupSchedule, BackupLog } from '@/lib/definitions';
import { addDays, format, getDay, subDays } from 'date-fns';

export const users: User[] = [
  {
    id: '1',
    firstName: 'Admin',
    lastName: 'Listosoft',
    email: 'admin@listosoft.com',
    password: '12345',
    role: 'administrator',
  },
  {
    id: '2',
    firstName: 'Sergio',
    lastName: 'Vargas',
    email: 'supervisor@listosoft.com',
    password: 'password123',
    role: 'supervisor',
  },
  {
    id: '3',
    firstName: 'Tania',
    lastName: 'Morales',
    email: 'tecnico@listosoft.com',
    password: 'password123',
    role: 'technician',
  },
  {
    id: '4',
    firstName: 'Roberto',
    lastName: 'Gomez',
    email: 'tecnico2@listosoft.com',
    password: 'password123',
    role: 'technician',
  },
];

export const schedules: BackupSchedule[] = [
  {
    id: 'sched-1',
    name: 'Servidor de Base de Datos Principal',
    type: 'Completo',
    frequency: 'daily',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },
  {
    id: 'sched-2',
    name: 'Servidor de Archivos General',
    type: 'Incremental',
    frequency: 'specific_days',
    daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
  },
  {
    id: 'sched-3',
    name: 'Servidor Web (Producción)',
    type: 'Diferencial',
    frequency: 'weekly',
    daysOfWeek: [6], // Saturday
  },
  {
    id: 'sched-4',
    name: 'Servidor de Contabilidad (Fin de Mes)',
    type: 'Completo',
    frequency: 'specific_days',
    daysOfWeek: [0], // Sunday
  },
];

const generateLogs = (): BackupLog[] => {
  const logs: BackupLog[] = [];
  const today = new Date();
  const technician1 = users.find(u => u.id === '3')!;
  const technician2 = users.find(u => u.id === '4')!;
  let logIdCounter = 1;

  for (let i = 30; i >= 0; i--) {
    const date = subDays(today, i);
    const dayOfWeek = getDay(date);

    for (const schedule of schedules) {
      if (schedule.daysOfWeek.includes(dayOfWeek)) {
        const random = Math.random();
        let status: BackupLog['status'] = 'completed';
        let comments = '';
        let completedAt: string | null = addDays(date, 0).toISOString();
        let technician = random > 0.5 ? technician1 : technician2;

        if (random < 0.1) {
          status = 'failed';
          comments = 'Fallo en la conexión con el servidor.';
          completedAt = null;
        } else if (random < 0.2) {
          status = 'with_issues';
          comments = 'Se completó con algunas advertencias. Revisar logs.';
        }
        
        // Make some of today's tasks pending
        if (i === 0) {
            if (random < 0.4) {
                status = 'pending';
                completedAt = null;
                comments = '';
            }
        }

        logs.push({
          id: `log-${logIdCounter++}`,
          scheduleId: schedule.id,
          backupName: schedule.name,
          backupType: schedule.type,
          scheduledDate: format(date, 'yyyy-MM-dd'),
          status,
          comments,
          completedAt,
          completedBy: completedAt ? { id: technician.id, name: `${technician.firstName} ${technician.lastName}` } : null,
        });
      }
    }
  }

  return logs;
};

export const backupLogs: BackupLog[] = generateLogs();
