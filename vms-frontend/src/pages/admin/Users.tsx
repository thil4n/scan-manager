import { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import PageContainer from '@/components/layout/PageContainer';
import DataTable from '@/components/table/DataTable';
import type { Column } from '@/components/table/DataTable';
import Button from '@/components/ui/Button';
import Modal from '@/components/modals/Modal';
import ConfirmDialog from '@/components/modals/ConfirmDialog';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/utils/format';
import type { User, CreateUserPayload, UserRole } from '@/types/user';
import { useForm } from 'react-hook-form';

/* ── inline service calls (user service is optional/future) ── */
import api from '@/services/api';

async function fetchUsers(): Promise<User[]> {
  const { data } = await api.get<User[]>('/users');
  return data;
}
async function createUser(payload: CreateUserPayload): Promise<User> {
  const { data } = await api.post<User>('/users', payload);
  return data;
}
async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`);
}
async function updateUserRole(id: string, role: UserRole): Promise<User> {
  const { data } = await api.patch<User>(`/users/${id}`, { role });
  return data;
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const inputClass =
  'w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';
const labelClass = 'mb-1 block text-xs font-medium text-gray-400';

function UserForm({
  onSubmit,
  onCancel,
  loading,
}: {
  onSubmit: (data: CreateUserPayload) => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateUserPayload>();
  const errorClass = 'mt-1 text-xs text-red-400';
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className={labelClass}>Full Name *</label>
        <input {...register('name', { required: 'Name is required' })} className={inputClass} />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>
      <div>
        <label className={labelClass}>Email *</label>
        <input type="email" {...register('email', { required: 'Email is required' })} className={inputClass} />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>
      <div>
        <label className={labelClass}>Role *</label>
        <select {...register('role', { required: true })} className={inputClass}>
          <option value="PRODUCT_TEAM">Product Team</option>
          <option value="SECURITY_TEAM">Security Team</option>
          <option value="CUSTOMER_SUCCESS">Customer Success</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>
      <div>
        <label className={labelClass}>Temporary Password *</label>
        <input
          type="password"
          {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 chars' } })}
          className={inputClass}
        />
        {errors.password && <p className={errorClass}>{errors.password.message}</p>}
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" loading={loading}>Create User</Button>
      </div>
    </form>
  );
}

export default function Users() {
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useQuery({ queryKey: ['users'], queryFn: fetchUsers });
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  const [showCreate, setShowCreate] = useState(false);
  const [deleting, setDeleting] = useState<User | null>(null);

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ variant: 'success', title: 'User created' });
      setShowCreate(false);
    },
    onError: () => toast({ variant: 'error', title: 'Failed to create user' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ variant: 'success', title: 'User removed' });
      setDeleting(null);
    },
    onError: () => toast({ variant: 'error', title: 'Failed to delete user' }),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) => updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ variant: 'success', title: 'Role updated' });
    },
  });

  const columns: Column<User>[] = [
    { key: 'name', header: 'Name', render: (u) => <span className="font-medium text-white">{u.name}</span> },
    { key: 'email', header: 'Email', render: (u) => u.email },
    {
      key: 'role',
      header: 'Role',
      render: (u) => (
        <select
          value={u.role}
          disabled={!isAdmin || updateRoleMutation.isPending}
          onChange={(e) => updateRoleMutation.mutate({ id: u.id, role: e.target.value as UserRole })}
          className="rounded border border-gray-700 bg-gray-800 py-0.5 pl-2 pr-6 text-xs text-gray-300 focus:outline-none"
        >
          <option value="PRODUCT_TEAM">Product Team</option>
          <option value="SECURITY_TEAM">Security Team</option>
          <option value="CUSTOMER_SUCCESS">Customer Success</option>
          <option value="ADMIN">Admin</option>
        </select>
      ),
    },
    { key: 'lastLogin', header: 'Last Login', render: (u) => u.lastLogin ? formatDate(u.lastLogin) : '—' },
    { key: 'createdAt', header: 'Joined', sortable: true, render: (u) => formatDate(u.createdAt) },
    ...(isAdmin
      ? [{
          key: 'actions',
          header: '',
          render: (u: User) => (
            <button onClick={() => setDeleting(u)} className="text-gray-500 hover:text-red-400">
              <TrashIcon className="h-4 w-4" />
            </button>
          ),
        }]
      : []),
  ];

  return (
    <PageContainer
      title="Users"
      description="Manage user accounts and roles"
      action={
        isAdmin && (
          <Button leftIcon={<PlusIcon className="h-4 w-4" />} onClick={() => setShowCreate(true)}>
            Add User
          </Button>
        )
      }
    >
      {isLoading && <div className="py-12 text-center text-gray-500">Loading users…</div>}
      {!isLoading && <DataTable data={users ?? []} columns={columns} emptyMessage="No users found." />}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create User">
        <UserForm
          onSubmit={(data) => createMutation.mutate(data)}
          onCancel={() => setShowCreate(false)}
          loading={createMutation.isPending}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
        title={`Remove "${deleting?.name}"?`}
        description="This will revoke their access to the VMS."
        loading={deleteMutation.isPending}
      />
    </PageContainer>
  );
}
