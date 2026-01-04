"use client";
import  { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/Admin/DataTable';
import { mockUsers } from '@/lib/mock-data';
import { User } from '@/types/AdminPageTypes';
import { Ban, CheckCircle } from 'lucide-react';
import { AdminLayout } from '@/components/Admin/AdminLayout';
import { toast } from 'sonner';

export default function Users() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'active' ? 'banned' : 'active';
        toast.success(`${user.name} has been ${newStatus === 'banned' ? 'banned' : 'reactivated'}.`);
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  const columns = [
    { 
      key: 'name', 
      title: 'User',
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      title: 'Role',
      render: (user: User) => (
        <Badge variant="secondary">
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (user: User) => (
        <Badge variant={user.status as any}>
          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </Badge>
      ),
    },
    { key: 'createdAt', title: 'Joined' },
    {
      key: 'actions',
      title: 'Actions',
      render: (user: User) => (
        <Button
          variant={user.status === 'active' ? 'destructive' : 'success'}
          size="sm"
          onClick={() => toggleUserStatus(user.id)}
        >
          {user.status === 'active' ? (
            <>
              <Ban className="w-4 h-4 mr-1" />
              Ban
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-1" />
              Unban
            </>
          )}
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Users</h2>
        <p className="text-muted-foreground">Manage user accounts and permissions</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DataTable
            data={users}
            columns={columns}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </div>
    </AdminLayout>
  );
}
