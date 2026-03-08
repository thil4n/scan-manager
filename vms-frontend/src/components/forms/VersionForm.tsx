import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Version, CreateVersionPayload } from '@/types/version';
import Button from '@/components/ui/Button';

interface VersionFormProps {
  productId: string;
  defaultValues?: Partial<Version>;
  onSubmit: (data: CreateVersionPayload) => void;
  onCancel: () => void;
  loading?: boolean;
}

const inputClass =
  'w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';
const labelClass = 'mb-1 block text-xs font-medium text-gray-400';
const errorClass = 'mt-1 text-xs text-red-400';

export default function VersionForm({ productId, defaultValues, onSubmit, onCancel, loading }: VersionFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateVersionPayload>({
    defaultValues: { ...defaultValues, productId },
  });

  useEffect(() => {
    if (defaultValues) reset({ ...defaultValues, productId });
  }, [defaultValues, productId, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register('productId')} value={productId} />
      <div>
        <label className={labelClass}>Version *</label>
        <input
          {...register('version', {
            required: 'Version is required',
            pattern: { value: /^\d+\.\d+(\.\d+)?(-.*)?$/, message: 'e.g. 1.0.0 or 2.1.0-beta' },
          })}
          className={inputClass}
          placeholder="e.g. 1.0.0"
        />
        {errors.version && <p className={errorClass}>{errors.version.message}</p>}
      </div>
      <div>
        <label className={labelClass}>Description</label>
        <textarea
          {...register('description')}
          className={`${inputClass} resize-none`}
          rows={3}
          placeholder="What changed in this version..."
        />
      </div>
      <div>
        <label className={labelClass}>Status</label>
        <select {...register('status')} className={inputClass}>
          <option value="DRAFT">Draft</option>
          <option value="ACTIVE">Active</option>
          <option value="DEPRECATED">Deprecated</option>
        </select>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {defaultValues?.version ? 'Save Changes' : 'Create Version'}
        </Button>
      </div>
    </form>
  );
}
