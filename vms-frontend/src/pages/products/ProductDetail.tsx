import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import PageContainer from '@/components/layout/PageContainer';
import DataTable from '@/components/table/DataTable';
import type { Column } from '@/components/table/DataTable';
import Button from '@/components/ui/Button';
import Modal from '@/components/modals/Modal';
import ConfirmDialog from '@/components/modals/ConfirmDialog';
import VersionForm from '@/components/forms/VersionForm';
import { useProduct } from '@/hooks/useProducts';
import { useVersions, useCreateVersion, useUpdateVersion, useDeleteVersion } from '@/hooks/useVersions';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/utils/format';
import type { Version, CreateVersionPayload } from '@/types/version';

const versionStatusColors: Record<string, string> = {
  ACTIVE: 'text-emerald-400 bg-emerald-950/40 border-emerald-700/40',
  DRAFT: 'text-yellow-400 bg-yellow-950/40 border-yellow-700/40',
  DEPRECATED: 'text-gray-400 bg-gray-800/40 border-gray-700/40',
};

export default function ProductDetail() {
  const { id: productId = '' } = useParams<{ id: string }>();
  const { data: product, isLoading: productLoading } = useProduct(productId);
  const { data: versions, isLoading: versionsLoading } = useVersions(productId);
  const createVersion = useCreateVersion();
  const updateVersion = useUpdateVersion();
  const deleteVersion = useDeleteVersion();
  const { toast } = useToast();
  const { isAdmin, isSecurityTeam } = useAuth();

  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Version | null>(null);
  const [deleting, setDeleting] = useState<Version | null>(null);

  const canManage = isAdmin || isSecurityTeam;

  const handleCreate = async (data: CreateVersionPayload) => {
    try {
      await createVersion.mutateAsync(data);
      toast({ variant: 'success', title: 'Version created' });
      setShowCreate(false);
    } catch {
      toast({ variant: 'error', title: 'Failed to create version' });
    }
  };

  const handleUpdate = async (data: CreateVersionPayload) => {
    if (!editing) return;
    try {
      await updateVersion.mutateAsync({ ...data, id: editing.id, productId });
      toast({ variant: 'success', title: 'Version updated' });
      setEditing(null);
    } catch {
      toast({ variant: 'error', title: 'Failed to update version' });
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteVersion.mutateAsync({ productId, versionId: deleting.id });
      toast({ variant: 'success', title: 'Version deleted' });
      setDeleting(null);
    } catch {
      toast({ variant: 'error', title: 'Failed to delete version' });
    }
  };

  const columns: Column<Version>[] = [
    {
      key: 'version',
      header: 'Version',
      sortable: true,
      render: (v) => <span className="font-mono font-medium text-white">{v.version}</span>,
    },
    { key: 'description', header: 'Description', render: (v) => v.description ?? '—' },
    {
      key: 'status',
      header: 'Status',
      render: (v) => (
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${versionStatusColors[v.status]}`}>
          {v.status}
        </span>
      ),
    },
    { key: 'createdAt', header: 'Created', sortable: true, render: (v) => formatDate(v.createdAt) },
    {
      key: 'actions',
      header: '',
      render: (v) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/scan-jobs?productId=${productId}&versionId=${v.id}`}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            Scan Jobs →
          </Link>
          {canManage && (
            <>
              <button onClick={() => setEditing(v)} className="text-gray-500 hover:text-blue-400">
                <PencilIcon className="h-4 w-4" />
              </button>
              <button onClick={() => setDeleting(v)} className="text-gray-500 hover:text-red-400">
                <TrashIcon className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  if (productLoading) {
    return (
      <PageContainer title="Product">
        <div className="flex justify-center py-12 text-gray-500">Loading…</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={product?.name ?? 'Product Detail'}
      description={product?.description}
      action={
        canManage && (
          <Button leftIcon={<PlusIcon className="h-4 w-4" />} onClick={() => setShowCreate(true)}>
            Add Version
          </Button>
        )
      }
    >
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
        <Link to="/products" className="hover:text-gray-300">Products</Link>
        <ChevronRightIcon className="h-3.5 w-3.5" />
        <span className="text-gray-300">{product?.name}</span>
      </nav>

      {/* Product info */}
      {product && (
        <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg border border-gray-800 bg-gray-900 p-5 sm:grid-cols-4">
          <div>
            <p className="text-xs text-gray-500">Slug</p>
            <p className="mt-0.5 font-mono text-sm text-gray-300">{product.slug}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Business Unit</p>
            <p className="mt-0.5 text-sm text-gray-300">{product.bu}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Owner</p>
            <p className="mt-0.5 text-sm text-gray-300">{product.owner}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Last Updated</p>
            <p className="mt-0.5 text-sm text-gray-300">{formatDate(product.updatedAt)}</p>
          </div>
        </div>
      )}

      <h3 className="mb-3 text-sm font-semibold text-gray-300">Versions</h3>
      {versionsLoading ? (
        <div className="py-8 text-center text-gray-500">Loading versions…</div>
      ) : (
        <DataTable data={versions ?? []} columns={columns} emptyMessage="No versions yet." />
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add Version">
        <VersionForm
          productId={productId}
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
          loading={createVersion.isPending}
        />
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit Version">
        <VersionForm
          productId={productId}
          defaultValues={editing ?? undefined}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(null)}
          loading={updateVersion.isPending}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title={`Delete version "${deleting?.version}"?`}
        description="All scan jobs and reports for this version will be affected."
        loading={deleteVersion.isPending}
      />
    </PageContainer>
  );
}
