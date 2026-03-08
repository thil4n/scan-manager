import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import PageContainer from '@/components/layout/PageContainer';
import DataTable from '@/components/table/DataTable';
import type { Column } from '@/components/table/DataTable';
import Button from '@/components/ui/Button';
import Modal from '@/components/modals/Modal';
import ConfirmDialog from '@/components/modals/ConfirmDialog';
import ProductForm from '@/components/forms/ProductForm';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/utils/format';
import type { Product, CreateProductPayload } from '@/types/product';

export default function Products() {
  const { data: products, isLoading, isError } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const { toast } = useToast();
  const { isAdmin, isSecurityTeam } = useAuth();

  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);

  const canManage = isAdmin || isSecurityTeam;

  const handleCreate = async (data: CreateProductPayload) => {
    try {
      await createProduct.mutateAsync(data);
      toast({ variant: 'success', title: 'Product created successfully' });
      setShowCreate(false);
    } catch {
      toast({ variant: 'error', title: 'Failed to create product' });
    }
  };

  const handleUpdate = async (data: CreateProductPayload) => {
    if (!editing) return;
    try {
      await updateProduct.mutateAsync({ ...data, id: editing.id });
      toast({ variant: 'success', title: 'Product updated successfully' });
      setEditing(null);
    } catch {
      toast({ variant: 'error', title: 'Failed to update product' });
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteProduct.mutateAsync(deleting.id);
      toast({ variant: 'success', title: 'Product deleted' });
      setDeleting(null);
    } catch {
      toast({ variant: 'error', title: 'Failed to delete product' });
    }
  };

  const columns: Column<Product>[] = [
    {
      key: 'name',
      header: 'Product',
      sortable: true,
      render: (p) => (
        <Link to={`/products/${p.id}`} className="font-medium text-white hover:text-blue-400">
          {p.name}
        </Link>
      ),
    },
    { key: 'slug', header: 'Slug', render: (p) => <code className="text-xs text-gray-400">{p.slug}</code> },
    { key: 'bu', header: 'Business Unit', render: (p) => p.bu },
    { key: 'owner', header: 'Owner', render: (p) => p.owner },
    {
      key: 'updatedAt',
      header: 'Last Updated',
      sortable: true,
      render: (p) => formatDate(p.updatedAt),
    },
    ...(canManage
      ? [
          {
            key: 'actions',
            header: '',
            render: (p: Product) => (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditing(p)}
                  className="text-gray-500 hover:text-blue-400 transition-colors"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleting(p)}
                  className="text-gray-500 hover:text-red-400 transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <PageContainer
      title="Products"
      description="Manage software products tracked in the VMS"
      action={
        canManage && (
          <Button
            leftIcon={<PlusIcon className="h-4 w-4" />}
            onClick={() => setShowCreate(true)}
          >
            Add Product
          </Button>
        )
      }
    >
      {isLoading && (
        <div className="flex justify-center py-12 text-gray-500">Loading products…</div>
      )}
      {isError && (
        <div className="rounded-lg border border-red-900/50 bg-red-950/20 p-4 text-sm text-red-400">
          Failed to load products. Please refresh.
        </div>
      )}
      {!isLoading && !isError && (
        <DataTable
          data={products ?? []}
          columns={columns}
          emptyMessage="No products found."
        />
      )}

      {/* Create modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add Product">
        <ProductForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
          loading={createProduct.isPending}
        />
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit Product">
        <ProductForm
          defaultValues={editing ?? undefined}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(null)}
          loading={updateProduct.isPending}
        />
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title={`Delete "${deleting?.name}"?`}
        description="This will remove the product and all associated versions. This action cannot be undone."
        loading={deleteProduct.isPending}
      />
    </PageContainer>
  );
}
