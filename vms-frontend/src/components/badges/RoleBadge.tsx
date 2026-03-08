import type { UserRole } from '@/types/user';

const roleConfig: Record<UserRole, { label: string; className: string }> = {
  ADMIN: { label: 'Admin', className: 'bg-purple-950/60 text-purple-300 border-purple-700/50' },
  SECURITY_TEAM: { label: 'Security', className: 'bg-blue-950/60 text-blue-300 border-blue-700/50' },
  PRODUCT_TEAM: { label: 'Product', className: 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50' },
  CUSTOMER_SUCCESS: { label: 'Customer Success', className: 'bg-orange-950/60 text-orange-300 border-orange-700/50' },
};

export default function RoleBadge({ role }: { role: UserRole }) {
  const { label, className } = roleConfig[role];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
