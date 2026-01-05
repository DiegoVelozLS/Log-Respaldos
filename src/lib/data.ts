'use server';

import { users, schedules, backupLogs as initialBackupLogs } from '@/lib/seed';
import type { User, BackupSchedule, BackupLog } from './definitions';
import { format, isSameDay, parseISO } from 'date-fns';

// In-memory store
let allUsers: User[] = [...users];
let allSchedules: BackupSchedule[] = [...schedules];
let allLogs: BackupLog[] = [...initialBackupLogs];

// --- User Functions ---
export async function getUserByEmail(email: string): Promise<User | undefined> {
  return allUsers.find(user => user.email === email);
}

export async function getUserById(id: string): Promise<User | undefined> {
    return allUsers.find(user => user.id === id);
}

export async function getUsers(): Promise<User[]> {
  return allUsers.map(({ password, ...user }) => user);
}

export async function createUser(userData: Omit<User, 'id'>): Promise<User> {
    const newUser: User = { ...userData, id: `user-${Date.now()}` };
    allUsers.push(newUser);
    const { password, ...userToReturn } = newUser;
    return userToReturn;
}


// --- Schedule Functions ---
export async function getSchedules(): Promise<BackupSchedule[]> {
  return allSchedules;
}

export async function createSchedule(scheduleData: Omit<BackupSchedule, 'id'>): Promise<BackupSchedule> {
    const newSchedule: BackupSchedule = { ...scheduleData, id: `sched-${Date.now()}` };
    allSchedules.push(newSchedule);
    return newSchedule;
}

// --- Log Functions ---
export async function getLogs(): Promise<BackupLog[]> {
    return allLogs;
}

export async function getLogById(id: string): Promise<BackupLog | undefined> {
    return allLogs.find(log => log.id === id);
}

export async function getLogsForDate(date: Date): Promise<BackupLog[]> {
    const dateString = format(date, 'yyyy-MM-dd');
    return allLogs.filter(log => log.scheduledDate === dateString);
}

export async function getTodaysLogs(): Promise<BackupLog[]> {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const todayString = format(today, 'yyyy-MM-dd');

  const existingLogs = allLogs.filter(log => log.scheduledDate === todayString);
  const todaysScheduleIds = new Set(existingLogs.map(log => log.scheduleId));

  const schedulesForToday = allSchedules.filter(
    schedule => schedule.daysOfWeek.includes(dayOfWeek) && !todaysScheduleIds.has(schedule.id)
  );

  if (schedulesForToday.length > 0) {
    const newLogs: BackupLog[] = schedulesForToday.map(schedule => ({
      id: `log-${Date.now()}-${schedule.id}`,
      scheduleId: schedule.id,
      backupName: schedule.name,
      backupType: schedule.type,
      scheduledDate: todayString,
      status: 'pending',
      completedAt: null,
      completedBy: null,
      comments: '',
    }));
    allLogs = [...allLogs, ...newLogs];
  }

  return allLogs.filter(log => log.scheduledDate === todayString);
}

export async function updateBackupLog(logId: string, status: BackupLog['status'], comments: string, user: User): Promise<BackupLog> {
    const logIndex = allLogs.findIndex(log => log.id === logId);
    if (logIndex === -1) {
        throw new Error('Log not found');
    }

    const updatedLog: BackupLog = {
        ...allLogs[logIndex],
        status,
        comments,
        completedAt: new Date().toISOString(),
        completedBy: {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`
        }
    };

    if (status === 'failed') {
      updatedLog.completedAt = null;
      updatedLog.completedBy = null;
    }

    allLogs[logIndex] = updatedLog;
    return updatedLog;
}
