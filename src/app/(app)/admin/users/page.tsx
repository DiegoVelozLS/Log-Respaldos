import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getUsers } from "@/lib/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function UsersPage() {
  const users = await getUsers();

  const roleLabels: { [key: string]: string } = {
    administrator: 'Administrador',
    supervisor: 'Supervisor',
    technician: 'Técnico',
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Gestión de Usuarios</h1>
        <p className="text-muted-foreground">Crea, edita y gestiona los usuarios del sistema.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>Usuarios registrados en el sistema.</CardDescription>
        </CardHeader>
        <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Correo Electrónico</TableHead>
              <TableHead>Rol</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'administrator' ? 'destructive' : 'secondary'}>
                    {roleLabels[user.role] || user.role}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </CardContent>
      </Card>
    </div>
  );
}
