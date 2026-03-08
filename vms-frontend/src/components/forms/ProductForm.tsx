import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Product, CreateProductPayload } from '@/types/product';
import Button from '@/components/ui/Button';

interface ProductFormProps {
  defaultValues?: Partial<Product>;
  onSubmit: (data: CreateProductPayload) => void;
  onCancel: () => void;
  loading?: boolean;
}

const inputClass =
  'w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';
const labelClass = 'mb-1 block text-xs font-medium text-gray-400';
const errorClass = 'mt-1 text-xs text-red-400';

export default function ProductForm({ defaultValues, onSubmit, onCancel, loading }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProductPayload>({ defaultValues });

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className={labelClass}>Product Name *</label>
        <input
          {...register('name', { required: 'Name is required' })}
          className={inputClass}
          placeholder="e.g. Identity Server"
        />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>
      <div>
        <label className={labelClass}>Slug *</label>
        <input
          {...register('slug', {
            required: 'Slug is required',
            pattern: { value: /^[a-z0-9-]+$/, message: 'Lowercase letters, numbers, and hyphens only' },
          })}
          className={inputClass}
          placeholder="e.g. identity-server"
        />
        {errors.slug && <p className={errorClass}>{errors.slug.message}</p>}
      </div>
      <div>
        <label className={labelClass}>Description</label>
        <textarea
          {...register('description')}
          className={`${inputClass} resize-none`}
          rows={3}
          placeholder="Short product description..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Owner Email *</label>
          <input
            {...register('owner', { required: 'Owner is required' })}
            className={inputClass}
            placeholder="owner@acme.io"
          />
          {errors.owner && <p className={errorClass}>{errors.owner.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Business Unit *</label>
          <input
            {...register('bu', { required: 'BU is required' })}
            className={inputClass}
            placeholder="e.g. IAM Engineering"
          />
          {errors.bu && <p className={errorClass}>{errors.bu.message}</p>}
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {defaultValues?.name ? 'Save Changes' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}
