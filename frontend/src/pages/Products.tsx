import { useState, useMemo } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import DataTable from '@/components/table/DataTable';
import type { Column } from '@/components/table/DataTable';
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '@/hooks/useProducts';
import { formatDate } from '@/utils/format';
import type { Product, CreateProductPayload } from '@/types/product';
import {
  PlusCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Products() {
  const { data: products, isLoading, isError } = useProducts();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!search) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.bu.toLowerCase().includes(q) ||
        p.owner.toLowerCase().includes(q),
    );
  }, [products, search]);

  const openCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const columns: Column<Product>[] = [
    {
      key: 'name',
      header: 'Product',
      sortable: true,
      render: (p) => (
        <div>
          <span className="font-medium text-white">{p.name}</span>
          <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">{p.description}</p>
        </div>
      ),
    },
    {
      key: 'slug',
      header: 'Slug',
      render: (p) => (
        <span className="font-mono text-xs text-gray-400">{p.slug}</span>
      ),
    },
    {
      key: 'bu',
      header: 'Business Unit',
      sortable: true,
      render: (p) => p.bu,
    },
    {
      key: 'owner',
      header: 'Owner',
      render: (p) => p.owner,
    },
    {
      key: 'updatedAt',
      header: 'Last Updated',
      sortable: true,
      render: (p) => formatDate(p.updatedAt),
    },
    {
      key: 'actions',
      header: '',
      render: (p) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openEdit(p)}
            className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-800 hover:text-blue-400"
            title="Edit"
          >
            <PencilSquareIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(p)}
            className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-800 hover:text-red-400"
            title="Delete"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  // Loading
  if (isLoading) {
    return (
      <PageContainer title="Products">
        <div className="flex items-center justify-center py-20">
          <ArrowPathIcon className="h-6 w-6 animate-spin text-gray-500" />
          <span className="ml-2 text-sm text-gray-500">Loading products…</span>
        </div>
      </PageContainer>
    );
  }

  // Error
  if (isError) {
    return (
      <PageContainer title="Products">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
          <p className="mt-2 text-sm text-gray-400">Failed to load products.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Products"
      description="Manage products registered for security scanning"
      action={
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <PlusCircleIcon className="h-4 w-4" />
          Add Product
        </button>
      }
    >
      {/* Search */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, slug, BU, or owner…"
            className="w-full rounded-md border border-gray-700 bg-gray-800 py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredProducts}
        keyExtractor={(p) => p.id}
        emptyMessage="No products found."
      />

      {/* Create / Edit Modal */}
      {modalOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={closeModal}
        />
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <DeleteConfirmModal
          product={deleteTarget}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </PageContainer>
  );
}

// ---------------------------------------------------------------------------
// Product Form Modal (Create / Edit)
// ---------------------------------------------------------------------------

function ProductFormModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const isEdit = !!product;
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const [name, setName] = useState(product?.name ?? '');
  const [slug, setSlug] = useState(product?.slug ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [owner, setOwner] = useState(product?.owner ?? '');
  const [bu, setBu] = useState(product?.bu ?? '');

  const isPending = createMutation.isPending || updateMutation.isPending;
  const isFormValid = name.trim() && slug.trim() && owner.trim() && bu.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const payload: CreateProductPayload = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      owner: owner.trim(),
      bu: bu.trim(),
    };

    if (isEdit && product) {
      updateMutation.mutate(
        { ...payload, id: product.id },
        { onSuccess: onClose },
      );
    } else {
      createMutation.mutate(payload, { onSuccess: onClose });
    }
  };

  const inputClass =
    'w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <ModalBackdrop onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            {isEdit ? 'Edit Product' : 'New Product'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:text-white"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs text-gray-400">Product Name *</label>
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Identity Server"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Slug *</label>
            <input
              className={inputClass}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. identity-server"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-gray-400">Description</label>
          <textarea
            className={`${inputClass} resize-none`}
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief product description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs text-gray-400">Owner *</label>
            <input
              className={inputClass}
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="owner@acme.io"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Business Unit *</label>
            <input
              className={inputClass}
              value={bu}
              onChange={(e) => setBu(e.target.value)}
              placeholder="e.g. IAM Engineering"
              required
            />
          </div>
        </div>

        {(createMutation.isError || updateMutation.isError) && (
          <p className="text-sm text-red-500">
            Something went wrong. Please try again.
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending || !isFormValid}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending
              ? 'Saving…'
              : isEdit
                ? 'Update Product'
                : 'Create Product'}
          </button>
        </div>
      </form>
    </ModalBackdrop>
  );
}

// ---------------------------------------------------------------------------
// Delete Confirm Modal
// ---------------------------------------------------------------------------

function DeleteConfirmModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const deleteMutation = useDeleteProduct();

  const handleDelete = () => {
    deleteMutation.mutate(product.id, { onSuccess: onClose });
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/15">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Delete Product</h3>
            <p className="text-sm text-gray-400">This action cannot be undone.</p>
          </div>
        </div>

        <p className="text-sm text-gray-300">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-white">{product.name}</span>? All
          associated release history will remain but the product will no longer be
          available for new submissions.
        </p>

        {deleteMutation.isError && (
          <p className="text-sm text-red-500">Failed to delete. Please try again.</p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// ---------------------------------------------------------------------------
// Shared Modal Backdrop
// ---------------------------------------------------------------------------

function ModalBackdrop({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
        }}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
      />
      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl">
        {children}
      </div>
    </div>
  );
}
