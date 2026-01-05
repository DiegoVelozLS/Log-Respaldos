export type UserRole = 'administrator' | 'supervisor' | 'technician';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Only in mock data, not exposed to client
  role: UserRole;
};

export type BackupFrequency = 'daily' | 'weekly' | 'specific_days';

export type BackupSchedule = {
  id: string;
  name: string;
  type: string;
  frequency: BackupFrequency;
  daysOfWeek: number[]; // 0 for Sunday, 1 for Monday, etc.
};

export type BackupStatus = 'pending' | 'completed' | 'failed' | 'with_issues';

export type BackupLog = {
  id: string;
  scheduleId: string;
  backupName: string;
  backupType: string;
  scheduledDate: string; // ISO string for date
  status: BackupStatus;
  completedAt: string | null; // ISO string for datetime
  completedBy: {
    id: string;
    name:string;
  } | null;
  comments: string;
};

export interface SessionPayload {
  user: User;
  expires: string;
}
