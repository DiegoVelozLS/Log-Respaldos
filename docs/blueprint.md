# **App Name**: Backup Sentinel

## Core Features:

- Secure Authentication: Mandatory login system via email and password with initial admin user (admin@listosoft.com / 12345) and role-based access control to ensure access protection.
- Role-Based User Management: User management with defined roles (administrator, supervisor, technician) including user creation, role assignment, and restricted access based on roles.
- Automated Task Generation: Automatically generate the tasks using a daily cron job. Backups can be scheduled (name, frequency, type, and specific days).
- Interactive Dashboard: Visual dashboard displays daily backup tasks: completed, pending, or with issues. Includes an interactive calendar for backup status visualization.
- Backup Registration: Section to register backups with status selection (successful, failed, issues) and a comment field. Automatically saves date, time, and user, preventing manual edits.
- Admin Panel: Comprehensive admin panel to visualize backup statuses, query histories, manage users, and define/modify backup schedules. Inaccessible to technician/supervisor roles.
- Notifications & Alerts: Visual alerts and notifications for pending backups, unrecorded backups, or backups with issues, ensuring awareness until resolved and logged.

## Style Guidelines:

- Primary color: Deep Blue (#30475E) for a professional and reliable feel, hinting at security and stability. Chosen for its versatility and contrast against a light background.
- Background color: Light Gray (#E8E8E8), a desaturated variant of the primary color, creating a clean and unobtrusive backdrop.
- Accent color: Electric Purple (#82AAFF) for highlighting interactive elements and important information, drawing the user's attention.
- Headline font: 'Space Grotesk' sans-serif for headlines and short amounts of body text, giving a techy and modern impression.
- Body font: 'Inter' grotesque-style sans-serif font, giving a clean, machined, neutral and objective impression.
- Use minimalist and clear icons for backup types, status indicators, and navigation.
- A clean, organized layout with clear visual hierarchy, providing easy navigation between sections and task management.
- Subtle transitions and animations for feedback during backup registration and status changes.